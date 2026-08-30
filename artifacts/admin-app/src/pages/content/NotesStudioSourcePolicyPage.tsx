import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Loader2, RefreshCw, ShieldAlert, XCircle } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  sourceLanguage: string;
  state: string;
  brief?: { topicLabel?: string; taxonomyCode?: string };
};

type SourceRole = 'primary_authority' | 'core_reference' | 'exam_context' | 'supplemental';
type TemplateKey = 'balanced' | 'official_first' | 'reference_led' | 'exam_focused' | 'quick_revision';

type TemplateOption = {
  key: TemplateKey;
  name: string;
  description: string;
  minUniqueContent: number;
  minDistinctIdentities: number;
  requirements: Array<{ code: string; label: string; roles: SourceRole[]; minCount: number; generationReadyOnly: boolean }>;
};

type PolicySource = {
  id: string;
  title: string;
  publisher: string;
  sourceUri: string;
  contentHash: string;
  sourceIdentity?: string | null;
  rightsBasis: string;
  retentionMode: string;
  extractionStatus: string;
  retainedCharCount: number;
  inclusionState: string;
  sourceRole: SourceRole;
  position: number;
  generationReady: boolean;
};

type PolicyStatus = {
  job: AuthoringJob & { sourcePackTemplate: TemplateKey };
  sources: PolicySource[];
  policy: {
    templateKey: TemplateKey;
    name: string;
    description: string;
    ready: boolean;
    requirements: Array<{
      code: string;
      label: string;
      roles: SourceRole[];
      minCount: number;
      generationReadyOnly: boolean;
      currentCount: number;
      satisfied: boolean;
    }>;
    missing: Array<{ code: string; label: string; currentCount: number; minCount: number }>;
    integrity: {
      minUniqueContent: number;
      minDistinctIdentities: number;
      uniqueContentCount: number;
      distinctIdentityCount: number;
      ready: boolean;
      findings: Array<{ code: string; label: string; currentCount: number; minCount: number }>;
    };
  };
  policyLocked: boolean;
};

type PolicyOptions = { roles: SourceRole[]; templates: TemplateOption[]; defaultTemplate: TemplateKey };

