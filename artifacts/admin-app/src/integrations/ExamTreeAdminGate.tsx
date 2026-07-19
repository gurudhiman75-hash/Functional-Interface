import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';
import { AdminPermissionProvider, type AdminSession } from './AdminPermissionContext';

const SESSION_KEY = 'examtree.admin.session';
const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

type GateState =
  | { status: 'loading' }
  | { status: 'sign-in'; message?: string }
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

function AdminSignInPanel({ message }: { message?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase Authentication is not configured for the admin application.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function signInWithPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setError('Firebase Authentication is not configured for the admin application.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GateMessage
      title="Admin sign in"
      message={message || 'Sign in with the Firebase account that is linked to an active ExamTree administrator role.'}
    >
      <div className="w-full space-y-3 text-left">
        <form className="space-y-3" onSubmit={signInWithPassword}>
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <button
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            type="submit"
            disabled={submitting || !email.trim() || !password}
          >
            {submitting ? 'Signing in...' : 'Enter Admin Console'}
          </button>
        </form>
        <button
          className="w-full rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-60"
          type="button"
          disabled={submitting}
          onClick={signInWithGoogle}
        >
          Continue with Google
        </button>
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
      </div>
    </GateMessage>
  );
}

export function ExamTreeAdminGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>({ status: 'loading' });

  useEffect(() => {
    let active = true;
    const auth = getFirebaseAuth();
    if (!auth) {
      setState({ status: 'error', message: 'Firebase Authentication is not configured for the admin application.' });
      return undefined;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!active) return;
      if (!firebaseUser) {
        localStorage.removeItem(SESSION_KEY);
        setState({ status: 'sign-in' });
        return;
      }

      try {
        const nextSession = await bootstrap(await firebaseUser.getIdToken());
        if (!active) return;
        // Display-only session data is cached; Firebase tokens are never persisted here.
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
        setState(nextSession.pendingRoleAssignment
          ? { status: 'pending', session: nextSession }
          : { status: 'authorized', session: nextSession });
      } catch (error) {
        if (!active) return;
        localStorage.removeItem(SESSION_KEY);
        const failure = error instanceof AdminBootstrapError
          ? error
          : new AdminBootstrapError('The administrator session service is unavailable.', 0);

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

  if (state.status === 'sign-in') {
    return <AdminSignInPanel message={state.message} />;
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
            setState({ status: 'sign-in', message: 'Sign in with an authorized administrator account to continue.' });
          }}
        >
          Sign in again
        </button>
      </GateMessage>
    );
  }

  return <AdminPermissionProvider session={state.session}>{children}</AdminPermissionProvider>;
}
