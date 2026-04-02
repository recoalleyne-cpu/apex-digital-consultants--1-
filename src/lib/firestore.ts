import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type WhereFilterOp
} from 'firebase/firestore';
import { db, getFirebaseServices } from './firebase';

const requireDb = () => db ?? getFirebaseServices().db;

export const writeDocument = async <T extends DocumentData>(
  collectionName: string,
  documentId: string,
  payload: T,
  merge = true
) => {
  await setDoc(doc(requireDb(), collectionName, documentId), payload, { merge });
};

export const addCollectionItem = async <T extends DocumentData>(
  collectionName: string,
  payload: T
) => {
  const documentRef = await addDoc(collection(requireDb(), collectionName), payload);
  return documentRef.id;
};

export const readCollection = async <T extends DocumentData = DocumentData>(
  collectionName: string
) => {
  const snapshot = await getDocs(collection(requireDb(), collectionName));
  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as T)
  }));
};

export const readCollectionWhere = async <T extends DocumentData = DocumentData>(
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: unknown
) => {
  const constraints: QueryConstraint[] = [where(field, operator, value)];
  const snapshot = await getDocs(query(collection(requireDb(), collectionName), ...constraints));

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...(entry.data() as T)
  }));
};

export const readDocumentById = async <T extends DocumentData = DocumentData>(
  collectionName: string,
  documentId: string
) => {
  const snapshot = await getDoc(doc(requireDb(), collectionName, documentId));

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as T)
  };
};
