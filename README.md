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
| [Content model](docs/content-model.md) | How exercises, lessons, and progress will be represented as data |
| [Versioning & changelog](docs/versioning.md) | Semver policy and release workflow |
| [Changelog](CHANGELOG.md) | Record of released changes |

## Status

**Phase:** 1 complete — engine spike  
**Next step:** Phase 2 MVP-0 UI — formula tree, scope tap, evaluation on phone (see [roadmap](docs/roadmap.md))

## Development

```bash
npm install
npm test          # run engine unit tests
npm run dev       # dev server (mobile-friendly viewport)
npm run build     # typecheck + production build
```

## Success criterion

The project succeeds if it makes symbolic reasoning easier to practise regularly and reduces the amount of state the learner must retain mentally. A small application that reliably teaches propositional and predicate logic to its creator is sufficient; it does not need to become a commercial platform.
