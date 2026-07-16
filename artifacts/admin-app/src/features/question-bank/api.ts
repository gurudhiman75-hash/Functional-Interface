import { getFirebaseAuth } from '@/integrations/firebase';

export type QuestionStatus =
  | 'draft'
  | 'generated'
  | 'under_review'
  | 'needs_fix'
  | 'approved'
  | 'rejected'
  | 'archived';

export interface LiveQuestionOption {
  id: string;
  key: string;
  text: string;
  sortOrder: number;
  isCorrect: boolean;
}

export interface LiveQuestion {
  id: string;
  publicCode: string;
  status: QuestionStatus;
  currentDraftVersionId: string | null;
  approvedVersionId: string | null;
  lockVersion: number;
  createdAt: string;
  updatedAt: string;
  versionId: string;
  versionNumber: number;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string;
  answerModel: Record<string, unknown>;
  options: LiveQuestionOption[];
}

export type LiveApprovedQuestion = LiveQuestion;

export interface QuestionVersion {
  id: string;
  questionId: string;
  versionNumber: number;
  examVersionId: string | null;
  patternId: string | null;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string;
  answerModel: Record<string, unknown>;
  defaultMarks: string;
  defaultNegativeMarks: string;
  targetTimeSeconds: number | null;
  changeReason: string;
  createdBy: string | null;
  createdAt: string;
  options: LiveQuestionOption[];
}

export interface QuestionRecord {
  id: string;
  publicCode: string;
  status: QuestionStatus;
  sourceId: string | null;
  primaryTaxonomyNodeId: string | null;
  authorUserId: string | null;
  currentDraftVersionId: string | null;
  approvedVersionId: string | null;
  displayVersionId: string;
  lockVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionAuditEvent {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  actionKey: string;
  entityVersionId: string | null;
  reason: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
}

export interface QuestionDetailResponse {
  question: QuestionRecord;
  versions: QuestionVersion[];
  auditEvents: QuestionAuditEvent[];
  generatedAt: string;
}

export interface QuestionVersionInput {
  expectedLockVersion: number;
  stem: string;
  explanation: string;
  difficulty: string;
  questionType: string;
  changeReason: string;
  options: Array<{ text: string; isCorrect: boolean }>;
}

export type QuestionLifecycleAction =
  | 'submit-review'
  | 'approve'
  | 'needs-fix'
  | 'restore-draft'
  | 'archive';

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

  const body = await response.json().catch(() => null) as ({ error?: string; code?: string } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Question Bank request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status });
    throw error;
  }
  if (!body) throw new Error('Question Bank returned an empty response.');
  return body;
}

export function getLiveQuestions() {
  return request<{ questions: LiveQuestion[]; generatedAt: string }>('/admin/questions');
}

export const getLiveApprovedQuestions = getLiveQuestions;

export function getQuestionDetail(questionId: string) {
  return request<QuestionDetailResponse>(`/admin/questions/${encodeURIComponent(questionId)}`);
}

export function createQuestionVersion(questionId: string, input: QuestionVersionInput) {
  return request<QuestionDetailResponse>(`/admin/questions/${encodeURIComponent(questionId)}/versions`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function transitionQuestion(
  questionId: string,
  action: QuestionLifecycleAction,
  input: { expectedLockVersion: number; reason?: string },
) {
  return request<QuestionDetailResponse>(
    `/admin/questions/${encodeURIComponent(questionId)}/actions/${action}`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function reconcileApprovedQuestions() {
  return request<{
    converted: Array<{
      itemId: string;
      questionId: string;
      questionVersionId: string;
      publicCode: string;
    }>;
    convertedCount: number;
  }>('/admin/questions/reconcile-approved', { method: 'POST', body: '{}' });
}
