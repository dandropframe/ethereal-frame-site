import { useEffect, useState } from "react";

const SHOWREEL_HASH = "#showreel";

export function ShowreelDropdown({
  label = "Showreel",
  vimeoId = "757436831",
}: {
  label?: string;
  vimeoId?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const syncWithHash = () => setOpen(window.location.hash === SHOWREEL_HASH);
    syncWithHash();
    window.addEventListener("hashchange", syncWithHash);
    return () => window.removeEventListener("hashchange", syncWithHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && closeShowreel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const openShowreel = () => {
    window.location.hash = SHOWREEL_HASH;
  };

  const closeShowreel = () => {
    if (window.location.hash === SHOWREEL_HASH) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openShowreel}
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
          role="dialog"
          aria-modal="true"
          aria-label="Showreel"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl animate-in fade-in duration-500"
          onClick={closeShowreel}
        >
          <button
            type="button"
            onClick={closeShowreel}
            aria-label="Close showreel"
            className="absolute top-6 right-6 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground transition-colors hover:text-foreground md:top-10 md:right-10"
          >
            Close ×
          </button>
          <div
            className="relative aspect-video w-[92vw] max-w-[1400px] bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
              title="Dan Ulv showreel"
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
