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
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/5bbf3758-dece-4958-8bdb-21ce1c329390/Artboard+42%408x.png"
            alt="Dropframe"
            className="h-[16.1px] md:h-[19.55px] w-auto object-contain [filter:invert(1)_brightness(2)]"
          />
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
