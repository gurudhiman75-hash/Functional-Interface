import assert from "node:assert/strict";
import { generateLpCp04BatchV3 } from "./lp-cp04-counterfactual-v3.ts";
import { generateLpCp04PermanentBatch, LP_CP04_ENGLISH_FREEZE_V1, LP_CP04_PERMANENT_QL_ALLOCATIONS } from "./lp-cp04-permanent-freeze-v1.ts";
import { LP_001_011_PERMANENT_QL_REGISTRY_V3 } from "./lp-001-011-permanent-ql-registry-v3.ts";

assert.deepEqual(LP_CP04_ENGLISH_FREEZE_V1.permanentQlIds, ["LP-QL-047"]);
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.permanentQlAllocationStatus, "ALLOCATED");
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.englishFreezeStatus, "FROZEN");
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.nextAvailableQlId, "LP-QL-048");
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.runtimeMode, "REVIEW_ONLY");
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.questionBankWritable, false);
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.testEligible, false);
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.publiclyPublishable, false);
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.sourceSaturatedForTargetExams, false);
assert.equal(LP_CP04_ENGLISH_FREEZE_V1.productionEligible, false);
assert.equal(LP_CP04_PERMANENT_QL_ALLOCATIONS[0]?.authorityId, "COUNTERFACTUAL_ADDITIONAL_CONDITION_QUERY");

const seed = "lp-cp04-permanent-freeze-proof";
const candidate = generateLpCp04BatchV3(seed, 12);
const frozen = generateLpCp04PermanentBatch(seed, 12);
assert.equal(frozen.length, candidate.length);

for (let index = 0; index < frozen.length; index += 1) {
  const left: any = candidate[index]!;
  const right: any = frozen[index]!;
  assert.equal(right.counterfactualChild.qlId, "LP-QL-047");
  assert.equal(right.difficultyBand, left.difficultyBand);
  assert.equal(right.counterfactualChild.stem, left.counterfactualChild.stem);
  assert.deepEqual(right.counterfactualChild.options, left.counterfactualChild.options);
  assert.equal(right.counterfactualChild.correctIndex, left.counterfactualChild.correctIndex);
  assert.equal(right.counterfactualChild.answer, left.counterfactualChild.answer);
  assert.deepEqual(right.counterfactualChild.explanation, left.counterfactualChild.explanation);
}

assert.equal(LP_001_011_PERMANENT_QL_REGISTRY_V3.permanentQlIds.at(-1), "LP-QL-047");
assert.equal(LP_001_011_PERMANENT_QL_REGISTRY_V3.nextAvailableQlId, "LP-QL-048");
assert.equal(LP_001_011_PERMANENT_QL_REGISTRY_V3.productionEligible, false);
assert.equal(new Set(LP_001_011_PERMANENT_QL_REGISTRY_V3.permanentQlIds).size, LP_001_011_PERMANENT_QL_REGISTRY_V3.permanentQlIds.length);

console.log(`CP04 permanent freeze V1 passed: LP-QL-047 allocated with ${frozen.length} parity-checked caselets; production gate remains closed.`);
