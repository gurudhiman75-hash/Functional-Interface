import { strict as assert } from "node:assert";
import { validateRap003Libraries } from "./library";
import { generateRap003Parameters } from "./parameter-generator";
import { runRap003Cp013ForLanguages, runRap003Cp013Pipeline, runRap003Cp014ForLanguages, runRap003Cp014Pipeline, runRap003Cp015ForLanguages, runRap003Cp015Pipeline, runRap003Cp016ForLanguages, runRap003Cp016Pipeline, runRap003Cp017ForLanguages, runRap003Cp017Pipeline } from "./pipeline";
import { solveRap003 } from "./solver";

const libraryValidation = validateRap003Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("; "));

const fixedPartnership = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-013",
  seed: "rap-003-fixed-partnership",
  questionLanguageId: "RAP-QL-801",
  difficultyBand: "Easy",
});
fixedPartnership.variables = {
  personA: "Aman",
  personB: "Bhavna",
  investmentA: 40000,
  investmentB: 60000,
  timeA: 12,
  timeB: 12,
  totalProfit: 15000,
  targetPartner: "Aman",
};
assert.equal(solveRap003(fixedPartnership).answer, "$$6000$$");

const fixedJoining = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-013",
  seed: "rap-003-fixed-joining",
  questionLanguageId: "RAP-QL-802",
  difficultyBand: "Medium",
});
fixedJoining.variables = {
  personA: "Aman",
  personB: "Bhavna",
  investmentA: 50000,
  investmentB: 70000,
  timeA: 12,
  timeB: 8,
  totalProfit: 29000,
  targetPartner: "Bhavna",
};
assert.equal(solveRap003(fixedJoining).answer, "$$14000$$");

const fixedMidChange = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-013",
  seed: "rap-003-fixed-mid-change",
  questionLanguageId: "RAP-QL-803",
  difficultyBand: "Hard",
});
fixedMidChange.variables = {
  personA: "Aman",
  personB: "Bhavna",
  initialInvestmentA: 30000,
  changedInvestmentA: 20000,
  investmentB: 40000,
  firstPeriod: 6,
  secondPeriod: 6,
  timeB: 12,
  totalProfit: 26000,
  targetPartner: "Aman",
};
assert.equal(solveRap003(fixedMidChange).answer, "$$10000$$");

const fixedFuture = generateRap003Parameters({
  seed: "rap-003-fixed-future",
  questionLanguageId: "RAP-QL-901",
  difficultyBand: "Medium",
});
fixedFuture.variables = {
  personA: "father",
  personB: "son",
  ratioA: 5,
  ratioB: 2,
  shiftYears: 10,
  futureRatioA: 2,
  futureRatioB: 1,
  targetPerson: "father",
};
assert.equal(solveRap003(fixedFuture).answer, "$$50$$");

const fixedPast = generateRap003Parameters({
  seed: "rap-003-fixed-past",
  questionLanguageId: "RAP-QL-903",
  difficultyBand: "Hard",
});
fixedPast.variables = {
  personA: "father",
  personB: "son",
  ratioA: 7,
  ratioB: 3,
  shiftYears: 6,
  pastRatioA: 5,
  pastRatioB: 1,
  targetPerson: "son",
};
assert.equal(solveRap003(fixedPast).answer, "$$9$$");

const fixedYears = generateRap003Parameters({
  seed: "rap-003-fixed-years",
  questionLanguageId: "RAP-QL-904",
  difficultyBand: "Medium",
});
fixedYears.variables = {
  personA: "A",
  personB: "B",
  presentAgeA: 30,
  presentAgeB: 18,
  futureRatioA: 7,
  futureRatioB: 5,
};
assert.equal(solveRap003(fixedYears).answer, "$$12$$");

const fixedDifference = generateRap003Parameters({
  seed: "rap-003-fixed-difference",
  questionLanguageId: "RAP-QL-905",
  difficultyBand: "Easy",
});
fixedDifference.variables = {
  personA: "father",
  personB: "son",
  ratioA: 5,
  ratioB: 2,
  ageDifference: 30,
  targetPerson: "father",
};
assert.equal(solveRap003(fixedDifference).answer, "$$50$$");

const fixedSavingsRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-savings-ratio",
  questionLanguageId: "RAP-QL-951",
  difficultyBand: "Medium",
});
fixedSavingsRatio.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 5,
  incomeRatioB: 4,
  expenditureRatioA: 3,
  expenditureRatioB: 2,
  incomeUnit: 6000,
  expenditureUnit: 7000,
};
assert.equal(solveRap003(fixedSavingsRatio).answer, "$$9 : 10$$");

