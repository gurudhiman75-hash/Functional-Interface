import { adminRequest } from '@/lib/admin-request';

export type LiveTestStatus =
  | 'draft'
  | 'content_ready'
  | 'under_qa'
  | 'needs_fix'
  | 'qa_approved'
  | 'scheduled'
  | 'live'
  | 'completed'
  | 'archived';

export interface TestCatalogLanguage {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  isPrimary: boolean;
}

export interface TestCatalogExamVersion {
  id: string;
  versionNumber: number;
  versionName: string;
  examId: string;
  examCode: string;
  examName: string;
  familyId: string;
  familyCode: string;
  familyName: string;
  languages: TestCatalogLanguage[];
}

export interface LiveTestSummary {
  id: string;
  publicCode: string;
  status: LiveTestStatus;
  examVersionId: string;
  currentDraftVersionId: string | null;
  publishedVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  examCode: string;
  examName: string;
  examFamilyName: string;
  versionNumber: number | null;
  title: string | null;
  description: string | null;
  durationSeconds: number | null;
  totalMarks: number | null;
  settings: Record<string, unknown> | null;
  sectionCount: number;
  questionCount: number;
  scheduledAt: string | null;
  publishedAt: string | null;
}

export interface TestQuestionOption {
  id: string;
  key: string;
  text: string;
  sortOrder: number;
  isCorrect: boolean;
}

export interface LiveTestQuestion {
  testSectionId: string;
  questionVersionId: string;
  position: number;
  marks: number;
  negativeMarks: number;
  settings: Record<string, unknown>;
  questionId: string;
  publicCode: string;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string;
  answerModel: Record<string, unknown>;
  options: TestQuestionOption[];
}

export interface LiveTestSection {
  id: string;
  name: string;
  sectionKey: string;
  sortOrder: number;
  durationSeconds: number | null;
  settings: Record<string, unknown>;
  questions: LiveTestQuestion[];
}

export interface LiveTestVersion {
  id: string;
  versionNumber: number;
  title: string;
  description: string | null;
  durationSeconds: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  createdBy: string | null;
  createdAt: string;
  sectionCount: number;
  questionCount: number;
}

export interface LiveTestRecord {
  id: string;
  publicCode: string;
  status: LiveTestStatus;
  examVersionId: string;
  currentDraftVersionId: string | null;
  publishedVersionId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  examId: string;
  examCode: string;
  examName: string;
  examFamilyId: string;
  examFamilyCode: string;
  examFamilyName: string;
}

export interface TestPublication {
  id: string;
  testVersionId: string;
  publicationNumber: number;
  scheduledAt: string | null;
  publishedAt: string | null;
  closesAt: string | null;
  publishedBy: string | null;
  settingsSnapshot: Record<string, unknown>;
}

export interface TestAuditEvent {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  actionKey: string;
  entityVersionId: string | null;
  reason: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
}

export interface TestValidationIssue {
  code: string;
  message: string;
}

export interface LiveTestDetail {
  test: LiveTestRecord;
  versions: LiveTestVersion[];
  currentVersion: LiveTestVersion | null;
  sections: LiveTestSection[];
  publications: TestPublication[];
  auditEvents: TestAuditEvent[];
  validationIssues: TestValidationIssue[];
  generatedAt: string;
}

export interface TestDraftQuestionInput {
  questionVersionId: string;
  marks: number;
  negativeMarks: number;
  settings?: Record<string, unknown>;
}

export interface TestDraftSectionInput {
  clientKey: string;
  name: string;
  durationMinutes: number | null;
  settings?: Record<string, unknown>;
  questions: TestDraftQuestionInput[];
}

export interface TestDraftInput {
  expectedCurrentDraftVersionId: string | null;
  examVersionId: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  instructions: Record<string, unknown>;
  settings: Record<string, unknown>;
  changeReason: string;
  sections: TestDraftSectionInput[];
}

export type TestLifecycleAction =
  | 'submit-qa'
  | 'needs-fix'
  | 'approve'
  | 'schedule'
  | 'publish'
  | 'approve-publish'
  | 'approve-schedule'
  | 'archive'
  | 'restore-draft';

export function getTestCatalog() {
  return adminRequest<{ examVersions: TestCatalogExamVersion[]; generatedAt: string }>(
    '/admin/tests/catalog',
    undefined,
    { fallbackMessage: 'Unable to load the Test Builder catalog.' },
  );
}

