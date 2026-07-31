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

assert.equal(allIds.length, 62, "The current CP-008 executable frontier contains 62 temporary contracts.");
assert.equal(new Set(allIds).size, 62, "Every temporary prototype identity must be unique.");
assert.equal(audit.classifiedCount, 62, "Every prototype must be classified exactly once.");
assert.equal(audit.uniqueClassifiedCount, 62, "Compression classifications must not overlap.");
assert.deepEqual(audit.duplicateClassifications, []);
assert.deepEqual(audit.unclassified, []);
assert.deepEqual(audit.foreignClassifications, []);

assert.equal(MEN_CP_008_SETTLED_MERGE_CANDIDATES.length, 10);
assert.equal(MEN_CP_008_MERGE_REVIEW_GROUPS.length, 2);
assert.equal(MEN_CP_008_STANDALONE_CANDIDATES.length, 36);
assert.equal(audit.provisionalMinimumQlFamilies, 48);
assert.equal(audit.provisionalMaximumQlFamilies, 50);

for (const group of MEN_CP_008_SETTLED_MERGE_CANDIDATES) {
  assert.equal(group.decision, "MERGE_CANDIDATE");
  assert.ok(group.members.length >= 2);
  assert.ok(group.canonicalReasoning.length >= 40);
}
for (const group of MEN_CP_008_MERGE_REVIEW_GROUPS) {
  assert.equal(group.decision, "MERGE_REVIEW_REQUIRED");
  assert.equal(group.members.length, 2);
  assert.ok(group.canonicalReasoning.length >= 40);
}

assert.ok(MEN_CP_008_SOURCE_OWNERSHIP_EXCLUSIONS.length >= 6);
assert.ok(MEN_CP_008_FREEZE_BLOCKERS.length >= 4);
assert.equal(audit.readyToFreeze, false, "The audit must not freeze QLs while merge review and source recheck remain open.");

console.log(
  `MEN-CP-008 chapter compression audit classified ${audit.prototypeCount} temporary contracts exactly once. ` +
  `Current evidence-derived boundary is ${audit.provisionalMinimumQlFamilies}-${audit.provisionalMaximumQlFamilies} candidate QL families; freeze readiness remains false.`,
);
