import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, Film, Loader2, Map as MapIcon, Play, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminBlobRequest, adminRequest } from '@/lib/admin-request';

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

type RenderJobStatus = 'queued' | 'rendering' | 'synthesizing-audio' | 'assembling' | 'automated-qa' | 'review-ready' | 'approved' | 'failed';

type RenderJob = {
  id: string;
  visualId: string;
  status: RenderJobStatus;
  progress: number;
  activePhase: string;
  requestedAt: string;
  startedAt: string | null;
  renderCompletedAt: string | null;
  approvedAt: string | null;
  requestedBy: { displayName: string; email: string };
  approvedBy: { displayName: string; email: string } | null;
  error: string | null;
  artifacts: string[];
};

type RenderCapability = {
  enabled: boolean;
  ready: boolean;
  supportedVisualIds: string[];
  geometryConfigured: boolean;
  ttsConfigured: boolean;
  jobRootConfigured: boolean;
  toolRunnerAvailable: boolean;
  blockers: string[];
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
  renderJobs: { capability: RenderCapability; recent: RenderJob[] };
  items: AtlasItem[];
  generatedAt: string;
};

function readinessLabel(value: AtlasItem['readiness']) {
  return value.replace(/-/g, ' ');
}

function readinessClass(value: AtlasItem['readiness']) {
  if (value === 'render-ready') return 'border-success/30 bg-success/5 text-success';
  if (value === 'geometry-pending' || value === 'district-verification-pending') return 'border-warning/30 bg-warning/5 text-warning';
  return 'border-border bg-muted/30 text-muted-foreground';
}

function isActiveJob(status: RenderJobStatus) {
  return ['queued', 'rendering', 'synthesizing-audio', 'assembling', 'automated-qa'].includes(status);
}

function jobClass(status: RenderJobStatus) {
  if (status === 'approved' || status === 'review-ready') return 'border-success/30 bg-success/5 text-success';
  if (status === 'failed') return 'border-destructive/30 bg-destructive/5 text-destructive';
  return 'border-warning/30 bg-warning/5 text-warning';
}

function jobLabel(status: RenderJobStatus) {
  return status.replace(/-/g, ' ');
}

