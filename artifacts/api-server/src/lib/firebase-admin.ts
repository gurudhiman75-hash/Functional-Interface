import * as admin from "firebase-admin";

let authInstance: any = null;
let firestoreInstance: any = null;

try {
  if (!admin.apps || admin.apps.length === 0) {
    // For development, skip initialization if credentials are not available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      });
    } else {
      console.warn("Firebase Admin not initialized - no FIREBASE_SERVICE_ACCOUNT_KEY provided");
    }
  }
  authInstance = admin.auth();
  firestoreInstance = admin.firestore();
} catch (error) {
  console.warn("Firebase Admin initialization failed:", error);
}

export const auth = authInstance;
export const firestore = firestoreInstance;