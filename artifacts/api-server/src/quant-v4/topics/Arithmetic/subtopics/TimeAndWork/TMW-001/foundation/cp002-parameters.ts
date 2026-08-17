import { add, divide, multiply, rational, reciprocal, subtract } from "./rational";
import { pick } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp002Context, TmwCp002Parameters, TmwCp002RegistryEntry, TmwPairwiseTimes } from "./cp002-types";

const contexts: readonly TmwCp002Context[] = [
  { jobPhrase: "a data-processing assignment", agentNoun: "operator", outputNoun: "records" },
  { jobPhrase: "a repair project", agentNoun: "technician", outputNoun: "components" },
  { jobPhrase: "a printing order", agentNoun: "machine", outputNoun: "booklets" },
  { jobPhrase: "a road-maintenance project", agentNoun: "crew", outputNoun: "metres of road" },
  { jobPhrase: "a document-verification assignment", agentNoun: "clerk", outputNoun: "applications" },
];

const timeSets: readonly number[][] = [
  [10, 15],
  [12, 18],
  [8, 12],
  [10, 15, 30],
  [12, 18, 36],
  [8, 12, 24],
  [12, 16, 24, 48],
  [15, 20, 30, 60],
];

const tripleSets: readonly number[][] = [
  [10, 15, 30],
  [12, 18, 36],
  [8, 12, 24],
  [12, 16, 48],
];

function ratesFromTimes(times: number[]): Rational[] {
  return times.map((time) => rational(1, time));
}

function sumRates(rates: Rational[]): Rational {
  return rates.reduce((total, rate) => add(total, rate), rational(0));
}

function pairwiseTimesFromRates(rates: Rational[]): TmwPairwiseTimes {
  return {
    ab: reciprocal(add(rates[0], rates[1])),
    bc: reciprocal(add(rates[1], rates[2])),
    ca: reciprocal(add(rates[2], rates[0])),
  };
}

