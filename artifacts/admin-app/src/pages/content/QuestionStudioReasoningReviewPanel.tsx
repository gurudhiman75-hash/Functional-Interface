import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Eye, Loader2, LockKeyhole, Network } from 'lucide-react';

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
  getReasoningReviewPackages,
  previewReasoningReview,
  type ReasoningReviewDifficulty,
  type ReasoningReviewLanguage,
  type ReasoningReviewPackage,
  type ReasoningReviewQuestion,
} from '@/features/question-studio/reasoning-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<ReasoningReviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function readable(value: unknown) {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '—';
  return JSON.stringify(value, null, 2);
}

function QuestionPreview({ question }: { question: ReasoningReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background/80">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid ? (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Validated
            </Badge>
          ) : (
            <Badge variant="destructive">Validation failed</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {question.canonicalItemId} · {question.useMode}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {question.sharedPrompt && (
          <div className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
            {question.sharedPrompt}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold">Question</p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{question.stem}</p>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          {question.optionDetails.map((option) => (
            <div
              key={`${question.questionId}-${option.label}`}
              className={`rounded-lg border p-3 text-sm ${option.isCorrect ? 'border-success/40 bg-success/5' : 'bg-card'}`}
            >
              <p className="font-medium">{option.label}. {option.text}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {option.studentExplanation}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-success">Reviewed answer</p>
          <p className="mt-1 text-sm font-medium">{question.answer}</p>
        </div>

        {question.decodedStatements.length > 0 && (
          <div>
            <p className="text-sm font-semibold">Decoded statements</p>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              {question.decodedStatements.map((statement, index) => (
                <p key={`${question.questionId}-decoded-${index}`}>{index + 1}. {readable(statement)}</p>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold">Step-by-step explanation</p>
          <ol className="mt-2 space-y-2 text-sm leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm"><span className="font-semibold">Conclusion:</span> {question.explanation.conclusion}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Shortcut:</span> {question.explanation.shortcut}</p>
          <p className="mt-2 text-sm"><span className="font-semibold">Common trap:</span> {question.explanation.commonTrap}</p>
        </div>

        <details className="rounded-lg border bg-muted/20 p-3">
          <summary className="cursor-pointer text-sm font-semibold">Family-tree and relation-graph proof</summary>
          <div className="mt-3 grid gap-3 xl:grid-cols-3">
            <ProofBlock title="Family tree" value={question.explanation.familyTree} />
            <ProofBlock title="Diagram proof" value={question.explanation.diagramProof} />
            <ProofBlock title="Relation graph" value={question.reasoningGraph} />
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

function ProofBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words text-xs leading-5">{readable(value)}</pre>
    </div>
  );
}

export function QuestionStudioReasoningReviewPanel() {
  const [packages, setPackages] = useState<ReasoningReviewPackage[]>([]);
  const [packageId, setPackageId] = useState('');
  const [language, setLanguage] = useState<ReasoningReviewLanguage>('en');
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<ReasoningReviewQuestion[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoadingPackages(true);
    void getReasoningReviewPackages()
      .then((response) => {
        if (!active) return;
        setPackages(response.packages.filter((entry) => entry.adminReviewVisible));
        setPackageId(response.packages[0]?.packageId ?? '');
      })
      .catch((caught) => {
        if (!active) return;
        setError(caught instanceof Error ? caught.message : 'Unable to load Reasoning review packages.');
      })
      .finally(() => {
        if (active) setLoadingPackages(false);
      });
    return () => { active = false; };
  }, []);

  const activePackage = useMemo(
    () => packages.find((entry) => entry.packageId === packageId),
    [packageId, packages],
  );

  useEffect(() => {
    if (!activePackage) return;
    if (!activePackage.supportedLanguages.includes(language)) {
      setLanguage(activePackage.supportedLanguages[0] ?? 'en');
    }
    if (qlId !== ALL && !activePackage.qlIds.includes(qlId)) setQlId(ALL);
    if (
      difficulty !== ALL &&
      !activePackage.supportedDifficulties.includes(difficulty as ReasoningReviewDifficulty)
    ) {
      setDifficulty(ALL);
    }
  }, [activePackage, difficulty, language, qlId]);

  const handlePreview = async () => {
    if (!activePackage) {
      showToast.error('Review package required', 'Select an admin-visible Reasoning review package.');
      return;
    }
    setPreviewing(true);
    setError(null);
    try {
      const result = await previewReasoningReview({
        packageId: activePackage.packageId,
        language,
        qlId: qlId === ALL ? undefined : qlId,
        difficulty: difficulty === ALL
          ? undefined
          : difficulty as ReasoningReviewDifficulty,
        count: Math.min(20, Math.max(1, count)),
        seed: seed.trim() || undefined,
      });
      setQuestions(result.questions);
      showToast.success('Read-only preview loaded', `${result.questions.length} frozen question(s) loaded without database writes.`);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Unable to load the read-only preview.';
      setError(message);
      showToast.error('Preview failed', message);
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <Card className="border-info/25 bg-info/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-4 w-4 text-info" /> Reasoning multilingual frozen review
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1 border-info/30 bg-background text-info">
              <Eye className="h-3 w-3" /> Admin preview
            </Badge>
            <Badge variant="outline" className="gap-1 border-warning/30 bg-background text-warning">
              <LockKeyhole className="h-3 w-3" /> No persistence
            </Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Preview the frozen BLR-CP-007 English, Hindi and Punjabi corpus. This surface cannot create generation runs, write to Question Bank, enter mock tests or publish learner content.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {loadingPackages ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading review packages…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <div className="space-y-2 xl:col-span-2">
              <Label>Review package</Label>
              <Select value={packageId} onValueChange={setPackageId}>
                <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {packages.map((entry) => (
                    <SelectItem key={entry.packageId} value={entry.packageId}>
                      {entry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as ReasoningReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(activePackage?.supportedLanguages ?? ['en']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Question language</Label>
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All QLs</SelectItem>
                  {(activePackage?.qlIds ?? []).map((entry) => (
                    <SelectItem key={entry} value={entry}>{entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All difficulties</SelectItem>
                  {(activePackage?.supportedDifficulties ?? []).map((entry) => (
                    <SelectItem key={entry} value={entry}>{entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preview count</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={count}
                onChange={(event) => setCount(Number(event.target.value) || 1)}
              />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <Label>Optional deterministic seed</Label>
            <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Example: blr-review-01" />
          </div>
          <Button onClick={() => void handlePreview()} disabled={!activePackage || previewing || loadingPackages}>
            {previewing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            Preview frozen questions
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4 border-t pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Read-only preview results</p>
              <p className="text-xs text-muted-foreground">{questions.length} record(s) · no database transaction</p>
            </div>
            {questions.map((question) => (
              <QuestionPreview key={question.questionId} question={question} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
