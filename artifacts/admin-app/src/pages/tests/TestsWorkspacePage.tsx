import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Archive, ArrowLeft, CheckSquare, ListChecks, Loader2, Plus, RefreshCw, Rocket, Search } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Checkbox } from '@/components/ui/checkbox';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLiveTests, getTestCatalog, transitionLiveTest, type LiveTestSummary, type TestCatalogExamVersion } from '@/features/test-builder/api';
import { bulkTransitionTests } from '@/features/test-builder/bulkApi';
import { canPublish, hasUnpublishedChanges, publishAction, statusBadgeClass, statusGroup, statusLabel, type TestStatusGroup } from '@/features/test-builder/lifecycle';
import { TestEditor } from '@/features/test-builder/TestEditor';

type Filter = 'all' | TestStatusGroup | 'changes';
const FILTERS: Array<[Filter, string]> = [['all', 'All'], ['draft', 'Draft'], ['scheduled', 'Scheduled'], ['live', 'Live'], ['changes', 'Has changes'], ['archived', 'Archived']];

/** Old builder links (/tests/builder?edit=ID) land in the workspace. */
export function LegacyTestBuilderRedirect() {
  const [params] = useSearchParams();
  const edit = params.get('edit');
  return <Navigate to={edit ? `/tests/${encodeURIComponent(edit)}` : '/tests/new'} replace />;
}

