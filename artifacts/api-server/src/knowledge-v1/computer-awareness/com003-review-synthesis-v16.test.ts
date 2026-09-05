import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V16, auditCom003V16 } from "./com003-review-synthesis-v16";

const audit = auditCom003V16();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V16.length, 228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V16.map((question) => question.qlId)).size, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const questions = COM003_ENGLISH_REVIEW_CORPUS_V16.filter((question) => question.qlId === ql.qlId);
  assert.equal(questions.length, 12, `${ql.qlId}:count`);
  assert.equal(new Set(questions.map((question) => question.stem.toLowerCase())).size, 12, `${ql.qlId}:duplicate stems`);
  for (const family of ["DIRECT_RECALL", "FUNCTIONAL_APPLICATION", "EXAMPLE_RECOGNITION", "CONTRAST_DISCRIMINATION"] as const) {
    assert.equal(questions.filter((question) => question.examSurfaceFamily === family).length, 3, `${ql.qlId}:${family}`);
  }
}

for (const question of COM003_ENGLISH_REVIEW_CORPUS_V16) {
  assert.equal(question.options.length, 4, `${question.questionId}:options`);
  assert.equal(new Set(question.options).size, 4, `${question.questionId}:duplicate options`);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `${question.questionId}:answer position`);
  assert.equal(question.stemAuthority, "COM003_V16_EDITORIAL_EXAM_REALNESS_AUTHORITY");
  assert.equal(question.editorialAuthority, "COM003_V16_HUMAN_ARTIFACT_REMEDIATION");
  assert.match(question.stem, /\?$/);
  assert.ok(question.explanation.length >= 20, `${question.questionId}:thin explanation`);
}

const byFact = (factId: string) => COM003_ENGLISH_REVIEW_CORPUS_V16.filter((question) => question.targetFactId === factId);
for (const question of byFact("com003-excel-line-chart")) {
  assert.doesNotMatch(question.stem, /commonly used to commonly shows/i);
  assert.match(question.explanation, /show trends/i);
}
for (const question of byFact("com003-excel-bar-chart")) {
  assert.doesNotMatch(question.stem, /For illustrates/i);
  assert.match(question.explanation, /compare values/i);
}
for (const question of byFact("com003-powerpoint-animation-definition")) {
  assert.match(question.explanation, /objects? on a slide/i);
  assert.match(question.explanation, /transition/i);
}
for (const question of byFact("com003-powerpoint-transition-definition")) {
  assert.match(question.explanation, /between slides|one slide to the next/i);
  assert.match(question.explanation, /Animation/i);
}
for (const question of byFact("com003-powerpoint-shortcut-f5")) {
  assert.equal(question.canonicalAnswer, "F5");
  assert.match(question.stem, /beginning|first slide|slide 1/i);
  assert.match(question.explanation, /Shift\+F5/);
}
for (const question of byFact("com003-powerpoint-shortcut-shift-f5")) {
  assert.equal(question.canonicalAnswer, "Shift+F5");
  assert.match(question.stem, /current slide|currently selected slide/i);
  assert.match(question.explanation, /F5/);
}

console.log("[COM003-V16]", {
  questions: 228,
  qls: 19,
  familyBalance: "3x4_PER_QL",
  semanticBase: "V15_UNCHANGED",
  editorialRemediation: "PASS",
  governance: "REVIEW_ONLY",
});
