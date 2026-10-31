import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, BarChart3, Globe2, GraduationCap, RefreshCw, ShoppingCart } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const windows = [7, 30, 90, 365] as const;

type BusinessData = {
  windowDays: number;
  generatedAt: string;
  summary: {
    paidOrders: number;
    payingStudents: number;
    netRevenueMinor: number;
    createdOrders: number;
    conversionBasisPoints: number;
    currency: string;
  };
};
type TrafficData = {
  source: 'cloudflare-web-analytics';
  windowDays: number;
  generatedAt: string;
  sampled: boolean;
  summary: { pageLoads: number; visits: number };
  daily: Array<{ day: string; pageLoads: number; visits: number }>;
  devices: Array<{ name: string; pageLoads: number }>;
  referrers: Array<{ name: string; pageLoads: number }>;
  note: string;
};
type TestData = {
  windowDays: number;
  summary: {
    totalAttempts: number;
    completedAttempts: number;
    uniqueStudents: number;
    publicationsAttempted: number;
    completionRate: number;
  };
  dailyTrend: Array<{ day: string; attempts: number; completed: number }>;
};

async function request<T>(path: string, signal: AbortSignal): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, {
    headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    signal,
  });
  const body = await response.json().catch(() => null) as (T & { error?: string }) | null;
  if (!response.ok) throw new Error(body?.error || `Analytics request failed (${response.status}).`);
  if (!body) throw new Error('Analytics service returned an empty response.');
  return body;
}

const integer = (n: number) => new Intl.NumberFormat('en-IN').format(n);
const money = (minor: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(minor / 100);
  } catch {
    return `${integer(minor / 100)} ${currency}`;
  }
};

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <Card><CardContent className="space-y-2 p-5">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-bold tabular-nums">{value}</p>
    <p className="text-xs text-muted-foreground">{detail}</p>
  </CardContent></Card>;
}

function SourceError({ title, error, link }: { title: string; error: string | null; link: string }) {
  return <Card><CardContent className="space-y-2 p-5">
    <p className="font-semibold">{title}</p>
    <p role="alert" className="text-sm text-muted-foreground">{error ? `Data unavailable: ${error}` : 'Loading verified data…'}</p>
    <Link className="text-sm text-primary underline" to={link}>Open detailed report</Link>
  </CardContent></Card>;
}

/**
 * Read-only cross-domain landing page. No synthetic traffic or student metrics.
 * Existing permission-protected canonical endpoints retain their own RBAC checks.
 */
