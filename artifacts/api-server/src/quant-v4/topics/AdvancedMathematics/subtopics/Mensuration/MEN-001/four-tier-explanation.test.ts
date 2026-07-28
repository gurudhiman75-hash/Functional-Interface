import assert from "node:assert/strict";
import { getMen001QuestionEntries } from "./library";
import { runMen001Pipeline } from "./pipeline";
import { toMen001LatexEquation } from "./structured-math-latex";
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

const forbiddenTrapLanguage = /applies the mistaken operation|misconception strateg|\bcp\d+\b|\bex\s+(?:use|report|omit|retain|double|halve|root|subtract|add)\b|“[^”]*-[^”]*”/i;
const exactHeadings = [
  "### 📌 Key Rule & Formula",
  "### 📝 Step-by-Step Solution",
  "### 💡 Exam Speed Shortcut",
  "### ⚠️ Common Traps",
] as const;

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

    assert.equal(keyRules.length, 1, `${entry.qlId} must contain one Key Rule & Formula tier.`);
    assert.ok(steps.length > 0, `${entry.qlId} must contain a step-by-step solution tier.`);
    assert.equal(shortcuts.length, 1, `${entry.qlId} must contain one Exam Speed Shortcut tier.`);
    assert.equal(traps.length, 1, `${entry.qlId} must contain one Common Traps tier.`);
    assert.equal(finalAnswers.length, 0, `${entry.qlId} must not contain a fifth Final Answer block.`);
    assert.equal(keyRules[0]!.title, "Key Rule & Formula");
    assert.equal(shortcuts[0]!.title, "Exam Speed Shortcut");
    assert.equal(traps[0]!.title, "Common Traps");

    const keyIndex = sections.findIndex((section) => section.kind === "KEY_RULE");
    const firstStepIndex = sections.findIndex((section) => section.kind === "STEP");
    const shortcutIndex = sections.findIndex((section) => section.kind === "EXAM_SHORTCUT");
    const trapIndex = sections.findIndex((section) => section.kind === "COMMON_TRAPS");
    assert.ok(
      keyIndex === 0 && keyIndex < firstStepIndex && firstStepIndex < shortcutIndex && shortcutIndex < trapIndex && trapIndex === sections.length - 1,
      `${entry.qlId} must follow exactly Key Rule → Worked Solution → Shortcut → Traps.`,
    );

    const lastStep = steps.at(-1)!;
    const canonicalAnswer = toMen001LatexEquation(question.answer);
    assert.ok(
      lastStep.equations.some((equation) => equation.includes(canonicalAnswer)),
      `${entry.qlId} must place the final answer inside the last worked step.`,
    );

    assert.equal(question.explanation.lines.length, 4, `${entry.qlId} must expose exactly four compatibility blocks.`);
    exactHeadings.forEach((heading, index) => {
      assert.ok(question.explanation.lines[index]?.startsWith(heading), `${entry.qlId} block ${index + 1} must start with ${heading}.`);
    });
    assert.ok(question.explanation.lines.every((line) => !/^###\s+.*Final Answer/im.test(line)), `${entry.qlId} retains a separate Final Answer heading.`);

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
      assert.ok(!forbiddenTrapLanguage.test(paragraph), `${entry.qlId} exposes internal or mechanical trap language: ${paragraph}`);
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
const triangleSteps = triangle.explanation.sections.filter((section) => section.kind === "STEP");
assert.deepEqual(triangleSteps.map((step) => step.title), ["Identify the Measurements", "Substitute and Calculate"]);
assert.ok(triangleSteps[0]?.equations.some((equation) => /b\s*=\s*36/.test(equation)));
assert.ok(triangleSteps[0]?.equations.some((equation) => /h\s*=\s*25/.test(equation)));
const triangleShortcut = triangle.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT");
assert.ok(triangleShortcut?.paragraphs.some((paragraph) => /Halve an even base or height/.test(paragraph)));
assert.ok(triangle.explanation.sections.find((section) => section.kind === "COMMON_TRAPS")?.paragraphs.some((paragraph) => /1\/2|\\frac\{1\}\{2\}/.test(paragraph)));

const tripletRatio = generate("MEN-CP-001", "MEN-001-QL-020", "men-001-human-review:MEN-001-QL-020:0");
assert.ok(tripletRatio.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /Pythagorean Triplet/i.test(paragraph)));
const nonTripletRatio = generate("MEN-CP-001", "MEN-001-QL-020", "men-001-human-review:MEN-001-QL-020:1");
assert.ok(nonTripletRatio.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT"));
assert.ok(nonTripletRatio.explanation.sections.every((section) => section.kind !== "EXAM_SHORTCUT" || section.paragraphs.every((paragraph) => !/Pythagorean Triplet/i.test(paragraph))));

const percentage = generate("MEN-CP-006", "MEN-001-QL-414", "men-001-human-review:MEN-001-QL-414:1");
assert.ok(percentage.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.equations.some((equation) => /2\s*\\times\s*20/.test(equation) && /44\\%/.test(equation)));

const wire = generate("MEN-CP-006", "MEN-001-QL-436", "men-001-structured-review:MEN-001-QL-436");
const wireSteps = wire.explanation.sections.filter((section) => section.kind === "STEP");
assert.deepEqual(wireSteps.map((step) => step.title), ["Find the Wire Length", "Find the Side of the Square", "Calculate the Enclosed Area"]);
assert.ok(wire.explanation.sections.find((section) => section.kind === "EXAM_SHORTCUT")?.paragraphs.some((paragraph) => /s = πr\/2/.test(paragraph)));
const wireTraps = wire.explanation.sections.find((section) => section.kind === "COMMON_TRAPS");
assert.equal(wireTraps?.paragraphs.length, 3);
assert.ok(wireTraps?.paragraphs.some((paragraph) => /circle area/i.test(paragraph)));
assert.ok(wireTraps?.paragraphs.every((paragraph) => !forbiddenTrapLanguage.test(paragraph)));

console.log(`MEN-001 exact four-tier explanation audit passed for ${audited} generated states.`);
