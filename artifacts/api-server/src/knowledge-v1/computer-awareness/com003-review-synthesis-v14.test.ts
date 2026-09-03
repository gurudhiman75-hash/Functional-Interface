import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V14, auditCom003V14StemUniqueness, buildCom003EnglishReviewCorpusV14 } from "./com003-review-synthesis-v14";

const BANNED_AWKWARD_STEM = /(?:is described as|refers to which|what is is|shortcut for start|Windows desktop version|keyboard shortcut|as applicable|configured\/common|basic numeric-count context|merged outputs|recipient\/data-source|supplied set or range|evenly ordered intervals|individual items or categories|example or description|quickest keyboard|key combination|practical effect|correct choice|correctly represents|\bis can be\b|\bfor supplies\b|\bfor contains\b)/i;

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V14.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V14.map((q) => q.qlId)).size, 19);

for (const row of auditCom003V14StemUniqueness()) {
  assert.equal(row.total, 12, `${row.qlId}:count`);
  assert.equal(row.unique, 12, `${row.qlId}:duplicate stems`);
}

for (const ql of COM003_PERMANENT_QLS) {
  const qs = COM003_ENGLISH_REVIEW_CORPUS_V14.filter((q) => q.qlId === ql.qlId);
  const factCounts = new Map<string, number>();
  for (const q of qs) factCounts.set(q.targetFactId, (factCounts.get(q.targetFactId) ?? 0) + 1);
  const counts = [...factCounts.values()];
  assert.ok(counts.length >= 2, `${ql.qlId}:thin fact coverage`);
  assert.ok(Math.max(...counts) - Math.min(...counts) <= 1, `${ql.qlId}:unbalanced fact coverage`);
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V14) {
  assert.equal(q.options.length, 4, `${q.questionId}:options`);
  assert.equal(new Set(q.options).size, 4, `${q.questionId}:duplicate options`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}:answer binding`);
  assert.equal(q.stemAuthority, "COM003_V14_SIMPLE_DIRECT_EXAM_AUTHORITY");
  assert.ok(q.stem.endsWith("?"), `${q.questionId}:not a question:${q.stem}`);
  assert.match(q.stem, /^[A-Z0-9]/, `${q.questionId}:bad capitalization:${q.stem}`);
  assert.ok(q.stem.split(/\s+/).length <= 28, `${q.questionId}:too wordy:${q.stem}`);
  assert.ok(!BANNED_AWKWARD_STEM.test(q.stem), `${q.questionId}:awkward wording:${q.stem}`);
  assert.ok(!/what does The/.test(q.stem), `${q.questionId}:capitalized article inside stem:${q.stem}`);
  assert.ok(!/Which orientation a page/i.test(q.stem), `${q.questionId}:broken orientation grammar:${q.stem}`);
  assert.ok(!/UNSUPPORTED SURFACE MODE/i.test(q.stem), `${q.questionId}:unsupported:${q.surfaceMode}`);
  if (q.versionScoped && /SHORTCUT|SLIDESHOW/i.test(q.surfaceMode)) {
    assert.match(q.stem, /Windows desktop/i, `${q.questionId}:missing version scope`);
  }
}

assert.deepEqual(
  buildCom003EnglishReviewCorpusV14({ seedPrefix: "replay" }),
  buildCom003EnglishReviewCorpusV14({ seedPrefix: "replay" }),
);

assert.ok(COM003_ENGLISH_REVIEW_CORPUS_V14.some((q) => /Which shortcut is used to/i.test(q.stem)));
assert.ok(COM003_ENGLISH_REVIEW_CORPUS_V14.some((q) => /What is Ctrl\+C used for/i.test(q.stem)));
assert.ok(COM003_ENGLISH_REVIEW_CORPUS_V14.some((q) => /How is an Excel cell address written/i.test(q.stem)));

console.log("[COM003-V14]", {
  questions: 228,
  qls: 19,
  wording: "SIMPLE_DIRECT_EXAM",
  uniqueStemsPerQl: 12,
  answerBinding: "STRICT",
  governance: "REVIEW_ONLY",
});
