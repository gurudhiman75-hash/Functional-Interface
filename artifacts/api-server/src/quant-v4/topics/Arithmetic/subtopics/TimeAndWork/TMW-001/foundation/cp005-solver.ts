import { add, divide, equals, formatRational, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required, timeUnitLabel } from "./cp001-helpers";
import { completionTrace, cycleDuration, cycleWork, replaceSegmentRate, segmentDurationsUntil, workAfterTime } from "./cp005-engine";
import type { Rational } from "./types";
import type { TmwCp005Parameters, TmwCp005RegistryEntry, TmwCp005Solution } from "./cp005-types";

function isRational(value:Rational|string):value is Rational{return typeof value!=="string";}
function answerText(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,answer:Rational|string):string{
 if(typeof answer==="string")return answer;
 const value=formatRational(answer);
 if(entry.answerType==="TIME")return `${value} ${timeUnitLabel(p.timeUnit,answer)}`;
 if(entry.answerType==="FRACTION")return `${value} of the work`;
 if(entry.answerType==="COUNT")return `${value} ${equals(answer,rational(1))?"cycle":"cycles"}`;
 if(entry.answerType==="RATE")return `${value} of the work per ${p.timeUnit}`;
 return `${value} ${p.outputUnit??p.context.outputNoun}`;
}
function cycleExpression(p:TmwCp005Parameters):string{
 const groups:{rate:Rational;duration:Rational}[]=[];
 for(const segment of p.cycle){const existing=groups.find(group=>equals(group.rate,segment.rate));if(existing)existing.duration=add(existing.duration,segment.duration);else groups.push({rate:segment.rate,duration:segment.duration});}
 return groups.map((group,index)=>{
  const negative=group.rate.numerator<0,absoluteRate=negative?multiply(rational(-1),group.rate):group.rate;
  const term=`${toLatex(absoluteRate)}\\times${toLatex(group.duration)}`;
  if(index===0)return negative?`-${term}`:term;
  return negative?`-${term}`:`+${term}`;
 }).join("");
}
function cycleWorkStep(p:TmwCp005Parameters):string{return `W_{cycle}=${cycleExpression(p)}=${toLatex(cycleWork(p.cycle))}`;}
function inverseUnknownRateDetails(p:TmwCp005Parameters,time:Rational):{rate:Rational;knownWork:Rational;remainingWork:Rational;unknownDuration:Rational;durations:Rational[]}{
 const index=required(p.unknownSegmentIndex,"unknownSegmentIndex"),durations=segmentDurationsUntil(p.cycle,time,p.startOffset??0);
 let knownWork=rational(0);for(let i=0;i<p.cycle.length;i++){if(i!==index)knownWork=add(knownWork,multiply(p.cycle[i].rate,durations[i]));}
 const remainingWork=subtract(p.totalWork,knownWork),unknownDuration=durations[index];
 return {rate:divide(remainingWork,unknownDuration),knownWork,remainingWork,unknownDuration,durations};
}
function completionSolution(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters):TmwCp005Solution{
 const trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0),cw=cycleWork(p.cycle),cd=cycleDuration(p.cycle);
 if(entry.solveMode==="findExactBoundaryCompletion"){
  const cycles=divide(p.totalWork,cw),time=multiply(cycles,cd);
  return {answer:trace.time,answerType:entry.answerType,formulaLatex:"n=\\frac{W}{W_{cycle}},\\quad T=nT_{cycle}",workedLatex:[cycleWorkStep(p),`T_{cycle}=${toLatex(cd)}`,`n=\\frac{${toLatex(p.totalWork)}}{${toLatex(cw)}}=${toLatex(cycles)}`,`T=${toLatex(cycles)}\\times${toLatex(cd)}=${toLatex(time)}`],answerText:answerText(entry,p,trace.time)};
 }
 const fullCycles=rational(trace.fullCycles),fullCycleWork=multiply(cw,fullCycles),remainingWork=subtract(p.totalWork,fullCycleWork),terminalSegment=p.cycle[trace.terminalIndex],terminalTime=multiply(trace.terminalFraction,terminalSegment.duration);
 const workedLatex=[cycleWorkStep(p),`T_{cycle}=${toLatex(cd)}`,`n=${toLatex(fullCycles)},\\quad W_{full\\ cycles}=${toLatex(fullCycles)}\\times${toLatex(cw)}=${toLatex(fullCycleWork)}`,`W_{remaining}=${toLatex(p.totalWork)}-${toLatex(fullCycleWork)}=${toLatex(remainingWork)}`,`t_{final}=\\frac{${toLatex(remainingWork)}}{${toLatex(terminalSegment.rate)}}=${toLatex(terminalTime)}\\quad\\text{for ${terminalSegment.label}}`];
 if(entry.solveMode==="findCompletionWithinCycleSegment")workedLatex.push(`\\text{fraction of final block}=\\frac{${toLatex(terminalTime)}}{${toLatex(terminalSegment.duration)}}=${toLatex(trace.terminalFraction)}`);
 workedLatex.push(`T=${toLatex(fullCycles)}\\times${toLatex(cd)}+${toLatex(terminalTime)}=${toLatex(trace.time)}`);
 return {answer:trace.time,answerType:entry.answerType,formulaLatex:"W_{cycle}=\\sum r_i\\Delta t_i,\\quad t_{final}=\\frac{W_{remaining}}{r_{final}},\\quad T=nT_{cycle}+t_{final}",workedLatex,answerText:answerText(entry,p,trace.time)};
}
export function solveTmwCp005(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters):TmwCp005Solution{
 let answer:Rational|string,formulaLatex:string,workedLatex:string[];
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":
  case "findCompletionTimeForTwoAgentAlternationStartingB":
  case "findCompletionTimeForMultiDayCycle":
  case "findCompletionTimeForThreeAgentCycle":
  case "findCompletionWhenHelperWorksEveryNthDay":
  case "findCompletionWhenAgentRestsEveryNthDay":
  case "findCompletionWithWeekendOrHolidayPattern":
  case "findCompletionWithUnequalShiftDurations":
  case "findCompletionWithTwoDaysOnOneDayOffPattern":
  case "findCompletionWithPeriodicNegativeWork":
  case "findCompletionWithRepeatedJoinLeaveCycle":
  case "findTimeFromArbitraryCyclePhase":
  case "findExactBoundaryCompletion":
  case "findCompletionWithinCycleSegment": return completionSolution(entry,p);
  case "findCompletionDayAndTerminalFraction":{
   const trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0),cw=cycleWork(p.cycle),cd=cycleDuration(p.cycle),fullCycles=rational(trace.fullCycles),completeDays=multiply(fullCycles,cd),done=multiply(fullCycles,cw),remaining=subtract(p.totalWork,done),segment=p.cycle[trace.terminalIndex],finalTime=multiply(trace.terminalFraction,segment.duration);
   answer=trace.time;formulaLatex="t_{final}=\\frac{W_{remaining}}{r_{final}},\\quad T=nT_{cycle}+t_{final}";workedLatex=[cycleWorkStep(p),`n=${toLatex(fullCycles)},\\quad \\text{complete days}=${toLatex(fullCycles)}\\times${toLatex(cd)}=${toLatex(completeDays)}`,`W_{remaining}=${toLatex(p.totalWork)}-${toLatex(done)}=${toLatex(remaining)}`,`t_{final}=\\frac{${toLatex(remaining)}}{${toLatex(segment.rate)}}=${toLatex(finalTime)}\\quad\\text{during ${segment.label}}`,`T=${toLatex(completeDays)}+${toLatex(finalTime)}=${toLatex(trace.time)}`];break;
  }
  case "findWorkAfterGivenNumberOfCycles":{
   const n=rational(required(p.givenCycles,"givenCycles")),cw=cycleWork(p.cycle);answer=multiply(cw,n);formulaLatex="W=nW_{cycle}";workedLatex=[cycleWorkStep(p),`W=${toLatex(n)}\\times${toLatex(cw)}=${toLatex(answer)}`];break;
  }
  case "findRemainingWorkAfterFullCycles":{
   const n=rational(required(p.givenCycles,"givenCycles")),cw=cycleWork(p.cycle),done=multiply(cw,n);answer=subtract(p.totalWork,done);formulaLatex="W_{remaining}=1-nW_{cycle}";workedLatex=[cycleWorkStep(p),`W_{done}=${toLatex(n)}\\times${toLatex(cw)}=${toLatex(done)}`,`W_{remaining}=1-${toLatex(done)}=${toLatex(answer)}`];break;
  }
  case "findTerminalAgent":{
   const trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0),cw=cycleWork(p.cycle),n=rational(trace.fullCycles),done=multiply(cw,n),remaining=subtract(p.totalWork,done),segment=p.cycle[trace.terminalIndex],needed=divide(remaining,segment.rate);
   answer=trace.terminalLabel;formulaLatex="t_{needed}=\\frac{W_{remaining}}{r_{next}}";workedLatex=[cycleWorkStep(p),`W_{remaining}=${toLatex(p.totalWork)}-${toLatex(done)}=${toLatex(remaining)}`,`t_{needed}=\\frac{${toLatex(remaining)}}{${toLatex(segment.rate)}}=${toLatex(needed)}\\le${toLatex(segment.duration)}`,`\\text{worker active in this turn}=\\text{${trace.terminalLabel}}`];break;
  }
  case "findStartingAgentFromCompletionCondition":{
   const alternate=required(p.alternateCycle,"alternateCycle"),known=required(p.knownCompletionTime,"knownCompletionTime"),terminal=required(p.knownTerminalLabel,"knownTerminalLabel");
   const a=completionTrace(p.cycle,p.totalWork),b=completionTrace(alternate,p.totalWork);
   const matchA=equals(a.time,known)&&a.terminalLabel===terminal,matchB=equals(b.time,known)&&b.terminalLabel===terminal;
   if(matchA===matchB)throw new Error("Starting-agent condition is not unique");
   answer=matchA?p.cycle[0].label:alternate[0].label;formulaLatex="\\text{compare both possible starting orders with the stated result}";workedLatex=[`T_{\\text{start with ${p.cycle[0].label}}}=${toLatex(a.time)},\\quad\\text{final worker}=\\text{${a.terminalLabel}}`,`T_{\\text{start with ${alternate[0].label}}}=${toLatex(b.time)},\\quad\\text{final worker}=\\text{${b.terminalLabel}}`,`\\text{matching start}=\\text{${answer}}`];break;
  }
  case "findUnknownRateFromAlternatingCompletion":{
   const time=required(p.knownCompletionTime,"knownCompletionTime"),details=inverseUnknownRateDetails(p,time);answer=details.rate;formulaLatex="r_x=\\frac{1-W_{known}}{t_x}";workedLatex=[`t_x=${toLatex(details.unknownDuration)}`,`W_{known}=${toLatex(details.knownWork)}`,`W_{remaining}=1-${toLatex(details.knownWork)}=${toLatex(details.remainingWork)}`,`r_x=\\frac{${toLatex(details.remainingWork)}}{${toLatex(details.unknownDuration)}}=${toLatex(details.rate)}`];break;
  }
  case "findUnknownTimeFromAlternatingCompletion":{
   const time=required(p.knownCompletionTime,"knownCompletionTime"),details=inverseUnknownRateDetails(p,time);answer=reciprocal(details.rate);formulaLatex="r_x=\\frac{1-W_{known}}{t_x},\\quad T_x=\\frac{1}{r_x}";workedLatex=[`t_x=${toLatex(details.unknownDuration)}`,`W_{known}=${toLatex(details.knownWork)}`,`W_{remaining}=1-${toLatex(details.knownWork)}=${toLatex(details.remainingWork)}`,`r_x=\\frac{${toLatex(details.remainingWork)}}{${toLatex(details.unknownDuration)}}=${toLatex(details.rate)}`,`T_x=\\frac{1}{${toLatex(details.rate)}}=${toLatex(answer as Rational)}`];break;
  }
  case "findCycleCountToReachSpecifiedFraction":{
   const target=required(p.targetWork,"targetWork"),cw=cycleWork(p.cycle);answer=divide(target,cw);if((answer as Rational).denominator!==1)throw new Error("Target fraction is not an exact number of cycles");formulaLatex="n=\\frac{W_{target}}{W_{cycle}}";workedLatex=[cycleWorkStep(p),`n=\\frac{${toLatex(target)}}{${toLatex(cw)}}=${toLatex(answer as Rational)}`];break;
  }
  case "findOutputUnderPeriodicMachineSchedule":{
   const n=rational(required(p.givenCycles,"givenCycles")),first=multiply(p.cycle[0].rate,p.cycle[0].duration),second=multiply(p.cycle[1].rate,p.cycle[1].duration),cw=add(first,second);answer=multiply(cw,n);formulaLatex="Q_{cycle}=q_1t_1+q_2t_2,\\quad Q=nQ_{cycle}";workedLatex=[`Q_1=${toLatex(p.cycle[0].rate)}\\times${toLatex(p.cycle[0].duration)}=${toLatex(first)}`,`Q_2=${toLatex(p.cycle[1].rate)}\\times${toLatex(p.cycle[1].duration)}=${toLatex(second)}`,`Q_{cycle}=${toLatex(first)}+${toLatex(second)}=${toLatex(cw)}`,`Q=${toLatex(n)}\\times${toLatex(cw)}=${toLatex(answer as Rational)}`];break;
  }
  case "findRequiredCycleRateForDeadline":{
   const deadline=required(p.deadline,"deadline"),details=inverseUnknownRateDetails(p,deadline);answer=details.rate;formulaLatex="r_x=\\frac{1-W_{known}}{t_x}";workedLatex=[`t_x=${toLatex(details.unknownDuration)}`,`W_{known}=${toLatex(details.knownWork)}`,`W_{remaining}=1-${toLatex(details.knownWork)}=${toLatex(details.remainingWork)}`,`r_x=\\frac{${toLatex(details.remainingWork)}}{${toLatex(details.unknownDuration)}}=${toLatex(details.rate)}`];break;
  }
 }
 return {answer,answerType:entry.answerType,formulaLatex,workedLatex,answerText:answerText(entry,p,answer)};
}

