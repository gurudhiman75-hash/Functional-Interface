import { getFirebaseAuth } from '@/integrations/firebase';

export type StudentStatus = 'active' | 'invited' | 'suspended' | 'disabled';
export type StudentAccountAction = 'suspend' | 'reactivate' | 'revoke-sessions';

export interface StudentSummary {
  id: string;
  email: string;
  phone: string | null;
  displayName: string;
  status: StudentStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  registrationCode: string;
  preferredLanguageCode: string;
  attemptCount: number;
  evaluatedAttemptCount: number;
  latestAttemptAt: string | null;
  averageScore: number | null;
  activeSessionCount: number;
}

export interface StudentDirectoryStats {
  total: number;
  active: number;
  invited: number;
  suspended: number;
  disabled: number;
  withAttempts: number;
  activeSessions: number;
}

export interface StudentDirectoryResponse {
  students: StudentSummary[];
  page: number;
  pageSize: number;
  total: number;
  stats: StudentDirectoryStats;
  facets: {
    statuses: StudentStatus[];
    languages: Array<{ code: string; count: number }>;
  };
  generatedAt: string;
}

export interface StudentAttempt {
  id: string;
  attemptNumber: number;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  evaluatedAt: string | null;
  timeSpentSeconds: number;
  rawScore: number | null;
  finalScore: number | null;
  correctCount: number | null;
  incorrectCount: number | null;
  unattemptedCount: number | null;
  testPublicationId: string | null;
  testId: string | null;
  testPublicCode: string | null;
  testTitle: string | null;
}

export interface StudentSession {
  id: string;
  deviceName: string | null;
  maskedIpAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  state: 'active' | 'expired' | 'revoked';
}

export interface StudentTimelineEvent {
  id: string;
  occurredAt: string;
  type: string;
  title: string;
  detail: string | null;
}

export interface StudentProfile extends StudentSummary {
  profileCreatedAt: string;
  profileUpdatedAt: string;
  authProviders: string[];
}

export interface StudentProfileResponse {
  student: StudentProfile;
  attempts: StudentAttempt[];
  sessions: StudentSession[];
  timeline: StudentTimelineEvent[];
  generatedAt: string;
}

export interface StudentDirectoryFilters {
  search?: string;
  status?: StudentStatus | 'all';
  language?: string | 'all';
  page?: number;
  pageSize?: number;
}

export interface StudentAccountOperation {
  action: StudentAccountAction;
  changed: boolean;
  previousStatus: StudentStatus;
  status: StudentStatus;
  sessionsRevoked: number;
  auditEventId: string;
  occurredAt: string;
}

export interface StudentAccountOperationResponse {
  operation: StudentAccountOperation;
  generatedAt: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function token() {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  return user.getIdToken();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${await token()}`);
  if (init?.body) headers.set('Content-Type', 'application/json');

  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers,
  });
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Student Administration request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status });
    throw error;
  }
  if (!body) throw new Error('Student Administration API returned an empty response.');
  return body;
}

function query(filters: StudentDirectoryFilters) {
  const params = new URLSearchParams();
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.language && filters.language !== 'all') params.set('language', filters.language);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

export function getStudentDirectory(filters: StudentDirectoryFilters = {}) {
  return request<StudentDirectoryResponse>(`/admin/students${query(filters)}`);
}

export function getStudentProfile(studentId: string) {
  return request<StudentProfileResponse>(`/admin/students/${encodeURIComponent(studentId)}`);
}

export function runStudentAccountOperation(
  studentId: string,
  action: StudentAccountAction,
  input: { reason: string; expectedStatus?: StudentStatus },
) {
  return request<StudentAccountOperationResponse>(
    `/admin/students/${encodeURIComponent(studentId)}/actions/${encodeURIComponent(action)}`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  );
}
