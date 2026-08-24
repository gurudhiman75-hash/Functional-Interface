import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
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
import { buildRegenerationQueue } from '@/features/question-studio/regeneration-queue';
import { useQuestionStudio } from '@/features/question-studio/useQuestionStudio';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import { cn } from '@/lib/utils';

export function QuestionStudioRecoveryDock() {
  const { hasPermission } = useAdminPermissions();
  const canRegenerate = hasPermission('content.generation.run');
  const { dashboard, loading, refresh } = useQuestionStudio();
  const queue = useMemo(() => buildRegenerationQueue(dashboard.runs), [dashboard.runs]);
  const queueItems = useMemo(() => queue.flatMap((entry) => entry.items), [queue]);
  const needsFixCount = queueItems.filter((entry) => entry.item.status === 'needs_fix').length;
  const sourceControlledCount = queueItems.filter((entry) => entry.regenerationLocked).length;
  const retryableNeedsFixCount = queue.reduce((total, entry) => total + entry.needsFixItemIds.length, 0);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('Generate a fresh replacement after editorial review feedback');
  const [activeIds, setActiveIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    if (needsFixCount > 0) setOpen(true);
  }, [needsFixCount]);

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
      await refresh();
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

  if (!open) {
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
        Recovery queue · {queueItems.length}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 max-h-[78vh] overflow-hidden border-primary/20 shadow-2xl md:left-auto md:w-[520px]">
      <CardHeader className="border-b bg-background/95 pb-3 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <WandSparkles className="h-4 w-4 text-primary" /> Regeneration recovery queue
            </CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Create fresh immutable replacements without overwriting reviewer history. Source-controlled packages must be fixed at their generator/localization authority.
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close recovery queue">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{queueItems.length} surfaced</Badge>
          <Badge variant="outline" className={retryableNeedsFixCount > 0 ? 'border-warning/30 text-warning' : 'border-success/30 text-success'}>
            {retryableNeedsFixCount} retryable needs fix
          </Badge>
          {sourceControlledCount > 0 && (
            <Badge variant="outline" className="border-info/30 text-info">
              {sourceControlledCount} source-controlled
            </Badge>
          )}
          <Badge variant="outline">{queue.length} run(s)</Badge>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Reason for regeneration" />
          <Button
            type="button"
            onClick={() => void regenerate(allNeedsFixIds, 'Retry all needs-fix items')}
            disabled={!canRegenerate || busy || allNeedsFixIds.length === 0}
          >
            {busy && allNeedsFixIds.some((id) => activeIds.has(id))
              ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              : <RotateCcw className="mr-1.5 h-4 w-4" />}
            Retry {retryableNeedsFixCount} needs fix
          </Button>
        </div>
      </CardHeader>

      <CardContent className="max-h-[55vh] overflow-y-auto p-0">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading recovery queue…
          </div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center">
            <Sparkles className="mx-auto h-6 w-6 text-success" />
            <p className="mt-3 text-sm font-semibold">Recovery queue is clear</p>
            <p className="mt-1 text-xs text-muted-foreground">No needs-fix, rejected, or automatically blocked items require replacement.</p>
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
          {items.map(({ item, stem, blockerCount, warningCount, reasons, regenerationLocked }) => {
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
                      {regenerationLocked && <Badge variant="outline" className="border-info/30 text-info">Source controlled</Badge>}
                      {blockerCount > 0 && <Badge variant="outline" className="border-destructive/30 text-destructive">{blockerCount} blocker(s)</Badge>}
                      {warningCount > 0 && <Badge variant="outline">{warningCount} warning(s)</Badge>}
                    </div>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed">{stem}</p>
                    {reasons[0] && <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{reasons[0]}</p>}
                  </div>
                  <Button type="button" size="sm" onClick={() => onRetryItem(item.id, item.itemNumber)} disabled={disabled || regenerationLocked}>
                    {itemBusy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="mr-1.5 h-3.5 w-3.5" />}
                    {regenerationLocked ? 'Source controlled' : 'Regenerate'}
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
