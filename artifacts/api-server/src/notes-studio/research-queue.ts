export const MAX_RESEARCH_QUEUE_JOBS = 30;

export type ResearchQueueStatus =
  | 'ready_for_evidence'
  | 'proposal_ready'
  | 'partial_proposal'
  | 'manual_research_required';

export function researchQueueLimit(value: unknown): number {
  const parsed = Number(value ?? 20);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(1, Math.min(MAX_RESEARCH_QUEUE_JOBS, Math.trunc(parsed)));
}

export function classifyResearchQueueItem(input: {
  policyReady: boolean;
  proposedItems: number;
  unresolvedRequirements: number;
}): ResearchQueueStatus {
  if (input.policyReady) return 'ready_for_evidence';
  if (input.proposedItems > 0 && input.unresolvedRequirements === 0) return 'proposal_ready';
  if (input.proposedItems > 0) return 'partial_proposal';
  return 'manual_research_required';
}

export function researchQueueRank(status: ResearchQueueStatus): number {
  switch (status) {
    case 'proposal_ready': return 10;
    case 'partial_proposal': return 20;
    case 'manual_research_required': return 30;
    case 'ready_for_evidence': return 40;
  }
}
