import { formatExactNumber } from "../shared/exact";
import type { Sta001Question, Sta001State } from "./types";

function total(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

function independentMedian(values: readonly number[]): string {
  const ordered = [...values].sort((a, b) => a - b);
  const half = Math.floor(ordered.length / 2);
  if (ordered.length % 2 === 1) return String(ordered[half]!);
  return formatExactNumber(ordered[half - 1]! + ordered[half]!, 2);
}

function independentMode(values: readonly number[]): string {
  const counts: Record<string, number> = {};
  for (const value of values) counts[String(value)] = (counts[String(value)] ?? 0) + 1;
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1] || Number(a[0]) - Number(b[0]));
  if (ranked.length < 2 || ranked[0]![1] === ranked[1]![1]) throw new Error("STAT-001 independent verifier found no unique mode.");
  return ranked[0]![0];
}

export function independentlySolveSta001State(state: Sta001State): string {
  switch (state.kind) {
    case "SIMPLE_MEAN_RAW":
      return formatExactNumber(total(state.values), state.values.length);
    case "MISSING_OBSERVATION":
      return String(state.observationCount * state.mean - total(state.knownValues));
    case "CORRECTED_MEAN":
      return formatExactNumber(
        state.reportedMean * state.observationCount - state.wrongValue + state.correctValue,
        state.observationCount,
      );
    case "COMBINED_MEAN":
      return formatExactNumber(
        state.group1Count * state.group1Mean + state.group2Count * state.group2Mean,
        state.group1Count + state.group2Count,
      );
    case "MEDIAN_RAW":
      return independentMedian(state.values);
    case "MODE_RAW":
      return independentMode(state.values);
  }
}

export function independentlyVerifySta001Question(question: Sta001Question): boolean {
  const expected = independentlySolveSta001State(question.state);
  return (
    question.packageId === "STAT-001" &&
    expected === question.answer &&
    question.options.length === 4 &&
    new Set(question.options).size === 4 &&
    question.options.filter((option) => option === expected).length === 1 &&
    question.options[question.correctIndex] === expected &&
    question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT"
  );
}
