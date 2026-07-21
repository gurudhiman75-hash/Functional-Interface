import { getFirebaseAuth } from '@/integrations/firebase';

export type TranslationStatus = 'missing' | 'draft' | 'in_review' | 'needs_fix' | 'approved' | 'rejected' | 'archived';
export type TranslationIssueSeverity = 'error' | 'warning';

export interface TranslationQualityIssue {
  code: string;
  severity: TranslationIssueSeverity;
  field: string;
  message: string;
}

export interface TranslationQualityResult {
  issues: TranslationQualityIssue[];
  errorCount: number;
  warningCount: number;
  score: number;
  approvable: boolean;
}

export interface LanguageSummary {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  scriptCode: string | null;
  fallbackLanguageId: string | null;
  isActive: boolean;
  eligibleQuestionCount: number;
  translatedQuestionCount: number;
  approvedQuestionCount: number;
  inReviewQuestionCount: number;
  needsFixQuestionCount: number;
  examVersionCount: number;
  completionPercent: number;
  sourceLanguage: boolean;
}

export interface TranslationQueueItem {
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  questionStatus: string;
  versionNumber: number;
  sourceStem: string;
  difficulty: string;
  questionType: string;
  examVersionId: string;
  examVersionName: string;
  examCode: string;
  examName: string;
  taxonomyNodeId: string | null;
  taxonomyCode: string | null;
  taxonomyName: string | null;
  languageId: string;
  languageCode: string;
  languageName: string;
  languageNativeName: string;
  translationId: string | null;
  status: TranslationStatus;
  translatorUserId: string | null;
  translatorName: string | null;
  reviewerUserId: string | null;
  reviewerName: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  updatedAt: string | null;
  qualitySnapshot: TranslationQualityResult | Record<string, unknown> | null;
  sourceOptionCount: number;
  translatedOptionCount: number;
}

export interface ExamLanguageMapping {
  examVersionId: string;
  examVersionName: string;
  versionNumber: number;
  isCurrent: boolean;
  examId: string;
  examCode: string;
  examName: string;
  languages: Array<{
    id: string;
    code: string;
    name: string;
    nativeName: string;
    isPrimary: boolean;
    isActive: boolean;
  }>;
}

export interface TranslationReviewer {
  id: string;
  displayName: string;
  email: string;
  department: string | null;
  title: string | null;
  permissions: string[];
}

