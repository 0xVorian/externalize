# Versioning & Changelog

Externalize uses [Semantic Versioning](https://semver.org/) and documents changes in [Keep a Changelog](https://keepachangelog.com/) format.

## Current version

Latest changelog release: **0.4.0** (evidence-backed progress visibility and finite Practice sessions).

`package.json` `"version"` matches the latest changelog release.

GitHub release objects and tags are optional markers and may lag the changelog/package version; they are not the authoritative release source for this repository.

## Semver policy

| Segment | When to bump (pre-1.0) | When to bump (≥ 1.0) |
|---------|------------------------|----------------------|
| **MAJOR** | Reserved for 1.0.0 | Breaking API, data format, or progress export |
| **MINOR** | New features, exercise types, visible UX | Same |
| **PATCH** | Bug fixes, copy tweaks, internal refactors with no behavior change | Same |

Pre-1.0 (`0.x.y`): the public surface is still settling. Breaking changes bump **minor**, not major, until `1.0.0` marks a stable content schema and progress format.

The v0.3.4 and v0.3.5 changelog entries historically used patch bumps for feature-bearing work. That numbering is retained as history; new releases should follow the policy above rather than treating prior drift as precedent.

## Changelog workflow

### Day to day

1. Make the change
2. Add a bullet under `## [Unreleased]` in `CHANGELOG.md`
3. Use the correct section: `Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Security`
4. Write entries in past tense, user-facing when possible

Good:

```markdown
### Added
- Vertical tree renderer for formulas on narrow screens
```

Bad:

```markdown
### Changed
- misc updates
- WIP
```

### Cutting a release

1. Review `[Unreleased]` — complete sentences, no duplicates
2. Rename the section to `## [X.Y.Z] - YYYY-MM-DD`
3. Insert a new empty `## [Unreleased]` at the top
4. Update `package.json` version to match
5. Commit with message `release: vX.Y.Z`
6. Tag optionally: `git tag vX.Y.Z`

### What belongs in the changelog

**Include:**

- New exercise types or lesson content packs
- UI/UX changes learners will notice
- Engine behavior changes (equivalence rules, feedback messages)
- Breaking changes to progress export format
- Security fixes

**Omit:**

- Internal refactors with no outward effect (unless large enough to note under `Changed` for contributors)
- Typo fixes in comments or non-user-facing docs

## Version sources of truth

| Artifact | Role |
|----------|------|
| `CHANGELOG.md` | Human-readable history; authoritative for release notes |
| `package.json` `"version"` | Machine-readable version |
| Git tags / GitHub releases | Optional markers; may lag the changelog/package state |

## Agent rule

Cursor agents working in this repo should follow `.cursor/rules/versioning-changelog.mdc` automatically.
