import { strict as assert } from "node:assert";
import {
  PERCENT_OF_KNOWN_NUMBER_ENGLISH_V2_ASSETS,
} from "./english-language-family.v2";
import {
  LANGUAGE_REVISION_REPORT,
  produceLanguageRevisionReport,
} from "./language-revision-report";
import { PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS } from "./planner";

for (const mode of ["short", "standard", "detailed"] as const) {
  assert.deepEqual(
    Object.keys(PERCENT_OF_KNOWN_NUMBER_ENGLISH_V2_ASSETS[mode]),
    PERCENT_OF_KNOWN_NUMBER_ROLE_KINDS,
  );
}

assert.deepEqual(
  LANGUAGE_REVISION_REPORT,
  produceLanguageRevisionReport(),
  "Revision rendering and audit must be deterministic.",
);
assert.equal(LANGUAGE_REVISION_REPORT.totalExamples, 50);
assert.equal(LANGUAGE_REVISION_REPORT.criticalFindings.length, 0);
assert.ok(
  LANGUAGE_REVISION_REPORT.majorFindings.length < 20,
  `Expected fewer than 20 major findings, received ${LANGUAGE_REVISION_REPORT.majorFindings.length}.`,
);
assert.ok(
  LANGUAGE_REVISION_REPORT.minorFindings.length < 10,
  `Expected fewer than 10 minor findings, received ${LANGUAGE_REVISION_REPORT.minorFindings.length}.`,
);
assert.ok(
  LANGUAGE_REVISION_REPORT.examplesApproved.length > 40,
  `Expected more than 40 approved examples, received ${LANGUAGE_REVISION_REPORT.examplesApproved.length}.`,
);
assert.ok(
  LANGUAGE_REVISION_REPORT.openingFamilyCount >= 3,
  "At least three deterministic opening families must appear.",
);

console.log(
  `ENG-006R1 passed: ${LANGUAGE_REVISION_REPORT.examplesApproved.length}/50 approved, ` +
    `${LANGUAGE_REVISION_REPORT.majorFindings.length} major, ` +
    `${LANGUAGE_REVISION_REPORT.minorFindings.length} minor findings.`,
);

