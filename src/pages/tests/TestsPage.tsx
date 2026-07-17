import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarClock,
  FileText,
  Loader2,
  PencilLine,
  Plus,
  RefreshCw,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getLiveTests,
  type LiveTestStatus,
  type LiveTestSummary,
} from '@/features/test-builder/api';

function formatStatus(status: LiveTestStatus) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: LiveTestStatus) {
  if (status === 'live' || status === 'qa_approved') return 'bg-success/10 text-success hover:bg-success/10';
  if (status === 'under_qa' || status === 'scheduled' || status === 'needs_fix') return 'bg-warning/10 text-warning hover:bg-warning/10';
  if (status === 'archived') return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
  return 'bg-muted text-muted-foreground hover:bg-muted';
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<LiveTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [exam, setExam] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getLiveTests();
      setTests(response.tests);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load live tests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const exams = useMemo(() => Array.from(new Map(tests.map((test) => [test.examVersionId, test.examName])).entries()), [tests]);
  const filtered = useMemo(() => tests.filter((test) => {
    if (status !== 'all' && test.status !== status) return false;
    if (exam !== 'all' && test.examVersionId !== exam) return false;
    const term = search.trim().toLowerCase();
    if (term && !`${test.title ?? ''} ${test.publicCode} ${test.examName}`.toLowerCase().includes(term)) return false;
    return true;
  }), [tests, search, status, exam]);

  const counts = useMemo(() => {
    const map = new Map<LiveTestStatus, number>();
    tests.forEach((test) => map.set(test.status, (map.get(test.status) ?? 0) + 1));
    return Array.from(map.entries());
  }, [tests]);

  return (
    <div>
      <PageHeader
        title="Tests"
        description="Canonical test drafts, QA states, schedules, and published versions stored in Neon."
        icon={<FileText className="h-5 w-5" />}
        actions={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button><Button size="sm" onClick={() => navigate('/tests/builder')}><Plus className="mr-1.5 h-4 w-4" /> Build Test</Button></div>}
      />

      {counts.length > 0 && <div className="mb-4 flex flex-wrap gap-2">{counts.map(([itemStatus, count]) => <Badge key={itemStatus} className={statusClass(itemStatus)}>{formatStatus(itemStatus)} · {count}</Badge>)}</div>}

      <Card className="mb-4"><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, code, or exam" className="md:max-w-sm" /><Select value={status} onValueChange={setStatus}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{(['draft', 'content_ready', 'under_qa', 'needs_fix', 'qa_approved', 'scheduled', 'live', 'completed', 'archived'] as LiveTestStatus[]).map((value) => <SelectItem key={value} value={value}>{formatStatus(value)}</SelectItem>)}</SelectContent></Select><Select value={exam} onValueChange={setExam}><SelectTrigger className="md:w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All exams</SelectItem>{exams.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent></Select></CardContent></Card>

      {loading ? <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading tests…</div> : error ? <Card><CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><AlertTriangle className="h-8 w-8 text-destructive" /><p className="mt-3 text-sm">{error}</p><Button className="mt-4" onClick={() => void load()}>Retry</Button></CardContent></Card> : filtered.length === 0 ? <Card><CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><FileText className="h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No live Test Builder records found</p><p className="mt-1 text-sm text-muted-foreground">Create the first canonical test draft.</p><Button className="mt-4" onClick={() => navigate('/tests/builder')}><Plus className="mr-1.5 h-4 w-4" /> Build Test</Button></CardContent></Card> : <Card><CardContent className="p-0"><div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="p-4">Test</th><th className="p-4">Exam</th><th className="p-4">Structure</th><th className="p-4">Status</th><th className="p-4">Schedule</th><th className="p-4">Updated</th><th className="p-4" /></tr></thead><tbody>{filtered.map((test) => <tr key={test.id} className="cursor-pointer border-b last:border-0 hover:bg-muted/20" onClick={() => navigate(`/tests/${test.id}`)}><td className="p-4"><p className="font-medium">{test.title || 'Untitled test'}</p><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · v{test.versionNumber ?? '—'}</p></td><td className="p-4"><p>{test.examName}</p><p className="text-xs text-muted-foreground">{test.examFamilyName}</p></td><td className="p-4">{test.sectionCount} sections · {test.questionCount} questions<br /><span className="text-xs text-muted-foreground">{Math.round((test.durationSeconds ?? 0) / 60)} min · {test.totalMarks ?? 0} marks</span></td><td className="p-4"><Badge className={statusClass(test.status)}>{formatStatus(test.status)}</Badge></td><td className="p-4 text-muted-foreground">{test.scheduledAt ? <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {formatDate(test.scheduledAt)}</span> : test.publishedAt ? `Published ${formatDate(test.publishedAt)}` : '—'}</td><td className="p-4 text-muted-foreground">{formatDate(test.updatedAt)}</td><td className="p-4"><Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); navigate(`/tests/builder?edit=${test.id}`); }}><PencilLine className="mr-1.5 h-4 w-4" /> Edit</Button></td></tr>)}</tbody></table></div><div className="divide-y md:hidden">{filtered.map((test) => <button key={test.id} type="button" className="w-full p-4 text-left" onClick={() => navigate(`/tests/${test.id}`)}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{test.title || 'Untitled test'}</p><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · {test.examName}</p></div><Badge className={statusClass(test.status)}>{formatStatus(test.status)}</Badge></div><p className="mt-3 text-xs text-muted-foreground">{test.sectionCount} sections · {test.questionCount} questions · {Math.round((test.durationSeconds ?? 0) / 60)} min</p></button>)}</div></CardContent></Card>}
    </div>
  );
}
