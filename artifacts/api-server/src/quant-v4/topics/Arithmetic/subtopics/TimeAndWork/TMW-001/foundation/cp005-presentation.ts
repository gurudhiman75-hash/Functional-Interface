import { formatRational } from "./rational";
import { required } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp005Parameters, TmwCp005RegistryEntry } from "./cp005-types";
function soloText(actor:string,time:Rational,unit:string):string{return `${actor} can complete the work alone in ${formatRational(time)} ${unit}${formatRational(time)==="1"?"":"s"}`;}
function cycleSummary(p:TmwCp005Parameters):string{return p.cycle.map(segment=>segment.description).join(", then ");}
function durationPhrase(value:string,unit:string):string{return `${value} ${unit}${value==="1"?"":"s"}`;}
export function renderTmwCp005Stem(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters):string{
 const c=p.context,u=p.timeUnit;
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They work on alternate ${u}s, beginning with ${c.actorA}. In how much time will ${c.jobPhrase} be completed?`;
  case "findCompletionTimeForTwoAgentAlternationStartingB":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They work on alternate ${u}s, beginning with ${c.actorB}. Find the completion time for ${c.jobPhrase}.`;
  case "findCompletionTimeForMultiDayCycle":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. The repeating schedule is: ${cycleSummary(p)}. How long will ${c.jobPhrase} take?`;
  case "findCompletionTimeForThreeAgentCycle":return `${c.actorA}, ${c.actorB} and ${c.actorC} can complete ${c.jobPhrase} alone in ${formatRational(required(p.timeA,"timeA"))}, ${formatRational(required(p.timeB,"timeB"))} and ${formatRational(required(p.timeC,"timeC"))} ${u}s, respectively. They work one ${u} each in the order A, B, C, and repeat. Find the completion time.`;
  case "findCompletionDayAndTerminalFraction":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They alternate, starting with ${c.actorA}. After how many complete days and what fraction of the next day is ${c.jobPhrase} completed? Give the exact elapsed time.`;
  case "findWorkAfterGivenNumberOfCycles":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They alternate, starting with ${c.actorA}. What fraction of ${c.jobPhrase} is completed after ${required(p.givenCycles,"givenCycles")} full cycles?`;
  case "findRemainingWorkAfterFullCycles":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They alternate, starting with ${c.actorA}. What fraction remains after ${required(p.givenCycles,"givenCycles")} full cycles?`;
  case "findTerminalAgent":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They alternate, starting with ${c.actorA}. Who is working when ${c.jobPhrase} is completed?`;
  case "findStartingAgentFromCompletionCondition":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${formatRational(required(p.timeA,"timeA"))} and ${formatRational(required(p.timeB,"timeB"))} ${u}s. They work on alternate ${u}s. The work finishes in ${formatRational(required(p.knownCompletionTime,"knownCompletionTime"))} ${u}s while ${required(p.knownTerminalLabel,"knownTerminalLabel")} is working. Who started?`;
  case "findUnknownRateFromAlternatingCompletion":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} and ${c.actorB} work on alternate ${u}s, starting with ${c.actorA}, and complete ${c.jobPhrase} in ${formatRational(required(p.knownCompletionTime,"knownCompletionTime"))} ${u}s. Find ${c.actorB}'s rate.`;
  case "findUnknownTimeFromAlternatingCompletion":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} and ${c.actorB} work on alternate ${u}s, starting with ${c.actorA}, and complete ${c.jobPhrase} in ${formatRational(required(p.knownCompletionTime,"knownCompletionTime"))} ${u}s. In how many ${u}s can ${c.actorB} complete the work alone?`;
  case "findCompletionWhenHelperWorksEveryNthDay":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. ${c.actorA} works every ${u}; ${c.actorB} helps on every ${required(p.patternNumber,"patternNumber")}th ${u}. Find the completion time for ${c.jobPhrase}.`;
  case "findCompletionWhenAgentRestsEveryNthDay":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} works regularly but rests on every ${required(p.patternNumber,"patternNumber")}th ${u}. How long will ${c.jobPhrase} take?`;
  case "findCompletionWithWeekendOrHolidayPattern":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. Work is done from Monday to Friday and stops on Saturday and Sunday. Starting on Monday, find the elapsed time required for ${c.jobPhrase}.`;
  case "findCompletionWithUnequalShiftDurations":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${formatRational(required(p.timeA,"timeA"))} and ${formatRational(required(p.timeB,"timeB"))} hours. Their unequal shifts repeat in this order: ${cycleSummary(p)}. Find the exact completion time.`;
  case "findCompletionWithTwoDaysOnOneDayOffPattern":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. ${c.actorA} follows a repeating schedule of two working ${u}s followed by one rest ${u}. Find the total elapsed time for ${c.jobPhrase}.`;
  case "findCompletionWithPeriodicNegativeWork":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${formatRational(required(p.timeA,"timeA"))} and ${formatRational(required(p.timeB,"timeB"))} ${u}s, while ${c.actorC} can undo the whole work in ${formatRational(required(p.timeC,"timeC"))} ${u}s. The first two work together for two ${u}s, then ${c.actorC} undoes work for one ${u}; this cycle repeats. Find the completion time.`;
  case "findCompletionWithRepeatedJoinLeaveCycle":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. The schedule repeats: ${c.actorA} works alone for one ${u}, then both work together for one ${u}. How long will ${c.jobPhrase} take?`;
  case "findCycleCountToReachSpecifiedFraction":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They alternate, starting with ${c.actorA}. How many full cycles are required to complete exactly ${formatRational(required(p.targetWork,"targetWork"))} of the work?`;
  case "findTimeFromArbitraryCyclePhase":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. Their usual cycle is A then B, but this schedule begins from B's turn and then continues cyclically. Find the completion time for ${c.jobPhrase}.`;
  case "findExactBoundaryCompletion":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)} and ${c.actorB} can complete it alone in ${formatRational(required(p.timeB,"timeB"))} ${u}s. They alternate, starting with ${c.actorA}. The work finishes exactly at a cycle boundary. Find the total time.`;
  case "findCompletionWithinCycleSegment":return `${c.actorA} and ${c.actorB} can complete ${c.jobPhrase} alone in ${formatRational(required(p.timeA,"timeA"))} and ${formatRational(required(p.timeB,"timeB"))} ${u}s. The repeating blocks are: ${cycleSummary(p)}. Find the exact completion time, including the fraction of the final work block.`;
  case "findOutputUnderPeriodicMachineSchedule":return `${c.actorA} produces ${formatRational(p.cycle[0].rate)} ${p.outputUnit} per hour and runs for ${durationPhrase(formatRational(p.cycle[0].duration),"hour")}; ${c.actorB} then produces ${formatRational(p.cycle[1].rate)} ${p.outputUnit} per hour and runs for ${durationPhrase(formatRational(p.cycle[1].duration),"hour")}. This cycle repeats ${required(p.givenCycles,"givenCycles")} times. Find the total output.`;
  case "findRequiredCycleRateForDeadline":return `${soloText(c.actorA,required(p.timeA,"timeA"),u)}. A two-${u} cycle repeats: ${c.actorA} works on the first ${u}, and ${c.actorB} works on the second. To complete ${c.jobPhrase} in exactly ${formatRational(required(p.deadline,"deadline"))} ${u}s, what rate must ${c.actorB} maintain?`;
 }
}
export function tmwCp005ExplanationOpening(entry:TmwCp005RegistryEntry):string{
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":
  case "findCompletionTimeForTwoAgentAlternationStartingB":return "Keep the stated starting worker fixed, find the work of one two-turn cycle, and use only the required fraction of the terminal turn.";
  case "findCompletionTimeForMultiDayCycle":
  case "findCompletionTimeForThreeAgentCycle":return "Combine the work of every block in one complete schedule cycle before counting repeated cycles and the unfinished terminal block.";
  case "findCompletionDayAndTerminalFraction":
  case "findCompletionWithinCycleSegment":return "Locate the last complete cycle first, then divide the remaining work by the rate active in the final block to obtain its exact fraction.";
  case "findWorkAfterGivenNumberOfCycles":return "Calculate the work in one full cycle and multiply it by the stated number of complete cycles.";
  case "findRemainingWorkAfterFullCycles":return "Find the work completed by the full cycles and subtract that exact amount from the whole work.";
  case "findTerminalAgent":return "Track cumulative work through the repeating order and identify the worker whose turn first reaches the whole work.";
  case "findStartingAgentFromCompletionCondition":return "Test both possible starting phases and retain the one that matches both the stated completion time and the terminal worker.";
  case "findUnknownRateFromAlternatingCompletion":
  case "findUnknownTimeFromAlternatingCompletion":
  case "findRequiredCycleRateForDeadline":return "Count the exact durations contributed by each cycle position, subtract the known work, and reconstruct the missing rate from the remaining work.";
  case "findCompletionWhenHelperWorksEveryNthDay":return "Treat the helper day as the final segment of an n-day cycle, with the two rates added only on that day.";
  case "findCompletionWhenAgentRestsEveryNthDay":
  case "findCompletionWithWeekendOrHolidayPattern":
  case "findCompletionWithTwoDaysOnOneDayOffPattern":return "Give each rest day zero rate, calculate the productive work of one complete calendar cycle, and then solve the final working day.";
  case "findCompletionWithUnequalShiftDurations":return "For each shift, multiply its hourly rate by its own duration; unequal shift lengths cannot be treated as equal turns.";
  case "findCompletionWithPeriodicNegativeWork":return "Treat productive work as positive and the undoing segment as negative, preserving the exact order of the repeating cycle.";
  case "findCompletionWithRepeatedJoinLeaveCycle":return "Use the solo rate in the first segment and the combined rate in the second, then repeat that two-segment cycle.";
  case "findCycleCountToReachSpecifiedFraction":return "Divide the target work fraction by the exact work of one complete cycle.";
  case "findTimeFromArbitraryCyclePhase":return "Rotate the cycle to the stated starting phase before counting full cycles and the terminal segment.";
  case "findExactBoundaryCompletion":return "Check whether an integer number of complete cycles produces the whole work; no extra terminal segment should be added at an exact boundary.";
  case "findOutputUnderPeriodicMachineSchedule":return "Find the output of one complete machine cycle and multiply by the stated number of cycles.";
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
