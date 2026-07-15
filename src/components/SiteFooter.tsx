export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="text-display text-4xl md:text-5xl">
            Let's make<br />something.
          </div>
          <a
            href="mailto:anastasiia@dropframe.site?cc=dan@dropframe.site"
            className="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>Get in touch</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
        <div>
          <div className="text-eyebrow mb-4">Contact</div>
          <div className="space-y-1 text-sm">
            <div className="text-muted-foreground">General</div>
            <a href="mailto:anastasiia@dropframe.site" className="block hover:text-accent transition-colors">anastasiia@dropframe.site</a>
            <div className="text-muted-foreground mt-3">Fashion & Content</div>
            <a href="mailto:alice@dropframe.site" className="block hover:text-accent transition-colors">alice@dropframe.site</a>
          </div>
        </div>
        <div>
          <div className="text-eyebrow mb-4">Follow</div>
          <ul className="space-y-2 text-sm">
            <li><a href="https://www.instagram.com" className="hover:text-accent transition-colors">Instagram ↗</a></li>
            <li><a href="https://www.behance.net" className="hover:text-accent transition-colors">Behance ↗</a></li>
            <li><a href="https://www.linkedin.com" className="hover:text-accent transition-colors">LinkedIn ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-6 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          <span>© {new Date().getFullYear()} Dropframe</span>
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
