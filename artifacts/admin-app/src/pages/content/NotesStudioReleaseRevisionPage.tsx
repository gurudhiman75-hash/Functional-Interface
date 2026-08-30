import { useEffect, useState } from 'react';
import { Eye, GitBranch, Loader2, RefreshCw, Send, ShieldCheck, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type VersionIndexItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  versionNumber: number;
  learnerTitle: string;
  sourceLanguage: string;
  approvedAt: string;
  predecessorApprovedVersionId: string | null;
  lineageRootApprovedVersionId: string | null;
  successorJobId: string | null;
  successorJobTitle: string | null;
  successorRevisionNumber: number | null;
};

type ReleaseVariant = {
  key: 'source' | 'hi' | 'pa';
  languageCode: string;
  localizationState: string | null;
  materialized: boolean;
  resourceId: string | null;
  publicCode: string | null;
  resourceStatus: string | null;
  title: string;
  summary: string;
  bodyMarkdown: string;
  frozenContentHash: string | null;
  integrityMatchesFrozenVersion: boolean;
  handoffId: string | null;
  handedOffAt: string | null;
  handedOffBy: string | null;
  readyForHandoff: boolean;
};

type ReleaseWorkspace = {
  version: {
    id: string;
    jobId: string;
    jobTitle: string;
    versionNumber: number;
    sourceLanguage: string;
    learnerTitle: string;
    learnerSummary: string;
    contentHash: string;
    approvedAt: string;
    revisionReason: string | null;
    predecessorApprovedVersionId: string | null;
    lineageRootApprovedVersionId: string | null;
    predecessorVersionNumber: number | null;
    predecessorLearnerTitle: string | null;
    predecessorResourceId: string | null;
    predecessorPublicCode: string | null;
    successorJobId: string | null;
    successorJobTitle: string | null;
    successorJobState: string | null;
    successorRevisionNumber: number | null;
  };
  variants: ReleaseVariant[];
  publicationBoundary: {
    handoffPublishesResource: boolean;
    automaticPublicationEnabled: boolean;
    materializedLearnerCopyFrozen: boolean;
    successorCopiesEvidenceOrQa: boolean;
    publishSurface: string;
  };
};

type SuccessorResponse = {
  successorJob: {
    id: string;
    title: string;
    state: string;
    revisionNumber: number;
  };
  release: ReleaseWorkspace;
};

const variantLabels: Record<ReleaseVariant['key'], string> = {
  source: 'Source language',
  hi: 'Hindi',
  pa: 'Punjabi',
};

