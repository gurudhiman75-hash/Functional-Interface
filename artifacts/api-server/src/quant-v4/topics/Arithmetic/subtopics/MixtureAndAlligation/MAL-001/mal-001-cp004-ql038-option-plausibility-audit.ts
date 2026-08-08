import { runMalCp004EnglishProductReviewV7Pipeline } from "./foundation/cp004-product-review-runtime-v7";
import { compareRational, rational } from "./foundation/rational";

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

let questions = 0;
let wrongOptions = 0;
let reselections = 0;
for (let index = 0; index < 500; index += 1) {
  const seed = `mal-cp004-ql038-plausibility:${index}`;
  const question = runMalCp004EnglishProductReviewV7Pipeline({
    questionLanguageId: "MAL-QL-038",
    seed,
    language: "en",
  });
  const total = question.exactState.total;
  assert(total && typeof total !== "string", `${seed}: total is unavailable.`);
  assert(question.answerValue.denominator === 1n, `${seed}: fractional correct answer.`);
  assert(
    question.options.length === 4 && new Set(question.options).size === 4,
    `${seed}: option package is not unique.`,
  );
  assert(
    question.options[question.correctIndex] === question.answer,
    `${seed}: answer-position mismatch.`,
  );

  for (const option of question.optionAudit) {
    if (option.isCorrect) continue;
    assert(
      compareRational(option.value, rational(1)) >= 0,
      `${seed}: sub-litre option ${option.text}.`,
    );
    assert(
      compareRational(option.value, total) <= 0,
      `${seed}: option ${option.text} exceeds total ${question.exactState.total}.`,
    );
    wrongOptions += 1;
  }
  if (question.parameters.valueQualitySelectionAttempt > 0) reselections += 1;
  questions += 1;
}

assert(questions === 500, `Expected 500 questions, received ${questions}.`);
assert(wrongOptions === 1_500, `Expected 1,500 wrong options, received ${wrongOptions}.`);

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_QL038_OPTION_PLAUSIBILITY",
      questions,
      wrongOptions,
      integralAnswers: questions,
      physicallyPossibleOptions: wrongOptions,
      reselections,
    },
    null,
    2,
  ),
);
