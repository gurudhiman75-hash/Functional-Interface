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

type DevelopmentSessionOptions = {
  email: string;
  name?: string;
  role: "admin" | "student";
};

type BlockedAccountCode = "ACCOUNT_SUSPENDED" | "ACCOUNT_UNAVAILABLE";

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

function getBlockedAccountCode(error: unknown): BlockedAccountCode | null {
  if (!(error instanceof ApiError) || error.status !== 403) return null;
  const code = getApiErrorCode(error.body);
  return code === "ACCOUNT_SUSPENDED" || code === "ACCOUNT_UNAVAILABLE" ? code : null;
}

function blockedAccountNotice(code: BlockedAccountCode): string {
  if (code === "ACCOUNT_SUSPENDED") {
    return "Your ExamTree account has been suspended by an administrator. You have been signed out and cannot continue tests or submit attempts. Please contact ExamTree support if you believe this is a mistake.";
  }
  return "Your ExamTree account is currently unavailable or has been removed. You have been signed out and cannot continue tests or submit attempts. Please contact ExamTree support for assistance.";
}

async function terminateBlockedStudentSession(code: BlockedAccountCode): Promise<void> {
  if (typeof window !== "undefined") {
    const noticeKey = `examtree.blocked-account-notice.${code}`;
    if (!window.sessionStorage.getItem(noticeKey)) {
      window.sessionStorage.setItem(noticeKey, "shown");
      window.alert(blockedAccountNotice(code));
    }
  }

  clearAuth();
  clearStudentLocalData();
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    await signOut(auth).catch(() => undefined);
  }
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    const reason = code === "ACCOUNT_SUSPENDED" ? "account-suspended" : "account-unavailable";
    window.location.replace(`/login?reason=${reason}`);
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
    const blockedCode = getBlockedAccountCode(error);
    if (blockedCode) {
      await terminateBlockedStudentSession(blockedCode);
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
      const createBlockedCode = getBlockedAccountCode(createError);
      if (createBlockedCode) {
        await terminateBlockedStudentSession(createBlockedCode);
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
      const blockedCode = getBlockedAccountCode(error);
      if (blockedCode) {
        await terminateBlockedStudentSession(blockedCode);
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

  // Suspension, disabling, and deletion must take effect in an already-open test
  // runner. The backend checks every protected request, while this short poll
  // ejects an idle or locally active tab even when no navigation/refresh occurs.
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

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await signInWithRedirect(auth, provider);
}
