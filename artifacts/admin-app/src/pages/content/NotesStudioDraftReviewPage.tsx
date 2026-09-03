import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, Save, ShieldCheck, Sparkles } from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { adminRequest } from '@/lib/admin-request';

type CoverageItem = {
  id: string;
  title: string;
  priority: 'required' | 'high' | 'supporting' | 'exclude';
  plannedDepth: 'brief' | 'standard' | 'deep';
  status: 'covered' | 'partial' | 'blocked' | 'uncovered';
};
type CoverageResult = {
  items: CoverageItem[];
  summary: { itemCount: number; covered: number; partial: number; blocked: number; uncovered: number };
};

type SectionClaim = { id: string; text: string };
type SectionDraft = {
  id: string;
  coverageItemId: string;
  coverageTitle: string;
  priority: string;
  plannedDepth: string;
  title: string;
  sortOrder: number;
  state: string;
  markdown: string;
  provider: string;
  model: string;
  claims: SectionClaim[];
};
type SectionsResult = {
  sections: SectionDraft[];
  coverage: Array<{ id: string; title: string; priority: string; plannedDepth: string; sortOrder: number }>;
  summary: { sectionCount: number; needsEditorial: number; draftCount: number; acceptedCount: number; coverageCount: number };
};

type QualityCheck = {
  code: string;
  label: string;
  status: 'pass' | 'warning' | 'fail';
  blocking: boolean;
  summary: string;
};
type QualitySection = {
  id: string;
  title: string;
  coverageItemId: string;
  qualityStatus: 'passed' | 'failed' | null;
  qualityCurrent: boolean;
  checks: QualityCheck[];
};
type QualityWorkspace = {
  sections: QualitySection[];
  summary: {
    coreCount: number;
    coreDrafted: number;
    corePassed: number;
    sectionCount: number;
    qaPassedSections: number;
    failedSections: number;
    warningCount: number;
    activeConflictCount: number;
    reviewReady: boolean;
  };
};

type SectionEdit = { title: string; markdown: string };

