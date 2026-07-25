import { useState } from 'react';
import { ArrowLeft, LifeBuoy, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

export default function AccountRecovery() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (identifier.trim().length < 4 || explanation.trim().length < 20) {
      toast({ title: 'More detail required', description: 'Enter your registered email or registration code and explain the access problem in at least 20 characters.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`${apiBase}/account-recovery/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), contactEmail: contactEmail.trim(), explanation: explanation.trim() }),
      });
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      if (!response.ok) throw new Error(body?.error || 'Unable to submit the recovery request.');
      setAccepted(true);
      toast({ title: 'Recovery request received', description: body?.message || 'Your request has been recorded for support review.' });
    } catch (error) {
      toast({ title: 'Recovery request failed', description: error instanceof Error ? error.message : 'Unable to submit the recovery request.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="relative min-h-screen bg-zinc-50 dark:bg-slate-950">
    <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-10">
      <section className="w-full rounded-lg border bg-white p-7 shadow-sm dark:bg-slate-900">
        <div className="flex items-start gap-3"><div className="rounded-md bg-indigo-600 p-2 text-white"><LifeBuoy className="h-5 w-5" /></div><div><h1 className="text-2xl font-semibold">Recover your ExamTree account</h1><p className="mt-1 text-sm text-muted-foreground">Use this when you cannot access the Firebase or Google identity previously connected to your student history.</p></div></div>
        {accepted ? <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900"><div className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4" />Request recorded</div><p className="mt-2">If the details match an ExamTree student account, support will review the request. This message does not confirm whether an account exists.</p><Button className="mt-4" onClick={() => setLocation('/login/student')}>Return to login</Button></div> : <form className="mt-6 space-y-4" onSubmit={submit}>
          <div className="space-y-2"><Label htmlFor="recovery-identifier">Registered email or registration code</Label><Input id="recovery-identifier" value={identifier} onChange={(event) => setIdentifier(event.target.value)} placeholder="you@example.com or STU-..." required /></div>
          <div className="space-y-2"><Label htmlFor="recovery-contact">Contact email</Label><Input id="recovery-contact" type="email" value={contactEmail} onChange={(event) => setContactEmail(event.target.value)} placeholder="Email where support can reach you" required /></div>
          <div className="space-y-2"><Label htmlFor="recovery-explanation">What happened?</Label><Textarea id="recovery-explanation" value={explanation} onChange={(event) => setExplanation(event.target.value)} placeholder="Explain why you cannot use the identity previously connected to ExamTree." className="min-h-28" required /></div>
          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">Submitting this form does not automatically relink an identity, activate a suspended account, or create a new student profile. Support must verify ownership first.</div>
          <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit recovery request'}</Button>
        </form>}
        <button onClick={() => setLocation('/login/student')} className="mx-auto mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to login</button>
      </section>
    </div>
  </div>;
}
