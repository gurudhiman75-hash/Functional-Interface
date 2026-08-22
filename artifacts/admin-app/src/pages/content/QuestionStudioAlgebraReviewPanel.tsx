import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Calculator, CheckCircle2, Eye, Loader2, ShieldAlert } from 'lucide-react';

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
  createAlgebraReviewRun,
  getAlgebraReviewPackage,
  getAlgebraReviewStatus,
  previewAlgebraReview,
  type AlgebraReviewDifficulty,
  type AlgebraReviewExamProfile,
  type AlgebraReviewLanguage,
  type AlgebraReviewPackage,
  type AlgebraReviewQuestion,
  type AlgebraReviewStatus,
} from '@/features/question-studio/algebra-review-api';

const ALL = 'all';

const PROFILE_LABELS: Record<AlgebraReviewExamProfile, string> = {
  SSC_CORE: 'SSC · Core',
  SSC_ADVANCED: 'SSC · Advanced',
  BANKING: 'Banking',
  PUNJAB_STATE: 'Punjab State',
};

const LANGUAGE_LABELS: Record<AlgebraReviewLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी',
  pa: 'ਪੰਜਾਬੀ',
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

function QuestionCard({ question }: { question: AlgebraReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.cpId}</Badge>
          <Badge variant="secondary">{question.qlId}</Badge>
          <Badge variant="outline">{question.prototypeId}</Badge>
          <Badge variant="outline">{question.difficultyBand}</Badge>
          <Badge variant="outline">{PROFILE_LABELS[question.examProfile]}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]} · {question.locale}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Validated
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {question.canonicalItemId} · {question.solveMode}
        </p>
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
              {!option.isCorrect && option.misconceptionId && (
                <p className="mt-1 text-xs text-muted-foreground">{option.misconceptionId}</p>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.answer}
        </div>
        <div className="rounded-lg border p-3">
          <p className="font-semibold">Solution</p>
          <div className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <p
                key={`${question.questionId}-step-${index}`}
                className={index === question.explanation.steps.length - 1 ? 'font-medium text-foreground' : ''}
              >
                {step}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioAlgebraReviewPanel() {
  const [pkg, setPkg] = useState<AlgebraReviewPackage | null>(null);
  const [status, setStatus] = useState<AlgebraReviewStatus | null>(null);
  const [language, setLanguage] = useState<AlgebraReviewLanguage>('en');
  const [examProfile, setExamProfile] = useState<AlgebraReviewExamProfile>('SSC_CORE');
  const [cpId, setCpId] = useState(ALL);
  const [qlId, setQlId] = useState(ALL);
  const [patternId, setPatternId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<AlgebraReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getAlgebraReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getAlgebraReviewPackage(), getAlgebraReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
        setExamProfile(packageResponse.package.defaultExamProfile ?? 'SSC_CORE');
      })
      .catch((error) => {
        showToast.error(
          'Algebra package unavailable',
          error instanceof Error ? error.message : 'Unable to load the Algebra Question Studio package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleQls = useMemo(() => {
    const rows = (pkg?.patterns ?? []).filter((entry) => cpId === ALL || entry.cpId === cpId);
    return Array.from(new Map(rows.map((entry) => [entry.qlId, entry])).values());
  }, [cpId, pkg]);

  const visiblePatterns = useMemo(
    () => (pkg?.patterns ?? []).filter((entry) =>
      (cpId === ALL || entry.cpId === cpId) && (qlId === ALL || entry.qlId === qlId)),
    [cpId, pkg, qlId],
  );

  const request = useMemo(() => ({
    language,
    examProfile,
    cpId: cpId === ALL ? undefined : cpId,
    qlId: qlId === ALL ? undefined : qlId,
    patternId: patternId === ALL ? undefined : patternId,
    difficulty: difficulty === ALL ? undefined : difficulty as AlgebraReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, cpId, difficulty, examProfile, language, patternId, qlId, seed]);

  const handleCpChange = (value: string) => {
    setCpId(value);
    setQlId(ALL);
    setPatternId(ALL);
    setQuestions([]);
  };

  const handleQlChange = (value: string) => {
    setQlId(value);
    setPatternId(ALL);
    setQuestions([]);
  };

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewAlgebraReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success(
        'Algebra preview loaded',
        `${result.questions.length} ${LANGUAGE_LABELS[language]} · ${PROFILE_LABELS[examProfile]} question(s) validated.`,
      );
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Algebra questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createAlgebraReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'Algebra review run created',
        `${result.publicCode} contains ${result.itemCount} ${LANGUAGE_LABELS[result.language]} · ${PROFILE_LABELS[result.examProfile]} question(s).`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create an Algebra review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="h-4 w-4" /> Algebra · Frozen Full Chapter · CP001–CP014
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">ALG-001 + ALG-002</Badge>
            <Badge variant="outline">43 permanent QLs</Badge>
            <Badge variant="outline">109 variants</Badge>
            <Badge variant="outline">EN · हिन्दी · ਪੰਜਾਬੀ</Badge>
            <Badge variant="outline">4 exam profiles</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Review the frozen Algebra learner surfaces through the V3 delivery matrix. Selection may vary by exam profile and seed, but QL identity, frozen source content, canonical solver answer and downstream lifecycle locks remain authoritative.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Canonical problems" value={status.canonicalProblemCount} />
            <Metric label="Permanent QLs" value={status.qlCount} />
            <Metric label="Studio variants" value={status.patternCount} />
            <Metric label="Review items" value={status.generationItemCount} />
          </div>
        )}

        <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4" /> Review-only lifecycle boundary
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Question Studio preview and review-queue persistence are enabled. Question Bank writes, scored tests, mock-test eligibility and public/student publication remain locked.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Algebra package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
            <Field label="Language">
              <Select value={language} onValueChange={(value) => { setLanguage(value as AlgebraReviewLanguage); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en', 'hi', 'pa']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Exam profile">
              <Select value={examProfile} onValueChange={(value) => { setExamProfile(value as AlgebraReviewExamProfile); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedExamProfiles ?? ['SSC_CORE', 'SSC_ADVANCED', 'BANKING', 'PUNJAB_STATE']).map((profile) => (
                    <SelectItem key={profile} value={profile}>{PROFILE_LABELS[profile]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Canonical problem">
              <Select value={cpId} onValueChange={handleCpChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All CPs</SelectItem>
                  {(pkg?.canonicalProblems ?? []).map((cp) => (
                    <SelectItem key={cp.cpId} value={cp.cpId}>{cp.cpId} · {cp.qlCount} QLs</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Permanent QL">
              <Select value={qlId} onValueChange={handleQlChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All QLs</SelectItem>
                  {visibleQls.map((entry) => (
                    <SelectItem key={entry.qlId} value={entry.qlId}>{entry.qlId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Prototype">
              <Select value={patternId} onValueChange={(value) => { setPatternId(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All variants</SelectItem>
                  {visiblePatterns.map((entry) => (
                    <SelectItem key={entry.prototypeId} value={entry.prototypeId}>{entry.prototypeId}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={(value) => { setDifficulty(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All levels</SelectItem>
                  {(pkg?.supportedDifficulties ?? ['Easy', 'Medium', 'Hard']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Count">
              <Input
                type="number"
                min={1}
                max={50}
                value={count}
                onChange={(event) => setCount(Math.min(50, Math.max(1, Number(event.target.value) || 1)))}
              />
            </Field>

            <Field label="Seed (optional)">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="deterministic seed" />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handlePreview} disabled={loading || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
            Preview
          </Button>
          <Button onClick={handleCreateRun} disabled={loading || working !== null}>
            {working === 'run' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create review run
          </Button>
          <Badge variant="outline" className="self-center">Question Bank locked</Badge>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Preview · {questions.length} question(s)</p>
              <p className="text-xs text-muted-foreground">Correct options are highlighted for editorial review only.</p>
            </div>
            {questions.map((question) => <QuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
