import { TMW_CP_006_ID, type TmwCp006RegistryEntry } from "./cp006-types";

export const TMW_CP006_REGISTRY:readonly TmwCp006RegistryEntry[] = [
  {qlId:"TMW-QL-106",cpId:TMW_CP_006_ID,solveMode:"findRequiredResourceCount",answerType:"COUNT",ruleId:"TMW_EQUIVALENT_STATES",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-107",cpId:TMW_CP_006_ID,solveMode:"findRequiredDays",answerType:"TIME",ruleId:"TMW_EQUIVALENT_STATES",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-108",cpId:TMW_CP_006_ID,solveMode:"findRequiredDailyHours",answerType:"HOURS",ruleId:"TMW_EQUIVALENT_STATES",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-109",cpId:TMW_CP_006_ID,solveMode:"findRelativeEfficiency",answerType:"EFFICIENCY",ruleId:"TMW_EQUIVALENT_STATES",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-110",cpId:TMW_CP_006_ID,solveMode:"findWorkQuantity",answerType:"WORK",ruleId:"TMW_PRODUCTION_SCALING",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-111",cpId:TMW_CP_006_ID,solveMode:"findWorkQuantityRatio",answerType:"RATIO",ruleId:"TMW_EQUIVALENT_STATES",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-112",cpId:TMW_CP_006_ID,solveMode:"findAdditionalWorkersForDeadline",answerType:"COUNT",ruleId:"TMW_CHANGE_COUNT",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-113",cpId:TMW_CP_006_ID,solveMode:"findWorkersRemovedForDelay",answerType:"COUNT",ruleId:"TMW_CHANGE_COUNT",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-114",cpId:TMW_CP_006_ID,solveMode:"findOriginalWorkforceFromChangedSchedule",answerType:"COUNT",ruleId:"TMW_CHANGE_COUNT",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-115",cpId:TMW_CP_006_ID,solveMode:"findRemainingDaysFromActualProgress",answerType:"TIME",ruleId:"TMW_PROGRESS_RECOVERY",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-116",cpId:TMW_CP_006_ID,solveMode:"findExtraWorkersFromPlannedVsActualProgress",answerType:"COUNT",ruleId:"TMW_PROGRESS_RECOVERY",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-117",cpId:TMW_CP_006_ID,solveMode:"findPercentWorkCompletedFromResourceHours",answerType:"PERCENT",ruleId:"TMW_RESOURCE_TIME",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-118",cpId:TMW_CP_006_ID,solveMode:"findPercentScheduleDelay",answerType:"PERCENT",ruleId:"TMW_SCHEDULE_VARIANCE",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-119",cpId:TMW_CP_006_ID,solveMode:"findOvertimeHoursForDeadline",answerType:"HOURS",ruleId:"TMW_SCHEDULE_VARIANCE",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-120",cpId:TMW_CP_006_ID,solveMode:"findShiftCountForProductionTarget",answerType:"SHIFT",ruleId:"TMW_PRODUCTION_SCALING",difficulty:"Easy",publiclyPublishable:false},
  {qlId:"TMW-QL-121",cpId:TMW_CP_006_ID,solveMode:"findDimensionalWorkRatio",answerType:"RATIO",ruleId:"TMW_DIMENSIONAL_WORK",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-122",cpId:TMW_CP_006_ID,solveMode:"findWorkersForChangedDimensions",answerType:"COUNT",ruleId:"TMW_DIMENSIONAL_WORK",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-123",cpId:TMW_CP_006_ID,solveMode:"findDaysForChangedDimensions",answerType:"TIME",ruleId:"TMW_DIMENSIONAL_WORK",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-124",cpId:TMW_CP_006_ID,solveMode:"findResourceDurationAfterPopulationChange",answerType:"TIME",ruleId:"TMW_RESOURCE_STOCK",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-125",cpId:TMW_CP_006_ID,solveMode:"findCompletionTimeAfterAbsenteeism",answerType:"TIME",ruleId:"TMW_SCHEDULE_VARIANCE",difficulty:"Medium",publiclyPublishable:false},
  {qlId:"TMW-QL-126",cpId:TMW_CP_006_ID,solveMode:"findCompletionWithBatchWorkerAdditions",answerType:"TIME",ruleId:"TMW_BATCH_SERIES",difficulty:"Hard",publiclyPublishable:false},
  {qlId:"TMW-QL-127",cpId:TMW_CP_006_ID,solveMode:"findEquivalentResourceTime",answerType:"RESOURCE_TIME",ruleId:"TMW_RESOURCE_TIME",difficulty:"Easy",publiclyPublishable:false},
] as const;

export function getTmwCp006Entry(qlId:string):TmwCp006RegistryEntry {
  const entry=TMW_CP006_REGISTRY.find(candidate=>candidate.qlId===qlId);
  if(!entry)throw new Error(`Unknown TMW-CP-006 QL: ${qlId}`);
  return entry;
}
