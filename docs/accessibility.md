# Accessibility

Audit and fixes for the MVP UI (learn, practice, progress). Mobile-first tap targets are unchanged; improvements focus on screen readers, keyboard focus, and semantic roles.

## Scope audited

| Surface | Location |
|---------|----------|
| Parse trees | `src/app/render.ts` |
| Truth tables (watch + live row) | `src/app/truth-table-render.ts` |
| V/F assignment segments | `src/app/atom-toggles-render.ts` |
| Symbol palette (Phase 3 stub) | `src/app/translation/palette-render.ts` |
| Mode navigation + language toggle | `src/app/shell-render.ts` |
| Progress cards | `src/app/progress-render.ts` |

## Fixes applied

### Parse trees

- **Read-only vs selectable:** Evaluation trees render nodes as non-focusable `div` elements (no false button affordance). Scope exercises keep `<button>` with `aria-pressed` for selection state.
- **Labels:** Connective nodes get `aria-label` via i18n (`treeNodeSelectAria`, `treeNodeDisplayAria`).
- **Structure:** `role="tree"` on the root list, `role="treeitem"` on nodes, `role="group"` on child lists, `aria-expanded` when a node has children.

### Truth tables

- Table retains `aria-label` (formula-specific, localized).
- Watch-mode highlighted row uses `aria-current="step"`.
- Screen-reader row labels (`sr-only` `th scope="row"`) unchanged.

### V/F segments

- Each segment button has an explicit `aria-label` (e.g. “Set P to true”) in EN and FR.
- `aria-pressed` and `role="group"` per atom were already present; retained.

### Mode navigation

- Mode buttons: `aria-label` + `aria-pressed` (toggle pattern).
- Locked practice tab: `aria-describedby` pointing to a visually hidden lock reason (in addition to `title`).
- Language toggle: localized `aria-label` on each locale button; active locale uses language name, inactive uses “switch to …”.

### Progress cards

- Key sections use `aria-labelledby` tied to heading `id`s (continue, level checklists, exercises).
- Checklist rows expose combined label + status via `aria-label`; visible status text is `aria-hidden` to avoid duplication.

### Progress visibility

- Learn unit meters use `role="meter"` plus visible text (position and completed count).
- Practice capability chips include readable state text (`Ready` / `Developing` / `Reliable`); the visible family label and chip are the single accessible announcement. Session position has an accessible label.
- Progress moments use `role="status"` with `aria-live="polite"` on first insert only, so rerenders do not re-announce.
- Unit-completion cards use `role="status"` with `aria-live="polite"` on first insert only. Later rerenders of the same visible card use `aria-live="off"` without `role="status"`, so ordinary interaction and locale switches do not repeat the announcement.
- Meter fill animation is disabled under `prefers-reduced-motion`.

### Focus and keyboard

- **Focus-visible:** Consistent `:focus-visible` outline on buttons (mode nav, language, tree nodes, V/F segments, primary/secondary actions, palette stub, reference `<summary>`).
- **Keyboard activation:** All interactive controls remain native `<button>` elements; Enter/Space activate via the existing delegated click handler. Read-only tree nodes are not in the tab order.
- **Tree keyboard navigation:** Scope exercises (main-connective selection) use roving `tabindex` on connective buttons; Arrow Up/Down move between visible nodes, Arrow Right/Left move to first child or parent, Home/End jump to first/last node. Focus-visible outline applies; `aria-selected` reflects selection on `treeitem` elements.

### Symbol palette (stub)

- Already had `aria-label` on buttons and `role="group"` on palette rows; no markup changes. Focus-visible styles added for when the palette ships.

## Known gaps

- **Truth-table inactive rows:** Dimmed non-current rows are still read by screen readers; no `aria-hidden` (would hide pedagogical context).
- **Progress stats lists:** Skill/error summaries lack per-item `aria-label`; headings provide context only.
- **Reference panel:** Native `<details>`; no custom expand/collapse announcements beyond browser defaults.
- **Live region politeness:** Feedback uses `role="status"` but not `aria-live="polite"` explicitly (implicit for status role in most browsers).
- **Color-only state:** Active V/F segment and selected tree node also use border/weight changes, but rely partly on green/red tint — verify contrast in user themes.
- **Translation palette:** Not wired into the live app yet; a11y reviewed at renderer level only.

## Testing notes

- Run `npm test` and `npm run build` after changes.
- Manual: Tab through practice scope exercise and guided lesson; confirm focus ring visibility and that evaluation tree nodes are skipped in tab order.
