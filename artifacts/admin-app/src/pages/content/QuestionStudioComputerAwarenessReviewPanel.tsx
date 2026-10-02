import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  RefreshCw,
  Sparkles,
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
import { EXAMS } from '@/data/exams';
import {
  createGenerationRun,
  getQuestionStudioCapabilities,
} from '@/features/question-studio/api';
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
  'COM-001-QL-007': ['Medium'],
  'COM-001-QL-008': ['Medium'],
  'COM-001-QL-009': ['Easy', 'Medium'],
};

function asText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function difficultiesForQl(qlId: string) {
  if (qlId === MIXED_QL) return ['Easy', 'Medium'];
  return [...(QL_DIFFICULTIES[qlId] ?? [])];
}

export function QuestionStudioComputerAwarenessReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [available, setAvailable] = useState(false);
  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL');
  const [qlId, setQlId] = useState<string>(MIXED_QL);
  const [language, setLanguage] = useState('en');
  const [difficulty, setDifficulty] = useState(MIXED_DIFFICULTY);
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const capabilities = await getQuestionStudioCapabilities();
      const pkg = capabilities.packages.find(
        (entry) => entry.packageId === COM001_PACKAGE_ID && entry.engineId === COM001_ENGINE_ID,
      );
      setAvailable(Boolean(pkg?.enabled));
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

  return (
    <Card className="border-info/20">
      <CardHeader className="space-y-3">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-info" /> Computer Awareness · COM-001 advanced generation
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
          Difficulty is a topology classification layered over frozen V2 questions; it still does not authorize a production difficulty claim. This advanced surface only configures generation. Manual BANK_ONLY acceptance, Needs fix and Reject decisions belong to the central review queue; test and publication gates remain separate.
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

        <div className="rounded-lg border border-dashed bg-muted/10 p-4 text-xs text-muted-foreground">
          Generated COM-001 batches are reviewed only in the central <strong className="text-foreground">Generate & review</strong> queue. This advanced surface is reserved for QL, topology-difficulty and language generation controls.
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return <div className={className}><Label className="mb-1.5 block text-xs">{label}</Label>{children}</div>;
}
