import { multiply, rational, reciprocal } from "./rational";
import { pick } from "./cp001-helpers";
import type { TmwContext, TmwCp001Parameters, TmwCp001RegistryEntry } from "./types";

const contexts: Record<TmwCp001RegistryEntry["scenarioFamily"], readonly TmwContext[]> = {
  production: [
    { actor: "A packaging machine", action: "packs", object: "cartons", outputUnit: "items" },
    { actor: "A printing unit", action: "prints", object: "booklets", outputUnit: "items" },
    { actor: "A bottling line", action: "fills", object: "bottles", outputUnit: "items" },
    { actor: "A sorting machine", action: "sorts", object: "parcels", outputUnit: "items" },
  ],
  document_work: [
    { actor: "A data-entry operator", action: "processes", object: "forms", outputUnit: "forms" },
    { actor: "A typist", action: "types", object: "pages", outputUnit: "pages" },
    { actor: "A records clerk", action: "digitises", object: "files", outputUnit: "items" },
    { actor: "A proofreader", action: "checks", object: "pages", outputUnit: "pages" },
  ],
  inspection: [
    { actor: "An inspection team", action: "checks", object: "files", outputUnit: "items" },
    { actor: "A verification clerk", action: "verifies", object: "applications", outputUnit: "forms" },
    { actor: "A quality-control unit", action: "inspects", object: "components", outputUnit: "items" },
    { actor: "An audit assistant", action: "reviews", object: "records", outputUnit: "items" },
  ],
  painting: [
    { actor: "A painter", action: "paints", object: "a boundary wall", outputUnit: "metres" },
    { actor: "A maintenance worker", action: "completes", object: "a repair assignment", outputUnit: "items" },
    { actor: "A decorator", action: "finishes", object: "an office interior", outputUnit: "items" },
    { actor: "A contractor", action: "completes", object: "a resurfacing job", outputUnit: "metres" },
  ],
  construction: [
    { actor: "A road crew", action: "repairs", object: "metres of road", outputUnit: "metres" },
    { actor: "A fencing team", action: "installs", object: "metres of fencing", outputUnit: "metres" },
    { actor: "A masonry team", action: "builds", object: "metres of wall", outputUnit: "metres" },
    { actor: "A cable-laying crew", action: "lays", object: "metres of cable", outputUnit: "metres" },
  ],
};

const secondActors = ["a second operator", "another machine", "a second team", "another clerk"] as const;

function contextFor(entry: TmwCp001RegistryEntry, seed: string): TmwContext {
  return {
    ...pick(contexts[entry.scenarioFamily], seed, "context"),
    secondActor: pick(secondActors, seed, "second-actor"),
  };
}

