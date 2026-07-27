import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, BarChart3, Clock, Flag, RefreshCw, Search, ShieldCheck, Target } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const number = (value: unknown) => Number(value ?? 0).toLocaleString();
const percent = (value: unknown) => value == null ? '—' : `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
const seconds = (value: unknown) => value == null ? '—' : `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })} sec`;

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Question Analytics request failed (${response.status}).`);
  if (!body) throw new Error('Question Analytics returned an empty response.');
  return body;
}

type OptionRow = { key: string; text: string; count: number; shareOfAnswered: number; isCorrect?: boolean };
type QuestionRow = {
  publicationId: string; questionVersionId: string; testQuestionIds: string[]; testSectionIds: string[];
  testPublicCode: string; testTitle: string; sectionName: string; stem: string; duplicatePlacements: number;
  exposures: number; answered: number; skipped: number; correct: number; incorrect: number; flagged: number;
  invalidResponseItems: number; directLinkages: number; legacyLinkages: number; linkageMethod: 'direct' | 'legacy' | 'mixed';
  timedResponses: number; averageTimeSeconds: number | null; answerRate: number; skipRate: number;
  accuracy: number | null; facility: number; flagRate: number; optionSelection: OptionRow[];
};
type AnalyticsResponse = {
  summary: {
    completedAttemptsScanned: number; questionsWithExposure: number; responseItems: number; answeredItems: number;
    skippedItems: number; invalidResponseItems: number; overallAccuracy: number | null;
    averageQuestionTimeSeconds: number | null; timedResponses: number; directLinkages: number; legacyLinkages: number;
    unmatchedReviewItems: number; reviewedItems: number; malformedReviewAttempts: number;
    stableCollisionGroups: number; duplicateQuestionPlacements: number;
  };
  questions: QuestionRow[]; truncated: boolean; scanTruncated: boolean;
  capabilities: { correctness: boolean; optionSelection: boolean; flagAnalytics: boolean; questionTiming: boolean; discrimination: boolean; directQuestionLinkage: boolean; reason: string };
};
type QuestionDetail = {
  windowDays: number;
  question: {
    publicationId: string; publicationNumber: number; testPublicCode: string; testTitle: string;
    questionVersionId: string; testQuestionIds: string[]; testSectionId: string; sectionName: string;
    stem: string; explanation: string; stableQuestionId: number; duplicatePlacements: number;
  };
  summary: {
    completedAttemptsScanned: number; matchedExposures: number; unmatchedAttempts: number;
    malformedReviewAttempts: number; directLinkages: number; legacyLinkages: number; duplicateSnapshotItems: number;
    invalidSelectedOptionItems: number; answerKeyMismatchItems: number; answered: number; skipped: number;
    correct: number; incorrect: number; flagged: number; timedResponses: number; averageTimeSeconds: number | null;
    answerRate: number; skipRate: number; accuracy: number | null; facility: number; flagRate: number;
  };
  optionSelection: OptionRow[];
  dailyTrend: Array<{ day: string; exposures: number; answered: number; correct: number; skipped: number; flagged: number; timedResponses: number; accuracy: number | null; skipRate: number; flagRate: number; averageTimeSeconds: number | null }>;
  diagnostics: Array<{ code: string; severity: 'warning' | 'critical'; message: string }>;
  qualityState: 'clean' | 'warning' | 'critical';
  scanTruncated: boolean;
  capabilities: { questionTiming: boolean; directQuestionLinkage: boolean; discrimination: boolean };
};

