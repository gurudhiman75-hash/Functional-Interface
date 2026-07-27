import { divide, equals, formatRational, rational } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp006Parameters, TmwCp006RegistryEntry } from "./cp006-types";

function number(value:Rational):string{return formatRational(value);}
function noun(value:Rational,singular:string,plural:string):string{return equals(value,rational(1))?singular:plural;}
function resourceCount(p:TmwCp006Parameters,value:Rational):string{return `${number(value)} ${noun(value,p.context.resourceSingular,p.context.resourcePlural)}`;}
function days(value:Rational):string{return `${number(value)} ${noun(value,"day","days")}`;}
function hours(value:Rational):string{return `${number(value)} ${noun(value,"hour","hours")} per day`;}
function isMachineContext(p:TmwCp006Parameters):boolean{return p.context.resourceTimeUnit.endsWith("hours");}
function resourceDuration(p:TmwCp006Parameters):string{
  const value=p.stateA.days;
  return isMachineContext(p)?`${number(value)} ${noun(value,"hour","hours")}`:days(value);
}
function workRelation(p:TmwCp006Parameters):string{
  const ratio=divide(p.stateB.work,p.stateA.work);
  return equals(ratio,rational(1))?"the same amount of work":`${number(ratio)} times the original amount of work`;
}
function efficiencyRelation(p:TmwCp006Parameters):string{
  const ratio=divide(p.stateB.efficiency,p.stateA.efficiency);
  return equals(ratio,rational(1))?"at the same efficiency":`at ${number(ratio)} times the original efficiency`;
}
function dimensions(values:Rational[],labels:string[]):string{return labels.map((label,index)=>`${label} ${number(values[index])} m`).join(", ");}

