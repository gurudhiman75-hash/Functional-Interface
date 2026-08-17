import type { Rational, TmwDifficulty } from "./types";

export const TMW_CP_011_ID = "TMW-CP-011" as const;
export const TMW_CP_011_SOLVE_MODES = [
  "findOutputFromArithmeticDailyRates",
  "findCompletionTimeFromArithmeticDailyRates",
  "findInitialRateFromArithmeticTotal",
  "findDailyChangeFromArithmeticTotal",
  "findOutputFromGeometricDailyRates",
  "findCompletionTimeFromGeometricDailyRates",
  "findInitialRateFromGeometricTotal",
  "findMultiplierFromGeometricTotal",
  "findCompletionTimeAfterThresholdRateSwitch",
  "findUnknownThresholdDay",
  "findUnknownPostThresholdRate",
  "findOutputWithVaryingCrewByDay",
  "findCombinedVariableAgentOutput",
  "findSignedNetVariableOutput",
  "findCompletionTimeFromExplicitRateTable",
  "findRequiredDailyAdjustmentForDeadline",
  "findOutputAfterThresholdRateSwitch",
  "findCompletionTimeWithVaryingCrewByDay",
  "findPostThresholdRateChange",
] as const;
export type TmwCp011SolveMode = (typeof TMW_CP_011_SOLVE_MODES)[number];
export type TmwCp011AnswerType = "OUTPUT"|"TIME"|"RATE"|"RATE_CHANGE"|"MULTIPLIER"|"DAY_INDEX";
export type TmwCp011RuleId = "TMW_ARITHMETIC_RATE_SUM"|"TMW_GEOMETRIC_RATE_SUM"|"TMW_VARIABLE_COMPLETION"|"TMW_THRESHOLD_SWITCH"|"TMW_CREW_SCHEDULE"|"TMW_COMBINED_SEQUENCE"|"TMW_SIGNED_SEQUENCE"|"TMW_EXPLICIT_RATE_TABLE"|"TMW_DEADLINE_ADJUSTMENT";
export interface TmwCp011RegistryEntry { qlId:string; cpId:typeof TMW_CP_011_ID; solveMode:TmwCp011SolveMode; answerType:TmwCp011AnswerType; ruleId:TmwCp011RuleId; difficulty:TmwDifficulty; publiclyPublishable:false; }
export interface TmwCp011Context { setting:string; actor:string; peerActor:string; action:string; object:string; unit:string; }
export interface TmwCp011Parameters {
  context:TmwCp011Context;
  sequenceKind:"ARITHMETIC"|"GEOMETRIC"|"THRESHOLD"|"CREW"|"COMBINED"|"SIGNED"|"TABLE"|"ADJUSTMENT";
  initialRate?:Rational;
  dailyChange?:Rational;
  multiplier?:Rational;
  days?:number;
  targetOutput?:Rational;
  terminalFraction?:Rational;
  thresholdDay?:number;
  postThresholdRate?:Rational;
  crewCounts?:number[];
  perWorkerRate?:Rational;
  peerInitialRate?:Rational;
  peerDailyChange?:Rational;
  negativeInitialRate?:Rational;
  negativeDailyChange?:Rational;
  explicitRates?:Rational[];
  requiredDeadlineDays?:number;
  requiredDailyAdjustment?:Rational;
  totalOutput?:Rational;
}
export interface TmwCp011Solution { answer:Rational; answerType:TmwCp011AnswerType; answerText:string; answerKey:string; formulaLatex:string; workedLatex:string[]; }
export type TmwCp011MisconceptionId = "CORRECT"|"FIRST_RATE_USED_FOR_ALL_DAYS"|"LAST_RATE_USED_FOR_ALL_DAYS"|"RATE_CHANGE_COUNT_OFF_BY_ONE"|"ARITHMETIC_MEAN_MISUSED"|"AP_SUM_HALF_OMITTED"|"PHASE_DURATIONS_IGNORED"|"AVERAGE_REPORTED_AS_INITIAL"|"AVERAGE_OUTPUT_REPORTED_AS_CHANGE"|"TARGET_DIVIDED_BY_INITIAL_RATE"|"TERMINAL_PARTIAL_DAY_IGNORED"|"GEOMETRIC_TREATED_AS_ARITHMETIC"|"GEOMETRIC_SUM_FACTOR_WRONG"|"MULTIPLIER_NOT_COMPOUNDED"|"MULTIPLIER_AS_ADDITIVE_INCREASE"|"THRESHOLD_DAY_OFF_BY_ONE"|"POST_SWITCH_RATE_APPLIED_FROM_DAY_ONE"|"POST_SWITCH_DURATION_REPORTED"|"ORIGINAL_RATE_REPORTED"|"REMAINING_PERIOD_COUNT_WRONG"|"CREW_VARIATION_IGNORED"|"FULL_SCHEDULE_AVERAGE_USED_FOR_EARLY_COMPLETION"|"CREW_RATE_OMITTED"|"PEER_SEQUENCE_OMITTED"|"NEGATIVE_SEQUENCE_IGNORED"|"NEGATIVE_SEQUENCE_ADDED"|"TABLE_ORDER_IGNORED"|"DEADLINE_GAP_NOT_SPREAD"|"TOTAL_AVERAGE_REPORTED_AS_ADJUSTMENT"|"PLANNED_RATE_REPORTED_AS_ADJUSTMENT"|"NEW_RATE_REPORTED_AS_CHANGE"|"INVERSE_FORMULA_REVERSED"|"PLAUSIBLE_SCALE_ERROR";
export interface TmwCp011Option { text:string; value:Rational; misconceptionId:TmwCp011MisconceptionId; }
export interface TmwCp011LearningShortcut { title:string; steps:string[]; }
export interface TmwCp011CommonTrap { optionLabel:string; optionText:string; misconceptionId:Exclude<TmwCp011MisconceptionId,"CORRECT">; explanation:string; }
export interface TmwCp011Explanation { opening:string; formula:string; givens:string[]; steps:string[]; shortcut:TmwCp011LearningShortcut; commonTrap:TmwCp011CommonTrap; conclusion:string; }
export interface TmwCp011GeneratedQuestion { archetypeId:"TMW-001"; canonicalProblemId:typeof TMW_CP_011_ID; questionLanguageId:string; solveMode:TmwCp011SolveMode; language:"en"; seed:string; stem:string; parameters:TmwCp011Parameters; solution:TmwCp011Solution; options:string[]; optionAudit:TmwCp011Option[]; correctIndex:number; explanation:TmwCp011Explanation; mathematicalFingerprint:string; validation:{valid:boolean;errors:string[]}; publiclyPublishable:false; }
