import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Activity, AlertTriangle, ClipboardList, RefreshCw, Search, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const fmt = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';
const title = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const duration = (seconds: number) => seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m` : `${Math.floor(seconds / 60)}m`;
const statusTone = (status: string) => status === 'evaluated' || status === 'practice_evaluated' ? 'success' : status === 'in_progress' ? 'warning' : status === 'abandoned' ? 'destructive' : 'neutral';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  if (init?.body) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${apiBase}${path}`, { ...init, headers });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Attempt Administration request failed (${response.status}).`);
  if (!body) throw new Error('Attempt Administration returned an empty response.');
  return body;
}

type AttemptRow = {
  id: string; attemptNumber: number; status: string; startedAt: string; submittedAt: string | null; evaluatedAt: string | null; updatedAt: string;
  timeSpentSeconds: number; rawScore: number | null; finalScore: number | null; correctCount: number | null; incorrectCount: number | null;
  unattemptedCount: number | null; stale: boolean; inactiveSeconds: number; studentId: string; studentName: string; studentEmail: string;
  registrationCode: string; testId: string; testPublicCode: string; testTitle: string; durationSeconds: number; publicationId: string; publicationNumber: number;
};

type AttemptDetail = AttemptRow & {
  studentStatus: string; testVersionId: string; publishedAt: string | null; closesAt: string | null; staleAfterSeconds: number; resultSnapshot: unknown;
};

type AttemptTimelineEvent = {
  id: string; actionKey: string; summary: string; reason: string | null; occurredAt: string; actorUserId: string | null; actorName: string | null; metadata: unknown;
};

type IntegrityIssue = { code: string; severity: 'warning' | 'critical'; title: string; detail: string };
type IntegrityResult = { state: 'clean' | 'warning' | 'critical'; issues: IntegrityIssue[] };
type AttemptReviewNote = { id: string; content: string; occurredAt: string; actorUserId: string | null; actorName: string | null };
type AttemptStats = { total: number; inProgress: number; evaluated: number; practiceEvaluated: number; abandoned: number; stale: number };

export function AttemptsWorkspacePage() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [stats, setStats] = useState<AttemptStats>({ total: 0, inProgress: 0, evaluated: 0, practiceEvaluated: 0, abandoned: 0, stale: 0 });
  const [integritySummary, setIntegritySummary] = useState({ affected: 0, critical: 0, scanned: 0 });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkReason, setBulkReason] = useState('');
  const [bulkWorking, setBulkWorking] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, pageSize: '50' });
      if (appliedSearch) params.set('search', appliedSearch);
      const [directory, integrity] = await Promise.all([
        request<{ attempts: AttemptRow[]; stats: AttemptStats }>(`/admin/attempts?${params}`),
        request<{ affected: number; critical: number; scanned: number }>('/admin/attempts/integrity'),
      ]);
      setAttempts(directory.attempts);
      setStats(directory.stats);
      setIntegritySummary({ affected: integrity.affected, critical: integrity.critical, scanned: integrity.scanned });
      setSelected((current) => current.filter((id) => directory.attempts.some((attempt) => attempt.id === id && attempt.stale)));
    } catch (error) {
      showToast.error('Unable to load attempts', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [status, appliedSearch]);

  const staleRows = attempts.filter((attempt) => attempt.stale);
  const allVisibleStaleSelected = staleRows.length > 0 && staleRows.every((attempt) => selected.includes(attempt.id));
  const toggleAllStale = () => setSelected(allVisibleStaleSelected ? [] : staleRows.map((attempt) => attempt.id));

  const bulkAbandon = async () => {
    if (!selected.length) return showToast.warning('No attempts selected', 'Select at least one stale in-progress attempt.');
    if (bulkReason.trim().length < 20) return showToast.warning('Detailed reason required', 'Enter at least 20 characters explaining the bulk cleanup.');
    setBulkWorking(true);
    try {
      const result = await request<{ attempted: number; succeeded: number; failed: number }>('/admin/attempts/bulk/actions/abandon', {
        method: 'POST', body: JSON.stringify({ attemptIds: selected, reason: bulkReason.trim() }),
      });
      showToast.success('Bulk abandonment completed', `${result.succeeded} of ${result.attempted} stale attempts were abandoned${result.failed ? `; ${result.failed} require review` : ''}.`);
      setSelected([]); setBulkReason(''); await load();
    } catch (error) { showToast.error('Bulk abandonment failed', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setBulkWorking(false); }
  };

  return <div className="space-y-5">
    <PageHeader title="Attempt Administration" description="Search canonical attempts, identify stale sessions, inspect integrity diagnostics and preserve immutable review evidence." icon={<ClipboardList className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-8"><Metric label="Total" value={stats.total} /><Metric label="In progress" value={stats.inProgress} /><Metric label="Stale" value={stats.stale} /><Metric label="Evaluated" value={stats.evaluated} /><Metric label="Practice" value={stats.practiceEvaluated} /><Metric label="Abandoned" value={stats.abandoned} /><Metric label="Integrity affected" value={integritySummary.affected} /><Metric label="Critical integrity" value={integritySummary.critical} /></div>
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Student, registration code, email, test, or attempt UUID" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="stale">Stale in progress</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="evaluated">Evaluated</SelectItem><SelectItem value="practice_evaluated">Practice evaluated</SelectItem><SelectItem value="abandoned">Abandoned</SelectItem></SelectContent></Select></CardContent></Card>
    {integritySummary.affected > 0 && <Card className="border-warning/30"><CardContent className="flex items-start gap-2 p-4"><ShieldCheck className="mt-0.5 h-4 w-4" /><div><p className="font-semibold">Attempt integrity review required</p><p className="text-sm text-muted-foreground">{integritySummary.affected} of the latest {integritySummary.scanned} scanned attempts have diagnostics; {integritySummary.critical} are critical. Open an attempt to inspect exact evidence and add an immutable review note.</p></div></CardContent></Card>}
    {staleRows.length > 0 && <Card className="border-destructive/30"><CardContent className="space-y-3 p-4"><div className="flex items-start gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" /><div><p className="font-semibold">Guarded stale-attempt cleanup</p><p className="text-sm text-muted-foreground">Only selected rows currently beyond their reliability window are eligible. Each attempt is re-locked and revalidated individually before abandonment.</p></div></div><Textarea value={bulkReason} onChange={(event) => setBulkReason(event.target.value)} placeholder="Required shared audit reason for selected stale attempts (minimum 20 characters)." /><div className="flex flex-wrap items-center gap-2"><Button variant="outline" onClick={toggleAllStale}>{allVisibleStaleSelected ? 'Clear stale selection' : `Select ${staleRows.length} visible stale`}</Button><Button variant="destructive" onClick={() => void bulkAbandon()} disabled={bulkWorking || selected.length === 0 || bulkReason.trim().length < 20}>{bulkWorking ? 'Processing…' : `Abandon selected (${selected.length})`}</Button></div></CardContent></Card>}
    <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="w-10">Select</TableHead><TableHead>Student</TableHead><TableHead>Test</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Score</TableHead><TableHead className="text-right">Time</TableHead><TableHead>Activity</TableHead></TableRow></TableHeader><TableBody>{attempts.length ? attempts.map((attempt) => <TableRow key={attempt.id}><TableCell><input type="checkbox" aria-label={`Select attempt ${attempt.id}`} checked={selected.includes(attempt.id)} disabled={!attempt.stale} onChange={(event) => setSelected((current) => event.target.checked ? [...new Set([...current, attempt.id])] : current.filter((id) => id !== attempt.id))} /></TableCell><TableCell><Link className="font-medium hover:underline" to={`/users/students/${attempt.studentId}`}>{attempt.studentName}</Link><div className="text-xs text-muted-foreground">{attempt.registrationCode} · Attempt {attempt.attemptNumber}</div></TableCell><TableCell><Link className="font-medium hover:underline" to={`/users/attempts/${attempt.id}`}>{attempt.testTitle}</Link><div className="text-xs text-muted-foreground">{attempt.testPublicCode} · Publication {attempt.publicationNumber}</div></TableCell><TableCell><div className="flex flex-wrap items-center gap-1.5"><StatusBadge tone={statusTone(attempt.status)} dot>{title(attempt.status)}</StatusBadge>{attempt.stale && <StatusBadge tone="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Stale</StatusBadge>}</div></TableCell><TableCell className="text-right">{attempt.finalScore ?? attempt.rawScore ?? '—'}</TableCell><TableCell className="text-right">{Math.max(0, Number(attempt.timeSpentSeconds || 0))}s</TableCell><TableCell className="text-xs text-muted-foreground">{attempt.stale ? `Inactive ${duration(attempt.inactiveSeconds)}` : fmt(attempt.evaluatedAt || attempt.submittedAt || attempt.updatedAt)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading attempts…' : 'No attempts match these filters.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
  </div>;
}

export function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [timeline, setTimeline] = useState<AttemptTimelineEvent[]>([]);
  const [integrity, setIntegrity] = useState<IntegrityResult>({ state: 'clean', issues: [] });
  const [notes, setNotes] = useState<AttemptReviewNote[]>([]);
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [loading, setLoading] = useState(true);
  const [abandoning, setAbandoning] = useState(false);
  const [reason, setReason] = useState('');
  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [detail, integrityResult] = await Promise.all([
        request<{ attempt: AttemptDetail; timeline: AttemptTimelineEvent[] }>(`/admin/attempts/${encodeURIComponent(id)}`),
        request<{ integrity: IntegrityResult; notes: AttemptReviewNote[] }>(`/admin/attempts/${encodeURIComponent(id)}/integrity`),
      ]);
      setAttempt(detail.attempt); setTimeline(detail.timeline); setIntegrity(integrityResult.integrity); setNotes(integrityResult.notes);
    } catch (error) { showToast.error('Unable to load attempt', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [id]);
  const snapshot = useMemo(() => attempt?.resultSnapshot == null ? 'No result snapshot recorded.' : JSON.stringify(attempt.resultSnapshot, null, 2), [attempt]);
  const abandon = async () => {
    if (!id || !attempt) return;
    if (reason.trim().length < 20) return showToast.warning('Detailed reason required', 'Enter at least 20 characters explaining why this stale session must be abandoned.');
    setAbandoning(true);
    try { await request(`/admin/attempts/${encodeURIComponent(id)}/actions/abandon`, { method: 'POST', body: JSON.stringify({ reason: reason.trim(), expectedUpdatedAt: attempt.updatedAt }) }); showToast.success('Attempt abandoned', 'The stale session was closed without changing score or result evidence.'); setReason(''); await load(); }
    catch (error) { showToast.error('Unable to abandon attempt', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setAbandoning(false); }
  };
  const addReviewNote = async () => {
    if (!id || note.trim().length < 12) return showToast.warning('Review note required', 'Enter at least 12 characters.');
    setSavingNote(true);
    try { await request(`/admin/attempts/${encodeURIComponent(id)}/notes`, { method: 'POST', body: JSON.stringify({ content: note.trim() }) }); setNote(''); showToast.success('Review note added', 'The note was stored as immutable attempt audit evidence.'); await load(); }
    catch (error) { showToast.error('Unable to add review note', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setSavingNote(false); }
  };
  if (loading) return <div className="flex justify-center py-20 text-sm text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Loading canonical attempt…</div>;
  if (!attempt) return <Card><CardContent className="py-12 text-center text-muted-foreground">Attempt not found.</CardContent></Card>;
  return <div className="space-y-5"><PageHeader title={attempt.testTitle} description={`${attempt.registrationCode} · Attempt ${attempt.attemptNumber} · ${attempt.id}`} icon={<ClipboardList className="h-5 w-5" />} actions={<Button asChild variant="outline"><Link to="/users/attempts">Back to attempts</Link></Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Metric label="Status" value={<StatusBadge tone={statusTone(attempt.status)} dot>{title(attempt.status)}</StatusBadge>} /><Metric label="Reliability" value={attempt.stale ? 'Stale session' : attempt.status === 'in_progress' ? 'Within active window' : 'Closed'} /><Metric label="Integrity" value={title(integrity.state)} /><Metric label="Final score" value={attempt.finalScore ?? attempt.rawScore ?? '—'} /><Metric label="Time spent" value={`${attempt.timeSpentSeconds ?? 0}s`} /></div>
    {integrity.issues.length > 0 ? <Card className={integrity.state === 'critical' ? 'border-destructive/40' : 'border-warning/40'}><CardContent className="space-y-3 p-4"><div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /><p className="font-semibold">Attempt integrity diagnostics</p></div>{integrity.issues.map((issue) => <div key={issue.code} className="rounded-md border p-3"><div className="flex items-center gap-2"><StatusBadge tone={issue.severity === 'critical' ? 'destructive' : 'warning'}>{title(issue.severity)}</StatusBadge><p className="text-sm font-medium">{issue.title}</p></div><p className="mt-2 text-sm text-muted-foreground">{issue.detail}</p><p className="mt-1 text-xs text-muted-foreground">{issue.code}</p></div>)}</CardContent></Card> : <Card className="border-success/30"><CardContent className="flex items-center gap-2 p-4"><ShieldCheck className="h-4 w-4" /><p className="text-sm">No structural attempt-integrity anomaly was detected.</p></CardContent></Card>}
    {attempt.stale && <Card className="border-destructive/30"><CardContent className="space-y-3 p-4"><div className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" /><div><p className="font-semibold">Stale in-progress attempt</p><p className="text-sm text-muted-foreground">No canonical save has been recorded for {duration(attempt.inactiveSeconds)}. The reliability threshold for this test is {duration(attempt.staleAfterSeconds)}.</p></div></div><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required audit reason. Confirm support context and why this stale attempt should be closed." /><Button variant="destructive" onClick={() => void abandon()} disabled={abandoning || reason.trim().length < 20}>{abandoning ? 'Abandoning…' : 'Abandon stale attempt'}</Button><p className="text-xs text-muted-foreground">This action changes only lifecycle status. Scores, responses and the canonical result snapshot are preserved unchanged.</p></CardContent></Card>}
    <Card><CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3"><Detail label="Student" value={<Link className="hover:underline" to={`/users/students/${attempt.studentId}`}>{attempt.studentName}</Link>} /><Detail label="Student email" value={attempt.studentEmail} /><Detail label="Student status" value={title(attempt.studentStatus)} /><Detail label="Test code" value={attempt.testPublicCode} /><Detail label="Publication" value={`#${attempt.publicationNumber}`} /><Detail label="Duration" value={`${attempt.durationSeconds}s`} /><Detail label="Started" value={fmt(attempt.startedAt)} /><Detail label="Last canonical update" value={fmt(attempt.updatedAt)} /><Detail label="Evaluated" value={fmt(attempt.evaluatedAt)} /></CardContent></Card>
    <Card><CardContent className="space-y-3 p-4"><p className="font-semibold">Immutable review notes</p><Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Record investigation context, verification steps or follow-up. Minimum 12 characters." /><Button onClick={() => void addReviewNote()} disabled={savingNote || note.trim().length < 12}>{savingNote ? 'Saving…' : 'Add review note'}</Button>{notes.map((entry) => <div key={entry.id} className="rounded-md border p-3"><p className="text-sm">{entry.content}</p><p className="mt-2 text-xs text-muted-foreground">{entry.actorName || 'Administrator'} · {fmt(entry.occurredAt)}</p></div>)}{!notes.length && <p className="text-sm text-muted-foreground">No review notes have been recorded.</p>}</CardContent></Card>
    <Card><CardContent className="p-4"><p className="mb-3 text-sm font-semibold">Canonical result snapshot</p><pre className="max-h-[560px] overflow-auto rounded-md border bg-muted/30 p-4 text-xs leading-5">{snapshot}</pre></CardContent></Card>
    <Card><CardContent className="space-y-4 p-4"><p className="font-semibold">Attempt audit timeline</p>{timeline.length ? timeline.map((event) => <div key={event.id} className="flex gap-3 border-b pb-4 last:border-0 last:pb-0"><Activity className="mt-0.5 h-4 w-4 text-muted-foreground" /><div><p className="text-sm font-medium">{event.summary || title(event.actionKey)}</p><p className="text-xs text-muted-foreground">{title(event.actionKey)} · {fmt(event.occurredAt)} · {event.actorName || 'System'}</p>{event.reason && <p className="mt-1 text-sm text-muted-foreground">{event.reason}</p>}</div></div>) : <p className="text-sm text-muted-foreground">No administrative attempt events have been recorded.</p>}</CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: ReactNode }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-2 text-xl font-semibold">{value}</div></CardContent></Card>; }
function Detail({ label, value }: { label: string; value: ReactNode }) { return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 break-words text-sm font-medium">{value}</div></div>; }

export default AttemptsWorkspacePage;
