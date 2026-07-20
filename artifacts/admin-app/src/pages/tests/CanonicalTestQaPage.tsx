import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardCheck, RefreshCw, Search, ShieldCheck, UserRoundCheck } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTestQaWorkspace } from '@/features/test-qa/useTestQaWorkspace';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';
import { TestQaDetail } from './TestQaDetail';
import { TestQaQueue } from './TestQaQueue';

const ALL = 'all';

export function CanonicalTestQaPage() {
  const qa = useTestQaWorkspace();
  const { hasPermission } = useAdminPermissions();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(ALL);
  const [owner, setOwner] = useState(ALL);

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return qa.queue.filter((test) => {
      if (status !== ALL && test.status !== status) return false;
      if (owner === 'mine' && test.collaboration?.assignment.reviewerUserId !== qa.workspace.currentAdminUserId) return false;
      if (owner === 'unassigned' && test.collaboration?.assignment.reviewerUserId) return false;
      if (!normalized) return true;
      return [test.publicCode, test.title, test.examName, test.examFamilyName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized);
    });
  }, [owner, qa.queue, qa.workspace.currentAdminUserId, search, status]);

  useEffect(() => {
    if (filtered.length === 0) return;
    if (!filtered.some((test) => test.id === qa.selectedTestId)) {
      qa.setSelectedTestId(filtered[0]!.id);
    }
  }, [filtered, qa.selectedTestId, qa.setSelectedTestId]);

  const metrics = useMemo(() => ({
    total: qa.queue.length,
    underQa: qa.queue.filter((test) => test.status === 'under_qa').length,
    needsFix: qa.queue.filter((test) => test.status === 'needs_fix').length,
    assignedToMe: qa.queue.filter((test) => test.collaboration?.assignment.reviewerUserId === qa.workspace.currentAdminUserId).length,
  }), [qa.queue, qa.workspace.currentAdminUserId]);

  const selectedSummary = qa.selectedSummary && filtered.some((test) => test.id === qa.selectedSummary?.id)
    ? qa.selectedSummary
    : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Test QA"
        description="Canonical pre-publication review, ownership, issue resolution, version comparison, candidate preview and enforced release gate."
        icon={<ClipboardCheck className="h-5 w-5" />}
        actions={(
          <>
            <Badge variant="outline" className="border-success/30 bg-success/5 text-success"><ShieldCheck className="mr-1 h-3.5 w-3.5" /> Server-enforced publish gate</Badge>
            <Button variant="outline" disabled={qa.loading || qa.mutating} onClick={() => void qa.refresh()}>
              <RefreshCw className={cn('mr-1.5 h-4 w-4', qa.loading && 'animate-spin')} /> Refresh
            </Button>
          </>
        )}
      />

      {qa.error && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {qa.error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="QA inventory" value={metrics.total} icon={<ClipboardCheck className="h-4 w-4" />} />
        <Metric label="Under QA" value={metrics.underQa} icon={<ShieldCheck className="h-4 w-4" />} tone="info" />
        <Metric label="Needs fix" value={metrics.needsFix} icon={<AlertTriangle className="h-4 w-4" />} tone={metrics.needsFix ? 'warning' : 'success'} />
        <Metric label="Assigned to me" value={metrics.assignedToMe} icon={<UserRoundCheck className="h-4 w-4" />} tone="success" />
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1fr_190px_190px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search test code, title or exam" className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="content_ready">Content ready</SelectItem>
              <SelectItem value="under_qa">Under QA</SelectItem>
              <SelectItem value="needs_fix">Needs fix</SelectItem>
              <SelectItem value="qa_approved">QA approved</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All owners</SelectItem>
              <SelectItem value="mine">Assigned to me</SelectItem>
              <SelectItem value="unassigned">Unassigned</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid min-h-[760px] gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <TestQaQueue
          items={filtered}
          selectedId={selectedSummary?.id ?? null}
          loading={qa.loading}
          onSelect={qa.setSelectedTestId}
        />
        {qa.detailLoading ? (
          <Card><CardContent className="flex min-h-96 items-center justify-center text-sm text-muted-foreground">Loading canonical test detail…</CardContent></Card>
        ) : selectedSummary && qa.detail && qa.detail.test.id === selectedSummary.id ? (
          <TestQaDetail
            summary={selectedSummary}
            detail={qa.detail}
            collaboration={selectedSummary.collaboration}
            reviewers={qa.workspace.reviewers}
            comparison={qa.comparison}
            comparisonLoading={qa.comparisonLoading}
            mutating={qa.mutating}
            canUpdate={hasPermission('tests.update')}
            canApprove={hasPermission('tests.approve')}
            canPublish={hasPermission('tests.publish')}
            onLoadComparison={qa.loadComparison}
            onAssign={(reviewerUserId, reason) => qa.assign({
              items: [{ testId: selectedSummary.id, testVersionId: selectedSummary.currentDraftVersionId! }],
              reviewerUserId,
              reason,
            })}
            onComment={(message, parentCommentId) => qa.comment({
              testId: selectedSummary.id,
              testVersionId: selectedSummary.currentDraftVersionId!,
              message,
              parentCommentId,
            })}
            onResolveComment={qa.resolveComment}
            onTransition={qa.transition}
          />
        ) : (
          <Card><CardContent className="flex min-h-96 items-center justify-center text-sm text-muted-foreground">No test matches the current QA view.</CardContent></Card>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, icon, tone = 'neutral' }: { label: string; value: number; icon: ReactNode; tone?: 'neutral' | 'info' | 'warning' | 'success' }) {
  const toneClass = tone === 'info' ? 'text-info' : tone === 'warning' ? 'text-warning' : tone === 'success' ? 'text-success' : 'text-muted-foreground';
  return <Card><CardContent className="p-4"><div className={cn('flex items-center gap-2 text-xs', toneClass)}>{icon}{label}</div><p className="mt-2 text-2xl font-bold">{value}</p>{tone === 'success' && value === 0 && <CheckCircle2 className="mt-2 h-4 w-4 text-success" />}</CardContent></Card>;
}
