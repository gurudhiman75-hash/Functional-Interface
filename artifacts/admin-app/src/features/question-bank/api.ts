import { getFirebaseAuth } from '@/integrations/firebase';

export interface LiveQuestionOption {
  id: string;
  key: string;
  text: string;
  sortOrder: number;
  isCorrect: boolean;
}

export interface LiveApprovedQuestion {
  id: string;
  publicCode: string;
  status: string;
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

  const body = await response.json().catch(() => null) as ({ error?: string } & T) | null;
  if (!response.ok) throw new Error(body?.error || `Question Bank request failed (${response.status}).`);
  if (!body) throw new Error('Question Bank returned an empty response.');
  return body;
}

export function getLiveApprovedQuestions() {
  return request<{ questions: LiveApprovedQuestion[]; generatedAt: string }>('/admin/questions');
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
