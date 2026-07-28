import assert from "node:assert/strict";
import { exactKey, isPositive } from "../foundation/exact";
import {
  getMenCp007Wave03PrototypeIds,
  MEN_CP_007_WAVE_03_PROTOTYPES,
} from "./registry";
import {
  classifyMenCp007Wave03Difficulty,
  generateMenCp007Wave03Prototype,
} from "./runtime";

const prototypeIds = getMenCp007Wave03PrototypeIds();
assert.equal(prototypeIds.length, 15, "Wave 03 is an open discovery set, not a frozen inventory.");
assert.equal(new Set(prototypeIds).size, prototypeIds.length);

const seenTargets = new Set<string>();
const seenShapes = new Set<string>();
const seenDifficulties = new Set<string>();
let generated = 0;
let percentageAnswers = 0;
let sterlingCostAnswers = 0;
let sterlingRateAnswers = 0;

for (const prototypeId of prototypeIds) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const difficulties = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp007-wave03:${prototypeId}:${index}`;
    const first = generateMenCp007Wave03Prototype(prototypeId, seed);
    const second = generateMenCp007Wave03Prototype(prototypeId, seed);

    assert.deepEqual(first, second, `${prototypeId} must regenerate deterministically for ${seed}.`);
    const validationFailures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${prototypeId} ${seed}: ${validationFailures}`);
    assert.equal(first.verification.valid, true, `${prototypeId} failed independent verification for ${seed}.`);
    assert.equal(first.difficulty, classifyMenCp007Wave03Difficulty(first.state));
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    if (["cubes", "blocks", "bricks", "cuts"].includes(first.unit)) {
      assert.ok(
        first.options.every((option) => option.value.kind === "RATIONAL" && option.value.denominator === 1n),
        `${prototypeId} count options must all be whole numbers.`,
      );
    }
    assert.ok(first.options.every((option) => isPositive(option.value)), `${prototypeId} generated a non-positive option.`);
    assert.equal(first.permanentQlId, null);
    assert.equal(first.state.permanentQlId, null);
    assert.equal(first.waveId, "MEN-CP-007-GAP-WAVE-03");
    assert.equal(first.reviewStatus, "UNREVIEWED");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);
    assert.equal(first.explanation.steps.length >= 2, true);
    assert.equal(first.explanation.traps.length, 3);
    assert.ok(first.explanation.traps.every((trap) => /^Option [A-D] \(\$/.test(trap) && trap.includes("Common mistake:")));

    const explanationText = [
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.body, step.equation ?? ""]),
      first.explanation.shortcut,
      ...first.explanation.traps,
    ].join("\n");
    const learnerText = [
      first.stem,
      ...first.options.map((option) => option.display),
      first.answer,
      explanationText,
    ].join("\n");

    assert.equal(/[½¼²³]/.test(learnerText), false, `${prototypeId} contains raw Unicode fractions or powers.`);
    assert.equal(/(^|[^\\])sqrt\{/.test(explanationText), false, `${prototypeId} contains bare square-root markup.`);
    assert.equal(/\$\$[^$]*\/[^$]*\$\$/.test(explanationText), false, `${prototypeId} contains raw slash division in display maths.`);
    assert.equal(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), false, `${prototypeId} contains a hidden control character.`);
    assert.equal(
      /MEN-CP007|W3-PROT|misconceptionId|ADDED_|USED_|OMITTED_|REPORTED_|DIVIDED_|SUBTRACTED_|STOPPED_|COUNTED_|CHOSE_|PAINTED_|MIXED_|CONVERTED_|NEARBY_|FOUND_|TOP_ONLY|EXTRA_/.test(JSON.stringify(first.explanation)),
      false,
      `${prototypeId} leaks internal taxonomy.`,
    );
    assert.equal(/₹/.test(learnerText), false, `${prototypeId} leaks an unintended currency symbol.`);
    assert.ok(first.stem.endsWith("?") || first.stem.endsWith("."));

    if (first.unit === "%") {
      percentageAnswers += 1;
      assert.ok(first.answer.endsWith("\\%$"));
    }
    if (first.unit === "£") {
      sterlingCostAnswers += 1;
      assert.ok(first.answer.startsWith("$\\text{£}"));
    }
    if (first.unit === "£/m") {
      sterlingRateAnswers += 1;
      assert.ok(first.answer.startsWith("$\\text{£}"));
      assert.ok(first.answer.includes("/\\text{m}$"));
    }

    positions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    difficulties.add(first.difficulty);
    seenTargets.add(first.target);
    seenShapes.add(first.state.shape);
    seenDifficulties.add(first.difficulty);
    generated += 1;
  }

  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${prototypeId} must reach all answer positions.`);
  assert.ok(stems.size >= 4, `${prototypeId} has insufficient stem diversity: ${stems.size}.`);
  assert.ok(answers.size >= 4, `${prototypeId} has insufficient exact answer diversity: ${answers.size}.`);
  assert.ok(difficulties.size >= 2, `${prototypeId} must reach at least two state-derived difficulty bands.`);
}

assert.deepEqual([...seenShapes].sort(), ["CUBE", "CUBOID", "RIGHT_PRISM"]);
for (const target of ["LENGTH", "VOLUME", "COUNT", "PERCENT_CHANGE", "COST", "RATE", "SURFACE_AREA"]) {
  assert.equal(seenTargets.has(target), true, `${target} is missing from Wave 03.`);
}
assert.deepEqual([...seenDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.ok(percentageAnswers > 0, "Wave 03 must prove exact percentage rendering.");
assert.ok(sterlingCostAnswers > 0, "Wave 03 must prove en-GB cost rendering.");
assert.ok(sterlingRateAnswers > 0, "Wave 03 must prove en-GB wire-rate rendering.");

const dispositions = MEN_CP_007_WAVE_03_PROTOTYPES.reduce<Record<string, number>>((counts, prototype) => {
  counts[prototype.disposition] = (counts[prototype.disposition] ?? 0) + 1;
  return counts;
}, {});

console.log(
  `MEN-CP-007 gap wave 03 passed for ${generated} deterministic English packages across ${prototypeIds.length} temporary contracts. ` +
  `No permanent QLs were allocated. Provisional dispositions: ${JSON.stringify(dispositions)}.`,
);
