// Minimal Pages/D1 ambient types so `functions/` typechecks under the root
// tsconfig (DOM lib) without pulling in `@cloudflare/workers-types`, which
// conflicts with DOM `Request` / `Response`. Wrangler still bundles these
// files with its own types.

interface D1Meta {
  changes?: number;
  last_row_id?: number;
  duration?: number;
  rows_read?: number;
  rows_written?: number;
}

interface D1Result<T = unknown> {
  success: boolean;
  meta: D1Meta;
  results?: T[];
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

interface EventContext<Env = unknown, P extends string = string, Data = unknown> {
  request: Request;
  env: Env;
  params: Record<P, string | string[]> & { path?: string | string[] };
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  next(input?: Request | string, init?: RequestInit): Promise<Response>;
  data: Data;
}

type PagesFunction<Env = unknown> = (
  context: EventContext<Env, string, unknown>,
) => Response | Promise<Response>;

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
