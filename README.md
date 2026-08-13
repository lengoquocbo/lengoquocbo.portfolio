# Ngo Quoc Bo — Portfolio

Editorial developer portfolio built with React + TypeScript + Vite. No UI framework — plain CSS with custom properties for the token system.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. Build for production with `npm run build`.

## Structure

- `src/App.tsx` — all sections (Header, Hero, About, Work, Experience, Tools, Contact, Footer)
- `src/App.css` — design tokens + styles
- `index.html` — loads Archivo (display), Inter (body), JetBrains Mono (labels/numbers)

## Notes / next steps

- **Hero visual**: `DeveloperScene` in `App.tsx` is a flat SVG placeholder that tilts with the cursor (see `.hero-right` mousemove handler). Swap it for a real Three.js / React Three Fiber `<Canvas>` — the container (`.hero-right` / `.scene`) already has `perspective` set up so a 3D canvas will drop in cleanly.
- **CV files**: links point to `/cv/ngo-quoc-bo-jp.pdf` and `/cv/ngo-quoc-bo-en.pdf`. Put the real PDFs in a `public/cv/` folder.
- **Contact links**: `mailto:`, GitHub and LinkedIn URLs in `Contact()` are placeholders — update with real ones.
- **Project links**: "View project ↗" currently points to `#`; wire up real case-study pages or live URLs.
