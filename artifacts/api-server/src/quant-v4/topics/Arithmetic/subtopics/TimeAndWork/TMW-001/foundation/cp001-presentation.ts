import { formatRational, reciprocal } from "./rational";
import { percent, required, timeUnitLabel } from "./cp001-helpers";
import type { TmwCp001Parameters, TmwCp001RegistryEntry, TmwCp001Solution } from "./types";

export function renderTmwCp001Stem(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): string {
  const c = p.context;
  const completionTime = reciprocal(p.rate);
  const completion = formatRational(completionTime);
  const fraction = required(p.requestedFraction, "requestedFraction");
  const timeLabel = timeUnitLabel(p.timeUnit, p.time);

  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}. What total output will be produced in ${formatRational(p.time)} ${timeLabel}?`;
    case "findRateFromWorkAndTime":
      return `${c.actor} ${c.action} ${formatRational(p.totalWork)} ${c.object} in ${formatRational(p.time)} ${timeLabel}. Find the average output per ${p.timeUnit}.`;
    case "findTimeFromWorkAndRate":
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}. How much time is required to complete ${formatRational(p.totalWork)} ${c.object}?`;
    case "findOneUnitWorkFromCompletionTime":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. What fraction of the assignment is completed in one ${p.timeUnit}?`;
    case "findCompletionTimeFromOneUnitWork":
      return `${c.actor} completes ${formatRational(p.rate)} of ${c.jobPhrase} in one ${p.timeUnit}. How long will the entire assignment take?`;
    case "findFractionCompletedInGivenTime":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. What fraction of the assignment will be completed in ${formatRational(p.time)} ${timeLabel}?`;
    case "findPercentCompletedInGivenTime":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. What percentage of the assignment will be completed in ${formatRational(p.time)} ${timeLabel}?`;
    case "findTimeForGivenFraction":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. How much time is needed to complete ${formatRational(fraction)} of the assignment?`;
    case "findTimeForGivenPercent":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. How much time is needed to complete ${formatRational(percent(fraction))}% of the assignment?`;
    case "findRemainingFractionAfterTime":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. What fraction of the assignment remains after ${formatRational(p.time)} ${timeLabel}?`;
    case "findRemainingPercentAfterTime":
      return `${c.actor} can complete ${c.jobPhrase} in ${completion} ${timeUnitLabel(p.timeUnit, completionTime)}. What percentage of the assignment remains after ${formatRational(p.time)} ${timeLabel}?`;
    case "findOutputFromUnitRateAndTime":
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} in one ${p.timeUnit}. Find the total output in ${formatRational(p.time)} ${timeLabel}.`;
    case "recoverWholeWorkFromPartAndFraction":
      return `${c.actor} has completed ${formatRational(required(p.partWork, "partWork"))} ${c.object}, equal to ${formatRational(fraction)} of the planned work. What is the total quantity to be completed?`;
    case "recoverWholeTimeFromPartCompletion":
      return `${c.actor} completes ${formatRational(fraction)} of ${c.jobPhrase} in ${formatRational(required(p.partTime, "partTime"))} ${timeUnitLabel(p.timeUnit, required(p.partTime, "partTime"))}. At the same rate, how long will the entire assignment take?`;
    case "convertRateAcrossTimeUnits": {
      const sourceDuration = required(p.sourceDuration, "sourceDuration");
      const targetDuration = required(p.targetDuration, "targetDuration");
      return `${c.actor} ${c.action} ${formatRational(p.totalWork)} ${c.object} in ${formatRational(sourceDuration)} ${timeUnitLabel(p.timeUnit, sourceDuration)}. At the same rate, how many ${c.object} will be completed in ${formatRational(targetDuration)} ${timeUnitLabel(p.timeUnit, targetDuration)}?`;
    }
    case "compareWorkCompletedAtEqualTime": {
      const secondRate = required(p.secondaryRate, "secondaryRate");
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}, while ${c.peerActor.toLowerCase()} ${c.action} ${formatRational(secondRate)} ${c.object} per ${p.timeUnit}. How many more ${c.object} does the first complete in ${formatRational(p.time)} ${timeLabel}?`;
    }
    case "compareTimeForDifferentWorkAtSameRate":
      return `${c.actor} works at ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}. How much more time is required for ${formatRational(p.totalWork)} ${c.object} than for ${formatRational(required(p.secondaryWork, "secondaryWork"))} ${c.object}?`;
    case "findRequiredRateForTargetCompletion":
      return `${c.actor} must complete ${formatRational(p.totalWork)} ${c.object} in ${formatRational(p.time)} ${timeLabel}. What uniform rate per ${p.timeUnit} is required?`;
    case "findDelayFromReducedUniformRate":
      return `${c.actor} normally completes ${c.jobPhrase} in ${formatRational(required(p.originalTime, "originalTime"))} ${timeUnitLabel(p.timeUnit, required(p.originalTime, "originalTime"))}. If the working rate falls by ${formatRational(required(p.changePercent, "changePercent"))}%, by how much will completion be delayed?`;
    case "findTimeSavedFromIncreasedUniformRate":
      return `${c.actor} normally completes ${c.jobPhrase} in ${formatRational(required(p.originalTime, "originalTime"))} ${timeUnitLabel(p.timeUnit, required(p.originalTime, "originalTime"))}. If the working rate rises by ${formatRational(required(p.changePercent, "changePercent"))}%, how much time will be saved?`;
  }
}

