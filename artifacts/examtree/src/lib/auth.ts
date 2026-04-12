import {
  GoogleAuthProvider,
  deleteUser,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  type User as FirebaseUser,
} from "firebase/auth";
import { apiRequest } from "@/lib/api";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  clearAuth,
  clearStudentLocalData,
  setUser,
  type User,
} from "@/lib/storage";

type DevelopmentSessionOptions = {
  email: string;
  name?: string;
  role: "admin" | "student";
};

export function createDevelopmentSession({
  email,
  name,
  role,
}: DevelopmentSessionOptions): User {
  const normalizedEmail = email.trim().toLowerCase();
  const fallbackName =
    normalizedEmail.split("@")[0] || (role === "admin" ? "Admin User" : "Student User");
  const appUser: User = {
    id: `dev-${role}-${normalizedEmail || Date.now()}`,
    email: normalizedEmail || `${role}@local.dev`,
    name: name?.trim() || fallbackName,
    role,
  };
  setUser(appUser);
  return appUser;
}

async function fetchOrCreateUserProfile(
  firebaseUser: FirebaseUser,
): Promise<User> {
  try {
    const existing = await apiRequest<User>("/users/me");
    setUser(existing);
    return existing;
  } catch {
    const created = await apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify({
        id: firebaseUser.uid,
        email: firebaseUser.email ?? "",
        name: firebaseUser.displayName?.trim() || firebaseUser.email?.split("@")[0] || "User",
      }),
    });
    setUser(created);
    return created;
  }
}

export async function upsertUserProfile(
  firebaseUser: FirebaseUser,
): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return createDevelopmentSession({
      email: firebaseUser.email ?? "",
      name: firebaseUser.displayName ?? undefined,
      role: "student",
    });
  }

  return fetchOrCreateUserProfile(firebaseUser);
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth not available in development mode");
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return upsertUserProfile(result.user);
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return null;
  }

  const result = await getRedirectResult(auth);
  if (!result?.user) return null;
  return upsertUserProfile(result.user);
}

export function syncAuthSession() {
  const auth = getFirebaseAuth();
  if (!auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      clearAuth();
      return;
    }

    try {
      await fetchOrCreateUserProfile(firebaseUser);
    } catch (error) {
      console.warn("Failed to sync auth session:", error);
    }
  });
}

export async function deleteCurrentStudentAccount() {
  const auth = getFirebaseAuth();
  if (!auth?.currentUser) {
    clearAuth();
    clearStudentLocalData();
    return;
  }

  await deleteUser(auth.currentUser);
  clearAuth();
  clearStudentLocalData();
}

export async function startGoogleRedirectSignIn() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth not available in development mode");
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, provider);
}
