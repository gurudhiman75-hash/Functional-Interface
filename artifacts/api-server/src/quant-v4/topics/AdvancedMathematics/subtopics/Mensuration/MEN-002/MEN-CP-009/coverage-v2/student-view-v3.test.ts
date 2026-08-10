import assert from "node:assert/strict";
import { buildMenCp009V2ReviewBatch } from "./review-batch";
import {
  MEN_CP_009_STUDENT_VIEW_AUTHORITY,
  buildMenCp009StudentView,
} from "./student-view-v3";

const review = buildMenCp009V2ReviewBatch();
const views = review.rows.map(buildMenCp009StudentView);

assert.equal(views.length, 112, "V3 must preserve all 112 CP-009 review questions.");
assert.equal(
  new Set(views.map((view) => view.permanentQlId)).size,
  28,
  "V3 must preserve all 28 permanent QLs.",
);
assert.equal(
  new Set(views.map((view) => view.stem)).size,
  112,
  "Learner-facing stems must remain unique after naturalisation.",
);

const rawLatex = /\$|\\(?:pi|frac|text|times|sqrt)/;
const disallowedStemLanguage = /leave the answer in terms|in the simplest form/i;

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
      rawLatexLeaks: 0,
      genericDiagramsShown: 0,
      explanationLineRange: "2-4",
      status: "PASS",
    },
    null,
    2,
  ),
);
