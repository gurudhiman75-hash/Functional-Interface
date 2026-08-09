import assert from "node:assert/strict";
import {
  hasCompleteDirectSourceEvidence,
} from "./source-normalisation-readiness";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
  auditMenCp011SourceReadinessV4,
} from "./source-normalisation-readiness-v4";
import {
  MEN_CP011_AI_PRE_REVIEW_AUTHORITY,
  MEN_CP011_AI_PRE_REVIEW_DECISIONS,
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2,
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2,
  MEN_CP011_SOURCE_READINESS_AUTHORITY_V5,
  MEN_CP011_SOURCE_READINESS_ENTRIES_V5,
  auditMenCp011SourceReadinessV5,
  getMenCp011V4DirectCandidateIds,
} from "./source-normalisation-readiness-v5";

const RETAINED_DIRECT_IDS = [
  "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
].sort();

const DOWNGRADED_IDS = [
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
].sort();

const v4Audit = auditMenCp011SourceReadinessV4();
const audit = auditMenCp011SourceReadinessV5();

assert.equal(v4Audit.attachedReferenceCount, 17);
assert.equal(v4Audit.directTaskMatchPendingReviewCount, 8);
assert.equal(v4Audit.representationOnlySupportCount, 9);
assert.equal(v4Audit.missingDirectReferenceCount, 11);

assert.equal(audit.authority, MEN_CP011_SOURCE_READINESS_AUTHORITY_V5);
assert.equal(
  audit.inheritedAuthority,
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V4",
);
assert.equal(audit.aiPreReviewAuthority, MEN_CP011_AI_PRE_REVIEW_AUTHORITY);
assert.equal(
  audit.humanReviewBatchAuthority,
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2,
);
assert.equal(audit.livePrototypeCount, 28);
assert.equal(audit.ledgerPrototypeCount, 28);
assert.equal(audit.uniqueLivePrototypeCount, 28);
assert.equal(audit.uniqueLedgerPrototypeCount, 28);
assert.equal(audit.liveAndLedgerSetsMatch, true);
assert.equal(audit.canonicalOwnerConfirmedCount, 28);
assert.equal(audit.executableFormulaAuthorityCount, 28);
assert.equal(audit.attachedReferenceCount, 17);
assert.equal(audit.directTaskMatchPendingReviewCount, 4);
assert.equal(audit.representationOnlySupportCount, 13);
assert.equal(audit.missingDirectReferenceCount, 11);
assert.equal(audit.directlyNormalisedCount, 0);
assert.equal(audit.incompleteAttachedReferenceCount, 0);
assert.equal(audit.falselyNormalisedCount, 0);
assert.equal(audit.aiPreReviewDecisionCount, 8);
assert.equal(audit.aiRetainDirectCount, 4);
assert.equal(audit.aiDowngradeCount, 4);
assert.equal(audit.revisedHumanReviewQueueCount, 4);
assert.equal(audit.pendingHumanReviewCount, 4);
assert.equal(audit.approvedHumanReviewCount, 0);
assert.equal(audit.promotionReadyCount, 0);
assert.equal(audit.neighbourBoundaryCount, 6);
assert.equal(audit.sourceNormalisationComplete, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.publicationEligible, false);

assert.equal(MEN_CP011_AI_PRE_REVIEW_DECISIONS.length, 8);
assert.equal(
  new Set(MEN_CP011_AI_PRE_REVIEW_DECISIONS.map((decision) => decision.prototypeId)).size,
  8,
);
assert.deepEqual(
  MEN_CP011_AI_PRE_REVIEW_DECISIONS.map((decision) =>
    decision.prototypeId,
  ).sort(),
  getMenCp011V4DirectCandidateIds().sort(),
);
assert.equal(
  MEN_CP011_AI_PRE_REVIEW_DECISIONS.every(
    (decision) => decision.humanApprovalRecorded === false,
  ),
  true,
);

const retainedDecisionIds = MEN_CP011_AI_PRE_REVIEW_DECISIONS.filter(
  (decision) =>
    decision.recommendation === "RETAIN_DIRECT_PENDING_HUMAN_REVIEW",
).map((decision) => decision.prototypeId).sort();
const downgradedDecisionIds = MEN_CP011_AI_PRE_REVIEW_DECISIONS.filter(
  (decision) =>
    decision.recommendation === "DOWNGRADE_TO_REPRESENTATION_ONLY",
).map((decision) => decision.prototypeId).sort();
assert.deepEqual(retainedDecisionIds, RETAINED_DIRECT_IDS);
assert.deepEqual(downgradedDecisionIds, DOWNGRADED_IDS);

