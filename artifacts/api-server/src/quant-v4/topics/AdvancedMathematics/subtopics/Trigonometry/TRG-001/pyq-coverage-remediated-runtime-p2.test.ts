import assert from "node:assert/strict";

import { generateAuthorityCandidateTrg001Question } from "./production-authority-candidate-runtime";
import {
  TRG_001_PYQ_COVERAGE_REMEDIATION_P2_AUTHORITY,
  TRG_001_PYQ_COVERAGE_REMEDIATED_QL_IDS,
  generatePyqCoverageRemediatedTrg001Question,
} from "./pyq-coverage-remediated-runtime-p2";

assert.equal(TRG_001_PYQ_COVERAGE_REMEDIATION_P2_AUTHORITY, "TRG-001-PYQ-COVERAGE-REMEDIATION-P2");
assert.deepEqual(TRG_001_PYQ_COVERAGE_REMEDIATED_QL_IDS, ["TRG-001-QL-143"]);

for (const seed of Array.from({ length: 20 }, (_, index) => `trg-pyq-cubic-${index + 1}`)) {
  const question: any = generatePyqCoverageRemediatedTrg001Question("TRG-001-QL-143", seed);
  assert.equal(question.packageId, "TRG-001");
  assert.equal(question.cpId, "TRG-CP-006");
  assert.equal(question.qlId, "TRG-001-QL-143");
  assert.equal(question.solveMode, "simplifyTrigDifferenceOfCubes");
  assert.equal(question.difficulty, "Medium");
  assert.equal(question.target, "RELATION");
  assert.match(question.stem, /sin³A.*cos³A/u);
  assert.match(question.stem, /sin A.*cos A/u);
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option: any) => option.isCorrect).length, 1);
  assert.equal(new Set(question.options.map((option: any) => option.display)).size, 4);
  assert.equal(question.answer, "1 + sin A cos A");
  assert.equal(question.options[question.correctIndex]?.display, question.answer);
  assert.equal(question.explanation.steps.length, 3);
  assert.match(question.explanation.steps[0].body, /difference|Factor|factor/u);
  assert.match(question.explanation.steps[2].body, /sin²A\+cos²A=1/u);
  assert.equal(question.verification.valid, true);
  assert.equal(question.verification.method, "SYMBOLIC_DIFFERENCE_OF_CUBES_PLUS_PYTHAGOREAN_IDENTITY");
  assert.equal(question.authorityAlignment.family, "EQUIVALENCE_VERIFICATION_COMPOSITE");
  assert.equal(question.authorityAlignment.status, "PYQ_REMEDIATION_CANDIDATE");
  assert.equal(question.canonicalState.pyqAnchor, "SSC-CGL-2024-09-09-S2-Q12");
  assert.equal(question.questionStudioDiscoverable, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.ok(question.validation.checks.every((check: any) => check.passed));
}

// The remediation is deliberately surgical: neighbouring terminal composite roles stay byte-for-byte equivalent.
for (const qlId of ["TRG-001-QL-142", "TRG-001-QL-144"] as const) {
  for (const seed of ["trg-neighbour-a", "trg-neighbour-b", "trg-neighbour-c"]) {
    const base = generateAuthorityCandidateTrg001Question(qlId, seed);
    const remediated = generatePyqCoverageRemediatedTrg001Question(qlId, seed);
    assert.deepEqual(remediated, base);
  }
}

console.log(JSON.stringify({
  status: "PASS_TRG_001_PYQ_COVERAGE_REMEDIATION_P2",
  remediatedPermanentQl: "TRG-001-QL-143",
  pyqArchetype: "TRIG_DIFFERENCE_OF_CUBES_FACTORIZATION",
  sampledSeeds: 20,
  neighbouringRolesUnchanged: ["TRG-001-QL-142", "TRG-001-QL-144"],
  productionActivationChanged: false,
}));
