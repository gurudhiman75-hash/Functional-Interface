import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Download, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const money = (minor: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(minor || 0) / 100);
const number = (value: number) => new Intl.NumberFormat('en-US').format(Number(value || 0));
const percent = (basisPoints: number) => `${(Number(basisPoints || 0) / 100).toFixed(2)}%`;
const windows = [7, 30, 90, 365] as const;

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Analytics request failed (${response.status}).`);
  if (!body) throw new Error('Analytics returned an empty response.');
  return body;
}

type AnalyticsResponse = {
  windowDays: number;
  generatedAt: string;
  summary: { paidOrders: number; payingStudents: number; grossRevenueMinor: number; refundsMinor: number; netRevenueMinor: number; discountMinor: number; averageOrderValueMinor: number; createdOrders: number; conversionBasisPoints: number; currency: string };
  comparison: { currentOrders: number; previousOrders: number; currentGrossMinor: number; previousGrossMinor: number };
  daily: Array<{ day: string; orders: number; grossMinor: number; refundsMinor: number; netMinor: number }>;
  products: Array<{ productId: string; code: string; title: string; orders: number; buyers: number; revenueMinor: number; activeEntitlements: number }>;
  coupons: Array<{ couponId: string; code: string; discountType: string; redemptions: number; students: number; discountMinor: number; revenueMinor: number }>;
  quality: { paidWithoutCapturedPayment: number; refundStatusWithoutProcessedRefund: number; paidWithoutEntitlement: number };
};

export function BusinessAnalyticsPage() {
  const [windowDays, setWindowDays] = useState<number>(30);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setData(await request<AnalyticsResponse>(`/admin/analytics/business?window=${windowDays}`)); }
    catch (error) { showToast.error('Unable to load business analytics', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [windowDays]);

  const downloadCsv = async () => {
    try {
      const user = getFirebaseAuth()?.currentUser;
      if (!user) throw new Error('Your administrator session has expired.');
      const response = await fetch(`${apiBase}/admin/analytics/business.csv?window=${windowDays}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
      if (!response.ok) throw new Error('CSV export failed.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `business-analytics-${windowDays}d.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) { showToast.error('Unable to export analytics', error instanceof Error ? error.message : 'Export failed.'); }
  };

  const maxNet = useMemo(() => Math.max(1, ...(data?.daily.map((row) => Math.max(0, row.netMinor)) ?? [1])), [data]);
  const currency = data?.summary.currency || 'INR';
  const orderChange = data ? change(data.comparison.currentOrders, data.comparison.previousOrders) : null;
  const revenueChange = data ? change(data.comparison.currentGrossMinor, data.comparison.previousGrossMinor) : null;
  const qualityTotal = data ? Object.values(data.quality).reduce((sum, value) => sum + Number(value || 0), 0) : 0;

  return <div className="space-y-5">
    <PageHeader title="Business Analytics" description="Canonical revenue, conversion, product, coupon, refund and entitlement reporting from immutable Commerce evidence." icon={<BarChart3 className="h-5 w-5" />} actions={<div className="flex gap-2"><Button variant="outline" onClick={() => void downloadCsv()}><Download className="mr-1.5 h-4 w-4" />Export CSV</Button><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button></div>} />
    <div className="flex flex-wrap gap-2">{windows.map((value) => <Button key={value} size="sm" variant={windowDays === value ? 'default' : 'outline'} onClick={() => setWindowDays(value)}>{value} days</Button>)}</div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Net revenue" value={money(data?.summary.netRevenueMinor ?? 0, currency)} note={revenueChange == null ? 'No previous-window baseline' : `${signed(revenueChange)} vs previous window`} />
      <Metric label="Paid orders" value={number(data?.summary.paidOrders ?? 0)} note={orderChange == null ? 'No previous-window baseline' : `${signed(orderChange)} vs previous window`} />
      <Metric label="Paying students" value={number(data?.summary.payingStudents ?? 0)} note={`AOV ${money(data?.summary.averageOrderValueMinor ?? 0, currency)}`} />
      <Metric label="Checkout conversion" value={percent(data?.summary.conversionBasisPoints ?? 0)} note={`${number(data?.summary.paidOrders ?? 0)} paid of ${number(data?.summary.createdOrders ?? 0)} created`} />
    </div>

    <div className="grid gap-3 lg:grid-cols-3">
      <Metric label="Gross revenue" value={money(data?.summary.grossRevenueMinor ?? 0, currency)} note="Paid-order total before processed refunds" />
      <Metric label="Processed refunds" value={money(data?.summary.refundsMinor ?? 0, currency)} note="Only verified processed refund evidence" />
      <Metric label="Discounts" value={money(data?.summary.discountMinor ?? 0, currency)} note="Frozen order discounts, including coupons" />
    </div>

    <Card><CardHeader><CardTitle className="text-base">Daily net revenue</CardTitle></CardHeader><CardContent><div className="flex h-48 items-end gap-1 overflow-x-auto border-b pb-2">{data?.daily.map((row) => <div key={row.day} className="group flex min-w-3 flex-1 flex-col justify-end" title={`${new Date(row.day).toLocaleDateString('en-US')}: ${money(row.netMinor, currency)} net · ${row.orders} orders`}><div className="rounded-t bg-primary/70 transition group-hover:bg-primary" style={{ height: `${Math.max(row.netMinor > 0 ? 3 : 0, (Math.max(0, row.netMinor) / maxNet) * 100)}%` }} /></div>)}</div><p className="mt-2 text-xs text-muted-foreground">Each bar is one calendar day. Negative refund-only days remain visible in the CSV evidence.</p></CardContent></Card>

    <div className="grid gap-5 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-base">Package performance</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Package</TableHead><TableHead className="text-right">Orders</TableHead><TableHead className="text-right">Buyers</TableHead><TableHead className="text-right">Active access</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader><TableBody>{data?.products.length ? data.products.map((row) => <TableRow key={row.productId}><TableCell><p className="font-medium">{row.title}</p><p className="text-xs text-muted-foreground">{row.code}</p></TableCell><TableCell className="text-right">{number(row.orders)}</TableCell><TableCell className="text-right">{number(row.buyers)}</TableCell><TableCell className="text-right">{number(row.activeEntitlements)}</TableCell><TableCell className="text-right">{money(row.revenueMinor, currency)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No package revenue exists in this window.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Coupon performance</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Coupon</TableHead><TableHead className="text-right">Uses</TableHead><TableHead className="text-right">Students</TableHead><TableHead className="text-right">Discount</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow></TableHeader><TableBody>{data?.coupons.length ? data.coupons.map((row) => <TableRow key={row.couponId}><TableCell><p className="font-medium">{row.code}</p><p className="text-xs text-muted-foreground">{row.discountType}</p></TableCell><TableCell className="text-right">{number(row.redemptions)}</TableCell><TableCell className="text-right">{number(row.students)}</TableCell><TableCell className="text-right">{money(row.discountMinor, currency)}</TableCell><TableCell className="text-right">{money(row.revenueMinor, currency)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No paid coupon redemptions exist in this window.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
    </div>

    <Card className={qualityTotal ? 'border-destructive/50' : 'border-emerald-500/40'}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" />Commerce data quality <StatusBadge tone={qualityTotal ? 'destructive' : 'success'}>{qualityTotal ? `${qualityTotal} blockers` : 'Clean'}</StatusBadge></CardTitle></CardHeader><CardContent className="grid gap-3 sm:grid-cols-3"><Quality label="Paid without captured payment" value={data?.quality.paidWithoutCapturedPayment ?? 0} /><Quality label="Refund status without processed refund" value={data?.quality.refundStatusWithoutProcessedRefund ?? 0} /><Quality label="Paid without entitlement" value={data?.quality.paidWithoutEntitlement ?? 0} /></CardContent></Card>

    <Card className="border-dashed"><CardContent className="p-4 text-sm text-muted-foreground">Revenue is recognized from canonical paid orders. Refunds reduce net revenue only after verified processing. No student ranking or personally identifiable data is included in this workspace or CSV export. Generated {data ? new Date(data.generatedAt).toLocaleString('en-US') : '—'}.</CardContent></Card>
  </div>;
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></CardContent></Card>; }
function Quality({ label, value }: { label: string; value: number }) { return <div className="rounded-md border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className={`mt-1 text-xl font-semibold ${value ? 'text-destructive' : ''}`}>{number(value)}</p></div>; }
function change(current: number, previous: number): number | null { if (!previous) return current ? null : 0; return ((current - previous) / previous) * 100; }
function signed(value: number): string { return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`; }

export default BusinessAnalyticsPage;
