import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';
import { AdminPermissionProvider, type AdminSession } from './AdminPermissionContext';

const SESSION_KEY = 'examtree.admin.session';
const REDIRECT_KEY = 'examtree.admin.redirected';
const DEFAULT_LOCAL_LOGIN_ORIGIN = 'http://localhost:5173';
const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

type GateState =
  | { status: 'loading' }
  | { status: 'authorized'; session: AdminSession }
  | { status: 'pending'; session: AdminSession }
  | { status: 'error'; message: string };

class AdminBootstrapError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
  }
}

export function shouldRedirectToAdminLogin(pathname: string, hasRedirected: boolean) {
  return !pathname.startsWith('/login/admin') && !hasRedirected;
}

export function resolveAdminLoginDestination(nextPath: string): string {
  const configuredOrigin = String(import.meta.env.VITE_LOGIN_APP_URL ?? '').trim();
  const loginOrigin = configuredOrigin || (import.meta.env.DEV ? DEFAULT_LOCAL_LOGIN_ORIGIN : window.location.origin);
  const base = loginOrigin.endsWith('/') ? loginOrigin : `${loginOrigin}/`;
  return new URL(`/login/admin?next=${encodeURIComponent(nextPath)}`, base).toString();
}

function redirectToAdminLogin(): boolean {
  if (!shouldRedirectToAdminLogin(window.location.pathname, Boolean(sessionStorage.getItem(REDIRECT_KEY)))) {
    return false;
  }
  sessionStorage.setItem(REDIRECT_KEY, '1');
  const nextPath = window.location.pathname + window.location.search;
  window.location.replace(resolveAdminLoginDestination(nextPath));
  return true;
}

async function bootstrap(token: string): Promise<AdminSession> {
  const response = await fetch(`${apiBase}/admin/session/bootstrap`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.json().catch(() => null) as (AdminSession & { error?: string; code?: string }) | null;
  if (!response.ok || !body) {
    throw new AdminBootstrapError(
      body?.error || 'Administrator access could not be verified',
      response.status,
      body?.code,
    );
  }
  return body;
}

function GateMessage({ title, message, children }: { title: string; message: string; children?: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg rounded-xl border bg-card p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
        {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}

export function ExamTreeAdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    const auth = getFirebaseAuth();
    if (!auth) {
      if (!redirectToAdminLogin()) {
        setState({ status: 'error', message: 'Firebase Authentication is not configured for the admin application.' });
      }
      return undefined;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;
      if (!firebaseUser) {
        localStorage.removeItem(SESSION_KEY);
        if (!redirectToAdminLogin()) {
          setState({ status: 'error', message: 'Sign in with an authorized administrator account to continue.' });
        }
        return;
      }

      try {
        const nextSession = await bootstrap(await firebaseUser.getIdToken());
        if (!active) return;
        // Display-only session data is cached; Firebase tokens are never persisted here.
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        sessionStorage.removeItem(REDIRECT_KEY);
        setState(nextSession.pendingRoleAssignment
          ? { status: 'pending', session: nextSession }
          : { status: 'authorized', session: nextSession });
      } catch (error) {
        if (!active) return;
        localStorage.removeItem(SESSION_KEY);
        const failure = error instanceof AdminBootstrapError
          ? error
          : new AdminBootstrapError('The administrator session service is unavailable.', 0);

        if ((failure.status === 401 || failure.status === 403) && redirectToAdminLogin()) return;
        setState({ status: 'error', message: failure.message });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying ExamTree administrator access…
      </div>
    );
  }

  if (state.status === 'pending') {
    return (
      <GateMessage
        title="Role assignment pending"
        message={`${state.session.user.email} has been registered as an administrator, but a super administrator must assign an active role before access is granted.`}
      >
        <button className="rounded-md border px-4 py-2 text-sm font-medium" onClick={() => window.location.reload()}>
          Check again
        </button>
      </GateMessage>
    );
  }

  if (state.status === 'error') {
    return (
      <GateMessage title="Administrator access unavailable" message={state.message}>
        <button className="rounded-md border px-4 py-2 text-sm font-medium" onClick={() => window.location.reload()}>
          Retry
        </button>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => {
            sessionStorage.removeItem(REDIRECT_KEY);
            redirectToAdminLogin();
          }}
        >
          Go to admin login
        </button>
      </GateMessage>
    );
  }

  return <AdminPermissionProvider session={state.session}>{children}</AdminPermissionProvider>;
}
