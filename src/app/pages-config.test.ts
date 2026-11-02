import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const PRODUCTION_D1_ID = '6d9806e2-46c4-41b1-a5fe-8c224ecbadf3';

function uncommented(toml: string): string {
  return toml
    .split('\n')
    .filter((line) => !line.trim().startsWith('#'))
    .join('\n');
}

function section(toml: string, header: string): string {
  const lines = uncommented(toml).split('\n');
  const start = lines.findIndex((line) => line.trim() === header);
  if (start === -1) {
    return '';
  }
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('['));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n');
}

function assignments(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of block.split('\n')) {
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+?)\s*$/.exec(line);
    if (match) {
      out[match[1]] = match[2];
    }
  }
  return out;
}

function topLevelAssignments(toml: string): Record<string, string> {
  const lines = uncommented(toml).split('\n');
  const end = lines.findIndex((line) => line.trim().startsWith('['));
  return assignments((end === -1 ? lines : lines.slice(0, end)).join('\n'));
}

/**
 * Pages inheritable keys resolve from the top level unless `[env.<name>]`
 * overrides them. Non-inheritable keys (`vars`, `d1_databases`, …) do not.
 * https://developers.cloudflare.com/pages/functions/wrangler-configuration/
 */
function resolvePagesInheritable(
  toml: string,
  env: 'production' | 'preview',
): Record<string, string> {
  return { ...topLevelAssignments(toml), ...assignments(section(toml, `[env.${env}]`)) };
}

describe('Pages git-connected config', () => {
  it('binds D1 only under env.production, with the real database id', () => {
    const toml = readFileSync('wrangler.toml', 'utf8');
    const body = uncommented(toml);
    expect(body).not.toMatch(/^\[\[d1_databases\]\]/m);
    expect(body).not.toMatch(/^\[\[env\.preview\.d1_databases\]\]/m);
    expect(body).not.toMatch(/^\[env\.preview[.\]]/m);

    const production = section(toml, '[[env.production.d1_databases]]');
    expect(production).toMatch(/binding = "DB"/);
    expect(production).toMatch(/database_name = "externalize-progress"/);
    expect(production).toMatch(`database_id = "${PRODUCTION_D1_ID}"`);

    const ids = [...body.matchAll(/^database_id\s*=\s*"([^"]+)"/gm)].map((match) => match[1]);
    expect(ids).toEqual([PRODUCTION_D1_ID]);

    const productionVars = section(toml, '[env.production.vars]');
    expect(productionVars).toMatch(/WEBAUTHN_RP_NAME = "Externalize"/);
    expect(section(toml, '[vars]')).toMatch(/WEBAUTHN_RP_NAME = "Externalize"/);
    expect(toml).toMatch(/wrangler\.local\.toml/);
    expect(toml).toMatch(/pages_build_output_dir/);
  });

  it('gives production the inherited required Pages keys and nodejs_compat', () => {
    const toml = readFileSync('wrangler.toml', 'utf8');
    const top = topLevelAssignments(toml);
    expect(top.name).toBe('"externalize"');
    expect(top.pages_build_output_dir).toBe('"dist"');
    expect(top.compatibility_date).toBe('"2025-10-11"');
    expect(top.compatibility_flags).toMatch(/nodejs_compat/);

    // `[env.production]` does not exist, so inheritable keys are not emptied.
    expect(section(toml, '[env.production]')).toBe('');

    const production = resolvePagesInheritable(toml, 'production');
    expect(production.name).toBe(top.name);
    expect(production.pages_build_output_dir).toBe(top.pages_build_output_dir);
    expect(production.compatibility_date).toBe(top.compatibility_date);
    expect(production.compatibility_flags).toBe(top.compatibility_flags);
    expect(production.compatibility_date).toMatch(/^"\d{4}-\d{2}-\d{2}"$/);
    expect(production.compatibility_flags).toMatch(/nodejs_compat/);
    expect(production.compatibility_flags).not.toMatch(/\[\s*\]/);

    const preview = resolvePagesInheritable(toml, 'preview');
    expect(preview.compatibility_date).toBe(top.compatibility_date);
    expect(preview.compatibility_flags).toMatch(/nodejs_compat/);

    // Overriding any non-inheritable key (D1) requires specifying all of them.
    expect(section(toml, '[env.production.vars]')).toMatch(/WEBAUTHN_RP_NAME = "Externalize"/);
    expect(section(toml, '[[env.production.d1_databases]]')).toMatch(/binding = "DB"/);
  });

  it('keeps the local D1 bind in wrangler.local.toml for wrangler d1, not pages --config', () => {
    const local = readFileSync('wrangler.local.toml', 'utf8');
    expect(local).toMatch(/\[\[d1_databases\]\]/);
    expect(local).toMatch(/binding = "DB"/);
    const id = /database_id = "([^"]+)"/.exec(local)?.[1];
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(id).not.toBe(PRODUCTION_D1_ID);
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
    expect(pkg.scripts['dev:pages']).toContain(`--d1 DB=${id}`);
    expect(pkg.scripts['dev:pages']).not.toMatch(/-c wrangler\.local\.toml pages dev/);
    const helper = readFileSync('e2e/helpers/accounts-server.ts', 'utf8');
    expect(helper).toContain(`DB=${id}`);
    expect(helper).not.toMatch(/-c',\s*'wrangler\.local\.toml',\s*'pages'/);
  });

  it('does not ship a temp-config remote-migrate script', () => {
    expect(existsSync('scripts/d1-migrate-remote.ts')).toBe(false);
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
    expect(pkg.scripts['d1:migrate:remote']).toBeUndefined();
    expect(pkg.scripts['d1:migrate:local']).toContain('wrangler.local.toml');
  });
});
