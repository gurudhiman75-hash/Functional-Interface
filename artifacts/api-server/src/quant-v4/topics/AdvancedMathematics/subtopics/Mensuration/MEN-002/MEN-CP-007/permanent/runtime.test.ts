import assert from "node:assert/strict";
import { exactKey } from "../../foundation/exact";
import { MEN_CP_007_FROZEN_QLS } from "../final-freeze/registry";
import {
  generateMenCp007PermanentQuestion,
  generateMenCp007SourcePrototype,
} from "./runtime";

assert.equal(MEN_CP_007_FROZEN_QLS.length, 43);

const reachedPrototypes = new Set<string>();
const reachedDifficulties = new Set<string>();
let generated = 0;

for (const definition of MEN_CP_007_FROZEN_QLS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();

  for (let index = 0; index < 80; index += 1) {
    const seed = `men-cp007-permanent-proof:${definition.qlId}:${index}`;
    const first = generateMenCp007PermanentQuestion(definition.qlId, seed, "en");
    const second = generateMenCp007PermanentQuestion(definition.qlId, seed, "en");
    assert.deepEqual(first, second, `${definition.qlId} must regenerate deterministically for ${seed}.`);

    const failures = first.validation.checks
      .filter((check) => !check.passed)
      .map((check) => `${check.name}: ${check.message}`)
      .join("; ");
    assert.equal(first.validation.valid, true, `${definition.qlId} ${seed}: ${failures}`);
    assert.equal(first.sourceValidation.valid, true);
    assert.equal(first.verification.valid, true);
    assert.equal(first.qlId, definition.qlId);
    assert.equal(first.templateId, definition.templateId);
    assert.equal(first.canonicalSolveMode, definition.canonicalSolveMode);
    assert.equal(first.target, definition.target);
    assert.ok(definition.prototypeIds.includes(first.sourcePrototypeId));
    assert.equal(first.sourceState.prototypeId, first.sourcePrototypeId);
    assert.equal(first.sourceState.solveMode, first.sourceSolveMode);
    assert.equal(first.sourceState.seed, first.sourceSeed);

    const source = generateMenCp007SourcePrototype(first.sourcePrototypeId, first.sourceSeed);
    assert.equal(first.stem, source.stem);
    assert.deepEqual(first.options, source.options);
    assert.equal(first.correctIndex, source.correctIndex);
    assert.equal(first.answer, source.answer);
    assert.deepEqual(first.exactAnswer, source.exactAnswer);
    assert.equal(first.unit, source.unit);
    assert.deepEqual(first.explanation, source.explanation);
    assert.deepEqual(first.verification, source.verification);
    assert.deepEqual(first.sourceValidation, source.validation);

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.equal(first.explanation.steps.length >= 2, true);
    assert.equal(first.explanation.traps.length, 3);

    assert.equal(first.packageId, "MEN-002");
    assert.equal(first.canonicalProblemId, "MEN-CP-007");
    assert.equal(first.language, "en");
    assert.equal(first.maturity, "IMPLEMENTATION_PROOF");
    assert.equal(first.allocationStatus, "ALLOCATED_IMPLEMENTATION_PROOF");
    assert.equal(first.permanentIdentityFrozen, true);
    assert.equal(first.active, false);
    assert.equal(first.reviewStatus, "UNREVIEWED_PERMANENT_ENGLISH");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.questionBankWritable, false);
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.testEligible, false);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);

    reachedPrototypes.add(first.sourcePrototypeId);
    reachedDifficulties.add(first.difficulty);
    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    generated += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${definition.qlId} must reach every answer position.`);
  assert.ok(stems.size >= 4, `${definition.qlId} requires at least four distinct rendered stems; found ${stems.size}.`);
  assert.ok(answers.size >= 4, `${definition.qlId} requires at least four distinct exact answers; found ${answers.size}.`);
}

const expectedOwnedPrototypes = new Set(MEN_CP_007_FROZEN_QLS.flatMap((item) => item.prototypeIds));
assert.equal(expectedOwnedPrototypes.size, 63);
assert.deepEqual([...reachedPrototypes].sort(), [...expectedOwnedPrototypes].sort(), "Every frozen prototype ancestry must be reachable through its permanent QL.");
assert.deepEqual([...reachedDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.equal(generated, 43 * 80);

assert.throws(
  () => generateMenCp007PermanentQuestion("MEN-002-QL-999", "unknown-ql", "en"),
  /Unknown MEN-CP-007 permanent QL/,
);
assert.throws(
  () => generateMenCp007PermanentQuestion("MEN-002-QL-001", "", "en"),
  /non-empty deterministic seed/,
);
assert.throws(
  () => generateMenCp007PermanentQuestion("MEN-002-QL-001", "unsupported-hi", "hi"),
  /supports English only/,
);
assert.throws(
  () => generateMenCp007PermanentQuestion("MEN-002-QL-001", "unsupported-pa", "pa"),
  /supports English only/,
);

console.log(
  `MEN-CP-007 permanent English runtime passed for ${generated} deterministic questions across 43 frozen QLs and 63 prototype ancestries. ` +
  "Every permanent identity remains inactive, undiscoverable, unstored, test-ineligible and unpublished.",
);
