import assert from "node:assert/strict";
import { exactKey, isPositive } from "../foundation/exact";
import {
  getMenCp008Wave01PrototypeIds,
  MEN_CP_008_WAVE_01_PROTOTYPES,
} from "./registry";
import {
  classifyMenCp008Wave01Difficulty,
  generateMenCp008Wave01Prototype,
} from "./runtime";

const prototypeIds = getMenCp008Wave01PrototypeIds();
assert.equal(prototypeIds.length, 16, "Wave 01 contains only the first proven gap set, not a frozen inventory.");
assert.equal(new Set(prototypeIds).size, prototypeIds.length);

const seenShapes = new Set<string>();
const seenTargets = new Set<string>();
const seenPolicies = new Set<string>();
const seenDifficulties = new Set<string>();
let generated = 0;
let ratioQuestions = 0;
let piVolumeQuestions = 0;
let rollerQuestions = 0;

for (const prototypeId of prototypeIds) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const difficulties = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp008-wave01:${prototypeId}:${index}`;
    const first = generateMenCp008Wave01Prototype(prototypeId, seed);
    const second = generateMenCp008Wave01Prototype(prototypeId, seed);

    assert.deepEqual(first, second, `${prototypeId} must regenerate deterministically for ${seed}.`);
    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${prototypeId} ${seed}: ${failures}`);
    assert.equal(first.verification.valid, true, `${prototypeId} failed independent verification for ${seed}.`);
    assert.equal(first.difficulty, classifyMenCp008Wave01Difficulty(first.state));
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.ok(first.options.every((option) => isPositive(option.value)), `${prototypeId} generated a non-positive option.`);
    assert.ok(first.options.filter((option) => !option.isCorrect).every((option) => !option.misconceptionId?.startsWith("FALLBACK_")), `${prototypeId} used a generic fallback distractor.`);

    assert.equal(first.permanentQlId, null);
    assert.equal(first.state.permanentQlId, null);
    assert.equal(first.waveId, "MEN-CP-008-GAP-WAVE-01");
    assert.equal(first.reviewStatus, "UNREVIEWED");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);
    assert.equal(first.explanation.steps.length >= 2, true);
    assert.equal(first.explanation.traps.length, 3);
    assert.ok(
      first.explanation.traps.every(
        (trap) =>
          /^Option [A-D] \(\$/.test(trap) &&
          trap.includes("This result comes from") &&
          !trap.includes("Common mistake:"),
      ),
      `${prototypeId} must use the approved natural distractor wording.`,
    );

    const explanationText = [
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.title, step.body, step.equation ?? ""]),
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
    assert.equal(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(learnerText), false, `${prototypeId} contains hidden control characters.`);
    assert.equal(/[£€¥]/.test(learnerText), false, `${prototypeId} contains foreign currency.`);
    assert.equal(/MEN-CP008|W1-PROT|misconceptionId|FALLBACK_DERIVED/.test(JSON.stringify(first.explanation)), false, `${prototypeId} leaks internal taxonomy.`);
    assert.ok(first.stem.endsWith("?") || first.stem.endsWith("."));

    if (first.state.displayMode === "RATIO") {
      ratioQuestions += 1;
      assert.ok(first.options.every((option) => /^\$\d+:\d+\$$/.test(option.display)));
    }
    if (first.exactAnswer.kind === "PI") {
      piVolumeQuestions += 1;
      assert.equal(first.piPolicy, "EXACT_PI");
      assert.ok(first.answer.includes("\\pi"));
    }
    if (first.piPolicy === "PI_22_OVER_7") {
      rollerQuestions += 1;
      assert.ok(first.stem.includes("22") && first.stem.includes("7"));
      assert.equal(first.exactAnswer.kind, "RATIONAL");
    }

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    difficulties.add(first.difficulty);
    seenShapes.add(first.state.shape);
    seenTargets.add(first.target);
    seenPolicies.add(first.piPolicy);
    seenDifficulties.add(first.difficulty);
    generated += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId} must reach every answer position.`);
  assert.ok(stems.size >= 4, `${prototypeId} has insufficient stem diversity: ${stems.size}.`);
  assert.ok(answers.size >= 4, `${prototypeId} has insufficient exact answer diversity: ${answers.size}.`);
  assert.ok(difficulties.size >= 2, `${prototypeId} must reach at least two state-derived difficulty bands.`);
}

assert.equal(generated, 16 * 80);
assert.deepEqual([...seenShapes].sort(), ["CONE", "CYLINDER"]);
assert.ok(seenTargets.has("LENGTH"));
assert.ok(seenTargets.has("RATIO"));
assert.ok(seenTargets.has("PERCENT_CHANGE"));
assert.ok(seenTargets.has("VOLUME"));
assert.deepEqual([...seenPolicies].sort(), ["EXACT_PI", "PI_22_OVER_7"]);
assert.deepEqual([...seenDifficulties].sort(), ["Hard", "Medium"]);
assert.ok(ratioQuestions > 0);
assert.ok(piVolumeQuestions > 0);
assert.ok(rollerQuestions > 0);

const dispositionCounts = MEN_CP_008_WAVE_01_PROTOTYPES.reduce<Record<string, number>>((counts, item) => {
  counts[item.disposition] = (counts[item.disposition] ?? 0) + 1;
  return counts;
}, {});

console.log(
  `MEN-CP-008 gap wave 01 passed for ${generated} deterministic English packages across ${prototypeIds.length} temporary contracts. ` +
  `No permanent QLs were allocated. Provisional dispositions: ${JSON.stringify(dispositionCounts)}.`,
);
