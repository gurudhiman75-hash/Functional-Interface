import { strict as assert } from "node:assert";
import { alignChainRatios, alignThreeChainRatios, formatRatio } from "./math";
import { getRap002QuestionLanguageIds, validateRap002Libraries } from "./library";
import { runRap002Cp007Pipeline, runRap002Cp008Pipeline, runRap002Cp009Pipeline, runRap002Cp010Pipeline, runRap002Cp011Pipeline, runRap002Cp012Pipeline } from "./pipeline";
import { generateRap002Parameters } from "./parameter-generator";
import { solveRap002 } from "./solver";

assert.deepEqual(alignChainRatios([2, 3], [6, 5]), [4, 6, 5]);
assert.deepEqual(alignThreeChainRatios([2, 3], [6, 5], [10, 7]), [8, 12, 10, 7]);
assert.equal(formatRatio([8, 12, 10, 7]), "8:12:10:7");

const libraryValidation = validateRap002Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

const fixed = generateRap002Parameters({
  seed: "rap-002-fixed",
  questionLanguageId: "RAP-QL-201",
  difficultyBand: "Medium",
});
fixed.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  personD: "D",
  ratioA1: 2,
  ratioB1: 3,
  ratioB2: 6,
  ratioC2: 5,
  ratioC3: 10,
  ratioD3: 7,
};
assert.equal(solveRap002(fixed).answer, "$$8 : 12 : 10 : 7$$");

const fixedReverseMiddle = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-008",
  seed: "rap-002-fixed-reverse-middle",
  questionLanguageId: "RAP-QL-301",
  difficultyBand: "Medium",
});
fixedReverseMiddle.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  ratioA1: 2,
  ratioB1: 3,
  ratioB2: 6,
  ratioC2: 5,
  valueA: 8,
};
assert.equal(solveRap002(fixedReverseMiddle).answer, "$$12$$");

const fixedReverseTotal = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-008",
  seed: "rap-002-fixed-reverse-total",
  questionLanguageId: "RAP-QL-306",
  difficultyBand: "Hard",
});
fixedReverseTotal.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  ratioA1: 2,
  ratioB1: 3,
  ratioB2: 6,
  ratioC2: 5,
  totalValue: 30,
  constraintKind: "total",
};
assert.equal(solveRap002(fixedReverseTotal).answer, "$$12$$");

const fixedTransformation = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-009",
  seed: "rap-002-fixed-transformation",
  questionLanguageId: "RAP-QL-401",
  difficultyBand: "Medium",
});
fixedTransformation.variables = {
  personA: "A",
  personB: "B",
  ratioA: 3,
  ratioB: 4,
  totalValue: 70,
  valueAddA: 5,
  valueAddB: 0,
};
assert.equal(solveRap002(fixedTransformation).answer, "$$7 : 8$$");

const fixedReconstruct = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-009",
  seed: "rap-002-fixed-reconstruct",
  questionLanguageId: "RAP-QL-406",
  difficultyBand: "Hard",
});
fixedReconstruct.variables = {
  personA: "A",
  personB: "B",
  finalRatioA: 2,
  finalRatioB: 3,
  transferValue: 5,
  totalValue: 50,
  transferDirection: "A_TO_B",
};
assert.equal(solveRap002(fixedReconstruct).answer, "$$1 : 1$$");

const fixedElectionMargin = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-009",
  seed: "rap-002-fixed-election-margin",
  questionLanguageId: "RAP-QL-408",
  difficultyBand: "Medium",
});
fixedElectionMargin.variables = {
  candidateA: "Candidate A",
  candidateB: "Candidate B",
  totalVoters: 20000,
  turnoutPercent: 80,
  validPercent: 90,
  voteRatioA: 5,
  voteRatioB: 4,
};
assert.equal(solveRap002(fixedElectionMargin).answer, "$$1600$$");

const fixedNested = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-010",
  seed: "rap-002-fixed-nested",
  questionLanguageId: "RAP-QL-501",
  difficultyBand: "Medium",
});
fixedNested.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  personD: "D",
  ratioA: 3,
  ratioB: 2,
  subRatioC: 4,
  subRatioD: 1,
  totalValue: 100,
  branchPart: "A",
  targetSubPart: "C",
};
assert.equal(solveRap002(fixedNested).answer, "$$48$$");

const fixedWeightedNested = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-010",
  seed: "rap-002-fixed-weighted-nested",
  questionLanguageId: "RAP-QL-505",
  difficultyBand: "Hard",
});
fixedWeightedNested.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  personD: "D",
  ratioA: 3,
  ratioB: 2,
  subRatioC: 4,
  subRatioD: 1,
  totalValue: 100,
  branchPart: "A",
  targetSubPart: "C",
  weightC: 2,
  weightD: 5,
};
assert.equal(solveRap002(fixedWeightedNested).answer, "$$156$$");

