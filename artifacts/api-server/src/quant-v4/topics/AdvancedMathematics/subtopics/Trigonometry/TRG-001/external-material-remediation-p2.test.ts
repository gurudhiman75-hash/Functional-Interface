import assert from "node:assert/strict";

import {
  TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2,
  generateTrg001ExternalTripleAngleCandidate,
} from "./external-material-remediation-p2";

assert.equal(TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2.permanentQlBinding, null);
assert.equal(TRG_001_EXTERNAL_MATERIAL_REMEDIATION_P2.questionStudioDiscoverable, false);

const solveModes = new Set<string>();
for (let i = 0; i < 40; i += 1) {
  const q: any = generateTrg001ExternalTripleAngleCandidate(`trg-ext-triple-${i}`);
  solveModes.add(q.solveMode);
  assert.equal(q.options.length, 4);
  assert.equal(q.options.filter((option: any) => option.isCorrect).length, 1);
  assert.equal(q.options[q.correctIndex].display, q.answer);
  assert.equal(new Set(q.options.map((option: any) => option.display)).size, 4);
  assert.equal(q.difficulty, "Medium");
  assert.equal(q.questionStudioDiscoverable, false);
  assert.equal(q.testEligibility, "INELIGIBLE");
  assert.equal(q.publiclyPublishable, false);
  assert.ok(String(q.explanation.keyRule).includes("cos 3θ"));
  assert.ok(q.explanation.steps.length >= 2);
}

assert.deepEqual(
  [...solveModes].sort(),
  [
    "identifyCosTripleAngleFromCubicExpression",
    "identifyNegativeCosTripleAngleFromCubicExpression",
  ].sort(),
);

console.log(JSON.stringify({
  status: "PASS_TRG_001_EXTERNAL_TRIPLE_ANGLE_SOURCE_CHECK",
  sampledSeeds: 40,
  solveModes: [...solveModes].sort(),
  permanentQlBinding: null,
  questionStudioDiscoverable: false,
}));
