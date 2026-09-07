import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2 } from "../foundation/spatial/spatial-family-final-closure-audit-v2";

const audit = SPATIAL_FAMILY_FINAL_CLOSURE_AUDIT_V2;

assert.equal(audit.authorityId, "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V2");
assert.equal(audit.supersedesAuthorityId, "SPA-FND-001-FAMILY-FINAL-CLOSURE-AUDIT-V1");
assert.equal(audit.currentCorpus.permanentQlCount, 63);
assert.equal(audit.currentCorpus.permanentQlRange, "SPA-QL-001..SPA-QL-063");
assert.equal(audit.currentCorpus.nextAvailablePermanentQlId, "SPA-QL-064");
assert.equal(audit.currentCorpus.mainQuestionStudioQlCount, 58);
assert.equal(audit.currentCorpus.cndSeparateQlCount, 5);
assert.equal(audit.currentCorpus.combinedImplementedQlCount, 63);
assert.equal(audit.currentCorpus.expectedMainPlusCndSplit, "58_PLUS_5");
assert.equal(audit.blockingMissingChapters.length, 0);
assert.deepEqual(audit.resolvedFormerBlockers.map((entry) => entry.chapterCode), ["FFM-001", "DOT-001", "FMT-001", "IDF-001"]);
assert.deepEqual(audit.resolvedFormerBlockers.map((entry) => entry.permanentQlIds.length), [3, 1, 6, 3]);
assert.ok(audit.resolvedFormerBlockers.every((entry) => entry.questionStudioDiscoverable));
assert.ok(audit.resolvedFormerBlockers.every((entry) => entry.testBuilderEligible));
assert.equal(audit.closureInvariants.allPermanentQlIdsAllocatedWithoutGap, true);
assert.equal(audit.closureInvariants.mainPackageAndCndRemainSeparate, true);
assert.equal(audit.closureInvariants.allApprovedSecondaryChaptersDiscoverable, true);
assert.equal(audit.closureInvariants.allApprovedSecondaryChaptersTestBuilderEligible, true);
assert.equal(audit.closureInvariants.manualApprovalStillRequired, true);
assert.equal(audit.closureInvariants.mockTestReleaseStillClosed, true);
assert.equal(audit.closureInvariants.publicReleaseStillClosed, true);
assert.equal(audit.closureInvariants.studentDeliveryStillClosed, true);
assert.equal(audit.closureInvariants.automaticStudentPublicationStillClosed, true);
assert.equal(audit.lifecycle.sourceSaturationCompleteForWholeFamily, true);
assert.equal(audit.lifecycle.chapterInventoryComplete, true);
assert.equal(audit.lifecycle.familyExhaustivenessEstablished, true);
assert.equal(audit.lifecycle.finalUnified63QlSoakRequired, true);
assert.equal(audit.lifecycle.finalUnified63QlSoakPassed, false);
assert.equal(audit.lifecycle.familyFreezeAuthorized, false);
assert.equal(audit.lifecycle.mockTestReleaseAuthorizedByThisAudit, false);
assert.equal(audit.lifecycle.publicReleaseAuthorizedByThisAudit, false);
assert.equal(audit.lifecycle.studentDeliveryAuthorizedByThisAudit, false);
assert.equal(audit.lifecycle.automaticStudentPublicationAuthorizedByThisAudit, false);
assert.equal(audit.verdict, "CHAPTER_INVENTORY_COMPLETE_63_QL_UNION_READY_FOR_FINAL_UNIFIED_SOAK");
assert.equal(audit.nextGate, "SPA_63_QL_FINAL_UNIFIED_CLOSURE_SOAK_V1");

const evidence = {
  authorityId: audit.authorityId,
  reviewedNewMainHead: audit.reviewedNewMainHead,
  allocatedPermanentQls: audit.currentCorpus.permanentQlCount,
  mainQuestionStudioQls: audit.currentCorpus.mainQuestionStudioQlCount,
  cndSeparateQls: audit.currentCorpus.cndSeparateQlCount,
  combinedImplementedQls: audit.currentCorpus.combinedImplementedQlCount,
  resolvedFormerBlockers: audit.resolvedFormerBlockers.map((entry) => ({
    chapterCode: entry.chapterCode,
    permanentQlIds: entry.permanentQlIds,
    activationAuthorityId: entry.activationAuthorityId,
  })),
  blockingMissingChapters: audit.blockingMissingChapters.length,
  chapterInventoryComplete: audit.lifecycle.chapterInventoryComplete,
  familyExhaustivenessEstablished: audit.lifecycle.familyExhaustivenessEstablished,
  finalUnified63QlSoakRequired: audit.lifecycle.finalUnified63QlSoakRequired,
  familyFreezeAuthorized: audit.lifecycle.familyFreezeAuthorized,
  releaseGatesRemainClosed: true,
  verdict: audit.verdict,
  nextGate: audit.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-family-final-closure-audit-v2-evidence.json",
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
