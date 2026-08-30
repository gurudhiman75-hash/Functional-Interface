export const NOTE_PLANNING_UNIT_TYPES = ['topic', 'subtopic', 'chapter'] as const;
export type NotePlanningUnitType = (typeof NOTE_PLANNING_UNIT_TYPES)[number];

export const NOTE_PLANNING_DEPTHS = ['quick_revision', 'standard', 'comprehensive'] as const;
export type NotePlanningDepth = (typeof NOTE_PLANNING_DEPTHS)[number];

export const NOTE_PLANNING_LEARNER_LEVELS = ['foundation', 'standard', 'advanced'] as const;
export type NotePlanningLearnerLevel = (typeof NOTE_PLANNING_LEARNER_LEVELS)[number];

export const MAX_NOTE_PLAN_ITEMS = 250;
export const MAX_NOTE_JOB_CREATION_BATCH = 100;

export type TaxonomyPlanningCandidate = {
  id: string;
  code: string;
  nodeType: string;
  name: string;
  description: string | null;
  depth: number;
  path: string[];
  targetCoverage: number;
};

export function normalizePlanningUnitTypes(value: unknown): NotePlanningUnitType[] {
  if (!Array.isArray(value) || value.length === 0) return [...NOTE_PLANNING_UNIT_TYPES];
  const allowed = new Set<string>(NOTE_PLANNING_UNIT_TYPES);
  const normalized = [...new Set(value.map((item) => String(item).trim().toLowerCase()).filter((item) => allowed.has(item)))];
  return normalized.length > 0 ? normalized as NotePlanningUnitType[] : [...NOTE_PLANNING_UNIT_TYPES];
}

export function selectPlanningCandidates(
  candidates: TaxonomyPlanningCandidate[],
  options: { leafOnly: boolean; maxItems?: number },
): TaxonomyPlanningCandidate[] {
  const unique = new Map<string, TaxonomyPlanningCandidate>();
  for (const candidate of candidates) {
    if (!unique.has(candidate.id)) unique.set(candidate.id, candidate);
  }
  const values = [...unique.values()];
  const selected = options.leafOnly
    ? values.filter((candidate) => !values.some((other) => other.id !== candidate.id && other.depth > candidate.depth && other.path.includes(candidate.id)))
    : values;
  return selected
    .sort((left, right) => left.depth - right.depth || left.name.localeCompare(right.name) || left.code.localeCompare(right.code))
    .slice(0, options.maxItems ?? MAX_NOTE_PLAN_ITEMS);
}

export function boundedPlanningJobLimit(value: unknown): number {
  const parsed = Number(value ?? 50);
  if (!Number.isFinite(parsed)) return 50;
  return Math.max(1, Math.min(MAX_NOTE_JOB_CREATION_BATCH, Math.trunc(parsed)));
}

export function buildPlannedJobBrief(input: {
  taxonomyNodeId: string;
  taxonomyCode: string;
  taxonomyName: string;
  targetCoverage: number;
  batchId: string;
  itemId: string;
  batchTitle: string;
  examId: string;
  depth: NotePlanningDepth;
  learnerLevel: NotePlanningLearnerLevel;
}) {
  return {
    topicLabel: input.taxonomyName,
    depth: input.depth,
    learnerLevel: input.learnerLevel,
    syllabusEmphasis: `Canonical taxonomy ${input.taxonomyCode}: ${input.taxonomyName}. Target coverage ${input.targetCoverage}. Planned through Notes Studio batch ${input.batchTitle}.`,
    examIds: [input.examId],
    taxonomyNodeId: input.taxonomyNodeId,
    taxonomyCode: input.taxonomyCode,
    planningBatchId: input.batchId,
    planningItemId: input.itemId,
    authoringPolicyVersion: 'notes-v1',
  } as const;
}
