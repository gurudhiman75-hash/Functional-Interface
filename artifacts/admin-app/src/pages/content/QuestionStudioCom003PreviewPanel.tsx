import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  Eye,
  FileLock2,
  Languages,
  Loader2,
  RefreshCw,
  ShieldCheck,
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
import {
  getCom003QuestionStudioPackage,
  getCom003QuestionStudioStatus,
  previewCom003QuestionStudio,
  type Com003PackageResponse,
  type Com003PreviewLanguage,
  type Com003PreviewQuestion,
  type Com003StatusResponse,
} from '@/features/question-studio/com003-preview-api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

const ALL_QLS = 'all';

const LANGUAGE_LABELS: Record<Com003PreviewLanguage, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

const QLS = [
  ['COM-003-QL-001', 'Office applications & software class'],
  ['COM-003-QL-002', 'Office file formats & extensions'],
  ['COM-003-QL-003', 'Common commands & shortcuts'],
  ['COM-003-QL-004', 'Word editing, formatting & alignment'],
  ['COM-003-QL-005', 'Find, Replace, proofing & AutoCorrect'],
  ['COM-003-QL-006', 'Headers, footers & page orientation'],
  ['COM-003-QL-007', 'Mail Merge'],
  ['COM-003-QL-008', 'Excel structure, cells & ranges'],
  ['COM-003-QL-009', 'Excel formulas & operators'],
  ['COM-003-QL-010', 'Excel functions & AutoSum'],
  ['COM-003-QL-011', 'Relative & absolute references'],
  ['COM-003-QL-012', 'Sort, Filter & AutoFill'],
  ['COM-003-QL-013', 'Excel row & column operations'],
  ['COM-003-QL-014', 'Excel charts'],
  ['COM-003-QL-015', 'Windows desktop Excel shortcuts'],
  ['COM-003-QL-016', 'PowerPoint structure & design'],
  ['COM-003-QL-017', 'PowerPoint insertable objects'],
  ['COM-003-QL-018', 'Transitions, animations & timing'],
  ['COM-003-QL-019', 'Windows desktop slide-show shortcuts'],
] as const;

function qlLabel(qlId: string) {
  return QLS.find(([id]) => id === qlId)?.[1] ?? qlId;
}