export function tmwCp001ExplanationOpening(entry: TmwCp001RegistryEntry): string {
  switch (entry.solveMode) {
    case "findWorkFromRateAndTime": return "The output is uniform, so multiply the output per time unit by the elapsed time.";
    case "findRateFromWorkAndTime": return "A uniform rate is found by distributing the completed output over the working time.";
    case "findTimeFromWorkAndRate": return "At a fixed rate, time equals the required output divided by the output per time unit.";
    case "findOneUnitWorkFromCompletionTime": return "Treat the entire assignment as one unit and take the reciprocal of its completion time.";
    case "findCompletionTimeFromOneUnitWork": return "The whole-work time is the reciprocal of the fraction completed in one time unit.";
    case "findFractionCompletedInGivenTime": return "Multiply the one-unit work by the elapsed time to obtain the completed fraction.";
    case "findPercentCompletedInGivenTime": return "First determine the completed fraction, then convert that fraction to a percentage.";
    case "findTimeForGivenFraction": return "Only the stated fraction is required, so divide the target work by the one-unit rate.";
    case "findTimeForGivenPercent": return "Convert the target percentage to a work fraction before dividing by the one-unit rate.";
    case "findRemainingFractionAfterTime": return "Find the completed fraction first, then subtract it from the whole assignment.";
    case "findRemainingPercentAfterTime": return "The remaining percentage is the complement of the percentage already completed.";
    case "findOutputFromUnitRateAndTime": return "The output remains uniform, so total production is rate multiplied by duration.";
    case "recoverWholeWorkFromPartAndFraction": return "The known quantity represents only a stated fraction, so divide the part by that fraction.";
    case "recoverWholeTimeFromPartCompletion": return "At a constant rate, elapsed time is proportional to the fraction of work completed.";
    case "convertRateAcrossTimeUnits": return "First obtain the output for one hour, then scale it to the requested time block.";
    case "compareWorkCompletedAtEqualTime": return "Both work for the same duration, so compare the outputs produced over that common interval.";
    case "compareTimeForDifferentWorkAtSameRate": return "Use the common rate to calculate both durations before taking their difference.";
    case "findRequiredRateForTargetCompletion": return "The assignment size and deadline together determine the required uniform output rate.";
    case "findDelayFromReducedUniformRate": return "The work is unchanged, so the reduced rate must be converted into a longer completion time.";
    case "findTimeSavedFromIncreasedUniformRate": return "The work is unchanged, so the increased rate must be converted into a shorter completion time.";
  }
}

export function tmwCp001Conclusion(
  entry: TmwCp001RegistryEntry,
  p: TmwCp001Parameters,
  solution: TmwCp001Solution,
): string {
  const answer = solution.answerText;
  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":
      return `Therefore, the total output is ${answer}.`;
    case "findRateFromWorkAndTime":
      return `Therefore, the average output rate is ${answer}.`;
    case "findTimeFromWorkAndRate":
      return `Therefore, completing the stated output requires ${answer}.`;
    case "findOneUnitWorkFromCompletionTime":
      return `Therefore, ${formatRational(solution.answer)} of the assignment is completed in one ${p.timeUnit}.`;
    case "findCompletionTimeFromOneUnitWork":
      return `Therefore, the entire assignment will take ${answer}.`;
    case "findFractionCompletedInGivenTime":
      return `Therefore, ${answer} is completed in the stated time.`;
    case "findPercentCompletedInGivenTime":
      return `Therefore, ${answer} of the assignment is completed.`;
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent":
      return `Therefore, the target portion requires ${answer}.`;
    case "findRemainingFractionAfterTime":
      return `Therefore, ${answer} remains unfinished.`;
    case "findRemainingPercentAfterTime":
      return `Therefore, ${answer} of the assignment remains unfinished.`;
    case "recoverWholeWorkFromPartAndFraction":
      return `Therefore, the total planned quantity is ${answer}.`;
    case "recoverWholeTimeFromPartCompletion":
      return `Therefore, the entire assignment will take ${answer}.`;
    case "convertRateAcrossTimeUnits": {
      const targetDuration = required(p.targetDuration, "targetDuration");
      return `Therefore, the output in ${formatRational(targetDuration)} ${timeUnitLabel(p.timeUnit, targetDuration)} is ${answer}.`;
    }
    case "compareWorkCompletedAtEqualTime":
      return `Therefore, the first completes ${answer.replace(` ${p.context.object}`, ` more ${p.context.object}`)} than the second.`;
    case "compareTimeForDifferentWorkAtSameRate":
      return `Therefore, the larger workload requires an additional ${answer}.`;
    case "findRequiredRateForTargetCompletion":
      return `Therefore, the required working rate is ${answer}.`;
    case "findDelayFromReducedUniformRate":
      return `Therefore, completion will be delayed by ${answer}.`;
    case "findTimeSavedFromIncreasedUniformRate":
      return `Therefore, the higher rate saves ${answer}.`;
  }
}
