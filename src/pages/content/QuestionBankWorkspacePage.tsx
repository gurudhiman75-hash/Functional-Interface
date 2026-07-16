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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  getLiveApprovedQuestions,
  reconcileApprovedQuestions,
  type LiveApprovedQuestion,
} from '@/features/question-bank/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const PAGE_SIZE = 25;

function recordValue(question: LiveApprovedQuestion, key: string) {
  const generation = question.answerModel?.generation;
  if (!generation || typeof generation !== 'object' || Array.isArray(generation)) return '';
  const value = (generation as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : '';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function QuestionBankWorkspacePage() {
  const navigate = useNavigate();
  const { hasPermission } = useAdminPermissions();
  const canOpenGeneration = hasPermission('content.generation.read');
  const canReconcile = hasPermission('content.generation.review');

  const [questions, setQuestions] = useState<LiveApprovedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [topic, setTopic] = useState('all');
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<LiveApprovedQuestion | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (canReconcile) await reconcileApprovedQuestions();
      const result = await getLiveApprovedQuestions();
      setQuestions(result.questions);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Question Bank.');
    } finally {
      setLoading(false);
    }
  }, [canReconcile]);

  useEffect(() => {
    void load();
  }, [load]);

  const topics = useMemo(
    () => Array.from(new Set(questions.map((question) => recordValue(question, 'topic')).filter(Boolean))).sort(),
    [questions],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return questions.filter((question) => {
      if (difficulty !== 'all' && question.difficulty !== difficulty) return false;
      if (topic !== 'all' && recordValue(question, 'topic') !== topic) return false;
      if (!query) return true;
      const haystack = [
        question.publicCode,
        question.stem,
        question.difficulty,
        question.questionType,
        recordValue(question, 'topic'),
        recordValue(question, 'subtopic'),
        recordValue(question, 'packageId'),
        recordValue(question, 'generationRunCode'),
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }, [questions, search, difficulty, topic]);

  useEffect(() => {
    setPage(1);
  }, [search, difficulty, topic]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const hasFilters = Boolean(search.trim()) || difficulty !== 'all' || topic !== 'all';

  const clearFilters = () => {
    setSearch('');
    setDifficulty('all');
    setTopic('all');
  };

  return (
    <div>
      <PageHeader
        title="Question Bank"
        description="Live approved questions stored in the ExamTree admin database."
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
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Approved questions</p>
              <p className="mt-1 text-2xl font-semibold">{questions.length}</p>
            </div>
            <Database className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Visible results</p>
              <p className="mt-1 text-2xl font-semibold">{filtered.length}</p>
            </div>
            <Search className="h-5 w-5 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data source</p>
              <p className="mt-1 text-sm font-semibold">Admin Neon</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-success" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b p-4 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search question, code, topic or generation run..."
                className="pl-9"
              />
            </div>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulties</SelectItem>
                {Array.from(new Set(questions.map((question) => question.difficulty))).sort().map((value) => (
                  <SelectItem key={value} value={value}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="w-full lg:w-52">
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All topics</SelectItem>
                {topics.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1.5 h-4 w-4" /> Clear
              </Button>
            )}
          </div>

          {error ? (
            <div className="m-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : loading ? (
            <div className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Question Bank…
            </div>
          ) : visible.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
              <FileQuestion className="h-8 w-8 text-muted-foreground" />
              <h2 className="mt-3 text-base font-semibold">No questions found</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {hasFilters ? 'Clear or change the filters.' : 'Approve a generated question to add it to the Question Bank.'}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Question</th>
                      <th className="px-4 py-3 font-medium">Topic</th>
                      <th className="px-4 py-3 font-medium">Difficulty</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Updated</th>
                      <th className="px-4 py-3 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {visible.map((question) => (
                      <tr key={question.id} className="hover:bg-muted/20">
                        <td className="max-w-xl px-4 py-3">
                          <p className="line-clamp-2 font-medium leading-5">{question.stem}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                            <span>{question.publicCode}</span>
                            <span>•</span>
                            <span>{question.questionType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          <p>{recordValue(question, 'topic') || '—'}</p>
                          <p className="text-xs">{recordValue(question, 'subtopic')}</p>
                        </td>
                        <td className="px-4 py-3"><Badge variant="secondary">{question.difficulty}</Badge></td>
                        <td className="px-4 py-3">
                          <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{formatDate(question.updatedAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="outline" size="sm" onClick={() => setPreview(question)}>
                            <Eye className="mr-1.5 h-4 w-4" /> View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y md:hidden">
                {visible.map((question) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setPreview(question)}
                    className="block w-full p-4 text-left hover:bg-muted/20"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <Badge variant="outline">{question.publicCode}</Badge>
                      <Badge className="bg-success/10 text-success hover:bg-success/10">Approved</Badge>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm font-medium leading-5">{question.stem}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{recordValue(question, 'topic') || 'No topic'}</span>
                      <span>•</span>
                      <span>{question.difficulty}</span>
                      <span>•</span>
                      <span>{formatDate(question.updatedAt)}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
                <span>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-12 text-center text-xs">{page} / {pageCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={page >= pageCount}
                    onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {preview && (
            <>
              <SheetHeader>
                <SheetTitle className="flex flex-wrap items-center gap-2">
                  {preview.publicCode}
                  <Badge className="bg-success/10 text-success hover:bg-success/10">Approved</Badge>
                </SheetTitle>
                <SheetDescription>
                  Canonical Question Bank version {preview.versionNumber} • {preview.difficulty}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <section>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Question</Label>
                  <p className="mt-2 text-sm font-medium leading-6">{preview.stem}</p>
                </section>

                <section>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Options</Label>
                  <div className="mt-2 space-y-2">
                    {preview.options.map((option) => (
                      <div
                        key={option.id}
                        className={option.isCorrect
                          ? 'rounded-lg border border-success/40 bg-success/5 p-3 text-sm'
                          : 'rounded-lg border p-3 text-sm'}
                      >
                        <span className="mr-2 font-semibold">{option.key}.</span>{option.text}
                        {option.isCorrect && <span className="ml-2 text-xs font-semibold text-success">Correct answer</span>}
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Explanation</Label>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{preview.explanation}</p>
                </section>

                <section className="rounded-lg border bg-muted/20 p-4">
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Generation metadata</Label>
                  <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div><dt className="text-muted-foreground">Topic</dt><dd className="font-medium">{recordValue(preview, 'topic') || '—'}</dd></div>
                    <div><dt className="text-muted-foreground">Subtopic</dt><dd className="font-medium">{recordValue(preview, 'subtopic') || '—'}</dd></div>
                    <div><dt className="text-muted-foreground">Package</dt><dd className="font-medium">{recordValue(preview, 'packageId') || '—'}</dd></div>
                    <div><dt className="text-muted-foreground">Run</dt><dd className="font-medium">{recordValue(preview, 'generationRunCode') || '—'}</dd></div>
                  </dl>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
