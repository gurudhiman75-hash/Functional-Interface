import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  FileQuestion,
  Loader2,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Tags,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  createQuestionVersion,
  getLiveQuestions,
  getQuestionTaxonomyOptions,
  reconcileApprovedQuestions,
  transitionQuestion,
  updateQuestionTaxonomy,
  type LiveQuestion,
  type QuestionStatus,
  type TaxonomyOptionsResponse,
} from '@/features/question-bank/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const PAGE_SIZE = 25;

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(date);
}

function statusClass(status: QuestionStatus) {
  if (status === 'published') return 'bg-primary/10 text-primary hover:bg-primary/10';
  if (status === 'approved') return 'bg-success/10 text-success hover:bg-success/10';
  if (status === 'under_review' || status === 'needs_fix') return 'bg-warning/10 text-warning hover:bg-warning/10';
  if (status === 'archived' || status === 'rejected') return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
  return 'bg-muted text-muted-foreground hover:bg-muted';
}

function taxonomyName(question: LiveQuestion, nodeType: string) {
  return question.taxonomy.find((node) => node.nodeType === nodeType)?.name ?? '';
}

interface BulkTaxonomyState {
  familyId: string;
  examId: string;
  examVersionId: string;
  subjectId: string;
  topicId: string;
}

const EMPTY_BULK_TAXONOMY: BulkTaxonomyState = {
  familyId: '', examId: '', examVersionId: '', subjectId: '', topicId: '',
};

