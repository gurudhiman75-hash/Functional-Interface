import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CheckCircle2, Database, Eye, Loader2, Shapes, ShieldAlert } from 'lucide-react';

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
import {
  createSpatialReviewRun,
  getSpatialReviewPackage,
  getSpatialReviewStatus,
  previewSpatialReview,
  type SpatialReviewChapter,
  type SpatialReviewDifficulty,
  type SpatialReviewPackage,
  type SpatialReviewQuestion,
  type SpatialReviewStatus,
} from '@/features/question-studio/spatial-review-api';

const ALL = 'all';
const CHAPTER_LABELS: Record<SpatialReviewChapter, string> = {
  'MIR-001': 'Mirror Images',
  'WAT-001': 'Water Images',
  'FAN-001': 'Figure Analogy',
  'FCL-001': 'Figure Classification',
  'FSR-001': 'Figure Series',
};

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

function SvgFigure({ svg, label }: { svg: string; label: string }) {
  return (
    <div className="rounded-lg border bg-white p-2 text-center text-slate-950">
      <div className="mb-1 text-xs font-medium text-slate-500">{label}</div>
      <div
        className="mx-auto w-full max-w-[150px] [&_svg]:h-auto [&_svg]:w-full"
        // SVG is produced only by the validated internal Spatial renderer.
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

function SpatialQuestionCard({ question }: { question: SpatialReviewQuestion }) {
  return (
    <Card className="border-primary/15 bg-background">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{question.qlId}</Badge>
          <Badge variant="outline">{CHAPTER_LABELS[question.chapterCode]}</Badge>
          <Badge variant="secondary">{question.difficultyBand}</Badge>
          <Badge variant="outline">English</Badge>
          {question.validation.valid && (
            <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
              <CheckCircle2 className="h-3 w-3" /> Validated geometry
            </Badge>
          )}
        </div>
        <p className="text-sm font-semibold">{question.qlName}</p>
        <p className="text-xs text-muted-foreground">{question.mode} · {question.contentFingerprint}</p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p className="whitespace-pre-wrap font-medium leading-6">{question.stem}</p>

        {question.stimulusSvgs.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stimulus</p>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {question.stimulusSvgs.map((svg, index) => (
                <SvgFigure key={`${question.questionId}-stimulus-${index}`} svg={svg} label={`Figure ${index + 1}`} />
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Options</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {question.optionSvgs.map((svg, index) => (
              <div
                key={`${question.questionId}-option-${index}`}
                className={index === question.correctIndex ? 'rounded-lg ring-2 ring-success/50' : ''}
              >
                <SvgFigure svg={svg} label={`Option ${question.optionLabels[index]}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
          <strong>Answer:</strong> Option {question.answer}
        </div>

        <details className="rounded-lg border p-3">
          <summary className="cursor-pointer font-semibold">Learner explanation</summary>
          <div className="mt-3 space-y-2 leading-6 text-muted-foreground">
            <p><strong className="text-foreground">Observe:</strong> {question.explanation.observation}</p>
            <p><strong className="text-foreground">Rule:</strong> {question.explanation.rule}</p>
            <p><strong className="text-foreground">Apply:</strong> {question.explanation.application}</p>
            <p><strong className="text-foreground">Check:</strong> {question.explanation.check}</p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}

export function QuestionStudioSpatialReviewPanel() {
  const [pkg, setPkg] = useState<SpatialReviewPackage | null>(null);
  const [status, setStatus] = useState<SpatialReviewStatus | null>(null);
  const [chapterCode, setChapterCode] = useState(ALL);
  const [qlId, setQlId] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState('');
  const [questions, setQuestions] = useState<SpatialReviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<'preview' | 'run' | null>(null);

  const refreshStatus = async () => {
    const next = await getSpatialReviewStatus();
    setStatus(next);
    return next;
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([getSpatialReviewPackage(), getSpatialReviewStatus()])
      .then(([packageResponse, statusResponse]) => {
        if (!active) return;
        setPkg(packageResponse.package);
        setStatus(statusResponse);
      })
      .catch((error) => {
        showToast.error(
          'Spatial package unavailable',
          error instanceof Error ? error.message : 'Unable to load the Spatial Reasoning package.',
        );
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const visibleQls = useMemo(
    () => (pkg?.qls ?? []).filter((ql) => chapterCode === ALL || ql.chapterCode === chapterCode),
    [chapterCode, pkg?.qls],
  );

  useEffect(() => {
    if (qlId !== ALL && !visibleQls.some((ql) => ql.permanentQlId === qlId)) setQlId(ALL);
  }, [qlId, visibleQls]);

  const request = useMemo(() => ({
    chapterCode: chapterCode === ALL ? undefined : chapterCode as SpatialReviewChapter,
    qlId: qlId === ALL ? undefined : qlId,
    difficulty: difficulty === ALL ? undefined : difficulty as SpatialReviewDifficulty,
    count: Math.min(50, Math.max(1, count)),
    seed: seed.trim() || undefined,
  }), [chapterCode, count, difficulty, qlId, seed]);

  const handlePreview = async () => {
    setWorking('preview');
    try {
      const result = await previewSpatialReview({ ...request, count: Math.min(20, request.count) });
      setQuestions(result.questions);
      showToast.success('Spatial preview loaded', `${result.questions.length} validated question(s) generated.`);
    } catch (error) {
      showToast.error('Preview failed', error instanceof Error ? error.message : 'Unable to preview Spatial questions.');
    } finally {
      setWorking(null);
    }
  };

  const handleCreateRun = async () => {
    setWorking('run');
    try {
      const result = await createSpatialReviewRun(request);
      window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
      await refreshStatus();
      showToast.success(
        'Spatial review run created',
        `${result.publicCode} contains ${result.itemCount} question(s) ready for normal Question Studio review.`,
      );
    } catch (error) {
      showToast.error('Run creation failed', error instanceof Error ? error.message : 'Unable to create the Spatial review run.');
    } finally {
      setWorking(null);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shapes className="h-4 w-4" /> Spatial Reasoning · SPA-001
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1">
              <ShieldAlert className="h-3 w-3" /> Standard Question Studio lifecycle
            </Badge>
            <Badge variant="outline">30 permanent QLs · English</Badge>
          </div>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          Generate approved Mirror Image, Water Image, Figure Analogy, Figure Classification and Figure Series questions directly into the normal Question Studio review queue. SVG geometry, distractors and learner explanations are validated before an item is accepted.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {status && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Permanent QLs" value={status.permanentQlCount} />
            <Metric label="Studio items" value={status.generationItemCount} />
            <Metric label="Review-approved" value={status.approvedItemCount} />
            <Metric label="Question Bank" value={status.questionBankCount} />
          </div>
        )}

        <div className="rounded-lg border border-success/30 bg-background/60 p-3 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <ShieldAlert className="h-4 w-4" /> Standard approval handoff
          </div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            After the quality gate and manual approval, Question Studio converts the item into Question Bank through the shared lifecycle. Test/mock and publication eligibility then follow the normal global controls; automatic student publication stays disabled. Spatial generation is currently English-only until Hindi/Punjabi content is separately available.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading Spatial Reasoning package…
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="Chapter">
              <Select value={chapterCode} onValueChange={setChapterCode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Spatial chapters</SelectItem>
                  {(pkg?.chapters ?? []).map((entry) => (
                    <SelectItem key={entry} value={entry}>{CHAPTER_LABELS[entry]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="QL">
              <Select value={qlId} onValueChange={setQlId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All QLs</SelectItem>
                  {visibleQls.map((entry) => (
                    <SelectItem key={entry.permanentQlId} value={entry.permanentQlId}>
                      {entry.permanentQlId} · {entry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Difficulty">
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All difficulties</SelectItem>
                  {(pkg?.supportedDifficulties ?? []).map((entry) => (
                    <SelectItem key={entry} value={entry}>{entry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Count">
              <Input type="number" min={1} max={50} value={count} onChange={(event) => setCount(Number(event.target.value) || 1)} />
            </Field>
            <Field label="Optional deterministic seed">
              <Input value={seed} onChange={(event) => setSeed(event.target.value)} placeholder="spatial-review-01" />
            </Field>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void handlePreview()} disabled={!pkg || working !== null}>
            {working === 'preview' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />} Preview
          </Button>
          <Button onClick={() => void handleCreateRun()} disabled={!pkg || working !== null}>
            {working === 'run' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Create review run
          </Button>
        </div>

        {questions.length > 0 && (
          <div className="space-y-4 border-t pt-5">
            {questions.map((question) => (
              <SpatialQuestionCard key={question.questionId} question={question} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
