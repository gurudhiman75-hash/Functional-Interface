import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V9, buildCom003EnglishReviewCorpusV9 } from "./com003-review-synthesis-v9";

const BANNED_EDITORIAL_LANGUAGE = /\b(?:appropriate|which action|practical effect|correct choice|correctly represents|associated with|example or description|requirement|invokes?|distinguish|quickest keyboard|key combination)\b/i;

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V9.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V9.map((q) => q.qlId)).size, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const qs = COM003_ENGLISH_REVIEW_CORPUS_V9.filter((q) => q.qlId === ql.qlId);
  assert.equal(qs.length, 12, `${ql.qlId}:count`);
  assert.equal(new Set(qs.map((q) => q.stem.toLowerCase())).size, 12, `${ql.qlId}:duplicate stems`);
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V9) {
  assert.equal(q.options.length, 4, `${q.questionId}:options`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}:answer binding`);
  assert.equal(q.stemAuthority, "COM003_V9_SIMPLE_EXAM_LANGUAGE_AUTHORITY");
  assert.ok(q.stem.endsWith("?"), `${q.questionId}:not a question:${q.stem}`);
  assert.ok(q.stem.split(/\s+/).length <= 28, `${q.questionId}:too wordy:${q.stem}`);
  assert.ok(!BANNED_EDITORIAL_LANGUAGE.test(q.stem), `${q.questionId}:editorial language:${q.stem}`);
  assert.ok(!/correct answer for/i.test(q.stem), `${q.questionId}:unsupported surface mode:${q.surfaceMode}`);
  if (q.versionScoped && /SHORTCUT|SLIDESHOW/i.test(q.surfaceMode)) {
    assert.match(q.stem, /Windows desktop/i, `${q.questionId}:missing Windows desktop scope`);
  }
}

assert.deepEqual(
  buildCom003EnglishReviewCorpusV9({ seedPrefix: "replay" }),
  buildCom003EnglishReviewCorpusV9({ seedPrefix: "replay" }),
);

console.log("[COM003-V9]", {
  questions: COM003_ENGLISH_REVIEW_CORPUS_V9.length,
  qls: 19,
  wording: "SIMPLE_STANDARD_EXAM_LANGUAGE",
  answerBinding: "STRICT",
});
