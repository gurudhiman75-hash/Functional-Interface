import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Archive, CalendarClock, FileText, Loader2, Plus, RefreshCw, Rocket, RotateCcw, X } from 'lucide-react';

import { AdminErrorAlert } from '@/components/shared/AdminErrorAlert';
import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getLiveTests, type LiveTestSummary, type TestLifecycleAction } from '@/features/test-builder/api';
import { bulkTransitionTests } from '@/features/test-builder/bulkApi';
import {
  ACTIVE_ATTEMPTS_WARNING,
  canPublish,
  canSchedule,
  hasUnpublishedChanges,
  publishAction,
  runPublishAction,
  scheduleAction,
  statusBadgeClass,
  statusGroup,
  statusLabel,
} from '@/features/test-builder/lifecycle';
import { toAdminApiError, type AdminApiError } from '@/lib/admin-api-error';

function ready(test: LiveTestSummary) {
  return Boolean(test.currentDraftVersionId && test.title?.trim() && test.sectionCount > 0 && test.questionCount > 0 && Number(test.durationSeconds ?? 0) > 0 && Number(test.totalMarks ?? 0) > 0);
}

export function TestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<LiveTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AdminApiError | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [readiness, setReadiness] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [reason, setReason] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLiveTests();
      setTests(response.tests);
      setSelectedIds((current) => new Set([...current].filter((id) => response.tests.some((test) => test.id === id))));
    } catch (caught) {
      setError(toAdminApiError(caught, 'Unable to load live tests.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => tests.filter((test) => {
    if (status === 'changes' && !hasUnpublishedChanges(test)) return false;
    if (status !== 'all' && status !== 'changes' && statusGroup(test.status) !== status) return false;
    if (readiness === 'ready' && !ready(test)) return false;
    if (readiness === 'incomplete' && ready(test)) return false;
    const term = search.trim().toLowerCase();
    return !term || `${test.title ?? ''} ${test.publicCode} ${test.examName}`.toLowerCase().includes(term);
  }), [readiness, search, status, tests]);

  const selected = tests.filter((test) => selectedIds.has(test.id));

  const runBulk = async (action: TestLifecycleAction, label: string) => {
    const items = selected.filter((test) => test.currentDraftVersionId).map((test) => ({ testId: test.id, expectedCurrentDraftVersionId: test.currentDraftVersionId as string }));
    if (!items.length) return showToast.info('No tests selected', 'Select one or more tests with a current draft version.');
    if ((action === 'needs-fix' || action === 'archive') && !reason.trim()) return showToast.warning('Reason required', 'Enter a reason first.');
    if (action === 'schedule' && !scheduledAt) return showToast.warning('Schedule required', 'Choose a publication date and time.');

    setBusy(true);
    setError(null);
    try {
      const result = await bulkTransitionTests(action, {
        items,
        reason: reason.trim() || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
      });
      setSelectedIds(new Set(result.results.filter((item) => !item.ok).map((item) => item.testId)));
      await load();
      result.failed ? showToast.warning(`${label} partially completed`, `${result.succeeded} succeeded and ${result.failed} failed.`) : showToast.success(label, `${result.succeeded} test${result.succeeded === 1 ? '' : 's'} updated.`);
    } catch (caught) {
      const parsed = toAdminApiError(caught, 'Unable to update selected tests.');
      setError(parsed);
      showToast.error(label, parsed.message);
    } finally {
      setBusy(false);
    }
  };

  const runPublishSelected = async (mode: 'publish' | 'schedule') => {
    const targets = selected.filter((test) => test.currentDraftVersionId && (mode === 'publish' ? canPublish(test) : canSchedule(test.status)));
    if (!targets.length) return showToast.info('Nothing to ' + mode, mode === 'publish' ? 'Select drafts, or live tests with unpublished changes.' : 'Select draft tests.');
    if (mode === 'schedule' && !scheduledAt) return showToast.warning('Schedule required', 'Choose a publication date and time.');
    if (mode === 'publish' && !window.confirm(`Publish ${targets.length} test${targets.length === 1 ? '' : 's'} now? Students will see them.`)) return;
    setBusy(true);
    setError(null);
    let ok = 0;
    const failed: string[] = [];
    for (const test of targets) {
      try {
        const done = await runPublishAction(test.id, mode === 'publish' ? publishAction(test.status) : scheduleAction(test.status), {
          expectedCurrentDraftVersionId: test.currentDraftVersionId as string,
          scheduledAt: mode === 'schedule' ? new Date(scheduledAt).toISOString() : undefined,
        }, (count) => window.confirm(`${test.title || test.publicCode}\n\n${ACTIVE_ATTEMPTS_WARNING(count)}`));
        if (done) ok += 1; else failed.push(`${test.publicCode}: skipped`);
      } catch (caught) {
        failed.push(`${test.publicCode}: ${caught instanceof Error ? caught.message : 'failed'}`);
      }
    }
    await load();
    setBusy(false);
    failed.length ? showToast.warning(`${ok} done, ${failed.length} not`, failed.slice(0, 3).join(' · ')) : showToast.success(mode === 'publish' ? 'Published' : 'Scheduled', `${ok} test${ok === 1 ? '' : 's'} updated.`);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Tests" description="Draft, scheduled, live and archived tests." icon={<FileText className="h-5 w-5" />} actions={<div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void load()} disabled={loading || busy}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button><Button size="sm" onClick={() => navigate('/tests/builder')}><Plus className="mr-1.5 h-4 w-4" /> Build Test</Button></div>} />

      {error && <AdminErrorAlert error={error} title="Test operation failed" onRetry={load} />}

      {selected.length > 0 && <Card><CardHeader><CardTitle className="text-base">{selected.length} selected</CardTitle></CardHeader><CardContent className="space-y-3"><div className="grid gap-3 md:grid-cols-2"><div><Label>Reason (required to archive or restore)</Label><Textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={2} /></div><div><Label>Schedule for</Label><Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></div></div><div className="flex flex-wrap gap-2"><Button onClick={() => void runPublishSelected('publish')} disabled={busy}><Rocket className="mr-1 h-4 w-4" /> Publish</Button><Button variant="outline" onClick={() => void runPublishSelected('schedule')} disabled={busy}><CalendarClock className="mr-1 h-4 w-4" /> Schedule</Button><Button variant="outline" onClick={() => void runBulk('restore-draft', 'Restored as draft')} disabled={busy}><RotateCcw className="mr-1 h-4 w-4" /> Restore</Button><Button variant="destructive" onClick={() => void runBulk('archive', 'Archived')} disabled={busy}><Archive className="mr-1 h-4 w-4" /> Archive</Button><Button variant="ghost" onClick={() => setSelectedIds(new Set())}><X className="mr-1 h-4 w-4" /> Clear</Button></div></CardContent></Card>}

      <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title, code or exam" /><Select value={status} onValueChange={setStatus}><SelectTrigger className="md:w-60"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="live">Live</SelectItem><SelectItem value="changes">Live · unpublished changes</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent></Select><Select value={readiness} onValueChange={setReadiness}><SelectTrigger className="md:w-52"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All readiness</SelectItem><SelectItem value="ready">Structurally ready</SelectItem><SelectItem value="incomplete">Incomplete drafts</SelectItem></SelectContent></Select></CardContent></Card>

      {loading ? <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading tests…</div> : filtered.length === 0 ? <Card><CardContent className="py-16 text-center text-sm text-muted-foreground">No tests match this view.</CardContent></Card> : <Card><CardContent className="divide-y p-0">{filtered.map((test) => <div key={test.id} className="flex items-center gap-3 p-4"><Checkbox checked={selectedIds.has(test.id)} disabled={!test.currentDraftVersionId} onCheckedChange={(checked) => setSelectedIds((current) => { const next = new Set(current); checked === true ? next.add(test.id) : next.delete(test.id); return next; })} /><button type="button" className="min-w-0 flex-1 text-left" onClick={() => navigate(`/tests/${test.id}`)}><div className="flex flex-wrap items-center gap-2"><span className="font-medium">{test.title || 'Untitled test'}</span><Badge className={statusBadgeClass(statusGroup(test.status), hasUnpublishedChanges(test))}>{statusLabel(test)}</Badge><Badge variant={ready(test) ? 'secondary' : 'destructive'}>{ready(test) ? 'Ready' : 'Incomplete'}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{test.publicCode} · {test.examName} · {test.sectionCount} sections · {test.questionCount} questions</p></button></div>)}</CardContent></Card>}
    </div>
  );
}
