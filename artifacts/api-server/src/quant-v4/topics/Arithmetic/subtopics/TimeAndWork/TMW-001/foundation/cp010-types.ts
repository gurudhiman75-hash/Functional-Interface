import type { Rational, TmwDifficulty } from './types';
import type { TmwCp009Boundary, TmwCp009Context, TmwCp009Pipe } from './cp009-types';
export const TMW_CP_010_ID='TMW-CP-010' as const;
export const TMW_CP_010_SOLVE_MODES=[
 'findCompletionAfterDelayedActivation',
 'findCompletionAfterDelayedDeactivation',
 'findCompletionWithMultipleStaggeredEvents',
 'findCompletionWithInterruptedFlow',
 'findCompletionFromPartialLevelAndStages',
 'findFinalLevelAfterStagedSchedule',
 'findCompletionAfterThresholdSwitch',
 'findEventTimeFromKnownCompletion',
 'findRequiredFinalStageRate',
 'findCapacityFromStagedPhysicalFlows',
 'findCompletionWithAlternatingPipes',
 'findCompletionWithPeriodicSchedule',
 'findAutomaticLevelControlCompletion',
 'findCompletionFromArbitraryCyclePhase',
 'findFullCycleCountToBoundary',
 'findTerminalActiveSegment',
 'findBoundaryEventTimeUnderSchedule',
 'findScheduleAdjustmentForDeadline',
] as const;
export type TmwCp010SolveMode=(typeof TMW_CP_010_SOLVE_MODES)[number];
export type TmwCp010AnswerType='TIME'|'LEVEL'|'FLOW_RATE'|'CAPACITY'|'COUNT'|'SEGMENT';
export type TmwCp010RuleId='TMW_STAGE_EVENT_LEDGER'|'TMW_CYCLE_ACCUMULATION'|'TMW_LEVEL_TRIGGER'|'TMW_STAGE_INVERSE'|'TMW_STAGED_PHYSICAL_FLOW';
export interface TmwCp010RegistryEntry{qlId:string;cpId:typeof TMW_CP_010_ID;solveMode:TmwCp010SolveMode;answerType:TmwCp010AnswerType;ruleId:TmwCp010RuleId;difficulty:TmwDifficulty;publiclyPublishable:false;}
export interface TmwCp010Stage{label:string;duration?:Rational;pipes:TmwCp009Pipe[];idle?:boolean;}
export interface TmwCp010CycleSegment{label:string;duration:Rational;pipes:TmwCp009Pipe[];}
export interface TmwCp010PhysicalStage{label:string;duration:Rational;netFlowLitresPerHour:Rational;}
export interface TmwCp010LevelControl{lower:Rational;upper:Rational;offPipes:TmwCp009Pipe[];onPipes:TmwCp009Pipe[];targetUpperHits:number;}
export interface TmwCp010Parameters{
 context:TmwCp009Context;
 initialLevel:Rational;
 targetBoundary?:TmwCp009Boundary;
 targetLevel?:Rational;
 thresholdLevel?:Rational;
 stages?:TmwCp010Stage[];
 cycle?:TmwCp010CycleSegment[];
 startingCycleIndex?:number;
 knownCompletionTime?:Rational;
 unknownStageIndex?:number;
 expectedEventKind?:'OPEN'|'CLOSE'|'REPAIR'|'SHIFT';
 physicalStages?:TmwCp010PhysicalStage[];
 capacityFraction?:Rational;
 levelControl?:TmwCp010LevelControl;
 requiredDeadline?:Rational;
 adjustmentBaseDuration?:Rational;
 adjustmentDirection?:'EARLIER'|'LATER';
}
export interface TmwCp010Solution{answerValues:Rational[];answerType:TmwCp010AnswerType;answerText:string;answerKey:string;formulaLatex:string;workedLatex:string[];terminalSegmentIndex?:number;}
export type TmwCp010MisconceptionId='CORRECT'|'PRE_EVENT_STAGE_IGNORED'|'POST_EVENT_STAGE_IGNORED'|'EVENT_TIME_ADDED_TWICE'|'PIPE_SIGN_IGNORED'|'INITIAL_LEVEL_IGNORED'|'IDLE_INTERVAL_IGNORED'|'THRESHOLD_SWITCH_IGNORED'|'CYCLE_ORDER_REVERSED'|'ONE_FULL_CYCLE_TOO_MANY'|'ONE_FULL_CYCLE_TOO_FEW'|'TERMINAL_FRACTION_IGNORED'|'WRONG_TERMINAL_SEGMENT'|'BOUNDARY_TIME_NOT_CHECKED'|'PHYSICAL_STAGE_OMITTED'|'INVERSE_STAGE_NOT_ISOLATED'|'STAGE_DURATION_COMPLEMENT_USED'|'ORIGINAL_EVENT_TIME_REPORTED'|'PHYSICAL_DURATION_IGNORED'|'COMPLEMENT_LEVEL_REPORTED'|'CONTROL_CYCLE_COUNT_IGNORED'|'RATE_TIME_RECIPROCAL_ERROR'|'PLAUSIBLE_SCALE_ERROR';
export interface TmwCp010Option{text:string;key:string;misconceptionId:TmwCp010MisconceptionId;}
export interface TmwCp010Shortcut{title:string;steps:string[];}
export interface TmwCp010CommonTrap{optionLabel:string;optionText:string;misconceptionId:Exclude<TmwCp010MisconceptionId,'CORRECT'>;explanation:string;}
export interface TmwCp010Explanation{opening:string;formula:string;givens:string[];steps:string[];shortcut:TmwCp010Shortcut;commonTrap:TmwCp010CommonTrap;conclusion:string;}
export interface TmwCp010GeneratedQuestion{archetypeId:'TMW-001';canonicalProblemId:typeof TMW_CP_010_ID;questionLanguageId:string;solveMode:TmwCp010SolveMode;language:'en';seed:string;stem:string;parameters:TmwCp010Parameters;solution:TmwCp010Solution;options:string[];optionAudit:TmwCp010Option[];correctIndex:number;explanation:TmwCp010Explanation;mathematicalFingerprint:string;validation:{valid:boolean;errors:string[]};publiclyPublishable:false;}
