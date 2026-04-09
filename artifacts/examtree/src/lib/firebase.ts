import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseConfig(): FirebaseOptions {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const missing = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length > 0) {
    throw new Error(
      `Firebase is not configured. Missing env vars: ${missing.join(", ")}. Create a .env file with the VITE_FIREBASE_* values from Firebase console.`,
    );
  }

  return firebaseConfig;
}

function getFirebaseApp(): FirebaseApp {
  if (app) return app;

  app = getApps()[0] ?? initializeApp(getFirebaseConfig());
  return app;
}

export function getFirebaseAuth(): Auth {
  if (auth) return auth;

  auth = getAuth(getFirebaseApp());
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (db) return db;

  db = getFirestore(getFirebaseApp());
  return db;
}
