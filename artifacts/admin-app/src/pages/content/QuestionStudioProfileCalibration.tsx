import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Download, FlaskConical, Loader2 } from 'lucide-react';

import { AdminErrorAlert } from '@/components/shared/AdminErrorAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EXAMS } from '@/data/exams';
import { getQuestionStudioCapabilities } from '@/features/question-studio/api';
import { adminRequest } from '@/lib/admin-request';

type CalibrationResult = {
  packageId: string | null;
  topic: string;
  subtopic: string;
  difficulty: string;
  seed: string;
  count: number;
  left: { profile: { id: string; label: string }; metrics: Record<string, number> };
  right: { profile: { id: string; label: string }; metrics: Record<string, number> };
  comparison: {
    contextSeparationPercent: number;
    numericComplexityDifferencePercent: number;
    estimatedTimeDifferenceSeconds: number;
    nearIdenticalPercent: number;
    acceptedFromCandidatePoolPercent: number;
    calibrationStatus: 'pass' | 'needs-calibration';
    warnings: string[];
  };
  generatedAt: string;
};

export function QuestionStudioProfileCalibration() {
  const [packages, setPackages] = useState<Array<{ packageId: string; label: string; enabled: boolean }>>([]);
  const [packageId, setPackageId] = useState('');
  const [leftProfileId, setLeftProfileId] = useState(EXAMS[0]?.code ?? 'SSC_CGL_T1');
  const [rightProfileId, setRightProfileId] = useState(EXAMS[3]?.code ?? 'IBPS_PO_PRE');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(20);
  const [seed, setSeed] = useState('exam-profile-calibration');
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [result, setResult] = useState<CalibrationResult | null>(null);

  useEffect(() => {
    void getQuestionStudioCapabilities().then((value) => {
      const enabled = value.packages.filter((item) => item.enabled);
      setPackages(enabled);
      setPackageId((current) => current || enabled[0]?.packageId || '');
    }).catch(setError);
  }, []);

  const canRun = Boolean(packageId && leftProfileId !== rightProfileId && count > 0);
  const statusTone = result?.comparison.calibrationStatus === 'pass' ? 'outline' : 'destructive';
  const metrics = useMemo(() => result ? [
    ['Context separation', `${result.comparison.contextSeparationPercent}%`],
    ['Numeric complexity difference', `${result.comparison.numericComplexityDifferencePercent}%`],
    ['Estimated time difference', `${result.comparison.estimatedTimeDifferenceSeconds}s`],
    ['Near-identical stems', `${result.comparison.nearIdenticalPercent}%`],
    ['Candidate acceptance', `${result.comparison.acceptedFromCandidatePoolPercent}%`],
  ] : [], [result]);

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const next = await adminRequest<CalibrationResult>('/admin/question-studio/calibration', {
        method: 'POST',
        body: JSON.stringify({ packageId, leftProfileId, rightProfileId, difficulty, count, seed }),
      }, { fallbackMessage: 'Unable to run exam-profile calibration.' });
      setResult(next);
    } catch (caught) {
      setError(caught);
    } finally {
      setRunning(false);
    }
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `exam-profile-calibration-${result.packageId ?? 'package'}-${result.left.profile.id}-vs-${result.right.profile.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base"><FlaskConical className="h-4 w-4" /> Exam-profile calibration</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">Compare two profiles with the same package, seed, difficulty and batch size. A package passes only when context and numeric separation are measurable.</p>
          </div>
          {result && <Badge variant={statusTone}>{result.comparison.calibrationStatus === 'pass' ? 'Calibration pass' : 'Needs calibration'}</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <AdminErrorAlert error={error} title="Calibration failed" onRetry={run} compact />}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="space-y-2 xl:col-span-2"><Label>Generation package</Label><Select value={packageId} onValueChange={setPackageId}><SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger><SelectContent>{packages.map((item) => <SelectItem key={item.packageId} value={item.packageId}>{item.packageId} · {item.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Left profile</Label><Select value={leftProfileId} onValueChange={setLeftProfileId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EXAMS.map((exam) => <SelectItem key={exam.code} value={exam.code}>{exam.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Right profile</Label><Select value={rightProfileId} onValueChange={setRightProfileId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EXAMS.map((exam) => <SelectItem key={exam.code} value={exam.code}>{exam.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Difficulty</Label><Select value={difficulty} onValueChange={setDifficulty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Easy', 'Medium', 'Hard'].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-2"><Label>Count</Label><Input type="number" min={5} max={50} value={count} onChange={(event) => setCount(Math.max(5, Math.min(50, Number(event.target.value) || 5)))} /></div>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2"><Label>Shared deterministic seed</Label><Input value={seed} onChange={(event) => setSeed(event.target.value)} /></div>
          <Button onClick={() => void run()} disabled={!canRun || running}>{running ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <FlaskConical className="mr-1.5 h-4 w-4" />}{running ? 'Calibrating…' : 'Run calibration'}</Button>
        </div>

        {leftProfileId === rightProfileId && <div className="flex items-center gap-2 text-sm text-destructive"><AlertTriangle className="h-4 w-4" /> Choose two different exam profiles.</div>}

        {result && (
          <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold">{result.left.profile.label} vs {result.right.profile.label}</p><p className="text-xs text-muted-foreground">{result.packageId} · {result.count} questions per profile · seed {result.seed}</p></div><Button variant="outline" size="sm" onClick={download}><Download className="mr-1.5 h-4 w-4" /> Export report</Button></div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{metrics.map(([label, value]) => <div key={label} className="rounded-lg border bg-background p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>)}</div>
            <div className="grid gap-3 md:grid-cols-2"><ProfileMetrics title={result.left.profile.label} metrics={result.left.metrics} /><ProfileMetrics title={result.right.profile.label} metrics={result.right.metrics} /></div>
            {result.comparison.warnings.length > 0 && <div className="rounded-lg border border-warning/30 bg-warning/5 p-3"><p className="text-sm font-semibold text-warning">Calibration warnings</p><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{result.comparison.warnings.map((warning) => <li key={warning}>• {warning}</li>)}</ul></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProfileMetrics({ title, metrics }: { title: string; metrics: Record<string, number> }) {
  return <div className="rounded-lg border bg-background p-3"><p className="font-semibold">{title}</p><div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">{Object.entries(metrics).map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())}</span><p className="font-medium text-foreground">{value}</p></div>)}</div></div>;
}
