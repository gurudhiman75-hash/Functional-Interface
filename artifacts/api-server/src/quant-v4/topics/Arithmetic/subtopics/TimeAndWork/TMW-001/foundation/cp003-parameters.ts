import { divide, multiply, rational } from "./rational";
import { pick } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp003Context, TmwCp003Parameters, TmwCp003RegistryEntry } from "./cp003-types";

const contexts: readonly TmwCp003Context[] = [
  { agentNoun: "operator", jobPhrase: "a batch of customer records", outputNoun: "records", outputVerb: "process" },
  { agentNoun: "technician", jobPhrase: "an equipment overhaul", outputNoun: "components", outputVerb: "repair" },
  { agentNoun: "clerk", jobPhrase: "a set of loan applications", outputNoun: "applications", outputVerb: "verify" },
  { agentNoun: "machine", jobPhrase: "a printing order", outputNoun: "booklets", outputVerb: "print" },
  { agentNoun: "crew", jobPhrase: "a road-marking project", outputNoun: "metres", outputVerb: "mark" },
  { agentNoun: "packer", jobPhrase: "a packaging order", outputNoun: "cartons", outputVerb: "pack" },
  { agentNoun: "inspector", jobPhrase: "a quality-inspection batch", outputNoun: "units", outputVerb: "inspect" },
  { agentNoun: "typist", jobPhrase: "the typing of a manuscript", outputNoun: "pages", outputVerb: "type" },
  { agentNoun: "painter", jobPhrase: "a school-building painting project", outputNoun: "rooms", outputVerb: "paint" },
  { agentNoun: "worker", jobPhrase: "a warehouse inventory count", outputNoun: "items", outputVerb: "count" },
  { agentNoun: "surveyor", jobPhrase: "a field survey", outputNoun: "forms", outputVerb: "complete" },
  { agentNoun: "assembler", jobPhrase: "an electronics assembly order", outputNoun: "devices", outputVerb: "assemble" },
];

const ratioStates = [
  { a: 3, b: 2 },
  { a: 4, b: 3 },
  { a: 5, b: 4 },
  { a: 2, b: 1 },
  { a: 7, b: 5 },
] as const;

const moreStates = [
  { percent: 20, slowerTime: 18 },
  { percent: 25, slowerTime: 20 },
  { percent: 40, slowerTime: 21 },
  { percent: 50, slowerTime: 18 },
  { percent: 60, slowerTime: 24 },
] as const;

const lessStates = [
  { percent: 20, fasterTime: 16 },
  { percent: 25, fasterTime: 15 },
  { percent: 40, fasterTime: 12 },
  { percent: 50, fasterTime: 10 },
] as const;

function ratioValues(seed: string, salt: string): { a: Rational; b: Rational } {
  const state = pick(ratioStates, seed, salt);
  return { a: rational(state.a), b: rational(state.b) };
}

