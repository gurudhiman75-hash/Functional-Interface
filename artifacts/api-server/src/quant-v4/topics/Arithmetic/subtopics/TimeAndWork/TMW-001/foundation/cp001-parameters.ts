import { multiply, rational, reciprocal } from "./rational";
import { pick } from "./cp001-helpers";
import type { TmwContext, TmwCp001Parameters, TmwCp001RegistryEntry } from "./types";

const contexts: Record<TmwCp001RegistryEntry["scenarioFamily"], readonly TmwContext[]> = {
  production: [
    { actor: "A packaging machine", peerActor: "A second packaging machine", action: "packs", object: "cartons", jobPhrase: "a fixed batch of cartons", outputUnit: "items" },
    { actor: "A printing unit", peerActor: "A second printing unit", action: "prints", object: "booklets", jobPhrase: "a fixed batch of booklets", outputUnit: "items" },
    { actor: "A bottling line", peerActor: "A second bottling line", action: "fills", object: "bottles", jobPhrase: "a fixed batch of bottles", outputUnit: "items" },
    { actor: "A sorting machine", peerActor: "A second sorting machine", action: "sorts", object: "parcels", jobPhrase: "a fixed batch of parcels", outputUnit: "items" },
  ],
  document_work: [
    { actor: "A data-entry operator", peerActor: "Another data-entry operator", action: "processes", object: "forms", jobPhrase: "a fixed batch of forms", outputUnit: "forms" },
    { actor: "A typist", peerActor: "Another typist", action: "types", object: "pages", jobPhrase: "a typing assignment", outputUnit: "pages" },
    { actor: "A records clerk", peerActor: "Another records clerk", action: "digitises", object: "files", jobPhrase: "a fixed set of files", outputUnit: "items" },
    { actor: "A proofreader", peerActor: "Another proofreader", action: "checks", object: "pages", jobPhrase: "a proofreading assignment", outputUnit: "pages" },
  ],
  inspection: [
    { actor: "An inspection team", peerActor: "A second inspection team", action: "checks", object: "files", jobPhrase: "an assigned set of files", outputUnit: "items" },
    { actor: "A verification clerk", peerActor: "Another verification clerk", action: "verifies", object: "applications", jobPhrase: "a fixed batch of applications", outputUnit: "forms" },
    { actor: "A quality-control unit", peerActor: "A second quality-control unit", action: "inspects", object: "components", jobPhrase: "a fixed batch of components", outputUnit: "items" },
    { actor: "An audit assistant", peerActor: "Another audit assistant", action: "reviews", object: "records", jobPhrase: "an assigned set of records", outputUnit: "items" },
  ],
  painting: [
    { actor: "A painter", peerActor: "Another painter", action: "paints", object: "metres of wall", jobPhrase: "a boundary wall", outputUnit: "metres" },
    { actor: "A maintenance worker", peerActor: "Another maintenance worker", action: "completes", object: "repair tasks", jobPhrase: "a repair assignment", outputUnit: "items" },
    { actor: "A decorator", peerActor: "Another decorator", action: "finishes", object: "rooms", jobPhrase: "an office interior", outputUnit: "items" },
    { actor: "A contractor", peerActor: "Another contractor", action: "completes", object: "metres of surface", jobPhrase: "a resurfacing job", outputUnit: "metres" },
  ],
  construction: [
    { actor: "A road crew", peerActor: "A second road crew", action: "repairs", object: "metres of road", jobPhrase: "a planned road section", outputUnit: "metres" },
    { actor: "A fencing team", peerActor: "A second fencing team", action: "installs", object: "metres of fencing", jobPhrase: "a fencing assignment", outputUnit: "metres" },
    { actor: "A masonry team", peerActor: "A second masonry team", action: "builds", object: "metres of wall", jobPhrase: "a planned wall section", outputUnit: "metres" },
    { actor: "A cable-laying crew", peerActor: "A second cable-laying crew", action: "lays", object: "metres of cable", jobPhrase: "a cable-laying assignment", outputUnit: "metres" },
  ],
};

function contextFor(entry: TmwCp001RegistryEntry, seed: string): TmwContext {
  return pick(contexts[entry.scenarioFamily], seed, "context");
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
