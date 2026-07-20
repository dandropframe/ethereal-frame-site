import { useEffect } from "react";
import Lenis from "lenis";
import { useRouter } from "@tanstack/react-router";

export function SmoothScroll() {
  const router = useRouter();
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const unsub = router.subscribe("onResolved", () => {
      lenis.scrollTo(0, { immediate: true });
    });

    return () => {
      unsub();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [router]);
  return null;
}
