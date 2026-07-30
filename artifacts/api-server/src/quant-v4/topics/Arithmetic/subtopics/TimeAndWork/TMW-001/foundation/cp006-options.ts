import { add, compare, divide, equals, formatRational, formatTimeText, multiply, rational, subtract } from "./rational";
import { seedNumber } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp006MisconceptionId, TmwCp006Option, TmwCp006Parameters, TmwCp006RegistryEntry, TmwCp006Solution } from "./cp006-types";

function plural(value:Rational,singular:string,plural:string):string{return equals(value,rational(1))?singular:plural;}
function text(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,value:Rational):string{
  const formatted=formatRational(value);
  switch(entry.answerType){
    case "COUNT":return `${formatted} ${plural(value,p.context.resourceSingular,p.context.resourcePlural)}`;
    case "TIME":return formatTimeText(value,"day","days");
    case "HOURS":return entry.solveMode==="findOvertimeHoursForDeadline"?`${formatTimeText(value,"hour","hours")} overtime per day`:`${formatTimeText(value,"hour","hours")} per day`;
    case "EFFICIENCY":return `${formatted} times the baseline efficiency`;
    case "WORK":return `${formatted} ${p.context.outputUnit}`;
    case "RATIO":return `${Math.abs(value.numerator)}:${value.denominator}`;
    case "PERCENT":return `${formatted}%`;
    case "SHIFT":return `${formatted} ${plural(value,"shift","shifts")}`;
    case "RESOURCE_TIME":return `${formatted} ${p.context.resourceTimeUnit}`;
  }
}
function positive(value:Rational):boolean{return compare(value,rational(0))>0;}
function baseline(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters):Rational{
  switch(entry.answerType){
    case "COUNT":return entry.solveMode==="findOriginalWorkforceFromChangedSchedule"?p.stateB.resources:p.stateA.resources;
    case "TIME":return p.stateA.days;
    case "HOURS":return p.stateA.hoursPerDay;
    case "EFFICIENCY":return p.stateA.efficiency;
    case "WORK":return p.stateA.work;
    case "RATIO":return rational(1);
    case "PERCENT":return rational(100);
    case "SHIFT":return rational(1);
    case "RESOURCE_TIME":return p.stateA.days;
  }
}
function modeSpecific(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,answer:Rational):Array<{value:Rational;label:TmwCp006MisconceptionId}>{
  switch(entry.solveMode){
    case "findAdditionalWorkersForDeadline":
    case "findExtraWorkersFromPlannedVsActualProgress":return [{value:add(answer,p.stateA.resources),label:"TOTAL_REPORTED_AS_CHANGE"}];
    case "findWorkersRemovedForDelay":return [{value:p.stateB.resources,label:"CHANGE_REPORTED_AS_TOTAL"}];
    case "findOvertimeHoursForDeadline":return [{value:add(answer,p.stateA.hoursPerDay),label:"TOTAL_REPORTED_AS_CHANGE"}];
    case "findRemainingDaysFromActualProgress":return [{value:requiredValue(p.elapsedDays),label:"ELAPSED_PERIOD_IGNORED"}];
    case "findPercentWorkCompletedFromResourceHours":return [{value:divide(answer,rational(100)),label:"PERCENT_NOT_CONVERTED"}];
    case "findPercentScheduleDelay":return [{value:add(answer,rational(100)),label:"BASELINE_STATE_REUSED"}];
    case "findCompletionTimeAfterAbsenteeism":return [{value:p.stateA.days,label:"ABSENTEES_TREATED_AS_PRESENT"}];
    case "findCompletionWithBatchWorkerAdditions":return [{value:divide(multiply(p.stateA.resources,p.stateA.days),requiredValue(p.initialBatchResources)),label:"ARITHMETIC_SERIES_IGNORED"}];
    case "findDimensionalWorkRatio":
    case "findWorkersForChangedDimensions":
    case "findDaysForChangedDimensions":return [{value:divide(answer,rational(2)),label:"DIMENSION_FACTOR_OMITTED"}];
    default:return [];
  }
}
function requiredValue(value:Rational|undefined):Rational{if(value===undefined)throw new Error("Missing option parameter");return value;}

export function buildTmwCp006Options(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,solution:TmwCp006Solution,seed:string):{options:TmwCp006Option[];correctIndex:number}{
  const correct:TmwCp006Option={text:solution.answerText,value:solution.answer,misconceptionId:"CORRECT"};
  const candidates:Array<{value:Rational;label:TmwCp006MisconceptionId}>=[
    ...modeSpecific(entry,p,solution.answer),
    {value:baseline(entry,p),label:"BASELINE_STATE_REUSED"},
    {value:multiply(solution.answer,rational(2)),label:"DIRECT_INVERSE_PROPORTION_CONFUSED"},
    {value:divide(solution.answer,rational(2)),label:"WORK_RATIO_OMITTED"},
    {value:add(solution.answer,rational(1)),label:"PLAUSIBLE_SCALE_ERROR"},
    {value:subtract(solution.answer,rational(1)),label:"PLAUSIBLE_SCALE_ERROR"},
    {value:add(solution.answer,rational(2)),label:"PLAUSIBLE_SCALE_ERROR"},
  ];
  const integral=entry.answerType==="COUNT"||entry.answerType==="SHIFT"||entry.answerType==="RESOURCE_TIME";
  const seen=new Set<string>([`${solution.answer.numerator}/${solution.answer.denominator}`]);
  const distractors:TmwCp006Option[]=[];
  for(const candidate of candidates){
    if(!positive(candidate.value))continue;
    if(integral&&candidate.value.denominator!==1)continue;
    const key=`${candidate.value.numerator}/${candidate.value.denominator}`;
    if(seen.has(key))continue;
    seen.add(key);
    distractors.push({text:text(entry,p,candidate.value),value:candidate.value,misconceptionId:candidate.label});
    if(distractors.length===3)break;
  }
  let bump=3;
  while(distractors.length<3){
    const value=add(solution.answer,rational(bump++));
    const key=`${value.numerator}/${value.denominator}`;
    if(seen.has(key))continue;
    seen.add(key);
    distractors.push({text:text(entry,p,value),value,misconceptionId:"PLAUSIBLE_SCALE_ERROR"});
  }
  const correctIndex=seedNumber(seed,`${entry.qlId}:correct-position`)%4;
  const options=[...distractors];options.splice(correctIndex,0,correct);
  return {options,correctIndex};
}