export function renderTmwCp006Stem(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters):string{
  const a=p.stateA,b=p.stateB,c=p.context;
  switch(entry.solveMode){
    case "findRequiredResourceCount":return `${resourceCount(p,a.resources)}, working ${hours(a.hoursPerDay)}, can complete ${c.jobPhrase} in ${days(a.days)}. How many ${c.resourcePlural} are required to complete ${workRelation(p)} in ${days(b.days)}, working ${hours(b.hoursPerDay)} ${efficiencyRelation(p)}?`;
    case "findRequiredDays":return `${resourceCount(p,a.resources)}, working ${hours(a.hoursPerDay)}, can complete ${c.jobPhrase} in ${days(a.days)}. In how many days will ${resourceCount(p,b.resources)} complete ${workRelation(p)}, working ${hours(b.hoursPerDay)} ${efficiencyRelation(p)}?`;
    case "findRequiredDailyHours":return `${resourceCount(p,a.resources)}, working ${hours(a.hoursPerDay)}, can complete ${c.jobPhrase} in ${days(a.days)}. How many hours per day must ${resourceCount(p,b.resources)} work to complete ${workRelation(p)} in ${days(b.days)} ${efficiencyRelation(p)}?`;
    case "findRelativeEfficiency":return `${resourceCount(p,a.resources)}, working ${hours(a.hoursPerDay)}, can complete ${c.jobPhrase} in ${days(a.days)}. At what multiple of the original efficiency must ${resourceCount(p,b.resources)} work to complete ${workRelation(p)} in ${days(b.days)}, working ${hours(b.hoursPerDay)}?`;
    case "findWorkQuantity":return `${resourceCount(p,a.resources)} produce ${number(a.work)} ${c.outputUnit} in ${number(a.days)} shifts. At the same output per ${c.resourceSingular} per shift, how many ${c.outputUnit} will ${resourceCount(p,b.resources)} produce in ${number(b.days)} shifts?`;
    case "findWorkQuantityRatio":return `One team has ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} for ${days(a.days)}. Another has ${resourceCount(p,b.resources)} working ${hours(b.hoursPerDay)} for ${days(b.days)} ${efficiencyRelation(p)}. Find the ratio of the second team's work to the first team's work.`;
    case "findAdditionalWorkersForDeadline":return `${resourceCount(p,a.resources)} can complete ${c.jobPhrase} in ${days(a.days)}. How many additional ${c.resourcePlural} are needed to complete it in ${days(b.days)}?`;
    case "findWorkersRemovedForDelay":return `${resourceCount(p,a.resources)} can complete ${c.jobPhrase} in ${days(a.days)}. If the completion time may be extended to ${days(b.days)}, how many ${c.resourcePlural} can be removed?`;
    case "findOriginalWorkforceFromChangedSchedule":return `After the workforce was reduced to ${resourceCount(p,b.resources)}, ${c.jobPhrase} took ${days(b.days)} instead of the planned ${days(a.days)}. How many ${c.resourcePlural} were in the original workforce?`;
    case "findRemainingDaysFromActualProgress":return `${resourceCount(p,a.resources)} completed ${number(required(p.completedFraction,"completedFraction"))} of ${c.jobPhrase} in ${days(required(p.elapsedDays,"elapsedDays"))}. If they continue at the same actual pace, how many more days will be required?`;
    case "findExtraWorkersFromPlannedVsActualProgress":return `${resourceCount(p,a.resources)} were scheduled to complete ${c.jobPhrase} in ${days(a.days)}. After ${days(required(p.elapsedDays,"elapsedDays"))}, only ${number(required(p.completedFraction,"completedFraction"))} of the work was complete. If the same actual per-worker rate continues, how many additional ${c.resourcePlural} are required to finish on time?`;
    case "findPercentWorkCompletedFromResourceHours":return `${resourceCount(p,a.resources)}, working ${hours(a.hoursPerDay)}, can complete ${c.jobPhrase} in ${days(a.days)}. What percentage of the work is completed by ${resourceCount(p,b.resources)} working ${hours(b.hoursPerDay)} for ${days(b.days)} at the same efficiency?`;
    case "findPercentScheduleDelay":return `${resourceCount(p,a.resources)} can complete ${c.jobPhrase} in ${days(a.days)}. If only ${resourceCount(p,b.resources)} are available, by what percentage will the completion time increase?`;
    case "findOvertimeHoursForDeadline":return `${resourceCount(p,a.resources)}, working ${hours(a.hoursPerDay)}, can complete ${c.jobPhrase} in ${days(a.days)}. If only ${resourceCount(p,b.resources)} are available but the same deadline must be retained, how many overtime hours per day must each work?`;
    case "findShiftCountForProductionTarget":return `Each ${c.resourceSingular} produces ${number(b.efficiency)} ${c.outputUnit} per shift. How many shifts will ${resourceCount(p,b.resources)} require to produce ${number(b.work)} ${c.outputUnit}?`;
    case "findDimensionalWorkRatio":return `For ${c.jobPhrase}, the original dimensions are ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))}. A second job of the same type has ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}. Assuming work is proportional to the product of these dimensions, find the ratio of the second work quantity to the first.`;
    case "findWorkersForChangedDimensions":return `${resourceCount(p,a.resources)} complete ${c.jobPhrase} with ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))} in ${days(a.days)}. How many ${c.resourcePlural} are needed for one with ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))} in ${days(b.days)}, at the same daily hours and efficiency?`;
    case "findDaysForChangedDimensions":return `${resourceCount(p,a.resources)} complete ${c.jobPhrase} with ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))} in ${days(a.days)}. In how many days will ${resourceCount(p,b.resources)} complete one with ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}, at the same daily hours and efficiency?`;
    case "findResourceDurationAfterPopulationChange":return `The available food is sufficient for ${number(required(p.initialPopulation,"initialPopulation"))} people for ${days(a.days)}. After ${days(required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"))}, the population becomes ${number(required(p.changedPopulation,"changedPopulation"))}. For how many more days will the remaining food last?`;
    case "findCompletionTimeAfterAbsenteeism":return `${resourceCount(p,a.resources)} are scheduled to complete ${c.jobPhrase} in ${days(a.days)}. If ${number(required(p.absentPercent,"absentPercent"))}% remain absent throughout, in how many days will the active workforce complete the work?`;
    case "findCompletionWithBatchWorkerAdditions":return `${resourceCount(p,a.resources)} can complete ${c.jobPhrase} in ${days(a.days)}. Instead, ${number(required(p.initialBatchResources,"initialBatchResources"))} ${c.resourcePlural} start the work and ${number(required(p.batchAddition,"batchAddition"))} more join at the beginning of each following day. In how many days will the work be completed?`;
    case "findEquivalentResourceTime":return `Find the equivalent ${c.resourceTimeUnit} represented by ${resourceCount(p,a.resources)} ${isMachineContext(p)?"operating":"working"} for ${resourceDuration(p)}.`;
  }
}

