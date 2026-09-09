export const QUANT_V4_PYQ_FREQUENCY_EVIDENCE_AUTHORITY =
  "QUANT-V4-PYQ-FREQUENCY-EVIDENCE-P2" as const;

export type QuantV4PyqExamId =
  | "SSC_CGL_TIER_I"
  | "SSC_CGL_TIER_II"
  | "SSC_CHSL"
  | "PSSSB"
  | "PPSC"
  | "PUNJAB_POLICE"
  | "IBPS_PO_PRELIMS"
  | "IBPS_PO_MAINS"
  | "IBPS_CLERK"
  | "SBI_PO"
  | "IBPS_RRB_BANKING";

export type QuantV4PyqEvidenceKind =
  | "OFFICIAL_PAPER"
  | "DIRECT_PYQ"
  | "VERIFIED_PYQ_COLLECTION"
  | "BOOK_EXERCISE"
  | "PRACTICE_TAXONOMY"
  | "INTERNAL_DESIGN_FIXTURE";

export type QuantV4PyqWeightingStatus =
  | "NO_COUNTABLE_EVIDENCE"
  | "INSUFFICIENT_EMPIRICAL_EVIDENCE"
  | "EMPIRICAL_WEIGHT_CANDIDATE";

export interface QuantV4PyqObservation {
  readonly observationId: string;
  readonly examId: QuantV4PyqExamId;
  readonly evidenceKind: QuantV4PyqEvidenceKind;
  readonly sourceRef: string;
  readonly sourceLabel: string;
  readonly heldDate?: string;
  readonly shift?: string;
  readonly paperId?: string;
  readonly questionRef?: string;
  readonly packageId?: string;
  readonly topic: string;
  readonly subtopic: string;
  readonly representation: string;
  readonly language?: "en" | "hi" | "pa" | "mixed";
  readonly notes?: string;
}

export interface QuantV4PyqEvidencePolicy {
  readonly minDistinctPapers: number;
  readonly minCountableQuestions: number;
  readonly minTopicCoverage: number;
  readonly requireDatedPaperIdentity: boolean;
}

export interface QuantV4PyqFrequencyBucket {
  readonly key: string;
  readonly count: number;
  readonly share: number;
}

export interface QuantV4PyqFrequencyProfile {
  readonly authority: typeof QUANT_V4_PYQ_FREQUENCY_EVIDENCE_AUTHORITY;
  readonly examId: QuantV4PyqExamId;
  readonly status: QuantV4PyqWeightingStatus;
  readonly countableQuestionCount: number;
  readonly supportingNonCountableEvidenceCount: number;
  readonly distinctPaperCount: number;
  readonly topicCoverageCount: number;
  readonly blockers: readonly string[];
  readonly topicWeights: readonly QuantV4PyqFrequencyBucket[];
  readonly subtopicWeights: readonly QuantV4PyqFrequencyBucket[];
  readonly representationWeights: readonly QuantV4PyqFrequencyBucket[];
  readonly sourceObservations: readonly QuantV4PyqObservation[];
}

const COUNTABLE_KINDS: ReadonlySet<QuantV4PyqEvidenceKind> = new Set([
  "OFFICIAL_PAPER",
  "DIRECT_PYQ",
  "VERIFIED_PYQ_COLLECTION",
]);