export function buildTmwCp001Parameters(entry: TmwCp001RegistryEntry, seed: string): TmwCp001Parameters {
  const context = contextFor(entry, seed);
  const directRate = pick([4, 5, 6, 8, 10, 12, 15, 18], seed, "direct-rate");
  const directTime = pick([3, 4, 5, 6, 8, 10, 12], seed, "direct-time");
  const completionTime = pick([8, 10, 12, 15, 16, 18, 20, 24, 25, 30], seed, "completion");
  const elapsed = Math.min(pick([2, 3, 4, 5, 6, 8, 10], seed, "elapsed"), completionTime - 1);
  const requestedFraction = pick(
    [rational(1, 4), rational(1, 3), rational(2, 5), rational(1, 2), rational(3, 5), rational(3, 4)],
    seed,
    "fraction",
  );
  const defaults: TmwCp001Parameters = {
    totalWork: rational(directRate * directTime),
    rate: rational(directRate),
    time: rational(directTime),
    timeUnit: "day",
    requestedFraction,
    context,
  };

  switch (entry.solveMode) {
    case "findOneUnitWorkFromCompletionTime":
    case "findCompletionTimeFromOneUnitWork":
    case "findFractionCompletedInGivenTime":
    case "findPercentCompletedInGivenTime":
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent":
    case "findRemainingFractionAfterTime":
    case "findRemainingPercentAfterTime":
      return { ...defaults, totalWork: rational(1), rate: rational(1, completionTime), time: rational(elapsed) };

    case "recoverWholeWorkFromPartAndFraction": {
      const factor = pick([20, 24, 30, 36, 40, 50], seed, "whole-factor");
      const whole = rational(requestedFraction.denominator * factor);
      return {
        ...defaults,
        totalWork: whole,
        partWork: multiply(whole, requestedFraction),
        rate: rational(factor),
        time: rational(requestedFraction.numerator),
      };
    }

    case "recoverWholeTimeFromPartCompletion": {
      const factor = pick([2, 3, 4, 5, 6], seed, "time-factor");
      const wholeTime = rational(requestedFraction.denominator * factor);
      return {
        ...defaults,
        totalWork: rational(1),
        rate: reciprocal(wholeTime),
        time: wholeTime,
        partTime: multiply(wholeTime, requestedFraction),
      };
    }

    case "convertRateAcrossTimeUnits": {
      const hourlyRate = pick([6, 8, 10, 12, 15, 18], seed, "hourly-rate");
      const sourceDuration = rational(pick([4, 6, 8], seed, "source-duration"));
      const targetDuration = rational(pick([1, 2, 3], seed, "target-duration"));
      return {
        ...defaults,
        totalWork: multiply(rational(hourlyRate), sourceDuration),
        rate: rational(hourlyRate),
        time: sourceDuration,
        timeUnit: "hour",
        sourceDuration,
        targetDuration,
      };
    }

    case "compareWorkCompletedAtEqualTime": {
      const slowerRate = pick([4, 5, 6, 8, 10], seed, "slower-rate");
      const rateGap = pick([2, 3, 4, 5], seed, "rate-gap");
      return {
        ...defaults,
        rate: rational(slowerRate + rateGap),
        secondaryRate: rational(slowerRate),
        time: rational(pick([3, 4, 5, 6, 8], seed, "comparison-time")),
      };
    }

    case "compareTimeForDifferentWorkAtSameRate": {
      const rate = pick([4, 5, 6, 8, 10, 12], seed, "comparison-rate");
      const firstTime = pick([6, 8, 10, 12], seed, "first-time");
      const timeGap = pick([2, 3, 4, 5], seed, "time-gap");
      return {
        ...defaults,
        rate: rational(rate),
        totalWork: rational(rate * firstTime),
        secondaryWork: rational(rate * (firstTime - timeGap)),
        time: rational(firstTime),
      };
    }

    case "findRequiredRateForTargetCompletion": {
      const targetTime = pick([4, 5, 6, 8, 10], seed, "target-time");
      const requiredRate = pick([6, 8, 10, 12, 15], seed, "required-rate");
      return {
        ...defaults,
        totalWork: rational(requiredRate * targetTime),
        rate: rational(requiredRate),
        time: rational(targetTime),
      };
    }

    case "findDelayFromReducedUniformRate": {
      const change = pick(
        [
          { percent: 20, originalTime: 12 },
          { percent: 25, originalTime: 15 },
          { percent: 40, originalTime: 12 },
          { percent: 50, originalTime: 10 },
        ],
        seed,
        "reduction-pair",
      );
      const originalRate = rational(pick([6, 8, 10, 12, 15], seed, "original-rate"));
      const changedRate = multiply(originalRate, rational(100 - change.percent, 100));
      return {
        ...defaults,
        totalWork: multiply(originalRate, rational(change.originalTime)),
        rate: originalRate,
        originalRate,
        changedRate,
        originalTime: rational(change.originalTime),
        time: rational(change.originalTime),
        changePercent: rational(change.percent),
      };
    }

    case "findTimeSavedFromIncreasedUniformRate": {
      const change = pick(
        [
          { percent: 20, originalTime: 12 },
          { percent: 25, originalTime: 15 },
          { percent: 50, originalTime: 12 },
          { percent: 100, originalTime: 10 },
        ],
        seed,
        "increase-pair",
      );
      const originalRate = rational(pick([6, 8, 10, 12, 15], seed, "original-rate"));
      const changedRate = multiply(originalRate, rational(100 + change.percent, 100));
      return {
        ...defaults,
        totalWork: multiply(originalRate, rational(change.originalTime)),
        rate: originalRate,
        originalRate,
        changedRate,
        originalTime: rational(change.originalTime),
        time: rational(change.originalTime),
        changePercent: rational(change.percent),
      };
    }

    default:
      return defaults;
  }
}
