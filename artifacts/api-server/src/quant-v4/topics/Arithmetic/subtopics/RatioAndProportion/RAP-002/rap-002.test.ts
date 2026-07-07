import { strict as assert } from "node:assert";
import { alignChainRatios, alignThreeChainRatios, formatRatio } from "./math";
import { validateRap002Libraries } from "./library";
import { runRap002Cp007Pipeline, runRap002Cp008Pipeline, runRap002Cp009Pipeline, runRap002Cp010Pipeline } from "./pipeline";
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

const seenQlIds = new Set<string>();
for (let index = 0; index < 120; index += 1) {
  const pkg = runRap002Cp007Pipeline({ seed: `rap-002-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-007");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  assert.equal(runRap002Cp007Pipeline({ seed: `rap-002-smoke:${index}`, questionLanguageId: pkg.questionLanguageId }).answer.length > 0, true);
  seenQlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-201", "RAP-QL-205", "RAP-QL-209"]) {
  const pkg = runRap002Cp007Pipeline({ seed: `rap-002-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenQlIds.add(pkg.questionLanguageId);
}

assert.ok(seenQlIds.size >= 10, `Expected broad QL coverage, got ${seenQlIds.size}`);

const seenCp008QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp008Pipeline({ seed: `rap-002-cp008-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-008");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 6);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp008QlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-301", "RAP-QL-302", "RAP-QL-303", "RAP-QL-304", "RAP-QL-305", "RAP-QL-306"]) {
  const pkg = runRap002Cp008Pipeline({ seed: `rap-002-cp008-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp008QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp008QlIds.size, 6, `Expected all 6 CP-008 QLs, got ${seenCp008QlIds.size}`);

const seenCp009QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp009Pipeline({ seed: `rap-002-cp009-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-009");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 5);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp009QlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-401", "RAP-QL-402", "RAP-QL-403", "RAP-QL-404", "RAP-QL-405", "RAP-QL-406"]) {
  const pkg = runRap002Cp009Pipeline({ seed: `rap-002-cp009-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp009QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp009QlIds.size, 6, `Expected all 6 CP-009 QLs, got ${seenCp009QlIds.size}`);

const seenCp010QlIds = new Set<string>();
for (let index = 0; index < 90; index += 1) {
  const pkg = runRap002Cp010Pipeline({ seed: `rap-002-cp010-smoke:${index}` });
  assert.equal(pkg.validation.valid, true, pkg.validation.checks.filter((check) => !check.passed).map((check) => check.message).join("; "));
  assert.equal(pkg.language, "en");
  assert.equal(pkg.canonicalProblemId, "RAP-CP-010");
  assert.ok(pkg.stem.length > 0);
  assert.ok(pkg.answer.length > 0);
  assert.ok(pkg.explanation.lines.length >= 6);
  assert.equal(/\{[^}]+\}/.test(pkg.stem), false);
  seenCp010QlIds.add(pkg.questionLanguageId);
}

for (const qlId of ["RAP-QL-501", "RAP-QL-502", "RAP-QL-503", "RAP-QL-504", "RAP-QL-505", "RAP-QL-506"]) {
  const pkg = runRap002Cp010Pipeline({ seed: `rap-002-cp010-forced:${qlId}`, questionLanguageId: qlId });
  assert.equal(pkg.validation.valid, true);
  seenCp010QlIds.add(pkg.questionLanguageId);
}

assert.equal(seenCp010QlIds.size, 6, `Expected all 6 CP-010 QLs, got ${seenCp010QlIds.size}`);

console.log(`RAP-002 English test passed. CP-007 QLs covered: ${seenQlIds.size}. CP-008 QLs covered: ${seenCp008QlIds.size}. CP-009 QLs covered: ${seenCp009QlIds.size}. CP-010 QLs covered: ${seenCp010QlIds.size}.`);
