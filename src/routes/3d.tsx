import { createFileRoute } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";
import { projects } from "@/data/projects";
import { ShowreelDropdown } from "@/components/ShowreelDropdown";

export const Route = createFileRoute("/3d")({
  head: () => ({
    meta: [
      { title: "3D — Dropframe" },
      { name: "description", content: "Art-directed 3D and motion graphics across commercial campaigns, projection mapping, concert visuals, and narrative film." },
      { property: "og:title", content: "3D — Dropframe" },
      { property: "og:description", content: "High-end 3D and motion, previz through final frame." },
    ],
  }),
  component: ThreeD,
});

function ThreeD() {
  const items = projects.filter((p) => p.discipline === "3D");
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
        <div className="text-eyebrow mb-8">3D / Art Direction</div>
        <h1 className="text-display text-6xl md:text-[10vw] leading-[0.9]">
          Virtual.<br />
          <span className="">Rendered.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-muted-foreground">
          We design and execute 3D and motion graphics across commercial campaigns,
          projection mapping, concert visuals, and narrative film. We work in specific
          capacity or full production — previz through final frame.
        </p>
        <div className="mt-10">
          <ShowreelDropdown label="Showreel" vimeoId="580437144" />
        </div>
      </section>
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {items.map((p, i) => (
          <div key={p.slug} className={i % 3 === 1 ? "md:mt-16" : ""}>
            <ProjectTile
              slug={p.slug}
              image={p.hero}
              title={`${p.client} — ${p.title}`}
              meta={p.category}
              aspect="aspect-[16/10]"
            />
          </div>
        ))}
      </section>
    </div>
  );
}
