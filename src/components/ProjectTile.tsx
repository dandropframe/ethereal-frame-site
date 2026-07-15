import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

type Props = {
  slug: string;
  image: string;
  title: string;
  meta?: string;
  aspect?: string;
};

export function ProjectTile({ slug, image, title, meta, aspect = "aspect-[4/3]" }: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      to="/work/$slug"
      params={{ slug }}
      className={`group block hover-lift transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className={`relative overflow-hidden bg-muted ${aspect}`}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4">
        <div className="text-sm">{title}</div>
        {meta ? <div className="text-eyebrow">{meta}</div> : null}
      </div>
    </Link>
  );
}
