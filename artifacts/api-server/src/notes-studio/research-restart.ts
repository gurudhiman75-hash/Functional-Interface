export const NOTES_RESEARCH_RESTART_STATES = [
  'evidence_ready',
  'outline_ready',
  'drafting',
  'qa_required',
  'review_ready',
] as const;

export type NotesResearchRestartState = typeof NOTES_RESEARCH_RESTART_STATES[number];

export function researchRestartAllowed(state: unknown): state is NotesResearchRestartState {
  return (NOTES_RESEARCH_RESTART_STATES as readonly string[]).includes(String(state ?? ''));
}

export function researchRestartTargetState(generationReadySourceCount: number): 'brief' | 'sources_ready' {
  return Number.isFinite(generationReadySourceCount) && generationReadySourceCount > 0
    ? 'sources_ready'
    : 'brief';
}

export function normalizeResearchRestartReason(value: unknown): string {
  return typeof value === 'string' ? value.trim().slice(0, 1000) : '';
}

export type ResearchRestartDiscardCounts = {
  evidenceBlocks: number;
  claims: number;
  coverageMappings: number;
  sections: number;
  qualityRuns: number;
  generationEvents: number;
};

export function researchRestartDiscardTotal(counts: ResearchRestartDiscardCounts): number {
  return Object.values(counts).reduce((sum, value) => sum + Math.max(0, Math.trunc(Number(value) || 0)), 0);
}
