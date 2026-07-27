import type { Rational, TmwDifficulty } from "./types";

export const TMW_CP_006_ID = "TMW-CP-006" as const;

export const TMW_CP_006_SOLVE_MODES = [
  "findRequiredResourceCount",
  "findRequiredDays",
  "findRequiredDailyHours",
  "findRelativeEfficiency",
  "findWorkQuantity",
  "findWorkQuantityRatio",
  "findAdditionalWorkersForDeadline",
  "findWorkersRemovedForDelay",
  "findOriginalWorkforceFromChangedSchedule",
  "findRemainingDaysFromActualProgress",
  "findExtraWorkersFromPlannedVsActualProgress",
  "findPercentWorkCompletedFromResourceHours",
  "findPercentScheduleDelay",
  "findOvertimeHoursForDeadline",
  "findShiftCountForProductionTarget",
  "findDimensionalWorkRatio",
  "findWorkersForChangedDimensions",
  "findDaysForChangedDimensions",
  "findResourceDurationAfterPopulationChange",
  "findCompletionTimeAfterAbsenteeism",
  "findCompletionWithBatchWorkerAdditions",
  "findEquivalentResourceTime",
] as const;

export type TmwCp006SolveMode = (typeof TMW_CP_006_SOLVE_MODES)[number];
export type TmwCp006AnswerType = "COUNT" | "TIME" | "HOURS" | "EFFICIENCY" | "WORK" | "RATIO" | "PERCENT" | "SHIFT" | "RESOURCE_TIME";
export type TmwCp006RuleId =
  | "TMW_EQUIVALENT_STATES"
  | "TMW_CHANGE_COUNT"
  | "TMW_PROGRESS_RECOVERY"
  | "TMW_SCHEDULE_VARIANCE"
  | "TMW_PRODUCTION_SCALING"
  | "TMW_DIMENSIONAL_WORK"
  | "TMW_RESOURCE_STOCK"
  | "TMW_BATCH_SERIES"
  | "TMW_RESOURCE_TIME";

export interface TmwCp006RegistryEntry {
  qlId:string;
  cpId:typeof TMW_CP_006_ID;
  solveMode:TmwCp006SolveMode;
  answerType:TmwCp006AnswerType;
  ruleId:TmwCp006RuleId;
  difficulty:TmwDifficulty;
  publiclyPublishable:false;
}

export interface TmwCp006Context {
  jobPhrase:string;
  resourceSingular:string;
  resourcePlural:string;
  outputUnit:string;
  resourceTimeUnit:string;
}

export interface TmwCp006ProjectState {
  resources:Rational;
  days:Rational;
  hoursPerDay:Rational;
  efficiency:Rational;
  work:Rational;
}

export interface TmwCp006Parameters {
  context:TmwCp006Context;
  stateA:TmwCp006ProjectState;
  stateB:TmwCp006ProjectState;
  elapsedDays?:Rational;
  completedFraction?:Rational;
  absentPercent?:Rational;
  initialPopulation?:Rational;
  changedPopulation?:Rational;
  elapsedBeforePopulationChange?:Rational;
  initialBatchResources?:Rational;
  batchAddition?:Rational;
  targetBatchDays?:Rational;
  dimensionsA?:Rational[];
  dimensionsB?:Rational[];
  dimensionLabels?:string[];
}

export interface TmwCp006Solution {
  answer:Rational;
  answerType:TmwCp006AnswerType;
  formulaLatex:string;
  workedLatex:string[];
  answerText:string;
}

export type TmwCp006MisconceptionId =
  | "CORRECT"
  | "BASELINE_STATE_REUSED"
  | "DIRECT_INVERSE_PROPORTION_CONFUSED"
  | "WORK_RATIO_OMITTED"
  | "HOURS_FACTOR_OMITTED"
  | "EFFICIENCY_FACTOR_OMITTED"
  | "TOTAL_REPORTED_AS_CHANGE"
  | "CHANGE_REPORTED_AS_TOTAL"
  | "ELAPSED_PERIOD_IGNORED"
  | "COMPLETED_USED_AS_REMAINING"
  | "PERCENT_NOT_CONVERTED"
  | "DIMENSION_FACTOR_OMITTED"
  | "ABSENTEES_TREATED_AS_PRESENT"
  | "ARITHMETIC_SERIES_IGNORED"
  | "PLAUSIBLE_SCALE_ERROR";

export interface TmwCp006Option {
  text:string;
  value:Rational;
  misconceptionId:TmwCp006MisconceptionId;
}

export interface TmwCp006LearningShortcut {
  title:string;
  steps:string[];
}

export interface TmwCp006CommonTrap {
  optionLabel:string;
  optionText:string;
  misconceptionId:Exclude<TmwCp006MisconceptionId,"CORRECT">;
  explanation:string;
}

export interface TmwCp006Explanation {
  opening:string;
  formula:string;
  givens:string[];
  steps:string[];
  shortcut:TmwCp006LearningShortcut;
  commonTrap:TmwCp006CommonTrap;
  conclusion:string;
}

export interface TmwCp006GeneratedQuestion {
  archetypeId:"TMW-001";
  canonicalProblemId:typeof TMW_CP_006_ID;
  questionLanguageId:string;
  solveMode:TmwCp006SolveMode;
  language:"en";
  seed:string;
  stem:string;
  parameters:TmwCp006Parameters;
  solution:TmwCp006Solution;
  options:string[];
  optionAudit:TmwCp006Option[];
  correctIndex:number;
  explanation:TmwCp006Explanation;
  mathematicalFingerprint:string;
  validation:{valid:boolean;errors:string[]};
  publiclyPublishable:false;
}
