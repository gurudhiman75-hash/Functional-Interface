import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

type StoredUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

function readStoredUser(): StoredUser | null {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null') as StoredUser | null;
  } catch {
    return null;
  }
}

function redirectToAdminLogin() {
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`/login/admin?next=${next}`);
}

export function ExamTreeAdminGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser?.role !== 'admin') {
      redirectToAdminLogin();
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      setAuthorized(true);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        redirectToAdminLogin();
        return;
      }
      setAuthorized(true);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying ExamTree administrator access…
      </div>
    );
  }

  return authorized ? children : null;
}
