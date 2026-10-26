-- Store the WebAuthn origin / RP ID chosen at options time, and a CAS
-- revision on progress so concurrent syncs cannot last-write-win.

ALTER TABLE challenges ADD COLUMN origin TEXT;
ALTER TABLE challenges ADD COLUMN rp_id TEXT;
ALTER TABLE progress ADD COLUMN revision INTEGER NOT NULL DEFAULT 1;
