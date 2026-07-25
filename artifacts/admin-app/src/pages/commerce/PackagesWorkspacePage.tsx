import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Archive, Box, CheckCircle2, Plus, RefreshCw, Save, Search, Undo2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const money = (minor: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);
const date = (value: unknown) => value ? new Date(String(value)).toLocaleString('en-US') : '—';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}`, ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Commerce request failed (${response.status}).`);
  if (!body) throw new Error('Commerce returned an empty response.');
  return body;
}

type Product = {
  id: string; code: string; status: 'draft' | 'active' | 'archived'; currentVersionNumber: number;
  title: string; currency: string; listPriceMinor: number; salePriceMinor: number;
  validityDays: number | null; testCount: number; updatedAt: string;
};
type ProductsResponse = { products: Product[]; generatedAt: string };
type TestOption = { id: string; publicCode: string; title: string; status: string; updatedAt: string };
type CatalogResponse = { tests: TestOption[] };
type Version = {
  id: string; versionNumber: number; title: string; description: string; currency: string;
  listPriceMinor: number; salePriceMinor: number; validityDays: number | null; saleStartAt: string | null;
  saleEndAt: string | null; changeReason: string; createdAt: string; testCount: number;
};
type ProductDetail = {
  product: { id: string; code: string; status: 'draft' | 'active' | 'archived'; currentVersionNumber: number; createdAt: string; updatedAt: string; archivedAt: string | null };
  versions: Version[];
  currentVersion: Version;
  tests: Array<{ testId: string; sortOrder: number; publicCode: string; title: string; status: string }>;
  readiness: { ready: boolean; blockers: string[] };
};
type PackageFormValue = {
  code: string; title: string; description: string; currency: string; listPrice: string; salePrice: string;
  validityDays: string; saleStartAt: string; saleEndAt: string; changeReason: string; testIds: string[];
};
const emptyForm: PackageFormValue = { code: '', title: '', description: '', currency: 'INR', listPrice: '', salePrice: '', validityDays: '', saleStartAt: '', saleEndAt: '', changeReason: '', testIds: [] };

function payload(value: PackageFormValue) {
  const toIso = (input: string) => input ? new Date(input).toISOString() : null;
  return {
    code: value.code,
    title: value.title,
    description: value.description,
    currency: value.currency,
    listPriceMinor: Math.round(Number(value.listPrice || 0) * 100),
    salePriceMinor: Math.round(Number(value.salePrice || 0) * 100),
    validityDays: value.validityDays ? Number(value.validityDays) : null,
    saleStartAt: toIso(value.saleStartAt),
    saleEndAt: toIso(value.saleEndAt),
    changeReason: value.changeReason,
    testIds: value.testIds,
  };
}

