import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Loader2, RefreshCw, Sparkles, XCircle } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { EXAMS } from '@/data/exams';
import {
  createGenerationRun,
  getQuestionStudioCapabilities,
  getQuestionStudioDashboard,
  updateGenerationItems,
  type GenerationItemStatus,
  type QuestionStudioItem,
  type QuestionStudioRun,
} from '@/features/question-studio/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const ENGINE_ID = 'language-v1';
const PACKAGE_ID = 'ENG-001';
const RUNTIME_MODE = 'review-only';
const ALL_QLS = 'all-qls';
const ALL_RULES = 'all-rules';

const QLS = [
  ['ENG-001-QL001', 'Four-part error spotting'],
  ['ENG-001-QL002', 'Error spotting with No error'],
  ['ENG-001-QL007', 'Calibrated No-error'],
] as const;

const SVA_RULES = [
  ['GR-SVA-001', 'Basic singular / plural'],
  ['GR-SVA-002', 'Each / every'],
  ['GR-SVA-003', 'One of'],
  ['GR-SVA-004', 'A number of / the number of'],
  ['GR-SVA-005', 'Along with / together with / as well as'],
  ['GR-SVA-006', 'Either-or / neither-nor'],
  ['GR-SVA-007', 'Collective nouns'],
  ['GR-SVA-008', 'More than one'],
  ['GR-SVA-009', 'Many a/an'],
  ['GR-SVA-010', 'Intervening phrase'],
] as const;

const TENSE_RULES = [
  ['GR-TNS-001', 'Finished past time → simple past'],
  ['GR-TNS-002', 'Continuing action from past'],
  ['GR-TNS-003', 'Habit / general action'],
  ['GR-TNS-004', 'Action happening now'],
  ['GR-TNS-005', 'Stative verb'],
  ['GR-TNS-006', 'Did / did not + base form'],
  ['GR-TNS-007', 'Earlier of two past actions'],
  ['GR-TNS-008', 'Past action in progress + interruption'],
  ['GR-TNS-009', 'Single completed past event'],
  ['GR-TNS-010', 'Continuing stative state'],
] as const;

const CPS = [
  {
    id: 'ENG-001-CP001',
    label: 'CP001 · Subject–Verb Agreement',
    subtopic: 'Subject–Verb Agreement',
    version: 'V4',
    ruleLabel: 'SVA',
    rules: SVA_RULES,
  },
  {
    id: 'ENG-001-CP002',
    label: 'CP002 · Tenses and Sequence of Tenses',
    subtopic: 'Tenses and Sequence of Tenses',
    version: 'V1',
    ruleLabel: 'tense',
    rules: TENSE_RULES,
  },
] as const;

type CpId = (typeof CPS)[number]['id'];

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((entry) => String(entry ?? '').trim()).filter(Boolean) : [];
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : -1;
}

function isEnglishRun(run: QuestionStudioRun) {
  return asText(run.requestSnapshot?.engineId) === ENGINE_ID
    && asText(run.requestSnapshot?.packageId) === PACKAGE_ID;
}

