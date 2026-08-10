import assert from "node:assert/strict";
import { buildMenCp009V3StudentReviewBatch } from "./student-review-batch-v3";
import {
  MEN_CP_009_STUDENT_VIEW_AUTHORITY,
  buildMenCp009StudentView,
} from "./student-view-v3";

const review = buildMenCp009V3StudentReviewBatch();
const views = review.rows.map(buildMenCp009StudentView);

assert.equal(
  views.length,
  110,
  "V3 learner review should contain 110 genuinely distinct questions after removing two filler-only QL-119 duplicates.",
);
assert.equal(
  new Set(views.map((view) => view.permanentQlId)).size,
  28,
  "V3 must preserve coverage of all 28 permanent QLs.",
);
assert.equal(
  new Set(views.map((view) => view.stem)).size,
  views.length,
  "Every learner-facing review stem must be genuinely unique after naturalisation.",
);
assert.equal(
  review.semanticReviewCountByQl["MEN-002-QL-119"],
  2,
  "QL-119 has only two genuine mathematical prompt variants.",
);
for (const [qlId, count] of Object.entries(review.semanticReviewCountByQl)) {
  if (qlId === "MEN-002-QL-119") continue;
  assert.equal(count, 4, `${qlId} should retain four distinct learner review questions.`);
}
assert.equal(
  Object.values(review.answerPositions).reduce((sum, count) => sum + count, 0),
  views.length,
  "Answer-position counts must cover the whole learner review batch.",
);
assert.ok(
  Object.values(review.answerPositions).every((count) => count >= 27),
  "The learner review should remain broadly answer-position balanced without manufacturing duplicate prompts.",
);

const rawLatex = /\$|\\(?:pi|frac|text|times|sqrt)/;
const genericTrailer = /calculate carefully|(?:choose|select) the correct (?:answer|option)|determine the required value|find the requested measure/i;
const disallowedStemLanguage = /leave the answer in terms|in the simplest form|calculate carefully|(?:choose|select) the correct (?:answer|option)|determine the required value|find the requested measure/i;

const sourceTrailerCount = review.rows.filter((question) => genericTrailer.test(question.stem)).length;
assert.ok(
  sourceTrailerCount > 0,
  "Frozen source batch should exercise the generic trailer-removal boundary.",
);

for (let index = 0; index < views.length; index += 1) {
  const view = views[index]!;
  const source = review.rows[index]!;

  assert.equal(view.authority, MEN_CP_009_STUDENT_VIEW_AUTHORITY);
  assert.equal(view.permanentQlId, source.permanentQlId);
  assert.equal(view.correctIndex, source.correctIndex);
  assert.equal(view.options.length, 4);
  assert.equal(new Set(view.options.map((option) => option.display)).size, 4);
  assert.equal(
    view.options.filter((option) => option.isCorrect).length,
    1,
    `${view.permanentQlId} must keep exactly one correct option.`,
  );

  assert.ok(!rawLatex.test(view.stem), `${view.permanentQlId} stem leaks raw LaTeX: ${view.stem}`);
  assert.ok(
    !disallowedStemLanguage.test(view.stem),
    `${view.permanentQlId} contains generator-style stem language: ${view.stem}`,
  );
  assert.ok(
    !genericTrailer.test(view.stem),
    `${view.permanentQlId} contains a generic answer-selection trailer: ${view.stem}`,
  );

  for (const option of view.options) {
    assert.ok(
      !rawLatex.test(option.display),
      `${view.permanentQlId} option ${option.label} leaks raw LaTeX: ${option.display}`,
    );
  }

  assert.ok(!rawLatex.test(view.answer), `${view.permanentQlId} answer leaks raw LaTeX.`);
  assert.ok(
    view.explanationLines.length >= 2 && view.explanationLines.length <= 4,
    `${view.permanentQlId} explanation must stay within 2–4 short lines.`,
  );
  assert.ok(
    view.explanationLines[view.explanationLines.length - 1]!.startsWith("Answer:"),
    `${view.permanentQlId} explanation must end with the answer.`,
  );
  for (const line of view.explanationLines) {
    assert.ok(!rawLatex.test(line), `${view.permanentQlId} explanation leaks raw LaTeX: ${line}`);
    assert.ok(
      !/physical picture|governing rule|shortcut|option analysis|common traps/i.test(line),
      `${view.permanentQlId} exposes editorial scaffolding in the student explanation.`,
    );
  }

  assert.equal(view.showDiagram, false, `${view.permanentQlId} should not show a generic diagram.`);
  assert.equal(view.sourceValidationPassed, true);
  assert.equal(view.sourceVerificationPassed, true);
}

// A numerical pi instruction is required only when the original mathematical stem
// actually requested that convention. Ratio/percentage families may carry a piPolicy
// internally even though pi cancels and no instruction belongs in the question.
const conventionDependent = review.rows
  .map((question, index) => ({ question, view: views[index]! }))
  .filter(({ question }) => /Use \$\\pi=/.test(question.stem));
assert.ok(conventionDependent.length > 0, "Review batch should exercise explicit numerical pi conventions.");
for (const { question, view } of conventionDependent) {
  const expected = question.stem.includes("22}{7") ? "Take π = 22/7." : "Take π = 3.14.";
  assert.ok(
    view.stem.includes(expected),
    `${view.permanentQlId} must preserve a required numerical pi convention in normal exam wording.`,
  );
}

const exactPiDependent = review.rows
  .map((question, index) => ({ question, view: views[index]! }))
  .filter(({ question }) => /Leave the answer in terms/.test(question.stem));
assert.ok(exactPiDependent.length > 0, "Review batch should exercise exact-pi source wording.");
for (const { view } of exactPiDependent) {
  assert.ok(
    !/leave the answer|take π/i.test(view.stem),
    `${view.permanentQlId} exact-pi MCQ should let the options communicate answer form.`,
  );
}

console.log(
  JSON.stringify(
    {
      authority: MEN_CP_009_STUDENT_VIEW_AUTHORITY,
      reviewQuestions: views.length,
      permanentQls: new Set(views.map((view) => view.permanentQlId)).size,
      uniqueLearnerStems: new Set(views.map((view) => view.stem)).size,
      ql119SemanticVariants: review.semanticReviewCountByQl["MEN-002-QL-119"],
      sourceGenericTrailersExercised: sourceTrailerCount,
      learnerGenericTrailers: 0,
      answerPositions: review.answerPositions,
      rawLatexLeaks: 0,
      genericDiagramsShown: 0,
      explanationLineRange: "2-4",
      status: "PASS",
    },
    null,
    2,
  ),
);
