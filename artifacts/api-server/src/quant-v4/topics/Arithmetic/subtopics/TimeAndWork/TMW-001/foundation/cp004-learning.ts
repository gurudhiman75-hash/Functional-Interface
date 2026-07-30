import { add, divide, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp004MisconceptionId, TmwCp004Option, TmwCp004Parameters, TmwCp004RegistryEntry, TmwCp004Solution } from "./cp004-types";

export interface TmwCp004LearningShortcut {
  title: string;
  steps: string[];
}

export interface TmwCp004CommonTrap {
  optionLabel: string;
  optionText: string;
  misconceptionId: Exclude<TmwCp004MisconceptionId, "CORRECT">;
  explanation: string;
}

function rate(p:TmwCp004Parameters,key:"rateA"|"rateB"|"rateC"):Rational{return required(p[key],key);}
function duration(p:TmwCp004Parameters,key:"durationA"|"durationB"|"durationC"):Rational{return required(p[key],key);}
function sum(values:Rational[]):Rational{return values.reduce((total,value)=>add(total,value),rational(0));}
function work(r:Rational,t:Rational):Rational{return multiply(r,t);}
function remaining(done:Rational):Rational{return subtract(rational(1),done);}

function setupLatex(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters):string{
  switch(entry.solveMode){
    case "findRemainingWorkAfterInitialPhase":return `r_A=${toLatex(rate(p,"rateA"))},\\quad t_1=${toLatex(duration(p,"durationA"))},\\quad W=1`;
    case "findWorkCompletedBeforeEvent":return `r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad t_1=${toLatex(duration(p,"durationA"))}`;
    case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":return `r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad t_A=${toLatex(duration(p,"durationA"))}`;
    case "findTotalTimeWhenTeamStartsThenOneLeaves":return `r_{AB}=${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))},\\quad t_{AB}=${toLatex(duration(p,"durationA"))},\\quad r_{final}=r_A`;
    case "findTotalTimeWhenOneStartsThenAnotherJoins":return `r_A=${toLatex(rate(p,"rateA"))},\\quad t_A=${toLatex(duration(p,"durationA"))},\\quad r_{final}=r_A+r_B`;
    case "findTotalTimeWithStaggeredJoins":return `t_1=${toLatex(duration(p,"durationA"))},\\quad t_2=${toLatex(duration(p,"durationB"))},\\quad r_1=r_A,\\ r_2=r_A+r_B,\\ r_3=r_A+r_B+r_C`;
    case "findTotalTimeWithStaggeredExits":return `t_1=${toLatex(duration(p,"durationA"))},\\quad t_2=${toLatex(duration(p,"durationB"))},\\quad r_1=r_A+r_B+r_C,\\ r_2=r_A+r_B,\\ r_3=r_A`;
    case "findTotalTimeWithJoinAndLeaveEvents":return `t_1=${toLatex(duration(p,"durationA"))},\\quad t_2=${toLatex(duration(p,"durationB"))},\\quad r_1=r_A,\\ r_2=r_A+r_B,\\ r_3=r_B`;
    case "findJoinTimeFromFinalCompletion":return `T=${toLatex(required(p.totalCompletionTime,"totalCompletionTime"))},\\quad r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad x=t_{join}`;
    case "findLeaveTimeFromFinalCompletion":return `T=${toLatex(required(p.totalCompletionTime,"totalCompletionTime"))},\\quad r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad x=t_{leave}`;
    case "findUnknownInitialPhaseDuration":return `r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad t_B=${toLatex(duration(p,"durationB"))},\\quad x=t_A`;
    case "findUnknownFinalPhaseDuration":return `r_A=${toLatex(rate(p,"rateA"))},\\quad t_A=${toLatex(duration(p,"durationA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad y=t_B`;
    case "findReplacementWorkerRate":return `r_A=${toLatex(rate(p,"rateA"))},\\quad t_A=${toLatex(duration(p,"durationA"))},\\quad t_B=${toLatex(duration(p,"durationB"))},\\quad r_B=?`;
    case "findReplacementWorkerTime":return `r_A=${toLatex(rate(p,"rateA"))},\\quad t_A=${toLatex(duration(p,"durationA"))},\\quad t_B=${toLatex(duration(p,"durationB"))},\\quad T_B=1/r_B`;
    case "findCompletionWithIdleInterval":return `t_A=${toLatex(duration(p,"durationA"))},\\quad t_{idle}=${toLatex(required(p.idleDuration,"idleDuration"))},\\quad r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))}`;
    case "findCompletionWithChangedDailyHours":return `r_{old}=${toLatex(rate(p,"rateA"))},\\quad h_{old}=${toLatex(required(p.originalDailyHours,"originalDailyHours"))},\\quad h_{new}=${toLatex(required(p.changedDailyHours,"changedDailyHours"))},\\quad t_1=${toLatex(duration(p,"durationA"))}`;
    case "findCompletionWithMidProjectEfficiencyChange":return `r=${toLatex(rate(p,"rateA"))},\\quad t_1=${toLatex(duration(p,"durationA"))},\\quad m=${toLatex(required(p.efficiencyMultiplier,"efficiencyMultiplier"))}`;
    case "findCompletionWithNegativeWorkerActivatedLater":return `r_+=${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))},\\quad r_-=${toLatex(rate(p,"rateC"))},\\quad t_1=${toLatex(duration(p,"durationA"))}`;
    case "findEventTimeAtSpecifiedCompletionFraction":return `r_A=${toLatex(rate(p,"rateA"))},\\quad W_{event}=${toLatex(required(p.targetFraction,"targetFraction"))}`;
    case "findRequiredRemainingRateForDeadline":return `r_A=${toLatex(rate(p,"rateA"))},\\quad t_1=${toLatex(duration(p,"durationA"))},\\quad D=${toLatex(required(p.deadline,"deadline"))}`;
    case "findWorkerCountAddedAfterPartialProgress":return `n=${required(p.initialWorkerCount,"initialWorkerCount")},\\quad r_x=${toLatex(rate(p,"rateA"))},\\quad t_1=${toLatex(duration(p,"durationA"))},\\quad D=${toLatex(required(p.deadline,"deadline"))}`;
    case "findWorkerCountRemovedAfterPartialProgress":return `n=${required(p.initialWorkerCount,"initialWorkerCount")},\\quad r_x=${toLatex(rate(p,"rateA"))},\\quad t_1=${toLatex(duration(p,"durationA"))},\\quad D=${toLatex(required(p.deadline,"deadline"))}`;
    case "findDelayAfterWorkerLeaves":return `r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad t_{leave}=${toLatex(duration(p,"durationA"))}`;
    case "findEarlyCompletionAfterWorkerJoins":return `r_A=${toLatex(rate(p,"rateA"))},\\quad r_B=${toLatex(rate(p,"rateB"))},\\quad t_{join}=${toLatex(duration(p,"durationA"))}`;
  }
}