const fixedIncomeExpenditure = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-010",
  seed: "rap-002-fixed-income-expenditure",
  questionLanguageId: "RAP-QL-507",
  difficultyBand: "Medium",
});
fixedIncomeExpenditure.variables = {
  personA: "A",
  personB: "B",
  incomeRatioA: 3,
  incomeRatioB: 2,
  expRatioA: 5,
  expRatioB: 3,
  savingsA: 1000,
  savingsB: 1000,
};
assert.equal(solveRap002(fixedIncomeExpenditure).answer, "$$10000$$");

const fixedInverse = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-011",
  seed: "rap-002-fixed-inverse",
  questionLanguageId: "RAP-QL-601",
  difficultyBand: "Medium",
});
fixedInverse.variables = {
  personA: "A",
  personB: "B",
  ratioA: 3,
  ratioB: 4,
  valueA: 8,
};
assert.equal(solveRap002(fixedInverse).answer, "$$6$$");

const fixedInverseChain = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-011",
  seed: "rap-002-fixed-inverse-chain",
  questionLanguageId: "RAP-QL-602",
  difficultyBand: "Hard",
});
fixedInverseChain.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  ratioA1: 2,
  ratioB1: 3,
  ratioB2: 6,
  ratioC2: 5,
  valueA: 10,
};
assert.equal(solveRap002(fixedInverseChain).answer, "$$8$$");

const fixedCombinedInverse = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-011",
  seed: "rap-002-fixed-combined-inverse",
  questionLanguageId: "RAP-QL-605",
  difficultyBand: "Hard",
});
fixedCombinedInverse.variables = {
  personA: "A",
  personB: "B",
  ratioA: 3,
  ratioB: 4,
  timeRatioA: 5,
  timeRatioB: 2,
};
assert.equal(solveRap002(fixedCombinedInverse).answer, "$$15 : 8$$");

const fixedSdtRatio = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-011",
  seed: "rap-002-fixed-sdt",
  questionLanguageId: "RAP-QL-607",
  difficultyBand: "Medium",
});
fixedSdtRatio.variables = {
  personA: "Vehicle A",
  personB: "Vehicle B",
  speedRatioA: 3,
  speedRatioB: 4,
  distanceRatioA: 2,
  distanceRatioB: 3,
};
assert.equal(solveRap002(fixedSdtRatio).answer, "$$8 : 9$$");

const fixedOrdering = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-012",
  seed: "rap-002-fixed-ordering",
  questionLanguageId: "RAP-QL-701",
  difficultyBand: "Medium",
});
fixedOrdering.variables = {
  personA: "A",
  personB: "B",
  personC: "C",
  ratioA1: 2,
  ratioB1: 3,
  ratioB2: 6,
  ratioC2: 5,
};
assert.equal(solveRap002(fixedOrdering).answer, "$$\\text{B > C > A}$$");

const fixedEquivalence = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-012",
  seed: "rap-002-fixed-equivalence",
  questionLanguageId: "RAP-QL-706",
  difficultyBand: "Medium",
});
fixedEquivalence.variables = {
  ratioA: 3,
  ratioB: 4,
  equivalentA: 12,
  equivalentB: 16,
};
assert.equal(solveRap002(fixedEquivalence).answer, "$$\\text{Equivalent}$$");

const fixedNonEquivalence = generateRap002Parameters({
  canonicalProblemId: "RAP-CP-012",
  seed: "rap-002-fixed-non-equivalence",
  questionLanguageId: "RAP-QL-706",
  difficultyBand: "Medium",
});
fixedNonEquivalence.variables = {
  ratioA: 3,
  ratioB: 4,
  equivalentA: 12,
  equivalentB: 17,
};
assert.equal(solveRap002(fixedNonEquivalence).answer, "$$\\text{Not equivalent}$$");

