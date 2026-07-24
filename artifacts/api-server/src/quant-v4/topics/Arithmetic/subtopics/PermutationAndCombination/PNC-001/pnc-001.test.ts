import { strict as assert } from "node:assert";
import { auditPnc001Coverage } from "./foundation/coverage-auditor";
import { getPnc001QuestionEntries, getPnc001QuestionLanguageIds } from "./foundation/library";
import { multisetOvercountFactorExact, multisetPermutationExact, powerExact } from "./foundation/math";
import { runPnc001Pipeline } from "./foundation/pipeline";

const entries = getPnc001QuestionEntries();

// This protects the current reviewed checkpoint from accidental deletion or ID
// drift. It does not define a final package or family size.
const currentCheckpointIds = Array.from({ length: 94 }, (_, index) => `PNC-QL-${String(index + 1).padStart(3, "0")}`);
assert.equal(entries.length, currentCheckpointIds.length);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, currentCheckpointIds.length);
assert.deepEqual(getPnc001QuestionLanguageIds(), currentCheckpointIds);

const observedDifficultyCounts = Object.fromEntries(
  ["Easy", "Medium", "Hard"].map((difficulty) => [difficulty, entries.filter((entry) => entry.difficulty === difficulty).length]),
);
assert.deepEqual(observedDifficultyCounts, { Easy: 37, Medium: 39, Hard: 18 });

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
assert.equal(quotientInverse.solver.numericAnswer * (quotientInverse.solver.numericAnswer - 1), quotientInverse.parameters.values.target);

const arrangeAll = runPnc001Pipeline({ questionLanguageId: "PNC-QL-059", seed: "arrange-all" });
assert.equal(arrangeAll.canonicalProblemId, "PNC-CP-002");
assert.equal(arrangeAll.solver.evidence.operation, "PERMUTATION_ALL");
assert.equal(arrangeAll.solver.evidence.permutationSelectedObjects, arrangeAll.solver.evidence.permutationTotalObjects);
const arrangePartial = runPnc001Pipeline({ questionLanguageId: "PNC-QL-062", seed: "arrange-partial" });
assert.equal(arrangePartial.solver.evidence.operation, "PERMUTATION_PARTIAL");
assert.equal(arrangePartial.solver.evidence.permutationFactors?.length, arrangePartial.solver.evidence.permutationSelectedObjects);
const recoverN = runPnc001Pipeline({ questionLanguageId: "PNC-QL-065", seed: "recover-permutation-n" });
assert.equal(recoverN.solver.evidence.operation, "PERMUTATION_INVERSE");
assert.equal(recoverN.solver.evidence.recoveredPermutationParameter, "n");
const recoverR = runPnc001Pipeline({ questionLanguageId: "PNC-QL-066", seed: "recover-permutation-r" });
assert.equal(recoverR.solver.evidence.recoveredPermutationParameter, "r");

const directCombination = runPnc001Pipeline({ questionLanguageId: "PNC-QL-067", seed: "direct-combination" });
assert.equal(directCombination.canonicalProblemId, "PNC-CP-003");
assert.equal(directCombination.solver.evidence.operation, "COMBINATION_DIRECT");
const pairCombination = runPnc001Pipeline({ questionLanguageId: "PNC-QL-070", seed: "pair-combination" });
assert.equal(pairCombination.solver.evidence.combinationSelectedObjects, 2);
const tripleCombination = runPnc001Pipeline({ questionLanguageId: "PNC-QL-071", seed: "triple-combination" });
assert.equal(tripleCombination.solver.evidence.combinationSelectedObjects, 3);
const combinationInverse = runPnc001Pipeline({ questionLanguageId: "PNC-QL-073", seed: "combination-inverse" });
assert.equal(combinationInverse.solver.evidence.operation, "COMBINATION_INVERSE");
assert.ok(combinationInverse.solver.evidence.combinationSelectedObjects! <= Math.floor(combinationInverse.solver.evidence.combinationTotalObjects! / 2));
const combinationSymmetry = runPnc001Pipeline({ questionLanguageId: "PNC-QL-074", seed: "combination-symmetry" });
assert.equal(combinationSymmetry.solver.evidence.operation, "COMBINATION_SYMMETRY");
assert.equal(combinationSymmetry.solver.evidence.combinationKnownSelection! + combinationSymmetry.solver.numericAnswer, combinationSymmetry.solver.evidence.combinationTotalObjects);

