import { initializeApp, getApps } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig =
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
  import.meta.env.VITE_FIREBASE_APP_ID
    ? {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
      }
    : null;

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function ensureFirebase() {
  if (!firebaseConfig) return;

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  if (!authInstance) authInstance = getAuth(app);
  if (!dbInstance) dbInstance = getFirestore(app);
}

export function getFirebaseAuth(): Auth | null {
  ensureFirebase();
  return authInstance;
}

export function getFirebaseDb(): Firestore | null {
  ensureFirebase();
  return dbInstance;
}
