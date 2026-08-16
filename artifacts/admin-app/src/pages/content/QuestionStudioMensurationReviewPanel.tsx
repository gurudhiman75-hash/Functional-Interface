import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Eye, Loader2, ShieldAlert, Shapes } from 'lucide-react';

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
  createMensurationReviewRun,
  getMensurationReviewPackage,
  getMensurationReviewStatus,
  previewMensurationReview,
  type MensurationReviewDifficulty,
  type MensurationReviewExamProfile,
  type MensurationReviewLanguage,
  type MensurationReviewPackage,
  type MensurationReviewQuestion,
  type MensurationReviewStatus,
} from '@/features/question-studio/mensuration-review-api';

const ALL = 'all';

const PROFILE_LABELS: Record<MensurationReviewExamProfile, string> = {
  SSC_CORE: 'SSC · Core',
  SSC_ADVANCED: 'SSC · Advanced',
  BANKING: 'Banking',
  PUNJAB_STATE: 'Punjab State',
};

const LANGUAGE_LABELS: Record<MensurationReviewLanguage, string> = {
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

function QuestionCard({ question }: { question: MensurationReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.cpId}</Badge>
          <Badge variant="secondary">{question.patternId}</Badge>
          <Badge variant="outline">{question.patternKind}</Badge>
          <Badge variant="outline">{question.difficultyBand}</Badge>
          <Badge variant="outline">{PROFILE_LABELS[question.realism.examProfile]}</Badge>
          <Badge variant="outline">{question.realism.frequencyBand.replace(/_/g, ' ')}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]} · {question.locale}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Source validated
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
        <details className="rounded-lg border p-3" open>
          <summary className="cursor-pointer font-semibold">Teaching solution</summary>
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
          {question.explanation.shortcut && (
            <p className="mt-3 text-xs text-muted-foreground"><strong>Shortcut:</strong> {question.explanation.shortcut}</p>
          )}
          {question.explanation.traps.length > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              <strong>Common traps:</strong>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {question.explanation.traps.map((trap, index) => <li key={`${question.questionId}-trap-${index}`}>{trap}</li>)}
              </ul>
            </div>
          )}
        </details>
        {question.localization && question.localization.residualInstructionalLatin.length > 0 && (
          <p className="text-xs text-amber-700">
            Localization diagnostic: {question.localization.residualInstructionalLatin.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function QuestionStudioMensurationReviewPanel() {
  const [pkg, setPkg] = useState<MensurationReviewPackage | null>(null);
  const [status, setStatus] = useState<MensurationReviewStatus | null>(null);
  const [language, setLanguage] = useState<MensurationReviewLanguage>('en');
  const [examProfile, setExamProfile] = useState<MensurationReviewExamProfile>('SSC_CORE');
  const [cpId, setCpId] = useState(ALL);
  const [patternId, setPatternId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<MensurationReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getMensurationReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getMensurationReviewPackage(), getMensurationReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
        setExamProfile(packageResponse.package.defaultExamProfile ?? 'SSC_CORE');
      })
      .catch((error) => {
        showToast.error(
          'Mensuration package unavailable',
          error instanceof Error ? error.message : 'Unable to load the full Mensuration Question Studio package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visiblePatterns = useMemo(
    () => (pkg?.patterns ?? []).filter((entry) => cpId === ALL || entry.cpId === cpId),
    [cpId, pkg],
  );

  const request = useMemo(() => ({
    language,
    examProfile,
    cpId: cpId === ALL ? undefined : cpId,
    patternId: patternId === ALL ? undefined : patternId,
    difficulty: difficulty === ALL ? undefined : difficulty as MensurationReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, cpId, difficulty, examProfile, language, patternId, seed]);

  const handleCpChange = (value: string) => {
    setCpId(value);
    setPatternId(ALL);
  };

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewMensurationReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Mensuration preview loaded', `${result.questions.length} ${LANGUAGE_LABELS[language]} · ${PROFILE_LABELS[examProfile]} question(s) validated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Mensuration questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createMensurationReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success('Mensuration run created', `${result.publicCode} contains ${result.itemCount} ${LANGUAGE_LABELS[result.language]} · ${PROFILE_LABELS[result.examProfile]} question(s).`);
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create a Mensuration Question Studio run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shapes className="h-4 w-4" /> Mensuration · Full Chapter · CP001–CP013
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">MEN-001 + MEN-002</Badge>
            <Badge variant="outline">13 canonical problems</Badge>
            <Badge variant="outline">4 exam profiles</Badge>
            <Badge variant="outline">EN · हिन्दी · ਪੰਜਾਬੀ</Badge>
            <Badge variant="outline" className="gap-1"><ShieldAlert className="h-3 w-3" /> Realism V2</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate across the complete Mensuration chapter with exam-profile weighting, calibrated difficulty, short-batch anti-repetition and English/Hindi/Punjabi presentation. All three languages use the same canonical mathematical state, answer position and misconception mapping.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Canonical problems" value={status.canonicalProblemCount} />
            <Metric label="Studio patterns" value={status.patternCount} />
            <Metric label="Permanent QLs" value={status.qlCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
          </div>
        )}

        <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium"><ShieldAlert className="h-4 w-4" /> Localization and realism boundary</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Language changes presentation only; exam profiles change selection frequency only. Frozen identities, numerical state, correct answer, distractor misconception mapping and downstream Question Bank/test/publication lifecycle remain unchanged.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading full Mensuration package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            <Field label="Language">
              <Select value={language} onValueChange={(value) => { setLanguage(value as MensurationReviewLanguage); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en', 'hi', 'pa']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Exam profile">
              <Select value={examProfile} onValueChange={(value) => setExamProfile(value as MensurationReviewExamProfile)}>
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
                  {(pkg?.canonicalProblems ?? []).map((entry) => (
                    <SelectItem key={entry.cpId} value={entry.cpId}>{entry.cpId} · {entry.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Pattern">
              <Select value={patternId} onValueChange={setPatternId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All patterns</SelectItem>
                  {visiblePatterns.map((entry) => (
                    <SelectItem key={entry.patternId} value={entry.patternId}>
                      {entry.patternId} · {entry.title}{entry.realism ? ` · ${entry.realism.frequencyBand.replace(/_/g, ' ')}` : ''}
                    </SelectItem>
                  ))}
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
            <Field label="Optional seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="mensuration-full-01" />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!pkg || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview
          </Button>
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || working !== null}>
            {working === 'run' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Question Studio run
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">Learner preview · {LANGUAGE_LABELS[language]}</h3>
              <Badge variant="outline">{questions.length} question(s)</Badge>
            </div>
            {questions.map((question) => <QuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
