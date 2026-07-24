import { strict as assert } from "node:assert";
import { auditPnc001Coverage } from "./foundation/coverage-auditor";
import { getPnc001QuestionEntries, getPnc001QuestionLanguageIds } from "./foundation/library";
import { combinationExact, factorialExact, multisetOvercountFactorExact, multisetPermutationExact, permutationExact, powerExact, productExact } from "./foundation/math";
import { runPnc001Pipeline } from "./foundation/pipeline";

const entries = getPnc001QuestionEntries();
const currentCheckpointIds = Array.from({ length: 104 }, (_, index) => `PNC-QL-${String(index + 1).padStart(3, "0")}`);
assert.equal(entries.length, currentCheckpointIds.length);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, currentCheckpointIds.length);
assert.deepEqual(getPnc001QuestionLanguageIds(), currentCheckpointIds);

const observedDifficultyCounts = Object.fromEntries(
  ["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]),
);
assert.deepEqual(observedDifficultyCounts, { Easy: 39, Medium: 44, Hard: 21 });

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
  arrangeAllDistinctObjects: 3,
  arrangeRFromNDistinctObjects: 3,
  recoverPermutationParameter: 2,
  selectRFromNDistinctObjects: 5,
  recoverCombinationParameter: 2,
  recoverComplementaryCombinationIndex: 1,
  formNumbersWithoutRepetitionNoZero: 1,
  formNumbersWithoutRepetitionWithZero: 1,
  formCodesWithRepetition: 1,
  formNumbersWithRepetitionAndZero: 1,
  formParityNumbersWithoutRepetition: 3,
  formDivisibleByFiveNumbersWithoutRepetition: 1,
  formNumbersAboveLeadingThreshold: 1,
  formAlphanumericCodes: 1,
  recoverSymbolCountForCode: 1,
  formCodesWithExactlyOnePair: 1,
  arrangeAllMultisetObjects: 4,
  arrangeMultisetAfterFixingPosition: 2,
  findMultisetOvercountFactor: 1,
  recoverMultisetMultiplicity: 1,
  selectThenAssignDistinctRoles: 4,
  selectThenArrangeAllSelected: 2,
  findRoleAssignmentMultiplier: 1,
  recoverSelectionRoleParameter: 3,
} as const;
for (const [mode, observed] of Object.entries(observedSolveModeCounts)) {
  assert.equal(entries.filter((entry) => String(entry.solveMode) === mode).length, observed, mode);
}

const audit = auditPnc001Coverage();
assert.equal(audit.valid, true, JSON.stringify(audit, null, 2));

let generated = 0;
for (const questionLanguageId of currentCheckpointIds) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `pnc-proof:${questionLanguageId}:${index}`;
    const first = runPnc001Pipeline({ questionLanguageId, seed });
    const second = runPnc001Pipeline({ questionLanguageId, seed });
    assert.equal(first.validation.valid, true, `${questionLanguageId}:${index}:${JSON.stringify(first.validation.checks.filter((item) => !item.passed))}`);
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

assert.equal(runPnc001Pipeline({ questionLanguageId: "PNC-QL-001", seed: "product" }).solver.evidence.operation, "PRODUCT");
assert.equal(runPnc001Pipeline({ questionLanguageId: "PNC-QL-015", seed: "sum" }).solver.evidence.operation, "SUM");
assert.equal(runPnc001Pipeline({ questionLanguageId: "PNC-QL-025", seed: "cases" }).solver.evidence.caseCounts?.length, 2);
const factorial = runPnc001Pipeline({ questionLanguageId: "PNC-QL-049", seed: "factorial" });
assert.equal(factorial.solver.numericAnswer, factorialExact(factorial.solver.evidence.factorialArgument!));
const permutation = runPnc001Pipeline({ questionLanguageId: "PNC-QL-062", seed: "permutation" });
assert.equal(permutation.solver.numericAnswer, permutationExact(permutation.solver.evidence.permutationTotalObjects!, permutation.solver.evidence.permutationSelectedObjects!));
const combination = runPnc001Pipeline({ questionLanguageId: "PNC-QL-067", seed: "combination" });
assert.equal(combination.solver.numericAnswer, combinationExact(combination.solver.evidence.combinationTotalObjects!, combination.solver.evidence.combinationSelectedObjects!));

