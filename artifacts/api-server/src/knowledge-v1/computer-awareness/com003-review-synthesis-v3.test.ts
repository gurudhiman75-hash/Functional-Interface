import { strict as assert } from "node:assert";

import { COM003_ENGLISH_REVIEW_CORPUS_V3, buildCom003EnglishReviewCorpusV3 } from "./com003-review-synthesis-v3";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V3.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V3.map((q) => q.qlId)).size, 19);
for (const ql of COM003_PERMANENT_QLS) {
  assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V3.filter((q) => q.qlId === ql.qlId).length, 12);
}
for (const question of COM003_ENGLISH_REVIEW_CORPUS_V3) {
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options.map((option) => option.trim().toLowerCase())).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.equal(question.sourceIds.length > 0, true);
  assert.equal(question.sourceFactIds.length > 0, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.runtimeRegistered, false);
  if (question.versionScoped && /SHORTCUT|ACCESS|SLIDESHOW/i.test(question.surfaceMode)) {
    assert.match(question.stem, /Windows desktop/i);
  }
}
const replayA = buildCom003EnglishReviewCorpusV3({ perQl: 4, seedPrefix: "v3-replay" });
const replayB = buildCom003EnglishReviewCorpusV3({ perQl: 4, seedPrefix: "v3-replay" });
assert.deepEqual(replayA, replayB);

console.log("[COM003-ENGLISH-REVIEW-SYNTHESIS-V3]", { questionCount: 228, qlCount: 19, deterministic: true, reviewOnly: true });
