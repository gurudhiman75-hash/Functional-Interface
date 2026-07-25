import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BarChart3, Clock, RefreshCw, Search, Target, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const number = (value: unknown) => Number(value ?? 0).toLocaleString();
const score = (value: unknown) => value == null ? '—' : Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 });
const duration = (seconds: unknown) => {
  const value = Math.max(0, Number(seconds ?? 0));
  if (!value) return '—';
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};
const date = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Test Analytics request failed (${response.status}).`);
  if (!body) throw new Error('Test Analytics returned an empty response.');
  return body;
}

type Summary = {
  totalAttempts: number; completedAttempts: number; evaluatedAttempts: number; practiceEvaluatedAttempts: number;
  uniqueStudents: number; publicationsAttempted: number; averageFinalScore: number | null; averageTimeSeconds: number | null; completionRate: number;
};
type TestRow = {
  testId: string; testPublicCode: string; testTitle: string; publicationId: string; publicationNumber: number;
  totalAttempts: number; completedAttempts: number; evaluatedAttempts: number; practiceEvaluatedAttempts: number;
  uniqueStudents: number; averageFinalScore: number | null; minimumFinalScore: number | null; maximumFinalScore: number | null;
  averageTimeSeconds: number | null; latestActivityAt: string | null; completionRate: number;
};
type TrendRow = { day: string; attempts: number; completed: number; uniqueStudents?: number; averageFinalScore: number | null; completionRate: number };
type ScoreBand = { band: string; count: number; minimumScore: number | null; maximumScore: number | null };
type AnalyticsResponse = {
  windowDays: number; summary: Summary; tests: TestRow[]; dailyTrend: TrendRow[]; scoreDistribution: ScoreBand[];
  capabilities: { sectionAnalytics: boolean; questionAnalytics: boolean; cohortPercentiles: boolean; studentRank: boolean; reason: string };
};

type PublicationDetail = {
  windowDays: number;
  publication: { publicationId: string; publicationNumber: number; publishedAt: string | null; closesAt: string | null; testId: string; testPublicCode: string; testVersionId: string; testTitle: string; durationSeconds: number };
  summary: Summary & { inProgressAttempts: number; abandonedAttempts: number; scoredAttempts: number; averageCorrect: number | null; averageIncorrect: number | null; averageUnattempted: number | null; minimumFinalScore: number | null; maximumFinalScore: number | null };
  cohortPercentiles: { sample: number; p10: number | null; p25: number | null; median: number | null; p75: number | null; p90: number | null; method: string };
  scoreDeciles: Array<{ decile: number; count: number; minimumScore: number; maximumScore: number; averageScore: number }>;
  dailyTrend: TrendRow[];
};

export function TestAnalyticsPage() {
  const [windowDays, setWindowDays] = useState('30');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ days: windowDays, limit: '50' });
      if (appliedSearch) params.set('search', appliedSearch);
      setData(await request<AnalyticsResponse>(`/admin/analytics/tests?${params}`));
    } catch (error) {
      showToast.error('Unable to load test analytics', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [windowDays, appliedSearch]);
  const peakAttempts = useMemo(() => Math.max(1, ...(data?.dailyTrend.map((row) => Number(row.attempts)) ?? [1])), [data]);

  return <div className="space-y-5">
    <PageHeader title="Test Analytics" description="Canonical attempt volume, completion, score and timing aggregates from immutable test publications." icon={<BarChart3 className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search test title or public code" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={windowDays} onValueChange={setWindowDays}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem><SelectItem value="365">Last 365 days</SelectItem></SelectContent></Select></CardContent></Card>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric icon={<BarChart3 className="h-4 w-4" />} label="Attempts" value={number(data?.summary.totalAttempts)} /><Metric icon={<Target className="h-4 w-4" />} label="Completion" value={`${score(data?.summary.completionRate)}%`} /><Metric icon={<Users className="h-4 w-4" />} label="Unique students" value={number(data?.summary.uniqueStudents)} /><Metric icon={<BarChart3 className="h-4 w-4" />} label="Average final score" value={score(data?.summary.averageFinalScore)} /><Metric icon={<Clock className="h-4 w-4" />} label="Average time" value={duration(data?.summary.averageTimeSeconds)} /><Metric icon={<Target className="h-4 w-4" />} label="Publications" value={number(data?.summary.publicationsAttempted)} /></div>
    <div className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle className="text-base">Daily attempt trend</CardTitle></CardHeader><CardContent className="space-y-2">{data?.dailyTrend.length ? data.dailyTrend.map((row) => <div key={row.day} className="grid grid-cols-[86px_1fr_70px] items-center gap-3 text-xs"><span className="text-muted-foreground">{new Date(`${row.day}T00:00:00`).toLocaleDateString()}</span><div className="h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(2, (Number(row.attempts) / peakAttempts) * 100)}%` }} /></div><span className="text-right font-medium">{number(row.attempts)}</span></div>) : <Empty loading={loading} text="No attempt activity exists in this period." />}</CardContent></Card><Card><CardHeader><CardTitle className="text-base">Relative score distribution</CardTitle></CardHeader><CardContent className="space-y-3">{data?.scoreDistribution.some((band) => Number(band.count) > 0) ? data.scoreDistribution.filter((band) => Number(band.count) > 0).map((band) => <div key={band.band} className="flex items-center justify-between rounded-md border p-3"><div><p className="text-sm font-medium">{band.band}</p><p className="text-xs text-muted-foreground">Observed range {score(band.minimumScore)} to {score(band.maximumScore)}</p></div><span className="text-lg font-semibold">{number(band.count)}</span></div>) : <Empty loading={loading} text="No scored attempts exist in this period." />}</CardContent></Card></div>
    <Card><CardHeader><CardTitle className="text-base">Performance by immutable publication</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Test</TableHead><TableHead className="text-right">Attempts</TableHead><TableHead className="text-right">Students</TableHead><TableHead className="text-right">Completion</TableHead><TableHead className="text-right">Average score</TableHead><TableHead className="text-right">Average time</TableHead><TableHead>Latest activity</TableHead></TableRow></TableHeader><TableBody>{data?.tests.length ? data.tests.map((test) => <TableRow key={test.publicationId}><TableCell><Link className="font-medium hover:underline" to={`/analytics/tests/${test.publicationId}?days=${windowDays}`}>{test.testTitle}</Link><p className="text-xs text-muted-foreground">{test.testPublicCode} · Publication {test.publicationNumber}</p></TableCell><TableCell className="text-right">{number(test.totalAttempts)}</TableCell><TableCell className="text-right">{number(test.uniqueStudents)}</TableCell><TableCell className="text-right">{score(test.completionRate)}%</TableCell><TableCell className="text-right">{score(test.averageFinalScore)}</TableCell><TableCell className="text-right">{duration(test.averageTimeSeconds)}</TableCell><TableCell className="text-xs text-muted-foreground">{date(test.latestActivityAt)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7}><Empty loading={loading} text="No tests match the selected period and search." /></TableCell></TableRow>}</TableBody></Table></CardContent></Card>
    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Deliberately deferred analytics</p><p className="mt-1 text-sm text-muted-foreground">{data?.capabilities.reason || 'Section, question and student-rank analytics remain unavailable until their canonical contracts are verified.'}</p></CardContent></Card>
  </div>;
}