function pretty(value: string | null | undefined) {
  if (!value) return '—';
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function shortId(value: string | null | undefined) {
  return value ? `${value.slice(0, 8)}…` : '—';
}

function LearnerPreview({ body }: { body: string }) {
  if (!body.trim()) return <div className="text-sm text-muted-foreground">No learner body is available yet.</div>;
  return <div className="max-h-[380px] overflow-auto rounded-lg border bg-background p-4 text-sm leading-6">
    {body.split('\n').map((line, index) => {
      const value = line.trim();
      if (!value) return <div key={index} className="h-2" />;
      if (value.startsWith('### ')) return <h4 key={index} className="mt-3 font-semibold">{value.slice(4)}</h4>;
      if (value.startsWith('## ')) return <h3 key={index} className="mt-4 text-base font-semibold">{value.slice(3)}</h3>;
      if (value.startsWith('# ')) return <h2 key={index} className="mt-4 text-lg font-semibold">{value.slice(2)}</h2>;
      if (/^[-*]\s+/.test(value)) return <div key={index} className="pl-3">• {value.replace(/^[-*]\s+/, '')}</div>;
      return <p key={index}>{line}</p>;
    })}
  </div>;
}

export function NotesStudioReleaseRevisionPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const canPublish = hasPermission('content.questions.publish');
  const [versions, setVersions] = useState<VersionIndexItem[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [workspace, setWorkspace] = useState<ReleaseWorkspace | null>(null);
  const [revisionTitle, setRevisionTitle] = useState('');
  const [revisionReason, setRevisionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState('');

  const loadVersions = async () => {
    const response = await adminRequest<{ versions: VersionIndexItem[] }>('/admin/notes-studio/release/versions');
    const next = response.versions ?? [];
    setVersions(next);
    setSelectedVersionId((current) => current && next.some((item) => item.id === current) ? current : next[0]?.id ?? '');
  };

  const loadWorkspace = async (versionId: string) => {
    if (!versionId) {
      setWorkspace(null);
      return;
    }
    setWorkspace(await adminRequest<ReleaseWorkspace>(`/admin/notes-studio/approved-versions/${versionId}/release`));
  };

  useEffect(() => {
    void loadVersions()
      .catch((error) => showToast.error('Unable to load approved note versions', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedVersionId) return;
    setLoading(true);
    void loadWorkspace(selectedVersionId)
      .catch((error) => showToast.error('Unable to load learner release workspace', error instanceof Error ? error.message : 'Request failed.'))
      .finally(() => setLoading(false));
  }, [selectedVersionId]);

  const refresh = async () => {
    setLoading(true);
    try {
      await loadVersions();
      if (selectedVersionId) await loadWorkspace(selectedVersionId);
    } catch (error) {
      showToast.error('Unable to refresh release workspace', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const createRevision = async () => {
    if (!selectedVersionId) return;
    setWorkingKey('revision');
    try {
      const response = await adminRequest<SuccessorResponse>(`/admin/notes-studio/approved-versions/${selectedVersionId}/revise`, {
        method: 'POST',
        body: JSON.stringify({ title: revisionTitle, revisionReason }),
      });
      setWorkspace(response.release);
      setRevisionReason('');
      setRevisionTitle('');
      await loadVersions();
      showToast.success('Successor revision created', `${response.successorJob.title} starts at ${pretty(response.successorJob.state)}. Source-pack references were copied; evidence and QA were not.`);
    } catch (error) {
      showToast.error('Unable to create successor revision', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  const handoff = async (key: ReleaseVariant['key']) => {
    if (!selectedVersionId) return;
    setWorkingKey(`handoff-${key}`);
    try {
      const next = await adminRequest<ReleaseWorkspace>(`/admin/notes-studio/approved-versions/${selectedVersionId}/handoff/${key}`, { method: 'POST' });
      setWorkspace(next);
      showToast.success('Publish handoff recorded', 'The exact frozen draft is ready in Learning Resources. No publish action was performed.');
    } catch (error) {
      showToast.error('Unable to hand off learner draft', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey('');
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Release & Revisions"
      description="Preview exact learner copies, preserve replacement lineage, and hand verified drafts to the existing Learning Resources publish flow. Notes Studio never auto-publishes."
      icon={<GitBranch className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading || Boolean(workingKey)}><RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh</Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(300px,520px)_1fr] lg:items-end">
        <div className="space-y-1.5">
          <Label>Approved version</Label>
          <Select value={selectedVersionId} onValueChange={setSelectedVersionId}>
            <SelectTrigger><SelectValue placeholder="Choose an approved learner version" /></SelectTrigger>
            <SelectContent>{versions.map((item) => <SelectItem key={item.id} value={item.id}>v{item.versionNumber} · {item.learnerTitle}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap gap-2">
          {workspace && <Badge variant="outline">Revision v{workspace.version.versionNumber}</Badge>}
          {workspace?.version.predecessorApprovedVersionId && <Badge variant="outline">Replaces v{workspace.version.predecessorVersionNumber ?? '?'}</Badge>}
          {workspace?.version.successorJobId && <Badge>Successor v{workspace.version.successorRevisionNumber ?? '?'} exists</Badge>}
        </div>
      </CardContent>
    </Card>

    {workspace && <Card>
      <CardHeader><CardTitle className="text-base">Immutable replacement lineage</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Current version</div><div className="mt-1 font-semibold">v{workspace.version.versionNumber}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Predecessor</div><div className="mt-1 font-semibold">{workspace.version.predecessorVersionNumber ? `v${workspace.version.predecessorVersionNumber}` : 'Original version'}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Lineage root</div><div className="mt-1 font-mono text-xs">{shortId(workspace.version.lineageRootApprovedVersionId ?? workspace.version.id)}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Prior canonical note</div><div className="mt-1 font-semibold">{workspace.version.predecessorPublicCode ?? '—'}</div></div>
        </div>
        {workspace.version.revisionReason && <div className="rounded-lg border bg-muted/30 p-3 text-sm"><strong>Revision reason:</strong> {workspace.version.revisionReason}</div>}
        {workspace.version.successorJobId ? <div className="rounded-lg border p-3 text-sm"><strong>Successor already created:</strong> {workspace.version.successorJobTitle} · {pretty(workspace.version.successorJobState)}. This predecessor cannot fork into another replacement job.</div> : <div className="grid gap-3 rounded-lg border border-dashed p-4 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <div className="space-y-1.5"><Label>Successor title <span className="text-muted-foreground">(optional)</span></Label><Input value={revisionTitle} onChange={(event) => setRevisionTitle(event.target.value)} placeholder={`Defaults to revision ${workspace.version.versionNumber + 1}`} disabled={!canEdit} /></div>
          <div className="space-y-1.5"><Label>Revision reason</Label><Textarea value={revisionReason} onChange={(event) => setRevisionReason(event.target.value)} rows={2} placeholder="What changed, and why must a replacement be authored?" disabled={!canEdit} /></div>
          {canEdit && <Button onClick={() => void createRevision()} disabled={revisionReason.trim().length < 4 || Boolean(workingKey)}>{workingKey === 'revision' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <GitBranch className="mr-1.5 h-4 w-4" />}Create successor</Button>}
        </div>}
        <div className="text-xs text-muted-foreground">A successor copies the frozen brief and governed source-pack references only. Claims, evidence decisions, coverage mappings, generated sections and QA passes must be rebuilt.</div>
      </CardContent>
    </Card>}

    {workspace && <div className="grid gap-4 xl:grid-cols-3">
      {workspace.variants.map((variant) => <Card key={variant.key} className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div><CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4" />{variantLabels[variant.key]}</CardTitle><div className="mt-1 text-xs text-muted-foreground">{variant.languageCode} · {variant.publicCode ?? 'not materialized'}</div></div>
            <Badge variant={variant.integrityMatchesFrozenVersion ? 'outline' : 'destructive'}>{variant.integrityMatchesFrozenVersion ? <><ShieldCheck className="mr-1 h-3.5 w-3.5" />Frozen match</> : <><ShieldX className="mr-1 h-3.5 w-3.5" />Drift detected</>}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-2"><Badge variant="outline">{variant.materialized ? pretty(variant.resourceStatus) : pretty(variant.localizationState)}</Badge>{variant.handoffId && <Badge>Handed off</Badge>}</div>
          {variant.title ? <div><div className="font-semibold">{variant.title}</div><div className="mt-1 text-sm text-muted-foreground">{variant.summary}</div></div> : <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">Create and materialize this variant in Approval & Localization before release handoff.</div>}
          {variant.bodyMarkdown && <LearnerPreview body={variant.bodyMarkdown} />}
          {!variant.integrityMatchesFrozenVersion && <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">This canonical learner copy does not match the frozen approved hash. It cannot be handed off; create a successor revision instead.</div>}
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            {canPublish && !variant.handoffId && <Button onClick={() => void handoff(variant.key)} disabled={!variant.readyForHandoff || Boolean(workingKey)}>{workingKey === `handoff-${variant.key}` ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Send className="mr-1.5 h-4 w-4" />}Hand off for publish</Button>}
            {variant.handoffId && <Button asChild variant="outline"><Link to="/content/learning-resources">Open Learning Resources</Link></Button>}
          </div>
          {variant.handoffId && <div className="text-xs text-muted-foreground">Handoff recorded {variant.handedOffAt ? new Date(variant.handedOffAt).toLocaleString() : ''}. Publishing remains an explicit Learning Resources action.</div>}
        </CardContent>
      </Card>)}
    </div>}

    {!loading && versions.length === 0 && <Card><CardContent className="p-6 text-sm text-muted-foreground">No immutable approved Notes Studio versions exist yet. Finish Quality Gates and Approval & Localization first.</CardContent></Card>}
  </div>;
}

export default NotesStudioReleaseRevisionPage;
