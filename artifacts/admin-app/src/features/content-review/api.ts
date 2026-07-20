import { getFirebaseAuth } from '@/integrations/firebase';

export type ReviewEntityType = 'generation_item' | 'question';

export interface ReviewReviewer {
  id: string;
  email: string;
  displayName: string;
  employeeCode: string;
  department: string | null;
  title: string | null;
}

export interface ReviewAssignment {
  reviewerUserId: string | null;
  reviewerName: string | null;
  assignedAt: string | null;
  assignedByUserId: string | null;
  assignedByName: string | null;
  reason: string | null;
}

export interface ReviewComment {
  id: string;
  entityType: ReviewEntityType;
  entityId: string;
  entityVersionId: string | null;
  parentCommentId: string | null;
  message: string;
  actorUserId: string | null;
  actorName: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedByName: string | null;
}

export interface ReviewCollaboration {
  assignment: ReviewAssignment;
  comments: ReviewComment[];
  openCommentCount: number;
}

export interface ReviewOption {
  id?: string;
  key?: string;
  text: string;
  sortOrder?: number;
  isCorrect?: boolean;
}

export interface GeneratedReviewItem {
  key: string;
  entityType: 'generation_item';
  entityId: string;
  source: 'Question Studio';
  publicCode: string;
  status: 'unreviewed' | 'needs_fix' | 'approved' | 'rejected';
  versionNumber: number;
  physicalReviewerUserId: string | null;
  retryReason: string | null;
  createdAt: string;
  updatedAt: string;
  dueAt: string | null;
  requestSnapshot: Record<string, unknown>;
  versionId: string;
  currentPayload: Record<string, unknown>;
  previousVersionId: string | null;
  previousVersionNumber: number | null;
  previousPayload: Record<string, unknown> | null;
  collaboration: ReviewCollaboration;
}

export interface QuestionReviewItem {
  key: string;
  entityType: 'question';
  entityId: string;
  source: 'Question Bank';
  publicCode: string;
  status: 'draft' | 'generated' | 'under_review' | 'needs_fix' | 'rejected';
  lockVersion: number;
  createdAt: string;
  updatedAt: string;
  versionId: string;
  versionNumber: number;
  stem: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  examName: string | null;
  options: ReviewOption[];
  taxonomy: Array<{ id: string; code: string; nodeType: string; name: string; isPrimary: boolean }>;
  previousVersionId: string | null;
  previousVersionNumber: number | null;
  previousStem: string | null;
  previousExplanation: string | null;
  previousDifficulty: string | null;
  previousOptions: ReviewOption[];
  collaboration: ReviewCollaboration;
}

export type ContentReviewItem = GeneratedReviewItem | QuestionReviewItem;

export interface ContentReviewWorkspace {
  reviewers: ReviewReviewer[];
  items: ContentReviewItem[];
  generatedAt: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string; details?: unknown } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Content Review request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Content Review returned an empty response.');
  return body;
}

export function getContentReviewWorkspace() {
  return request<ContentReviewWorkspace>('/admin/content-review/workspace');
}

export function updateReviewAssignments(input: {
  items: Array<{ entityType: ReviewEntityType; entityId: string }>;
  reviewerUserId: string | null;
  reason: string;
}) {
  return request<{ updatedCount: number }>('/admin/content-review/assignments', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function addReviewComment(input: {
  entityType: ReviewEntityType;
  entityId: string;
  message: string;
  parentCommentId?: string | null;
}) {
  const { entityType, entityId, ...body } = input;
  return request<{ commentId: string }>(
    `/admin/content-review/items/${entityType}/${encodeURIComponent(entityId)}/comments`,
    { method: 'POST', body: JSON.stringify(body) },
  );
}

export function setReviewCommentResolved(input: {
  commentId: string;
  resolved: boolean;
  reason?: string;
}) {
  const { commentId, ...body } = input;
  return request<{ eventId: string; resolved: boolean }>(
    `/admin/content-review/comments/${encodeURIComponent(commentId)}/resolution`,
    { method: 'PATCH', body: JSON.stringify(body) },
  );
}
