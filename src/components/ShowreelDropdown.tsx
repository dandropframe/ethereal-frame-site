export function ShowreelDropdown({
  label = "Showreel",
  vimeoId = "757436831",
}: {
  label?: string;
  vimeoId?: string;
}) {
  return (
    <a
      href="/showreel"
      className="group inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground transition-colors hover:bg-foreground hover:text-background"
    >
      <span
        aria-hidden
        className="inline-block h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-125"
      />
      {label}
      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
        ↗
      </span>
    </a>
  );
}
