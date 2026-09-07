# Externalize

A local-first, mobile-first web application for learning symbolic logic through short lessons, immediate feedback, and visible intermediate steps. Optimized for phone browsers; scales up to tablet and desktop.

The primary user is the repository owner. The design compensates for difficulty holding large symbolic structures in working memory rather than assuming that the learner can mentally retain an entire derivation.

## Documentation

Start here:

| Document | Purpose |
|----------|---------|
| [Agent operating guide](AGENTS.md) | Repository-wide instructions, current execution boundary, tests, and multi-agent coordination rules |
| [Session-first UX plan](docs/session-first-ux.md) | Current authorized product/UX direction: bounded sessions, low-intimidation entry, progressive terminology, and re-entry |
| [Session-first multi-agent brief](docs/agent-brief-session-first-ux.md) | Ready-to-use implementation brief for a coordinator + subagents |
| [Vision & brief](docs/vision.md) | Original concept, learning path, exercise types, success criterion |
| [Roadmap](docs/roadmap.md) | Current shipped baseline, authorized UX/adaptive work, and validation gates |
| [Adaptive curriculum implementation roadmap](docs/adaptive-curriculum-implementation.md) | Implemented route/evidence/migration/Sobel/planner architecture that the UX work must preserve |
| [Adaptive curriculum](docs/adaptive-curriculum.md) | Concept-graph + route + source-pack architecture and rationale |
| [Adaptive curriculum multi-agent brief](docs/agent-brief-adaptive-curriculum.md) | Historical execution brief for the now-implemented adaptive pilot |
| [Logic and Theism curriculum map](docs/curricula/logic-and-theism.md) | First real source map and proving ground for adaptive routing |
| [Logic and Theism detailed maps](docs/curricula/logic-and-theism/README.md) | Section-level chapter maps and reusable machinery inventory |
| [Engagement/durable-learning synthesis](docs/research/engagement-learning/synthesis.md) | Research findings, disagreements, open questions, and engagement cautions |
| [Design principles](docs/design-principles.md) | Non-negotiable UX and pedagogical constraints |
| [Technical decisions](docs/decisions.md) | Platform, architecture, notation, and open questions with current answers |
| [Content model](docs/content-model.md) | How exercises, lessons, and progress are represented as data |
| [Progress visibility](docs/progress-visibility.md) | Capability states, practice sessions, and progress moments |
| [Authoring guide](docs/authoring.md) | How to add lessons and exercises (worked examples, checklist) |
| [Versioning & changelog](docs/versioning.md) | Semver policy and release workflow |
| [Internationalization](docs/i18n.md) | Independent EN/FR academic copy (not translation) |
| [Testing](docs/testing.md) | Vitest unit tests and Playwright smoke suite |
| [Presentation](docs/presentation.md) | When to use truth tables vs parse trees, layout rules |
| [Predicate logic (Phase 6 prep)](docs/predicate-logic.md) | AST extension, notation, engine impact — design/engine groundwork only |
| [Changelog](CHANGELOG.md) | Record of released and unreleased changes |

For current implementation work, treat `AGENTS.md`, `docs/session-first-ux.md`, the adaptive implementation roadmap, and `docs/roadmap.md` as the controlling documents. Older design briefs and phase plans may intentionally describe pre-implementation states.

## Status

**Implemented:** Three propositional-logic learning units; sequential graded practice for evaluation, scope, truth tables, counterexamples, tautologies, translation, and introductory proof steps; local progress, SRS, export/import, Explore mode, PWA support, evidence-backed progress visibility, explicit learning routes, portable concept × capability evidence, and the narrow *Logic and Theism* Chapter II source-driven pilot with deterministic prerequisite planning.

**Experimental:** The small natural-deduction exercise set and predicate-logic AST/parser spike. Predicate-logic curriculum remains design-only beyond the narrow Chapter II teaching slice.

**Current focus:** Session-first, low-intimidation UX. The normal learner experience should become one obvious bounded round whose effort is visible before start, with quieter chrome, planner internals hidden, meaning introduced before intimidating terminology where possible, and learning-aligned re-entry after a gap. See [`docs/session-first-ux.md`](docs/session-first-ux.md).

## Development

```bash
npm install
npm test          # Vitest unit tests
npm run test:e2e  # Playwright smoke tests (build + preview)
npm run dev       # dev server (mobile-friendly viewport)
npm run build     # typecheck + production build
```

For a clean full verification run:

```bash
npm ci
npm test
npm run build
npm run test:e2e
```

See [Testing](docs/testing.md) for dev-server e2e mode, CI notes, and smoke coverage.

## Deploy (Cloudflare Pages)

Connect the GitHub repository in Cloudflare Pages with:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `22` (or set `NODE_VERSION=22`) |

No environment variables required. Progress is stored in the browser (`localStorage`).

After deploy, open the Pages URL on your phone to run the real-use validation.

## Install as PWA (home screen)

Externalize ships a web app manifest and a service worker that pre-caches the built app shell, refreshes navigation from the network when available, and falls back to the cached shell offline. Progress still lives in `localStorage` on each device — use Progress → Export/Import to move between installs.

**Android (Chrome):** open the site → menu (⋮) → **Install app** or **Add to Home screen**.

**iOS (Safari):** open the site → Share → **Add to Home Screen**.

**Desktop (Chrome / Edge):** install icon in the address bar, or browser menu → **Install Externalize**.

Requires HTTPS (or `localhost` during development). After install, the app opens standalone without the browser chrome.

## Success criterion

The project succeeds if it makes formal reasoning easier to practise and use in the material the learner actually wants to understand, while reducing the amount of intermediate state the learner must retain mentally.

The immediate UX gate is:

> **Can a learner open Externalize and feel that doing one round is trivially reasonable, even when the reasoning inside the round is genuinely difficult?**

The adaptive-curriculum architecture still earns its complexity only if it reuses demonstrated knowledge across routes, supplies missing prerequisites just in time, and gets the learner back into the chosen source faster than a separate fixed syllabus would.