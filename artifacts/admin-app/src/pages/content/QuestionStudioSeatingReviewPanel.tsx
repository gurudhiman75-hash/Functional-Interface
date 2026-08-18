import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Database, Eye, LayoutGrid, Loader2, LockKeyhole } from 'lucide-react';

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
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';
import {
  createSeatingReviewRun,
  getSeatingReviewPackage,
  getSeatingReviewStatus,
  previewSeatingReview,
  type SeatingReviewCheckpoint,
  type SeatingReviewLanguage,
  type SeatingReviewPackage,
  type SeatingReviewQuestion,
  type SeatingReviewStatus,
} from '@/features/question-studio/seating-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<SeatingReviewLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी',
  pa: 'ਪੰਜਾਬੀ',
};
const CHECKPOINT_LABELS: Record<SeatingReviewCheckpoint, string> = {
  'SEA-CP-001': 'Single row · same facing',
  'SEA-CP-002': 'Single row · mixed facing',
  'SEA-CP-003': 'Circular · facing centre',
  'SEA-CP-004': 'Circular · facing outward',
  'SEA-CP-005': 'Circular · mixed facing',
};

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function SeatingDiagram({ question }: { question: SeatingReviewQuestion }) {
  const renderer = question.renderer;
  if (renderer.svg) {
    return (
      <div className="rounded-lg border bg-white p-3 text-slate-950">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Solved arrangement diagram</p>
        <div
          className="mx-auto max-w-[430px] [&_svg]:h-auto [&_svg]:w-full"
          // SVG is generated only by the validated internal SEA-001 renderer.
          dangerouslySetInnerHTML={{ __html: renderer.svg }}
        />
      </div>
    );
  }
  if (renderer.text) {
    return (
      <pre className="max-w-full overflow-auto whitespace-pre-wrap rounded-lg border bg-white p-3 text-xs leading-5 text-slate-950">
        {renderer.text}
      </pre>
    );
  }
  return null;
}

function SeatingQuestionCard({ question }: { question: SeatingReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="outline">{question.blueprintAuthorityId}</Badge>
          <Badge variant="outline">{CHECKPOINT_LABELS[question.checkpointId]}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Solver + oracle validated
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{question.contentFingerprint}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 leading-6">
          {question.sharedPrompt}
        </div>

        <SeatingDiagram question={question} />

        <p className="whitespace-pre-wrap font-semibold leading-6">{question.stem}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.optionDetails.map((option, index) => (
            <div
              key={`${question.questionId}-${option.label}`}
              className={`rounded-lg border p-3 ${index === question.correctIndex ? 'border-success/40 bg-success/5' : ''}`}
            >
              <p className="font-medium">{option.label}. {option.text}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.studentExplanation}</p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.answer}
        </div>

        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer font-semibold">Full learner explanation</summary>
          <div className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <p key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</p>
            ))}
            <p className="pt-2 text-foreground"><strong>Question reasoning:</strong> {question.explanation.conclusion}</p>
          </div>
        </details>

        <details className="rounded-lg border p-3 text-xs">
          <summary className="cursor-pointer font-semibold">Traceability</summary>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-3">
            {JSON.stringify(question.traceability, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioSeatingReviewPanel() {
  const [pkg, setPkg] = useState<SeatingReviewPackage | null>(null);
  const [status, setStatus] = useState<SeatingReviewStatus | null>(null);
  const [checkpointId, setCheckpointId] = useState(ALL);
  const [qlId, setQlId] = useState(ALL);
  const [language, setLanguage] = useState<SeatingReviewLanguage>('en');
  const [count, setCount] = useState(4);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<SeatingReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getSeatingReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getSeatingReviewPackage(), getSeatingReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Seating Arrangement package unavailable',
          error instanceof Error ? error.message : 'Unable to load the SEA-001 Question Studio package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleQls = useMemo(
    () => (pkg?.qls ?? []).filter((entry) => checkpointId === ALL || entry.checkpointId === checkpointId),
    [checkpointId, pkg?.qls],
  );

  useEffect(() => {
    if (qlId !== ALL && !visibleQls.some((entry) => entry.permanentQlId === qlId)) setQlId(ALL);
  }, [qlId, visibleQls]);

  const request = useMemo(() => ({
    language,
    checkpointId: checkpointId === ALL ? undefined : checkpointId as SeatingReviewCheckpoint,
    qlId: qlId === ALL ? undefined : qlId,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [checkpointId, count, language, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewSeatingReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success(
        'Seating preview loaded',
        `${result.questions.length} validated ${LANGUAGE_LABELS[language]} question(s) generated for review.`,
      );
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Seating Arrangement questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createSeatingReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'Seating review run created',
        `${result.publicCode} contains ${result.itemCount} review item(s). Question Bank remains locked.`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create the Seating Arrangement review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/25 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutGrid className="h-4 w-4" /> Seating Arrangement · SEA-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <Database className="h-3 w-3" /> Question Studio connected
            </Badge>
            <Badge variant="outline" className="gap-1">
              <LockKeyhole className="h-3 w-3" /> Question Bank locked
            </Badge>
            <Badge variant="outline">20 QLs · English · हिन्दी · ਪੰਜਾਬੀ</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate fresh SEA-001 caselet questions from the frozen 20-QL solve/query authority. English, Hindi and Punjabi candidates enter the normal Question Studio review queue. Question Bank conversion, mock-test eligibility, staging and public publication remain blocked.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Review-approved" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-warning/30 bg-background/70 p-3 text-xs leading-5 text-muted-foreground">
          <strong className="text-foreground">Lifecycle boundary:</strong> Review approval inside Question Studio does not release SEA-001 to Question Bank. Stored payloads remain <code>DYNAMIC_CANDIDATE</code>, <code>NOT_STORED</code>, test-ineligible and non-public until a separate product activation is explicitly approved.
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Seating Arrangement package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Checkpoint">
              <Select value={checkpointId} onValueChange={setCheckpointId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All checkpoints</SelectItem>
                  {(pkg?.checkpoints ?? []).map((entry) => (
                    <SelectItem key={entry} value={entry}>{CHECKPOINT_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="QL">
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All QLs</SelectItem>
                  {visibleQls.map((entry) => (
                    <SelectItem key={entry.permanentQlId} value={entry.permanentQlId}>
                      {entry.permanentQlId} · {entry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as SeatingReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count">
              <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="sea-review-01" />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!pkg || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview
          </Button>
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || working !== null}>
            {working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Create review run
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4 border-t pt-5">
            {questions.map((question) => <SeatingQuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
