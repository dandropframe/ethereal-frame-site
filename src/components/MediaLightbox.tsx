import { useEffect, useState } from "react";
import type { PlaygroundItem } from "@/data/playground";

type Props = {
  item: PlaygroundItem;
  onClose: () => void;
};

export function MediaLightbox({ item, onClose }: Props) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const mediaClass = "h-full w-full object-contain";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      data-lenis-prevent
      onClick={onClose}
      className={`fixed inset-0 z-[60] cursor-zoom-out bg-background/95 backdrop-blur-xl p-6 pt-16 md:p-12 md:pt-20 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="text-eyebrow absolute top-5 right-6 md:top-6 md:right-10 px-2 py-2 text-foreground transition-colors hover:text-muted-foreground"
      >
        Close
      </button>
      {item.type === "video" ? (
        <video
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          aria-label={item.title}
          className={mediaClass}
        />
      ) : (
        <img src={item.src} alt={item.title} className={mediaClass} />
      )}
    </div>
  );
}
