import { createFileRoute } from "@tanstack/react-router";
const SITE_URL = "https://ethereal-frame-site.lovable.app";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Dan Ulv" },
      {
        name: "description",
        content:
          "Dan Ulv — Design Director specialising in 3D and motion for fashion, cosmetics, and technology brands. From concept to final frame.",
      },
      { property: "og:title", content: "About — Dan Ulv" },
      { property: "og:description", content: "Concept-driven 3D and motion, grounded in craft." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: `${SITE_URL}/about`,
          name: "About — Dan Ulv",
          about: { "@id": `${SITE_URL}/#person` },
          mainEntity: {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: profile.name,
            alternateName: "DAN ULV",
            jobTitle: profile.role,
            image: profile.image,
            description: profile.bio,
            email: "dan@dropframe.site",
            url: SITE_URL,
          },
        }),
      },
    ],
  }),
  component: About,
});

const profile = {
  name: "Dan Ulv",
  role: "Design Director",
  image: "/images/Mexico_City_Feb_2026__DSF8729-22.jpg",
  bio: "With over a decade of experience in 3D animation, motion design, and art direction, I bring a meticulous and concept-driven approach to visual storytelling. My practice is grounded in the craft of composition, lighting, materials, and movement. From shaping a visual language to refining the smallest detail, I combine design judgement with technical precision to build expressive 3D worlds and motion from concept through final execution.",
};

function About() {
  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-24 md:pb-40">
        <div className="text-eyebrow mb-8">Philosophy</div>
        <h1 className="text-display text-[1.8rem] md:text-[3rem] leading-[1.05]">
          Craft leads.
          <br />
          <span className="text-muted-foreground">Technology follows.</span>
        </h1>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-12 gap-6 pb-24 md:pb-40 border-y border-border py-16">
        <div className="col-span-12 md:col-span-4 text-eyebrow">My Practice</div>
        <div className="col-span-12 md:col-span-8 space-y-6 text-lg leading-relaxed">
          <p>
            I’m Dan Ulv, a Design Director working across fashion, cosmetics, technology, and beyond. I design and build 3D imagery,
            animation, and motion graphics — all driven by the same creative direction.
          </p>
          <p className="text-muted-foreground">
            My foundation is in the craft of 3D and motion. I shape composition, lighting,
            materials, and movement with care, building visual worlds that balance a clear idea with
            precise execution — from the first styleframe to the final render.
          </p>
          <p className="text-muted-foreground">
            I take on projects where creative direction makes a difference. When a project demands
            it, I draw on a network of trusted 3D artists, motion designers, and technical
            specialists. The creative direction stays consistent. The capacity scales with the
            brief.
          </p>
          <p className="text-muted-foreground">
            I am a creative partner for the next era of visual storytelling.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-12 gap-6 py-16 border-b border-border items-center">
        <div className="col-span-12 md:col-span-4 text-eyebrow">Selected Clients</div>
        <div className="col-span-12 md:col-span-8 flex items-center">
          <img
            src="/images/LOGO_ROW_02.png"
            alt="Client logos: La Mer, Nike, Adobe, ESPN, Juvia, Microsoft, SK-II, Colgate, Lenor"
            width={1600}
            height={120}
            decoding="async"
            className="w-full h-auto opacity-70"
          />
        </div>
      </section>
    </div>
  );
}
