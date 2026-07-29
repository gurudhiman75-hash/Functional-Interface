import assert from "node:assert/strict";
import { exactKey, isPositive } from "../foundation/exact";
import { getMenCp008PrototypeIds, MEN_CP_008_PROTOTYPES } from "./registry";
import { classifyMenCp008Difficulty, generateMenCp008Prototype } from "./runtime";

const prototypeIds = getMenCp008PrototypeIds();
assert.equal(prototypeIds.length, 20, "The CP-008 foundation is an open prototype wave, not a frozen inventory.");
assert.equal(new Set(prototypeIds).size, prototypeIds.length);

const seenPolicies = new Set<string>();
const seenKinds = new Set<string>();
const seenShapes = new Set<string>();
const seenTargets = new Set<string>();
const seenDifficulties = new Set<string>();
let generated = 0;
let rupeeAnswers = 0;
let revolutionAnswers = 0;
let ratioAnswers = 0;

for (const prototypeId of prototypeIds) {
  const positions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const difficulties = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp008-foundation:${prototypeId}:${index}`;
    const first = generateMenCp008Prototype(prototypeId, seed);
    const second = generateMenCp008Prototype(prototypeId, seed);

    assert.deepEqual(first, second, `${prototypeId} must regenerate deterministically for ${seed}.`);
    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${prototypeId} ${seed}: ${failures}`);
    assert.equal(first.verification.valid, true, `${prototypeId} failed independent verification for ${seed}.`);
    assert.equal(first.difficulty, classifyMenCp008Difficulty(first.state));
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.ok(first.options.every((option) => isPositive(option.value)), `${prototypeId} generated a non-positive option.`);
    assert.equal(first.permanentQlId, null);
    assert.equal(first.state.permanentQlId, null);
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
      /MEN-CP008|PROT-|misconceptionId|USED_|OMITTED_|REPORTED_|DIVIDED_|STOPPED_|ADDED_|SUBTRACTED_|PRICED_|INCLUDED_|BASE_ONLY|DID_NOT_|EXTRA_|MULTIPLIED_/.test(JSON.stringify(first.explanation)),
      false,
      `${prototypeId} leaks internal taxonomy.`,
    );
    assert.equal(/[£€¥]/.test(learnerText), false, `${prototypeId} contains a foreign currency symbol.`);
    assert.ok(first.stem.endsWith("?") || first.stem.endsWith("."));

    if (first.unit === "revolutions") {
      revolutionAnswers += 1;
      assert.ok(first.options.every((option) => option.value.kind === "RATIONAL" && option.value.denominator === 1n));
    }
    if (first.unit === "₹") {
      rupeeAnswers += 1;
      assert.ok(first.answer.startsWith("$\\text{₹}"));
      assert.ok(first.options.every((option) => option.display.startsWith("$\\text{₹}")));
      assert.ok(first.explanation.traps.every((trap) => trap.includes("₹")));
    }
    if (first.state.displayMode === "RATIO") {
      ratioAnswers += 1;
      assert.ok(/^\$\d+:\d+\$$/.test(first.answer));
      assert.ok(first.options.every((option) => /^\$\d+:\d+\$$/.test(option.display)));
    }
    if (first.piPolicy === "EXACT_PI" && ["PI", "PI_SURD"].includes(first.exactAnswer.kind)) {
      assert.ok(first.answer.includes("\\pi"));
      assert.equal(/3\.14|22\s*\/\s*7/.test(first.answer), false);
    }
    if (first.piPolicy === "PI_3_14") {
      assert.ok(first.stem.includes("3.14"));
      assert.equal(["PI", "PI_SURD"].includes(first.exactAnswer.kind), false);
    }
    if (first.piPolicy === "PI_22_OVER_7") {
      assert.ok(first.stem.includes("22") && first.stem.includes("7"));
      assert.equal(["PI", "PI_SURD"].includes(first.exactAnswer.kind), false);
    }

    positions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    difficulties.add(first.difficulty);
    seenPolicies.add(first.piPolicy);
    seenKinds.add(first.exactAnswer.kind);
    seenShapes.add(first.state.shape);
    seenTargets.add(first.target);
    seenDifficulties.add(first.difficulty);
    generated += 1;
  }

  assert.deepEqual([...positions].sort(), [0, 1, 2, 3], `${prototypeId} must reach all four answer positions.`);
  assert.ok(stems.size >= 4, `${prototypeId} has insufficient stem diversity: ${stems.size}.`);
  assert.ok(answers.size >= 4, `${prototypeId} has insufficient exact answer diversity: ${answers.size}.`);
  assert.ok(difficulties.size >= 2, `${prototypeId} must reach at least two state-derived difficulty bands.`);
}

assert.deepEqual([...seenPolicies].sort(), ["EXACT_PI", "PI_22_OVER_7", "PI_3_14"]);
assert.deepEqual([...seenShapes].sort(), ["CONE", "CYLINDER"]);
assert.ok(seenKinds.has("RATIONAL"));
assert.ok(seenKinds.has("SURD"));
assert.ok(seenKinds.has("PI"));
assert.ok(seenKinds.has("PI_SURD"));
for (const target of ["VOLUME", "LATERAL_SURFACE_AREA", "TOTAL_SURFACE_AREA", "LENGTH", "CAPACITY", "COUNT", "COST", "RATIO"]) {
  assert.equal(seenTargets.has(target), true, `${target} is missing from the CP-008 foundation.`);
}
assert.deepEqual([...seenDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.ok(rupeeAnswers > 0);
assert.ok(revolutionAnswers > 0);
assert.ok(ratioAnswers > 0);

const dispositions = MEN_CP_008_PROTOTYPES.reduce<Record<string, number>>((counts, prototype) => {
  counts[prototype.disposition] = (counts[prototype.disposition] ?? 0) + 1;
  return counts;
}, {});

console.log(
  `MEN-CP-008 clean prototype foundation passed for ${generated} deterministic English packages across ${prototypeIds.length} temporary prototypes. ` +
  `No permanent QLs were allocated. Provisional dispositions: ${JSON.stringify(dispositions)}.`,
);
