import { useEffect, useMemo, useState } from 'react';
import { PauseCircle, PlayCircle, Plus, RefreshCw, Search, Ticket } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const money = (minor: number, currency: string) => new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(minor / 100);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}`, ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Coupon request failed (${response.status}).`);
  if (!body) throw new Error('Coupon service returned an empty response.');
  return body;
}

type Product = { id: string; code: string; title: string; status: string; currency: string; salePriceMinor: number };
type Coupon = {
  id: string; code: string; status: 'draft' | 'active' | 'paused' | 'expired' | 'archived';
  discountType: 'fixed' | 'percentage'; discountValue: number; currency: string | null;
  maximumDiscountMinor: number | null; minimumOrderMinor: number; startsAt: string | null; endsAt: string | null;
  maxRedemptions: number | null; maxRedemptionsPerUser: number | null; paidRedemptions: number; productCount: number;
};

type Form = {
  code: string; discountType: 'percentage' | 'fixed'; discountValue: string; currency: string;
  maximumDiscountMinor: string; minimumOrderMinor: string; startsAt: string; endsAt: string;
  maxRedemptions: string; maxRedemptionsPerUser: string; productIds: string[];
};

const emptyForm: Form = {
  code: '', discountType: 'percentage', discountValue: '1000', currency: 'INR', maximumDiscountMinor: '',
  minimumOrderMinor: '0', startsAt: '', endsAt: '', maxRedemptions: '', maxRedemptionsPerUser: '1', productIds: [],
};

