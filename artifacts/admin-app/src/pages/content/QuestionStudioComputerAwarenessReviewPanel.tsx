import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';

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
import {
  analyzeItemQuality,
  itemCorrectIndex,
  itemExplanation,
  itemOptionValues,
  itemStem,
} from '@/features/question-studio/quality';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const COM001_PACKAGE_ID = 'COM-001';
const COM001_ENGINE_ID = 'knowledge-v1';
const COM001_RUNTIME_MODE = 'review-only';
const MIXED_QL = 'mixed';
const MIXED_DIFFICULTY = 'Mixed';

const QLS = [
  ['COM-001-QL-001', 'Memory Volatility & Data Retention'],
  ['COM-001-QL-002', 'Memory & Storage Layer Classification'],
  ['COM-001-QL-003', 'Memory & Storage Function Mapping'],
  ['COM-001-QL-004', 'Memory & Storage Subtype Discrimination'],
  ['COM-001-QL-005', 'Storage Medium & Technology Classification'],
  ['COM-001-QL-006', 'Broad Memory Hierarchy Ordering'],
  ['COM-001-QL-007', 'Backup Device Constraint Selection'],
  ['COM-001-QL-008', 'Memory & Storage Multi-Statement Evaluation'],
  ['COM-001-QL-009', 'Computer Data Capacity Units'],
] as const;

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

