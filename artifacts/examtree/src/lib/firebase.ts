// Temporarily disable Firebase for development
export function getFirebaseAuth(): Auth | null {
  return null;
}

export function getFirebaseDb(): Firestore | null {
  return null;
}
