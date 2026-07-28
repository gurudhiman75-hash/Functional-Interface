import { TMW_CP_009_ID, type TmwCp009RegistryEntry } from "./cp009-types";
export const TMW_CP009_REGISTRY:readonly TmwCp009RegistryEntry[]=[
 {qlId:"TMW-QL-157",cpId:TMW_CP_009_ID,solveMode:"findFillTimeFromPositiveInlets",answerType:"TIME",ruleId:"TMW_POSITIVE_FLOW",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-158",cpId:TMW_CP_009_ID,solveMode:"findFillTimeFromMixedPipes",answerType:"TIME",ruleId:"TMW_SIGNED_FLOW",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-159",cpId:TMW_CP_009_ID,solveMode:"findEmptyTimeFromMixedPipes",answerType:"TIME",ruleId:"TMW_SIGNED_FLOW",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-160",cpId:TMW_CP_009_ID,solveMode:"findNetFractionChangedInGivenTime",answerType:"FRACTION",ruleId:"TMW_SIGNED_FLOW",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-161",cpId:TMW_CP_009_ID,solveMode:"findMissingInletTime",answerType:"TIME",ruleId:"TMW_COMPONENT_EXTRACTION",difficulty:"Hard",publiclyPublishable:false},
 {qlId:"TMW-QL-162",cpId:TMW_CP_009_ID,solveMode:"findMissingOutletOrLeakTime",answerType:"TIME",ruleId:"TMW_COMPONENT_EXTRACTION",difficulty:"Hard",publiclyPublishable:false},
 {qlId:"TMW-QL-163",cpId:TMW_CP_009_ID,solveMode:"findIdenticalPipeCountForTargetTime",answerType:"COUNT",ruleId:"TMW_PIPE_COUNT",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-164",cpId:TMW_CP_009_ID,solveMode:"findTankCapacityFromFlowAndTime",answerType:"CAPACITY",ruleId:"TMW_PHYSICAL_FLOW",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-165",cpId:TMW_CP_009_ID,solveMode:"findFlowRateFromCapacityAndTime",answerType:"FLOW_RATE",ruleId:"TMW_PHYSICAL_FLOW",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-166",cpId:TMW_CP_009_ID,solveMode:"findTimeFromCapacityAndNetFlow",answerType:"TIME",ruleId:"TMW_PHYSICAL_FLOW",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-167",cpId:TMW_CP_009_ID,solveMode:"convertFlowUnits",answerType:"FLOW_RATE",ruleId:"TMW_PHYSICAL_FLOW",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-168",cpId:TMW_CP_009_ID,solveMode:"findTimeFromInitialLevelToBoundary",answerType:"TIME",ruleId:"TMW_INITIAL_LEVEL",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-169",cpId:TMW_CP_009_ID,solveMode:"findFinalLevelAfterGivenTime",answerType:"LEVEL",ruleId:"TMW_INITIAL_LEVEL",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-170",cpId:TMW_CP_009_ID,solveMode:"compareTankCapacities",answerType:"RATIO",ruleId:"TMW_CAPACITY_COMPARISON",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-171",cpId:TMW_CP_009_ID,solveMode:"findReducedPipeEfficiencyFromChangedTime",answerType:"RATIO",ruleId:"TMW_FLOW_EFFICIENCY",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-172",cpId:TMW_CP_009_ID,solveMode:"findBlockagePercentFromChangedTime",answerType:"PERCENT",ruleId:"TMW_FLOW_EFFICIENCY",difficulty:"Medium",publiclyPublishable:false},
 {qlId:"TMW-QL-173",cpId:TMW_CP_009_ID,solveMode:"findNetRateDirection",answerType:"DIRECTION",ruleId:"TMW_DIRECTION_FEASIBILITY",difficulty:"Easy",publiclyPublishable:false},
 {qlId:"TMW-QL-174",cpId:TMW_CP_009_ID,solveMode:"findBoundaryEventFeasibility",answerType:"DECISION",ruleId:"TMW_DIRECTION_FEASIBILITY",difficulty:"Hard",publiclyPublishable:false},
] as const;
export function getTmwCp009Entry(qlId:string):TmwCp009RegistryEntry{const entry=TMW_CP009_REGISTRY.find(item=>item.qlId===qlId);if(!entry)throw new Error(`Unknown TMW-CP-009 QL: ${qlId}`);return entry;}