const roleLabels: Record<SourceRole, string> = {
  primary_authority: 'Primary authority',
  core_reference: 'Core reference',
  exam_context: 'Exam context',
  supplemental: 'Supplemental',
};

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioSourcePolicyPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [options, setOptions] = useState<PolicyOptions>({ roles: [], templates: [], defaultTemplate: 'balanced' });
  const [status, setStatus] = useState<PolicyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const loadPolicy = async (jobId: string) => {
    if (!jobId) {
      setStatus(null);
      return;
    }
    setStatus(await adminRequest<PolicyStatus>(`/admin/notes-studio/jobs/${jobId}/source-policy`));
  };

  const load = async () => {
    setLoading(true);
    try {
      const [jobResult, optionResult] = await Promise.all([
        adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs'),
        adminRequest<PolicyOptions>('/admin/notes-studio/source-policy/options'),
      ]);
      const nextJobs = jobResult.jobs ?? [];
      setJobs(nextJobs);
      setOptions(optionResult);
      const nextId = selectedJobId && nextJobs.some((job) => job.id === selectedJobId) ? selectedJobId : nextJobs[0]?.id ?? '';
      setSelectedJobId(nextId);
      if (nextId) await loadPolicy(nextId);
      else setStatus(null);
    } catch (error) {
      showToast.error('Unable to load source-pack policy', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!selectedJobId) return;
    void loadPolicy(selectedJobId).catch((error) => {
      setStatus(null);
      showToast.error('Unable to load source-pack status', error instanceof Error ? error.message : 'Request failed.');
    });
  }, [selectedJobId]);

  const changeTemplate = async (templateKey: string) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      setStatus(await adminRequest<PolicyStatus>(`/admin/notes-studio/jobs/${selectedJobId}/source-policy`, {
        method: 'PATCH',
        body: JSON.stringify({ templateKey }),
      }));
      showToast.success('Source-pack template updated', 'Evidence extraction now uses the selected research requirements.');
    } catch (error) {
      showToast.error('Unable to change source-pack template', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const changeRole = async (sourceId: string, sourceRole: SourceRole) => {
    if (!selectedJobId) return;
    setWorking(true);
    try {
      setStatus(await adminRequest<PolicyStatus>(`/admin/notes-studio/jobs/${selectedJobId}/sources/${sourceId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ sourceRole }),
      }));
    } catch (error) {
      showToast.error('Unable to change research role', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Source Policy"
      description="Choose the research recipe for a note, classify every source by its job-specific role, and satisfy the source-pack gate before evidence extraction."
      icon={<ClipboardCheck className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading || working}>
        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh
      </Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId || undefined} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
          {selectedJob && <div className="text-xs text-muted-foreground">{selectedJob.brief?.taxonomyCode || selectedJob.brief?.topicLabel || 'No taxonomy label'} · {prettyState(selectedJob.state)}</div>}
        </div>
        <div className="space-y-1.5">
          <Label>Source-pack template</Label>
          <Select value={status?.policy.templateKey ?? options.defaultTemplate} onValueChange={(value) => void changeTemplate(value)} disabled={!canEdit || !status || status.policyLocked || working}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{options.templates.map((template) => <SelectItem key={template.key} value={template.key}>{template.name}</SelectItem>)}</SelectContent>
          </Select>
          {status && <div className="text-xs text-muted-foreground">{status.policy.description}</div>}
        </div>
      </CardContent>
    </Card>

    {status && <>
      <Card className={status.policy.ready ? 'border-emerald-200' : 'border-amber-300'}>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            {status.policy.ready ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" /> : <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" />}
            <div>
              <div className="font-semibold">{status.policy.ready ? 'Evidence gate ready' : 'Evidence gate blocked by source mix'}</div>
              <div className="mt-1 text-sm text-muted-foreground">{status.policy.ready ? 'This source pack satisfies the selected research template and independence checks.' : 'Classify, replace, or add the missing independent sources before rebuilding evidence.'}</div>
            </div>
          </div>
          <Badge variant={status.policy.ready ? 'default' : 'outline'}>{status.policy.ready ? 'READY' : 'BLOCKED'}</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {status.policy.requirements.map((requirement) => <Card key={requirement.code}>
          <CardContent className="flex items-start gap-3 p-4">
            {requirement.satisfied ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 text-destructive" />}
            <div>
              <div className="text-sm font-medium">{requirement.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{requirement.currentCount}/{requirement.minCount} present · {requirement.generationReadyOnly ? 'retained evidence text required' : 'provenance source accepted'}</div>
            </div>
          </CardContent>
        </Card>)}
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            {status.policy.integrity.uniqueContentCount >= status.policy.integrity.minUniqueContent ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 text-destructive" />}
            <div>
              <div className="text-sm font-medium">Independent content</div>
              <div className="mt-1 text-xs text-muted-foreground">{status.policy.integrity.uniqueContentCount}/{status.policy.integrity.minUniqueContent} unique content hashes · duplicate copies do not add evidence breadth</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-4">
            {status.policy.integrity.distinctIdentityCount >= status.policy.integrity.minDistinctIdentities ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <XCircle className="mt-0.5 h-4 w-4 text-destructive" />}
            <div>
              <div className="text-sm font-medium">Independent identities</div>
              <div className="mt-1 text-xs text-muted-foreground">{status.policy.integrity.distinctIdentityCount}/{status.policy.integrity.minDistinctIdentities} publisher/domain identities · same-publisher copies cannot satisfy an independence promise</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {status.policy.integrity.findings.length > 0 && <Card className="border-amber-200">
        <CardHeader><CardTitle className="text-base">Independence gaps</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {status.policy.integrity.findings.map((finding) => <div key={finding.code} className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm">
            <span>{finding.label}</span><Badge variant="outline">{finding.currentCount}/{finding.minCount}</Badge>
          </div>)}
          <p className="text-sm text-muted-foreground">Use Source Pack Proposals or Source Library to add a genuinely different governed source. Evidence extraction remains server-blocked until these checks pass.</p>
        </CardContent>
      </Card>}

      <Card>
        <CardHeader><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-base">Research roles</CardTitle><p className="mt-1 text-sm text-muted-foreground">Roles describe how a source serves this note. They do not change the source's rights basis or retained-text policy.</p></div>{status.policyLocked && <Badge variant="outline">Frozen after evidence begins</Badge>}</div></CardHeader>
        <CardContent className="space-y-2">
          {status.sources.length === 0 && <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">No sources attached. Add or reuse sources in Source Library / Brief & Sources first.</div>}
          {status.sources.map((source) => <div key={source.id} className="grid gap-3 rounded-lg border p-3 lg:grid-cols-[minmax(0,1fr)_180px_auto] lg:items-center">
            <div className="min-w-0">
              <div className="font-medium">{source.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{source.publisher || 'Publisher not recorded'} · {source.rightsBasis.replaceAll('_', ' ')} · {source.inclusionState}</div>
            </div>
            <Select value={source.sourceRole} onValueChange={(value) => void changeRole(source.id, value as SourceRole)} disabled={!canEdit || status.policyLocked || working}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{options.roles.map((role) => <SelectItem key={role} value={role}>{roleLabels[role]}</SelectItem>)}</SelectContent>
            </Select>
            <Badge variant={source.generationReady ? 'default' : 'outline'}>{source.generationReady ? 'Generation-ready' : source.retentionMode === 'metadata_only' ? 'Provenance only' : 'Not ready'}</Badge>
          </div>)}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Lifecycle lock:</strong> template and role edits freeze as soon as the job moves beyond Brief/Sources Ready. The evidence rebuild endpoint independently re-evaluates role counts, unique content hashes, and publisher/domain independence server-side; the UI cannot bypass the gate.
        </CardContent>
      </Card>
    </>}
  </div>;
}

export default NotesStudioSourcePolicyPage;
