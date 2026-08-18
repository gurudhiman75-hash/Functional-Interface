import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Binary, Database, Loader2, ShieldCheck } from 'lucide-react';

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
import { QUESTION_STUDIO_REFRESH_EVENT } from '@/features/question-studio/events';
import { useQuestionStudio } from '@/features/question-studio/useQuestionStudio';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const IOP_PACKAGE_ID = 'IOP-001';
type IopDifficulty = 'Easy' | 'Medium' | 'Hard';

type IopFamily = {
  label: string;
  difficulties: readonly IopDifficulty[];
};

const IOP_FAMILIES: Record<string, IopFamily> = {
  'IOP-QL-001': { label: 'Single Select-and-Fix Rearrangement', difficulties: ['Easy', 'Medium'] },
  'IOP-QL-002': { label: 'Blocked Multi-Category Rearrangement', difficulties: ['Medium'] },
  'IOP-QL-003': { label: 'Simultaneous Multi-Action Rearrangement', difficulties: ['Medium'] },
  'IOP-QL-004': { label: 'Alternating / Interleaved Rearrangement', difficulties: ['Medium'] },
  'IOP-QL-005': { label: 'Numeric Transformation Pipeline', difficulties: ['Hard'] },
  'IOP-QL-006': { label: 'Text / Alphanumeric Transformation Pipeline', difficulties: ['Hard'] },
  'IOP-QL-007': { label: 'Mixed Word–Number Transformed-Pair Machine', difficulties: ['Hard'] },
  'IOP-QL-008': { label: 'Box / Table Arithmetic Machine', difficulties: ['Hard'] },
};

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

export function QuestionStudioInputOutputReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const {
    dashboard,
    capabilities,
    loading,
    generating,
    error,
    generate,
  } = useQuestionStudio();

  const [exam, setExam] = useState(EXAMS[0]?.code ?? 'SSC_CGL');
  const [familyId, setFamilyId] = useState('');
  const [difficulty, setDifficulty] = useState<IopDifficulty>('Easy');
  const [language, setLanguage] = useState('en');
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');

  const pkg = useMemo(
    () => capabilities.packages.find((entry) => entry.packageId === IOP_PACKAGE_ID),
    [capabilities.packages],
  );

  const availableFamilies = useMemo(
    () => (pkg?.cpIds ?? []).filter((id) => Boolean(IOP_FAMILIES[id])),
    [pkg],
  );

  useEffect(() => {
    if (!familyId && availableFamilies[0]) setFamilyId(availableFamilies[0]);
    if (familyId && !availableFamilies.includes(familyId)) setFamilyId(availableFamilies[0] ?? '');
  }, [availableFamilies, familyId]);

  const family = familyId ? IOP_FAMILIES[familyId] : undefined;

  useEffect(() => {
    if (!family) return;
    if (!family.difficulties.includes(difficulty)) setDifficulty(family.difficulties[0]);
  }, [difficulty, family]);

  useEffect(() => {
    const supported = pkg?.supportedLanguages ?? ['en'];
    if (!supported.includes(language)) setLanguage(supported[0] ?? 'en');
  }, [language, pkg]);

  const iopRuns = useMemo(
    () => dashboard.runs.filter((run) => run.requestSnapshot?.packageId === IOP_PACKAGE_ID),
    [dashboard.runs],
  );
  const iopItems = useMemo(() => iopRuns.flatMap((run) => run.items), [iopRuns]);

  const handleCreateRun = async () => {
    if (!pkg || !familyId || !family) {
      showToast.error('Machine family required', 'Select an IOP machine family before generating.');
      return;
    }
    try {
      const selectedExam = EXAMS.find((entry) => entry.code === exam);
      const result = await generate({
        exam: selectedExam?.name ?? exam,
        subject: 'Reasoning Ability',
        difficulty,
        count: Math.min(capabilities.maxBatchSize, Math.max(1, count)),
        packageId: IOP_PACKAGE_ID,
        canonicalProblemId: familyId,
        topic: 'Reasoning',
        subtopic: 'Input Output',
        language,
        seed: seed.trim() || undefined,
      });
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      showToast.success(
        'Input–Output review run created',
        `${result.publicCode} produced ${result.itemCount} ${familyId} ${difficulty} question(s).`,
      );
    } catch (caught) {
      showToast.error(
        'Input–Output generation failed',
        caught instanceof Error ? caught.message : 'Unable to generate Input–Output questions.',
      );
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Binary className="h-4 w-4" /> Input–Output · IOP-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <Database className="h-3 w-3" /> Question Studio connected
            </Badge>
            <Badge variant="outline">8 frozen families · 19 source modes · 3 languages</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate exam-style Machine Input–Output questions from the approved English, Hindi and Punjabi authorities. Choose a machine family and one of its valid reviewed difficulty bands. Generated items enter the normal Question Studio review queue only.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Permanent families" value={availableFamilies.length || 8} />
          <Metric label="Studio runs" value={iopRuns.length} />
          <Metric label="Studio items" value={iopItems.length} />
          <Metric label="Question Bank" value="Locked" />
        </div>

        <div className="rounded-lg border border-success/25 bg-success/5 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-success" /> Frozen learner content, review-only delivery
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            English, Hindi and Punjabi wording is content-addressed and frozen. Question Bank storage, test/mock eligibility and public publication remain disabled for IOP-001.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Input–Output package…
          </div>
        ) : !pkg ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            IOP-001 is not present in Question Studio capabilities.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Exam">
              <Select value={exam} onValueChange={setExam}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EXAMS.map((entry) => <SelectItem key={entry.code} value={entry.code}>{entry.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Machine family">
              <Select value={familyId} onValueChange={setFamilyId}>
                <SelectTrigger><SelectValue placeholder="Select family" /></SelectTrigger>
                <SelectContent>
                  {availableFamilies.map((id) => (
                    <SelectItem key={id} value={id}>{id} · {IOP_FAMILIES[id].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as IopDifficulty)} disabled={!family || family.difficulties.length === 1}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(family?.difficulties ?? ['Easy']).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg.supportedLanguages.length ? pkg.supportedLanguages : ['en']).map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry] ?? entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Question count">
              <Input type="number" min={1} max={capabilities.maxBatchSize} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="iop-review-01" />
            </Field>
          </div>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || !familyId || generating || !canRun}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            {generating ? 'Generating…' : 'Create IOP review run'}
          </Button>
          {family && <span className="text-xs text-muted-foreground">{familyId} · {family.label} · {difficulty}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
