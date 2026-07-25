import {
  GoogleAuthProvider,
  deleteUser,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { ApiError, apiRequest, getApiErrorCode } from "@/lib/api";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  clearAuth,
  clearStudentLocalData,
  setUser,
  type User,
} from "@/lib/storage";

const ACCOUNT_BLOCK_NOTICE_KEY = "examtree.account-block-notice-shown";

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

function isAdminLoginHandoff(): boolean {
  return typeof window !== "undefined" && window.location.pathname.startsWith("/login/admin");
}

function createAdminHandoffUser(firebaseUser: FirebaseUser): User {
  const email = firebaseUser.email?.trim().toLowerCase() ?? "";
  return {
    id: firebaseUser.uid,
    email,
    name: firebaseUser.displayName?.trim() || email.split("@")[0] || "ExamTree Administrator",
    // This role only selects the /admin/ destination. The admin application then
    // verifies the Firebase token against canonical RBAC before rendering anything.
    role: "admin",
  };
}

function blockedAccountCode(error: unknown): string | undefined {
  if (!(error instanceof ApiError) || error.status !== 403) return undefined;
  const code = getApiErrorCode(error.body);
  return code === "ACCOUNT_SUSPENDED" || code === "ACCOUNT_UNAVAILABLE" ? code : undefined;
}

function isBlockedAccountError(error: unknown): boolean {
  return blockedAccountCode(error) != null;
}

function showBlockedAccountNotice(code?: string): void {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(ACCOUNT_BLOCK_NOTICE_KEY) === "1") return;
    window.sessionStorage.setItem(ACCOUNT_BLOCK_NOTICE_KEY, "1");
  } catch {
    // A browser may block session storage. The notice can still be shown.
  }

  const message = code === "ACCOUNT_SUSPENDED"
    ? "Your ExamTree account has been suspended by an administrator. You have been signed out and cannot continue tests or submit attempts. Please contact ExamTree support if you believe this is a mistake."
    : "Your ExamTree account is currently unavailable. You have been signed out. Please contact ExamTree support for assistance.";
  window.alert(message);
}

async function terminateBlockedStudentSession(code?: string): Promise<void> {
  showBlockedAccountNotice(code);
  clearAuth();
  clearStudentLocalData();
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    await signOut(auth).catch(() => undefined);
  }
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.replace(`/login?reason=${code === "ACCOUNT_SUSPENDED" ? "account-suspended" : "account-unavailable"}`);
  }
}

async function fetchOrCreateUserProfile(
  firebaseUser: FirebaseUser,
): Promise<User> {
  try {
    const existing = await apiRequest<User>("/users/me");
    setUser(existing);
    return existing;
  } catch (error) {
    if (isBlockedAccountError(error)) {
      await terminateBlockedStudentSession(blockedAccountCode(error));
      throw error;
    }

    try {
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
    } catch (createError) {
      if (isBlockedAccountError(createError)) {
        await terminateBlockedStudentSession(blockedAccountCode(createError));
      }
      throw createError;
    }
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

  if (isAdminLoginHandoff()) {
    return createAdminHandoffUser(firebaseUser);
  }

  return fetchOrCreateUserProfile(firebaseUser);
}

export async function signInWithGoogle(): Promise<User> {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase auth not available in development mode");
  }

  try {
    window.sessionStorage.removeItem(ACCOUNT_BLOCK_NOTICE_KEY);
  } catch {
    // Best effort only.
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

  let currentFirebaseUser: FirebaseUser | null = auth.currentUser;
  let statusCheckInFlight = false;

  const verifyCurrentAccount = async () => {
    if (!currentFirebaseUser || statusCheckInFlight) return;
    statusCheckInFlight = true;
    try {
      await fetchOrCreateUserProfile(currentFirebaseUser);
    } catch (error) {
      if (isBlockedAccountError(error)) {
        await terminateBlockedStudentSession(blockedAccountCode(error));
        currentFirebaseUser = null;
      } else {
        console.warn("Failed to sync auth session:", error);
      }
    } finally {
      statusCheckInFlight = false;
    }
  };

  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    currentFirebaseUser = firebaseUser;
    if (!firebaseUser) {
      clearAuth();
      return;
    }
    await verifyCurrentAccount();
  });

  // Suspension must take effect in an already-open test runner. The backend
  // also checks every protected request, while this short poll ejects an idle
  // or locally active tab even when no navigation/refresh occurs.
  const statusTimer = window.setInterval(() => {
    void verifyCurrentAccount();
  }, 3_000);

  return () => {
    window.clearInterval(statusTimer);
    unsubscribe();
  };
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

  try {
    window.sessionStorage.removeItem(ACCOUNT_BLOCK_NOTICE_KEY);
  } catch {
    // Best effort only.
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, provider);
}
