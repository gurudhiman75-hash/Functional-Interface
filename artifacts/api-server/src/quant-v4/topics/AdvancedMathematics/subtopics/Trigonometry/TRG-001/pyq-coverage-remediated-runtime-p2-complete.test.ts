import assert from "node:assert/strict";

import { generatePyqCoverageRemediatedTrg001Question } from "./pyq-coverage-remediated-runtime-p2";
import {
  TRG_001_COMPLETE_PYQ_REMEDIATED_QL_IDS,
  TRG_001_PYQ_COVERAGE_COMPLETE_P2_AUTHORITY,
  generateCompletePyqCoverageRemediatedTrg001Question,
} from "./pyq-coverage-remediated-runtime-p2-complete";

assert.equal(TRG_001_PYQ_COVERAGE_COMPLETE_P2_AUTHORITY, "TRG-001-PYQ-COVERAGE-COMPLETE-P2");
assert.deepEqual(TRG_001_COMPLETE_PYQ_REMEDIATED_QL_IDS, [
  "TRG-001-QL-024",
  "TRG-001-QL-126",
  "TRG-001-QL-143",
]);

const sampled = Array.from({ length: 40 }, (_, index) => {
  const seed = `trg-pyq-mixed-power-${index + 1}`;
  return {
    seed,
    base: generatePyqCoverageRemediatedTrg001Question("TRG-001-QL-126", seed) as any,
    complete: generateCompletePyqCoverageRemediatedTrg001Question("TRG-001-QL-126", seed) as any,
  };
});

let legacyCount = 0;
let pyqSiblingCount = 0;
let exactPyqVariantSeen = false;
const siblingFunctions = new Set<string>();

for (const row of sampled) {
  const question = row.complete;
  assert.equal(question.packageId, "TRG-001");
  assert.equal(question.cpId, "TRG-CP-006");
  assert.equal(question.qlId, "TRG-001-QL-126");
  if (question.solveMode !== "deriveHigherPowerFromTrigQuadraticRelation") {
    legacyCount += 1;
    assert.deepEqual(question, row.base);
    continue;
  }

  pyqSiblingCount += 1;
  assert.equal(question.difficulty, "Medium");
  assert.equal(question.target, "RELATION");
  assert.match(question.stem, /(sin|cos) θ \+ (sin|cos)² θ = 1/u);
  assert.match(question.stem, /(sin|cos)⁴ θ \+ (sin|cos)⁶ θ/u);
  assert.equal(question.options.length, 4);
  assert.equal(question.options.filter((option: any) => option.isCorrect).length, 1);
  assert.equal(new Set(question.options.map((option: any) => option.display)).size, 4);
  assert.equal(question.options[question.correctIndex]?.display, question.answer);
  assert.equal(question.explanation.steps.length, 3);
  assert.equal(question.verification.valid, true);
  assert.equal(question.verification.method, "TRIG_QUADRATIC_RELATION_HIGHER_POWER_SYMBOLIC_CHECK");
  assert.equal(question.authorityAlignment.family, "MIXED_IDENTITY_EXPRESSION");
  assert.equal(question.authorityAlignment.legacyRoleRetained, true);
  assert.equal(question.canonicalState.pyqAnchor, "SSC-CGL-2023-07-26-S1-Q62");
  assert.equal(question.questionStudioDiscoverable, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.ok(question.validation.checks.every((check: any) => check.passed));
  siblingFunctions.add(`${question.canonicalState.givenFunction}->${question.canonicalState.targetFunction}`);
  exactPyqVariantSeen ||= question.canonicalState.exactPyqVariant === true;
}

assert.ok(legacyCount > 0, "Existing QL-126 identity-ratio role must remain reachable.");
assert.ok(pyqSiblingCount > 0, "The real-PYQ higher-power relation sibling must be reachable.");
assert.deepEqual([...siblingFunctions].sort(), ["COS->SIN", "SIN->COS"]);
assert.equal(exactPyqVariantSeen, true, "The exact SSC CGL cos-relation form must be reachable.");

// The complete wrapper must retain the earlier QL-024 and QL-143 remediations unchanged.
for (const qlId of ["TRG-001-QL-024", "TRG-001-QL-143"] as const) {
  for (const seed of ["trg-complete-retain-a", "trg-complete-retain-b"]) {
    assert.deepEqual(
      generateCompletePyqCoverageRemediatedTrg001Question(qlId, seed),
      generatePyqCoverageRemediatedTrg001Question(qlId, seed),
    );
  }
}

console.log(JSON.stringify({
  status: "PASS_TRG_001_COMPLETE_PYQ_COVERAGE_REMEDIATION_P2",
  remediatedQls: [...TRG_001_COMPLETE_PYQ_REMEDIATED_QL_IDS],
  sampledQl126Seeds: sampled.length,
  legacyCount,
  pyqSiblingCount,
  siblingFunctions: [...siblingFunctions].sort(),
  exactPyqVariantSeen,
  productionActivationChanged: false,
}));
