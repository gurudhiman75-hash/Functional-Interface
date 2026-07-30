import assert from "node:assert/strict";
import { exactKey } from "../../foundation/exact";
import { MEN_CP_007_FROZEN_QLS } from "../final-freeze/registry";
import {
  getMenCp007NaturalLanguageAuthorityCount,
  getMenCp007ShortcutAuthorityCount,
} from "./editorial-v2";
import {
  generateMenCp007PermanentQuestion,
  generateMenCp007PermanentQuestionFromPrototype,
  generateMenCp007SourcePrototype,
} from "./runtime";

assert.equal(MEN_CP_007_FROZEN_QLS.length, 43);
assert.equal(getMenCp007ShortcutAuthorityCount(), 43);
assert.equal(getMenCp007NaturalLanguageAuthorityCount(), 43);

const reachedPrototypes = new Set<string>();
const reachedDifficulties = new Set<string>();
const shortcutOpeners = new Set<string>();
let generated = 0;

const ROBOTIC_LANGUAGE = /\bexceeds\b|represents exactly two|turn the given|receives? (?:a )?multiplier|whole rectangle|Common mistake:/i;

function optionAuthority(option: {
  label: "A" | "B" | "C" | "D";
  value: unknown;
  isCorrect: boolean;
  misconceptionId: string | null;
}) {
  return {
    label: option.label,
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  };
}

