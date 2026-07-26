import type { TmwCp001SolveMode } from "./types";

export interface TmwCp001SolveModeDefinition {
  id: TmwCp001SolveMode;
  ruleId: string;
  formulaStrategyId: string;
  explanationStrategyId: string;
  independentVerifierId: string;
  ownership: string;
}

export const TMW_CP001_SOLVE_MODE_DEFINITIONS: readonly TmwCp001SolveModeDefinition[] = [
  ["findWorkFromRateAndTime", "TMW_RATE_DIRECT", "FORMULA_WORK_EQUALS_RATE_TIME", "EXP-RATE-DIRECT", "VERIFY_WORK_IDENTITY", "work from a uniform rate and elapsed time"],
  ["findRateFromWorkAndTime", "TMW_RATE_DIRECT", "FORMULA_RATE_EQUALS_WORK_OVER_TIME", "EXP-RATE-DIRECT", "VERIFY_RATE_IDENTITY", "uniform rate from completed work and elapsed time"],
  ["findTimeFromWorkAndRate", "TMW_RATE_DIRECT", "FORMULA_TIME_EQUALS_WORK_OVER_RATE", "EXP-RATE-DIRECT", "VERIFY_TIME_IDENTITY", "completion time from work and a uniform rate"],
  ["findOneUnitWorkFromCompletionTime", "TMW_RATE_RECIPROCAL", "FORMULA_ONE_UNIT_WORK", "EXP-RECIPROCAL", "VERIFY_RECIPROCAL_RATE", "one time-unit work from whole-job completion time"],
  ["findCompletionTimeFromOneUnitWork", "TMW_RATE_RECIPROCAL", "FORMULA_COMPLETION_FROM_UNIT_WORK", "EXP-RECIPROCAL", "VERIFY_RECIPROCAL_TIME", "whole-job completion time from one time-unit work"],
  ["findFractionCompletedInGivenTime", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_COMPLETED_FRACTION", "EXP-FRACTION-PROGRESS", "VERIFY_COMPLETED_FRACTION", "completed fraction after uniform work"],
  ["findPercentCompletedInGivenTime", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_COMPLETED_PERCENT", "EXP-FRACTION-PROGRESS", "VERIFY_COMPLETED_PERCENT", "completed percentage after uniform work"],
  ["findTimeForGivenFraction", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_TIME_FOR_FRACTION", "EXP-FRACTION-PROGRESS", "VERIFY_TIME_FOR_FRACTION", "time needed for a specified fraction"],
  ["findTimeForGivenPercent", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_TIME_FOR_PERCENT", "EXP-FRACTION-PROGRESS", "VERIFY_TIME_FOR_PERCENT", "time needed for a specified percentage"],
  ["findRemainingFractionAfterTime", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_REMAINING_FRACTION", "EXP-FRACTION-PROGRESS", "VERIFY_REMAINING_FRACTION", "remaining fraction after uniform work"],
  ["findRemainingPercentAfterTime", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_REMAINING_PERCENT", "EXP-FRACTION-PROGRESS", "VERIFY_REMAINING_PERCENT", "remaining percentage after uniform work"],
  ["findOutputFromUnitRateAndTime", "TMW_RATE_DIRECT", "FORMULA_OUTPUT_EQUALS_RATE_TIME", "EXP-OUTPUT-DIRECT", "VERIFY_OUTPUT_IDENTITY", "physical output from rate and duration"],
  ["findUnitRateFromOutputAndTime", "TMW_RATE_DIRECT", "FORMULA_OUTPUT_RATE", "EXP-OUTPUT-DIRECT", "VERIFY_OUTPUT_RATE", "physical output rate from total output and duration"],
  ["findTimeFromOutputAndUnitRate", "TMW_RATE_DIRECT", "FORMULA_OUTPUT_TIME", "EXP-OUTPUT-DIRECT", "VERIFY_OUTPUT_TIME", "duration from physical output and rate"],
  ["recoverWholeWorkFromCompletedPart", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_WHOLE_FROM_PART", "EXP-PART-WHOLE", "VERIFY_WHOLE_FROM_PART", "whole quantity from a completed part and its fraction"],
  ["recoverWholeTimeFromPartCompletion", "TMW_PARTIAL_WORK_BALANCE", "FORMULA_WHOLE_TIME_FROM_PART", "EXP-PART-WHOLE", "VERIFY_WHOLE_TIME_FROM_PART", "whole completion time from elapsed time and completed fraction"],
  ["convertRateAcrossTimeUnits", "TMW_RATE_DIRECT", "FORMULA_RATE_UNIT_CONVERSION", "EXP-UNIT-CONVERSION", "VERIFY_RATE_CONVERSION", "rate conversion across compatible time units"],
  ["compareWorkCompletedAtEqualTime", "TMW_EFFICIENCY_TIME_INVERSE", "FORMULA_EQUAL_TIME_OUTPUT_DIFFERENCE", "EXP-COMPARISON", "VERIFY_EQUAL_TIME_COMPARISON", "difference in work at equal time"],
  ["compareTimeForDifferentWorkAtSameRate", "TMW_RATE_DIRECT", "FORMULA_SAME_RATE_TIME_DIFFERENCE", "EXP-COMPARISON", "VERIFY_SAME_RATE_TIME_COMPARISON", "difference in time for different work at the same rate"],
  ["findRequiredRateForTargetCompletion", "TMW_RATE_DIRECT", "FORMULA_REQUIRED_RATE", "EXP-TARGET-RATE", "VERIFY_REQUIRED_RATE", "required uniform rate for a work target and deadline"],
  ["findDelayFromReducedUniformRate", "TMW_EFFICIENCY_PERCENT_CHANGE", "FORMULA_DELAY_AFTER_RATE_REDUCTION", "EXP-RATE-CHANGE", "VERIFY_RATE_REDUCTION_DELAY", "delay caused by a uniform efficiency reduction"],
  ["findTimeSavedFromIncreasedUniformRate", "TMW_EFFICIENCY_PERCENT_CHANGE", "FORMULA_TIME_SAVED_AFTER_RATE_INCREASE", "EXP-RATE-CHANGE", "VERIFY_RATE_INCREASE_SAVING", "time saved by a uniform efficiency increase"],
].map(([id, ruleId, formulaStrategyId, explanationStrategyId, independentVerifierId, ownership]) => ({
  id: id as TmwCp001SolveMode,
  ruleId,
  formulaStrategyId,
  explanationStrategyId,
  independentVerifierId,
  ownership,
}));

const byId = new Map(TMW_CP001_SOLVE_MODE_DEFINITIONS.map((entry) => [entry.id, entry]));

export function getTmwCp001SolveModeDefinition(id: TmwCp001SolveMode): TmwCp001SolveModeDefinition {
  const definition = byId.get(id);
  if (!definition) throw new Error(`Unknown TMW-CP-001 solve mode: ${id}`);
  return definition;
}

export function getTmwCp001SolveModeIds(): TmwCp001SolveMode[] {
  return TMW_CP001_SOLVE_MODE_DEFINITIONS.map((entry) => entry.id);
}
