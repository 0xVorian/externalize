import { accountUi, type Locale } from '../i18n';

export type AccountView = {
  available: boolean;
  supported: boolean;
  signedIn: boolean;
  passkeyCount: number;
  online: boolean;
  pendingSync: boolean;
  busy: boolean;
  confirmDelete: boolean;
  notice: { kind: 'success' | 'error' | 'info'; message: string } | null;
};

export function defaultAccountView(): AccountView {
  return {
    available: false,
    supported: false,
    signedIn: false,
    passkeyCount: 0,
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    pendingSync: false,
    busy: false,
    confirmDelete: false,
    notice: null,
  };
}

export function renderAccountPanel(locale: Locale, account: AccountView): string {
  if (!account.available) {
    return '';
  }
  const copy = accountUi(locale);
  if (!account.supported) {
    return `<p class="progress-meta" data-testid="account-panel" data-account-available="true">${copy.unsupported}</p>`;
  }

  const status = account.signedIn
    ? account.online
      ? account.pendingSync
        ? copy.passkeyPending
        : copy.passkeyHintSignedIn
      : copy.passkeyOffline
    : copy.passkeyHint;
  const signedInMeta = account.signedIn
    ? `<p class="progress-meta" data-testid="account-signed-in">${copy.signedIn}</p>`
    : '';
  const notice = account.notice
    ? `<p class="progress-notice progress-notice-${account.notice.kind}" role="status">${account.notice.message}</p>`
    : '';
  const disabled = account.busy ? ' disabled' : '';

  const actions = account.signedIn
    ? account.confirmDelete
      ? `
        <p class="progress-meta">${copy.deleteConfirm}</p>
        <button type="button" class="secondary" data-action="confirm-delete-account"${disabled}>${copy.deleteConfirmAction}</button>
        <button type="button" class="secondary" data-action="cancel-delete-account"${disabled}>${copy.deleteCancel}</button>
      `
      : `
        <button type="button" class="secondary" data-action="add-passkey"${disabled}>${copy.passkeyAdd}</button>
        <button type="button" class="secondary" data-action="sign-out-account"${disabled}>${copy.signOut}</button>
        <button type="button" class="secondary" data-action="delete-account"${disabled}>${copy.deleteAccount}</button>
      `
    : `
      <button type="button" class="secondary" data-action="create-passkey"${disabled}>${copy.passkeyCreate}</button>
      <button type="button" class="secondary" data-action="use-passkey"${disabled}>${copy.passkeyUse}</button>
    `;

  return `
    <div class="account-panel" data-testid="account-panel" data-account-available="true" data-account-signed-in="${account.signedIn}">
      ${notice}
      ${signedInMeta}
      <p class="progress-meta">${status}</p>
      <div class="progress-actions">${actions}</div>
    </div>
  `;
}