export function StaticGkVisualAtlasWorkspacePage() {
  const [data, setData] = useState<AtlasStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingVisualId, setStartingVisualId] = useState<string | null>(null);
  const [reviewingJobId, setReviewingJobId] = useState<string | null>(null);
  const [previewLoadingJobId, setPreviewLoadingJobId] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ jobId: string; title: string; url: string } | null>(null);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      setData(await adminRequest<AtlasStatus>('/admin/static-gk-visual-atlas'));
    } catch (error) {
      if (!silent) showToast.error('Unable to load Visual Atlas', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const hasActiveJobs = data?.renderJobs.recent.some((job) => isActiveJob(job.status)) ?? false;
  useEffect(() => {
    if (!hasActiveJobs) return;
    const timer = window.setInterval(() => { void load(true); }, 3000);
    return () => window.clearInterval(timer);
  }, [hasActiveJobs]);

  useEffect(() => () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
  }, [preview?.url]);

  const priorityOne = useMemo(() => data?.items.filter((item) => item.priority === 1) ?? [], [data]);
  const itemById = useMemo(() => new Map((data?.items ?? []).map((item) => [item.id, item])), [data]);

  const startRender = async (visualId: string) => {
    setStartingVisualId(visualId);
    try {
      await adminRequest('/admin/static-gk-visual-atlas/render-jobs', {
        method: 'POST',
        body: JSON.stringify({ visualId }),
      });
      showToast.success('Render job started', 'The lesson is now moving through visual render, narration and automated QA.');
      await load(true);
    } catch (error) {
      showToast.error('Unable to start render', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setStartingVisualId(null);
    }
  };

  const openPreview = async (job: RenderJob) => {
    setPreviewLoadingJobId(job.id);
    try {
      const blob = await adminBlobRequest(`/admin/static-gk-visual-atlas/render-jobs/${job.id}/artifacts/video`);
      const url = URL.createObjectURL(blob);
      setPreview({ jobId: job.id, title: itemById.get(job.visualId)?.title ?? job.visualId, url });
    } catch (error) {
      showToast.error('Unable to load video preview', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setPreviewLoadingJobId(null);
    }
  };

  const approve = async (job: RenderJob) => {
    const confirmed = window.confirm(
      'Approve this master for publication? Confirm only after you have reviewed narration/pronunciation and the final visual/factual accuracy. This does not publish automatically.',
    );
    if (!confirmed) return;
    setReviewingJobId(job.id);
    try {
      await adminRequest(`/admin/static-gk-visual-atlas/render-jobs/${job.id}/review`, {
        method: 'POST',
        body: JSON.stringify({ acknowledgeNarrationReview: true, acknowledgeVisualFactReview: true }),
      });
      showToast.success('Master approved', 'An approval receipt was created. Publication remains a separate action.');
      await load(true);
    } catch (error) {
      showToast.error('Unable to approve master', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setReviewingJobId(null);
    }
  };

  return <div className="space-y-6">
    <PageHeader
      title="Static GK Visual Atlas"
      description="Source-locked, geometry-verified visual lessons for Static GK. Production maps fail closed until authoritative geometry is ingested."
      icon={<MapIcon className="h-5 w-5" />}
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
      <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4" /> Geometry authority</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {data?.runtimeGeometry && <div className="rounded-lg border p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="font-medium">Runtime geometry bundle</div><div className="mt-1 text-xs text-muted-foreground">
              {data.runtimeGeometry.loaded ? `${data.runtimeGeometry.sourceProductCode ?? data.runtimeGeometry.geometryId ?? 'validated source'} · ${data.runtimeGeometry.source}` : data.runtimeGeometry.configured ? `Configured via ${data.runtimeGeometry.source}, validation not available` : 'No runtime path/URL configured'}
            </div></div>
            <Badge variant="outline" className={data.runtimeGeometry.loaded ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}>{data.runtimeGeometry.loaded ? 'verified runtime' : 'not loaded'}</Badge>
          </div>
          {data.runtimeGeometry.canonicalGeoJsonSha256 && <div className="mt-2 font-mono text-[11px] text-muted-foreground">SHA-256 {data.runtimeGeometry.canonicalGeoJsonSha256.slice(0, 16)}…</div>}
          {data.runtimeGeometry.error && <div className="mt-2 text-xs leading-5 text-destructive">{data.runtimeGeometry.error}</div>}
        </div>}
        {(data?.geometryAssets ?? []).map((asset) => <div key={asset.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0"><div className="font-medium">{asset.name}</div><div className="mt-1 text-xs text-muted-foreground">{asset.sourcePublisher}{asset.sourceProductCode ? ` · ${asset.sourceProductCode}` : ''} · {asset.kind}</div></div>
          <Badge variant="outline">{asset.status.replace(/-/g, ' ')}</Badge>
        </div>)}
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Film className="h-4 w-4" /> Render jobs</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {data?.renderJobs.capability && <div className="rounded-lg border p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="font-medium">Pre-publication render worker</div><div className="mt-1 text-xs text-muted-foreground">Deterministic visuals → measured narration → narrated master → automated audio QA → human review.</div></div>
            <Badge variant="outline" className={data.renderJobs.capability.ready ? 'border-success/30 bg-success/5 text-success' : 'border-warning/30 bg-warning/5 text-warning'}>{data.renderJobs.capability.ready ? 'ready' : 'configuration required'}</Badge>
          </div>
          {!data.renderJobs.capability.ready && <div className="mt-3 space-y-1 text-xs text-warning">{data.renderJobs.capability.blockers.map((blocker) => <div key={blocker}>• {blocker}</div>)}</div>}
        </div>}

        {(data?.renderJobs.recent ?? []).length === 0 ? <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No render jobs yet. Start one from a render-ready pilot lesson below.</div> :
          <div className="space-y-3">{data?.renderJobs.recent.map((job) => {
            const title = itemById.get(job.visualId)?.title ?? job.visualId;
            return <div key={job.id} className="rounded-lg border p-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-medium">{title}</span><Badge variant="outline" className={jobClass(job.status)}>{jobLabel(job.status)}</Badge></div>
                  <div className="mt-1 font-mono text-[11px] text-muted-foreground">{job.id}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{job.activePhase}</div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full bg-foreground transition-all" style={{ width: `${Math.max(2, job.progress)}%` }} /></div>
                  {job.error && <div className="mt-2 flex items-start gap-2 text-xs text-destructive"><CircleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />{job.error}</div>}
                  <div className="mt-2 text-[11px] text-muted-foreground">Requested by {job.requestedBy.displayName} · {new Date(job.requestedAt).toLocaleString()}</div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {(job.status === 'review-ready' || job.status === 'approved') && job.artifacts.includes('video') && <Button variant="outline" size="sm" onClick={() => void openPreview(job)} disabled={previewLoadingJobId === job.id}>
                    {previewLoadingJobId === job.id ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}Preview
                  </Button>}
                  {job.status === 'review-ready' && <Button size="sm" onClick={() => void approve(job)} disabled={reviewingJobId === job.id}>
                    {reviewingJobId === job.id ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-2 h-3.5 w-3.5" />}Approve for publish
                  </Button>}
                </div>
              </div>
            </div>;
          })}</div>}
      </CardContent>
    </Card>

    {preview && <Card>
      <CardHeader className="pb-3"><CardTitle className="flex items-center justify-between gap-3 text-base"><span>Review preview · {preview.title}</span><Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Close</Button></CardTitle></CardHeader>
      <CardContent><div className="mx-auto max-w-sm overflow-hidden rounded-2xl border bg-black"><video key={preview.url} src={preview.url} controls playsInline className="aspect-[9/16] w-full object-contain" /></div><p className="mx-auto mt-3 max-w-xl text-center text-xs text-muted-foreground">Review pronunciation, timing, labels, map geometry and factual accuracy before approving. Approval creates an audit receipt; it does not publish the video.</p></CardContent>
    </Card>}

    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base">Pilot readiness</CardTitle></CardHeader>
      <CardContent>
        {loading && !data ? <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading Visual Atlas status…</div> :
          <div className="overflow-x-auto"><table className="w-full min-w-[1040px] text-sm">
            <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground"><th className="px-3 py-3">Lesson</th><th className="px-3 py-3">Area</th><th className="px-3 py-3">Fact lock</th><th className="px-3 py-3">Compiler</th><th className="px-3 py-3">Readiness</th><th className="px-3 py-3">Current blocker</th><th className="px-3 py-3">Action</th></tr></thead>
            <tbody>{(data?.items ?? []).map((item) => {
              const active = data?.renderJobs.recent.find((job) => job.visualId === item.id && isActiveJob(job.status));
              const supported = data?.renderJobs.capability.supportedVisualIds.includes(item.id) ?? false;
              const canStart = supported && item.readiness === 'render-ready' && Boolean(data?.renderJobs.capability.ready) && !active;
              return <tr key={item.id} className="border-b align-top last:border-0">
                <td className="px-3 py-4"><div className="font-medium">{item.title}</div><div className="mt-1 font-mono text-xs text-muted-foreground">{item.id} · P{item.priority}</div></td>
                <td className="px-3 py-4"><div>{item.subcategory}</div><div className="mt-1 text-xs text-muted-foreground">{item.category}</div></td>
                <td className="px-3 py-4"><Badge variant="outline">{item.factLockStatus.replace(/-/g, ' ')}</Badge></td>
                <td className="px-3 py-4 font-mono text-xs">{item.sceneCompiler}</td>
                <td className="px-3 py-4"><Badge variant="outline" className={readinessClass(item.readiness)}>{readinessLabel(item.readiness)}</Badge></td>
                <td className="max-w-sm px-3 py-4 text-xs leading-5 text-muted-foreground">{item.blockers[0] ?? 'No current blocker.'}</td>
                <td className="px-3 py-4">{supported ? <Button size="sm" variant={canStart ? 'default' : 'outline'} disabled={!canStart || startingVisualId === item.id} onClick={() => void startRender(item.id)}>
                  {startingVisualId === item.id || Boolean(active) ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}{active ? 'Rendering' : 'Render short'}
                </Button> : <span className="text-xs text-muted-foreground">Not compiled</span>}</td>
              </tr>;
            })}</tbody>
          </table></div>}
      </CardContent>
    </Card>

    {data && <p className="text-xs text-muted-foreground">Priority-1 lessons: {priorityOne.length}. Status generated {new Date(data.generatedAt).toLocaleString()}.</p>}
  </div>;
}

export default StaticGkVisualAtlasWorkspacePage;
