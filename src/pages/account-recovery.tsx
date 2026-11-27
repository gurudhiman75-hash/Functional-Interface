import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  LifeBuoy,
  MailCheck,
  ShieldCheck,
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useLocation, useSearch } from 'wouter';

import '@/styles/login-notebook.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/api';
import {
  PASSWORD_RESET_ACCEPTED_MESSAGE,
  classifyPasswordResetFailure,
  normalizeRecoveryEmail,
  validateManualRecovery,
  validateRecoveryEmail,
} from '@/lib/account-recovery-contract';
import { getFirebaseAuth } from '@/lib/firebase';

type RecoveryMode = 'password' | 'identity';

const apiBase = API_BASE_URL.replace(/\/$/, '');

export default function AccountRecovery() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const initialEmail = useMemo(
    () => new URLSearchParams(search).get('email')?.trim() ?? '',
    [search],
  );

  const recoveryRoot = useRef<HTMLDivElement>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const viewport = window.visualViewport;
    let baseline = Math.max(window.innerHeight, viewport?.height ?? 0);
    let frame = 0;
    const update = () => {
      const height = viewport?.height ?? window.innerHeight;
      const active = document.activeElement;
      const focused = (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) && Boolean(recoveryRoot.current?.contains(active));
      if (!focused) baseline = Math.max(baseline, height);
      const open = focused && baseline - height > 120;
      setKeyboardOpen(open);
      cancelAnimationFrame(frame);
      if (open) frame = requestAnimationFrame(() => active?.scrollIntoView({block: 'center', behavior: 'auto'}));
    };
    viewport?.addEventListener('resize', update);
    window.addEventListener('resize', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener('resize', update);
      window.removeEventListener('resize', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
    };
  }, []);

  const [mode, setMode] = useState<RecoveryMode>('password');
  const [resetEmail, setResetEmail] = useState(initialEmail);
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetAccepted, setResetAccepted] = useState(false);
  const [identifier, setIdentifier] = useState(initialEmail);
  const [contactEmail, setContactEmail] = useState(initialEmail);
  const [explanation, setExplanation] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(false);

  const returnToLogin = () => {
    const email = normalizeRecoveryEmail(resetEmail || identifier);
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    const next = new URLSearchParams(search).get('next');
    if (next?.startsWith('/') && !next.startsWith('//')) params.set('next', next);
    setLocation('/login/student' + (params.size ? '?' + params.toString() : ''));
  };

  const submitPasswordReset = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const validationError = validateRecoveryEmail(resetEmail);
    if (validationError) {
      toast({
        title: 'Check your email',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      toast({
        title: 'Password reset is unavailable',
        description: 'Firebase authentication is not configured in this environment.',
        variant: 'destructive',
      });
      return;
    }

    setResetSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, normalizeRecoveryEmail(resetEmail));
      setResetAccepted(true);
    } catch (error) {
      const failure = classifyPasswordResetFailure(error);
      if (failure === 'accepted') {
        setResetAccepted(true);
      } else if (failure === 'invalid-email') {
        toast({
          title: 'Check your email',
          description: 'Enter a valid email address.',
          variant: 'destructive',
        });
      } else if (failure === 'rate-limited') {
        toast({
          title: 'Too many reset attempts',
          description: 'Please wait before requesting another reset email.',
          variant: 'destructive',
        });
      } else if (failure === 'network') {
        toast({
          title: 'Connection problem',
          description: 'Check your internet connection and try again.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Reset email could not be sent',
          description: 'Please try again. Use identity recovery only when you cannot access the original account.',
          variant: 'destructive',
        });
      }
    } finally {
      setResetSubmitting(false);
    }
  };

  const submitIdentityRecovery = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateManualRecovery({ identifier, contactEmail, explanation });
    const firstError = errors.identifier || errors.contactEmail || errors.explanation;
    if (firstError) {
      toast({
        title: 'Check the recovery details',
        description: firstError,
        variant: 'destructive',
      });
      return;
    }

    setRequestSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/account-recovery/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          contactEmail: normalizeRecoveryEmail(contactEmail),
          explanation: explanation.trim(),
        }),
      });
      const body = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;
      if (!response.ok) {
        throw new Error(body?.error || 'Unable to submit the recovery request.');
      }
      setRequestAccepted(true);
      toast({
        title: 'Recovery request received',
        description:
          body?.message ||
          'If the details match an account, the request has been recorded for support review.',
      });
    } catch (error) {
      toast({
        title: 'Recovery request failed',
        description:
          error instanceof Error
            ? error.message
            : 'Unable to submit the recovery request.',
        variant: 'destructive',
      });
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <div ref={recoveryRoot} className={`notebook-login auth-recovery-page ${keyboardOpen ? 'auth-keyboard-open' : ''}`}>
      <header className="notebook-topbar">
        <a href="/" className="notebook-brand"><span>EXAM<span>TREE</span></span></a>
        <button type="button" onClick={() => setLocation('/')}>Back to home <ArrowRight aria-hidden="true" /></button>
      </header>
      <main className="notebook-stage" id="main-content">
        <div className="notebook-book">
        <section className="notebook-form">
          <div className="auth-intro">
            <div className="recovery-art" aria-hidden="true">{mode === 'password' ? <BookOpen /> : <LifeBuoy />}</div>
            <span className="auth-eyebrow">Let's get you back</span>
            <h1>{mode === 'password' ? 'Forgot password?' : 'Recover your account'}</h1>
            <p>{mode === 'password' ? 'We’ll email you a link to reset your password.' : 'Tell us about your account so support can help.'}</p>
          </div>

          <div
            className="mt-6 grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-1"
            role="tablist"
            aria-label="Recovery method"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'password'}
              onClick={() => setMode('password')}
              className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${mode === 'password' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="recovery-tab-password"
            >
              Reset password
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'identity'}
              onClick={() => setMode('identity')}
              className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${mode === 'identity' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="recovery-tab-identity"
            >
              Contact support
            </button>
          </div>

          {mode === 'password' && (
            <div className="mt-6">
              {resetAccepted ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <MailCheck className="h-4 w-4" />
                    Check your email
                  </div>
                  <p className="mt-2 leading-6">{PASSWORD_RESET_ACCEPTED_MESSAGE}</p>
                  <p className="mt-2 text-xs opacity-80">
                    If the email doesn’t arrive, check your spam or promotions folder.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button onClick={returnToLogin}>Return to login</Button>
                    <Button variant="outline" onClick={() => setResetAccepted(false)}>
                      Edit email
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={resetSubmitting}
                      onClick={() => void submitPasswordReset()}
                    >
                      {resetSubmitting ? 'Sending…' : 'Resend email'}
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={submitPasswordReset}>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Account email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      enterKeyHint="done"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                      placeholder="you@example.com"
                      disabled={resetSubmitting}
                      required
                      data-testid="recovery-reset-email"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetSubmitting}
                    data-testid="recovery-send-reset"
                  >
                    {resetSubmitting ? 'Sending reset email…' : 'Send password reset email'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setMode('identity')}
                    className="w-full text-center text-sm text-primary hover:underline"
                  >
                    I cannot access this email or Google account
                  </button>
                </form>
              )}
            </div>
          )}

          {mode === 'identity' && (
            <div className="mt-6">
              {requestAccepted ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/35 dark:text-emerald-100">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4" />
                    Request recorded
                  </div>
                  <p className="mt-2 leading-6">
                    If the details match an ExamTree student account, support will review the request. This message does not confirm whether an account exists.
                  </p>
                  <Button className="mt-4" onClick={returnToLogin}>
                    Return to login
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={submitIdentityRecovery}>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                    Cannot access your registered email or Google account? Support will review your details and verify ownership before restoring access.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-identifier">Registered email or registration code</Label>
                    <Input
                      id="recovery-identifier"
                      enterKeyHint="next"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("recovery-contact")?.focus(); } }}
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder="you@example.com or STU-..."
                      disabled={requestSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-contact">Contact email</Label>
                    <Input
                      id="recovery-contact"
                      inputMode="email"
                      enterKeyHint="next"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("recovery-explanation")?.focus(); } }}
                      type="email"
                      autoComplete="email"
                      value={contactEmail}
                      onChange={(event) => setContactEmail(event.target.value)}
                      placeholder="Email where support can reach you"
                      disabled={requestSubmitting}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-explanation">What happened?</Label>
                    <Textarea
                      id="recovery-explanation"
                      value={explanation}
                      onChange={(event) => setExplanation(event.target.value)}
                      placeholder="Tell us why you cannot access your account."
                      className="min-h-28"
                      disabled={requestSubmitting}
                      maxLength={1000}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {explanation.trim().length}/1000 characters · minimum 20
                    </p>
                  </div>
                  <div className="rounded-md border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">
                    Support will verify account ownership before making changes. Please do not include passwords or one-time codes.
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={requestSubmitting}
                    data-testid="recovery-submit-identity"
                  >
                    {requestSubmitting ? 'Submitting…' : 'Send recovery request'}
                  </Button>
                </form>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={returnToLogin}
            className="mx-auto mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>
        </section>
        </div>
        <p className="auth-legal">Need help? <a href="/contact">Contact ExamTree</a></p>
      </main>
    </div>
  );
}
