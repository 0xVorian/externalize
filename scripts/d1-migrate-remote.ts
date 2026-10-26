#!/usr/bin/env tsx
/**
 * Apply D1 migrations to a remote database without putting a database_id in
 * committed wrangler.toml (git-connected Pages rejects a missing/placeholder
 * id). Pass the real id from the Cloudflare dashboard.
 *
 *   npm run d1:migrate:remote -- --database-id <uuid>
 *   npm run d1:migrate:remote -- --database-id <uuid> --database-name externalize-progress
 *
 * Alternatively paste `migrations/*.sql` in order into the D1 SQL console.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NIL_UUID = '00000000-0000-0000-0000-000000000000';

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

const databaseId = argValue('--database-id') ?? argValue('--id');
const databaseName = argValue('--database-name') ?? argValue('--name') ?? 'externalize-progress';

if (!databaseId || !UUID.test(databaseId) || databaseId === NIL_UUID) {
  console.error(
    'Usage: npm run d1:migrate:remote -- --database-id <uuid> [--database-name externalize-progress]\n' +
      'The id is the real D1 database id from the Cloudflare dashboard, not the local nil UUID.',
  );
  process.exit(1);
}

const dir = mkdtempSync(join(tmpdir(), 'externalize-d1-'));
const configPath = join(dir, 'wrangler.toml');
const committed = readFileSync('wrangler.toml', 'utf8');
if (/^\[\[d1_databases\]\]/m.test(committed) || /^database_id\s*=/m.test(committed)) {
  rmSync(dir, { recursive: true, force: true });
  throw new Error('committed wrangler.toml must not declare a D1 database_id');
}

writeFileSync(
  configPath,
  `${committed.trim()}

[[d1_databases]]
binding = "DB"
database_name = ${JSON.stringify(databaseName)}
database_id = ${JSON.stringify(databaseId)}
migrations_dir = "migrations"
`,
);

const result = spawnSync(
  'npx',
  ['wrangler', '-c', configPath, 'd1', 'migrations', 'apply', databaseName, '--remote'],
  { stdio: 'inherit', cwd: process.cwd() },
);
rmSync(dir, { recursive: true, force: true });
process.exit(result.status ?? 1);
