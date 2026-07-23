import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Archive,
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  PencilLine,
  Plus,
  RefreshCw,
  Rocket,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';

import { AdminErrorAlert } from '@/components/shared/AdminErrorAlert';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  getLiveTests,
  type LiveTestStatus,
  type LiveTestSummary,
  type TestLifecycleAction,
} from '@/features/test-builder/api';
import { bulkTransitionTests } from '@/features/test-builder/bulkApi';
import { toAdminApiError } from '@/lib/admin-api-error';

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

function isStructurallyReady(test: LiveTestSummary) {
  return Boolean(
    test.currentDraftVersionId
    && test.title?.trim()
    && test.sectionCount > 0
    && test.questionCount > 0
    && Number(test.durationSeconds ?? 0) > 0
    && Number(test.totalMarks ?? 0) > 0,
  );
}

export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<LiveTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [exam, setExam] = useState('all');
  const [readiness, setReadiness] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [closesAt, setClosesAt] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLiveTests();
      setTests(response.tests);
      setSelectedIds((current) => new Set(
        [...current].filter((id) => response.tests.some((test) => test.id === id)),
      ));
    } catch (caught) {
      setError(toAdminApiError(caught, 'Unable to load live tests.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const exams = useMemo(
    () => Array.from(new Map(tests.map((test) => [test.examVersionId, test.examName])).entries()),
    [tests],
  );
  const filtered = useMemo(() => tests.filter((test) => {
    if (status !== 'all' && test.status !== status) return false;
    if (exam !== 'all' && test.examVersionId !== exam) return false;
    if (readiness === 'ready' && !isStructurallyReady(test)) return false;
    if (readiness === 'incomplete' && isStructurallyReady(test)) return false;
    const term = search.trim().toLowerCase();
    if (term && !`${test.title ?? ''} ${test.publicCode} ${test.examName}`.toLowerCase().includes(term)) return false;
    return true;
  }), [tests, search, status, exam, readiness]);

  const selected = tests.filter((test) => selectedIds.has(test.id));
  const selectableVisible = filtered.filter((test) => Boolean(test.currentDraftVersionId));
  const allVisibleSelected = selectableVisible.length > 0
    && selectableVisible.every((test) => selectedIds.has(test.id));

  const counts = useMemo(() => {
    const map = new Map<LiveTestStatus, number>();
    tests.forEach((test) => map.set(test.status, (map.get(test.status) ?? 0) + 1));
    return Array.from(map.entries());
  }, [tests]);

  const toggleVisible = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      selectableVisible.forEach((test) => checked ? next.add(test.id) : next.delete(test.id));
      return next;
    });
  };

  const runBulk = async (action: TestLifecycleAction, label: string) => {
    const items = selected
      .filter((test) => Boolean(test.currentDraftVersionId))
      .map((test) => ({ testId: test.id, expectedCurrentDraftVersionId: test.currentDraftVersionId as string }));
    if (items.length === 0) {
      showToast.info('No tests selected', 'Select one or more tests with a current draft version.');
      return;
    }
    if ((action === 'needs-fix' || action === 'archive') && !reason.trim()) {
      showToast.warning('Reason required', `Enter a reason before ${action === 'archive' ? 'archiving' : 'returning'} tests.`);
      return;
    }
    if (action === 'schedule' && !scheduledAt) {
      showToast.warning('Schedule required', 'Choose a publication date and time.');
      return;
    }

    setBulkBusy(true);
    setError(null);
    try {
      const result = await bulkTransitionTests(action, {
        items,
        reason: reason.trim() || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        closesAt: closesAt ? new Date(closesAt).toISOString() : undefined,
      });
      const failedIds = result.results.filter((item) => !item.ok).map((item) => item.testId);
      setSelectedIds(new Set(failedIds));
      await load();
      if (result.failed === 0) {
        setReason('');
        showToast.success(label, `${result.succeeded} test${result.succeeded === 1 ? '' : 's'} updated.`);
      } else {
        const first = result.results.find((item) => !item.ok);
        showToast.warning(
          `${label} partially completed`,
          `${result.succeeded} succeeded, ${result.failed} failed. ${first?.publicCode ?? first?.testId ?? 'Test'}: ${first?.message ?? 'failed'}`,
        );
      }
    } catch (caught) {
      const parsed = toAdminApiError(caught, 'Unable to update selected tests.');
      setError(parsed);
      showToast.error(label, parsed.message);
    } finally {
      setBulkBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tests"
        description="Canonical test drafts, QA states, schedules, and published versions stored in Neon."
        icon={<FileText className="h-5 w-5" />}
        actions={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void load()} disabled={loading || bulkBusy}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button><Button size="sm" onClick={() => navigate('/tests/builder')}><Plus className="mr-1.5 h-4 w-4" /> Build Test</Button></div>}
      />

      {error && <div className="mb-4"><AdminErrorAlert error={error} title="Test operation failed" onRetry={load} /></div>}

      {counts.length > 0 && <div className="mb-4 flex flex-wrap gap-2">{counts.map(([itemStatus, count]) => <Badge key={itemStatus} className={statusClass(itemStatus)}>{formatStatus(itemStatus)} · {count}</Badge>)}</div>}

      {selected.length > 0 && (
        <Card className="mb-4">
          <CardHeader><CardTitle className="text-base">Bulk manage {selected.length} selected test{selected.length === 1 ? '' : 's'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div><Label>Reason</Label><Textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required for needs-fix and archive" className="mt-1 min-h-20" /></div>
              <div><Label>Schedule at</Label><Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} className="mt-1" /></div>
              <div><Label>Close at (optional)</Label><Input type="datetime-local" value={closesAt} onChange={(event) => setClosesAt(event.target.value)} className="mt-1" /></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => void runBulk('submit-qa', 'Submitted to QA')} disabled={bulkBusy}><Send className="mr-1.5 h-4 w-4" /> Submit QA</Button>
              <Button variant="outline" onClick={() => void runBulk('needs-fix', 'Returned for fixes')} disabled={bulkBusy}><AlertTriangle className="mr-1.5 h-4 w-4" /> Needs fix</Button>
              <Button onClick={() => void runBulk('approve', 'QA approved')} disabled={bulkBusy}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve</Button>
              <Button variant="outline" onClick={() => void runBulk('schedule', 'Tests scheduled')} disabled={bulkBusy}><CalendarClock className="mr-1.5 h-4 w-4" /> Schedule</Button>
              <Button onClick={() => void runBulk('publish', 'Tests published')} disabled={bulkBusy}><Rocket className="mr-1.5 h-4 w-4" /> Publish</Button>
              <Button variant="outline" onClick={() => void runBulk('restore-draft', 'Drafts restored')} disabled={bulkBusy}><RotateCcw className="mr-1.5 h-4 w-4" /> Restore draft</Button>
              <Button variant="destructive" onClick={() => void runBulk('archive', 'Tests archived')} disabled={bulkBusy}><Archive className="mr-1.5 h-4 w-4" /> Archive</Button>
              <Button variant="ghost" onClick={() => setSelectedIds(new Set())} disabled={bulkBusy}><X className="mr-1.5 h-4 w-4" /> Clear</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4"><CardContent className="flex flex-col gap-3 p-4 lg:flex-row"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, code, or exam" className="lg:max-w-sm" /><Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{(['draft', 'content_ready', 'under_qa', 'needs_fix', 'qa_approved', 'scheduled', 'live', 'completed', 'archived'] as LiveTestStatus[]).map((value) => <SelectItem key={value} value={value}>{formatStatus(value)}</SelectItem>)}</SelectContent></Select><Select value={exam} onValueChange={setExam}><SelectTrigger className="lg:w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All exams</SelectItem>{exams.map(([id, name]) => <SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent></Select><Select value={readiness} onValueChange={setReadiness}><SelectTrigger className="lg:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All readiness</SelectItem><SelectItem value="ready">Structurally ready</SelectItem><SelectItem value="incomplete">Incomplete drafts</SelectItem></SelectContent></Select></CardContent></Card>

      {loading ? <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading tests…</div> : !error && filtered.length === 0 ? <Card><CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><FileText className="h-8 w-8 text-muted-foreground" /><p className="mt-3 font-medium">No Test Builder records match this view</p><p className="mt-1 text-sm text-muted-foreground">Change the filters or create a canonical test draft.</p><Button className="mt-4" onClick={() => navigate('/tests/builder')}><Plus className="mr-1.5 h-4 w-4" /> Build Test</Button></CardContent></Card> : !error ? <Card><CardContent className="p-0"><div className="hidden overflow-x-auto md:block"><table className="w-full text-sm"><thead className="border-b bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="w-10 p-4"><Checkbox checked={allVisibleSelected} onCheckedChange={(checked) => toggleVisible(checked === true)} aria-label="Select all visible tests" /></th><th className="p-4">Test</th><th className="p-4">Exam</th><th className="p-4">Structure</th><th className="p-4">Status</th><th className="p-4">Schedule</th><th className="p-4">Updated</th><th className="p-4" /></tr></thead><tbody>{filtered.map((test) => <tr key={test.id} className="cursor-pointer border-b last:border-0 hover:bg-muted/20" onClick={() => navigate(`/tests/${test.id}`)}><td className="p-4" onClick={(event) => event.stopPropagation()}><Checkbox checked={selectedIds.has(test.id)} disabled={!test.currentDraftVersionId} onCheckedChange={(checked) => setSelectedIds((current) => { const next = new Set(current); if (checked === true) next.add(test.id); else next.delete(test.id); return next; })} aria-label={`Select ${test.publicCode}`} /></td><td className="p-4"><p className="font-medium">{test.title || 'Untitled test'}</p><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · v{test.versionNumber ?? '—'}</p></td><td className="p-4"><p>{test.examName}</p><p className="text-xs text-muted-foreground">{test.examFamilyName}</p></td><td className="p-4">{test.sectionCount} sections · {test.questionCount} questions<br /><span className="text-xs text-muted-foreground">{Math.round((test.durationSeconds ?? 0) / 60)} min · {test.totalMarks ?? 0} marks</span><div className="mt-1"><Badge variant={isStructurallyReady(test) ? 'secondary' : 'destructive'} className="text-[10px]">{isStructurallyReady(test) ? 'Structurally ready' : 'Incomplete draft'}</Badge></div></td><td className="p-4"><Badge className={statusClass(test.status)}>{formatStatus(test.status)}</Badge></td><td className="p-4 text-muted-foreground">{test.scheduledAt ? <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> {formatDate(test.scheduledAt)}</span> : test.publishedAt ? `Published ${formatDate(test.publishedAt)}` : '—'}</td><td className="p-4 text-muted-foreground">{formatDate(test.updatedAt)}</td><td className="p-4"><Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); navigate(`/tests/builder?edit=${test.id}`); }}><PencilLine className="mr-1.5 h-4 w-4" /> Edit</Button></td></tr>)}</tbody></table></div><div className="divide-y md:hidden">{filtered.map((test) => <div key={test.id} className="flex gap-3 p-4"><Checkbox checked={selectedIds.has(test.id)} disabled={!test.currentDraftVersionId} onCheckedChange={(checked) => setSelectedIds((current) => { const next = new Set(current); if (checked === true) next.add(test.id); else next.delete(test.id); return next; })} aria-label={`Select ${test.publicCode}`} /><button type="button" className="min-w-0 flex-1 text-left" onClick={() => navigate(`/tests/${test.id}`)}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{test.title || 'Untitled test'}</p><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · {test.examName}</p></div><Badge className={statusClass(test.status)}>{formatStatus(test.status)}</Badge></div><p className="mt-3 text-xs text-muted-foreground">{test.sectionCount} sections · {test.questionCount} questions · {Math.round((test.durationSeconds ?? 0) / 60)} min</p><Badge variant={isStructurallyReady(test) ? 'secondary' : 'destructive'} className="mt-2 text-[10px]">{isStructurallyReady(test) ? 'Structurally ready' : 'Incomplete draft'}</Badge></button></div>)}</div></CardContent></Card> : null}
    </div>
  );
}
