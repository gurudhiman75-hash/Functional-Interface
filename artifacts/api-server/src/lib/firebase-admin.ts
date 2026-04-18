import * as admin from "firebase-admin";

const isProd = process.env.NODE_ENV === "production";

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

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  if (isProd) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY is required in production. " +
      "Set this environment variable to a valid Firebase service account JSON string.",
    );
  }
  console.warn(
    "[firebase-admin] FIREBASE_SERVICE_ACCOUNT_KEY not set. " +
    "Using mock auth — development only.",
  );
}

let authInstance: admin.auth.Auth | { verifyIdToken: (token: string) => Promise<{ uid: string; email: string }> };
let firestoreInstance: admin.firestore.Firestore | null = null;

if (serviceAccountKey) {
  if (!admin.apps || admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
    });
  }
  authInstance = admin.auth();
  firestoreInstance = admin.firestore();
} else {
  // Development mock — decodes the JWT locally without signature verification.
  // This path is unreachable in production (error thrown above).
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
}

export const auth = authInstance;
export const firestore = firestoreInstance;

