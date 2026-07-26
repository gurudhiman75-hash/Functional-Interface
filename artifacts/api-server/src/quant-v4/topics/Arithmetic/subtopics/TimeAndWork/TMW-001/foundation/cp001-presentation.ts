import { formatRational, reciprocal } from "./rational";
import { percent, required, timeUnitLabel } from "./cp001-helpers";
import type { TmwCp001Parameters, TmwCp001RegistryEntry } from "./types";

export function renderTmwCp001Stem(entry: TmwCp001RegistryEntry, p: TmwCp001Parameters): string {
  const c = p.context;
  const completion = formatRational(reciprocal(p.rate));
  const fraction = required(p.requestedFraction, "requestedFraction");
  const timeLabel = timeUnitLabel(p.timeUnit, p.time);

  switch (entry.solveMode) {
    case "findWorkFromRateAndTime":
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}. How many ${c.object} will it complete in ${formatRational(p.time)} ${timeLabel}?`;
    case "findRateFromWorkAndTime":
      return `${c.actor} ${c.action} ${formatRational(p.totalWork)} ${c.object} in ${formatRational(p.time)} ${timeLabel}. Find the work completed per ${p.timeUnit}.`;
    case "findTimeFromWorkAndRate":
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}. How much time is required to complete ${formatRational(p.totalWork)} ${c.object}?`;
    case "findOneUnitWorkFromCompletionTime":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. What fraction of the work is completed in one ${p.timeUnit}?`;
    case "findCompletionTimeFromOneUnitWork":
      return `${c.actor} completes ${formatRational(p.rate)} of ${c.object} in one ${p.timeUnit}. How many ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))} will be required for the whole work?`;
    case "findFractionCompletedInGivenTime":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. What fraction of the work will be completed in ${formatRational(p.time)} ${timeLabel}?`;
    case "findPercentCompletedInGivenTime":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. What percentage of the work will be completed in ${formatRational(p.time)} ${timeLabel}?`;
    case "findTimeForGivenFraction":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. How much time is needed to complete ${formatRational(fraction)} of the work?`;
    case "findTimeForGivenPercent":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. How much time is needed to complete ${formatRational(percent(fraction))}% of the work?`;
    case "findRemainingFractionAfterTime":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. What fraction of the work remains after ${formatRational(p.time)} ${timeLabel}?`;
    case "findRemainingPercentAfterTime":
      return `${c.actor} can complete ${c.object} in ${completion} ${timeUnitLabel(p.timeUnit, reciprocal(p.rate))}. What percentage of the work remains after ${formatRational(p.time)} ${timeLabel}?`;
    case "findOutputFromUnitRateAndTime":
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} in one ${p.timeUnit}. Find the total output in ${formatRational(p.time)} ${timeLabel}.`;
    case "recoverWholeWorkFromPartAndFraction":
      return `${c.actor} has completed ${formatRational(required(p.partWork, "partWork"))} ${c.object}, which is ${formatRational(fraction)} of the entire assignment. Find the total size of the assignment.`;
    case "recoverWholeTimeFromPartCompletion":
      return `${c.actor} completes ${formatRational(fraction)} of ${c.object} in ${formatRational(required(p.partTime, "partTime"))} ${timeUnitLabel(p.timeUnit, required(p.partTime, "partTime"))}. At the same rate, how long will the whole work take?`;
    case "convertRateAcrossTimeUnits": {
      const sourceDuration = required(p.sourceDuration, "sourceDuration");
      const targetDuration = required(p.targetDuration, "targetDuration");
      return `${c.actor} ${c.action} ${formatRational(p.totalWork)} ${c.object} in ${formatRational(sourceDuration)} ${timeUnitLabel(p.timeUnit, sourceDuration)}. At the same rate, what is the equivalent output in ${formatRational(targetDuration)} ${timeUnitLabel(p.timeUnit, targetDuration)}?`;
    }
    case "compareWorkCompletedAtEqualTime": {
      const secondRate = required(p.secondaryRate, "secondaryRate");
      return `${c.actor} ${c.action} ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}, while ${c.secondActor} completes ${formatRational(secondRate)} ${c.object} per ${p.timeUnit}. How many more ${c.object} does the first complete in ${formatRational(p.time)} ${timeLabel}?`;
    }
    case "compareTimeForDifferentWorkAtSameRate":
      return `${c.actor} works at ${formatRational(p.rate)} ${c.object} per ${p.timeUnit}. How much more time is required for ${formatRational(p.totalWork)} ${c.object} than for ${formatRational(required(p.secondaryWork, "secondaryWork"))} ${c.object}?`;
    case "findRequiredRateForTargetCompletion":
      return `${c.actor} must complete ${formatRational(p.totalWork)} ${c.object} in ${formatRational(p.time)} ${timeLabel}. What uniform rate per ${p.timeUnit} is required?`;
    case "findDelayFromReducedUniformRate":
      return `${c.actor} was scheduled to complete ${c.object} in ${formatRational(required(p.originalTime, "originalTime"))} ${timeUnitLabel(p.timeUnit, required(p.originalTime, "originalTime"))}. If the working rate falls by ${formatRational(required(p.changePercent, "changePercent"))}%, by how much will completion be delayed?`;
    case "findTimeSavedFromIncreasedUniformRate":
      return `${c.actor} normally completes ${c.object} in ${formatRational(required(p.originalTime, "originalTime"))} ${timeUnitLabel(p.timeUnit, required(p.originalTime, "originalTime"))}. If the working rate rises by ${formatRational(required(p.changePercent, "changePercent"))}%, how much time will be saved?`;
  }
}

export function tmwCp001ExplanationOpening(entry: TmwCp001RegistryEntry): string {
  switch (entry.solveMode) {
    case "findWorkFromRateAndTime": return "The output grows uniformly, so multiply the per-unit-time work by the elapsed time.";
    case "findRateFromWorkAndTime": return "A uniform rate is obtained by distributing the completed work across the working time.";
    case "findTimeFromWorkAndRate": return "At a fixed rate, the required time equals the total work divided by the work done per time unit.";
    case "findOneUnitWorkFromCompletionTime": return "Treat the entire assignment as one unit and take the reciprocal of the completion time.";
    case "findCompletionTimeFromOneUnitWork": return "The whole-work time is the reciprocal of the fraction completed in one time unit.";
    case "findFractionCompletedInGivenTime": return "Multiply one-unit work by the elapsed time to obtain the completed fraction.";
    case "findPercentCompletedInGivenTime": return "First determine the completed fraction, then express that fraction as a percentage.";
    case "findTimeForGivenFraction": return "Only the stated fraction is required, so divide that target work by the one-unit rate.";
    case "findTimeForGivenPercent": return "Convert the target percentage to a work fraction before dividing by the one-unit rate.";
    case "findRemainingFractionAfterTime": return "Find the completed fraction first and subtract it from the whole assignment.";
    case "findRemainingPercentAfterTime": return "The uncompleted share is the complement of the completed work, expressed as a percentage.";
    case "findOutputFromUnitRateAndTime": return "The machine maintains a uniform output, so total production is rate multiplied by duration.";
    case "recoverWholeWorkFromPartAndFraction": return "The known output represents only a stated fraction, so scale that part back to the whole.";
    case "recoverWholeTimeFromPartCompletion": return "At a constant rate, time and completed work have the same proportional relationship.";
    case "convertRateAcrossTimeUnits": return "Reduce the stated output to one hour, then scale it to the requested time block.";
    case "compareWorkCompletedAtEqualTime": return "Because both work for the same duration, compare their rates on that common time interval.";
    case "compareTimeForDifferentWorkAtSameRate": return "Use the common rate to calculate both durations before taking the time difference.";
    case "findRequiredRateForTargetCompletion": return "The assignment size and deadline together determine the minimum uniform output rate.";
    case "findDelayFromReducedUniformRate": return "The job size is unchanged; a lower rate therefore increases the completion time.";
    case "findTimeSavedFromIncreasedUniformRate": return "The job size is unchanged; a higher rate reduces the completion time by the required saving.";
  }
}
