import * as admin from "firebase-admin";

let authInstance: any = null;
let firestoreInstance: any = null;

function decodeJwtPayload(token: string) {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

try {
  if (!admin.apps || admin.apps.length === 0) {
    // For development, skip initialization if credentials are not available
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
      });
      authInstance = admin.auth();
      firestoreInstance = admin.firestore();
    } else {
      console.warn("Firebase Admin not initialized - no FIREBASE_SERVICE_ACCOUNT_KEY provided");
      // Create mock instances for development
      authInstance = {
        verifyIdToken: async (token: string) => {
          const payload = decodeJwtPayload(token);
          if (!payload) {
            throw new Error("Invalid token");
          }

          return {
            uid: String(payload.user_id ?? payload.sub ?? "mock-user"),
            email: typeof payload.email === "string" ? payload.email : "mock@example.com",
          };
        },
      };
      firestoreInstance = null;
    }
  } else {
    authInstance = admin.auth();
    firestoreInstance = admin.firestore();
  }
} catch (error) {
  console.warn("Firebase Admin initialization failed:", error);
  // Create mock instances for development
  authInstance = {
    verifyIdToken: async (token: string) => {
      const payload = decodeJwtPayload(token);
      if (!payload) {
        throw new Error("Invalid token");
      }

      return {
        uid: String(payload.user_id ?? payload.sub ?? "mock-user"),
        email: typeof payload.email === "string" ? payload.email : "mock@example.com",
      };
    },
  };
  firestoreInstance = null;
}

export const auth = authInstance;
export const firestore = firestoreInstance;
