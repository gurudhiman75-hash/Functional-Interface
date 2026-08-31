import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Globe2, Link2, Loader2, RefreshCw, Search, ShieldCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  sourceLanguage: string;
  state: string;
  brief?: { topicLabel?: string; syllabusEmphasis?: string };
};

type DiscoveryCandidate = {
  sourceUri: string;
  domain: string;
  authorityClass: 'government_primary' | 'institutional_reference' | 'web_reference';
  score: number;
  governedSourceId: string | null;
  title: string | null;
  publisher: string | null;
  rightsBasis: string | null;
  retentionMode: string | null;
  extractionStatus: string | null;
  alreadyAttached: boolean;
};

type DiscoveryResponse = {
  job: { id: string; title: string; state: string };
  queries: string[];
  candidates: DiscoveryCandidate[];
  search: { provider: string; model: string; responseId: string | null; promptVersion: string; searchCallCount: number };
  boundaries: {
    rawSourceBodiesReturned: boolean;
    sourceDocumentsCreated: boolean;
    sourcesAttachedAutomatically: boolean;
    evidenceCreated: boolean;
    factsOrClaimsCreated: boolean;
    learnerGeneration: boolean;
  };
  sourcePackMutable: boolean;
  nextAction: string;
};

const rightsOptions = [
  { value: 'reference_only', label: 'Reference only — metadata, no retained text' },
  { value: 'public_domain', label: 'Public domain' },
  { value: 'publisher_authorized', label: 'Publisher authorized' },
  { value: 'licensed', label: 'Licensed' },
  { value: 'user_supplied', label: 'User supplied / owned' },
] as const;