export function NotesStudioDraftReviewPage({ jobId, onJobProgressed }: { jobId: string; onJobProgressed?: () => void }) {
  const { hasPermission } = useAdminPermissions();
  const canEdit = hasPermission('content.questions.update');
  const [coverage, setCoverage] = useState<CoverageResult | null>(null);
  const [sections, setSections] = useState<SectionsResult | null>(null);
  const [quality, setQuality] = useState<QualityWorkspace | null>(null);
  const [edits, setEdits] = useState<Record<string, SectionEdit>>({});
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState('');

  const coveredTargets = useMemo(() => (coverage?.items ?? []).filter((item) => item.status === 'covered' && item.priority !== 'exclude'), [coverage]);
  const sectionByCoverage = useMemo(() => new Map((sections?.sections ?? []).map((section) => [section.coverageItemId, section])), [sections]);
  const missingCoveredTargets = useMemo(() => coveredTargets.filter((item) => !sectionByCoverage.has(item.id)), [coveredTargets, sectionByCoverage]);
  const dirtySections = useMemo(() => (sections?.sections ?? []).filter((section) => {
    const edit = edits[section.id];
    return Boolean(edit && (edit.title !== section.title || edit.markdown !== section.markdown));
  }), [sections, edits]);
  const failedOrWarningSections = useMemo(() => (quality?.sections ?? []).filter((section) =>
    !section.qualityCurrent || section.qualityStatus === 'failed' || section.checks.some((check) => check.status === 'warning')
  ), [quality]);

  const load = async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const [coverageResult, sectionResult, qualityResult] = await Promise.all([
        adminRequest<CoverageResult>(`/admin/notes-studio/jobs/${jobId}/coverage`),
        adminRequest<SectionsResult>(`/admin/notes-studio/jobs/${jobId}/sections`),
        adminRequest<QualityWorkspace>(`/admin/notes-studio/jobs/${jobId}/quality`),
      ]);
      setCoverage(coverageResult);
      setSections(sectionResult);
      setQuality(qualityResult);
      setEdits(Object.fromEntries(sectionResult.sections.map((section) => [section.id, { title: section.title, markdown: section.markdown }])));
    } catch (error) {
      showToast.error('Unable to load Draft Review', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [jobId]);

  const prepareDraft = async () => {
    if (!canEdit) return;
    if (coveredTargets.length === 0) {
      showToast.warning('No confirmed coverage', 'Finish Research Review before preparing a draft.');
      return;
    }
    if (missingCoveredTargets.length === 0) {
      showToast.success('Draft already prepared', 'All editor-confirmed coverage targets already have draft sections.');
      return;
    }
    setWorking('prepare');
    let completed = 0;
    try {
      for (const target of missingCoveredTargets) {
        await adminRequest(`/admin/notes-studio/jobs/${jobId}/coverage/${target.id}/section/generate`, { method: 'POST' });
        completed += 1;
      }
      await load();
      showToast.success('Draft prepared', `${completed} missing section${completed === 1 ? '' : 's'} generated from accepted claims only.`);
    } catch (error) {
      await load();
      showToast.error('Draft preparation stopped', `${completed}/${missingCoveredTargets.length} missing sections completed. ${error instanceof Error ? error.message : 'Request failed.'}`);
    } finally {
      setWorking('');
    }
  };

  const saveAllEdits = async () => {
    if (!canEdit || dirtySections.length === 0) return;
    setWorking('save');
    let saved = 0;
    try {
      for (const section of dirtySections) {
        const edit = edits[section.id];
        if (!edit) continue;
        await adminRequest(`/admin/notes-studio/jobs/${jobId}/sections/${section.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: edit.title, markdown: edit.markdown }),
        });
        saved += 1;
      }
      await load();
      showToast.success('Draft edits saved', `${saved} changed section${saved === 1 ? '' : 's'} saved. QA must run against the new fingerprints.`);
    } catch (error) {
      await load();
      showToast.error('Unable to save all edits', `${saved}/${dirtySections.length} sections saved. ${error instanceof Error ? error.message : 'Request failed.'}`);
    } finally {
      setWorking('');
    }
  };

  const runQa = async () => {
    if (!canEdit || !sections?.sections.length) return;
    if (dirtySections.length > 0) {
      showToast.warning('Save edits first', 'QA must run against the saved section fingerprints.');
      return;
    }
    if (missingCoveredTargets.length > 0) {
      showToast.warning('Draft is incomplete', 'Prepare the missing confirmed-coverage sections before running QA.');
      return;
    }
    setWorking('qa');
    try {
      const next = await adminRequest<QualityWorkspace>(`/admin/notes-studio/jobs/${jobId}/quality/run-all`, { method: 'POST' });
      setQuality(next);
      showToast.success('QA completed', next.summary.reviewReady ? 'Draft is green and ready for your final editorial review.' : 'Review the failed or warning items below, edit once, then rerun QA.');
    } catch (error) {
      showToast.error('Unable to run Draft QA', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setWorking('');
    }
  };

  if (loading && !sections) return <Card><CardContent className="flex items-center gap-2 p-5 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading Draft Review…</CardContent></Card>;

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold">Draft Review</h2>
        <p className="mt-1 text-sm text-muted-foreground">Generate only confirmed research, edit the complete note here, then run all QA once.</p>
      </div>
      <Button variant="outline" onClick={() => void load()} disabled={Boolean(working)}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
    </div>

    <div className="grid gap-3 md:grid-cols-4">
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Confirmed targets</div><div className="mt-1 text-xl font-semibold">{coveredTargets.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Drafted</div><div className="mt-1 text-xl font-semibold">{Math.max(0, coveredTargets.length - missingCoveredTargets.length)}/{coveredTargets.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Unsaved edits</div><div className="mt-1 text-xl font-semibold">{dirtySections.length}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">QA</div><div className="mt-1 font-semibold">{quality?.summary.reviewReady ? 'Green' : quality?.summary.sectionCount ? `${quality.summary.qaPassedSections}/${quality.summary.sectionCount} passed` : 'Not run'}</div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>1. Prepare the complete draft</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">Only coverage targets explicitly confirmed in Research Review are eligible. Partial, missing or blocked targets are excluded automatically.</p>
        {coverage && (coverage.summary.partial > 0 || coverage.summary.uncovered > 0 || coverage.summary.blocked > 0) && <div className="rounded-lg border p-3 text-sm text-muted-foreground">
          Excluded from drafting: {coverage.summary.partial} partial · {coverage.summary.uncovered} uncovered · {coverage.summary.blocked} blocked.
        </div>}
        <Button onClick={() => void prepareDraft()} disabled={!canEdit || Boolean(working) || missingCoveredTargets.length === 0}>
          {working === 'prepare' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          {missingCoveredTargets.length > 0 ? `Prepare ${missingCoveredTargets.length} missing section${missingCoveredTargets.length === 1 ? '' : 's'}` : 'Draft prepared'}
        </Button>
      </CardContent>
    </Card>

    {(sections?.sections.length ?? 0) > 0 && <Card>
      <CardHeader><CardTitle>2. Read and edit the draft</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {(sections?.sections ?? []).filter((section) => coveredTargets.some((target) => target.id === section.coverageItemId)).map((section) => {
          const edit = edits[section.id] ?? { title: section.title, markdown: section.markdown };
          const qualitySection = quality?.sections.find((item) => item.id === section.id);
          return <div key={section.id} className="space-y-3 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{section.priority}</Badge><Badge variant="outline">{section.plannedDepth}</Badge>{qualitySection?.qualityCurrent && qualitySection.qualityStatus === 'passed' && <Badge>QA passed</Badge>}{qualitySection?.qualityCurrent && qualitySection.qualityStatus === 'failed' && <Badge variant="destructive">QA failed</Badge>}</div>
              <span className="text-xs text-muted-foreground">{section.provider} · {section.model}</span>
            </div>
            <Input value={edit.title} onChange={(event) => setEdits((current) => ({ ...current, [section.id]: { ...edit, title: event.target.value } }))} disabled={!canEdit} />
            <Textarea className="min-h-[220px] text-sm" value={edit.markdown} onChange={(event) => setEdits((current) => ({ ...current, [section.id]: { ...edit, markdown: event.target.value } }))} disabled={!canEdit} />
            <details className="text-xs text-muted-foreground"><summary className="cursor-pointer">View factual provenance ({section.claims.length} claims)</summary><div className="mt-2 space-y-1">{section.claims.map((claim) => <div key={claim.id}>• {claim.text}</div>)}</div></details>
          </div>;
        })}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-sm text-muted-foreground">Edit as much as needed, then save all changed sections once.</p>
          <Button variant="outline" onClick={() => void saveAllEdits()} disabled={!canEdit || Boolean(working) || dirtySections.length === 0}>{working === 'save' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save all edits ({dirtySections.length})</Button>
        </div>
      </CardContent>
    </Card>}

    {(sections?.sections.length ?? 0) > 0 && <Card>
      <CardHeader><CardTitle>3. Run QA once</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => void runQa()} disabled={!canEdit || Boolean(working) || dirtySections.length > 0 || missingCoveredTargets.length > 0}>
          {working === 'qa' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}Run all QA
        </Button>

        {quality && quality.summary.activeConflictCount > 0 && <div className="rounded-lg border border-destructive/40 p-3 text-sm"><AlertTriangle className="mr-2 inline h-4 w-4" />{quality.summary.activeConflictCount} active evidence conflict(s) block final review.</div>}

        {quality?.summary.reviewReady && <div className="rounded-lg border p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5" />Draft QA is green</div><p className="mt-1 text-sm text-muted-foreground">All current sections passed against their current fingerprints and evidence graph.</p></div>
            <Button onClick={() => onJobProgressed?.()}>Continue to final review</Button>
          </div>
        </div>}

        {!quality?.summary.reviewReady && failedOrWarningSections.length > 0 && <div className="space-y-3">
          <div className="font-medium">Items needing attention</div>
          {failedOrWarningSections.map((section) => <div key={section.id} className="rounded-lg border p-3">
            <div className="font-medium">{section.title}</div>
            <div className="mt-2 space-y-2">{section.checks.filter((check) => check.status !== 'pass').map((check) => <div key={check.code} className="text-sm"><Badge className="mr-2" variant={check.status === 'fail' ? 'destructive' : 'secondary'}>{check.status}</Badge><span className="font-medium">{check.label}:</span> <span className="text-muted-foreground">{check.summary}</span></div>)}</div>
          </div>)}
          <p className="text-sm text-muted-foreground">Edit the affected section above, save all edits once, then rerun QA.</p>
        </div>}
      </CardContent>
    </Card>}
  </div>;
}

export default NotesStudioDraftReviewPage;
