import { strict as assert } from "node:assert";

import {
  COM003_ENGLISH_REVIEW_CORPUS_V2,
  auditCom003EnglishReviewSynthesisV2,
  buildCom003EnglishReviewCorpusV2,
} from "./com003-review-synthesis-v2";

const audit = auditCom003EnglishReviewSynthesisV2();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questionCount, 228);
assert.equal(audit.qlCount, 19);
assert.equal(audit.coverage.every((entry) => entry.questionCount === 12), true);
assert.equal(audit.coverage.every((entry) => entry.uniqueStemCount >= 6), true);
assert.equal(audit.v1Remediation.versionContextEnforced, true);
assert.equal(audit.v1Remediation.ql012ReverseSurfaceAdded, true);
assert.equal(
  audit.coverage.find((entry) => entry.qlId === "COM-003-QL-012")?.surfaceModes.includes("EFFECT_FROM_FEATURE"),
  true,
);
assert.equal(
  audit.coverage.find((entry) => entry.qlId === "COM-003-QL-012")?.surfaceModes.includes("FEATURE_FROM_EFFECT"),
  true,
);

const deterministicA = buildCom003EnglishReviewCorpusV2({ perQl: 3, seedPrefix: "determinism-v2" });
const deterministicB = buildCom003EnglishReviewCorpusV2({ perQl: 3, seedPrefix: "determinism-v2" });
assert.deepEqual(deterministicA, deterministicB);

for (const question of COM003_ENGLISH_REVIEW_CORPUS_V2) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.toLowerCase())).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  if (question.versionScoped && /SHORTCUT|ACCESS|SLIDESHOW/i.test(question.surfaceMode)) {
    assert.match(question.stem, /Windows desktop/i);
  }
}

console.log("[COM003-ENGLISH-REVIEW-SYNTHESIS-V2]", audit);
