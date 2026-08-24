import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { BrainCircuit, CheckCircle2, Eye, Languages, Loader2, ShieldCheck } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  createDsfReviewRun,
  getDsfReviewPackage,
  getDsfReviewStatus,
  previewDsfReview,
  type DsfReviewAnswerProfile,
  type DsfReviewDifficulty,
  type DsfReviewDomain,
  type DsfReviewInput,
  type DsfReviewLanguage,
  type DsfReviewPackage,
  type DsfReviewQuestion,
  type DsfReviewSemanticClass,
  type DsfReviewStatus,
} from '@/features/question-studio/data-sufficiency-review-api';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';

const ALL = 'all';
const CLASS_LABELS: Record<DsfReviewSemanticClass, string> = {
  STATEMENT_I_ONLY: 'Statement I only',
  STATEMENT_II_ONLY: 'Statement II only',
  EACH_STATEMENT_ALONE: 'Each statement alone',
  BOTH_TOGETHER_ONLY: 'Both together only',
  INSUFFICIENT_EVEN_TOGETHER: 'Insufficient even together',
};
const LANGUAGE_LABELS: Record<DsfReviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function statementLabels(language: DsfReviewLanguage) {
  if (language === 'hi') return ['कथन I', 'कथन II'] as const;
  if (language === 'pa') return ['ਕਥਨ I', 'ਕਥਨ II'] as const;
  return ['Statement I', 'Statement II'] as const;
}

