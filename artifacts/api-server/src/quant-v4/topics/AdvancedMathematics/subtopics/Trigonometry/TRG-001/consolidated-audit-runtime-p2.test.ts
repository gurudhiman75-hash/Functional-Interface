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
assert.deepEqual(TRG_001_CONSOLIDATED_AUDIT_P2.contentLanguages, ["en"]);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.localizationStatus, "PENDING_NATIVE_HI_PA_REMEDIATION");
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.questionStudioRebound, false);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.productionActivationChanged, false);

const q24 = generateConsolidatedAuditTrg001Question("TRG-001-QL-024", "consolidated-q24", "en") as any;
assert.equal(q24.solveMode, "compareSinCosFromAcuteInterval");
assert.equal(q24.difficulty, "Easy");

let q126PyqSeen = false;
let q126LegacySeen = false;
for (let index = 0; index < 40; index += 1) {
  const q126 = generateConsolidatedAuditTrg001Question("TRG-001-QL-126", `consolidated-q126-${index}`, "en") as any;
  q126PyqSeen ||= q126.solveMode === "deriveHigherPowerFromTrigQuadraticRelation";
  q126LegacySeen ||= q126.solveMode !== "deriveHigherPowerFromTrigQuadraticRelation";
}
assert.equal(q126PyqSeen, true);
assert.equal(q126LegacySeen, true);

const q143 = generateConsolidatedAuditTrg001Question("TRG-001-QL-143", "consolidated-q143", "en") as any;
assert.equal(q143.solveMode, "simplifyTrigCubicFactorization");
assert.equal(q143.difficulty, "Medium");

const q121 = generateConsolidatedAuditTrg001Question("TRG-001-QL-121", "consolidated-q121-en", "en") as any;
assert.equal(q121.difficulty, "Medium");
assert.equal(q121.consolidatedAuditP2.difficultyChanged, true);
assert.equal(q121.consolidatedAuditP2.originalDifficulty, "Hard");
assert.equal(q121.consolidatedAuditP2.localizationStatus, "PENDING_NATIVE_HI_PA_REMEDIATION");
assert.ok(!q121.learnerExplanation.includes("Shortcut:"));
assert.ok(!q121.learnerExplanation.includes("Common trap:"));

for (const language of ["hi", "pa"] as const) {
  assert.throws(
    () => generateConsolidatedAuditTrg001Question("TRG-001-QL-121", `consolidated-q121-${language}`, language),
    (error: any) => error?.statusCode === 409 && error?.code === "TRG001_P2_LOCALIZATION_NOT_READY",
  );
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
  contentLanguages: TRG_001_CONSOLIDATED_AUDIT_P2.contentLanguages,
  localizationStatus: TRG_001_CONSOLIDATED_AUDIT_P2.localizationStatus,
  questionStudioRebound: false,
  productionActivationChanged: false,
}));
