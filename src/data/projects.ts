export type Project = {
  slug: string;
  title: string;
  client: string;
  discipline: "3D" | "Film" | "AI";
  category: string;
  year: string;
  role: string[];
  hero: string;
  gallery: string[];
  summary: string;
  body: string;
  credits?: { role: string; name: string }[];
};

export const projects: Project[] = [
  {
    slug: "sk2f",
    title: "Kokeshi",
    client: "SK-II",
    discipline: "3D",
    category: "Campaign",
    year: "2024",
    role: ["Art Direction", "3D", "Motion"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3ff8864f-c35d-4d03-930c-79f2e4c18574/sk2_001.png",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3ff8864f-c35d-4d03-930c-79f2e4c18574/sk2_001.png",
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f0b524e9-2b06-48f5-9392-f90c68c6cfd2/Airforce_01_SKII_Kokeshi_Cheeky_All_ProRes__2023-05-04_16.45.16.jpg",
    ],
    summary: "A collectible ceramic world built to hero the PITERA essence.",
    body: "A fully art-directed 3D campaign for SK-II. We designed the environment, characters, and product beauty passes end-to-end — building a sculpted ceramic language that translates the ritual of PITERA into a tactile, collectible visual world.",
  },
  {
    slug: "microsoft",
    title: "World Panels",
    client: "Microsoft",
    discipline: "3D",
    category: "Product Launch",
    year: "2025",
    role: ["Art Direction", "3D", "Look Dev"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f4c170f5-0543-4895-9bc2-e70229701fd5/MS_AI_14_WORLD_PANELS_04_2025-03-26_17.09.59.png",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f4c170f5-0543-4895-9bc2-e70229701fd5/MS_AI_14_WORLD_PANELS_04_2025-03-26_17.09.59.png",
    ],
    summary: "Modular product panels that unfold Microsoft's AI ecosystem.",
    body: "A system of animated product panels developed for Microsoft's AI narrative — precise material work, staged lighting, and choreographed motion that translates complex capability into a clean, confident visual language.",
  },
  {
    slug: "sk2",
    title: "Air Force",
    client: "SK-II",
    discipline: "3D",
    category: "Motion",
    year: "2023",
    role: ["3D", "Motion Design"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f0b524e9-2b06-48f5-9392-f90c68c6cfd2/Airforce_01_SKII_Kokeshi_Cheeky_All_ProRes__2023-05-04_16.45.16.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/f0b524e9-2b06-48f5-9392-f90c68c6cfd2/Airforce_01_SKII_Kokeshi_Cheeky_All_ProRes__2023-05-04_16.45.16.jpg",
    ],
    summary: "High-velocity product motion for the SK-II ritual.",
    body: "Kinetic 3D beauty passes for SK-II. Precisely staged product choreography with liquid simulation and macro-level look development.",
  },
  {
    slug: "lamer",
    title: "Chinese New Year",
    client: "La Mer",
    discipline: "3D",
    category: "Campaign",
    year: "2026",
    role: ["Art Direction", "3D"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3a0c93fe-207c-4f97-b002-b63353f52a0c/Untitled+Project_15s_laMerCny_16X9_NIGHT_WIP032_2026-05-13_13.26.27.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/3a0c93fe-207c-4f97-b002-b63353f52a0c/Untitled+Project_15s_laMerCny_16X9_NIGHT_WIP032_2026-05-13_13.26.27.jpg",
    ],
    summary: "A nocturnal seascape reimagined for the Year of the Snake.",
    body: "A CNY campaign for La Mer built around water, light, and a hero product moment. Full CG environments with hand-tuned look development and cinematic lighting.",
  },
  {
    slug: "floret",
    title: "Mt. Floret",
    client: "Mt. Floret",
    discipline: "3D",
    category: "Narrative",
    year: "2024",
    role: ["3D", "Environments", "Look Dev"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/6fe90b86-b59c-493f-8d00-8908994e67c9/Untitled+Project_1110_MtFloret_ProRes4444_01_2024-11-06_16.26.15.png",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/6fe90b86-b59c-493f-8d00-8908994e67c9/Untitled+Project_1110_MtFloret_ProRes4444_01_2024-11-06_16.26.15.png",
    ],
    summary: "A short-form CG narrative built inside a hand-crafted world.",
    body: "Environment design, character look development, and cinematography for a narrative short. Every frame composed for stillness and long dwell time.",
  },
  {
    slug: "nike",
    title: "Tiempo",
    client: "Nike",
    discipline: "3D",
    category: "Graphic",
    year: "2026",
    role: ["3D", "Motion", "Graphic"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/167c782e-efd4-4b3c-8b64-09fd786bf70d/LaMer_04_NikeTiempoGraphic_01_MAIN_A+2_2_2026-05-14_19.17.37.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/167c782e-efd4-4b3c-8b64-09fd786bf70d/LaMer_04_NikeTiempoGraphic_01_MAIN_A+2_2_2026-05-14_19.17.37.jpg",
    ],
    summary: "Graphic-driven product moments for the Tiempo silhouette.",
    body: "A pass of graphic 3D work leaning on strong type, product cutouts, and choreographed camera moves.",
  },
  {
    slug: "espn",
    title: "Basketball",
    client: "ESPN",
    discipline: "3D",
    category: "Broadcast",
    year: "2021",
    role: ["3D", "Broadcast Design"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/d08ffb3b-6ee2-4ee3-8a18-7edce685dd2f/ESPN_01_ESPN_Basketball_02_2021-12-13_18.11.33.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/d08ffb3b-6ee2-4ee3-8a18-7edce685dd2f/ESPN_01_ESPN_Basketball_02_2021-12-13_18.11.33.jpg",
    ],
    summary: "Broadcast package built around the geometry of the game.",
    body: "A 3D broadcast package for ESPN — abstract arena spaces, tuned lighting, and a clean type system for on-air use.",
  },
  {
    slug: "alemais",
    title: "Alemais",
    client: "Alemais",
    discipline: "Film",
    category: "Fashion",
    year: "2026",
    role: ["Direction", "Production"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/32988c0b-b302-48c9-80f2-73c6f6030ba8/Boutique_April_03B.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/32988c0b-b302-48c9-80f2-73c6f6030ba8/Boutique_April_03B.jpg",
    ],
    summary: "A tactile fashion film shot on location.",
    body: "A stills-and-motion package for Alemais built around warm daylight, close-in gesture, and hand-styled sets.",
  },
  {
    slug: "etuui",
    title: "Etuui",
    client: "Etuui",
    discipline: "Film",
    category: "Fashion",
    year: "2026",
    role: ["Direction", "Photography"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/21fcdd78-5afa-4169-af80-830a10b83b31/Boutique_April_02_DSC09800+3_2026-04-25_14.53.01.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/21fcdd78-5afa-4169-af80-830a10b83b31/Boutique_April_02_DSC09800+3_2026-04-25_14.53.01.jpg",
    ],
    summary: "A quiet, sculptural editorial for Etuui.",
    body: "In-camera editorial photography and film for Etuui, art-directed around soft shape and considered pose.",
  },
  {
    slug: "mustang",
    title: "Mustang",
    client: "Mustang",
    discipline: "Film",
    category: "Fashion",
    year: "2026",
    role: ["Direction", "Photography"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/750fe7b7-0796-4ff7-96ba-283002cf810c/Boutique_April_02_image00002_2026-04-3.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/750fe7b7-0796-4ff7-96ba-283002cf810c/Boutique_April_02_image00002_2026-04-3.jpg",
    ],
    summary: "Denim, motion, and desaturated light.",
    body: "A denim-forward campaign built around movement, negative space, and a restrained color palette.",
  },
  {
    slug: "samira",
    title: "Samira",
    client: "Samira",
    discipline: "Film",
    category: "Fashion",
    year: "2025",
    role: ["Direction", "Production"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/b03f2852-3be7-4746-a02c-6a59e92f2713/Thumbnail_Web_06.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/b03f2852-3be7-4746-a02c-6a59e92f2713/Thumbnail_Web_06.jpg",
    ],
    summary: "A portrait film for a rising designer.",
    body: "A short-form portrait film. Long lenses, ambient sound, and a single unbroken narrative through-line.",
  },
  {
    slug: "restless",
    title: "Restless",
    client: "Restless",
    discipline: "Film",
    category: "Narrative",
    year: "2025",
    role: ["Direction", "DP"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/a7db5419-32f9-4347-ae25-7f4d73b1b5b3/Thumbnail_06.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/a7db5419-32f9-4347-ae25-7f4d73b1b5b3/Thumbnail_06.jpg",
    ],
    summary: "A restless character study, shot at dusk.",
    body: "Narrative short. Handheld coverage, practical light, and a color grade built around dying daylight.",
  },
  {
    slug: "yamaha",
    title: "Yamaha",
    client: "Yamaha",
    discipline: "Film",
    category: "Narrative",
    year: "2024",
    role: ["Direction", "Production"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/0762d87e-2afd-4041-a36b-aaa08834f398/Yamaha_Thumbnail_05.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/0762d87e-2afd-4041-a36b-aaa08834f398/Yamaha_Thumbnail_05.jpg",
    ],
    summary: "A brand film built around the sound of the road.",
    body: "A narrative brand film for Yamaha. Location scouting across coastline and mountain pass, cut against a bespoke score.",
  },
  {
    slug: "postman",
    title: "Postman",
    client: "Postman",
    discipline: "Film",
    category: "Narrative",
    year: "2024",
    role: ["Direction"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/61de5390-1f33-4e8c-9009-4b13218122b9/Postman_Still02_17.png",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/61de5390-1f33-4e8c-9009-4b13218122b9/Postman_Still02_17.png",
    ],
    summary: "A short film about routines and small kindnesses.",
    body: "A quiet narrative short. Long takes and unfussy framing built around a single character over one working day.",
  },
  {
    slug: "levis",
    title: "Levi's",
    client: "Levi's",
    discipline: "AI",
    category: "Synthography",
    year: "2025",
    role: ["Synthography", "Art Direction"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/11ce9119-5bc5-46de-bd01-86731820f45a/Levis_01.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/11ce9119-5bc5-46de-bd01-86731820f45a/Levis_01.jpg",
    ],
    summary: "A fully synthetic campaign for a heritage denim brand.",
    body: "A synthography-first campaign — talent, wardrobe, and location all generated and art-directed to brand standards. Delivered without a shoot day.",
  },
  {
    slug: "annemarie",
    title: "EyePas",
    client: "Annemarie Börlind",
    discipline: "AI",
    category: "Beauty",
    year: "2025",
    role: ["Synthography"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/81bd57ad-fb1d-4a8b-aa1f-d00390cc2851/Annamarie_EyePas_02.png",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/81bd57ad-fb1d-4a8b-aa1f-d00390cc2851/Annamarie_EyePas_02.png",
    ],
    summary: "Synthetic beauty imagery for a clean-skincare range.",
    body: "Full-cycle synthography for a beauty product launch — talent, product, and set all generated and art-directed to brand.",
  },
  {
    slug: "juvia",
    title: "Juvia",
    client: "Juvia",
    discipline: "AI",
    category: "Fashion",
    year: "2025",
    role: ["Synthography"],
    hero: "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/c097e017-495e-4dc9-ac3d-667cdf22205a/815+24+290+-+295+%2B+830+22+317+-+295_02.jpg",
    gallery: [
      "https://images.squarespace-cdn.com/content/v1/60719cfcf95b952de10a8f8b/c097e017-495e-4dc9-ac3d-667cdf22205a/815+24+290+-+295+%2B+830+22+317+-+295_02.jpg",
    ],
    summary: "A seasonal fashion capsule shot without a shoot.",
    body: "A synthography capsule for Juvia — location, styling, and talent all generated. Delivered in a fraction of a traditional production timeline.",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getRelated(slug: string, discipline: Project["discipline"]) {
  return projects.filter((p) => p.slug !== slug && p.discipline === discipline).slice(0, 3);
}
