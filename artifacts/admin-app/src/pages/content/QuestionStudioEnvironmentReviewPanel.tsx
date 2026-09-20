import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Leaf,
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
  itemCorrectIndex,
  itemExplanation,
  itemOptionValues,
  itemStem,
} from '@/features/question-studio/quality';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const PACKAGE_ID = 'ENV-001';
const ENGINE_ID = 'knowledge-v1';
const RUNTIME_MODE = 'review-only';
const ALL_CPS = 'all';
const MIXED_DIFFICULTY = 'Mixed';

const CPS = [
  ['ENV-CP-001', 'Ecology Fundamentals'],
  ['ENV-CP-002', 'Ecosystem Structure & Succession'],
  ['ENV-CP-003', 'Food Chain & Ecological Relationships'],
  ['ENV-CP-004', 'Nutrient Cycles'],
  ['ENV-CP-005', 'Major Ecosystems & Biomes'],
  ['ENV-CP-006', 'Biodiversity Fundamentals'],
  ['ENV-CP-007', 'Biodiversity Hotspots & India'],
  ['ENV-CP-008', 'Species Conservation & Project Elephant'],
  ['ENV-CP-009', 'Protected Areas of India'],
  ['ENV-CP-010', 'Important Indian Protected Areas'],
  ['ENV-CP-011', 'Environmental Pollution'],
  ['ENV-CP-012', 'Pollutants & Environmental Effects'],
  ['ENV-CP-013', 'Atmosphere, Ozone & Greenhouse Effect'],
  ['ENV-CP-014', 'Climate Change & NAPCC'],
  ['ENV-CP-015', 'Environmental Laws & EIA'],
  ['ENV-CP-016', 'Environmental Institutions & Movements'],
  ['ENV-CP-017', 'International Environmental Conventions'],
  ['ENV-CP-018', 'Project Tiger & Tiger Reserves'],
  ['ENV-CP-019', 'Ramsar Sites & Wetlands'],
  ['ENV-CP-020', 'Integrated Environment GK'],
] as const;

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isEnvironmentRun(run: QuestionStudioRun) {
  return asText(run.requestSnapshot?.engineId) === ENGINE_ID
    && asText(run.requestSnapshot?.packageId) === PACKAGE_ID;
}

function cpLabel(cpId: string) {
  return CPS.find(([id]) => id === cpId)?.[1] ?? cpId;
}

export function QuestionStudioEnvironmentReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRead = hasPermission('content.generation.read');
  const canRun = hasPermission('content.generation.run');
  const canReview = hasPermission('content.generation.review');

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const [runs, setRuns] = useState<QuestionStudioRun[]>([]);
  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL');
  const [cpId, setCpId] = useState(ALL_CPS);
  const [language, setLanguage] = useState('en');
  const [difficulty, setDifficulty] = useState(MIXED_DIFFICULTY);
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');
  const [reviewReason, setReviewReason] = useState('');

  const refresh = useCallback(async () => {
    if (!canRead) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [capabilities, dashboard] = await Promise.all([
        getQuestionStudioCapabilities(),
        getQuestionStudioDashboard(),
      ]);
      const pkg = capabilities.packages.find(
        (entry) => entry.packageId === PACKAGE_ID && entry.engineId === ENGINE_ID,
      );
      setAvailable(Boolean(pkg?.enabled));
      setRuns(dashboard.runs.filter(isEnvironmentRun));
    } catch (caught) {
      showToast.error(
        'Environment Question Studio unavailable',
        caught instanceof Error ? caught.message : 'Unable to load ENV-001 review data.',
      );
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const recentRuns = useMemo(() => runs.slice(0, 6), [runs]);

  const generate = async () => {
    if (!available) {
      showToast.error('ENV-001 is not registered', 'The Environment knowledge-v1 review package is unavailable.');
      return;
    }
    if (!canRun) {
      showToast.error('Run permission required', 'content.generation.run is required to create an Environment review run.');
      return;
    }

    const selectedExam = EXAMS.find((entry) => entry.code === exam);
    setGenerating(true);
    try {
      const result = await createGenerationRun({
        engineId: ENGINE_ID,
        exam: selectedExam?.name ?? exam,
        subject: 'Static GK',
        difficulty,
        count: Math.max(1, Math.min(50, count)),
        packageId: PACKAGE_ID,
        topic: 'Environment & Ecology',
        subtopic: 'Complete Chapter',
        language,
        seed: seed.trim() || undefined,
        runtimeMode: RUNTIME_MODE,
        canonicalProblemId: cpId === ALL_CPS ? undefined : cpId,
      });
      showToast.success(
        'Environment review batch created',
        `${result.publicCode} persisted ${result.itemCount} ${LANGUAGE_LABELS[language] ?? language} review item(s). No Question Bank write occurred.`,
      );
      await refresh();
    } catch (caught) {
      showToast.error(
        'Environment generation failed',
        caught instanceof Error ? caught.message : 'Unable to generate Environment review questions.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const decide = async (item: QuestionStudioItem, status: GenerationItemStatus) => {
    if ((status === 'needs_fix' || status === 'rejected') && !reviewReason.trim()) {
      showToast.error('Reason required', 'Describe the factual, source, language, distractor, or explanation issue first.');
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
          throw new Error('ENV-001 approval crossed the REVIEW_ONLY lifecycle boundary.');
        }
        showToast.success(
          'Editorial review approved',
          'The item remains inside Question Studio. Question Bank, tests, mocks and public release stay locked.',
        );
      } else {
        showToast.success('Review state updated', `Item moved to ${status.replace(/_/g, ' ')}.`);
      }

      setReviewReason('');
      await refresh();
    } catch (caught) {
      showToast.error(
        'Environment review update failed',
        caught instanceof Error ? caught.message : 'Unable to update this Environment review item.',
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (!canRead) return null;

  return (
    <Card className="border-success/20">
      <CardHeader className="space-y-3">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Leaf className="h-4 w-4 text-success" /> Static GK · Environment & Ecology · ENV-001
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              knowledge-v1 · CP001–CP020 · approved frozen English/Hindi/Punjabi corpus
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-success/30 text-success">Registered review workflow</Badge>
            <Badge variant="outline">20 CPs · 255 QLs</Badge>
            <Badge variant="outline">1,020 questions / language</Badge>
            <Badge variant="outline">EN · HI · PA</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">Question Bank locked</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <p>
              Environment runs use the frozen CP001–CP020 multilingual authority and deterministic selection without replacement.
              <strong className="text-foreground"> Approval is editorial REVIEW_ONLY.</strong> It does not write to Question Bank and does not enable Test Builder, mock tests, publication, or automatic student delivery. Fixes must be made in the frozen source/localization workflow and re-reviewed.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Field label="Exam">
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {EXAMS.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Environment CP" className="xl:col-span-2">
            <Select value={cpId} onValueChange={setCpId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CPS}>Mixed across all 20 CPs</SelectItem>
                {CPS.map(([id, label]) => <SelectItem key={id} value={id}>{id} · {label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Language">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['en', 'hi', 'pa'].map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Difficulty">
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[MIXED_DIFFICULTY, 'Easy', 'Medium', 'Hard'].map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Question count">
            <Input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(event) => setCount(Number(event.target.value) || 1)}
            />
          </Field>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <Field label="Optional deterministic seed">
            <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Leave blank for ENV-001 default seed" />
          </Field>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refresh()} disabled={loading || generating}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh
            </Button>
            <Button onClick={() => void generate()} disabled={!available || !canRun || loading || generating}>
              {generating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              Generate Environment review
            </Button>
          </div>
        </div>

        <div className="border-t pt-5">
          <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold">Recent ENV-001 review runs</p>
              <p className="text-xs text-muted-foreground">Review decisions stay in Question Studio; downstream release locks remain active.</p>
            </div>
            <Field label="Reason for Needs fix / Reject" className="w-full md:max-w-lg">
              <Textarea
                value={reviewReason}
                onChange={(event) => setReviewReason(event.target.value)}
                className="min-h-16"
                placeholder="Describe the factual, source, wording, localization, distractor or explanation issue"
              />
            </Field>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading Environment review runs…
            </div>
          ) : recentRuns.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No ENV-001 review runs yet. Generate a batch above.
            </div>
          ) : (
            <div className="space-y-4">
              {recentRuns.map((run) => (
                <EnvironmentRun
                  key={run.id}
                  run={run}
                  canReview={canReview}
                  updatingItemId={updatingItemId}
                  onDecision={decide}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EnvironmentRun({
  run,
  canReview,
  updatingItemId,
  onDecision,
}: {
  run: QuestionStudioRun;
  canReview: boolean;
  updatingItemId: string | null;
  onDecision: (item: QuestionStudioItem, status: GenerationItemStatus) => Promise<void>;
}) {
  const language = asText(run.requestSnapshot?.language) || 'en';
  const selectedCp = asText(run.requestSnapshot?.canonicalProblemId) || 'All 20 CPs';
  const selectedDifficulty = asText(run.requestSnapshot?.difficulty) || MIXED_DIFFICULTY;

  return (
    <div className="rounded-xl border">
      <div className="flex flex-col justify-between gap-2 border-b bg-muted/20 px-4 py-3 md:flex-row md:items-center">
        <div>
          <p className="font-mono text-xs font-bold">{run.publicCode}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {asText(run.requestSnapshot?.exam) || 'Exam not recorded'} · {LANGUAGE_LABELS[language] ?? language} · {selectedCp === 'All 20 CPs' ? selectedCp : `${selectedCp} · ${cpLabel(selectedCp)}`} · {selectedDifficulty}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">knowledge-v1</Badge>
          <Badge variant="outline" className="border-success/30 text-success">REVIEW_ONLY</Badge>
          <Badge variant="outline">{run.items.length} item(s)</Badge>
        </div>
      </div>

      <div className="divide-y">
        {run.items.map((item) => (
          <EnvironmentReviewItem
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

function EnvironmentReviewItem({
  item,
  canReview,
  updating,
  onDecision,
}: {
  item: QuestionStudioItem;
  canReview: boolean;
  updating: boolean;
  onDecision: (item: QuestionStudioItem, status: GenerationItemStatus) => Promise<void>;
}) {
  const payload = item.payload;
  const stem = itemStem(payload) || 'Generated Environment question unavailable';
  const options = itemOptionValues(payload);
  const correctIndex = itemCorrectIndex(payload);
  const explanation = itemExplanation(payload);
  const qlId = asText(payload?.qlId) || asText(payload?.patternId);
  const difficulty = asText(payload?.difficulty) || asText(payload?.difficultyLabel) || 'Unclassified';

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">Item {item.itemNumber} · {qlId || 'QL unavailable'}</span>
            <Badge variant="outline">{item.status.replace(/_/g, ' ')}</Badge>
            <Badge variant="outline">{difficulty}</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">No Question Bank write</Badge>
          </div>

          <p className="mt-2 text-sm leading-relaxed">{stem}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {options.map((option, index) => (
              <div
                key={`${item.id}-option-${index}`}
                className={cn(
                  'rounded-md border px-3 py-2 text-xs',
                  index === correctIndex && 'border-success/40 bg-success/5',
                )}
              >
                <span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option}
              </div>
            ))}
          </div>

          <p className="mt-3 text-xs font-semibold">Explanation</p>
          <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
            {explanation || 'No explanation recorded.'}
          </p>
          {item.retryReason && <p className="mt-2 text-xs text-warning">Review reason: {item.retryReason}</p>}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 lg:w-40 lg:flex-col">
          <Button size="sm" onClick={() => void onDecision(item, 'approved')} disabled={!canReview || updating}>
            {updating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
            Approve review
          </Button>
          <Button size="sm" variant="outline" onClick={() => void onDecision(item, 'needs_fix')} disabled={!canReview || updating}>
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Needs fix
          </Button>
          <Button size="sm" variant="destructive" onClick={() => void onDecision(item, 'rejected')} disabled={!canReview || updating}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
          </Button>
          <div className="rounded-md border bg-muted/20 p-2 text-[10px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="mb-1 h-3.5 w-3.5" /> Frozen-source workflow. No inline publication path is enabled here.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs">{label}</Label>
      {children}
    </div>
  );
}
