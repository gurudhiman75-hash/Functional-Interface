import { AlertTriangle, CheckCircle2, Clock3, MessageSquare, UserRound } from 'lucide-react';

import { StatusBadge } from '@/components/shared/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TestQaQueueItem } from '@/features/test-qa/model';
import { formatTestQaAge, testQaAgeBand } from '@/features/test-qa/model';
import { cn } from '@/lib/utils';

function statusTone(status: string) {
  if (status === 'live' || status === 'qa_approved') return 'success' as const;
  if (status === 'needs_fix') return 'warning' as const;
  if (status === 'under_qa' || status === 'scheduled') return 'info' as const;
  return 'neutral' as const;
}

function ageClass(item: TestQaQueueItem) {
  const band = testQaAgeBand(item);
  if (band === 'overdue') return 'border-destructive/30 text-destructive';
  if (band === 'warning') return 'border-warning/30 text-warning';
  return 'border-success/30 text-success';
}

export function TestQaQueue({
  items,
  selectedId,
  loading,
  onSelect,
}: {
  items: TestQaQueueItem[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (testId: string) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">QA queue</CardTitle>
          <Badge variant="outline">{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="max-h-[760px] space-y-2 overflow-y-auto p-3 pt-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading canonical tests…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No tests are currently available for QA.</div>
        ) : items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              'w-full rounded-xl border p-3 text-left transition hover:border-primary/40 hover:bg-muted/20',
              selectedId === item.id && 'border-primary bg-primary/5 shadow-sm',
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.title || item.publicCode}</p>
                <p className="mt-1 truncate text-[11px] text-muted-foreground">{item.publicCode} · {item.examName}</p>
              </div>
              <StatusBadge tone={statusTone(item.status)} dot>{item.status.replace(/_/g, ' ')}</StatusBadge>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge variant="outline" className={cn('text-[10px]', ageClass(item))}>
                <Clock3 className="mr-1 h-3 w-3" /> {formatTestQaAge(item)}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <UserRound className="mr-1 h-3 w-3" /> {item.collaboration?.assignment.reviewerName || 'Unassigned'}
              </Badge>
              {(item.collaboration?.openCommentCount ?? 0) > 0 ? (
                <Badge variant="outline" className="border-warning/30 text-[10px] text-warning">
                  <MessageSquare className="mr-1 h-3 w-3" /> {item.collaboration?.openCommentCount} open
                </Badge>
              ) : (
                <Badge variant="outline" className="border-success/30 text-[10px] text-success">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> clear
                </Badge>
              )}
              {item.status === 'needs_fix' && (
                <Badge variant="outline" className="border-warning/30 text-[10px] text-warning">
                  <AlertTriangle className="mr-1 h-3 w-3" /> action needed
                </Badge>
              )}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
