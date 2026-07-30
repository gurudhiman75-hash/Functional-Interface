import type { TmwCp006RegistryEntry } from "./cp006-types";

export function tmwCp006KeyRule(entry:TmwCp006RegistryEntry):string{
  switch(entry.ruleId){
    case "TMW_EQUIVALENT_STATES":return "Use the universal MDH/W rule, generalised as \\(\\frac{NDHE}{W}=\\text{constant}\\), where \\(N\\) is the number of resources, \\(D\\) is days, \\(H\\) is daily hours, \\(E\\) is relative efficiency and \\(W\\) is work quantity.";
    case "TMW_CHANGE_COUNT":return "For unchanged work and efficiency, total productive capacity \\(NDH\\) remains equal; first find the revised total workforce and only then calculate the number added or removed.";
    case "TMW_PROGRESS_RECOVERY":return "When actual progress is given, derive the observed work rate from the completed fraction and elapsed time before planning the remaining phase.";
    case "TMW_SCHEDULE_VARIANCE":return "For the same work, workforce, time and daily hours are inversely related through the equal-capacity rule \\(N_1D_1H_1=N_2D_2H_2\\).";
    case "TMW_PRODUCTION_SCALING":return "When per-resource output is unchanged, total production is proportional to resource count multiplied by the number of shifts.";
    case "TMW_DIMENSIONAL_WORK":return "For walls, roads, masonry and excavation, work quantity is proportional to the product of the dimensions that determine area or volume.";
    case "TMW_RESOURCE_STOCK":return "Food and similar stock questions use person-days conservation: remaining stock equals population multiplied by the number of days it can support.";
    case "TMW_BATCH_SERIES":return "When the workforce increases by the same number each day, add the workforce used on each day. For \\(n\\) days, the total is \\(S_n=\\frac{n}{2}[2a+(n-1)d]\\).";
    case "TMW_RESOURCE_TIME":return "Equivalent resource-time is the direct product of resource count and duration, with matching units such as worker-days or machine-hours.";
  }
}
