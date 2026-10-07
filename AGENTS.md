<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Base44 dev environment

- **Stack:** TanStack Start (SSR via nitro) + Vite 8 + React 19, managed with **Bun** (text `bun.lock`, `bunfig.toml`). No database, no backend API, no external credentials required.
- **Run:** `docker compose -f docker-compose.base44.yml up -d`. The `oven/bun:1` service bind-mounts the repo, runs `bun install --frozen-lockfile` on startup, then `vite dev` (SSR) on port 3000 with `--host 0.0.0.0`.
- **Live source check:** the served HTML carries `data-tsd-source="/src/routes/..."` attributes and references `/src/styles.css` — confirms it serves live source, not a prebuilt bundle. Do NOT switch to `vite build`/`vite preview` or a production image.
- **Vite host allowlist:** `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through from the platform env so the preview origin is allowed; do not remove it.
- **Don't mount a volume over `/app/.tanstack`:** the TanStack router generator writes to `.tanstack/tmp` and renames into `src/routeTree.gen.ts`; a separate volume makes that fail with `EXDEV`, so new routes never register (404). `.tanstack/` is git-ignored.
- **No secrets:** this app has no external-service credentials. `.base44/environment.json` lists an empty `secrets` array.

## Playground
- Keep the Playground data array in display order and prepend new entries so the overview and lightbox share the same ordering.
