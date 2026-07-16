import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';
import { AdminPermissionProvider, type AdminSession } from './AdminPermissionContext';

const SESSION_KEY = 'examtree.admin.session';
const REDIRECT_KEY = 'examtree.admin.redirected';
const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

export function shouldRedirectToAdminLogin(pathname: string, hasRedirected: boolean) {
  return !pathname.startsWith('/login/admin') && !hasRedirected;
}

function redirectToAdminLogin() {
  if (!shouldRedirectToAdminLogin(window.location.pathname, Boolean(sessionStorage.getItem(REDIRECT_KEY)))) return;
  sessionStorage.setItem(REDIRECT_KEY, '1');
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`/login/admin?next=${next}`);
}

async function bootstrap(token: string): Promise<AdminSession> {
  const response = await fetch(`${apiBase}/admin/session/bootstrap`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json().catch(() => null) as (AdminSession & { error?: string }) | null;
  if (!response.ok || !body) throw new Error(body?.error || 'Administrator access required');
  return body;
}

export function ExamTreeAdminGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      redirectToAdminLogin();
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setLoading(false);
        redirectToAdminLogin();
        return;
      }
      try {
        const nextSession = await bootstrap(await firebaseUser.getIdToken());
        // Only profile and authorization-display data is retained; no token is stored.
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        sessionStorage.removeItem(REDIRECT_KEY);
        setSession(nextSession);
        setAuthorized(true);
      } catch {
        localStorage.removeItem(SESSION_KEY);
        setAuthorized(false);
        redirectToAdminLogin();
      } finally {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying ExamTree administrator access…
      </div>
    );
  }

  return authorized && session ? <AdminPermissionProvider session={session}>{children}</AdminPermissionProvider> : null;
}
