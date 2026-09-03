import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V12, buildCom003EnglishReviewCorpusV12 } from "./com003-review-synthesis-v12";

const BANNED_NON_EXAM_LANGUAGE = /\b(?:appropriate|action|task|practical effect|correct choice|correctly represents|associated with|example or description|requirement|invokes?|distinguish(?:es|ed|ing)?|quickest keyboard|key combination)\b/i;

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V12.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V12.map((q) => q.qlId)).size, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const qs = COM003_ENGLISH_REVIEW_CORPUS_V12.filter((q) => q.qlId === ql.qlId);
  assert.equal(qs.length, 12, `${ql.qlId}:count`);
  assert.equal(new Set(qs.map((q) => q.stem.toLowerCase())).size, 12, `${ql.qlId}:duplicate stems`);

  const factCounts = new Map<string, number>();
  for (const q of qs) factCounts.set(q.targetFactId, (factCounts.get(q.targetFactId) ?? 0) + 1);
  const counts = [...factCounts.values()];
  assert.ok(counts.length >= 2, `${ql.qlId}:thin fact coverage`);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${ql.qlId}:unbalanced fact coverage:${JSON.stringify(Object.fromEntries(factCounts))}`);
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V12) {
  assert.equal(q.options.length, 4, `${q.questionId}:options`);
  assert.equal(new Set(q.options).size, 4, `${q.questionId}:duplicate options`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}:answer binding`);
  assert.equal(q.stemAuthority, "COM003_V12_STANDARD_EXAM_WORDING_AUTHORITY");
  assert.ok(q.stem.endsWith("?"), `${q.questionId}:not a question:${q.stem}`);
  assert.ok(q.stem.split(/\s+/).length <= 32, `${q.questionId}:too wordy:${q.stem}`);
  assert.ok(!BANNED_NON_EXAM_LANGUAGE.test(q.stem), `${q.questionId}:non-exam wording:${q.stem}`);
  assert.ok(!/UNSUPPORTED SURFACE MODE/i.test(q.stem), `${q.questionId}:unsupported surface:${q.surfaceMode}`);
  assert.ok(!/used to (?:word processing|spreadsheet work|creating slide-based presentations)/i.test(q.stem), `${q.questionId}:bad purpose grammar:${q.stem}`);
  if (q.versionScoped && /SHORTCUT|SLIDESHOW/i.test(q.surfaceMode)) {
    assert.match(q.stem, /Windows desktop/i, `${q.questionId}:missing Windows desktop scope`);
  }
}

assert.deepEqual(
  buildCom003EnglishReviewCorpusV12({ seedPrefix: "replay" }),
  buildCom003EnglishReviewCorpusV12({ seedPrefix: "replay" }),
);

console.log("[COM003-V12]", {
  questions: COM003_ENGLISH_REVIEW_CORPUS_V12.length,
  qls: 19,
  wording: "STANDARD_PLAIN_EXAM_LANGUAGE",
  factCoverage: "BALANCED",
  answerBinding: "STRICT",
});
