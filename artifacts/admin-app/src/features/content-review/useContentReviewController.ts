import { useEffect, useMemo, useState } from 'react';

import { showToast } from '@/components/shared/toast';
import { updateGenerationItems } from '@/features/question-studio/api';
import {
  isProbabilityNativeReviewPayload,
  updateProbabilityReviewItem,
} from '@/features/question-studio/probability-review-api';
import { transitionQuestion } from '@/features/question-bank/api';
import { useAdminPermissions } from '@/integrations/AdminPermissionContext';
import type { ReviewDecision } from '@/pages/content/ContentReviewDetail';
import {
  DEFAULT_REVIEW_FILTERS,
  filterContentReviewItems,
  parseSavedReviewViews,
  reviewItemAgeBand,
  sortReviewQueue,
  type ContentReviewFilters,
  type SavedReviewView,
} from './queue-model';
import { useContentReview } from './useContentReview';

const SAVED_VIEWS_KEY = 'examtree.admin.content-review.saved-views.v1';

export function useContentReviewController() {
  const { session, hasPermission } = useAdminPermissions();
  const canReview = hasPermission('content.questions.approve');
  const collaboration = useContentReview();
  const [filters, setFilters] = useState<ContentReviewFilters>(DEFAULT_REVIEW_FILTERS);
  const [savedViews, setSavedViews] = useState<SavedReviewView[]>(() =>
    parseSavedReviewViews(globalThis.localStorage?.getItem(SAVED_VIEWS_KEY) ?? null));
  const [viewName, setViewName] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [actionReason, setActionReason] = useState('');

  const queue = useMemo(() => sortReviewQueue(filterContentReviewItems(
    collaboration.workspace.items,
    filters,
    session?.user.id ?? null,
  )), [collaboration.workspace.items, filters, session?.user.id]);
  const selectedItem = queue.find((item) => item.key === selectedKey) ?? queue[0] ?? null;
  const selectedIndex = selectedItem ? queue.findIndex((item) => item.key === selectedItem.key) : -1;
  const statuses = useMemo(
    () => Array.from(new Set(collaboration.workspace.items.map((item) => item.status))).sort(),
    [collaboration.workspace.items],
  );
  const metrics = useMemo(() => ({
    total: collaboration.workspace.items.length,
    mine: collaboration.workspace.items.filter((item) =>
      item.collaboration.assignment.reviewerUserId === session?.user.id).length,
    overdue: collaboration.workspace.items.filter((item) => reviewItemAgeBand(item) === 'overdue').length,
    openComments: collaboration.workspace.items.reduce(
      (sum, item) => sum + item.collaboration.openCommentCount,
      0,
    ),
  }), [collaboration.workspace.items, session?.user.id]);

  useEffect(() => {
    if (selectedItem && selectedKey !== selectedItem.key) setSelectedKey(selectedItem.key);
    if (!selectedItem && selectedKey) setSelectedKey(null);
  }, [selectedItem, selectedKey]);

  const selectRelative = (delta: number) => {
    if (queue.length === 0) return;
    const current = selectedIndex >= 0 ? selectedIndex : 0;
    const next = Math.min(queue.length - 1, Math.max(0, current + delta));
    setSelectedKey(queue[next]?.key ?? null);
    setActionReason('');
  };

  const performDecision = async (decision: ReviewDecision) => {
    if (!selectedItem) return;
    if ((decision === 'needs_fix' || decision === 'reject') && !actionReason.trim()) {
      showToast.error('Decision reason required', 'Describe the exact editorial issue first.');
      return;
    }
    try {
      let probabilityNativeDecision = false;
      if (selectedItem.entityType === 'generation_item') {
        const status = decision === 'approve'
          ? 'approved'
          : decision === 'needs_fix'
            ? 'needs_fix'
            : decision === 'reject'
              ? 'rejected'
              : 'unreviewed';
        probabilityNativeDecision = isProbabilityNativeReviewPayload(selectedItem.currentPayload);
        if (probabilityNativeDecision) {
          await updateProbabilityReviewItem({
            itemId: selectedItem.entityId,
            status,
            reason: actionReason.trim() || undefined,
          });
        } else {
          await updateGenerationItems({
            itemIds: [selectedItem.entityId],
            status,
            reason: actionReason.trim() || undefined,
          });
        }
      } else {
        const action = decision === 'approve'
          ? 'approve'
          : decision === 'needs_fix'
            ? 'needs-fix'
            : 'submit-review';
        await transitionQuestion(selectedItem.entityId, action, {
          expectedLockVersion: selectedItem.lockVersion,
          reason: actionReason.trim() || undefined,
        });
      }
      showToast.success(
        'Review decision saved',
        probabilityNativeDecision
          ? `${selectedItem.publicCode} updated as Probability editorial evidence; Question Bank and release remain locked.`
          : `${selectedItem.publicCode} moved through the canonical lifecycle.`,
      );
      setActionReason('');
      await collaboration.refresh();
    } catch (caught) {
      showToast.error('Decision failed', caught instanceof Error ? caught.message : 'Unable to update review status.');
    }
  };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (
        target.tagName === 'INPUT'
        || target.tagName === 'TEXTAREA'
        || target.tagName === 'SELECT'
        || target.isContentEditable
      )) return;
      const key = event.key.toLowerCase();
      if (key === 'j' || event.key === 'ArrowDown') {
        event.preventDefault();
        selectRelative(1);
      } else if (key === 'k' || event.key === 'ArrowUp') {
        event.preventDefault();
        selectRelative(-1);
      } else if (key === 'a' && selectedItem && canReview) {
        event.preventDefault();
        void performDecision('approve');
      } else if (key === 'f' && selectedItem && canReview) {
        event.preventDefault();
        void performDecision('needs_fix');
      } else if (key === 'x' && selectedItem?.entityType === 'generation_item' && canReview) {
        event.preventDefault();
        void performDecision('reject');
      } else if (key === 's' && selectedItem?.entityType === 'question' && canReview) {
        event.preventDefault();
        void performDecision('submit_review');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const persistViews = (views: SavedReviewView[]) => {
    setSavedViews(views);
    globalThis.localStorage?.setItem(SAVED_VIEWS_KEY, JSON.stringify(views));
  };

  const saveView = () => {
    const name = viewName.trim();
    if (!name) return;
    persistViews([
      ...savedViews.filter((view) => view.name.toLowerCase() !== name.toLowerCase()),
      { id: crypto.randomUUID(), name, filters },
    ].slice(-20));
    setViewName('');
    showToast.success('Review view saved', `${name} is stored as an admin UI preference.`);
  };

  return {
    ...collaboration,
    canReview,
    filters,
    setFilters,
    savedViews,
    viewName,
    setViewName,
    selectedItem,
    queue,
    statuses,
    metrics,
    actionReason,
    setActionReason,
    performDecision,
    selectRelative,
    setSelectedKey,
    saveView,
    clearSavedViews: () => persistViews([]),
    applySavedView: (id: string) => {
      const view = savedViews.find((entry) => entry.id === id);
      if (view) setFilters(view.filters);
    },
  };
}