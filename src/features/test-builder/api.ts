import { getFirebaseAuth } from '@/integrations/firebase';

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
  | 'archive'
  | 'restore-draft';

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
    const error = new Error(body?.error || `Test Builder request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Test Builder returned an empty response.');
  return body;
}

export function getTestCatalog() {
  return request<{ examVersions: TestCatalogExamVersion[]; generatedAt: string }>('/admin/tests/catalog');
}

export function getLiveTests() {
  return request<{ tests: LiveTestSummary[]; generatedAt: string }>('/admin/tests');
}

export function getLiveTest(testId: string) {
  return request<LiveTestDetail>(`/admin/tests/${encodeURIComponent(testId)}`);
}

export function createLiveTest(input: TestDraftInput) {
  return request<LiveTestDetail>('/admin/tests', { method: 'POST', body: JSON.stringify(input) });
}

export function saveLiveTestDraft(testId: string, input: TestDraftInput) {
  return request<LiveTestDetail>(`/admin/tests/${encodeURIComponent(testId)}/draft`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function transitionLiveTest(
  testId: string,
  action: TestLifecycleAction,
  input: {
    expectedCurrentDraftVersionId: string;
    reason?: string;
    scheduledAt?: string;
    closesAt?: string;
  },
) {
  return request<LiveTestDetail>(`/admin/tests/${encodeURIComponent(testId)}/actions/${action}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function autoAssembleTest(input: {
  examVersionId: string;
  questionCount: number;
  seed?: string;
  difficulties?: string[];
}) {
  return request<{
    questions: Array<{ id: string; publicCode: string; questionVersionId: string; difficulty: string; stem: string }>;
    requestedCount: number;
    selectedCount: number;
    shortages: string[];
    generatedAt: string;
  }>('/admin/tests/auto-assemble', { method: 'POST', body: JSON.stringify(input) });
}
