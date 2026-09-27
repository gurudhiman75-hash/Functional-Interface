export const REASONING_V1_NOVELTY_GOVERNANCE_V1 = Object.freeze({
  authorityId: 'REASONING-V1-NOVELTY-GOVERNANCE-V1' as const,
  purpose:
    'Preserve exhaustive source-backed coverage while reserving a meaningful share of generated questions for genuinely new, exam-natural reasoning constructions.' as const,

  assemblyMix: {
    sourceBackedOperatingTarget: 0.80,
    controlledNovelOperatingTarget: 0.20,
    controlledNovelAcceptableBand: [0.15, 0.25] as const,
    exactShareIsNotAQuota: true,
    minimumBatchSizeForShareGate: 20,
  },
  chapterPolicy: {
    perChapterTwentyPercentQuotaRequired: false,
    perQlNoveltyQuotaRequired: false,
    noveltyMayBeConcentratedInSuitableChapters: true,
    noveltyMayBeConcentratedInSuitableQls: true,
    approvedChapterSpecificMixMayDiffer: true,
    assemblySchedulerMustRestoreOverallTarget: true,
  },

  provenance: {
    sourceBackedCore: 'SOURCE_BACKED_CORE',
    sourceBackedVariant: 'SOURCE_BACKED_VARIANT',
    controlledNovel: 'CONTROLLED_NOVEL',
    experimentalStretch: 'EXPERIMENTAL_STRETCH',
  },

  substantiveNoveltyAxes: [
    'QUERY_DIRECTION',
    'CONSTRAINT_INTERACTION',
    'RELATION_STRUCTURE',
    'INFORMATION_DISTRIBUTION',
    'BOUNDARY_CONDITION',
    'MULTI_STAGE_COMPOSITION',
    'ANSWER_SEMANTIC',
    'REPRESENTATION_LOGIC',
    'VALID_CROSS_FAMILY_COMPOSITION',
  ] as const,

  nonNovelChanges: [
    'NAME_SUBSTITUTION',
    'ENTITY_LABEL_SUBSTITUTION',
    'NUMERIC_RESAMPLING_ONLY',
    'WORDING_PARAPHRASE_ONLY',
    'SENTENCE_ORDER_ONLY',
    'OPTION_ORDER_ONLY',
    'TRANSLATION_ONLY',
    'COSMETIC_DIAGRAM_CHANGE_ONLY',
    'SEED_CHANGE_ONLY',
  ] as const,

  mandatoryControlledNovelGates: [
    'USES_EXISTING_LEARNER_SKILL_OR_EXPLICITLY_APPROVED_NEW_SKILL',
    'AT_LEAST_ONE_SUBSTANTIVE_NOVELTY_AXIS',
    'NOT_EXPLAINABLE_ONLY_BY_NON_NOVEL_CHANGES',
    'EXACT_SOLVER_OR_INDEPENDENT_VERIFIER_PASSES',
    'UNIQUE_CORRECT_ANSWER',
    'DISTRACTORS_ARE_PLAUSIBLE_REASONING_ERRORS',
    'DIFFICULTY_COMES_FROM_REASONING_NOT_DECORATIVE_NOISE',
    'STEM_IS_EXAM_NATURAL',
    'NO_FALSE_PYQ_OR_HISTORICAL_ATTRIBUTION',
    'TRACEABLE_TO_OWNED_CHAPTER_CONCEPTS',
    'HUMAN_REVIEW_REQUIRED_BEFORE_ACTIVATION',
  ] as const,

  auditDefinitions: {
    diversity:
      'Questions differ in learner-visible or instance state. Diversity alone does not establish novelty.',
    semanticNovelty:
      'The reasoning configuration changes along at least one substantive axis while remaining inside an exam-valid learner skill boundary.',
    controlledNovel:
      'A solver-valid, uniquely answerable, exam-natural semantic novelty candidate that passes the mandatory novelty gates.',
  },

  allocationRules: {
    cosmeticNoveltyCreatesNewQl: false,
    controlledNoveltyCreatesNewQlByDefault: false,
    newQlRequiredOnlyForNewLearnerSkill: true,
    sourceCoverageRemainsTheFloor: true,
    experimentalStretchCountsTowardOperatingNovelTarget: false,
  },
} as const);

export type ReasoningNoveltyProvenanceV1 =
  | 'SOURCE_BACKED_CORE'
  | 'SOURCE_BACKED_VARIANT'
  | 'CONTROLLED_NOVEL'
  | 'EXPERIMENTAL_STRETCH';

export type ReasoningNoveltyAxisV1 =
  (typeof REASONING_V1_NOVELTY_GOVERNANCE_V1.substantiveNoveltyAxes)[number];

export type ReasoningNonNovelChangeV1 =
  (typeof REASONING_V1_NOVELTY_GOVERNANCE_V1.nonNovelChanges)[number];

