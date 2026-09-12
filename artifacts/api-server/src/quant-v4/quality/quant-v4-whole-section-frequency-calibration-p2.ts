import {
  isCountablePyqEvidenceKind,
  type QuantV4PyqExamId,
  type QuantV4PyqObservation,
} from "./quant-v4-pyq-frequency-evidence-p2";

export const QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY =
  "QUANT-V4-WHOLE-SECTION-FREQUENCY-CALIBRATION-P2" as const;

export type QuantV4WholeSectionEvidenceStatus =
  | "NO_COMPLETE_SECTION_EVIDENCE"
  | "SECTION_EVIDENCE_ACCUMULATING"
  | "SECTION_FREQUENCY_CANDIDATE";

export interface QuantV4CompleteSectionSpec {
  readonly sectionId: string;
  readonly examId: QuantV4PyqExamId;
  readonly paperId: string;
  readonly heldDate: string;
  readonly shift: string;
  readonly questionStart: number;
  readonly questionEnd: number;
  readonly expectedQuestionCount: number;
}

export interface QuantV4WholeSectionFrequencyPolicy {
  readonly minCompleteSections: number;
  readonly minDistinctYears: number;
  readonly minPackageCoverage: number;
  readonly requireDatedSectionIdentity: boolean;
  readonly productionPromotionAuthorized: boolean;
}

export interface QuantV4WholeSectionPackageWeight {
  readonly packageId: string;
  readonly questionCount: number;
  readonly questionShare: number;
  readonly meanQuestionsPerSection: number;
  readonly sectionPresenceCount: number;
  readonly sectionPresenceShare: number;
}

export interface QuantV4WholeSectionTopicWeight {
  readonly topic: string;
  readonly questionCount: number;
  readonly questionShare: number;
}

export interface QuantV4WholeSectionSnapshot {
  readonly sectionId: string;
  readonly paperId: string;
  readonly heldDate: string;
  readonly shift: string;
  readonly questionCount: number;
  readonly packageCount: number;
  readonly complete: boolean;
}

export interface QuantV4WholeSectionFrequencyProfile {
  readonly authority: typeof QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY;
  readonly examId: QuantV4PyqExamId;
  readonly evidenceStatus: QuantV4WholeSectionEvidenceStatus;
  readonly completeSectionCount: number;
  readonly completeQuestionCount: number;
  readonly totalCountableQuestionCount: number;
  readonly nonWholeSectionCountableQuestionCount: number;
  readonly undatedCountableQuestionCount: number;
  readonly distinctSectionYearCount: number;
  readonly packageCoverageCount: number;
  readonly blockers: readonly string[];
  readonly productionPromotionAuthorized: boolean;
  readonly sectionSnapshots: readonly QuantV4WholeSectionSnapshot[];
  readonly packageWeights: readonly QuantV4WholeSectionPackageWeight[];
  readonly topicWeights: readonly QuantV4WholeSectionTopicWeight[];
  readonly completeSectionObservations: readonly QuantV4PyqObservation[];
}

export const QUANT_V4_CGL_TIER_I_COMPLETE_SECTION_SPECS = Object.freeze([
  Object.freeze({
    sectionId: "SSC-CGL-T1-2024-09-09-S1-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: "SSC-CGL-2024-TIER-I-2024-09-09-S1",
    heldDate: "2024-09-09",
    shift: "Shift 1",
    questionStart: 51,
    questionEnd: 75,
    expectedQuestionCount: 25,
  }),
  Object.freeze({
    sectionId: "SSC-CGL-T1-2023-07-27-S2-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: "SSC-CGL-2023-TIER-I-2023-07-27-S2",
    heldDate: "2023-07-27",
    shift: "Shift 2",
    questionStart: 26,
    questionEnd: 50,
    expectedQuestionCount: 25,
  }),
  Object.freeze({
    sectionId: "SSC-CGL-T1-2023-07-26-S1-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: "SSC-CGL-2023-TIER-I-2023-07-26-S1",
    heldDate: "2023-07-26",
    shift: "Shift 1",
    questionStart: 51,
    questionEnd: 75,
    expectedQuestionCount: 25,
  }),
  Object.freeze({
    sectionId: "SSC-CGL-T1-2023-07-26-S2-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: "SSC-CGL-2023-TIER-I-2023-07-26-S2",
    heldDate: "2023-07-26",
    shift: "Shift 2",
    questionStart: 51,
    questionEnd: 75,
    expectedQuestionCount: 25,
  }),
  Object.freeze({
    sectionId: "SSC-CGL-T1-2023-07-26-S3-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: "SSC-CGL-2023-TIER-I-2023-07-26-S3",
    heldDate: "2023-07-26",
    shift: "Shift 3",
    questionStart: 51,
    questionEnd: 75,
    expectedQuestionCount: 25,
  }),
  Object.freeze({
    sectionId: "SSC-CGL-T1-2022-12-01-S1-QUANT",
    examId: "SSC_CGL_TIER_I",
    paperId: "SSC-CGL-2022-TIER-I-2022-12-01-S1",
    heldDate: "2022-12-01",
    shift: "Shift 1",
    questionStart: 51,
    questionEnd: 75,
    expectedQuestionCount: 25,
  }),
] satisfies readonly QuantV4CompleteSectionSpec[]);

