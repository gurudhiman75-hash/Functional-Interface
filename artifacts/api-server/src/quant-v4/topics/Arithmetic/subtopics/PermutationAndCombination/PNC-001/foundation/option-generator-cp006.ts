import { combinationExact, createSeededRandom, factorialExact, permutationExact, powerExact, shuffleSeeded } from "./math";
import type { Pnc001Cp006SolveMode, Pnc001Parameters, Pnc001SolverResult } from "./types";

function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc001Cp006Options(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const evidence = solver.evidence;
  const mode = parameters.solveMode as unknown as Pnc001Cp006SolveMode;
  const n = evidence.mixedTotalObjects ?? parameters.values.totalObjects ?? 0;
  const s = evidence.mixedSelectedObjects ?? parameters.values.selectedObjects ?? 0;
  const k = evidence.mixedRoleCount ?? parameters.values.roleCount ?? 0;
  let candidates: number[];

  if (mode === "selectThenAssignDistinctRoles") {
    const selection = evidence.mixedSelectionCount ?? combinationExact(n, s);
    const roles = evidence.mixedRoleAssignmentCount ?? permutationExact(s, k);
    candidates = [selection, roles, selection + roles, permutationExact(n, k)];
  } else if (mode === "selectThenArrangeAllSelected") {
    const selection = evidence.mixedSelectionCount ?? combinationExact(n, s);
    candidates = [selection, factorialExact(s), selection * s, permutationExact(n, Math.max(1, s - 1))];
  } else if (mode === "findRoleAssignmentMultiplier") {
    candidates = [combinationExact(s, k), powerExact(s, k), factorialExact(k), permutationExact(s, Math.max(0, k - 1))];
  } else {
    const minimum = evidence.mixedSearchMinimum ?? 1;
    const maximum = evidence.mixedSearchMaximum ?? correct + 2;
    candidates = [Math.max(1, correct - 1), correct + 1, minimum, maximum];
    if (evidence.recoveredMixedParameter === "n") candidates.push(s, k);
    if (evidence.recoveredMixedParameter === "selected") candidates.push(n, k);
    if (evidence.recoveredMixedParameter === "roles") candidates.push(n, s);
  }

  const distractors = uniquePositive(candidates, correct);
  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct + offset, correct - offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const shuffled = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:options`),
  );
  return { options: shuffled.map(String), correctIndex: shuffled.indexOf(correct) };
}