function readableToken(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function QuestionStudioCom003PreviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRead = hasPermission('content.generation.read');
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(false);
  const [packageInfo, setPackageInfo] = useState<Com003PackageResponse | null>(null);
  const [status, setStatus] = useState<Com003StatusResponse | null>(null);
  const [qlId, setQlId] = useState(ALL_QLS);
  const [language, setLanguage] = useState<Com003PreviewLanguage>('en');
  const [count, setCount] = useState(6);
  const [seed, setSeed] = useState('com003-admin-frozen-preview');
  const [questions, setQuestions] = useState<Com003PreviewQuestion[]>([]);
  const [lastSeed, setLastSeed] = useState<string | null>(null);

  const refreshMetadata = useCallback(async () => {
    if (!canRead) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [pkg, nextStatus] = await Promise.all([
        getCom003QuestionStudioPackage(),
        getCom003QuestionStudioStatus(),
      ]);
      setPackageInfo(pkg);
      setStatus(nextStatus);
    } catch (caught) {
      showToast.error(
        'COM-003 preview unavailable',
        caught instanceof Error ? caught.message : 'Unable to load the frozen Computer Awareness preview surface.',
      );
    } finally {
      setLoading(false);
    }
  }, [canRead]);

  useEffect(() => {
    void refreshMetadata();
  }, [refreshMetadata]);

  const effectiveCount = useMemo(() => Math.max(1, Math.min(12, count)), [count]);

  const preview = async () => {
    if (!canRead) {
      showToast.error('Read permission required', 'You need content.generation.read to inspect the frozen COM-003 corpus.');
      return;
    }
    const deterministicSeed = seed.trim() || 'com003-admin-frozen-preview';
    setPreviewing(true);
    try {
      const result = await previewCom003QuestionStudio({
        qlId: qlId === ALL_QLS ? undefined : qlId,
        language,
        seed: deterministicSeed,
        count: effectiveCount,
      });
      setQuestions(result.questions);
      setLastSeed(result.generationContext.seed);
      showToast.success(
        'Frozen preview loaded',
        `${result.questions.length} ${LANGUAGE_LABELS[language]} question(s) loaded without creating a generation run.`,
      );
    } catch (caught) {
      showToast.error(
        'COM-003 preview failed',
        caught instanceof Error ? caught.message : 'Unable to load frozen COM-003 questions.',
      );
    } finally {
      setPreviewing(false);
    }
  };

  if (!canRead) {
    return (
      <Card className="border-warning/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileLock2 className="h-4 w-4 text-warning" /> Computer Awareness · COM-003 frozen preview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          content.generation.read permission is required to inspect this frozen corpus.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="space-y-3">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenCheck className="h-4 w-4 text-primary" /> Computer Awareness · COM-003 frozen preview
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Office & Productivity Software · immutable English/Hindi/Punjabi review corpus
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-success/30 text-success">19 frozen QLs</Badge>
            <Badge variant="outline" className="border-primary/30 text-primary">684 language artifacts</Badge>
            <Badge variant="outline"><Languages className="mr-1 h-3 w-3" /> EN · HI · PA</Badge>
            <Badge variant="outline" className="border-warning/30 text-warning">Not registered</Badge>
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>
              This surface reads only from the frozen COM-003 corpus. It <strong className="text-foreground">does not create a generation run</strong>, write to Question Bank, approve items, alter frozen text, or make questions test/publication eligible. The normal difficulty selector is intentionally unavailable because COM-003 has no frozen audited difficulty classification yet.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <Field label="QL" className="xl:col-span-2">
            <Select value={qlId} onValueChange={setQlId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_QLS}>Mixed across all 19 frozen QLs</SelectItem>
                {QLS.map(([id, label]) => (
                  <SelectItem key={id} value={id}>{id} · {label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Language">
            <Select value={language} onValueChange={(value) => setLanguage(value as Com003PreviewLanguage)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(LANGUAGE_LABELS) as Com003PreviewLanguage[]).map((entry) => (
                  <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Preview count">
            <Input
              type="number"
              min={1}
              max={12}
              value={count}
              onChange={(event) => setCount(Number(event.target.value) || 1)}
            />
          </Field>

          <Field label="Deterministic seed" className="xl:col-span-2">
            <Input
              value={seed}
              onChange={(event) => setSeed(event.target.value)}
              placeholder="com003-admin-frozen-preview"
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>{status?.frozenEnglishQuestionCount ?? 228} English</span>
            <span>·</span>
            <span>{status?.frozenHindiQuestionCount ?? 228} Hindi</span>
            <span>·</span>
            <span>{status?.frozenPunjabiQuestionCount ?? 228} Punjabi</span>
            {lastSeed && <><span>·</span><span>seed: {lastSeed}</span></>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => void refreshMetadata()} disabled={loading || previewing}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', loading && 'animate-spin')} /> Refresh status
            </Button>
            <Button onClick={() => void preview()} disabled={loading || previewing || !packageInfo}>
              {previewing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Eye className="mr-1.5 h-4 w-4" />}
              Preview frozen questions
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 rounded-lg border p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading COM-003 frozen metadata…
          </div>
        ) : questions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Select a QL/language and preview the immutable corpus. Nothing is stored by this action.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <FrozenQuestionCard key={question.id} question={question} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FrozenQuestionCard({ question, index }: { question: Com003PreviewQuestion; index: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex flex-col justify-between gap-2 md:flex-row md:items-start">
        <div>
          <p className="text-sm font-semibold">{index + 1}. {question.stem}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {question.qlId} · {qlLabel(question.qlId)} · {readableToken(question.surfaceMode)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">{question.locale}</Badge>
          <Badge variant="outline" className="border-success/30 text-success">Frozen</Badge>
          {question.versionScoped && <Badge variant="outline" className="border-warning/30 text-warning">Version-scoped</Badge>}
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const correct = optionIndex === question.correctIndex;
          return (
            <div
              key={`${question.id}:${optionIndex}`}
              className={cn(
                'flex items-start gap-2 rounded-lg border px-3 py-2 text-sm',
                correct && 'border-success/30 bg-success/5',
              )}
            >
              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
              <span className="flex-1">{option}</span>
              {correct && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />}
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-lg bg-muted/40 p-3 text-sm">
        <p><span className="font-semibold">Answer:</span> {question.canonicalAnswer}</p>
        <p className="mt-1 text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {question.explanation}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span>Source question: {question.sourceQuestionId}</span>
        <span>Fact: {question.targetFactId}</span>
        <span>{question.sourceFactIds.length} provenance fact(s)</span>
        <span>{question.sourceIds.length} governed source(s)</span>
        <span>Question Bank: {question.questionBankStatus}</span>
        <span>Test: {question.testEligibility}</span>
      </div>
    </div>
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
