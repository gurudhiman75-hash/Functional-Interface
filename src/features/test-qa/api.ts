import { getFirebaseAuth } from '@/integrations/firebase';

export interface TestQaReviewer {
  id: string;
  email: string;
  displayName: string | null;
  employeeCode: string | null;
  department: string | null;
  title: string | null;
}

export interface TestQaComment {
  id: string;
  testId: string;
  testVersionId: string;
  parentCommentId: string | null;
  message: string;
  actorUserId: string | null;
  actorName: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedByName: string | null;
}

export interface TestQaCollaboration {
  testId: string;
  testVersionId: string;
  assignment: {
    reviewerUserId: string | null;
    reviewerName: string | null;
    assignedAt: string | null;
    assignedByUserId: string | null;
    assignedByName: string | null;
    reason: string | null;
  };
  comments: TestQaComment[];
  openCommentCount: number;
}

export interface TestQaWorkspaceResponse {
  reviewers: TestQaReviewer[];
  currentAdminUserId: string | null;
  collaboration: TestQaCollaboration[];
  generatedAt: string;
}

export interface TestQaComparisonQuestion {
  questionVersionId: string;
  position: number;
  marks: number;
  negativeMarks: number;
  publicCode: string;
  stem: string;
  difficulty: string;
}

export interface TestQaComparisonSection {
  id: string;
  sectionKey: string;
  name: string;
  sortOrder: number;
  durationSeconds: number | null;
  settings: Record<string, unknown>;
  questions: TestQaComparisonQuestion[];
}

export interface TestQaVersionSnapshot {
  id: string;
  versionNumber: number;
  title: string;
  description: string | null;
  durationSeconds: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  createdAt: string;
  sectionCount: number;
  questionCount: number;
  sections: TestQaComparisonSection[];
}

export interface TestQaComparisonResponse {
  current: TestQaVersionSnapshot;
  previous: TestQaVersionSnapshot | null;
  changes: {
    title: boolean;
    duration: boolean;
    totalMarks: boolean;
    sections: boolean;
    questions: boolean;
    addedQuestionVersionIds: string[];
    removedQuestionVersionIds: string[];
  };
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
    const error = new Error(body?.error || `Test QA request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Test QA returned an empty response.');
  return body;
}

export function getTestQaWorkspace() {
  return request<TestQaWorkspaceResponse>('/admin/test-qa/workspace');
}

export function assignTestQa(input: {
  items: Array<{ testId: string; testVersionId: string }>;
  reviewerUserId: string | null;
  reason: string;
}) {
  return request<{ updatedCount: number }>('/admin/test-qa/assignments', {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function addTestQaComment(input: {
  testId: string;
  testVersionId: string;
  message: string;
  parentCommentId?: string | null;
}) {
  return request<{ commentId: string }>('/admin/test-qa/comments', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function resolveTestQaComment(commentId: string, resolved: boolean, reason?: string) {
  return request<{ commentId: string; resolved: boolean }>(
    `/admin/test-qa/comments/${encodeURIComponent(commentId)}/resolution`,
    { method: 'PATCH', body: JSON.stringify({ resolved, reason }) },
  );
}

export function getTestQaComparison(testId: string) {
  return request<TestQaComparisonResponse>(`/admin/test-qa/tests/${encodeURIComponent(testId)}/comparison`);
}
