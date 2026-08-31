import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, Loader2, LockKeyhole, Boxes } from 'lucide-react';

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
  getCubesDiceReviewPackage,
  getCubesDiceReviewStatus,
  previewCubesDiceReview,
  type CubesDiceReviewLanguage,
  type CubesDiceReviewPackage,
  type CubesDiceReviewQlId,
  type CubesDiceReviewQuestion,
} from '@/features/question-studio/cubes-dice-review-api';

const ALL = 'all';
const LANGUAGE_LABELS: Record<CubesDiceReviewLanguage, string> = {
  en: 'English',
  hi: 'हिन्दी',
  pa: 'ਪੰਜਾਬੀ',
};

function SvgFigure({ svg }: { svg: string }) {
  return (
    <div className="rounded-lg border bg-white p-3 text-slate-950">
      <div
        className="mx-auto w-full max-w-[330px] [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

function SolutionTable({ table }: { table: CubesDiceReviewQuestion['solution']['tables'][number] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <div className="border-b bg-muted/40 px-3 py-2 text-xs font-semibold">{table.title}</div>
      <table className="w-full min-w-[360px] text-xs">
        <thead>
          <tr className="border-b bg-muted/20">
            {table.headers.map((header) => <th key={header} className="px-3 py-2 text-left font-semibold">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${table.title}-${rowIndex}`} className={table.emphasizedRowIndexes.includes(rowIndex) ? 'bg-primary/5 font-semibold' : 'border-t'}>
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className="px-3 py-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function QuestionCard({ question }: { question: CubesDiceReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">{LANGUAGE_LABELS[question.language]}</Badge>
          <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
            <CheckCircle2 className="h-3 w-3" /> Solver-backed
          </Badge>
          <Badge variant="outline" className="gap-1"><LockKeyhole className="h-3 w-3" /> Review only</Badge>
        </div>
        <p className="text-sm font-semibold">{question.qlName}</p>
        <p className="text-xs text-muted-foreground">{question.taskKind} · {question.contentFingerprint}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>

        {question.stimulusSvgs.map((svg, index) => (
          <SvgFigure key={`${question.questionLanguageId}-stimulus-${index}`} svg={svg} />
        ))}

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {question.options.map((option, index) => (
            <div
              key={`${question.questionLanguageId}-option-${index}`}
              className={index === question.correctIndex ? 'rounded-lg border border-success/50 bg-success/5 p-3 ring-1 ring-success/30' : 'rounded-lg border p-3'}
            >
              <span className="mr-2 font-semibold">{question.optionLabels[index]}.</span>{option}
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> {question.answer} ({question.canonicalAnswer})
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <div className="font-semibold">Detailed solution</div>
          <div className="rounded-md border-l-4 border-primary bg-muted/25 px-3 py-2 leading-6">
            <strong>Logic / Rule:</strong> {question.solution.logicRule}
          </div>
          {question.solution.tables.map((table) => <SolutionTable key={table.title} table={table} />)}
          <ol className="list-decimal space-y-1 pl-5 leading-6">
            {question.solution.steps.map((step, index) => <li key={`${question.questionLanguageId}-step-${index}`}>{step}</li>)}
          </ol>
          {question.solution.note && <div className="rounded-md bg-muted/40 px-3 py-2 text-xs leading-5">{question.solution.note}</div>}
          <div className="border-t pt-3 font-semibold">{question.solution.answerLine}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioCubesDiceReviewPanel() {
  const [pkg, setPkg] = useState<CubesDiceReviewPackage | null>(null);
  const [language, setLanguage] = useState<CubesDiceReviewLanguage>('en');
  const [qlId, setQlId] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<CubesDiceReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getCubesDiceReviewPackage(), getCubesDiceReviewStatus()])
      .then(([packageResponse]) => {
        if (active) setPkg(packageResponse.package);
      })
      .catch((error) => {
        showToast.error('Cubes & Dice package unavailable', error instanceof Error ? error.message : 'Unable to load CND-001.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const selectedQl = useMemo(
    () => qlId === ALL ? undefined : qlId as CubesDiceReviewQlId,
    [qlId],
  );

  const handlePreview = async () => {
    setPreviewing(true);
    try {
      const result = await previewCubesDiceReview({
        language,
        qlId: selectedQl,
        count: Math.min(20, Math.max(1, count)),
        seed: seed.trim() || undefined,
      });
      setQuestions(result.questions);
      showToast.success('Cubes & Dice preview loaded', `${result.questions.length} ${LANGUAGE_LABELS[language]} question(s) generated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview CND-001 questions.');
    } finally {
      setPreviewing(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Boxes className="h-4 w-4" /> Cubes & Dice · CND-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">5 permanent QLs · English · हिन्दी · ਪੰਜਾਬੀ</Badge>
            <Badge variant="outline" className="gap-1"><LockKeyhole className="h-3 w-3" /> Registered review-only</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate solver-backed dice, cube-net, painted-cube, unit-cube-stack and orthographic-view questions with the approved detailed-solution format. The package is visible in Question Studio for review and preview only; database writes, Question Bank conversion, test use and publication remain locked.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-warning/30 bg-background/70 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium"><LockKeyhole className="h-4 w-4" /> Activation boundary</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Review-only registration is active. There is intentionally no “Create review run” action at this gate, so CND-001 cannot write generation items or leak into Question Bank/tests before the next explicit activation.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading CND-001…</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label>QL</Label>
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All 5 CND QLs</SelectItem>
                  {(pkg?.qls ?? []).map((entry) => (
                    <SelectItem key={entry.permanentQlId} value={entry.permanentQlId}>{entry.permanentQlId} · {entry.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as CubesDiceReviewLanguage)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(pkg?.supportedLanguages ?? ['en']).map((entry) => <SelectItem key={entry} value={entry}>{LANGUAGE_LABELS[entry]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Count</Label>
              <Input type="number" min={1} max={20} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </div>
            <div className="space-y-2">
              <Label>Seed</Label>
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="optional deterministic seed" />
            </div>
          </div>
        )}

        <Button onClick={handlePreview} disabled={loading || previewing} className="gap-2">
          {previewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
          Preview questions
        </Button>

        {questions.length > 0 && (
          <div className="space-y-4">
            {questions.map((question) => <QuestionCard key={question.questionLanguageId} question={question} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
