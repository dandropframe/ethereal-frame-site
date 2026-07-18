import { createFileRoute } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";
import { projects, type Project } from "@/data/projects";

export const Route = createFileRoute("/film")({
  head: () => ({
    meta: [
      { title: "Film — Dropframe" },
      { name: "description", content: "In-camera film and photography for fashion, cosmetics, and brand storytelling." },
      { property: "og:title", content: "Film — Dropframe" },
      { property: "og:description", content: "Direction and production for live-action film and photography." },
    ],
  }),
  component: Film,
});

function Film() {
  const film = projects.filter((p) => p.discipline === "Film");
  const fashion = film.filter((p) => p.category === "Fashion");
  const narrative = film.filter((p) => p.category === "Narrative");
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
        <div className="text-eyebrow mb-8">Film / Photography</div>
        <h1 className="text-display text-[9.75vw] md:text-[6.75vw] leading-[0.9] opacity-80">
          On set. On location.<br />
          <span className="">In frame.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-muted-foreground">
          We direct and produce live-action film and photography — from cost-effective
          social content to polished brand campaigns, portrait film, and music video.
        </p>
      </section>

      <Section title="Fashion" items={fashion} />
      <Section title="Narrative" items={narrative} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: Project[] }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 mt-16 md:mt-24">
      <div className="text-eyebrow border-t border-border pt-6 mb-10">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {items.map((p, i) => (
          <div key={p.slug} className={i === 1 ? "md:mt-16" : ""}>
            <ProjectTile
              slug={p.slug}
              image={p.hero}
              title={p.title}
              meta={p.category}
              aspect="aspect-[4/5]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