const apple = runPnc001Pipeline({ questionLanguageId: "PNC-QL-075", seed: "multiset-apple" });
assert.equal(apple.canonicalProblemId, "PNC-CP-005");
assert.equal(apple.solver.evidence.operation, "MULTISET_DIRECT");
assert.deepEqual(apple.solver.evidence.multisetMultiplicities, [2]);
assert.equal(apple.solver.numericAnswer, multisetPermutationExact(5, [2]));
const balloon = runPnc001Pipeline({ questionLanguageId: "PNC-QL-076", seed: "multiset-balloon" });
assert.deepEqual(balloon.solver.evidence.multisetMultiplicities, [2, 2]);
const mississippi = runPnc001Pipeline({ questionLanguageId: "PNC-QL-077", seed: "multiset-mississippi" });
assert.deepEqual(mississippi.solver.evidence.multisetMultiplicities, [4, 4, 2]);
const fixedUnique = runPnc001Pipeline({ questionLanguageId: "PNC-QL-079", seed: "multiset-fixed-unique" });
assert.equal(fixedUnique.solver.evidence.operation, "MULTISET_FIXED");
assert.equal(fixedUnique.solver.evidence.fixedObjectMultiplicityBefore, 1);
assert.equal(fixedUnique.solver.evidence.multisetRemainingObjects, 6);
const fixedRepeated = runPnc001Pipeline({ questionLanguageId: "PNC-QL-080", seed: "multiset-fixed-repeated" });
assert.equal(fixedRepeated.solver.evidence.fixedObjectMultiplicityBefore, 2);
assert.deepEqual(fixedRepeated.solver.evidence.multisetRemainingMultiplicities, [2]);
const overcount = runPnc001Pipeline({ questionLanguageId: "PNC-QL-081", seed: "multiset-overcount" });
assert.equal(overcount.solver.evidence.operation, "MULTISET_OVERCOUNT");
assert.equal(overcount.solver.numericAnswer, multisetOvercountFactorExact(overcount.solver.evidence.multisetMultiplicities!));
const multisetInverse = runPnc001Pipeline({ questionLanguageId: "PNC-QL-082", seed: "multiset-inverse" });
assert.equal(multisetInverse.solver.evidence.operation, "MULTISET_INVERSE");
assert.equal(multisetPermutationExact(multisetInverse.solver.evidence.multisetTotalObjects!, [multisetInverse.solver.numericAnswer]), multisetInverse.solver.evidence.multisetTarget);

