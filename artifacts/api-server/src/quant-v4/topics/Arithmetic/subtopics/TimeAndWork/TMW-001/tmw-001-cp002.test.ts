import { strict as assert } from "node:assert";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { runTmwCp002Pipeline } from "./foundation/cp002-runtime";
import { TMW_CP_002_SOLVE_MODES } from "./foundation/cp002-types";
import { compare, rational } from "./foundation/rational";

assert.equal(TMW_CP002_REGISTRY.length, 14);
assert.equal(new Set(TMW_CP002_REGISTRY.map((entry) => entry.qlId)).size, 14);
assert.deepEqual(TMW_CP002_REGISTRY.map((entry) => entry.qlId), Array.from({ length: 14 }, (_, index) => `TMW-QL-${String(index + 21).padStart(3, "0")}`));
assert.deepEqual(TMW_CP002_REGISTRY.map((entry) => entry.solveMode), [...TMW_CP_002_SOLVE_MODES]);

const correctPositions = new Set<number>();
const renderedStems = new Set<string>();
let generated = 0;

for (const entry of TMW_CP002_REGISTRY) {
  const fingerprints = new Set<string>();
  const contexts = new Set<string>();
  for (let index = 0; index < 50; index += 1) {
    const seed = `tmw-cp002-proof:${entry.qlId}:${index}`;
    const first = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed });
    const second = runTmwCp002Pipeline({ questionLanguageId: entry.qlId, seed });
    assert.equal(first.validation.valid, true, `${entry.qlId}:${first.validation.errors.join(", ")}`);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.solution, second.solution);
    assert.deepEqual(first.options, second.options);
    assert.deepEqual(first.optionAudit, second.optionAudit);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options).size, 4);
    assert.ok(first.correctIndex >= 0 && first.correctIndex < 4);
    assert.equal(first.optionAudit[first.correctIndex].misconceptionId, "CORRECT");
    assert.equal(first.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length, 1);
    assert.equal(first.publiclyPublishable, false);
    assert.ok(first.explanation.formula.startsWith("\\("));
    assert.ok(first.explanation.steps.length >= 1);
    assert.equal(/undefined|null|\{[^}]+\}/.test(first.stem), false);
    assert.equal(first.explanation.conclusion.includes("is required"), false);
    assert.equal(first.stem.includes("worker or unit"), false);
    if (first.solution.answerType === "FRACTION") {
      assert.equal(compare(first.solution.answer, rational(1)) <= 0, true);
      assert.equal(first.optionAudit.every((option) => compare(option.value, rational(1)) <= 0), true);
    }
    if (first.solution.answerType === "COUNT") {
      assert.equal(first.solution.answer.denominator, 1);
      assert.equal(first.optionAudit.every((option) => option.value.denominator === 1), true);
    }
    if (first.solution.answerType === "OUTPUT" && !first.parameters.context.outputNoun.startsWith("metres")) {
      assert.equal(first.optionAudit.every((option) => option.value.denominator === 1), true);
    }
    correctPositions.add(first.correctIndex);
    fingerprints.add(first.mathematicalFingerprint);
    contexts.add(first.parameters.context.jobPhrase);
    renderedStems.add(first.stem);
    generated += 1;
  }
  assert.ok(fingerprints.size >= 4, `${entry.qlId} lacks mathematical diversity`);
  assert.ok(contexts.size >= 2, `${entry.qlId} lacks context diversity`);
}

assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3]);
assert.ok(renderedStems.size > 280, "CP-002 lacks rendered stem diversity");
assert.throws(() => runTmwCp002Pipeline({ questionLanguageId: "TMW-QL-021", seed: "unsupported", language: "hi" }), /English only/);
assert.throws(() => runTmwCp002Pipeline({ questionLanguageId: "TMW-QL-999", seed: "unknown" }), /Unknown TMW-CP-002/);

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-002",
  qlCount: TMW_CP002_REGISTRY.length,
  solveModeCount: TMW_CP_002_SOLVE_MODES.length,
  seedsPerQl: 50,
  generated,
  correctPositions: [...correctPositions].sort(),
  distinctRenderedStems: renderedStems.size,
  status: "PASS",
}, null, 2));
