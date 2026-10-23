import {
  type ActionCodeSettings,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
  type UserCredential
} from 'firebase/auth';
import { auth, getFirebaseServices } from './firebase';

const requireAuth = () => auth ?? getFirebaseServices().auth;

export const signUpWithEmailPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(requireAuth(), email.trim(), password);
};

export const signInWithEmailPassword = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(requireAuth(), email.trim(), password);
};

export const signOutCurrentUser = async () => {
  await signOut(requireAuth());
};

export const sendPasswordResetLink = async (
  email: string,
  actionCodeSettings?: ActionCodeSettings
) => {
  const normalizedEmail = email.trim();
  if (actionCodeSettings) {
    await sendPasswordResetEmail(requireAuth(), normalizedEmail, actionCodeSettings);
    return;
  }

  await sendPasswordResetEmail(requireAuth(), normalizedEmail);
};

export const onAdminAuthStateChange = (
  callback: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(requireAuth(), callback);
};

export const getCurrentUserIdToken = async (forceRefresh = false) => {
  const currentUser = requireAuth().currentUser;
  if (!currentUser) {
    return null;
  }

  return currentUser.getIdToken(forceRefresh);
};