export function isCountablePyqEvidenceKind(kind: QuantV4PyqEvidenceKind): boolean {
  return COUNTABLE_KINDS.has(kind);
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizedKey(value: string): string {
  return clean(value).toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function assertIsoDate(value: string, observationId: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    throw new Error(`${observationId}: heldDate must use YYYY-MM-DD.`);
  }
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${observationId}: heldDate is not a valid calendar date.`);
  }
}

function assertPolicy(policy: QuantV4PyqEvidencePolicy): void {
  for (const [name, value] of [
    ["minDistinctPapers", policy.minDistinctPapers],
    ["minCountableQuestions", policy.minCountableQuestions],
    ["minTopicCoverage", policy.minTopicCoverage],
  ] as const) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`PYQ evidence policy ${name} must be a non-negative integer.`);
    }
  }
}

export function validatePyqObservation(observation: QuantV4PyqObservation): void {
  for (const [field, value] of [
    ["observationId", observation.observationId],
    ["sourceRef", observation.sourceRef],
    ["sourceLabel", observation.sourceLabel],
    ["topic", observation.topic],
    ["subtopic", observation.subtopic],
    ["representation", observation.representation],
  ] as const) {
    if (!clean(value)) throw new Error(`${observation.observationId || "PYQ observation"}: ${field} is required.`);
  }

  if (observation.heldDate) assertIsoDate(observation.heldDate, observation.observationId);

  if (isCountablePyqEvidenceKind(observation.evidenceKind)) {
    if (!clean(observation.paperId)) {
      throw new Error(`${observation.observationId}: countable PYQ evidence requires paperId.`);
    }
    if (!clean(observation.questionRef)) {
      throw new Error(`${observation.observationId}: countable PYQ evidence requires questionRef.`);
    }
  }
}

function observationIdentity(observation: QuantV4PyqObservation): string {
  return [
    observation.examId,
    clean(observation.paperId).toUpperCase(),
    clean(observation.questionRef).toUpperCase(),
  ].join("::");
}

export function validatePyqObservationSet(observations: readonly QuantV4PyqObservation[]): void {
  const ids = new Set<string>();
  const questionIdentities = new Set<string>();

  for (const observation of observations) {
    validatePyqObservation(observation);
    if (ids.has(observation.observationId)) {
      throw new Error(`Duplicate PYQ observation id ${observation.observationId}.`);
    }
    ids.add(observation.observationId);

    if (isCountablePyqEvidenceKind(observation.evidenceKind)) {
      const identity = observationIdentity(observation);
      if (questionIdentities.has(identity)) {
        throw new Error(`Duplicate countable PYQ question identity ${identity}.`);
      }
      questionIdentities.add(identity);
    }
  }
}

function weights(
  items: readonly QuantV4PyqObservation[],
  select: (item: QuantV4PyqObservation) => string,
): QuantV4PyqFrequencyBucket[] {
  if (!items.length) return [];
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = normalizedKey(select(item));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => Object.freeze({ key, count, share: count / items.length }))
    .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));
}

function paperIdentity(observation: QuantV4PyqObservation): string {
  return [
    observation.examId,
    clean(observation.paperId).toUpperCase(),
    observation.heldDate ?? "",
    clean(observation.shift).toUpperCase(),
  ].join("::");
}

export function buildQuantV4PyqFrequencyProfile(input: {
  examId: QuantV4PyqExamId;
  observations: readonly QuantV4PyqObservation[];
  policy: QuantV4PyqEvidencePolicy;
}): QuantV4PyqFrequencyProfile {
  assertPolicy(input.policy);
  validatePyqObservationSet(input.observations);

  const relevant = input.observations.filter((observation) => observation.examId === input.examId);
  const countable = relevant.filter((observation) => isCountablePyqEvidenceKind(observation.evidenceKind));
  const nonCountable = relevant.filter((observation) => !isCountablePyqEvidenceKind(observation.evidenceKind));
  const distinctPapers = new Set(countable.map(paperIdentity));
  const distinctTopics = new Set(countable.map((observation) => normalizedKey(observation.topic)));

  const blockers: string[] = [];
  if (!countable.length) blockers.push("NO_COUNTABLE_PYQ_EVIDENCE");
  if (countable.length < input.policy.minCountableQuestions) blockers.push("COUNTABLE_QUESTION_SAMPLE_BELOW_POLICY");
  if (distinctPapers.size < input.policy.minDistinctPapers) blockers.push("DISTINCT_PAPER_SAMPLE_BELOW_POLICY");
  if (distinctTopics.size < input.policy.minTopicCoverage) blockers.push("TOPIC_COVERAGE_BELOW_POLICY");
  if (input.policy.requireDatedPaperIdentity && countable.some((observation) => !observation.heldDate)) {
    blockers.push("DATED_PAPER_IDENTITY_INCOMPLETE");
  }

  const status: QuantV4PyqWeightingStatus = !countable.length
    ? "NO_COUNTABLE_EVIDENCE"
    : blockers.length
      ? "INSUFFICIENT_EMPIRICAL_EVIDENCE"
      : "EMPIRICAL_WEIGHT_CANDIDATE";

  return Object.freeze({
    authority: QUANT_V4_PYQ_FREQUENCY_EVIDENCE_AUTHORITY,
    examId: input.examId,
    status,
    countableQuestionCount: countable.length,
    supportingNonCountableEvidenceCount: nonCountable.length,
    distinctPaperCount: distinctPapers.size,
    topicCoverageCount: distinctTopics.size,
    blockers: Object.freeze([...new Set(blockers)]),
    topicWeights: Object.freeze(weights(countable, (observation) => observation.topic)),
    subtopicWeights: Object.freeze(weights(countable, (observation) => `${observation.topic} / ${observation.subtopic}`)),
    representationWeights: Object.freeze(weights(countable, (observation) => observation.representation)),
    sourceObservations: Object.freeze([...relevant]),
  });
}

export function assertFrequencyShares(profile: QuantV4PyqFrequencyProfile): void {
  for (const [label, buckets] of [
    ["topic", profile.topicWeights],
    ["subtopic", profile.subtopicWeights],
    ["representation", profile.representationWeights],
  ] as const) {
    if (!buckets.length) continue;
    const sum = buckets.reduce((total, bucket) => total + bucket.share, 0);
    if (Math.abs(sum - 1) > 1e-9) {
      throw new Error(`${profile.examId}: ${label} frequency shares sum to ${sum}, not 1.`);
    }
  }
}

export function canReplaceProvisionalSimulationWeights(profile: QuantV4PyqFrequencyProfile): boolean {
  return profile.status === "EMPIRICAL_WEIGHT_CANDIDATE" && profile.blockers.length === 0;
}
