import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

type Props = {
  item: { title: string; type: "image" | "video"; src: string; poster?: string };
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  position?: string;
};

export function MediaLightbox({ item, onClose, onPrevious, onNext, position }: Props) {
  const [shown, setShown] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = prevOverflow;
    };
  }, []);

  const mediaClass = "h-full w-full object-contain";

  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={() => {
            previousFocus.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            previousFocus.current?.focus();
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" && onPrevious) {
              event.preventDefault();
              onPrevious();
            } else if (event.key === "ArrowRight" && onNext) {
              event.preventDefault();
              onNext();
            }
          }}
          data-lenis-prevent
          onClick={onClose}
          className={`fixed inset-0 z-[60] cursor-zoom-out bg-background/95 backdrop-blur-xl p-6 pt-16 md:p-12 md:pt-20 transition-opacity duration-300 ${shown ? "opacity-100" : "opacity-0"}`}
        >
          <Dialog.Title className="sr-only">{item.title}</Dialog.Title>
          <button
            type="button"
            onClick={onClose}
            className="text-eyebrow absolute top-5 right-6 md:top-6 md:right-10 px-2 py-2 text-foreground transition-colors hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-foreground"
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
          {position ? (
            <div
              aria-live="polite"
              aria-atomic="true"
              className="text-eyebrow absolute top-5 left-6 md:top-6 md:left-10 px-2 py-2"
            >
              {position}
            </div>
          ) : null}
          {onPrevious ? (
            <button
              type="button"
              aria-label="Previous image"
              onClick={(event) => {
                event.stopPropagation();
                onPrevious();
              }}
              className="text-eyebrow absolute bottom-5 left-6 md:bottom-6 md:left-10 bg-background/80 px-3 py-3 cursor-pointer hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-foreground"
            >
              ← Previous
            </button>
          ) : null}
          {onNext ? (
            <button
              type="button"
              aria-label="Next image"
              onClick={(event) => {
                event.stopPropagation();
                onNext();
              }}
              className="text-eyebrow absolute bottom-5 right-6 md:bottom-6 md:right-10 bg-background/80 px-3 py-3 cursor-pointer hover:text-muted-foreground focus-visible:outline-2 focus-visible:outline-foreground"
            >
              Next →
            </button>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
