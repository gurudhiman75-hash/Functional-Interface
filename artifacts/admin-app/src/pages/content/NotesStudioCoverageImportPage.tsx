import { useEffect, useMemo, useState } from 'react';
import { Braces, CheckCircle2, Loader2, RefreshCw, Upload } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  brief: { topicLabel?: string };
};

type CoverageResult = {
  items: Array<{ id: string; title: string; priority: string; plannedDepth: string }>;
  summary: { itemCount: number; covered: number; partial: number; blocked: number; uncovered: number };
};

type CoverageImportItem = {
  title: string;
  syllabusRef?: string;
  priority?: 'required' | 'high' | 'supporting' | 'exclude';
  plannedDepth?: 'brief' | 'standard' | 'deep';
  examRationale?: string;
  sortOrder?: number;
};

type ImportResponse = {
  jobId: string;
  createdCount: number;
  itemIds: string[];
  atomic: boolean;
  generatedClaims: boolean;
  automaticEvidenceMapping: boolean;
  automaticGeneration: boolean;
};

const editableStates = new Set(['brief', 'sources_ready', 'evidence_ready', 'outline_ready']);
const starterJson = JSON.stringify([
  {
    title: 'Core syllabus concept',
    syllabusRef: 'Subject → Topic → Concept',
    priority: 'required',
    plannedDepth: 'standard',
    examRationale: 'Foundational concept that must be evidence-backed.',
    sortOrder: 0,
  },
  {
    title: 'High-yield comparison',
    syllabusRef: 'Subject → Topic → Revision',
    priority: 'high',
    plannedDepth: 'brief',
    examRationale: 'Consolidates accepted claims for rapid revision.',
    sortOrder: 1,
  },
], null, 2);

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function parsePayload(value: string): CoverageImportItem[] {
  const parsed = JSON.parse(value) as unknown;
  const items = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === 'object' && Array.isArray((parsed as { items?: unknown }).items)
      ? (parsed as { items: unknown[] }).items
      : null;
  if (!items) throw new Error('Paste a JSON array, or an object containing an items array.');
  if (items.length < 1 || items.length > 50) throw new Error('Import between 1 and 50 coverage targets at a time.');
  return items.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error(`Item ${index + 1} must be an object.`);
    const record = item as Record<string, unknown>;
    const title = typeof record.title === 'string' ? record.title.trim() : '';
    if (title.length < 2) throw new Error(`Item ${index + 1} needs a title.`);
    return record as CoverageImportItem;
  });
}

export function NotesStudioCoverageImportPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [payload, setPayload] = useState(starterJson);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);
  const editable = Boolean(selectedJob && editableStates.has(selectedJob.state));
  const parsed = useMemo(() => {
    try {
      const items = parsePayload(payload);
      return { items, error: null as string | null };
    } catch (error) {
      return { items: [] as CoverageImportItem[], error: error instanceof Error ? error.message : 'Invalid JSON.' };
    }
  }, [payload]);

  const loadJobs = async () => {
    const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
    const next = result.jobs ?? [];
    setJobs(next);
    setSelectedJobId((current) => current && next.some((job) => job.id === current) ? current : next[0]?.id ?? '');
  };

  const loadCoverage = async (jobId: string) => {
    if (!jobId) {
      setCoverage(null);
      return;
    }
    setCoverage(await adminRequest<CoverageResult>(`/admin/notes-studio/jobs/${jobId}/coverage`));
  };

  const load = async () => {
    setLoading(true);
    try {
      await loadJobs();
    } catch (error) {
      showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    void loadCoverage(selectedJobId).catch((error) => {
      setCoverage(null);
      showToast.error('Unable to load coverage plan', error instanceof Error ? error.message : 'Request failed.');
    });
  }, [selectedJobId]);

  const refresh = async () => {
    setWorking(true);
    try {
      await Promise.all([loadJobs(), loadCoverage(selectedJobId)]);
    } catch (error) {
      showToast.error('Unable to refresh coverage import', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  const importPlan = async () => {
    if (!selectedJobId || !editable || parsed.error || parsed.items.length === 0) return;
    setWorking(true);
    try {
      const result = await adminRequest<ImportResponse>(`/admin/notes-studio/jobs/${selectedJobId}/coverage/bulk`, {
        method: 'POST',
        body: JSON.stringify({ items: parsed.items }),
      });
      await Promise.all([loadJobs(), loadCoverage(selectedJobId)]);
      showToast.success(
        'Coverage plan imported',
        `${result.createdCount} target${result.createdCount === 1 ? '' : 's'} created atomically. No claims, evidence mappings or sections were generated.`,
      );
    } catch (error) {
      showToast.error('Unable to import coverage plan', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(false);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Coverage Import"
      description="Load a reviewed syllabus coverage plan in one bounded, atomic action. This creates coverage targets only; evidence, claims and learner content remain separately governed."
      icon={<Braces className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading || working}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
      </Button>}
    />

    <Card>
      <CardContent className="grid gap-4 p-4 lg:grid-cols-[minmax(280px,440px)_1fr] lg:items-end">
        <div className="space-y-1.5">
          <Label>Authoring job</Label>
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger><SelectValue placeholder="Choose an authoring job" /></SelectTrigger>
            <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {selectedJob && <div className="flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="outline">{pretty(selectedJob.state)}</Badge>
          <Badge variant={editable ? 'default' : 'secondary'}>{editable ? 'Coverage editable' : 'Coverage frozen'}</Badge>
          {selectedJob.brief?.topicLabel && <span className="text-muted-foreground">{selectedJob.brief.topicLabel}</span>}
        </div>}
      </CardContent>
    </Card>

    <div className="grid gap-3 sm:grid-cols-3">
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Existing targets</div><div className="mt-1 text-2xl font-semibold">{coverage?.summary.itemCount ?? 0}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Parsed import</div><div className="mt-1 text-2xl font-semibold">{parsed.items.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Write mode</div><div className="mt-1 text-sm font-semibold">Atomic append · max 50</div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Reviewed coverage JSON</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Coverage targets</Label>
          <Textarea
            className="min-h-[360px] font-mono text-xs"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            spellCheck={false}
          />
          {parsed.error
            ? <p className="text-sm text-destructive">{parsed.error}</p>
            : <p className="text-sm text-muted-foreground">Valid JSON: {parsed.items.length} target{parsed.items.length === 1 ? '' : 's'} ready for server-side validation.</p>}
        </div>

        {parsed.items.length > 0 && !parsed.error && <div className="rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium"><CheckCircle2 className="h-4 w-4" />Preview</div>
          <div className="space-y-1 text-sm">
            {parsed.items.slice(0, 8).map((item, index) => <div key={`${item.title}-${index}`} className="flex gap-2">
              <span className="w-6 shrink-0 text-muted-foreground">{index + 1}.</span>
              <span>{item.title}</span>
              <span className="text-muted-foreground">· {item.priority ?? 'required'} · {item.plannedDepth ?? 'standard'}</span>
            </div>)}
            {parsed.items.length > 8 && <div className="text-muted-foreground">+ {parsed.items.length - 8} more</div>}
          </div>
        </div>}

        {!editable && selectedJob && <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-3 text-sm">
          This job has progressed beyond outline review. Bulk scope changes are blocked so existing sections/QA cannot silently become stale. Use the governed revision/research lifecycle instead.
        </div>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Server validation re-checks count, titles, priority/depth, duplicates and lifecycle state before writing anything.</p>
          {canEdit && <Button onClick={() => void importPlan()} disabled={!selectedJobId || !editable || Boolean(parsed.error) || parsed.items.length === 0 || working}>
            {working ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}Import coverage plan
          </Button>}
        </div>
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioCoverageImportPage;