function pretty(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function NotesStudioSourceDiscoveryPage() {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [focus, setFocus] = useState('');
  const [rightsBasis, setRightsBasis] = useState('reference_only');
  const [result, setResult] = useState<DiscoveryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingKey, setWorkingKey] = useState<string | null>(null);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      const nextJobs = response.jobs ?? [];
      setJobs(nextJobs);
      setSelectedJobId((current) => current && nextJobs.some((job) => job.id === current) ? current : nextJobs[0]?.id ?? '');
    } catch (error) {
      showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadJobs(); }, []);
  useEffect(() => { setResult(null); setFocus(''); }, [selectedJobId]);

  const discover = async () => {
    if (!selectedJobId) return;
    setWorkingKey('discover');
    try {
      const response = await adminRequest<DiscoveryResponse>(`/admin/notes-studio/jobs/${selectedJobId}/source-discovery`, {
        method: 'POST',
        body: JSON.stringify({ focus }),
      });
      setResult(response);
      showToast.success('Source discovery complete', `${response.candidates.length} candidate URL(s) returned. Nothing was attached automatically.`);
    } catch (error) {
      showToast.error('Unable to discover sources', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey(null);
    }
  };

  const reuseGoverned = async (candidate: DiscoveryCandidate) => {
    if (!selectedJobId || !candidate.governedSourceId) return;
    const key = `reuse:${candidate.governedSourceId}`;
    setWorkingKey(key);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/sources/${candidate.governedSourceId}/reuse`, { method: 'POST' });
      setResult((current) => current ? {
        ...current,
        candidates: current.candidates.map((item) => item.sourceUri === candidate.sourceUri ? { ...item, alreadyAttached: true } : item),
      } : current);
      await loadJobs();
      showToast.success('Governed source reused', 'The existing source record was attached explicitly; no source body was copied.');
    } catch (error) {
      showToast.error('Unable to reuse source', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey(null);
    }
  };

  const attachNew = async (candidate: DiscoveryCandidate) => {
    if (!selectedJobId) return;
    if (!window.confirm(`Fetch and attach ${candidate.domain} with rights basis “${pretty(rightsBasis)}”?`)) return;
    const key = `attach:${candidate.sourceUri}`;
    setWorkingKey(key);
    try {
      await adminRequest(`/admin/notes-studio/jobs/${selectedJobId}/sources/url`, {
        method: 'POST',
        body: JSON.stringify({
          url: candidate.sourceUri,
          title: '',
          publisher: candidate.domain,
          rightsBasis,
        }),
      });
      setResult((current) => current ? {
        ...current,
        candidates: current.candidates.map((item) => item.sourceUri === candidate.sourceUri ? { ...item, alreadyAttached: true } : item),
      } : current);
      await loadJobs();
      showToast.success('Reviewed URL attached', rightsBasis === 'reference_only'
        ? 'The source is metadata/reference-only and will not provide retained evidence text.'
        : 'The existing source-intake pipeline fetched and extracted the reviewed page under the selected rights basis.');
    } catch (error) {
      showToast.error('Unable to attach source', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorkingKey(null);
    }
  };

  return <div className="space-y-5">
    <PageHeader
      title="Web Source Discovery"
      description="Search for authoritative source URLs from a Notes Studio brief without creating facts, evidence or learner content. Review remains explicit before any source enters the governed pack."
      icon={<Globe2 className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void loadJobs()} disabled={loading || workingKey !== null}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
      </Button>}
    />

    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.8fr)_minmax(320px,1.2fr)]">
          <div className="space-y-1.5">
            <Label>Authoring job</Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={loading || workingKey !== null}>
              <SelectTrigger><SelectValue placeholder="Choose a job" /></SelectTrigger>
              <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title} · {pretty(job.state)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Optional research focus</Label>
            <Input value={focus} onChange={(event) => setFocus(event.target.value)} placeholder="Example: Ravi, Beas and Sutlej origins, basin authority and major projects" disabled={workingKey !== null} />
          </div>
        </div>
        {selectedJob && <div className="rounded-lg bg-muted/40 p-3 text-sm">
          <strong>{selectedJob.brief?.topicLabel || selectedJob.title}</strong>
          {selectedJob.brief?.syllabusEmphasis && <span className="ml-2 text-muted-foreground">{selectedJob.brief.syllabusEmphasis}</span>}
        </div>}
        <div className="flex flex-wrap items-end gap-3">
          {canEdit && <Button onClick={() => void discover()} disabled={!selectedJobId || workingKey !== null}>
            {workingKey === 'discover' ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}Discover authoritative sources
          </Button>}
          <div className="text-xs text-muted-foreground">Discovery consumes model/web-search usage but persists only an audit event.</div>
        </div>
      </CardContent>
    </Card>

    {result && <>
      <div className="grid gap-3 md:grid-cols-3">
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Candidate URLs</div><div className="mt-1 text-2xl font-semibold">{result.candidates.length}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Web-search calls</div><div className="mt-1 text-2xl font-semibold">{result.search.searchCallCount}</div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Source pack</div><div className="mt-1 text-sm font-semibold">{result.sourcePackMutable ? 'Editable now' : 'Frozen — restart required'}</div></CardContent></Card>
      </div>

      <Card className="border-emerald-200">
        <CardContent className="flex gap-2 p-4 text-sm"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><div>
          <strong>Discovery boundary:</strong> no raw page body, source document, attachment, evidence, factual claim or learner wording was created by the search. {result.nextAction}
        </div></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Queries actually sent</CardTitle></CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">{result.queries.map((query) => <div key={query}>• {query}</div>)}</CardContent>
      </Card>

      {result.sourcePackMutable && canEdit && <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[280px_1fr] md:items-end">
          <div className="space-y-1.5"><Label>Rights basis for a newly fetched URL</Label><Select value={rightsBasis} onValueChange={setRightsBasis}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{rightsOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
          <p className="text-xs text-muted-foreground">Notes Studio never infers rights from a government or institutional domain. Choose retained-text rights only when you have a valid basis; otherwise keep the page reference-only.</p>
        </CardContent>
      </Card>}

      {result.candidates.length === 0 && <Card><CardContent className="p-6 text-sm text-muted-foreground">No public candidate URL passed the bounded discovery filter. Refine the research focus rather than weakening source-quality rules.</CardContent></Card>}

      <div className="space-y-3">
        {result.candidates.map((candidate) => <Card key={candidate.sourceUri}>
          <CardContent className="space-y-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">{candidate.title || candidate.domain}</div>
                <div className="mt-0.5 break-all text-xs text-muted-foreground">{candidate.sourceUri}</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant={candidate.authorityClass === 'government_primary' ? 'default' : 'outline'}>{pretty(candidate.authorityClass)}</Badge>
                {candidate.governedSourceId && <Badge variant="outline">Already governed</Badge>}
                {candidate.alreadyAttached && <Badge variant="outline">Attached</Badge>}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild><a href={candidate.sourceUri} target="_blank" rel="noreferrer"><ExternalLink className="mr-1.5 h-3.5 w-3.5" />Open source page</a></Button>
              {result.sourcePackMutable && canEdit && !candidate.alreadyAttached && candidate.governedSourceId && <Button size="sm" onClick={() => void reuseGoverned(candidate)} disabled={workingKey !== null}>
                {workingKey === `reuse:${candidate.governedSourceId}` ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Link2 className="mr-1.5 h-3.5 w-3.5" />}Reuse governed source
              </Button>}
              {result.sourcePackMutable && canEdit && !candidate.alreadyAttached && !candidate.governedSourceId && <Button size="sm" onClick={() => void attachNew(candidate)} disabled={workingKey !== null}>
                {workingKey === `attach:${candidate.sourceUri}` ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Link2 className="mr-1.5 h-3.5 w-3.5" />}Attach reviewed URL
              </Button>}
            </div>
          </CardContent>
        </Card>)}
      </div>
    </>}
  </div>;
}

export default NotesStudioSourceDiscoveryPage;
