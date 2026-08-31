import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Compass, RefreshCw, Route } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminRequest } from '@/lib/admin-request';

type AuthoringJob = {
  id: string;
  title: string;
  state: string;
  brief?: {
    topicLabel?: string;
  };
  sourceCount: number;
  includedSourceCount: number;
  generatableSourceCount: number;
  updatedAt: string;
};

type WorkflowStep = {
  tab: string;
  label: string;
  description: string;
};

type NotesStudioWorkflowPageProps = {
  onNavigate: (tab: string) => void;
};

const stateSteps: Record<string, WorkflowStep> = {
  brief: {
    tab: 'authoring',
    label: 'Build the source pack',
    description: 'Attach or reuse reviewed governed sources, then make the pack generation-ready.',
  },
  sources_ready: {
    tab: 'source-coverage',
    label: 'Check source sufficiency',
    description: 'Review source coverage and policy before evidence work freezes the pack.',
  },
  evidence_ready: {
    tab: 'candidate-claims',
    label: 'Review candidate claims',
    description: 'Inspect extracted claim candidates and keep factual acceptance explicitly governed.',
  },
  outline_ready: {
    tab: 'sections',
    label: 'Review section synthesis',
    description: 'Move from accepted evidence and coverage into section-level note drafting.',
  },
  drafting: {
    tab: 'sections',
    label: 'Continue section drafting',
    description: 'Complete section synthesis while preserving claim and evidence lineage.',
  },
  qa_required: {
    tab: 'quality',
    label: 'Resolve quality gates',
    description: 'Review QA failures, coverage gaps and release-blocking checks before approval.',
  },
  review_ready: {
    tab: 'approval',
    label: 'Editorial approval',
    description: 'Review the completed note and explicitly approve before localization or release.',
  },
  approved: {
    tab: 'release',
    label: 'Release or revise',
    description: 'Materialize approved content or create a successor revision when changes are required.',
  },
  materialized: {
    tab: 'canonical',
    label: 'Inspect canonical note',
    description: 'Review the learner-facing canonical resource and its governed release lineage.',
  },
};

function prettyState(value: string) {
  return value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function readableDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function stepFor(job: AuthoringJob): WorkflowStep {
  return stateSteps[job.state] ?? {
    tab: 'authoring',
    label: 'Inspect authoring job',
    description: 'Open the governed authoring workspace and review the current job state before continuing.',
  };
}

export function NotesStudioWorkflowPage({ onNavigate }: NotesStudioWorkflowPageProps) {
  const [jobs, setJobs] = useState<AuthoringJob[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const result = await adminRequest<{ jobs: AuthoringJob[] }>('/admin/notes-studio/jobs');
      setJobs(result.jobs ?? []);
    } catch (error) {
      showToast.error('Unable to load Notes Studio workflow', error instanceof Error ? error.message : 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const counts = useMemo(() => ({
    active: jobs.filter((job) => !['approved', 'materialized'].includes(job.state)).length,
    review: jobs.filter((job) => ['qa_required', 'review_ready'].includes(job.state)).length,
    released: jobs.filter((job) => ['approved', 'materialized'].includes(job.state)).length,
  }), [jobs]);

  return <div className="space-y-5">
    <PageHeader
      title="Guided authoring workflow"
      description="A single operational view of every Notes Studio job, its governed lifecycle state and the next editorial workspace to use."
      icon={<Route className="h-5 w-5" />}
      actions={<Button variant="outline" onClick={() => void load()} disabled={loading}>
        <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
      </Button>}
    />

    <div className="grid gap-3 sm:grid-cols-3">
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Active research & drafting</div><div className="mt-1 text-2xl font-bold">{counts.active}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Needs review</div><div className="mt-1 text-2xl font-bold">{counts.review}</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-xs uppercase tracking-wide text-muted-foreground">Approved / materialized</div><div className="mt-1 text-2xl font-bold">{counts.released}</div></CardContent></Card>
    </div>

    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 font-semibold"><Compass className="h-4 w-4" />Research stays governed</div>
          <p className="mt-1 text-sm text-muted-foreground">This view recommends the next workspace only. It does not attach sources, accept claims, generate sections, approve notes or publish learner content automatically.</p>
        </div>
        <Button variant="outline" onClick={() => onNavigate('source-discovery')}>Open web discovery</Button>
      </CardContent>
    </Card>

    <div className="space-y-3">
      {jobs.map((job) => {
        const step = stepFor(job);
        return <Card key={job.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <CardTitle className="text-base">{job.title}</CardTitle>
                <div className="mt-1 text-sm text-muted-foreground">{job.brief?.topicLabel || 'No canonical topic label'} · Updated {readableDate(job.updatedAt)}</div>
              </div>
              <Badge variant="outline">{prettyState(job.state)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-2">
                <div className="font-medium">Next: {step.label}</div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>{job.sourceCount} sources</span>
                  <span>·</span>
                  <span>{job.includedSourceCount} included</span>
                  <span>·</span>
                  <span>{job.generatableSourceCount} generation-ready</span>
                </div>
              </div>
              <Button onClick={() => onNavigate(step.tab)}>
                Continue <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>;
      })}

      {!loading && jobs.length === 0 && <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No authoring jobs yet. Start in Brief & sources to create the first governed Notes Studio job.</CardContent></Card>}
    </div>
  </div>;
}

export default NotesStudioWorkflowPage;
