import { createSeededRandom, factorialExact, shuffleSeeded } from "./math";
import type { Pnc002AnyParameters, Pnc002SolverResult } from "./types";

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc002Cp010Options(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const evidence = solver.evidence;
  let distractors: number[];
  if (parameters.solveMode === "recoverCircularParameter") {
    distractors = uniquePositive([correct - 1, correct + 1, correct + 2, correct - 2], correct);
  } else if (parameters.solveMode === "countCircularSelectionRotationOnly") {
    const selectedObjects = evidence.selectedObjectCount ?? 0;
    const selectionCount = evidence.selectionCount ?? 0;
    const selectedCircularOrders = evidence.selectedCircularArrangementCount ?? 0;
    const linearSelectionAndArrangement = correct * selectedObjects;
    const reflectionEquivalentCount = Math.floor(correct / 2);
    distractors = uniquePositive([
      linearSelectionAndArrangement,
      selectionCount,
      reflectionEquivalentCount,
      selectedCircularOrders,
    ], correct);
  } else if (parameters.solveMode === "countCircularSelectionDihedral") {
    const selectedObjects = evidence.selectedObjectCount ?? 0;
    const selectionCount = evidence.selectionCount ?? 0;
    const rotationOnlyCount = correct * 2;
    const linearSelectionAndArrangement = rotationOnlyCount * selectedObjects;
    const linearWithReflectionOnly = Math.floor(linearSelectionAndArrangement / 2);
    distractors = uniquePositive([
      rotationOnlyCount,
      linearSelectionAndArrangement,
      linearWithReflectionOnly,
      selectionCount,
    ], correct);
  } else if (parameters.solveMode === "countCircularDistinctNeighborSets") {
    const n = evidence.totalObjects;
    const unrestrictedCircular = factorialExact(n - 1);
    const linearCount = factorialExact(n);
    distractors = uniquePositive([
      unrestrictedCircular,
      Math.floor(linearCount / 2),
      linearCount,
    ], correct);
  } else {
    const n = evidence.totalObjects;
    const unrestrictedCircular = n >= 2 ? factorialExact(n - 1) : 1;
    const linearCount = factorialExact(n);
    distractors = uniquePositive([
      unrestrictedCircular,
      linearCount,
      Math.floor(unrestrictedCircular / 2),
      correct * 2,
      Math.floor(correct / 2),
      correct + factorialExact(Math.max(1, n - 3)),
      correct - factorialExact(Math.max(1, n - 3)),
    ], correct);
  }
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const numericOptions = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp010-options`),
  );
  return { options: numericOptions.map(String), correctIndex: numericOptions.indexOf(correct) };
}
