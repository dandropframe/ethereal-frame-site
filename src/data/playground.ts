import cottonAsset from "@/assets/playground-cotton.webp.asset.json";

export type PlaygroundItem = {
  slug: string;
  title: string;
  meta: string;
  type: "video" | "image";
  /** Full-size media shown in the grid and lightbox. */
  src: string;
  /** Still frame used as the video poster (images use `src` directly). */
  poster?: string;
};

const video = (slug: string, title: string): PlaygroundItem => ({
  slug,
  title,
  meta: "Motion",
  type: "video",
  src: `/playground/${slug}.mp4`,
  poster: `/playground/${slug}-poster.webp`,
});

export const playground: PlaygroundItem[] = [
  // New additions belong at the beginning, preserving newest-first order.
  {
    slug: "landor-cotton",
    title: "Landor Cotton",
    meta: "Still",
    type: "image",
    src: cottonAsset.url,
  },
  video("xp-cubepanel-b", "XP Cube Panel B"),
  video("xp-cubepanel-05", "XP Cube Panel 05"),
  {
    slug: "whale-curl",
    title: "Whale Curl",
    meta: "Still",
    type: "image",
    src: "/playground/whale-curl.webp",
  },
  video("jiggle-wheel", "Jiggle Wheel"),
  video("glitch-rgb", "Glitch RGB"),
  video("36days-02", "36 Days 02"),
  video("36days-01", "36 Days 01"),
];
