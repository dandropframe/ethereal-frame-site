import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter, useRouterState } from "@tanstack/react-router";

/* ────────────────────────────────────────────────────────────
   Duration & easing config — tweak freely
   ──────────────────────────────────────────────────────────── */
const TIMING = {
  navFadeOut: 100, // ms — nav fades out instantly on click
  push: 450, // ms — old page pushed up, new page rises in
  pushEase: "cubic-bezier(0.83, 0, 0.68, 0)", // power2.in
  blankBeat: 150, // ms — brief blank white beat while old page clears
  navFadeIn: 150, // ms — nav fades back in
  contentFadeIn: 300, // ms — new page content fades in
  contentEase: "cubic-bezier(0.16, 1, 0.3, 1)", // power2.out
  reducedMotion: 200, // ms — simple crossfade for reduced-motion
};

type Phase = "idle" | "pushing" | "blank" | "contentIn";

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const mainRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const oldCloneRef = useRef<Node | null>(null);
  const prevPathRef = useRef(pathname);
  const transitioningRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [showOverlay, setShowOverlay] = useState(false);
  const [clickBlock, setClickBlock] = useState(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Capture old page DOM clone DURING RENDER, before React commits the new page.
  // mainRef.current still holds the old page's DOM at this point.
  if (
    typeof window !== "undefined" &&
    mainRef.current &&
    pathname !== prevPathRef.current &&
    !transitioningRef.current
  ) {
    oldCloneRef.current = mainRef.current.cloneNode(true);
  }
  prevPathRef.current = pathname;

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  };

  const after = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  };

  useEffect(() => {
    if (!oldCloneRef.current) return;
    if (transitioningRef.current) return;

    transitioningRef.current = true;
    setClickBlock(true);
    document.body.style.overflow = "hidden";

    const clone = oldCloneRef.current;

    // ── Reduced motion: simple crossfade ──
    if (prefersReducedMotion) {
      const main = mainRef.current;
      if (main) {
        main.style.opacity = "0";
        requestAnimationFrame(() => {
          if (main) {
            main.style.transition = `opacity ${TIMING.reducedMotion}ms ease`;
            main.style.opacity = "1";
          }
        });
      }
      after(() => {
        document.body.style.overflow = "";
        transitioningRef.current = false;
        oldCloneRef.current = null;
        setClickBlock(false);
        window.scrollTo(0, 0);
      }, TIMING.reducedMotion + 50);
      return () => clearTimers();
    }

    // ── Full push animation ──
    setShowOverlay(true);
    setPhase("pushing");
    window.scrollTo(0, 0);

    // Inject the old page clone into the overlay
    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      const main = mainRef.current;
      if (!overlay || !main) return;

      overlay.innerHTML = "";
      overlay.appendChild(clone);

      // Phase 2: push — wait for nav fade out first
      after(() => {
        // Animate old page (overlay) up and out
        overlay.animate(
          [
            { transform: "translateY(0%)", opacity: 1 },
            { transform: "translateY(-100%)", opacity: 0 },
          ],
          { duration: TIMING.push, easing: TIMING.pushEase, fill: "forwards" },
        );

        // Animate new page (main) rising from below
        main.animate(
          [
            { transform: "translateY(100%)", opacity: 1 },
            { transform: "translateY(0%)", opacity: 1 },
          ],
          { duration: TIMING.push, easing: TIMING.pushEase, fill: "forwards" },
        );

        // Phase 3: blank beat after push completes
        after(() => {
          setPhase("blank");
          main.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 60, easing: "ease", fill: "forwards" },
          );

          after(() => {
            // Phase 4: content fades in
            setPhase("contentIn");
            window.scrollTo(0, 0);
            main.animate(
              [{ opacity: 0 }, { opacity: 1 }],
              { duration: TIMING.contentFadeIn, easing: TIMING.contentEase, fill: "forwards" },
            );

            after(() => {
              setShowOverlay(false);
              setPhase("idle");
              document.body.style.overflow = "";
              transitioningRef.current = false;
              oldCloneRef.current = null;
              setClickBlock(false);
            }, TIMING.contentFadeIn + 50);
          }, TIMING.blankBeat);
        }, TIMING.push);
      }, TIMING.navFadeOut);
    });

    return () => {
      clearTimers();
      document.body.style.overflow = "";
    };
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Prefetch route + assets on link hover
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const link = (e.target as HTMLElement)?.closest("a[data-prefetch]");
      if (!link) return;
      const href = link.getAttribute("data-prefetch");
      if (href) {
        try {
          router.preloadRoute({ to: href });
        } catch {
          // best-effort
        }
      }
    };
    document.addEventListener("mouseover", handler, { passive: true });
    return () => document.removeEventListener("mouseover", handler);
  }, [router]);

  return (
    <>
      {/* Old page clone overlay — pushed up during transition */}
      {showOverlay && (
        <div
          ref={overlayRef}
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            pointerEvents: "none",
            overflow: "hidden",
            background: "var(--background, #fff)",
          }}
        />
      )}

      {/* White flash for blank beat */}
      {phase === "blank" && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 91,
            background: "var(--background, #fff)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Click blocker during transition */}
      {clickBlock && (
        <div
          aria-hidden
          style={{ position: "fixed", inset: 0, zIndex: 95, cursor: "wait" }}
        />
      )}

      {/* Current page content */}
      <div ref={mainRef}>{children}</div>
    </>
  );
}

export { TIMING };
