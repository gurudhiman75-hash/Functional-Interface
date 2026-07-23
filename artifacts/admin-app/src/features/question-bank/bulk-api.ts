import { getFirebaseAuth } from '@/integrations/firebase';

export type QuestionBulkAction =
  | 'assign-taxonomy'
  | 'submit-review'
  | 'approve'
  | 'publish'
  | 'archive';

export interface QuestionBulkItem {
  questionId: string;
  expectedLockVersion: number;
}

export interface QuestionBulkResult {
  questionId: string;
  publicCode?: string;
  ok: boolean;
  code?: string;
  message?: string;
  lockVersion?: number;
}

export interface QuestionBulkWorkflowResponse {
  action: QuestionBulkAction;
  attempted: number;
  succeeded: number;
  failed: number;
  results: QuestionBulkResult[];
  generatedAt: string;
}

export interface QuestionBulkWorkflowInput {
  action: QuestionBulkAction;
  items: QuestionBulkItem[];
  reason?: string;
  examVersionId?: string;
  primaryTaxonomyNodeId?: string;
  taxonomyNodeIds?: string[];
}

const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');

export async function runQuestionBulkWorkflow(
  input: QuestionBulkWorkflowInput,
): Promise<QuestionBulkWorkflowResponse> {
  const user = getFirebaseAuth()?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');

  const response = await fetch(`${apiBase}/admin/questions/bulk/workflow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await user.getIdToken()}`,
    },
    body: JSON.stringify(input),
  });
  const body = await response.json().catch(() => null) as (
    QuestionBulkWorkflowResponse & { error?: string; code?: string }
  ) | null;
  if (!response.ok) {
    const error = new Error(body?.error || `Bulk question update failed (${response.status}).`);
    Object.assign(error, { code: body?.code, status: response.status });
    throw error;
  }
  if (!body) throw new Error('Bulk question update returned an empty response.');
  return body;
}
