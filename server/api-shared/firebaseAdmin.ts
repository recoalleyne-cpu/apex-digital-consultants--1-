import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const readServerEnv = (key: string) => (process.env[key] || '').trim();

const getFirebaseAdminConfig = (): FirebaseAdminConfig | null => {
  const projectId =
    readServerEnv('FIREBASE_ADMIN_PROJECT_ID') || readServerEnv('VITE_FIREBASE_PROJECT_ID');
  const clientEmail = readServerEnv('FIREBASE_ADMIN_CLIENT_EMAIL');
  const privateKeyRaw = readServerEnv('FIREBASE_ADMIN_PRIVATE_KEY');

  if (!projectId || !clientEmail || !privateKeyRaw) {
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKeyRaw.replace(/\\n/g, '\n')
  };
};

export const getFirebaseAdminConfigError = () => {
  const config = getFirebaseAdminConfig();
  if (config) return null;
  return 'Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.';
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
    return await getAuth(app).verifyIdToken(idToken, true);
  } catch {
    return null;
  }
};

