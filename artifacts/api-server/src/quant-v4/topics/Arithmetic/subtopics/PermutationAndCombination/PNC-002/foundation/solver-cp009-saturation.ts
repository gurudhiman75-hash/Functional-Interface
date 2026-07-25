import { combinationExact, productExact, sumExact } from "./math";
import { getPnc002VariableRanges } from "./library";
import type {
  Pnc002AnyParameters,
  Pnc002IndependentVerification,
  Pnc002SolverEvidence,
  Pnc002SolverResult,
  Pnc002SolveMode,
} from "./types";

const SATURATION_MODES = new Set<Pnc002SolveMode>([
  "countSpecifiedMemberRange",
  "countTwoCategoryRange",
]);

export function isPnc002Cp009SaturationMode(mode: Pnc002SolveMode): boolean {
  return SATURATION_MODES.has(mode);
}

function numberValue(parameters: Pnc002AnyParameters, key: string): number {
  const value = parameters.values[key];
  if (typeof value !== "number") throw new Error(`PNC-002 CP-009 saturation value ${key} is not numeric`);
  return value;
}
function choose(n: number, r: number, ceiling = Number.MAX_SAFE_INTEGER): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return 0;
  return combinationExact(n, r, ceiling);
}
function selectionEvidence(totalObjects: number, committeeSize: number, operation: Pnc002SolverEvidence["operation"]): Pnc002SolverEvidence {
  const unrestrictedCount = choose(totalObjects, committeeSize, getPnc002VariableRanges().answerCeiling);
  return {
    operation,
    totalObjects,
    blockSizes: [],
    groupedObjectCount: 0,
    blockCount: 0,
    unitCount: totalObjects,
    externalArrangementCount: unrestrictedCount,
    internalArrangementCounts: [],
    internalArrangementMultiplier: 1,
    committeeSize,
    unrestrictedCount,
  };
}
function result(answer: number, caseCounts: number[], evidence: Pnc002SolverEvidence): Pnc002SolverResult {
  const expression = caseCounts.join(" + ");
  return {
    exactAnswer: String(answer),
    answer: String(answer),
    numericAnswer: answer,
    equation: `${expression} = ${answer}`,
    mathJax: `${expression} = ${answer}`,
    evidence,
  };
}

export function countSpecifiedMemberRangeExact(
  totalObjects: number,
  committeeSize: number,
  specifiedCount: number,
  minimumSpecified: number,
  maximumSpecified: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): { answer: number; acceptedCounts: number[]; caseCounts: number[] } {
  const lower = Math.max(minimumSpecified, committeeSize - (totalObjects - specifiedCount), 0);
  const upper = Math.min(maximumSpecified, specifiedCount, committeeSize);
  const acceptedCounts: number[] = [];
  const caseCounts: number[] = [];
  for (let selectedSpecified = lower; selectedSpecified <= upper; selectedSpecified += 1) {
    acceptedCounts.push(selectedSpecified);
    caseCounts.push(productExact([
      choose(specifiedCount, selectedSpecified, ceiling),
      choose(totalObjects - specifiedCount, committeeSize - selectedSpecified, ceiling),
    ], ceiling));
  }
  return { answer: sumExact(caseCounts, ceiling), acceptedCounts, caseCounts };
}

export function countTwoCategoryRangeExact(
  categoryA: number,
  categoryB: number,
  committeeSize: number,
  minimumFromA: number,
  maximumFromA: number,
  minimumFromB: number,
  ceiling = Number.MAX_SAFE_INTEGER,
): { answer: number; acceptedCounts: number[]; caseCounts: number[] } {
  const lower = Math.max(minimumFromA, committeeSize - categoryB, 0);
  const upper = Math.min(maximumFromA, committeeSize - minimumFromB, categoryA, committeeSize);
  const acceptedCounts: number[] = [];
  const caseCounts: number[] = [];
  for (let selectedA = lower; selectedA <= upper; selectedA += 1) {
    acceptedCounts.push(selectedA);
    caseCounts.push(productExact([
      choose(categoryA, selectedA, ceiling),
      choose(categoryB, committeeSize - selectedA, ceiling),
    ], ceiling));
  }
  return { answer: sumExact(caseCounts, ceiling), acceptedCounts, caseCounts };
}

