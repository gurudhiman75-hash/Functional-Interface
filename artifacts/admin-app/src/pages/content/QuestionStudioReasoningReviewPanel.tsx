import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Eye, Loader2, Network, RefreshCcw, Upload } from 'lucide-react';

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
  createReasoningReviewRun,
  getReasoningImportPlan,
  getReasoningProductionStatus,
  getReasoningReviewPackages,
  importAllReasoningQuestions,
  previewReasoningReview,
  type ReasoningImportPlan,
  type ReasoningProductionStatus,
  type ReasoningReviewDifficulty,
  type ReasoningReviewLanguage,
  type ReasoningReviewPackage,
  type ReasoningReviewQuestion,
} from '@/features/question-studio/reasoning-review-api';
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';

const ALL = 'all';
const LANGUAGE_LABELS: Record<ReasoningReviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function QuestionCard({ question }: { question: ReasoningReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Frozen authority validated
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{question.canonicalItemId}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {question.sharedPrompt && (
          <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3">{question.sharedPrompt}</div>
        )}
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {question.optionDetails.map((option) => (
            <div
              key={`${question.questionId}-${option.label}`}
              className={`rounded-lg border p-3 ${option.isCorrect ? 'border-success/40 bg-success/5' : ''}`}
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
          <summary className="cursor-pointer font-semibold">Full explanation and relation proof</summary>
          <ol className="mt-3 space-y-2 leading-6 text-muted-foreground">
            {question.explanation.steps.map((step, index) => (
              <li key={`${question.questionId}-step-${index}`}>{index + 1}. {step}</li>
            ))}
          </ol>
          <p className="mt-3"><strong>Conclusion:</strong> {question.explanation.conclusion}</p>
          <p className="mt-2"><strong>Shortcut:</strong> {question.explanation.shortcut}</p>
          <p className="mt-2"><strong>Common trap:</strong> {question.explanation.commonTrap}</p>
          <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-muted/30 p-3 text-xs">
            {JSON.stringify({
              familyTree: question.explanation.familyTree,
              diagramProof: question.explanation.diagramProof,
              relationGraph: question.reasoningGraph,
            }, null, 2)}
          </pre>
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioReasoningReviewPanel() {
  const [packages, setPackages] = useState<ReasoningReviewPackage[]>([]);
  const [status, setStatus] = useState<ReasoningProductionStatus | null>(null);
  const [importPlan, setImportPlan] = useState<ReasoningImportPlan | null>(null);
  const [packageId, setPackageId] = useState('');
  const [language, setLanguage] = useState<ReasoningReviewLanguage>('en');
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<ReasoningReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | 'plan' | 'all' | null>(null);

  const refreshOperationalState = useCallback(async () => {
    const [nextStatus, nextPlan] = await Promise.all([
      getReasoningProductionStatus(),
      getReasoningImportPlan(),
    ]);
    setStatus(nextStatus);
    setImportPlan(nextPlan);
    return nextPlan;
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([
      getReasoningReviewPackages(),
      getReasoningProductionStatus(),
      getReasoningImportPlan(),
    ])
      .then(([packageResponse, statusResponse, planResponse]) => {
        if (!active) return;
        setPackages(packageResponse.packages);
        setPackageId(packageResponse.packages[0]?.packageId ?? '');
        setStatus(statusResponse);
        setImportPlan(planResponse);
      })
      .catch((error) => showToast.error('BLR package unavailable', error instanceof Error ? error.message : 'Unable to load BLR production package.'))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const activePackage = useMemo(
    () => packages.find((entry) => entry.packageId === packageId),
    [packageId, packages],
  );

  const request = useMemo(() => ({
    packageId,
    language,
    qlId: qlId === ALL ? undefined : qlId,
    difficulty: difficulty === ALL ? undefined : difficulty as ReasoningReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [count, difficulty, language, packageId, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewReasoningReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Preview loaded', `${result.questions.length} frozen question(s) validated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview BLR questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createReasoningReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshOperationalState();
      showToast.success('Review run created', `${result.publicCode} contains ${result.itemCount} BLR question(s).`);
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create BLR run.');
    } finally {
      setWorking(null);
    }
  };

  const handleRefreshPlan = async () => {
    setWorking('plan');
    try {
      const plan = await refreshOperationalState();
      const message = plan.driftDetected
        ? `Synchronization is blocked: ${plan.duplicateQuestionLanguageIds.length} duplicate and ${plan.unexpectedQuestionLanguageIds.length} unexpected ID(s).`
        : `${plan.existingCount} present; ${plan.missingCount} of ${plan.totalFrozenRecords} still missing.`;
      if (plan.driftDetected) showToast.error('BLR drift detected', message);
      else showToast.success('Synchronization plan refreshed', message);
    } catch (error) {
      showToast.error('Preflight failed', error instanceof Error ? error.message : 'Unable to calculate the BLR synchronization plan.');
    } finally {
      setWorking(null);
    }
  };

  const handleImportAll = async () => {
    setWorking('all');
    try {
      const plan = await getReasoningImportPlan();
      setImportPlan(plan);

      if (plan.driftDetected) {
        showToast.error(
          'Synchronization blocked',
          `Resolve ${plan.duplicateQuestionLanguageIds.length} duplicate and ${plan.unexpectedQuestionLanguageIds.length} unexpected question-language ID(s) first.`,
        );
        return;
      }
      if (plan.alreadyImported) {
        showToast.success('BLR corpus already synchronized', 'All 504 frozen multilingual records are already present.');
        return;
      }

      const confirmed = window.confirm(
        `Synchronize ${plan.missingCount} missing BLR-CP-007 record(s)?\n\n` +
        'They will be inserted as unreviewed Question Studio items. Nothing will be automatically approved or published.',
      );
      if (!confirmed) return;

      const result = await importAllReasoningQuestions(plan.requiredConfirmation);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshOperationalState();
      const message = result.status === 'already_imported'
        ? 'All 504 frozen multilingual records are already present.'
        : `${result.itemCount} missing record(s) were added to ${result.publicCode}.`;
      showToast.success('BLR corpus synchronized', message);
    } catch (error) {
      showToast.error('Corpus import failed', error instanceof Error ? error.message : 'Unable to import BLR corpus.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-info/25 bg-info/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Network className="h-4 w-4 text-info" /> Blood Relations · BLR-CP-007
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10"><Database className="h-3 w-3" /> Production review enabled</Badge>
            <Badge variant="outline">504 frozen multilingual records</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Preview or persist the approved English, Hindi and Punjabi corpus. Persisted items enter the normal Question Studio review queue; approval converts them through the existing audited Question Bank workflow.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Frozen corpus" value={status.totalFrozenRecords} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Approved items" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
            <Metric label="Missing frozen IDs" value={importPlan?.missingCount ?? '—'} />
          </div>
        )}

        {importPlan && (
          <div className={`rounded-lg border p-3 text-sm ${importPlan.driftDetected ? 'border-destructive/30 bg-destructive/5' : 'border-success/25 bg-success/5'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-medium">
                {importPlan.driftDetected
                  ? <AlertTriangle className="h-4 w-4 text-destructive" />
                  : <CheckCircle2 className="h-4 w-4 text-success" />}
                Synchronization preflight
              </div>
              <Badge variant="outline">{importPlan.existingCount} present · {importPlan.missingCount} missing</Badge>
            </div>
            {importPlan.driftDetected ? (
              <p className="mt-2 text-xs leading-5 text-destructive">
                Write blocked: {importPlan.duplicateQuestionLanguageIds.length} duplicate ID(s) and {importPlan.unexpectedQuestionLanguageIds.length} unexpected ID(s) must be resolved first.
              </p>
            ) : (
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Frozen-ID alignment is clean. Bulk synchronization will add only the missing records and will keep every inserted item unreviewed.
              </p>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading BLR production package…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Package" className="xl:col-span-2">
              <Select value={packageId} onValueChange={setPackageId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{packages.map((entry) => <SelectItem key={entry.packageId} value={entry.packageId}>{entry.label}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={(value) => setLanguage(value as ReasoningReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(activePackage?.supportedLanguages ?? ['en']).map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="QL">
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={ALL}>All QLs</SelectItem>{(activePackage?.qlIds ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={ALL}>All difficulties</SelectItem>{(activePackage?.supportedDifficulties ?? []).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Count"><Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} /></Field>
          </div>
        )}

        <Field label="Optional deterministic seed"><Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="blr-production-01" /></Field>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!activePackage || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview
          </Button>
          <Button onClick={() => void handleCreateRun()} disabled={!activePackage || working !== null}>
            {working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Create review run
          </Button>
          <Button variant="outline" onClick={() => void handleRefreshPlan()} disabled={working !== null}>
            {working === 'plan' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />} Refresh sync plan
          </Button>
          <Button
            variant="secondary"
            onClick={() => void handleImportAll()}
            disabled={working !== null || importPlan?.driftDetected === true || importPlan?.alreadyImported === true}
          >
            {working === 'all' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Synchronize all 504{importPlan ? ` (${importPlan.missingCount} missing)` : ''}
          </Button>
        </div>

        {questions.length > 0 && <div className="space-y-4 border-t pt-5">{questions.map((question) => <QuestionCard key={question.questionId} question={question} />)}</div>}
      </CardContent>
    </Card>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return <div className={`space-y-2 ${className ?? ''}`}><Label>{label}</Label>{children}</div>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div>;
}
