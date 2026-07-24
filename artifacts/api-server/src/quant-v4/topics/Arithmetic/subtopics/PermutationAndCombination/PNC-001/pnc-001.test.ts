import { strict as assert } from "node:assert";
import { auditPnc001Coverage } from "./foundation/coverage-auditor";
import { getPnc001QuestionEntries, getPnc001QuestionLanguageIds } from "./foundation/library";
import { runPnc001Pipeline } from "./foundation/pipeline";

const entries = getPnc001QuestionEntries();

// These assertions protect the current reviewed checkpoint from accidental
// deletion or ID drift. They are not design targets for future expansion.
const currentCheckpointIds = Array.from({ length: 58 }, (_, index) => `PNC-QL-${String(index + 1).padStart(3, "0")}`);
assert.equal(entries.length, currentCheckpointIds.length);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, currentCheckpointIds.length);
assert.deepEqual(getPnc001QuestionLanguageIds(), currentCheckpointIds);

const observedDifficultyCounts = Object.fromEntries(
  ["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]),
);
assert.deepEqual(observedDifficultyCounts, { Easy: 27, Medium: 22, Hard: 9 });

const observedSolveModeCounts = {
  countSequentialIndependentChoices: 14,
  countMutuallyExclusiveAlternatives: 10,
  countDisjointCasePartition: 10,
  countUsingSimpleComplement: 8,
  recoverMissingStageChoiceCount: 6,
  evaluateFactorialValue: 2,
  evaluateFactorialUnitExpression: 2,
  simplifyFactorialQuotient: 3,
  recoverFactorialArgument: 2,
  recoverFactorialQuotientArgument: 1,
} as const;
for (const [mode, observed] of Object.entries(observedSolveModeCounts)) {
  assert.equal(entries.filter((entry) => entry.solveMode === mode).length, observed, mode);
}

const audit = auditPnc001Coverage();
assert.equal(audit.valid, true, JSON.stringify(audit, null, 2));

let generated = 0;
for (const questionLanguageId of currentCheckpointIds) {
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

const factorial = runPnc001Pipeline({ questionLanguageId: "PNC-QL-049", seed: "factorial" });
assert.equal(factorial.solver.evidence.operation, "FACTORIAL");
const factorialUnit = runPnc001Pipeline({ questionLanguageId: "PNC-QL-051", seed: "factorial-unit" });
assert.equal(factorialUnit.solver.evidence.operation, "FACTORIAL_UNIT_EXPRESSION");
const factorialQuotient = runPnc001Pipeline({ questionLanguageId: "PNC-QL-053", seed: "factorial-quotient" });
assert.equal(factorialQuotient.solver.evidence.operation, "FACTORIAL_QUOTIENT");
const factorialInverse = runPnc001Pipeline({ questionLanguageId: "PNC-QL-056", seed: "factorial-inverse" });
assert.equal(factorialInverse.solver.evidence.operation, "FACTORIAL_INVERSE");
const quotientInverse = runPnc001Pipeline({ questionLanguageId: "PNC-QL-058", seed: "factorial-quotient-inverse" });
assert.equal(quotientInverse.solver.evidence.operation, "FACTORIAL_QUOTIENT_INVERSE");
assert.equal(
  quotientInverse.solver.numericAnswer * (quotientInverse.solver.numericAnswer - 1),
  quotientInverse.parameters.values.target,
);

for (const language of ["hi", "pa"] as const) {
  assert.throws(() => runPnc001Pipeline({ questionLanguageId: "PNC-QL-001", seed: "unsupported", language }), /English only/);
}

console.log(JSON.stringify({
  checkpointQlCount: entries.length,
  observedDifficultyCounts,
  observedSolveModeCounts,
  seedsPerQl: 12,
  generated,
  audit,
  status: "PASS",
}, null, 2));