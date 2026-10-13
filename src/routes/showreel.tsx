import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/showreel")({
  head: () => ({
    meta: [
      { title: "Showreel — Dan Ulv" },
      { name: "description", content: "Dan Ulv showreel — art direction, 3D, motion design, and GenAI." },
    ],
  }),
  component: Showreel,
});

function Showreel() {
  return (
    <main className="min-h-screen bg-background px-6 py-10 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div>
            <div className="text-eyebrow mb-3">Dan Ulv</div>
            <h1 className="text-display text-2xl md:text-4xl">Showreel</h1>
          </div>
          <a
            href="/"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to site
          </a>
        </div>

        <div className="relative aspect-video w-full overflow-hidden bg-black">
          <iframe
            src="https://player.vimeo.com/video/580437144?autoplay=1&title=0&byline=0&portrait=0"
            title="Dan Ulv showreel"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </main>
  );
}
