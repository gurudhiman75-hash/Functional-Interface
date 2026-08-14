import assert from "node:assert/strict";
import { WOR_BANKING_CLUSTER_FAMILIES } from "./datasets/banking-cluster-registry";
import { buildBankingClusterSet } from "./foundation/banking-cluster-builder";
import { createWorRng } from "./foundation/prng";
import type { WorDifficulty } from "./foundation/types";

const allClusters = WOR_BANKING_CLUSTER_FAMILIES.flatMap((family) => family.clusters);
assert.equal(WOR_BANKING_CLUSTER_FAMILIES.length, 60);
assert.equal(allClusters.length, 720);
assert.equal(new Set(allClusters).size, 720);
assert.ok(allClusters.every((token) => /^[B-Y]{3}$/.test(token)), "Every cluster must be three-letter and shift-safe.");
assert.ok(WOR_BANKING_CLUSTER_FAMILIES.every((family) => family.clusters.length === 12));

const tierCounts = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((tier) => [tier, WOR_BANKING_CLUSTER_FAMILIES.filter((family) => family.tier === tier).length]));
assert.deepEqual(tierCounts, { EASY: 20, MEDIUM: 20, HARD: 20 });

const diversity: Record<string, number> = {};
for (const difficulty of ["EASY", "MEDIUM", "HARD"] as const satisfies readonly WorDifficulty[]) {
  const expected = new Set(WOR_BANKING_CLUSTER_FAMILIES.filter((family) => family.tier === difficulty).map((family) => family.id));
  const observed = new Set<string>();
  const visibleSets = new Set<string>();
  for (let seed = 0; seed < 1000; seed += 1) {
    const built = buildBankingClusterSet(difficulty, createWorRng(70000 + seed, `POOL-${difficulty}`));
    observed.add(built.familyId);
    visibleSets.add([...built.selected].sort().join("|"));
    const firstLetters = built.selected.map((token) => token[0]!);
    if (difficulty === "EASY") assert.equal(new Set(firstLetters).size, 5, "Easy Banking sets should be first-letter separable.");
    if (difficulty === "MEDIUM") assert.ok(new Set(firstLetters).size < 5, "Medium Banking sets must contain a first-letter tie.");
    if (difficulty === "HARD") assert.equal(new Set(firstLetters).size, 1, "Hard Banking sets must share the first letter.");
  }
  assert.deepEqual([...observed].sort(), [...expected].sort(), `${difficulty} Banking family reachability is incomplete.`);
  assert.ok(visibleSets.size >= 950, `${difficulty} Banking visible-set uniqueness is below 95%: ${visibleSets.size}`);
  diversity[difficulty] = visibleSets.size;
}

console.log("WOR-001 pool expansion audit passed.", {
  realWordTarget: "60 families / 720 words",
  bankingFamilies: WOR_BANKING_CLUSTER_FAMILIES.length,
  bankingClusters: allClusters.length,
  tierCounts,
  diversity,
});