function checkLatex(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,s:TmwCp004Solution):string{
  const a=s.answer;
  switch(entry.solveMode){
    case "findRemainingWorkAfterInitialPhase":return `\\text{Check: }${toLatex(a)}+${toLatex(rate(p,"rateA"))}\\times${toLatex(duration(p,"durationA"))}=1`;
    case "findWorkCompletedBeforeEvent":return `\\text{Check: }${toLatex(a)}=(${toLatex(rate(p,"rateA"))}+${toLatex(rate(p,"rateB"))})${toLatex(duration(p,"durationA"))}`;
    case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(rate(p,"rateB"))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))})=1`;
    case "findTotalTimeWhenTeamStartsThenOneLeaves":return `(${toLatex(rate(p,"rateA"))}+${toLatex(rate(p,"rateB"))})${toLatex(duration(p,"durationA"))}+${toLatex(rate(p,"rateA"))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))})=1`;
    case "findTotalTimeWhenOneStartsThenAnotherJoins":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+(${toLatex(rate(p,"rateA"))}+${toLatex(rate(p,"rateB"))})(${toLatex(a)}-${toLatex(duration(p,"durationA"))})=1`;
    case "findTotalTimeWithStaggeredJoins":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))}${toLatex(duration(p,"durationB"))}+${toLatex(sum([rate(p,"rateA"),rate(p,"rateB"),rate(p,"rateC")]))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))}-${toLatex(duration(p,"durationB"))})=1`;
    case "findTotalTimeWithStaggeredExits":return `${toLatex(sum([rate(p,"rateA"),rate(p,"rateB"),rate(p,"rateC")]))}${toLatex(duration(p,"durationA"))}+${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))}${toLatex(duration(p,"durationB"))}+${toLatex(rate(p,"rateA"))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))}-${toLatex(duration(p,"durationB"))})=1`;
    case "findTotalTimeWithJoinAndLeaveEvents":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))}${toLatex(duration(p,"durationB"))}+${toLatex(rate(p,"rateB"))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))}-${toLatex(duration(p,"durationB"))})=1`;
    case "findJoinTimeFromFinalCompletion":return `${toLatex(rate(p,"rateA"))}${toLatex(a)}+${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))}(${toLatex(required(p.totalCompletionTime,"totalCompletionTime"))}-${toLatex(a)})=1`;
    case "findLeaveTimeFromFinalCompletion":return `${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))}${toLatex(a)}+${toLatex(rate(p,"rateB"))}(${toLatex(required(p.totalCompletionTime,"totalCompletionTime"))}-${toLatex(a)})=1`;
    case "findUnknownInitialPhaseDuration":return `${toLatex(rate(p,"rateA"))}${toLatex(a)}+${toLatex(rate(p,"rateB"))}${toLatex(duration(p,"durationB"))}=1`;
    case "findUnknownFinalPhaseDuration":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(rate(p,"rateB"))}${toLatex(a)}=1`;
    case "findReplacementWorkerRate":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(a)}${toLatex(duration(p,"durationB"))}=1`;
    case "findReplacementWorkerTime":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+\\frac{${toLatex(duration(p,"durationB"))}}{${toLatex(a)}}=1`;
    case "findCompletionWithIdleInterval":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(rate(p,"rateB"))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))}-${toLatex(required(p.idleDuration,"idleDuration"))})=1`;
    case "findCompletionWithChangedDailyHours":{
      const newRate=multiply(rate(p,"rateA"),divide(required(p.changedDailyHours,"changedDailyHours"),required(p.originalDailyHours,"originalDailyHours")));
      return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(newRate)}(${toLatex(a)}-${toLatex(duration(p,"durationA"))})=1`;
    }
    case "findCompletionWithMidProjectEfficiencyChange":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(multiply(rate(p,"rateA"),required(p.efficiencyMultiplier,"efficiencyMultiplier")))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))})=1`;
    case "findCompletionWithNegativeWorkerActivatedLater":return `${toLatex(add(rate(p,"rateA"),rate(p,"rateB")))}${toLatex(duration(p,"durationA"))}+${toLatex(subtract(add(rate(p,"rateA"),rate(p,"rateB")),rate(p,"rateC")))}(${toLatex(a)}-${toLatex(duration(p,"durationA"))})=1`;
    case "findEventTimeAtSpecifiedCompletionFraction":return `${toLatex(rate(p,"rateA"))}\\times${toLatex(a)}=${toLatex(required(p.targetFraction,"targetFraction"))}`;
    case "findRequiredRemainingRateForDeadline":return `${toLatex(rate(p,"rateA"))}${toLatex(duration(p,"durationA"))}+${toLatex(a)}(${toLatex(required(p.deadline,"deadline"))}-${toLatex(duration(p,"durationA"))})=1`;
    case "findWorkerCountAddedAfterPartialProgress":{
      const n=rational(required(p.initialWorkerCount,"initialWorkerCount"));
      return `${toLatex(multiply(n,rate(p,"rateA")))}${toLatex(duration(p,"durationA"))}+${toLatex(multiply(add(n,a),rate(p,"rateA")))}(${toLatex(required(p.deadline,"deadline"))}-${toLatex(duration(p,"durationA"))})=1`;
    }
    case "findWorkerCountRemovedAfterPartialProgress":{
      const n=rational(required(p.initialWorkerCount,"initialWorkerCount"));
      return `${toLatex(multiply(n,rate(p,"rateA")))}${toLatex(duration(p,"durationA"))}+${toLatex(multiply(subtract(n,a),rate(p,"rateA")))}(${toLatex(required(p.deadline,"deadline"))}-${toLatex(duration(p,"durationA"))})=1`;
    }
    case "findDelayAfterWorkerLeaves":{
      const combined=add(rate(p,"rateA"),rate(p,"rateB")),baseline=reciprocal(combined),done=work(combined,duration(p,"durationA")),actual=add(duration(p,"durationA"),divide(remaining(done),rate(p,"rateA")));
      return `\\text{Check: }${toLatex(a)}=${toLatex(actual)}-${toLatex(baseline)}`;
    }
    case "findEarlyCompletionAfterWorkerJoins":{
      const baseline=reciprocal(rate(p,"rateA")),done=work(rate(p,"rateA"),duration(p,"durationA")),actual=add(duration(p,"durationA"),divide(remaining(done),add(rate(p,"rateA"),rate(p,"rateB"))));
      return `\\text{Check: }${toLatex(a)}=${toLatex(baseline)}-${toLatex(actual)}`;
    }
  }
}