export interface TranslationTerm {
  id: string;
  sourceText: string;
  languageId: string;
  languageCode: string;
  languageName: string;
  languageNativeName: string;
  preferredText: string;
  forbiddenVariants: string[];
  contextNote: string;
  scopeTaxonomyNodeId: string | null;
  scopeTaxonomyCode: string | null;
  scopeTaxonomyName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestLocalizationLanguage {
  languageCode: string;
  status: string;
  complete: boolean;
  translatedSectionCount: number;
  sectionCount: number;
  translation?: Record<string, unknown> | null;
}

export interface TestLocalizationSummary {
  testId: string;
  publicCode: string;
  status: string;
  examVersionId: string;
  testVersionId: string;
  versionNumber: number;
  title: string;
  settings: Record<string, unknown>;
  createdAt: string;
  examCode: string;
  examName: string;
  examVersionName: string;
  sectionCount: number;
  questionCount: number;
  languageCodes: string[];
  languages: TestLocalizationLanguage[];
  localizationReady: boolean;
}

export interface TranslationOverview {
  generatedAt: string;
  languages: LanguageSummary[];
  queue: TranslationQueueItem[];
  examMappings: ExamLanguageMapping[];
  reviewers: TranslationReviewer[];
  terms: TranslationTerm[];
  tests: TestLocalizationSummary[];
  metrics: {
    eligiblePairs: number;
    missing: number;
    draft: number;
    inReview: number;
    needsFix: number;
    approved: number;
    testsBlocked: number;
  };
}

export interface TranslationOption {
  key: string;
  text: string;
  sortOrder: number;
  isCorrect?: boolean;
}

export interface TranslationHistoryEvent {
  id: string;
  actionKey: string;
  reason: string | null;
  summary: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
  actorUserId: string | null;
  actorName: string | null;
  actorEmail: string | null;
}

export interface QuestionTranslationDetail {
  source: {
    questionVersionId: string;
    questionId: string;
    publicCode: string;
    questionStatus: string;
    versionNumber: number;
    examVersionId: string | null;
    questionType: string;
    difficulty: string;
    stem: string;
    explanation: string;
    answerModel: Record<string, unknown>;
    sourceCreatedAt: string;
    examCode: string | null;
    examName: string | null;
    examVersionName: string | null;
    taxonomyNodeId: string | null;
    taxonomyCode: string | null;
    taxonomyName: string | null;
    options: TranslationOption[];
  };
  language: {
    id: string;
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    scriptCode: string | null;
    isActive: boolean;
  };
  target: null | {
    id: string;
    questionVersionId: string;
    languageId: string;
    stem: string;
    explanation: string;
    status: Exclude<TranslationStatus, 'missing'>;
    translatorUserId: string | null;
    translatorName: string | null;
    translatorEmail: string | null;
    reviewerUserId: string | null;
    reviewerName: string | null;
    reviewerEmail: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    qualitySnapshot: TranslationQualityResult | Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    options: TranslationOption[];
  };
  terms: TranslationTerm[];
  quality: TranslationQualityResult | null;
  history: TranslationHistoryEvent[];
}

export interface TestTranslationDetail {
  source: {
    testId: string;
    publicCode: string;
    testStatus: string;
    examVersionId: string;
    testVersionId: string;
    versionNumber: number;
    title: string;
    description: string | null;
    instructions: Record<string, unknown>;
    settings: Record<string, unknown>;
    sourceCreatedAt: string;
    examCode: string;
    examName: string;
    examVersionName: string;
    sections: Array<{ id: string; sectionKey: string; name: string; sortOrder: number }>;
  };
  language: {
    id: string;
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    scriptCode: string | null;
    isActive: boolean;
  };
  target: null | {
    id: string;
    testVersionId: string;
    languageId: string;
    title: string;
    description: string;
    instructions: Record<string, unknown>;
    status: Exclude<TranslationStatus, 'missing'>;
    translatorUserId: string | null;
    translatorName: string | null;
    translatorEmail: string | null;
    reviewerUserId: string | null;
    reviewerName: string | null;
    reviewerEmail: string | null;
    submittedAt: string | null;
    reviewedAt: string | null;
    qualitySnapshot: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
    sections: Array<{ testSectionId: string; sectionKey: string; name: string; sortOrder: number }>;
  };
  readiness: {
    ready: boolean;
    languageCodes: string[];
    languages: Array<{
      languageCode: string;
      sourceLanguage: boolean;
      allowedForExam: boolean;
      metadataStatus: string;
      sectionCount: number;
      translatedSectionCount: number;
      questionCount: number;
      approvedQuestionCount: number;
      complete: boolean;
    }>;
    issues: Array<{ code: string; message: string; languageCode?: string; questionVersionId?: string }>;
  };
  history: TranslationHistoryEvent[];
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string; details?: unknown } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Translation operation failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Translation service returned an empty response.');
  return body;
}

export function getTranslationOverview() {
  return request<TranslationOverview>('/admin/translations/overview');
}

export function getQuestionTranslation(questionVersionId: string, languageCode: string) {
  return request<QuestionTranslationDetail>(
    `/admin/translations/questions/${encodeURIComponent(questionVersionId)}/languages/${encodeURIComponent(languageCode)}`,
  );
}

export function saveQuestionTranslation(input: {
  questionVersionId: string;
  languageCode: string;
  stem: string;
  explanation: string;
  options: TranslationOption[];
  reason: string;
}) {
  return request<{ translationId: string; detail: QuestionTranslationDetail }>(
    `/admin/translations/questions/${encodeURIComponent(input.questionVersionId)}/languages/${encodeURIComponent(input.languageCode)}`,
    { method: 'PUT', body: JSON.stringify(input) },
  );
}

