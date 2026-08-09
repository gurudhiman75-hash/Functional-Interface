import assert from "node:assert/strict";
import {
  MEN_CP011_SOURCE_READINESS_ENTRIES as MEN_CP011_SOURCE_READINESS_ENTRIES_V2,
  hasCompleteDirectSourceEvidence,
} from "./source-normalisation-readiness";
import {
  MEN_CP011_SOURCE_READINESS_AUTHORITY_V3,
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3,
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE,
  auditMenCp011SourceReadinessV3,
} from "./source-normalisation-readiness-v3";

const audit = auditMenCp011SourceReadinessV3();
const shellPrototypeIds = [
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
] as const;

assert.equal(
  audit.authority,
  MEN_CP011_SOURCE_READINESS_AUTHORITY_V3,
);
assert.equal(
  audit.inheritedAuthority,
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V2",
);
assert.equal(audit.livePrototypeCount, 28);
assert.equal(audit.ledgerPrototypeCount, 28);
assert.equal(audit.uniqueLivePrototypeCount, 28);
assert.equal(audit.uniqueLedgerPrototypeCount, 28);
assert.equal(audit.liveAndLedgerSetsMatch, true);
assert.equal(audit.canonicalOwnerConfirmedCount, 28);
assert.equal(audit.executableFormulaAuthorityCount, 28);
assert.equal(audit.attachedReferenceCount, 15);
assert.equal(audit.directTaskMatchPendingReviewCount, 7);
assert.equal(audit.representationOnlySupportCount, 8);
assert.equal(audit.directlyNormalisedCount, 0);
assert.equal(audit.missingDirectReferenceCount, 13);
assert.equal(audit.incompleteAttachedReferenceCount, 0);
assert.equal(audit.falselyNormalisedCount, 0);
assert.equal(audit.neighbourBoundaryCount, 6);
assert.equal(audit.sourceNormalisationComplete, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.publicationEligible, false);
assert.equal(audit.familyGroupCounts.SPHERICAL_SHELLS, 2);

assert.deepEqual(
  MEN_CP011_SOURCE_READINESS_ENTRIES_V3.map((entry) => entry.prototypeId),
  MEN_CP011_SOURCE_READINESS_ENTRIES_V2.map((entry) => entry.prototypeId),
);

for (const prototypeId of shellPrototypeIds) {
  const v2Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V2.find(
    (entry) => entry.prototypeId === prototypeId,
  );
  const v3Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.find(
    (entry) => entry.prototypeId === prototypeId,
  );

  assert.ok(v2Entry);
  assert.ok(v3Entry);
  assert.equal(v2Entry.sourceNormalisationStatus, "MISSING_DIRECT_REFERENCE");
  assert.equal(
    v3Entry.sourceNormalisationStatus,
    "REFERENCE_ATTACHED_PENDING_REVIEW",
  );
  assert.equal(v3Entry.familyGroup, "SPHERICAL_SHELLS");
  assert.equal(
    v3Entry.evidence.sourceMatchClassification,
    "DIRECT_TASK_MATCH",
  );
  assert.match(v3Entry.evidence.documentId ?? "", /ISBN-978-93-525-3402-9/);
  assert.match(v3Entry.evidence.documentTitle ?? "", /R\.S\. Aggarwal/);
  assert.match(v3Entry.evidence.chapterOrSection ?? "", /Volume and Surface Areas/);
  assert.match(v3Entry.evidence.pageLocator ?? "", /^printed p\. 78[68]$/);
  assert.match(v3Entry.evidence.exemplarLocator ?? "", /volume/i);
  assert.match(
    v3Entry.evidence.sourceContentHash ?? "",
    /^FILE_LIBRARY_EXTRACT:/,
  );
  assert.equal(v3Entry.evidence.reviewer, null);
  assert.equal(v3Entry.evidence.reviewedAt, null);
  assert.equal(hasCompleteDirectSourceEvidence(v3Entry.evidence), false);

  const reviewedEvidence = {
    ...v3Entry.evidence,
    reviewer: "human-source-reviewer",
    reviewedAt: "2026-08-09T00:00:00Z",
  };
  assert.equal(hasCompleteDirectSourceEvidence(reviewedEvidence), true);
}

assert.equal(
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE[
    "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME"
  ]?.pageLocator,
  "printed p. 786",
);
assert.match(
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE[
    "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME"
  ]?.exemplarLocator ?? "",
  /Question 226/,
);
assert.equal(
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE[
    "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME"
  ]?.pageLocator,
  "printed p. 788",
);
assert.match(
  MEN_CP011_V3_SHELL_SOURCE_EVIDENCE_BY_PROTOTYPE[
    "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME"
  ]?.exemplarLocator ?? "",
  /Question 261/,
);

const shellIdSet = new Set<string>(shellPrototypeIds);
for (const v2Entry of MEN_CP011_SOURCE_READINESS_ENTRIES_V2) {
  if (shellIdSet.has(v2Entry.prototypeId)) continue;
  const v3Entry = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.find(
    (entry) => entry.prototypeId === v2Entry.prototypeId,
  );
  assert.deepEqual(v3Entry, v2Entry);
}

const directPendingIds = MEN_CP011_SOURCE_READINESS_ENTRIES_V3.filter(
  (entry) =>
    entry.sourceNormalisationStatus === "REFERENCE_ATTACHED_PENDING_REVIEW" &&
    entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
).map((entry) => entry.prototypeId);
assert.deepEqual(directPendingIds.sort(), [
  "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
  "MEN-CP011-PROT-HEMISPHERICAL-SHELL-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
  "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
  "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
  "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
  "MEN-CP011-PROT-SPHERICAL-SHELL-MATERIAL-VOLUME",
].sort());

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
      shellDirectTaskCandidates: shellPrototypeIds,
      sourceNormalisationComplete: audit.sourceNormalisationComplete,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
