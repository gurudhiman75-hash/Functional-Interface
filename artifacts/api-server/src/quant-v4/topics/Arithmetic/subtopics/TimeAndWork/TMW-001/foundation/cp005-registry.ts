import type { TmwCp005RegistryEntry } from "./cp005-types";
const entries:Array<Omit<TmwCp005RegistryEntry,"qlId">>=[
 {cpId:"TMW-CP-005",solveMode:"findCompletionTimeForTwoAgentAlternationStartingA",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionTimeForTwoAgentAlternationStartingB",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionTimeForMultiDayCycle",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionTimeForThreeAgentCycle",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionDayAndTerminalFraction",answerType:"TIME",ruleId:"TMW_CYCLE_STATE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findWorkAfterGivenNumberOfCycles",answerType:"FRACTION",ruleId:"TMW_CYCLE_STATE",difficulty:"Easy",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findRemainingWorkAfterFullCycles",answerType:"FRACTION",ruleId:"TMW_CYCLE_STATE",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findTerminalAgent",answerType:"AGENT",ruleId:"TMW_CYCLE_STATE",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findStartingAgentFromCompletionCondition",answerType:"AGENT",ruleId:"TMW_CYCLE_INVERSE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findUnknownRateFromAlternatingCompletion",answerType:"RATE",ruleId:"TMW_CYCLE_INVERSE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findUnknownTimeFromAlternatingCompletion",answerType:"TIME",ruleId:"TMW_CYCLE_INVERSE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWhenHelperWorksEveryNthDay",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWhenAgentRestsEveryNthDay",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWithWeekendOrHolidayPattern",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWithUnequalShiftDurations",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWithTwoDaysOnOneDayOffPattern",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWithPeriodicNegativeWork",answerType:"TIME",ruleId:"TMW_CYCLE_SIGNED_RATE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWithRepeatedJoinLeaveCycle",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCycleCountToReachSpecifiedFraction",answerType:"COUNT",ruleId:"TMW_CYCLE_STATE",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findTimeFromArbitraryCyclePhase",answerType:"TIME",ruleId:"TMW_CYCLE_COMPLETION",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findExactBoundaryCompletion",answerType:"TIME",ruleId:"TMW_CYCLE_STATE",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findCompletionWithinCycleSegment",answerType:"TIME",ruleId:"TMW_CYCLE_STATE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findOutputUnderPeriodicMachineSchedule",answerType:"OUTPUT",ruleId:"TMW_CYCLE_OUTPUT",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-005",solveMode:"findRequiredCycleRateForDeadline",answerType:"RATE",ruleId:"TMW_CYCLE_INVERSE",difficulty:"Hard",publiclyPublishable:false},
];
export const TMW_CP005_REGISTRY:TmwCp005RegistryEntry[]=entries.map((entry,index)=>({...entry,qlId:`TMW-QL-${String(index+82).padStart(3,"0")}`}));
export function getTmwCp005Entry(qlId:string):TmwCp005RegistryEntry{const entry=TMW_CP005_REGISTRY.find(item=>item.qlId===qlId);if(!entry)throw new Error(`Unknown TMW-CP-005 question language: ${qlId}`);return entry;}
