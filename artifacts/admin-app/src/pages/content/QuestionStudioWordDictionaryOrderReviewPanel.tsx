import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Database, Eye, ListOrdered, Loader2, ShieldAlert } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';
import {
  createWorReviewRun,
  getWorReviewPackage,
  getWorReviewStatus,
  previewWorReview,
  type WorReviewDifficulty,
  type WorReviewLanguage,
  type WorReviewPackage,
  type WorReviewQuestion,
  type WorReviewStatus,
} from '@/features/question-studio/word-dictionary-order-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<WorReviewLanguage, string> = {
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function WorQuestionCard({ question }: { question: WorReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.checkpointId}</Badge>
          <Badge variant="outline">{question.prototypeId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          <Badge variant="outline">{question.source.objectMode.replaceAll('_', ' ')}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Independently verified
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {question.taskKind} · {question.source.evidenceStatus} · {question.source.allocationDecision}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.displayStem}</p>
        <div className={`grid gap-2 ${question.options.length > 4 ? 'lg:grid-cols-5' : 'md:grid-cols-2'}`}>
          {question.optionDetails.map((option) => (
            <div
              key={`${question.questionId}-${option.label}`}
              className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}
            >
              <p className="font-medium">{option.label}. {option.text}</p>
              {option.misconceptionId && (
                <p className="mt-1 text-[11px] text-muted-foreground">Distractor: {option.misconceptionId}</p>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Verified answer:</strong> {question.answer}
        </div>
        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer font-semibold">Question-specific explanation</summary>
          <p className="mt-3 whitespace-pre-wrap leading-6 text-muted-foreground">{question.explanation}</p>
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioWordDictionaryOrderReviewPanel() {
  const [pkg, setPkg] = useState<WorReviewPackage | null>(null);
  const [status, setStatus] = useState<WorReviewStatus | null>(null);
  const [language, setLanguage] = useState<WorReviewLanguage>('en');
  const [checkpointId, setCheckpointId] = useState(ALL);
  const [prototypeId, setPrototypeId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<WorReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getWorReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getWorReviewPackage(), getWorReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Word-order review unavailable',
          error instanceof Error ? error.message : 'Unable to load WOR-001 review controls.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visiblePrototypes = useMemo(() => {
    const requestedDifficulty = difficulty === ALL ? null : difficulty as WorReviewDifficulty;
    return (pkg?.prototypes ?? []).filter((prototype) => {
      if (checkpointId !== ALL && prototype.checkpointId !== checkpointId) return false;
      if (requestedDifficulty && !prototype.supportedDifficulties.includes(requestedDifficulty)) return false;
      return true;
    });
  }, [checkpointId, difficulty, pkg]);

  useEffect(() => {
    if (prototypeId !== ALL && !visiblePrototypes.some((prototype) => prototype.prototypeId === prototypeId)) {
      setPrototypeId(ALL);
    }
  }, [prototypeId, visiblePrototypes]);

  const request = useMemo(() => ({
    language,
    checkpointId: checkpointId === ALL ? undefined : checkpointId,
    prototypeId: prototypeId === ALL ? undefined : prototypeId,
    difficulty: difficulty === ALL ? undefined : difficulty as WorReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [checkpointId, count, difficulty, language, prototypeId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewWorReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('WOR-001 preview loaded', `${result.questions.length} independently verified question(s) ready.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview WOR-001 questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createWorReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'WOR-001 review run created',
        `${result.publicCode} contains ${result.itemCount} review-only question(s).`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create the WOR-001 review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-warning/25 bg-warning/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ListOrdered className="h-4 w-4" /> Word & Dictionary Order · WOR-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1"><ShieldAlert className="h-3 w-3" /> Review-only lifecycle</Badge>
            <Badge variant="outline">5 checkpoints · 24 prototypes</Badge>
            <Badge variant="outline">English/Hindi/Punjabi</Badge>
            <Badge variant="outline">0 permanent QLs</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate deterministic WOR-001 questions directly into the shared Question Studio review queue. Editorial approval is recorded in the normal workflow, but Question Bank conversion, mock-test use, public publication and permanent QL allocation remain locked.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Prototypes" value={status.prototypeCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Review-approved" value={status.approvedItemCount} />
            <Metric label="Needs fix" value={status.needsFixItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-warning/30 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium"><ShieldAlert className="h-4 w-4" /> Release gate remains closed</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            The chapter is review-visible, not product-released. Native Hindi/Punjabi human sign-off and allocation of the eight recommended permanent QL roots are still required before any Question Bank or scored-test activation.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading WOR-001 review package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as WorReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en', 'hi', 'pa']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Checkpoint">
              <Select value={checkpointId} onValueChange={(value) => { setCheckpointId(value); setPrototypeId(ALL); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All checkpoints</SelectItem>
                  {(pkg?.checkpoints ?? []).map((entry) => (
                    <SelectItem key={entry.checkpointId} value={entry.checkpointId}>{entry.checkpointId} · {entry.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Prototype">
              <Select value={prototypeId} onValueChange={setPrototypeId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All compatible prototypes</SelectItem>
                  {visiblePrototypes.map((entry) => (
                    <SelectItem key={entry.prototypeId} value={entry.prototypeId}>{entry.prototypeId} · {entry.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All difficulties</SelectItem>
                  {(pkg?.supportedDifficulties ?? ['Easy', 'Medium', 'Hard']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count">
              <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="wor-review-01" />
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
            {questions.map((question) => <WorQuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
