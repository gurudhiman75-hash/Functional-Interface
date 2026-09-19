import assert from "node:assert/strict";
import { SCI_CP011_LOCALIZATION_V1, validateSciCp011LocalizationV1 } from "./sci-cp011-localization-v1";

const result = validateSciCp011LocalizationV1();
assert.equal(result.valid, true, result.errors.join("; "));
assert.deepEqual(result.counts, { hi: 60, pa: 60 });
assert.deepEqual(result.difficultyCounts.hi, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(result.difficultyCounts.pa, { Easy: 18, Medium: 30, Hard: 12 });
assert.deepEqual(result.answerPositionCounts.hi, { A: 15, B: 15, C: 15, D: 15 });
assert.deepEqual(result.answerPositionCounts.pa, { A: 15, B: 15, C: 15, D: 15 });
assert.equal(new Set(SCI_CP011_LOCALIZATION_V1.hi.map((q) => q.sourceQuestionId)).size, 60);
assert.equal(new Set(SCI_CP011_LOCALIZATION_V1.pa.map((q) => q.sourceQuestionId)).size, 60);
assert.ok(SCI_CP011_LOCALIZATION_V1.hi.every((q) => q.locale === "hi-IN"));
assert.ok(SCI_CP011_LOCALIZATION_V1.pa.every((q) => q.locale === "pa-IN"));
assert.ok([...SCI_CP011_LOCALIZATION_V1.hi, ...SCI_CP011_LOCALIZATION_V1.pa].every((q) => q.localizationReviewOnly && !q.localizationFrozen && !q.runtimeRegistered));

console.log(JSON.stringify({
  status: "PASS",
  cp: "SCI-CP-011",
  EnglishSources: 60,
  HindiQuestions: SCI_CP011_LOCALIZATION_V1.hi.length,
  PunjabiQuestions: SCI_CP011_LOCALIZATION_V1.pa.length,
  difficulty: result.difficultyCounts,
  answerPositions: result.answerPositionCounts,
  lifecycle: "localization-review-only / runtime-closed",
}, null, 2));
