import { strict as assert } from "node:assert";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V16_1, auditCom003V161 } from "./com003-review-synthesis-v16-1";

const audit = auditCom003V161();
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V16_1.length, 228);
assert.equal(COM003_PERMANENT_QLS.length, 19);

for (const ql of COM003_PERMANENT_QLS) {
  const questions = COM003_ENGLISH_REVIEW_CORPUS_V16_1.filter((q) => q.qlId === ql.qlId);
  assert.equal(questions.length, 12, ql.qlId);
  assert.equal(new Set(questions.map((q) => q.stem.toLowerCase())).size, 12, `${ql.qlId}:duplicate stems`);
  for (const family of ["DIRECT_RECALL", "FUNCTIONAL_APPLICATION", "EXAMPLE_RECOGNITION", "CONTRAST_DISCRIMINATION"] as const) {
    assert.equal(questions.filter((q) => q.examSurfaceFamily === family).length, 3, `${ql.qlId}:${family}`);
  }
}

const corpusText = COM003_ENGLISH_REVIEW_CORPUS_V16_1.map((q) => `${q.stem}\n${q.explanation}`).join("\n");
assert.doesNotMatch(corpusText, /\bPowerpoint\b/);
assert.doesNotMatch(corpusText, /Which term is described by the following statement|refers to which term|Which term best matches this description/i);
assert.doesNotMatch(corpusText, /used for this purpose:|matches this purpose:|matches this role:|matches this effect:|matches this definition:|has this function:/i);
assert.doesNotMatch(corpusText, /In this (?:direct recall|functional application|example recognition|contrast discrimination) question/i);

const ql14 = COM003_ENGLISH_REVIEW_CORPUS_V16_1.filter((q) => q.qlId === "COM-003-QL-014");
assert.equal(ql14.length, 12);
assert.equal(new Set(ql14.map((q) => q.stem)).size, 12);
assert.ok(ql14.every((q) => /chart/i.test(q.stem)), "QL-014 stems must stay explicitly chart-oriented");

const ql17Pictures = COM003_ENGLISH_REVIEW_CORPUS_V16_1.filter((q) => q.targetFactId === "com003-powerpoint-insert-picture");
assert.ok(ql17Pictures.length >= 3);
assert.ok(ql17Pictures.every((q) => /PowerPoint|slide|picture|image|photograph/i.test(q.stem)));

console.log("[COM003-V16.1]", {
  questions: audit.questions,
  qls: audit.qls,
  semanticAuthority: audit.semanticAuthority,
  editorialBase: audit.editorialBase,
  artifactPolishAuthority: audit.artifactPolishAuthority,
  governance: audit.governance,
});
