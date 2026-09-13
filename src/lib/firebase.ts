import { initializeApp, getApps } from "firebase/app";
import { getAuth, type Auth, type User as FirebaseUser } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

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

const e2eAuthToken = String(import.meta.env.VITE_E2E_AUTH_TOKEN ?? "").trim();
const e2eAuthUser = e2eAuthToken
  ? ({
      uid: String(import.meta.env.VITE_E2E_AUTH_UID ?? "e2e-student"),
      email: String(import.meta.env.VITE_E2E_AUTH_EMAIL ?? "student.e2e@examtree.local"),
      displayName: String(import.meta.env.VITE_E2E_AUTH_NAME ?? "E2E Student"),
      getIdToken: async () => e2eAuthToken,
    } as unknown as FirebaseUser)
  : null;

const e2eAuthInstance = e2eAuthUser
  ? ({
      currentUser: e2eAuthUser,
      onAuthStateChanged: (
        observer:
          | ((user: FirebaseUser | null) => void)
          | { next?: (user: FirebaseUser | null) => void },
      ) => {
        queueMicrotask(() => {
          if (typeof observer === "function") observer(e2eAuthUser);
          else observer.next?.(e2eAuthUser);
        });
        return () => {};
      },
    } as unknown as Auth)
  : null;

let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

function ensureFirebase() {
  if (!firebaseConfig) return;

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  if (!authInstance) authInstance = getAuth(app);
  if (!dbInstance) dbInstance = getFirestore(app);
  if (!storageInstance) storageInstance = getStorage(app);
}

export function getFirebaseAuth(): Auth | null {
  if (e2eAuthInstance) return e2eAuthInstance;
  ensureFirebase();
  return authInstance;
}

export function getFirebaseDb(): Firestore | null {
  ensureFirebase();
  return dbInstance;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  ensureFirebase();
  return storageInstance;
}
