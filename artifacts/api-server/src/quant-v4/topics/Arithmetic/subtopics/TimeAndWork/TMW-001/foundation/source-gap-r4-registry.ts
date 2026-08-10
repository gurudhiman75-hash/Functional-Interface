export type TmwR4ExamTier = "CORE_EXAM_PATTERN" | "UPPER_EXAM_PRACTICE" | "ADVANCED_ENRICHMENT";
export type TmwR4Difficulty = "Easy" | "Medium" | "Hard";
export type TmwR4AnswerType = "TIME" | "COUNT" | "MONEY" | "RATIO";

export interface TmwR4GapEntry {
  qlId: string;
  canonicalProblemId: string;
  solveMode: string;
  answerType: TmwR4AnswerType;
  difficulty: TmwR4Difficulty;
  examTier: TmwR4ExamTier;
  publiclyPublishable: false;
}

export const TMW_R4_SOURCE_GAP_REGISTRY: readonly TmwR4GapEntry[] = [
  { qlId: "TMW-QL-212", canonicalProblemId: "TMW-CP-003", solveMode: "findCombinedTimeFromSoloTimeAndRelativeEfficiency", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-213", canonicalProblemId: "TMW-CP-002", solveMode: "findCombinedTimeFromPartialWorkFacts", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-214", canonicalProblemId: "TMW-CP-002", solveMode: "findTargetOutputTimeFromIndividualAndCombinedOutputFacts", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-215", canonicalProblemId: "TMW-CP-004", solveMode: "findCompletionWithEndRelativeLeaveEvent", answerType: "TIME", difficulty: "Hard", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-216", canonicalProblemId: "TMW-CP-004", solveMode: "findMissingSoloTimeFromCombinedThenSoloStage", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-217", canonicalProblemId: "TMW-CP-006", solveMode: "findOriginalWorkforceFromAddedWorkersAndTimeSaved", answerType: "COUNT", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-218", canonicalProblemId: "TMW-CP-004", solveMode: "findWorkforceLeaveTimeForExtendedDeadline", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-219", canonicalProblemId: "TMW-CP-007", solveMode: "findCompletionAfterHeterogeneousReplacementEvent", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-220", canonicalProblemId: "TMW-CP-008", solveMode: "findTogetherTimeFromPaymentSharesAndOneSoloTime", answerType: "TIME", difficulty: "Medium", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-221", canonicalProblemId: "TMW-CP-009", solveMode: "findAllPipesTimeFromOverlappingSubsetTimes", answerType: "TIME", difficulty: "Hard", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-222", canonicalProblemId: "TMW-CP-002", solveMode: "findSoloTimeFromSubgroupEquivalenceAndCombinedFact", answerType: "TIME", difficulty: "Hard", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-223", canonicalProblemId: "TMW-CP-002", solveMode: "findSoloTimeRatioFromPairwiseCombinedTimes", answerType: "RATIO", difficulty: "Hard", examTier: "CORE_EXAM_PATTERN", publiclyPublishable: false },
  { qlId: "TMW-QL-224", canonicalProblemId: "TMW-CP-007", solveMode: "findTargetMixedCrewTimeFromMixedCrewCompletionFacts", answerType: "TIME", difficulty: "Hard", examTier: "UPPER_EXAM_PRACTICE", publiclyPublishable: false },
  { qlId: "TMW-QL-225", canonicalProblemId: "TMW-CP-007", solveMode: "findAdditionalCategoryAfterStagedHeterogeneousProgress", answerType: "COUNT", difficulty: "Hard", examTier: "UPPER_EXAM_PRACTICE", publiclyPublishable: false },
  { qlId: "TMW-QL-226", canonicalProblemId: "TMW-CP-008", solveMode: "findHelperShareFromSoloTimesAndJointCompletion", answerType: "MONEY", difficulty: "Medium", examTier: "UPPER_EXAM_PRACTICE", publiclyPublishable: false },
  { qlId: "TMW-QL-227", canonicalProblemId: "TMW-CP-004", solveMode: "findCombinedTimeFromHandoffCompletionFacts", answerType: "TIME", difficulty: "Hard", examTier: "UPPER_EXAM_PRACTICE", publiclyPublishable: false },
  { qlId: "TMW-QL-228", canonicalProblemId: "TMW-CP-011", solveMode: "findInitialWorkforceFromDailyAttritionSchedule", answerType: "COUNT", difficulty: "Hard", examTier: "UPPER_EXAM_PRACTICE", publiclyPublishable: false },
  { qlId: "TMW-QL-229", canonicalProblemId: "TMW-CP-002", solveMode: "findIndividualTimeFromCombinedAndHalfHandoffTotal", answerType: "TIME", difficulty: "Hard", examTier: "ADVANCED_ENRICHMENT", publiclyPublishable: false },
] as const;

export const TMW_R4_SOURCE_GAP_IDS = new Set(TMW_R4_SOURCE_GAP_REGISTRY.map((entry) => entry.qlId));

export function getTmwR4GapEntry(qlId: string): TmwR4GapEntry {
  const entry = TMW_R4_SOURCE_GAP_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW R4 source-gap QL: ${qlId}`);
  return entry;
}
