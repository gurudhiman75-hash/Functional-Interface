import type { TmwCp003RegistryEntry } from "./cp003-types";

const entries: Array<Omit<TmwCp003RegistryEntry, "qlId">> = [
  { cpId: "TMW-CP-003", solveMode: "findEfficiencyRatioFromEqualWorkTimes", answerType: "RATIO", ruleId: "TMW_EFFICIENCY_TIME_INVERSE", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findTimeRatioFromEfficiencyRatio", answerType: "RATIO", ruleId: "TMW_EFFICIENCY_TIME_INVERSE", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findEfficiencyPercentMoreFromCompletionTimes", answerType: "PERCENT", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findEfficiencyPercentLessFromCompletionTimes", answerType: "PERCENT", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findFasterTimeFromSlowerTimeAndPercentMoreEfficient", answerType: "TIME", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findSlowerTimeFromFasterTimeAndPercentMoreEfficient", answerType: "TIME", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findTimePercentLessFromEfficiencyPercentMore", answerType: "PERCENT", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findTimePercentMoreFromEfficiencyPercentLess", answerType: "PERCENT", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findWorkRatioAtEqualTimeFromEfficiencyRatio", answerType: "RATIO", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findWorkRatioFromEfficiencyRatioAndUnequalTimes", answerType: "RATIO", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findTimeRatioForUnequalWorkAndEfficiencyRatio", answerType: "RATIO", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findEfficiencyRatioFromUnequalWorkAndTimes", answerType: "RATIO", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findOutputFromEfficiencyRatioAndReferenceOutput", answerType: "OUTPUT", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findReferenceOutputFromEfficiencyRatioAndOtherOutput", answerType: "OUTPUT", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findIndividualTimeFromEfficiencyRatioAndCombinedTime", answerType: "TIME", ruleId: "TMW_EFFICIENCY_COMBINED_RATE", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findIndividualTimeFromEfficiencyRatioAndTimeDifference", answerType: "TIME", ruleId: "TMW_EFFICIENCY_TIME_INVERSE", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findIndividualTimeFromEfficiencyRatioAndTimeSum", answerType: "TIME", ruleId: "TMW_EFFICIENCY_TIME_INVERSE", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findEfficiencyRatioFromOutputAndTimeComparison", answerType: "RATIO", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findComparativeOutputFromDifferentEfficienciesAndDurations", answerType: "OUTPUT", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findComparativeDurationFromDifferentWorkAndEfficiencies", answerType: "TIME", ruleId: "TMW_COMPARATIVE_PRODUCTIVITY", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findSuccessiveEfficiencyRatioAcrossThreeAgents", answerType: "RATIO", ruleId: "TMW_SUCCESSIVE_EFFICIENCY", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findSuccessiveEfficiencyPercentComparison", answerType: "PERCENT", ruleId: "TMW_SUCCESSIVE_EFFICIENCY", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-003", solveMode: "findEfficiencyChangePercentFromCompletionTimeChange", answerType: "PERCENT", ruleId: "TMW_EFFICIENCY_PERCENT_CHANGE", difficulty: "Medium", publiclyPublishable: false },
];

export const TMW_CP003_REGISTRY: TmwCp003RegistryEntry[] = entries.map((entry, index) => ({
  ...entry,
  qlId: `TMW-QL-${String(index + 35).padStart(3, "0")}`,
}));

export function getTmwCp003Entry(qlId: string): TmwCp003RegistryEntry {
  const entry = TMW_CP003_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW-CP-003 question language: ${qlId}`);
  return entry;
}
