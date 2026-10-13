import { useEffect, useRef } from "react";
import { mountCameraScrub, fetchPack } from "./cameraScrubEngine";

type Props = {
  src: string;           // desktop frame pack, e.g. "/video/floret-slide-1920.bin"
  mobileSrc?: string;    // lighter pack for phones
  sensitivity?: number;  // how much of the clip a full-width drag covers (default 1.15)
  idleSeconds?: number;  // seconds for the drift to cross the whole clip: higher = slower (default 30)
  start?: number;        // 0..1 starting position (default 0.5)
};

export default function CameraScrub({ src, mobileSrc, sensitivity, idleSeconds, start }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const small = matchMedia("(pointer:coarse)").matches || innerWidth < 900;
    const url = small && mobileSrc ? mobileSrc : src;
    return mountCameraScrub(ref.current!, (p, s) => fetchPack(url, p, s), { sensitivity, idleSeconds, start, absolute: true });
  }, [src, mobileSrc, sensitivity, idleSeconds, start]);
  return <div ref={ref} />;
}
