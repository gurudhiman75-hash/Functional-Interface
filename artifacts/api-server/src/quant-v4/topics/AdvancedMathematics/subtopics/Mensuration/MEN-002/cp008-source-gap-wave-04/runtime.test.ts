import assert from "node:assert/strict";
import { exactKey, isPositive } from "../foundation/exact";
import {
  getMenCp008Wave04PrototypeIds,
  MEN_CP_008_WAVE_04_PROTOTYPES,
} from "./registry";
import {
  classifyMenCp008Wave04Difficulty,
  generateMenCp008Wave04Prototype,
} from "./runtime";

const prototypeIds = getMenCp008Wave04PrototypeIds();
assert.equal(prototypeIds.length, 4, "Wave 04 contains the final source-recheck contracts, not a preset quota.");
assert.equal(new Set(prototypeIds).size, 4);

let generated = 0;
const seenShapes = new Set<string>();
const seenTargets = new Set<string>();
const seenDifficulties = new Set<string>();

for (const prototypeId of prototypeIds) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const difficulties = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp008-wave04:${prototypeId}:${index}`;
    const first = generateMenCp008Wave04Prototype(prototypeId, seed);
    const second = generateMenCp008Wave04Prototype(prototypeId, seed);

    assert.deepEqual(first, second, `${prototypeId} must regenerate deterministically for ${seed}.`);
    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${prototypeId} ${seed}: ${failures}`);
    assert.equal(first.verification.valid, true);
    assert.equal(first.difficulty, classifyMenCp008Wave04Difficulty(first.state));
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.ok(first.options.every((option) => isPositive(option.value)));
    assert.ok(first.options.filter((option) => !option.isCorrect).every((option) => option.misconceptionId));

    assert.equal(first.permanentQlId, null);
    assert.equal(first.state.permanentQlId, null);
    assert.equal(first.waveId, "MEN-CP-008-SOURCE-GAP-WAVE-04");
    assert.equal(first.reviewStatus, "UNREVIEWED");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);
    assert.equal(first.explanation.steps.length, 3);
    assert.equal(first.explanation.traps.length, 3);
    assert.ok(first.explanation.steps.every((step) => step.equation?.startsWith("$$") && step.equation.endsWith("$$")));
    assert.ok(first.explanation.traps.every((trap) => /^Option [A-D] \(\$/.test(trap) && trap.includes("This result comes from")));

    const learnerText = [
      first.stem,
      ...first.options.map((option) => option.display),
      first.answer,
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
      first.explanation.shortcut,
      ...first.explanation.traps,
    ].join("\n");
    assert.equal(/Common mistake:|FALLBACK_|misconceptionId|W4-PROT|MEN-CP008/.test(learnerText), false);
    assert.equal(/[½¼²³]/.test(learnerText), false);
    assert.equal(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), false);
    assert.equal(/[£€¥]/.test(learnerText), false);
    assert.ok(first.stem.endsWith("?") || first.stem.endsWith("."));

    if (first.state.displayMode === "RATIO") {
      assert.ok(first.options.every((option) => /^\$\d+:\d+\$$/.test(option.display)));
    }

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    difficulties.add(first.difficulty);
    seenShapes.add(first.state.shape);
    seenTargets.add(first.target);
    seenDifficulties.add(first.difficulty);
    generated += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId} must reach every answer position.`);
  assert.ok(stems.size >= 4, `${prototypeId} needs at least four source-natural stem forms.`);
  assert.ok(answers.size >= 4, `${prototypeId} needs at least four exact answers.`);
  assert.deepEqual([...difficulties].sort(), ["Hard", "Medium"]);
}

assert.equal(generated, 4 * 80);
assert.deepEqual([...seenShapes].sort(), ["CONE", "CYLINDER"]);
assert.deepEqual([...seenTargets].sort(), ["LENGTH", "RATIO"]);
assert.deepEqual([...seenDifficulties].sort(), ["Hard", "Medium"]);
assert.ok(MEN_CP_008_WAVE_04_PROTOTYPES.every((item) => item.disposition === "PROVISIONALLY_RETAIN"));

console.log(
  `MEN-CP-008 source gap wave 04 passed for ${generated} deterministic English packages across ${prototypeIds.length} final source-recheck contracts. No permanent QLs were allocated.`,
);
