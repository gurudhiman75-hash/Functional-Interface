import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

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
const date = (value: unknown) => value ? new Date(String(value)).toLocaleString() : '—';

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Question Analytics quality request failed (${response.status}).`);
  if (!body) throw new Error('Question Analytics quality returned an empty response.');
  return body;
}

type QualityRow = {
  publicationId: string; publicationNumber: number; testPublicCode: string; testTitle: string;
  questionCount: number; completedAttemptsScanned: number; reviewedItems: number; matchedItems: number;
  directLinkages: number; legacyLinkages: number; unmatchedReviewItems: number; malformedReviewAttempts: number;
  missingQuestionItems: number; invalidOptionSelections: number; answerKeyMismatches: number;
  identifierMismatchItems: number; duplicateSnapshotItems: number; stableIdCollisions: number;
  duplicateQuestionPlacements: number; limitedSampleQuestions: number; latestActivityAt: string | null;
  directCoverageRate: number; issueCount: number; state: 'clean' | 'warning' | 'critical';
};

type QualityResponse = {
  windowDays: number;
  summary: {
    publications: number; critical: number; warning: number; clean: number; completedAttemptsScanned: number;
    reviewedItems: number; directLinkages: number; legacyLinkages: number; unmatchedReviewItems: number;
    malformedReviewAttempts: number; missingQuestionItems: number; invalidOptionSelections: number;
    answerKeyMismatches: number; stableIdCollisions: number; duplicateQuestionPlacements: number;
    directCoverageRate: number;
  };
  publications: QualityRow[];
  truncated: boolean;
  scanTruncated: boolean;
  thresholds: { usableExposure: number; attemptScanLimit: number; visiblePublicationLimit: number };
  freshness: { latestActivityAt: string | null };
};

export function QuestionAnalyticsQualityPage() {
  const [days, setDays] = useState('30');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<QualityResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ days });
      if (appliedSearch) params.set('search', appliedSearch);
      setData(await request<QualityResponse>(`/admin/analytics/questions/quality?${params}`));
    } catch (error) {
      showToast.error('Unable to load Question Analytics quality', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [days, appliedSearch]);

  return <div className="space-y-5">
    <PageHeader
      title="Question Analytics Data Quality"
      description="Read-only diagnostics for direct linkage, legacy reconstruction, snapshot completeness and immutable answer-key consistency."
      icon={<ShieldCheck className="h-5 w-5" />}
      actions={<><Button asChild variant="outline"><Link to="/analytics/questions"><ArrowLeft className="mr-1.5 h-4 w-4" />Question Analytics</Link></Button><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button></>}
    />

    <Card><CardContent className="flex flex-col gap-3 p-4 md:flex-row"><div className="flex flex-1 gap-2"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search test, question stem or question-version ID" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></div><Select value={days} onValueChange={setDays}><SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Last 7 days</SelectItem><SelectItem value="30">Last 30 days</SelectItem><SelectItem value="90">Last 90 days</SelectItem><SelectItem value="365">Last 365 days</SelectItem></SelectContent></Select></CardContent></Card>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
      <Metric label="Publications scanned" value={number(data?.summary.publications)} />
      <Metric label="Critical" value={number(data?.summary.critical)} />
      <Metric label="Warnings" value={number(data?.summary.warning)} />
      <Metric label="Clean" value={number(data?.summary.clean)} />
      <Metric label="Direct linkage" value={percent(data?.summary.directCoverageRate)} />
      <Metric label="Unmatched items" value={number(data?.summary.unmatchedReviewItems)} />
    </div>

    {(data?.scanTruncated || data?.truncated) && <Card className="border-warning/40"><CardContent className="flex items-start gap-2 p-4"><AlertTriangle className="mt-0.5 h-4 w-4" /><div><p className="font-medium">Diagnostic result boundary reached</p><p className="text-sm text-muted-foreground">{data.scanTruncated ? `The scan is capped at ${number(data.thresholds.attemptScanLimit)} completed attempts. ` : ''}{data.truncated ? `Only ${number(data.thresholds.visiblePublicationLimit)} publication rows are displayed; summary totals still cover every matched publication in the scan.` : ''}</p></div></CardContent></Card>}

    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Quality contract</p><p className="mt-1 text-sm text-muted-foreground">New snapshots use direct test-question and question-version identifiers. Legacy stable-ID linkage remains supported only when collision-free. Questions below {number(data?.thresholds.usableExposure)} exposures are marked as limited samples. Latest evaluated activity: {date(data?.freshness.latestActivityAt)}.</p></CardContent></Card>

    <Card><CardHeader><CardTitle className="text-base">Publication diagnostics</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Publication</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Attempts</TableHead><TableHead className="text-right">Direct</TableHead><TableHead className="text-right">Unmatched</TableHead><TableHead className="text-right">Malformed</TableHead><TableHead className="text-right">Missing</TableHead><TableHead className="text-right">Invalid option</TableHead><TableHead className="text-right">Key mismatch</TableHead><TableHead className="text-right">Collision / duplicate</TableHead></TableRow></TableHeader><TableBody>
      {data?.publications.length ? data.publications.map((row) => <TableRow key={row.publicationId}><TableCell><p className="font-medium">{row.testTitle}</p><p className="text-xs text-muted-foreground">{row.testPublicCode} · Publication {row.publicationNumber} · {number(row.questionCount)} questions</p></TableCell><TableCell><div className="flex flex-wrap gap-1"><StatusBadge tone={row.state === 'critical' ? 'destructive' : row.state === 'warning' ? 'warning' : 'success'} dot>{row.state}</StatusBadge>{row.legacyLinkages > 0 && <StatusBadge tone="neutral">legacy {number(row.legacyLinkages)}</StatusBadge>}</div></TableCell><TableCell className="text-right">{number(row.completedAttemptsScanned)}</TableCell><TableCell className="text-right">{percent(row.directCoverageRate)}</TableCell><TableCell className="text-right">{number(row.unmatchedReviewItems)}</TableCell><TableCell className="text-right">{number(row.malformedReviewAttempts)}</TableCell><TableCell className="text-right">{number(row.missingQuestionItems)}</TableCell><TableCell className="text-right">{number(row.invalidOptionSelections)}</TableCell><TableCell className="text-right">{number(row.answerKeyMismatches)}</TableCell><TableCell className="text-right">{number(row.stableIdCollisions + row.duplicateQuestionPlacements + row.duplicateSnapshotItems)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={10} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical quality diagnostics…' : 'No publications match this reporting window and search.'}</TableCell></TableRow>}
    </TableBody></Table></CardContent></Card>

    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Remediation boundary</p><p className="mt-1 text-sm text-muted-foreground">Never repair analytics by editing aggregate outputs or historical result snapshots. Investigate malformed attempts through Attempt Administration and correct future runner or publication contracts at their canonical source.</p></CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold">{value}</p></CardContent></Card>; }

export default QuestionAnalyticsQualityPage;
