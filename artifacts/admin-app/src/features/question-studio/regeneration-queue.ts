import type { QuestionStudioItem, QuestionStudioRun } from './api';
import { analyzeItemQuality, itemStem } from './quality';

export interface RegenerationQueueItem {
  item: QuestionStudioItem;
  stem: string;
  blockerCount: number;
  warningCount: number;
  reasons: string[];
  regenerationLocked: boolean;
}

export interface RegenerationQueueRun {
  run: QuestionStudioRun;
  items: RegenerationQueueItem[];
  needsFixItemIds: string[];
}

function revisionPolicy(item: QuestionStudioItem) {
  const value = item.payload?.revisionPolicy;
  return typeof value === 'string' ? value.trim() : '';
}

export function isItemRegeneratable(item: QuestionStudioItem): boolean {
  return !item.acceptedQuestionId
    && (item.status === 'unreviewed' || item.status === 'needs_fix' || item.status === 'rejected');
}

export function isItemRegenerationLocked(item: QuestionStudioItem): boolean {
  return revisionPolicy(item) === 'SOURCE_GENERATOR_ONLY';
}

export function buildRegenerationQueue(runs: QuestionStudioRun[]): RegenerationQueueRun[] {
  return runs.map((run) => {
    const items = run.items.flatMap((item) => {
      if (!isItemRegeneratable(item)) return [];
      const quality = analyzeItemQuality(item.payload);
      const shouldSurface = item.status === 'needs_fix'
        || item.status === 'rejected'
        || quality.blockerCount > 0;
      if (!shouldSurface) return [];

      const regenerationLocked = isItemRegenerationLocked(item);
      const reasons = [
        item.retryReason,
        regenerationLocked
          ? 'Source-controlled package: fix the canonical generator/localization source and create a new review batch.'
          : null,
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
        regenerationLocked,
      }];
    });

    return {
      run,
      items,
      needsFixItemIds: items
        .filter((entry) => entry.item.status === 'needs_fix' && !entry.regenerationLocked)
        .map((entry) => entry.item.id),
    };
  }).filter((entry) => entry.items.length > 0);
}