export function buildTmwCp004WorkingLatex(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,s:TmwCp004Solution):string[]{return [setupLatex(entry,p),...s.workedLatex,checkLatex(entry,p,s)];}

export function buildTmwCp004Shortcut(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,s:TmwCp004Solution):TmwCp004LearningShortcut{
  switch(entry.solveMode){
    case "findRemainingWorkAfterInitialPhase":return {title:"10-Second Initial-Phase Complement",steps:[`Multiply the first rate by its duration and subtract from one; the remainder is ${s.answerText}.`]};
    case "findWorkCompletedBeforeEvent":return {title:"10-Second Pre-Event Work",steps:[`Add the active rates and multiply by the pre-event duration; completed work is ${s.answerText}.`]};
    case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":return {title:"10-Second Handoff Ledger",steps:[`Find the first agent's work, divide the remainder by the second rate, and add both durations to get ${s.answerText}.`]};
    case "findTotalTimeWhenTeamStartsThenOneLeaves":return {title:"10-Second Team-to-Solo Ledger",steps:[`Book the together phase first, then time the remainder at the continuing agent's solo rate; total ${s.answerText}.`]};
    case "findTotalTimeWhenOneStartsThenAnotherJoins":return {title:"10-Second Solo-to-Team Ledger",steps:[`Book the solo phase, then divide the remainder by the joined rate; completion occurs in ${s.answerText}.`]};
    case "findTotalTimeWithStaggeredJoins":return {title:"10-Second Growing-Team Ledger",steps:[`Use one rate per join interval, carry the remainder forward, and finish with all active rates; total ${s.answerText}.`]};
    case "findTotalTimeWithStaggeredExits":return {title:"10-Second Shrinking-Team Ledger",steps:[`Reduce the active rate after each exit and time only the final remainder at the last rate; total ${s.answerText}.`]};
    case "findTotalTimeWithJoinAndLeaveEvents":return {title:"10-Second Join-Then-Leave Ledger",steps:[`Track solo, together, and final-solo work in order; their durations sum to ${s.answerText}.`]};
    case "findJoinTimeFromFinalCompletion":return {title:"10-Second Backsolve Join Event",steps:[`Let x be the solo period, write both phase contributions against the known total time, and solve x=${s.answerText}.`]};
    case "findLeaveTimeFromFinalCompletion":return {title:"10-Second Backsolve Leave Event",steps:[`Let x be the together period, use the known finish time for the solo remainder, and obtain x=${s.answerText}.`]};
    case "findUnknownInitialPhaseDuration":return {title:"10-Second Missing First Phase",steps:[`Subtract the known final-phase work from one and divide by the initial rate; the first phase is ${s.answerText}.`]};
    case "findUnknownFinalPhaseDuration":return {title:"10-Second Missing Last Phase",steps:[`Subtract the initial work from one and divide the remainder by the final rate; duration ${s.answerText}.`]};
    case "findReplacementWorkerRate":return {title:"10-Second Replacement Rate",steps:[`Divide the work left after the first worker by the replacement's allowed duration; required rate ${s.answerText}.`]};
    case "findReplacementWorkerTime":return {title:"10-Second Replacement Solo Time",steps:[`Find the replacement rate from the handoff phase, then invert it; solo time ${s.answerText}.`]};
    case "findCompletionWithIdleInterval":return {title:"10-Second Calendar Plus Work Time",steps:[`Add the first work period, the zero-work idle interval, and the final work period; elapsed time ${s.answerText}.`]};
    case "findCompletionWithChangedDailyHours":return {title:"10-Second Hour-Scaled Rate",steps:[`Scale the daily rate by new hours ÷ old hours, then time the remaining work; total ${s.answerText}.`]};
    case "findCompletionWithMidProjectEfficiencyChange":return {title:"10-Second Midpoint Efficiency Scale",steps:[`Multiply the original rate by the new efficiency factor only after the event, then finish the remainder in ${s.answerText}.`]};
    case "findCompletionWithNegativeWorkerActivatedLater":return {title:"10-Second Activated Rework Rate",steps:[`After activation, subtract the rework rate from the productive rate and time the remainder; total ${s.answerText}.`]};
    case "findEventTimeAtSpecifiedCompletionFraction":return {title:"10-Second Fraction Event Time",steps:[`Divide the required completion fraction by the current work rate; the event occurs after ${s.answerText}.`]};
    case "findRequiredRemainingRateForDeadline":return {title:"10-Second Deadline Remainder Rate",steps:[`Divide remaining work by the time left after the initial phase; required rate ${s.answerText}.`]};
    case "findWorkerCountAddedAfterPartialProgress":return {title:"10-Second Added-Worker Backsolve",steps:[`Find the total workforce needed for the remaining work, then subtract the current workforce; add ${s.answerText}.`]};
    case "findWorkerCountRemovedAfterPartialProgress":return {title:"10-Second Removed-Worker Backsolve",steps:[`Find the workforce that must remain for the final phase, then subtract it from the original count; ${s.answerText} left.`]};
    case "findDelayAfterWorkerLeaves":return {title:"10-Second Departure Delay",steps:[`Compute staged completion and uninterrupted team completion separately, then subtract; delay ${s.answerText}.`]};
    case "findEarlyCompletionAfterWorkerJoins":return {title:"10-Second Joining Time Saving",steps:[`Compare the staged joined completion with the original solo time; the saving is ${s.answerText}.`]};
  }
}

