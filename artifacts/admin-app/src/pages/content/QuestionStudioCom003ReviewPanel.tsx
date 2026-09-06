import { useCallback, useEffect, useMemo, useState } from 'react';
import { Database, FileLock2, Loader2, RefreshCw, ShieldCheck, Sparkles } from 'lucide-react';

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
import { EXAMS } from '@/data/exams';
import { getQuestionStudioDashboard, type QuestionStudioRun } from '@/features/question-studio/api';
import {
  createCom003ReviewRun,
  type Com003ReviewLanguage,
} from '@/features/question-studio/com003-review-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const MIXED_QL = 'mixed';
const LANGUAGE_LABELS: Record<Com003ReviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

const QLS = Array.from({ length: 19 }, (_, index) => {
  const id = `COM-003-QL-${String(index + 1).padStart(3, '0')}`;
  return id;
});

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isCom003Run(run: QuestionStudioRun) {
  return asText(run.requestSnapshot?.engineId) === 'knowledge-v1'
    && asText(run.requestSnapshot?.packageId) === 'COM-003';
}

export function QuestionStudioCom003ReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRead = hasPermission('content.generation.read');
  const canRun = hasPermission('content.generation.run');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [runs, setRuns] = useState<QuestionStudioRun[]>([]);
  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL');
  const [qlId, setQlId] = useState(MIXED_QL);
  const [language, setLanguage] = useState<Com003ReviewLanguage>('en');
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');

  const maximum = qlId === MIXED_QL ? 50 : 12;
  const effectiveCount = Math.max(1, Math.min(maximum, count));

  const refresh = useCallback(async () => {
    if (!canRead) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const dashboard = await getQuestionStudioDashboard();
      setRuns(dashboard.runs.filter(isCom003Run));
    } catch (caught) {
      showToast.error(
        'COM-003 review runs unavailable',
        caught instanceof Error ? caught.message : 'Unable to load COM-003 review runs.',
      );
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (count > maximum) setCount(maximum);
  }, [count, maximum]);

  const recentRuns = useMemo(() => runs.slice(0, 6), [runs]);

  const generate = async () => {
    if (!canRun) {
      showToast.error('Run permission required', 'content.generation.run is required to create a COM-003 review run.');
      return;
    }
    const selectedExam = EXAMS.find((entry) => entry.code === exam);
    setCreating(true);
    try {
      const result = await createCom003ReviewRun({
        exam: selectedExam?.name ?? exam,
        language,
        count: effectiveCount,
        qlId: qlId === MIXED_QL ? undefined : qlId,
        seed: seed.trim() || undefined,
      });
      showToast.success(
        'COM-003 review run created',
        `${result.publicCode} persisted ${result.itemCount} frozen ${LANGUAGE_LABELS[language]} review item(s). No Question Bank write occurred.`,
      );
      await refresh();
    } catch (caught) {
      showToast.error(
        'COM-003 review generation failed',
        caught instanceof Error ? caught.message : 'Unable to create the frozen review run.',
      );
    } finally {
      setCreating(false);
    }
  };

  if (!canRead) return null;

  return (
    <Card className="border-info/20">
      <CardHeader className="space-y-3">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4 text-info" /> Computer Awareness · COM-003 review runs
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Office & Productivity Software · standard REVIEW_ONLY lifecycle · frozen corpus
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-info/30 text-info">Review-run persistence</Badge>
            <Badge variant="outline">19 QLs · 4 CP groups</Badge>
            <Badge variant="outline">EN · HI · PA</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">No difficulty classifier</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">Question Bank locked</Badge>
          </div>
        </div>
        <div className="rounded-lg border border-info/20 bg-info/5 p-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-info" />
            <p>
              This action persists a standard Question Studio <strong className="text-foreground">review run</strong> and immutable run-item versions from the frozen COM-003 corpus. It does not create canonical Question Bank questions, does not classify difficulty, and does not enable tests, mocks, publication, or student release.
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

          <Field label="QL" className="xl:col-span-2">
            <Select value={qlId} onValueChange={setQlId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={MIXED_QL}>Mixed across all 19 frozen QLs</SelectItem>
                {QLS.map((id) => <SelectItem key={id} value={id}>{id}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Language">
            <Select value={language} onValueChange={(value) => setLanguage(value as Com003ReviewLanguage)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(LANGUAGE_LABELS) as Com003ReviewLanguage[]).map((entry) => (
                  <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Question count">
            <Input
              type="number"
              min={1}
              max={maximum}
              value={count}
              onChange={(event) => setCount(Number(event.target.value) || 1)}
            />
          </Field>

          <Field label="Deterministic seed">
            <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="Optional" />
          </Field>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={() => void refresh()} disabled={loading || creating}>
            <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh runs
          </Button>
          <Button onClick={() => void generate()} disabled={loading || creating || !canRun}>
            {creating ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
            Generate review batch
          </Button>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold">Recent COM-003 review runs</p>
          <p className="mt-1 text-xs text-muted-foreground">Review decisions occur in the main cockpit below. REVIEW_ONLY approval cannot convert these items into Question Bank.</p>

          {loading ? (
            <div className="mt-3 flex items-center justify-center gap-2 rounded-lg border p-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading COM-003 review runs…
            </div>
          ) : recentRuns.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No persisted COM-003 review runs yet.
            </div>
          ) : (
            <div className="mt-3 grid gap-2 lg:grid-cols-2">
              {recentRuns.map((run) => (
                <div key={run.id} className="rounded-lg border bg-muted/15 p-3 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold">{run.publicCode}</span>
                    <Badge variant="outline">{run.status}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
                    <span>{run.items.length} item(s)</span>
                    <span>{asText(run.requestSnapshot?.language) || 'en'}</span>
                    <span>{asText(run.requestSnapshot?.patternId) || 'Mixed QLs'}</span>
                    <span>{asText(run.requestSnapshot?.exam) || 'Exam profile'}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-warning">
                    <FileLock2 className="h-3 w-3" /> Question Bank/test/publication locked
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
