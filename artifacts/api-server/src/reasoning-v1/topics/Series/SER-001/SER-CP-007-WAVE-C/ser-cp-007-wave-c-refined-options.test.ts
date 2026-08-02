import assert from "node:assert/strict";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
  renderSerCp007WaveCReview,
} from "./foundation-refined";

const template = SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.find(
  (entry) => entry.taskKind === "WRONG_AND_REPLACEMENT",
);
assert.ok(template);

let generated = 0;
for (let seed = 1; seed <= 120; seed += 1) {
  const question = generateSerCp007WaveCQuestion(
    template.temporaryTemplateId,
    seed,
  );
  assert.deepEqual(
    generateSerCp007WaveCQuestion(template.temporaryTemplateId, seed),
    question,
  );
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.correctAnswer);

  const wrong = question.hiddenState.displayedWrongTerm;
  assert.ok(wrong);
  for (const option of question.options) {
    const match = option.match(/^([A-Z]+) → ([A-Z]+)$/);
    assert.ok(match, `${question.questionId}: malformed replacement option ${option}`);
    assert.equal(match[1], wrong, `${question.questionId}: distractor changed the identified wrong group`);
    assert.notEqual(match[2], wrong, `${question.questionId}: no-change replacement option`);
  }

  const review = renderSerCp007WaveCReview(question);
  assert.doesNotMatch(review, /^[✓ ] [A-D]\. /m);
  assert.doesNotMatch(review, /\bOption [A-D]\b/);
  generated += 1;
}

assert.equal(generated, 120);
console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_WAVE_C_REFINED_REPLACEMENT_OPTIONS",
      generated,
      distinctOptionsPerQuestion: 4,
      sameWrongGroupOnLeft: 120,
      noChangeReplacementOptions: 0,
      letterOptionLabels: 0,
    },
    null,
    2,
  ),
);
