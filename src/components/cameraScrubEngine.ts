// Framework-free engine: the camera drifts very slowly back and forth; drag to move it, let go and it carries on from there.
export type Options = { sensitivity?: number; idleSeconds?: number; start?: number; sign?: number };

export async function fetchPack(url: string, onProgress: (p: number) => void, signal: AbortSignal): Promise<ArrayBuffer> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const total = Number(res.headers.get("content-length")) || 0;
  if (!res.body) return res.arrayBuffer();
  const rd = res.body.getReader(), chunks: Uint8Array[] = [];
  let got = 0;
  for (;;) {
    const { done, value } = await rd.read();
    if (done) break;
    chunks.push(value); got += value.length;
    if (total) onProgress(Math.min(1, got / total));
  }
  const out = new Uint8Array(got); let o = 0;
  for (const c of chunks) { out.set(c, o); o += c.length; }
  return out.buffer;
}

function parse(buf: ArrayBuffer) {
  const dv = new DataView(buf), n = dv.getUint32(0, true), fps = dv.getUint32(4, true) / 1000;
  const blobs: Blob[] = []; let off = 16 + n * 4;
  for (let i = 0; i < n; i++) {
    const len = dv.getUint32(16 + i * 4, true);
    blobs.push(new Blob([new Uint8Array(buf, off, len)], { type: "image/webp" })); off += len;
  }
  return { n, fps, blobs };
}

function el(tag: string, css: string, parent: HTMLElement) {
  const e = document.createElement(tag); e.style.cssText = css; parent.appendChild(e); return e;
}