const noZeroNumber = runPnc001Pipeline({ questionLanguageId: "PNC-QL-083", seed: "number-no-zero" });
assert.equal(noZeroNumber.canonicalProblemId, "PNC-CP-004");
assert.equal(noZeroNumber.solver.evidence.operation, "NUMBER_NO_ZERO_NO_REPEAT");
assert.equal(noZeroNumber.solver.evidence.firstPositionChoices, noZeroNumber.solver.evidence.symbolCount);
const zeroNumber = runPnc001Pipeline({ questionLanguageId: "PNC-QL-084", seed: "number-with-zero" });
assert.equal(zeroNumber.solver.evidence.operation, "NUMBER_WITH_ZERO_NO_REPEAT");
assert.equal(zeroNumber.solver.evidence.firstPositionChoices, zeroNumber.solver.evidence.symbolCount! - 1);
const repeatedCode = runPnc001Pipeline({ questionLanguageId: "PNC-QL-085", seed: "code-repetition" });
assert.equal(repeatedCode.solver.evidence.operation, "CODE_REPETITION");
assert.ok(repeatedCode.solver.evidence.positionChoices?.every(value => value === repeatedCode.solver.evidence.symbolCount));
const repeatedNumber = runPnc001Pipeline({ questionLanguageId: "PNC-QL-086", seed: "number-repetition" });
assert.equal(repeatedNumber.solver.evidence.operation, "NUMBER_REPETITION");
assert.equal(repeatedNumber.solver.evidence.firstPositionChoices, repeatedNumber.solver.evidence.symbolCount! - 1);
const evenNoZero = runPnc001Pipeline({ questionLanguageId: "PNC-QL-087", seed: "even-no-zero" });
assert.equal(evenNoZero.solver.evidence.operation, "PARITY_NUMBER");
assert.ok(evenNoZero.solver.evidence.eligibleLastDigits?.every(digit => digit > 0 && digit % 2 === 0));
const evenWithZero = runPnc001Pipeline({ questionLanguageId: "PNC-QL-088", seed: "even-with-zero" });
assert.equal(evenWithZero.solver.evidence.caseCounts?.length, 2);
assert.ok(evenWithZero.solver.evidence.eligibleLastDigits?.includes(0));
const oddWithZero = runPnc001Pipeline({ questionLanguageId: "PNC-QL-089", seed: "odd-with-zero" });
assert.ok(oddWithZero.solver.evidence.eligibleLastDigits?.every(digit => digit % 2 === 1));
const divisibleByFive = runPnc001Pipeline({ questionLanguageId: "PNC-QL-090", seed: "divisible-five" });
assert.equal(divisibleByFive.solver.evidence.operation, "DIVISIBLE_BY_FIVE");
assert.deepEqual(divisibleByFive.solver.evidence.eligibleLastDigits, [0, 5]);
assert.equal(divisibleByFive.solver.evidence.caseCounts?.length, 2);
const threshold = runPnc001Pipeline({ questionLanguageId: "PNC-QL-091", seed: "threshold" });
assert.equal(threshold.solver.evidence.operation, "THRESHOLD_NUMBER");
assert.ok(threshold.solver.evidence.qualifyingFirstDigits?.every(digit => digit >= threshold.parameters.values.thresholdDigit!));
const alphanumeric = runPnc001Pipeline({ questionLanguageId: "PNC-QL-092", seed: "alphanumeric" });
assert.equal(alphanumeric.solver.evidence.operation, "ALPHANUMERIC_CODE");
assert.equal(alphanumeric.solver.evidence.letterStageCount! * alphanumeric.solver.evidence.digitStageCount!, alphanumeric.solver.numericAnswer);
const codeInverse = runPnc001Pipeline({ questionLanguageId: "PNC-QL-093", seed: "code-inverse" });
assert.equal(codeInverse.solver.evidence.operation, "CODE_REPETITION_INVERSE");
assert.equal(powerExact(codeInverse.solver.numericAnswer, codeInverse.solver.evidence.digitLength!), codeInverse.solver.evidence.codeTarget);
const onePair = runPnc001Pipeline({ questionLanguageId: "PNC-QL-094", seed: "one-pair" });
assert.equal(onePair.solver.evidence.operation, "CODE_EXACTLY_ONE_PAIR");
assert.equal(onePair.solver.evidence.patternArrangementCount, 12);
assert.equal(onePair.solver.evidence.repeatedSymbolChoices, onePair.solver.evidence.symbolCount);

for (const [cpId, seed] of [["PNC-CP-002", "cp2-routing"], ["PNC-CP-003", "cp3-routing"], ["PNC-CP-004", "cp4-routing"], ["PNC-CP-005", "cp5-routing"]] as const) {
  assert.equal(runPnc001Pipeline(cpId, { seed }).canonicalProblemId, cpId);
}
for (const language of ["hi", "pa"] as const) {
  assert.throws(() => runPnc001Pipeline({ questionLanguageId: "PNC-QL-001", seed: "unsupported", language }), /English only/);
}

console.log(JSON.stringify({
  checkpointQlCount: entries.length,
  activeCanonicalProblems: 5,
  observedDifficultyCounts,
  observedSolveModeCounts,
  seedsPerQl: 12,
  generated,
  audit,
  status: "PASS",
}, null, 2));
