import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import {
  COM003_ENGLISH_REVIEW_CORPUS_V16_2,
  auditCom003V162,
} from "./com003-review-synthesis-v16-2";

const audit = auditCom003V162();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V16_2.length, 228);
assert.equal(COM003_PERMANENT_QLS.length, 19);

const targetQls = new Set(["COM-003-QL-011", "COM-003-QL-014", "COM-003-QL-017", "COM-003-QL-019"]);
for (const ql of COM003_PERMANENT_QLS) {
  const questions = COM003_ENGLISH_REVIEW_CORPUS_V16_2.filter((q) => q.qlId === ql.qlId);
  assert.equal(questions.length, 12, ql.qlId);
  assert.equal(new Set(questions.map((q) => q.stem.toLowerCase())).size, 12, `${ql.qlId}:duplicate stems`);
  const explanationCount = new Set(questions.map((q) => q.explanation.toLowerCase())).size;
  assert.ok(explanationCount >= 4, `${ql.qlId}:thin explanations:${explanationCount}`);
  if (targetQls.has(ql.qlId)) assert.equal(explanationCount, 12, `${ql.qlId}:expected 12 distinct explanations`);
  for (const family of ["DIRECT_RECALL", "FUNCTIONAL_APPLICATION", "EXAMPLE_RECOGNITION", "CONTRAST_DISCRIMINATION"] as const) {
    assert.equal(questions.filter((q) => q.examSurfaceFamily === family).length, 3, `${ql.qlId}:${family}`);
  }
}

for (const q of COM003_ENGLISH_REVIEW_CORPUS_V16_2) {
  assert.ok(q.explanation.trim().length > 0, `${q.questionId}:empty explanation`);
  assert.doesNotMatch(q.explanation, /\b(?:therefore|hence|accordingly),?\s+.*\b(?:correct|answer)\b/i);
}

console.log("[COM003-V16.2]", {
  questions: audit.questions,
  qls: audit.qls,
  explanationUpgradedQls: audit.explanationUpgradedQls,
  semanticAuthority: audit.semanticAuthority,
  stemAuthority: audit.stemAuthority,
  explanationAuthority: audit.explanationAuthority,
  governance: audit.governance,
});
