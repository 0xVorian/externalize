import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { isProgressStore, mergeProgress } from '../../src/app/progress-merge';
import type { ProgressStore } from '../../src/app/storage';
import {
  BodyTooLargeError,
  clearCookieHeader,
  cookieHeader,
  errorJson,
  json,
  readJsonBody,
  relyingParty,
  routeKey,
} from '../lib/http';
import { base64UrlToBytes, randomId } from '../lib/crypto';
import {
  createUser,
  deleteAccount,
  getCredential,
  getProgress,
  insertChallenge,
  insertCredential,
  listCredentials,
  parseTransports,
  purgeExpired,
  takeChallenge,
  updateCredentialCounter,
  upsertProgress,
} from '../lib/db';
import { clearSession, createSessionCookie, readSessionUser } from '../lib/session';

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
    console.error('accounts api', error);
    return errorJson('server-error', 500);
  }
};

async function handle(context: EventContext<Env, 'path', unknown>): Promise<Response> {
  const { request, env, params } = context;
  const route = routeKey(params.path);
  const method = request.method.toUpperCase();

  if (method === 'GET' && route === 'status') {
    return json({ available: Boolean(env.DB) });
  }

  if (!env.DB) {
    return errorJson('accounts-unavailable', 503);
  }

  const db = env.DB;
  await purgeExpired(db);

  if (method === 'GET' && route === 'session') {
    return handleSession(db, request);
  }
  if (method === 'POST' && route === 'auth/register/options') {
    return handleRegisterOptions(db, env, request);
  }
  if (method === 'POST' && route === 'auth/register/verify') {
    return handleRegisterVerify(db, env, request);
  }
  if (method === 'POST' && route === 'auth/login/options') {
    return handleLoginOptions(db, env, request);
  }
  if (method === 'POST' && route === 'auth/login/verify') {
    return handleLoginVerify(db, env, request);
  }
  if (method === 'POST' && route === 'auth/logout') {
    return handleLogout(db, request);
  }
  if (method === 'POST' && route === 'auth/passkeys/options') {
    return handleAddPasskeyOptions(db, env, request);
  }
  if (method === 'POST' && route === 'auth/passkeys/verify') {
    return handleAddPasskeyVerify(db, env, request);
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

async function handleSession(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return json({ signedIn: false, passkeyCount: 0 });
  }
  const credentials = await listCredentials(db, userId);
  return json({ signedIn: true, passkeyCount: credentials.length });
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
  const { rpName, rpID } = relyingParty(env, request);
  const userId = randomId();
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: `learner-${userId.slice(0, 8)}`,
    userID: new TextEncoder().encode(userId),
    userDisplayName: 'Externalize',
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  const challengeId = await insertChallenge(db, {
    challenge: options.challenge,
    type: 'register',
    userId,
  });
  return json({ challengeId, options });
}

async function handleRegisterVerify(
  db: D1Database,
  env: Env,
  request: Request,
): Promise<Response> {
  const body = (await readJsonBody(request)) as {
    challengeId?: unknown;
    response?: unknown;
  };
  if (typeof body.challengeId !== 'string' || !body.response || typeof body.response !== 'object') {
    return errorJson('invalid-body', 400);
  }
  const challenge = await takeChallenge(db, body.challengeId, 'register');
  if (!challenge?.user_id) {
    return errorJson('challenge-expired', 400);
  }
  const { rpID, origin } = relyingParty(env, request);
  const verification = await verifyRegistrationResponse({
    response: body.response as RegistrationResponseJSON,
    expectedChallenge: challenge.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: false,
  });
  if (!verification.verified || !verification.registrationInfo) {
    return errorJson('verification-failed', 400);
  }
  const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
  await createUser(db, challenge.user_id);
  await insertCredential(db, {
    id: credential.id,
    userId: challenge.user_id,
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
  const { rpID } = relyingParty(env, request);
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'preferred',
  });
  const challengeId = await insertChallenge(db, {
    challenge: options.challenge,
    type: 'login',
  });
  return json({ challengeId, options });
}

async function handleLoginVerify(
  db: D1Database,
  env: Env,
  request: Request,
): Promise<Response> {
  const body = (await readJsonBody(request)) as {
    challengeId?: unknown;
    response?: unknown;
  };
  if (typeof body.challengeId !== 'string' || !body.response || typeof body.response !== 'object') {
    return errorJson('invalid-body', 400);
  }
  const assertion = body.response as AuthenticationResponseJSON;
  const challenge = await takeChallenge(db, body.challengeId, 'login');
  if (!challenge) {
    return errorJson('challenge-expired', 400);
  }
  const stored = await getCredential(db, assertion.id);
  if (!stored) {
    return errorJson('unknown-passkey', 400);
  }
  const { rpID, origin } = relyingParty(env, request);
  const verification = await verifyAuthenticationResponse({
    response: assertion,
    expectedChallenge: challenge.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: false,
    credential: {
      id: stored.id,
      publicKey: base64UrlToBytes(stored.public_key),
      counter: stored.counter,
      transports: parseTransports(stored.transports),
    },
  });
  if (!verification.verified) {
    return errorJson('verification-failed', 400);
  }
  await updateCredentialCounter(db, stored.id, verification.authenticationInfo.newCounter);
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
  return json({ ok: true }, 200, { 'set-cookie': clearCookieHeader(request.url) });
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
  const { rpName, rpID } = relyingParty(env, request);
  const existing = await listCredentials(db, userId);
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: `learner-${userId.slice(0, 8)}`,
    userID: new TextEncoder().encode(userId),
    userDisplayName: 'Externalize',
    attestationType: 'none',
    excludeCredentials: existing.map((row) => ({
      id: row.id,
      transports: parseTransports(row.transports),
    })),
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
    supportedAlgorithmIDs: [-7, -257],
  });
  const challengeId = await insertChallenge(db, {
    challenge: options.challenge,
    type: 'add-passkey',
    userId,
  });
  return json({ challengeId, options });
}

