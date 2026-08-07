import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  KeyRound,
  LifeBuoy,
  MailCheck,
  ShieldCheck,
} from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useLocation, useSearch } from 'wouter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getFirebaseAuth } from '@/lib/firebase';
import {
  PASSWORD_RESET_ACCEPTED_MESSAGE,
  classifyPasswordResetFailure,
  normalizeRecoveryEmail,
  validateManualRecovery,
  validateRecoveryEmail,
} from '@/lib/account-recovery-contract';

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

type RecoveryMode = 'password' | 'identity';

export default function AccountRecovery() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const initialEmail = useMemo(
    () => new URLSearchParams(search).get('email')?.trim() ?? '',
    [search],
  );

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
    setLocation(
      email
        ? `/login/student?email=${encodeURIComponent(email)}`
        : '/login/student',
    );
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
    const errors = validateManualRecovery({
      identifier,
      contactEmail,
      explanation,
    });
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
    <div className="relative min-h-screen bg-zinc-50 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.85),rgba(250,250,250,1))] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.16),transparent_30%),linear-gradient(180deg,#020617,#020617)]" />
      <div className="relative mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
        <section className="w-full rounded-xl border bg-white p-6 shadow-sm sm:p-8 dark:bg-slate-900">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-indigo-600 p-2.5 text-white">
              <LifeBuoy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Recover your ExamTree account</h1>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Start with a password reset. Use support recovery only when you cannot access the identity previously connected to your student history.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-1" role="tablist" aria-label="Recovery method">
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
              Old account unavailable
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
                    Check spam or promotions folders. The message intentionally does not confirm whether an account exists.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button onClick={returnToLogin}>Return to login</Button>
                    <Button
                      variant="outline"
                      onClick={() => setResetAccepted(false)}
                    >
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
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 text-muted-foreground">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <KeyRound className="h-4 w-4 text-indigo-600" />
                      Best for forgotten passwords
                    </div>
                    <p className="mt-1">
                      Firebase sends the secure reset link. ExamTree never sees or stores your new password.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Account email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
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
                    Use this only when you cannot open the original Firebase email or Google identity. Support must verify ownership before relinking student history.
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recovery-identifier">Registered email or registration code</Label>
                    <Input
                      id="recovery-identifier"
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
                      placeholder="Explain why you cannot use the identity previously connected to ExamTree."
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
                    This form does not automatically relink an identity, activate a suspended account, or create a new student profile. Support must verify ownership first.
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={requestSubmitting}
                    data-testid="recovery-submit-identity"
                  >
                    {requestSubmitting ? 'Submitting…' : 'Submit verified recovery request'}
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
    </div>
  );
}
