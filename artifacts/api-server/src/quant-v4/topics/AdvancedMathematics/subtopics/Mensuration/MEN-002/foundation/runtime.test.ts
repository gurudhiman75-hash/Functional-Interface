import assert from "node:assert/strict";
import { exactKey, formatIndianInteger } from "./exact";
import { getMenCp007PrototypeIds, MEN_CP_007_PROTOTYPES } from "./prototype-registry";
import { classifyMenCp007Difficulty, generateMenCp007Prototype } from "./runtime";

const prototypes = getMenCp007PrototypeIds();
assert.equal(prototypes.length, 18, "The first checkpoint should expose its current prototype count without treating it as final inventory.");
assert.equal(new Set(prototypes).size, prototypes.length);

const seenTargets = new Set<string>();
const seenShapes = new Set<string>();
const seenDifficulties = new Set<string>();
let generated = 0;
let exactSurdAnswers = 0;
let rupeeAnswers = 0;

for (const prototypeId of prototypes) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const localDifficulties = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-002-cp007-foundation:${prototypeId}:${index}`;
    const first = generateMenCp007Prototype(prototypeId, seed);
    const second = generateMenCp007Prototype(prototypeId, seed);

    assert.deepEqual(first, second, `${prototypeId} must regenerate deterministically for seed ${seed}.`);
    assert.equal(first.validation.valid, true, first.validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("; "));
    assert.equal(first.verification.valid, true, `${prototypeId} failed independent verification.`);
    assert.equal(first.difficulty, classifyMenCp007Difficulty(first.state), `${prototypeId} difficulty must derive from the canonical generated state.`);
    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.ok(first.options.every((option) => !/[²³]/.test(option.display)), `${prototypeId} option units must use MathJax powers rather than Unicode superscripts.`);
    assert.equal(/[²³]/.test(first.answer), false, `${prototypeId} answer units must use MathJax powers.`);
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
    assert.equal(/MEN-CP007|PROT-|misconceptionId|USED_|OMITTED_|IGNORED_|REPORTED_|EXTRA_|ADDED_|PAINTED_/.test(JSON.stringify(first.explanation)), false);

    const explanationText = [
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.body, step.equation ?? ""]),
      first.explanation.shortcut,
      ...first.explanation.traps,
    ].join("\n");
    const learnerText = [first.stem, ...first.options.map((option) => option.display), first.answer, explanationText].join("\n");

    assert.equal(/[½¼]/.test(learnerText), false);
    assert.equal(/(^|[^\\])sqrt\{/.test(explanationText), false, `${prototypeId} contains bare square-root markup without a MathJax backslash.`);
    assert.equal(/[£€¥]/.test(learnerText), false, `${prototypeId} contains a foreign currency symbol.`);
    assert.ok(first.stem.endsWith("?") || first.stem.endsWith("."));

    if (first.exactAnswer.kind === "SURD") {
      exactSurdAnswers += 1;
      assert.equal(/\.\d{2}/.test(first.answer), false, "Exact surd answers must not be replaced by rounded decimals.");
      assert.ok(first.answer.includes("\\sqrt"));
    }
    if (first.unit === "₹") {
      rupeeAnswers += 1;
      assert.ok(first.stem.includes("\\text{₹}"));
      assert.ok(first.answer.startsWith("$\\text{₹}"), "Indian rupee must precede the amount in Indian exam output.");
      if (first.exactAnswer.kind === "RATIONAL" && first.exactAnswer.denominator === 1n && first.exactAnswer.numerator >= 1000n) {
        assert.ok(first.answer.includes(formatIndianInteger(first.exactAnswer.numerator)), "Rupee amounts must use Indian digit grouping.");
      }
    }

    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    localDifficulties.add(first.difficulty);
    seenTargets.add(first.target);
    seenShapes.add(first.state.shape);
    seenDifficulties.add(first.difficulty);
    generated += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${prototypeId} must reach every correct-answer position.`);
  assert.ok(stems.size >= 4, `${prototypeId} has insufficient deterministic stem diversity: ${stems.size}.`);
  assert.ok(answers.size >= 4, `${prototypeId} has insufficient exact answer diversity: ${answers.size}.`);
  assert.ok(localDifficulties.size >= 2, `${prototypeId} must demonstrate state-derived difficulty variation.`);
}

assert.deepEqual([...seenShapes].sort(), ["CUBE", "CUBOID", "RIGHT_PRISM"]);
for (const target of ["VOLUME", "CAPACITY", "SURFACE_AREA", "TOTAL_SURFACE_AREA", "LENGTH", "DIAGONAL", "COUNT", "COST", "PERCENT_CHANGE", "RATIO"]) {
  assert.equal(seenTargets.has(target), true, `${target} was not reached by the prototype foundation.`);
}
assert.deepEqual([...seenDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.ok(exactSurdAnswers > 0, "The foundation must prove exact surd output.");
assert.ok(rupeeAnswers > 0, "The foundation must prove Indian rupee rendering.");

const provisionalCounts = MEN_CP_007_PROTOTYPES.reduce<Record<string, number>>((counts, prototype) => {
  counts[prototype.provisionalDisposition] = (counts[prototype.provisionalDisposition] ?? 0) + 1;
  return counts;
}, {});

console.log(
  `MEN-CP-007 prototype foundation passed for ${generated} deterministic English packages across ${prototypes.length} temporary prototypes. ` +
  `This is an open discovery checkpoint, not a frozen QL or solve-mode count. Dispositions: ${JSON.stringify(provisionalCounts)}.`,
);
