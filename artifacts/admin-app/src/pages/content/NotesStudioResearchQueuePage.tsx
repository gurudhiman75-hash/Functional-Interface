import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, FlaskConical, Loader2, RefreshCw, Search, Sparkles, TriangleAlert } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type QueueStatus = 'ready_for_evidence' | 'proposal_ready' | 'partial_proposal' | 'manual_research_required';

type QueueItem = {
  id: string;
  title: string;
  state: string;
  updatedAt: string;
  taxonomyCode: string;
  topicLabel: string;
  depth: string;
  sourcePackTemplate: string;
  policy: {
    ready: boolean;
    name: string;
    missing: Array<{ code: string; label: string; currentCount: number; minCount: number }>;
  };
  proposal: {
    complete: boolean;
    itemCount: number;
    candidateCount: number;
    unresolved: Array<{ requirementCode: string; label: string; missingCount: number }>;
  };
  queueStatus: QueueStatus;
  evaluationError: string | null;
};

type QueueResponse = {
  items: QueueItem[];
  summary: {
    total: number;
    readyForEvidence: number;
    proposalReady: number;
    partialProposal: number;
    manualResearchRequired: number;
    evaluationErrors: number;
  };
  limit: number;
  proposalConcurrency: number;
  externalNetworkSearch: boolean;
  automaticProposalApply: boolean;
  automaticEvidenceGeneration: boolean;
  rawSourceBodiesReturned: boolean;
};

const statusLabels: Record<QueueStatus, string> = {
  ready_for_evidence: 'Ready for evidence',
  proposal_ready: 'Proposal ready',
  partial_proposal: 'Partial proposal',
  manual_research_required: 'Manual research',
};

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function statusVariant(status: QueueStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'ready_for_evidence') return 'default';
  if (status === 'manual_research_required') return 'destructive';
  if (status === 'proposal_ready') return 'secondary';
  return 'outline';
}

export function NotesStudioResearchQueuePage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [data, setData] = useState<QueueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingJobId, setWorkingJobId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | QueueStatus>('all');

  const load = async () => {
    setLoading(true);
    try {
      setData(await adminRequest<QueueResponse>('/admin/notes-studio/research-queue?limit=30'));
    } catch (error) {
      showToast.error('Unable to load research queue', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (data?.items ?? []).filter((item) => {
      if (statusFilter !== 'all' && item.queueStatus !== statusFilter) return false;
      if (!needle) return true;
      return `${item.title} ${item.taxonomyCode} ${item.topicLabel} ${item.policy.name}`.toLowerCase().includes(needle);
    });
  }, [data, query, statusFilter]);

  const applyProposal = async (item: QueueItem) => {
    setWorkingJobId(item.id);
    try {
      const result = await adminRequest<{ appliedCount: number }>(`/admin/notes-studio/jobs/${item.id}/source-pack-proposal/apply`, {
        method: 'POST',
        body: JSON.stringify({ editorApproved: true, origin: 'research_queue' }),
      });
      await load();
      showToast.success('Proposal applied', `${result.appliedCount} governed source${result.appliedCount === 1 ? '' : 's'} attached. The queue has been recalculated.`);
    } catch (error) {
      showToast.error('Unable to apply proposal', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingJobId(null);
    }
  };

  const summary = data?.summary;

  return <div className="space-y-5">
    <PageHeader
      title="Research queue"
      description="One bounded operational queue for active Notes Studio research: resolve governed proposal wins first, identify partial packs, and isolate jobs that truly need new manual research."
      icon={<FlaskConical className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading}>
        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-1.5 h-4 w-4" />}Refresh
      </Button>}
    />

    {summary && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Active research jobs</div><div className="mt-1 text-2xl font-semibold">{summary.total}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Proposal ready</div><div className="mt-1 text-2xl font-semibold">{summary.proposalReady}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Partial proposal</div><div className="mt-1 text-2xl font-semibold">{summary.partialProposal}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Manual research</div><div className="mt-1 text-2xl font-semibold">{summary.manualResearchRequired}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Ready for evidence</div><div className="mt-1 text-2xl font-semibold">{summary.readyForEvidence}</div></CardContent></Card>
    </div>}

    <Card>
      <CardContent className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, taxonomy or policy…" className="pl-9" /></div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as 'all' | QueueStatus)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All queue states</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>

    <div className="space-y-3">
      {!loading && filtered.length === 0 && <Card><CardContent className="p-6 text-sm text-muted-foreground">No research-stage job matches this filter.</CardContent></Card>}
      {filtered.map((item) => <Card key={item.id}>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{item.title}</CardTitle>
              <div className="mt-1 text-xs text-muted-foreground">{item.taxonomyCode || item.topicLabel || 'Unmapped topic'} · {pretty(item.depth)} · {item.policy.name}</div>
            </div>
            <Badge variant={statusVariant(item.queueStatus)}>{statusLabels[item.queueStatus]}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {item.queueStatus === 'ready_for_evidence' && <div className="flex items-start gap-2 rounded-lg border p-3 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /><div>Source Policy is satisfied. This job can proceed to Evidence & coverage.</div></div>}
          {(item.queueStatus === 'proposal_ready' || item.queueStatus === 'partial_proposal') && <div className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm"><strong>{item.proposal.itemCount}</strong> governed source{item.proposal.itemCount === 1 ? '' : 's'} can be proposed from {item.proposal.candidateCount} eligible related candidates.</div>
              <Button size="sm" onClick={() => void applyProposal(item)} disabled={!canEdit || workingJobId === item.id}>
                {workingJobId === item.id ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}Apply reviewed proposal
              </Button>
            </div>
            {item.proposal.unresolved.length > 0 && <div className="mt-2 text-xs text-muted-foreground">Still unresolved after proposal: {item.proposal.unresolved.map((entry) => `${entry.label} ×${entry.missingCount}`).join('; ')}</div>}
          </div>}
          {item.queueStatus === 'manual_research_required' && <div className="flex items-start gap-2 rounded-lg border border-amber-300 p-3 text-sm"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /><div>No governed related source can currently fill the missing Source Policy role. Manual source discovery/intake is required.</div></div>}
          {item.policy.missing.length > 0 && <div className="flex flex-wrap gap-2">{item.policy.missing.map((missing) => <Badge key={missing.code} variant="outline">{missing.label}: {missing.currentCount}/{missing.minCount}</Badge>)}</div>}
          {item.evaluationError && <div className="text-xs text-destructive">Evaluation error: {item.evaluationError}</div>}
        </CardContent>
      </Card>)}
    </div>

    <Card>
      <CardContent className="p-4 text-sm text-muted-foreground">
        Research Queue is read-only except for the same explicit editor-approved proposal apply action used by Pack proposals. It does not search the web, attach sources silently, expose retained source bodies, or start evidence generation. Queue loads are capped at {data?.limit ?? 30} active jobs with proposal evaluation concurrency {data?.proposalConcurrency ?? 4}.
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioResearchQueuePage;