export function solvePnc002Cp009Saturation(parameters: Pnc002AnyParameters): Pnc002SolverResult {
  if (parameters.canonicalProblemId !== "PNC-CP-009" || !isPnc002Cp009SaturationMode(parameters.solveMode)) {
    throw new Error(`CP-009 saturation solver received ${parameters.canonicalProblemId}/${parameters.solveMode}`);
  }
  const ceiling = getPnc002VariableRanges().answerCeiling;
  const totalObjects = numberValue(parameters, "totalObjects");
  const committeeSize = numberValue(parameters, "committeeSize");

  if (parameters.solveMode === "countSpecifiedMemberRange") {
    const specifiedCount = numberValue(parameters, "specifiedCount");
    const minimumSpecified = numberValue(parameters, "minimumSpecified");
    const maximumSpecified = numberValue(parameters, "maximumSpecified");
    const counted = countSpecifiedMemberRangeExact(
      totalObjects,
      committeeSize,
      specifiedCount,
      minimumSpecified,
      maximumSpecified,
      ceiling,
    );
    return result(counted.answer, counted.caseCounts, {
      ...selectionEvidence(totalObjects, committeeSize, "SPECIFIED_MEMBER_RANGE"),
      specifiedCount,
      minimumSpecified,
      maximumSpecified,
      acceptedSelectionCounts: counted.acceptedCounts,
      selectionCaseCounts: counted.caseCounts,
    });
  }

  const categoryA = numberValue(parameters, "categoryA");
  const categoryB = numberValue(parameters, "categoryB");
  const minimumFromA = numberValue(parameters, "minimumFromA");
  const maximumFromA = numberValue(parameters, "maximumFromA");
  const minimumFromB = numberValue(parameters, "minimumFromB");
  const counted = countTwoCategoryRangeExact(
    categoryA,
    categoryB,
    committeeSize,
    minimumFromA,
    maximumFromA,
    minimumFromB,
    ceiling,
  );
  return result(counted.answer, counted.caseCounts, {
    ...selectionEvidence(totalObjects, committeeSize, "TWO_CATEGORY_RANGE"),
    categorySizes: [categoryA, categoryB],
    minimumFromA,
    maximumFromA,
    minimumFromB,
    acceptedSelectionCounts: counted.acceptedCounts,
    selectionCaseCounts: counted.caseCounts,
  });
}

function countSubsets(totalObjects: number, committeeSize: number, predicate: (selected: boolean[]) => boolean): number {
  const selected = Array.from({ length: totalObjects }, () => false);
  let count = 0;
  const visit = (next: number, chosen: number): void => {
    if (chosen === committeeSize) {
      if (predicate(selected)) count += 1;
      return;
    }
    if (next >= totalObjects || chosen + (totalObjects - next) < committeeSize) return;
    selected[next] = true;
    visit(next + 1, chosen + 1);
    selected[next] = false;
    visit(next + 1, chosen);
  };
  visit(0, 0);
  return count;
}
function selectedInRange(selected: boolean[], start: number, length: number): number {
  let count = 0;
  for (let index = start; index < start + length; index += 1) if (selected[index]) count += 1;
  return count;
}

export function verifyPnc002Cp009SaturationIndependently(parameters: Pnc002AnyParameters): Pnc002IndependentVerification {
  if (!isPnc002Cp009SaturationMode(parameters.solveMode)) {
    throw new Error(`CP-009 saturation verifier received ${parameters.solveMode}`);
  }
  const totalObjects = numberValue(parameters, "totalObjects");
  const committeeSize = numberValue(parameters, "committeeSize");
  const answer = countSubsets(totalObjects, committeeSize, (selected) => {
    if (parameters.solveMode === "countSpecifiedMemberRange") {
      const selectedSpecified = selectedInRange(selected, 0, numberValue(parameters, "specifiedCount"));
      return selectedSpecified >= numberValue(parameters, "minimumSpecified")
        && selectedSpecified <= numberValue(parameters, "maximumSpecified");
    }
    const categoryA = numberValue(parameters, "categoryA");
    const selectedA = selectedInRange(selected, 0, categoryA);
    const selectedB = committeeSize - selectedA;
    return selectedA >= numberValue(parameters, "minimumFromA")
      && selectedA <= numberValue(parameters, "maximumFromA")
      && selectedB >= numberValue(parameters, "minimumFromB");
  });
  return {
    supported: true,
    answer,
    method: "Exhaustive enumeration of fixed-size subsets with inclusive selection-range predicates",
  };
}