for (const definition of MEN_CP_007_FROZEN_QLS) {
  const answerPositions = new Set<number>();
  const stems = new Set<string>();
  const answers = new Set<string>();
  const shortcuts = new Set<string>();

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
    assert.deepEqual(
      first.options.map(optionAuthority),
      source.options.map(optionAuthority),
      "Editorial presentation must preserve option order, exact values, correctness and misconception ownership.",
    );
    assert.equal(first.correctIndex, source.correctIndex, "Editorial V2 must not change the correct index.");
    assert.deepEqual(first.exactAnswer, source.exactAnswer, "Editorial V2 must not change the exact answer.");
    assert.equal(first.unit, source.unit, "Editorial V2 must not change the answer unit.");
    assert.equal(first.difficulty, source.difficulty, "Editorial V2 must not change difficulty.");
    assert.deepEqual(first.verification, source.verification, "Editorial V2 must preserve independent verification.");
    assert.deepEqual(first.sourceValidation, source.validation, "Editorial V2 must preserve source validation.");
    assert.deepEqual(first.sourceState.dimensions, source.state.dimensions, "Editorial V2 must preserve canonical dimensions.");
    assert.deepEqual(first.sourceState.derived, source.state.derived, "Editorial V2 must preserve derived exact state.");

    if (definition.qlId === "MEN-002-QL-040") {
      assert.match(first.stem, /Give the answer correct to two decimal places\.$/);
      assert.ok(first.options.every((option) => /^\$\d+\.\d{2}\\%\$$/.test(option.display)));
      assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
      assert.notEqual(first.answer, source.answer, "Waste percentage must use the declared rounded display rather than an awkward exact fraction.");
      assert.ok(first.explanation.steps.some((step) => step.equation?.includes("\\approx")));
      assert.ok(first.explanation.traps.every((trap) => /Option [A-D] \(\$\d+\.\d{2}\\%\$\)/.test(trap)));
    } else {
      assert.deepEqual(first.options, source.options, "Non-rounded families must preserve option displays exactly.");
      assert.equal(first.answer, source.answer, "Non-rounded families must preserve the displayed answer exactly.");
    }

    assert.equal(first.options.length, 4);
    assert.equal(new Set(first.options.map((option) => exactKey(option.value))).size, 4);
    assert.equal(new Set(first.options.map((option) => option.display)).size, 4);
    assert.equal(first.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(first.options[first.correctIndex]?.isCorrect, true);
    assert.equal(first.answer, first.options[first.correctIndex]?.display);
    assert.equal(first.explanation.steps.length >= 2, true);
    assert.equal(first.explanation.traps.length, 3);
    assert.ok(
      first.explanation.traps.every(
        (trap) =>
          /^Option [A-D] \(\$/.test(trap) &&
          /This option|You may reach this option|This answer appears/.test(trap) &&
          trap.length >= 55,
      ),
      `${definition.qlId} requires natural, option-specific distractor explanations.`,
    );

    const learnerText = [
      first.stem,
      first.explanation.keyRule,
      ...first.explanation.steps.flatMap((step) => [step.title, step.body]),
      first.explanation.shortcut,
      ...first.explanation.traps,
    ].join("\n");
    assert.doesNotMatch(learnerText, ROBOTIC_LANGUAGE);
    assert.ok(first.explanation.keyRule.length >= 90, `${definition.qlId} key rule is too compressed.`);
    assert.ok(
      first.explanation.steps.every((step) => step.body.length >= 48),
      `${definition.qlId} contains an under-explained worked step.`,
    );
    assert.ok(
      first.explanation.steps[first.explanation.steps.length - 1]?.body.includes(first.answer),
      `${definition.qlId} final worked step must state the required answer.`,
    );

    assert.equal(first.editorialLayoutId, "MEN-CP007-EN-EDITORIAL-V2");
    assert.equal(first.editorialStatus, "PENDING_PRODUCT_REVIEW");
    assert.match(first.explanation.shortcut, /^(Exam-speed method|Fast exam route|Time-saving check|Quick calculation route):/);
    assert.doesNotMatch(first.explanation.shortcut, /^Quick way:/);
    assert.doesNotMatch(first.explanation.shortcut, /, giving /);
    assert.match(first.explanation.shortcut, /given values|numbers in this question|current values|question's data/);
    assert.ok(first.explanation.shortcut.length >= 100, `${definition.qlId} shortcut is too thin.`);
    assert.ok(first.explanation.shortcut.includes("$"), `${definition.qlId} shortcut requires a numerical MathJax calculation.`);
    assert.doesNotMatch(first.explanation.shortcut, /This isolates|This finds|Use the arrangement that gives|The question asks for/);
    assert.doesNotMatch(JSON.stringify(first.explanation), /\\sqrt[23]\b|Shortest\\ side|Longer\\ side/);
    assert.doesNotMatch(first.stem, /\bcubical\b|constant base area/i);
    if (definition.qlId === "MEN-002-QL-042") {
      assert.match(first.explanation.shortcut, /\\lfloor/);
    }

    assert.equal(first.packageId, "MEN-002");
    assert.equal(first.canonicalProblemId, "MEN-CP-007");
    assert.equal(first.language, "en");
    assert.equal(first.maturity, "IMPLEMENTATION_PROOF");
    assert.equal(first.allocationStatus, "ALLOCATED_IMPLEMENTATION_PROOF");
    assert.equal(first.permanentIdentityFrozen, true);
    assert.equal(first.active, false);
    assert.equal(first.reviewStatus, "PENDING_ENGLISH_EDITORIAL_REVIEW");
    assert.equal(first.questionBankStatus, "NOT_STORED");
    assert.equal(first.questionBankWritable, false);
    assert.equal(first.testEligibility, "INELIGIBLE");
    assert.equal(first.testEligible, false);
    assert.equal(first.publiclyPublishable, false);
    assert.equal(first.questionStudioDiscoverable, false);

    reachedPrototypes.add(first.sourcePrototypeId);
    reachedDifficulties.add(first.difficulty);
    shortcutOpeners.add(first.explanation.shortcut.split(":", 1)[0]!);
    answerPositions.add(first.correctIndex);
    stems.add(first.stem);
    answers.add(exactKey(first.exactAnswer));
    shortcuts.add(first.explanation.shortcut);
    generated += 1;
  }

  assert.deepEqual([...answerPositions].sort(), [0, 1, 2, 3], `${definition.qlId} must reach every answer position.`);
  assert.ok(stems.size >= 4, `${definition.qlId} requires at least four distinct rendered stems; found ${stems.size}.`);
  assert.ok(answers.size >= 4, `${definition.qlId} requires at least four distinct exact answers; found ${answers.size}.`);
  assert.ok(shortcuts.size >= 4, `${definition.qlId} requires state-specific shortcut variation; found ${shortcuts.size}.`);
}

const expectedOwnedPrototypes = new Set(MEN_CP_007_FROZEN_QLS.flatMap((item) => item.prototypeIds));
assert.equal(expectedOwnedPrototypes.size, 63);
assert.deepEqual([...reachedPrototypes].sort(), [...expectedOwnedPrototypes].sort(), "Every frozen prototype ancestry must be reachable through its permanent QL.");
assert.deepEqual([...reachedDifficulties].sort(), ["Easy", "Hard", "Medium"]);
assert.deepEqual([...shortcutOpeners].sort(), ["Exam-speed method", "Fast exam route", "Quick calculation route", "Time-saving check"]);
assert.equal(generated, 43 * 80);

for (const definition of MEN_CP_007_FROZEN_QLS) {
  for (const prototypeId of definition.prototypeIds) {
    const forced = generateMenCp007PermanentQuestionFromPrototype(
      definition.qlId,
      `forced-ancestry:${definition.qlId}:${prototypeId}`,
      prototypeId,
      "en",
    );
    assert.equal(forced.sourcePrototypeId, prototypeId);
    assert.equal(forced.validation.valid, true);
  }
}

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
assert.throws(
  () => generateMenCp007PermanentQuestionFromPrototype(
    "MEN-002-QL-001",
    "wrong-ancestry",
    "MEN-CP007-PROT-CUBE-TSA",
    "en",
  ),
  /is not approved ancestry/,
);

console.log(
  `MEN-CP-007 English editorial V2 passed for ${generated} deterministic permanent questions across 43 QLs and 63 prototype ancestries. ` +
  "Exact mathematics, options, states and verifier evidence remain frozen; learner explanations now use natural, calculation-led language and accessible distractor analysis.",
);
