import { strict as assert } from "node:assert";
import { buildBlr001EnglishGapAudit } from "./blr-001-english-gap-audit";

const result = buildBlr001EnglishGapAudit();

assert.equal(result.permanentQlCount, 35, "BLR-001 permanent QL count");
assert.equal(result.solveAuthorityCount, 35, "BLR-001 solve-authority count");
assert.equal(result.plannedCheckpointCount, 7, "BLR-001 planned checkpoint count");
assert.equal(result.permanentQlRange, "BLR-QL-001..BLR-QL-035");
assert.equal(result.nextAvailableQlId, "BLR-QL-036");
assert.equal(result.openIncludedScopeFamilies, 0, "included source families left open");
assert.equal(result.exactCrossQlSurfaceCollisions, 0, "exact cross-QL learner surface collisions");
assert.equal(result.learnerTextFailures, 0, "learner-text failures");
assert.equal(result.genderEvidenceFailures, 0, "gender-evidence failures");
assert.equal(result.optionContractFailures, 0, "option-contract failures");
assert.equal(result.lifecycleLockFailures, 0, "lifecycle-lock failures");
assert.equal(result.ownershipFailures, 0, "ownership failures");
assert.equal(result.failures.length, 0, result.failures.slice(0, 30).join("\n"));
assert.equal(result.verdict, "CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE");

for (let index = 1; index <= 35; index += 1) {
  const qlId = `BLR-QL-${String(index).padStart(3, "0")}`;
  assert.ok((result.qlQuestionCounts[qlId] ?? 0) > 0, `${qlId} must have audited questions`);
}

console.log(JSON.stringify({
  auditVersion: result.auditVersion,
  permanentQlRange: result.permanentQlRange,
  nextAvailableQlId: result.nextAvailableQlId,
  plannedCheckpointCount: result.plannedCheckpointCount,
  permanentQlCount: result.permanentQlCount,
  solveAuthorityCount: result.solveAuthorityCount,
  auditedQuestionCount: result.auditedQuestionCount,
  checkpointQuestionCounts: result.checkpointQuestionCounts,
  exactCrossQlSurfaceCollisions: result.exactCrossQlSurfaceCollisions,
  normalizedCrossQlTemplateCollisions: result.normalizedCrossQlTemplateCollisions,
  learnerTextFailures: result.learnerTextFailures,
  genderEvidenceFailures: result.genderEvidenceFailures,
  optionContractFailures: result.optionContractFailures,
  lifecycleLockFailures: result.lifecycleLockFailures,
  ownershipFailures: result.ownershipFailures,
  openIncludedScopeFamilies: result.openIncludedScopeFamilies,
  verdict: result.verdict,
}, null, 2));
