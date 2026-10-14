# Cybersecurity portfolio

A local-first portfolio using JavaScript, Vite, and CSS. Node.js runs the development tools; the finished website is static and can later use a custom domain.

## Run locally

From this directory in PowerShell:

```powershell
.\start-local.cmd
```

The launcher uses the bundled Node runtime in `../runtime` when available. Open **http://127.0.0.1:5173**. Changes refresh automatically. Press Ctrl+C to stop.

With Node.js 22.12+ installed, use `npm install` then `npm run dev`.

## Edit your portfolio

- `src/content.js`: name, availability, links, projects, CTF entries, certifications.
- `index.html`: introduction, education, location, skills, contact invitation.
- `src/style.css`: base responsive layout.
- `src/refinements.css`: black theme, data-line animation, transitions.
- `src/app.js`: content rendering, dialogs, navigation, and links.
- `src/motion.js`: motion preference and section reveals.
- `public/`: static files such as `resume.pdf`; set the resume link to `/resume.pdf`.

Keep URLs empty until real links are ready. All example projects and credentials are placeholders, not claims about you. The black theme is the default. The Pause motion control persists locally; device reduced-motion preferences disable animation automatically.

## Build for later hosting

Run `npm run build`, then `npm run preview` to preview the production build at **http://127.0.0.1:4173**. The generated `dist/` folder is the deployable site. Edit source files, not `dist/`.

The October 14 refinement is local-only; the earlier private hosted template has not been updated. No domain is required to develop or preview locally.

Fonts use Google Fonts with local fallbacks. Dependencies are locked in `package-lock.json`; use `npm ci` for repeatable installs. Vite documentation: https://vite.dev/guide/
