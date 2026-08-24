import { useMemo, useState, type ReactNode } from 'react';
import { BrainCircuit, Database, Loader2, ShieldCheck } from 'lucide-react';

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
import { useQuestionStudio } from '@/features/question-studio/useQuestionStudio';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';

const STA_PACKAGE_ID = 'STA-001';
const AUTO_PROFILE = 'AUTO';
type StaDifficulty = 'Easy' | 'Medium' | 'Hard';

const STA_QLS = {
  'STA-QL-001': 'Prerequisite, availability, capability & feasibility dependency',
  'STA-QL-002': 'Recommendation / policy need & efficacy dependency',
  'STA-QL-003': 'Notice / rule audience relevance & response capability',
  'STA-QL-004': 'Claim / prediction hidden causal or efficacy bridge',
  'STA-QL-005': 'Advertisement / appeal audience-value & response dependency',
  'STA-QL-006': 'Comparison / measurement / evidence-validity dependency',
} as const;

type StaQlId = keyof typeof STA_QLS;

const STA_PROFILES = {
  SSC_2X4: 'SSC · 2 assumptions · 4 options · direct PYQ format',
  SSC_3X4: 'SSC · 3 assumptions · 4 options · direct PYQ format',
  BANK_2X5: 'Banking · 2 assumptions · 5 options · family-compatible',
  BANK_3X5: 'Banking · 3 assumptions · 5 options · memory-PYQ format',
  BANK_4X5: 'Banking · 4 assumptions · 5 options · memory-PYQ format',
  BANK_3X5_NEGATIVE: 'Banking · 3 assumptions · negative query · family-compatible',
  BANK_5X5: 'Banking · 5 assumptions · 5 options · memory-PYQ format',
  PUNJAB_2X4: 'Punjab State · 2 assumptions · 4 options · direct PYQ format',
  PUNJAB_3X4: 'Punjab State · 3 assumptions · 4 options · cross-exam synthesis',
} as const;

type StaProfileId = keyof typeof STA_PROFILES;

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

function examForProfile(profileId: string) {
  if (profileId.startsWith('BANK_')) return 'Banking — Statement & Assumption';
  if (profileId.startsWith('PUNJAB_')) return 'Punjab State — Statement & Assumption';
  return 'SSC — Statement & Assumption';
}

export function QuestionStudioStatementAssumptionReviewPanel() {
  const { hasPermission } = useAdminPermissions();
  const canRun = hasPermission('content.generation.run');
  const { dashboard, capabilities, loading, generating, error, generate } = useQuestionStudio();

  const [qlId, setQlId] = useState<StaQlId>('STA-QL-001');
  const [profileId, setProfileId] = useState<string>(AUTO_PROFILE);
  const [difficulty, setDifficulty] = useState<StaDifficulty>('Medium');
  const [language, setLanguage] = useState('en');
  const [count, setCount] = useState(10);
  const [seed, setSeed] = useState('');

  const pkg = useMemo(
    () => capabilities.packages.find((entry) => entry.packageId === STA_PACKAGE_ID),
    [capabilities.packages],
  );
  const staRuns = useMemo(
    () => dashboard.runs.filter((run) => run.requestSnapshot?.packageId === STA_PACKAGE_ID),
    [dashboard.runs],
  );
  const staItems = useMemo(() => staRuns.flatMap((run) => run.items), [staRuns]);

  const supportedLanguages = pkg?.supportedLanguages.length ? pkg.supportedLanguages : ['en'];
  const effectiveLanguage = supportedLanguages.includes(language) ? language : supportedLanguages[0] ?? 'en';

  const handleCreateRun = async () => {
    if (!pkg) {
      showToast.error('STA package unavailable', 'STA-001 is not currently exposed by Question Studio capabilities.');
      return;
    }
    const selectedProfile = profileId === AUTO_PROFILE ? undefined : profileId as StaProfileId;
    try {
      const result = await generate({
        exam: selectedProfile ? examForProfile(selectedProfile) : 'Statement & Assumption — V4 profile mix',
        subject: 'Reasoning Ability',
        difficulty,
        count: Math.min(capabilities.maxBatchSize, Math.max(1, count)),
        packageId: STA_PACKAGE_ID,
        canonicalProblemId: qlId,
        patternId: selectedProfile,
        topic: 'Reasoning',
        subtopic: 'Statement & Assumption',
        language: effectiveLanguage,
        seed: seed.trim() || undefined,
      });
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      showToast.success(
        'Statement & Assumption V4 review run created',
        `${result.publicCode} produced ${result.itemCount} ${qlId} ${difficulty} review question(s).`,
      );
    } catch (caught) {
      showToast.error(
        'STA V4 generation failed',
        caught instanceof Error ? caught.message : 'Unable to generate Statement & Assumption questions.',
      );
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BrainCircuit className="h-4 w-4" /> Statement & Assumption · STA-001 · V4
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <Database className="h-3 w-3" /> 108 semantic authorities
            </Badge>
            <Badge variant="outline">6 QLs · 9 profiles · 3 languages</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          V4 is the exam-realness hardening candidate: locale-independent semantic selection, anti-cue distractors, strict EN/HI/PA same-item identity, and permanent review coverage for advertisement/appeal plus comparison/evidence assumptions. Presentation format remains separate from semantic QL identity.
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="V4 QLs" value={6} />
          <Metric label="Semantic authorities" value={108} />
          <Metric label="Studio items" value={staItems.length} />
          <Metric label="Question Bank" value="Locked" />
        </div>

        <div className="rounded-lg border border-warning/25 bg-warning/5 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4" /> V4 review candidate · delivery locked
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            The previous V1 multilingual freeze is retained as historical evidence, but the August 24 exam-realness audit reopened STA for V4. QL005 and QL006 are now in the review model. EN/HI/PA share the same candidate identities and answer set for a canonical item. Banking memory-PYQ formats are not official verbatim, and PUNJAB_3X4 remains cross-exam synthesis. Question Bank writes, tests, mocks, public publication and automatic student publication remain disabled.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading STA-001 V4 capability…
          </div>
        ) : !pkg ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            STA-001 is not present in Question Studio capabilities.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <Field label="Semantic question type (QL)">
              <Select value={qlId} onValueChange={(value) => setQlId(value as StaQlId)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(STA_QLS) as StaQlId[]).map((id) => (
                    <SelectItem key={id} value={id}>{id} · {STA_QLS[id]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Exam presentation profile">
              <Select value={profileId} onValueChange={setProfileId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={AUTO_PROFILE}>Auto · any compatible profile</SelectItem>
                  {(Object.keys(STA_PROFILES) as StaProfileId[]).map((id) => (
                    <SelectItem key={id} value={id}>{STA_PROFILES[id]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as StaDifficulty)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['Easy', 'Medium', 'Hard'] as const).map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language">
              <Select value={effectiveLanguage} onValueChange={setLanguage}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((entry) => (
                    <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry] ?? entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Question count">
              <Input type="number" min={1} max={capabilities.maxBatchSize} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="sta-v4-review-01" />
            </Field>
          </div>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || generating || !canRun}>
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
            {generating ? 'Generating…' : 'Create STA V4 review run'}
          </Button>
          <span className="text-xs text-muted-foreground">
            {qlId} · {profileId === AUTO_PROFILE ? 'auto profile' : profileId} · {difficulty} · {LANGUAGE_LABELS[effectiveLanguage] ?? effectiveLanguage}
          </span>
          {staRuns.length > 0 && <span className="text-xs text-muted-foreground">{staRuns.length} STA run(s)</span>}
        </div>
      </CardContent>
    </Card>
  );
}