async function handleAddPasskeyVerify(
  db: D1Database,
  env: Env,
  request: Request,
): Promise<Response> {
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
  const challenge = await takeChallenge(db, body.challengeId, 'add-passkey');
  if (!challenge || challenge.user_id !== userId) {
    return errorJson('challenge-expired', 400);
  }
  const { rpID, origin } = relyingParty(env, request);
  const verification = await verifyRegistrationResponse({
    response: body.response as RegistrationResponseJSON,
    expectedChallenge: challenge.challenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    requireUserVerification: false,
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
    return json({ progress: null, updatedAt: null });
  }
  let snapshot: unknown;
  try {
    snapshot = JSON.parse(row.snapshot);
  } catch {
    return errorJson('corrupt-snapshot', 500);
  }
  if (!isProgressStore(snapshot)) {
    return errorJson('corrupt-snapshot', 500);
  }
  return json({ progress: snapshot, updatedAt: row.updated_at });
}

async function handleSyncPost(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  const body = (await readJsonBody(request)) as { progress?: unknown };
  if (!isProgressStore(body.progress)) {
    return errorJson('invalid-progress', 400);
  }
  const incoming = body.progress;
  const row = await getProgress(db, userId);
  let merged: ProgressStore = incoming;
  if (row) {
    let stored: unknown;
    try {
      stored = JSON.parse(row.snapshot);
    } catch {
      return errorJson('corrupt-snapshot', 500);
    }
    if (!isProgressStore(stored)) {
      return errorJson('corrupt-snapshot', 500);
    }
    merged = mergeProgress(incoming, stored);
  }
  await upsertProgress(db, userId, JSON.stringify(merged));
  return json({ progress: merged });
}

async function handleDeleteAccount(db: D1Database, request: Request): Promise<Response> {
  const userId = await readSessionUser(db, request);
  if (!userId) {
    return errorJson('not-signed-in', 401);
  }
  await deleteAccount(db, userId);
  return json({ ok: true }, 200, { 'set-cookie': clearCookieHeader(request.url) });
}
