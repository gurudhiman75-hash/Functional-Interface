import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

type ReviewState = 'pending' | 'under_review' | 'resolved' | 'rejected';
type RecoveryRequest = {
  id: string;
  occurredAt: string;
  explanation: string;
  reviewState: ReviewState;
  reviewedAt: string | null;
  reviewNote: string | null;
  assignedToUserId: string | null;
  operationAuditEventId: string | null;
  resolvedAt: string | null;
  studentId: string;
  displayName: string;
  email: string;
  registrationCode: string;
  status: string;
  deletedAt: string | null;
};

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  if (init?.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${apiBase}${path}`, { ...init, headers });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Recovery request failed (${response.status}).`);
  if (!body) throw new Error('Recovery API returned an empty response.');
  return body;
}

export function RecoveryRequestsPage() {
  const [state, setState] = useState<ReviewState>('pending');
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const result = await request<{ requests: RecoveryRequest[] }>(`/admin/students/recovery-requests?state=${state}`);
      setRequests(result.requests);
    } catch (error) {
      showToast.error('Unable to load recovery requests', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [state]);

  const review = async (requestId: string, reviewState: 'under_review' | 'rejected') => {
    const note = (notes[requestId] || '').trim();
    if (note.length < 12) return showToast.warning('Review note required', 'Enter at least 12 characters explaining the decision.');
    setWorkingId(requestId);
    try {
      await request(`/admin/students/recovery-requests/${requestId}`, { method: 'PATCH', body: JSON.stringify({ reviewState, reviewNote: note }) });
      showToast.success('Recovery request updated', reviewState === 'under_review' ? 'The request is assigned and ready for verified relinking.' : 'The request was rejected with an audit note.');
      await load();
    } catch (error) {
      showToast.error('Unable to update request', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingId(null);
    }
  };

  return <div className="space-y-5">
    <PageHeader title="Account Recovery" description="Review requests, assign them, and resolve them only through verified Firebase identity relinking." icon={<ShieldCheck className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <div className="max-w-xs"><Select value={state} onValueChange={(value) => setState(value as ReviewState)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="under_review">Under review</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent></Select></div>
    <div className="grid gap-4">{requests.map((entry) => <Card key={entry.id}><CardContent className="space-y-4 p-4"><div className="flex flex-col justify-between gap-2 sm:flex-row"><div><Link className="font-semibold hover:underline" to={`/users/students/${entry.studentId}`}>{entry.displayName}</Link><p className="text-xs text-muted-foreground">{entry.registrationCode} · {entry.email} · {entry.status}</p></div><p className="text-xs text-muted-foreground">{new Date(entry.occurredAt).toLocaleString()}</p></div><div className="rounded-md border bg-muted/20 p-3 text-sm">{entry.explanation}</div>{entry.reviewNote && <p className="text-sm text-muted-foreground">Latest review note: {entry.reviewNote}</p>}{entry.operationAuditEventId && <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-700">Resolved through verified relink audit {entry.operationAuditEventId}.</div>}{state !== 'resolved' && state !== 'rejected' && <Textarea value={notes[entry.id] || ''} onChange={(event) => setNotes((current) => ({ ...current, [entry.id]: event.target.value }))} placeholder="Required review note (minimum 12 characters)" />}<div className="flex flex-wrap gap-2">{state === 'pending' && <Button variant="outline" disabled={workingId === entry.id} onClick={() => void review(entry.id, 'under_review')}>Mark under review</Button>}{state === 'under_review' && <Button asChild><Link to={`/users/students/${entry.studentId}?recoveryRequestId=${entry.id}`}><KeyRound className="mr-1.5 h-4 w-4" />Open verified recovery</Link></Button>}{state !== 'resolved' && state !== 'rejected' && <Button variant="destructive" disabled={workingId === entry.id} onClick={() => void review(entry.id, 'rejected')}>Reject</Button>}</div></CardContent></Card>)}{!loading && requests.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">No recovery requests in this state.</CardContent></Card>}</div>
  </div>;
}

export default RecoveryRequestsPage;
