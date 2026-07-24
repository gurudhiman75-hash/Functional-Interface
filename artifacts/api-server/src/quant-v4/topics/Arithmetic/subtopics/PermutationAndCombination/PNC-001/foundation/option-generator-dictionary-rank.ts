import { createSeededRandom, multisetPermutationExact, shuffleSeeded } from "./math";
import type { Pnc001Parameters, Pnc001SolverResult } from "./types";

function multiplicities(word: string): number[] {
  const counts = new Map<string, number>();
  for (const letter of word) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  return [...counts.values()];
}

export function buildPnc001DictionaryRankOptions(
  parameters: Pnc001Parameters,
  solver: Pnc001SolverResult,
): { options: string[]; correctIndex: number } {
  const correct = solver.numericAnswer;
  const evidence = solver.evidence;
  const sourceWord = evidence.dictionarySourceWord ?? "";
  const precedingCount = evidence.dictionaryPrecedingCount ?? Math.max(1, correct - 1);
  const allArrangements = multisetPermutationExact(sourceWord.length, multiplicities(sourceWord));
  const candidates = [precedingCount, correct + 1, allArrangements];
  const distractors = [...new Set(candidates.filter((value) => Number.isInteger(value) && value > 0 && value !== correct))];
  for (let offset = 2; distractors.length < 3; offset += 1) {
    for (const candidate of [correct - offset, correct + offset]) {
      if (candidate > 0 && candidate !== correct && !distractors.includes(candidate)) distractors.push(candidate);
      if (distractors.length >= 3) break;
    }
  }
  const options = shuffleSeeded(
    [correct, ...distractors.slice(0, 3)],
    createSeededRandom(`${parameters.seed}:${parameters.questionLanguageId}:dictionary-rank-options`),
  );
  return { options: options.map(String), correctIndex: options.indexOf(correct) };
}