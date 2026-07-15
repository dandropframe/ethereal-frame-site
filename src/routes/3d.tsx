import { createFileRoute } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";

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

const projects = [
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3ff8864f-c35d-4d03-930c-79f2e4c18574/sk2_001.png", title: "SK-II — Kokeshi", meta: "Campaign", href: "https://www.dropframe.site/sk2f" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f4c170f5-0543-4895-9bc2-e70229701fd5/MS_AI_14_WORLD_PANELS_04_2025-03-26_17.09.59.png", title: "Microsoft", meta: "World Panels", href: "https://www.dropframe.site/microsoft" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f0b524e9-2b06-48f5-9392-f90c68c6cfd2/Airforce_01_SKII_Kokeshi_Cheeky_All_ProRes__2023-05-04_16.45.16.jpg", title: "SK-II — Air Force", meta: "Motion", href: "https://www.dropframe.site/sk2" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3a0c93fe-207c-4f97-b002-b63353f52a0c/Untitled+Project_15s_laMerCny_16X9_NIGHT_WIP032_2026-05-13_13.26.27.jpg", title: "La Mer", meta: "CNY", href: "https://www.dropframe.site/lamer" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/6fe90b86-b59c-493f-8d00-8908994e67c9/Untitled+Project_1110_MtFloret_ProRes4444_01_2024-11-06_16.26.15.png", title: "Mt. Floret", meta: "Narrative", href: "https://www.dropframe.site/floret" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/167c782e-efd4-4b3c-8b64-09fd786bf70d/LaMer_04_NikeTiempoGraphic_01_MAIN_A+2_2_2026-05-14_19.17.37.jpg", title: "Nike Tiempo", meta: "Graphic", href: "https://www.dropframe.site/nike" },
  { image: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/d08ffb3b-6ee2-4ee3-8a18-7edce685dd2f/ESPN_01_ESPN_Basketball_02_2021-12-13_18.11.33.jpg", title: "ESPN", meta: "Broadcast", href: "https://www.dropframe.site/espn" },
];

function ThreeD() {
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-16 md:pb-24">
        <div className="text-eyebrow mb-8">3D / Art Direction</div>
        <h1 className="text-display text-6xl md:text-[10vw] leading-[0.9]">
          Virtual.<br />
          <span className="italic">Rendered.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-muted-foreground">
          We design and execute 3D and motion graphics across commercial campaigns,
          projection mapping, concert visuals, and narrative film. Specific capacity or full
          production — previz through final frame.
        </p>
      </section>
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {projects.map((p, i) => (
          <div key={p.title} className={i % 3 === 1 ? "md:mt-16" : ""}>
            <ProjectTile {...p} aspect="aspect-[16/10]" />
          </div>
        ))}
      </section>
    </div>
  );
}
