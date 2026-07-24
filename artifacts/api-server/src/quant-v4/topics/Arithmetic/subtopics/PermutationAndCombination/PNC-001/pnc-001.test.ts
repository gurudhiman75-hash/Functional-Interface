import { strict as assert } from "node:assert";
import { auditPnc001Coverage } from "./foundation/coverage-auditor";
import { getPnc001QuestionEntries, getPnc001QuestionLanguageIds } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

const entries = getPnc001QuestionEntries();
const expectedIds = Array.from({ length: 48 }, (_, index) => `PNC-QL-${String(index + 1).padStart(3, "0")}`);
assert.equal(entries.length, 48);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, 48);
assert.deepEqual(getPnc001QuestionLanguageIds(), expectedIds);

const difficultyCounts = Object.fromEntries(["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]));
assert.deepEqual(difficultyCounts, { Easy: 22, Medium: 18, Hard: 8 });

const solveModeCounts = {
  countSequentialIndependentChoices: 14,
  countMutuallyExclusiveAlternatives: 10,
  countDisjointCasePartition: 10,
  countUsingSimpleComplement: 8,
  recoverMissingStageChoiceCount: 6,
} as const;
for (const [mode, expected] of Object.entries(solveModeCounts)) {
  assert.equal(entries.filter((entry) => entry.solveMode === mode).length, expected, mode);
}

const audit = auditPnc001Coverage();
assert.equal(audit.valid, true, JSON.stringify(audit, null, 2));

let generated = 0;
for (const questionLanguageId of expectedIds) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `pnc-proof:${questionLanguageId}:${index}`;
    const first = runPnc001Pipeline({ questionLanguageId, seed });
    const second = runPnc001Pipeline({ questionLanguageId, seed });
    assert.equal(first.validation.valid, true, `${questionLanguageId}:${index}`);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.answer, second.answer);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    assert.equal(first.independentVerification.answer, first.solver.numericAnswer);
    assert.equal(first.options[first.correctIndex], first.answer);
    assert.equal(new Set(first.options).size, 4);
    generated += 1;
  }
}

const product = runPnc001Pipeline({ questionLanguageId: "PNC-QL-001", seed: "product" });
assert.equal(product.solver.evidence.operation, "PRODUCT");
const alternatives = runPnc001Pipeline({ questionLanguageId: "PNC-QL-015", seed: "sum" });
assert.equal(alternatives.solver.evidence.operation, "SUM");
const cases = runPnc001Pipeline({ questionLanguageId: "PNC-QL-025", seed: "cases" });
assert.equal(cases.solver.evidence.caseCounts?.length, 2);
const complement = runPnc001Pipeline({ questionLanguageId: "PNC-QL-035", seed: "complement" });
assert.equal(complement.solver.evidence.totalCount! - complement.solver.evidence.invalidCount!, complement.solver.numericAnswer);
const recovery = runPnc001Pipeline({ questionLanguageId: "PNC-QL-043", seed: "recovery" });
assert.equal(recovery.parameters.values.totalChoices! / recovery.parameters.values.knownChoices!, recovery.solver.numericAnswer);

for (const language of ["hi", "pa"] as const) {
  assert.throws(() => runPnc001Pipeline({ questionLanguageId: "PNC-QL-001", seed: "unsupported", language }), /English only/);
}

console.log(JSON.stringify({ qlCount: entries.length, difficultyCounts, solveModeCounts, seedsPerQl: 12, generated, audit, status: "PASS" }, null, 2));
