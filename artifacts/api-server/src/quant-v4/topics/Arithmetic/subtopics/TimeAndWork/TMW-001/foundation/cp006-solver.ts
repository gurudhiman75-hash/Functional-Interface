import { add, compare, divide, equals, formatRational, formatTimeText, multiply, rational, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp006Parameters, TmwCp006ProjectState, TmwCp006RegistryEntry, TmwCp006Solution } from "./cp006-types";

function capacity(s:TmwCp006ProjectState):Rational{return multiply(multiply(multiply(s.resources,s.days),s.hoursPerDay),s.efficiency);}
function product(values:Rational[]):Rational{return values.reduce((total,value)=>multiply(total,value),rational(1));}
function workRatio(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(capacity(b),capacity(a));}
function requiredResources(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.days,b.hoursPerDay),b.efficiency));}
function requiredDays(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.resources,b.hoursPerDay),b.efficiency));}
function requiredHours(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.resources,b.days),b.efficiency));}
function requiredEfficiency(a:TmwCp006ProjectState,b:TmwCp006ProjectState):Rational{return divide(multiply(capacity(a),divide(b.work,a.work)),multiply(multiply(b.resources,b.days),b.hoursPerDay));}
function plural(value:Rational,singular:string,pluralForm:string):string{return equals(value,rational(1))?singular:pluralForm;}
function ratioText(value:Rational):string{return `${Math.abs(value.numerator)}:${value.denominator}`;}

function answerText(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,answer:Rational):string{
  const value=formatRational(answer);
  switch(entry.answerType){
    case "COUNT":return `${value} ${plural(answer,p.context.resourceSingular,p.context.resourcePlural)}`;
    case "TIME":return formatTimeText(answer,"day","days");
    case "HOURS":return entry.solveMode==="findOvertimeHoursForDeadline"?`${formatTimeText(answer,"hour","hours")} overtime per day`:`${formatTimeText(answer,"hour","hours")} per day`;
    case "EFFICIENCY":return `${value} times the baseline efficiency`;
    case "WORK":return `${value} ${p.context.outputUnit}`;
    case "RATIO":return ratioText(answer);
    case "PERCENT":return `${value}%`;
    case "SHIFT":return `${value} ${plural(answer,"shift","shifts")}`;
    case "RESOURCE_TIME":return `${value} ${p.context.resourceTimeUnit}`;
  }
}

function batchTotal(initial:Rational,addition:Rational,days:Rational):Rational{
  return divide(multiply(days,add(multiply(rational(2),initial),multiply(subtract(days,rational(1)),addition))),rational(2));
}
function solveBatchDays(p:TmwCp006Parameters):Rational{
  const initial=required(p.initialBatchResources,"initialBatchResources"),addition=required(p.batchAddition,"batchAddition"),target=multiply(p.stateA.resources,p.stateA.days);
  for(let day=1;day<=100;day+=1){const candidate=rational(day);if(equals(batchTotal(initial,addition,candidate),target))return candidate;}
  throw new Error("No exact batch-addition completion day found");
}

