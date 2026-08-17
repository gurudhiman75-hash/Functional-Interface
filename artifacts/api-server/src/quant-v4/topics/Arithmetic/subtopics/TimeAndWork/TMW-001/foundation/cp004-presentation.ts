import { formatRational, formatTimeText, reciprocal } from "./rational";
import { required } from "./cp001-helpers";
import type { TmwCp004Parameters, TmwCp004RegistryEntry } from "./cp004-types";

function days(value:{numerator:number;denominator:number}|undefined):string{const v=required(value,"time");return formatTimeText(v,"day","days");}
function solo(value:{numerator:number;denominator:number}|undefined):string{return days(value);}
function rate(value:{numerator:number;denominator:number}|undefined):string{return `${formatRational(required(value,"rate"))} of the work per day`;}
function ratioText(value:{numerator:number;denominator:number}):string{return value.denominator===1?String(value.numerator):`${value.numerator}/${value.denominator}`;}

export function renderTmwCp004Stem(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters):string{
 const c=p.context,A=c.actorA,B=c.actorB,C=c.actorC,job=c.jobPhrase;
 switch(entry.solveMode){
  case "findRemainingWorkAfterInitialPhase": return `${A} can complete ${job} alone in ${solo(p.timeA)}. After working alone for ${days(p.durationA)}, what fraction of the work remains?`;
  case "findWorkCompletedBeforeEvent": return `${A} and ${B} can complete ${job} alone in ${solo(p.timeA)} and ${solo(p.timeB)}, respectively. They work together for ${days(p.durationA)}, after which the team changes. What fraction of the work has been completed by that event?`;
  case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} works alone for ${days(p.durationA)} and then hands the remaining work to ${B}. In how many days from the start will the work be completed?`;
  case "findTotalTimeWhenTeamStartsThenOneLeaves": return `${A} and ${B} can complete ${job} alone in ${solo(p.timeA)} and ${solo(p.timeB)}, respectively. They start together, but ${B} leaves after ${days(p.durationA)}. ${A} completes the remaining work alone. Find the total completion time.`;
  case "findTotalTimeWhenOneStartsThenAnotherJoins": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} starts alone and ${B} joins after ${days(p.durationA)}. They then continue together. Find the total completion time.`;
  case "findTotalTimeWithStaggeredJoins": return `${A}, ${B} and ${C} can complete ${job} alone in ${solo(p.timeA)}, ${solo(p.timeB)} and ${solo(p.timeC)}, respectively. ${A} starts alone; ${B} joins after ${days(p.durationA)}; and ${C} joins ${days(p.durationB)} later. All active workers continue until completion. Find the total time.`;
  case "findTotalTimeWithStaggeredExits": return `${A}, ${B} and ${C} can complete ${job} alone in ${solo(p.timeA)}, ${solo(p.timeB)} and ${solo(p.timeC)}, respectively. They start together. ${C} leaves after ${days(p.durationA)}, and ${B} leaves ${days(p.durationB)} later. ${A} finishes the remaining work alone. Find the total time.`;
  case "findTotalTimeWithJoinAndLeaveEvents": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} starts alone. ${B} joins after ${days(p.durationA)}; after they work together for ${days(p.durationB)}, ${A} leaves. ${B} finishes the work. Find the total time.`;
  case "findJoinTimeFromFinalCompletion": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} starts alone and ${B} joins later. If the work is completed in ${days(p.totalCompletionTime)} from the start, after how many days did ${B} join?`;
  case "findLeaveTimeFromFinalCompletion": return `${A} and ${B} can complete ${job} alone in ${solo(p.timeA)} and ${solo(p.timeB)}, respectively. They start together; later ${A} leaves and ${B} finishes alone. If the work is completed in ${days(p.totalCompletionTime)}, after how many days did ${A} leave?`;
  case "findUnknownInitialPhaseDuration": return `Work on ${job} proceeds at ${rate(p.rateA)} for an initial period and then at ${rate(p.rateB)} for ${days(p.durationB)}. The work is completed exactly. How long was the initial period?`;
  case "findUnknownFinalPhaseDuration": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} works for ${days(p.durationA)} and then stops. How long must ${B} work alone to finish the remainder?`;
  case "findReplacementWorkerRate": return `${A} can complete ${job} alone in ${solo(p.timeA)} and works for ${days(p.durationA)} before being replaced. The replacement must finish the remaining work in ${days(p.durationB)}. What rate, as a fraction of the whole work per day, must the replacement maintain?`;
  case "findReplacementWorkerTime": return `${A} can complete ${job} alone in ${solo(p.timeA)} and works for ${days(p.durationA)} before being replaced. The replacement finishes the remaining work in ${days(p.durationB)}. In how many days could the replacement complete the whole work alone at the same rate?`;
  case "findCompletionWithIdleInterval": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} works for ${days(p.durationA)}, after which the work remains idle for ${days(p.idleDuration)}. ${B} then completes the remainder alone. Find the total elapsed time.`;
  case "findCompletionWithChangedDailyHours": return `${A} would complete ${job} in ${solo(p.timeA)} by working ${formatRational(required(p.originalDailyHours,"originalDailyHours"))} hours per day. After ${days(p.durationA)}, the daily working time is changed to ${formatRational(required(p.changedDailyHours,"changedDailyHours"))} hours, with hourly productivity unchanged. Find the total number of calendar days required.`;
  case "findCompletionWithMidProjectEfficiencyChange": return `${A} can initially complete ${job} alone in ${solo(p.timeA)}. After working for ${days(p.durationA)}, ${A}'s efficiency becomes ${ratioText(required(p.efficiencyMultiplier,"efficiencyMultiplier"))} of its original level. Find the total completion time.`;
  case "findCompletionWithNegativeWorkerActivatedLater": return `${A} and ${B} can complete ${job} alone in ${solo(p.timeA)} and ${solo(p.timeB)}, respectively. They work together for ${days(p.durationA)}. A rework process then begins that would undo the whole work in ${solo(p.timeC)} if acting alone, while ${A} and ${B} continue. Find the total completion time.`;
  case "findEventTimeAtSpecifiedCompletionFraction": return `${A} can complete ${job} alone in ${solo(p.timeA)}. A scheduled event occurs as soon as ${formatRational(required(p.targetFraction,"targetFraction"))} of the work is complete. After how many days from the start will the event occur?`;
  case "findRequiredRemainingRateForDeadline": return `${A} can complete ${job} alone in ${solo(p.timeA)} and works for ${days(p.durationA)}. The entire work must be finished by the end of day ${formatRational(required(p.deadline,"deadline"))}. What average fraction of the whole work per day must be achieved after ${A}'s initial phase?`;
  case "findWorkerCountAddedAfterPartialProgress": return `${required(p.initialWorkerCount,"initialWorkerCount")} identical workers can each complete ${job} alone in ${solo(p.perWorkerTime)}. They work together for ${days(p.durationA)}. How many additional workers of the same efficiency must then join so that the work is completed in ${days(p.deadline)} from the start?`;
  case "findWorkerCountRemovedAfterPartialProgress": return `${required(p.initialWorkerCount,"initialWorkerCount")} identical workers can each complete ${job} alone in ${solo(p.perWorkerTime)}. They work together for ${days(p.durationA)}, after which some workers leave. If the work is completed in ${days(p.deadline)} from the start, how many workers left?`;
  case "findDelayAfterWorkerLeaves": return `${A} and ${B} can complete ${job} alone in ${solo(p.timeA)} and ${solo(p.timeB)}, respectively. They start together, but ${B} leaves after ${days(p.durationA)} and ${A} finishes alone. By how many days is completion delayed compared with both working together throughout?`;
  case "findEarlyCompletionAfterWorkerJoins": return `${A} can complete ${job} alone in ${solo(p.timeA)}, while ${B} can do it alone in ${solo(p.timeB)}. ${A} starts alone and ${B} joins after ${days(p.durationA)}. By how many days is the work completed earlier than if ${A} had worked alone throughout?`;
 }
}