export function getLiveTests() {
  return adminRequest<{ tests: LiveTestSummary[]; generatedAt: string }>(
    '/admin/tests',
    undefined,
    { fallbackMessage: 'Unable to load tests.' },
  );
}

export function getLiveTest(testId: string) {
  return adminRequest<LiveTestDetail>(
    `/admin/tests/${encodeURIComponent(testId)}`,
    undefined,
    { fallbackMessage: 'Unable to load the selected test.', affectedRecord: testId },
  );
}

export function createLiveTest(input: TestDraftInput) {
  return adminRequest<LiveTestDetail>(
    '/admin/tests',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to create the test draft.' },
  );
}

export function saveLiveTestDraft(testId: string, input: TestDraftInput) {
  return adminRequest<LiveTestDetail>(
    `/admin/tests/${encodeURIComponent(testId)}/draft`,
    { method: 'PUT', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to save the test draft.', affectedRecord: testId },
  );
}

export function transitionLiveTest(
  testId: string,
  action: TestLifecycleAction,
  input: {
    expectedCurrentDraftVersionId: string;
    reason?: string;
    scheduledAt?: string;
    closesAt?: string;
    acknowledgeActiveAttempts?: boolean;
  },
) {
  return adminRequest<LiveTestDetail>(
    `/admin/tests/${encodeURIComponent(testId)}/actions/${action}`,
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: `Unable to ${action.replace('-', ' ')} the test.`, affectedRecord: testId },
  );
}

export function autoAssembleTest(input: {
  examVersionId: string;
  questionCount: number;
  seed?: string;
  difficulties?: string[];
}) {
  return adminRequest<{
    questions: Array<{ id: string; publicCode: string; questionVersionId: string; difficulty: string; stem: string }>;
    requestedCount: number;
    selectedCount: number;
    shortages: string[];
    generatedAt: string;
  }>(
    '/admin/tests/auto-assemble',
    { method: 'POST', body: JSON.stringify(input) },
    { fallbackMessage: 'Unable to auto-assemble the test.' },
  );
}

export interface PickerQuestion {
  questionId: string;
  versionId: string;
  publicCode: string;
  status: string;
  draftOnly: boolean;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string | null;
  examVersionId: string | null;
  usedInTests: number;
  lastUsedAt: string | null;
  options: Array<{ id: string; key: string; text: string; sortOrder: number; isCorrect: boolean }>;
  taxonomy: Array<{ id: string; code: string; nodeType: string; name: string; isPrimary: boolean }>;
  languages: string[];
}

export interface QuestionPickerFilters {
  q?: string;
  difficulties?: string[];
  languages?: string[];
  examVersionId?: string;
  usage?: 'any' | 'unused';
  sort?: 'newest' | 'least_used';
  excludeVersionIds?: string[];
  limit?: number;
  offset?: number;
}

export function searchQuestionPicker(filters: QuestionPickerFilters) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.difficulties?.length) params.set('difficulties', filters.difficulties.join(','));
  if (filters.languages?.length) params.set('languages', filters.languages.join(','));
  if (filters.examVersionId) params.set('examVersionId', filters.examVersionId);
  if (filters.usage === 'unused') params.set('usage', 'unused');
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.excludeVersionIds?.length) params.set('excludeVersionIds', filters.excludeVersionIds.slice(0, 500).join(','));
  params.set('limit', String(filters.limit ?? 30));
  params.set('offset', String(filters.offset ?? 0));
  return adminRequest<{
    questions: PickerQuestion[]; total: number; limit: number; offset: number;
    bankTotal?: number | null;
    appliedFilters?: { search: string; difficulties: string[]; languages: string[]; examVersionId: string | null; usage: string; excludedCount: number };
  }>(
    `/admin/tests/question-picker?${params.toString()}`,
    {},
    { fallbackMessage: 'Unable to search questions.' },
  );
}

export interface QuestionReadinessInfo {
  versionId: string;
  difficulty: string;
  correctOptionKey: string | null;
  usedInTests: number;
  languages: string[];
}

export function getQuestionReadinessInfo(versionIds: string[], excludeTestId?: string) {
  const params = new URLSearchParams({ versionIds: versionIds.slice(0, 500).join(',') });
  if (excludeTestId) params.set('excludeTestId', excludeTestId);
  return adminRequest<{ questions: QuestionReadinessInfo[] }>(
    `/admin/tests/question-picker/info?${params.toString()}`,
    {},
    { fallbackMessage: 'Unable to load question details.' },
  );
}
