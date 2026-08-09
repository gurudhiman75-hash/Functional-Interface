import assert from "node:assert/strict";
import {
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY,
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH,
  MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS,
  auditMenCp011DirectSourceHumanReviewBatch,
  canPromoteMenCp011DirectSourceCandidate,
  hasCompleteMenCp011HumanSourceReview,
  type MenCp011DirectSourceHumanReviewRecord,
} from "./direct-source-human-review-batch";
import { MEN_CP011_SOURCE_READINESS_ENTRIES_V4 } from "./source-normalisation-readiness-v4";

const EXPECTED_DIRECT_CANDIDATE_IDS = [
  "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
].sort();

const audit = auditMenCp011DirectSourceHumanReviewBatch();

assert.equal(
  audit.authority,
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY,
);
assert.equal(
  audit.inheritedSourceAuthority,
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4",
);
assert.equal(audit.livePrototypeCount, 28);
assert.equal(audit.attachedReferenceCount, 17);
assert.equal(audit.directTaskCandidateCount, 8);
assert.equal(audit.representationOnlySupportCount, 9);
assert.equal(audit.missingDirectReferenceCount, 11);
assert.equal(audit.reviewBatchRecordCount, 8);
assert.equal(audit.uniqueReviewBatchRecordCount, 8);
assert.equal(audit.pendingReviewCount, 8);
assert.equal(audit.approvedReviewCount, 0);
assert.equal(audit.promotionReadyCount, 0);
assert.equal(audit.representationOnlyLeakCount, 0);
assert.deepEqual(audit.representationOnlyLeakIds, []);
assert.equal(audit.directlyNormalisedCount, 0);
assert.equal(audit.allDirectCandidatesIncluded, true);
assert.equal(audit.humanReviewComplete, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.publicationEligible, false);

assert.equal(MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS.length, 6);
assert.equal(
  new Set(MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS).size,
  MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS.length,
);

assert.deepEqual(
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH.map(
    (record) => record.prototypeId,
  ).sort(),
  EXPECTED_DIRECT_CANDIDATE_IDS,
);

const v4DirectCandidateIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
  (entry) =>
    entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW" &&
    entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
).map((entry) => entry.prototypeId);
assert.deepEqual(v4DirectCandidateIds.sort(), EXPECTED_DIRECT_CANDIDATE_IDS);

const representationOnlyIdSet = new Set(
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
    (entry) =>
      entry.evidence.sourceMatchClassification ===
      "REPRESENTATION_ONLY_SUPPORT",
  ).map((entry) => entry.prototypeId),
);

for (const record of MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH) {
  assert.equal(record.authority, MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY);
  assert.equal(
    record.sourceEvidence.sourceMatchClassification,
    "DIRECT_TASK_MATCH",
  );
  assert.equal(record.reviewDecision, "PENDING");
  assert.equal(record.reviewer, null);
  assert.equal(record.reviewedAt, null);
  assert.equal(record.reviewNotes, null);
  assert.equal(record.permanentQlAllocationBlocked, true);
  assert.equal(record.publicationBlocked, true);
  assert.equal(representationOnlyIdSet.has(record.prototypeId), false);
  assert.match(record.sourceEvidence.documentId ?? "", /FILE_LIBRARY:/);
  assert.match(record.sourceEvidence.pageLocator ?? "", /printed p\./);
  assert.ok(record.sourceEvidence.exemplarLocator?.trim());
  assert.ok(record.sourceEvidence.sourceContentHash?.trim());
  assert.ok(record.sourceEvidence.sourceMatchRationale?.trim());
  assert.equal(hasCompleteMenCp011HumanSourceReview(record), false);
  assert.equal(canPromoteMenCp011DirectSourceCandidate(record), false);

  for (const checkId of MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS) {
    assert.equal(record.checkResults[checkId], null);
  }
}

const baseRecord = MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH[0]!;
const allChecksPassed = Object.fromEntries(
  MEN_CP011_DIRECT_SOURCE_REVIEW_CHECK_IDS.map((checkId) => [checkId, true]),
) as MenCp011DirectSourceHumanReviewRecord["checkResults"];

const approvedRecord: MenCp011DirectSourceHumanReviewRecord = {
  ...baseRecord,
  reviewDecision: "APPROVED",
  checkResults: allChecksPassed,
  reviewer: "human-source-reviewer",
  reviewedAt: "2026-08-09T09:00:00Z",
  reviewNotes:
    "Verified the recorded source locator, target, operation, contract, ownership and exam representation.",
};
assert.equal(hasCompleteMenCp011HumanSourceReview(approvedRecord), true);
assert.equal(canPromoteMenCp011DirectSourceCandidate(approvedRecord), true);

const failedTargetRecord: MenCp011DirectSourceHumanReviewRecord = {
  ...approvedRecord,
  checkResults: {
    ...allChecksPassed,
    EXEMPLAR_TARGET_MATCHES: false,
  },
};
assert.equal(hasCompleteMenCp011HumanSourceReview(failedTargetRecord), false);
assert.equal(canPromoteMenCp011DirectSourceCandidate(failedTargetRecord), false);

const noReviewerRecord: MenCp011DirectSourceHumanReviewRecord = {
  ...approvedRecord,
  reviewer: null,
};
assert.equal(hasCompleteMenCp011HumanSourceReview(noReviewerRecord), false);
assert.equal(canPromoteMenCp011DirectSourceCandidate(noReviewerRecord), false);

const representationOnlyEvidence =
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4.find(
    (entry) =>
      entry.evidence.sourceMatchClassification ===
      "REPRESENTATION_ONLY_SUPPORT",
  )?.evidence;
assert.ok(representationOnlyEvidence);
const illegallyRelabelledRecord: MenCp011DirectSourceHumanReviewRecord = {
  ...approvedRecord,
  sourceEvidence: representationOnlyEvidence,
};
assert.equal(
  hasCompleteMenCp011HumanSourceReview(illegallyRelabelledRecord),
  true,
);
assert.equal(
  canPromoteMenCp011DirectSourceCandidate(illegallyRelabelledRecord),
  false,
);

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      reviewBatchRecordCount: audit.reviewBatchRecordCount,
      pendingReviewCount: audit.pendingReviewCount,
      approvedReviewCount: audit.approvedReviewCount,
      promotionReadyCount: audit.promotionReadyCount,
      representationOnlyLeakCount: audit.representationOnlyLeakCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      humanReviewComplete: audit.humanReviewComplete,
      permanentQlAllocationAllowed: audit.permanentQlAllocationAllowed,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
