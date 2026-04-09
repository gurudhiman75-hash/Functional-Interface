import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { clearAuth, setUser, type User } from "@/lib/storage";

type UserProfile = {
  email: string;
  name: string;
  role: "admin" | "student";
  createdAt: number;
  updatedAt: number;
};

function createGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

export async function upsertUserProfile(firebaseUser: FirebaseUser): Promise<User> {
  const email = firebaseUser.email ?? "";
  const displayName = firebaseUser.displayName?.trim() || email.split("@")[0] || "User";
  // Set a local session immediately so route guards don't bounce user back to login.
  let appUser: User = {
    id: firebaseUser.uid,
    email,
    name: displayName,
    role: "student",
  };
  setUser(appUser);

  try {
    const db = getFirebaseDb();
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);
    const now = Date.now();

    let role: "admin" | "student" = "student";
    if (snap.exists()) {
      const data = snap.data() as Partial<UserProfile>;
      role = data.role === "admin" ? "admin" : "student";
      await setDoc(
        ref,
        { email, name: displayName, role, updatedAt: now },
        { merge: true },
      );
    } else {
      await setDoc(ref, {
        email,
        name: displayName,
        role: "student",
        createdAt: now,
        updatedAt: now,
      } satisfies UserProfile);
    }

    appUser = { ...appUser, role };
    setUser(appUser);
  } catch {
    // Keep local session even when profile reads/writes fail.
  }

  return appUser;
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  const provider = createGoogleProvider();

  try {
    const cred = await signInWithPopup(auth, provider);
    return upsertUserProfile(cred.user);
  } catch (error) {
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code: string }).code
        : "";

    if (
      code === "auth/popup-blocked" ||
      code === "auth/cancelled-popup-request"
    ) {
      await signInWithRedirect(auth, provider);
      return new Promise<User>(() => {
        // Redirect navigation interrupts this promise; it stays pending intentionally.
      });
    }

    throw error;
  }
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  const auth = getFirebaseAuth();
  const cred = await getRedirectResult(auth);
  if (!cred?.user) return null;
  return upsertUserProfile(cred.user);
}

export function syncAuthSession() {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      clearAuth();
      return;
    }
    try {
      await upsertUserProfile(firebaseUser);
    } catch {
      // Keep session resilient if profile fetch fails.
    }
  });
}