// P2 audit policy only. It deliberately does not authorize production promotion.
// Eight complete sections means chapter/package weights are based on whole papers,
// not on isolated PYQs selected for chapter audits.
export const QUANT_V4_CGL_TIER_I_WHOLE_SECTION_P2_AUDIT_POLICY: QuantV4WholeSectionFrequencyPolicy = Object.freeze({
  minCompleteSections: 8,
  minDistinctYears: 3,
  minPackageCoverage: 10,
  requireDatedSectionIdentity: true,
  productionPromotionAuthorized: false,
});

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function questionNumber(questionRef: string | undefined): number {
  return Number(clean(questionRef).match(/Q(\d+)$/u)?.[1] ?? Number.NaN);
}

function expectedQuestionNumbers(spec: QuantV4CompleteSectionSpec): number[] {
  return Array.from(
    { length: spec.questionEnd - spec.questionStart + 1 },
    (_, index) => spec.questionStart + index,
  );
}

function assertPolicy(policy: QuantV4WholeSectionFrequencyPolicy): void {
  for (const [name, value] of [
    ["minCompleteSections", policy.minCompleteSections],
    ["minDistinctYears", policy.minDistinctYears],
    ["minPackageCoverage", policy.minPackageCoverage],
  ] as const) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`Whole-section frequency policy ${name} must be a non-negative integer.`);
    }
  }
}

