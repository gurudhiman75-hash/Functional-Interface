import { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw, Search, ShieldCheck } from 'lucide-react';

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
const date = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Analytics quality request failed (${response.status}).`);
  if (!body) throw new Error('Analytics quality returned an empty response.');
  return body;
}

type QualityRow = {
  publicationId: string; publicationNumber: number; testPublicCode: string; testTitle: string;
  totalAttempts: number; completedAttempts: number; missingFinalScore: number; missingEvaluatedAt: number;
  missingResultSnapshot: number; missingResponseCounts: number; responseCountMismatch: number;
  negativeTimeSpent: number; scoredSample: number; latestActivityAt: string | null; questionCount: number;
  issueCount: number; state: 'clean' | 'warning' | 'critical'; sampleReliability: 'limited' | 'usable' | 'strong';
};
type QualityResponse = {
  windowDays: number;
  summary: { publications: number; critical: number; warning: number; clean: number; issues: number; limitedSamples: number };
  publications: QualityRow[];
  thresholds: { usableSample: number; strongSample: number };
  freshness: { latestActivityAt: string | null };
};

export function TestAnalyticsQualityPage() {
  const [windowDays, setWindowDays] = useState('30');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<QualityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ days: windowDays });
      if (appliedSearch) params.set('search', appliedSearch);
      setData(await request<QualityResponse>(`/admin/analytics/tests/quality?${params}`));
    } catch (error) {
      showToast.error('Unable to load analytics quality', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [windowDays, appliedSearch]);

  return <div className="space-y-5">
    <PageHeader title="Test Analytics Data Quality" description="Read-only diagnostics for canonical attempt completeness, cohort reliability and analytics freshness." icon={<ShieldCheck className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />

    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search test title or public code" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={windowDays} onValueChange={setWindowDays}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem><SelectItem value="365">Last 365 days</SelectItem></SelectContent></Select></CardContent></Card>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <Metric label="Publications scanned" value={number(data?.summary.publications)} />
      <Metric label="Critical" value={number(data?.summary.critical)} />
      <Metric label="Warnings" value={number(data?.summary.warning)} />
      <Metric label="Clean" value={number(data?.summary.clean)} />
      <Metric label="Total issues" value={number(data?.summary.issues)} />
      <Metric label="Limited samples" value={number(data?.summary.limitedSamples)} />
    </div>

    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Reliability thresholds and freshness</p><p className="mt-1 text-sm text-muted-foreground">Samples below {number(data?.thresholds.usableSample)} scored attempts are limited; {number(data?.thresholds.strongSample)} or more are strong. Latest canonical activity: {date(data?.freshness.latestActivityAt)}. Diagnostics never modify attempts.</p></CardContent></Card>

    <Card><CardHeader><CardTitle className="text-base">Publication diagnostics</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Publication</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Issues</TableHead><TableHead className="text-right">Scored sample</TableHead><TableHead className="text-right">Missing score</TableHead><TableHead className="text-right">Missing snapshot</TableHead><TableHead className="text-right">Count mismatch</TableHead><TableHead>Latest activity</TableHead></TableRow></TableHeader><TableBody>
      {data?.publications.length ? data.publications.map((row) => <TableRow key={row.publicationId}><TableCell><p className="font-medium">{row.testTitle}</p><p className="text-xs text-muted-foreground">{row.testPublicCode} · Publication {row.publicationNumber}</p></TableCell><TableCell><div className="flex flex-wrap gap-1"><StatusBadge tone={row.state === 'critical' ? 'destructive' : row.state === 'warning' ? 'warning' : 'success'} dot>{row.state}</StatusBadge><StatusBadge tone={row.sampleReliability === 'limited' ? 'warning' : 'neutral'}>{row.sampleReliability} sample</StatusBadge></div></TableCell><TableCell className="text-right font-medium">{number(row.issueCount)}</TableCell><TableCell className="text-right">{number(row.scoredSample)}</TableCell><TableCell className="text-right">{number(row.missingFinalScore)}</TableCell><TableCell className="text-right">{number(row.missingResultSnapshot)}</TableCell><TableCell className="text-right">{number(row.responseCountMismatch)}</TableCell><TableCell className="text-xs text-muted-foreground">{date(row.latestActivityAt)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={8} className="py-12 text-center text-muted-foreground">{loading ? 'Loading quality diagnostics…' : 'No publications match the selected period and search.'}</TableCell></TableRow>}
    </TableBody></Table></CardContent></Card>

    {(data?.summary.critical ?? 0) > 0 && <Card className="border-destructive/30"><CardContent className="flex items-start gap-2 p-4"><AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" /><div><p className="font-semibold">Analytics evidence requires review</p><p className="text-sm text-muted-foreground">Critical diagnostics indicate incomplete canonical attempt evidence. Investigate the affected attempts through Attempt Administration; do not correct analytics by editing aggregate outputs.</p></div></CardContent></Card>}
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></CardContent></Card>; }

export default TestAnalyticsQualityPage;
