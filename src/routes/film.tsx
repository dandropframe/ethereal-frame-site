import { createFileRoute } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";

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

const fashion = [
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/32988c0b-b302-48c9-80f2-73c6f6030ba8/Boutique_April_03B.jpg", title: "Alemais", meta: "Fashion", href: "https://www.dropframe.site/alemais" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/21fcdd78-5afa-4169-af80-830a10b83b31/Boutique_April_02_DSC09800+3_2026-04-25_14.53.01.jpg", title: "Etuui", meta: "Fashion", href: "https://www.dropframe.site/etuui" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/750fe7b7-0796-4ff7-96ba-283002cf810c/Boutique_April_02_image00002_2026-04-3.jpg", title: "Mustang", meta: "Fashion", href: "https://www.dropframe.site/mustang" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/b03f2852-3be7-4746-a02c-6a59e92f2713/Thumbnail_Web_06.jpg", title: "Samira", meta: "Fashion", href: "https://www.dropframe.site/samira" },
];
const narrative = [
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/a7db5419-32f9-4347-ae25-7f4d73b1b5b3/Thumbnail_06.jpg", title: "Restless", meta: "Narrative", href: "https://www.dropframe.site/restless" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/0762d87e-2afd-4041-a36b-aaa08834f398/Yamaha_Thumbnail_05.jpg", title: "Yamaha", meta: "Narrative", href: "https://www.dropframe.site/yamaha" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/61de5390-1f33-4e8c-9009-4b13218122b9/Postman_Still02_17.png", title: "Postman", meta: "Narrative", href: "https://www.dropframe.site/postman" },
];

function Film() {
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
        <div className="text-eyebrow mb-8">Film / Photography</div>
        <h1 className="text-display text-5xl md:text-[8vw] leading-[0.9]">
          On set. On location.<br />
          <span className="italic">In frame.</span>
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

function Section({ title, items }: { title: string; items: typeof fashion }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 mt-16 md:mt-24">
      <div className="text-eyebrow border-t border-border pt-6 mb-10">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {items.map((p, i) => (
          <div key={p.title} className={i === 1 ? "md:mt-16" : ""}>
            <ProjectTile {...p} aspect="aspect-[4/5]" />
          </div>
        ))}
      </div>
    </section>
  );
}
