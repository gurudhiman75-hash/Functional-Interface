import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ContentReviewItem } from '@/features/content-review/api';
import { reviewItemStem, reviewItemTopic } from '@/features/content-review/item-model';
import { formatReviewAge, reviewItemAgeBand } from '@/features/content-review/queue-model';
import { cn } from '@/lib/utils';

function statusTone(status: string) {
  if (status === 'approved') return 'success' as const;
  if (status === 'needs_fix') return 'warning' as const;
  if (status === 'rejected') return 'destructive' as const;
  return 'info' as const;
}

function ageTone(item: ContentReviewItem) {
  const band = reviewItemAgeBand(item);
  if (band === 'overdue') return 'text-destructive';
  if (band === 'warning') return 'text-warning';
  return 'text-muted-foreground';
}

export function ContentReviewQueue({
  items,
  selectedKey,
  loading,
  onSelect,
  onPrevious,
  onNext,
}: {
  items: ContentReviewItem[];
  selectedKey: string | null;
  loading: boolean;
  onSelect: (key: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const selectedIndex = items.findIndex((item) => item.key === selectedKey);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b px-4 py-3 text-xs text-muted-foreground">
        <span>{items.length} visible item(s)</span>
        <span><kbd>J</kbd>/<kbd>K</kbd> navigate</span>
      </div>
      {loading ? (
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading review queue…
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">No review items match this view.</div>
      ) : (
        <div className="max-h-[760px] divide-y overflow-y-auto">
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelect(item.key)}
              className={cn(
                'w-full px-4 py-4 text-left transition hover:bg-muted/50',
                selectedKey === item.key && 'bg-primary/5 ring-1 ring-inset ring-primary/25',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[10px] font-bold">{item.publicCode}</p>
                  <p className="mt-1 line-clamp-2 text-sm font-medium leading-5">
                    {reviewItemStem(item) || 'Question stem unavailable'}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <StatusBadge tone={statusTone(item.status)}>{item.status.replace(/_/g, ' ')}</StatusBadge>
                <Badge variant="outline" className="text-[9px]">{item.source}</Badge>
                {item.collaboration.openCommentCount > 0 && (
                  <Badge variant="outline" className="border-warning/30 text-[9px] text-warning">
                    {item.collaboration.openCommentCount} open
                  </Badge>
                )}
              </div>
              <p className="mt-2 truncate text-[11px] text-muted-foreground">{reviewItemTopic(item)}</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-[10px]">
                <span className={ageTone(item)}>{formatReviewAge(item)}</span>
                <span className="truncate text-muted-foreground">
                  {item.collaboration.assignment.reviewerName ?? 'Unassigned'}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between border-t p-2">
        <Button variant="ghost" size="sm" disabled={selectedIndex <= 0} onClick={onPrevious}>
          <ChevronUp className="mr-1 h-4 w-4" /> Previous
        </Button>
        <Button variant="ghost" size="sm" disabled={selectedIndex < 0 || selectedIndex >= items.length - 1} onClick={onNext}>
          Next <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
