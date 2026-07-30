import { formatRational, formatTimeText } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp005Parameters, TmwCp005RegistryEntry } from "./cp005-types";
function timeText(value:Rational,unit:string):string{return formatTimeText(value,unit,`${unit}s`);}
function soloText(actor:string,time:Rational,unit:string):string{return `${actor} can complete the work alone in ${timeText(time,unit)}`;}
function cycleSummary(p:TmwCp005Parameters):string{return p.cycle.map(segment=>segment.description).join(", then ");}
function durationPhrase(value:Rational,unit:string):string{return timeText(value,unit);}
export function ordinal(value:number):string{
 const mod100=value%100;if(mod100>=11&&mod100<=13)return `${value}th`;
 switch(value%10){case 1:return `${value}st`;case 2:return `${value}nd`;case 3:return `${value}rd`;default:return `${value}th`;}
}
export function renderTmwCp005Stem(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters):string{
 const c=p.context,u=p.timeUnit;
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They work on alternate ${u}s, beginning with ${c.actorA}. In how much time will ${c.jobPhrase} be completed?`;
  case "findCompletionTimeForTwoAgentAlternationStartingB":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They work on alternate ${u}s, beginning with ${c.actorB}. Find the completion time for ${c.jobPhrase}.`;
  case "findCompletionTimeForMultiDayCycle":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. The repeating schedule is: ${cycleSummary(p)}. How long will ${c.jobPhrase} take?`;
  case "findCompletionTimeForThreeAgentCycle":return `${c.actorA}, ${c.actorB} and ${c.actorC} can complete ${c.jobPhrase} alone in ${timeText(required(p.timeA,"timeA"),u)}, ${timeText(required(p.timeB,"timeB"),u)} and ${timeText(required(p.timeC,"timeC"),u)}, respectively. They work one ${u} each in the order ${c.actorA}, ${c.actorB}, ${c.actorC}, and repeat. Find the completion time.`;
  case "findCompletionDayAndTerminalFraction":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They alternate, starting with ${c.actorA}. After how many complete days and what fraction of the next day is ${c.jobPhrase} completed? Give the exact elapsed time.`;
  case "findWorkAfterGivenNumberOfCycles":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They alternate, starting with ${c.actorA}. What fraction of ${c.jobPhrase} is completed after ${required(p.givenCycles,"givenCycles")} full cycles?`;
  case "findRemainingWorkAfterFullCycles":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They alternate, starting with ${c.actorA}. What fraction remains after ${required(p.givenCycles,"givenCycles")} full cycles?`;
  case "findTerminalAgent":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They alternate, starting with ${c.actorA}. Who is working when ${c.jobPhrase} is completed?`;
  case "findStartingAgentFromCompletionCondition":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${timeText(required(p.timeA,"timeA"),u)} and ${timeText(required(p.timeB,"timeB"),u)}. They work on alternate ${u}s. The work finishes in ${timeText(required(p.knownCompletionTime,"knownCompletionTime"),u)} while ${required(p.knownTerminalLabel,"knownTerminalLabel")} is working. Who started?`;
  case "findUnknownRateFromAlternatingCompletion":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} and ${c.actorB} work on alternate ${u}s, starting with ${c.actorA}, and complete ${c.jobPhrase} in ${timeText(required(p.knownCompletionTime,"knownCompletionTime"),u)}. Find ${c.actorB}'s rate.`;
  case "findUnknownTimeFromAlternatingCompletion":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} and ${c.actorB} work on alternate ${u}s, starting with ${c.actorA}, and complete ${c.jobPhrase} in ${timeText(required(p.knownCompletionTime,"knownCompletionTime"),u)}. In how many ${u}s can ${c.actorB} complete the work alone?`;
  case "findCompletionWhenHelperWorksEveryNthDay":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. ${c.actorA} works every ${u}; ${c.actorB} helps on every ${ordinal(required(p.patternNumber,"patternNumber"))} ${u}. Find the completion time for ${c.jobPhrase}.`;
  case "findCompletionWhenAgentRestsEveryNthDay":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} works regularly but rests on every ${ordinal(required(p.patternNumber,"patternNumber"))} ${u}. How long will ${c.jobPhrase} take?`;
  case "findCompletionWithWeekendOrHolidayPattern":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. Work is done from Monday to Friday and stops on Saturday and Sunday. Starting on Monday, find the elapsed time required for ${c.jobPhrase}.`;
  case "findCompletionWithUnequalShiftDurations":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${timeText(required(p.timeA,"timeA"),u)} and ${timeText(required(p.timeB,"timeB"),"hour")}. Their unequal shifts repeat in this order: ${cycleSummary(p)}. Find the exact completion time.`;
  case "findCompletionWithTwoDaysOnOneDayOffPattern":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} follows a repeating schedule of two working ${u}s followed by one rest ${u}. Find the total elapsed time for ${c.jobPhrase}.`;
  case "findCompletionWithPeriodicNegativeWork":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${timeText(required(p.timeA,"timeA"),u)} and ${timeText(required(p.timeB,"timeB"),u)}, while ${c.actorC} can undo the whole work in ${timeText(required(p.timeC,"timeC"),u)}. The first two work together for two ${u}s, then ${c.actorC} undoes work for one ${u}; this cycle repeats. Find the completion time.`;
  case "findCompletionWithRepeatedJoinLeaveCycle":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. The schedule repeats: ${c.actorA} works alone for one ${u}, then both work together for one ${u}. How long will ${c.jobPhrase} take?`;
  case "findCycleCountToReachSpecifiedFraction":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They alternate, starting with ${c.actorA}. How many full cycles are required to complete exactly ${formatRational(required(p.targetWork,"targetWork"))} of the work?`;
  case "findTimeFromArbitraryCyclePhase":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. Their usual order is ${c.actorA} followed by ${c.actorB}, but this schedule begins with ${c.actorB} and then repeats the same order. Find the completion time for ${c.jobPhrase}.`;
  case "findExactBoundaryCompletion":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${timeText(required(p.timeB,"timeB"),u)}. They alternate, starting with ${c.actorA}. The work finishes exactly at a cycle boundary. Find the total time.`;
  case "findCompletionWithinCycleSegment":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${timeText(required(p.timeA,"timeA"),u)} and ${timeText(required(p.timeB,"timeB"),u)}. The repeating blocks are: ${cycleSummary(p)}. Find the exact completion time, including the fraction of the final work block.`;
  case "findOutputUnderPeriodicMachineSchedule":return `${c.actorA} produces ${formatRational(p.cycle[0].rate)} ${p.outputUnit} per hour and runs for ${durationPhrase(p.cycle[0].duration,"hour")}; ${c.actorB} then produces ${formatRational(p.cycle[1].rate)} ${p.outputUnit} per hour and runs for ${durationPhrase(p.cycle[1].duration,"hour")}. This cycle repeats ${required(p.givenCycles,"givenCycles")} times. Find the total output.`;
  case "findRequiredCycleRateForDeadline":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. A two-${u} cycle repeats: ${c.actorA} works on the first ${u}, and ${c.actorB} works on the second. To complete ${c.jobPhrase} in exactly ${timeText(required(p.deadline,"deadline"),u)}, what rate must ${c.actorB} maintain?`;
 }
}
export function tmwCp005ExplanationOpening(entry:TmwCp005RegistryEntry):string{
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":
  case "findCompletionTimeForTwoAgentAlternationStartingB":return "First find how much work the two workers finish in one complete two-day pattern. Repeat that pattern, then calculate only the part of the last worker's day that is needed.";
  case "findCompletionTimeForMultiDayCycle":
  case "findCompletionTimeForThreeAgentCycle":return "First add the work done in every part of one complete repeating pattern. Use as many full patterns as possible, then calculate the unfinished last part separately.";
  case "findCompletionDayAndTerminalFraction":
  case "findCompletionWithinCycleSegment":return "First find the work completed in full repeating patterns. Subtract it from the whole work, then divide the work left by the rate of the worker active next.";
  case "findWorkAfterGivenNumberOfCycles":return "Find the work done in one complete pattern, then multiply it by the given number of full patterns.";
  case "findRemainingWorkAfterFullCycles":return "Find the work done in all complete patterns, then subtract it from the whole work.";
  case "findTerminalAgent":return "Follow the repeating order until the remaining work can be finished in the next worker's turn. That worker is the one active at completion.";
  case "findStartingAgentFromCompletionCondition":return "Check the schedule once with each worker starting. Choose the start that gives both the stated finishing time and the stated final worker.";
  case "findUnknownRateFromAlternatingCompletion":
  case "findUnknownTimeFromAlternatingCompletion":
  case "findRequiredCycleRateForDeadline":return "Count how long the known worker and the unknown worker each work. Find the work already done, then use the work left to calculate the unknown rate.";
  case "findCompletionWhenHelperWorksEveryNthDay":return "Make one pattern of the stated number of days. The main worker works every day, and both rates are added only on the helper day.";
  case "findCompletionWhenAgentRestsEveryNthDay":
  case "findCompletionWithWeekendOrHolidayPattern":
  case "findCompletionWithTwoDaysOnOneDayOffPattern":return "Include every rest day in the calendar but count zero work on it. Find the work in one full calendar pattern, then calculate the last working day separately.";
  case "findCompletionWithUnequalShiftDurations":return "For each shift, multiply the worker's hourly rate by that shift's actual length. Add the shift outputs to get one complete pattern.";
  case "findCompletionWithPeriodicNegativeWork":return "Add the work completed by the productive team and subtract the work undone later. Keep the same order when the pattern repeats.";
  case "findCompletionWithRepeatedJoinLeaveCycle":return "Find the work done while the first worker is alone, then add the work done while both work together. These two parts form one repeating pattern.";
  case "findCycleCountToReachSpecifiedFraction":return "Find the work done in one complete pattern, then divide the target work by that amount.";
  case "findTimeFromArbitraryCyclePhase":return "Begin with the worker named in the question, not with the usual first worker. Then follow the repeating order and calculate the last partial turn.";
  case "findExactBoundaryCompletion":return "Find the work done in one complete pattern. Because the work ends exactly after a whole number of patterns, multiply the number of patterns by the pattern length.";
  case "findOutputUnderPeriodicMachineSchedule":return "Find each machine's output during its own running time, add them for one complete pattern, and multiply by the number of repetitions.";
 }
}
export function tmwCp005Conclusion(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,answerText:string):string{
 switch(entry.solveMode){
  case "findTerminalAgent":return `Therefore, ${answerText} is active when the work reaches completion.`;
  case "findStartingAgentFromCompletionCondition":return `Therefore, the stated completion condition is possible only when ${answerText} starts the alternation.`;
  case "findUnknownRateFromAlternatingCompletion":return `Therefore, ${p.context.actorB} must work at ${answerText}.`;
  case "findUnknownTimeFromAlternatingCompletion":return `Therefore, ${p.context.actorB} alone would take ${answerText} to complete the work.`;
  case "findCycleCountToReachSpecifiedFraction":return `Therefore, the target fraction is reached after ${answerText}.`;
  case "findOutputUnderPeriodicMachineSchedule":return `Therefore, the repeating machine schedule produces ${answerText}.`;
  case "findRequiredCycleRateForDeadline":return `Therefore, ${p.context.actorB} must maintain ${answerText} on each assigned turn.`;
  case "findWorkAfterGivenNumberOfCycles":return `Therefore, ${answerText} is completed after the stated full cycles.`;
  case "findRemainingWorkAfterFullCycles":return `Therefore, ${answerText} remains after the stated full cycles.`;
  default:return `Therefore, ${p.context.jobPhrase} is completed in ${answerText}.`;
 }
}
