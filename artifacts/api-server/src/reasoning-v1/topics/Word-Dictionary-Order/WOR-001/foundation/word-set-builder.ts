import { worFamiliesForDifficulty } from "../datasets/word-registry";
import type { WorDifficulty } from "./types";
import type { WorRng } from "./prng";

export interface BuiltWorWordSet {
  readonly familyId: string;
  readonly selected: readonly string[];
  readonly reserve: readonly string[];
}

export function difficultyForSeed(seed: number): WorDifficulty {
  const bucket = ((seed % 20) + 20) % 20;
  if (bucket < 7) return "EASY";
  if (bucket < 16) return "MEDIUM";
  return "HARD";
}

export function wordCountForDifficulty(difficulty: WorDifficulty, rng: WorRng, requireOdd = false): number {
  if (requireOdd) return difficulty === "HARD" ? 7 : 5;
  if (difficulty === "EASY") return 4;
  if (difficulty === "MEDIUM") return 5;
  return rng.pick([6, 7]);
}

export function buildWorWordSet(difficulty: WorDifficulty, count: number, rng: WorRng): BuiltWorWordSet {
  const family = rng.pick(worFamiliesForDifficulty(difficulty));
  if (count > family.words.length - 2) throw new Error(`${family.id} cannot provide ${count} words plus distractor reserve.`);
  const shuffled = rng.shuffle(family.words.map((entry) => entry.word));
  return { familyId: family.id, selected: shuffled.slice(0, count), reserve: shuffled.slice(count) };
}
