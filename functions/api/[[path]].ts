import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import {
  allowChallengeCreation,
  assertSameOriginMutation,
  CHALLENGE_GLOBAL_CAP,
  clientKeyFromHeaders,
  nextStoredCounter,
  resolveRelyingParty,
  shouldPurgeExpired,
  type RelyingParty,
} from '../../src/app/account-policy';
import { CasConflictError, mergeWithCasRetry } from '../../src/app/progress-cas';
import { parseProgressStore } from '../../src/app/progress-merge';
import type { ProgressStore } from '../../src/app/storage';
import {
  BodyTooLargeError,
  clearCookieHeaders,
  cookieHeader,
  errorJson,
  json,
  readJsonBody,
  routeKey,
} from '../lib/http';
import { base64UrlToBytes, randomId } from '../lib/crypto';
import {
  admitChallenge,
  casInsertProgress,
  casUpdateProgress,
  countChallenges,
  createUserWithCredential,
  deleteAccount,
  getCredential,
  getProgress,
  insertCredential,
  listCredentials,
  parseTransports,
  peekChallengeQuota,
  probeDatabase,
  purgeExpired,
  takeChallenge,
  updateCredentialCounter,
} from '../lib/db';
import { clearSession, createSessionCookie, readSessionUser } from '../lib/session';

const CHALLENGE_OPTION_ROUTES = new Set([
  'auth/register/options',
  'auth/login/options',
  'auth/passkeys/options',
]);

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    return await handle(context);
  } catch (error) {
    if (error instanceof BodyTooLargeError) {
      return errorJson('body-too-large', 413);
    }
    if (error instanceof SyntaxError) {
      return errorJson('invalid-json', 400);
    }
    if (error instanceof CasConflictError) {
      return errorJson('cas-conflict', 409);
    }
    console.error('accounts api', error);
    return errorJson('server-error', 500);
  }
};

async function handle(context: EventContext<Env, 'path', unknown>): Promise<Response> {
  const { request, env, params } = context;
  const route = routeKey(params.path);
  const method = request.method.toUpperCase();

  if (method === 'GET' && route === 'status') {
    return handleStatus(env, request);
  }

  const csrf = assertSameOriginMutation(method, request.headers.get('Origin'), env);
  if (!csrf.ok) {
    return errorJson(csrf.error, 403);
  }

  if (!(await probeDatabase(env.DB))) {
    return errorJson('accounts-unavailable', 503);
  }
  const db = env.DB!;

  if (shouldPurgeExpired()) {
    await purgeExpired(db);
  }

  if (method === 'POST' && CHALLENGE_OPTION_ROUTES.has(route)) {
    const limited = await rejectAbusiveChallenge(db, request);
    if (limited) {
      return limited;
    }
  }

  if (method === 'GET' && route === 'session') {
    return handleSession(db, request);
  }
  if (method === 'POST' && route === 'auth/register/options') {
    return handleRegisterOptions(db, env, request);
  }
  if (method === 'POST' && route === 'auth/register/verify') {
    return handleRegisterVerify(db, request);
  }
  if (method === 'POST' && route === 'auth/login/options') {
    return handleLoginOptions(db, env, request);
  }
  if (method === 'POST' && route === 'auth/login/verify') {
    return handleLoginVerify(db, request);
  }
  if (method === 'POST' && route === 'auth/logout') {
    return handleLogout(db, request);
  }
  if (method === 'POST' && route === 'auth/passkeys/options') {
    return handleAddPasskeyOptions(db, env, request);
  }
  if (method === 'POST' && route === 'auth/passkeys/verify') {
    return handleAddPasskeyVerify(db, request);
  }
  if (method === 'GET' && route === 'sync') {
    return handleSyncGet(db, request);
  }
  if (method === 'POST' && route === 'sync') {
    return handleSyncPost(db, request);
  }
  if (method === 'DELETE' && route === 'account') {
    return handleDeleteAccount(db, request);
  }

  return errorJson('not-found', 404);
}

async function handleStatus(env: Env, request: Request): Promise<Response> {
  if (!(await probeDatabase(env.DB))) {
    return json({ available: false });
  }
  const db = env.DB!;
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return json({ available: true, signedIn: false, passkeyCount: 0 });
  }
  const credentials = await listCredentials(db, userId);
  return json({
    available: true,
    signedIn: true,
    passkeyCount: credentials.length,
  });
}

async function rejectAbusiveChallenge(db: D1Database, request: Request): Promise<Response | null> {
  // Read-only filters before generating WebAuthn options. The hard cap is the
  // conditional INSERT in admitChallenge; a full table still writes no row.
  const outstanding = await countChallenges(db);
  if (outstanding >= CHALLENGE_GLOBAL_CAP) {
    return errorJson('rate-limited', 429);
  }
  const key = clientKeyFromHeaders(request.headers);
  if (!allowChallengeCreation(key)) {
    return errorJson('rate-limited', 429);
  }
  if (!(await peekChallengeQuota(db, key))) {
    return errorJson('rate-limited', 429);
  }
  return null;
}

