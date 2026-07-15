import { createFileRoute } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";

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

const projects = [
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/11ce9119-5bc5-46de-bd01-86731820f45a/Levis_01.jpg", title: "Levi's", meta: "Campaign", href: "https://www.dropframe.site/levis" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/81bd57ad-fb1d-4a8b-aa1f-d00390cc2851/Annamarie_EyePas_02.png", title: "Annemarie Börlind", meta: "Beauty", href: "https://www.dropframe.site/annemarie" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/c097e017-495e-4dc9-ac3d-667cdf22205a/815+24+290+-+295+%2B+830+22+317+-+295_02.jpg", title: "Juvia", meta: "Fashion", href: "https://www.dropframe.site/juvia" },
];

const steps = [
  { n: "01", t: "Share product photos", d: "Send flats, hero shots, or existing e-commerce assets. We work from what you already have." },
  { n: "02", t: "Pick your models", d: "Choose from our curated synthetic roster — or brief a custom talent build." },
  { n: "03", t: "Define the vision", d: "Location, styling, mood, framing. We art-direct with the same rigor as physical production." },
  { n: "04", t: "We handle the rest", d: "Iteration, variation, and long-term extensibility — delivered on your schedule." },
];

function AI() {
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
          {projects.map((p, i) => (
            <div key={p.title} className={i === 1 ? "md:mt-16" : ""}>
              <ProjectTile {...p} aspect="aspect-[3/4]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
