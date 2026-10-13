import { useEffect, useState } from "react";

export function ShowreelDropdown({
  label = "Showreel",
  vimeoId = "757436831",
}: {
  label?: string;
  vimeoId?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground transition-colors hover:bg-foreground hover:text-background"
      >
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125"
        />
        {label}
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
          ↓
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-6 right-6 md:top-10 md:right-10 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            Close ×
          </button>
          <div
            className="relative w-[92vw] max-w-[1400px] aspect-video bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
              title="Dropframe Showreel"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
