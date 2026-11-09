# \_manyuuu portfolio

A personal portfolio starter based on the original `www` SvelteKit project. The original GPL-3.0 license is retained. The interface and styling are preserved; the content has been replaced with neutral examples.

## stack

- SvelteKit 2 and Svelte 5, rendered as a fully prerendered static site
- Vite, mdsvex, Shiki, and `@sveltejs/enhanced-img`
- Bun with the checked-in `bun.lockb`
- GitHub Pages deployment through GitHub Actions

## local development

Install dependencies and start the Vite dev server:

```sh
bun install --frozen-lockfile
bun run dev
```

Build the static site locally:

```sh
bun run build
```

The output is written to `build/`. To check the built files locally, run `bun run preview`.

## GitHub Pages deployment

The `.github/workflows/pages.yml` workflow builds on pushes to `main` or `master` and can also be started manually from the Actions tab. It selects an empty base path for a `username.github.io` repository and `/<repository>` for a project site, then deploys the `build/` artifact with GitHub Pages' official actions. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

For a local project-site build, set `BASE_PATH=/repository-name` before `bun run build`. A root deployment uses an empty `BASE_PATH`. All pages are generated at build time with trailing-slash directory output, so direct page refreshes are served as static `index.html` files. GitHub Pages cannot run the Cloudflare Worker, Convex refresh, or server APIs at request time.

The canonical URL, Open Graph URLs, and RSS feed use `https://abhimanyuuuuu.github.io` with the configured base path.

The Inspo page reads its one-item fixture from `static/inspo.json`; update that file to change the example. The contribution graph reads `static/github.json`, which contains a zero-activity fixture because live GitHub data depends on the Cloudflare Worker. The About page's `emailAddress` value controls its public mailto link.

## content guide

### Add a project

Create `src/content/projects/<slug>/+<slug>.md`, and put its images in that same folder. Keep `published`, `name`, `description`, `thumbnail`, `images`, and `date`; `github` and `website` may be left empty until you have real HTTPS URLs. Empty or non-URL values do not render as links. `thumbnail` and each `images` item must name an image file in the project folder; the first image is also used for social metadata. The project detail page supports additional markdown files in that folder for linked documents.

The retained sample project also includes `src/content/projects/tabletop/details.md` as a supplementary document-route example; it is not a second project.

### Add a blog post

Create `src/content/blog/<slug>/+<slug>.md`. Copy `src/content/blog/platonic/+platonic.md` and update `published`, `name`, `icon`, `description`, `date`, and optional `tags` and `author`. The directory name determines the URL slug. Use standard Markdown and Svelte components through mdsvex. If you add `ogImage` metadata, keep the image in the same post directory.

### Add a photograph

Copy one supported image file (`.avif`, `.gif`, `.heif`, `.jpeg`, `.jpg`, `.png`, `.tiff`, or `.webp`) into `src/content/images/`. The photos page discovers files from that directory automatically and creates responsive image variants at build time. The current gallery does not read per-photo captions or dates.

### Add an inspiration entry

Edit `static/inspo.json` and append an object to `items`, preserving the existing fields: `id`, `collection`, `type`, `title`, `url`, `content`, `imageUrl`, `imageWidth`, `imageHeight`, and `dateAdded`. For a text card, use `type: "text"`, provide `content`, and leave image fields null. For an image or URL card, set `type` to `url` and provide `url`, `imageUrl`, and the source image dimensions. Update `collections` when adding a collection. The page's masonry columns and responsive behavior are unchanged.

## deployment limits

Static GitHub Pages cannot execute `worker/index.js`, Cloudflare KV or cron, the Convex-backed collection refresh, request-time server endpoints, or server file-system code. Inspo and the contribution graph therefore use checked-in JSON fixtures, and contact relies on the visitor's email client. The Cloudflare configuration and Worker source remain as optional reference only; its KV ID is a placeholder and the Pages workflow does not use it.
