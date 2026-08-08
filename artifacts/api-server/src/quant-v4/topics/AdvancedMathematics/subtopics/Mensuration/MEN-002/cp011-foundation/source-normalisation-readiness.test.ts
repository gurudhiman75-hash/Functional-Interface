import assert from "node:assert/strict";
import {
  MEN_CP011_NEIGHBOUR_OWNERSHIP_BOUNDARIES,
  MEN_CP011_SOURCE_READINESS_AUTHORITY,
  MEN_CP011_SOURCE_READINESS_ENTRIES,
  auditMenCp011SourceReadiness,
  getMenCp011LivePrototypeIds,
  hasCompleteDirectSourceEvidence,
} from "./source-normalisation-readiness";

const audit = auditMenCp011SourceReadiness();
const liveIds = getMenCp011LivePrototypeIds();
const ledgerIds = MEN_CP011_SOURCE_READINESS_ENTRIES.map(
  (entry) => entry.prototypeId,
);

assert.equal(audit.authority, MEN_CP011_SOURCE_READINESS_AUTHORITY);
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
assert.equal(audit.directlyNormalisedCount, 0);
assert.equal(audit.missingDirectReferenceCount, 28);
assert.equal(audit.falselyNormalisedCount, 0);
assert.equal(audit.neighbourBoundaryCount, 6);
assert.equal(audit.sourceNormalisationComplete, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.publicationEligible, false);
assert.deepEqual(audit.blockers, [
  "DIRECT_SOURCE_DOCUMENT_LOCATORS_MISSING",
  "DIRECT_SOURCE_EXEMPLAR_LOCATORS_MISSING",
  "SOURCE_REVIEWER_ATTESTATION_MISSING",
  "PERMANENT_QLS_UNALLOCATED",
  "MANUAL_ENGLISH_REVIEW_PENDING",
  "MULTILINGUAL_PARITY_PENDING",
]);

for (const entry of MEN_CP011_SOURCE_READINESS_ENTRIES) {
  assert.equal(entry.canonicalOwner, "MEN-CP-011");
  assert.equal(
    entry.formulaAuthorityStatus,
    "EXECUTABLE_AND_INDEPENDENTLY_VERIFIED",
  );
  assert.equal(entry.ownershipStatus, "CANONICAL_OWNER_CONFIRMED");
  assert.equal(
    entry.sourceNormalisationStatus,
    "MISSING_DIRECT_REFERENCE",
  );
  assert.equal(hasCompleteDirectSourceEvidence(entry.evidence), false);
  assert.equal(entry.requiredEvidence.length, 7);
  assert.ok(entry.requiredEvidence.every((requirement) => requirement.length > 20));
  assert.equal(entry.publicationBlocked, true);
  assert.equal(entry.permanentQlAllocationBlocked, true);
}

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
    reviewer: "editor@example",
    reviewedAt: "2026-08-08T00:00:00Z",
  }),
  false,
);

console.log(
  JSON.stringify(
    {
      authority: audit.authority,
      livePrototypeCount: audit.livePrototypeCount,
      ledgerPrototypeCount: audit.ledgerPrototypeCount,
      canonicalOwnerConfirmedCount: audit.canonicalOwnerConfirmedCount,
      executableFormulaAuthorityCount: audit.executableFormulaAuthorityCount,
      directlyNormalisedCount: audit.directlyNormalisedCount,
      missingDirectReferenceCount: audit.missingDirectReferenceCount,
      neighbourBoundaryCount: audit.neighbourBoundaryCount,
      sourceNormalisationComplete: audit.sourceNormalisationComplete,
      publicationEligible: audit.publicationEligible,
    },
    null,
    2,
  ),
);
