import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const readServerEnv = (key: string) => (process.env[key] || '').trim();

const readFirstServerEnv = (keys: string[]) => {
  for (const key of keys) {
    const value = readServerEnv(key);
    if (value) {
      return value;
    }
  }
  return '';
};

const normalizePrivateKey = (value: string) => {
  return value.replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n');
};

const inferProjectIdFromClientEmail = (clientEmail: string) => {
  const match = clientEmail.match(/@([a-z0-9-]+)\.iam\.gserviceaccount\.com$/i);
  return match?.[1]?.trim() || '';
};

const getFirebaseAdminConfig = (): FirebaseAdminConfig | null => {
  const clientEmail = readFirstServerEnv([
    'FIREBASE_ADMIN_CLIENT_EMAIL',
    'FIREBASE_CLIENT_EMAIL'
  ]);
  const privateKeyRaw = readFirstServerEnv([
    'FIREBASE_ADMIN_PRIVATE_KEY',
    'FIREBASE_PRIVATE_KEY'
  ]);
  const configuredProjectId = readFirstServerEnv([
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_PROJECT_ID',
    'GOOGLE_CLOUD_PROJECT',
    'GCLOUD_PROJECT',
    'VITE_FIREBASE_PROJECT_ID'
  ]);
  const inferredProjectId = inferProjectIdFromClientEmail(clientEmail);
  const projectId = configuredProjectId || inferredProjectId;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKeyRaw)
  };
};

export const getFirebaseAdminConfigError = () => {
  const config = getFirebaseAdminConfig();
  if (config) return null;
  return 'Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID/FIREBASE_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY/FIREBASE_PRIVATE_KEY.';
};

const getFirebaseAdminApp = (): App | null => {
  const config = getFirebaseAdminConfig();
  if (!config) return null;

  if (getApps().length) {
    return getApp();
  }

  return initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey
    })
  });
};

export const verifyFirebaseIdToken = async (idToken: string) => {
  const app = getFirebaseAdminApp();
  if (!app) {
    return null;
  }

  try {
    return await getAuth(app).verifyIdToken(idToken);
  } catch {
    return null;
  }
};
