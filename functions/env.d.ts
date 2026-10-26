/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB?: D1Database;
  WEBAUTHN_RP_NAME?: string;
  WEBAUTHN_RP_ID?: string;
  WEBAUTHN_ORIGIN?: string;
  WEBAUTHN_ALLOWED_ORIGINS?: string;
}

interface ChallengeRow {
  id: string;
  challenge: string;
  type: string;
  user_id: string | null;
  expires_at: string;
  origin: string | null;
  rp_id: string | null;
}

interface CredentialRow {
  id: string;
  user_id: string;
  public_key: string;
  counter: number;
  device_type: string | null;
  backed_up: number;
  transports: string | null;
  created_at: string;
}

interface SessionRow {
  token_hash: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

interface ProgressRow {
  user_id: string;
  snapshot: string;
  updated_at: string;
  revision: number;
}
