import { useMemo, useState } from 'react';
import { ExternalLink, Loader2, Search, ShieldCheck } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type Gap = {
  id: string;
  title: string;
  status: 'uncovered' | 'partial' | 'blocked';
};

type GapBrief = {
  coverageItemId: string;
  researchQueries: string[];
};

type GapResearchResult = {
  gaps: Gap[];
  briefs: GapBrief[];
  totalGapCount: number;
};

type DiscoveryCandidate = {
  sourceUri: string;
  domain: string;
  authorityClass: 'government_primary' | 'institutional_reference' | 'web_reference';
  score: number;
  governedSourceId: string | null;
  title: string | null;
  publisher: string | null;
  alreadyAttached: boolean;
};

type DiscoveryResult = {
  queries: string[];
  candidates: DiscoveryCandidate[];
  search: { searchCallCount: number; provider: string; model: string };
  sourcePackAppendable?: boolean;
  sourcePackMutable?: boolean;
};

type GapFillResult = {
  research: GapResearchResult;
  discovery: DiscoveryResult;
};

const GAP_ORDER: Record<Gap['status'], number> = { uncovered: 0, blocked: 1, partial: 2 };

function discoveryQueries(result: GapResearchResult): string[] {
  const statusById = new Map(result.gaps.map((gap) => [gap.id, gap.status]));
  const gapById = new Map(result.gaps.map((gap) => [gap.id, gap]));
  const ordered = [...result.briefs].sort((left, right) =>
    (GAP_ORDER[statusById.get(left.coverageItemId) ?? 'partial'] ?? 9)
    - (GAP_ORDER[statusById.get(right.coverageItemId) ?? 'partial'] ?? 9),
  );
  const queries: string[] = [];
  const combinedGapTitles = ordered
    .map((brief) => gapById.get(brief.coverageItemId)?.title ?? '')
    .filter(Boolean)
    .join('; ');
  const combinedQuery = `Official authoritative sources for ${combinedGapTitles}`.replace(/\s+/g, ' ').trim().slice(0, 240);
  if (combinedQuery.length > 35) queries.push(combinedQuery);

  for (const brief of ordered) {
    for (const raw of brief.researchQueries) {
      const query = raw.replace(/\s+/g, ' ').trim().slice(0, 240);
      if (!query || queries.includes(query)) continue;
      queries.push(query);
      break;
    }
    if (queries.length >= 4) break;
  }
  return queries.slice(0, 4);
}

