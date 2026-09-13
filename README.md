# alexfilimon.dev

Personal portfolio site — link-in-bio page with multilingual support (EN/RU).

## Tech Stack

- [Astro 5](https://astro.build/) — static site framework
- [React 19](https://react.dev/) — interactive islands (theme toggle)
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling
- [astro-icon](https://github.com/natemoo-re/astro-icon) — SVG icons (Lucide + Simple Icons)

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output to dist/
npm run preview   # preview the build
```

## Localization

- English: `/` (default, no prefix)
- Russian: `/ru/`
- Translation files: `src/i18n/translations/{en,ru}.json`

## Deployment

Deployed to GitHub Pages via GitHub Actions on push to `main`.
Custom domain: `alexfilimon.dev` (configured via `public/CNAME`).

## Design and logos

The RU/EN homepages use `src/components/portfolio/HomePage.astro`. Shared branding
and navigation are in `src/styles/brand.css` and `SiteHeader.astro`; page and gallery
styles live in `src/styles/portfolio.css`, `consulting.css`, and `photo-gallery.css`.
The site uses the Apple system font with Inter as fallback (body 400, headings 600).

Both logos use Rubik 400 and the header accent `#40BC50`:

- `public/logo-full.svg`: `alexfilimon.dev`, with green `.dev`.
- `public/logo-small.svg`: `af.`, with a green dot.
- `public/favicon.svg`: the small logo on a rounded white background.

The SVG logos contain outlines and do not require an installed font.
`BrandLogo.astro` renders the matching responsive text logo in the site header.

## Consultation pages and photography

Consultation overviews are published at `/consulting/` and `/ru/consulting/`.
Service cards link directly to Telegram. Detail pages remain in `src/pages` and
are available only through `npm run dev`; their `getStaticPaths()` returns no
routes in production, so they are absent from the build and sitemap. To publish
them later, remove the `import.meta.env.DEV` guards in both `[service].astro` files
and restore the service links. English copy is in `src/data/consulting-en.ts`;
Russian copy is in `src/data/consulting.ts`. Global Talent Visa remains Russian
only. Its language switch links to the English consultation overview.

Both homepages use `src/components/portfolio/PhotoGallery.astro`. All 23 supplied
photos are in `src/assets/gallery/`; update `src/data/photos.ts` to change the
selection and localized alternative text. Astro generates responsive WebP images
at build time.

The gallery advances every six seconds while visible, pauses on hover, keyboard
focus, or a hidden tab, and includes a pause button. Reduced motion disables
autoplay. Arrow controls appear on hover or focus and remain visible on touch
screens; keyboard arrows and horizontal swipes also navigate. The homepage uses
the zoom transition; pointer gestures track the drag and settle into a slide.
Each page load shuffles the complete photo set; the order wraps unchanged until
reload. Session storage avoids repeating the previous first photo when available.
