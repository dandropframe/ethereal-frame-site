import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShowreelDropdown } from "@/components/ShowreelDropdown";

export const Route = createFileRoute("/")({
  component: Info,
});

const HERO = "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f83e3a56-f986-47e7-8cb0-efa63a0c9c3d/Cover_02.png";

const disciplines = [
  {
    tag: "01 — 3D",
    to: "/3d",
    title: "Art Direction & 3D",
    body: "High-end, art-directed 3D visuals across commercial campaigns, projection mapping, concert visuals, and narrative storytelling.",
    image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/aa0b0125-f978-4a51-9e07-742782493413/AD_Snippet_01_GIF.gif",
  },
  {
    tag: "02 — Film",
    to: "/film",
    title: "Film & Photography",
    body: "We direct and style in-camera film, photography, and brand storytelling for fashion and cosmetics — from concept through final delivery.",
    image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/a2f67cbd-1729-4acf-aa4e-10ad4f6c1cfa/Film_Snippet_GIF_02.gif",
  },
  {
    tag: "03 — AI",
    to: "/ai",
    title: "Synthography & AI",
    body: "Synthetic fashion imagery and video designed as a direct alternative to traditional studio or location-based production.",
    image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/10fa90df-22d6-4df4-91df-1e73eb836ff3/Synthography_Snippet_01_GIF.gif",
  },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return { ref, v };
}

function Info() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const on = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[100svh] w-full overflow-hidden">
        <div
          className="absolute inset-0 will-change-transform"
          style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
        >
          <div className="absolute inset-0 h-full w-full">
            <iframe
              src="https://player.vimeo.com/video/757436831?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&portrait=0&transparent=0"
              title="Dropframe reel"
              allow="autoplay; fullscreen"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            />
          </div>
          <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover opacity-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 md:px-10 pb-16 md:pb-24">
          <div className="text-eyebrow mb-6">Creative Production Studio — Est. 2021</div>
          <h1 className="text-display text-[13vw] md:text-[9vw] leading-[0.9]">
            The right<br />
            <span className="italic font-normal">production</span> for<br />
            the brief.
          </h1>
          <div className="mt-10 max-w-xl text-muted-foreground">
            A multidisciplinary studio producing 3D motion, in-camera film, and synthetic
            imagery — driven by a single creative direction.
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:right-10 z-10 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Scroll ↓
        </div>
      </section>

      {/* Manifesto */}
      <MarqueeManifesto />

      {/* Disciplines */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3 text-eyebrow">Disciplines</div>
          <h2 className="col-span-12 md:col-span-9 text-display text-4xl md:text-6xl">
            Three methods.<br />
            One creative direction.
          </h2>
        </div>

        <div className="space-y-4 md:space-y-6">
          {disciplines.map((d, i) => (
            <DisciplineRow key={d.to} {...d} index={i} />
          ))}
        </div>
      </section>

      {/* Selected Work */}
      <SelectedWork />
    </div>
  );
}

function MarqueeManifesto() {
  const { ref, v } = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="border-y border-border overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-40 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 text-eyebrow">Approach</div>
        <div className={`col-span-12 md:col-span-9 text-display text-3xl md:text-5xl transition-all duration-1000 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          We don't prescribe a production method. We start with your brief, your brand
          language, and your content needs — <span className="text-muted-foreground italic">then choose the approach that best serves them.</span>
        </div>
      </div>
    </section>
  );
}

function DisciplineRow({ tag, to, title, body, image, index }: typeof disciplines[number] & { index: number }) {
  const { ref, v } = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      to={to}
      className={`group relative grid grid-cols-12 gap-6 items-center border-t border-border py-8 md:py-10 transition-all duration-700 ${
        v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="col-span-2 md:col-span-1 text-eyebrow">{tag}</div>
      <div className="col-span-10 md:col-span-4 text-display text-2xl md:text-4xl">
        {title}
      </div>
      <div className="col-span-12 md:col-span-4 text-sm text-muted-foreground">{body}</div>
      <div className="col-span-12 md:col-span-3 relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110" />
      </div>
      <span className="absolute right-0 top-8 md:top-10 font-mono text-xs text-muted-foreground transition-transform duration-500 group-hover:translate-x-1 group-hover:text-foreground">↗</span>
    </Link>
  );
}

const featured = [
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3ff8864f-c35d-4d03-930c-79f2e4c18574/sk2_001.png", title: "SK-II", meta: "3D · Campaign" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/32988c0b-b302-48c9-80f2-73c6f6030ba8/Boutique_April_03B.jpg", title: "Alemais", meta: "Film · Fashion" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/11ce9119-5bc5-46de-bd01-86731820f45a/Levis_01.jpg", title: "Levi's", meta: "AI · Synthography" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/6fe90b86-b59c-493f-8d00-8908994e67c9/Untitled+Project_1110_MtFloret_ProRes4444_01_2024-11-06_16.26.15.png", title: "Mt. Floret", meta: "3D · Narrative" },
];

function SelectedWork() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-40">
      <div className="grid grid-cols-12 gap-6 mb-16">
        <div className="col-span-12 md:col-span-3 text-eyebrow">Selected Work</div>
        <h2 className="col-span-12 md:col-span-9 text-display text-4xl md:text-6xl">
          A sample of<br />recent collaborations.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {featured.map((f, i) => (
          <FeaturedTile key={f.title} {...f} offset={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function FeaturedTile({ image, title, meta, offset }: { image: string; title: string; meta: string; offset: boolean }) {
  const { ref, v } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`group ${offset ? "md:mt-24" : ""} transition-all duration-1000 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      <div className="relative overflow-hidden aspect-[4/5] bg-muted">
        <img src={image} alt={title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div className="text-lg">{title}</div>
        <div className="text-eyebrow">{meta}</div>
      </div>
    </div>
  );
}
