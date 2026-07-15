import { createFileRoute } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";
import { projects } from "@/data/projects";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI — Dropframe" },
      { name: "description", content: "Synthography: fashion imagery and video created without physical sets, locations, or a shoot day." },
      { property: "og:title", content: "AI — Dropframe" },
      { property: "og:description", content: "Synthetic imagery as a direct alternative to traditional production." },
    ],
  }),
  component: AI,
});

const steps = [
  { n: "01", t: "Share product photos", d: "Send flats, hero shots, or existing e-commerce assets. We work from what you already have." },
  { n: "02", t: "Pick your models", d: "Choose from our curated synthetic roster — or brief a custom talent build." },
  { n: "03", t: "Define the vision", d: "Location, styling, mood, framing. We art-direct with the same rigor as physical production." },
  { n: "04", t: "We handle the rest", d: "Iteration, variation, and long-term extensibility — delivered on your schedule." },
];

function AI() {
  const items = projects.filter((p) => p.discipline === "AI");
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
        <div className="text-eyebrow mb-8">AI / Synthography</div>
        <h1 className="text-display text-5xl md:text-[8vw] leading-[0.9]">
          Fashion imagery<br />
          <span className="italic">without the shoot.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-muted-foreground">
          Synthography replaces or supplements traditional productions when speed,
          flexibility, consistency, or scalability are required — without compromising
          visual quality or brand integrity.
        </p>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 mt-8 border-t border-border">
        <div className="text-eyebrow pt-6 mb-10">How it works</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-16">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-border pt-6">
              <div className="font-mono text-xs text-accent">{s.n}</div>
              <div className="text-display text-2xl mt-4">{s.t}</div>
              <div className="text-sm text-muted-foreground mt-3">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 mt-16">
        <div className="text-eyebrow border-t border-border pt-6 mb-10">Selected campaigns</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {items.map((p, i) => (
            <div key={p.slug} className={i === 1 ? "md:mt-16" : ""}>
              <ProjectTile
                slug={p.slug}
                image={p.hero}
                title={`${p.client} — ${p.title}`}
                meta={p.category}
                aspect="aspect-[3/4]"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
