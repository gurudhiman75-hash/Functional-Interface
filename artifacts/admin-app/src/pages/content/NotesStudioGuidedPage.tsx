import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, RefreshCw, Settings2 } from 'lucide-react';

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
  sourceLanguage: string;
};

type GuidedStage = {
  index: number;
  title: string;
  description: string;
  nextTab: string;
  nextLabel: string;
};

const stages = [
  { title: 'Topic & sources', description: 'Define scope and establish the research pack.' },
  { title: 'Research review', description: 'Review evidence, claims and syllabus coverage.' },
  { title: 'Draft & QA', description: 'Generate the note and resolve quality findings.' },
  { title: 'Approve & release', description: 'Approve the final note and release deliberately.' },
] as const;

function guidedStage(state: string): GuidedStage {
  switch (state) {
    case 'brief':
      return { index: 0, title: 'Topic & sources', description: 'Finish the brief and source pack.', nextTab: 'authoring', nextLabel: 'Continue research' };
    case 'sources_ready':
      return { index: 1, title: 'Research review', description: 'Turn reviewed sources into evidence and candidate facts.', nextTab: 'reference-evidence', nextLabel: 'Review research' };
    case 'evidence_ready':
      return { index: 1, title: 'Research review', description: 'Finish claim and coverage review. Gaps stay in research instead of becoming draft facts.', nextTab: 'coverage-proposals', nextLabel: 'Review coverage' };
    case 'outline_ready':
    case 'drafting':
      return { index: 2, title: 'Draft & QA', description: 'Build the note from approved research and review the draft.', nextTab: 'sections', nextLabel: 'Continue drafting' };
    case 'qa_required':
      return { index: 2, title: 'Draft & QA', description: 'Resolve the remaining quality findings.', nextTab: 'quality', nextLabel: 'Review quality' };
    case 'review_ready':
      return { index: 3, title: 'Approve & release', description: 'The note is ready for final editorial approval.', nextTab: 'approval', nextLabel: 'Review final note' };
    case 'approved':
      return { index: 3, title: 'Approve & release', description: 'Editorial approval is complete. Release remains explicit.', nextTab: 'release', nextLabel: 'Release note' };
    case 'materialized':
      return { index: 4, title: 'Complete', description: 'This authoring run has been materialized into the learner-content system.', nextTab: 'canonical', nextLabel: 'View canonical note' };
    default:
      return { index: 0, title: 'Needs attention', description: 'Open the workspace to inspect this authoring run.', nextTab: 'authoring', nextLabel: 'Open workspace' };
  }
}

export function NotesStudioGuidedPage({ onOpenAdvanced }: { onOpenAdvanced: (tab: string) => void }) {
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedJob = jobs.find((job) => job.id === selectedJobId) ?? null;
  const current = useMemo(() => guidedStage(selectedJob?.state ?? 'brief'), [selectedJob?.state]);

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      const next = result.jobs ?? [];
      setJobs(next);
      setSelectedJobId((existing) => existing && next.some((job) => job.id === existing) ? existing : next[0]?.id ?? '');
    } catch (error) {
      showToast.error('Unable to load Notes Studio jobs', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return <div className="space-y-4">
    <PageHeader
      title="Notes Studio"
      description="One guided authoring path. Specialist governance and diagnostics stay available under Advanced when you need them."
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>}
    />

    <Card>
      <CardHeader><CardTitle>Current note</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={loading || jobs.length === 0}>
          <SelectTrigger><SelectValue placeholder="Choose a Notes Studio job" /></SelectTrigger>
          <SelectContent>{jobs.map((job) => <SelectItem key={job.id} value={job.id}>{job.title}</SelectItem>)}</SelectContent>
        </Select>

        {jobs.length === 0 && !loading && <div className="rounded-md border border-dashed p-5 text-sm text-muted-foreground">
          No Notes Studio jobs are available yet. Use Advanced → Syllabus planning to create the first authoring job.
        </div>}

        {selectedJob && <>
          <div className="grid gap-2 md:grid-cols-4">
            {stages.map((stage, index) => {
              const completed = current.index > index;
              const active = current.index === index;
              return <div key={stage.title} className={`rounded-lg border p-3 ${active ? 'bg-muted/50' : ''}`}>
                <div className="mb-2 flex items-center gap-2">
                  {completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  <span className="font-medium">{stage.title}</span>
                  {active && <Badge variant="secondary">Now</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>;
            })}
          </div>

          <div className="rounded-lg border p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">What needs attention now</p>
                <h3 className="mt-1 text-lg font-semibold">{current.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{current.description}</p>
              </div>
              <Button onClick={() => onOpenAdvanced(current.nextTab)}>
                {current.nextLabel}<ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3 text-sm">
            <span className="text-muted-foreground">Need a specialist tool, audit trail or exception workflow?</span>
            <Button variant="ghost" size="sm" onClick={() => onOpenAdvanced('planning')}><Settings2 className="mr-2 h-4 w-4" />Open Advanced</Button>
          </div>
        </>}
      </CardContent>
    </Card>
  </div>;
}

export default NotesStudioGuidedPage;
