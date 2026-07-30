import type { Rational, TmwDifficulty, TmwTimeUnit } from "./types";
export const TMW_CP_004_ID = "TMW-CP-004" as const;
export const TMW_CP_004_SOLVE_MODES = [
  "findRemainingWorkAfterInitialPhase",
  "findWorkCompletedBeforeEvent",
  "findTotalTimeWhenFirstAgentStartsThenSecondFinishes",
  "findTotalTimeWhenTeamStartsThenOneLeaves",
  "findTotalTimeWhenOneStartsThenAnotherJoins",
  "findTotalTimeWithStaggeredJoins",
  "findTotalTimeWithStaggeredExits",
  "findTotalTimeWithJoinAndLeaveEvents",
  "findJoinTimeFromFinalCompletion",
  "findLeaveTimeFromFinalCompletion",
  "findUnknownInitialPhaseDuration",
  "findUnknownFinalPhaseDuration",
  "findReplacementWorkerRate",
  "findReplacementWorkerTime",
  "findCompletionWithIdleInterval",
  "findCompletionWithChangedDailyHours",
  "findCompletionWithMidProjectEfficiencyChange",
  "findCompletionWithNegativeWorkerActivatedLater",
  "findEventTimeAtSpecifiedCompletionFraction",
  "findRequiredRemainingRateForDeadline",
  "findWorkerCountAddedAfterPartialProgress",
  "findWorkerCountRemovedAfterPartialProgress",
  "findDelayAfterWorkerLeaves",
  "findEarlyCompletionAfterWorkerJoins",
] as const;
export type TmwCp004SolveMode = (typeof TMW_CP_004_SOLVE_MODES)[number];
export type TmwCp004AnswerType = "TIME" | "FRACTION" | "RATE" | "COUNT";
export type TmwCp004RuleId =
  | "TMW_STAGE_LEDGER"
  | "TMW_STAGE_HANDOFF"
  | "TMW_STAGE_INVERSE_EVENT"
  | "TMW_STAGE_RATE_CHANGE"
  | "TMW_STAGE_SIGNED_RATE"
  | "TMW_STAGE_WORKFORCE_EVENT"
  | "TMW_STAGE_COMPARISON";
export interface TmwCp004RegistryEntry { qlId:string; cpId:typeof TMW_CP_004_ID; solveMode:TmwCp004SolveMode; answerType:TmwCp004AnswerType; ruleId:TmwCp004RuleId; difficulty:TmwDifficulty; publiclyPublishable:false; }
export interface TmwCp004Context { jobPhrase:string; actorA:string; actorB:string; actorC:string; }
export interface TmwCp004Parameters {
  totalWork:Rational; timeUnit:TmwTimeUnit; context:TmwCp004Context;
  timeA?:Rational; timeB?:Rational; timeC?:Rational;
  rateA?:Rational; rateB?:Rational; rateC?:Rational;
  durationA?:Rational; durationB?:Rational; durationC?:Rational;
  totalCompletionTime?:Rational; idleDuration?:Rational; targetFraction?:Rational;
  deadline?:Rational; originalDailyHours?:Rational; changedDailyHours?:Rational;
  efficiencyMultiplier?:Rational; perWorkerTime?:Rational;
  initialWorkerCount?:number; changedWorkerCount?:number;
}
export interface TmwCp004Solution { answer:Rational; answerType:TmwCp004AnswerType; formulaLatex:string; workedLatex:string[]; answerText:string; }
export type TmwCp004MisconceptionId =
  | "CORRECT" | "COMPLETED_REPORTED_AS_REMAINING" | "REMAINING_REPORTED_AS_COMPLETED"
  | "INITIAL_PHASE_OMITTED" | "FINAL_PHASE_OMITTED" | "PHASE_RATES_SWAPPED"
  | "RATES_ADDED_ACROSS_SEQUENTIAL_PHASES" | "EVENT_TIME_REPORTED_AS_TOTAL"
  | "TOTAL_TIME_REPORTED_AS_EVENT" | "IDLE_INTERVAL_OMITTED" | "IDLE_INTERVAL_TREATED_AS_WORK"
  | "RATE_CHANGE_APPLIED_TO_TIME" | "HOUR_CHANGE_IGNORED" | "DESTRUCTIVE_RATE_ADDED"
  | "DESTRUCTIVE_RATE_OMITTED" | "ELAPSED_WORK_IGNORED" | "DEADLINE_REPORTED_AS_ANSWER"
  | "TOTAL_COUNT_REPORTED_AS_ADDED" | "ADDED_COUNT_REPORTED_AS_TOTAL"
  | "ORIGINAL_TOTAL_TIME_REPORTED" | "CHANGED_TOTAL_TIME_REPORTED" | "PLAUSIBLE_SCALE_ERROR";
export interface TmwCp004Option { text:string; value:Rational; misconceptionId:TmwCp004MisconceptionId; }
export interface TmwCp004GeneratedQuestion {
  archetypeId:"TMW-001"; canonicalProblemId:typeof TMW_CP_004_ID; questionLanguageId:string;
  solveMode:TmwCp004SolveMode; language:"en"; seed:string; stem:string; parameters:TmwCp004Parameters;
  solution:TmwCp004Solution; options:string[]; optionAudit:TmwCp004Option[]; correctIndex:number;
  explanation:{
    opening:string;
    formula:string;
    steps:string[];
    shortcut:{title:string;steps:string[]};
    commonTrap:{optionLabel:string;optionText:string;misconceptionId:Exclude<TmwCp004MisconceptionId,"CORRECT">;explanation:string};
    conclusion:string;
  };
  mathematicalFingerprint:string; validation:{valid:boolean;errors:string[]}; publiclyPublishable:false;
}
