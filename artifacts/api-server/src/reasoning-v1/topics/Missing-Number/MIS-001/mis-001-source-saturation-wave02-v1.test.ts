import assert from "node:assert/strict";

import { MIS_001_QUESTION_STUDIO_PACKAGE } from "./question-studio-integration";
import {
  MIS_001_SOURCE_DECISIONS_V1,
  MIS_001_SOURCE_EVIDENCE_V1,
  MIS_001_WAVE02_SOURCE_AUDIT_V1 as audit,
} from "./mis-001-source-saturation-wave02-v1";

assert.equal(audit.status, "SOURCE_AUDIT_COMPLETE__TWO_SOURCE_THIN_HOLDS__MERGE_SPLIT_PENDING");
assert.equal(MIS_001_SOURCE_DECISIONS_V1.length, 83);
assert.equal(new Set(MIS_001_SOURCE_DECISIONS_V1.map((x) => x.candidateId)).size, 83);

const expected = Array.from(
  { length: 83 },
  (_, index) => `MIS-CAND-${String(index + 1).padStart(3, "0")}`,
);
assert.deepEqual(MIS_001_SOURCE_DECISIONS_V1.map((x) => x.candidateId), expected);

const direct = MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "DIRECT_PYQ");
const corroborated = MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "FAMILY_CORROBORATED");
const reuse = MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "REUSE_ONLY");
const holds = MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "SOURCE_THIN_HOLD");
const excluded = MIS_001_SOURCE_DECISIONS_V1.filter((x) => x.support === "EXCLUDED_INVALID");

assert.equal(direct.length, audit.directPyqCount);
assert.equal(corroborated.length, audit.familyCorroboratedCount);
assert.equal(reuse.length, audit.reuseOnlyCount);
assert.equal(holds.length, audit.sourceThinHoldCount);
assert.equal(excluded.length, audit.excludedInvalidCount);
assert.equal(direct.length + corroborated.length + reuse.length + holds.length + excluded.length, 83);

assert.equal(reuse.length, 13);
assert.deepEqual(holds.map((x) => x.candidateId), ["MIS-CAND-034", "MIS-CAND-072"]);
assert.deepEqual(excluded.map((x) => x.candidateId), ["MIS-CAND-078"]);
assert.ok(MIS_001_SOURCE_EVIDENCE_V1.length >= 12);
assert.equal(new Set(MIS_001_SOURCE_EVIDENCE_V1.map((x) => x.sourceId)).size, MIS_001_SOURCE_EVIDENCE_V1.length);

for (const item of direct) {
  assert.equal(item.decision, "RETAIN_FOR_MERGE_SPLIT");
}
for (const item of corroborated) {
  assert.equal(item.decision, "RETAIN_FOR_MERGE_SPLIT");
}
for (const item of reuse) {
  assert.equal(item.decision, "REUSE_EXISTING_AUTHORITY");
}
for (const item of holds) {
  assert.equal(item.decision, "HOLD_NO_PERMANENT_QL");
}
for (const item of excluded) {
  assert.equal(item.decision, "EXCLUDE_RUNTIME");
}

const metadata = MIS_001_QUESTION_STUDIO_PACKAGE.metadata as Record<string, unknown>;
assert.equal(metadata.permanentQlAllocation, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.ownershipBoundary.numberSeriesBelongsHere, false);
assert.equal(audit.ownershipBoundary.formulaChangeAloneCreatesQl, false);
assert.equal(audit.ownershipBoundary.rendererChangeAloneCreatesQl, false);
assert.equal(audit.ownershipBoundary.inverseMissingPositionAloneCreatesQl, false);
assert.equal(audit.ownershipBoundary.evidenceCountAloneCreatesQl, false);
assert.equal(audit.activeRuntimePatternCount, 82);
assert.equal(audit.activeSemanticAuthorityCount, 69);
assert.equal(audit.nextWave, "FORMULA_TO_LEARNER_SKILL_MERGE_SPLIT");

console.log(JSON.stringify({
  verdict: "PASS_MIS_001_SOURCE_SATURATION_WAVE02",
  directPyq: direct.length,
  familyCorroborated: corroborated.length,
  reuseOnly: reuse.length,
  sourceThinHolds: holds.map((x) => x.candidateId),
  excludedInvalid: excluded.map((x) => x.candidateId),
  permanentQlAllocationAllowed: audit.permanentQlAllocationAllowed,
  nextWave: audit.nextWave,
}, null, 2));
