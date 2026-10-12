import { useEffect, useRef } from "react";

type Props = {
  src: string;
  mobileSrc?: string;
  sensitivity?: number;
  start?: number;
  idleSeconds?: number;
};

export default function CameraScrub({
  src,
  mobileSrc,
  sensitivity = 1.15,
  start = 0.5,
  idleSeconds = 10,
}: Props) {
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const st = stage.current;
    const vid = video.current;
    const h = hint.current;
    if (!st || !vid || !h) return;

    const isSmall = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 900;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const source = isSmall && mobileSrc ? mobileSrc : src;
    let drag = false;
    let lastX = 0;
    let lastTime = 0;
    let raf = 0;

    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const setProgress = (progress: number) => {
      if (Number.isFinite(vid.duration) && vid.duration > 0) {
        vid.currentTime = clamp(progress) * vid.duration;
      }
    };

    const animate = (now: number) => {
      if (!drag && !reduceMotion && !vid.paused && Number.isFinite(vid.duration)) {
        const driftRate = 1 / idleSeconds;
        const next =
          vid.currentTime / vid.duration +
          driftRate * Math.min((now - (lastTime || now)) / 1000, 0.05);
        if (next >= 1) vid.currentTime = 0;
      }
      lastTime = now;
      raf = requestAnimationFrame(animate);
    };

    const onLoaded = () => {
      setProgress(start);
      vid.play().catch(() => undefined);
      h.textContent = "Drag";
      raf = requestAnimationFrame(animate);
    };

    const onPointerDown = (event: PointerEvent) => {
      drag = true;
      lastX = event.clientX;
      lastTime = event.timeStamp;
      st.setPointerCapture(event.pointerId);
      vid.pause();
      st.style.cursor = "grabbing";
      h.style.opacity = "0";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || !Number.isFinite(vid.duration)) return;
      const delta = ((event.clientX - lastX) / st.clientWidth) * sensitivity;
      const elapsed = Math.max((event.timeStamp - lastTime) / 1000, 0.008);
      const progress = vid.currentTime / vid.duration;
      setProgress(progress + delta);
      lastX = event.clientX;
      lastTime = event.timeStamp;
    };

    const onPointerUp = () => {
      if (!drag) return;
      drag = false;
      st.style.cursor = "grab";
      vid.play().catch(() => undefined);
    };

    vid.addEventListener("loadedmetadata", onLoaded);
    st.addEventListener("pointerdown", onPointerDown);
    st.addEventListener("pointermove", onPointerMove);
    st.addEventListener("pointerup", onPointerUp);
    st.addEventListener("pointercancel", onPointerUp);
    vid.src = source;
    vid.load();

    return () => {
      cancelAnimationFrame(raf);
      vid.pause();
      vid.removeEventListener("loadedmetadata", onLoaded);
      st.removeEventListener("pointerdown", onPointerDown);
      st.removeEventListener("pointermove", onPointerMove);
      st.removeEventListener("pointerup", onPointerUp);
      st.removeEventListener("pointercancel", onPointerUp);
      vid.removeAttribute("src");
      vid.load();
    };
  }, [src, mobileSrc, sensitivity, start, idleSeconds]);

  return (
    <div
      ref={stage}
      className="absolute inset-0 z-0 cursor-grab touch-none overflow-hidden bg-[#0b0b0b]"
    >
      <video
        ref={video}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />
      <div
        ref={hint}
        className="pointer-events-none absolute inset-x-0 bottom-7 text-center font-mono text-[10px] uppercase tracking-[.24em] text-[#f2f2f0] opacity-70 transition-opacity duration-700"
      >
        Loading
      </div>
    </div>
  );
}