export function NotesStudioGapFillPanel({
  jobId,
  unresolvedCount,
  onSourcesAttached,
}: {
  jobId: string;
  unresolvedCount: number;
  onSourcesAttached?: () => void | Promise<void>;
}) {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [result, setResult] = useState<GapFillResult | null>(null);
  const [selectedUris, setSelectedUris] = useState<string[]>([]);
  const [working, setWorking] = useState<'search' | 'attach' | null>(null);

  const selectable = useMemo(() => (result?.discovery.candidates ?? []).filter((candidate) => !candidate.alreadyAttached), [result]);

  const fillGaps = async () => {
    setWorking('search');
    try {
      const research = await adminRequest<GapResearchResult>(`/admin/notes-studio/jobs/${jobId}/coverage-gap-research/generate`, { method: 'POST' });
      const queries = discoveryQueries(research);
      if (queries.length === 0) throw new Error('Gap research produced no usable discovery query.');
      const discovery = await adminRequest<DiscoveryResult>(`/admin/notes-studio/jobs/${jobId}/source-discovery`, {
        method: 'POST',
        body: JSON.stringify({ queries }),
      });
      setResult({ research, discovery });
      setSelectedUris([]);
      showToast.success('Gap research ready', `${research.totalGapCount} unresolved target(s) searched with ${discovery.search.searchCallCount} bounded web-search call(s).`);
    } catch (error) {
      showToast.error('Unable to fill research gaps', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(null);
    }
  };

  const toggle = (sourceUri: string, checked: boolean) => {
    setSelectedUris((current) => checked
      ? [...new Set([...current, sourceUri])]
      : current.filter((item) => item !== sourceUri));
  };

  const attachSelected = async () => {
    if (!result || selectedUris.length === 0) return;
    const selected = result.discovery.candidates.filter((candidate) => selectedUris.includes(candidate.sourceUri) && !candidate.alreadyAttached);
    setWorking('attach');
    let attached = 0;
    try {
      for (const candidate of selected) {
        if (candidate.governedSourceId) {
          await adminRequest(`/admin/notes-studio/jobs/${jobId}/sources/${candidate.governedSourceId}/reuse`, { method: 'POST' });
        } else {
          await adminRequest(`/admin/notes-studio/jobs/${jobId}/sources/url`, {
            method: 'POST',
            body: JSON.stringify({
              url: candidate.sourceUri,
              title: '',
              publisher: candidate.domain,
              rightsBasis: 'reference_only',
            }),
          });
        }
        attached += 1;
      }
      setSelectedUris([]);
      setResult((current) => current ? {
        ...current,
        discovery: {
          ...current.discovery,
          candidates: current.discovery.candidates.map((candidate) =>
            selected.some((item) => item.sourceUri === candidate.sourceUri)
              ? { ...candidate, alreadyAttached: true }
              : candidate,
          ),
        },
      } : current);
      await onSourcesAttached?.();
      showToast.success('Gap sources appended', `${attached} reviewed source(s) added without deleting or resetting existing evidence, claims or confirmed coverage.`);
    } catch (error) {
      showToast.error('Unable to append selected sources', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking(null);
    }
  };

  const sourcePackAppendable = result?.discovery.sourcePackAppendable ?? result?.discovery.sourcePackMutable ?? false;

  return <Card className="border-dashed">
    <CardHeader>
      <CardTitle className="flex flex-wrap items-center gap-2">
        Fill research gaps
        <Badge variant="secondary">{unresolvedCount} unresolved</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex gap-2 rounded-lg border p-3 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Append-only research: accepted facts and confirmed coverage stay intact. Search creates no facts or evidence automatically.</span>
      </div>
      <Button onClick={() => void fillGaps()} disabled={!canEdit || working !== null}>
        {working === 'search' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
        Fill research gaps
      </Button>

      {result && <div className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Gaps</div><div className="text-xl font-semibold">{result.research.totalGapCount}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Search calls</div><div className="text-xl font-semibold">{result.discovery.search.searchCallCount}</div></div>
          <div className="rounded-lg border p-3"><div className="text-xs text-muted-foreground">Candidate sources</div><div className="text-xl font-semibold">{result.discovery.candidates.length}</div></div>
        </div>

        <div className="rounded-lg border p-3 text-xs text-muted-foreground">
          <div className="mb-1 font-medium text-foreground">Focused searches</div>
          {result.discovery.queries.map((query) => <div key={query}>• {query}</div>)}
        </div>

        {result.discovery.candidates.length === 0 && <div className="rounded-lg border p-3 text-sm text-muted-foreground">No candidate URL passed the authority/relevance filter. Run gap fill again later rather than weakening source quality.</div>}

        <div className="space-y-2">
          {result.discovery.candidates.map((candidate) => {
            const checked = selectedUris.includes(candidate.sourceUri);
            return <div key={candidate.sourceUri} className="flex items-start gap-3 rounded-lg border p-3">
              {!candidate.alreadyAttached && <Checkbox className="mt-1" checked={checked} onCheckedChange={(value) => toggle(candidate.sourceUri, value === true)} />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{candidate.title || candidate.domain}</span>
                  <Badge variant={candidate.authorityClass === 'government_primary' ? 'default' : 'outline'}>{candidate.authorityClass.replaceAll('_', ' ')}</Badge>
                  {candidate.alreadyAttached && <Badge variant="secondary">Attached</Badge>}
                  {candidate.governedSourceId && <Badge variant="outline">Governed</Badge>}
                </div>
                <div className="mt-1 break-all text-xs text-muted-foreground">{candidate.sourceUri}</div>
                <a href={candidate.sourceUri} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs underline">
                  Review source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>;
          })}
        </div>

        {selectable.length > 0 && <>
          <Button onClick={() => void attachSelected()} disabled={!canEdit || !sourcePackAppendable || selectedUris.length === 0 || working !== null}>
            {working === 'attach' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Attach selected reviewed URLs
          </Button>
          <p className="text-xs text-muted-foreground">New web candidates are attached as reference-only metadata. Review only the useful URLs; the evidence note fields then appear in this same Research Review.</p>
        </>}
      </div>}
    </CardContent>
  </Card>;
}

export default NotesStudioGapFillPanel;