export function TestAnalyticsDetailPage() {
  const { publicationId } = useParams();
  const initialDays = new URLSearchParams(window.location.search).get('days') || '30';
  const [windowDays, setWindowDays] = useState(initialDays);
  const [data, setData] = useState<PublicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    if (!publicationId) return;
    setLoading(true);
    try { setData(await request<PublicationDetail>(`/admin/analytics/tests/${encodeURIComponent(publicationId)}?days=${windowDays}`)); }
    catch (error) { showToast.error('Unable to load publication analytics', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [publicationId, windowDays]);
  if (loading && !data) return <Empty loading text="Loading publication analytics…" />;
  if (!data) return <Empty loading={false} text="Publication analytics are unavailable." />;
  const p = data.cohortPercentiles;
  return <div className="space-y-5">
    <PageHeader title={data.publication.testTitle} description={`${data.publication.testPublicCode} · Publication ${data.publication.publicationNumber} · Cohort analytics from canonical completed attempts`} icon={<BarChart3 className="h-5 w-5" />} actions={<><Select value={windowDays} onValueChange={setWindowDays}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem><SelectItem value="365">Last 365 days</SelectItem></SelectContent></Select><Button asChild variant="outline"><Link to="/analytics/tests">Back to analytics</Link></Button></>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric icon={<BarChart3 className="h-4 w-4" />} label="Attempts" value={number(data.summary.totalAttempts)} /><Metric icon={<Target className="h-4 w-4" />} label="Completion" value={`${score(data.summary.completionRate)}%`} /><Metric icon={<Users className="h-4 w-4" />} label="Students" value={number(data.summary.uniqueStudents)} /><Metric icon={<BarChart3 className="h-4 w-4" />} label="Average score" value={score(data.summary.averageFinalScore)} /><Metric icon={<Clock className="h-4 w-4" />} label="Average time" value={duration(data.summary.averageTimeSeconds)} /><Metric icon={<Target className="h-4 w-4" />} label="Scored sample" value={number(data.summary.scoredAttempts)} /></div>
    <Card><CardHeader><CardTitle className="text-base">Cohort score percentiles</CardTitle></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5"><Percentile label="P10" value={p.p10} /><Percentile label="P25" value={p.p25} /><Percentile label="Median" value={p.median} /><Percentile label="P75" value={p.p75} /><Percentile label="P90" value={p.p90} /></div><p className="mt-3 text-xs text-muted-foreground">Sample: {number(p.sample)} scored attempts. {p.method}</p></CardContent></Card>
    <div className="grid gap-4 xl:grid-cols-2"><Card><CardHeader><CardTitle className="text-base">Score deciles</CardTitle></CardHeader><CardContent className="space-y-2">{data.scoreDeciles.length ? data.scoreDeciles.map((row) => <div key={row.decile} className="flex items-center justify-between rounded-md border p-3 text-sm"><div><p className="font-medium">Decile {row.decile}</p><p className="text-xs text-muted-foreground">{score(row.minimumScore)} to {score(row.maximumScore)} · avg {score(row.averageScore)}</p></div><span className="font-semibold">{number(row.count)}</span></div>) : <Empty loading={false} text="No scored cohort exists in this period." />}</CardContent></Card><Card><CardHeader><CardTitle className="text-base">Outcome profile</CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2"><Detail label="Evaluated" value={number(data.summary.evaluatedAttempts)} /><Detail label="Practice evaluated" value={number(data.summary.practiceEvaluatedAttempts)} /><Detail label="In progress" value={number(data.summary.inProgressAttempts)} /><Detail label="Abandoned" value={number(data.summary.abandonedAttempts)} /><Detail label="Average correct" value={score(data.summary.averageCorrect)} /><Detail label="Average incorrect" value={score(data.summary.averageIncorrect)} /><Detail label="Average unattempted" value={score(data.summary.averageUnattempted)} /><Detail label="Published" value={date(data.publication.publishedAt)} /></CardContent></Card></div>
    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Scope boundary</p><p className="mt-1 text-sm text-muted-foreground">These are aggregate cohort percentiles, not student ranks. Section and question analytics remain unavailable until canonical response linkage is verified.</p></CardContent></Card>
  </div>;
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div><p className="mt-2 text-xl font-semibold">{value}</p></CardContent></Card>; }
function Percentile({ label, value }: { label: string; value: unknown }) { return <div className="rounded-lg border p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{score(value)}</p></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border bg-muted/20 p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }
function Empty({ loading, text }: { loading: boolean; text: string }) { return <div className="py-8 text-center text-sm text-muted-foreground">{loading ? 'Loading canonical analytics…' : text}</div>; }

export default TestAnalyticsPage;
