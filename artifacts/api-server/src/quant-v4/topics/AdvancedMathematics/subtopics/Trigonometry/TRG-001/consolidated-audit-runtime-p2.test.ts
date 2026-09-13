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
assert.deepEqual(TRG_001_CONSOLIDATED_AUDIT_P2.contentLanguages, ["en", "hi", "pa"]);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.localizationStatus, "NATIVE_HI_PA_REMEDIATION_CANDIDATE");
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.humanLanguageReviewRequired, true);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.questionStudioRebound, false);
assert.equal(TRG_001_CONSOLIDATED_AUDIT_P2.productionActivationChanged, false);

function assertNativeScript(text: string, language: "hi" | "pa") {
  if (language === "hi") assert.match(text, /[\u0900-\u097F]/u);
  else assert.match(text, /[\u0A00-\u0A7F]/u);
}

function assertCleanNativeWording(text: string) {
  assert.ok(!text.includes("तुलना-बिंदु"));
  assert.ok(!text.includes("ਤੁਲਨਾ-ਬਿੰਦੂ"));
  assert.ok(!text.includes("प्राप्त करें"));
  assert.ok(!text.includes("ਪ੍ਰਾਪਤ ਕਰੋ"));
}

const q24En = generateConsolidatedAuditTrg001Question("TRG-001-QL-024", "consolidated-q24", "en") as any;
assert.equal(q24En.solveMode, "compareSinCosFromAcuteInterval");
assert.equal(q24En.difficulty, "Easy");

for (const language of ["hi", "pa"] as const) {
  const q24 = generateConsolidatedAuditTrg001Question("TRG-001-QL-024", "consolidated-q24", language) as any;
  assert.equal(q24.solveMode, q24En.solveMode);
  assert.equal(q24.answer, q24En.answer);
  assert.equal(q24.correctIndex, q24En.correctIndex);
  assertNativeScript(q24.stem, language);
  assertNativeScript(q24.learnerExplanation, language);
  assertCleanNativeWording(q24.learnerExplanation);
}

let q126PyqSeed: string | null = null;
let q126LegacySeed: string | null = null;
for (let index = 0; index < 80; index += 1) {
  const seed = `consolidated-q126-${index}`;
  const q126 = generateConsolidatedAuditTrg001Question("TRG-001-QL-126", seed, "en") as any;
  if (q126.solveMode === "deriveHigherPowerFromTrigQuadraticRelation") q126PyqSeed ??= seed;
  else q126LegacySeed ??= seed;
  if (q126PyqSeed && q126LegacySeed) break;
}
assert.ok(q126PyqSeed, "Expected at least one QL-126 PYQ sibling seed.");
assert.ok(q126LegacySeed, "Expected at least one QL-126 legacy seed.");

for (const seed of [q126PyqSeed!, q126LegacySeed!]) {
  const en = generateConsolidatedAuditTrg001Question("TRG-001-QL-126", seed, "en") as any;
  for (const language of ["hi", "pa"] as const) {
    const localized = generateConsolidatedAuditTrg001Question("TRG-001-QL-126", seed, language) as any;
    assert.equal(localized.solveMode, en.solveMode);
    assert.equal(localized.answer, en.answer);
    assert.equal(localized.correctIndex, en.correctIndex);
    assertNativeScript(localized.stem, language);
    assertNativeScript(localized.learnerExplanation, language);
    assertCleanNativeWording(localized.learnerExplanation);
  }
}

const q143En = generateConsolidatedAuditTrg001Question("TRG-001-QL-143", "consolidated-q143", "en") as any;
assert.equal(q143En.solveMode, "simplifyTrigCubicFactorization");
assert.equal(q143En.difficulty, "Medium");
for (const language of ["hi", "pa"] as const) {
  const q143 = generateConsolidatedAuditTrg001Question("TRG-001-QL-143", "consolidated-q143", language) as any;
  assert.equal(q143.solveMode, q143En.solveMode);
  assert.equal(q143.answer, q143En.answer);
  assert.equal(q143.correctIndex, q143En.correctIndex);
  assertNativeScript(q143.stem, language);
  assertNativeScript(q143.learnerExplanation, language);
  assertCleanNativeWording(q143.learnerExplanation);
}

for (const language of ["en", "hi", "pa"] as const) {
  const q121 = generateConsolidatedAuditTrg001Question("TRG-001-QL-121", `consolidated-q121-${language}`, language) as any;
  assert.equal(q121.difficulty, "Medium");
  assert.equal(q121.consolidatedAuditP2.difficultyChanged, true);
  assert.equal(q121.consolidatedAuditP2.localizationStatus, "NATIVE_HI_PA_REMEDIATION_CANDIDATE");
  assert.ok(!q121.learnerExplanation.includes("Shortcut:"));
  assert.ok(!q121.learnerExplanation.includes("Common trap:"));
  if (language !== "en") {
    assertNativeScript(q121.stem, language);
    assertNativeScript(q121.learnerExplanation, language);
  }
}

for (const language of ["en", "hi", "pa"] as const) {
  for (const qlId of ["TRG-001-QL-024", "TRG-001-QL-121", "TRG-001-QL-126", "TRG-001-QL-143"] as const) {
    const question = generateConsolidatedAuditTrg001Question(qlId, `lock-${language}-${qlId}`, language) as any;
    assert.equal(question.questionStudioDiscoverable, false);
    assert.equal(question.testEligibility, "INELIGIBLE");
    assert.equal(question.publiclyPublishable, false);
  }
}

console.log(JSON.stringify({
  status: "PASS_TRG_001_CONSOLIDATED_AUDIT_P2",
  pyqCoverageQlIds: TRG_001_CONSOLIDATED_AUDIT_P2.pyqCoverageQlIds,
  difficultyRecalibratedQlIds: TRG_001_CONSOLIDATED_AUDIT_P2.difficultyRecalibratedQlIds,
  contentLanguages: TRG_001_CONSOLIDATED_AUDIT_P2.contentLanguages,
  localizationStatus: TRG_001_CONSOLIDATED_AUDIT_P2.localizationStatus,
  q126PyqSeed,
  q126LegacySeed,
  questionStudioRebound: false,
  productionActivationChanged: false,
}));
