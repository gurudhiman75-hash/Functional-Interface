import adminPkg from "firebase-admin";
// ESM/CJS interop: firebase-admin v12 exposes its API on the default export
const admin = (adminPkg as unknown as { default?: typeof adminPkg }).default ?? adminPkg;

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

// Also support separate env vars (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL)
const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;

const hasSeparateVars = firebaseProjectId && firebasePrivateKey && firebaseClientEmail;

if (!serviceAccountKey && !hasSeparateVars) {
  if (isProd) {
    throw new Error(
      "Firebase credentials are required in production. " +
      "Set FIREBASE_SERVICE_ACCOUNT_KEY (full JSON) OR set FIREBASE_PROJECT_ID + FIREBASE_PRIVATE_KEY + FIREBASE_CLIENT_EMAIL.",
    );
  }
  console.warn(
    "[firebase-admin] Firebase credentials not set. " +
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
} else if (hasSeparateVars) {
  let initialized = false;
  try {
    if (!admin.apps || admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseProjectId,
          // Render stores the key with literal \n — convert to real newlines
          privateKey: firebasePrivateKey!.replace(/\\n/g, "\n"),
          clientEmail: firebaseClientEmail,
        }),
      });
    }
    authInstance = admin.auth();
    firestoreInstance = admin.firestore();
    initialized = true;
  } catch (err) {
    if (isProd) throw err; // hard fail in production
    console.warn(
      "[firebase-admin] Firebase separate-var credentials are invalid (placeholder values?). " +
      "Falling back to mock auth — development only.\n",
      (err as Error).message,
    );
  }
  if (!initialized) {
    authInstance = {
      verifyIdToken: async (token: string) => {
        const payload = decodeJwtPayload(token);
        if (!payload) throw new Error("Invalid token");
        return {
          uid: String(payload.user_id ?? payload.sub ?? "mock-user"),
          email: typeof payload.email === "string" ? payload.email : "mock@example.com",
        };
      },
    };
  }
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

