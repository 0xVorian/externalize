-- Globally effective per-client challenge quota (hashed CF-Connecting-IP).
-- Bounds unauthenticated D1 writes across isolates; see docs/accounts.md.

CREATE TABLE challenge_rate (
  client_key TEXT PRIMARY KEY,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL
);
