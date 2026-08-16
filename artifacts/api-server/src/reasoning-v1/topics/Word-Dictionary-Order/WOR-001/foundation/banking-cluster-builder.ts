import { bankingClusterFamiliesForDifficulty } from "../datasets/banking-cluster-registry";
import type { WorDifficulty } from "./types";
import type { WorRng } from "./prng";

export interface BuiltBankingClusterSet {
  readonly familyId: string;
  readonly selected: readonly string[];
}

export function buildBankingClusterSet(difficulty: WorDifficulty, rng: WorRng): BuiltBankingClusterSet {
  const family = rng.pick(bankingClusterFamiliesForDifficulty(difficulty));
  const selected = rng.shuffle(family.clusters).slice(0, 5);
  if (selected.length !== 5 || new Set(selected).size !== 5) throw new Error(`${family.id} could not provide five unique Banking clusters.`);
  return { familyId: family.id, selected };
}

export function buildBankingClusters(difficulty: WorDifficulty, rng: WorRng): string[] {
  return [...buildBankingClusterSet(difficulty, rng).selected];
}