export interface ReasoningNoveltyCandidateV1 {
  candidateId: string;
  chapterId: string;
  qlId: string;
  provenance: ReasoningNoveltyProvenanceV1;
  noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  nonNovelChanges?: readonly ReasoningNonNovelChangeV1[];
  solverVerified: boolean;
  uniqueCorrectAnswer: boolean;
  plausibleDistractors: boolean;
  examNatural: boolean;
  falseHistoricalAttribution: boolean;
  humanReviewRequired: boolean;
}

export function validateReasoningNoveltyCandidateV1<T extends ReasoningNoveltyCandidateV1>(
  candidate: T,
): T {
  const substantive = new Set(candidate.noveltyAxes);
  const cosmetic = new Set(candidate.nonNovelChanges ?? []);

  if (candidate.provenance === 'CONTROLLED_NOVEL') {
    if (substantive.size === 0) {
      throw new Error(candidate.candidateId + ' is labelled CONTROLLED_NOVEL without a substantive novelty axis.');
    }
    if (!candidate.solverVerified) {
      throw new Error(candidate.candidateId + ' cannot be controlled novel without solver verification.');
    }
    if (!candidate.uniqueCorrectAnswer) {
      throw new Error(candidate.candidateId + ' cannot be controlled novel without a unique correct answer.');
    }
    if (!candidate.plausibleDistractors) {
      throw new Error(candidate.candidateId + ' cannot be controlled novel with weak distractors.');
    }
    if (!candidate.examNatural) {
      throw new Error(candidate.candidateId + ' cannot be controlled novel if it is not exam-natural.');
    }
    if (candidate.falseHistoricalAttribution) {
      throw new Error(candidate.candidateId + ' must not imply PYQ/source provenance it does not have.');
    }
    if (!candidate.humanReviewRequired) {
      throw new Error(candidate.candidateId + ' must remain human-review gated before activation.');
    }
  }

  if (
    candidate.provenance === 'SOURCE_BACKED_CORE' &&
    (substantive.size > 0 || cosmetic.size > 0)
  ) {
    throw new Error(candidate.candidateId + ' source-backed core should not claim variation metadata.');
  }

  return candidate;
}

function noveltyHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export type ReasoningNoveltyLaneV1 = 'SOURCE_BACKED' | 'CONTROLLED_NOVEL';

export function buildReasoningNoveltyMixPlanV1(input: {
  count: number;
  seed: string;
}): readonly ReasoningNoveltyLaneV1[] {
  if (!Number.isInteger(input.count) || input.count < 1) {
    throw new Error('Reasoning novelty mix count must be a positive integer.');
  }

  const novelCount = Math.max(
    input.count >= 5 ? 1 : 0,
    Math.round(
      input.count *
      REASONING_V1_NOVELTY_GOVERNANCE_V1.assemblyMix.controlledNovelOperatingTarget,
    ),
  );

  const lanes: ReasoningNoveltyLaneV1[] = [
    ...Array.from({ length: input.count - novelCount }, () => 'SOURCE_BACKED' as const),
    ...Array.from({ length: novelCount }, () => 'CONTROLLED_NOVEL' as const),
  ];

  for (let index = lanes.length - 1; index > 0; index -= 1) {
    const swap = noveltyHash(input.seed + ':novelty-mix:' + index) % (index + 1);
    [lanes[index], lanes[swap]] = [lanes[swap]!, lanes[index]!];
  }
  return lanes;
}

export function auditReasoningNoveltyMixV1(
  provenance: readonly ReasoningNoveltyProvenanceV1[],
) {
  if (provenance.length === 0) {
    throw new Error('Reasoning novelty mix audit requires at least one generated question.');
  }

  const total = provenance.length;
  const controlledNovelCount = provenance.filter((value) => value === 'CONTROLLED_NOVEL').length;
  const sourceBackedCount = provenance.filter(
    (value) => value === 'SOURCE_BACKED_CORE' || value === 'SOURCE_BACKED_VARIANT',
  ).length;
  const experimentalStretchCount = provenance.filter(
    (value) => value === 'EXPERIMENTAL_STRETCH',
  ).length;
  const controlledNovelShare = controlledNovelCount / total;
  const [minimum, maximum] =
    REASONING_V1_NOVELTY_GOVERNANCE_V1.assemblyMix.controlledNovelAcceptableBand;
  const shareGateApplicable =
    total >= REASONING_V1_NOVELTY_GOVERNANCE_V1.assemblyMix.minimumBatchSizeForShareGate;

  return {
    total,
    sourceBackedCount,
    controlledNovelCount,
    experimentalStretchCount,
    controlledNovelShare,
    operatingTarget:
      REASONING_V1_NOVELTY_GOVERNANCE_V1.assemblyMix.controlledNovelOperatingTarget,
    shareGateApplicable,
    withinOperatingBand:
      !shareGateApplicable ||
      (controlledNovelShare >= minimum && controlledNovelShare <= maximum),
    experimentalStretchCountsTowardTarget: false,
  } as const;
}
