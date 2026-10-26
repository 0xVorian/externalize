import {
  browserSupportsWebAuthn,
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';
import type { ProgressStore } from './storage';

export type AccountSession = {
  signedIn: boolean;
  passkeyCount: number;
};

export class AccountApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, status: number) {
    super(code);
    this.name = 'AccountApiError';
    this.code = code;
    this.status = status;
  }
}

export function passkeysSupported(): boolean {
  return browserSupportsWebAuthn();
}

export async function fetchAccountAvailability(): Promise<boolean> {
  try {
    const response = await api('/api/status');
    if (!response.ok) {
      return false;
    }
    const body = (await response.json()) as { available?: boolean };
    return body.available === true;
  } catch {
    return false;
  }
}

export async function fetchAccountSession(): Promise<AccountSession> {
  const response = await api('/api/session');
  if (!response.ok) {
    return { signedIn: false, passkeyCount: 0 };
  }
  const body = (await response.json()) as AccountSession;
  return {
    signedIn: body.signedIn === true,
    passkeyCount: typeof body.passkeyCount === 'number' ? body.passkeyCount : 0,
  };
}

export async function registerPasskey(): Promise<AccountSession> {
  const { challengeId, options } = await postJson<{
    challengeId: string;
    options: Parameters<typeof startRegistration>[0]['optionsJSON'];
  }>('/api/auth/register/options', {});
  const response = await startRegistration({ optionsJSON: options });
  const body = await postJson<AccountSession>('/api/auth/register/verify', {
    challengeId,
    response,
  });
  return { signedIn: true, passkeyCount: body.passkeyCount ?? 1 };
}

export async function authenticatePasskey(): Promise<AccountSession> {
  const { challengeId, options } = await postJson<{
    challengeId: string;
    options: Parameters<typeof startAuthentication>[0]['optionsJSON'];
  }>('/api/auth/login/options', {});
  const response = await startAuthentication({ optionsJSON: options });
  const body = await postJson<AccountSession>('/api/auth/login/verify', {
    challengeId,
    response,
  });
  return { signedIn: true, passkeyCount: body.passkeyCount ?? 1 };
}

export async function addPasskey(): Promise<AccountSession> {
  const { challengeId, options } = await postJson<{
    challengeId: string;
    options: Parameters<typeof startRegistration>[0]['optionsJSON'];
  }>('/api/auth/passkeys/options', {});
  const response = await startRegistration({ optionsJSON: options });
  const body = await postJson<AccountSession>('/api/auth/passkeys/verify', {
    challengeId,
    response,
  });
  return { signedIn: true, passkeyCount: body.passkeyCount ?? 1 };
}

export async function signOutAccount(): Promise<void> {
  await postJson('/api/auth/logout', {});
}

export async function deleteAccount(): Promise<void> {
  const response = await api('/api/account', { method: 'DELETE' });
  await readOk(response);
}

export async function pullRemoteProgress(): Promise<ProgressStore | null> {
  const response = await api('/api/sync');
  if (response.status === 401) {
    throw new AccountApiError('not-signed-in', 401);
  }
  const body = (await readOk(response)) as { progress?: ProgressStore | null };
  return body.progress ?? null;
}

export async function pushLocalProgress(progress: ProgressStore): Promise<ProgressStore> {
  const body = await postJson<{ progress: ProgressStore }>('/api/sync', { progress });
  return body.progress;
}

export function isPasskeyCancellation(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }
  const name = 'name' in error ? String(error.name) : '';
  return name === 'NotAllowedError' || name === 'AbortError';
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await api(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return readOk(response) as Promise<T>;
}

async function readOk(response: Response): Promise<unknown> {
  let body: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { error: 'invalid-json' };
    }
  }
  if (!response.ok) {
    const code =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error: unknown }).error)
        : `http-${response.status}`;
    throw new AccountApiError(code, response.status);
  }
  return body;
}

function api(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(path, { ...init, credentials: 'include' });
}
