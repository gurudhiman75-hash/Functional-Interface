import {
  combinationExact,
  createSeededRandom,
  shuffleSeeded,
} from "./math";
import type { Pnc002AnyParameters, Pnc002SolverResult } from "./types";

function choose(n: number, r: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0 || r > n) return 0;
  return combinationExact(n, r);
}
function uniquePositive(values: number[], correct: number): number[] {
  return [...new Set(values.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
}

export function buildPnc002Cp009SaturationOptions(
  parameters: Pnc002AnyParameters,
  solver: Pnc002SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const e = solver.evidence;
  const committeeSize = e.committeeSize ?? 0;
  const unrestricted = choose(e.totalObjects, committeeSize);
  const cases = e.selectionCaseCounts ?? [];
  let distractors = uniquePositive([
    cases[0] ?? 0,
    cases.at(-1) ?? 0,
    unrestricted,
    cases.length,
    cases.reduce((sum, value, index) => index === 0 ? value : sum - value, 0),
  ], correct);

  for (let offset = 1; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }

  const numericOptions = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:cp009-saturation-options`),
  );
  return { options: numericOptions.map(String), correctIndex: numericOptions.indexOf(correct) };
}
