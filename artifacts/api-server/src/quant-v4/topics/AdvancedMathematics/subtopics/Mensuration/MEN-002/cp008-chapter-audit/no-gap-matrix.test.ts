import assert from "node:assert/strict";
import {
  auditMenCp008NoKnownGapMatrix,
  MEN_CP_008_NO_GAP_MATRIX,
  MEN_CP_008_REQUIRED_COVERAGE_DIMENSIONS,
} from "./no-gap-matrix";

const audit = auditMenCp008NoKnownGapMatrix();

assert.equal(audit.verdict, "PASS_NO_KNOWN_CP008_GAP_SOURCE_RECHECK_PENDING");
assert.equal(audit.requiredDimensions, 12);
assert.equal(audit.coveredDimensions, 12);
assert.equal(audit.missingDimensions.length, 0);
assert.equal(audit.unknownEvidence.length, 0);
assert.equal(audit.rowsWithoutEvidence.length, 0);
assert.equal(audit.ownershipRowsWithoutOwner.length, 0);
assert.equal(audit.ownershipRows, 6);
assert.ok(audit.executableRows >= 25);
assert.ok(audit.uniqueEvidencePrototypes >= 50);
assert.equal(new Set(MEN_CP_008_REQUIRED_COVERAGE_DIMENSIONS).size, 12);
assert.equal(new Set(MEN_CP_008_NO_GAP_MATRIX.map((row) => row.rowId)).size, MEN_CP_008_NO_GAP_MATRIX.length);

console.log(
  `MEN-CP-008 no-known-gap matrix passed across ${audit.rows} coverage rows and ${audit.requiredDimensions} required dimensions. Final uploaded-source recheck remains pending.`,
);
