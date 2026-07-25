import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { RefreshCw, Search, ShoppingCart } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const money = (minor: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(minor || 0) / 100);

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Commerce request failed (${response.status}).`);
  if (!body) throw new Error('Commerce returned an empty response.');
  return body;
}

type OrderRow = { id: string; orderNumber: string; status: string; currency: string; totalMinor: number; createdAt: string; paidAt: string | null; email: string; displayName: string | null; itemCount: number; entitlementCount: number; paymentStatus: string | null; providerOrderId: string | null; providerPaymentId: string | null };
type OrdersResponse = { orders: OrderRow[] };
type DetailResponse = { order: OrderRow & { subtotalMinor: number; discountMinor: number; taxMinor: number; pricingSnapshot: unknown }; items: Array<{ id: string; productCode: string; title: string; versionNumber: number; totalMinor: number }>; payments: Array<{ id: string; provider: string; status: string; amountMinor: number; currency: string; providerOrderId: string | null; providerPaymentId: string | null; failureCode: string | null; failureMessage: string | null }>; events: Array<{ id: string; eventType: string; providerEventId: string; signatureVerified: boolean; receivedAt: string; processedAt: string | null; processingError: string | null }>; entitlements: Array<{ id: string; status: string; startsAt: string; endsAt: string | null; grantSource: string; testCount: number }>; readOnly: boolean };

export function OrdersPaymentsWorkspacePage() {
  const [search, setSearch] = useState(''); const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<OrdersResponse | null>(null); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { const params = new URLSearchParams(); if (appliedSearch) params.set('search', appliedSearch); setData(await request<OrdersResponse>(`/admin/commerce/orders?${params}`)); } catch (error) { showToast.error('Unable to load orders', error instanceof Error ? error.message : 'Request failed.'); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, [appliedSearch]);
  return <div className="space-y-5">
    <PageHeader title="Orders & Payments" description="Canonical order ledger, frozen pricing evidence, provider reconciliation and entitlement issuance." icon={<ShoppingCart className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />
    <Card><CardContent className="flex gap-2 p-4"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search order number, student email or name" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Canonical order ledger</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead>Payment</TableHead><TableHead className="text-right">Items</TableHead><TableHead className="text-right">Entitlements</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader><TableBody>{data?.orders.length ? data.orders.map((row) => <TableRow key={row.id}><TableCell><Link className="font-medium hover:underline" to={`/commerce/orders/${row.id}`}>#{row.orderNumber}</Link><p className="text-xs text-muted-foreground">{new Date(row.createdAt).toLocaleString()}</p></TableCell><TableCell><p>{row.displayName || 'Student'}</p><p className="text-xs text-muted-foreground">{row.email}</p></TableCell><TableCell><StatusBadge tone={row.status === 'paid' ? 'success' : row.status === 'payment_failed' ? 'destructive' : 'warning'}>{row.status}</StatusBadge></TableCell><TableCell>{row.paymentStatus || '—'}</TableCell><TableCell className="text-right">{row.itemCount}</TableCell><TableCell className="text-right">{row.entitlementCount}</TableCell><TableCell className="text-right">{money(row.totalMinor, row.currency)}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical orders…' : 'No canonical orders match this search.'}</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
    <Card className="border-dashed"><CardContent className="p-4 text-sm text-muted-foreground">Payment notes never determine access. Only a signature-verified provider event matched to a canonical payment attempt and frozen order total can finalize an order and issue idempotent entitlements.</CardContent></Card>
  </div>;
}

export function OrderPaymentDetailPage() {
  const { orderId } = useParams(); const [data, setData] = useState<DetailResponse | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!orderId) return; setLoading(true); request<DetailResponse>(`/admin/commerce/orders/${encodeURIComponent(orderId)}`).then(setData).catch((error) => showToast.error('Unable to load order', error instanceof Error ? error.message : 'Request failed.')).finally(() => setLoading(false)); }, [orderId]);
  if (loading && !data) return <div className="py-12 text-center text-sm text-muted-foreground">Loading canonical order evidence…</div>;
  if (!data) return <div className="py-12 text-center text-sm text-muted-foreground">Order evidence is unavailable.</div>;
  return <div className="space-y-5"><PageHeader title={`Order #${data.order.orderNumber}`} description={`${data.order.email} · ${data.order.status}`} icon={<ShoppingCart className="h-5 w-5" />} actions={<Button asChild variant="outline"><Link to="/commerce/orders">Back to orders</Link></Button>} />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Total" value={money(data.order.totalMinor, data.order.currency)} /><Metric label="Items" value={String(data.items.length)} /><Metric label="Payment attempts" value={String(data.payments.length)} /><Metric label="Entitlements" value={String(data.entitlements.length)} /></div>
    <Card><CardHeader><CardTitle className="text-base">Purchased package versions</CardTitle></CardHeader><CardContent className="space-y-2">{data.items.map((item) => <div key={item.id} className="rounded-md border p-3"><p className="font-medium">{item.title}</p><p className="text-xs text-muted-foreground">{item.productCode} · immutable version {item.versionNumber} · {money(item.totalMinor, data.order.currency)}</p></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Payment attempts and provider events</CardTitle></CardHeader><CardContent className="space-y-3">{data.payments.map((payment) => <div key={payment.id} className="rounded-md border p-3"><p className="font-medium">{payment.provider} · {payment.status}</p><p className="text-xs text-muted-foreground">Order {payment.providerOrderId || 'not assigned'} · Payment {payment.providerPaymentId || 'not captured'} · {money(payment.amountMinor, payment.currency)}</p>{payment.failureMessage && <p className="mt-1 text-xs text-destructive">{payment.failureCode}: {payment.failureMessage}</p>}</div>)}{data.events.map((event) => <div key={event.id} className="rounded-md border p-3"><p className="font-medium">{event.eventType}</p><p className="text-xs text-muted-foreground">Verified {String(event.signatureVerified)} · Received {new Date(event.receivedAt).toLocaleString()} · {event.processedAt ? 'processed' : 'pending'}</p>{event.processingError && <p className="mt-1 text-xs text-destructive">{event.processingError}</p>}</div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Issued entitlements</CardTitle></CardHeader><CardContent className="space-y-2">{data.entitlements.length ? data.entitlements.map((entry) => <div key={entry.id} className="rounded-md border p-3"><p className="font-medium">{entry.status} · {entry.testCount} tests</p><p className="text-xs text-muted-foreground">{entry.grantSource} · starts {new Date(entry.startsAt).toLocaleString()} · ends {entry.endsAt ? new Date(entry.endsAt).toLocaleString() : 'no expiry'}</p></div>) : <p className="text-sm text-muted-foreground">No entitlement has been issued for this order.</p>}</CardContent></Card>
  </div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>; }
export default OrdersPaymentsWorkspacePage;
