import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { expectedCom003V15Answer } from "./com003-review-synthesis-v15";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL,
  auditCom003V15Final,
  buildCom003EnglishReviewCorpusV15Final,
} from "./com003-review-synthesis-v15-finalize";

const audit = auditCom003V15Final();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.map((q) => q.qlId)).size, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const qs = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter((q) => q.qlId === ql.qlId);
  assert.equal(qs.length, 12, `${ql.qlId}:count`);
  assert.equal(new Set(qs.map((q) => q.stem.toLowerCase())).size, 12, `${ql.qlId}:duplicate stems`);
  const familyCounts = new Map<string, number>();
  for (const q of qs) familyCounts.set(q.examSurfaceFamily, (familyCounts.get(q.examSurfaceFamily) ?? 0) + 1);
  assert.equal(familyCounts.size, 4, `${ql.qlId}:surface family coverage`);
  for (const family of ["DIRECT_RECALL", "FUNCTIONAL_APPLICATION", "EXAMPLE_RECOGNITION", "CONTRAST_DISCRIMINATION"]) {
    const count = familyCounts.get(family) ?? 0;
    assert.ok(count >= 2 && count <= 4, `${ql.qlId}:${family}:imbalanced family count ${count}`);
  }
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL) {
  assert.equal(q.options.length, 4, `${q.questionId}:options`);
  assert.equal(new Set(q.options).size, 4, `${q.questionId}:duplicate options`);
  assert.equal(q.options[q.correctIndex], q.canonicalAnswer, `${q.questionId}:answer position`);
  assert.equal(q.canonicalAnswer.trim().toLowerCase(), expectedCom003V15Answer(q).trim().toLowerCase(), `${q.questionId}:target-fact answer contradiction`);
  assert.equal(q.stemAuthority, "COM003_V15_TARGET_FACT_SEMANTIC_AUTHORITY");
  assert.ok(q.stem.endsWith("?"), `${q.questionId}:not a question`);
  assert.ok(!q.stem.endsWith("??"), `${q.questionId}:double question mark`);
}

const wordPurposeDirect = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter(
  (q) => q.examSurfaceFamily === "DIRECT_RECALL" && q.targetFactId === "com003-word-purpose",
);
for (const q of wordPurposeDirect) {
  assert.equal(q.canonicalAnswer, "Microsoft Word");
  assert.match(q.stem, /word processing|creating, editing and formatting documents/i);
  assert.doesNotMatch(q.stem, /spreadsheet work|slide-based presentations/i);
}

const excelPurposeDirect = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter(
  (q) => q.examSurfaceFamily === "DIRECT_RECALL" && q.targetFactId === "com003-excel-purpose",
);
for (const q of excelPurposeDirect) {
  assert.equal(q.canonicalAnswer, "Microsoft Excel");
  assert.match(q.stem, /spreadsheet work|organizing data|calculations/i);
  assert.doesNotMatch(q.stem, /word processing|slide-based presentations/i);
}

const f5 = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter(
  (q) => q.examSurfaceFamily === "DIRECT_RECALL" && q.targetFactId === "com003-powerpoint-shortcut-f5",
);
for (const q of f5) {
  assert.equal(q.canonicalAnswer, "F5");
  assert.match(q.stem, /from the beginning/i);
  assert.doesNotMatch(q.stem, /from the current slide/i);
}

const shiftF5 = COM003_ENGLISH_REVIEW_CORPUS_V15_FINAL.filter(
  (q) => q.examSurfaceFamily === "DIRECT_RECALL" && q.targetFactId === "com003-powerpoint-shortcut-shift-f5",
);
for (const q of shiftF5) {
  assert.equal(q.canonicalAnswer, "Shift+F5");
  assert.match(q.stem, /from the current slide/i);
  assert.doesNotMatch(q.stem, /from the beginning/i);
}

assert.deepEqual(
  buildCom003EnglishReviewCorpusV15Final({ seedPrefix: "semantic-replay" }),
  buildCom003EnglishReviewCorpusV15Final({ seedPrefix: "semantic-replay" }),
);

console.log("[COM003-V15]", {
  questions: 228,
  qls: 19,
  directRecallSemanticBinding: "TARGET_FACT_BOUND",
  canonicalAnswerAuthority: "GOVERNED_FACT_RELATION",
  learnerSurfaceNormalization: "PASS",
  familyCoverage: "4_FAMILIES_BALANCED",
  knownCrossTargetRegressions: "BLOCKED",
  governance: "REVIEW_ONLY",
});
