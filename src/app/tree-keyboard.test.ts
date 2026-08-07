import { describe, expect, it } from 'vitest';
import { treeFocusNodeId } from './tree-keyboard';
import { createState } from './state';
import { EXERCISE_DEFINITIONS } from './exercises';
import { renderApp } from './render';

describe('tree keyboard navigation', () => {
  it('renders roving tabindex on scope exercise tree buttons', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'scope-001')!;
    const html = renderApp(createState('en', exercise), 0, true);
    expect(html).toContain('role="tree"');
    expect(html).toContain('tabindex="0"');
    expect(html).toContain('tabindex="-1"');
    expect(html).toContain('data-action="select-node"');
  });

  it('sets aria-selected on the chosen connective after selection', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'scope-001')!;
    const state = { ...createState('en', exercise), selectedNodeId: 'root.L' };
    const html = renderApp(state, 0, true);
    expect(html).toMatch(/data-node-id="root\.L"[^>]*aria-selected="true"/);
    expect(html).toContain('data-node-id="root.L" tabindex="0"');
    expect(html).toContain('aria-pressed="true"');
  });

  it('does not add tabindex to read-only evaluation trees', () => {
    const exercise = EXERCISE_DEFINITIONS.find(
      (candidate) => candidate.type === 'evaluate-formula' && candidate.formula === '(P → Q) ∧ R',
    )!;
    const html = renderApp(createState('en', exercise), 0, true);
    expect(html).toContain('node-readonly');
    expect(html).not.toContain('tabindex="0"');
    expect(html).not.toContain('data-action="select-node"');
  });

  it('chooses selected node or root for initial tree focus id', () => {
    const exercise = EXERCISE_DEFINITIONS.find((candidate) => candidate.id === 'scope-001')!;
    const state = createState('en', exercise);
    expect(treeFocusNodeId(state)).toBe(state.tree.id);
    expect(treeFocusNodeId({ ...state, selectedNodeId: 'root.L' })).toBe('root.L');
  });
});
