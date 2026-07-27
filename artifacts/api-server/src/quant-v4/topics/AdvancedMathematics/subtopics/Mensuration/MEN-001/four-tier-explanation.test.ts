import assert from "node:assert/strict";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import type { Men001ActiveCanonicalProblemId } from "./types";

function generate(cpId: Men001ActiveCanonicalProblemId, qlId: string, seed: string) {
  return runMen001Pipeline(cpId, {
    language: "en",
    questionLanguageId: qlId,
    seed,
  });
}

function wrongOptionLetters(correctIndex: number) {
  return [0, 1, 2, 3]
    .filter((index) => index !== correctIndex)
    .map((index) => String.fromCharCode(65 + index))
    .sort();
}

let audited = 0;
for (const entry of getMen001QuestionEntries()) {
  for (let sample = 0; sample < 3; sample += 1) {
    const question = generate(
      entry.cpId as Men001ActiveCanonicalProblemId,
      entry.qlId,
      `men-001-four-tier:${entry.qlId}:${sample}`,
    );
    const sections = question.explanation.sections;
    assert.equal(
      question.explanation.displayFormat,
      "FOUR_TIER_COMPETITIVE_EXPLANATION",
      `${entry.qlId} must expose the competitive four-tier display contract.`,
    );

    const keyRules = sections.filter((section) => section.kind === "KEY_RULE");
    const steps = sections.filter((section) => section.kind === "STEP");
    const shortcuts = sections.filter((section) => section.kind === "EXAM_SHORTCUT");
    const traps = sections.filter((section) => section.kind === "COMMON_TRAPS");
    const finalAnswers = sections.filter((section) => section.kind === "FINAL_ANSWER");

    assert.equal(keyRules.length, 1, `${entry.qlId} must contain one Key Rule & Formula block.`);
    assert.ok(steps.length > 0, `${entry.qlId} must contain a step-by-step solution.`);
    assert.equal(shortcuts.length, 1, `${entry.qlId} must contain one Exam Speed Shortcut block.`);
    assert.equal(traps.length, 1, `${entry.qlId} must contain one Common Traps block.`);
    assert.equal(finalAnswers.length, 1, `${entry.qlId} must contain one Final Answer block.`);
    assert.equal(keyRules[0]!.title, "Key Rule & Formula");
    assert.equal(shortcuts[0]!.title, "Exam Speed Shortcut");
    assert.equal(traps[0]!.title, "Common Traps");

    const keyIndex = sections.findIndex((section) => section.kind === "KEY_RULE");
    const firstStepIndex = sections.findIndex((section) => section.kind === "STEP");
    const shortcutIndex = sections.findIndex((section) => section.kind === "EXAM_SHORTCUT");
    const trapIndex = sections.findIndex((section) => section.kind === "COMMON_TRAPS");
    const finalIndex = sections.findIndex((section) => section.kind === "FINAL_ANSWER");
    assert.ok(
      keyIndex === 0 && keyIndex < firstStepIndex && firstStepIndex < shortcutIndex && shortcutIndex < trapIndex && trapIndex < finalIndex,
      `${entry.qlId} must follow Key Rule → Worked Solution → Shortcut → Traps → Final Answer.`,
    );

    const shortcutBlock = shortcuts[0]!;
    assert.ok(
      shortcutBlock.paragraphs.length > 0 || shortcutBlock.equations.length > 0,
      `${entry.qlId} has an empty Exam Speed Shortcut block.`,
    );

    const trapBlock = traps[0]!;
    assert.equal(trapBlock.paragraphs.length, 3, `${entry.qlId} must explain all three wrong options.`);
    const displayedTrapLetters = trapBlock.paragraphs.map((paragraph) => {
      const match = paragraph.match(/^Option ([A-D]) \(.+\): /);
      assert.ok(match, `${entry.qlId} trap must name its actual option letter and value.`);
      assert.ok(!/misconception strateg|[a-z]+-[a-z]+-[a-z]+/.test(paragraph), `${entry.qlId} exposes internal strategy jargon.`);
      return match[1]!;
    }).sort();
    assert.deepEqual(
      displayedTrapLetters,
      wrongOptionLetters(question.correctIndex),
      `${entry.qlId} trap callouts must cover every wrong option and exclude the correct option.`,
    );

    audited += 1;
  }
}

const triangle = generate("MEN-CP-001", "MEN-001-QL-001", "men-001-structured-review:MEN-001-QL-001");
const triangleShortcut = triangle.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT");
assert.ok(triangleShortcut?.paragraphs.some((paragraph) => /Halve an even base or height/.test(paragraph)));
assert.ok(triangle.explanation.sections.find((section) => section.kind === "COMMON_TRAPS")?.paragraphs.some((paragraph) => /1\/2|\\frac\{1\}\{2\}/.test(paragraph)));

const tripletRatio = generate("MEN-CP-001", "MEN-001-QL-020", "men-001-human-review:MEN-001-QL-020:0");
assert.ok(tripletRatio.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /Pythagorean triplet/.test(paragraph)));
const nonTripletRatio = generate("MEN-CP-001", "MEN-001-QL-020", "men-001-human-review:MEN-001-QL-020:1");
assert.ok(nonTripletRatio.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT"));
assert.ok(nonTripletRatio.explanation.sections.every((section) => section.kind !== "EXAM_SHORTCUT" || section.paragraphs.every((paragraph) => !/Pythagorean triplet/.test(paragraph))));

const percentage = generate("MEN-CP-006", "MEN-001-QL-414", "men-001-human-review:MEN-001-QL-414:1");
assert.ok(percentage.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.equations.some((equation) => /2\s*\\times\s*20/.test(equation) && /44\\%/.test(equation)));

const wire = generate("MEN-CP-006", "MEN-001-QL-436", "men-001-structured-review:MEN-001-QL-436");
assert.ok(wire.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /s = πr\/2/.test(paragraph)));
assert.ok(wire.explanation.sections.find((section) => section.kind === "COMMON_TRAPS")?.paragraphs.length === 3);

console.log(`MEN-001 four-tier explanation audit passed for ${audited} generated states.`);
