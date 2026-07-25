import { useEffect, useMemo, useState } from 'react';
import { KeyRound, RefreshCw, Search, ShieldX } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFirebaseAuth } from '@/integrations/firebase';

const apiBase = ((import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api').replace(/\/$/, '');
const date = (value: string | null) => value ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'No expiry';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your administrator session has expired.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken()}`, ...(init?.headers || {}) },
  });
  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Entitlement request failed (${response.status}).`);
  if (!body) throw new Error('Entitlement service returned an empty response.');
  return body;
}

type Entitlement = {
  id: string; status: 'active' | 'expired' | 'revoked'; startsAt: string; endsAt: string | null;
  revokeReason: string | null; grantSource: string; createdAt: string; studentName: string;
  studentEmail: string | null; productCode: string; productTitle: string; testCount: number;
};
type Catalog = { students: Array<{ id: string; name: string; email: string | null }>; products: Array<{ id: string; productVersionId: string; code: string; title: string; validityDays: number | null; testCount: number }> };

type ListResponse = { entitlements: Entitlement[] };

export function EntitlementsWorkspacePage() {
  const [rows, setRows] = useState<Entitlement[]>([]);
  const [catalog, setCatalog] = useState<Catalog>({ students: [], products: [] });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [studentId, setStudentId] = useState('');
  const [productVersionId, setProductVersionId] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (status) params.set('status', status);
      const [list, nextCatalog] = await Promise.all([
        request<ListResponse>(`/admin/commerce/entitlements?${params}`),
        request<Catalog>('/admin/commerce/entitlements/catalog'),
      ]);
      setRows(list.entitlements);
      setCatalog(nextCatalog);
    } catch (error) {
      showToast.error('Unable to load entitlements', error instanceof Error ? error.message : 'Request failed.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, [status]);
  const activeCount = useMemo(() => rows.filter((row) => row.status === 'active').length, [rows]);

  const grant = async () => {
    if (!studentId || !productVersionId || !reason.trim()) return showToast.error('Missing grant details', 'Select a student and package, then enter a reason.');
    try {
      await request('/admin/commerce/entitlements', { method: 'POST', body: JSON.stringify({ userId: studentId, productVersionId, endsAt: endsAt || null, reason: reason.trim() }) });
      setReason(''); setEndsAt('');
      showToast.success('Entitlement granted', 'The selected package tests are now available to the student.');
      await load();
    } catch (error) { showToast.error('Unable to grant entitlement', error instanceof Error ? error.message : 'Request failed.'); }
  };

  const revoke = async (id: string) => {
    const revokeReason = window.prompt('Reason for revocation');
    if (!revokeReason?.trim()) return;
    try {
      await request(`/admin/commerce/entitlements/${id}/revoke`, { method: 'POST', body: JSON.stringify({ reason: revokeReason.trim() }) });
      showToast.success('Entitlement revoked', 'Future paid-test access has been removed while purchase evidence remains intact.');
      await load();
    } catch (error) { showToast.error('Unable to revoke entitlement', error instanceof Error ? error.message : 'Request failed.'); }
  };

  return <div className="space-y-5">
    <PageHeader title="Entitlements" description="Canonical student access grants with immutable product-version membership and audited revocation." icon={<KeyRound className="h-5 w-5" />} actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>} />

    <div className="grid gap-3 sm:grid-cols-3"><Metric label="Visible entitlements" value={String(rows.length)} /><Metric label="Active" value={String(activeCount)} /><Metric label="Revoked / expired" value={String(rows.length - activeCount)} /></div>

    <Card><CardHeader><CardTitle className="text-base">Grant manual access</CardTitle></CardHeader><CardContent className="grid gap-3 lg:grid-cols-5">
      <select className="h-10 rounded-md border bg-background px-3 text-sm" value={studentId} onChange={(event) => setStudentId(event.target.value)}><option value="">Select student</option>{catalog.students.map((student) => <option key={student.id} value={student.id}>{student.name}{student.email ? ` · ${student.email}` : ''}</option>)}</select>
      <select className="h-10 rounded-md border bg-background px-3 text-sm" value={productVersionId} onChange={(event) => setProductVersionId(event.target.value)}><option value="">Select package</option>{catalog.products.map((product) => <option key={product.productVersionId} value={product.productVersionId}>{product.code} · {product.title} · {product.testCount} tests</option>)}</select>
      <Input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} title="Optional custom expiry" />
      <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Required grant reason" />
      <Button onClick={() => void grant()}><KeyRound className="mr-1.5 h-4 w-4" />Grant access</Button>
    </CardContent></Card>

    <Card><CardContent className="flex flex-col gap-2 p-4 sm:flex-row"><Input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void load(); }} placeholder="Search student, email, package code or title" /><select className="h-10 rounded-md border bg-background px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="expired">Expired</option><option value="revoked">Revoked</option></select><Button onClick={() => void load()}><Search className="mr-1.5 h-4 w-4" />Search</Button></CardContent></Card>

    <Card><CardHeader><CardTitle className="text-base">Canonical entitlement ledger</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Package</TableHead><TableHead>Status</TableHead><TableHead>Source</TableHead><TableHead>Access window</TableHead><TableHead className="text-right">Tests</TableHead><TableHead /></TableRow></TableHeader><TableBody>
      {rows.length ? rows.map((row) => <TableRow key={row.id}><TableCell><p className="font-medium">{row.studentName}</p><p className="text-xs text-muted-foreground">{row.studentEmail || row.id}</p></TableCell><TableCell><p className="font-medium">{row.productTitle}</p><p className="text-xs text-muted-foreground">{row.productCode}</p></TableCell><TableCell><StatusBadge tone={row.status === 'active' ? 'success' : row.status === 'revoked' ? 'danger' : 'neutral'}>{row.status}</StatusBadge></TableCell><TableCell>{row.grantSource.replace('_', ' ')}</TableCell><TableCell><p>{date(row.startsAt)}</p><p className="text-xs text-muted-foreground">to {date(row.endsAt)}</p></TableCell><TableCell className="text-right">{row.testCount}</TableCell><TableCell className="text-right">{row.status === 'active' && <Button size="sm" variant="outline" onClick={() => void revoke(row.id)}><ShieldX className="mr-1.5 h-4 w-4" />Revoke</Button>}</TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="py-12 text-center text-muted-foreground">{loading ? 'Loading canonical entitlements…' : 'No entitlements match this filter.'}</TableCell></TableRow>}
    </TableBody></Table></CardContent></Card>

    <Card className="border-dashed"><CardContent className="p-4 text-sm text-muted-foreground">Revocation removes future access but never deletes orders, payment events, product versions, or entitlement evidence. Paid tests are checked server-side before question delivery and before an attempt session can start.</CardContent></Card>
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></CardContent></Card>; }

export default EntitlementsWorkspacePage;
