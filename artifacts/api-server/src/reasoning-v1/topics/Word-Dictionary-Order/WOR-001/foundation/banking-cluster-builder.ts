import type { WorDifficulty } from "./types";
import type { WorRng } from "./prng";

const SAFE_LETTERS = [..."BCDEFGHIJKLMNOPQRSTUVWXY"];

function randomLetter(rng: WorRng): string {
  return rng.pick(SAFE_LETTERS);
}

function ensureUnique(tokens: readonly string[]): string[] {
  if (new Set(tokens).size !== tokens.length) throw new Error("Banking cluster builder produced duplicate tokens.");
  return [...tokens];
}

export function buildBankingClusters(difficulty: WorDifficulty, rng: WorRng): string[] {
  if (difficulty === "EASY") {
    const firsts = rng.shuffle(SAFE_LETTERS).slice(0, 5);
    return rng.shuffle(ensureUnique(firsts.map((first) => `${first}${randomLetter(rng)}${randomLetter(rng)}`)));
  }

  if (difficulty === "MEDIUM") {
    const [firstA, firstB, firstC] = rng.shuffle(SAFE_LETTERS).slice(0, 3);
    const secondPool = rng.shuffle(SAFE_LETTERS).slice(0, 5);
    const tokens = [
      `${firstA}${secondPool[0]}${randomLetter(rng)}`,
      `${firstA}${secondPool[1]}${randomLetter(rng)}`,
      `${firstB}${secondPool[2]}${randomLetter(rng)}`,
      `${firstB}${secondPool[3]}${randomLetter(rng)}`,
      `${firstC}${secondPool[4]}${randomLetter(rng)}`,
    ];
    return rng.shuffle(ensureUnique(tokens));
  }

  const first = randomLetter(rng);
  const [secondA, secondB, secondC] = rng.shuffle(SAFE_LETTERS).slice(0, 3);
  const thirds = rng.shuffle(SAFE_LETTERS).slice(0, 5);
  const tokens = [
    `${first}${secondA}${thirds[0]}`,
    `${first}${secondA}${thirds[1]}`,
    `${first}${secondB}${thirds[2]}`,
    `${first}${secondB}${thirds[3]}`,
    `${first}${secondC}${thirds[4]}`,
  ];
  return rng.shuffle(ensureUnique(tokens));
}
