import assert from "node:assert/strict";

import {
  TRG_001_CONSOLIDATED_AUDIT_P2,
  generateConsolidatedAuditTrg001Question,
} from "./consolidated-audit-runtime-p2";

assert.deepEqual(TRG_001_CONSOLIDATED_AUDIT_P2.pyqCoverageQlIds, [
  "TRG-001-QL-024",
  "TRG-001-QL-126",
  "TRG-001-QL-143",
]);
assert.deepEqual(TRG_001_CONSOLIDATED_AUDIT_P2.difficultyRecalibratedQlIds, ["TRG-001-QL-121"]);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.questionStudioRebound, false);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.productionActivationChanged, false);

const q24 = generateConsolidatedAuditTrg001Question("TRG-001-QL-024", "consolidated-q24", "en") as any;
assert.equal(q24.solveMode, "compareSinCosFromAcuteInterval");
assert.equal(q24.difficulty, "Easy");

let q126PyqSeen = false;
for (let index = 0; index < 24; index += 1) {
  const q126 = generateConsolidatedAuditTrg001Question("TRG-001-QL-126", `consolidated-q126-${index}`, "en") as any;
  q126PyqSeen ||= q126.solveMode === "deriveHigherPowerFromTrigQuadraticRelation";
}
assert.equal(q126PyqSeen, true);

const q143 = generateConsolidatedAuditTrg001Question("TRG-001-QL-143", "consolidated-q143", "en") as any;
assert.equal(q143.solveMode, "simplifyTrigCubicFactorization");
assert.equal(q143.difficulty, "Medium");

for (const language of ["en", "hi", "pa"] as const) {
  const q121 = generateConsolidatedAuditTrg001Question("TRG-001-QL-121", `consolidated-q121-${language}`, language) as any;
  assert.equal(q121.difficulty, "Medium");
  assert.equal(q121.consolidatedAuditP2.difficultyChanged, true);
  assert.ok(!q121.learnerExplanation.includes("Shortcut:"));
  assert.ok(!q121.learnerExplanation.includes("Common trap:"));
  assert.ok(!q121.learnerExplanation.includes("शॉर्टकट"));
  assert.ok(!q121.learnerExplanation.includes("ਸ਼ਾਰਟਕੱਟ"));
}

for (const qlId of ["TRG-001-QL-024", "TRG-001-QL-121", "TRG-001-QL-126", "TRG-001-QL-143"] as const) {
  const question = generateConsolidatedAuditTrg001Question(qlId, `lock-${qlId}`, "en") as any;
  assert.equal(question.questionStudioDiscoverable, false);
  assert.equal(question.testEligibility, "INELIGIBLE");
  assert.equal(question.publiclyPublishable, false);
}

console.log(JSON.stringify({
  status: "PASS_TRG_001_CONSOLIDATED_AUDIT_P2",
  pyqCoverageQlIds: TRG_001_CONSOLIDATED_AUDIT_P2.pyqCoverageQlIds,
  difficultyRecalibratedQlIds: TRG_001_CONSOLIDATED_AUDIT_P2.difficultyRecalibratedQlIds,
  questionStudioRebound: false,
  productionActivationChanged: false,
}));
