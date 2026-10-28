import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const cssDir = dirname(fileURLToPath(import.meta.url));
const css = ['main.css', 'remediation.css']
  .map((name) => readFileSync(join(cssDir, name), 'utf8'))
  .join('\n');

const FILL_CELL_SELECTORS = [
  '.actions > button',
  '.progress-actions > button',
  '.choice-list > button',
  '.cell-segments > button',
  '.tautology-segments > button',
  '.atom-segments > button',
  '.mode-nav > button',
  '.unit-picker > button',
  '.route-picker > button',
  '.onboarding-actions > button',
  '.session-more-nav > button',
  '.truth-table-answer-tray > button',
];

describe('tap targets fill grid/flex cells', () => {
  it('declares a shared fill rule for one-control-per-cell buttons', () => {
    // Linux Playwright WebKit already stretches <button> grid items, so e2e
    // cannot lock the iOS shrink-wrap. Keep the workaround in CSS.
    const block = css.match(
      /\.actions > button,[\s\S]*?\.truth-table-answer-tray > button\s*\{[\s\S]*?\}/,
    );
    expect(block).toBeTruthy();
    const rule = block![0];
    expect(rule).toMatch(/width:\s*100%/);
    for (const selector of FILL_CELL_SELECTORS) {
      expect(rule).toContain(selector);
    }
  });
});