export function QuestionAnalyticsPage() {
  const [days, setDays] = useState('30');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ days, limit: '150' });
      if (appliedSearch) params.set('search', appliedSearch);
      setData(await request<AnalyticsResponse>(`/admin/analytics/questions?${params}`));
    } catch (error) {
      showToast.error('Unable to load Question Analytics', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [days, appliedSearch]);

  const linkageTotal = Number(data?.summary.directLinkages ?? 0) + Number(data?.summary.legacyLinkages ?? 0);
  const directCoverage = linkageTotal > 0 ? (Number(data?.summary.directLinkages ?? 0) / linkageTotal) * 100 : null;
  const hasQualityIssue = (data?.summary.unmatchedReviewItems ?? 0) > 0
    || (data?.summary.malformedReviewAttempts ?? 0) > 0
    || (data?.summary.invalidResponseItems ?? 0) > 0
    || (data?.summary.stableCollisionGroups ?? 0) > 0
    || (data?.summary.duplicateQuestionPlacements ?? 0) > 0;

  return <div className="space-y-5">
    <PageHeader title="Question Analytics" description="Canonical question exposure, immutable answer-key scoring, direct linkage, legacy reconstruction and optional timing evidence." icon={<BarChart3 className="h-5 w-5" />} actions={<><Button asChild variant="outline"><Link to="/analytics/questions/quality"><ShieldCheck className="mr-1.5 h-4 w-4" />Data quality</Link></Button><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button></>} />
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search stem, question-version ID or test" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><WindowSelect value={days} onChange={setDays} /></CardContent></Card>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Attempts scanned" value={number(data?.summary.completedAttemptsScanned)} /><Metric label="Questions exposed" value={number(data?.summary.questionsWithExposure)} /><Metric label="Overall accuracy" value={percent(data?.summary.overallAccuracy)} /><Metric label="Average question time" value={seconds(data?.summary.averageQuestionTimeSeconds)} /><Metric label="Direct linkage" value={percent(directCoverage)} /><Metric label="Unmatched items" value={number(data?.summary.unmatchedReviewItems)} /></div>

    {(hasQualityIssue || data?.scanTruncated) && <Card className="border-warning/40"><CardContent className="p-4"><p className="font-medium">Question Analytics evidence requires review</p><p className="mt-1 text-sm text-muted-foreground">Unmatched {number(data?.summary.unmatchedReviewItems)}, malformed attempts {number(data?.summary.malformedReviewAttempts)}, invalid responses {number(data?.summary.invalidResponseItems)}, stable-ID collisions {number(data?.summary.stableCollisionGroups)}, duplicate placements {number(data?.summary.duplicateQuestionPlacements)}.{data?.scanTruncated ? ' The completed-attempt scan reached its safety limit.' : ''} Open Data quality for publication-level diagnostics.</p></CardContent></Card>}

    <Card><CardHeader><CardTitle className="text-base">Question performance</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Question</TableHead><TableHead className="text-right">Exposure</TableHead><TableHead className="text-right">Accuracy</TableHead><TableHead className="text-right">Skip</TableHead><TableHead className="text-right">Avg time</TableHead><TableHead>Linkage</TableHead><TableHead>Option selection</TableHead></TableRow></TableHeader><TableBody>{data?.questions.length ? data.questions.map((row) => <TableRow key={`${row.publicationId}:${row.questionVersionId}`}><TableCell className="max-w-xl"><Link className="line-clamp-3 font-medium hover:underline" to={`/analytics/questions/${row.questionVersionId}?publicationId=${row.publicationId}&days=${days}`}>{row.stem}</Link><p className="mt-1 text-xs text-muted-foreground">{row.testTitle} · {row.testPublicCode} · {row.sectionName}</p><p className="text-[11px] text-muted-foreground">{row.questionVersionId}{row.duplicatePlacements > 1 ? ` · ${row.duplicatePlacements} placements` : ''}</p></TableCell><TableCell className="text-right">{number(row.exposures)}</TableCell><TableCell className="text-right">{percent(row.accuracy)}</TableCell><TableCell className="text-right">{percent(row.skipRate)}</TableCell><TableCell className="text-right">{seconds(row.averageTimeSeconds)}</TableCell><TableCell><div className="flex flex-wrap gap-1"><StatusBadge tone={row.linkageMethod === 'direct' ? 'success' : row.linkageMethod === 'mixed' ? 'warning' : 'neutral'}>{row.linkageMethod}</StatusBadge><span className="text-[11px] text-muted-foreground">{number(row.directLinkages)} direct · {number(row.legacyLinkages)} legacy</span></div></TableCell><TableCell><OptionList options={row.optionSelection} /></TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical question analytics…' : 'No question exposure matches this period and search.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
    {data?.truncated && <p className="text-center text-xs text-muted-foreground">Only the highest-exposure matching questions are shown. Refine the search to inspect a narrower cohort.</p>}
    <ScopeBoundary reason={data?.capabilities.reason} />
  </div>;
}

export function QuestionAnalyticsDetailPage() {
  const { questionVersionId } = useParams();
  const query = new URLSearchParams(window.location.search);
  const publicationId = query.get('publicationId') || '';
  const [days, setDays] = useState(query.get('days') || '30');
  const [data, setData] = useState<QuestionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    if (!questionVersionId || !publicationId) return;
    setLoading(true);
    try { setData(await request<QuestionDetail>(`/admin/analytics/questions/${encodeURIComponent(questionVersionId)}?publicationId=${encodeURIComponent(publicationId)}&days=${days}`)); }
    catch (error) { showToast.error('Unable to load question drilldown', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [questionVersionId, publicationId, days]);
  if (loading && !data) return <div className="py-12 text-center text-sm text-muted-foreground">Loading question drilldown…</div>;
  if (!data) return <div className="py-12 text-center text-sm text-muted-foreground">Question drilldown is unavailable.</div>;

  return <div className="space-y-5">
    <PageHeader title="Question performance drilldown" description={`${data.question.testTitle} · ${data.question.testPublicCode} · ${data.question.sectionName}`} icon={<BarChart3 className="h-5 w-5" />} actions={<><WindowSelect value={days} onChange={setDays} /><Button asChild variant="outline"><Link to="/analytics/questions/quality"><ShieldCheck className="mr-1.5 h-4 w-4" />Data quality</Link></Button><Button asChild variant="outline"><Link to="/analytics/questions">Back to questions</Link></Button></>} />
    <Card><CardContent className="p-5"><p className="text-base font-medium">{data.question.stem}</p><p className="mt-2 text-xs text-muted-foreground">Question version {data.question.questionVersionId} · Publication {data.question.publicationNumber} · Stable runner ID {data.question.stableQuestionId} · {data.question.duplicatePlacements} placement(s)</p></CardContent></Card>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Matched exposure" value={number(data.summary.matchedExposures)} /><Metric label="Accuracy" value={percent(data.summary.accuracy)} /><Metric label="Skip rate" value={percent(data.summary.skipRate)} /><Metric label="Average time" value={seconds(data.summary.averageTimeSeconds)} /><Metric label="Direct linkage" value={number(data.summary.directLinkages)} /><Metric label="Legacy linkage" value={number(data.summary.legacyLinkages)} /></div>

    <Card className={data.qualityState === 'critical' ? 'border-destructive/40' : data.qualityState === 'warning' ? 'border-warning/40' : ''}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4" />Canonical diagnostics <StatusBadge tone={data.qualityState === 'critical' ? 'destructive' : data.qualityState === 'warning' ? 'warning' : 'success'}>{data.qualityState}</StatusBadge></CardTitle></CardHeader><CardContent>{data.diagnostics.length ? <div className="space-y-2">{data.diagnostics.map((item) => <div key={item.code} className="rounded-md border p-3"><p className="text-sm font-medium">{item.code}</p><p className="text-xs text-muted-foreground">{item.message}</p></div>)}</div> : <p className="text-sm text-muted-foreground">No declared anomaly threshold is triggered in this reporting window.</p>}</CardContent></Card>

    <div className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle className="text-base">Option-selection diagnostics</CardTitle></CardHeader><CardContent><OptionList options={data.optionSelection} showCorrect /></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Daily response trend</CardTitle></CardHeader><CardContent className="space-y-2">{data.dailyTrend.length ? data.dailyTrend.map((row) => <div key={row.day} className="grid grid-cols-[90px_1fr_1fr_1fr] gap-2 rounded-md border p-3 text-xs"><span>{row.day}</span><span>Exposure {number(row.exposures)}</span><span>Accuracy {percent(row.accuracy)}</span><span><Clock className="mr-1 inline h-3 w-3" />{seconds(row.averageTimeSeconds)}</span></div>) : <p className="text-sm text-muted-foreground">No matched daily response evidence exists.</p>}</CardContent></Card></div>

    {(data.summary.unmatchedAttempts > 0 || data.summary.malformedReviewAttempts > 0 || data.scanTruncated) && <Card className="border-destructive/30"><CardContent className="p-4"><p className="font-medium">Linkage or scan gap detected</p><p className="mt-1 text-sm text-muted-foreground">Unmatched attempts {number(data.summary.unmatchedAttempts)}, malformed reviews {number(data.summary.malformedReviewAttempts)}, invalid options {number(data.summary.invalidSelectedOptionItems)}, answer-key mismatches {number(data.summary.answerKeyMismatchItems)}.{data.scanTruncated ? ' The scan reached its safety limit.' : ''} Excluded evidence is never guessed.</p></CardContent></Card>}
    <ScopeBoundary reason={data.capabilities.questionTiming ? 'Per-question timing is shown only for snapshots that persist canonical timeTakenSeconds. Discrimination remains unavailable until a separately validated cohort method is implemented.' : undefined} />
  </div>;
}

function WindowSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) { return <Select value={value} onValueChange={onChange}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem><SelectItem value="365">Last 365 days</SelectItem></SelectContent></Select>; }
function OptionList({ options, showCorrect = false }: { options: OptionRow[]; showCorrect?: boolean }) { return <div className="min-w-56 space-y-2">{options.map((option) => <div key={option.key} className="flex items-center justify-between gap-3 rounded-md border p-2 text-xs"><span className="truncate">{option.key}. {option.text} {showCorrect && option.isCorrect ? '· correct' : ''}</span><span className="shrink-0 font-medium">{number(option.count)} · {percent(option.shareOfAnswered)}</span></div>)}</div>; }
function ScopeBoundary({ reason }: { reason?: string }) { return <Card className="border-dashed"><CardContent className="p-4"><div className="flex items-start gap-2"><Target className="mt-0.5 h-4 w-4" /><div><p className="font-medium">Declared scope boundary</p><p className="mt-1 text-sm text-muted-foreground">{reason || 'Direct immutable linkage and optional per-question timing are available for new snapshots; legacy snapshots remain reconstruction-only. Discrimination remains unavailable until its cohort contract is validated.'}</p><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Flag className="h-3.5 w-3.5" />Analytics are read-only and never modify questions, attempts or result snapshots.</p></div></div></CardContent></Card>; }
function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></CardContent></Card>; }

export default QuestionAnalyticsPage;
