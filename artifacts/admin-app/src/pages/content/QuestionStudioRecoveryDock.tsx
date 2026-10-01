import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';

import { showToast } from '@/components/shared/toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { regenerateGenerationItems } from '@/features/question-studio/api';
import { notifyQuestionStudioRefresh } from '@/features/question-studio/events';
import { findDuplicateMatches, type DuplicateMatch } from '@/features/question-studio/quality';
import { buildRegenerationQueue } from '@/features/question-studio/regeneration-queue';
import { useQuestionStudioReviewPage } from '@/features/question-studio/useQuestionStudio';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

export function QuestionStudioRecoveryDock({ embedded = false }: { embedded?: boolean }) {
  const { hasPermission } = useAdminPermissions();
  const canRegenerate = hasPermission('content.generation.run');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const {
    reviewPage,
    loadingReviewPage,
    reviewPageError,
    refreshReviewPage,
  } = useQuestionStudioReviewPage({ page, pageSize });

  const duplicates = useMemo(() => {
    const combined = findDuplicateMatches(reviewPage.runs);
    for (const match of reviewPage.duplicateMatches) {
      const current = combined.get(match.itemId);
      if (!current || match.exact || current.similarity < match.similarity) {
        combined.set(match.itemId, match as DuplicateMatch);
      }
    }
    return combined;
  }, [reviewPage.duplicateMatches, reviewPage.runs]);

  const queue = useMemo(
    () => buildRegenerationQueue(reviewPage.runs, duplicates),
    [duplicates, reviewPage.runs],
  );
  const queueItems = useMemo(() => queue.flatMap((entry) => entry.items), [queue]);
  const needsFixCount = queueItems.filter((entry) => entry.item.status === 'needs_fix').length;
  const [open, setOpen] = useState(embedded);
  const [reason, setReason] = useState('Generate a fresh replacement after editorial review feedback');
  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (embedded || needsFixCount > 0) setOpen(true);
  }, [embedded, needsFixCount]);

  useEffect(() => {
    if (reviewPage.pagination.page !== page) {
      setPage(reviewPage.pagination.page);
    }
  }, [page, reviewPage.pagination.page]);

  const regenerate = async (itemIds: string[], label: string) => {
    const normalizedReason = reason.trim();
    if (!normalizedReason) {
      showToast.error('Regeneration reason required', 'Record why a fresh replacement is being generated.');
      return;
    }
    if (itemIds.length === 0) {
      showToast.info('Nothing to regenerate', 'No eligible generated items were found for this action.');
      return;
    }

    setActiveIds(new Set(itemIds));
    try {
      const result = await regenerateGenerationItems({ itemIds, reason: normalizedReason });
      await refreshReviewPage();
      notifyQuestionStudioRefresh();

      const exceptionCount = result.skipped.length + result.failed.length;
      if (result.regeneratedCount > 0 && exceptionCount === 0) {
        showToast.success(label, `${result.regeneratedCount} replacement version(s) created successfully.`);
      } else if (result.regeneratedCount > 0) {
        showToast.warning(
          `${label} completed with exceptions`,
          `${result.regeneratedCount} regenerated; ${result.skipped.length} skipped; ${result.failed.length} failed.`,
        );
      } else {
        showToast.error(label, 'No replacement versions were created.');
      }
    } catch (caught) {
      showToast.error(label, caught instanceof Error ? caught.message : 'Unable to regenerate selected questions.');
    } finally {
      setActiveIds(new Set());
    }
  };

  const allNeedsFixIds = queue.flatMap((entry) => entry.needsFixItemIds);
  const busy = activeIds.size > 0;

  if (!open && !embedded) {
    return (
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-5 right-5 z-50 h-auto rounded-full px-4 py-3 shadow-xl',
          queueItems.length === 0 && 'bg-success text-success-foreground hover:bg-success/90',
        )}
      >
        {queueItems.length > 0 ? <AlertTriangle className="mr-2 h-4 w-4" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Recovery queue · {queueItems.length} on page
      </Button>
    );
  }

  return (
    <Card
      className={cn(
        'overflow-hidden border-primary/20',
        embedded
          ? 'w-full shadow-sm'
          : 'fixed bottom-4 left-4 right-4 z-50 max-h-[78vh] shadow-2xl md:left-auto md:w-[520px]',
      )}
    >
      <CardHeader className="border-b bg-background/95 pb-3 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <WandSparkles className="h-4 w-4 text-primary" /> Regeneration recovery queue
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Create fresh immutable replacements without overwriting reviewer history.
            </p>
          </div>
          {!embedded && (
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close recovery queue">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{queueItems.length} surfaced on page</Badge>
          <Badge variant="outline" className={needsFixCount > 0 ? 'border-warning/30 text-warning' : 'border-success/30 text-success'}>
            {needsFixCount} needs fix
          </Badge>
          <Badge variant="outline">{queue.length} run(s) on page</Badge>
          <Badge variant="outline">Page {reviewPage.pagination.page}{reviewPage.pagination.totalPages > 0 ? ` / ${reviewPage.pagination.totalPages}` : ''}</Badge>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for regeneration" />
          <Button
            type="button"
            onClick={() => void regenerate(allNeedsFixIds, 'Retry needs-fix items on this page')}
            disabled={!canRegenerate || busy || allNeedsFixIds.length === 0}
          >
            {busy && allNeedsFixIds.some((id) => activeIds.has(id))
              ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              : <RotateCcw className="mr-1.5 h-4 w-4" />}
            Retry needs fix on page
          </Button>
        </div>
      </CardHeader>

      <CardContent className={cn('overflow-y-auto p-0', embedded ? 'max-h-none' : 'max-h-[55vh]')}>
        {reviewPageError ? (
          <div className="flex items-start gap-2 p-6 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Recovery queue could not be loaded</p>
              <p className="mt-1 text-xs">{reviewPageError}</p>
            </div>
          </div>
        ) : loadingReviewPage ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading recovery queue…
          </div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-success" />
            <p className="mt-3 text-sm font-semibold">No recovery items on this page</p>
            <p className="mt-1 text-xs text-muted-foreground">Check another page or return here after new review feedback is recorded.</p>
          </div>
        ) : (
          <div className="divide-y">
            {queue.map(({ run, items, needsFixItemIds }) => (
              <RecoveryRun
                key={run.id}
                runCode={run.publicCode}
                attemptNumber={run.attemptNumber}
                items={items}
                needsFixItemIds={needsFixItemIds}
                activeIds={activeIds}
                disabled={!canRegenerate || busy}
                onRetryRun={() => void regenerate(needsFixItemIds, `Retry ${run.publicCode}`)}
                onRetryItem={(itemId, itemNumber) => void regenerate([itemId], `Regenerate item ${itemNumber}`)}
              />
            ))}
          </div>
        )}
      </CardContent>
      <div className="flex flex-col gap-2 border-t px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>{reviewPage.pagination.totalRuns} generation run(s) available</span>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="h-8 rounded-md border bg-background px-2 text-xs"
            aria-label="Recovery runs per page"
          >
            <option value={20}>20 runs/page</option>
            <option value={50}>50 runs/page</option>
          </select>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!reviewPage.pagination.hasPreviousPage || loadingReviewPage}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="mr-1 h-3.5 w-3.5" /> Previous
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!reviewPage.pagination.hasNextPage || loadingReviewPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function RecoveryRun({
  runCode,
  attemptNumber,
  items,
  needsFixItemIds,
  activeIds,
  disabled,
  onRetryRun,
  onRetryItem,
}: {
  runCode: string;
  attemptNumber: number;
  items: ReturnType<typeof buildRegenerationQueue>[number]['items'];
  needsFixItemIds: string[];
  activeIds: Set<string>;
  disabled: boolean;
  onRetryRun: () => void;
  onRetryItem: (itemId: string, itemNumber: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div>
      <div className="flex items-center gap-3 bg-muted/20 px-4 py-3">
        <button type="button" className="rounded p-1 hover:bg-muted" onClick={() => setExpanded((value) => !value)}>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-xs font-bold">{runCode}</p>
          <p className="text-[10px] text-muted-foreground">Attempt {attemptNumber} · {items.length} recovery item(s)</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={onRetryRun} disabled={disabled || needsFixItemIds.length === 0}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry {needsFixItemIds.length} needs fix
        </Button>
      </div>

      {expanded && (
        <div className="divide-y">
          {items.map(({ item, stem, blockerCount, warningCount, reasons }) => {
            const itemBusy = activeIds.has(item.id);
            return (
              <div key={item.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">Item {item.itemNumber} · v{item.currentVersionNumber}</span>
                      <Badge variant="outline" className={item.status === 'needs_fix' ? 'border-warning/30 text-warning' : item.status === 'rejected' ? 'border-destructive/30 text-destructive' : ''}>
                        {item.status.replace(/_/g, ' ')}
                      </Badge>
                      {blockerCount > 0 && <Badge variant="outline" className="border-destructive/30 text-destructive">{blockerCount} blocker(s)</Badge>}
                      {warningCount > 0 && <Badge variant="outline">{warningCount} warning(s)</Badge>}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed">{stem}</p>
                    {reasons[0] && <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{reasons[0]}</p>}
                  </div>
                  <Button type="button" size="sm" onClick={() => onRetryItem(item.id, item.itemNumber)} disabled={disabled}>
                    {itemBusy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="mr-1.5 h-3.5 w-3.5" />}
                    Regenerate
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
