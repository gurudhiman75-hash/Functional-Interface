import assert from "node:assert/strict";
import {
  auditMenCp008CompressionReadiness,
  getMenCp008AllPrototypeIds,
  MEN_CP_008_FREEZE_BLOCKERS,
  MEN_CP_008_MERGE_REVIEW_GROUPS,
  MEN_CP_008_SETTLED_MERGE_CANDIDATES,
  MEN_CP_008_SOURCE_OWNERSHIP_EXCLUSIONS,
  MEN_CP_008_STANDALONE_CANDIDATES,
} from "./compression";

const audit = auditMenCp008CompressionReadiness();
const allIds = getMenCp008AllPrototypeIds();

assert.equal(allIds.length, 66, "The source-closed CP-008 executable frontier contains 66 temporary contracts.");
assert.equal(new Set(allIds).size, 66, "Every temporary prototype identity must be unique.");
assert.equal(audit.classifiedCount, 66, "Every prototype must be classified exactly once.");
assert.equal(audit.uniqueClassifiedCount, 66, "Compression classifications must not overlap.");
assert.deepEqual(audit.duplicateClassifications, []);
assert.deepEqual(audit.unclassified, []);
assert.deepEqual(audit.foreignClassifications, []);

assert.equal(MEN_CP_008_SETTLED_MERGE_CANDIDATES.length, 12);
assert.equal(MEN_CP_008_MERGE_REVIEW_GROUPS.length, 0);
assert.equal(MEN_CP_008_STANDALONE_CANDIDATES.length, 40);
assert.equal(audit.provisionalMinimumQlFamilies, 52);
assert.equal(audit.provisionalMaximumQlFamilies, 52);

for (const group of MEN_CP_008_SETTLED_MERGE_CANDIDATES) {
  assert.equal(group.decision, "MERGE_CANDIDATE");
  assert.ok(group.members.length >= 2);
  assert.ok(group.canonicalReasoning.length >= 40);
}

assert.ok(MEN_CP_008_SOURCE_OWNERSHIP_EXCLUSIONS.length >= 6);
assert.equal(MEN_CP_008_FREEZE_BLOCKERS.length, 0);
assert.equal(audit.readyToFreeze, true, "The final source recheck and ancestry classification must make CP-008 ready to freeze.");

console.log(
  `MEN-CP-008 source-closed compression audit classified ${audit.prototypeCount} temporary contracts exactly once into ${audit.provisionalMinimumQlFamilies} evidence-derived QL families. Freeze readiness is true.`,
);
