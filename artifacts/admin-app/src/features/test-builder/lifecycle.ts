import {
  transitionLiveTest,
  type LiveTestDetail,
  type LiveTestStatus,
  type TestLifecycleAction,
} from './api';

/** The four statuses admins work with. Older QA states are folded into "draft". */
export type TestStatusGroup = 'draft' | 'scheduled' | 'live' | 'archived';

const DRAFT_LIKE: LiveTestStatus[] = ['draft', 'content_ready', 'under_qa', 'needs_fix', 'qa_approved'];

export function statusGroup(status: LiveTestStatus): TestStatusGroup {
  if (status === 'scheduled') return 'scheduled';
  if (status === 'live' || status === 'completed') return 'live';
  if (status === 'archived') return 'archived';
  return 'draft';
}

export function hasUnpublishedChanges(test: {
  status: LiveTestStatus;
  currentDraftVersionId: string | null;
  publishedVersionId: string | null;
}): boolean {
  return test.status === 'live' && !!test.currentDraftVersionId && test.currentDraftVersionId !== test.publishedVersionId;
}

export function statusLabel(test: {
  status: LiveTestStatus;
  currentDraftVersionId: string | null;
  publishedVersionId: string | null;
}): string {
  if (hasUnpublishedChanges(test)) return 'Live · unpublished changes';
  if (test.status === 'completed') return 'Live · closed';
  return { draft: 'Draft', scheduled: 'Scheduled', live: 'Live', archived: 'Archived' }[statusGroup(test.status)];
}

export function statusBadgeClass(group: TestStatusGroup, changes = false): string {
  if (changes) return 'bg-warning/10 text-warning hover:bg-warning/10';
  if (group === 'live') return 'bg-success/10 text-success hover:bg-success/10';
  if (group === 'scheduled') return 'bg-primary/10 text-primary hover:bg-primary/10';
  if (group === 'archived') return 'bg-destructive/10 text-destructive hover:bg-destructive/10';
  return 'bg-muted text-muted-foreground hover:bg-muted';
}

/** Tests already QA-approved under the old flow keep using the legacy actions. */
export function publishAction(status: LiveTestStatus): TestLifecycleAction {
  return status === 'qa_approved' ? 'publish' : 'approve-publish';
}
export function scheduleAction(status: LiveTestStatus): TestLifecycleAction {
  return status === 'qa_approved' ? 'schedule' : 'approve-schedule';
}

export function canPublish(test: { status: LiveTestStatus; currentDraftVersionId: string | null; publishedVersionId: string | null }): boolean {
  if (test.status === 'live') return hasUnpublishedChanges(test);
  return [...DRAFT_LIKE, 'scheduled'].includes(test.status) && test.status !== 'needs_fix';
}
export function canSchedule(status: LiveTestStatus): boolean {
  return ['draft', 'content_ready', 'under_qa', 'qa_approved', 'scheduled'].includes(status);
}

function errorCode(error: unknown): string | null {
  return error && typeof error === 'object' && typeof (error as { code?: unknown }).code === 'string'
    ? (error as { code: string }).code : null;
}
function activeAttempts(error: unknown): number {
  const details = error && typeof error === 'object' ? (error as { details?: unknown }).details : null;
  const value = details && typeof details === 'object' ? (details as { activeAttempts?: unknown }).activeAttempts : null;
  return typeof value === 'number' ? value : 0;
}

/**
 * Publish (or schedule) a test. If the server reports students mid-attempt on a
 * live test, ask the admin once and retry with an explicit acknowledgement.
 */
export async function runPublishAction(
  testId: string,
  action: TestLifecycleAction,
  input: { expectedCurrentDraftVersionId: string; scheduledAt?: string; closesAt?: string; reason?: string },
  confirmActiveAttempts: (count: number) => boolean,
): Promise<LiveTestDetail | null> {
  try {
    return await transitionLiveTest(testId, action, input);
  } catch (error) {
    if (errorCode(error) !== 'TEST_HAS_ACTIVE_ATTEMPTS') throw error;
    if (!confirmActiveAttempts(activeAttempts(error))) return null;
    return transitionLiveTest(testId, action, { ...input, acknowledgeActiveAttempts: true });
  }
}

export const ACTIVE_ATTEMPTS_WARNING = (count: number) =>
  `${count} student${count === 1 ? ' is' : 's are'} in the middle of this test.\n\n`
  + 'Publishing the new version now may restart or disrupt their attempt.\n\nPublish anyway?';
