import assert from "node:assert/strict";
import { inequalityMotifs } from "../motifs/inequality.ts";
import { createGenerationContext, runWithGenerationContext } from "../shared/index.ts";
import { createInequalityScenario } from "./inequality.ts";
import { resolveInequalityRelation } from "./inequality-foundation.ts";

const motifIds = [
  "direct_inequality_reading",
  "single_chain_deduction",
  "compound_inequality_linking",
  "indirect_conclusion_validation",
  "uncertain_branch_comparison",
  "nested_symbolic_reasoning",
] as const;
const difficulties = ["Easy", "Medium", "Hard"] as const;
let audited = 0;
const relationCounts = new Map<string, number>();

for (const motifId of motifIds) {
  const motif = inequalityMotifs.find((entry) => entry.id === motifId);
  assert(motif, `Missing inequality motif ${motifId}`);
  for (const difficulty of difficulties) {
    for (let seed = 0; seed < 100; seed += 1) {
      const scenario = runWithGenerationContext(
        createGenerationContext(`INEQUALITY-FOUNDATION-PARITY:${motifId}:${difficulty}:${seed}`),
        () => createInequalityScenario(motif, difficulty),
      );
      assert(scenario.facts.length > 0, `${motifId} unexpectedly produced no ordinary inequality facts`);
      const resolved = resolveInequalityRelation(
        scenario.symbols,
        scenario.facts,
        scenario.queryLeft,
        scenario.queryRight,
      );
      assert.equal(resolved, scenario.correctRelation, `${motifId}/${difficulty}/${seed} diverged from existing inequality engine`);
      relationCounts.set(resolved, (relationCounts.get(resolved) ?? 0) + 1);
      audited += 1;
    }
  }
}

assert.equal(audited, 1800);
for (const relation of [">", "<", "=", "unknown"]) {
  assert((relationCounts.get(relation) ?? 0) > 0, `Parity corpus must exercise relation ${relation}`);
}

console.log(JSON.stringify({
  status: "PASS_INEQUALITY_FOUNDATION_PARITY",
  auditedScenarios: audited,
  motifIds,
  relationCounts: Object.fromEntries(relationCounts),
}, null, 2));
