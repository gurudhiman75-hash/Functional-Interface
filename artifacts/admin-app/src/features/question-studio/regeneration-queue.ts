import type { QuestionStudioItem, QuestionStudioRun } from './api';
import { itemStem, qualityWithDuplicate, type DuplicateMatch } from './quality';

export interface RegenerationQueueItem {
  item: QuestionStudioItem;
  stem: string;
  blockerCount: number;
  warningCount: number;
  reasons: string[];
}

export interface RegenerationQueueRun {
  run: QuestionStudioRun;
  items: RegenerationQueueItem[];
  needsFixItemIds: string[];
}

export function isItemRegeneratable(item: QuestionStudioItem): boolean {
  return !item.acceptedQuestionId
    && (item.status === 'unreviewed' || item.status === 'needs_fix' || item.status === 'rejected');
}

export function buildRegenerationQueue(
  runs: QuestionStudioRun[],
  duplicates: Map<string, DuplicateMatch> = new Map(),
): RegenerationQueueRun[] {
  return runs.map((run) => {
    const items = run.items.flatMap((item) => {
      if (!isItemRegeneratable(item)) return [];
      const quality = qualityWithDuplicate(item, duplicates.get(item.id));
      const shouldSurface = item.status === 'needs_fix'
        || item.status === 'rejected'
        || quality.blockerCount > 0;
      if (!shouldSurface) return [];

      const reasons = [
        item.retryReason,
        ...quality.issues
          .filter((issue) => issue.severity === 'blocker')
          .map((issue) => issue.message),
      ].filter((value): value is string => Boolean(value));

      return [{
        item,
        stem: itemStem(item.payload) || 'Generated question stem unavailable',
        blockerCount: quality.blockerCount,
        warningCount: quality.warningCount,
        reasons: [...new Set(reasons)],
      }];
    });

    return {
      run,
      items,
      needsFixItemIds: items
        .filter((entry) => entry.item.status === 'needs_fix')
        .map((entry) => entry.item.id),
    };
  }).filter((entry) => entry.items.length > 0);
}