const fixedEqualSavings = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-equal-savings",
  questionLanguageId: "RAP-QL-952",
  difficultyBand: "Medium",
});
fixedEqualSavings.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 3,
  incomeRatioB: 4,
  expenditureRatioA: 2,
  expenditureRatioB: 3,
  givenIncomeA: 30000,
  targetPerson: "Bhavna",
};
assert.equal(solveRap003(fixedEqualSavings).answer, "$$10000$$");

const fixedIncomeFromSavings = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-income-from-savings",
  questionLanguageId: "RAP-QL-953",
  difficultyBand: "Hard",
});
fixedIncomeFromSavings.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 5,
  incomeRatioB: 7,
  expenditureRatioA: 3,
  expenditureRatioB: 4,
  savingsRatioA: 2,
  savingsRatioB: 3,
  givenExpenditureB: 20000,
  targetPerson: "Bhavna",
};
assert.equal(solveRap003(fixedIncomeFromSavings).answer, "$$35000$$");

const fixedExpenditureFromSavings = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-015",
  seed: "rap-003-fixed-expenditure-from-savings",
  questionLanguageId: "RAP-QL-954",
  difficultyBand: "Hard",
});
fixedExpenditureFromSavings.variables = {
  personA: "Aman",
  personB: "Bhavna",
  incomeRatioA: 5,
  incomeRatioB: 7,
  expenditureRatioA: 3,
  expenditureRatioB: 4,
  savingsRatioA: 2,
  savingsRatioB: 3,
  givenIncomeA: 25000,
  targetPerson: "Aman",
};
assert.equal(solveRap003(fixedExpenditureFromSavings).answer, "$$15000$$");

const fixedAlligation = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-016",
  seed: "rap-003-fixed-alligation",
  questionLanguageId: "RAP-QL-1001",
  difficultyBand: "Medium",
});
fixedAlligation.variables = {
  mixtureA: "Alloy A",
  mixtureB: "Alloy B",
  component: "gold",
  percentA: 40,
  percentB: 20,
  targetPercent: 30,
};
assert.equal(solveRap003(fixedAlligation).answer, "$$1 : 1$$");

const fixedWeightedBlend = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-016",
  seed: "rap-003-fixed-weighted-blend",
  questionLanguageId: "RAP-QL-1002",
  difficultyBand: "Medium",
});
fixedWeightedBlend.variables = {
  mixtureA: "Alloy A",
  mixtureB: "Alloy B",
  component: "gold",
  percentA: 40,
  percentB: 20,
  quantityA: 30,
  quantityB: 20,
};
assert.equal(solveRap003(fixedWeightedBlend).answer, "$$32$$");

const fixedThreeSource = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-016",
  seed: "rap-003-fixed-three-source",
  questionLanguageId: "RAP-QL-1003",
  difficultyBand: "Hard",
});
fixedThreeSource.variables = {
  mixtureA: "Alloy A",
  mixtureB: "Alloy B",
  mixtureC: "Alloy C",
  component: "gold",
  ratioAComponent: 2,
  ratioAOther: 3,
  ratioBComponent: 3,
  ratioBOther: 7,
  ratioCComponent: 1,
  ratioCOther: 4,
};
assert.equal(solveRap003(fixedThreeSource).answer, "$$3 : 7$$");

const fixedReplacementRatio = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-017",
  seed: "rap-003-fixed-replacement-ratio",
  questionLanguageId: "RAP-QL-1101",
  difficultyBand: "Medium",
});
fixedReplacementRatio.variables = {
  vesselName: "A vessel",
  liquidA: "milk",
  liquidB: "water",
  initialVolume: 40,
  removedVolume: 4,
  replacementCount: 2,
};
assert.equal(solveRap003(fixedReplacementRatio).answer, "$$81 : 19$$");

const fixedReplacementQuantity = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-017",
  seed: "rap-003-fixed-replacement-quantity",
  questionLanguageId: "RAP-QL-1102",
  difficultyBand: "Medium",
});
fixedReplacementQuantity.variables = {
  vesselName: "A vessel",
  liquidA: "milk",
  liquidB: "water",
  initialVolume: 50,
  removedVolume: 5,
  replacementCount: 2,
};
assert.equal(solveRap003(fixedReplacementQuantity).answer, "$$40.5$$");

