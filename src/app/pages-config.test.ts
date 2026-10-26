import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Pages git-connected config', () => {
  it('does not declare a D1 binding in the committed wrangler.toml', () => {
    const toml = readFileSync('wrangler.toml', 'utf8');
    expect(toml).not.toMatch(/^\[\[d1_databases\]\]/m);
    expect(toml).not.toMatch(/^database_id\s*=/m);
    expect(toml).toMatch(/wrangler\.local\.toml/);
  });

  it('keeps the local D1 bind in wrangler.local.toml for wrangler d1, not pages --config', () => {
    const local = readFileSync('wrangler.local.toml', 'utf8');
    expect(local).toMatch(/\[\[d1_databases\]\]/);
    expect(local).toMatch(/binding = "DB"/);
    const id = /database_id = "([^"]+)"/.exec(local)?.[1];
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
    expect(pkg.scripts['dev:pages']).toContain(`--d1 DB=${id}`);
    expect(pkg.scripts['dev:pages']).not.toMatch(/-c wrangler\.local\.toml pages dev/);
    const helper = readFileSync('e2e/helpers/accounts-server.ts', 'utf8');
    expect(helper).toContain(`DB=${id}`);
    expect(helper).not.toMatch(/-c',\s*'wrangler\.local\.toml',\s*'pages'/);
  });
});
