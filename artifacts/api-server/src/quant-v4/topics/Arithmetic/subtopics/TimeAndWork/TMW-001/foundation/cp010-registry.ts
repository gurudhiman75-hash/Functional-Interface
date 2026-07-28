import type { TmwCp010RegistryEntry } from './cp010-types';
export const TMW_CP010_REGISTRY:readonly TmwCp010RegistryEntry[]=[
 {qlId:'TMW-QL-175',cpId:'TMW-CP-010',solveMode:'findCompletionAfterDelayedActivation',answerType:'TIME',ruleId:'TMW_STAGE_EVENT_LEDGER',difficulty:'Medium',publiclyPublishable:false},
 {qlId:'TMW-QL-176',cpId:'TMW-CP-010',solveMode:'findCompletionAfterDelayedDeactivation',answerType:'TIME',ruleId:'TMW_STAGE_EVENT_LEDGER',difficulty:'Medium',publiclyPublishable:false},
 {qlId:'TMW-QL-177',cpId:'TMW-CP-010',solveMode:'findCompletionWithMultipleStaggeredEvents',answerType:'TIME',ruleId:'TMW_STAGE_EVENT_LEDGER',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-178',cpId:'TMW-CP-010',solveMode:'findCompletionWithInterruptedFlow',answerType:'TIME',ruleId:'TMW_STAGE_EVENT_LEDGER',difficulty:'Medium',publiclyPublishable:false},
 {qlId:'TMW-QL-179',cpId:'TMW-CP-010',solveMode:'findCompletionFromPartialLevelAndStages',answerType:'TIME',ruleId:'TMW_STAGE_EVENT_LEDGER',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-180',cpId:'TMW-CP-010',solveMode:'findFinalLevelAfterStagedSchedule',answerType:'LEVEL',ruleId:'TMW_STAGE_EVENT_LEDGER',difficulty:'Medium',publiclyPublishable:false},
 {qlId:'TMW-QL-181',cpId:'TMW-CP-010',solveMode:'findCompletionAfterThresholdSwitch',answerType:'TIME',ruleId:'TMW_LEVEL_TRIGGER',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-182',cpId:'TMW-CP-010',solveMode:'findEventTimeFromKnownCompletion',answerType:'TIME',ruleId:'TMW_STAGE_INVERSE',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-183',cpId:'TMW-CP-010',solveMode:'findRequiredFinalStageRate',answerType:'FLOW_RATE',ruleId:'TMW_STAGE_INVERSE',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-184',cpId:'TMW-CP-010',solveMode:'findCapacityFromStagedPhysicalFlows',answerType:'CAPACITY',ruleId:'TMW_STAGED_PHYSICAL_FLOW',difficulty:'Medium',publiclyPublishable:false},
 {qlId:'TMW-QL-185',cpId:'TMW-CP-010',solveMode:'findCompletionWithAlternatingPipes',answerType:'TIME',ruleId:'TMW_CYCLE_ACCUMULATION',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-186',cpId:'TMW-CP-010',solveMode:'findCompletionWithPeriodicSchedule',answerType:'TIME',ruleId:'TMW_CYCLE_ACCUMULATION',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-187',cpId:'TMW-CP-010',solveMode:'findAutomaticLevelControlCompletion',answerType:'TIME',ruleId:'TMW_LEVEL_TRIGGER',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-188',cpId:'TMW-CP-010',solveMode:'findCompletionFromArbitraryCyclePhase',answerType:'TIME',ruleId:'TMW_CYCLE_ACCUMULATION',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-189',cpId:'TMW-CP-010',solveMode:'findFullCycleCountToBoundary',answerType:'COUNT',ruleId:'TMW_CYCLE_ACCUMULATION',difficulty:'Medium',publiclyPublishable:false},
 {qlId:'TMW-QL-190',cpId:'TMW-CP-010',solveMode:'findTerminalActiveSegment',answerType:'SEGMENT',ruleId:'TMW_CYCLE_ACCUMULATION',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-191',cpId:'TMW-CP-010',solveMode:'findBoundaryEventTimeUnderSchedule',answerType:'TIME',ruleId:'TMW_CYCLE_ACCUMULATION',difficulty:'Hard',publiclyPublishable:false},
 {qlId:'TMW-QL-192',cpId:'TMW-CP-010',solveMode:'findScheduleAdjustmentForDeadline',answerType:'TIME',ruleId:'TMW_STAGE_INVERSE',difficulty:'Hard',publiclyPublishable:false},
] as const;
const byId=new Map(TMW_CP010_REGISTRY.map(x=>[x.qlId,x]));
export function getTmwCp010Entry(id:string){const x=byId.get(id);if(!x)throw new Error(`Unknown CP-010 QL: ${id}`);return x;}
