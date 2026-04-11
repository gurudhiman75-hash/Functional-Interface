// import {
//   GoogleAuthProvider,
//   deleteUser,
//   getRedirectResult,
//   onAuthStateChanged,
//   signInWithRedirect,
//   signInWithPopup,
//   type User as FirebaseUser,
// } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";
import { clearAuth, clearStudentLocalData, getUser, setUser, type User } from "@/lib/storage";

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

export async function upsertUserProfile(firebaseUser: any): Promise<User> {
  // Firebase disabled for development - return mock user
  const email = firebaseUser.email ?? "";
  const displayName = firebaseUser.displayName?.trim() || email.split("@")[0] || "User";

  let appUser: User = {
    id: firebaseUser.uid,
    email,
    name: displayName,
    role: "student",
  };
  setUser(appUser);
  return appUser;
}

export async function signInWithGoogle(): Promise<User> {
  // Firebase disabled for development
  throw new Error("Firebase auth not available in development mode");
}

export async function completeGoogleRedirectSignIn(): Promise<User | null> {
  // Firebase disabled for development
  console.warn("Firebase auth not available");
  return null;
}

export function syncAuthSession() {
  // Firebase disabled for development
  console.warn("Firebase auth not available, skipping auth sync");
  return () => {};
}

export async function deleteCurrentStudentAccount() {
  // Firebase disabled for development
  throw new Error("Firebase auth not available in development mode");
}