export function QuestionStudioEnglishReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const canReview = hasPermission('content.generation.review');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [runs, setRuns] = useState<QuestionStudioRun[]>([]);
  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL');
  const [cpId, setCpId] = useState<CpId>('ENG-001-CP001');
  const [qlId, setQlId] = useState(ALL_QLS);
  const [ruleId, setRuleId] = useState(ALL_RULES);
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');
  const [reviewReason, setReviewReason] = useState('');

  const selectedCp = CPS.find((entry) => entry.id === cpId) ?? CPS[0];

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [capabilities, dashboard] = await Promise.all([
        getQuestionStudioCapabilities(),
        getQuestionStudioDashboard(),
      ]);
      const pkg = capabilities.packages.find(
        (entry) => entry.packageId === PACKAGE_ID && entry.engineId === ENGINE_ID,
      );
      setAvailable(Boolean(pkg?.enabled && pkg.cpIds?.includes(cpId)));
      setRuns(dashboard.runs.filter(isEnglishRun));
    } catch (caught) {
      showToast.error(
        'English review unavailable',
        caught instanceof Error ? caught.message : 'Unable to load ENG-001 review data.',
      );
    } finally {
      setLoading(false);
    }
  }, [cpId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const recentRuns = useMemo(() => runs.slice(0, 8), [runs]);

  const changeCp = (value: string) => {
    setCpId(value as CpId);
    setRuleId(ALL_RULES);
  };

  const generate = async () => {
    if (!available) {
      showToast.error('ENG-001 checkpoint is not registered', `${selectedCp.id} is unavailable in the language-v1 package.`);
      return;
    }
    const selectedExam = EXAMS.find((entry) => entry.code === exam);
    setGenerating(true);
    try {
      const result = await createGenerationRun({
        engineId: ENGINE_ID,
        exam: selectedExam?.name ?? exam,
        subject: 'English',
        topic: 'Error Spotting',
        subtopic: selectedCp.subtopic,
        difficulty,
        count: Math.max(1, Math.min(50, count)),
        packageId: PACKAGE_ID,
        patternId: qlId === ALL_QLS ? undefined : qlId,
        canonicalProblemId: ruleId === ALL_RULES ? selectedCp.id : ruleId,
        language: 'en',
        seed: seed.trim() || undefined,
        runtimeMode: RUNTIME_MODE,
      });
      showToast.success(
        'ENG-001 review batch created',
        `${result.publicCode} produced ${result.itemCount} ${difficulty} ${selectedCp.subtopic} review item(s).`,
      );
      await refresh();
    } catch (caught) {
      showToast.error(
        'ENG-001 generation failed',
        caught instanceof Error ? caught.message : 'Unable to generate English questions.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const decide = async (item: QuestionStudioItem, status: GenerationItemStatus) => {
    if ((status === 'needs_fix' || status === 'rejected') && !reviewReason.trim()) {
      showToast.error('Reason required', 'Describe the grammar, wording, explanation, or difficulty issue first.');
      return;
    }
    setUpdatingItemId(item.id);
    try {
      const result = await updateGenerationItems({
        itemIds: [item.id],
        status,
        reason: reviewReason.trim() || undefined,
      });
      if (status === 'approved') {
        if (result.convertedCount !== 0 || result.reviewOnlyApprovedCount !== 1) {
          throw new Error('ENG-001 approval crossed the review-only Question Bank boundary.');
        }
        showToast.success(
          'Editorial review approved',
          'The item remains in Question Studio only. No Question Bank, test, mock, or public write occurred.',
        );
      } else {
        showToast.success('Review state updated', `Item moved to ${status.replace(/_/g, ' ')}.`);
      }
      setReviewReason('');
      await refresh();
    } catch (caught) {
      showToast.error(
        'ENG-001 review update failed',
        caught instanceof Error ? caught.message : 'Unable to update this review item.',
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  return (
    <Card className="border-info/20">
      <CardHeader className="space-y-3">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-info" /> English · ENG-001 review
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              language-v1 · Error Spotting · {selectedCp.subtopic} · human-approved {selectedCp.version} generator
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-success/30 text-success">Human-approved content</Badge>
            <Badge variant="outline">2 CPs · 3 QLs · 20 grammar rules</Badge>
            <Badge variant="outline">Easy / Medium / Hard</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">Review-only</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-info/20 bg-info/5 p-3 text-xs text-muted-foreground">
          CP001 and CP002 are approved for Question Studio review generation. Approval here records editorial acceptance only. Question Bank storage, tests, mock tests, public publication, inline editing, and automatic learner delivery remain locked. Fix defects in the source generator and generate a fresh batch.
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          <Field label="Exam">
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EXAMS.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Checkpoint" className="xl:col-span-2">
            <Select value={cpId} onValueChange={changeCp}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CPS.map((entry) => <SelectItem key={entry.id} value={entry.id}>{entry.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="QL">
            <Select value={qlId} onValueChange={setQlId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_QLS}>All approved QLs</SelectItem>
                {QLS.map(([id, label]) => <SelectItem key={id} value={id}>{id} · {label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Grammar rule" className="xl:col-span-2">
            <Select value={ruleId} onValueChange={setRuleId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_RULES}>All approved {selectedCp.ruleLabel} rules</SelectItem>
                {selectedCp.rules.map(([id, label]) => <SelectItem key={id} value={id}>{id} · {label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Difficulty">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{['Easy', 'Medium', 'Hard'].map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Question count">
            <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Optional deterministic seed">
            <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Leave blank for the approved checkpoint default seed" />
          </Field>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || generating}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button onClick={() => void generate()} disabled={!available || !canRun || loading || generating}>
              {generating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              Generate English batch
            </Button>
          </div>
        </div>

        <div className="border-t pt-5">
          <div className="mb-3 grid gap-3 md:grid-cols-[1fr_minmax(18rem,32rem)] md:items-end">
            <div>
              <p className="text-sm font-semibold">Recent ENG-001 review runs</p>
              <p className="text-xs text-muted-foreground">CP001 and CP002 share this existing review surface. Approved items cannot enter Question Bank from this package.</p>
            </div>
            <Field label="Reason for Needs fix / Reject">
              <Textarea value={reviewReason} onChange={(event) => setReviewReason(event.target.value)} className="min-h-16" placeholder="Describe the grammar, wording, explanation, ambiguity, or difficulty issue" />
            </Field>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading English review runs…
            </div>
          ) : recentRuns.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No ENG-001 review runs yet. Generate a batch above.
            </div>
          ) : (
            <div className="space-y-4">
              {recentRuns.map((run) => (
                <EnglishRun key={run.id} run={run} canReview={canReview} updatingItemId={updatingItemId} onDecision={decide} />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EnglishRun({ run, canReview, updatingItemId, onDecision }: {
  run: QuestionStudioRun;
  canReview: boolean;
  updatingItemId: string | null;
  onDecision: (item: QuestionStudioItem, status: GenerationItemStatus) => Promise<void>;
}) {
  const selector = asText(run.requestSnapshot?.canonicalProblemId);
  const subtopic = asText(run.requestSnapshot?.subtopic);
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{run.publicCode}</p>
          <p className="text-xs text-muted-foreground">
            {subtopic || 'Error Spotting'} · {asText(run.requestSnapshot?.difficulty) || 'Medium'} · {asText(run.requestSnapshot?.patternId) || 'All QLs'} · {selector || 'All approved rules'}
          </p>
        </div>
        <Badge variant="outline">{run.status.replace(/_/g, ' ')}</Badge>
      </div>
      <div className="space-y-3">
        {run.items.map((item) => (
          <EnglishItem key={item.id} item={item} canReview={canReview} updating={updatingItemId === item.id} onDecision={onDecision} />
        ))}
      </div>
    </div>
  );
}

function EnglishItem({ item, canReview, updating, onDecision }: {
  item: QuestionStudioItem;
  canReview: boolean;
  updating: boolean;
  onDecision: (item: QuestionStudioItem, status: GenerationItemStatus) => Promise<void>;
}) {
  const payload = item.payload ?? {};
  const stem = asText(payload.stem);
  const options = asStringArray(payload.options);
  const correctIndex = asNumber(payload.correctIndex ?? payload.correct);
  const explanation = asText(payload.explanation);
  const correctedSentence = asText(payload.correctedSentence);
  const ruleId = asText(payload.ruleId);
  const qlId = asText(payload.qlId ?? payload.patternId);
  const cpId = asText(payload.cpId);

  return (
    <div className="rounded-lg border bg-muted/10 p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="outline">#{item.itemNumber}</Badge>
        {cpId && <Badge variant="outline">{cpId}</Badge>}
        {qlId && <Badge variant="outline">{qlId}</Badge>}
        {ruleId && <Badge variant="outline">{ruleId}</Badge>}
        <Badge variant="outline">{item.status.replace(/_/g, ' ')}</Badge>
      </div>
      <p className="text-sm font-medium">{stem}</p>
      <div className="mt-3 space-y-1.5 text-sm">
        {options.map((option, index) => (
          <div key={`${item.id}-${index}`} className={cn('rounded border px-3 py-2', index === correctIndex && 'border-success/40 bg-success/5')}>
            <span className="mr-2 font-semibold">{String.fromCharCode(65 + index)}.</span>{option}
          </div>
        ))}
      </div>
      <div className="mt-3 rounded border bg-background p-3 text-xs">
        <p><strong>Answer:</strong> {correctIndex >= 0 ? String.fromCharCode(65 + correctIndex) : '—'}</p>
        <p className="mt-1"><strong>Explanation:</strong> {explanation || '—'}</p>
        {correctedSentence && <p className="mt-1"><strong>Correct sentence:</strong> {correctedSentence}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={!canReview || updating} onClick={() => void onDecision(item, 'approved')}>
          {updating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />} Approve review
        </Button>
        <Button size="sm" variant="outline" disabled={!canReview || updating} onClick={() => void onDecision(item, 'needs_fix')}>
          Needs fix
        </Button>
        <Button size="sm" variant="outline" disabled={!canReview || updating} onClick={() => void onDecision(item, 'rejected')}>
          <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
