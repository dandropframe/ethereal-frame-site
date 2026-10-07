import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { MediaLightbox } from "@/components/MediaLightbox";
import { ProjectTile } from "@/components/ProjectTile";
import { playground } from "@/data/playground";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — Dropframe" },
      {
        name: "description",
        content: "Experiments, loops, and explorations from the Dropframe playground.",
      },
      { property: "og:title", content: "Playground — Dropframe" },
      {
        property: "og:description",
        content: "Experiments, loops, and explorations from the Dropframe playground.",
      },
    ],
  }),
  component: Playground,
});

function Playground() {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-12 md:pb-16">
        <div className="text-eyebrow mt-10 mb-6">Experiments</div>
        <h1 className="text-display text-[3.84vw] md:text-[2.16vw] leading-[0.9] opacity-80">
          Playground
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {playground.map((item, index) => (
            <div key={item.slug} className={index % 3 === 1 ? "md:mt-16" : ""}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Enlarge ${item.title}`}
                className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                <ProjectTile
                  image={item.type === "video" ? (item.poster ?? item.src) : item.src}
                  video={item.type === "video" ? item.src : undefined}
                  title={item.title}
                  meta={item.meta}
                  aspect="aspect-square"
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {active !== null ? <MediaLightbox item={playground[active]} onClose={close} /> : null}
    </div>
  );
}
