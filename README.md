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

- `src/content.js`: name, profile photo, availability, links, projects, CTF entries, certifications.
- `index.html`: introduction, education, location, skills, contact invitation.
- `src/style.css`: base responsive layout.
- `src/refinements.css`: black theme, data-line animation, transitions.
- `src/app.js`: content rendering, dialogs, navigation, and links.
- `src/motion.js`: motion preference, section reveals, and click/tap speed boosts.
- `src/theme.js`: accessible Auto/Light/Dark menu, radial sun/moon transitions, and fallback behavior.
- `src/theme-transition.js`: retains the final clip until snapshots are removed to prevent a light-mode flash.
- `src/pipeline.js`: responsive document-length paths and scroll progress.
- `src/navigation.js`: section navigation; regression checks run with `node --test tests/*.test.js`.
- `public/`: static files such as `resume.pdf`; set the resume link to `/resume.pdf`.

Keep URLs empty until real links are ready. All example projects and credentials are placeholders, not claims about you. Dark is the default for new visitors. The compact Auto/Light/Dark selector remembers your preference; Auto follows your device. The icon-only pause/play control also persists locally. Clicking or tapping briefly boosts the data lines; paused motion and device reduced-motion preferences disable the boost. Numbered sections have viewport-sized spacing, and navigation tracks the reading position through Contact. Skills & tools is part of About. There is no logo. A photo placeholder appears above Computer Engineering, with a compact profile layout on mobile. To replace it, put `profile.jpg` in `public/` and set `photo` to `/profile.jpg` in `src/content.js`. Failed image loads keep the placeholder visible. The decorative data pipeline spans the full document with asymmetric rails, feeder branches, and cross-section routes. Sky-blue packets move at varied speeds in both directions. Flow is intentionally sparse: two outer routes plus two cross-section routes on desktop, and one cross-section route on mobile, with wider gaps between packets. Routes recalculate when content or viewport size changes, and click boosts still work.

## Build for later hosting

Run `npm run build`, then `npm run preview` to preview the production build at **http://127.0.0.1:4173**. The generated `dist/` folder is the deployable site. Edit source files, not `dist/`.

The October 14 refinement is local-only; the earlier private hosted template has not been updated. No domain is required to develop or preview locally.

Fonts use Google Fonts with local fallbacks. Dependencies are locked in `package-lock.json`; use `npm ci` for repeatable installs. Vite documentation: https://vite.dev/guide/


## Verification

Build, source structure, navigation, and pipeline geometry checks pass. Browser/device visual QA is still pending because no browser connection was available. Before external hosting, review phone/tablet/desktop layouts, keyboard menu operation, reduced motion, zoom, orientation changes, and repeated theme switches. API reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