const QL_DIFFICULTIES: Record<string, readonly string[]> = {
  'COM-001-QL-001': ['Easy', 'Medium'],
  'COM-001-QL-002': ['Easy', 'Medium'],
  'COM-001-QL-003': ['Easy', 'Medium'],
  'COM-001-QL-004': ['Easy', 'Medium'],
  'COM-001-QL-005': ['Easy', 'Medium'],
  'COM-001-QL-006': ['Medium'],
  'COM-001-QL-007': ['Hard'],
  'COM-001-QL-008': ['Hard'],
  'COM-001-QL-009': ['Easy', 'Medium'],
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function readableToken(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function isCom001Run(run: QuestionStudioRun) {
  return asText(run.requestSnapshot?.engineId) === COM001_ENGINE_ID
    && asText(run.requestSnapshot?.packageId) === COM001_PACKAGE_ID;
}

function qlLabel(qlId: string) {
  return QLS.find(([id]) => id === qlId)?.[1] ?? qlId;
}

function difficultiesForQl(qlId: string) {
  if (qlId === MIXED_QL) return ['Easy', 'Medium', 'Hard'];
  return [...(QL_DIFFICULTIES[qlId] ?? [])];
}

export function QuestionStudioComputerAwarenessReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const canReview = hasPermission('content.generation.review');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [runs, setRuns] = useState<QuestionStudioRun[]>([]);
  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL');
  const [qlId, setQlId] = useState<string>(MIXED_QL);
  const [language, setLanguage] = useState('en');
  const [difficulty, setDifficulty] = useState(MIXED_DIFFICULTY);
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');
  const [reviewReason, setReviewReason] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [capabilities, dashboard] = await Promise.all([
        getQuestionStudioCapabilities(),
        getQuestionStudioDashboard(),
      ]);
      const pkg = capabilities.packages.find(
        (entry) => entry.packageId === COM001_PACKAGE_ID && entry.engineId === COM001_ENGINE_ID,
      );
      setAvailable(Boolean(pkg?.enabled));
      setRuns(dashboard.runs.filter(isCom001Run));
    } catch (caught) {
      showToast.error(
        'Computer Awareness review unavailable',
        caught instanceof Error ? caught.message : 'Unable to load COM-001 review data.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const recentRuns = useMemo(() => runs.slice(0, 8), [runs]);
  const availableDifficulties = useMemo(() => difficultiesForQl(qlId), [qlId]);

  useEffect(() => {
    if (difficulty !== MIXED_DIFFICULTY && !availableDifficulties.includes(difficulty)) {
      setDifficulty(MIXED_DIFFICULTY);
    }
  }, [availableDifficulties, difficulty]);

  const generate = async () => {
    if (!available) {
      showToast.error('COM-001 is not registered', 'The knowledge-v1 review package is unavailable.');
      return;
    }
    const selectedExam = EXAMS.find((entry) => entry.code === exam);
    setGenerating(true);
    try {
      const result = await createGenerationRun({
        engineId: COM001_ENGINE_ID,
        exam: selectedExam?.name ?? exam,
        subject: 'Computer Awareness',
        difficulty,
        count: Math.max(1, Math.min(50, count)),
        packageId: COM001_PACKAGE_ID,
        patternId: qlId === MIXED_QL ? undefined : qlId,
        topic: 'Computer Awareness',
        subtopic: 'Memory & Storage',
        language,
        seed: seed.trim() || undefined,
        runtimeMode: COM001_RUNTIME_MODE,
      });
      showToast.success(
        'COM-001 review batch created',
        `${result.publicCode} produced ${result.itemCount} ${LANGUAGE_LABELS[language] ?? language} ${difficulty} review item(s).`,
      );
      await refresh();
    } catch (caught) {
      showToast.error(
        'COM-001 generation failed',
        caught instanceof Error ? caught.message : 'Unable to generate Computer Awareness questions.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const decide = async (item: QuestionStudioItem, status: GenerationItemStatus) => {
    if ((status === 'needs_fix' || status === 'rejected') && !reviewReason.trim()) {
      showToast.error('Reason required', 'Record the source, language, explanation, or factual issue first.');
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
        if (result.convertedCount !== 1 || result.reviewOnlyApprovedCount !== 0 || !result.converted[0]) {
          throw new Error('COM-001 approval did not complete exactly one BANK_ONLY Question Bank conversion.');
        }
        showToast.success(
          'Question Bank acceptance complete',
          `${result.converted[0].publicCode} was stored in Question Bank. Test, mock-test and publication gates remain locked.`,
        );
      } else {
        showToast.success('Review state updated', `Item moved to ${status.replace(/_/g, ' ')}.`);
      }
      setReviewReason('');
      await refresh();
    } catch (caught) {
      showToast.error(
        'COM-001 review update failed',
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
              <Sparkles className="h-4 w-4 text-info" /> Computer Awareness · COM-001 review
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              knowledge-v1 · Memory & Storage · human-approved V2 English/Hindi/Punjabi authority
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-info/30 text-info">Manual Bank acceptance</Badge>
            <Badge variant="outline">9 permanent QLs</Badge>
            <Badge variant="outline">Topology difficulty filter</Badge>
            <Badge variant="outline" className="border-success/30 text-success">Question Bank writable</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">Tests/publication locked</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-info/20 bg-info/5 p-3 text-xs text-muted-foreground">
          Difficulty is a topology classification layered over frozen V2 questions; it still does not authorize a production difficulty claim. <strong className="text-foreground">Approve to Question Bank</strong> performs a manual BANK_ONLY acceptance after editorial review. It does not make the question test-eligible or public. Inline revision and regeneration remain disabled; mark an item <strong className="text-foreground">Needs fix</strong>, correct the canonical fact/generator/localization source, then create a fresh review batch.
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Field label="Exam">
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EXAMS.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.name}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="QL" className="xl:col-span-2">
            <Select value={qlId} onValueChange={setQlId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={MIXED_QL}>Mixed across all 9 permanent QLs</SelectItem>
                {QLS.map(([id, label]) => <SelectItem key={id} value={id}>{id} · {label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Language">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{['en', 'hi', 'pa'].map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Difficulty">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={MIXED_DIFFICULTY}>Mixed / no filter</SelectItem>
                {availableDifficulties.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Question count">
            <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Optional deterministic seed">
            <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Leave blank for default review seed" />
          </Field>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || generating}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button onClick={() => void generate()} disabled={!available || !canRun || loading || generating}>
              {generating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              Generate review batch
            </Button>
          </div>
        </div>

        <div className="border-t pt-5">
          <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold">Recent COM-001 review runs</p>
              <p className="text-xs text-muted-foreground">Question Bank acceptance is manual and remains isolated from test/publication activation.</p>
            </div>
            <Field label="Reason for Needs fix / Reject" className="w-full md:max-w-lg">
              <Textarea value={reviewReason} onChange={(event) => setReviewReason(event.target.value)} className="min-h-16" placeholder="Describe the factual, source, wording, localization, distractor, explanation, or difficulty-topology issue" />
            </Field>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading COM-001 review runs…
            </div>
          ) : recentRuns.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No COM-001 review runs yet. Generate a batch above.
            </div>
          ) : (
            <div className="space-y-4">
              {recentRuns.map((run) => <ComputerRun key={run.id} run={run} canReview={canReview} updatingItemId={updatingItemId} onDecision={decide} />)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ComputerRun({ run, canReview, updatingItemId, onDecision }: {
  run: QuestionStudioRun;
  canReview: boolean;
  updatingItemId: string | null;
  onDecision: (item: QuestionStudioItem, status: GenerationItemStatus) => Promise<void>;
}) {
  const language = asText(run.requestSnapshot?.language) || 'en';
  const selectedQl = asText(run.requestSnapshot?.patternId) || 'Mixed QLs';
  const selectedDifficulty = asText(run.requestSnapshot?.difficulty) || MIXED_DIFFICULTY;
  return (
    <div className="rounded-xl border">
      <div className="flex flex-col justify-between gap-2 border-b bg-muted/20 px-4 py-3 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs font-bold">{run.publicCode}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {asText(run.requestSnapshot?.exam) || 'Exam not recorded'} · {LANGUAGE_LABELS[language] ?? language} · {selectedQl === 'Mixed QLs' ? selectedQl : `${selectedQl} · ${qlLabel(selectedQl)}`} · Difficulty: {selectedDifficulty}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">knowledge-v1</Badge>
          <Badge variant="outline" className="border-info/30 text-info">BANK_ONLY review</Badge>
          <Badge variant="outline">{selectedDifficulty}</Badge>
          <Badge variant="outline">{run.items.length} item(s)</Badge>
        </div>
      </div>
      <div className="divide-y">
        {run.items.map((item) => (
          <ComputerReviewItem
            key={item.id}
            item={item}
            canReview={canReview}
            updating={updatingItemId === item.id}
            onDecision={onDecision}
          />
        ))}
      </div>
    </div>
  );
}

function ComputerReviewItem({ item, canReview, updating, onDecision }: {
  item: QuestionStudioItem;
  canReview: boolean;
  updating: boolean;
  onDecision: (item: QuestionStudioItem, status: GenerationItemStatus) => Promise<void>;
}) {
  const payload = item.payload;
  const stem = itemStem(payload) || 'Generated question unavailable';
  const options = itemOptionValues(payload);
  const correctIndex = itemCorrectIndex(payload);
  const explanation = itemExplanation(payload);
  const qlId = asText(payload?.qlId) || asText(payload?.patternId);
  const quality = analyzeItemQuality(payload);
  const bankOnly = asText(payload?.questionBankStatus) === 'READY_FOR_STORAGE'
    && payload?.questionBankWritable === true
    && asText(payload?.questionBankAcceptanceMode) === 'BANK_ONLY';
  const sourceControlled = asText(payload?.revisionPolicy) === 'SOURCE_GENERATOR_ONLY';
  const difficulty = asText(payload?.difficulty) || 'Unclassified';
  const difficultyDecision = asRecord(payload?.difficultyDecisionV2);
  const topology = asText(difficultyDecision?.topology);
  const rationale = asText(difficultyDecision?.rationale);
  const reviewV2Mode = asText(payload?.reviewV2Mode);
  const relationalSurfaceMode = asText(payload?.relationalSurfaceMode);
  const capacityConvention = asText(payload?.capacityConvention);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">Item {item.itemNumber} · {qlId || 'QL unavailable'}</span>
            <Badge variant="outline">{item.status.replace(/_/g, ' ')}</Badge>
            {bankOnly && <Badge variant="outline" className="border-success/30 text-success">Bank eligible · manual</Badge>}
            {sourceControlled && <Badge variant="outline">Source controlled</Badge>}
            <Badge variant="outline">{difficulty}</Badge>
            {topology && <Badge variant="outline">{readableToken(topology)}</Badge>}
            <Badge variant="outline" className={quality.blockerCount ? 'border-destructive/30 text-destructive' : 'border-success/30 text-success'}>
              {quality.blockerCount ? `${quality.blockerCount} blocker(s)` : `Quality ${quality.score}`}
            </Badge>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
            {reviewV2Mode && <span>V2 mode: <strong className="text-foreground">{readableToken(reviewV2Mode)}</strong></span>}
            {relationalSurfaceMode && <span>Surface: <strong className="text-foreground">{readableToken(relationalSurfaceMode)}</strong></span>}
            {capacityConvention && <span>Capacity convention: <strong className="text-foreground">{readableToken(capacityConvention)}</strong></span>}
          </div>
          {rationale && (
            <div className="mt-2 rounded-md border bg-muted/20 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Difficulty rationale:</strong> {rationale}
            </div>
          )}
          <p className="mt-2 text-sm leading-relaxed">{stem}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {options.map((option, index) => (
              <div key={`${item.id}-option-${index}`} className={cn('rounded-md border px-3 py-2 text-xs', index === correctIndex && 'border-success/40 bg-success/5')}>
                <span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold">Explanation</p>
          <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{explanation || 'No explanation recorded.'}</p>
          {item.retryReason && <p className="mt-2 text-xs text-warning">Review reason: {item.retryReason}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 lg:w-40 lg:flex-col">
          <Button size="sm" onClick={() => void onDecision(item, 'approved')} disabled={!canReview || updating || quality.blockerCount > 0 || Boolean(item.acceptedQuestionId)}>
            {updating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />} {item.acceptedQuestionId ? 'In Question Bank' : 'Approve to Bank'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => void onDecision(item, 'needs_fix')} disabled={!canReview || updating || Boolean(item.acceptedQuestionId)}>
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Needs fix
          </Button>
          <Button size="sm" variant="destructive" onClick={() => void onDecision(item, 'rejected')} disabled={!canReview || updating || Boolean(item.acceptedQuestionId)}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
          </Button>
          <div className="rounded-md border bg-muted/20 p-2 text-[10px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="mb-1 h-3.5 w-3.5" /> Approval may write this item to Question Bank only. Inline edit, regeneration, tests, mock tests and publication remain unavailable here.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}
