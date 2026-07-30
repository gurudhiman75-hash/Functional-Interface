import type { Rational, TmwDifficulty, TmwTimeUnit } from "./types";
export const TMW_CP_005_ID = "TMW-CP-005" as const;
export const TMW_CP_005_SOLVE_MODES = [
  "findCompletionTimeForTwoAgentAlternationStartingA",
  "findCompletionTimeForTwoAgentAlternationStartingB",
  "findCompletionTimeForMultiDayCycle",
  "findCompletionTimeForThreeAgentCycle",
  "findCompletionDayAndTerminalFraction",
  "findWorkAfterGivenNumberOfCycles",
  "findRemainingWorkAfterFullCycles",
  "findTerminalAgent",
  "findStartingAgentFromCompletionCondition",
  "findUnknownRateFromAlternatingCompletion",
  "findUnknownTimeFromAlternatingCompletion",
  "findCompletionWhenHelperWorksEveryNthDay",
  "findCompletionWhenAgentRestsEveryNthDay",
  "findCompletionWithWeekendOrHolidayPattern",
  "findCompletionWithUnequalShiftDurations",
  "findCompletionWithTwoDaysOnOneDayOffPattern",
  "findCompletionWithPeriodicNegativeWork",
  "findCompletionWithRepeatedJoinLeaveCycle",
  "findCycleCountToReachSpecifiedFraction",
  "findTimeFromArbitraryCyclePhase",
  "findExactBoundaryCompletion",
  "findCompletionWithinCycleSegment",
  "findOutputUnderPeriodicMachineSchedule",
  "findRequiredCycleRateForDeadline",
] as const;
export type TmwCp005SolveMode=(typeof TMW_CP_005_SOLVE_MODES)[number];
export type TmwCp005AnswerType="TIME"|"FRACTION"|"COUNT"|"AGENT"|"RATE"|"OUTPUT";
export type TmwCp005RuleId="TMW_CYCLE_COMPLETION"|"TMW_CYCLE_STATE"|"TMW_CYCLE_INVERSE"|"TMW_CYCLE_SIGNED_RATE"|"TMW_CYCLE_OUTPUT";
export interface TmwCp005RegistryEntry{qlId:string;cpId:typeof TMW_CP_005_ID;solveMode:TmwCp005SolveMode;answerType:TmwCp005AnswerType;ruleId:TmwCp005RuleId;difficulty:TmwDifficulty;publiclyPublishable:false;}
export interface TmwCp005Context{jobPhrase:string;actorA:string;actorB:string;actorC:string;outputNoun:string;}
export interface TmwCp005Segment{label:string;rate:Rational;duration:Rational;description:string;}
export interface TmwCp005Parameters{
 totalWork:Rational;timeUnit:TmwTimeUnit;context:TmwCp005Context;cycle:TmwCp005Segment[];
 alternateCycle?:TmwCp005Segment[];startOffset?:number;givenCycles?:number;givenTime?:Rational;
 targetWork?:Rational;knownCompletionTime?:Rational;knownTerminalLabel?:string;unknownSegmentIndex?:number;
 deadline?:Rational;outputUnit?:string;patternNumber?:number;expectedStartLabel?:string;
 timeA?:Rational;timeB?:Rational;timeC?:Rational;
}
export interface TmwCp005Trace{time:Rational;work:Rational;terminalIndex:number;terminalLabel:string;terminalFraction:Rational;fullCycles:number;}
export interface TmwCp005Solution{answer:Rational|string;answerType:TmwCp005AnswerType;formulaLatex:string;workedLatex:string[];answerText:string;}
export type TmwCp005MisconceptionId=
 |"CORRECT"|"WRONG_STARTING_AGENT"|"FULL_FINAL_SEGMENT_ASSUMED"|"PARTIAL_SEGMENT_IGNORED"
 |"FINAL_CYCLE_OMITTED"|"CYCLE_WORK_TREATED_AS_DAILY"|"CYCLE_LENGTH_CONFUSED"
 |"REST_DAY_TREATED_AS_WORK"|"NEGATIVE_RATE_ADDED"|"NEGATIVE_RATE_OMITTED"
 |"TERMINAL_AGENT_OFF_BY_ONE"|"RECIPROCAL_NOT_TAKEN"|"KNOWN_RATE_REUSED"
 |"TARGET_FRACTION_COMPLEMENT"|"FULL_CYCLE_ROUNDED_DOWN"|"FULL_CYCLE_ROUNDED_UP"
 |"SHIFT_DURATION_IGNORED"|"OFFSET_IGNORED"|"DEADLINE_TREATED_AS_CYCLE_COUNT"
 |"PLAUSIBLE_SCALE_ERROR";
export interface TmwCp005Option{text:string;value:Rational|string;misconceptionId:TmwCp005MisconceptionId;}
export interface TmwCp005GeneratedQuestion{
 archetypeId:"TMW-001";canonicalProblemId:typeof TMW_CP_005_ID;questionLanguageId:string;solveMode:TmwCp005SolveMode;
 language:"en";seed:string;stem:string;parameters:TmwCp005Parameters;solution:TmwCp005Solution;
 options:string[];optionAudit:TmwCp005Option[];correctIndex:number;
 explanation:{
  opening:string;formula:string;steps:string[];
  shortcut:{title:string;steps:string[]};
  commonTrap:{optionLabel:string;optionText:string;misconceptionId:Exclude<TmwCp005MisconceptionId,"CORRECT">;explanation:string};
  conclusion:string;
 };
 mathematicalFingerprint:string;validation:{valid:boolean;errors:string[]};publiclyPublishable:false;
}
