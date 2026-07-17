import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  Archive,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Loader2,
  PencilLine,
  RefreshCw,
  Rocket,
  Send,
  Undo2,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  getLiveTest,
  transitionLiveTest,
  type LiveTestDetail,
  type LiveTestStatus,
  type TestLifecycleAction,
  type TestValidationIssue,
} from '@/features/test-builder/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

function formatStatus(status: LiveTestStatus) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: LiveTestStatus) {
  if (status === 'live' || status === 'qa_approved') return 'bg-success/10 text-success hover:bg-success/10';
  if (status === 'under_qa' || status === 'scheduled' || status === 'needs_fix') return 'bg-warning/10 text-warning hover:bg-warning/10';
  if (status === 'archived') return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
  return 'bg-muted text-muted-foreground hover:bg-muted';
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(date);
}

function errorIssues(error: unknown): TestValidationIssue[] {
  if (!error || typeof error !== 'object') return [];
  const details = (error as { details?: unknown }).details;
  return Array.isArray(details)
    ? details.filter((item): item is TestValidationIssue => !!item && typeof item === 'object' && typeof (item as TestValidationIssue).message === 'string')
    : [];
}

export function TestDetailPage() {
  const { id = '' } = useParams();
  const { hasPermission } = useAdminPermissions();
  const canUpdate = hasPermission('tests.update');
  const canApprove = hasPermission('tests.approve');
  const canPublish = hasPermission('tests.publish');

  const [detail, setDetail] = useState<LiveTestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [closesAt, setClosesAt] = useState('');
  const [actionIssues, setActionIssues] = useState<TestValidationIssue[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await getLiveTest(id);
      setDetail(next);
      setActionIssues([]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load test.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void load(); }, [load]);

  const runAction = async (action: TestLifecycleAction, success: string) => {
    if (!detail?.test.currentDraftVersionId) return;
    setSaving(true);
    setActionIssues([]);
    try {
      const next = await transitionLiveTest(detail.test.id, action, {
        expectedCurrentDraftVersionId: detail.test.currentDraftVersionId,
        reason: actionReason.trim() || undefined,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
        closesAt: closesAt ? new Date(closesAt).toISOString() : undefined,
      });
      setDetail(next);
      setActionReason('');
      setScheduledAt('');
      setClosesAt('');
      showToast.success(success, `${next.test.publicCode} is now ${formatStatus(next.test.status)}.`);
    } catch (caught) {
      setActionIssues(errorIssues(caught));
      showToast.error('Test action failed', caught instanceof Error ? caught.message : 'Unable to update test.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading live test…</div>;
  if (error || !detail || !detail.currentVersion) return <Card><CardContent className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><AlertTriangle className="h-8 w-8 text-destructive" /><p className="mt-3 font-medium">{error || 'Test unavailable'}</p><div className="mt-4 flex gap-2"><Button asChild variant="outline"><Link to="/tests"><ArrowLeft className="mr-1.5 h-4 w-4" /> Tests</Link></Button><Button onClick={() => void load()}><RefreshCw className="mr-1.5 h-4 w-4" /> Retry</Button></div></CardContent></Card>;

  const test = detail.test;
  const version = detail.currentVersion;
  const questionCount = detail.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const latestPublication = detail.publications[0];
  const blockingIssues = [...detail.validationIssues, ...actionIssues];

  return (
    <div>
      <PageHeader
        title={version.title}
        description={`${test.publicCode} • ${test.examFamilyName} • ${test.examName}`}
        icon={<FileText className="h-5 w-5" />}
        actions={<div className="flex flex-wrap gap-2"><Button asChild variant="outline" size="sm"><Link to="/tests"><ArrowLeft className="mr-1.5 h-4 w-4" /> Tests</Link></Button><Button asChild variant="outline" size="sm"><Link to={`/tests/builder?edit=${test.id}`}><PencilLine className="mr-1.5 h-4 w-4" /> Edit in Builder</Link></Button><Button variant="outline" size="sm" onClick={() => void load()} disabled={saving}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button></div>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-2"><Badge className={statusClass(test.status)}>{formatStatus(test.status)}</Badge><Badge variant="outline">Draft v{version.versionNumber}</Badge>{test.publishedVersionId && <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Published version retained</Badge>}<Badge variant="outline">{questionCount} questions</Badge><Badge variant="outline">{version.totalMarks} marks</Badge><Badge variant="outline">{Math.round(version.durationSeconds / 60)} minutes</Badge></div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="flex h-auto flex-wrap justify-start"><TabsTrigger value="preview">Exact preview</TabsTrigger><TabsTrigger value="versions">Versions</TabsTrigger><TabsTrigger value="publications">Publications</TabsTrigger><TabsTrigger value="audit">Audit</TabsTrigger></TabsList>

            <TabsContent value="preview" className="space-y-5">
              <Card><CardHeader><CardTitle className="text-base">Test instructions</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-7">{String((version.instructions as Record<string, unknown>)?.text ?? 'No instructions')}</p></CardContent></Card>
              {detail.sections.map((section) => <Card key={section.id}><CardHeader><CardTitle className="flex items-center justify-between gap-3 text-base"><span>{section.sortOrder}. {section.name}</span><Badge variant="outline">{section.questions.length} questions{section.durationSeconds ? ` • ${section.durationSeconds / 60} min` : ''}</Badge></CardTitle></CardHeader><CardContent className="space-y-4">{section.questions.map((question, index) => <div key={question.questionVersionId} className="rounded-lg border p-4"><div className="flex flex-wrap items-start justify-between gap-2"><p className="max-w-3xl text-sm font-medium leading-6">{index + 1}. {question.stem}</p><Badge variant="outline">+{question.marks} / -{question.negativeMarks}</Badge></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <div key={option.id} className="rounded-md border px-3 py-2 text-sm"><strong>{option.key}.</strong> {option.text}</div>)}</div><details className="mt-3 text-sm"><summary className="cursor-pointer text-muted-foreground">Answer and explanation</summary><div className="mt-2 rounded-md bg-muted/30 p-3"><p className="font-medium">Correct: {question.options.find((option) => option.isCorrect)?.key ?? '—'}</p><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{question.explanation}</p></div></details></div>)}</CardContent></Card>)}
            </TabsContent>

            <TabsContent value="versions"><Card><CardContent className="divide-y p-0">{detail.versions.map((item) => <div key={item.id} className="p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-medium">Version {item.versionNumber} · {item.title}</p><p className="mt-1 text-xs text-muted-foreground">{item.questionCount} questions · {item.sectionCount} sections · {formatDate(item.createdAt)}</p></div><div className="flex gap-1">{item.id === test.currentDraftVersionId && <Badge variant="outline">Current draft</Badge>}{item.id === test.publishedVersionId && <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Published</Badge>}</div></div><p className="mt-2 text-sm text-muted-foreground">{item.changeReason}</p></div>)}</CardContent></Card></TabsContent>

            <TabsContent value="publications"><Card><CardContent className="p-0">{detail.publications.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No publication snapshots yet.</p> : <div className="divide-y">{detail.publications.map((publication) => <div key={publication.id} className="p-4"><p className="font-medium">Publication {publication.publicationNumber}</p><p className="mt-1 text-sm text-muted-foreground">Version {detail.versions.find((item) => item.id === publication.testVersionId)?.versionNumber ?? '—'} · Scheduled {formatDate(publication.scheduledAt)} · Published {formatDate(publication.publishedAt)} · Closes {formatDate(publication.closesAt)}</p></div>)}</div>}</CardContent></Card></TabsContent>

            <TabsContent value="audit"><Card><CardContent className="p-0">{detail.auditEvents.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No audit events recorded.</p> : <div className="divide-y">{detail.auditEvents.map((event) => <div key={event.id} className="p-4"><p className="font-medium">{event.summary}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(event.occurredAt)} • {event.actionKey}</p>{event.reason && <p className="mt-2 text-sm text-muted-foreground">{event.reason}</p>}</div>)}</div>}</CardContent></Card></TabsContent>
          </Tabs>
        </div>

        <div className="space-y-5">
          <Card><CardHeader><CardTitle className="text-base">Server validation</CardTitle></CardHeader><CardContent>{blockingIssues.length === 0 ? <div className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="h-4 w-4" /> Ready for the next lifecycle action.</div> : <div className="space-y-2">{blockingIssues.map((issue, index) => <div key={`${issue.code}-${index}`} className="flex gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /><div><p>{issue.message}</p><p className="mt-1 text-xs text-muted-foreground">{issue.code}</p></div></div>)}</div>}</CardContent></Card>

          <Card><CardHeader><CardTitle className="text-base">Lifecycle actions</CardTitle></CardHeader><CardContent className="space-y-3"><div className="space-y-2"><Label>Action reason</Label><Textarea value={actionReason} onChange={(event) => setActionReason(event.target.value)} rows={3} placeholder="Required for needs-fix, archive and restore" /></div>
            {canUpdate && ['draft', 'needs_fix', 'content_ready'].includes(test.status) && <Button className="w-full justify-start" onClick={() => void runAction('submit-qa', 'Submitted for QA')} disabled={saving || detail.validationIssues.length > 0}><Send className="mr-1.5 h-4 w-4" /> Submit for QA</Button>}
            {canApprove && test.status === 'under_qa' && <Button className="w-full justify-start" onClick={() => void runAction('approve', 'QA approved')} disabled={saving || detail.validationIssues.length > 0}><CheckCircle2 className="mr-1.5 h-4 w-4" /> Approve test</Button>}
            {canApprove && ['under_qa', 'qa_approved', 'scheduled'].includes(test.status) && <Button variant="outline" className="w-full justify-start" onClick={() => void runAction('needs-fix', 'Sent back for fixes')} disabled={saving}><XCircle className="mr-1.5 h-4 w-4" /> Mark needs fix</Button>}
            {canPublish && ['qa_approved', 'scheduled'].includes(test.status) && <div className="space-y-3 rounded-lg border p-3"><div className="space-y-2"><Label>Schedule time</Label><Input type="datetime-local" value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></div><div className="space-y-2"><Label>Optional closing time</Label><Input type="datetime-local" value={closesAt} onChange={(event) => setClosesAt(event.target.value)} /></div><div className="grid gap-2"><Button variant="outline" onClick={() => void runAction('schedule', 'Test scheduled')} disabled={saving || !scheduledAt || detail.validationIssues.length > 0}><CalendarClock className="mr-1.5 h-4 w-4" /> Schedule</Button><Button onClick={() => void runAction('publish', 'Test published')} disabled={saving || detail.validationIssues.length > 0}><Rocket className="mr-1.5 h-4 w-4" /> Publish now</Button></div></div>}
            {canUpdate && test.status !== 'archived' && <Button variant="destructive" className="w-full justify-start" onClick={() => void runAction('archive', 'Test archived')} disabled={saving}><Archive className="mr-1.5 h-4 w-4" /> Archive</Button>}
            {canUpdate && ['archived', 'needs_fix'].includes(test.status) && <Button variant="outline" className="w-full justify-start" onClick={() => void runAction('restore-draft', 'Restored as draft')} disabled={saving}><Undo2 className="mr-1.5 h-4 w-4" /> Restore as draft</Button>}
          </CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-4 w-4" /> Current publication</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><Meta label="Published version" value={test.publishedVersionId ? `v${detail.versions.find((item) => item.id === test.publishedVersionId)?.versionNumber ?? '—'}` : 'Not published'} /><Meta label="Scheduled" value={formatDate(latestPublication?.scheduledAt)} /><Meta label="Published" value={formatDate(latestPublication?.publishedAt)} /><Meta label="Closes" value={formatDate(latestPublication?.closesAt)} /></CardContent></Card>

          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" /> Record details</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><Meta label="Exam" value={test.examName} /><Meta label="Current draft" value={`v${version.versionNumber}`} /><Meta label="Last updated" value={formatDate(test.updatedAt)} /></CardContent></Card>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"><span className="text-muted-foreground">{label}</span><span className="text-right font-medium">{value}</span></div>;
}
