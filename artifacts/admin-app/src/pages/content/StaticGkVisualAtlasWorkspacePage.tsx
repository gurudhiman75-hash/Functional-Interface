import { useEffect, useMemo, useState } from 'react';
import { Loader2, Map, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminRequest } from '@/lib/admin-request';

type AtlasItem = {
  id: string;
  title: string;
  priority: 1 | 2 | 3;
  category: string;
  subcategory: string;
  template: string;
  factLockStatus: 'none' | 'draft' | 'source-locked' | 'review-approved';
  readiness: 'backlog' | 'fact-lock' | 'geometry-pending' | 'district-verification-pending' | 'scene-compiler-pending' | 'render-ready';
  sceneCompiler: 'none' | 'tropic-v1' | 'standard-meridian-v1';
  blockers: string[];
};

type GeometryAsset = {
  id: string;
  name: string;
  kind: string;
  sourcePublisher: string;
  sourceProductCode?: string;
  status: string;
};

type RuntimeGeometryState = {
  configured: boolean;
  loaded: boolean;
  source: 'none' | 'path' | 'https' | 'invalid';
  geometryId?: string;
  sourceProductCode?: string;
  canonicalGeoJsonSha256?: string;
  error?: string;
};

type AtlasStatus = {
  program: string;
  schemaVersion: string;
  pilotCount: number;
  sourceLockedCount: number;
  compilerCount: number;
  renderReadyCount: number;
  geometryAssets: GeometryAsset[];
  runtimeGeometry: RuntimeGeometryState;
  items: AtlasItem[];
  generatedAt: string;
};

function readinessLabel(value: AtlasItem['readiness']) {
  return value.replace(/-/g, ' ');
}

function readinessClass(value: AtlasItem['readiness']) {
  if (value === 'render-ready') return 'border-success/30 bg-success/5 text-success';
  if (value === 'geometry-pending' || value === 'district-verification-pending') {
    return 'border-warning/30 bg-warning/5 text-warning';
  }
  return 'border-border bg-muted/30 text-muted-foreground';
}

export function StaticGkVisualAtlasWorkspacePage() {
  const [data, setData] = useState<AtlasStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setData(await adminRequest<AtlasStatus>('/admin/static-gk-visual-atlas'));
    } catch (error) {
      showToast.error('Unable to load Visual Atlas', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const priorityOne = useMemo(() => data?.items.filter((item) => item.priority === 1) ?? [], [data]);

  return <div className="space-y-6">
    <PageHeader
      title="Static GK Visual Atlas"
      description="Source-locked, geometry-verified visual lessons for Static GK. Production maps fail closed until authoritative geometry is ingested."
      icon={<Map className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
        Refresh
      </Button>}
    />

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pilot lessons</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data?.pilotCount ?? '—'}</div></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Source locked</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data?.sourceLockedCount ?? '—'}</div></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Scene compilers</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data?.compilerCount ?? '—'}</div></CardContent></Card>
      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Render ready</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{data?.renderReadyCount ?? '—'}</div></CardContent></Card>
    </div>

    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" /> Geometry authority</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data?.runtimeGeometry && <div className="rounded-lg border p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">Runtime geometry bundle</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {data.runtimeGeometry.loaded
                  ? `${data.runtimeGeometry.sourceProductCode ?? data.runtimeGeometry.geometryId ?? 'validated source'} · ${data.runtimeGeometry.source}`
                  : data.runtimeGeometry.configured
                    ? `Configured via ${data.runtimeGeometry.source}, validation not available`
                    : 'No runtime path/URL configured'}
              </div>
            </div>
            <Badge variant="outline" className={data.runtimeGeometry.loaded ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}>
              {data.runtimeGeometry.loaded ? 'verified runtime' : 'not loaded'}
            </Badge>
          </div>
          {data.runtimeGeometry.canonicalGeoJsonSha256 && <div className="mt-2 font-mono text-[11px] text-muted-foreground">SHA-256 {data.runtimeGeometry.canonicalGeoJsonSha256.slice(0, 16)}…</div>}
          {data.runtimeGeometry.error && <div className="mt-2 text-xs leading-5 text-destructive">{data.runtimeGeometry.error}</div>}
        </div>}
        {(data?.geometryAssets ?? []).map((asset) => <div key={asset.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="font-medium">{asset.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{asset.sourcePublisher}{asset.sourceProductCode ? ` · ${asset.sourceProductCode}` : ''} · {asset.kind}</div>
          </div>
          <Badge variant="outline">{asset.status.replace(/-/g, ' ')}</Badge>
        </div>)}
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Pilot readiness</CardTitle></CardHeader>
      <CardContent>
        {loading && !data ? <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading Visual Atlas status…</div> :
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="px-3 py-3">Lesson</th><th className="px-3 py-3">Area</th><th className="px-3 py-3">Fact lock</th><th className="px-3 py-3">Compiler</th><th className="px-3 py-3">Readiness</th><th className="px-3 py-3">Current blocker</th></tr></thead>
              <tbody>{(data?.items ?? []).map((item) => <tr key={item.id} className="border-b align-top last:border-0">
                <td className="px-3 py-4"><div className="font-medium">{item.title}</div><div className="mt-1 font-mono text-xs text-muted-foreground">{item.id} · P{item.priority}</div></td>
                <td className="px-3 py-4"><div>{item.subcategory}</div><div className="mt-1 text-xs text-muted-foreground">{item.category}</div></td>
                <td className="px-3 py-4"><Badge variant="outline">{item.factLockStatus.replace(/-/g, ' ')}</Badge></td>
                <td className="px-3 py-4 font-mono text-xs">{item.sceneCompiler}</td>
                <td className="px-3 py-4"><Badge variant="outline" className={readinessClass(item.readiness)}>{readinessLabel(item.readiness)}</Badge></td>
                <td className="max-w-sm px-3 py-4 text-xs leading-5 text-muted-foreground">{item.blockers[0] ?? 'No current blocker.'}</td>
              </tr>)}</tbody>
            </table>
          </div>}
      </CardContent>
    </Card>

    {data && <p className="text-xs text-muted-foreground">Priority-1 lessons: {priorityOne.length}. Status generated {new Date(data.generatedAt).toLocaleString()}.</p>}
  </div>;
}

export default StaticGkVisualAtlasWorkspacePage;
