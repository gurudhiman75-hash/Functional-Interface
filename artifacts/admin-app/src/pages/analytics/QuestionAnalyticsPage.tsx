import { useEffect, useState } from 'react';
import { BarChart3, Flag, RefreshCw, Search, Target } from 'lucide-react';

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
const percent = (value: unknown) => value == null ? '—' : `${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Question Analytics request failed (${response.status}).`);
  if (!body) throw new Error('Question Analytics returned an empty response.');
  return body;
}

type QuestionRow = {
  publicationId: string; questionVersionId: string; testPublicCode: string; testTitle: string; sectionName: string; stem: string;
  exposures: number; answered: number; skipped: number; correct: number; incorrect: number; flagged: number;
  answerRate: number; skipRate: number; accuracy: number | null; facility: number; flagRate: number;
  optionSelection: Array<{ key: string; text: string; count: number; shareOfAnswered: number }>;
};
type AnalyticsResponse = {
  summary: { completedAttemptsScanned: number; questionsWithExposure: number; responseItems: number; answeredItems: number; skippedItems: number; overallAccuracy: number | null; unmatchedReviewItems: number; reviewedItems: number };
  questions: QuestionRow[]; truncated: boolean;
  capabilities: { correctness: boolean; optionSelection: boolean; flagAnalytics: boolean; questionTiming: boolean; discrimination: boolean; reason: string };
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

  return <div className="space-y-5">
    <PageHeader title="Question Analytics" description="Canonical exposure, response, correctness, option-selection and flag aggregates reconstructed from immutable publication results." icon={<BarChart3 className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search stem, question-version ID or test" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={days} onValueChange={setDays}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem><SelectItem value="365">Last 365 days</SelectItem></SelectContent></Select></CardContent></Card>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Attempts scanned" value={number(data?.summary.completedAttemptsScanned)} /><Metric label="Questions exposed" value={number(data?.summary.questionsWithExposure)} /><Metric label="Response items" value={number(data?.summary.responseItems)} /><Metric label="Answered" value={number(data?.summary.answeredItems)} /><Metric label="Skipped" value={number(data?.summary.skippedItems)} /><Metric label="Overall accuracy" value={percent(data?.summary.overallAccuracy)} /></div>
    {(data?.summary.unmatchedReviewItems ?? 0) > 0 && <Card className="border-warning/40"><CardContent className="p-4"><p className="font-medium">Question linkage requires review</p><p className="mt-1 text-sm text-muted-foreground">{number(data?.summary.unmatchedReviewItems)} of {number(data?.summary.reviewedItems)} result items could not be matched back to an immutable question version. These items are excluded rather than guessed.</p></CardContent></Card>}
    <Card><CardHeader><CardTitle className="text-base">Question performance</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Question</TableHead><TableHead className="text-right">Exposure</TableHead><TableHead className="text-right">Answer rate</TableHead><TableHead className="text-right">Accuracy</TableHead><TableHead className="text-right">Skip rate</TableHead><TableHead className="text-right">Flag rate</TableHead><TableHead>Option selection</TableHead></TableRow></TableHeader><TableBody>{data?.questions.length ? data.questions.map((row) => <TableRow key={`${row.publicationId}:${row.questionVersionId}`}><TableCell className="max-w-xl"><p className="line-clamp-3 font-medium">{row.stem}</p><p className="mt-1 text-xs text-muted-foreground">{row.testTitle} · {row.testPublicCode} · {row.sectionName}</p><p className="text-[11px] text-muted-foreground">{row.questionVersionId}</p></TableCell><TableCell className="text-right">{number(row.exposures)}</TableCell><TableCell className="text-right">{percent(row.answerRate)}</TableCell><TableCell className="text-right">{percent(row.accuracy)}</TableCell><TableCell className="text-right">{percent(row.skipRate)}</TableCell><TableCell className="text-right">{percent(row.flagRate)}</TableCell><TableCell><div className="min-w-56 space-y-1">{row.optionSelection.map((option) => <div key={option.key} className="flex items-center justify-between gap-3 text-xs"><span className="truncate">{option.key}. {option.text}</span><span className="shrink-0 font-medium">{number(option.count)} · {percent(option.shareOfAnswered)}</span></div>)}</div></TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical question analytics…' : 'No question exposure matches this period and search.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
    {data?.truncated && <p className="text-center text-xs text-muted-foreground">Only the highest-exposure matching questions are shown. Refine the search to inspect a narrower cohort.</p>}
    <Card className="border-dashed"><CardContent className="p-4"><div className="flex items-start gap-2"><Target className="mt-0.5 h-4 w-4" /><div><p className="font-medium">Declared scope boundary</p><p className="mt-1 text-sm text-muted-foreground">{data?.capabilities.reason || 'Per-question timing and discrimination remain unavailable until the runner persists their canonical inputs.'}</p><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Flag className="h-3.5 w-3.5" />Analytics are read-only and never modify questions, attempts or result snapshots.</p></div></div></CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></CardContent></Card>; }

export default QuestionAnalyticsPage;
