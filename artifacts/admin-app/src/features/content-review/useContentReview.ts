import { useCallback, useEffect, useState } from 'react';

import {
  addReviewComment,
  getContentReviewWorkspace,
  setReviewCommentResolved,
  updateReviewAssignments,
  type ContentReviewWorkspace,
  type ReviewEntityType,
} from './api';

const EMPTY_WORKSPACE: ContentReviewWorkspace = {
  reviewers: [],
  items: [],
  generatedAt: '',
};

export function useContentReview() {
  const [workspace, setWorkspace] = useState<ContentReviewWorkspace>(EMPTY_WORKSPACE);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setWorkspace(await getContentReviewWorkspace());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to load Content Review.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const assign = useCallback(async (input: {
    items: Array<{ entityType: ReviewEntityType; entityId: string }>;
    reviewerUserId: string | null;
    reason: string;
  }) => {
    setMutating(true);
    setError(null);
    try {
      const result = await updateReviewAssignments(input);
      await refresh();
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to change review ownership.');
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  const comment = useCallback(async (input: {
    entityType: ReviewEntityType;
    entityId: string;
    message: string;
    parentCommentId?: string | null;
  }) => {
    setMutating(true);
    setError(null);
    try {
      const result = await addReviewComment(input);
      await refresh();
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to add review comment.');
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  const resolveComment = useCallback(async (input: {
    commentId: string;
    resolved: boolean;
    reason?: string;
  }) => {
    setMutating(true);
    setError(null);
    try {
      const result = await setReviewCommentResolved(input);
      await refresh();
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update review comment.');
      throw caught;
    } finally {
      setMutating(false);
    }
  }, [refresh]);

  return {
    workspace,
    loading,
    mutating,
    error,
    refresh,
    assign,
    comment,
    resolveComment,
  };
}