export function buildTmwCp002Parameters(entry: TmwCp002RegistryEntry, seed: string): TmwCp002Parameters {
  const context = pick(contexts, seed, "cp002-context");
  const chosenTimes = pick(timeSets, seed, "cp002-times");
  const individualTimes = chosenTimes.map((value) => rational(value));
  const individualRates = ratesFromTimes(chosenTimes);
  const base: TmwCp002Parameters = {
    totalWork: rational(1),
    timeUnit: "day",
    individualTimes,
    individualRates,
    context,
  };

  switch (entry.solveMode) {
    case "findCombinedTimeFromIndividualTimes":
      return base;

    case "findCombinedWorkInGivenTime": {
      const combinedRate = sumRates(individualRates);
      const combinedTime = reciprocal(combinedRate);
      const maximumWholeDuration = Math.max(1, Math.floor(combinedTime.numerator / combinedTime.denominator) - 1);
      const duration = rational(pick(Array.from({ length: maximumWholeDuration }, (_, index) => index + 1), seed, "cp002-duration"));
      return { ...base, duration, combinedTime };
    }

    case "findMissingIndividualTimeFromCombinedAndKnownTimes": {
      const selected = pick(tripleSets, seed, "cp002-missing-triple");
      const times = selected.map((value) => rational(value));
      const rates = ratesFromTimes(selected);
      return {
        ...base,
        individualTimes: times,
        individualRates: rates,
        targetAgentIndex: 2,
        combinedTime: reciprocal(sumRates(rates)),
      };
    }

    case "findAllTogetherTimeFromPairwiseTimes":
    case "findIndividualTimeFromPairwiseTimes": {
      const selected = pick(tripleSets, seed, "cp002-pairwise-triple");
      const times = selected.map((value) => rational(value));
      const rates = ratesFromTimes(selected);
      return {
        ...base,
        individualTimes: times,
        individualRates: rates,
        pairwiseTimes: pairwiseTimesFromRates(rates),
        targetAgentIndex: pick([0, 1, 2], seed, "cp002-target-agent"),
      };
    }

    case "findPairTimeFromAllTogetherAndThirdTime": {
      const selected = pick(tripleSets, seed, "cp002-pair-third");
      const times = selected.map((value) => rational(value));
      const rates = ratesFromTimes(selected);
      return {
        ...base,
        individualTimes: times,
        individualRates: rates,
        combinedTime: reciprocal(sumRates(rates)),
        thirdTime: times[2],
      };
    }

    case "findNetTimeWithDestructiveAgent":
    case "findDestructiveTimeFromPositiveAndNetTimes": {
      const signedSet = pick(
        [
          { positives: [12, 18], destructive: 36 },
          { positives: [10, 15], destructive: 30 },
          { positives: [8, 12], destructive: 24 },
          { positives: [15, 20], destructive: 60 },
        ],
        seed,
        "cp002-signed-set",
      );
      const positiveTimes = signedSet.positives.map((value) => rational(value));
      const positiveRates = ratesFromTimes(signedSet.positives);
      const destructiveTime = rational(signedSet.destructive);
      const netRate = subtract(sumRates(positiveRates), reciprocal(destructiveTime));
      return {
        ...base,
        individualTimes: positiveTimes,
        individualRates: positiveRates,
        destructiveTime,
        netTime: reciprocal(netRate),
      };
    }

    case "findConstructiveTimeFromNetKnownPositiveAndDestructiveTimes": {
      const signedSet = pick(
        [
          { missing: 12, known: 18, destructive: 36 },
          { missing: 10, known: 15, destructive: 30 },
          { missing: 8, known: 12, destructive: 24 },
          { missing: 15, known: 20, destructive: 60 },
        ],
        seed,
        "cp002-missing-positive",
      );
      const missingTime = rational(signedSet.missing);
      const knownTime = rational(signedSet.known);
      const destructiveTime = rational(signedSet.destructive);
      const netRate = subtract(add(reciprocal(missingTime), reciprocal(knownTime)), reciprocal(destructiveTime));
      return {
        ...base,
        individualTimes: [missingTime, knownTime],
        individualRates: [reciprocal(missingTime), reciprocal(knownTime)],
        targetAgentIndex: 0,
        knownPositiveTimes: [knownTime],
        destructiveTime,
        netTime: reciprocal(netRate),
      };
    }

    case "findIdenticalAgentCountFromSingleAndCombinedTime":
    case "findCombinedTimeFromIdenticalAgentCount": {
      const state = pick(
        [
          { single: 24, count: 3 },
          { single: 30, count: 5 },
          { single: 36, count: 4 },
          { single: 48, count: 6 },
          { single: 20, count: 4 },
        ],
        seed,
        "cp002-identical",
      );
      const singleTime = rational(state.single);
      return {
        ...base,
        individualTimes: [singleTime],
        individualRates: [reciprocal(singleTime)],
        identicalAgentCount: state.count,
        combinedTime: divide(singleTime, rational(state.count)),
      };
    }

    case "findCombinedOutputFromExplicitRates": {
      const explicitState = pick(
        [
          { rates: [8, 12], duration: 5 },
          { rates: [6, 10, 14], duration: 4 },
          { rates: [15, 20], duration: 6 },
          { rates: [9, 12, 15], duration: 5 },
        ],
        seed,
        "cp002-explicit",
      );
      return {
        ...base,
        totalWork: rational(0),
        explicitRates: explicitState.rates.map((value) => rational(value)),
        duration: rational(explicitState.duration),
        timeUnit: "hour",
      };
    }

    case "findMissingRateFromSignedNetRate": {
      const signedState = pick(
        [
          { known: [{ sign: 1 as const, rate: 12 }, { sign: 1 as const, rate: 8 }], missingSign: -1 as const, missing: 5 },
          { known: [{ sign: 1 as const, rate: 15 }, { sign: -1 as const, rate: 4 }], missingSign: 1 as const, missing: 9 },
          { known: [{ sign: 1 as const, rate: 18 }, { sign: 1 as const, rate: 7 }], missingSign: -1 as const, missing: 10 },
          { known: [{ sign: 1 as const, rate: 20 }, { sign: -1 as const, rate: 6 }], missingSign: 1 as const, missing: 8 },
        ],
        seed,
        "cp002-signed-explicit",
      );
      const signedKnownRates = signedState.known.map((item) => ({ sign: item.sign, rate: rational(item.rate) }));
      const knownNet = signedKnownRates.reduce(
        (total, item) => item.sign === 1 ? add(total, item.rate) : subtract(total, item.rate),
        rational(0),
      );
      const missingRate = rational(signedState.missing);
      const netRate = signedState.missingSign === 1 ? add(knownNet, missingRate) : subtract(knownNet, missingRate);
      return {
        ...base,
        totalWork: rational(0),
        signedKnownRates,
        missingRateSign: signedState.missingSign,
        netRate,
      };
    }

    case "findCompletionTimeDifferenceBetweenTeams": {
      const state = pick(
        [
          { a: [10, 30], b: [12, 24] },
          { a: [8, 24], b: [12, 24] },
          { a: [15, 30], b: [12, 24] },
          { a: [12, 24], b: [18, 36] },
        ],
        seed,
        "cp002-team-compare",
      );
      return {
        ...base,
        teamATimes: state.a.map((value) => rational(value)),
        teamBTimes: state.b.map((value) => rational(value)),
      };
    }
  }
}