function QuestionCard({ question }: { question: DsfReviewQuestion }) {
  const [statementI, statementII] = statementLabels(question.language);
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
          <Badge variant="outline" className="gap-1"><Languages className="h-3 w-3" />{LANGUAGE_LABELS[question.language]} · {question.locale}</Badge>
          {question.validation.valid && question.validation.semanticTruthPreserved && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10"><CheckCircle2 className="h-3 w-3" /> Frozen semantics preserved</Badge>
          )}
          {question.localization?.semanticParity === 'EXECUTABLE_PROVED' && (
            <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/10"><CheckCircle2 className="h-3 w-3" /> Localization approved</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{question.sourceChapterId} · {question.targetKind} · seed {question.seed} · {question.profileEvidenceLevel}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="space-y-2 rounded-lg border p-3">
          <p><strong>{statementI}:</strong> {question.statements[0].text}</p>
          <p><strong>{statementII}:</strong> {question.statements[1].text}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {question.options.map((option) => (
            <div key={`${question.questionId}-${option.key}`} className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}>
              <p className="font-medium">{option.key}. {option.value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-success/25 bg-success/5 p-3"><strong>Answer:</strong> {question.options[question.correctIndex]?.value}</div>
        {question.profileOmittedSemanticClasses.length > 0 && (
          <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-muted-foreground">
            This profile cannot represent {question.profileOmittedSemanticClasses.map((value) => CLASS_LABELS[value]).join(', ')}. Those classes are excluded rather than remapped.
          </div>
        )}
        {question.localization && (
          <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs leading-5 text-muted-foreground">
            <strong>CP-009 localized production release:</strong> the CP-008 semantic-parity pack is product-owner approved. This localized item follows the same manual generation approval, explicit Question Bank publication, scored-test and mock-test QA gates as English. Automatic student publication remains off.
          </div>
        )}
        <div className="rounded-lg border p-3">
          <p className="font-semibold">Solution</p>
          <div className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => <p key={`${question.questionId}-step-${index}`}>{step}</p>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioDataSufficiencyReviewPanel() {
  const [pkg, setPkg] = useState<DsfReviewPackage | null>(null);
  const [status, setStatus] = useState<DsfReviewStatus | null>(null);
  const [language, setLanguage] = useState<DsfReviewLanguage>('en');
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
    void Promise.all([getDsfReviewPackage(), getDsfReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => showToast.error('Data Sufficiency package unavailable', error instanceof Error ? error.message : 'Unable to load package.'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const activeProfile = useMemo(() => pkg?.answerProfiles.find((entry) => entry.id === answerProfile) ?? null, [answerProfile, pkg]);
  const visibleClasses = useMemo(() => activeProfile?.representedSemanticClasses ?? pkg?.supportedSemanticClasses ?? [], [activeProfile, pkg]);
  const visibleModes = useMemo(() => {
    if (!pkg) return [] as string[];
    if (domain === ALL) return pkg.domains.flatMap((entry) => entry.solveModes);
    return pkg.domains.find((entry) => entry.id === domain)?.solveModes ?? [];
  }, [domain, pkg]);
  const activeLanguageLifecycle = pkg?.perLanguageLifecycle[language];

  const request = useMemo<DsfReviewInput>(() => ({
    language,
    answerProfile,
    domain: domain === ALL ? undefined : domain as DsfReviewDomain,
    solveMode: solveMode === ALL ? undefined : solveMode,
    semanticClass: semanticClass === ALL ? undefined : semanticClass as DsfReviewSemanticClass,
    difficulty: difficulty === ALL ? undefined : difficulty as DsfReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [answerProfile, count, difficulty, domain, language, seed, semanticClass, solveMode]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewDsfReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Preview loaded', `${result.questions.length} ${LANGUAGE_LABELS[language]} Data Sufficiency question(s) rendered.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview questions.');
    } finally { setWorking(null); }
  };

  const handleRun = async () => {
    setWorking('run');
    try {
      const result = await createDsfReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success('Review run created', `${result.publicCode}: ${LANGUAGE_LABELS[language]} items require manual approval and explicit Question Bank publication, then are eligible for scored tests and mocks through canonical QA/release. Automatic student publication remains off.`);
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create review run.');
    } finally { setWorking(null); }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="h-4 w-4" /> Data Sufficiency · CP-010 multilingual production freeze</CardTitle>
          <div className="flex flex-wrap gap-2"><Badge variant="outline">DSF-QL-001</Badge><Badge variant="outline">4 domains</Badge><Badge variant="outline">8 solve modes</Badge><Badge variant="outline">Banking + SSC</Badge><Badge variant="outline">English + Hindi + Punjabi production</Badge><Badge variant="outline">English + Hindi + Punjabi frozen production</Badge><Badge variant="outline">CP-009 approved</Badge><Badge variant="outline">CP-010 frozen</Badge></div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          CP-001 owns frozen semantic truth, CP-003 owns approved answer-profile rendering, CP-004 owns Question Bank acceptance, CP-005 enables manual scored-test release, CP-006 enables mock-test eligibility, CP-008 owns executable Hindi/Punjabi localization parity, and CP-009 records product-owner language approval. The CP-009 multilingual production release is now pinned by CP-010 as the final current-scope multilingual production freeze. Canonical semantics, correct option position and profile order cannot change.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-10">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Solve modes" value={status.solveModeCount} />
            <Metric label="CP-006 items" value={status.cp006GenerationItemCount} />
            <Metric label="CP-008 items" value={status.cp008GenerationItemCount} />
            <Metric label="CP-009 items" value={status.cp009GenerationItemCount} />
            <Metric label="CP-010 items" value={status.cp010GenerationItemCount} />
            <Metric label="Hindi released" value={status.hindiReleaseItemCount} />
            <Metric label="Punjabi released" value={status.punjabiReleaseItemCount} />
            <Metric label="Test eligible" value={status.testEligible ? 'Yes' : 'No'} />
            <Metric label="Mock eligible" value={status.mockTestEligible ? 'Yes' : 'No'} />
          </div>
        )}

        <div className="rounded-lg border border-primary/20 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4" /> CP-010 multilingual production freeze · canonical production gates</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            English, Hindi and Punjabi are frozen in the controlled production lifecycle: manual Question Studio approval, explicit Question Bank publication, canonical scored-test validation, and test-series QA/release before mock delivery. Chapter status = CLOSED_CURRENT_APPROVED_SCOPE. Automatic student publication remains OFF. Historical CP-004/CP-005/CP-008 payloads are not retroactively upgraded. Punjab-specific answer-profile rendering remains disabled.
          </p>
        </div>

        {activeLanguageLifecycle && language !== 'en' && (
          <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-xs leading-5 text-muted-foreground">
            <strong>{LANGUAGE_LABELS[language]} localization is product-owner approved.</strong> Question Bank writable = Yes, test eligible = Yes, mock eligible = Yes, public publication = Yes through the canonical manual gates. Automatic student publication = No.
          </div>
        )}

        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading Data Sufficiency package…</div> : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-9">
            <Field label="Language"><Select value={language} onValueChange={(value) => { setLanguage(value as DsfReviewLanguage); setQuestions([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(pkg?.supportedLanguages ?? ['en', 'hi', 'pa']).map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Answer profile"><Select value={answerProfile} onValueChange={(value) => { const next = value as DsfReviewAnswerProfile; setAnswerProfile(next); const profile = pkg?.answerProfiles.find((entry) => entry.id === next); if (semanticClass !== ALL && profile && !profile.representedSemanticClasses.includes(semanticClass as DsfReviewSemanticClass)) setSemanticClass(ALL); setQuestions([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(pkg?.answerProfiles ?? []).map((entry) => <SelectItem key={entry.id} value={entry.id}>{entry.label}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Source domain"><Select value={domain} onValueChange={(value) => { setDomain(value); setSolveMode(ALL); setQuestions([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All domains</SelectItem>{(pkg?.domains ?? []).map((entry) => <SelectItem key={entry.id} value={entry.id}>{entry.label}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Solve mode"><Select value={solveMode} onValueChange={(value) => { setSolveMode(value); setQuestions([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All solve modes</SelectItem>{visibleModes.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Sufficiency class"><Select value={semanticClass} onValueChange={(value) => { setSemanticClass(value); setQuestions([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All representable classes</SelectItem>{visibleClasses.map((entry) => <SelectItem key={entry} value={entry}>{CLASS_LABELS[entry]}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Difficulty"><Select value={difficulty} onValueChange={(value) => { setDifficulty(value); setQuestions([]); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={ALL}>All levels</SelectItem>{(pkg?.supportedDifficulties ?? ['Easy', 'Medium', 'Hard']).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent></Select></Field>
            <Field label="Count"><Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Math.min(50, Math.max(1, Number(event.target.value) || 1)))} /></Field>
            <Field label="Seed"><Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="deterministic seed" /></Field>
          </div>
        )}

        {activeProfile && <div className="rounded-lg border bg-background/60 p-3 text-xs leading-5 text-muted-foreground"><strong>{activeProfile.label}</strong> · {activeProfile.optionCount} options · {activeProfile.evidenceLevel}. {activeProfile.evidenceNote}</div>}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePreview} disabled={working !== null}><Eye className="mr-2 h-4 w-4" />{working === 'preview' ? 'Loading…' : 'Preview'}</Button>
          <Button onClick={handleRun} disabled={working !== null}>{working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}Create review run</Button>
        </div>

        {questions.length > 0 && <div className="space-y-4">{questions.map((question) => <QuestionCard key={question.questionId} question={question} />)}</div>}
      </CardContent>
    </Card>
  );
}