export function tmwCp006ExplanationOpening(entry:TmwCp006RegistryEntry):string{
  switch(entry.solveMode){
    case "findRequiredResourceCount":return "Keep total work equal after adjusting for days, daily hours and efficiency, then solve for the required resource count.";
    case "findRequiredDays":return "Write the total productive capacity for both arrangements and solve for the new number of days.";
    case "findRequiredDailyHours":return "Balance the two work arrangements and isolate the daily working hours in the new arrangement.";
    case "findRelativeEfficiency":return "Treat efficiency as the missing multiplier in the work equation and solve for it directly.";
    case "findWorkQuantity":return "Compare the two production capacities; output changes in the same ratio as resources and shifts.";
    case "findWorkQuantityRatio":return "Multiply resources, days, hours and efficiency for each team, then compare the two totals.";
    case "findAdditionalWorkersForDeadline":return "First find the total workforce required for the shorter deadline, then subtract the current workforce.";
    case "findWorkersRemovedForDelay":return "Find the workforce needed for the longer schedule, then subtract it from the original workforce.";
    case "findOriginalWorkforceFromChangedSchedule":return "Use the changed workforce and actual duration to rebuild the original planned workforce.";
    case "findRemainingDaysFromActualProgress":return "Use the observed progress to find the actual daily work rate, then apply it to the remaining work.";
    case "findExtraWorkersFromPlannedVsActualProgress":return "Find the actual per-worker rate from the progress so far, then calculate the workforce needed for the remaining time.";
    case "findPercentWorkCompletedFromResourceHours":return "Compare the resource-hours already used with the resource-hours required for the whole work.";
    case "findPercentScheduleDelay":return "Find the revised duration with the smaller workforce, then compare the extra time with the planned duration.";
    case "findOvertimeHoursForDeadline":return "Find the total daily hours needed with the reduced workforce, then subtract the regular daily hours.";
    case "findShiftCountForProductionTarget":return "Find the combined output in one shift and divide the target output by that amount.";
    case "findDimensionalWorkRatio":return "Multiply the relevant dimensions for each job and compare the resulting work quantities.";
    case "findWorkersForChangedDimensions":return "First find how much the physical work increases, then adjust the workforce for the available days.";
    case "findDaysForChangedDimensions":return "First find the physical work ratio, then balance it against the changed workforce to obtain the required days.";
    case "findResourceDurationAfterPopulationChange":return "Convert the remaining stock into person-days after the elapsed period, then divide by the new population.";
    case "findCompletionTimeAfterAbsenteeism":return "Convert the absence percentage into the active workforce and recalculate the completion time.";
    case "findCompletionWithBatchWorkerAdditions":return "Add the workforce used on successive days as an arithmetic series until it equals the required worker-days.";
    case "findEquivalentResourceTime":return "Match the duration unit to the requested resource-time unit, then multiply the resource count by that duration.";
  }
}

export function tmwCp006Conclusion(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,answerText:string):string{
  const c=p.context;
  switch(entry.solveMode){
    case "findRequiredResourceCount":return `Therefore, ${answerText} are required under the revised work schedule.`;
    case "findRequiredDays":return `Therefore, ${resourceCount(p,p.stateB.resources)} will complete the stated work in ${answerText}.`;
    case "findRequiredDailyHours":return `Therefore, each ${c.resourceSingular} must work ${answerText}.`;
    case "findRelativeEfficiency":return `Therefore, the revised team must work at ${answerText}.`;
    case "findWorkQuantity":return `Therefore, the revised production arrangement yields ${answerText}.`;
    case "findWorkQuantityRatio":
    case "findDimensionalWorkRatio":return `Therefore, the required work ratio is ${answerText}.`;
    case "findAdditionalWorkersForDeadline":return `Therefore, ${answerText} must be added to meet the shorter deadline.`;
    case "findWorkersRemovedForDelay":return `Therefore, ${answerText} can be removed under the extended schedule.`;
    case "findOriginalWorkforceFromChangedSchedule":return `Therefore, the original workforce contained ${answerText}.`;
    case "findRemainingDaysFromActualProgress":return `Therefore, the remaining work will take ${answerText} at the observed pace.`;
    case "findExtraWorkersFromPlannedVsActualProgress":return `Therefore, ${answerText} must be added to finish by the planned date.`;
    case "findPercentWorkCompletedFromResourceHours":return `Therefore, the stated resource-hours complete ${answerText} of the work.`;
    case "findPercentScheduleDelay":return `Therefore, the reduced workforce causes a ${answerText} schedule delay.`;
    case "findOvertimeHoursForDeadline":return `Therefore, each remaining ${c.resourceSingular} must work ${answerText}.`;
    case "findShiftCountForProductionTarget":return `Therefore, the production target is reached in ${answerText}.`;
    case "findWorkersForChangedDimensions":return `Therefore, the enlarged job requires ${answerText}.`;
    case "findDaysForChangedDimensions":return `Therefore, the changed job will take ${answerText}.`;
    case "findResourceDurationAfterPopulationChange":return `Therefore, the remaining stock will last ${answerText}.`;
    case "findCompletionTimeAfterAbsenteeism":return `Therefore, the active workforce will complete ${c.jobPhrase} in ${answerText}.`;
    case "findCompletionWithBatchWorkerAdditions":return `Therefore, the batch-addition schedule completes ${c.jobPhrase} in ${answerText}.`;
    case "findEquivalentResourceTime":return `Therefore, the schedule represents ${answerText}.`;
  }
}