export function PlatformAnalyticsPage() {
  const [windowDays, setWindowDays] = useState<(typeof windows)[number]>(30);
  const [refresh, setRefresh] = useState(0);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [tests, setTests] = useState<TestData | null>(null);
  const [traffic, setTraffic] = useState<TrafficData | null>(null);
  const [trafficError, setTrafficError] = useState<string | null>(null);
  const [businessError, setBusinessError] = useState<string | null>(null);
  const [testsError, setTestsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshNow = useCallback(() => setRefresh((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setBusiness(null);
    setTests(null);
    setTraffic(null);
    setTrafficError(null);
    setBusinessError(null);
    setTestsError(null);
    void Promise.allSettled([
      request<BusinessData>(`/admin/analytics/business?window=${windowDays}`, controller.signal)
        .then(setBusiness)
        .catch((error: unknown) => {
          if (!controller.signal.aborted) setBusinessError(error instanceof Error ? error.message : 'Unable to load business report.');
        }),
      request<TestData>(`/admin/analytics/tests?days=${windowDays}`, controller.signal)
        .then(setTests)
        .catch((error: unknown) => {
          if (!controller.signal.aborted) setTestsError(error instanceof Error ? error.message : 'Unable to load test report.');
        }),
      ...(windowDays <= 30 ? [
        request<TrafficData>(`/admin/analytics/traffic?window=${windowDays}`, controller.signal)
          .then(setTraffic)
          .catch((error: unknown) => {
            if (!controller.signal.aborted) setTrafficError(error instanceof Error ? error.message : 'Unable to load web traffic.');
          }),
      ] : []),
    ]).then(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [windowDays, refresh]);

  const recent = tests?.dailyTrend ?? [];
  const maximum = Math.max(1, ...recent.map((item) => item.attempts));
  return <div className="space-y-5">
    <PageHeader
      title="Platform Analytics"
      description="Verified learning, commerce, and Cloudflare website traffic. Each source reports its own measurement scope."
      icon={<BarChart3 className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={refreshNow} disabled={loading}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}/>Refresh</Button>}
    />
    <div className="flex flex-wrap gap-2" role="group" aria-label="Analytics reporting period">
      {windows.map((days) => <Button key={days} size="sm" variant={windowDays === days ? 'default' : 'outline'} onClick={() => setWindowDays(days)} aria-pressed={windowDays === days}>{days} days</Button>)}
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tests ? <>
        <Metric label="Test attempts started" value={integer(tests.summary.totalAttempts)} detail="Canonical attempt records in selected period" />
        <Metric label="Completed test attempts" value={integer(tests.summary.completedAttempts)} detail="Evaluated and practice-evaluated attempts" />
        <Metric label="Active test learners" value={integer(tests.summary.uniqueStudents)} detail="Distinct students who started tests — not all active website users" />
      </> : <div className="sm:col-span-2 xl:col-span-3"><SourceError title="Learning metrics" error={testsError} link="/analytics/tests"/></div>}
      {business ? <Metric label="Net revenue" value={money(business.summary.netRevenueMinor, business.summary.currency || 'INR')} detail="Verified commerce ledger; reporting currency shown" /> : <SourceError title="Revenue metrics" error={businessError} link="/analytics/business" />}
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4"/>Learning activity</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {tests ? <>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-muted-foreground">Test publications attempted</p><p className="text-xl font-semibold">{integer(tests.summary.publicationsAttempted)}</p></div>
              <div><p className="text-muted-foreground">Completion rate</p><p className="text-xl font-semibold">{Number(tests.summary.completionRate).toFixed(1)}%</p></div>
            </div>
            <div className="flex h-36 items-end gap-1 overflow-hidden" role="img" aria-label="Daily test attempts">
              {recent.length ? recent.map((item) => <div key={item.day} className="group relative min-w-1 flex-1 rounded-t bg-blue-500/80" style={{height: `${Math.max(2, item.attempts / maximum * 100)}%`}} title={`${item.day}: ${item.attempts} attempts`} />) : <p className="self-center text-sm text-muted-foreground">No attempts during this period.</p>}
            </div>
            <p className="text-xs text-muted-foreground">Daily started attempts, not page visits. Hover over bars for counts.</p>
          </> : <p className="text-sm text-muted-foreground">{testsError ? `Learning metrics unavailable: ${testsError}` : 'Loading learning activity…'}</p>}
          <Link className="inline-flex items-center gap-2 text-sm font-medium text-primary underline" to="/analytics/tests"><GraduationCap className="h-4 w-4"/>View Test Analytics</Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="h-4 w-4"/>Commerce</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {business ? <>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-muted-foreground">Paid orders</p><p className="text-xl font-semibold">{integer(business.summary.paidOrders)}</p></div>
              <div><p className="text-muted-foreground">Paying students</p><p className="text-xl font-semibold">{integer(business.summary.payingStudents)}</p></div>
              <div><p className="text-muted-foreground">Created orders</p><p className="text-xl font-semibold">{integer(business.summary.createdOrders)}</p></div>
              <div><p className="text-muted-foreground">Order-to-payment conversion</p><p className="text-xl font-semibold">{(business.summary.conversionBasisPoints / 100).toFixed(2)}%</p></div>
            </div>
            <p className="text-xs text-muted-foreground">Conversion is paid orders ÷ created orders, not visitor-to-buyer conversion.</p>
          </> : <p className="text-sm text-muted-foreground">{businessError ? `Commerce metrics unavailable: ${businessError}` : 'Loading commerce totals…'}</p>}
          <Link className="text-sm font-medium text-primary underline" to="/analytics/business">View Business Analytics</Link>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe2 className="h-4 w-4"/>Website traffic</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {traffic ? <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Page loads" value={integer(traffic.summary.pageLoads)} detail="Cloudflare browser beacon events, not HTTP requests" />
            <Metric label="Visits" value={integer(traffic.summary.visits)} detail="Cloudflare visits — not distinct visitors" />
          </div>
          <p className="text-xs text-muted-foreground">{traffic.note} {traffic.sampled ? 'At least one aggregation is sampled; do not treat totals as exact.' : 'Reported sampling interval: 1 for these groupings.'}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold">Devices (page loads)</p>
              {traffic.devices.length ? <ul className="space-y-1 text-sm">{traffic.devices.map((item) => <li key={item.name} className="flex justify-between gap-4"><span className="truncate">{item.name}</span><span className="tabular-nums">{integer(item.pageLoads)}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No device measurements.</p>}
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Referrers (page loads)</p>
              {traffic.referrers.length ? <ul className="space-y-1 text-sm">{traffic.referrers.map((item) => <li key={item.name} className="flex justify-between gap-4"><span className="truncate">{item.name}</span><span className="tabular-nums">{integer(item.pageLoads)}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No referrer measurements.</p>}
            </div>
          </div>
        </> : <p role="status" className="text-sm text-muted-foreground">{windowDays > 30 ? 'Cloudflare traffic is limited to 7- and 30-day windows here; choose either period to view traffic.' : trafficError ? `Traffic report unavailable: ${trafficError}` : 'Loading Cloudflare traffic measurements…'}</p>}
        <a className="inline-flex text-sm font-medium text-primary underline" href="https://dash.cloudflare.com/?to=/:account/:zone/speed/rum" target="_blank" rel="noopener noreferrer">Open Cloudflare's traffic dashboard</a>
        <p className="text-xs text-muted-foreground">Website collection is enabled for examtree.in; the server needs a separate read-only Cloudflare API token to display metrics here. Visitor-to-signup conversion cannot be inferred from RUM visits and is not displayed.</p>
      </CardContent>
    </Card>
    <p className="text-xs text-muted-foreground">Learning and commerce data originate from existing authenticated aggregate APIs. Website traffic comes from the separate server-side Cloudflare RUM reporting endpoint when configured. No browser-side provider credentials.</p>
  </div>;
}