export function CouponsWorkspacePage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Form>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedSearch) params.set('search', appliedSearch);
      const [couponData, catalogue] = await Promise.all([
        request<{ coupons: Coupon[] }>(`/admin/commerce/coupons?${params}`),
        request<{ products: Product[] }>('/admin/commerce/coupons/catalog'),
      ]);
      setCoupons(couponData.coupons);
      setProducts(catalogue.products);
    } catch (error) {
      showToast.error('Unable to load coupons', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [appliedSearch]);

  const eligibleProducts = useMemo(() => products.filter((product) => product.status !== 'archived'), [products]);

  const createCoupon = async () => {
    setCreating(true);
    try {
      await request('/admin/commerce/coupons', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          discountValue: Number(form.discountValue),
          maximumDiscountMinor: form.maximumDiscountMinor ? Number(form.maximumDiscountMinor) : null,
          minimumOrderMinor: Number(form.minimumOrderMinor || 0),
          maxRedemptions: form.maxRedemptions ? Number(form.maxRedemptions) : null,
          maxRedemptionsPerUser: form.maxRedemptionsPerUser ? Number(form.maxRedemptionsPerUser) : null,
          startsAt: form.startsAt || null,
          endsAt: form.endsAt || null,
          currency: form.discountType === 'fixed' ? form.currency : (form.currency || null),
        }),
      });
      showToast.success('Coupon created', 'The coupon was created as a canonical draft.');
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (error) {
      showToast.error('Unable to create coupon', error instanceof Error ? error.message : 'Request failed.');
    } finally { setCreating(false); }
  };

  const changeStatus = async (coupon: Coupon, status: Coupon['status']) => {
    const reason = window.prompt(`Reason for changing ${coupon.code} to ${status}:`);
    if (!reason?.trim()) return;
    try {
      await request(`/admin/commerce/coupons/${coupon.id}/status`, { method: 'POST', body: JSON.stringify({ status, reason: reason.trim() }) });
      showToast.success('Coupon updated', `${coupon.code} is now ${status}.`);
      await load();
    } catch (error) {
      showToast.error('Unable to update coupon', error instanceof Error ? error.message : 'Request failed.');
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Coupons"
      description="Canonical discount rules with product scope, campaign windows, redemption limits and paid-order evidence."
      icon={<Ticket className="h-5 w-5" />}
      actions={<>
        <Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>
        <Button onClick={() => setShowForm((value) => !value)}><Plus className="mr-1.5 h-4 w-4" />New coupon</Button>
      </>}
    />

    {showForm && <Card><CardHeader><CardTitle className="text-base">Create canonical coupon</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">
      <Field label="Coupon code"><Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="SSC-LAUNCH-10" /></Field>
      <Field label="Discount type"><select className="h-10 rounded-md border bg-background px-3 text-sm" value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value as Form['discountType'] })}><option value="percentage">Percentage (basis points)</option><option value="fixed">Fixed amount</option></select></Field>
      <Field label={form.discountType === 'percentage' ? 'Discount basis points (1000 = 10%)' : 'Discount in minor units'}><Input type="number" value={form.discountValue} onChange={(event) => setForm({ ...form, discountValue: event.target.value })} /></Field>
      <Field label="Currency"><Input value={form.currency} onChange={(event) => setForm({ ...form, currency: event.target.value.toUpperCase().slice(0, 3) })} disabled={form.discountType === 'percentage'} /></Field>
      <Field label="Maximum discount in minor units"><Input type="number" value={form.maximumDiscountMinor} onChange={(event) => setForm({ ...form, maximumDiscountMinor: event.target.value })} placeholder="Optional" /></Field>
      <Field label="Minimum order in minor units"><Input type="number" value={form.minimumOrderMinor} onChange={(event) => setForm({ ...form, minimumOrderMinor: event.target.value })} /></Field>
      <Field label="Starts at"><Input type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} /></Field>
      <Field label="Ends at"><Input type="datetime-local" value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} /></Field>
      <Field label="Maximum redemptions"><Input type="number" value={form.maxRedemptions} onChange={(event) => setForm({ ...form, maxRedemptions: event.target.value })} placeholder="Unlimited" /></Field>
      <Field label="Maximum per student"><Input type="number" value={form.maxRedemptionsPerUser} onChange={(event) => setForm({ ...form, maxRedemptionsPerUser: event.target.value })} placeholder="Unlimited" /></Field>
      <div className="md:col-span-2 space-y-2"><p className="text-sm font-medium">Applicable packages</p><p className="text-xs text-muted-foreground">Leave empty to apply to every active package.</p><div className="max-h-52 space-y-2 overflow-auto rounded-md border p-3">{eligibleProducts.map((product) => <label key={product.id} className="flex items-center justify-between gap-3 text-sm"><span><input className="mr-2" type="checkbox" checked={form.productIds.includes(product.id)} onChange={() => setForm({ ...form, productIds: form.productIds.includes(product.id) ? form.productIds.filter((id) => id !== product.id) : [...form.productIds, product.id] })} />{product.title} <span className="text-muted-foreground">({product.code})</span></span><span>{money(product.salePriceMinor, product.currency)}</span></label>)}</div></div>
      <div className="md:col-span-2 flex justify-end gap-2"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={() => void createCoupon()} disabled={creating || !form.code.trim()}>{creating ? 'Creating…' : 'Create draft coupon'}</Button></div>
    </CardContent></Card>}

    <Card><CardContent className="flex gap-2 p-4"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search coupon code" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></CardContent></Card>

    <Card><CardHeader><CardTitle className="text-base">Canonical coupon inventory</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Coupon</TableHead><TableHead>Status</TableHead><TableHead>Discount</TableHead><TableHead className="text-right">Paid uses</TableHead><TableHead className="text-right">Packages</TableHead><TableHead>Window</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
      {coupons.length ? coupons.map((coupon) => <TableRow key={coupon.id}><TableCell className="font-medium">{coupon.code}</TableCell><TableCell><StatusBadge tone={coupon.status === 'active' ? 'success' : coupon.status === 'draft' ? 'warning' : 'neutral'}>{coupon.status}</StatusBadge></TableCell><TableCell>{coupon.discountType === 'percentage' ? `${coupon.discountValue / 100}%${coupon.maximumDiscountMinor != null && coupon.currency ? ` (max ${money(coupon.maximumDiscountMinor, coupon.currency)})` : ''}` : money(coupon.discountValue, coupon.currency || 'INR')}</TableCell><TableCell className="text-right">{coupon.paidRedemptions}{coupon.maxRedemptions ? ` / ${coupon.maxRedemptions}` : ''}</TableCell><TableCell className="text-right">{coupon.productCount || 'All'}</TableCell><TableCell className="text-xs text-muted-foreground">{coupon.startsAt ? new Date(coupon.startsAt).toLocaleString('en-GB') : 'Immediate'} → {coupon.endsAt ? new Date(coupon.endsAt).toLocaleString('en-GB') : 'No expiry'}</TableCell><TableCell className="text-right">{coupon.status === 'active' ? <Button size="sm" variant="outline" onClick={() => void changeStatus(coupon, 'paused')}><PauseCircle className="mr-1 h-4 w-4" />Pause</Button> : coupon.status !== 'archived' && <Button size="sm" variant="outline" onClick={() => void changeStatus(coupon, 'active')}><PlayCircle className="mr-1 h-4 w-4" />Activate</Button>}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical coupons…' : 'No coupons match this search.'}</TableCell></TableRow>}
    </TableBody></Table></CardContent></Card>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>; }

export default CouponsWorkspacePage;
