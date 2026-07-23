import { adminRequest } from '@/lib/admin-request';

export type QuestionStatus =
  | 'draft'
  | 'generated'
  | 'under_review'
  | 'needs_fix'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'archived';

export interface LiveQuestionOption {
  id: string;
  key: string;
  text: string;
  sortOrder: number;
  isCorrect: boolean;
}

export interface QuestionTaxonomyNode {
  id: string;
  code: string;
  nodeType: string;
  name: string;
  isPrimary: boolean;
}

export interface LiveQuestion {
  id: string;
  publicCode: string;
  status: QuestionStatus;
  primaryTaxonomyNodeId: string | null;
  currentDraftVersionId: string | null;
  approvedVersionId: string | null;
  publishedVersionId: string | null;
  publishedAt: string | null;
  lockVersion: number;
  createdAt: string;
  updatedAt: string;
  versionId: string;
  versionNumber: number;
  examVersionId: string | null;
  examCode: string | null;
  examName: string | null;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string;
  answerModel: Record<string, unknown>;
  options: LiveQuestionOption[];
  taxonomy: QuestionTaxonomyNode[];
}

export type LiveApprovedQuestion = LiveQuestion;

export interface QuestionVersion {
  id: string;
  questionId: string;
  versionNumber: number;
  examVersionId: string | null;
  examVersionName: string | null;
  examId: string | null;
  examCode: string | null;
  examName: string | null;
  examFamilyId: string | null;
  examFamilyCode: string | null;
  examFamilyName: string | null;
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
  taxonomy: QuestionTaxonomyNode[];
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
  publishedVersionId: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
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
  publicationIssues: string[];
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

export interface ExamFamilyOption {
  id: string;
  code: string;
  name: string;
}

export interface ExamOption {
  id: string;
  familyId: string;
  code: string;
  name: string;
  currentVersionId: string | null;
  currentVersionNumber: number | null;
  currentVersionName: string | null;
}

export interface TaxonomyNodeOption {
  id: string;
  code: string;
  nodeType: string;
  name: string;
  parentIds: string[];
  examVersionIds: string[];
}

export interface TaxonomyOptionsResponse {
  families: ExamFamilyOption[];
  exams: ExamOption[];
  nodes: TaxonomyNodeOption[];
  generatedAt: string;
}

export interface PublishedQuestion {
  id: string;
  publicCode: string;
  status: QuestionStatus;
  publishedAt: string | null;
  versionId: string;
  versionNumber: number;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string;
  answerModel: Record<string, unknown>;
  examVersionId: string;
  examCode: string;
  examName: string;
  examFamilyCode: string;
  examFamilyName: string;
  options: LiveQuestionOption[];
  taxonomy: QuestionTaxonomyNode[];
}

export type QuestionLifecycleAction =
  | 'submit-review'
  | 'approve'
  | 'needs-fix'
  | 'restore-draft'
  | 'publish'
  | 'unpublish'
  | 'archive';

export function getLiveQuestions() {
  return adminRequest<{ questions: LiveQuestion[]; generatedAt: string }>(
    '/admin/questions',
    undefined,
    { fallbackMessage: 'Unable to load Question Bank.' },
  );
}

export const getLiveApprovedQuestions = getLiveQuestions;

export function getPublishedQuestions() {
  return adminRequest<{ questions: PublishedQuestion[]; generatedAt: string }>(
    '/admin/questions/published',
    undefined,
    { fallbackMessage: 'Unable to load published questions.' },
  );
}

export function getQuestionTaxonomyOptions() {
  return adminRequest<TaxonomyOptionsResponse>(
    '/admin/questions/taxonomy/options',
    undefined,
    { fallbackMessage: 'Unable to load question taxonomy options.' },
  );
}

export function getQuestionDetail(questionId: string) {
  return adminRequest<QuestionDetailResponse>(
    `/admin/questions/${encodeURIComponent(questionId)}`,
    undefined,
    { fallbackMessage: 'Unable to load the selected question.', affectedRecord: questionId },
  );
}

export function createQuestionVersion(questionId: string, input: QuestionVersionInput) {
  return adminRequest<QuestionDetailResponse>(
    `/admin/questions/${encodeURIComponent(questionId)}/versions`,
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create a question version.', affectedRecord: questionId },
  );
}

export async function updateQuestionTaxonomy(
  questionId: string,
  input: {
    expectedLockVersion: number;
    examVersionId: string;
    primaryTaxonomyNodeId: string;
    taxonomyNodeIds: string[];
  },
) {
  await adminRequest<unknown>(
    `/admin/questions/${encodeURIComponent(questionId)}/taxonomy`,
    { method: 'PATCH', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to update question taxonomy.', affectedRecord: questionId },
  );
  return getQuestionDetail(questionId);
}

export async function transitionQuestion(
  questionId: string,
  action: QuestionLifecycleAction,
  input: { expectedLockVersion: number; reason?: string },
) {
  await adminRequest<unknown>(
    `/admin/questions/${encodeURIComponent(questionId)}/actions/${action}`,
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: `Unable to ${action.replace('-', ' ')} the question.`, affectedRecord: questionId },
  );
  return getQuestionDetail(questionId);
}

export function reconcileApprovedQuestions() {
  return adminRequest<{
    converted: Array<{
      itemId: string;
      questionId: string;
      questionVersionId: string;
      publicCode: string;
    }>;
    convertedCount: number;
  }>(
    '/admin/questions/reconcile-approved',
    { method: 'POST', body: '{}' },
    { fallbackMessage: 'Unable to reconcile approved generated questions.' },
  );
}
