import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ClipboardList, RefreshCw, Search } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const fmt = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';
const title = (value: string) => value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
const statusTone = (status: string) => status === 'evaluated' || status === 'practice_evaluated' ? 'success' : status === 'in_progress' ? 'warning' : status === 'abandoned' ? 'destructive' : 'neutral';

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Attempt Administration request failed (${response.status}).`);
  if (!body) throw new Error('Attempt Administration returned an empty response.');
  return body;
}

type AttemptRow = {
  id: string; attemptNumber: number; status: string; startedAt: string; submittedAt: string | null; evaluatedAt: string | null;
  timeSpentSeconds: number; rawScore: number | null; finalScore: number | null; correctCount: number | null; incorrectCount: number | null;
  unattemptedCount: number | null; studentId: string; studentName: string; studentEmail: string; registrationCode: string;
  testId: string; testPublicCode: string; testTitle: string; publicationId: string; publicationNumber: number;
};

type AttemptDetail = AttemptRow & {
  updatedAt: string; studentStatus: string; testVersionId: string; durationSeconds: number; publishedAt: string | null; closesAt: string | null;
  resultSnapshot: unknown;
};

type AttemptStats = { total: number; inProgress: number; submitted: number; evaluated: number; abandoned: number };

export function AttemptsWorkspacePage() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [stats, setStats] = useState<AttemptStats>({ total: 0, inProgress: 0, submitted: 0, evaluated: 0, abandoned: 0 });
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
    <PageHeader title="Attempt Administration" description="Search canonical student attempts and inspect immutable publication, timing, scoring and result evidence." icon={<ClipboardList className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Metric label="Total" value={stats.total} /><Metric label="In progress" value={stats.inProgress} /><Metric label="Submitted" value={stats.submitted} /><Metric label="Evaluated" value={stats.evaluated} /><Metric label="Abandoned" value={stats.abandoned} /></div>
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Student, registration code, email, test, or attempt UUID" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="in_progress">In progress</SelectItem><SelectItem value="submitted">Submitted</SelectItem><SelectItem value="evaluated">Evaluated</SelectItem><SelectItem value="practice_evaluated">Practice evaluated</SelectItem><SelectItem value="abandoned">Abandoned</SelectItem></SelectContent></Select></CardContent></Card>
    <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Test</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Score</TableHead><TableHead className="text-right">Time</TableHead><TableHead>Activity</TableHead></TableRow></TableHeader><TableBody>{attempts.length ? attempts.map((attempt) => <TableRow key={attempt.id}><TableCell><Link className="font-medium hover:underline" to={`/users/students/${attempt.studentId}`}>{attempt.studentName}</Link><div className="text-xs text-muted-foreground">{attempt.registrationCode} · Attempt {attempt.attemptNumber}</div></TableCell><TableCell><Link className="font-medium hover:underline" to={`/users/attempts/${attempt.id}`}>{attempt.testTitle}</Link><div className="text-xs text-muted-foreground">{attempt.testPublicCode} · Publication {attempt.publicationNumber}</div></TableCell><TableCell><StatusBadge tone={statusTone(attempt.status)} dot>{title(attempt.status)}</StatusBadge></TableCell><TableCell className="text-right">{attempt.finalScore ?? attempt.rawScore ?? '—'}</TableCell><TableCell className="text-right">{Math.max(0, Number(attempt.timeSpentSeconds || 0))}s</TableCell><TableCell className="text-xs text-muted-foreground">{fmt(attempt.evaluatedAt || attempt.submittedAt || attempt.startedAt)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={6} className="py-12 text-center text-muted-foreground">{loading ? 'Loading attempts…' : 'No attempts match these filters.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
  </div>;
}

export function AttemptDetailPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState<AttemptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!id) return; setLoading(true); void request<{ attempt: AttemptDetail }>(`/admin/attempts/${encodeURIComponent(id)}`).then((result) => setAttempt(result.attempt)).catch((error) => showToast.error('Unable to load attempt', error instanceof Error ? error.message : 'Request failed.')).finally(() => setLoading(false)); }, [id]);
  const snapshot = useMemo(() => attempt?.resultSnapshot == null ? 'No result snapshot recorded.' : JSON.stringify(attempt.resultSnapshot, null, 2), [attempt]);
  if (loading) return <div className="flex justify-center py-20 text-sm text-muted-foreground"><RefreshCw className="mr-2 h-4 w-4 animate-spin" />Loading canonical attempt…</div>;
  if (!attempt) return <Card><CardContent className="py-12 text-center text-muted-foreground">Attempt not found.</CardContent></Card>;
  return <div className="space-y-5"><PageHeader title={attempt.testTitle} description={`${attempt.registrationCode} · Attempt ${attempt.attemptNumber} · ${attempt.id}`} icon={<ClipboardList className="h-5 w-5" />} actions={<Button asChild variant="outline"><Link to="/users/attempts">Back to attempts</Link></Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Status" value={<StatusBadge tone={statusTone(attempt.status)} dot>{title(attempt.status)}</StatusBadge>} /><Metric label="Final score" value={attempt.finalScore ?? attempt.rawScore ?? '—'} /><Metric label="Correct / incorrect" value={`${attempt.correctCount ?? '—'} / ${attempt.incorrectCount ?? '—'}`} /><Metric label="Time spent" value={`${attempt.timeSpentSeconds ?? 0}s`} /></div>
    <Card><CardContent className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3"><Detail label="Student" value={<Link className="hover:underline" to={`/users/students/${attempt.studentId}`}>{attempt.studentName}</Link>} /><Detail label="Student email" value={attempt.studentEmail} /><Detail label="Student status" value={title(attempt.studentStatus)} /><Detail label="Test code" value={attempt.testPublicCode} /><Detail label="Publication" value={`#${attempt.publicationNumber}`} /><Detail label="Duration" value={`${attempt.durationSeconds}s`} /><Detail label="Started" value={fmt(attempt.startedAt)} /><Detail label="Submitted" value={fmt(attempt.submittedAt)} /><Detail label="Evaluated" value={fmt(attempt.evaluatedAt)} /></CardContent></Card>
    <Card><CardContent className="p-4"><p className="mb-3 text-sm font-semibold">Canonical result snapshot</p><pre className="max-h-[560px] overflow-auto rounded-md border bg-muted/30 p-4 text-xs leading-5">{snapshot}</pre></CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-2 text-xl font-semibold">{value}</div></CardContent></Card>; }
function Detail({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 break-words text-sm font-medium">{value}</div></div>; }

export default AttemptsWorkspacePage;
