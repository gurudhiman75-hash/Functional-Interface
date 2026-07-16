import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Eye,
  FileQuestion,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  getLiveQuestions,
  reconcileApprovedQuestions,
  type LiveQuestion,
  type QuestionStatus,
} from '@/features/question-bank/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const PAGE_SIZE = 25;

function recordValue(question: LiveQuestion, key: string) {
  const generation = question.answerModel?.generation;
  if (!generation || typeof generation !== 'object' || Array.isArray(generation)) return '';
  const value = (generation as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(date);
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusClass(status: QuestionStatus) {
  if (status === 'approved') return 'bg-success/10 text-success hover:bg-success/10';
  if (status === 'needs_fix' || status === 'under_review') return 'bg-warning/10 text-warning hover:bg-warning/10';
  if (status === 'archived' || status === 'rejected') return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
  return 'bg-muted text-muted-foreground hover:bg-muted';
}

export function QuestionBankWorkspacePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const canOpenGeneration = hasPermission('content.generation.read');
  const canReconcile = hasPermission('content.generation.review');

  const [questions, setQuestions] = useState<LiveQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [topic, setTopic] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (canReconcile) await reconcileApprovedQuestions();
      const result = await getLiveQuestions();
      setQuestions(result.questions);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Question Bank.');
    } finally {
      setLoading(false);
    }
  }, [canReconcile]);

  useEffect(() => { void load(); }, [load]);

  const topics = useMemo(
    () => Array.from(new Set(questions.map((question) => recordValue(question, 'topic')).filter(Boolean))).sort(),
    [questions],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return questions.filter((question) => {
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false;
      if (topic !== 'all' && recordValue(question, 'topic') !== topic) return false;
      if (status !== 'all' && question.status !== status) return false;
      if (!query) return true;
      return [
        question.publicCode,
        question.stem,
        question.difficulty,
        question.questionType,
        question.status,
        recordValue(question, 'topic'),
        recordValue(question, 'subtopic'),
        recordValue(question, 'packageId'),
        recordValue(question, 'generationRunCode'),
      ].join(' ').toLowerCase().includes(query);
    });
  }, [questions, search, difficulty, topic, status]);

  useEffect(() => { setPage(1); }, [search, difficulty, topic, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(search.trim()) || difficulty !== 'all' || topic !== 'all' || status !== 'all';
  const approvedCount = questions.filter((question) => question.status === 'approved').length;

  const clearFilters = () => {
    setSearch('');
    setDifficulty('all');
    setTopic('all');
    setStatus('all');
  };

  return (
    <div>
      <PageHeader
        title="Question Bank"
        description="Canonical questions, immutable versions and editorial lifecycle from the ExamTree admin database."
        icon={<FileQuestion className="h-5 w-5" />}
        actions={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}
              Refresh
            </Button>
            {canOpenGeneration && (
              <Button size="sm" onClick={() => navigate('/content/questions/generate')}>
                <Sparkles className="mr-1.5 h-4 w-4" /> Generate Questions
              </Button>
            )}
          </div>
        )}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Canonical questions</p><p className="mt-1 text-2xl font-semibold">{questions.length}</p></div><Database className="h-5 w-5 text-primary" /></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Approved</p><p className="mt-1 text-2xl font-semibold">{approvedCount}</p></div><CheckCircle2 className="h-5 w-5 text-success" /></CardContent></Card>
        <Card><CardContent className="flex items-center justify-between p-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Visible results</p><p className="mt-1 text-2xl font-semibold">{filtered.length}</p></div><Search className="h-5 w-5 text-primary" /></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search question, code, topic or generation run..." className="pl-9" />
            </div>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full xl:w-44"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem>{Array.from(new Set(questions.map((question) => question.status))).sort().map((value) => <SelectItem key={value} value={value}>{formatStatus(value)}</SelectItem>)}</SelectContent></Select>
            <Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger className="w-full xl:w-44"><SelectValue placeholder="Difficulty" /></SelectTrigger><SelectContent><SelectItem value="all">All difficulties</SelectItem>{Array.from(new Set(questions.map((question) => question.difficulty))).sort().map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            <Select value={topic} onValueChange={setTopic}><SelectTrigger className="w-full xl:w-52"><SelectValue placeholder="Topic" /></SelectTrigger><SelectContent><SelectItem value="all">All topics</SelectItem>{topics.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select>
            {hasFilters && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="mr-1.5 h-4 w-4" /> Clear</Button>}
          </div>

          {error ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>
          ) : loading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Question Bank…</div>
          ) : visible.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center"><FileQuestion className="h-8 w-8 text-muted-foreground" /><h2 className="mt-3 text-base font-semibold">No questions found</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">{hasFilters ? 'Clear or change the filters.' : 'Approve a generated question to add it to the Question Bank.'}</p></div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Question</th><th className="px-4 py-3 font-medium">Topic</th><th className="px-4 py-3 font-medium">Version</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Updated</th><th className="px-4 py-3 text-right font-medium">Action</th></tr></thead>
                  <tbody className="divide-y">
                    {visible.map((question) => (
                      <tr key={question.id} className="cursor-pointer hover:bg-muted/20" onClick={() => navigate(`/content/questions/${question.id}`)}>
                        <td className="max-w-xl px-4 py-3"><p className="line-clamp-2 font-medium leading-5">{question.stem}</p><div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground"><span>{question.publicCode}</span><span>•</span><span>{question.questionType}</span><span>•</span><span>{question.difficulty}</span></div></td>
                        <td className="px-4 py-3 text-muted-foreground"><p>{recordValue(question, 'topic') || '—'}</p><p className="text-xs">{recordValue(question, 'subtopic')}</p></td>
                        <td className="px-4 py-3"><Badge variant="outline">v{question.versionNumber}</Badge></td>
                        <td className="px-4 py-3"><Badge className={statusClass(question.status)}>{formatStatus(question.status)}</Badge></td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(question.updatedAt)}</td>
                        <td className="px-4 py-3 text-right"><Button variant="outline" size="sm" onClick={(event) => { event.stopPropagation(); navigate(`/content/questions/${question.id}`); }}><Eye className="mr-1.5 h-4 w-4" /> Manage</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y md:hidden">
                {visible.map((question) => (
                  <button key={question.id} type="button" onClick={() => navigate(`/content/questions/${question.id}`)} className="block w-full p-4 text-left hover:bg-muted/20">
                    <div className="flex items-start justify-between gap-3"><Badge variant="outline">{question.publicCode}</Badge><Badge className={statusClass(question.status)}>{formatStatus(question.status)}</Badge></div>
                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-5">{question.stem}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground"><span>{recordValue(question, 'topic') || 'No topic'}</span><span>•</span><span>{question.difficulty}</span><span>•</span><span>v{question.versionNumber}</span><span>•</span><span>{formatDate(question.updatedAt)}</span></div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                <span>Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                <div className="flex items-center gap-2"><Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}><ChevronLeft className="h-4 w-4" /></Button><span className="min-w-12 text-center text-xs">{page} / {pageCount}</span><Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
