import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, getRelated } from "@/data/projects";
import { useState, useEffect, useCallback } from "react";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Not found — Dropframe" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    const title = `${p.title} — DROPFRAME`;
    return {
      meta: [
        { title },
        { name: "description", content: p.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: p.summary },
        { property: "og:image", content: p.hero },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: p.hero },
      ],
    };
  },
  component: WorkPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <div className="text-center">
        <div className="text-eyebrow mb-4">404</div>
        <h1 className="text-display text-4xl mb-6">Project not found</h1>
        <Link to="/" className="text-eyebrow underline underline-offset-4">Back to Info</Link>
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <p className="text-muted-foreground">Something went wrong loading this project.</p>
    </div>
  ),
});

function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: number) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        className="absolute top-6 right-6 text-foreground/60 hover:text-foreground transition-colors text-2xl"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ✕
      </button>
      <button
        className="absolute left-4 md:left-8 text-foreground/60 hover:text-foreground transition-colors text-3xl"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(-1);
        }}
      >
        ‹
      </button>
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 md:right-8 text-foreground/60 hover:text-foreground transition-colors text-3xl"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(1);
        }}
      >
        ›
      </button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-eyebrow">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

function WorkPage() {
  const { project } = Route.useLoaderData();
  const related = getRelated(project.slug, project.discipline);
  const disciplineHref =
    project.discipline === "3D" ? "/3d" : project.discipline === "Film" ? "/film" : "/ai";

  const galleryImages = project.gallery.length > 1 ? project.gallery.slice(1) : [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const navigateLightbox = useCallback(
    (dir: number) => {
      setLightboxIndex((prev) => {
        if (prev === null) return prev;
        return (prev + dir + galleryImages.length) % galleryImages.length;
      });
    },
    [galleryImages.length],
  );

  return (
    <article className="pt-32">
      {/* Header */}
      <header className="mx-auto max-w-[1600px] px-6 md:px-10 pb-12 md:pb-20">
        <div className="flex items-center gap-3 text-eyebrow mb-8">
          <Link to={disciplineHref} className="hover:text-foreground transition-colors">
            {project.discipline}
          </Link>
          <span>/</span>
          <span>{project.category}</span>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <h1 className="text-display text-[1.8rem] md:text-[3rem] leading-[1.05]">
              {project.title}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:pt-4">
            <p className="text-muted-foreground">{project.summary}</p>
          </div>
        </div>
      </header>

      {/* Video / Hero */}
      {project.vimeoId ? (
        <div className="mx-auto max-w-[1800px] px-6 md:px-10">
          <div className="relative aspect-video overflow-hidden bg-black">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}${project.vimeoHash ? `/${project.vimeoHash}` : ""}?title=0&byline=0&portrait=0`}
              title={`${project.client} — ${project.title}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1800px] px-6 md:px-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
            <img
              src={project.hero}
              alt={`${project.client} — ${project.title}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body + metadata */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-20 md:py-32 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4">
          <div className="text-eyebrow border-t border-border pt-6">Discipline</div>
          <div className="mt-2 mb-6">{project.discipline}</div>
          <div className="text-eyebrow border-t border-border pt-6">Role</div>
          <ul className="mt-2 mb-6 space-y-1">
            {project.role.map((r: string) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="text-eyebrow border-t border-border pt-6 mb-8">On this project</div>
          <p className="leading-relaxed">{project.body}</p>
        </div>
      </section>

      {/* Gallery */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-[1800px] px-6 md:px-10 pb-20 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((src: string, i: number) => (
              <button
                key={i}
                className="relative aspect-[16/9] overflow-hidden bg-muted cursor-pointer group"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Credits */}
      {project.credits && project.credits.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-20 md:pb-32">
          <div className="text-eyebrow border-t border-border pt-6 mb-10">Credits</div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            {project.credits.map((c: { role: string; name: string }, i: number) => (
              <div key={i} className="flex items-baseline gap-6 border-b border-border/60 py-3">
                <dt className="text-eyebrow flex-shrink-0 min-w-[180px]">{c.role}</dt>
                <dd className="text-sm text-foreground/90">{c.name}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-24 border-t border-border">
          <div className="flex items-baseline justify-between mb-10">
            <div className="text-eyebrow">More {project.discipline}</div>
            <Link to={disciplineHref} className="text-eyebrow hover:text-foreground transition-colors">
              All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {related.map((r: (typeof related)[number]) => (
              <Link
                key={r.slug}
                to="/work/$slug"
                params={{ slug: r.slug }}
                className="group block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={r.hero}
                    alt={`${r.client} — ${r.title}`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>{r.client}</div>
                  <div className="text-eyebrow">{r.category}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </article>
  );
}
