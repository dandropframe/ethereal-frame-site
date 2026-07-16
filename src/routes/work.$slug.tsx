import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, getRelated } from "@/data/projects";

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
    const title = `${p.client} — ${p.title} — Dropframe`;
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

function WorkPage() {
  const { project } = Route.useLoaderData();
  const related = getRelated(project.slug, project.discipline);
  const disciplineHref =
    project.discipline === "3D" ? "/3d" : project.discipline === "Film" ? "/film" : "/ai";

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
          <span>/</span>
          <span>{project.year}</span>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="text-eyebrow mb-4">{project.client}</div>
            <h1 className="text-display text-5xl md:text-[7vw] leading-[0.9]">
              {project.title}
            </h1>
          </div>
          <div className="col-span-12 md:col-span-4 md:pt-4">
            <p className="text-muted-foreground">{project.summary}</p>
          </div>
        </div>
      </header>

      {/* Hero image */}
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={project.hero}
            alt={`${project.client} — ${project.title}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Vimeo embed */}
      {project.vimeoId && (
        <section className="mx-auto max-w-[1800px] px-6 md:px-10 py-12 md:py-20">
          <div className="relative aspect-video overflow-hidden bg-black">
            <iframe
              src={`https://player.vimeo.com/video/${project.vimeoId}?title=0&byline=0&portrait=0`}
              title={`${project.client} — ${project.title}`}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </section>
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
          <div className="text-eyebrow border-t border-border pt-6">Year</div>
          <div className="mt-2">{project.year}</div>
        </div>
        <div className="col-span-12 md:col-span-8">
          <div className="text-eyebrow border-t border-border pt-6 mb-8">On this project</div>
          <p className="text-display text-2xl md:text-3xl leading-[1.2]">{project.body}</p>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery.length > 1 && (
        <section className="mx-auto max-w-[1800px] px-6 md:px-10 pb-20 md:pb-32 space-y-6 md:space-y-10">
          {project.gallery.slice(1).map((src: string, i: number) => (
            <div key={i} className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ))}
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
    </article>
  );
}