export function TestsWorkspacePage() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // /tests/new is its own route (no :id param), so detect it from the path.
  const isNew = pathname.replace(/\/+$/, '') === '/tests/new' || id === 'new';
  const editing = isNew || id !== undefined;
  const testId = !isNew && id ? id : null;

  const [tests, setTests] = useState<LiveTestSummary[]>([]);
  const [catalog, setCatalog] = useState<TestCatalogExamVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [exam, setExam] = useState('all');
  const [search, setSearch] = useState('');
  const [selecting, setSelecting] = useState(false);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const loadTests = useCallback(async () => {
    try {
      const response = await getLiveTests();
      setTests(response.tests);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load tests.');
    }
  }, []);
  const loadCatalog = useCallback(async () => {
    const response = await getTestCatalog();
    setCatalog(response.examVersions);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadTests(), loadCatalog().catch(() => undefined)]).finally(() => setLoading(false));
  }, [loadTests, loadCatalog]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: tests.length, draft: 0, scheduled: 0, live: 0, archived: 0, changes: 0 };
    tests.forEach((t) => { c[statusGroup(t.status)] += 1; if (hasUnpublishedChanges(t)) c.changes += 1; });
    return c;
  }, [tests]);

  const exams = useMemo(() => [...new Set(tests.map((t) => t.examName))].sort(), [tests]);
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tests
      .filter((t) => (filter === 'all' ? true : filter === 'changes' ? hasUnpublishedChanges(t) : statusGroup(t.status) === filter))
      .filter((t) => exam === 'all' || t.examName === exam)
      .filter((t) => !term || `${t.title ?? ''} ${t.publicCode} ${t.examName}`.toLowerCase().includes(term))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [tests, filter, exam, search]);

  const pickedTests = tests.filter((t) => picked.has(t.id) && t.currentDraftVersionId);
  const togglePick = (testId: string) => setPicked((current) => {
    const next = new Set(current);
    if (next.has(testId)) next.delete(testId); else next.add(testId);
    return next;
  });

  const bulkPublish = async () => {
    const eligible = pickedTests.filter((t) => canPublish(t) && t.questionCount > 0);
    if (!eligible.length) { showToast.info('Nothing to publish', 'Pick drafts with questions, or live tests with changes.'); return; }
    if (!window.confirm(`Publish ${eligible.length} test(s)? Each one is checked by the server first; any that fail are skipped.`)) return;
    setBulkBusy(true);
    let ok = 0;
    const failed: string[] = [];
    for (const t of eligible) {
      try {
        await transitionLiveTest(t.id, publishAction(t.status), { expectedCurrentDraftVersionId: t.currentDraftVersionId!, acknowledgeActiveAttempts: true });
        ok += 1;
      } catch (error) {
        failed.push(`${t.title || t.publicCode}: ${error instanceof Error ? error.message : 'failed'}`);
      }
    }
    setBulkBusy(false);
    setPicked(new Set());
    await loadTests();
    if (failed.length) showToast.warning(`${ok} published, ${failed.length} skipped`, failed.slice(0, 3).join(' · '));
    else showToast.success('Published', `${ok} test(s) are live.`);
  };

  const bulkArchive = async () => {
    const eligible = pickedTests.filter((t) => statusGroup(t.status) !== 'archived');
    if (!eligible.length) return;
    const reason = window.prompt(`Archive ${eligible.length} test(s)? Students will no longer see them. Reason:`);
    if (!reason || reason.trim().length < 3) return;
    setBulkBusy(true);
    try {
      const result = await bulkTransitionTests('archive', {
        items: eligible.map((t) => ({ testId: t.id, expectedCurrentDraftVersionId: t.currentDraftVersionId! })),
        reason: reason.trim(),
      });
      showToast.success('Archived', `${result.succeeded} archived${result.failed ? `, ${result.failed} failed` : ''}.`);
    } catch (error) {
      showToast.error('Archive failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBulkBusy(false);
      setPicked(new Set());
      await loadTests();
    }
  };

  const list = (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-8" placeholder="Search tests" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant={selecting ? 'secondary' : 'ghost'} size="icon" aria-label="Select tests" onClick={() => { setSelecting((v) => !v); setPicked(new Set()); }}><CheckSquare className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" aria-label="Refresh" onClick={() => void loadTests()}><RefreshCw className="h-4 w-4" /></Button>
      </div>
      {selecting && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-2 text-sm">
          <span className="mr-auto">{picked.size} selected</span>
          <Button size="sm" variant="outline" disabled={bulkBusy || picked.size === 0} onClick={() => void bulkPublish()}>{bulkBusy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Rocket className="mr-1 h-4 w-4" />} Publish</Button>
          <Button size="sm" variant="outline" disabled={bulkBusy || picked.size === 0} onClick={() => void bulkArchive()}><Archive className="mr-1 h-4 w-4" /> Archive</Button>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map(([value, label]) => (
          <button key={value} type="button" onClick={() => setFilter(value)}
            className={`rounded-full border px-2.5 py-0.5 text-xs ${filter === value ? 'border-primary bg-primary/10 font-medium text-primary' : 'text-muted-foreground'}`}>
            {label} {counts[value]}
          </button>
        ))}
      </div>
      {exams.length > 1 && (
        <Select value={exam} onValueChange={setExam}>
          <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="all">All exams</SelectItem>{exams.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
        </Select>
      )}
      {error && <p className="rounded border border-destructive/30 bg-destructive/5 p-2 text-sm">{error}</p>}
      <div className="min-h-0 flex-1 divide-y overflow-y-auto rounded-lg border">
        {loading && <p className="flex items-center justify-center p-6 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</p>}
        {!loading && visible.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No tests here yet.</p>}
        {visible.map((t) => {
          const changes = hasUnpublishedChanges(t);
          return (
            <button key={t.id} type="button" onClick={() => (selecting ? togglePick(t.id) : navigate(`/tests/${t.id}`))}
              className={`block w-full p-3 text-left hover:bg-muted/40 ${t.id === testId ? 'bg-primary/5' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                {selecting && <Checkbox className="mt-0.5" checked={picked.has(t.id)} onCheckedChange={() => togglePick(t.id)} onClick={(e) => e.stopPropagation()} />}
                <p className="line-clamp-2 flex-1 text-sm font-medium">{t.title || 'Untitled test'}</p>
                <Badge className={`shrink-0 ${statusBadgeClass(statusGroup(t.status), changes)}`}>{changes ? 'Changes' : statusLabel(t)}</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{t.examName} · {t.questionCount} Q · {t.publicCode}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {editing && <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => navigate('/tests')}><ArrowLeft className="mr-1 h-4 w-4" /> Tests</Button>}
          <ListChecks className="hidden h-5 w-5 text-primary lg:block" />
          <h1 className="text-xl font-semibold">Tests</h1>
        </div>
        <Button size="sm" onClick={() => navigate('/tests/new')}><Plus className="mr-1.5 h-4 w-4" /> New test</Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className={`${editing ? 'hidden lg:block' : ''} lg:sticky lg:top-4 lg:h-[calc(100vh-8rem)]`}>{list}</aside>
        <main className={editing ? '' : 'hidden lg:block'}>
          {editing
            ? <TestEditor
                testId={testId}
                catalog={catalog}
                onCatalogChanged={loadCatalog}
                onSaved={(newId) => navigate(`/tests/${newId}`, { replace: true })}
                onChanged={() => void loadTests()}
              />
            : <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                <p>Pick a test on the left to edit, publish or archive it.</p>
                <Button className="mt-4" size="sm" onClick={() => navigate('/tests/new')}><Plus className="mr-1.5 h-4 w-4" /> New test</Button>
              </div>}
        </main>
      </div>
    </div>
  );
}
