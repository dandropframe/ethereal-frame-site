import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dropframe" },
      { name: "description", content: "A creative production studio for fashion, cosmetics, and technology brands. Small by design." },
      { property: "og:title", content: "About — Dropframe" },
      { property: "og:description", content: "Craft leads. Method follows the brief." },
    ],
  }),
  component: About,
});

const team = [
  {
    name: "Dan Braga Ulvestad",
    role: "Creative Director",
    image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/9030a5d5-e399-4d0c-8cc9-fa948ef6b4f1/Mexico+City+Feb+2026__DSF8729.jpg",
    bio: "Over a decade of experience across 3D animation, film, photography, and art direction. A foundation in film informs a deep understanding of composition, pacing, light, and narrative structure — moving seamlessly between story development and complex virtual art direction.",
  },
  {
    name: "Anastasiia Rubtsova",
    role: "Executive Producer",
    image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/808fdef9-f2d9-43a8-9cdd-1b65108da70b/hf_20260212_062901_6e19602d-966e-4b7a-874a-d189e56425cc.jpg",
    bio: "A decade of experience spanning technology, funding, and commercial production. Translates creative ambition into clear financial frameworks, aligning budgets with vision and guiding teams through end-to-end delivery.",
  },
  {
    name: "Alice Pirmahboub",
    role: "Head of Fashion & Content",
    image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/7dbd137b-f1f1-410f-b73b-0ac7c1170bb3/hf_20260212_191137_cc093543-0cfe-48e3-a55d-069fe0a17f5a.jpg",
    bio: "Over 15 years in fashion — both in front of the camera as a model and behind it as a creative stylist. A deep understanding of garment construction, silhouette, and movement bridges physical and virtual fashion.",
  },
];

function About() {
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-40">
        <div className="text-eyebrow mb-8">About</div>
        <h1 className="text-display text-4xl md:text-[6vw] leading-[1]">
          The best visual work is made by people who understand both the craft and the
          technology — <span className="italic text-muted-foreground">and who know which one leads.</span>
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-12 gap-6 pb-24 md:pb-40 border-y border-border py-16">
        <div className="col-span-12 md:col-span-4 text-eyebrow">Studio</div>
        <div className="col-span-12 md:col-span-8 space-y-6 text-lg leading-relaxed">
          <p>
            <span className="font-mono text-xs tracking-widest uppercase text-accent">Dropframe</span> is a
            creative production studio for fashion, cosmetics, technology brands and beyond.
            We produce 3D motion, in-camera film and photography, and synthetic imagery —
            all driven by the same creative direction.
          </p>
          <p className="text-muted-foreground">
            We are small by design, and intentionally so — we take on projects where
            creative direction makes a difference. When a project demands it, we draw on a
            wide network of trusted collaborators. The core stays consistent. The capacity
            scales with the brief.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-24 md:py-32">
        <div className="text-eyebrow mb-16">Team</div>
        <div className="space-y-24 md:space-y-40">
          {team.map((t, i) => (
            <div key={t.name} className={`grid grid-cols-12 gap-6 md:gap-10 items-start ${i % 2 ? "md:direction-rtl" : ""}`}>
              <div className={`col-span-12 md:col-span-5 ${i % 2 ? "md:order-2" : ""}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img src={t.image} alt={t.name} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              </div>
              <div className={`col-span-12 md:col-span-6 md:col-start-${i % 2 ? "1" : "7"} pt-4`}>
                <div className="text-eyebrow">{t.role}</div>
                <div className="text-display text-3xl md:text-5xl mt-4">{t.name}</div>
                <p className="text-muted-foreground mt-6 leading-relaxed">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
