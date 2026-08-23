import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BrainCircuit, CheckCircle2, Eye, Loader2, ShieldAlert } from 'lucide-react';

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
  createDsfReviewRun,
  getDsfReviewPackage,
  getDsfReviewStatus,
  previewDsfReview,
  type DsfReviewAnswerProfile,
  type DsfReviewDifficulty,
  type DsfReviewDomain,
  type DsfReviewInput,
  type DsfReviewPackage,
  type DsfReviewQuestion,
  type DsfReviewSemanticClass,
  type DsfReviewStatus,
} from '@/features/question-studio/data-sufficiency-review-api';

const ALL = 'all';

const CLASS_LABELS: Record<DsfReviewSemanticClass, string> = {
  STATEMENT_I_ONLY: 'Statement I only',
  STATEMENT_II_ONLY: 'Statement II only',
  EACH_STATEMENT_ALONE: 'Each statement alone',
  BOTH_TOGETHER_ONLY: 'Both together only',
  INSUFFICIENT_EVEN_TOGETHER: 'Insufficient even together',
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

function QuestionCard({ question }: { question: DsfReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.domainLabel}</Badge>
          <Badge variant="secondary">{question.qlId}</Badge>
          <Badge variant="outline">{question.solveModeId}</Badge>
          <Badge variant="outline">{question.difficulty}</Badge>
          <Badge variant="outline">{CLASS_LABELS[question.canonicalAnswer]}</Badge>
          <Badge variant="outline">{question.answerProfile}</Badge>
          <Badge variant="outline">{question.examFamily}</Badge>
          {question.validation.valid && question.validation.semanticTruthPreserved && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Frozen semantics preserved
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {question.sourceChapterId} · {question.targetKind} · seed {question.seed} · {question.profileEvidenceLevel}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="space-y-2 rounded-lg border p-3">
          <p><strong>Statement I:</strong> {question.statements[0].text}</p>
          <p><strong>Statement II:</strong> {question.statements[1].text}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {question.options.map((option) => (
            <div
              key={`${question.questionId}-${option.key}`}
              className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}
            >
              <p className="font-medium">{option.key}. {option.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.options[question.correctIndex]?.value}
        </div>
        {question.profileOmittedSemanticClasses.length > 0 && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            This answer profile does not represent: {question.profileOmittedSemanticClasses.map((entry) => CLASS_LABELS[entry]).join(', ')}.
            The generator excludes those semantic classes instead of changing the underlying DS truth.
          </div>
        )}
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

export function QuestionStudioDataSufficiencyReviewPanel() {
  const [pkg, setPkg] = useState<DsfReviewPackage | null>(null);
  const [status, setStatus] = useState<DsfReviewStatus | null>(null);
  const [answerProfile, setAnswerProfile] = useState<DsfReviewAnswerProfile>('GENERIC_DS_STANDARD_5_EN');
  const [domain, setDomain] = useState(ALL);
  const [solveMode, setSolveMode] = useState(ALL);
  const [semanticClass, setSemanticClass] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<DsfReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getDsfReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getDsfReviewPackage(), getDsfReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Data Sufficiency package unavailable',
          error instanceof Error ? error.message : 'Unable to load the Data Sufficiency Question Studio package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const activeProfile = useMemo(
    () => pkg?.answerProfiles.find((entry) => entry.id === answerProfile) ?? null,
    [answerProfile, pkg],
  );

  const visibleSemanticClasses = useMemo(
    () => activeProfile?.representedSemanticClasses ?? pkg?.supportedSemanticClasses ?? [],
    [activeProfile, pkg],
  );

  const visibleSolveModes = useMemo(() => {
    if (!pkg) return [] as string[];
    if (domain === ALL) return pkg.domains.flatMap((entry) => entry.solveModes);
    return pkg.domains.find((entry) => entry.id === domain)?.solveModes ?? [];
  }, [domain, pkg]);

  const request = useMemo<DsfReviewInput>(() => ({
    language: 'en',
    answerProfile,
    domain: domain === ALL ? undefined : domain as DsfReviewDomain,
    solveMode: solveMode === ALL ? undefined : solveMode,
    semanticClass: semanticClass === ALL ? undefined : semanticClass as DsfReviewSemanticClass,
    difficulty: difficulty === ALL ? undefined : difficulty as DsfReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [answerProfile, count, difficulty, domain, seed, semanticClass, solveMode]);

  const handleProfileChange = (value: string) => {
    const next = value as DsfReviewAnswerProfile;
    const nextProfile = pkg?.answerProfiles.find((entry) => entry.id === next);
    setAnswerProfile(next);
    if (
      semanticClass !== ALL
      && nextProfile
      && !nextProfile.representedSemanticClasses.includes(semanticClass as DsfReviewSemanticClass)
    ) {
      setSemanticClass(ALL);
    }
    setQuestions([]);
  };

  const handleDomainChange = (value: string) => {
    setDomain(value);
    setSolveMode(ALL);
    setQuestions([]);
  };

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewDsfReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Data Sufficiency preview loaded', `${result.questions.length} frozen-source question(s) rendered with ${answerProfile}.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Data Sufficiency questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createDsfReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'Data Sufficiency review run created',
        `${result.publicCode} contains ${result.itemCount} question(s). Approved items can enter Question Bank; tests and publication stay locked.`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create a Data Sufficiency review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BrainCircuit className="h-4 w-4" /> Data Sufficiency · CP-001 frozen · CP-002 Studio · CP-003 profiles · CP-004 Question Bank
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">DSF-QL-001</Badge>
            <Badge variant="outline">4 source domains</Badge>
            <Badge variant="outline">8 solve modes</Badge>
            <Badge variant="outline">Banking + SSC profiles</Badge>
            <Badge variant="outline">English</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          CP-001 still owns frozen semantic truth, CP-002 owns Question Studio generation, CP-003 owns reviewed answer-profile rendering, and CP-004 only enables canonical Question Bank acceptance after manual item approval. Option position is never treated as semantic truth.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Source domains" value={status.domainCount} />
            <Metric label="Solve modes" value={status.solveModeCount} />
            <Metric label="CP-004 items" value={status.cp004GenerationItemCount} />
            <Metric label="Approved items" value={status.approvedItemCount} />
            <Metric label="In Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4" /> Question Bank acceptance boundary
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            New CP-004 review items are marked ready for storage and enter the canonical Question Bank only after manual Question Studio approval. They remain explicitly ineligible for scored tests, mock tests and public/student publication. Older pre-CP-004 review items keep their original review-only payload. SSC four-option eligibility rules remain unchanged, and Punjab-specific rendering remains disabled pending stronger official evidence.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Data Sufficiency package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            <Field label="Answer profile">
              <Select value={answerProfile} onValueChange={handleProfileChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.answerProfiles ?? []).map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>{entry.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Source domain">
              <Select value={domain} onValueChange={handleDomainChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All domains</SelectItem>
                  {(pkg?.domains ?? []).map((entry) => (
                    <SelectItem key={entry.id} value={entry.id}>{entry.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Solve mode">
              <Select value={solveMode} onValueChange={(value) => { setSolveMode(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All solve modes</SelectItem>
                  {visibleSolveModes.map((entry) => (
                    <SelectItem key={entry} value={entry}>{entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Sufficiency class">
              <Select value={semanticClass} onValueChange={(value) => { setSemanticClass(value); setQuestions([]); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All representable classes</SelectItem>
                  {visibleSemanticClasses.map((entry) => (
                    <SelectItem key={entry} value={entry}>{CLASS_LABELS[entry]}</SelectItem>
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

        {activeProfile && (
          <div className="rounded-lg border bg-background/60 p-3 text-xs leading-5 text-muted-foreground">
            <strong className="text-foreground">{activeProfile.label}</strong> · {activeProfile.optionCount} options · {activeProfile.evidenceLevel}.
            {' '}{activeProfile.evidenceNote}
            {activeProfile.omittedSemanticClasses.length > 0 && (
              <> Omitted: {activeProfile.omittedSemanticClasses.map((entry) => CLASS_LABELS[entry]).join(', ')}.</>
            )}
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
          <Badge variant="outline">Question Bank after approval</Badge>
          <Badge variant="secondary">Scored tests locked</Badge>
          <Badge variant="secondary">Mock tests locked</Badge>
          <Badge variant="secondary">Publication locked</Badge>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Preview · {questions.length} question(s)</p>
              <p className="text-xs text-muted-foreground">Preview is read-only; Question Bank conversion happens only after review-run approval</p>
            </div>
            {questions.map((question) => <QuestionCard key={question.questionId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