const apple = runPnc001Pipeline({ questionLanguageId: "PNC-QL-075", seed: "apple" });
assert.equal(apple.canonicalProblemId, "PNC-CP-005");
assert.equal(apple.solver.numericAnswer, multisetPermutationExact(5, [2]));
const overcount = runPnc001Pipeline({ questionLanguageId: "PNC-QL-081", seed: "overcount" });
assert.equal(overcount.solver.numericAnswer, multisetOvercountFactorExact(overcount.solver.evidence.multisetMultiplicities!));

const zeroNumber = runPnc001Pipeline({ questionLanguageId: "PNC-QL-084", seed: "zero-number" });
assert.equal(zeroNumber.solver.evidence.firstPositionChoices, zeroNumber.solver.evidence.symbolCount! - 1);
const evenWithZero = runPnc001Pipeline({ questionLanguageId: "PNC-QL-088", seed: "even-zero" });
assert.equal(evenWithZero.solver.evidence.caseCounts?.length, 2);
const divisibleByFive = runPnc001Pipeline({ questionLanguageId: "PNC-QL-090", seed: "five" });
assert.deepEqual(divisibleByFive.solver.evidence.eligibleLastDigits, [0, 5]);
const codeInverse = runPnc001Pipeline({ questionLanguageId: "PNC-QL-093", seed: "code-inverse" });
assert.equal(powerExact(codeInverse.solver.numericAnswer, codeInverse.solver.evidence.digitLength!), codeInverse.solver.evidence.codeTarget);
const onePair = runPnc001Pipeline({ questionLanguageId: "PNC-QL-094", seed: "one-pair" });
assert.equal(onePair.solver.evidence.patternArrangementCount, 12);

const chair = runPnc001Pipeline({ questionLanguageId: "PNC-QL-095", seed: "chair" });
assert.equal(chair.canonicalProblemId, "PNC-CP-006");
assert.equal(chair.solver.evidence.operation, "MIXED_SELECT_ASSIGN");
assert.equal(chair.solver.evidence.mixedRoleCount, 1);
assert.equal(chair.solver.numericAnswer, productExact([
  combinationExact(chair.solver.evidence.mixedTotalObjects!, chair.solver.evidence.mixedSelectedObjects!),
  permutationExact(chair.solver.evidence.mixedSelectedObjects!, 1),
]));
const captainVice = runPnc001Pipeline({ questionLanguageId: "PNC-QL-096", seed: "captain-vice" });
assert.equal(captainVice.solver.evidence.mixedRoleCount, 2);
const allSelected = runPnc001Pipeline({ questionLanguageId: "PNC-QL-099", seed: "arrange-selected" });
assert.equal(allSelected.solver.evidence.operation, "MIXED_SELECT_ARRANGE_ALL");
assert.equal(allSelected.solver.numericAnswer, permutationExact(allSelected.solver.evidence.mixedTotalObjects!, allSelected.solver.evidence.mixedSelectedObjects!));
const multiplier = runPnc001Pipeline({ questionLanguageId: "PNC-QL-101", seed: "multiplier" });
assert.equal(multiplier.solver.numericAnswer, permutationExact(multiplier.solver.evidence.mixedSelectedObjects!, multiplier.solver.evidence.mixedRoleCount!));
for (const qlId of ["PNC-QL-102", "PNC-QL-103", "PNC-QL-104"] as const) {
  const inverse = runPnc001Pipeline({ questionLanguageId: qlId, seed: `inverse:${qlId}` });
  assert.equal(inverse.solver.evidence.operation, "MIXED_INVERSE");
  assert.equal(productExact([
    combinationExact(inverse.solver.evidence.mixedTotalObjects!, inverse.solver.evidence.mixedSelectedObjects!),
    permutationExact(inverse.solver.evidence.mixedSelectedObjects!, inverse.solver.evidence.mixedRoleCount!),
  ]), inverse.solver.evidence.mixedTarget);
}

for (const [cpId, seed] of [
  ["PNC-CP-002", "cp2-routing"], ["PNC-CP-003", "cp3-routing"], ["PNC-CP-004", "cp4-routing"],
  ["PNC-CP-005", "cp5-routing"], ["PNC-CP-006", "cp6-routing"],
] as const) assert.equal(runPnc001Pipeline(cpId, { seed }).canonicalProblemId, cpId);
for (const language of ["hi", "pa"] as const) assert.throws(() => runPnc001Pipeline({ questionLanguageId: "PNC-QL-001", seed: "unsupported", language }), /English only/);

console.log(JSON.stringify({
  checkpointQlCount: entries.length,
  activeCanonicalProblems: 6,
  observedDifficultyCounts,
  observedSolveModeCounts,
  seedsPerQl: 12,
  generated,
  audit,
  status: "PASS",
}, null, 2));
