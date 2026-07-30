import { divide, equals, formatRational, rational } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp006CommonTrap, TmwCp006LearningShortcut, TmwCp006Parameters, TmwCp006RegistryEntry } from "./cp006-types";

interface ScenarioProfile {
  setting:string;
  task:string;
}

function profile(jobPhrase:string):ScenarioProfile{
  switch(jobPhrase){
    case "a boundary wall":return {setting:"a municipal construction site",task:"the boundary-wall project"};
    case "a road-repair contract":return {setting:"a highway maintenance project",task:"the road-repair contract"};
    case "a document-verification batch":return {setting:"a bank verification centre",task:"the document-verification backlog"};
    case "a packaging order":return {setting:"a warehouse distribution centre",task:"a large logistics order"};
    case "a painting contract":return {setting:"a commercial-complex painting site",task:"the painting contract"};
    case "an inspection assignment":return {setting:"a quality-control department",task:"the inspection assignment"};
    case "a component-production order":return {setting:"an auto-component factory",task:"the component-production order"};
    case "a printing order":return {setting:"a commercial printing press",task:"the printing order"};
    case "a bottling target":return {setting:"a beverage bottling plant",task:"the bottling target"};
    case "an assembly target":return {setting:"an electronics assembly workshop",task:"the assembly target"};
    case "a wall face":return {setting:"a building-construction site",task:"the wall-plastering job"};
    case "a road surface":return {setting:"a highway construction site",task:"the road-surfacing job"};
    case "a masonry wall":return {setting:"a masonry project",task:"the wall-construction job"};
    case "an excavation pit":return {setting:"an excavation site",task:"the excavation job"};
    default:return {setting:"a project site",task:jobPhrase};
  }
}

function number(value:Rational):string{return formatRational(value);}
function noun(value:Rational,singular:string,plural:string):string{return equals(value,rational(1))?singular:plural;}
function resourceCount(p:TmwCp006Parameters,value:Rational):string{return `${number(value)} ${noun(value,p.context.resourceSingular,p.context.resourcePlural)}`;}
function days(value:Rational):string{return `${number(value)} ${noun(value,"day","days")}`;}
function hours(value:Rational):string{return `${number(value)} ${noun(value,"hour","hours")} a day`;}
function isMachineContext(p:TmwCp006Parameters):boolean{return p.context.resourceTimeUnit.endsWith("hours");}
function resourceDuration(p:TmwCp006Parameters):string{const value=p.stateA.days;return isMachineContext(p)?`${number(value)} ${noun(value,"hour","hours")}`:days(value);}
function workRelation(p:TmwCp006Parameters):string{const ratio=divide(p.stateB.work,p.stateA.work);return equals(ratio,rational(1))?"the same workload":`${number(ratio)} times the original workload`;}
function efficiencyRelation(p:TmwCp006Parameters):string{const ratio=divide(p.stateB.efficiency,p.stateA.efficiency);return equals(ratio,rational(1))?"at the same efficiency":`at ${number(ratio)} times the original efficiency`;}
function dimensions(values:Rational[],labels:string[]):string{return labels.map((label,index)=>`${label} ${number(values[index])} m`).join(", ");}

