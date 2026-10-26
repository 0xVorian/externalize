-- Externalize optional accounts (issue #37).
-- Binding name: DB. Local:
--   npx wrangler -c wrangler.local.toml d1 migrations apply externalize-progress --local
-- Remote (production bind is env.production in wrangler.toml; do not use a
-- /tmp wrangler.toml — migrations_dir is resolved next to the config file):
--   paste this file, then 0002 and 0003, in the D1 SQL console / query API
--   or: npx wrangler -c wrangler.remote.toml d1 migrations apply externalize-progress --remote
-- See docs/accounts.md.

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE credentials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  public_key TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  device_type TEXT,
  backed_up INTEGER NOT NULL DEFAULT 0,
  transports TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX credentials_user_id ON credentials (user_id);

CREATE TABLE challenges (
  id TEXT PRIMARY KEY,
  challenge TEXT NOT NULL,
  type TEXT NOT NULL,
  user_id TEXT,
  expires_at TEXT NOT NULL
);

CREATE INDEX challenges_expires_at ON challenges (expires_at);

CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX sessions_user_id ON sessions (user_id);
CREATE INDEX sessions_expires_at ON sessions (expires_at);

CREATE TABLE progress (
  user_id TEXT PRIMARY KEY,
  snapshot TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
