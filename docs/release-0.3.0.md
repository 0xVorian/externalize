# Release 0.3.0 — prep checklist

**Target version:** `0.3.0`  
**Current `package.json` version:** `0.2.0` (unchanged until cut)  
**Base tag:** `v0.2.0` (2026-08-07)  
**Prep branch:** `feature/release-0.3.0-prep`

This document is for the parent orchestrator. Parallel agents may still append bullets under `CHANGELOG.md` `[Unreleased]` — do not cut the release until all integration branches are merged and the changelog is re-audited.

---

## Release notes draft (user-facing)

Externalize **0.3.0** turns the MVP-0 exercise shell into a guided learning app with two units of lessons, richer practice, and progress you can carry between devices.

### Learn

- **Learn / Practice tabs** — new users start in Learn; Practice unlocks after Level 0.
- **Level 0** (5 lessons): sentence letters, truth values, conjunction, watch mode, guided try.
- **Level 1 — Unit 1 Connectives** (12 lessons): ¬, ∨, →, ↔ with concept cards, truth-table watch lessons, and guided live-row tries.
- **2×2 watch grid** for binary formulas; generalized truth-table lesson renderer.
- Collapsible **operator reference** during lessons; end of Unit 0 offers “Continue to Unit 1”.

### Practice

- **20 exercises**: 11 main-connective (scope) + 9 evaluate-formula (including nested structure).
- **Fill-truth-table** exercises (`tt-001`–`tt-005`) with partial-table UI.
- **Translation MVP** (`translate-001`): symbol palette, builder compile, feedback.
- Tiered unlock via **prerequisites graph**; flat binary formulas use live truth-table rows.

### Progress & install

- **Progress tab**: resume, Unit checklists, review-due count, **concept map**.
- Skill tracking, error tags, **export/import** (JSON), storage v4 (unit picker, formula-aware resume, toasts).
- **PWA** install (manifest + service worker); EN/FR toggle with mid-lesson re-translation.

### Quality

- Accessibility pass (ARIA, focus-visible, screen-reader-friendly trees/tables).
- Per-skill spaced-repetition tuning.
- Truth-table engine module; expanded test coverage.

### For contributors

New docs: authoring guide, updated content model, future work plan, accessibility audit, Level 1 integration notes, Phase 3 / predicate / natural-deduction design prep, i18n policy.

---

## Feature inventory (since v0.2.0)

| Area | Shipped in 0.3.0 |
|------|------------------|
| Learn paths | Level 0 (5) + Level 1 Unit 1 (12), gated Practice, operator reference |
| Presentation | 2×2 watch grid, truth-table lessons, live-row guided tries |
| Exercises | 20-item bank, fill-truth-table (5), translation MVP (1), prerequisites graph |
| Progress | Tab UI, concept map, SRS tuning, skill/error stats, export/import, storage v4 |
| Platform | PWA shell, EN/FR i18n |
| Engine | `engine/truth-table/`, translation feedback classifier |
| A11y | MVP pass documented in `docs/accessibility.md` |
| Docs | authoring, content-model, future-work-plan, design prep docs |

---

## Pre-merge checklist (orchestrator)

- [ ] All feature branches for 0.3.0 merged to integration / main target branch
- [ ] Re-read `CHANGELOG.md` `[Unreleased]` — no duplicates, past tense, user-facing where possible
- [ ] Append any missing bullets from late merges (do **not** rename `[Unreleased]` yet)
- [ ] `npm run release:check` passes (or `npm test && npm run build`)
- [ ] Manual smoke on phone viewport: Learn L0→L1 flow, one scope exercise, one fill-truth-table, translate-001, Progress export/import, PWA install prompt
- [ ] Confirm `docs/versioning.md` “Current version” updated at cut time
- [ ] Confirm README **Status** section reflects post-0.3.0 phase (optional but recommended)

### Parallel-agent changelog slots

Leave room for entries from in-flight work before cut:

- Natural deduction fill-one-step / repair-step (if merged)
- Counterexample exercises (if merged)
- Level 2 nested formulas (if merged)
- Translation exercises `translate-002`–`translate-006` (if merged)
- SRS per-skill tuning refinements (if merged)
- Onboarding / what-next UI (if merged)
- Visual concept map SVG (if merged)

---

## Post-merge cut checklist

When integration is complete and `[Unreleased]` is final:

1. [ ] Move all `[Unreleased]` bullets under `## [0.3.0] - YYYY-MM-DD`
2. [ ] Insert fresh empty `## [Unreleased]` at top of `CHANGELOG.md`
3. [ ] Update compare link: `[Unreleased]: .../compare/v0.3.0...HEAD` and add `[0.3.0]: .../releases/tag/v0.3.0`
4. [ ] Set `package.json` `"version"` to `"0.3.0"`
5. [ ] Update `docs/versioning.md` latest released version to **0.3.0**
6. [ ] Commit: `release: v0.3.0`
7. [ ] Tag: `git tag v0.3.0`
8. [ ] Deploy via Cloudflare Pages (`npm run build` → `dist/`)
9. [ ] Verify production PWA + progress export on a physical phone

---

## Release gate scripts

`package.json` includes:

| Script | Purpose |
|--------|---------|
| `npm test` | Vitest unit + integration tests |
| `npm run build` | `tsc` + Vite production build |
| `npm run release:check` | Both test and build (release gate) |
| `npm run preview` | Local preview of production build |

No additional scripts required for cut.
