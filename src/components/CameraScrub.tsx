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
    let targetProgress = start;
    let direction = 1;
    let lastTime = 0;
    let raf = 0;
    let loadedPercent = 0;

    const clamp = (value: number) => Math.max(0.02, Math.min(0.98, value));
    const edgeSpeed = (progress: number) => {
      const distanceToEdge = Math.min(progress - 0.02, 0.98 - progress);
      const edgeBlend = Math.min(1, Math.max(0, distanceToEdge / 0.14));
      return edgeBlend * edgeBlend * (3 - 2 * edgeBlend);
    };
    const setProgress = (progress: number) => {
      if (Number.isFinite(vid.duration) && vid.duration > 0) {
        targetProgress = clamp(progress);
      }
    };

    const animate = (now: number) => {
      const elapsed = Math.min((now - (lastTime || now)) / 1000, 0.05);
      if (Number.isFinite(vid.duration) && vid.duration > 0) {
        if (!drag && !reduceMotion) {
          // Keep the middle at normal speed and ease only at the turnarounds.
          const playbackRate = Math.max(0.08, edgeSpeed(targetProgress)) / Math.max(vid.duration, 0.001);
          targetProgress += direction * playbackRate * elapsed;
          if (targetProgress >= 0.98 || targetProgress <= 0.02) {
            targetProgress = clamp(targetProgress);
            direction *= -1;
          }
        }

        const currentProgress = vid.currentTime / vid.duration;
        const nextProgress = drag
          ? targetProgress
          : currentProgress + (targetProgress - currentProgress) * 0.3;
        if (Math.abs(nextProgress - currentProgress) > 0.00005) {
          vid.currentTime = nextProgress * vid.duration;
        }
      }
      lastTime = now;
      raf = requestAnimationFrame(animate);
    };

    const onProgress = () => {
      if (!vid.buffered.length || !Number.isFinite(vid.duration) || vid.duration <= 0) return;
      const bufferedEnd = vid.buffered.end(vid.buffered.length - 1);
      loadedPercent = Math.min(100, Math.round((bufferedEnd / vid.duration) * 100));
      h.textContent = `Loading ${loadedPercent}%`;
    };

    const onLoaded = () => {
      targetProgress = clamp(start);
      vid.pause();
      h.textContent = "Drag";
      h.style.opacity = "0.7";
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
      setProgress(targetProgress + delta);
      direction = delta >= 0 ? 1 : -1;
      lastX = event.clientX;
      lastTime = event.timeStamp;
    };

    const onPointerUp = () => {
      if (!drag) return;
      drag = false;
      st.style.cursor = "grab";
      vid.play().catch(() => undefined);
    };

    vid.addEventListener("progress", onProgress);
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
      vid.removeEventListener("progress", onProgress);
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
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-center font-mono text-[10px] uppercase tracking-[.24em] text-[#f2f2f0] opacity-70 transition-opacity duration-700"
      >
        Loading
      </div>
    </div>
  );
}