export function solveTmwCp006(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters):TmwCp006Solution{
  const a=p.stateA,b=p.stateB;
  let answer:Rational,formulaLatex:string,workedLatex:string[];
  switch(entry.solveMode){
    case "findRequiredResourceCount":{
      answer=requiredResources(a,b);formulaLatex="N_2=\\frac{N_1D_1H_1E_1}{D_2H_2E_2}\\times\\frac{W_2}{W_1}";
      workedLatex=[`N_2=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)}}{${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}\\times${toLatex(b.efficiency)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}`,`N_2=${toLatex(answer)}`];break;
    }
    case "findRequiredDays":{
      answer=requiredDays(a,b);formulaLatex="D_2=\\frac{N_1D_1H_1E_1}{N_2H_2E_2}\\times\\frac{W_2}{W_1}";
      workedLatex=[`D_2=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)}}{${toLatex(b.resources)}\\times${toLatex(b.hoursPerDay)}\\times${toLatex(b.efficiency)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}`,`D_2=${toLatex(answer)}`];break;
    }
    case "findRequiredDailyHours":{
      answer=requiredHours(a,b);formulaLatex="H_2=\\frac{N_1D_1H_1E_1}{N_2D_2E_2}\\times\\frac{W_2}{W_1}";
      workedLatex=[`H_2=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)}}{${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.efficiency)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}`,`H_2=${toLatex(answer)}`];break;
    }
    case "findRelativeEfficiency":{
      answer=requiredEfficiency(a,b);formulaLatex="E_2=\\frac{N_1D_1H_1E_1}{N_2D_2H_2}\\times\\frac{W_2}{W_1}";
      workedLatex=[`E_2=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)}}{${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}}\\times\\frac{${toLatex(b.work)}}{${toLatex(a.work)}}`,`E_2=${toLatex(answer)}`];break;
    }
    case "findWorkQuantity":{
      const ratio=divide(multiply(b.resources,b.days),multiply(a.resources,a.days));answer=multiply(a.work,ratio);formulaLatex="W_2=W_1\\times\\frac{N_2S_2}{N_1S_1}";
      workedLatex=[`\\frac{N_2S_2}{N_1S_1}=\\frac{${toLatex(b.resources)}\\times${toLatex(b.days)}}{${toLatex(a.resources)}\\times${toLatex(a.days)}}=${toLatex(ratio)}`,`W_2=${toLatex(a.work)}\\times${toLatex(ratio)}=${toLatex(answer)}`];break;
    }
    case "findWorkQuantityRatio":{
      answer=workRatio(a,b);formulaLatex="\\frac{W_2}{W_1}=\\frac{N_2D_2H_2E_2}{N_1D_1H_1E_1}";
      workedLatex=[`\\frac{W_2}{W_1}=\\frac{${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}\\times${toLatex(b.efficiency)}}{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)}}`,`\\frac{W_2}{W_1}=${toLatex(answer)}=${ratioText(answer)}`];break;
    }
    case "findAdditionalWorkersForDeadline":{
      const total=requiredResources(a,b);answer=subtract(total,a.resources);formulaLatex="N_{add}=N_{required}-N_{current}";
      workedLatex=[`N_{required}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}}{${toLatex(b.days)}}=${toLatex(total)}`,`N_{add}=${toLatex(total)}-${toLatex(a.resources)}=${toLatex(answer)}`];break;
    }
    case "findWorkersRemovedForDelay":{
      const retained=requiredResources(a,b);answer=subtract(a.resources,retained);formulaLatex="N_{removed}=N_{original}-N_{retained}";
      workedLatex=[`N_{retained}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}}{${toLatex(b.days)}}=${toLatex(retained)}`,`N_{removed}=${toLatex(a.resources)}-${toLatex(retained)}=${toLatex(answer)}`];break;
    }
    case "findOriginalWorkforceFromChangedSchedule":{
      answer=requiredResources(b,a);formulaLatex="N_{original}=\\frac{N_{changed}D_{changed}H_{changed}E_{changed}}{D_{planned}H_{planned}E_{planned}}";
      workedLatex=[`N_{original}=\\frac{${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}\\times${toLatex(b.efficiency)}}{${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}\\times${toLatex(a.efficiency)}}`,`N_{original}=${toLatex(answer)}`];break;
    }
    case "findRemainingDaysFromActualProgress":{
      const elapsed=required(p.elapsedDays,"elapsedDays"),done=required(p.completedFraction,"completedFraction"),daily=divide(done,elapsed),remaining=subtract(rational(1),done);answer=divide(remaining,daily);formulaLatex="D_{remaining}=\\frac{1-W_{done}}{W_{done}/D_{elapsed}}";
      workedLatex=[`W_{per\\,day}=\\frac{${toLatex(done)}}{${toLatex(elapsed)}}=${toLatex(daily)}`,`W_{remaining}=1-${toLatex(done)}=${toLatex(remaining)}`,`D_{remaining}=\\frac{${toLatex(remaining)}}{${toLatex(daily)}}=${toLatex(answer)}`];break;
    }
    case "findExtraWorkersFromPlannedVsActualProgress":{
      const elapsed=required(p.elapsedDays,"elapsedDays"),done=required(p.completedFraction,"completedFraction"),remaining=subtract(rational(1),done),daysLeft=subtract(a.days,elapsed),perWorkerDaily=divide(done,multiply(a.resources,elapsed)),total=divide(remaining,multiply(perWorkerDaily,daysLeft));answer=subtract(total,a.resources);formulaLatex="N_{extra}=\\frac{1-W_{done}}{r_{actual}(D_{planned}-D_{elapsed})}-N_{current}";
      workedLatex=[`r_{actual}=\\frac{${toLatex(done)}}{${toLatex(a.resources)}\\times${toLatex(elapsed)}}=${toLatex(perWorkerDaily)}`,`D_{left}=${toLatex(a.days)}-${toLatex(elapsed)}=${toLatex(daysLeft)}`,`N_{required}=\\frac{${toLatex(remaining)}}{${toLatex(perWorkerDaily)}\\times${toLatex(daysLeft)}}=${toLatex(total)}`,`N_{extra}=${toLatex(total)}-${toLatex(a.resources)}=${toLatex(answer)}`];break;
    }
    case "findPercentWorkCompletedFromResourceHours":{
      const fraction=divide(capacity(b),capacity(a));answer=multiply(fraction,rational(100));formulaLatex="\\%W=\\frac{N_2D_2H_2E_2}{N_1D_1H_1E_1}\\times100";
      workedLatex=[`\\frac{W_{done}}{W_{total}}=\\frac{${toLatex(b.resources)}\\times${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}}{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}}=${toLatex(fraction)}`,`\\%W=${toLatex(fraction)}\\times100=${toLatex(answer)}\\%`];break;
    }
    case "findPercentScheduleDelay":{
      const changed=requiredDays(a,b),delay=subtract(changed,a.days);answer=multiply(divide(delay,a.days),rational(100));formulaLatex="\\%\\,delay=\\frac{D_{changed}-D_{planned}}{D_{planned}}\\times100";
      workedLatex=[`D_{changed}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}}{${toLatex(b.resources)}}=${toLatex(changed)}`,`\\%\\,delay=\\frac{${toLatex(changed)}-${toLatex(a.days)}}{${toLatex(a.days)}}\\times100=${toLatex(answer)}\\%`];break;
    }
    case "findOvertimeHoursForDeadline":{
      const requiredTotal=requiredHours(a,b);answer=subtract(requiredTotal,a.hoursPerDay);formulaLatex="H_{overtime}=H_{required}-H_{regular}";
      workedLatex=[`H_{required}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}}{${toLatex(b.resources)}\\times${toLatex(b.days)}}=${toLatex(requiredTotal)}`,`H_{overtime}=${toLatex(requiredTotal)}-${toLatex(a.hoursPerDay)}=${toLatex(answer)}`];break;
    }
    case "findShiftCountForProductionTarget":{
      const perShift=multiply(multiply(b.resources,b.hoursPerDay),b.efficiency);answer=divide(b.work,perShift);formulaLatex="S=\\frac{Q}{Nq}";
      workedLatex=[`Q_{per\\,shift}=${toLatex(b.resources)}\\times${toLatex(b.efficiency)}=${toLatex(perShift)}`,`S=\\frac{${toLatex(b.work)}}{${toLatex(perShift)}}=${toLatex(answer)}`];break;
    }
    case "findDimensionalWorkRatio":{
      const da=product(required(p.dimensionsA,"dimensionsA")),db=product(required(p.dimensionsB,"dimensionsB"));answer=divide(db,da);formulaLatex="\\frac{W_2}{W_1}=\\frac{\\prod d_{2i}}{\\prod d_{1i}}";
      workedLatex=[`W_1\\propto${required(p.dimensionsA,"dimensionsA").map(toLatex).join("\\times") }=${toLatex(da)}`,`W_2\\propto${required(p.dimensionsB,"dimensionsB").map(toLatex).join("\\times") }=${toLatex(db)}`,`\\frac{W_2}{W_1}=\\frac{${toLatex(db)}}{${toLatex(da)}}=${toLatex(answer)}=${ratioText(answer)}`];break;
    }
    case "findWorkersForChangedDimensions":{
      const da=product(required(p.dimensionsA,"dimensionsA")),db=product(required(p.dimensionsB,"dimensionsB")),ratio=divide(db,da);answer=requiredResources(a,{...b,work:ratio});formulaLatex="N_2=N_1\\times\\frac{D_1H_1}{D_2H_2}\\times\\frac{W_2}{W_1}";
      workedLatex=[`\\frac{W_2}{W_1}=\\frac{${toLatex(db)}}{${toLatex(da)}}=${toLatex(ratio)}`,`N_2=${toLatex(a.resources)}\\times\\frac{${toLatex(a.days)}\\times${toLatex(a.hoursPerDay)}}{${toLatex(b.days)}\\times${toLatex(b.hoursPerDay)}}\\times${toLatex(ratio)}=${toLatex(answer)}`];break;
    }
    case "findDaysForChangedDimensions":{
      const da=product(required(p.dimensionsA,"dimensionsA")),db=product(required(p.dimensionsB,"dimensionsB")),ratio=divide(db,da);answer=requiredDays(a,{...b,work:ratio});formulaLatex="D_2=D_1\\times\\frac{N_1H_1}{N_2H_2}\\times\\frac{W_2}{W_1}";
      workedLatex=[`\\frac{W_2}{W_1}=\\frac{${toLatex(db)}}{${toLatex(da)}}=${toLatex(ratio)}`,`D_2=${toLatex(a.days)}\\times\\frac{${toLatex(a.resources)}\\times${toLatex(a.hoursPerDay)}}{${toLatex(b.resources)}\\times${toLatex(b.hoursPerDay)}}\\times${toLatex(ratio)}=${toLatex(answer)}`];break;
    }
    case "findResourceDurationAfterPopulationChange":{
      const p1=required(p.initialPopulation,"initialPopulation"),p2=required(p.changedPopulation,"changedPopulation"),elapsed=required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"),remainingStock=multiply(p1,subtract(a.days,elapsed));answer=divide(remainingStock,p2);formulaLatex="D_{remaining}=\\frac{P_1(D_1-D_{elapsed})}{P_2}";
      workedLatex=[`\\text{remaining person-days}=${toLatex(p1)}\\times(${toLatex(a.days)}-${toLatex(elapsed)})=${toLatex(remainingStock)}`,`D_{remaining}=\\frac{${toLatex(remainingStock)}}{${toLatex(p2)}}=${toLatex(answer)}`];break;
    }
    case "findCompletionTimeAfterAbsenteeism":{
      const absent=required(p.absentPercent,"absentPercent"),active=multiply(a.resources,subtract(rational(1),divide(absent,rational(100))));answer=divide(multiply(a.resources,a.days),active);formulaLatex="D_{actual}=\\frac{N_{planned}D_{planned}}{N_{active}}";
      workedLatex=[`N_{active}=${toLatex(a.resources)}\\left(1-\\frac{${toLatex(absent)}}{100}\\right)=${toLatex(active)}`,`D_{actual}=\\frac{${toLatex(a.resources)}\\times${toLatex(a.days)}}{${toLatex(active)}}=${toLatex(answer)}`];break;
    }
    case "findCompletionWithBatchWorkerAdditions":{
      const initial=required(p.initialBatchResources,"initialBatchResources"),addition=required(p.batchAddition,"batchAddition"),total=multiply(a.resources,a.days);answer=solveBatchDays(p);formulaLatex="W=\\frac{n}{2}\\left[2a+(n-1)b\\right]";
      workedLatex=[`W=${toLatex(a.resources)}\\times${toLatex(a.days)}=${toLatex(total)}\\;\\text{resource-days}`,`${toLatex(total)}=\\frac{n}{2}\\left[2(${toLatex(initial)})+(n-1)(${toLatex(addition)})\\right]`,`n=${toLatex(answer)}`];break;
    }
    case "findEquivalentResourceTime":{
      const duration=a.days,unit=p.context.resourceTimeUnit.endsWith("hours")?"hours":"days";answer=multiply(a.resources,duration);formulaLatex="R_{equivalent}=N\\times t";
      workedLatex=[`t=${toLatex(duration)}\\;\\text{${unit}}`,`R_{equivalent}=${toLatex(a.resources)}\\times${toLatex(duration)}=${toLatex(answer)}`];break;
    }
  }
  return {answer,answerType:entry.answerType,formulaLatex,workedLatex,answerText:answerText(entry,p,answer)};
}

