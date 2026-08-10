import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Database, Eye, Loader2, ShieldCheck } from 'lucide-react';

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
import {
  createCalendarReviewRun,
  getCalendarProductionStatus,
  getCalendarReviewPackage,
  previewCalendarReview,
  type CalendarProductionStatus,
  type CalendarReviewPackage,
} from '@/features/question-studio/calendar-review-api';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';
import type {
  ReasoningReviewDifficulty,
  ReasoningReviewLanguage,
  ReasoningReviewQuestion,
} from '@/features/question-studio/reasoning-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<ReasoningReviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function CalendarQuestionCard({ question }: { question: ReasoningReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Validated
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{question.canonicalItemId}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.optionDetails.map((option) => (
            <div
              key={`${question.questionId}-${option.label}`}
              className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}
            >
              <p className="font-medium">{option.label}. {option.text}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.answer}
        </div>
        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer font-semibold">Full explanation</summary>
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
          {question.explanation.conclusion && (
            <p className="mt-3"><strong>Conclusion:</strong> {question.explanation.conclusion}</p>
          )}
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioCalendarReviewPanel() {
  const [pkg, setPkg] = useState<CalendarReviewPackage | null>(null);
  const [status, setStatus] = useState<CalendarProductionStatus | null>(null);
  const [language, setLanguage] = useState<ReasoningReviewLanguage>('en');
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<ReasoningReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getCalendarProductionStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getCalendarReviewPackage(), getCalendarProductionStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Calendar package unavailable',
          error instanceof Error ? error.message : 'Unable to load Calendar production package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const request = useMemo(() => ({
    language,
    qlId: qlId === ALL ? undefined : qlId,
    difficulty: difficulty === ALL ? undefined : difficulty as ReasoningReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, difficulty, language, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewCalendarReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Calendar preview loaded', `${result.questions.length} generated question(s) validated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Calendar questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createCalendarReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success('Calendar review run created', `${result.publicCode} contains ${result.itemCount} question(s).`);
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create Calendar review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" /> Calendar · CAL-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <Database className="h-3 w-3" /> Production review enabled
            </Badge>
            <Badge variant="outline">36 permanent QLs · 3 languages</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate approved English, Hindi or Punjabi Calendar questions into the normal Question Studio review queue. Every persisted item remains unreviewed until an administrator approves it; nothing is automatically published to students.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Approved items" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-success/25 bg-success/5 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-success" /> Approval-gated production lifecycle
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Calendar is generative, so there is no finite corpus synchronization step. Create review runs on demand; approved items use the existing audited Question Bank converter and publication QA path.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Calendar production package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as ReasoningReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="QL">
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All QLs</SelectItem>
                  {(pkg?.qlIds ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All difficulties</SelectItem>
                  {(pkg?.supportedDifficulties ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count">
              <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="calendar-production-01" />
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
            {questions.map((question) => <CalendarQuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