const preferredTrap:Partial<Record<TmwCp004RegistryEntry["solveMode"],TmwCp004MisconceptionId[]>>={
  findRemainingWorkAfterInitialPhase:["REMAINING_REPORTED_AS_COMPLETED","ELAPSED_WORK_IGNORED"],
  findWorkCompletedBeforeEvent:["COMPLETED_REPORTED_AS_REMAINING","ELAPSED_WORK_IGNORED"],
  findTotalTimeWhenFirstAgentStartsThenSecondFinishes:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findTotalTimeWhenTeamStartsThenOneLeaves:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findTotalTimeWhenOneStartsThenAnotherJoins:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findTotalTimeWithStaggeredJoins:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findTotalTimeWithStaggeredExits:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findTotalTimeWithJoinAndLeaveEvents:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findJoinTimeFromFinalCompletion:["TOTAL_TIME_REPORTED_AS_EVENT","EVENT_TIME_REPORTED_AS_TOTAL"],
  findLeaveTimeFromFinalCompletion:["TOTAL_TIME_REPORTED_AS_EVENT","EVENT_TIME_REPORTED_AS_TOTAL"],
  findUnknownInitialPhaseDuration:["FINAL_PHASE_OMITTED","INITIAL_PHASE_OMITTED"],
  findUnknownFinalPhaseDuration:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findReplacementWorkerRate:["ELAPSED_WORK_IGNORED","REMAINING_REPORTED_AS_COMPLETED"],
  findReplacementWorkerTime:["FINAL_PHASE_OMITTED","EVENT_TIME_REPORTED_AS_TOTAL"],
  findCompletionWithIdleInterval:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findCompletionWithChangedDailyHours:["EVENT_TIME_REPORTED_AS_TOTAL","ORIGINAL_TOTAL_TIME_REPORTED"],
  findCompletionWithMidProjectEfficiencyChange:["EVENT_TIME_REPORTED_AS_TOTAL","ORIGINAL_TOTAL_TIME_REPORTED"],
  findCompletionWithNegativeWorkerActivatedLater:["EVENT_TIME_REPORTED_AS_TOTAL","FINAL_PHASE_OMITTED"],
  findEventTimeAtSpecifiedCompletionFraction:["ORIGINAL_TOTAL_TIME_REPORTED","EVENT_TIME_REPORTED_AS_TOTAL"],
  findRequiredRemainingRateForDeadline:["DEADLINE_REPORTED_AS_ANSWER","ELAPSED_WORK_IGNORED"],
  findWorkerCountAddedAfterPartialProgress:["TOTAL_COUNT_REPORTED_AS_ADDED","ADDED_COUNT_REPORTED_AS_TOTAL"],
  findWorkerCountRemovedAfterPartialProgress:["ADDED_COUNT_REPORTED_AS_TOTAL","TOTAL_COUNT_REPORTED_AS_ADDED"],
  findDelayAfterWorkerLeaves:["EVENT_TIME_REPORTED_AS_TOTAL","ORIGINAL_TOTAL_TIME_REPORTED"],
  findEarlyCompletionAfterWorkerJoins:["EVENT_TIME_REPORTED_AS_TOTAL","ORIGINAL_TOTAL_TIME_REPORTED"],
};

