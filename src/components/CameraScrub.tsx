import { useEffect, useRef } from "react";

type Props = {
  src: string;            // desktop all-intra mp4 URL
  mobileSrc?: string;     // lighter all-intra mp4 for phones
  fps?: number;           // source frame rate
  frames?: number;        // total frames in the clip
  sensitivity?: number;   // fraction of the clip a full-width drag covers
  start?: number;         // 0..1 starting position
  idleSeconds?: number;   // seconds to cross the whole clip while drifting (higher = slower)
};

// Download the whole clip first so every seek is local (no network range requests mid-scrub).
async function fetchBlobUrl(url: string, onProgress: (p: number) => void, signal: AbortSignal) {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Video request failed: " + res.status);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body) return URL.createObjectURL(await res.blob());
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    got += value.length;
    if (total) onProgress(got / total);
  }
  return URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
}

export default function CameraScrub({
  src, mobileSrc, fps = 24, frames = 84, sensitivity = 1.15, start = 0.5, idleSeconds = 10,
}: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = stage.current!, va = a.current!, vb = b.current!, h = hint.current!;
    const small = matchMedia("(pointer:coarse)").matches || innerWidth < 900;
    const url = small && mobileSrc ? mobileSrc : src;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DRIFT = 1 / idleSeconds;                 // clip-lengths per second while drifting
    let target = start, pos = start, v = reduce ? 0 : DRIFT, dir = 1;
    let drag = false, lx = 0, lt = 0, last = 0, ready = 0, raf = 0;
    const seen = new WeakMap<HTMLVideoElement, number>();
    const clamp = (x: number) => Math.max(0, Math.min(1, x));

    const seek = (vid: HTMLVideoElement, i: number) => {
      if (seen.get(vid) !== i && !vid.seeking) { vid.currentTime = (i + 0.5) / fps; seen.set(vid, i); }
    };
    const frame = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05); last = now;
      if (!drag && !reduce) {
        // after a drag the camera keeps its momentum, then settles into a slow drift in that direction
        v += (dir * DRIFT - v) * (1 - Math.exp(-dt / 1.2));
        if (Math.abs(v) > DRIFT * 0.3) dir = v > 0 ? 1 : -1;
        const r = v > 0 ? 1 - target : target;                 // distance to the end we're heading for
        const e = Math.min(1, r / 0.1), m = r < 0.1 ? 0.2 + 0.8 * e * e * (3 - 2 * e) : 1;   // ease into the ends
        target += v * m * dt;
        if (target >= 1) { target = 1; dir = -1; v = -Math.abs(v) * 0.5; }
        else if (target <= 0) { target = 0; dir = 1; v = Math.abs(v) * 0.5; }
      }
      pos += (target - pos) * 0.12;
      const f = pos * (frames - 1), i = Math.floor(f), k = f - i, j = Math.min(i + 1, frames - 1);
      seek(va, i); seek(vb, j);
      if (!va.seeking && !vb.seeking) vb.style.opacity = String(j === i ? 0 : k);
      raf = requestAnimationFrame(frame);
    };

    let blobUrl = "";
    const ac = new AbortController();
    const onLoaded = () => { if (++ready === 2) { h.textContent = "Drag"; raf = requestAnimationFrame(frame); } };
    [va, vb].forEach((vid) => vid.addEventListener("loadeddata", onLoaded));
    fetchBlobUrl(url, (p) => { h.textContent = "Loading " + Math.round(p * 100) + "%"; }, ac.signal)
      .then((u) => { blobUrl = u; [va, vb].forEach((vid) => { vid.src = u; vid.load(); }); })
      .catch(() => { if (!ac.signal.aborted) h.textContent = "Could not load video"; });

    const down = (e: PointerEvent) => { drag = true; v = 0; lx = e.clientX; lt = e.timeStamp; st.setPointerCapture(e.pointerId); h.style.opacity = "0"; };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = ((e.clientX - lx) / innerWidth) * sensitivity;
      const dts = Math.max((e.timeStamp - lt) / 1000, 0.008);
      target = clamp(target + dx);
      v = v * 0.6 + (dx / dts) * 0.4;                         // smoothed release velocity
      lx = e.clientX; lt = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (!drag) return;
      drag = false;
      if (e.timeStamp - lt > 100) v = 0;                      // held still before letting go: no fling
      v = Math.max(-1.5, Math.min(1.5, v));
      if (Math.abs(v) > DRIFT * 0.3) dir = v > 0 ? 1 : -1;
    };
    st.addEventListener("pointerdown", down); st.addEventListener("pointermove", move);
    st.addEventListener("pointerup", up); st.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf); ac.abort();
      st.removeEventListener("pointerdown", down); st.removeEventListener("pointermove", move);
      st.removeEventListener("pointerup", up); st.removeEventListener("pointercancel", up);
      [va, vb].forEach((vid) => { vid.removeEventListener("loadeddata", onLoaded); vid.removeAttribute("src"); vid.load(); });
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [src, mobileSrc, fps, frames, sensitivity, start, idleSeconds]);

  const vid: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" };
  return (
    <div ref={stage} style={{ position: "fixed", inset: 0, touchAction: "none", cursor: "grab", background: "#0b0b0b" }}>
      <video ref={a} muted playsInline preload="auto" style={vid} />
      <video ref={b} muted playsInline preload="auto" style={{ ...vid, opacity: 0 }} />
      <div ref={hint} style={{ position: "fixed", left: 0, right: 0, bottom: 28, textAlign: "center", font: "400 10px/1 ui-monospace,Menlo,monospace", letterSpacing: ".24em", textTransform: "uppercase", color: "#f2f2f0", opacity: 0.7, pointerEvents: "none", transition: "opacity .8s" }}>Loading</div>
    </div>
  );
}
