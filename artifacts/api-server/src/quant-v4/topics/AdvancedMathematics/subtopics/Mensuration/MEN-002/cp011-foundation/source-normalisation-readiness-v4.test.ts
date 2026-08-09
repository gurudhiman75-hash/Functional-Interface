import assert from "node:assert/strict";
import {
  hasAttachedSourceReference,
  hasCompleteDirectSourceEvidence,
} from "./source-normalisation-readiness";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3,
  auditMenCp011SourceReadinessV3,
} from "./source-normalisation-readiness-v3";
import {
  MEN_CP011_SOURCE_READINESS_AUTHORITY_V4,
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4,
  MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE,
  auditMenCp011SourceReadinessV4,
} from "./source-normalisation-readiness-v4";

const inheritedAudit = auditMenCp011SourceReadinessV3();
const audit = auditMenCp011SourceReadinessV4();
const changedPrototypeIds = [
  "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
  "MEN-CP011-PROT-INNER-LINING-COST",
] as const;

assert.equal(inheritedAudit.attachedReferenceCount, 15);
assert.equal(inheritedAudit.directTaskMatchPendingReviewCount, 7);
assert.equal(inheritedAudit.representationOnlySupportCount, 8);
assert.equal(inheritedAudit.missingDirectReferenceCount, 13);

assert.equal(audit.authority, MEN_CP011_SOURCE_READINESS_AUTHORITY_V4);
assert.equal(
  audit.inheritedAuthority,
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V3",
);
assert.equal(audit.livePrototypeCount, 28);
assert.equal(audit.ledgerPrototypeCount, 28);
assert.equal(audit.uniqueLivePrototypeCount, 28);
assert.equal(audit.uniqueLedgerPrototypeCount, 28);
assert.equal(audit.liveAndLedgerSetsMatch, true);
assert.equal(audit.canonicalOwnerConfirmedCount, 28);
assert.equal(audit.executableFormulaAuthorityCount, 28);
assert.equal(audit.attachedReferenceCount, 17);
assert.equal(audit.directTaskMatchPendingReviewCount, 8);
assert.equal(audit.representationOnlySupportCount, 9);
assert.equal(audit.directlyNormalisedCount, 0);
assert.equal(audit.missingDirectReferenceCount, 11);
assert.equal(audit.incompleteAttachedReferenceCount, 0);
assert.equal(audit.falselyNormalisedCount, 0);
assert.equal(audit.neighbourBoundaryCount, 6);
assert.equal(audit.sourceNormalisationComplete, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.publicationEligible, false);
assert.equal(audit.familyGroupCounts.HOLLOW_RECTANGULAR_SOLIDS, 2);
assert.equal(audit.familyGroupCounts.SHEET_AND_LINING_COST, 2);

assert.deepEqual(
  MEN_CP011_SOURCE_READINESS_ENTRIES_V4.map((entry) => entry.prototypeId),
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3.map((entry) => entry.prototypeId),
);

const hollowCuboid = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.find(
  (entry) =>
    entry.prototypeId === "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
);
assert.ok(hollowCuboid);
assert.equal(hollowCuboid.familyGroup, "HOLLOW_RECTANGULAR_SOLIDS");
assert.equal(
  hollowCuboid.sourceNormalisationStatus,
  "REFERENCE_ATTACHED_PENDING_REVIEW",
);
assert.equal(
  hollowCuboid.evidence.sourceMatchClassification,
  "DIRECT_TASK_MATCH",
);
assert.match(hollowCuboid.evidence.pageLocator ?? "", /p\. 777/);
assert.match(hollowCuboid.evidence.pageLocator ?? "", /p\. 795/);
assert.match(hollowCuboid.evidence.exemplarLocator ?? "", /Question 46/);
assert.match(
  hollowCuboid.evidence.sourceMatchRationale ?? "",
  /outer cuboid volume/i,
);
assert.equal(hasAttachedSourceReference(hollowCuboid.evidence), true);
assert.equal(hasCompleteDirectSourceEvidence(hollowCuboid.evidence), false);
assert.equal(
  hasCompleteDirectSourceEvidence({
    ...hollowCuboid.evidence,
    reviewer: "human-source-reviewer",
    reviewedAt: "2026-08-09T00:00:00Z",
  }),
  true,
);

const lining = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.find(
  (entry) => entry.prototypeId === "MEN-CP011-PROT-INNER-LINING-COST",
);
assert.ok(lining);
assert.equal(lining.familyGroup, "SHEET_AND_LINING_COST");
assert.equal(
  lining.sourceNormalisationStatus,
  "REFERENCE_ATTACHED_PENDING_REVIEW",
);
assert.equal(
  lining.evidence.sourceMatchClassification,
  "REPRESENTATION_ONLY_SUPPORT",
);
assert.equal(lining.evidence.pageLocator, "printed p. 780");
assert.match(lining.evidence.exemplarLocator ?? "", /Question 112/);
assert.match(lining.evidence.sourceMatchRationale ?? "", /omits a bottom face/i);
assert.equal(hasAttachedSourceReference(lining.evidence), true);
assert.equal(hasCompleteDirectSourceEvidence(lining.evidence), false);
assert.equal(
  hasCompleteDirectSourceEvidence({
    ...lining.evidence,
    reviewer: "human-source-reviewer",
    reviewedAt: "2026-08-09T00:00:00Z",
  }),
  false,
);

for (const prototypeId of changedPrototypeIds) {
  const v3Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  assert.ok(v3Entry);
  assert.equal(v3Entry.sourceNormalisationStatus, "MISSING_DIRECT_REFERENCE");
}

const changedIdSet = new Set<string>(changedPrototypeIds);
for (const v3Entry of MEN_CP011_SOURCE_READINESS_ENTRIES_V3) {
  if (changedIdSet.has(v3Entry.prototypeId)) continue;
  const v4Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.find(
    (entry) => entry.prototypeId === v3Entry.prototypeId,
  );
  assert.deepEqual(v4Entry, v3Entry);
}

assert.equal(
  MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE[
    "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME"
  ]?.sourceMatchClassification,
  "DIRECT_TASK_MATCH",
);
assert.equal(
  MEN_CP011_V4_BOX_LINING_SOURCE_EVIDENCE_BY_PROTOTYPE[
    "MEN-CP011-PROT-INNER-LINING-COST"
  ]?.sourceMatchClassification,
  "REPRESENTATION_ONLY_SUPPORT",
);

const directPendingIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V4.filter(
  (entry) =>
    entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW" &&
    entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
).map((entry) => entry.prototypeId);
assert.ok(
  directPendingIds.includes("MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME"),
);
assert.equal(directPendingIds.length, 8);

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      livePrototypeCount: audit.livePrototypeCount,
      attachedReferenceCount: audit.attachedReferenceCount,
      directTaskMatchPendingReviewCount:
        audit.directTaskMatchPendingReviewCount,
      representationOnlySupportCount: audit.representationOnlySupportCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      newDirectTaskCandidate:
        "MEN-CP011-PROT-HOLLOW-CUBOID-MATERIAL-VOLUME",
      newRepresentationSupport:
        "MEN-CP011-PROT-INNER-LINING-COST",
      sourceNormalisationComplete: audit.sourceNormalisationComplete,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