export function mountCameraScrub(root: HTMLElement, getPack: (p: (x: number) => void, s: AbortSignal) => Promise<ArrayBuffer>, o: Options = {}): () => void {
  const sens = o.sensitivity ?? 1.15, idle = o.idleSeconds ?? 30, sign = o.sign ?? 1;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  root.style.cssText += ";position:fixed;inset:0;overflow:hidden;background:#0b0b0b;touch-action:none;cursor:grab;user-select:none";
  const mono = "font:400 11px/1 ui-monospace,Menlo,monospace;letter-spacing:.24em;color:#f2f2f0;";
  const cv = el("canvas", "position:absolute;inset:0;width:100%;height:100%;display:block", root) as HTMLCanvasElement;
  const ctx = cv.getContext("2d")!;
  const loader = el("div", "position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;transition:opacity .6s;pointer-events:none", root);
  const pct = el("div", mono + "text-transform:uppercase;font-variant-numeric:tabular-nums", loader); pct.textContent = "0%";
  const track = el("div", "width:160px;height:1px;background:rgba(242,242,240,.2)", loader);
  const fill = el("div", "height:100%;width:0;background:#f2f2f0", track);
  const hint = el("div", mono + "position:absolute;left:0;right:0;bottom:calc(28px + env(safe-area-inset-bottom,0px));text-align:center;text-transform:uppercase;opacity:0;transition:opacity .8s;pointer-events:none", root);
  hint.textContent = "Drag";
  const setPct = (p: number) => { const v = Math.round(p * 100); pct.textContent = v + "%"; fill.style.width = v + "%"; };

  const ac = new AbortController();
  const cache = new Map<number, ImageBitmap>(), pending = new Map<number, Promise<void>>();
  let blobs: Blob[] = [], n = 0, fps = 24, dead = false, raf = 0;
  let pos = 0, tgt = 0, dir = 1, dragging = false, last = 0, lx = 0;
  const BACK = 3, AHEAD = 12;

  const decode = (i: number): Promise<void> => {
    if (cache.has(i)) return Promise.resolve();
    const ex = pending.get(i); if (ex) return ex;
    const p = createImageBitmap(blobs[i]).then((b) => { pending.delete(i); if (dead) b.close(); else cache.set(i, b); }).catch(() => { pending.delete(i); });
    pending.set(i, p); return p;
  };
  const refl = (x: number) => Math.max(0, Math.min(n - 1, x < 0 ? -x : x > n - 1 ? 2 * (n - 1) - x : x));
  const ensure = (c: number, d: number) => {              // keep a small window of decoded frames around the playhead
    const ks: number[] = []; for (let k = 0; k <= AHEAD; k++) ks.push(k); for (let k = 1; k <= BACK; k++) ks.push(-k);
    const want = ks.map((k) => Math.round(refl(c + d * k))), keep = new Set(want);
    cache.forEach((b, i) => { if (!keep.has(i)) { b.close(); cache.delete(i); } });
    for (const i of want) { if (pending.size >= 4) break; decode(i); }
  };
  const frameAt = (i: number) => {
    let b = cache.get(i);
    for (let k = 1; !b && k < n; k++) b = cache.get(i - k) || cache.get(i + k);   // nearest decoded frame as fallback: never blank
    return b;
  };
  const cover = (b: ImageBitmap) => {
    const s = Math.max(cv.width / b.width, cv.height / b.height), w = b.width * s, h = b.height * s;
    ctx.drawImage(b, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
  };

  const tick = (now: number) => {
    const dt = Math.min((now - (last || now)) / 1000, 0.05); last = now;
    if (!dragging && !reduce) {                            // very slow drift that carries on after you let go
      const z = 0.12 * (n - 1), r = dir > 0 ? n - 1 - tgt : tgt, e = Math.min(1, r / z), m = r < z ? 0.15 + 0.85 * e * e * (3 - 2 * e) : 1;   // ease into each end
      tgt += (dir * m * dt * (n - 1)) / idle;
      if (tgt >= n - 1) { tgt = n - 1; dir = -1; } else if (tgt <= 0) { tgt = 0; dir = 1; }
    }
    pos += (tgt - pos) * (1 - Math.exp(-dt / 0.13));       // the camera eases towards the target, so it feels weighted
    const p = Math.max(0, Math.min(n - 1, pos)), i = Math.floor(p), k = p - i;
    ensure(Math.round(p), dir);
    const d = Math.min(devicePixelRatio || 1, 2), w = Math.round(root.clientWidth * d), h = Math.round(root.clientHeight * d);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const a = frameAt(i), b = frameAt(Math.min(i + 1, n - 1));
    if (a) { ctx.globalAlpha = 1; cover(a); if (b && b !== a && k > 0.003) { ctx.globalAlpha = k; cover(b); } ctx.globalAlpha = 1; }
    raf = requestAnimationFrame(tick);
  };

  const down = (e: PointerEvent) => { dragging = true; lx = e.clientX; root.setPointerCapture(e.pointerId); root.style.cursor = "grabbing"; hint.style.opacity = "0"; };
  const move = (e: PointerEvent) => {
    if (!dragging) return;
    const dx = ((e.clientX - lx) / innerWidth) * sens * sign * (n - 1); lx = e.clientX;
    if (dx) dir = dx > 0 ? 1 : -1;
    tgt = Math.max(0, Math.min(n - 1, tgt + dx));
  };
  const up = () => { if (!dragging) return; dragging = false; root.style.cursor = "grab"; };
  root.addEventListener("pointerdown", down); root.addEventListener("pointermove", move);
  root.addEventListener("pointerup", up); root.addEventListener("pointercancel", up);

  (async () => {
    try {
      const pack = parse(await getPack(setPct, ac.signal));
      if (dead) return;
      blobs = pack.blobs; n = pack.n; fps = pack.fps; setPct(1);
      tgt = pos = (o.start ?? 0.5) * (n - 1);
      await Promise.all([decode(Math.floor(pos)), decode(Math.min(Math.floor(pos) + 1, n - 1))]);
      if (dead) return;
      loader.style.opacity = "0"; hint.style.opacity = ".7";
      raf = requestAnimationFrame(tick);
    } catch { if (!ac.signal.aborted) { pct.textContent = "Could not load"; } }
  })();

  return () => {
    dead = true; ac.abort(); cancelAnimationFrame(raf);
    root.removeEventListener("pointerdown", down); root.removeEventListener("pointermove", move);
    root.removeEventListener("pointerup", up); root.removeEventListener("pointercancel", up);
    cache.forEach((b) => b.close()); cache.clear(); root.replaceChildren();
  };
}
