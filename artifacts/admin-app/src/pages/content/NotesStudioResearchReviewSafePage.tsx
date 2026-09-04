import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { adminRequest } from '@/lib/admin-request';
import { NotesStudioResearchReviewPage } from './NotesStudioResearchReviewPage';

type Probe = {
  label: string;
  path: string;
};

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function errorMessage(reason: unknown) {
  return reason instanceof Error ? reason.message : 'Request failed.';
}

export function NotesStudioResearchReviewSafePage({
  jobId,
  onJobProgressed,
}: {
  jobId: string;
  onJobProgressed?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [failures, setFailures] = useState<Array<{ label: string; message: string }>>([]);
  const [generation, setGeneration] = useState(0);

  const probe = async () => {
    if (!jobId) return;
    setLoading(true);
    setReady(false);
    setFailures([]);

    const probes: Probe[] = [
      { label: 'Source policy', path: `/admin/notes-studio/jobs/${jobId}/source-policy` },
      { label: 'Evidence & claims', path: `/admin/notes-studio/jobs/${jobId}/evidence` },
      { label: 'Coverage plan', path: `/admin/notes-studio/jobs/${jobId}/coverage` },
    ];

    let results = await Promise.allSettled(probes.map((item) => adminRequest(item.path)));
    if (results.some((result) => result.status === 'rejected')) {
      await wait(700);
      results = await Promise.allSettled(probes.map((item) => adminRequest(item.path)));
    }

    const nextFailures = results.flatMap((result, index) => result.status === 'rejected'
      ? [{ label: probes[index].label, message: errorMessage(result.reason) }]
      : []);

    if (nextFailures.length === 0) {
      setReady(true);
      setGeneration((value) => value + 1);
    } else {
      setFailures(nextFailures);
    }
    setLoading(false);
  };

  useEffect(() => { void probe(); }, [jobId]);

  if (loading) {
    return <Card>
      <CardContent className="flex items-center gap-2 p-5 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />Loading saved research data…
      </CardContent>
    </Card>;
  }

  if (!ready) {
    return <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5" />
          <div>
            <div className="font-semibold">Research data could not be loaded completely</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Your saved sources, evidence and claims have not been cleared. Guided Mode will not display fake zero counts when a read request fails.
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {failures.map((failure) => <div key={failure.label} className="rounded-md border p-3 text-sm">
            <strong>{failure.label}:</strong> {failure.message}
          </div>)}
        </div>
        <Button variant="outline" onClick={() => void probe()}>
          <RefreshCw className="mr-2 h-4 w-4" />Retry research data
        </Button>
      </CardContent>
    </Card>;
  }

  return <NotesStudioResearchReviewPage
    key={`${jobId}:${generation}`}
    jobId={jobId}
    onJobProgressed={onJobProgressed}
  />;
}

export default NotesStudioResearchReviewSafePage;