export function verifyTmwCp005(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,solution:TmwCp005Solution):boolean{
 const a=solution.answer;
 switch(entry.solveMode){
  case "findWorkAfterGivenNumberOfCycles": return isRational(a)&&equals(a,multiply(cycleWork(p.cycle),rational(required(p.givenCycles,"givenCycles"))));
  case "findRemainingWorkAfterFullCycles": return isRational(a)&&equals(add(a,multiply(cycleWork(p.cycle),rational(required(p.givenCycles,"givenCycles")))),p.totalWork);
  case "findTerminalAgent": return typeof a==="string"&&a===completionTrace(p.cycle,p.totalWork,p.startOffset??0).terminalLabel;
  case "findStartingAgentFromCompletionCondition": return typeof a==="string"&&a===required(p.expectedStartLabel,"expectedStartLabel");
  case "findUnknownRateFromAlternatingCompletion":
  case "findRequiredCycleRateForDeadline":{
   if(!isRational(a))return false;const time=entry.solveMode==="findRequiredCycleRateForDeadline"?required(p.deadline,"deadline"):required(p.knownCompletionTime,"knownCompletionTime"),cycle=replaceSegmentRate(p.cycle,required(p.unknownSegmentIndex,"unknownSegmentIndex"),a);return equals(workAfterTime(cycle,time,p.startOffset??0),p.totalWork);
  }
  case "findUnknownTimeFromAlternatingCompletion":{
   if(!isRational(a))return false;const rate=reciprocal(a),time=required(p.knownCompletionTime,"knownCompletionTime"),cycle=replaceSegmentRate(p.cycle,required(p.unknownSegmentIndex,"unknownSegmentIndex"),rate);return equals(workAfterTime(cycle,time),p.totalWork);
  }
  case "findCycleCountToReachSpecifiedFraction": return isRational(a)&&equals(multiply(a,cycleWork(p.cycle)),required(p.targetWork,"targetWork"));
  case "findOutputUnderPeriodicMachineSchedule": return isRational(a)&&equals(a,multiply(cycleWork(p.cycle),rational(required(p.givenCycles,"givenCycles"))));
  default:return isRational(a)&&equals(a,completionTrace(p.cycle,p.totalWork,p.startOffset??0).time);
 }
}
