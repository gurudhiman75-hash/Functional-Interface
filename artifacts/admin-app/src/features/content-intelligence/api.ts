import { getFirebaseAuth } from '@/integrations/firebase';

export type DuplicateMatchKind = 'exact' | 'template' | 'semantic';
export type DuplicateDecision = 'unresolved' | 'duplicate' | 'intentional_variant' | 'false_positive';

export interface ContentIntelligenceChapterSummary {
  id: string;
  code: string;
  nodeType: string;
  name: string;
  description: string | null;
  questionCount: number;
  approvedQuestionCount: number;
  targetCoverage: number | null;
  freezeState: string;
  freezeChangedAt: string | null;
  freezeChangedByName: string | null;
}

export interface ContentIntelligenceQuestion {
  id: string;
  publicCode: string;
  status: string;
  versionId: string;
  stem: string;
  explanation: string;
  questionType: string;
  difficulty: string;
  options: Array<{ text: string; isCorrect?: boolean }>;
  updatedAt: string;
  testUsageCount: number;
}

export interface DuplicateCandidate {
  pairKey: string;
  left: ContentIntelligenceQuestion;
  right: ContentIntelligenceQuestion;
  kind: DuplicateMatchKind;
  severity: 'critical' | 'warning';
  score: number;
  signals: string[];
  decision: {
    decision: DuplicateDecision;
    canonicalQuestionId: string | null;
    reason: string | null;
    decidedAt: string | null;
    decidedByName: string | null;
  };
}

export interface ChapterReadinessIssue {
  code: string;
  message: string;
  count?: number;
}

export interface ChapterIntelligenceReport {
  chapter: {
    id: string;
    code: string;
    nodeType: string;
    name: string;
    description: string | null;
  };
  metrics: {
    questionCount: number;
    approvedQuestionCount: number;
    targetCoverage: number | null;
    unresolvedPlaceholderCount: number;
    unresolvedCriticalDuplicateCount: number;
    unresolvedWarningDuplicateCount: number;
    openCommentCount: number;
    testUsageCount: number;
    duplicateCandidateCount: number;
    scanTruncated: boolean;
  };
  readiness: {
    ready: boolean;
    blockers: ChapterReadinessIssue[];
    warnings: ChapterReadinessIssue[];
  };
  questions: ContentIntelligenceQuestion[];
  duplicateCandidates: DuplicateCandidate[];
  languageReadiness: {
    canonicalLanguage: string;
    english: 'ready' | 'blocked';
    hindi: 'not_connected';
    punjabi: 'not_connected';
    note: string;
  };
  freeze: {
    state: string;
    recordedState: string;
    changedAt: string | null;
    changedByName: string | null;
    reason: string | null;
    reportHash: string | null;
  };
  reportHash: string;
  generatedAt: string;
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

async function authorizedFetch(path: string, init?: RequestInit): Promise<Response> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  return fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await user.getIdToken()}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await authorizedFetch(path, init);
  const body = await response.json().catch(() => null) as ({ error?: string; code?: string; details?: unknown } & T) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Content intelligence request failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status, details: body?.details });
    throw error;
  }
  if (!body) throw new Error('Content intelligence returned an empty response.');
  return body;
}

export function getContentIntelligenceChapters() {
  return request<{ chapters: ContentIntelligenceChapterSummary[]; generatedAt: string }>(
    '/admin/content-review/intelligence/chapters',
  );
}

export function getChapterIntelligenceReport(chapterNodeId: string) {
  return request<ChapterIntelligenceReport>(
    `/admin/content-review/intelligence/chapters/${encodeURIComponent(chapterNodeId)}`,
  );
}

export function recordDuplicateDecision(input: {
  chapterNodeId: string;
  leftQuestionId: string;
  rightQuestionId: string;
  decision: Exclude<DuplicateDecision, 'unresolved'>;
  canonicalQuestionId: string | null;
  reason: string;
}) {
  return request<ChapterIntelligenceReport>('/admin/content-review/intelligence/duplicate-decisions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function changeChapterFreeze(input: {
  chapterNodeId: string;
  action: 'freeze' | 'unfreeze' | 'reopen';
  reason: string;
}) {
  return request<ChapterIntelligenceReport>(
    `/admin/content-review/intelligence/chapters/${encodeURIComponent(input.chapterNodeId)}/freeze`,
    { method: 'POST', body: JSON.stringify({ action: input.action, reason: input.reason }) },
  );
}

export async function downloadChapterIntelligenceReport(chapterNodeId: string): Promise<void> {
  const response = await authorizedFetch(
    `/admin/content-review/intelligence/chapters/${encodeURIComponent(chapterNodeId)}/report.json`,
  );
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `Unable to download report (${response.status}).`);
  }
  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition') || '';
  const filename = disposition.match(/filename="([^"]+)"/)?.[1] || 'chapter-freeze-readiness.json';
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
