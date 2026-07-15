import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const items = [
  { to: "/", label: "Info" },
  { to: "/3d", label: "3D" },
  { to: "/film", label: "Film" },
  { to: "/ai", label: "AI" },
  { to: "/about", label: "About" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl bg-background/60 border-b border-border" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative h-6 w-6">
            <span className="absolute inset-0 border border-foreground" />
            <span className="absolute -right-1 -bottom-1 h-3 w-3 border-t border-l border-foreground" />
          </div>
          <span className="font-mono text-xs tracking-[0.2em] uppercase">Dropframe</span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              activeOptions={{ exact: true }}
              className="group relative px-3 py-2 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {it.label}
              <span className="absolute left-3 right-3 -bottom-0.5 h-px scale-x-0 origin-left bg-foreground transition-transform duration-500 group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
