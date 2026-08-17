import type { TmwCp004RegistryEntry } from "./cp004-types";
const entries:Array<Omit<TmwCp004RegistryEntry,"qlId">> = [
 {cpId:"TMW-CP-004",solveMode:"findRemainingWorkAfterInitialPhase",answerType:"FRACTION",ruleId:"TMW_STAGE_LEDGER",difficulty:"Easy",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findWorkCompletedBeforeEvent",answerType:"FRACTION",ruleId:"TMW_STAGE_LEDGER",difficulty:"Easy",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findTotalTimeWhenFirstAgentStartsThenSecondFinishes",answerType:"TIME",ruleId:"TMW_STAGE_HANDOFF",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findTotalTimeWhenTeamStartsThenOneLeaves",answerType:"TIME",ruleId:"TMW_STAGE_LEDGER",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findTotalTimeWhenOneStartsThenAnotherJoins",answerType:"TIME",ruleId:"TMW_STAGE_LEDGER",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findTotalTimeWithStaggeredJoins",answerType:"TIME",ruleId:"TMW_STAGE_LEDGER",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findTotalTimeWithStaggeredExits",answerType:"TIME",ruleId:"TMW_STAGE_LEDGER",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findTotalTimeWithJoinAndLeaveEvents",answerType:"TIME",ruleId:"TMW_STAGE_LEDGER",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findJoinTimeFromFinalCompletion",answerType:"TIME",ruleId:"TMW_STAGE_INVERSE_EVENT",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findLeaveTimeFromFinalCompletion",answerType:"TIME",ruleId:"TMW_STAGE_INVERSE_EVENT",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findUnknownInitialPhaseDuration",answerType:"TIME",ruleId:"TMW_STAGE_INVERSE_EVENT",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findUnknownFinalPhaseDuration",answerType:"TIME",ruleId:"TMW_STAGE_INVERSE_EVENT",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findReplacementWorkerRate",answerType:"RATE",ruleId:"TMW_STAGE_HANDOFF",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findReplacementWorkerTime",answerType:"TIME",ruleId:"TMW_STAGE_HANDOFF",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findCompletionWithIdleInterval",answerType:"TIME",ruleId:"TMW_STAGE_HANDOFF",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findCompletionWithChangedDailyHours",answerType:"TIME",ruleId:"TMW_STAGE_RATE_CHANGE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findCompletionWithMidProjectEfficiencyChange",answerType:"TIME",ruleId:"TMW_STAGE_RATE_CHANGE",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findCompletionWithNegativeWorkerActivatedLater",answerType:"TIME",ruleId:"TMW_STAGE_SIGNED_RATE",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findEventTimeAtSpecifiedCompletionFraction",answerType:"TIME",ruleId:"TMW_STAGE_INVERSE_EVENT",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findRequiredRemainingRateForDeadline",answerType:"RATE",ruleId:"TMW_STAGE_INVERSE_EVENT",difficulty:"Medium",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findWorkerCountAddedAfterPartialProgress",answerType:"COUNT",ruleId:"TMW_STAGE_WORKFORCE_EVENT",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findWorkerCountRemovedAfterPartialProgress",answerType:"COUNT",ruleId:"TMW_STAGE_WORKFORCE_EVENT",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findDelayAfterWorkerLeaves",answerType:"TIME",ruleId:"TMW_STAGE_COMPARISON",difficulty:"Hard",publiclyPublishable:false},
 {cpId:"TMW-CP-004",solveMode:"findEarlyCompletionAfterWorkerJoins",answerType:"TIME",ruleId:"TMW_STAGE_COMPARISON",difficulty:"Hard",publiclyPublishable:false},
];
export const TMW_CP004_REGISTRY:TmwCp004RegistryEntry[] = entries.map((entry,index)=>({...entry,qlId:`TMW-QL-${String(index+58).padStart(3,"0")}`}));
export function getTmwCp004Entry(qlId:string){const e=TMW_CP004_REGISTRY.find(x=>x.qlId===qlId);if(!e)throw new Error(`Unknown TMW-CP-004 question language: ${qlId}`);return e;}
