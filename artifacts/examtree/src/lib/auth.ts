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

type BlockedAccountCode = "ACCOUNT_SUSPENDED" | "ACCOUNT_UNAVAILABLE" | "ACCOUNT_RECOVERY_COMPLETED";

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
  return code === "ACCOUNT_SUSPENDED"
    || code === "ACCOUNT_UNAVAILABLE"
    || code === "ACCOUNT_RECOVERY_COMPLETED"
    ? code
    : null;
}

function isRevokedSessionError(error: unknown): boolean {
  return error instanceof ApiError
    && error.status === 401
    && getApiErrorCode(error.body) === "SESSION_REVOKED";
}

function blockedAccountNotice(code: BlockedAccountCode): string {
  if (code === "ACCOUNT_RECOVERY_COMPLETED") {
    return "Your ExamTree account recovery was completed successfully. For your protection, you have been signed out and the account remains suspended until an administrator completes the final reactivation review.";
  }
  if (code === "ACCOUNT_SUSPENDED") {
    return "Your ExamTree account has been suspended by an administrator. You have been signed out and cannot continue tests or submit attempts. Please contact ExamTree support if you believe this is a mistake.";
  }
  return "Your ExamTree account is currently unavailable or has been removed. You have been signed out and cannot continue tests or submit attempts. Please contact ExamTree support for assistance.";
}

async function terminateStudentSession(input: {
  reason: "account-suspended" | "account-unavailable" | "account-recovery-completed" | "session-revoked";
  notice: string;
}): Promise<void> {
  if (typeof window !== "undefined") {
    const noticeKey = `examtree.auth-notice.${input.reason}`;
    if (!window.sessionStorage.getItem(noticeKey)) {
      window.sessionStorage.setItem(noticeKey, "shown");
      window.alert(input.notice);
    }
  }

  // Canonical account state plus the cleared local student state are the
  // authority for ejection. Firebase sign-out is best-effort cleanup and must
  // never hold a revoked/suspended student inside an already-open test runner.
  clearAuth();
  clearStudentLocalData();
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    try {
      void signOut(auth).catch(() => undefined);
    } catch {
      // Some partially hydrated auth states can reject synchronously. Ejection
      // must still continue because canonical session state is authoritative.
    }
  }
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.replace(`/login?reason=${input.reason}`);
  }
}

async function terminateBlockedStudentSession(code: BlockedAccountCode): Promise<void> {
  await terminateStudentSession({
    reason: code === "ACCOUNT_RECOVERY_COMPLETED"
      ? "account-recovery-completed"
      : code === "ACCOUNT_SUSPENDED"
        ? "account-suspended"
        : "account-unavailable",
    notice: blockedAccountNotice(code),
  });
}

async function terminateRevokedStudentSession(): Promise<void> {
  await terminateStudentSession({
    reason: "session-revoked",
    notice: "Your ExamTree session was ended by an administrator. You have been signed out on this device. Sign in again to continue using ExamTree.",
  });
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
    if (isRevokedSessionError(error)) {
      await terminateRevokedStudentSession();
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
      } else if (isRevokedSessionError(createError)) {
        await terminateRevokedStudentSession();
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
      } else if (isRevokedSessionError(error)) {
        await terminateRevokedStudentSession();
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

  // Account state and token revocation must take effect in an already-open test
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
