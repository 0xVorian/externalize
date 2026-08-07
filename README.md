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
| [Authoring guide](docs/authoring.md) | How to add lessons and exercises (worked examples, checklist) |
| [Versioning & changelog](docs/versioning.md) | Semver policy and release workflow |
| [Internationalization](docs/i18n.md) | Independent EN/FR academic copy (not translation) |
| [Presentation](docs/presentation.md) | When to use truth tables vs parse trees, layout rules |
| [Predicate logic (Phase 6 prep)](docs/predicate-logic.md) | AST extension, notation, engine impact — design only |
| [Changelog](CHANGELOG.md) | Record of released changes |

## Status

**Phase:** Level 0 learn path + gated practice  
**Next step:** Complete Level 0 on your phone, then try the unlocked practice tab

## Development

```bash
npm install
npm test          # run engine unit tests
npm run dev       # dev server (mobile-friendly viewport)
npm run build          # typecheck + production build
```

## Deploy (Cloudflare Pages)

Connect the GitHub repository in Cloudflare Pages with:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `20` (or set `NODE_VERSION=20`) |

No environment variables required for MVP-0. Progress is stored in the browser (`localStorage`).

After deploy, open the Pages URL on your phone to run the week test.

## Success criterion

The project succeeds if it makes symbolic reasoning easier to practise regularly and reduces the amount of state the learner must retain mentally. A small application that reliably teaches propositional and predicate logic to its creator is sufficient; it does not need to become a commercial platform.
