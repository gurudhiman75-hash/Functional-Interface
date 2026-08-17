import { add, divide, formatRational, multiply, rational, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type {
  TmwCp006CommonTrap,
  TmwCp006LearningShortcut,
  TmwCp006MisconceptionId,
  TmwCp006Option,
  TmwCp006Parameters,
  TmwCp006RegistryEntry,
  TmwCp006Solution,
} from "./cp006-types";

function inline(latex:string):string{return `\\(${latex}\\)`;}
function value(number:Rational):string{return formatRational(number);}
function product(values:Rational[]):Rational{return values.reduce((total,item)=>multiply(total,item),rational(1));}
function stateLine(label:string,state:TmwCp006Parameters["stateA"],unknown?:"N"|"D"|"H"|"E"|"W"):string{
  const field=(symbol:"N"|"D"|"H"|"E"|"W",item:Rational):string=>`${symbol}=${unknown===symbol?"?":toLatex(item)}`;
  return `${label}: ${inline([field("N",state.resources),field("D",state.days),field("H",state.hoursPerDay),field("E",state.efficiency),field("W",state.work)].join(",\\;"))}.`;
}
function dimensions(values:Rational[],labels:string[]):string{return labels.map((label,index)=>`${label}=${value(values[index])} m`).join(", ");}
function optionLetter(index:number):string{return "ABCD"[index]??String(index+1);}

export function buildTmwCp006Givens(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters):string[]{
  const a=p.stateA,b=p.stateB,c=p.context;
  switch(entry.solveMode){
    case "findRequiredResourceCount":return [stateLine("Original arrangement",a),stateLine("Revised arrangement",b,"N")];
    case "findRequiredDays":return [stateLine("Original arrangement",a),stateLine("Revised arrangement",b,"D")];
    case "findRequiredDailyHours":return [stateLine("Original arrangement",a),stateLine("Revised arrangement",b,"H")];
    case "findRelativeEfficiency":return [stateLine("Original arrangement",a),stateLine("Revised arrangement",b,"E")];
    case "findWorkQuantity":return [
      `Original production: ${inline(`N_1=${toLatex(a.resources)},\\;S_1=${toLatex(a.days)},\\;Q_1=${toLatex(a.work)}`)} ${c.outputUnit}.`,
      `Revised production: ${inline(`N_2=${toLatex(b.resources)},\\;S_2=${toLatex(b.days)},\\;Q_2=?`)}.`,
    ];
    case "findWorkQuantityRatio":return [stateLine("First team",a),stateLine("Second team",b)];
    case "findAdditionalWorkersForDeadline":return [`Current plan: ${inline(`N_1=${toLatex(a.resources)},\\;D_1=${toLatex(a.days)}`)}.`, `Shorter deadline: ${inline(`D_2=${toLatex(b.days)},\\;N_{add}=?`)}.`];
    case "findWorkersRemovedForDelay":return [`Original plan: ${inline(`N_1=${toLatex(a.resources)},\\;D_1=${toLatex(a.days)}`)}.`, `Extended schedule: ${inline(`D_2=${toLatex(b.days)},\\;N_{removed}=?`)}.`];
    case "findOriginalWorkforceFromChangedSchedule":return [`Changed schedule: ${inline(`N_{changed}=${toLatex(b.resources)},\\;D_{changed}=${toLatex(b.days)}`)}.`, `Planned schedule: ${inline(`D_{planned}=${toLatex(a.days)},\\;N_{original}=?`)}.`];
    case "findRemainingDaysFromActualProgress":return [`Observed progress: ${inline(`D_{elapsed}=${toLatex(required(p.elapsedDays,"elapsedDays"))},\\;W_{done}=${toLatex(required(p.completedFraction,"completedFraction"))}`)}.`, `Required: time for ${inline(`1-W_{done}`)} at the same observed pace.`];
    case "findExtraWorkersFromPlannedVsActualProgress":return [`Plan: ${inline(`N=${toLatex(a.resources)},\\;D_{planned}=${toLatex(a.days)}`)}.`, `Actual progress: ${inline(`D_{elapsed}=${toLatex(required(p.elapsedDays,"elapsedDays"))},\\;W_{done}=${toLatex(required(p.completedFraction,"completedFraction"))}`)}.`];
    case "findPercentWorkCompletedFromResourceHours":return [stateLine("Whole-work arrangement",a),stateLine("Observed arrangement",b)];
    case "findPercentScheduleDelay":return [`Planned schedule: ${inline(`N_1=${toLatex(a.resources)},\\;D_1=${toLatex(a.days)}`)}.`, `Reduced workforce: ${inline(`N_2=${toLatex(b.resources)},\\;D_2=?`)}.`];
    case "findOvertimeHoursForDeadline":return [`Original schedule: ${inline(`N_1=${toLatex(a.resources)},\\;D=${toLatex(a.days)},\\;H_1=${toLatex(a.hoursPerDay)}`)}.`, `Reduced workforce: ${inline(`N_2=${toLatex(b.resources)},\\;H_{overtime}=?`)}.`];
    case "findShiftCountForProductionTarget":return [`Per-shift data: ${inline(`N=${toLatex(b.resources)},\\;q=${toLatex(b.efficiency)}`)} ${c.outputUnit} per ${c.resourceSingular}.`, `Target output: ${inline(`Q=${toLatex(b.work)}`)} ${c.outputUnit}.`];
    case "findDimensionalWorkRatio":return [`Original dimensions: ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))}.`, `Changed dimensions: ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}.`];
    case "findWorkersForChangedDimensions":return [`Original job: ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))}; ${inline(`N_1=${toLatex(a.resources)},\\;D_1=${toLatex(a.days)}`)}.`, `Changed job: ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}; ${inline(`D_2=${toLatex(b.days)},\\;N_2=?`)}.`];
    case "findDaysForChangedDimensions":return [`Original job: ${dimensions(required(p.dimensionsA,"dimensionsA"),required(p.dimensionLabels,"dimensionLabels"))}; ${inline(`N_1=${toLatex(a.resources)},\\;D_1=${toLatex(a.days)}`)}.`, `Changed job: ${dimensions(required(p.dimensionsB,"dimensionsB"),required(p.dimensionLabels,"dimensionLabels"))}; ${inline(`N_2=${toLatex(b.resources)},\\;D_2=?`)}.`];
    case "findResourceDurationAfterPopulationChange":return [`Original stock: ${inline(`P_1=${toLatex(required(p.initialPopulation,"initialPopulation"))},\\;D_1=${toLatex(a.days)}`)}.`, `After ${inline(`D_{elapsed}=${toLatex(required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"))}`)}, the population is ${inline(`P_2=${toLatex(required(p.changedPopulation,"changedPopulation"))}`)}.`];
    case "findCompletionTimeAfterAbsenteeism":return [`Planned workforce and time: ${inline(`N=${toLatex(a.resources)},\\;D=${toLatex(a.days)}`)}.`, `Absence rate: ${inline(`${toLatex(required(p.absentPercent,"absentPercent"))}\\%`)}.`];
    case "findCompletionWithBatchWorkerAdditions":return [`Equivalent total work: ${inline(`${toLatex(a.resources)}\\times${toLatex(a.days)}`)} ${c.resourceTimeUnit}.`, `Joining pattern: ${inline(`a=${toLatex(required(p.initialBatchResources,"initialBatchResources"))},\\;d=${toLatex(required(p.batchAddition,"batchAddition"))}`)}.`];
    case "findEquivalentResourceTime":return [`Resource count: ${inline(`N=${toLatex(a.resources)}`)}.`, `Duration: ${inline(`T=${toLatex(a.days)}`)} ${c.resourceTimeUnit.endsWith("hours")?"hours":"days"}.`];
  }
}

export function buildTmwCp006Shortcut(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,solution:TmwCp006Solution):TmwCp006LearningShortcut{
  const a=p.stateA,b=p.stateB,x=solution.answer;
  switch(entry.solveMode){
    case "findRequiredResourceCount":return {title:"MDH/W direct-ratio method",steps:["Keep the work ratio with the revised state and reverse the day, hour and efficiency factors because they are inversely proportional to resource count.",inline(`N_2=${toLatex(a.resources)}\\times\\frac{${toLatex(a.days)}}{${toLatex(b.days)}}\\times\\frac{${toLatex(a.hoursPerDay)}}{${toLatex(b.hoursPerDay)}}\\times\\frac{${toLatex(a.efficiency)}}{${toLatex(b.efficiency)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}=${toLatex(x)}`)]};
    case "findRequiredDays":return {title:"MDH/W direct-ratio method",steps:["Days vary inversely with resources, daily hours and efficiency, but directly with work quantity.",inline(`D_2=${toLatex(a.days)}\\times\\frac{${toLatex(a.resources)}}{${toLatex(b.resources)}}\\times\\frac{${toLatex(a.hoursPerDay)}}{${toLatex(b.hoursPerDay)}}\\times\\frac{${toLatex(a.efficiency)}}{${toLatex(b.efficiency)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}=${toLatex(x)}`)]};
    case "findRequiredDailyHours":return {title:"MDH/W direct-ratio method",steps:["Daily hours vary inversely with resources, days and efficiency, and directly with total work.",inline(`H_2=${toLatex(a.hoursPerDay)}\\times\\frac{${toLatex(a.resources)}}{${toLatex(b.resources)}}\\times\\frac{${toLatex(a.days)}}{${toLatex(b.days)}}\\times\\frac{${toLatex(a.efficiency)}}{${toLatex(b.efficiency)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}=${toLatex(x)}`)]};
    case "findRelativeEfficiency":return {title:"MDH/W direct-ratio method",steps:["Efficiency is the remaining multiplier after the resource, day, hour and work ratios are applied.",inline(`E_2=${toLatex(a.efficiency)}\\times\\frac{${toLatex(a.resources)}}{${toLatex(b.resources)}}\\times\\frac{${toLatex(a.days)}}{${toLatex(b.days)}}\\times\\frac{${toLatex(a.hoursPerDay)}}{${toLatex(b.hoursPerDay)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}=${toLatex(x)}`)]};
    case "findWorkQuantity":return {title:"Production-ratio shortcut",steps:["When output per resource per shift is unchanged, only the resource-count and shift ratios are needed.",inline(`Q_2=${toLatex(a.work)}\\times\\frac{${toLatex(b.resources)}}{${toLatex(a.resources)}}\\times\\frac{${toLatex(b.days)}}{${toLatex(a.days)}}=${toLatex(x)}`)]};
    case "findWorkQuantityRatio":return {title:"Capacity-product shortcut",steps:["Write each team's productive capacity as one product and compare the products directly.",inline(`W_2:W_1=(${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}\\times${toLatex(b.efficiency)}):(${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)})=${Math.abs(x.numerator)}:${x.denominator}`)]};
    case "findAdditionalWorkersForDeadline":{const total=add(a.resources,x);return {title:"Worker-days shortcut",steps:[inline(`N_{required}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}}{${toLatex(b.days)}}=${toLatex(total)}`),inline(`N_{add}=${toLatex(total)}-${toLatex(a.resources)}=${toLatex(x)}`)]};}
    case "findWorkersRemovedForDelay":{const retained=subtract(a.resources,x);return {title:"Worker-days shortcut",steps:[inline(`N_{retained}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}}{${toLatex(b.days)}}=${toLatex(retained)}`),inline(`N_{removed}=${toLatex(a.resources)}-${toLatex(retained)}=${toLatex(x)}`)]};}
    case "findOriginalWorkforceFromChangedSchedule":return {title:"Reverse worker-days shortcut",steps:["Treat the changed workforce and actual duration as one worker-day total, then divide by the planned days.",inline(`N_{original}=\\frac{${toLatex(b.resources)}\\times${toLatex(b.days)}}{${toLatex(a.days)}}=${toLatex(x)}`)]};
    case "findRemainingDaysFromActualProgress":{const elapsed=required(p.elapsedDays,"elapsedDays"),done=required(p.completedFraction,"completedFraction"),remaining=subtract(rational(1),done);return {title:"Done-to-remaining ratio shortcut",steps:["At the same pace, time is proportional to work.",inline(`D_{remaining}=${toLatex(elapsed)}\\times\\frac{${toLatex(remaining)}}{${toLatex(done)}}=${toLatex(x)}`)]};}
    case "findExtraWorkersFromPlannedVsActualProgress":{const elapsed=required(p.elapsedDays,"elapsedDays"),done=required(p.completedFraction,"completedFraction"),remaining=subtract(rational(1),done),used=multiply(a.resources,elapsed),remainingWorkerDays=multiply(used,divide(remaining,done)),daysLeft=subtract(a.days,elapsed),total=add(a.resources,x);return {title:"Work-ratio worker-days shortcut",steps:[inline(`${toLatex(used)}\\text{ worker-days complete }${toLatex(done)}\\text{ of the work}`),inline(`\text{worker-days for remaining work}=${toLatex(used)}\\times\\frac{${toLatex(remaining)}}{${toLatex(done)}}=${toLatex(remainingWorkerDays)}`),inline(`N_{required}=\\frac{${toLatex(remainingWorkerDays)}}{${toLatex(daysLeft)}}=${toLatex(total)},\\quad N_{extra}=${toLatex(total)}-${toLatex(a.resources)}=${toLatex(x)}`)]};}
    case "findPercentWorkCompletedFromResourceHours":return {title:"Resource-hours percentage shortcut",steps:["Cancel equal efficiency factors and compare only the productive resource-hours.",inline(`\%W=\\frac{${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}}{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}}\\times100=${toLatex(x)}\\%`)]};
    case "findPercentScheduleDelay":{const changed=multiply(a.days,divide(a.resources,b.resources));return {title:"Inverse workforce shortcut",steps:[inline(`D_2=${toLatex(a.days)}\\times\\frac{${toLatex(a.resources)}}{${toLatex(b.resources)}}=${toLatex(changed)}`),inline(`\%\text{ delay}=\\frac{${toLatex(changed)}-${toLatex(a.days)}}{${toLatex(a.days)}}\\times100=${toLatex(x)}\\%`)]};}
    case "findOvertimeHoursForDeadline":{const total=add(a.hoursPerDay,x);return {title:"Inverse workforce-hours shortcut",steps:[inline(`H_{required}=${toLatex(a.hoursPerDay)}\\times\\frac{${toLatex(a.resources)}}{${toLatex(b.resources)}}=${toLatex(total)}`),inline(`H_{overtime}=${toLatex(total)}-${toLatex(a.hoursPerDay)}=${toLatex(x)}`)]};}
    case "findShiftCountForProductionTarget":{const perShift=multiply(b.resources,b.efficiency);return {title:"Output-per-shift shortcut",steps:[inline(`Q_{per\,shift}=${toLatex(b.resources)}\\times${toLatex(b.efficiency)}=${toLatex(perShift)}`),inline(`S=\\frac{${toLatex(b.work)}}{${toLatex(perShift)}}=${toLatex(x)}`)]};}
    case "findDimensionalWorkRatio":{const da=product(required(p.dimensionsA,"dimensionsA")),db=product(required(p.dimensionsB,"dimensionsB"));return {title:"Area/volume product shortcut",steps:[inline(`W_1\\propto${toLatex(da)},\\quad W_2\\propto${toLatex(db)}`),inline(`W_2:W_1=${toLatex(db)}:${toLatex(da)}=${Math.abs(x.numerator)}:${x.denominator}`)]};}
    case "findWorkersForChangedDimensions":{const ratio=divide(product(required(p.dimensionsB,"dimensionsB")),product(required(p.dimensionsA,"dimensionsA")));return {title:"Dimension ratio × workforce ratio",steps:[inline(`\\frac{W_2}{W_1}=${toLatex(ratio)}`),inline(`N_2=${toLatex(a.resources)}\\times\\frac{${toLatex(a.days)}}{${toLatex(b.days)}}\\times${toLatex(ratio)}=${toLatex(x)}`)]};}
    case "findDaysForChangedDimensions":{const ratio=divide(product(required(p.dimensionsB,"dimensionsB")),product(required(p.dimensionsA,"dimensionsA")));return {title:"Dimension ratio × time ratio",steps:[inline(`\\frac{W_2}{W_1}=${toLatex(ratio)}`),inline(`D_2=${toLatex(a.days)}\\times\\frac{${toLatex(a.resources)}}{${toLatex(b.resources)}}\\times${toLatex(ratio)}=${toLatex(x)}`)]};}
    case "findResourceDurationAfterPopulationChange":{const p1=required(p.initialPopulation,"initialPopulation"),p2=required(p.changedPopulation,"changedPopulation"),elapsed=required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange");return {title:"Remaining person-days shortcut",steps:[inline(`\text{remaining person-days}=${toLatex(p1)}(${toLatex(a.days)}-${toLatex(elapsed)})`),inline(`D_{remaining}=\\frac{${toLatex(p1)}(${toLatex(a.days)}-${toLatex(elapsed)})}{${toLatex(p2)}}=${toLatex(x)}`)]};}
    case "findCompletionTimeAfterAbsenteeism":{const absent=required(p.absentPercent,"absentPercent"),activePercent=subtract(rational(100),absent);return {title:"Active-percentage shortcut",steps:[inline(`\text{active workforce}=${toLatex(activePercent)}\\%`),inline(`D_{actual}=${toLatex(a.days)}\\times\\frac{100}{${toLatex(activePercent)}}=${toLatex(x)}`)]};}
    case "findCompletionWithBatchWorkerAdditions":{const initial=required(p.initialBatchResources,"initialBatchResources"),addition=required(p.batchAddition,"batchAddition"),days=x.numerator,target=multiply(a.resources,a.days);const daily:number[]=[],running:number[]=[];let total=0;for(let index=0;index<days;index+=1){const workers=initial.numerator+index*addition.numerator;daily.push(workers);total+=workers;running.push(total);}return {title:"Daily AP work grid",steps:[`Daily workforce: ${daily.map((workers,index)=>`Day ${index+1}: ${workers}`).join(", ")}.`,`Running ${p.context.resourceTimeUnit}: ${running.join(" → ")} = ${value(target)}; therefore completion occurs on day ${days}.`]};}
    case "findEquivalentResourceTime":return {title:"Direct resource-time shortcut",steps:[`${value(a.resources)} ${p.context.resourcePlural} × ${value(a.days)} ${p.context.resourceTimeUnit.endsWith("hours")?"hours":"days"} = ${value(x)} ${p.context.resourceTimeUnit}.`]};
  }
}

const preferredTrap:Partial<Record<TmwCp006RegistryEntry["solveMode"],TmwCp006MisconceptionId[]>>={
  findRequiredResourceCount:["DIRECT_INVERSE_PROPORTION_CONFUSED","BASELINE_STATE_REUSED"],
  findRequiredDays:["DIRECT_INVERSE_PROPORTION_CONFUSED","BASELINE_STATE_REUSED"],
  findRequiredDailyHours:["DIRECT_INVERSE_PROPORTION_CONFUSED","WORK_RATIO_OMITTED"],
  findRelativeEfficiency:["DIRECT_INVERSE_PROPORTION_CONFUSED","BASELINE_STATE_REUSED"],
  findWorkQuantity:["WORK_RATIO_OMITTED","BASELINE_STATE_REUSED"],
  findWorkQuantityRatio:["BASELINE_STATE_REUSED","DIRECT_INVERSE_PROPORTION_CONFUSED"],
  findAdditionalWorkersForDeadline:["TOTAL_REPORTED_AS_CHANGE"],
  findWorkersRemovedForDelay:["CHANGE_REPORTED_AS_TOTAL"],
  findOriginalWorkforceFromChangedSchedule:["DIRECT_INVERSE_PROPORTION_CONFUSED","BASELINE_STATE_REUSED"],
  findRemainingDaysFromActualProgress:["ELAPSED_PERIOD_IGNORED","COMPLETED_USED_AS_REMAINING"],
  findExtraWorkersFromPlannedVsActualProgress:["TOTAL_REPORTED_AS_CHANGE"],
  findPercentWorkCompletedFromResourceHours:["PERCENT_NOT_CONVERTED"],
  findPercentScheduleDelay:["BASELINE_STATE_REUSED","DIRECT_INVERSE_PROPORTION_CONFUSED"],
  findOvertimeHoursForDeadline:["TOTAL_REPORTED_AS_CHANGE"],
  findShiftCountForProductionTarget:["WORK_RATIO_OMITTED","BASELINE_STATE_REUSED"],
  findDimensionalWorkRatio:["DIMENSION_FACTOR_OMITTED"],
  findWorkersForChangedDimensions:["DIMENSION_FACTOR_OMITTED"],
  findDaysForChangedDimensions:["DIMENSION_FACTOR_OMITTED"],
  findResourceDurationAfterPopulationChange:["BASELINE_STATE_REUSED","ELAPSED_PERIOD_IGNORED"],
  findCompletionTimeAfterAbsenteeism:["ABSENTEES_TREATED_AS_PRESENT"],
  findCompletionWithBatchWorkerAdditions:["ARITHMETIC_SERIES_IGNORED"],
  findEquivalentResourceTime:["WORK_RATIO_OMITTED","BASELINE_STATE_REUSED"],
};

function trapExplanation(id:TmwCp006MisconceptionId):string{
  switch(id){
    case "BASELINE_STATE_REUSED":return "This repeats an original value without applying the changed workforce, time, efficiency, population or work conditions.";
    case "DIRECT_INVERSE_PROPORTION_CONFUSED":return "This reverses a direct/inverse relationship. For fixed work, more resources, more hours or greater efficiency reduce the required time or resource count.";
    case "WORK_RATIO_OMITTED":return "This ignores one required scaling factor, such as changed work quantity, output, shifts or total resource-time.";
    case "HOURS_FACTOR_OMITTED":return "This ignores the change in daily working hours.";
    case "EFFICIENCY_FACTOR_OMITTED":return "This treats unequal efficiencies as though they were equal.";
    case "TOTAL_REPORTED_AS_CHANGE":return "This reports the total required value, but the question asks only for the additional amount beyond the existing value.";
    case "CHANGE_REPORTED_AS_TOTAL":return "This reports the retained total instead of the number removed, or reports a change instead of the final total.";
    case "ELAPSED_PERIOD_IGNORED":return "This fails to use the work already completed during the elapsed period.";
    case "COMPLETED_USED_AS_REMAINING":return "This uses the completed fraction where the remaining fraction is required.";
    case "PERCENT_NOT_CONVERTED":return "This stops at the work fraction and forgets to multiply by 100 to obtain a percentage.";
    case "DIMENSION_FACTOR_OMITTED":return "This leaves out one changed physical dimension, so the area or volume—and therefore the work quantity—is understated.";
    case "ABSENTEES_TREATED_AS_PRESENT":return "This keeps the full planned workforce even though a percentage remains absent.";
    case "ARITHMETIC_SERIES_IGNORED":return "This assumes the initial workforce stays constant and ignores the workers added on later days.";
    case "PLAUSIBLE_SCALE_ERROR":return "This is a nearby numerical value but does not satisfy the governing work equation.";
    case "CORRECT":return "";
  }
}

export function buildTmwCp006CommonTrap(entry:TmwCp006RegistryEntry,options:TmwCp006Option[]):TmwCp006CommonTrap{
  const preferred=preferredTrap[entry.solveMode]??[];
  let selectedIndex=-1;
  for(const id of preferred){const index=options.findIndex(option=>option.misconceptionId===id);if(index>=0){selectedIndex=index;break;}}
  if(selectedIndex<0)selectedIndex=options.findIndex(option=>option.misconceptionId!=="CORRECT");
  if(selectedIndex<0)throw new Error("CP-006 option set has no distractor for the common-trap explanation");
  const selected=options[selectedIndex];
  return {optionLabel:`Option ${optionLetter(selectedIndex)}`,optionText:selected.text,misconceptionId:selected.misconceptionId as Exclude<TmwCp006MisconceptionId,"CORRECT">,explanation:trapExplanation(selected.misconceptionId)};
}