export function buildTmwCp003Parameters(entry: TmwCp003RegistryEntry, seed: string): TmwCp003Parameters {
  const context = pick(contexts, seed, "cp003-context");
  const ratio = ratioValues(seed, "cp003-ratio");
  const base: TmwCp003Parameters = {
    timeUnit: "day",
    efficiencyA: ratio.a,
    efficiencyB: ratio.b,
    context,
  };

  switch (entry.solveMode) {
    case "findEfficiencyRatioFromEqualWorkTimes": {
      const scale = pick([3, 4, 5, 6], seed, "cp003-equal-time-scale");
      return { ...base, timeA: multiply(ratio.b, rational(scale)), timeB: multiply(ratio.a, rational(scale)) };
    }
    case "findTimeRatioFromEfficiencyRatio":
    case "findWorkRatioAtEqualTimeFromEfficiencyRatio":
      return base;

    case "findEfficiencyPercentMoreFromCompletionTimes": {
      const state = pick(moreStates, seed, "cp003-percent-more-times");
      const multiplier = rational(100 + state.percent, 100);
      const timeB = rational(state.slowerTime);
      const timeA = divide(timeB, multiplier);
      return { ...base, efficiencyA: multiplier, efficiencyB: rational(1), timeA, timeB, percentAOverB: rational(state.percent) };
    }

    case "findEfficiencyPercentLessFromCompletionTimes": {
      const state = pick(lessStates, seed, "cp003-percent-less-times");
      const efficiencyA = rational(100 - state.percent, 100);
      const efficiencyB = rational(1);
      const timeB = rational(state.fasterTime);
      const timeA = divide(timeB, efficiencyA);
      return { ...base, efficiencyA, efficiencyB, timeA, timeB, percentAOverB: rational(state.percent) };
    }

    case "findFasterTimeFromSlowerTimeAndPercentMoreEfficient":
    case "findSlowerTimeFromFasterTimeAndPercentMoreEfficient":
    case "findTimePercentLessFromEfficiencyPercentMore": {
      const state = pick(moreStates, seed, "cp003-more-state");
      const efficiencyA = rational(100 + state.percent, 100);
      const efficiencyB = rational(1);
      const timeB = rational(state.slowerTime);
      const timeA = divide(timeB, efficiencyA);
      return { ...base, efficiencyA, efficiencyB, timeA, timeB, percentAOverB: rational(state.percent) };
    }

    case "findTimePercentMoreFromEfficiencyPercentLess": {
      const state = pick(lessStates, seed, "cp003-less-state");
      const efficiencyA = rational(100 - state.percent, 100);
      const efficiencyB = rational(1);
      const timeB = rational(state.fasterTime);
      const timeA = divide(timeB, efficiencyA);
      return { ...base, efficiencyA, efficiencyB, timeA, timeB, percentAOverB: rational(state.percent) };
    }

    case "findWorkRatioFromEfficiencyRatioAndUnequalTimes": {
      const durations = pick([{ a: 4, b: 5 }, { a: 6, b: 4 }, { a: 5, b: 8 }, { a: 9, b: 6 }], seed, "cp003-work-durations");
      return { ...base, durationA: rational(durations.a), durationB: rational(durations.b) };
    }

    case "findTimeRatioForUnequalWorkAndEfficiencyRatio":
    case "findEfficiencyRatioFromUnequalWorkAndTimes": {
      const state = pick([
        { workA: 3, workB: 2, timeA: 4, timeB: 5 },
        { workA: 5, workB: 4, timeA: 6, timeB: 8 },
        { workA: 7, workB: 5, timeA: 5, timeB: 6 },
        { workA: 4, workB: 3, timeA: 9, timeB: 8 },
      ], seed, "cp003-unequal-state");
      if (entry.solveMode === "findTimeRatioForUnequalWorkAndEfficiencyRatio") {
        return { ...base, workA: rational(state.workA), workB: rational(state.workB) };
      }
      const efficiencyA = divide(rational(state.workA, state.timeA), rational(state.workB, state.timeB));
      return {
        ...base,
        efficiencyA,
        efficiencyB: rational(1),
        workA: rational(state.workA),
        workB: rational(state.workB),
        timeA: rational(state.timeA),
        timeB: rational(state.timeB),
      };
    }

    case "findOutputFromEfficiencyRatioAndReferenceOutput":
    case "findReferenceOutputFromEfficiencyRatioAndOtherOutput": {
      const outputB = multiply(ratio.b, rational(pick([8, 10, 12, 15], seed, "cp003-output-scale")));
      const outputA = divide(multiply(outputB, ratio.a), ratio.b);
      return { ...base, outputA, outputB, durationA: rational(1), durationB: rational(1) };
    }

    case "findIndividualTimeFromEfficiencyRatioAndCombinedTime": {
      const state = pick([
        { a: 3, b: 2, combined: 6 },
        { a: 4, b: 3, combined: 12 },
        { a: 5, b: 4, combined: 20 },
        { a: 2, b: 1, combined: 6 },
      ], seed, "cp003-combined-ratio");
      const efficiencyA = rational(state.a);
      const efficiencyB = rational(state.b);
      const combinedTime = rational(state.combined);
      const timeA = divide(multiply(combinedTime, rational(state.a + state.b)), efficiencyA);
      const timeB = divide(multiply(combinedTime, rational(state.a + state.b)), efficiencyB);
      const targetAgentIndex = pick([0, 1] as const, seed, "cp003-combined-target");
      return { ...base, efficiencyA, efficiencyB, combinedTime, timeA, timeB, targetAgentIndex };
    }

    case "findIndividualTimeFromEfficiencyRatioAndTimeDifference":
    case "findIndividualTimeFromEfficiencyRatioAndTimeSum": {
      const state = pick([
        { a: 3, b: 2, scale: 4 },
        { a: 4, b: 3, scale: 5 },
        { a: 5, b: 4, scale: 6 },
        { a: 2, b: 1, scale: 7 },
      ], seed, "cp003-time-relation");
      const efficiencyA = rational(state.a);
      const efficiencyB = rational(state.b);
      const timeA = rational(state.b * state.scale);
      const timeB = rational(state.a * state.scale);
      const targetAgentIndex = pick([0, 1] as const, seed, "cp003-time-target");
      return {
        ...base,
        efficiencyA,
        efficiencyB,
        timeA,
        timeB,
        timeDifference: rational(Math.abs(timeB.numerator - timeA.numerator)),
        timeSum: rational(timeA.numerator + timeB.numerator),
        targetAgentIndex,
      };
    }

    case "findEfficiencyRatioFromOutputAndTimeComparison": {
      const state = pick([
        { outA: 120, outB: 100, timeA: 6, timeB: 5 },
        { outA: 150, outB: 120, timeA: 5, timeB: 6 },
        { outA: 180, outB: 140, timeA: 9, timeB: 7 },
        { outA: 96, outB: 72, timeA: 4, timeB: 4 },
      ], seed, "cp003-output-time");
      const efficiencyA = divide(rational(state.outA, state.timeA), rational(state.outB, state.timeB));
      return { ...base, efficiencyA, efficiencyB: rational(1), outputA: rational(state.outA), outputB: rational(state.outB), durationA: rational(state.timeA), durationB: rational(state.timeB) };
    }

    case "findComparativeOutputFromDifferentEfficienciesAndDurations": {
      const state = pick([
        { a: 3, b: 2, dA: 4, dB: 3, outB: 60 },
        { a: 4, b: 3, dA: 6, dB: 4, outB: 72 },
        { a: 5, b: 4, dA: 8, dB: 5, outB: 100 },
        { a: 2, b: 1, dA: 3, dB: 4, outB: 80 },
      ], seed, "cp003-comparative-output");
      const outputA = divide(multiply(multiply(rational(state.outB), rational(state.a)), rational(state.dA)), multiply(rational(state.b), rational(state.dB)));
      return { ...base, efficiencyA: rational(state.a), efficiencyB: rational(state.b), durationA: rational(state.dA), durationB: rational(state.dB), outputA, outputB: rational(state.outB) };
    }

    case "findComparativeDurationFromDifferentWorkAndEfficiencies": {
      const state = pick([
        { a: 3, b: 2, workA: 5, workB: 4, timeB: 12 },
        { a: 4, b: 3, workA: 8, workB: 5, timeB: 10 },
        { a: 5, b: 4, workA: 9, workB: 6, timeB: 8 },
        { a: 2, b: 1, workA: 3, workB: 5, timeB: 20 },
      ], seed, "cp003-comparative-duration");
      const timeA = divide(multiply(multiply(rational(state.timeB), rational(state.workA)), rational(state.b)), multiply(rational(state.workB), rational(state.a)));
      return { ...base, efficiencyA: rational(state.a), efficiencyB: rational(state.b), workA: rational(state.workA), workB: rational(state.workB), timeA, timeB: rational(state.timeB) };
    }

    case "findSuccessiveEfficiencyRatioAcrossThreeAgents": {
      const state = pick([
        { abA: 3, abB: 2, bcB: 4, bcC: 3 },
        { abA: 5, abB: 4, bcB: 3, bcC: 2 },
        { abA: 4, abB: 3, bcB: 5, bcC: 4 },
        { abA: 7, abB: 5, bcB: 2, bcC: 1 },
      ], seed, "cp003-successive-ratio");
      return { ...base, efficiencyA: rational(state.abA, state.abB), efficiencyB: rational(1), efficiencyC: rational(state.bcC, state.bcB) };
    }

    case "findSuccessiveEfficiencyPercentComparison": {
      const state = pick([
        { first: 25, second: 20 },
        { first: 20, second: 25 },
        { first: 50, second: 20 },
        { first: 40, second: 25 },
      ], seed, "cp003-successive-percent");
      return {
        ...base,
        efficiencyA: rational(100 + state.first, 100),
        efficiencyB: rational(1),
        efficiencyC: rational(100, 100 + state.second),
        percentAOverB: rational(state.first),
        percentBOverC: rational(state.second),
      };
    }

    case "findEfficiencyChangePercentFromCompletionTimeChange": {
      const state = pick([
        { original: 20, changed: 16 },
        { original: 18, changed: 15 },
        { original: 24, changed: 16 },
        { original: 21, changed: 15 },
      ], seed, "cp003-time-change");
      return { ...base, originalTime: rational(state.original), changedTime: rational(state.changed) };
    }
  }
}
