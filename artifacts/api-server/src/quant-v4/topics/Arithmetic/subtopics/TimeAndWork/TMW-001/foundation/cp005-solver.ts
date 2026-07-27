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
function inverseUnknownRate(p:TmwCp005Parameters,time:Rational):Rational{
 const index=required(p.unknownSegmentIndex,"unknownSegmentIndex"),durations=segmentDurationsUntil(p.cycle,time,p.startOffset??0);
 let knownWork=rational(0);for(let i=0;i<p.cycle.length;i++){if(i!==index)knownWork=add(knownWork,multiply(p.cycle[i].rate,durations[i]));}
 return divide(subtract(p.totalWork,knownWork),durations[index]);
}
function completionSolution(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters):TmwCp005Solution{
 const trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0),cw=cycleWork(p.cycle),cd=cycleDuration(p.cycle);
 return {answer:trace.time,answerType:entry.answerType,formulaLatex:"W_{cycle}=\\sum r_i\\Delta t_i,\\quad T=nT_{cycle}+t_{terminal}",workedLatex:[`W_{cycle}=${toLatex(cw)}`,`T_{cycle}=${toLatex(cd)}`,`T=${toLatex(trace.time)},\\quad \\text{terminal segment: }\\text{${trace.terminalLabel}}`],answerText:answerText(entry,p,trace.time)};
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
   const trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0),cw=cycleWork(p.cycle);
   answer=trace.time;formulaLatex="T=nT_{cycle}+t_{terminal}";workedLatex=[`W_{cycle}=${toLatex(cw)}`,`n=${trace.fullCycles}`,`t_{terminal}=${toLatex(multiply(trace.terminalFraction,p.cycle[trace.terminalIndex].duration))}`,`T=${toLatex(trace.time)}\\;\\text{during ${trace.terminalLabel}}`];break;
  }
  case "findWorkAfterGivenNumberOfCycles":{
   const n=rational(required(p.givenCycles,"givenCycles")),cw=cycleWork(p.cycle);answer=multiply(cw,n);formulaLatex="W=nW_{cycle}";workedLatex=[`W_{cycle}=${toLatex(cw)}`,`W=${toLatex(n)}\\times${toLatex(cw)}=${toLatex(answer)}`];break;
  }
  case "findRemainingWorkAfterFullCycles":{
   const n=rational(required(p.givenCycles,"givenCycles")),cw=cycleWork(p.cycle),done=multiply(cw,n);answer=subtract(p.totalWork,done);formulaLatex="W_{remaining}=1-nW_{cycle}";workedLatex=[`W_{done}=${toLatex(n)}\\times${toLatex(cw)}=${toLatex(done)}`,`W_{remaining}=1-${toLatex(done)}=${toLatex(answer)}`];break;
  }
  case "findTerminalAgent":{
   const trace=completionTrace(p.cycle,p.totalWork,p.startOffset??0);answer=trace.terminalLabel;formulaLatex="\\text{terminal agent}=\\text{agent active when cumulative work first reaches }1";workedLatex=[`T=${toLatex(trace.time)}`,`\\text{terminal agent}=\\text{${trace.terminalLabel}}`];break;
  }
  case "findStartingAgentFromCompletionCondition":{
   const alternate=required(p.alternateCycle,"alternateCycle"),known=required(p.knownCompletionTime,"knownCompletionTime"),terminal=required(p.knownTerminalLabel,"knownTerminalLabel");
   const a=completionTrace(p.cycle,p.totalWork),b=completionTrace(alternate,p.totalWork);
   const matchA=equals(a.time,known)&&a.terminalLabel===terminal,matchB=equals(b.time,known)&&b.terminalLabel===terminal;
   if(matchA===matchB)throw new Error("Starting-agent condition is not unique");
   answer=matchA?p.cycle[0].label:alternate[0].label;formulaLatex="\\text{test both possible cycle phases against the stated completion condition}";workedLatex=[`T_{start\\,1}=${toLatex(a.time)},\\;\\text{terminal}=\\text{${a.terminalLabel}}`,`T_{start\\,2}=${toLatex(b.time)},\\;\\text{terminal}=\\text{${b.terminalLabel}}`,`\\text{matching starter}=\\text{${answer}}`];break;
  }
  case "findUnknownRateFromAlternatingCompletion":{
   const time=required(p.knownCompletionTime,"knownCompletionTime");answer=inverseUnknownRate(p,time);formulaLatex="r_x=\\frac{1-W_{known}}{t_x}";workedLatex=[`t_x=${toLatex(segmentDurationsUntil(p.cycle,time)[required(p.unknownSegmentIndex,"unknownSegmentIndex")])}`,`r_x=${toLatex(answer as Rational)}`];break;
  }
  case "findUnknownTimeFromAlternatingCompletion":{
   const time=required(p.knownCompletionTime,"knownCompletionTime"),rate=inverseUnknownRate(p,time);answer=reciprocal(rate);formulaLatex="T_x=\\frac{1}{r_x}";workedLatex=[`r_x=${toLatex(rate)}`,`T_x=${toLatex(answer as Rational)}`];break;
  }
  case "findCycleCountToReachSpecifiedFraction":{
   const target=required(p.targetWork,"targetWork"),cw=cycleWork(p.cycle);answer=divide(target,cw);if((answer as Rational).denominator!==1)throw new Error("Target fraction is not an exact number of cycles");formulaLatex="n=\\frac{W_{target}}{W_{cycle}}";workedLatex=[`W_{cycle}=${toLatex(cw)}`,`n=\\frac{${toLatex(target)}}{${toLatex(cw)}}=${toLatex(answer as Rational)}`];break;
  }
  case "findOutputUnderPeriodicMachineSchedule":{
   const n=rational(required(p.givenCycles,"givenCycles")),cw=cycleWork(p.cycle);answer=multiply(cw,n);formulaLatex="Q=nQ_{cycle}";workedLatex=[`Q_{cycle}=${toLatex(cw)}`,`Q=${toLatex(n)}\\times${toLatex(cw)}=${toLatex(answer as Rational)}`];break;
  }
  case "findRequiredCycleRateForDeadline":{
   const deadline=required(p.deadline,"deadline");answer=inverseUnknownRate(p,deadline);formulaLatex="r_x=\\frac{1-W_{known}}{t_x}";workedLatex=[`W_{known}=${toLatex(workAfterTime(p.cycle,deadline))}`,`r_x=${toLatex(answer as Rational)}`];break;
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
