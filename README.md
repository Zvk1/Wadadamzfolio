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
- `src/style.css`: shared design tokens, both palettes, typography and responsive layout.
- `src/refinements.css`: appearance controls, data-line animation and theme transitions.
- `src/links.js`: validation for usable profile destinations.
- `src/app.js`: content rendering, dialogs, navigation, and links.
- `src/motion.js`: motion preference, section reveals, and click/tap speed boosts.
- `src/theme.js`: accessible Auto/Light/Dark menu, radial sun/moon transitions, and fallback behavior.
- `src/theme-transition.js`: retains the final clip until snapshots are removed to prevent a light-mode flash.
- `src/pipeline.js`: responsive document-length paths and scroll progress.
- `src/navigation.js`: section navigation; regression checks run with `node --test tests/*.test.js`.
- `public/`: static portrait images and other site assets.

Keep URLs empty until real links are ready; unavailable profile actions stay hidden. Example projects, tools and credentials are placeholders, not claims about you. Dark is the default for new visitors. Auto follows your device, and theme/motion preferences persist locally. Numbered sections use content-sized spacing. Navigation tracks the reading position through Contact; Skills & tools remains part of About.

The borderless portrait is static. `photo` selects the white-shirt portrait for Dark mode; `photoLight` selects the black-shirt portrait for Light mode. Both assets live in `public/`. The profile switches to a compact layout on tablets and phones. The decorative mint data lines remain sparse, respect reduced motion and the Pause control, and recalculate when the content or viewport changes.

## Build for later hosting

Run `npm run build`, then `npm run preview` to preview the production build at **http://127.0.0.1:4173**. The generated `dist/` folder is the deployable site. Edit source files, not `dist/`.

The October 15 refinement is local-only; the earlier private hosted template has not been updated. No domain is required to develop or preview locally.

Fonts use Google Fonts with local fallbacks. Dependencies are locked in `package-lock.json`; use `npm ci` for repeatable installs. Vite documentation: https://vite.dev/guide/


## Verification

Build and all 14 checks pass, covering palette contrast, link validation, design tokens, document targets, assets, navigation, pipeline geometry and theme transitions. Run `node --test tests/*.test.js`. Browser/device visual QA is pending because the browser-control runtime could not start. See [DESIGN-REVIEW.md](DESIGN-REVIEW.md) for the changes, evidence and remaining verification limits.
