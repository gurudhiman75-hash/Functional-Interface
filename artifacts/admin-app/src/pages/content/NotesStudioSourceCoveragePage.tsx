import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  brief: { depth?: string };
};

type Finding = {
  code: string;
  severity: 'blocker' | 'warning' | 'info';
  message: string;
};

type Assessment = {
  status: 'ready' | 'usable_with_warnings' | 'needs_sources';
  depth: string;
  targets: { included: number; evidenceReady: number; generationReady: number };
  counts: {
    totalAttached: number;
    included: number;
    evidenceReady: number;
    generationReady: number;
    referenceEvidenceReady: number;
    referenceOnly: number;
    referenceOnlyWithoutEvidence: number;
    failedExtraction: number;
    independentPublishersOrDomains: number;
    sourceTypes: number;
  };
  findings: Finding[];
  recommendedNeeds: string[];
  evidenceExtractionHardBlocked: boolean;
  automaticSourceDiscovery: boolean;
  automaticSourceAttachment: boolean;
};

type CoverageResponse = {
  job: { id: string; title: string; state: string; depth: string };
  assessment: Assessment;
  advisoryOnly: boolean;
  rawSourceBodiesReturned: boolean;
};

const needLabels: Record<string, string> = {
  more_governed_sources: 'Add another governed source',
  evidence_ready_source: 'Add another evidence-ready source',
  review_reference_only_source: 'Review a reference-only source in Reference Evidence',
  generation_ready_source: 'Add a retained-text evidence source',
  independent_publisher_or_domain: 'Add an independent publisher/domain',
  alternate_source_type_if_appropriate: 'Add a second source type when useful',
  rights_permitting_extraction: 'Add a source whose rights permit retained extraction',
  extraction_recovery_or_replacement: 'Recover or replace a failed extraction',
};

function readable(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioSourceCoveragePage() {
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [coverage, setCoverage] = useState<CoverageResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      const nextJobs = result.jobs ?? [];
      setJobs(nextJobs);
      setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? null);
    } catch (error) {
      showToast.error('Unable to load source coverage', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const loadCoverage = async (jobId: string) => {
    setLoading(true);
    try {
      setCoverage(await adminRequest<CoverageResponse>(`/admin/notes-studio/jobs/${jobId}/source-coverage`));
    } catch (error) {
      setCoverage(null);
      showToast.error('Unable to assess source pack', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadJobs(); }, []);
  useEffect(() => {
    if (selectedJobId) void loadCoverage(selectedJobId);
    else setCoverage(null);
  }, [selectedJobId]);

  const status = coverage?.assessment.status;

  return <div className="space-y-5">
    <PageHeader
      title="Source coverage"
      description="Depth-aware source-pack intelligence before claim authoring: governed-evidence sufficiency, publisher diversity, extraction problems and concrete source gaps."
      icon={<ShieldCheck className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => selectedJobId ? void loadCoverage(selectedJobId) : void loadJobs()} disabled={loading}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
      </Button>}
    />

    <Card>
      <CardHeader><CardTitle>Authoring job</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Select value={selectedJobId ?? ''} onValueChange={setSelectedJobId}>
          <SelectTrigger className="max-w-2xl"><SelectValue placeholder="Choose an authoring job" /></SelectTrigger>
          <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title} · {readable(job.state)}</SelectItem>)}</SelectContent>
        </Select>
        {selectedJob && <div className="text-sm text-muted-foreground">Planned depth: {readable(coverage?.job.depth ?? selectedJob.brief?.depth ?? 'standard')}</div>}
      </CardContent>
    </Card>

    {coverage && <>
      <Card className={status === 'needs_sources' ? 'border-destructive/40' : status === 'usable_with_warnings' ? 'border-amber-500/40' : 'border-emerald-500/40'}>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              {status === 'ready' ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              Source-pack assessment
            </CardTitle>
            <Badge variant={status === 'needs_sources' ? 'destructive' : 'secondary'}>{readable(status ?? '')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-3"><div className="text-xs uppercase tracking-wide text-muted-foreground">Included</div><div className="mt-1 text-xl font-semibold">{coverage.assessment.counts.included} / {coverage.assessment.targets.included}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs uppercase tracking-wide text-muted-foreground">Evidence-ready</div><div className="mt-1 text-xl font-semibold">{coverage.assessment.counts.evidenceReady} / {coverage.assessment.targets.evidenceReady}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs uppercase tracking-wide text-muted-foreground">Publishers/domains</div><div className="mt-1 text-xl font-semibold">{coverage.assessment.counts.independentPublishersOrDomains}</div></div>
            <div className="rounded-lg border p-3"><div className="text-xs uppercase tracking-wide text-muted-foreground">Source types</div><div className="mt-1 text-xl font-semibold">{coverage.assessment.counts.sourceTypes}</div></div>
          </div>
          <div className="text-sm text-muted-foreground">Evidence-ready means either authorized retained extracted text or reviewed editor reference evidence. The two paths remain separately counted below so source-rights status stays visible.</div>
          <div className="text-sm text-muted-foreground">This diagnostics checkpoint is advisory. It does not silently block evidence work and never discovers or attaches sources automatically.</div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Findings</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {coverage.assessment.findings.length === 0 && <div className="text-sm text-muted-foreground">No source-pack coverage issues detected.</div>}
            {coverage.assessment.findings.map((finding) => <div key={finding.code} className="rounded-lg border p-3">
              <div className="mb-1 flex items-center gap-2"><Badge variant={finding.severity === 'blocker' ? 'destructive' : 'secondary'}>{finding.severity}</Badge><span className="text-xs font-mono text-muted-foreground">{finding.code}</span></div>
              <div className="text-sm">{finding.message}</div>
            </div>)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recommended next sources</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {coverage.assessment.recommendedNeeds.length === 0 && <div className="text-sm text-muted-foreground">No additional source class is currently recommended.</div>}
            {coverage.assessment.recommendedNeeds.map((need) => <div key={need} className="rounded-lg border p-3 text-sm">{needLabels[need] ?? readable(need)}</div>)}
            <div className="pt-2 text-xs text-muted-foreground">
              Retained-text ready: {coverage.assessment.counts.generationReady} · Reference-evidence ready: {coverage.assessment.counts.referenceEvidenceReady} · Reference-only: {coverage.assessment.counts.referenceOnly} · Reference-only awaiting review: {coverage.assessment.counts.referenceOnlyWithoutEvidence} · Extraction failures: {coverage.assessment.counts.failedExtraction} · Raw source bodies returned here: no.
            </div>
          </CardContent>
        </Card>
      </div>
    </>}
  </div>;
}

export default NotesStudioSourceCoveragePage;
