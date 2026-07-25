import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ClipboardList, RefreshCw, Search } from 'lucide-react';

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

type AttemptStats = { total: number; inProgress: number; evaluated: number; practiceEvaluated: number; abandoned: number; stale: number };

export function AttemptsWorkspacePage() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [stats, setStats] = useState<AttemptStats>({ total: 0, inProgress: 0, evaluated: 0, practiceEvaluated: 0, abandoned: 0, stale: 0 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status, pageSize: '50' });
      if (appliedSearch) params.set('search', appliedSearch);
      const result = await request<{ attempts: AttemptRow[]; stats: AttemptStats }>(`/admin/attempts?${params}`);
      setAttempts(result.attempts);
      setStats(result.stats);
    } catch (error) {
      showToast.error('Unable to load attempts', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [status, appliedSearch]);

  return <div className="space-y-5">
    <PageHeader title="Attempt Administration" description="Search canonical attempts, identify stale sessions and inspect immutable scoring evidence." icon={<ClipboardList className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Total" value={stats.total} /><Metric label="In progress" value={stats.inProgress} /><Metric label="Stale" value={stats.stale} /><Metric label="Evaluated" value={stats.evaluated} /><Metric label="Practice" value={stats.practiceEvaluated} /><Metric label="Abandoned" value={stats.abandoned} /></div>
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Student, registration code, email, test, or attempt UUID" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="stale">Stale in progress</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="evaluated">Evaluated</SelectItem><SelectItem value="practice_evaluated">Practice evaluated</SelectItem><SelectItem value="abandoned">Abandoned</SelectItem></SelectContent></Select></CardContent></Card>
    <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Test</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Score</TableHead><TableHead className="text-right">Time</TableHead><TableHead>Activity</TableHead></TableRow></TableHeader><TableBody>{attempts.length ? attempts.map((attempt) => <TableRow key={attempt.id}><TableCell><Link className="font-medium hover:underline" to={`/users/students/${attempt.studentId}`}>{attempt.studentName}</Link><div className="text-xs text-muted-foreground">{attempt.registrationCode} · Attempt {attempt.attemptNumber}</div></TableCell><TableCell><Link className="font-medium hover:underline" to={`/users/attempts/${attempt.id}`}>{attempt.testTitle}</Link><div className="text-xs text-muted-foreground">{attempt.testPublicCode} · Publication {attempt.publicationNumber}</div></TableCell><TableCell><div className="flex flex-wrap items-center gap-1.5"><StatusBadge tone={statusTone(attempt.status)} dot>{title(attempt.status)}</StatusBadge>{attempt.stale && <StatusBadge tone="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Stale</StatusBadge>}</div></TableCell><TableCell className="text-right">{attempt.finalScore ?? attempt.rawScore ?? '—'}</TableCell><TableCell className="text-right">{Math.max(0, Number(attempt.timeSpentSeconds || 0))}s</TableCell><TableCell className="text-xs text-muted-foreground">{attempt.stale ? `Inactive ${duration(attempt.inactiveSeconds)}` : fmt(attempt.evaluatedAt || attempt.submittedAt || attempt.updatedAt)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="py-12 text-center text-muted-foreground">{loading ? 'Loading attempts…' : 'No attempts match these filters.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
  </div>;
}

export function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [abandoning, setAbandoning] = useState(false);
  const [reason, setReason] = useState('');
  const load = async () => {
    if (!id) return;
    setLoading(true);
    try { const result = await request<{ attempt: AttemptDetail }>(`/admin/attempts/${encodeURIComponent(id)}`); setAttempt(result.attempt); }
    catch (error) { showToast.error('Unable to load attempt', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [id]);
  const snapshot = useMemo(() => attempt?.resultSnapshot == null ? 'No result snapshot recorded.' : JSON.stringify(attempt.resultSnapshot, null, 2), [attempt]);
  const abandon = async () => {
    if (!id || !attempt) return;
    if (reason.trim().length < 20) return showToast.warning('Detailed reason required', 'Enter at least 20 characters explaining why this stale session must be abandoned.');
    setAbandoning(true);
    try {
      await request(`/admin/attempts/${encodeURIComponent(id)}/actions/abandon`, { method: 'POST', body: JSON.stringify({ reason: reason.trim(), expectedUpdatedAt: attempt.updatedAt }) });
      showToast.success('Attempt abandoned', 'The stale session was closed without changing score or result evidence.');
      setReason('');
      await load();
    } catch (error) { showToast.error('Unable to abandon attempt', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setAbandoning(false); }
  };
  if (loading) return <div className="flex justify-center py-20 text-sm text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Loading canonical attempt…</div>;
  if (!attempt) return <Card><CardContent className="py-12 text-center text-muted-foreground">Attempt not found.</CardContent></Card>;
  return <div className="space-y-5"><PageHeader title={attempt.testTitle} description={`${attempt.registrationCode} · Attempt ${attempt.attemptNumber} · ${attempt.id}`} icon={<ClipboardList className="h-5 w-5" />} actions={<Button asChild variant="outline"><Link to="/users/attempts">Back to attempts</Link></Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Status" value={<StatusBadge tone={statusTone(attempt.status)} dot>{title(attempt.status)}</StatusBadge>} /><Metric label="Reliability" value={attempt.stale ? 'Stale session' : attempt.status === 'in_progress' ? 'Within active window' : 'Closed'} /><Metric label="Final score" value={attempt.finalScore ?? attempt.rawScore ?? '—'} /><Metric label="Time spent" value={`${attempt.timeSpentSeconds ?? 0}s`} /></div>
    {attempt.stale && <Card className="border-destructive/30"><CardContent className="space-y-3 p-4"><div className="flex gap-2"><AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" /><div><p className="font-semibold">Stale in-progress attempt</p><p className="text-sm text-muted-foreground">No canonical save has been recorded for {duration(attempt.inactiveSeconds)}. The reliability threshold for this test is {duration(attempt.staleAfterSeconds)}.</p></div></div><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required audit reason. Confirm support context and why this stale attempt should be closed." /><Button variant="destructive" onClick={() => void abandon()} disabled={abandoning || reason.trim().length < 20}>{abandoning ? 'Abandoning…' : 'Abandon stale attempt'}</Button><p className="text-xs text-muted-foreground">This action changes only lifecycle status. Scores, responses and the canonical result snapshot are preserved unchanged.</p></CardContent></Card>}
    <Card><CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3"><Detail label="Student" value={<Link className="hover:underline" to={`/users/students/${attempt.studentId}`}>{attempt.studentName}</Link>} /><Detail label="Student email" value={attempt.studentEmail} /><Detail label="Student status" value={title(attempt.studentStatus)} /><Detail label="Test code" value={attempt.testPublicCode} /><Detail label="Publication" value={`#${attempt.publicationNumber}`} /><Detail label="Duration" value={`${attempt.durationSeconds}s`} /><Detail label="Started" value={fmt(attempt.startedAt)} /><Detail label="Last canonical update" value={fmt(attempt.updatedAt)} /><Detail label="Evaluated" value={fmt(attempt.evaluatedAt)} /></CardContent></Card>
    <Card><CardContent className="p-4"><p className="mb-3 text-sm font-semibold">Canonical result snapshot</p><pre className="max-h-[560px] overflow-auto rounded-md border bg-muted/30 p-4 text-xs leading-5">{snapshot}</pre></CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: ReactNode }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-2 text-xl font-semibold">{value}</div></CardContent></Card>; }
function Detail({ label, value }: { label: string; value: ReactNode }) { return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 break-words text-sm font-medium">{value}</div></div>; }

export default AttemptsWorkspacePage;
