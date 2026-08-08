import assert from "node:assert/strict";
import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  MEN_CP011_SOURCE_CANDIDATE_EVIDENCE_BY_PROTOTYPE,
  MEN_CP011_SOURCE_READINESS_AUTHORITY,
  MEN_CP011_SOURCE_READINESS_ENTRIES,
  auditMenCp011SourceReadiness,
  getMenCp011LivePrototypeIds,
  hasAttachedSourceReference,
  hasCompleteDirectSourceEvidence,
} from "./source-normalisation-readiness";

const audit = auditMenCp011SourceReadiness();
const liveIds = getMenCp011LivePrototypeIds();
const ledgerIds = MEN_CP011_SOURCE_READINESS_ENTRIES.map(
  (entry) => entry.prototypeId,
);
const attachedEntries = MEN_CP011_SOURCE_READINESS_ENTRIES.filter((entry) =>
  hasAttachedSourceReference(entry.evidence),
);
const directCandidates = attachedEntries.filter(
  (entry) => entry.evidence.sourceMatchClassification === "DIRECT_TASK_MATCH",
);
const representationOnly = attachedEntries.filter(
  (entry) =>
    entry.evidence.sourceMatchClassification ===
    "REPRESENTATION_ONLY_SUPPORT",
);

assert.equal(audit.authority, MEN_CP011_SOURCE_READINESS_AUTHORITY);
assert.equal(
  MEN_CP011_SOURCE_READINESS_AUTHORITY,
  "MEN-CP011-DIRECT-SOURCE-NORMALISATION-READINESS-V2",
);
assert.equal(audit.livePrototypeCount, 28);
assert.equal(audit.ledgerPrototypeCount, 28);
assert.equal(audit.uniqueLivePrototypeCount, 28);
assert.equal(audit.uniqueLedgerPrototypeCount, 28);
assert.equal(audit.liveAndLedgerSetsMatch, true);
assert.deepEqual([...liveIds].sort(), [...ledgerIds].sort());
assert.deepEqual(audit.familyGroupCounts, {
  PIPE_MATERIAL_AND_INVERSE_CORE: 4,
  PIPE_SURFACE_EXPOSURE: 6,
  OPEN_CYLINDER_EXPOSURE: 2,
  ADDITIONAL_PIPE_INVERSES: 2,
  HOLLOW_RECTANGULAR_SOLIDS: 2,
  SPHERICAL_SHELLS: 2,
  HIDDEN_FACE_EXPOSURE: 2,
  SHEET_AND_LINING_COST: 2,
  MATERIAL_RATIO_AND_PERCENT_CHANGE: 2,
  CONICAL_MATERIAL_VOLUME: 2,
  CONICAL_SURFACE_AND_LINING_COST: 2,
});
assert.equal(audit.canonicalOwnerConfirmedCount, 28);
assert.equal(audit.executableFormulaAuthorityCount, 28);
assert.equal(audit.attachedReferenceCount, 13);
assert.equal(audit.directTaskMatchPendingReviewCount, 5);
assert.equal(audit.representationOnlySupportCount, 8);
assert.equal(audit.directlyNormalisedCount, 0);
assert.equal(audit.missingDirectReferenceCount, 15);
assert.equal(audit.incompleteAttachedReferenceCount, 0);
assert.equal(audit.falselyNormalisedCount, 0);
assert.equal(audit.neighbourBoundaryCount, 6);
assert.equal(audit.sourceNormalisationComplete, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.blockers, [
  "DIRECT_SOURCE_DOCUMENT_LOCATORS_MISSING",
  "DIRECT_SOURCE_EXEMPLAR_LOCATORS_MISSING",
  "DIRECT_TASK_MATCHES_STILL_REQUIRED",
  "SOURCE_REVIEWER_ATTESTATION_MISSING",
  "PERMANENT_QLS_UNALLOCATED",
  "MANUAL_ENGLISH_REVIEW_PENDING",
  "MULTILINGUAL_PARITY_PENDING",
]);

assert.equal(
  Object.keys(MEN_CP011_SOURCE_CANDIDATE_EVIDENCE_BY_PROTOTYPE).length,
  13,
);
assert.ok(
  Object.keys(MEN_CP011_SOURCE_CANDIDATE_EVIDENCE_BY_PROTOTYPE).every(
    (prototypeId) => liveIds.includes(prototypeId),
  ),
);
assert.equal(attachedEntries.length, 13);
assert.equal(directCandidates.length, 5);
assert.equal(representationOnly.length, 8);

for (const entry of MEN_CP011_SOURCE_READINESS_ENTRIES) {
  assert.equal(entry.canonicalOwner, "MEN-CP-011");
  assert.equal(
    entry.formulaAuthorityStatus,
    "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED",
  );
  assert.equal(entry.ownershipStatus, "CANONICAL_OWNER_CONFIRMED");
  assert.equal(entry.requiredEvidence.length, 7);
  assert.ok(entry.requiredEvidence.every((requirement) => requirement.length > 20));
  assert.equal(entry.publicationBlocked, true);
  assert.equal(entry.permanentQlAllocationBlocked, true);

  if (hasAttachedSourceReference(entry.evidence)) {
    assert.equal(
      entry.sourceNormalisationStatus,
      "REFERENCE_ATTACHED_PENDING_REVIEW",
    );
    assert.equal(
      entry.evidence.documentId,
      "FILE_LIBRARY:file_000000007a30824383471a9d268f3224:ISBN-978-93-525-3402-9",
    );
    assert.match(entry.evidence.pageLocator ?? "", /^printed p\. (783|797)$/);
    assert.match(
      entry.evidence.sourceContentHash ?? "",
      /^FILE_LIBRARY_EXTRACT:file_000000007a30824383471a9d268f3224:/,
    );
    assert.equal(hasCompleteDirectSourceEvidence(entry.evidence), false);
  } else {
    assert.equal(entry.sourceNormalisationStatus, "MISSING_DIRECT_REFERENCE");
    assert.equal(hasCompleteDirectSourceEvidence(entry.evidence), false);
  }
}

