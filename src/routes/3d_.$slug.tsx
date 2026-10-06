import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProjectTile } from "@/components/ProjectTile";
import { getProject, getRelated, type Project } from "@/data/projects";

export const Route = createFileRoute("/3d_/$slug")({
  loader: ({ params }): Project => {
    const project = getProject(params.slug);
    if (!project || project.discipline !== "3D") throw notFound();
    return project;
  },
  head: ({ loaderData: project }) => ({
    meta: project
      ? [
          { title: `${project.title} — Dropframe` },
          { name: "description", content: project.summary },
          { property: "og:title", content: `${project.title} — Dropframe` },
          { property: "og:description", content: project.summary },
          { property: "og:image", content: project.hero },
          { name: "twitter:title", content: `${project.title} — Dropframe` },
          { name: "twitter:description", content: project.summary },
          { name: "twitter:image", content: project.hero },
        ]
      : [{ title: "Project not found — Dropframe" }],
  }),
  component: ThreeDProject,
});

function ThreeDProject() {
  const project: Project = Route.useLoaderData();
  const related = getRelated(project.slug, "3D");

  return (
    <div className="pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pb-12 md:pb-16">
        <Link to="/3d" className="text-eyebrow hover:text-foreground transition-colors">
          ← All 3D projects
        </Link>
        <div className="text-eyebrow mt-10 mb-6">3D / {project.category}</div>
        <h1 className="text-display text-[12vw] md:text-[6.75vw] leading-[0.9] opacity-80">
          {project.title}
        </h1>
        <p className="mt-8 max-w-2xl text-muted-foreground">{project.summary}</p>
      </section>

      <section
        aria-label={`${project.title} media`}
        className="mx-auto max-w-[1600px] px-6 md:px-10"
      >
        {project.vimeoId ? (
          <ProjectVideo
            vimeoId={project.vimeoId}
            title={`${project.title} — film`}
            hash={project.vimeoHash}
          />
        ) : (
          <img src={project.hero} alt={project.title} className="w-full h-auto" />
        )}
        {project.videoRow?.length ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.videoRow.map((vimeoId, index) => (
              <ProjectVideo
                key={vimeoId}
                vimeoId={vimeoId}
                title={`${project.title} — animation ${index + 1}`}
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
        <dl className="space-y-6">
          <div>
            <dt className="text-eyebrow mb-2">Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt className="text-eyebrow mb-2">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="text-eyebrow mb-2">Role</dt>
            <dd>{project.role.join(" / ")}</dd>
          </div>
        </dl>
        <div className="md:col-span-2">
          <h2 className="text-eyebrow mb-6">About the project</h2>
          <p className="max-w-3xl text-muted-foreground whitespace-pre-line">{project.body}</p>
          {project.credits?.length ? (
            <div className="mt-12 border-t border-border pt-6">
              <h2 className="text-eyebrow mb-6">Credits</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {project.credits.map((credit, index) => (
                  <div key={`${credit.role}-${index}`}>
                    <dt className="text-eyebrow mb-2">{credit.role}</dt>
                    <dd>{credit.name}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </section>

      {project.gallery.length > 0 ? (
        <section
          aria-label={`${project.title} gallery`}
          className="mx-auto max-w-[1600px] px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"
        >
          {project.gallery.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${project.title} — still ${index + 1}`}
              loading="lazy"
              className="w-full h-auto self-start"
            />
          ))}
        </section>
      ) : null}

      <section className="mx-auto max-w-[1600px] px-6 md:px-10 mt-16 md:mt-24">
        <h2 className="text-eyebrow border-t border-border pt-6 mb-10">More 3D projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {related.map((item) => (
            <Link
              key={item.slug}
              to="/3d/$slug"
              params={{ slug: item.slug }}
              className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
            >
              <ProjectTile image={item.hero} title={item.title} meta={item.category} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProjectVideo({ vimeoId, title, hash }: { vimeoId: string; title: string; hash?: string }) {
  const query = new URLSearchParams({ title: "0", byline: "0", portrait: "0" });
  if (hash) query.set("h", hash);

  return (
    <div className="relative aspect-video bg-muted">
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?${query}`}
        title={title}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