function packageWeights(
  sections: readonly { readonly observations: readonly QuantV4PyqObservation[] }[],
): QuantV4WholeSectionPackageWeight[] {
  const totalQuestions = sections.reduce((sum, section) => sum + section.observations.length, 0);
  if (!totalQuestions || !sections.length) return [];

  const counts = new Map<string, number>();
  const presence = new Map<string, number>();
  for (const section of sections) {
    const seen = new Set<string>();
    for (const observation of section.observations) {
      const packageId = clean(observation.packageId) || "UNMAPPED_PACKAGE";
      counts.set(packageId, (counts.get(packageId) ?? 0) + 1);
      seen.add(packageId);
    }
    for (const packageId of seen) {
      presence.set(packageId, (presence.get(packageId) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([packageId, questionCount]) => Object.freeze({
      packageId,
      questionCount,
      questionShare: questionCount / totalQuestions,
      meanQuestionsPerSection: questionCount / sections.length,
      sectionPresenceCount: presence.get(packageId) ?? 0,
      sectionPresenceShare: (presence.get(packageId) ?? 0) / sections.length,
    }))
    .sort((left, right) => right.questionCount - left.questionCount || left.packageId.localeCompare(right.packageId));
}

function topicWeights(observations: readonly QuantV4PyqObservation[]): QuantV4WholeSectionTopicWeight[] {
  if (!observations.length) return [];
  const counts = new Map<string, number>();
  for (const observation of observations) {
    const topic = clean(observation.topic) || "UNMAPPED_TOPIC";
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([topic, questionCount]) => Object.freeze({
      topic,
      questionCount,
      questionShare: questionCount / observations.length,
    }))
    .sort((left, right) => right.questionCount - left.questionCount || left.topic.localeCompare(right.topic));
}

export function buildQuantV4WholeSectionFrequencyProfile(input: {
  readonly examId: QuantV4PyqExamId;
  readonly observations: readonly QuantV4PyqObservation[];
  readonly sections: readonly QuantV4CompleteSectionSpec[];
  readonly policy: QuantV4WholeSectionFrequencyPolicy;
}): QuantV4WholeSectionFrequencyProfile {
  assertPolicy(input.policy);

  const countable = input.observations.filter(
    (observation) => observation.examId === input.examId && isCountablePyqEvidenceKind(observation.evidenceKind),
  );
  const specs = input.sections.filter((section) => section.examId === input.examId);
  const blockers: string[] = [];
  const completeSections: { readonly spec: QuantV4CompleteSectionSpec; readonly observations: readonly QuantV4PyqObservation[] }[] = [];
  const snapshots: QuantV4WholeSectionSnapshot[] = [];

  let datedIdentityIncomplete = false;
  let declaredSectionIncomplete = false;

  for (const spec of specs) {
    const sectionObservations = countable
      .filter((observation) => clean(observation.paperId) === spec.paperId)
      .sort((left, right) => questionNumber(left.questionRef) - questionNumber(right.questionRef));

    const numbers = sectionObservations.map((observation) => questionNumber(observation.questionRef));
    const expectedNumbers = expectedQuestionNumbers(spec);
    const identityMatches = sectionObservations.every(
      (observation) => observation.heldDate === spec.heldDate && clean(observation.shift) === spec.shift,
    );
    const numberedExactly =
      numbers.length === expectedNumbers.length &&
      numbers.every((number, index) => number === expectedNumbers[index]) &&
      new Set(sectionObservations.map((observation) => `${observation.paperId}:${observation.questionRef}`)).size === expectedNumbers.length;
    const countMatches =
      sectionObservations.length === spec.expectedQuestionCount &&
      expectedNumbers.length === spec.expectedQuestionCount;
    const complete = identityMatches && numberedExactly && countMatches;

    if (input.policy.requireDatedSectionIdentity && (!spec.heldDate || !spec.shift || !identityMatches)) {
      datedIdentityIncomplete = true;
    }
    if (!complete) declaredSectionIncomplete = true;
    if (complete) completeSections.push(Object.freeze({ spec, observations: Object.freeze([...sectionObservations]) }));

    snapshots.push(Object.freeze({
      sectionId: spec.sectionId,
      paperId: spec.paperId,
      heldDate: spec.heldDate,
      shift: spec.shift,
      questionCount: sectionObservations.length,
      packageCount: new Set(sectionObservations.map((observation) => clean(observation.packageId))).size,
      complete,
    }));
  }

  const completeSectionObservations = completeSections.flatMap((section) => section.observations);
  const completeQuestionIdentities = new Set(
    completeSectionObservations.map((observation) => `${observation.examId}:${observation.paperId}:${observation.questionRef}`),
  );
  const nonWholeSectionCountableQuestionCount = countable.filter(
    (observation) => !completeQuestionIdentities.has(`${observation.examId}:${observation.paperId}:${observation.questionRef}`),
  ).length;
  const distinctYears = new Set(completeSections.map((section) => section.spec.heldDate.slice(0, 4)));
  const packages = packageWeights(completeSections);

  if (!completeSections.length) blockers.push("NO_COMPLETE_SECTION_EVIDENCE");
  if (declaredSectionIncomplete) blockers.push("DECLARED_COMPLETE_SECTION_INCOMPLETE");
  if (datedIdentityIncomplete) blockers.push("DATED_SECTION_IDENTITY_INCOMPLETE");
  if (completeSections.length < input.policy.minCompleteSections) blockers.push("COMPLETE_SECTION_SAMPLE_BELOW_POLICY");
  if (distinctYears.size < input.policy.minDistinctYears) blockers.push("DISTINCT_SECTION_YEAR_SAMPLE_BELOW_POLICY");
  if (packages.length < input.policy.minPackageCoverage) blockers.push("SECTION_PACKAGE_COVERAGE_BELOW_POLICY");

  const evidenceStatus: QuantV4WholeSectionEvidenceStatus = !completeSections.length
    ? "NO_COMPLETE_SECTION_EVIDENCE"
    : blockers.length
      ? "SECTION_EVIDENCE_ACCUMULATING"
      : "SECTION_FREQUENCY_CANDIDATE";

  return Object.freeze({
    authority: QUANT_V4_WHOLE_SECTION_FREQUENCY_CALIBRATION_AUTHORITY,
    examId: input.examId,
    evidenceStatus,
    completeSectionCount: completeSections.length,
    completeQuestionCount: completeSectionObservations.length,
    totalCountableQuestionCount: countable.length,
    nonWholeSectionCountableQuestionCount,
    undatedCountableQuestionCount: countable.filter((observation) => !observation.heldDate || !clean(observation.shift)).length,
    distinctSectionYearCount: distinctYears.size,
    packageCoverageCount: packages.length,
    blockers: Object.freeze([...new Set(blockers)]),
    productionPromotionAuthorized: input.policy.productionPromotionAuthorized,
    sectionSnapshots: Object.freeze(snapshots),
    packageWeights: Object.freeze(packages),
    topicWeights: Object.freeze(topicWeights(completeSectionObservations)),
    completeSectionObservations: Object.freeze(completeSectionObservations),
  });
}

export function canPromoteWholeSectionFrequencyWeights(profile: QuantV4WholeSectionFrequencyProfile): boolean {
  return profile.evidenceStatus === "SECTION_FREQUENCY_CANDIDATE" && profile.productionPromotionAuthorized;
}
