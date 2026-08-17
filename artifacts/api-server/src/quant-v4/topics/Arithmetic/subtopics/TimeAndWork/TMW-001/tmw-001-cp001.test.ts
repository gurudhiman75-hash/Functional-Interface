import { strict as assert } from "node:assert";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";
import { equals, multiply, rational } from "./foundation/rational";
import { TMW_CP_001_SOLVE_MODES } from "./foundation/types";

assert.equal(TMW_CP001_REGISTRY.length, 20);
assert.equal(new Set(TMW_CP001_REGISTRY.map((entry) => entry.qlId)).size, 20);
assert.deepEqual(TMW_CP001_REGISTRY.map((entry) => entry.qlId), Array.from({ length: 20 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`));
assert.deepEqual(TMW_CP001_REGISTRY.map((entry) => entry.solveMode), [...TMW_CP_001_SOLVE_MODES]);

const correctPositions = new Set<number>();
const stemSamples = new Set<string>();
let generated = 0;

for (const entry of TMW_CP001_REGISTRY) {
  const fingerprints = new Set<string>();
  const contexts = new Set<string>();
  for (let index = 0; index < 50; index += 1) {
    const seed = `tmw-cp001-proof:${entry.qlId}:${index}`;
    const first = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.equal(first.validation.valid, true, `${entry.qlId}:${first.validation.errors.join(", ")}`);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.options, second.options);
    assert.deepEqual(first.optionAudit, second.optionAudit);
    assert.deepEqual(first.solution, second.solution);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.optionAudit[first.correctIndex].misconceptionId, "CORRECT");
    assert.equal(first.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length, 1);
    assert.equal(first.publiclyPublishable, false);
    assert.ok(first.explanation.formula.includes("\\("));
    assert.ok(first.explanation.steps.length >= 3);
    assert.ok(first.explanation.steps.every((step) => /^\\\(.+\\\)$/.test(step)));
    assert.ok(first.explanation.shortcut.title.startsWith("10-Second "));
    assert.ok(first.explanation.shortcut.steps.length >= 1);
    assert.notEqual(first.explanation.commonTrap.misconceptionId, "CORRECT");
    assert.ok(first.optionAudit.some((option) => option.text === first.explanation.commonTrap.optionText && option.misconceptionId === first.explanation.commonTrap.misconceptionId));
    assert.equal(/Do not choose|Don't choose/i.test(first.explanation.commonTrap.explanation), false);
    assert.equal(first.stem.includes("undefined"), false);
    assert.equal(first.stem.includes("{"), false);
    assert.equal(first.stem.includes("can complete pages in"), false);
    assert.equal(first.stem.includes("can complete files in"), false);
    assert.equal(first.stem.includes("can complete applications in"), false);
    assert.equal(first.explanation.conclusion.includes("is required"), false);
    assert.equal(first.explanation.conclusion.includes("worker or unit"), false);
    if (["WORK", "OUTPUT"].includes(first.solution.answerType) && first.parameters.context.outputUnit !== "metres") assert.equal(first.optionAudit.every((option) => option.value.denominator === 1), true);
    if (first.solution.answerType === "FRACTION") assert.equal(first.optionAudit.every((option) => option.value.numerator <= option.value.denominator), true);
    if (first.solution.answerType === "PERCENT") assert.equal(first.optionAudit.every((option) => option.value.numerator <= 100 * option.value.denominator), true);
    correctPositions.add(first.correctIndex);
    fingerprints.add(first.mathematicalFingerprint);
    contexts.add(first.parameters.context.actor);
    stemSamples.add(first.stem);
    generated += 1;
  }
  assert.ok(fingerprints.size >= 4, `${entry.qlId} lacks mathematical state diversity`);
  assert.ok(contexts.size >= 2, `${entry.qlId} lacks context diversity`);
}

assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3]);
assert.ok(stemSamples.size > 500, "Chapter proof lacks rendered stem diversity");
const hindiSmoke = runTmwCp001Pipeline({ questionLanguageId: "TMW-QL-001", seed: "localized-smoke", language: "hi" });
const punjabiSmoke = runTmwCp001Pipeline({ questionLanguageId: "TMW-QL-001", seed: "localized-smoke", language: "pa" });
assert.equal(hindiSmoke.language, "hi");
assert.equal(hindiSmoke.locale, "hi-IN");
assert.equal(hindiSmoke.validation.valid, true, hindiSmoke.validation.errors.join(" | "));
assert.equal(punjabiSmoke.language, "pa");
assert.equal(punjabiSmoke.locale, "pa-IN");
assert.equal(punjabiSmoke.validation.valid, true, punjabiSmoke.validation.errors.join(" | "));
assert.throws(() => runTmwCp001Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown" }), /Unknown TMW-001 question language/);
assert.equal(equals(multiply(rational(2, 3), rational(9, 4)), rational(3, 2)), true);
assert.throws(() => rational(1, 0), /denominator cannot be zero/);
assert.throws(() => rational(Number.MAX_SAFE_INTEGER + 1), /safe integer/);

console.log(JSON.stringify({ chapter: "TMW-001", checkpoint: "TMW-CP-001", qlCount: TMW_CP001_REGISTRY.length, solveModeCount: TMW_CP_001_SOLVE_MODES.length, seedsPerQl: 50, generated, correctPositions: [...correctPositions].sort(), distinctRenderedStems: stemSamples.size, localizedSmoke: [hindiSmoke.locale, punjabiSmoke.locale], status: "PASS" }, null, 2));
