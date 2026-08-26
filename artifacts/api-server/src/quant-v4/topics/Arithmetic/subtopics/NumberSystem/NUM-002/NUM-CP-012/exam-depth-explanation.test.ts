import assert from "node:assert/strict";

import { buildNumCp012ExamDepthExplanation } from "./exam-depth-explanation.ts";
import { generateNumCp012Wave01 } from "./wave01/runtime.ts";
import type { NumCp012Wave01PrototypeId } from "./wave01/types.ts";
import { generateNumCp012Wave02 } from "./wave02/runtime.ts";
import type { NumCp012Wave02PrototypeId } from "./wave02/types.ts";
import { generateNumCp012QuestionStudioBatch, NUM_CP012_QUESTION_STUDIO_QL_IDS } from "./question-studio-integration.ts";

const wave01: readonly NumCp012Wave01PrototypeId[] = [
  "NUM-CP012-PROT-001",
  "NUM-CP012-PROT-002",
  "NUM-CP012-PROT-003",
  "NUM-CP012-PROT-004",
  "NUM-CP012-PROT-005",
  "NUM-CP012-PROT-006",
  "NUM-CP012-PROT-007",
  "NUM-CP012-PROT-008",
];
const wave02: readonly NumCp012Wave02PrototypeId[] = [
  "NUM-CP012-PROT-009",
  "NUM-CP012-PROT-010",
  "NUM-CP012-PROT-011",
  "NUM-CP012-PROT-012",
  "NUM-CP012-PROT-013",
  "NUM-CP012-PROT-014",
];

let prototypeChecks = 0;
for (const prototypeId of wave01) {
  for (const seed of [1, 2, 5]) {
    const pkg = generateNumCp012Wave01(prototypeId, seed);
    const explanation = buildNumCp012ExamDepthExplanation(pkg, "en");
    assert.equal(explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(explanation.fullDerivation.length >= 3, `${prototypeId}/${seed}: derivation too thin`);
    assert.ok(explanation.examShortcut.length >= 1, `${prototypeId}/${seed}: shortcut missing`);
    assert.match(explanation.lines.join("\n"), /Full derivation/u);
    assert.match(explanation.lines.join("\n"), /Exam shortcut \/ shorter route/u);
    assert.match(explanation.lines.at(-1)!, /Answer:/u);
    prototypeChecks += 1;
  }
}

for (const prototypeId of wave02) {
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const pkg = generateNumCp012Wave02(prototypeId, seed);
    const explanation = buildNumCp012ExamDepthExplanation(pkg, "en");
    assert.equal(explanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(explanation.fullDerivation.length >= 2, `${prototypeId}/${seed}: derivation too thin`);
    assert.ok(explanation.examShortcut.length >= 1, `${prototypeId}/${seed}: shortcut missing`);
    assert.match(explanation.lines.join("\n"), /Answer:/u);
    prototypeChecks += 1;
  }
}

// Regression for the user-reported hidden-jump class: a transformed term must show
// the arithmetic or exponent operation that produced it, rather than only assert it.
const multiplier = buildNumCp012ExamDepthExplanation(generateNumCp012Wave01("NUM-CP012-PROT-003", 1), "en");
const multiplierText = multiplier.fullDerivation.join("\n");
assert.match(multiplierText, /÷/u);
assert.match(multiplierText, /\d+ = \d+ × \d+ \+ \d+/u);
assert.match(multiplierText, /So add \d+ more factor/u);
assert.match(multiplierText, /=/u);

// Exact AT_LEAST boundary must explain the canonical boundary itself, not the next one.
const exactAtLeast = generateNumCp012Wave02("NUM-CP012-PROT-010", 5);
assert.equal(exactAtLeast.hiddenState.direction, "AT_LEAST");
assert.equal(exactAtLeast.hiddenState.exactBoundary, true);
const exactAtLeastExplanation = buildNumCp012ExamDepthExplanation(exactAtLeast, "en");
assert.match(exactAtLeastExplanation.fullDerivation.join("\n"), new RegExp(`choose ${exactAtLeast.canonicalAnswer}\\.`, "u"));

let studioChecks = 0;
for (const qlId of NUM_CP012_QUESTION_STUDIO_QL_IDS) {
  for (const language of ["en", "hi", "pa"] as const) {
    const batch = await generateNumCp012QuestionStudioBatch({
      canonicalProblemId: "NUM-CP-012",
      questionLanguageId: qlId,
      language,
      seed: `exam-depth:${qlId}:${language}`,
      count: 1,
    });
    const question = batch.questions[0]!;
    assert.equal(question.explanationStandard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.equal(question.packageExplanation.standard, "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1");
    assert.ok(question.packageExplanation.fullDerivation.length >= 2, `${qlId}/${language}: full derivation missing`);
    assert.ok(question.packageExplanation.examShortcut.length >= 1, `${qlId}/${language}: exam shortcut missing`);
    assert.equal(question.options[question.correctIndex], question.answer, `${qlId}/${language}: answer binding drift`);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    studioChecks += 1;
  }
}

console.log(JSON.stringify({
  status: "PASS_NUM_CP012_EXAM_DEPTH_EXPLANATION",
  explanationStandard: "FULL_DERIVATION_AND_EXAM_SHORTCUT_V1",
  prototypeChecks,
  studioChecks,
  languages: ["en", "hi", "pa"],
  noHiddenTransformationRule: true,
  examShortcutRequired: true,
  downstreamGatesRemainLocked: true,
}, null, 2));
