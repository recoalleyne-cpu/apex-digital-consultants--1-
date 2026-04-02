import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const readEnv = (key: string) =>
  ((import.meta.env as Record<string, string | undefined>)[key] || '').trim();

const firebaseConfig: FirebaseOptions = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: readEnv('VITE_FIREBASE_STORAGE_BUCKET') || undefined,
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID')
};

const requiredFirebaseEnv: Array<[string, string]> = [
  ['VITE_FIREBASE_API_KEY', firebaseConfig.apiKey || ''],
  ['VITE_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain || ''],
  ['VITE_FIREBASE_PROJECT_ID', firebaseConfig.projectId || ''],
  ['VITE_FIREBASE_MESSAGING_SENDER_ID', firebaseConfig.messagingSenderId || ''],
  ['VITE_FIREBASE_APP_ID', firebaseConfig.appId || '']
];

export const missingFirebaseEnvKeys = requiredFirebaseEnv
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseEnvKeys.length === 0;

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);

  if (firebaseConfig.storageBucket) {
    storage = getStorage(firebaseApp);
  }
} else if (import.meta.env.DEV) {
  console.warn(
    `[firebase] Missing required env vars: ${missingFirebaseEnvKeys.join(', ')}. Firebase services are disabled until configured.`
  );
}

export { firebaseApp, auth, db, storage };

export const getFirebaseServices = () => {
  if (!firebaseApp || !auth || !db) {
    const missing = missingFirebaseEnvKeys.length
      ? ` Missing env: ${missingFirebaseEnvKeys.join(', ')}.`
      : '';
    throw new Error(`Firebase is not configured.${missing}`);
  }

  return {
    firebaseApp,
    auth,
    db,
    storage
  };
};
