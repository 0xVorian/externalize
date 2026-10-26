import type { Locale } from './locale';

export type AccountUiCopy = {
  passkeyHint: string;
  passkeyHintSignedIn: string;
  passkeyOffline: string;
  passkeyPending: string;
  passkeyCreate: string;
  passkeyUse: string;
  passkeyAdd: string;
  signOut: string;
  deleteAccount: string;
  deleteConfirm: string;
  deleteConfirmAction: string;
  deleteCancel: string;
  signedIn: string;
  unsupported: string;
  createSuccess: string;
  useSuccess: string;
  addSuccess: string;
  signOutSuccess: string;
  deleteSuccess: string;
  syncSuccess: string;
  errorGeneric: string;
  errorCancelled: string;
};

const ACCOUNT_UI: Record<Locale, AccountUiCopy> = {
  en: {
    passkeyHint:
      'A passkey can copy this device’s progress to another phone or computer. Signing in is optional.',
    passkeyHintSignedIn:
      'Progress on this device copies to your other devices when you are online.',
    passkeyOffline: 'Working on this device. Copying waits until you are back online.',
    passkeyPending: 'Progress on this device will copy when you are online.',
    passkeyCreate: 'Create a passkey',
    passkeyUse: 'Use a passkey',
    passkeyAdd: 'Add another passkey',
    signOut: 'Sign out',
    deleteAccount: 'Remove server copy',
    deleteConfirm:
      'Remove the server copy of this progress? This device keeps its local copy.',
    deleteConfirmAction: 'Remove server copy',
    deleteCancel: 'Keep server copy',
    signedIn: 'Signed in with a passkey.',
    unsupported: 'This browser cannot create a passkey. Export a file instead.',
    createSuccess: 'Passkey created. Progress will copy when this device is online.',
    useSuccess: 'Signed in. Progress from this device and the server copy are combined.',
    addSuccess: 'Another passkey is ready on this device.',
    signOutSuccess: 'Signed out. Progress on this device is unchanged.',
    deleteSuccess: 'Server copy removed. Progress on this device is unchanged.',
    syncSuccess: 'Progress from this device and the server copy are combined.',
    errorGeneric: 'That did not finish. Try again when you are ready.',
    errorCancelled: 'Passkey step cancelled.',
  },
  fr: {
    passkeyHint:
      'Une clé d’accès peut recopier le suivi de cet appareil vers un autre téléphone ou ordinateur. La connexion reste facultative.',
    passkeyHintSignedIn:
      'Le suivi de cet appareil est recopié vers vos autres appareils lorsque vous êtes en ligne.',
    passkeyOffline:
      'Travail sur cet appareil. La recopie attend le retour de la connexion.',
    passkeyPending: 'Le suivi de cet appareil sera recopié une fois la connexion rétablie.',
    passkeyCreate: 'Créer une clé d’accès',
    passkeyUse: 'Utiliser une clé d’accès',
    passkeyAdd: 'Ajouter une autre clé d’accès',
    signOut: 'Se déconnecter',
    deleteAccount: 'Retirer la copie sur le serveur',
    deleteConfirm:
      'Retirer la copie de ce suivi sur le serveur ? Cet appareil conserve sa copie locale.',
    deleteConfirmAction: 'Retirer la copie sur le serveur',
    deleteCancel: 'Conserver la copie sur le serveur',
    signedIn: 'Connecté avec une clé d’accès.',
    unsupported:
      'Ce navigateur ne peut pas créer de clé d’accès. Exportez plutôt un fichier.',
    createSuccess:
      'Clé d’accès créée. Le suivi sera recopié lorsque cet appareil sera en ligne.',
    useSuccess:
      'Connexion établie. Le suivi de cet appareil et la copie sur le serveur sont combinés.',
    addSuccess: 'Une autre clé d’accès est prête sur cet appareil.',
    signOutSuccess: 'Déconnexion effectuée. Le suivi sur cet appareil est inchangé.',
    deleteSuccess:
      'Copie sur le serveur retirée. Le suivi sur cet appareil est inchangé.',
    syncSuccess: 'Le suivi de cet appareil et la copie sur le serveur sont combinés.',
    errorGeneric: 'L’opération n’a pas abouti. Réessayez quand vous le souhaitez.',
    errorCancelled: 'Étape de clé d’accès annulée.',
  },
};

export function accountUi(locale: Locale): AccountUiCopy {
  return ACCOUNT_UI[locale];
}