export function PackagesWorkspacePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [catalog, setCatalog] = useState<TestOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PackageFormValue>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedSearch) params.set('search', appliedSearch);
      const [products, testCatalog] = await Promise.all([
        request<ProductsResponse>(`/admin/commerce/products?${params}`),
        request<CatalogResponse>('/admin/commerce/products/catalog'),
      ]);
      setData(products);
      setCatalog(testCatalog.tests);
    } catch (error) {
      showToast.error('Unable to load packages', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [appliedSearch]);

  const create = async () => {
    setSaving(true);
    try {
      const detail = await request<ProductDetail>('/admin/commerce/products', { method: 'POST', body: JSON.stringify(payload(form)) });
      showToast.success('Package created', `${detail.product.code} was created as draft version 1.`);
      setCreating(false);
      setForm(emptyForm);
      navigate(`/commerce/packages/${detail.product.id}`);
    } catch (error) {
      showToast.error('Unable to create package', error instanceof Error ? error.message : 'Request failed.');
    } finally { setSaving(false); }
  };

  return <div className="space-y-5">
    <PageHeader title="Packages" description="Canonical package inventory with immutable versions, frozen pricing inputs and ordered test membership." icon={<Box className="h-5 w-5" />} actions={<><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button><Button onClick={() => setCreating((value) => !value)}><Plus className="mr-1.5 h-4 w-4" />New package</Button></>} />

    {creating && <PackageEditor title="Create package" submitLabel="Create draft" value={form} onChange={setForm} tests={catalog} saving={saving} onSubmit={() => void create()} onCancel={() => setCreating(false)} showCode />}

    <Card><CardContent className="flex gap-2 p-4"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search package code or title" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></CardContent></Card>

    <div className="grid gap-3 sm:grid-cols-3"><Metric label="Packages" value={String(data?.products.length ?? 0)} /><Metric label="Active" value={String(data?.products.filter((row) => row.status === 'active').length ?? 0)} /><Metric label="Draft / archived" value={String(data?.products.filter((row) => row.status !== 'active').length ?? 0)} /></div>

    <Card><CardHeader><CardTitle className="text-base">Canonical package inventory</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Version</TableHead><TableHead className="text-right">Tests</TableHead><TableHead className="text-right">List price</TableHead><TableHead className="text-right">Sale price</TableHead><TableHead className="text-right">Validity</TableHead></TableRow></TableHeader><TableBody>
      {data?.products.length ? data.products.map((row) => <TableRow key={row.id}><TableCell><Link to={`/commerce/packages/${row.id}`} className="font-medium hover:underline">{row.title}</Link><p className="text-xs text-muted-foreground">{row.code}</p></TableCell><TableCell><StatusBadge tone={row.status === 'active' ? 'success' : row.status === 'draft' ? 'warning' : 'neutral'}>{row.status}</StatusBadge></TableCell><TableCell className="text-right">v{row.currentVersionNumber}</TableCell><TableCell className="text-right">{row.testCount}</TableCell><TableCell className="text-right">{money(row.listPriceMinor, row.currency)}</TableCell><TableCell className="text-right">{money(row.salePriceMinor, row.currency)}</TableCell><TableCell className="text-right">{row.validityDays ? `${row.validityDays} days` : 'No expiry'}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical packages…' : 'No canonical packages match this search.'}</TableCell></TableRow>}
    </TableBody></Table></CardContent></Card>

    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Package lifecycle contract</p><p className="mt-1 text-sm text-muted-foreground">Edits create a new immutable product version. Activation is blocked until every test in the current version is release-ready. Archiving never deletes versions, orders, payment evidence or entitlements.</p></CardContent></Card>
  </div>;
}

export function PackageDetailPage() {
  const { productId = '' } = useParams();
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [catalog, setCatalog] = useState<TestOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PackageFormValue>(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const [nextDetail, nextCatalog] = await Promise.all([
        request<ProductDetail>(`/admin/commerce/products/${encodeURIComponent(productId)}`),
        request<CatalogResponse>('/admin/commerce/products/catalog'),
      ]);
      setDetail(nextDetail);
      setCatalog(nextCatalog.tests);
      setForm({
        code: nextDetail.product.code,
        title: nextDetail.currentVersion.title,
        description: nextDetail.currentVersion.description,
        currency: nextDetail.currentVersion.currency,
        listPrice: String(nextDetail.currentVersion.listPriceMinor / 100),
        salePrice: String(nextDetail.currentVersion.salePriceMinor / 100),
        validityDays: nextDetail.currentVersion.validityDays ? String(nextDetail.currentVersion.validityDays) : '',
        saleStartAt: nextDetail.currentVersion.saleStartAt ? new Date(nextDetail.currentVersion.saleStartAt).toISOString().slice(0, 16) : '',
        saleEndAt: nextDetail.currentVersion.saleEndAt ? new Date(nextDetail.currentVersion.saleEndAt).toISOString().slice(0, 16) : '',
        changeReason: '',
        testIds: nextDetail.tests.map((test) => test.testId),
      });
    } catch (error) {
      showToast.error('Unable to load package', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [productId]);

  const createVersion = async () => {
    setSaving(true);
    try {
      const next = await request<ProductDetail>(`/admin/commerce/products/${encodeURIComponent(productId)}/versions`, { method: 'POST', body: JSON.stringify(payload(form)) });
      setDetail(next);
      setEditing(false);
      showToast.success('Package version created', `Version ${next.product.currentVersionNumber} is now current.`);
      await load();
    } catch (error) { showToast.error('Unable to version package', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setSaving(false); }
  };

  const changeStatus = async (status: 'draft' | 'active' | 'archived') => {
    const reason = window.prompt(`Reason for changing this package to ${status}:`)?.trim();
    if (!reason) return;
    setSaving(true);
    try {
      const next = await request<ProductDetail>(`/admin/commerce/products/${encodeURIComponent(productId)}/status`, { method: 'POST', body: JSON.stringify({ status, reason }) });
      setDetail(next);
      showToast.success('Package status updated', `Package is now ${status}.`);
    } catch (error) { showToast.error('Unable to change package status', error instanceof Error ? error.message : 'Request failed.'); }
    finally { setSaving(false); }
  };

  if (loading && !detail) return <div className="py-12 text-center text-sm text-muted-foreground">Loading canonical package…</div>;
  if (!detail) return <div className="py-12 text-center text-sm text-muted-foreground">Package is unavailable.</div>;

  return <div className="space-y-5">
    <PageHeader title={detail.currentVersion.title} description={`${detail.product.code} · immutable version ${detail.product.currentVersionNumber}`} icon={<Box className="h-5 w-5" />} actions={<><Button asChild variant="outline"><Link to="/commerce/packages"><ArrowLeft className="mr-1.5 h-4 w-4" />Packages</Link></Button><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button><Button onClick={() => setEditing((value) => !value)}><Plus className="mr-1.5 h-4 w-4" />New version</Button></>} />

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Metric label="Status" value={detail.product.status} /><Metric label="Current version" value={`v${detail.product.currentVersionNumber}`} /><Metric label="Tests" value={String(detail.tests.length)} /><Metric label="List price" value={money(detail.currentVersion.listPriceMinor, detail.currentVersion.currency)} /><Metric label="Sale price" value={money(detail.currentVersion.salePriceMinor, detail.currentVersion.currency)} /><Metric label="Validity" value={detail.currentVersion.validityDays ? `${detail.currentVersion.validityDays} days` : 'No expiry'} /></div>

    <Card className={detail.readiness.ready ? 'border-success/40' : 'border-warning/40'}><CardContent className="flex items-start gap-3 p-4"><CheckCircle2 className="mt-0.5 h-5 w-5" /><div><p className="font-medium">{detail.readiness.ready ? 'Package is activation-ready' : 'Package has activation blockers'}</p><p className="mt-1 text-sm text-muted-foreground">{detail.readiness.ready ? 'Every current-version test is release-ready.' : detail.readiness.blockers.join(' · ')}</p></div></CardContent></Card>

    <div className="flex flex-wrap gap-2">
      {detail.product.status !== 'active' && <Button disabled={saving || !detail.readiness.ready} onClick={() => void changeStatus('active')}><CheckCircle2 className="mr-1.5 h-4 w-4" />Activate</Button>}
      {detail.product.status !== 'draft' && <Button variant="outline" disabled={saving} onClick={() => void changeStatus('draft')}><Undo2 className="mr-1.5 h-4 w-4" />Return to draft</Button>}
      {detail.product.status !== 'archived' && <Button variant="destructive" disabled={saving} onClick={() => void changeStatus('archived')}><Archive className="mr-1.5 h-4 w-4" />Archive</Button>}
    </div>

    {editing && <PackageEditor title={`Create version ${detail.product.currentVersionNumber + 1}`} submitLabel="Create immutable version" value={form} onChange={setForm} tests={catalog} saving={saving} onSubmit={() => void createVersion()} onCancel={() => setEditing(false)} />}

    <div className="grid gap-4 xl:grid-cols-2">
      <Card><CardHeader><CardTitle className="text-base">Current test membership</CardTitle></CardHeader><CardContent className="space-y-2">{detail.tests.map((test) => <div key={test.testId} className="flex items-center justify-between rounded-md border p-3"><div><p className="font-medium">{test.title}</p><p className="text-xs text-muted-foreground">{test.publicCode} · order {test.sortOrder}</p></div><StatusBadge tone={['live', 'scheduled', 'completed'].includes(test.status) ? 'success' : 'warning'}>{test.status}</StatusBadge></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Immutable version history</CardTitle></CardHeader><CardContent className="space-y-2">{detail.versions.map((version) => <div key={version.id} className="rounded-md border p-3"><div className="flex items-center justify-between"><p className="font-medium">v{version.versionNumber} · {version.title}</p><span className="text-sm">{money(version.salePriceMinor, version.currency)}</span></div><p className="mt-1 text-xs text-muted-foreground">{version.testCount} tests · {date(version.createdAt)}</p><p className="mt-2 text-sm text-muted-foreground">{version.changeReason}</p></div>)}</CardContent></Card>
    </div>
  </div>;
}

function PackageEditor({ title, submitLabel, value, onChange, tests, saving, onSubmit, onCancel, showCode = false }: { title: string; submitLabel: string; value: PackageFormValue; onChange: (value: PackageFormValue) => void; tests: TestOption[]; saving: boolean; onSubmit: () => void; onCancel: () => void; showCode?: boolean }) {
  const selected = useMemo(() => new Set(value.testIds), [value.testIds]);
  const set = (key: keyof PackageFormValue, next: string) => onChange({ ...value, [key]: next });
  const toggleTest = (id: string) => onChange({ ...value, testIds: selected.has(id) ? value.testIds.filter((testId) => testId !== id) : [...value.testIds, id] });
  return <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader><CardContent className="space-y-4">
    <div className="grid gap-3 md:grid-cols-2">{showCode && <Field label="Package code"><Input value={value.code} onChange={(event) => set('code', event.target.value)} placeholder="SSC-CGL-COMPLETE" /></Field>}<Field label="Title"><Input value={value.title} onChange={(event) => set('title', event.target.value)} placeholder="SSC CGL Complete Package" /></Field><Field label="Currency"><Input value={value.currency} maxLength={3} onChange={(event) => set('currency', event.target.value.toUpperCase())} /></Field><Field label="List price"><Input type="number" min="0" step="0.01" value={value.listPrice} onChange={(event) => set('listPrice', event.target.value)} /></Field><Field label="Sale price"><Input type="number" min="0" step="0.01" value={value.salePrice} onChange={(event) => set('salePrice', event.target.value)} /></Field><Field label="Validity days"><Input type="number" min="1" value={value.validityDays} onChange={(event) => set('validityDays', event.target.value)} placeholder="Blank for no expiry" /></Field><Field label="Sale starts"><Input type="datetime-local" value={value.saleStartAt} onChange={(event) => set('saleStartAt', event.target.value)} /></Field><Field label="Sale ends"><Input type="datetime-local" value={value.saleEndAt} onChange={(event) => set('saleEndAt', event.target.value)} /></Field></div>
    <Field label="Description"><textarea className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm" value={value.description} onChange={(event) => set('description', event.target.value)} /></Field>
    <Field label="Change reason"><textarea className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm" value={value.changeReason} onChange={(event) => set('changeReason', event.target.value)} placeholder="Required immutable audit reason" /></Field>
    <Field label={`Tests (${value.testIds.length} selected)`}><div className="max-h-72 space-y-2 overflow-auto rounded-md border p-3">{tests.map((test) => <label key={test.id} className="flex cursor-pointer items-center gap-3 rounded-md border p-3"><input type="checkbox" checked={selected.has(test.id)} onChange={() => toggleTest(test.id)} /><span className="flex-1"><span className="block text-sm font-medium">{test.title}</span><span className="block text-xs text-muted-foreground">{test.publicCode} · {test.status}</span></span></label>)}</div></Field>
    <div className="flex justify-end gap-2"><Button variant="outline" onClick={onCancel} disabled={saving}>Cancel</Button><Button onClick={onSubmit} disabled={saving}><Save className="mr-1.5 h-4 w-4" />{saving ? 'Saving…' : submitLabel}</Button></div>
  </CardContent></Card>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>; }
function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-xl font-semibold capitalize">{value}</p></CardContent></Card>; }

export default PackagesWorkspacePage;