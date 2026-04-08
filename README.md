# alexfilimon.dev

Personal portfolio site — link-in-bio page with multilingual support (EN/RU).

## Tech Stack

- [Astro 5](https://astro.build/) — static site framework
- [React 19](https://react.dev/) — interactive islands (theme toggle)
- [Tailwind CSS 3](https://tailwindcss.com/) — utility-first styling
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

## Theme Selection

Visit `/themes/` locally to compare 10 color/design themes. After choosing, update CSS variables in `src/styles/globals.css`.
