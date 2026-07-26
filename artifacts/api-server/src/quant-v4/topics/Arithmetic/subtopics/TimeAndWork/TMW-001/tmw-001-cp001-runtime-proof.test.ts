import assert from "node:assert/strict";
import { getTmwCp001QuestionEntries, getTmwCp001QuestionLanguageIds, normaliseTmwTemplate, validateTmwCp001Libraries } from "./library";
import { getTmwCp001SolveModeIds } from "./solve-mode-registry.cp001";
import { runTmwCp001Pipeline } from "./foundation/pipeline.cp001";

const libraryValidation = validateTmwCp001Libraries();
assert.equal(libraryValidation.valid, true, libraryValidation.failures.join("\n"));
const qlIds = getTmwCp001QuestionLanguageIds();
assert.equal(qlIds.length, getTmwCp001SolveModeIds().length);
assert.equal(qlIds.length, 22, "Current CP-001 discovery baseline must contain 22 non-quota QLs.");
const entries = getTmwCp001QuestionEntries();
assert.deepEqual(new Set(entries.map((entry) => entry.solveMode)), new Set(getTmwCp001SolveModeIds()));
assert.deepEqual(new Set(entries.map((entry) => entry.difficulty)), new Set(["Easy", "Medium", "Hard"]));
assert.equal(new Set(entries.map((entry) => normaliseTmwTemplate(entry.template))).size, entries.length);
assert.equal(new Set(entries.map((entry) => entry.scenarioFamily)).size, entries.length);
assert.equal(new Set(entries.map((entry) => entry.explanationStrategyId)).size >= 8, true);
const correctPositions = new Set<number>();
const generatedStems = new Set<string>();
const fingerprints = new Set<string>();
const explanationOpenings = new Set<string>();
let generated = 0;
for (const qlId of qlIds) {
  for (let seedIndex = 1; seedIndex <= 40; seedIndex += 1) {
    const seed = `cp001-proof-${seedIndex}`;
    const first = runTmwCp001Pipeline(qlId, seed);
    const second = runTmwCp001Pipeline(qlId, seed);
    assert.deepEqual(first, second, `${qlId} ${seed}: generation is not deterministic.`);
    assert.equal(first.validation.valid, true, `${qlId} ${seed}: ${first.validation.failures.join("; ")}`);
    assert.equal(first.independentVerification.valid, true);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.equal(first.options.filter((option) => option === first.correctAnswer).length, 1);
    assert.equal(first.options[first.correctIndex], first.correctAnswer);
    assert.equal(first.traceability.optionErrorLabels.length, 4);
    assert.equal(first.traceability.optionErrorLabels[first.correctIndex], null);
    assert.equal(first.traceability.optionErrorLabels.filter((label) => label !== null).length, 3);
    assert.equal(first.explanation.keyRule.latex.length > 0, true);
    assert.equal(first.explanation.steps.length >= 2, true);
    assert.equal(first.stem.includes("{"), false);
    assert.equal(first.stem.endsWith("?"), true);
    assert.equal(first.lifecycle.generationSurface, "QUESTION_STUDIO");
    assert.equal(first.lifecycle.reviewStatus, "UNREVIEWED");
    assert.equal(first.lifecycle.questionBankStatus, "NOT_STORED");
    assert.equal(first.lifecycle.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    correctPositions.add(first.correctIndex);
    generatedStems.add(first.stem);
    fingerprints.add(first.traceability.fingerprint);
    explanationOpenings.add(first.explanation.contextualOpening);
    generated += 1;
  }
}
assert.deepEqual(correctPositions, new Set([0, 1, 2, 3]), "Correct answers must occupy all four positions across proof cases.");
assert.equal(explanationOpenings.size, qlIds.length, "Every CP-001 QL must have a context-specific explanation opening.");
assert.equal(generatedStems.size > qlIds.length * 4, true, "Generated stems lack numeric state diversity.");
assert.equal(fingerprints.size > qlIds.length * 4, true, "Generated mathematical fingerprints lack state diversity.");
console.log(`TMW-CP-001 runtime proof passed for ${generated} deterministic Question Studio candidates across ${qlIds.length} QLs and ${getTmwCp001SolveModeIds().length} solve modes.`);
