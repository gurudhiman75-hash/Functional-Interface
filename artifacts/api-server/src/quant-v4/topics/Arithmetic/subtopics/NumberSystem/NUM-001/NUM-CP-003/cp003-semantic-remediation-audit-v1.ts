import assert from "node:assert/strict";
import { NUM_CP003_PERMANENT_QL_IDS } from "./permanent/allocation";
import { runNumCp003PermanentPipeline } from "./permanent/runtime";

const SEEDS_PER_QL = 48;

function normalizeStem(value: string) {
  return value
    .toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\b/gu, "#")
    .replace(/\s+/gu, " ")
    .trim();
}

function numericSignature(value: string) {
  return (value.match(/\b\d+(?:\.\d+)?\b/gu) ?? []).join("|");
}

const perQl: any[] = [];

for (const qlId of NUM_CP003_PERMANENT_QL_IDS) {
  const stems = new Set<string>();
  const structures = new Set<string>();
  const answers = new Set<string>();
  const numeric = new Set<string>();
  let minExplanationLength = Number.POSITIVE_INFINITY;

  for (let index = 0; index < SEEDS_PER_QL; index += 1) {
    const seed = `NUM-CP003-SEMANTIC-AUDIT-V1:${qlId}:${index + 1}`;
    const q: any = runNumCp003PermanentPipeline({
      questionLanguageId: qlId,
      seed,
      language: "en",
    });

    const lifecycle = q.lifecycle ?? q;
    assert.equal(Boolean(lifecycle.active), false, qlId + ": active gate opened");
    assert.equal(Boolean(lifecycle.questionStudioDiscoverable), false, qlId + ": Question Studio gate opened");
    assert.equal(Boolean(lifecycle.questionBankWritable), false, qlId + ": Question Bank gate opened");
    assert.equal(Boolean(lifecycle.testEligible), false, qlId + ": test gate opened");
    assert.equal(Boolean(lifecycle.publiclyPublishable), false, qlId + ": public gate opened");

    const options = q.options.map((option: any) => String(option));
    const expectedOptionCount = qlId === "NUM-QL-016" ? 5 : 4;
    assert.equal(options.length, expectedOptionCount, qlId + ": option count drift");
    assert.equal(new Set(options).size, expectedOptionCount, qlId + ": duplicate options");
    assert.equal(options[q.correctIndex], String(q.answer), qlId + ": answer/index drift");
    assert.equal(String(q.validation?.verifierAnswer), String(q.answer), qlId + ": verifier drift");

    const explanation = JSON.stringify(q.explanation);
    stems.add(String(q.stem));
    structures.add(normalizeStem(String(q.stem)));
    answers.add(String(q.answer));
    numeric.add(numericSignature(String(q.stem)));
    minExplanationLength = Math.min(minExplanationLength, explanation.length);
  }

  perQl.push({
    qlId,
    rawStemCount: stems.size,
    normalizedStemStructureCount: structures.size,
    answerCount: answers.size,
    numericSignatureCount: numeric.size,
    minExplanationLength,
  });
}

for (const row of perQl) {
  assert.ok(row.rawStemCount >= 8, row.qlId + ": raw learner-stem breadth below 8 over extended sample");
  assert.ok(row.numericSignatureCount >= 6, row.qlId + ": numeric-state breadth below 6 over extended sample");
  assert.ok(row.minExplanationLength >= 200, row.qlId + ": explanation depth regressed");
}

const ql009 = perQl.find((row) => row.qlId === "NUM-QL-009");
assert.ok(ql009.answerCount >= 4, "NUM-QL-009: ordered-pair count answer breadth remains below 4");

const ql011 = perQl.find((row) => row.qlId === "NUM-QL-011");
assert.equal(ql011.answerCount, 3, "NUM-QL-011: solution-class authority must expose exactly three legitimate classes");

for (const qlId of ["NUM-QL-012", "NUM-QL-013", "NUM-QL-014"]) {
  const row = perQl.find((item) => item.qlId === qlId);
  assert.ok(row.rawStemCount >= 8, qlId + ": fixed-form authority lacks state variation");
  assert.ok(row.numericSignatureCount >= 8, qlId + ": fixed-form authority lacks numeric-state variation");
}

console.log(JSON.stringify({
  version: "NUM-CP-003-SEMANTIC-REMEDIATION-AUDIT-V1",
  qlCount: perQl.length,
  seedsPerQl: SEEDS_PER_QL,
  semanticExceptions: {
    "NUM-QL-011": "Three-class solution-count authority: none / exactly one / more than one.",
    "NUM-QL-012": "Fixed-form n-digit extremum multiple; variation is state-driven.",
    "NUM-QL-013": "Fixed-form inclusive-range multiple count; variation is state-driven.",
    "NUM-QL-014": "Fixed-form repeated-numeral divisibility; variation is state-driven.",
  },
  perQl,
}, null, 2));
console.log("PASS_NUM_CP003_SEMANTIC_REMEDIATION_AUDIT_V1");
