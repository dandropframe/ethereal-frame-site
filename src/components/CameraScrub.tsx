import { useEffect, useRef } from "react";

type Props = {
  src: string;            // desktop all-intra mp4 URL
  mobileSrc?: string;     // lighter all-intra mp4 for phones
  fps?: number;           // source frame rate
  frames?: number;        // total frames in the clip
  sensitivity?: number;   // fraction of the clip a full-width drag covers
  start?: number;         // 0..1 starting position
  idleSeconds?: number;   // one-way duration of the idle drift
};

export default function CameraScrub({
  src, mobileSrc, fps = 24, frames = 84, sensitivity = 1.15, start = 0.5, idleSeconds = 7,
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
    let target = start, pos = start, drag = false, used = false, lx = 0, ready = 0, raf = 0;
    const t0 = performance.now();
    const seen = new WeakMap<HTMLVideoElement, number>();
    const clamp = (v: number) => Math.max(0, Math.min(1, v));

    const seek = (v: HTMLVideoElement, i: number) => {
      if (seen.get(v) !== i && !v.seeking) { v.currentTime = (i + 0.5) / fps; seen.set(v, i); }
    };
    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      if (!used && !reduce) { let p = (t / idleSeconds) % 2; p = p < 1 ? p : 2 - p; target = p * p * (3 - 2 * p); }
      pos += (target - pos) * 0.12;
      const f = pos * (frames - 1), i = Math.floor(f), k = f - i, j = Math.min(i + 1, frames - 1);
      seek(va, i); seek(vb, j); vb.style.opacity = String(j === i ? 0 : k);
      raf = requestAnimationFrame(frame);
    };
    const onLoaded = () => { if (++ready === 2) { h.textContent = "Drag"; raf = requestAnimationFrame(frame); } };
    [va, vb].forEach((v) => { v.addEventListener("loadeddata", onLoaded); v.src = url; v.load(); });

    const down = (e: PointerEvent) => { drag = used = true; lx = e.clientX; st.setPointerCapture(e.pointerId); h.style.opacity = "0"; };
    const move = (e: PointerEvent) => { if (!drag) return; target = clamp(target + ((e.clientX - lx) / innerWidth) * sensitivity); lx = e.clientX; };
    const up = () => { drag = false; };
    st.addEventListener("pointerdown", down); st.addEventListener("pointermove", move);
    st.addEventListener("pointerup", up); st.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      st.removeEventListener("pointerdown", down); st.removeEventListener("pointermove", move);
      st.removeEventListener("pointerup", up); st.removeEventListener("pointercancel", up);
      [va, vb].forEach((v) => { v.removeEventListener("loadeddata", onLoaded); v.removeAttribute("src"); v.load(); });
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
