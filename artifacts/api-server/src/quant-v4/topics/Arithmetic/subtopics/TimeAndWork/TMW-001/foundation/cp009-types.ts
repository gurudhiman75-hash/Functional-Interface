import type { Rational, TmwDifficulty } from "./types";
export const TMW_CP_009_ID="TMW-CP-009" as const;
export const TMW_CP_009_SOLVE_MODES=[
 "findFillTimeFromPositiveInlets",
 "findFillTimeFromMixedPipes",
 "findEmptyTimeFromMixedPipes",
 "findNetFractionChangedInGivenTime",
 "findMissingInletTime",
 "findMissingOutletOrLeakTime",
 "findIdenticalPipeCountForTargetTime",
 "findTankCapacityFromFlowAndTime",
 "findFlowRateFromCapacityAndTime",
 "findTimeFromCapacityAndNetFlow",
 "convertFlowUnits",
 "findTimeFromInitialLevelToBoundary",
 "findFinalLevelAfterGivenTime",
 "compareTankCapacities",
 "findReducedPipeEfficiencyFromChangedTime",
 "findBlockagePercentFromChangedTime",
 "findNetRateDirection",
 "findBoundaryEventFeasibility",
] as const;
export type TmwCp009SolveMode=(typeof TMW_CP_009_SOLVE_MODES)[number];
export type TmwCp009AnswerType="TIME"|"FRACTION"|"COUNT"|"CAPACITY"|"FLOW_RATE"|"LEVEL"|"RATIO"|"PERCENT"|"DIRECTION"|"DECISION";
export type TmwCp009RuleId="TMW_POSITIVE_FLOW"|"TMW_SIGNED_FLOW"|"TMW_COMPONENT_EXTRACTION"|"TMW_PIPE_COUNT"|"TMW_PHYSICAL_FLOW"|"TMW_INITIAL_LEVEL"|"TMW_CAPACITY_COMPARISON"|"TMW_FLOW_EFFICIENCY"|"TMW_DIRECTION_FEASIBILITY";
export interface TmwCp009RegistryEntry{qlId:string;cpId:typeof TMW_CP_009_ID;solveMode:TmwCp009SolveMode;answerType:TmwCp009AnswerType;ruleId:TmwCp009RuleId;difficulty:TmwDifficulty;publiclyPublishable:false;}
export type TmwCp009PipeKind="INLET"|"OUTLET"|"LEAK";
export interface TmwCp009Pipe{label:string;kind:TmwCp009PipeKind;soloTime:Rational;}
export type TmwCp009Boundary="FULL"|"EMPTY";
export type TmwCp009FlowUnit="LITRES_PER_HOUR"|"LITRES_PER_MINUTE";
export interface TmwCp009Context{setting:string;tankLabel:string;liquid:string;timeUnit:"hour";capacityUnit:"litres";}
export interface TmwCp009ComparisonState{flowA:Rational;timeA:Rational;flowB:Rational;timeB:Rational;}
export interface TmwCp009Parameters{
 context:TmwCp009Context;
 pipes:TmwCp009Pipe[];
 duration?:Rational;
 initialLevel?:Rational;
 targetBoundary?:TmwCp009Boundary;
 unknownPipeIndex?:number;
 identicalPipeSoloTime?:Rational;
 targetCompletionTime?:Rational;
 capacity?:Rational;
 physicalFlow?:Rational;
 physicalTime?:Rational;
 sourceFlowUnit?:TmwCp009FlowUnit;
 targetFlowUnit?:TmwCp009FlowUnit;
 comparison?:TmwCp009ComparisonState;
 originalTime?:Rational;
 changedTime?:Rational;
 decisionWindow?:Rational;
}
export interface TmwCp009Solution{answerValues:Rational[];answerType:TmwCp009AnswerType;answerText:string;answerKey:string;formulaLatex:string;workedLatex:string[];}
export type TmwCp009MisconceptionId="CORRECT"|"OTHER_PIPES_IGNORED"|"PIPE_TIMES_ADDED"|"OUTFLOW_ADDED_AS_INFLOW"|"INFLOW_SUBTRACTED_FROM_OUTFLOW_WRONGLY"|"TIME_USED_AS_RATE"|"DURATION_IGNORED"|"INITIAL_LEVEL_IGNORED"|"REMAINING_LEVEL_IGNORED"|"KNOWN_PIPE_SIGN_IGNORED"|"COUNT_RATIO_REVERSED"|"CAPACITY_REPORTED_AS_FLOW"|"CAPACITY_FLOW_TIME_REVERSED"|"FLOW_UNIT_NOT_CONVERTED"|"RATIO_ORDER_REVERSED"|"TIME_EFFICIENCY_INVERSION_MISSED"|"BLOCKAGE_REPORTED_AS_REMAINING_EFFICIENCY"|"DIRECTION_FROM_PIPE_COUNT"|"BOUNDARY_TIME_NOT_CHECKED"|"PLAUSIBLE_SCALE_ERROR";
export interface TmwCp009Option{text:string;key:string;misconceptionId:TmwCp009MisconceptionId;}
export interface TmwCp009LearningShortcut{title:string;steps:string[];}
export interface TmwCp009CommonTrap{optionLabel:string;optionText:string;misconceptionId:Exclude<TmwCp009MisconceptionId,"CORRECT">;explanation:string;}
export interface TmwCp009Explanation{opening:string;formula:string;givens:string[];steps:string[];shortcut:TmwCp009LearningShortcut;commonTrap:TmwCp009CommonTrap;conclusion:string;}
export interface TmwCp009GeneratedQuestion{archetypeId:"TMW-001";canonicalProblemId:typeof TMW_CP_009_ID;questionLanguageId:string;solveMode:TmwCp009SolveMode;language:"en";seed:string;stem:string;parameters:TmwCp009Parameters;solution:TmwCp009Solution;options:string[];optionAudit:TmwCp009Option[];correctIndex:number;explanation:TmwCp009Explanation;mathematicalFingerprint:string;validation:{valid:boolean;errors:string[]};publiclyPublishable:false;}