export function renderTmwCp006ExamStem(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters):string{
  const a=p.stateA,b=p.stateB,c=p.context,s=profile(c.jobPhrase);
  switch(entry.solveMode){
    case "findRequiredResourceCount":return `At ${s.setting}, ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} can complete ${s.task} in ${days(a.days)}. Management now wants ${workRelation(p)} completed in ${days(b.days)}, with each ${c.resourceSingular} working ${hours(b.hoursPerDay)} ${efficiencyRelation(p)}. How many ${c.resourcePlural} must be deployed in total?`;
    case "findRequiredDays":return `At ${s.setting}, ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} can complete ${s.task} in ${days(a.days)}. If ${resourceCount(p,b.resources)} are deployed for ${workRelation(p)}, working ${hours(b.hoursPerDay)} ${efficiencyRelation(p)}, how many days will the assignment take?`;
    case "findRequiredDailyHours":return `At ${s.setting}, ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} finish ${s.task} in ${days(a.days)}. To complete ${workRelation(p)} in ${days(b.days)} with ${resourceCount(p,b.resources)} ${efficiencyRelation(p)}, how many hours a day must each one work?`;
    case "findRelativeEfficiency":return `At ${s.setting}, ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} complete ${s.task} in ${days(a.days)}. A revised arrangement uses ${resourceCount(p,b.resources)} for ${days(b.days)}, working ${hours(b.hoursPerDay)}, to complete ${workRelation(p)}. At what multiple of the original efficiency must the revised group operate?`;
    case "findWorkQuantity":return `At ${s.setting}, ${resourceCount(p,a.resources)} produce ${number(a.work)} ${c.outputUnit} in ${number(a.days)} shifts. If ${resourceCount(p,b.resources)} work for ${number(b.days)} shifts at the same output per ${c.resourceSingular}, how many ${c.outputUnit} will be produced?`;
    case "findWorkQuantityRatio":return `A project manager at ${s.setting} compares two work plans. Plan I uses ${resourceCount(p,a.resources)} for ${days(a.days)}, working ${hours(a.hoursPerDay)}. Plan II uses ${resourceCount(p,b.resources)} for ${days(b.days)}, working ${hours(b.hoursPerDay)} ${efficiencyRelation(p)}. What is the ratio of the work completed under Plan II to that under Plan I?`;
    case "findAdditionalWorkersForDeadline":return `A contractor at ${s.setting} has ${resourceCount(p,a.resources)}, who can complete ${s.task} in ${days(a.days)}. To finish it in only ${days(b.days)}, how many additional ${c.resourcePlural} must be hired?`;
    case "findWorkersRemovedForDelay":return `A contractor at ${s.setting} has ${resourceCount(p,a.resources)} and can complete ${s.task} in ${days(a.days)}. If the deadline is relaxed to ${days(b.days)}, how many ${c.resourcePlural} may be withdrawn while still finishing on time?`;
    case "findOriginalWorkforceFromChangedSchedule":return `The ${s.task} was planned for ${days(a.days)}. After staffing was reduced to ${resourceCount(p,b.resources)}, the work took ${days(b.days)}. How many ${c.resourcePlural} were included in the original plan?`;
    case "findRemainingDaysFromActualProgress":return `At ${s.setting}, ${resourceCount(p,a.resources)} complete only ${number(required(p.completedFraction,"completedFraction"))} of ${s.task} in ${days(required(p.elapsedDays,"elapsedDays"))}. If they continue at the same actual pace, how many more days will be needed to finish the remaining work?`;
    case "findExtraWorkersFromPlannedVsActualProgress":return `A contractor assigned ${resourceCount(p,a.resources)} to finish ${s.task} in ${days(a.days)}. After ${days(required(p.elapsedDays,"elapsedDays"))}, only ${number(required(p.completedFraction,"completedFraction"))} of the total work has been completed. Assuming the same per-${c.resourceSingular} productivity, how many additional ${c.resourcePlural} must be hired immediately to meet the original deadline?`;
    case "findPercentWorkCompletedFromResourceHours":return `At ${s.setting}, ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} can finish ${s.task} in ${days(a.days)}. What percentage of the job will be completed by ${resourceCount(p,b.resources)} working ${hours(b.hoursPerDay)} for ${days(b.days)} at the same efficiency?`;
    case "findPercentScheduleDelay":return `A team of ${resourceCount(p,a.resources)} is scheduled to finish ${s.task} in ${days(a.days)}. If only ${resourceCount(p,b.resources)} remain available, by what percentage will the completion time increase?`;
    case "findOvertimeHoursForDeadline":return `At ${s.setting}, ${resourceCount(p,a.resources)} working ${hours(a.hoursPerDay)} can complete ${s.task} in ${days(a.days)}. If the workforce falls to ${resourceCount(p,b.resources)} but the deadline cannot change, how many overtime hours a day must each remaining ${c.resourceSingular} work?`;
    case "findShiftCountForProductionTarget":return `At ${s.setting}, each ${c.resourceSingular} produces ${number(b.efficiency)} ${c.outputUnit} per shift. How many shifts will ${resourceCount(p,b.resources)} need to produce a target of ${number(b.work)} ${c.outputUnit}?`;
    case "findDimensionalWorkRatio":return `A contractor at ${s.setting} is comparing two jobs of the same type. The first has ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))}, while the second has ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}. If work is proportional to the relevant area or volume, what is the ratio of the second job's work to the first?`;
    case "findWorkersForChangedDimensions":return `At ${s.setting}, ${resourceCount(p,a.resources)} complete ${s.task} with ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))} in ${days(a.days)}. How many ${c.resourcePlural} are required for a similar job with ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))} in ${days(b.days)}, with daily hours and efficiency unchanged?`;
    case "findDaysForChangedDimensions":return `At ${s.setting}, ${resourceCount(p,a.resources)} complete ${s.task} with ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))} in ${days(a.days)}. How many days will ${resourceCount(p,b.resources)} take for a similar job with ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}, with daily hours and efficiency unchanged?`;
    case "findResourceDurationAfterPopulationChange":return `A relief camp has enough food for ${number(required(p.initialPopulation,"initialPopulation"))} people for ${days(a.days)}. After ${days(required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"))}, the camp population changes to ${number(required(p.changedPopulation,"changedPopulation"))}. For how many more days will the remaining food last?`;
    case "findCompletionTimeAfterAbsenteeism":return `A department at ${s.setting} schedules ${resourceCount(p,a.resources)} to complete ${s.task} in ${days(a.days)}. If ${number(required(p.absentPercent,"absentPercent"))}% of them remain absent throughout the assignment, in how many days will the active workforce finish it?`;
    case "findCompletionWithBatchWorkerAdditions":return `A contractor at ${s.setting} knows that ${resourceCount(p,a.resources)} could complete ${s.task} in ${days(a.days)}. Instead, only ${number(required(p.initialBatchResources,"initialBatchResources"))} ${c.resourcePlural} start, and ${number(required(p.batchAddition,"batchAddition"))} more join at the beginning of every following day. In how many days will the job be completed?`;
    case "findEquivalentResourceTime":return `For capacity planning at ${s.setting}, ${resourceCount(p,a.resources)} ${isMachineContext(p)?"operate":"work"} for ${resourceDuration(p)}. What is the equivalent total in ${c.resourceTimeUnit}?`;
  }
}

