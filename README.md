# Externalize

A local-first, mobile-first web application for learning symbolic logic through short lessons, immediate feedback, and visible intermediate steps. Optimized for phone browsers; scales up to tablet and desktop.

The primary user is the repository owner. The design compensates for difficulty holding large symbolic structures in working memory rather than assuming the learner can mentally retain an entire derivation.

## Documentation

Start here:

| Document | Purpose |
|----------|---------|
| [Vision & brief](docs/vision.md) | Original concept, learning path, exercise types, success criterion |
| [Design principles](docs/design-principles.md) | Non-negotiable UX and pedagogical constraints |
| [Technical decisions](docs/decisions.md) | Platform, architecture, notation, and open questions with current answers |
| [Roadmap](docs/roadmap.md) | Build order, MVP scope, and first prototype |
| [Future work plan](docs/future-work-plan.md) | Proactive content/engine prep and agent batch plan (not the app roadmap) |
| [Content model](docs/content-model.md) | How exercises, lessons, and progress are represented as data |
| [Progress visibility](docs/progress-visibility.md) | Capability states, practice sessions, and progress moments |
| [Authoring guide](docs/authoring.md) | How to add lessons and exercises (worked examples, checklist) |
| [Versioning & changelog](docs/versioning.md) | Semver policy and release workflow |
| [Internationalization](docs/i18n.md) | Independent EN/FR academic copy (not translation) |
| [Testing](docs/testing.md) | Vitest unit tests and Playwright smoke suite |
| [Presentation](docs/presentation.md) | When to use truth tables vs parse trees, layout rules |
| [Predicate logic (Phase 6 prep)](docs/predicate-logic.md) | AST extension, notation, engine impact — design only |
| [Changelog](CHANGELOG.md) | Record of released changes |

## Status

**Implemented:** Three propositional-logic learning units; sequential graded practice for evaluation, scope, truth tables, counterexamples, tautologies, translation, and introductory proof steps; local progress, SRS, and export/import.

**Experimental:** The small natural-deduction exercise set and predicate-logic AST/parser spike. Predicate-logic curriculum remains design-only.

**Current focus:** Sustained personal use and validation of the repaired attempt/progress semantics.

## Development

```bash
npm install
npm test          # Vitest unit tests
npm run test:e2e  # Playwright smoke tests (build + preview)
npm run dev       # dev server (mobile-friendly viewport)
npm run build     # typecheck + production build
```

See [Testing](docs/testing.md) for dev-server e2e mode, CI notes, and smoke coverage.

## Deploy (Cloudflare Pages)

Connect the GitHub repository in Cloudflare Pages with:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `20` (or set `NODE_VERSION=20`) |

No environment variables required for MVP-0. Progress is stored in the browser (`localStorage`).

After deploy, open the Pages URL on your phone to run the week test.

## Install as PWA (home screen)

Externalize ships a web app manifest and a lightweight service worker that caches the app shell (HTML, manifest, icons). Progress still lives in `localStorage` on each device — use Progress → Export/Import to move between installs.

**Android (Chrome):** open the site → menu (⋮) → **Install app** or **Add to Home screen**.

**iOS (Safari):** open the site → Share → **Add to Home Screen**.

**Desktop (Chrome / Edge):** install icon in the address bar, or browser menu → **Install Externalize**.

Requires HTTPS (or `localhost` during development). After install, the app opens standalone without the browser chrome.

## Success criterion

The project succeeds if it makes symbolic reasoning easier to practise regularly and reduces the amount of state the learner must retain mentally. A small application that reliably supports its creator's propositional-logic practice is sufficient; it does not need to become a commercial platform. Predicate-logic teaching remains future work.