const fixedReplacementIterations = generateRap003Parameters({
  canonicalProblemId: "RAP-CP-017",
  seed: "rap-003-fixed-replacement-iterations",
  questionLanguageId: "RAP-QL-1103",
  difficultyBand: "Hard",
});
fixedReplacementIterations.variables = {
  vesselName: "A container",
  liquidA: "wine",
  liquidB: "water",
  initialVolume: 80,
  removedVolume: 8,
  finalRatioA: 729,
  finalRatioB: 271,
};
assert.equal(solveRap003(fixedReplacementIterations).answer, "$$3$$");

const seenQlIds = new Set<string>();
for (let index = 0; index < 120; index += 1) {
  const pkg = runRap003Cp014Pipeline({ seed: `rap-003-cp014-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-014");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-901", "RAP-QL-902", "RAP-QL-903", "RAP-QL-904", "RAP-QL-905", "RAP-QL-906"]) {
  const pkg = runRap003Cp014Pipeline({ seed: `rap-003-cp014-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenQlIds.size, 6, `Expected all 6 CP-014 QLs, got ${seenQlIds.size}`);

const seenPartnershipQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp013Pipeline({ seed: `rap-003-cp013-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-013");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenPartnershipQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-801", "RAP-QL-802", "RAP-QL-803", "RAP-QL-804"]) {
  const pkg = runRap003Cp013Pipeline({ seed: `rap-003-cp013-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenPartnershipQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenPartnershipQlIds.size, 4, `Expected all 4 CP-013 QLs, got ${seenPartnershipQlIds.size}`);

const seenIncomeQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp015Pipeline({ seed: `rap-003-cp015-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-015");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenIncomeQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-951", "RAP-QL-952", "RAP-QL-953", "RAP-QL-954"]) {
  const pkg = runRap003Cp015Pipeline({ seed: `rap-003-cp015-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenIncomeQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenIncomeQlIds.size, 4, `Expected all 4 CP-015 QLs, got ${seenIncomeQlIds.size}`);

const seenAlloyQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp016Pipeline({ seed: `rap-003-cp016-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-016");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenAlloyQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1001", "RAP-QL-1002", "RAP-QL-1003", "RAP-QL-1004"]) {
  const pkg = runRap003Cp016Pipeline({ seed: `rap-003-cp016-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenAlloyQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenAlloyQlIds.size, 4, `Expected all 4 CP-016 QLs, got ${seenAlloyQlIds.size}`);

const seenReplacementQlIds = new Set<string>();
for (let index = 0; index < 80; index += 1) {
  const pkg = runRap003Cp017Pipeline({ seed: `rap-003-cp017-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-017");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenReplacementQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-1101", "RAP-QL-1102", "RAP-QL-1103", "RAP-QL-1104"]) {
  const pkg = runRap003Cp017Pipeline({ seed: `rap-003-cp017-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenReplacementQlIds.add(pkg.questionLanguageId);
}

assert.equal(seenReplacementQlIds.size, 4, `Expected all 4 CP-017 QLs, got ${seenReplacementQlIds.size}`);

for (const qlId of ["RAP-QL-901", "RAP-QL-903", "RAP-QL-904", "RAP-QL-905"]) {
  const packages = runRap003Cp014ForLanguages({ seed: `rap-003-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-801", "RAP-QL-802", "RAP-QL-803"]) {
  const packages = runRap003Cp013ForLanguages({ seed: `rap-003-partnership-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-951", "RAP-QL-952", "RAP-QL-953"]) {
  const packages = runRap003Cp015ForLanguages({ seed: `rap-003-income-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1001", "RAP-QL-1002", "RAP-QL-1003"]) {
  const packages = runRap003Cp016ForLanguages({ seed: `rap-003-alloy-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

for (const qlId of ["RAP-QL-1101", "RAP-QL-1102", "RAP-QL-1103"]) {
  const packages = runRap003Cp017ForLanguages({ seed: `rap-003-replacement-multilingual:${qlId}`, questionLanguageId: qlId });
  assert.equal(packages.length, 3);
  for (const pkg of packages) {
    assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
    assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
    assert.equal(pkg.questionLanguageId, qlId);
  }
}

console.log(`RAP-003 multilingual test passed. CP-013 QLs covered: ${seenPartnershipQlIds.size}. CP-014 QLs covered: ${seenQlIds.size}. CP-015 QLs covered: ${seenIncomeQlIds.size}. CP-016 QLs covered: ${seenAlloyQlIds.size}. CP-017 QLs covered: ${seenReplacementQlIds.size}.`);
