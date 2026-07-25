import { useEffect, useState } from 'react';
import { Box, Plus, RefreshCw, Search, ShieldCheck } from 'lucide-react';

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

async function request<T>(path: string): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, { headers: { Authorization: `Bearer ${await user.getIdToken()}` } });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string } & T) | null;
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

export function PackagesWorkspacePage() {
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [schemaMissing, setSchemaMissing] = useState(false);

  const load = async () => {
    setLoading(true);
    setSchemaMissing(false);
    try {
      const params = new URLSearchParams();
      if (appliedSearch) params.set('search', appliedSearch);
      setData(await request<ProductsResponse>(`/admin/commerce/products?${params}`));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Request failed.';
      setSchemaMissing(message.includes('migration has not been applied'));
      if (!message.includes('migration has not been applied')) showToast.error('Unable to load packages', message);
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [appliedSearch]);

  return <div className="space-y-5">
    <PageHeader
      title="Packages"
      description="Canonical package inventory with immutable versions, frozen pricing inputs and ordered test membership."
      icon={<Box className="h-5 w-5" />}
      actions={<><Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button><Button disabled title="Creation is enabled after the canonical Commerce migration is deployed"><Plus className="mr-1.5 h-4 w-4" />New package</Button></>}
    />

    {schemaMissing && <Card className="border-warning/40"><CardContent className="p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5" /><div><p className="font-medium">Canonical Commerce schema is not deployed</p><p className="mt-1 text-sm text-muted-foreground">The package API and migration are source-ready, but the additive Commerce migration has not been applied to Neon. This workspace intentionally shows no prototype products and exposes no write controls until deployment is verified.</p></div></div></CardContent></Card>}

    <Card><CardContent className="flex gap-2 p-4"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') setAppliedSearch(search.trim()); }} placeholder="Search package code or title" /><Button onClick={() => setAppliedSearch(search.trim())}><Search className="mr-1.5 h-4 w-4" />Search</Button></CardContent></Card>

    <div className="grid gap-3 sm:grid-cols-3">
      <Metric label="Packages" value={String(data?.products.length ?? 0)} />
      <Metric label="Active" value={String(data?.products.filter((row) => row.status === 'active').length ?? 0)} />
      <Metric label="Draft / archived" value={String(data?.products.filter((row) => row.status !== 'active').length ?? 0)} />
    </div>

    <Card><CardHeader><CardTitle className="text-base">Canonical package inventory</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Version</TableHead><TableHead className="text-right">Tests</TableHead><TableHead className="text-right">List price</TableHead><TableHead className="text-right">Sale price</TableHead><TableHead className="text-right">Validity</TableHead></TableRow></TableHeader><TableBody>
      {data?.products.length ? data.products.map((row) => <TableRow key={row.id}><TableCell><p className="font-medium">{row.title}</p><p className="text-xs text-muted-foreground">{row.code}</p></TableCell><TableCell><StatusBadge tone={row.status === 'active' ? 'success' : row.status === 'draft' ? 'warning' : 'neutral'}>{row.status}</StatusBadge></TableCell><TableCell className="text-right">v{row.currentVersionNumber}</TableCell><TableCell className="text-right">{row.testCount}</TableCell><TableCell className="text-right">{money(row.listPriceMinor, row.currency)}</TableCell><TableCell className="text-right">{money(row.salePriceMinor, row.currency)}</TableCell><TableCell className="text-right">{row.validityDays ? `${row.validityDays} days` : 'No expiry'}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical packages…' : schemaMissing ? 'Deployment is required before package records can exist.' : 'No canonical packages match this search.'}</TableCell></TableRow>}
    </TableBody></Table></CardContent></Card>

    <Card className="border-dashed"><CardContent className="p-4"><p className="font-medium">Package lifecycle contract</p><p className="mt-1 text-sm text-muted-foreground">Edits create a new immutable product version. Activation is blocked until every test in the current version is release-ready. Archiving never deletes versions, orders, payment evidence or entitlements.</p></CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>; }

export default PackagesWorkspacePage;
