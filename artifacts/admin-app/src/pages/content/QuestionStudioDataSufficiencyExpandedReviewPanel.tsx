import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Eye, Layers3, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  createDsfExpandedReviewRun,
  getDsfExpandedReviewPackage,
  getDsfExpandedReviewStatus,
  previewDsfExpandedReview,
  type DsfExpandedDifficulty,
  type DsfExpandedPackage,
  type DsfExpandedQuestion,
  type DsfExpandedReviewInput,
  type DsfExpandedSemanticClass,
  type DsfExpandedStatus,
} from '@/features/question-studio/data-sufficiency-expanded-review-api';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';

const ALL = 'all';
const CLASS_LABELS: Record<DsfExpandedSemanticClass, string> = {
  STATEMENT_I_ONLY: 'Statement I only',
  STATEMENT_II_ONLY: 'Statement II only',
  EACH_STATEMENT_ALONE: 'Each statement alone',
  BOTH_TOGETHER_ONLY: 'Both together only',
  INSUFFICIENT_EVEN_TOGETHER: 'Insufficient even together',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>;
}

function ExpandedQuestionCard({ question }: { question: DsfExpandedQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.domainLabel}</Badge>
          <Badge variant="secondary">{question.qlId}</Badge>
          <Badge variant="outline">{question.sourceCheckpointId}</Badge>
          <Badge variant="outline">{question.solveModeId}</Badge>
          <Badge variant="outline">{question.difficulty}</Badge>
          <Badge variant="outline">{CLASS_LABELS[question.canonicalAnswer]}</Badge>
          {question.editorialSurfaceVersion && <Badge variant="outline">{question.editorialSurfaceVersion}</Badge>}
          <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10"><CheckCircle2 className="h-3 w-3" /> Source proof preserved</Badge>
          <Badge variant="outline" className="gap-1"><LockKeyhole className="h-3 w-3" /> Review only</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{question.sourceChapterId} · seed {question.seed} · {question.domainFamily}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="space-y-2 rounded-lg border p-3">
          <p><strong>Statement I:</strong> {question.statements[0].text}</p>
          <p><strong>Statement II:</strong> {question.statements[1].text}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {question.options.map((option) => (
            <div key={`${question.questionId}-${option.key}`} className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}>
              <p className="font-medium">{option.key}. {option.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3"><strong>Answer:</strong> {question.answer}</div>
        <div className="rounded-lg border p-3">
          <p className="font-semibold">Solution</p>
          <p className="mt-3 whitespace-pre-wrap leading-6 text-muted-foreground">{question.explanation}</p>
        </div>
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-xs leading-5 text-muted-foreground">
          CP017 review item: Question Bank write, scored test, mock test and public publication are locked. Approval here is editorial review only until a separate downstream release checkpoint is authorized.
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioDataSufficiencyExpandedReviewPanel() {
  const [pkg, setPkg] = useState<DsfExpandedPackage | null>(null);
  const [status, setStatus] = useState<DsfExpandedStatus | null>(null);
  const [laneId, setLaneId] = useState(ALL);
  const [semanticClass, setSemanticClass] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<DsfExpandedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getDsfExpandedReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    void Promise.all([getDsfExpandedReviewPackage(), getDsfExpandedReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => showToast.error(
        'Expanded Data Sufficiency package unavailable',
        error instanceof Error ? error.message : 'Unable to load package.',
      ))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const request = useMemo<DsfExpandedReviewInput>(() => ({
    laneId: laneId === ALL ? undefined : laneId,
    semanticClass: semanticClass === ALL ? undefined : semanticClass as DsfExpandedSemanticClass,
    difficulty: difficulty === ALL ? undefined : difficulty as DsfExpandedDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, difficulty, laneId, seed, semanticClass]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewDsfExpandedReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Expanded preview loaded', `${result.questions.length} Data Sufficiency review question(s) rendered.`);
    } catch (error) {
      showToast.error('Expanded preview failed', error instanceof Error ? error.message : 'Unable to preview questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleRun = async () => {
    setWorking('run');
    try {
      const result = await createDsfExpandedReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success('Expanded review run created', `${result.publicCode}: ${result.itemCount} item(s) entered the normal review queue. Downstream Question Bank/test/mock/public release remains locked.`);
    } catch (error) {
      showToast.error('Expanded run creation failed', error instanceof Error ? error.message : 'Unable to create review run.');
    } finally {
      setWorking(null);
    }
  };

  const ql002 = pkg?.nonGeneratablePermanentQlIds.find((entry) => entry.qlId === 'DSF-QL-002');

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base"><Layers3 className="h-4 w-4" /> Data Sufficiency · CP017 expanded normal workflow</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">DSF-QL-001 bulk generation</Badge>
            <Badge variant="outline">17 lanes</Badge>
            <Badge variant="outline">CP011 + CP012 + CP013</Badge>
            <Badge variant="outline">CP014 editorial surface</Badge>
            <Badge variant="outline">English review</Badge>
            <Badge variant="outline">CP017</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          The production-integrated CP011–CP013 breadth now uses the normal authenticated Question Studio preview, generation-run and review dashboard lifecycle. CP017 owns Studio exposure while the original source runtimes stay locked. This expansion is review-only: Question Bank, scored-test, mock-test and public-release gates remain closed.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Bulk QLs" value={status.generatableQlCount} />
            <Metric label="Expansion lanes" value={status.laneCount} />
            <Metric label="Review items" value={status.generationItemCount} />
            <Metric label="Approved reviews" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
            <Metric label="Next QL" value={status.nextAvailableQlId} />
          </div>
        )}

        <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> CP017 normal Question Studio boundary</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Discoverable = Yes · Preview = Yes · Create review run = Yes · Persistence = Yes · Manual approval = Yes. Question Bank writable = No · Test eligible = No · Mock eligible = No · Publicly publishable = No · Automatic student publication = No.
          </p>
        </div>

        {ql002 && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-xs leading-5 text-muted-foreground">
            <strong>DSF-QL-002 is permanent but intentionally not in bulk generation.</strong> {ql002.reason}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading expanded Data Sufficiency package…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Expansion lane">
              <Select value={laneId} onValueChange={(value) => { setLaneId(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All 17 lanes</SelectItem>
                  {(pkg?.lanes ?? []).map((lane) => <SelectItem key={lane.id} value={lane.id}>{lane.label} · {lane.domainFamily}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Sufficiency class">
              <Select value={semanticClass} onValueChange={(value) => { setSemanticClass(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All classes</SelectItem>
                  {(pkg?.supportedSemanticClasses ?? []).map((entry) => <SelectItem key={entry} value={entry}>{CLASS_LABELS[entry]}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={(value) => { setDifficulty(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All levels</SelectItem>
                  {(pkg?.supportedDifficulties ?? ['Easy', 'Medium', 'Hard']).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count"><Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Math.min(50, Math.max(1, Number(event.target.value) || 1)))} /></Field>
            <Field label="Seed"><Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="deterministic seed" /></Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePreview} disabled={working !== null || loading}><Eye className="mr-2 h-4 w-4" />{working === 'preview' ? 'Loading…' : 'Preview expansion'}</Button>
          <Button onClick={handleRun} disabled={working !== null || loading}>{working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}Create review run</Button>
        </div>

        {questions.length > 0 && <div className="space-y-4">{questions.map((question) => <ExpandedQuestionCard key={question.questionId} question={question} />)}</div>}
      </CardContent>
    </Card>
  );
}
