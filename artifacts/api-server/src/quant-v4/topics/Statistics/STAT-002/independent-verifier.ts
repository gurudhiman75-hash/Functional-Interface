import type { Stat002Question, Stat002State } from "./types";

function sum(values: readonly number[]) {
  let total = 0;
  for (const value of values) total += value;
  return total;
}

function recomputePopulationSd(values: readonly number[]) {
  const total = sum(values);
  if (total % values.length !== 0) throw new Error("STAT-002 independent verifier requires an exact integral mean for generated raw states.");
  const arithmeticMean = total / values.length;
  let squaredDeviationTotal = 0;
  for (const value of values) squaredDeviationTotal += (value - arithmeticMean) ** 2;
  if (squaredDeviationTotal % values.length !== 0) throw new Error("STAT-002 independent verifier found non-integral variance.");
  const variance = squaredDeviationTotal / values.length;
  const root = Math.sqrt(variance);
  if (!Number.isInteger(root)) throw new Error("STAT-002 independent verifier found a non-square variance.");
  return root;
}

export function independentlySolveStat002State(state: Stat002State): string {
  switch (state.kind) {
    case "RAW_POPULATION_SD":
      return String(recomputePopulationSd(state.values));
    case "MEAN_AND_MEAN_SQUARES": {
      const variance = state.meanOfSquares - state.mean * state.mean;
      if (variance < 0) throw new Error("STAT-002 independent verifier found negative variance.");
      const root = Math.sqrt(variance);
      if (!Number.isInteger(root)) throw new Error("STAT-002 independent verifier found a non-exact mean-squares state.");
      return String(root);
    }
    case "TRANSLATED_DATA": {
      const translated = state.values.map((value) => value + state.additiveConstant);
      return String(recomputePopulationSd(translated));
    }
    case "SCALED_DATA": {
      const scaled = state.values.map((value) => value * state.multiplier);
      return String(recomputePopulationSd(scaled));
    }
    case "REVERSE_SCALE": {
      if (state.originalStandardDeviation <= 0) throw new Error("STAT-002 reverse-scale original SD must be positive.");
      const ratio = state.transformedStandardDeviation / state.originalStandardDeviation;
      if (!Number.isInteger(ratio) || ratio <= 0) throw new Error("STAT-002 reverse-scale ratio must be a positive integer.");
      return String(ratio);
    }
  }
}

export function independentlyVerifyStat002Question(question: Stat002Question) {
  const expected = independentlySolveStat002State(question.state);
  const correctOptionCount = question.options.filter((option) => option === expected).length;
  return (
    question.packageId === "STAT-002" &&
    question.answer === expected &&
    question.options.length === 4 &&
    new Set(question.options).size === 4 &&
    correctOptionCount === 1 &&
    question.options[question.correctIndex] === expected
  );
}