export function assignQuestionTranslation(input: {
  translationId: string;
  translatorUserId: string | null;
  reviewerUserId: string | null;
  reason: string;
}) {
  return request<{ ok: true; translationId: string }>(
    `/admin/translations/translations/${encodeURIComponent(input.translationId)}/assignment`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function transitionQuestionTranslation(input: {
  translationId: string;
  status: Exclude<TranslationStatus, 'missing'>;
  reason: string;
}) {
  return request<{ translationId: string; status: string; quality: TranslationQualityResult; detail: QuestionTranslationDetail }>(
    `/admin/translations/translations/${encodeURIComponent(input.translationId)}/transition`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function addTranslationComment(input: {
  translationId: string;
  body: string;
  field?: string;
  parentCommentId?: string | null;
}) {
  return request<{ id: string; translationId: string }>(
    `/admin/translations/translations/${encodeURIComponent(input.translationId)}/comments`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function resolveTranslationComment(input: {
  translationId: string;
  commentId: string;
  resolved: boolean;
  reason: string;
}) {
  return request<{ translationId: string; commentId: string; resolved: boolean }>(
    `/admin/translations/translations/${encodeURIComponent(input.translationId)}/comments/${encodeURIComponent(input.commentId)}/resolution`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function getTestTranslation(testVersionId: string, languageCode: string) {
  return request<TestTranslationDetail>(
    `/admin/translations/tests/${encodeURIComponent(testVersionId)}/languages/${encodeURIComponent(languageCode)}`,
  );
}

export function saveTestTranslation(input: {
  testVersionId: string;
  languageCode: string;
  title: string;
  description: string;
  instructions: Record<string, unknown>;
  sections: Array<{ testSectionId: string; name: string }>;
  reason: string;
}) {
  return request<{ translationId: string; detail?: TestTranslationDetail }>(
    `/admin/translations/tests/${encodeURIComponent(input.testVersionId)}/languages/${encodeURIComponent(input.languageCode)}`,
    { method: 'PUT', body: JSON.stringify(input) },
  );
}

export function assignTestTranslation(input: {
  translationId: string;
  translatorUserId: string | null;
  reviewerUserId: string | null;
  reason: string;
}) {
  return request<{ ok: true; translationId: string }>(
    `/admin/translations/test-translations/${encodeURIComponent(input.translationId)}/assignment`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function transitionTestTranslation(input: {
  translationId: string;
  status: Exclude<TranslationStatus, 'missing'>;
  reason: string;
}) {
  return request<{ translationId: string; status: string; readiness: TestTranslationDetail['readiness']; detail: TestTranslationDetail }>(
    `/admin/translations/test-translations/${encodeURIComponent(input.translationId)}/transition`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function createTranslationTerm(input: {
  languageCode: string;
  sourceText: string;
  preferredText: string;
  forbiddenVariants: string[];
  contextNote: string;
  scopeTaxonomyNodeId: string | null;
  reason: string;
}) {
  return request<{ term: TranslationTerm }>('/admin/translations/terms', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTranslationTerm(input: {
  termId: string;
  sourceText: string;
  preferredText: string;
  forbiddenVariants: string[];
  contextNote: string;
  scopeTaxonomyNodeId: string | null;
  isActive: boolean;
  reason: string;
}) {
  return request<{ ok: true; termId: string }>(`/admin/translations/terms/${encodeURIComponent(input.termId)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function createLanguage(input: {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  scriptCode: string | null;
  fallbackLanguageId: string | null;
  isActive: boolean;
  reason: string;
}) {
  return request<{ language: LanguageSummary }>('/admin/translations/languages', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateLanguage(input: {
  languageId: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  scriptCode: string | null;
  fallbackLanguageId: string | null;
  isActive: boolean;
  reason: string;
}) {
  return request<{ ok: true; languageId: string }>(
    `/admin/translations/languages/${encodeURIComponent(input.languageId)}`,
    { method: 'PATCH', body: JSON.stringify(input) },
  );
}

export function updateExamVersionLanguages(input: {
  examVersionId: string;
  languages: Array<{ languageId: string; isPrimary: boolean }>;
  reason: string;
}) {
  return request<{ ok: true; examVersionId: string; languages: Array<{ languageId: string; isPrimary: boolean }> }>(
    `/admin/translations/exam-versions/${encodeURIComponent(input.examVersionId)}/languages`,
    { method: 'PUT', body: JSON.stringify(input) },
  );
}
