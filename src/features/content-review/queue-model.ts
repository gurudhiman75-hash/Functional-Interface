import type { ContentReviewItem } from './api';
import { reviewItemExam, reviewItemStem, reviewItemTopic } from './item-model';

export type ReviewSourceFilter = 'all' | 'Question Studio' | 'Question Bank';
export type ReviewAssignmentFilter = 'all' | 'mine' | 'unassigned';
export type ReviewAgeFilter = 'all' | 'fresh' | 'warning' | 'overdue';

export interface ContentReviewFilters {
  search: string;
  source: ReviewSourceFilter;
  status: string;
  assignment: ReviewAssignmentFilter;
  age: ReviewAgeFilter;
  openCommentsOnly: boolean;
}

export interface SavedReviewView {
  id: string;
  name: string;
  filters: ContentReviewFilters;
}

export const DEFAULT_REVIEW_FILTERS: ContentReviewFilters = {
  search: '',
  source: 'all',
  status: 'all',
  assignment: 'all',
  age: 'all',
  openCommentsOnly: false,
};

function asText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export function reviewItemAgeHours(item: ContentReviewItem, now = Date.now()): number {
  const updated = new Date(item.updatedAt).getTime();
  return Number.isFinite(updated) ? Math.max(0, (now - updated) / 3_600_000) : 0;
}

export function reviewItemAgeBand(item: ContentReviewItem, now = Date.now()): Exclude<ReviewAgeFilter, 'all'> {
  const hours = reviewItemAgeHours(item, now);
  if (hours >= 72) return 'overdue';
  if (hours >= 24) return 'warning';
  return 'fresh';
}

export function formatReviewAge(item: ContentReviewItem, now = Date.now()): string {
  const hours = reviewItemAgeHours(item, now);
  if (hours < 1) return 'Updated recently';
  if (hours < 24) return `${Math.floor(hours)}h old`;
  return `${Math.floor(hours / 24)}d old`;
}

export function filterContentReviewItems(
  items: ContentReviewItem[],
  filters: ContentReviewFilters,
  currentUserId: string | null,
  now = Date.now(),
): ContentReviewItem[] {
  const search = filters.search.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.source !== 'all' && item.source !== filters.source) return false;
    if (filters.status !== 'all' && item.status !== filters.status) return false;
    const reviewerUserId = item.collaboration.assignment.reviewerUserId;
    if (filters.assignment === 'mine' && reviewerUserId !== currentUserId) return false;
    if (filters.assignment === 'unassigned' && reviewerUserId) return false;
    if (filters.age !== 'all' && reviewItemAgeBand(item, now) !== filters.age) return false;
    if (filters.openCommentsOnly && item.collaboration.openCommentCount === 0) return false;
    if (!search) return true;
    return [
      item.publicCode,
      item.source,
      item.status,
      reviewItemStem(item),
      reviewItemTopic(item),
      reviewItemExam(item),
      item.collaboration.assignment.reviewerName ?? '',
    ].join(' ').toLowerCase().includes(search);
  });
}

export function sortReviewQueue(items: ContentReviewItem[], now = Date.now()): ContentReviewItem[] {
  const priority = (item: ContentReviewItem) => {
    const age = reviewItemAgeBand(item, now);
    return (age === 'overdue' ? 300 : age === 'warning' ? 200 : 100)
      + (item.collaboration.openCommentCount > 0 ? 30 : 0)
      + (item.status === 'needs_fix' || item.status === 'rejected' ? 20 : 0);
  };
  return [...items].sort((left, right) => {
    const delta = priority(right) - priority(left);
    return delta || new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime();
  });
}

export function parseSavedReviewViews(raw: string | null): SavedReviewView[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw) as unknown;
    if (!Array.isArray(value)) return [];
    return value.flatMap((entry) => {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return [];
      const record = entry as Record<string, unknown>;
      const id = asText(record.id);
      const name = asText(record.name);
      const partial = record.filters && typeof record.filters === 'object' && !Array.isArray(record.filters)
        ? record.filters as Partial<ContentReviewFilters>
        : {};
      if (!id || !name) return [];
      return [{
        id,
        name,
        filters: {
          ...DEFAULT_REVIEW_FILTERS,
          ...partial,
          search: asText(partial.search),
        },
      }];
    }).slice(0, 20);
  } catch {
    return [];
  }
}
