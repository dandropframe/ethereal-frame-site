// Framework-free engine: the camera drifts very slowly back and forth; drag to move it, let go and it carries on from there.
export type Options = { sensitivity?: number; idleSeconds?: number; start?: number; sign?: number; maxSpeed?: number; hero?: string | Element | null };

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
  if (buf.byteLength < 20) throw new Error("file is empty or too small");
  const dv = new DataView(buf), n = dv.getUint32(0, true), fps = dv.getUint32(4, true) / 1000;
  if (n < 1 || n > 5000 || 16 + n * 4 > buf.byteLength) throw new Error("not a frame pack (wrong path, or the server returned a web page)");
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
  root.style.cssText += ";position:fixed;inset:0;overflow:hidden;background:#0b0b0b;touch-action:pan-y pinch-zoom;cursor:grab;user-select:none";
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
  type Src = ImageBitmap | HTMLCanvasElement;
  const cache = new Map<number, ImageBitmap>(), pending = new Map<number, Promise<void>>();
  const proxy = new Map<number, HTMLCanvasElement>();   // small copy of every frame: shown instantly while the sharp one is still decoding
  let blobs: Blob[] = [], n = 0, fps = 24, dead = false, raf = 0;
  let pos = 0, tgt = 0, dir = 1, dragging = false, last = 0, lx = 0, pid = -1, moved = 0, suppress = false;
  const BACK = 2;
  let decodeMs = 30;                                       // running average of how long one frame takes to decode on this device
  // fastest the camera may travel (frames/s): about half of what the decoder can sustain, so sharp frames are always ready in time
  const cap = () => o.maxSpeed ?? Math.max(18, Math.min(80, (0.5 * 4000) / decodeMs));

  const decode = (i: number): Promise<void> => {
    if (cache.has(i)) return Promise.resolve();
    const ex = pending.get(i); if (ex) return ex;
    const t0 = performance.now();
    const p = createImageBitmap(blobs[i]).then((b) => { decodeMs = decodeMs * 0.85 + (performance.now() - t0) * 0.15; pending.delete(i); if (dead) b.close(); else cache.set(i, b); }).catch(() => { pending.delete(i); });
    pending.set(i, p); return p;
  };
  const refl = (x: number) => Math.max(0, Math.min(n - 1, x < 0 ? -x : x > n - 1 ? 2 * (n - 1) - x : x));
  const buildProxies = () => {                             // runs quietly after load: a 720px copy of every frame, nearest the playhead first
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => Math.abs(a - pos) - Math.abs(b - pos));
    let k = 0;
    const worker = async () => {
      while (k < order.length && !dead) {
        const i = order[k++];
        try {
          const b = await createImageBitmap(blobs[i]);
          if (dead) { b.close(); return; }
          const c = document.createElement("canvas"); c.width = 720; c.height = Math.max(1, Math.round((720 * b.height) / b.width));
          const g = c.getContext("2d")!; g.imageSmoothingQuality = "high"; g.drawImage(b, 0, 0, c.width, c.height);
          b.close(); proxy.set(i, c);
        } catch { /* skip this frame */ }
      }
    };
    worker(); worker();
  };
  const ensure = (c: number, d: number, t: number) => {    // decode order: where the camera is heading first, then a window around the playhead
    const want: number[] = [], add = (x: number) => { const i = Math.max(0, Math.min(n - 1, Math.round(x))); if (want.indexOf(i) < 0) want.push(i); };
    const ahead = Math.max(6, Math.min(12, Math.ceil(cap() * 0.25)));
    for (let k = 0; k <= ahead; k++) add(refl(c + d * k));
    for (let k = 1; k <= BACK; k++) add(refl(c - d * k));
    for (let k = 0; k <= 3; k++) { add(t + k); if (k) add(t - k); }
    const keep = new Set(want);
    cache.forEach((b, i) => { if (!keep.has(i)) { b.close(); cache.delete(i); } });
    for (const i of want) { if (pending.size >= 4) break; decode(i); }
  };
  const get = (i: number): Src | undefined => cache.get(i) || proxy.get(i);
  const frameAt = (i: number) => {
    let b = get(i);
    for (let k = 1; !b && k < n; k++) b = get(i - k) || get(i + k);   // nearest available frame (sharp or small): never blank, never stale
    return b;
  };
  const cover = (b: Src) => {
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
    const want = (tgt - pos) * (1 - Math.exp(-dt / 0.13)), lim = cap() * dt;   // the camera eases towards the target, but never faster than the cap
    pos += Math.max(-lim, Math.min(lim, want));
    const p = Math.max(0, Math.min(n - 1, pos)), i = Math.floor(p), k = p - i;
    ensure(Math.round(p), dir, tgt);
    const d = Math.min(devicePixelRatio || 1, 2), w = Math.round(root.clientWidth * d), h = Math.round(root.clientHeight * d);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    const a = frameAt(i), b = frameAt(Math.min(i + 1, n - 1));
    if (a) { ctx.globalAlpha = 1; cover(a); if (b && b !== a && k > 0.003) { ctx.globalAlpha = k; cover(b); } ctx.globalAlpha = 1; }
    raf = requestAnimationFrame(tick);
  };

  const down = (e: PointerEvent) => {
    if (dragging || (e.pointerType === "mouse" && e.button !== 0)) return;
    if (!inHero(e.clientY)) return;                                                       // below the landing everything behaves normally
    if ((e.target as Element | null)?.closest?.("input,textarea,select,[data-no-scrub]")) return;
    dragging = true; pid = e.pointerId; lx = e.clientX; moved = 0; html.classList.add("cs-drag"); hint.style.opacity = "0"; document.body.style.userSelect = "none";
  };
  const move = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pid) return;
    moved += Math.abs(e.clientX - lx);
    const dx = ((e.clientX - lx) / innerWidth) * sens * sign * (n - 1); lx = e.clientX;
    if (dx) dir = dx > 0 ? 1 : -1;
    tgt = Math.max(0, Math.min(n - 1, tgt + dx));
    const gap = cap() * 0.25; tgt = Math.max(pos - gap, Math.min(pos + gap, tgt));   // the target can't run away from the camera: stop dragging and it stops within ~0.25s
  };
  const up = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pid) return;
    dragging = false; html.classList.remove("cs-drag"); document.body.style.userSelect = ""; hover(e);
    if (moved > 6) { suppress = true; setTimeout(() => { suppress = false; }, 80); }   // a drag that ends on a link must not also click it
  };
  const click = (e: MouseEvent) => { if (suppress) { e.preventDefault(); e.stopPropagation(); suppress = false; } };
  const dstart = (e: Event) => { if (dragging) e.preventDefault(); };                  // stop the browser's native link/image drag from cancelling ours
  const html = document.documentElement, styleEl = document.createElement("style");
  styleEl.textContent = "html.cs-hand{cursor:grab}html.cs-drag,html.cs-drag *{cursor:grabbing !important}";
  document.head.appendChild(styleEl);
  // Open hand only over the hero itself: not over links, buttons, images/logos/svg, or the actual glyphs of text.
  const overText = (t: Element, x: number, y: number) => {
    const r = document.createRange();
    for (const nd of Array.from(t.childNodes)) {
      if (nd.nodeType !== 3 || !nd.textContent || !nd.textContent.trim()) continue;
      r.selectNodeContents(nd);
      for (const q of Array.from(r.getClientRects())) if (x >= q.left - 2 && x <= q.right + 2 && y >= q.top - 2 && y <= q.bottom + 2) return true;
    }
    return false;
  };
  const isContent = (t: Element, x: number, y: number) => {
    if (t.closest("a,button,input,textarea,select,label,summary,[data-no-scrub]")) return true;
    if (t instanceof SVGElement || t instanceof HTMLImageElement || t instanceof HTMLVideoElement || t instanceof HTMLPictureElement) return true;
    return overText(t, x, y);
  };
  const heroEl = (): Element | null => { const h = o.hero; return !h ? null : typeof h === "string" ? document.querySelector(h) : h; };
  const heroBottom = () => { const el = heroEl(); return el ? el.getBoundingClientRect().bottom : innerHeight - scrollY; };   // bottom edge of the landing, in viewport pixels
  const inHero = (y: number) => { const el = heroEl(); if (el) { const r = el.getBoundingClientRect(); return y >= r.top && y <= r.bottom; } return y >= 0 && y <= innerHeight - scrollY; };
  let px = 0, py = 0;
  const hover = (e: PointerEvent) => {
    px = e.clientX; py = e.clientY;
    if (e.pointerType !== "mouse" || dragging) return;
    const t = e.target as Element | null;
    html.classList.toggle("cs-hand", !!t && inHero(e.clientY) && !isContent(t, e.clientX, e.clientY));
  };
  const leave = () => html.classList.remove("cs-hand");
  const prevTouch = html.style.touchAction, prevOver = html.style.overscrollBehavior;
  const syncPage = () => {                                                              // horizontal drags belong to us, vertical scrolling stays normal, and only while the landing is on screen
    const on = heroBottom() > 0;
    html.style.touchAction = on ? "pan-y pinch-zoom" : prevTouch; html.style.overscrollBehavior = on ? "none" : prevOver;
    if (html.classList.contains("cs-hand") && !inHero(py)) html.classList.remove("cs-hand");
  };
  syncPage(); window.addEventListener("scroll", syncPage, { passive: true }); window.addEventListener("resize", syncPage);
  // capture phase: we hear the pointer even if something above the camera (or a link covering the page) stops the event
  window.addEventListener("pointerdown", down, true); window.addEventListener("pointermove", move, true); window.addEventListener("pointermove", hover, true); html.addEventListener("pointerleave", leave);
  window.addEventListener("pointerup", up, true); window.addEventListener("pointercancel", up, true);
  window.addEventListener("click", click, true); window.addEventListener("dragstart", dstart, true);

  (async () => {
    try {
      const pack = parse(await getPack(setPct, ac.signal));
      if (dead) return;
      blobs = pack.blobs; n = pack.n; fps = pack.fps; setPct(1);
      tgt = pos = (o.start ?? 0.5) * (n - 1);
      await Promise.all([decode(Math.floor(pos)), decode(Math.min(Math.floor(pos) + 1, n - 1))]);
      if (dead) return;
      loader.style.opacity = "0"; hint.style.opacity = ".7";
      raf = requestAnimationFrame(tick); buildProxies();
    } catch (err) {
      if (ac.signal.aborted) return;
      console.error("CameraScrub:", err);
      pct.textContent = "Could not load";
      fill.style.width = "0";
      const why = el("div", mono + "font-size:10px;letter-spacing:.08em;opacity:.6;text-align:center;max-width:80vw;text-transform:none", loader);
      why.textContent = String(err instanceof Error ? err.message : err);
    }
  })();

  return () => {
    dead = true; ac.abort(); cancelAnimationFrame(raf);
    window.removeEventListener("pointerdown", down, true); window.removeEventListener("pointermove", move, true); window.removeEventListener("pointermove", hover, true); html.removeEventListener("pointerleave", leave); window.removeEventListener("scroll", syncPage); window.removeEventListener("resize", syncPage);
    window.removeEventListener("pointerup", up, true); window.removeEventListener("pointercancel", up, true);
    window.removeEventListener("click", click, true); window.removeEventListener("dragstart", dstart, true);
    html.classList.remove("cs-hand", "cs-drag"); styleEl.remove(); html.style.touchAction = prevTouch; html.style.overscrollBehavior = prevOver; document.body.style.userSelect = "";
    cache.forEach((b) => b.close()); cache.clear(); proxy.clear(); root.replaceChildren();
  };
}