function trapReason(id:Exclude<TmwCp004MisconceptionId,"CORRECT">):string{
  switch(id){
    case "COMPLETED_REPORTED_AS_REMAINING":return "reports completed work although the question asks for the remainder";
    case "REMAINING_REPORTED_AS_COMPLETED":return "uses the complement although the question asks for completed work";
    case "INITIAL_PHASE_OMITTED":return "drops the work or time accumulated before the event";
    case "FINAL_PHASE_OMITTED":return "stops at the event and leaves the final phase uncounted";
    case "PHASE_RATES_SWAPPED":return "assigns a phase to the wrong active worker rate";
    case "RATES_ADDED_ACROSS_SEQUENTIAL_PHASES":return "adds rates that operate in separate, sequential intervals";
    case "EVENT_TIME_REPORTED_AS_TOTAL":return "reports an event duration instead of the full elapsed completion time";
    case "TOTAL_TIME_REPORTED_AS_EVENT":return "copies the known final completion time instead of solving the event time";
    case "IDLE_INTERVAL_OMITTED":return "leaves zero-work calendar time out of total elapsed time";
    case "IDLE_INTERVAL_TREATED_AS_WORK":return "credits productive work during an explicitly idle interval";
    case "RATE_CHANGE_APPLIED_TO_TIME":return "scales elapsed time directly instead of changing the post-event rate";
    case "HOUR_CHANGE_IGNORED":return "keeps the old daily rate after working hours change";
    case "DESTRUCTIVE_RATE_ADDED":return "adds the rework rate although it removes completed work";
    case "DESTRUCTIVE_RATE_OMITTED":return "ignores the work lost after the adverse process activates";
    case "ELAPSED_WORK_IGNORED":return "calculates the next phase from the whole job rather than the work remaining";
    case "DEADLINE_REPORTED_AS_ANSWER":return "copies the deadline instead of deriving the rate or event quantity needed to meet it";
    case "TOTAL_COUNT_REPORTED_AS_ADDED":return "reports the total final workforce although only the number added is required";
    case "ADDED_COUNT_REPORTED_AS_TOTAL":return "reports a workforce change as though it were the final total";
    case "ORIGINAL_TOTAL_TIME_REPORTED":return "copies the original uninterrupted completion time without applying the event";
    case "CHANGED_TOTAL_TIME_REPORTED":return "reports the changed completion time although only the delay or saving is required";
    case "PLAUSIBLE_SCALE_ERROR":return "is numerically nearby but does not balance the generated phase ledger";
  }
}

export function buildTmwCp004CommonTrap(entry:TmwCp004RegistryEntry,options:TmwCp004Option[]):TmwCp004CommonTrap{
  const preferred=preferredTrap[entry.solveMode]??[];let selectedIndex=-1;
  for(const id of preferred){const index=options.findIndex(option=>option.misconceptionId===id);if(index>=0){selectedIndex=index;break;}}
  if(selectedIndex<0)selectedIndex=options.findIndex(option=>option.misconceptionId!=="CORRECT");
  if(selectedIndex<0)throw new Error("CP-004 option set has no distractor for the common-trap explanation");
  const selected=options[selectedIndex];if(selected.misconceptionId==="CORRECT")throw new Error("CP-004 common trap selected the correct option");
  const optionLabel=`Option ${"ABCD"[selectedIndex]??selectedIndex+1}`;
  return {optionLabel,optionText:selected.text,misconceptionId:selected.misconceptionId,explanation:`${optionLabel} (${selected.text}) ${trapReason(selected.misconceptionId)}; preserve each phase in the generated work ledger above.`};
}