async function handleSession(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return json({ signedIn: false, passkeyCount: 0 });
  }
  const credentials = await listCredentials(db, userId);
  return json({ signedIn: true, passkeyCount: credentials.length });
}

async function readRelyingParty(env: Env, request: Request): Promise<RelyingParty | Response> {
  const rp = resolveRelyingParty(request.headers.get('Origin'), env);
  if ('error' in rp) {
    return errorJson(rp.error, 403);
  }
  return rp;
}

function randomLearnerHandle(): string {
  return `learner-${randomId().replace(/-/g, '').slice(0, 10)}`;
}

async function handleRegisterOptions(
  db: D1Database,
  env: Env,
  request: Request,
): Promise<Response> {
  const existingUser = await readSessionUser(db, request);
  if (existingUser) {
    return errorJson('already-signed-in', 409);
  }
  const rp = await readRelyingParty(env, request);
  if (rp instanceof Response) {
    return rp;
  }
  const userId = randomId();
  const options = await generateRegistrationOptions({
    rpName: rp.rpName,
    rpID: rp.rpID,
    userName: randomLearnerHandle(),
    userID: new TextEncoder().encode(userId),
    userDisplayName: 'Externalize',
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  const challengeId = await admitChallenge(
    db,
    {
      challenge: options.challenge,
      type: 'register',
      userId,
      origin: rp.origin,
      rpId: rp.rpID,
    },
    clientKeyFromHeaders(request.headers),
  );
  if (!challengeId) {
    return errorJson('rate-limited', 429);
  }
  return json({ challengeId, options });
}

async function handleRegisterVerify(db: D1Database, request: Request): Promise<Response> {
  const body = (await readJsonBody(request)) as {
    challengeId?: unknown;
    response?: unknown;
  };
  if (typeof body.challengeId !== 'string' || !body.response || typeof body.response !== 'object') {
    return errorJson('invalid-body', 400);
  }
  const challenge = await takeChallenge(db, body.challengeId, 'register');
  if (!challenge?.user_id || !challenge.origin || !challenge.rp_id) {
    return errorJson('challenge-expired', 400);
  }
  const verification = await verifyRegistrationResponse({
    response: body.response as RegistrationResponseJSON,
    expectedChallenge: challenge.challenge,
    expectedOrigin: challenge.origin,
    expectedRPID: challenge.rp_id,
    requireUserVerification: true,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return errorJson('verification-failed', 400);
  }
  const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
  await createUserWithCredential(db, challenge.user_id, {
    id: credential.id,
    publicKey: isoBase64URL.fromBuffer(credential.publicKey),
    counter: credential.counter,
    deviceType: credentialDeviceType,
    backedUp: credentialBackedUp,
    transports: credential.transports,
  });
  const session = await createSessionCookie(db, challenge.user_id, request.url);
  return json(
    { ok: true, passkeyCount: 1 },
    200,
    { 'set-cookie': cookieHeader(session.token, request.url) },
  );
}

async function handleLoginOptions(
  db: D1Database,
  env: Env,
  request: Request,
): Promise<Response> {
  const rp = await readRelyingParty(env, request);
  if (rp instanceof Response) {
    return rp;
  }
  const options = await generateAuthenticationOptions({
    rpID: rp.rpID,
    userVerification: 'required',
  });
  const challengeId = await admitChallenge(
    db,
    {
      challenge: options.challenge,
      type: 'login',
      origin: rp.origin,
      rpId: rp.rpID,
    },
    clientKeyFromHeaders(request.headers),
  );
  if (!challengeId) {
    return errorJson('rate-limited', 429);
  }
  return json({ challengeId, options });
}

async function handleLoginVerify(db: D1Database, request: Request): Promise<Response> {
  const body = (await readJsonBody(request)) as {
    challengeId?: unknown;
    response?: unknown;
  };
  if (typeof body.challengeId !== 'string' || !body.response || typeof body.response !== 'object') {
    return errorJson('invalid-body', 400);
  }
  const assertion = body.response as AuthenticationResponseJSON;
  const challenge = await takeChallenge(db, body.challengeId, 'login');
  if (!challenge?.origin || !challenge.rp_id) {
    return errorJson('challenge-expired', 400);
  }
  const stored = await getCredential(db, assertion.id);
  if (!stored) {
    return errorJson('unknown-passkey', 400);
  }
  const verification = await verifyAuthenticationResponse({
    response: assertion,
    expectedChallenge: challenge.challenge,
    expectedOrigin: challenge.origin,
    expectedRPID: challenge.rp_id,
    requireUserVerification: true,
    credential: {
      id: stored.id,
      publicKey: Uint8Array.from(base64UrlToBytes(stored.public_key)),
      // Counter clone-detection is applied after verify so a reported 0
      // (synced passkeys) is not rejected by SimpleWebAuthn.
      counter: 0,
      transports: parseTransports(stored.transports),
    },
  });
  if (!verification.verified) {
    return errorJson('verification-failed', 400);
  }
  const nextCounter = nextStoredCounter(stored.counter, verification.authenticationInfo.newCounter);
  if (nextCounter === null) {
    return errorJson('cloned-passkey', 400);
  }
  await updateCredentialCounter(db, stored.id, nextCounter);
  const session = await createSessionCookie(db, stored.user_id, request.url);
  const passkeyCount = (await listCredentials(db, stored.user_id)).length;
  return json(
    { ok: true, passkeyCount },
    200,
    { 'set-cookie': cookieHeader(session.token, request.url) },
  );
}

async function handleLogout(db: D1Database, request: Request): Promise<Response> {
  await clearSession(db, request);
  return json({ ok: true }, 200, { 'set-cookie': clearCookieHeaders(request.url) });
}

async function handleAddPasskeyOptions(
  db: D1Database,
  env: Env,
  request: Request,
): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  const rp = await readRelyingParty(env, request);
  if (rp instanceof Response) {
    return rp;
  }
  const existing = await listCredentials(db, userId);
  const options = await generateRegistrationOptions({
    rpName: rp.rpName,
    rpID: rp.rpID,
    userName: randomLearnerHandle(),
    userID: new TextEncoder().encode(userId),
    userDisplayName: 'Externalize',
    attestationType: 'none',
    excludeCredentials: existing.map((row) => ({
      id: row.id,
      transports: parseTransports(row.transports),
    })),
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  const challengeId = await admitChallenge(
    db,
    {
      challenge: options.challenge,
      type: 'add-passkey',
      userId,
      origin: rp.origin,
      rpId: rp.rpID,
    },
    clientKeyFromHeaders(request.headers),
  );
  if (!challengeId) {
    return errorJson('rate-limited', 429);
  }
  return json({ challengeId, options });
}

async function handleAddPasskeyVerify(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  const body = (await readJsonBody(request)) as {
    challengeId?: unknown;
    response?: unknown;
  };
  if (typeof body.challengeId !== 'string' || !body.response || typeof body.response !== 'object') {
    return errorJson('invalid-body', 400);
  }
  const challenge = await takeChallenge(db, body.challengeId, 'add-passkey', userId);
  if (!challenge || challenge.user_id !== userId || !challenge.origin || !challenge.rp_id) {
    return errorJson('challenge-expired', 400);
  }
  const verification = await verifyRegistrationResponse({
    response: body.response as RegistrationResponseJSON,
    expectedChallenge: challenge.challenge,
    expectedOrigin: challenge.origin,
    expectedRPID: challenge.rp_id,
    requireUserVerification: true,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return errorJson('verification-failed', 400);
  }
  const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
  await insertCredential(db, {
    id: credential.id,
    userId,
    publicKey: isoBase64URL.fromBuffer(credential.publicKey),
    counter: credential.counter,
    deviceType: credentialDeviceType,
    backedUp: credentialBackedUp,
    transports: credential.transports,
  });
  const passkeyCount = (await listCredentials(db, userId)).length;
  return json({ ok: true, passkeyCount });
}

async function handleSyncGet(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  const row = await getProgress(db, userId);
  if (!row) {
    return json({ progress: null, updatedAt: null, revision: null });
  }
  const snapshot = parseStoredSnapshot(row.snapshot);
  return json({
    progress: snapshot,
    updatedAt: row.updated_at,
    revision: row.revision,
  });
}

async function handleSyncPost(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  const body = (await readJsonBody(request)) as { progress?: unknown };
  const incoming = parseProgressStore(body.progress);
  if (!incoming) {
    return errorJson('invalid-progress', 400);
  }
  const merged = await mergeWithCasRetry({
    incoming,
    read: async () => {
      const row = await getProgress(db, userId);
      if (!row) {
        return null;
      }
      return {
        snapshot: parseStoredSnapshot(row.snapshot),
        revision: Number(row.revision) || 1,
      };
    },
    write: async (snapshot, expectedRevision) => {
      const encoded = JSON.stringify(snapshot);
      if (expectedRevision === null) {
        return casInsertProgress(db, userId, encoded);
      }
      return casUpdateProgress(db, userId, encoded, expectedRevision);
    },
  });
  return json({ progress: merged });
}

async function handleDeleteAccount(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  await deleteAccount(db, userId);
  return json({ ok: true }, 200, { 'set-cookie': clearCookieHeaders(request.url) });
}

function parseStoredSnapshot(raw: string): ProgressStore | null {
  try {
    return parseProgressStore(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}