export function tmwCp006PlainEnglishBridge(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters):string{
  const resource=p.context.resourceSingular;
  switch(entry.solveMode){
    case "findRequiredResourceCount":return `The unknown is the total revised number of ${p.context.resourcePlural}, not merely the number added.`;
    case "findAdditionalWorkersForDeadline":
    case "findExtraWorkersFromPlannedVsActualProgress":return `First calculate the total workforce required, then subtract the ${p.context.resourcePlural} already available because the question asks only for the additional number.`;
    case "findWorkersRemovedForDelay":return `First calculate how many ${p.context.resourcePlural} must remain, then subtract that total from the original workforce.`;
    case "findRelativeEfficiency":return `Efficiency here means the amount of work completed by one ${resource} in the same unit of time.`;
    case "findWorkQuantity":
    case "findShiftCountForProductionTarget":return `Output per ${resource} per shift is unchanged, so only the number operating and the number of shifts need to be scaled.`;
    case "findRemainingDaysFromActualProgress":return `The observed fraction completed reveals the real daily pace; the unfinished fraction must be timed at that same pace.`;
    case "findResourceDurationAfterPopulationChange":return `Convert the food left into person-days before dividing it among the new population.`;
    case "findCompletionWithBatchWorkerAdditions":return `Each day's workforce is different, so add the day-by-day worker totals rather than treating the first day's workforce as constant.`;
    default:return `Read every factor in context: workforce means the number deployed, days means the schedule length, and daily hours means the working time of each ${resource}.`;
  }
}

export function tmwCp006ExamShortcut(shortcut:TmwCp006LearningShortcut):TmwCp006LearningShortcut{
  return {title:`10-Second ${shortcut.title}`,steps:shortcut.steps};
}

export function tmwCp006FriendlyTrap(trap:TmwCp006CommonTrap):TmwCp006CommonTrap{
  const warning=(()=>{
    switch(trap.misconceptionId){
      case "TOTAL_REPORTED_AS_CHANGE":return "Do not stop at the total required workforce. The question asks for the extra amount, so subtract the workforce already present.";
      case "CHANGE_REPORTED_AS_TOTAL":return "Check whether the question asks for the number removed or the number that remains; these are different quantities.";
      case "DIRECT_INVERSE_PROPORTION_CONFUSED":return "For the same work, fewer days or fewer workers must be balanced by more capacity elsewhere. A direct proportion would reverse the required comparison.";
      case "BASELINE_STATE_REUSED":return "Do not copy an original value after the workforce, hours, deadline, population or workload has changed.";
      case "WORK_RATIO_OMITTED":return "Include every stated scaling factor. Ignoring changed output, workload, shifts or resource-time produces this option.";
      case "ELAPSED_PERIOD_IGNORED":return "Account for the work already completed before calculating the remaining phase.";
      case "COMPLETED_USED_AS_REMAINING":return "Use one minus the completed fraction to obtain the unfinished work.";
      case "PERCENT_NOT_CONVERTED":return "A work fraction is not yet a percentage; multiply it by 100 before selecting an option.";
      case "DIMENSION_FACTOR_OMITTED":return "Multiply all relevant dimensions. Leaving out width, height, thickness or depth understates the work.";
      case "ABSENTEES_TREATED_AS_PRESENT":return "Reduce the active workforce first; absent workers do not contribute to daily capacity.";
      case "ARITHMETIC_SERIES_IGNORED":return "The workforce rises each day, so a constant-workforce calculation cannot be used.";
      default:return trap.explanation;
    }
  })();
  return {...trap,explanation:`Don't fall for ${trap.optionLabel} (${trap.optionText})! ${warning}`};
}

export function isTmwCp006ExamStyleStem(stem:string):boolean{
  const setting=/warehouse|factory|contractor|construction|highway|bank|printing press|plant|workshop|department|project manager|project site|quality-control|relief camp|excavation|masonry/i;
  const mechanical=/^(?:\d|One team|Each |The available food|Find the equivalent)/;
  return setting.test(stem)&&!mechanical.test(stem);
}
