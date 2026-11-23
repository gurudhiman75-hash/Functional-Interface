import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminRequest } from '@/lib/admin-request';

interface PackageRow { id: string; code: string; title: string; status: string; testCount: number }
interface PackageDetail {
  product: { id: string; currentVersionNumber: number };
  seriesVersionIds?: string[];
  currentVersion: null | {
    title: string; description: string | null; currency: string; listPriceMinor: number; salePriceMinor: number;
    validityDays: number | null; saleStartAt: string | null; saleEndAt: string | null;
    configuration: { directTestIds?: string[]; seriesVersionIds?: string[] } | null;
  };
  directTestIds: string[];
  tests: Array<{ testId: string }>;
}

interface Props {
  testId: string;
  testCode: string;
  canManage: boolean;
}

/** Who can open this test: Free or Premium, and which packages sell it. Uses the existing commerce endpoints. */
export function DistributionPanel({ testId, testCode, canManage }: Props) {
  const [mode, setMode] = useState<'free' | 'premium' | ''>('');
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [memberOf, setMemberOf] = useState<string[]>([]);
  const [packageId, setPackageId] = useState('');
  const [busy, setBusy] = useState('');

  const loadAll = async () => {
    try {
      const [policies, products] = await Promise.all([
        adminRequest<{ tests: Array<{ testId: string; accessMode: 'free' | 'premium' }> }>('/admin/commerce/products/access-policies'),
        adminRequest<{ products: PackageRow[] }>('/admin/commerce/products'),
      ]);
      setMode(policies.tests.find((t) => t.testId === testId)?.accessMode ?? '');
      setPackages(products.products);
      const details = await Promise.all(products.products.slice(0, 100).map((p) =>
        adminRequest<PackageDetail>(`/admin/commerce/products/${encodeURIComponent(p.id)}`).catch(() => null)));
      setMemberOf(details.filter((d): d is PackageDetail => !!d && d.tests.some((t) => t.testId === testId)).map((d) => d.product.id));
    } catch { /* section stays empty; the rest of the editor keeps working */ }
  };
  useEffect(() => { void loadAll(); }, [testId]); // eslint-disable-line react-hooks/exhaustive-deps

  const setAccess = async (next: 'free' | 'premium') => {
    setBusy('access');
    try {
      await adminRequest(`/admin/commerce/products/access-policies/${encodeURIComponent(testId)}`, {
        method: 'POST', body: JSON.stringify({ accessMode: next, reason: `Set to ${next} from Tests workspace` }),
      });
      setMode(next);
      showToast.success('Access updated', `${testCode} is now ${next}.`);
    } catch (error) {
      showToast.error('Could not change access', error instanceof Error ? error.message : 'Try again.');
    } finally { setBusy(''); }
  };

  const addToPackage = async () => {
    if (!packageId) return;
    setBusy('package');
    try {
      const detail = await adminRequest<PackageDetail>(`/admin/commerce/products/${encodeURIComponent(packageId)}`);
      const version = detail.currentVersion;
      if (!version) throw new Error('This package has no current version.');
      const direct = detail.directTestIds ?? version.configuration?.directTestIds ?? [];
      await adminRequest(`/admin/commerce/products/${encodeURIComponent(packageId)}/versions`, {
        method: 'POST',
        body: JSON.stringify({
          code: packages.find((p) => p.id === packageId)?.code,
          title: version.title, description: version.description ?? '', currency: version.currency,
          listPriceMinor: version.listPriceMinor, salePriceMinor: version.salePriceMinor,
          validityDays: version.validityDays, saleStartAt: version.saleStartAt, saleEndAt: version.saleEndAt,
          changeReason: `Added ${testCode} from Tests workspace`,
          testIds: [...new Set([...direct, testId])],
          seriesVersionIds: detail.seriesVersionIds ?? version.configuration?.seriesVersionIds ?? [],
        }),
      });
      showToast.success('Added to package', `${testCode} is now part of ${packages.find((p) => p.id === packageId)?.title}.`);
      setPackageId('');
      await loadAll();
    } catch (error) {
      showToast.error('Could not add to package', error instanceof Error ? error.message : 'Try again.');
    } finally { setBusy(''); }
  };

  const candidates = packages.filter((p) => !memberOf.includes(p.id) && p.status !== 'archived');

  return (
    <div className="rounded-md border p-3 text-sm" data-testid="distribution-panel">
      <div className="mb-2 font-medium">Who can take this test</div>
      <div className="flex flex-wrap items-center gap-2">
        {(['free', 'premium'] as const).map((value) => (
          <Button key={value} size="sm" variant={mode === value ? 'default' : 'outline'}
            disabled={!canManage || busy === 'access'} onClick={() => mode !== value && void setAccess(value)}>
            {busy === 'access' && mode !== value ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : null}
            {value === 'free' ? 'Free for everyone' : 'Premium (package buyers)'}
          </Button>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        <Label>Packages that include it</Label>
        <p className="text-xs text-muted-foreground">
          {memberOf.length === 0 ? 'Not in any package yet.' : packages.filter((p) => memberOf.includes(p.id)).map((p) => p.title).join(', ')}
        </p>
        {canManage && candidates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Select value={packageId} onValueChange={setPackageId}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Add to a package…" /></SelectTrigger>
              <SelectContent>{candidates.map((p) => <SelectItem key={p.id} value={p.id}>{p.title} ({p.testCount} tests)</SelectItem>)}</SelectContent>
            </Select>
            <Button size="sm" variant="outline" disabled={!packageId || busy === 'package'} onClick={() => void addToPackage()}>
              {busy === 'package' && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}Add
            </Button>
          </div>
        )}
        {canManage && packages.length === 0 && <p className="text-xs text-muted-foreground">No packages exist yet. Create one under Commerce, then add tests here.</p>}
      </div>
    </div>
  );
}
