import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShowreelDropdown } from "@/components/ShowreelDropdown";
import { ProjectTile } from "@/components/ProjectTile";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/")({
  component: Info,
});

const HERO =
  "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f83e3a56-f986-47e7-8cb0-efa63a0c9c3d/Cover_02.png";

const services = [
  "Creative Direction",
  "Product Visualisation",
  "Motion Design",
  "Previz",
  "GenAI",
  "Environment Design",
  "Styleframes",
  "Compositing",
];

const threeDProjects = projects.filter((project) => project.discipline === "3D");

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setV(true), {
      threshold: 0.2,
    });
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
              title="DROPFRAME reel"
              allow="autoplay; fullscreen"
              className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
            />
          </div>
          <img
            src={HERO}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-0"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 md:px-10 pb-16 md:pb-24">
          <div className="text-eyebrow mb-6">Design Director</div>
          <h1 className="text-display text-[4.4vw] md:text-[2.7rem] leading-[1.05] opacity-80">
            I direct, design, and build ideas —<br />
            from concept to final frame.
          </h1>
          <div className="mt-6 max-w-[60vw] md:max-w-[55vw] text-muted-foreground text-[0.8rem] md:text-base">
            Where technology, products, culture, and human experience become immersive worlds.
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:right-10 z-10 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          Scroll ↓
        </div>
      </section>

      <Services />

      <SelectedWork />

      <section
        id="work"
        className="mx-auto max-w-[1600px] px-6 md:px-10 pt-24 md:pt-40 pb-12 md:pb-16 scroll-mt-24"
      >
        <div className="grid grid-cols-12 gap-6 mb-16">
          <div className="col-span-12 md:col-span-3 text-eyebrow">Selected Work</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {threeDProjects.map((project, index) => (
            <div key={project.slug} className={index % 3 === 1 ? "md:mt-16" : ""}>
              <Link
                to="/$slug"
                params={{ slug: project.slug }}
                className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                <ProjectTile
                  image={project.hero}
                  title={project.title}
                  meta={project.category}
                  aspect="aspect-[16/10]"
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Services() {
  const { ref, v } = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="border-y border-border overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-40 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 text-eyebrow">Services</div>
        <ul
          className={`col-span-12 md:col-span-9 grid grid-cols-2 gap-x-6 gap-y-4 list-none m-0 p-0 text-display text-[0.9375rem] md:text-[1.8rem] transition-all duration-1000 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {services.map((service) => (
            <li key={service}>{service}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SelectedWork() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-12 md:py-16">
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 md:col-span-3 text-eyebrow">Showreel</div>
          <div className="col-span-12 md:col-span-9">
            <ShowreelDropdown label="Play Showreel" vimeoId="580437144" />
            <div className="mt-6 text-muted-foreground max-w-xl text-sm">
              A cross-section of commercial and personal work.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