const v5DirectIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.filter(
  (entry) =>
    entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
).map((entry) => entry.prototypeId).sort();
assert.deepEqual(v5DirectIds, RETAINED_DIRECT_IDS);

for (const prototypeId of DOWNGRADED_IDS) {
  const v4Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  const v5Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V5.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  const decision = MEN_CP011_AI_PRE_REVIEW_DECISIONS.find(
    (item) => item.prototypeId === prototypeId,
  );

  assert.ok(v4Entry);
  assert.ok(v5Entry);
  assert.ok(decision);
  assert.equal(
    v4Entry.evidence.sourceMatchClassification,
    "DIRECT_TASK_MATCH",
  );
  assert.equal(
    v5Entry.evidence.sourceMatchClassification,
    "REPRESENTATION_ONLY_SUPPORT",
  );
  assert.equal(
    v5Entry.sourceNormalisationStatus,
    "REFERENCE_ATTACHED_PENDING_REVIEW",
  );
  assert.ok(v5Entry.evidence.sourceMatchRationale?.trim());
  assert.ok(decision.failedCheckIds.length >= 1);
  assert.equal(hasCompleteDirectSourceEvidence(v5Entry.evidence), false);

  const attemptedReviewedEvidence = {
    ...v5Entry.evidence,
    reviewer: "human-source-reviewer",
    reviewedAt: "2026-08-09T12:00:00Z",
  };
  assert.equal(
    hasCompleteDirectSourceEvidence(attemptedReviewedEvidence),
    false,
  );
}

const joinedCubesDecision = MEN_CP011_AI_PRE_REVIEW_DECISIONS.find(
  (decision) =>
    decision.prototypeId === "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
);
assert.ok(joinedCubesDecision);
assert.deepEqual(joinedCubesDecision.failedCheckIds, [
  "EXEMPLAR_TARGET_MATCHES",
]);
assert.match(joinedCubesDecision.rationale, /ratio/i);
assert.match(joinedCubesDecision.rationale, /area itself/i);

for (const prototypeId of [
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
]) {
  const decision = MEN_CP011_AI_PRE_REVIEW_DECISIONS.find(
    (item) => item.prototypeId === prototypeId,
  );
  assert.ok(decision);
  assert.deepEqual(decision.failedCheckIds, [
    "GIVEN_UNKNOWN_CONTRACT_ALIGNED",
  ]);
}

assert.equal(MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2.length, 4);
assert.deepEqual(
  MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2.map(
    (record) => record.prototypeId,
  ).sort(),
  RETAINED_DIRECT_IDS,
);

for (const record of MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_BATCH_V2) {
  assert.equal(
    record.authority,
    MEN_CP011_DIRECT_SOURCE_HUMAN_REVIEW_AUTHORITY_V2,
  );
  assert.equal(record.reviewDecision, "PENDING");
  assert.equal(record.reviewer, null);
  assert.equal(record.reviewedAt, null);
  assert.equal(record.reviewNotes, null);
  assert.equal(record.permanentQlAllocationBlocked, true);
  assert.equal(record.publicationBlocked, true);
  assert.equal(
    record.sourceEvidence.sourceMatchClassification,
    "DIRECT_TASK_MATCH",
  );
  assert.equal(hasCompleteDirectSourceEvidence(record.sourceEvidence), false);

  for (const result of Object.values(record.checkResults)) {
    assert.equal(result, null);
  }

  const humanAttestedEvidence = {
    ...record.sourceEvidence,
    reviewer: "human-source-reviewer",
    reviewedAt: "2026-08-09T12:00:00Z",
  };
  assert.equal(hasCompleteDirectSourceEvidence(humanAttestedEvidence), true);
}

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      inheritedAuthority: audit.inheritedAuthority,
      attachedReferenceCount: audit.attachedReferenceCount,
      directTaskMatchPendingReviewCount:
        audit.directTaskMatchPendingReviewCount,
      representationOnlySupportCount: audit.representationOnlySupportCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      aiRetainDirectCount: audit.aiRetainDirectCount,
      aiDowngradeCount: audit.aiDowngradeCount,
      revisedHumanReviewQueueCount: audit.revisedHumanReviewQueueCount,
      approvedHumanReviewCount: audit.approvedHumanReviewCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