export function tmwCp004ExplanationOpening(entry:TmwCp004RegistryEntry):string{
 switch(entry.ruleId){
  case "TMW_STAGE_LEDGER": return "Treat each phase separately: calculate the work completed during that phase, carry the exact remainder forward, and use only the workers active in the next phase.";
  case "TMW_STAGE_HANDOFF": return "At a handoff, completed work is preserved. Subtract it from the whole before applying the replacement worker's rate to the remainder.";
  case "TMW_STAGE_INVERSE_EVENT": return "Represent the unknown event time explicitly and equate the sum of all phase contributions to one whole work.";
  case "TMW_STAGE_RATE_CHANGE": return "Keep the work already completed unchanged, convert the new hours or efficiency into a new rate, and apply that rate only after the event.";
  case "TMW_STAGE_SIGNED_RATE": return "Before the adverse process begins, use the constructive rate; after activation, subtract its rate from the continuing constructive rate.";
  case "TMW_STAGE_WORKFORCE_EVENT": return "Use worker-rate × time for each workforce phase. The remaining work determines the required workforce after the event.";
  case "TMW_STAGE_COMPARISON": return "Compute the staged completion time and the uninterrupted reference completion time separately, then take their difference in the requested direction.";
 }
}

export function tmwCp004Conclusion(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,answerText:string):string{
 switch(entry.solveMode){
  case "findRemainingWorkAfterInitialPhase": return `Therefore, ${answerText} remains after the initial phase.`;
  case "findWorkCompletedBeforeEvent": return `Therefore, ${answerText} has been completed when the event occurs.`;
  case "findJoinTimeFromFinalCompletion": return `Therefore, the joining event occurs after ${answerText}.`;
  case "findLeaveTimeFromFinalCompletion": return `Therefore, the leaving event occurs after ${answerText}.`;
  case "findUnknownInitialPhaseDuration": return `Therefore, the initial phase lasts ${answerText}.`;
  case "findUnknownFinalPhaseDuration": return `Therefore, the final phase lasts ${answerText}.`;
  case "findReplacementWorkerRate": return `Therefore, the replacement must maintain ${answerText}.`;
  case "findReplacementWorkerTime": return `Therefore, the replacement's full-work solo time is ${answerText}.`;
  case "findEventTimeAtSpecifiedCompletionFraction": return `Therefore, the specified completion fraction is reached after ${answerText}.`;
  case "findRequiredRemainingRateForDeadline": return `Therefore, the required post-event rate is ${answerText}.`;
  case "findWorkerCountAddedAfterPartialProgress": return `Therefore, ${answerText} must be added after the initial phase.`;
  case "findWorkerCountRemovedAfterPartialProgress": return `Therefore, ${answerText} left after the initial phase.`;
  case "findDelayAfterWorkerLeaves": return `Therefore, the worker's departure causes a delay of ${answerText}.`;
  case "findEarlyCompletionAfterWorkerJoins": return `Therefore, the later join saves ${answerText}.`;
  default: return `Therefore, ${p.context.jobPhrase} is completed in ${answerText} from the start.`;
 }
}
