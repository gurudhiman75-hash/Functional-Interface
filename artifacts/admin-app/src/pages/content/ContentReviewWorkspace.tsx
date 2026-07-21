import { AlertTriangle, Clock3, GitCompare, Inbox, MessageSquare, RefreshCw, UserRoundCheck, type LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useContentReviewController } from '@/features/content-review/useContentReviewController';
import { cn } from '@/lib/utils';
import { ContentIntelligenceWorkspace } from './ContentIntelligenceWorkspace';
import { ContentReviewDetail } from './ContentReviewDetail';
import { ContentReviewFiltersBar } from './ContentReviewFilters';
import { ContentReviewQueue } from './ContentReviewQueue';

export function ContentReviewWorkspace() {
  const review = useContentReviewController();
  const selected = review.selectedItem;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Review"
        description="Canonical editorial queue, duplicate intelligence and audit-governed chapter freeze readiness."
        icon={<Inbox className="h-5 w-5" />}
        actions={<Button variant="outline" disabled={review.loading || review.mutating} onClick={() => void review.refresh()}><RefreshCw className={cn('mr-1.5 h-4 w-4', review.loading && 'animate-spin')} /> Refresh queue</Button>}
      />
      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList className="grid w-full max-w-lg grid-cols-2">
          <TabsTrigger value="queue"><Inbox className="mr-1.5 h-4 w-4" />Reviewer queue</TabsTrigger>
          <TabsTrigger value="intelligence"><GitCompare className="mr-1.5 h-4 w-4" />Intelligence & freeze</TabsTrigger>
        </TabsList>
        <TabsContent value="queue" className="space-y-6">
          {review.error && <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {review.error}</div>}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Inbox} label="Review inventory" value={review.metrics.total} />
            <Metric icon={UserRoundCheck} label="Assigned to me" value={review.metrics.mine} tone="info" />
            <Metric icon={Clock3} label="Overdue 72h+" value={review.metrics.overdue} tone={review.metrics.overdue ? 'danger' : 'success'} />
            <Metric icon={MessageSquare} label="Open comments" value={review.metrics.openComments} tone={review.metrics.openComments ? 'warning' : 'success'} />
          </div>
          <ContentReviewFiltersBar
            filters={review.filters}
            statuses={review.statuses}
            savedViews={review.savedViews}
            viewName={review.viewName}
            onFiltersChange={review.setFilters}
            onViewNameChange={review.setViewName}
            onApplySavedView={review.applySavedView}
            onSaveView={review.saveView}
            onClearSavedViews={review.clearSavedViews}
          />
          <div className="grid min-h-[680px] gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            <ContentReviewQueue items={review.queue} selectedKey={selected?.key ?? null} loading={review.loading} onSelect={(key) => { review.setSelectedKey(key); review.setActionReason(''); }} onPrevious={() => review.selectRelative(-1)} onNext={() => review.selectRelative(1)} />
            {selected ? <ContentReviewDetail
              item={selected}
              reviewers={review.workspace.reviewers}
              mutating={review.mutating}
              canReview={review.canReview}
              actionReason={review.actionReason}
              onActionReasonChange={review.setActionReason}
              onDecision={review.performDecision}
              onAssign={(reviewerUserId, reason) => review.assign({ items: [{ entityType: selected.entityType, entityId: selected.entityId }], reviewerUserId, reason }).then(() => undefined)}
              onComment={(message, parentCommentId) => review.comment({ entityType: selected.entityType, entityId: selected.entityId, message, parentCommentId }).then(() => undefined)}
              onResolveComment={(commentId, resolved) => review.resolveComment({ commentId, resolved }).then(() => undefined)}
            /> : <Card><CardContent className="flex h-full min-h-96 items-center justify-center text-sm text-muted-foreground">Select a review item to inspect it.</CardContent></Card>}
          </div>
        </TabsContent>
        <TabsContent value="intelligence"><ContentIntelligenceWorkspace /></TabsContent>
      </Tabs>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone = 'neutral' }: { icon: LucideIcon; label: string; value: number; tone?: 'neutral' | 'info' | 'warning' | 'danger' | 'success' }) {
  const toneClass = tone === 'info' ? 'text-info' : tone === 'warning' ? 'text-warning' : tone === 'danger' ? 'text-destructive' : tone === 'success' ? 'text-success' : 'text-muted-foreground';
  return <Card><CardContent className="p-4"><div className={cn('flex items-center gap-2 text-xs', toneClass)}><Icon className="h-4 w-4" />{label}</div><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>;
}