export function verifyTmwCp006(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,solution:TmwCp006Solution):boolean{
  const a=p.stateA,b=p.stateB,x=solution.answer;
  switch(entry.solveMode){
    case "findRequiredResourceCount":return equals(multiply(multiply(multiply(x,b.days),b.hoursPerDay),b.efficiency),multiply(capacity(a),divide(b.work,a.work)));
    case "findRequiredDays":return equals(multiply(multiply(multiply(b.resources,x),b.hoursPerDay),b.efficiency),multiply(capacity(a),divide(b.work,a.work)));
    case "findRequiredDailyHours":return equals(multiply(multiply(multiply(b.resources,b.days),x),b.efficiency),multiply(capacity(a),divide(b.work,a.work)));
    case "findRelativeEfficiency":return equals(multiply(multiply(multiply(b.resources,b.days),b.hoursPerDay),x),multiply(capacity(a),divide(b.work,a.work)));
    case "findWorkQuantity":return equals(divide(x,a.work),workRatio(a,b));
    case "findWorkQuantityRatio":return equals(x,workRatio(a,b));
    case "findAdditionalWorkersForDeadline":return equals(add(a.resources,x),requiredResources(a,b));
    case "findWorkersRemovedForDelay":return equals(subtract(a.resources,x),requiredResources(a,b));
    case "findOriginalWorkforceFromChangedSchedule":return equals(x,requiredResources(b,a));
    case "findRemainingDaysFromActualProgress":{const elapsed=required(p.elapsedDays,"elapsedDays"),done=required(p.completedFraction,"completedFraction");return equals(multiply(x,divide(done,elapsed)),subtract(rational(1),done));}
    case "findExtraWorkersFromPlannedVsActualProgress":{const elapsed=required(p.elapsedDays,"elapsedDays"),done=required(p.completedFraction,"completedFraction"),rate=divide(done,multiply(a.resources,elapsed)),daysLeft=subtract(a.days,elapsed);return equals(multiply(multiply(add(a.resources,x),rate),daysLeft),subtract(rational(1),done));}
    case "findPercentWorkCompletedFromResourceHours":return equals(divide(x,rational(100)),divide(capacity(b),capacity(a)));
    case "findPercentScheduleDelay":return equals(divide(x,rational(100)),divide(subtract(requiredDays(a,b),a.days),a.days));
    case "findOvertimeHoursForDeadline":return equals(add(a.hoursPerDay,x),requiredHours(a,b));
    case "findShiftCountForProductionTarget":return equals(multiply(multiply(multiply(b.resources,x),b.hoursPerDay),b.efficiency),b.work);
    case "findDimensionalWorkRatio":return equals(x,divide(product(required(p.dimensionsB,"dimensionsB")),product(required(p.dimensionsA,"dimensionsA"))));
    case "findWorkersForChangedDimensions":{const ratio=divide(product(required(p.dimensionsB,"dimensionsB")),product(required(p.dimensionsA,"dimensionsA")));return equals(multiply(multiply(multiply(x,b.days),b.hoursPerDay),b.efficiency),multiply(capacity(a),ratio));}
    case "findDaysForChangedDimensions":{const ratio=divide(product(required(p.dimensionsB,"dimensionsB")),product(required(p.dimensionsA,"dimensionsA")));return equals(multiply(multiply(multiply(b.resources,x),b.hoursPerDay),b.efficiency),multiply(capacity(a),ratio));}
    case "findResourceDurationAfterPopulationChange":return equals(multiply(required(p.changedPopulation,"changedPopulation"),x),multiply(required(p.initialPopulation,"initialPopulation"),subtract(a.days,required(p.elapsedBeforePopulationChange,"elapsedBeforePopulationChange"))));
    case "findCompletionTimeAfterAbsenteeism":{const active=multiply(a.resources,subtract(rational(1),divide(required(p.absentPercent,"absentPercent"),rational(100))));return equals(multiply(active,x),multiply(a.resources,a.days));}
    case "findCompletionWithBatchWorkerAdditions":return x.denominator===1&&equals(batchTotal(required(p.initialBatchResources,"initialBatchResources"),required(p.batchAddition,"batchAddition"),x),multiply(a.resources,a.days));
    case "findEquivalentResourceTime":return equals(x,multiply(a.resources,a.days));
  }
}

export function isPositiveCp006Answer(solution:TmwCp006Solution):boolean{return compare(solution.answer,rational(0))>0;}
