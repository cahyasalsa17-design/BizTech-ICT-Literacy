import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  query, 
  orderBy,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ModuleContent } from '../types';
import { MODULES } from '../constants';

const COLLECTION_NAME = 'modules';

export async function getModules(): Promise<ModuleContent[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return MODULES;
    }
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as ModuleContent[];
  } catch (error) {
    console.warn("Could not fetch modules from Firestore, using default content:", error);
    return MODULES; // Fallback to constants
  }
}

export async function seedInitialModules() {
  console.log("Seeding initial modules...");
  for (const module of MODULES) {
    await setDoc(doc(db, COLLECTION_NAME, module.id), {
      ...module,
      createdAt: serverTimestamp()
    });
  }
}

export async function addModule(module: Omit<ModuleContent, 'id'>) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...module,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateModule(id: string, module: Partial<ModuleContent>) {
  await setDoc(doc(db, COLLECTION_NAME, id), {
    ...module,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function deleteModule(id: string) {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}