const seenQlIds = new Set<string>();
for (let index = 0; index < 120; index += 1) {
  const pkg = runRap002Cp007Pipeline({ seed: `rap-002-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-007");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  assert.equal(runRap002Cp007Pipeline({ seed: `rap-002-smoke:${index}`, questionLanguageId: pkg.questionLanguageId }).answer.length > 0, true);
  seenQlIds.add(pkg.questionLanguageId);
}

const cp007QlIds = getRap002QuestionLanguageIds("RAP-CP-007");
for (const qlId of cp007QlIds) {
  const pkg = runRap002Cp007Pipeline({ seed: `rap-002-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenQlIds.size, cp007QlIds.length, `Expected all active CP-007 QLs, got ${seenQlIds.size}`);

const seenCp008QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp008Pipeline({ seed: `rap-002-cp008-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-008");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp008QlIds.add(pkg.questionLanguageId);
}

const cp008QlIds = getRap002QuestionLanguageIds("RAP-CP-008");
for (const qlId of cp008QlIds) {
  const pkg = runRap002Cp008Pipeline({ seed: `rap-002-cp008-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp008QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp008QlIds.size, cp008QlIds.length, `Expected all active CP-008 QLs, got ${seenCp008QlIds.size}`);

const seenCp009QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp009Pipeline({ seed: `rap-002-cp009-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-009");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp009QlIds.add(pkg.questionLanguageId);
}

const cp009QlIds = getRap002QuestionLanguageIds("RAP-CP-009");
for (const qlId of cp009QlIds) {
  const pkg = runRap002Cp009Pipeline({ seed: `rap-002-cp009-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp009QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp009QlIds.size, cp009QlIds.length, `Expected all active CP-009 QLs, got ${seenCp009QlIds.size}`);

const seenCp010QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp010Pipeline({ seed: `rap-002-cp010-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-010");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp010QlIds.add(pkg.questionLanguageId);
}

const cp010QlIds = getRap002QuestionLanguageIds("RAP-CP-010");
for (const qlId of cp010QlIds) {
  const pkg = runRap002Cp010Pipeline({ seed: `rap-002-cp010-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp010QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp010QlIds.size, cp010QlIds.length, `Expected all active CP-010 QLs, got ${seenCp010QlIds.size}`);

const seenCp011QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp011Pipeline({ seed: `rap-002-cp011-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-011");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp011QlIds.add(pkg.questionLanguageId);
}

const cp011QlIds = getRap002QuestionLanguageIds("RAP-CP-011");
for (const qlId of cp011QlIds) {
  const pkg = runRap002Cp011Pipeline({ seed: `rap-002-cp011-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp011QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp011QlIds.size, cp011QlIds.length, `Expected all active CP-011 QLs, got ${seenCp011QlIds.size}`);

for (const language of ["hi", "pa"] as const) {
  for (const [cpRunner, qlId] of [
    [runRap002Cp009Pipeline, "RAP-QL-407"],
    [runRap002Cp010Pipeline, "RAP-QL-507"],
    [runRap002Cp011Pipeline, "RAP-QL-607"],
  ] as const) {
    const pkg = cpRunner({ seed: `rap-002-multilingual:${language}:${qlId}`, questionLanguageId: qlId, language });
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(pkg.language, language);
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  }
}

const seenCp012QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp012Pipeline({ seed: `rap-002-cp012-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-012");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 7);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp012QlIds.add(pkg.questionLanguageId);
}

const cp012QlIds = getRap002QuestionLanguageIds("RAP-CP-012");
for (const qlId of cp012QlIds) {
  const pkg = runRap002Cp012Pipeline({ seed: `rap-002-cp012-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp012QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp012QlIds.size, cp012QlIds.length, `Expected all active CP-012 QLs, got ${seenCp012QlIds.size}`);

const equivalenceAnswers = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  for (const qlId of ["RAP-QL-705", "RAP-QL-706"]) {
    const parameters = generateRap002Parameters({
      canonicalProblemId: "RAP-CP-012",
      seed: `rap-002-equivalence-diversity:${qlId}:${index}`,
      questionLanguageId: qlId,
      difficultyBand: "Medium",
    });
    equivalenceAnswers.add(String(solveRap002(parameters).answerValue));
  }
}
assert.deepEqual([...equivalenceAnswers].sort(), ["Equivalent", "Not equivalent"]);

for (let index = 0; index < 120; index += 1) {
  for (const qlId of ["RAP-QL-703", "RAP-QL-704"]) {
    const parameters = generateRap002Parameters({
      canonicalProblemId: "RAP-CP-012",
      seed: `rap-002-chain-inequality-no-tie:${qlId}:${index}`,
      questionLanguageId: qlId,
      difficultyBand: "Medium",
    });
    const calculation = solveRap002(parameters).mathJax.calculationLatex;
    const values = [...calculation.matchAll(/=(-?\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
    assert.equal(values.length >= 2, true, `Expected comparable values in ${calculation}`);
    assert.notEqual(values[0], values[1], `Tie found for ${qlId}: ${calculation}`);
  }
}

console.log(`RAP-002 multilingual enrichment test passed. CP-007 QLs covered: ${seenQlIds.size}. CP-008 QLs covered: ${seenCp008QlIds.size}. CP-009 QLs covered: ${seenCp009QlIds.size}. CP-010 QLs covered: ${seenCp010QlIds.size}. CP-011 QLs covered: ${seenCp011QlIds.size}. CP-012 QLs covered: ${seenCp012QlIds.size}.`);