export function QuestionBankWorkspacePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const canOpenGeneration = hasPermission('content.generation.read');
  const canReconcile = hasPermission('content.generation.review');
  const canEdit = hasPermission('content.questions.update');
  const canArchive = hasPermission('content.questions.delete');

  const [questions, setQuestions] = useState<LiveQuestion[]>([]);
  const [taxonomyOptions, setTaxonomyOptions] = useState<TaxonomyOptionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [topic, setTopic] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTaxonomy, setBulkTaxonomy] = useState<BulkTaxonomyState>(EMPTY_BULK_TAXONOMY);
  const [bulkDifficulty, setBulkDifficulty] = useState('Medium');
  const [bulkReason, setBulkReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (canReconcile) await reconcileApprovedQuestions();
      const [questionResult, optionResult] = await Promise.all([
        getLiveQuestions(),
        getQuestionTaxonomyOptions(),
      ]);
      setQuestions(questionResult.questions);
      setTaxonomyOptions(optionResult);
      setSelectedIds((current) => new Set([...current].filter((id) => questionResult.questions.some((question) => question.id === id))));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Question Bank.');
    } finally {
      setLoading(false);
    }
  }, [canReconcile]);

  useEffect(() => { void load(); }, [load]);

  const topics = useMemo(
    () => Array.from(new Set(questions.map((question) => taxonomyName(question, 'topic')).filter(Boolean))).sort(),
    [questions],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return questions.filter((question) => {
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false;
      if (status !== 'all' && question.status !== status) return false;
      if (topic !== 'all' && taxonomyName(question, 'topic') !== topic) return false;
      if (!query) return true;
      return [
        question.publicCode,
        question.stem,
        question.difficulty,
        question.questionType,
        question.examName ?? '',
        taxonomyName(question, 'subject'),
        taxonomyName(question, 'topic'),
      ].join(' ').toLowerCase().includes(query);
    });
  }, [questions, search, difficulty, status, topic]);

  useEffect(() => { setPage(1); }, [search, difficulty, status, topic]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = questions.filter((question) => selectedIds.has(question.id));
  const hasFilters = Boolean(search.trim()) || difficulty !== 'all' || status !== 'all' || topic !== 'all';

  const exams = useMemo(
    () => taxonomyOptions?.exams.filter((exam) => exam.familyId === bulkTaxonomy.familyId) ?? [],
    [taxonomyOptions, bulkTaxonomy.familyId],
  );
  const allowedNodes = useMemo(
    () => taxonomyOptions?.nodes.filter((node) => node.examVersionIds.includes(bulkTaxonomy.examVersionId)) ?? [],
    [taxonomyOptions, bulkTaxonomy.examVersionId],
  );
  const subjects = useMemo(() => allowedNodes.filter((node) => node.nodeType === 'subject'), [allowedNodes]);
  const bulkTopics = useMemo(
    () => allowedNodes.filter((node) => node.nodeType === 'topic' && node.parentIds.includes(bulkTaxonomy.subjectId)),
    [allowedNodes, bulkTaxonomy.subjectId],
  );

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleVisible = () => {
    const allVisibleSelected = visible.length > 0 && visible.every((question) => selectedIds.has(question.id));
    setSelectedIds((current) => {
      const next = new Set(current);
      visible.forEach((question) => allVisibleSelected ? next.delete(question.id) : next.add(question.id));
      return next;
    });
  };

  const finishBulk = async (label: string, operation: (question: LiveQuestion) => Promise<unknown>) => {
    if (selected.length === 0) return;
    setBulkBusy(true);
    let completed = 0;
    const failures: string[] = [];
    for (const question of selected) {
      try {
        await operation(question);
        completed += 1;
      } catch (caught) {
        failures.push(`${question.publicCode}: ${caught instanceof Error ? caught.message : 'failed'}`);
      }
    }
    await load();
    setBulkBusy(false);
    if (failures.length === 0) {
      setSelectedIds(new Set());
      setBulkReason('');
      showToast.success(label, `${completed} question${completed === 1 ? '' : 's'} updated.`);
    } else {
      showToast.warning(`${label} partially completed`, `${completed} updated, ${failures.length} failed. ${failures[0]}`);
    }
  };

  const assignBulkTaxonomy = async () => {
    if (!bulkTaxonomy.examVersionId || !bulkTaxonomy.subjectId || !bulkTaxonomy.topicId) {
      showToast.warning('Taxonomy incomplete', 'Select an exam, subject and topic.');
      return;
    }
    await finishBulk('Taxonomy assigned', (question) => updateQuestionTaxonomy(question.id, {
      expectedLockVersion: question.lockVersion,
      examVersionId: bulkTaxonomy.examVersionId,
      primaryTaxonomyNodeId: bulkTaxonomy.topicId,
      taxonomyNodeIds: [bulkTaxonomy.subjectId, bulkTaxonomy.topicId],
    }));
  };

  const changeBulkDifficulty = async () => {
    const reason = bulkReason.trim() || `Bulk difficulty changed to ${bulkDifficulty}`;
    await finishBulk('Difficulty changed', (question) => createQuestionVersion(question.id, {
      expectedLockVersion: question.lockVersion,
      stem: question.stem,
      explanation: question.explanation,
      difficulty: bulkDifficulty,
      questionType: question.questionType,
      changeReason: reason,
      options: question.options.map((option) => ({ text: option.text, isCorrect: option.isCorrect })),
    }));
  };

  const bulkLifecycle = async (action: 'submit-review' | 'archive', label: string) => {
    if (action === 'archive' && !bulkReason.trim()) {
      showToast.warning('Reason required', 'Enter an archive reason.');
      return;
    }
    await finishBulk(label, (question) => transitionQuestion(question.id, action, {
      expectedLockVersion: question.lockVersion,
      reason: bulkReason.trim() || undefined,
    }));
  };

  const clearFilters = () => {
    setSearch(''); setDifficulty('all'); setStatus('all'); setTopic('all');
  };

  return (
    <div>
      <PageHeader
        title="Question Bank"
        description="Canonical questions, taxonomy, lifecycle and publishing controls."
        icon={<FileQuestion className="h-5 w-5" />}
        actions={<div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}><RefreshCw className="mr-1.5 h-4 w-4" /> Refresh</Button>{canOpenGeneration && <Button size="sm" onClick={() => navigate('/content/questions/generate')}><Sparkles className="mr-1.5 h-4 w-4" /> Generate Questions</Button>}</div>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Canonical questions</p><p className="mt-1 text-2xl font-semibold">{questions.length}</p></div><Database className="h-5 w-5 text-primary" /></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Published</p><p className="mt-1 text-2xl font-semibold">{questions.filter((question) => Boolean(question.publishedVersionId)).length}</p></div><CheckCircle2 className="h-5 w-5 text-success" /></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Selected</p><p className="mt-1 text-2xl font-semibold">{selected.length}</p></div><Tags className="h-5 w-5 text-primary" /></CardContent></Card>
      </div>

      {selected.length > 0 && (
        <Card className="mb-4">
          <CardHeader><CardTitle className="text-base">Bulk manage {selected.length} selected question{selected.length === 1 ? '' : 's'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Select value={bulkTaxonomy.familyId} onValueChange={(value) => setBulkTaxonomy({ ...EMPTY_BULK_TAXONOMY, familyId: value })}><SelectTrigger><SelectValue placeholder="Exam family" /></SelectTrigger><SelectContent>{taxonomyOptions?.families.map((family) => <SelectItem key={family.id} value={family.id}>{family.name}</SelectItem>)}</SelectContent></Select>
              <Select value={bulkTaxonomy.examId} onValueChange={(value) => { const exam = exams.find((entry) => entry.id === value); setBulkTaxonomy((current) => ({ ...current, examId: value, examVersionId: exam?.currentVersionId ?? '', subjectId: '', topicId: '' })); }} disabled={!bulkTaxonomy.familyId}><SelectTrigger><SelectValue placeholder="Exam" /></SelectTrigger><SelectContent>{exams.map((exam) => <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>)}</SelectContent></Select>
              <Select value={bulkTaxonomy.subjectId} onValueChange={(value) => setBulkTaxonomy((current) => ({ ...current, subjectId: value, topicId: '' }))} disabled={!bulkTaxonomy.examVersionId}><SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger><SelectContent>{subjects.map((node) => <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>)}</SelectContent></Select>
              <Select value={bulkTaxonomy.topicId} onValueChange={(value) => setBulkTaxonomy((current) => ({ ...current, topicId: value }))} disabled={!bulkTaxonomy.subjectId}><SelectTrigger><SelectValue placeholder="Topic" /></SelectTrigger><SelectContent>{bulkTopics.map((node) => <SelectItem key={node.id} value={node.id}>{node.name}</SelectItem>)}</SelectContent></Select>
              <Button onClick={() => void assignBulkTaxonomy()} disabled={bulkBusy || !canEdit}><Tags className="mr-1.5 h-4 w-4" /> Assign taxonomy</Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)_auto_auto_auto]">
              <Select value={bulkDifficulty} onValueChange={setBulkDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select>
              <div className="space-y-1"><Label className="sr-only">Bulk reason</Label><Textarea value={bulkReason} onChange={(event) => setBulkReason(event.target.value)} rows={1} placeholder="Reason for difficulty change or archive" /></div>
              <Button variant="outline" onClick={() => void changeBulkDifficulty()} disabled={bulkBusy || !canEdit}>Change difficulty</Button>
              <Button variant="outline" onClick={() => void bulkLifecycle('submit-review', 'Submitted for review')} disabled={bulkBusy || !canEdit}><Send className="mr-1.5 h-4 w-4" /> Submit review</Button>
              <Button variant="destructive" onClick={() => void bulkLifecycle('archive', 'Questions archived')} disabled={bulkBusy || !canArchive}><Archive className="mr-1.5 h-4 w-4" /> Archive</Button>
            </div>
            <div className="flex justify-end"><Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} disabled={bulkBusy}><X className="mr-1.5 h-4 w-4" /> Clear selection</Button></div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search question, code, exam or taxonomy..." className="pl-9" /></div>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full lg:w-44"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{Array.from(new Set(questions.map((question) => question.status))).sort().map((value) => <SelectItem key={value} value={value}>{formatStatus(value)}</SelectItem>)}</SelectContent></Select>
            <Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger className="w-full lg:w-44"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="all">All difficulties</SelectItem>{Array.from(new Set(questions.map((question) => question.difficulty))).sort().map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            <Select value={topic} onValueChange={setTopic}><SelectTrigger className="w-full lg:w-52"><SelectValue placeholder="Topic" /></SelectTrigger><SelectContent><SelectItem value="all">All topics</SelectItem>{topics.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="mr-1.5 h-4 w-4" /> Clear</Button>}
          </div>

          {error ? <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div> : loading ? <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Question Bank…</div> : visible.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><FileQuestion className="h-8 w-8 text-muted-foreground" /><h2 className="mt-3 text-base font-semibold">No questions found</h2><p className="mt-1 text-sm text-muted-foreground">{hasFilters ? 'Clear or change the filters.' : 'Approve a generated question to add it to the Question Bank.'}</p></div> : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="w-10 px-4 py-3"><input type="checkbox" checked={visible.length > 0 && visible.every((question) => selectedIds.has(question.id))} onChange={toggleVisible} aria-label="Select visible questions" /></th><th className="px-4 py-3 font-medium">Question</th><th className="px-4 py-3 font-medium">Exam / Taxonomy</th><th className="px-4 py-3 font-medium">Difficulty</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Updated</th></tr></thead>
                  <tbody className="divide-y">{visible.map((question) => <tr key={question.id} className="hover:bg-muted/20"><td className="px-4 py-3"><input type="checkbox" checked={selectedIds.has(question.id)} onChange={() => toggleSelected(question.id)} aria-label={`Select ${question.publicCode}`} /></td><td className="max-w-xl px-4 py-3"><Link to={`/content/questions/${question.id}`} className="line-clamp-2 font-medium leading-5 hover:text-primary">{question.stem}</Link><div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground"><span>{question.publicCode}</span><span>•</span><span>v{question.versionNumber}</span><span>•</span><span>{question.questionType}</span></div></td><td className="px-4 py-3 text-muted-foreground"><p>{question.examName || 'No exam'}</p><p className="text-xs">{taxonomyName(question, 'subject') || 'No subject'}{taxonomyName(question, 'topic') ? ` • ${taxonomyName(question, 'topic')}` : ''}</p></td><td className="px-4 py-3"><Badge variant="secondary">{question.difficulty}</Badge></td><td className="px-4 py-3"><Badge className={statusClass(question.status)}>{formatStatus(question.status)}</Badge>{question.publishedVersionId && question.status !== 'published' && <p className="mt-1 text-[10px] font-medium text-primary">Published version active</p>}</td><td className="px-4 py-3 text-muted-foreground">{formatDate(question.updatedAt)}</td></tr>)}</tbody>
                </table>
              </div>
              <div className="divide-y md:hidden">{visible.map((question) => <div key={question.id} className="p-4"><div className="flex items-start gap-3"><input type="checkbox" checked={selectedIds.has(question.id)} onChange={() => toggleSelected(question.id)} className="mt-1" aria-label={`Select ${question.publicCode}`} /><Link to={`/content/questions/${question.id}`} className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><Badge variant="outline">{question.publicCode}</Badge><Badge className={statusClass(question.status)}>{formatStatus(question.status)}</Badge></div><p className="mt-3 line-clamp-3 text-sm font-medium leading-5">{question.stem}</p><div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"><span>{question.examName || 'No exam'}</span><span>•</span><span>{taxonomyName(question, 'topic') || 'No topic'}</span><span>•</span><span>{question.difficulty}</span></div></Link></div></div>)}</div>
              <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground"><span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="h-4 w-4" /></Button><span className="min-w-12 text-center text-xs">{page} / {pageCount}</span><Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight className="h-4 w-4" /></Button></div></div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
