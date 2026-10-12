import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ShowreelDropdown } from "@/components/ShowreelDropdown";
import { ProjectTile } from "@/components/ProjectTile";
import { projects } from "@/data/projects";
import { ServicesList } from "@/components/ServicesList";
import CameraScrub from "@/components/CameraScrub";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dan Ulv — Art Direction & 3D Motion" },
      { name: "description", content: "Dan Ulv directs, designs, and builds ideas from concept to final frame — creative direction, 3D, motion design, and GenAI." },
      { property: "og:title", content: "Dan Ulv — Art Direction & 3D Motion" },
      { property: "og:description", content: "Creative direction, 3D, motion design, and GenAI — from concept to final frame." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: HERO },
      { name: "twitter:image", content: HERO },
    ],
  }),
  component: Info,
});

const HERO =
  "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f83e3a56-f986-47e7-8cb0-efa63a0c9c3d/Cover_02.png";

const services = [
  "Art Direction",
  "Concept & Narrative",
  "Product Visualisation",
  "Motion Design",
  "Previz",
  "GenAI",
  "Environment Design",
  "Styleframes",
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
  return (
    <div>
      <div className="relative z-10">
        {/* Hero */}
        <section className="relative h-[100svh] w-full overflow-hidden">
        <CameraScrub src="/video/floret-scrub-2560.mp4" mobileSrc="/video/floret-scrub-1280.mp4" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-background/10 to-background" />

        <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-6 md:px-10 pb-16 md:pb-24">
          <div className="text-eyebrow mb-6">Art Director</div>
          <h1 className="text-display text-[4.4vw] md:text-[39.9px] leading-[1.18] opacity-80">
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
                  video={project.video}
                  title={project.title}
                  meta={project.category}
                  aspect="aspect-[16/10]"
                  imagePosition={project.imagePosition}
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

function Services() {
  const { ref, v } = useReveal<HTMLDivElement>();
  return (
    <section ref={ref} className="border-y border-border overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-40 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-3 text-eyebrow">Services</div>
        <ServicesList
          services={services}
          className={`col-span-12 md:col-span-9 grid grid-cols-2 gap-x-6 gap-y-4 list-none m-0 p-0 text-display text-[0.8125rem] md:text-[1.5rem] transition-all duration-1000 ${v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        />
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
