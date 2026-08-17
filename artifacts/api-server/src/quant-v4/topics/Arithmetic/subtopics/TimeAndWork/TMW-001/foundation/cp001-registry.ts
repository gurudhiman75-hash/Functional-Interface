import type { TmwCp001RegistryEntry } from "./types";

const modes: Array<Omit<TmwCp001RegistryEntry, "qlId">> = [
  { cpId: "TMW-CP-001", solveMode: "findWorkFromRateAndTime", answerType: "WORK", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_WORK_RATE_TIME", explanationStrategyId: "EXP_RATE_DIRECT", scenarioFamily: "production", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findRateFromWorkAndTime", answerType: "RATE", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_WORK_RATE_TIME", explanationStrategyId: "EXP_RATE_DIRECT", scenarioFamily: "document_work", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findTimeFromWorkAndRate", answerType: "TIME", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_WORK_RATE_TIME", explanationStrategyId: "EXP_RATE_DIRECT", scenarioFamily: "inspection", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findOneUnitWorkFromCompletionTime", answerType: "RATE", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "painting", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findCompletionTimeFromOneUnitWork", answerType: "TIME", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "painting", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findFractionCompletedInGivenTime", answerType: "FRACTION", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "document_work", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findPercentCompletedInGivenTime", answerType: "PERCENT", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "inspection", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findTimeForGivenFraction", answerType: "TIME", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "production", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findTimeForGivenPercent", answerType: "TIME", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "production", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findRemainingFractionAfterTime", answerType: "FRACTION", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "document_work", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findRemainingPercentAfterTime", answerType: "PERCENT", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_RECIPROCAL_RATE", explanationStrategyId: "EXP_RECIPROCAL_DIRECT", scenarioFamily: "inspection", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findOutputFromUnitRateAndTime", answerType: "OUTPUT", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_WORK_RATE_TIME", explanationStrategyId: "EXP_RATE_DIRECT", scenarioFamily: "production", difficulty: "Easy", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "recoverWholeWorkFromPartAndFraction", answerType: "WORK", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_PART_WHOLE", explanationStrategyId: "EXP_PART_WHOLE", scenarioFamily: "construction", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "recoverWholeTimeFromPartCompletion", answerType: "TIME", ruleId: "TMW_RATE_RECIPROCAL", formulaStrategyId: "FORMULA_PART_WHOLE", explanationStrategyId: "EXP_PART_WHOLE", scenarioFamily: "painting", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "convertRateAcrossTimeUnits", answerType: "OUTPUT", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_RATE_CONVERSION", explanationStrategyId: "EXP_RATE_CONVERSION", scenarioFamily: "production", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "compareWorkCompletedAtEqualTime", answerType: "WORK", ruleId: "TMW_RATE_COMPARISON", formulaStrategyId: "FORMULA_RATE_COMPARISON", explanationStrategyId: "EXP_RATE_COMPARISON", scenarioFamily: "document_work", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "compareTimeForDifferentWorkAtSameRate", answerType: "TIME", ruleId: "TMW_RATE_COMPARISON", formulaStrategyId: "FORMULA_RATE_COMPARISON", explanationStrategyId: "EXP_RATE_COMPARISON", scenarioFamily: "inspection", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findRequiredRateForTargetCompletion", answerType: "RATE", ruleId: "TMW_RATE_DIRECT", formulaStrategyId: "FORMULA_WORK_RATE_TIME", explanationStrategyId: "EXP_RATE_DIRECT", scenarioFamily: "construction", difficulty: "Medium", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findDelayFromReducedUniformRate", answerType: "TIME", ruleId: "TMW_RATE_CHANGE", formulaStrategyId: "FORMULA_RATE_CHANGE", explanationStrategyId: "EXP_RATE_CHANGE", scenarioFamily: "production", difficulty: "Hard", publiclyPublishable: false },
  { cpId: "TMW-CP-001", solveMode: "findTimeSavedFromIncreasedUniformRate", answerType: "TIME", ruleId: "TMW_RATE_CHANGE", formulaStrategyId: "FORMULA_RATE_CHANGE", explanationStrategyId: "EXP_RATE_CHANGE", scenarioFamily: "document_work", difficulty: "Hard", publiclyPublishable: false },
];

export const TMW_CP001_REGISTRY: TmwCp001RegistryEntry[] = modes.map((entry, index) => ({
  ...entry,
  qlId: `TMW-QL-${String(index + 1).padStart(3, "0")}`,
}));

export function getTmwCp001Entry(qlId: string): TmwCp001RegistryEntry {
  const entry = TMW_CP001_REGISTRY.find((candidate) => candidate.qlId === qlId);
  if (!entry) throw new Error(`Unknown TMW-001 question language: ${qlId}`);
  return entry;
}