assert.deepEqual(
  directCandidates.map((entry) => entry.prototypeId).sort(),
  [
    "MEN-CP011-PROT-COMPLETE-TUBE-SURFACE-AREA",
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME",
    "MEN-CP011-PROT-HOLLOW-CYLINDER-MATERIAL-VOLUME-DIAMETERS",
    "MEN-CP011-PROT-JOINED-CUBES-EXPOSED-AREA",
    "MEN-CP011-PROT-PIPE-MATERIAL-VOLUME-FROM-THICKNESS",
  ].sort(),
);
assert.deepEqual(
  representationOnly.map((entry) => entry.prototypeId).sort(),
  [
    "MEN-CP011-PROT-BOTH-ANNULAR-ENDS-AREA",
    "MEN-CP011-PROT-BOTH-CURVED-SURFACES-AREA",
    "MEN-CP011-PROT-INNER-CURVED-SURFACE-AREA",
    "MEN-CP011-PROT-ONE-ANNULAR-END-AREA",
    "MEN-CP011-PROT-OPEN-CYLINDER-BOTH-ENDS-AREA",
    "MEN-CP011-PROT-OUTER-CURVED-SURFACE-AREA",
    "MEN-CP011-PROT-PIPE-INNER-RADIUS-FROM-MATERIAL-VOLUME",
    "MEN-CP011-PROT-PIPE-THICKNESS-FROM-MATERIAL-VOLUME",
  ].sort(),
);

const representativeDirectCandidate = directCandidates[0]!;
assert.equal(
  hasCompleteDirectSourceEvidence({
    ...representativeDirectCandidate.evidence,
    reviewer: "ExamTree source reviewer",
    reviewedAt: "2026-08-08T00:00:00Z",
  }),
  true,
);
const representativeSupportOnly = representationOnly[0]!;
assert.equal(
  hasCompleteDirectSourceEvidence({
    ...representativeSupportOnly.evidence,
    reviewer: "ExamTree source reviewer",
    reviewedAt: "2026-08-08T00:00:00Z",
  }),
  false,
);
assert.equal(
  hasCompleteDirectSourceEvidence({
    sourceType: "ESTABLISHED_EXAM_PREP_BOOK",
    documentId: "DOC-001",
    documentTitle: "Mensuration Reference",
    editionOrYear: "2026 edition",
    chapterOrSection: "Hollow Solids",
    pageLocator: "pp. 120-123",
    exemplarLocator: "Example 7",
    sourceContentHash: "sha256:example-content-hash",
    sourceMatchClassification: "DIRECT_TASK_MATCH",
    sourceMatchRationale: "This exemplar directly matches the target contract.",
    reviewer: "editor@example",
    reviewedAt: "2026-08-08T00:00:00Z",
  }),
  true,
);
assert.equal(
  hasCompleteDirectSourceEvidence({
    sourceType: "ESTABLISHED_EXAM_PREP_BOOK",
    documentId: "DOC-001",
    documentTitle: "Mensuration Reference",
    editionOrYear: "2026 edition",
    chapterOrSection: "Hollow Solids",
    pageLocator: null,
    exemplarLocator: "Example 7",
    sourceContentHash: "sha256:example-content-hash",
    sourceMatchClassification: "DIRECT_TASK_MATCH",
    sourceMatchRationale: "This exemplar directly matches the target contract.",
    reviewer: "editor@example",
    reviewedAt: "2026-08-08T00:00:00Z",
  }),
  false,
);

assert.deepEqual(
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES.map(
    (boundary) => boundary.neighbouringCanonicalProblemId,
  ),
  [
    "MEN-CP-007",
    "MEN-CP-008",
    "MEN-CP-009",
    "MEN-CP-010",
    "MEN-CP-012",
    "MEN-CP-013",
  ],
);
assert.ok(
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES.every(
    (boundary) =>
      boundary.retainedScope.length >= 45 &&
      boundary.excludedFromMenCp011.length >= 1 &&
      boundary.excludedFromMenCp011.every((item) => item.length >= 30),
  ),
);

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      livePrototypeCount: audit.livePrototypeCount,
      ledgerPrototypeCount: audit.ledgerPrototypeCount,
      canonicalOwnerConfirmedCount: audit.canonicalOwnerConfirmedCount,
      executableFormulaAuthorityCount: audit.executableFormulaAuthorityCount,
      attachedReferenceCount: audit.attachedReferenceCount,
      directTaskMatchPendingReviewCount:
        audit.directTaskMatchPendingReviewCount,
      representationOnlySupportCount: audit.representationOnlySupportCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      incompleteAttachedReferenceCount: audit.incompleteAttachedReferenceCount,
      neighbourBoundaryCount: audit.neighbourBoundaryCount,
      sourceNormalisationComplete: audit.sourceNormalisationComplete,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
