import assert from "node:assert/strict";
import { generateClsCp004LocalizedQuestion } from "./cp004-localized-runtime";
import { generateClsCp004LocalizedReviewQuestion } from "./cp004-localized-review-runtime";

let checked = 0;
let parityQuestions = 0;
let compositionQuestions = 0;

for (let seed = 0; seed < 2000; seed += 1) {
  const base = generateClsCp004LocalizedQuestion("pa-IN", seed);
  const question = generateClsCp004LocalizedReviewQuestion("pa-IN", seed);

  assert.equal(question.qlId, base.qlId, `${seed} QL drift`);
  assert.equal(question.prototypeId, base.prototypeId, `${seed} prototype drift`);
  assert.equal(question.intendedRuleId, base.intendedRuleId, `${seed} rule drift`);
  assert.equal(question.intendedRuleValue, base.intendedRuleValue, `${seed} rule-value drift`);
  assert.deepEqual(question.numbers, base.numbers, `${seed} number-state drift`);
  assert.deepEqual(question.options, base.options, `${seed} options drift`);
  assert.equal(question.correctIndex, base.correctIndex, `${seed} correct-index drift`);
  assert.equal(question.answer, base.answer, `${seed} answer drift`);
  assert.equal(question.difficulty, base.difficulty, `${seed} difficulty drift`);
  assert.deepEqual(question.ambiguityAudit, base.ambiguityAudit, `${seed} ambiguity audit drift`);

  assert.equal(question.metadata.runtimeVersion, "cls-cp004-multilingual-review-v2");
  assert.equal(question.metadata.languageReviewVersion, "punjabi-math-terms-v2");

  const learnerText = [
    question.stem,
    ...question.evidenceByOption,
    ...question.explanation.coreConcept,
    ...question.explanation.stepByStep,
  ].join("\n");

  assert.ok(!/ਜੁੜੀ ਸੰਖਿਆ|ਸਾਰੇ ਅੰਕ ਜੁੜੇ|ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ/.test(learnerText), `${seed} non-standard Punjabi parity wording leaked`);

  if (question.intendedRuleId === "PARITY") {
    parityQuestions += 1;
    assert.ok(/ਜਿਸਤ ਸੰਖਿਆ|ਟਾਂਕ ਸੰਖਿਆ/.test(learnerText), `${seed} standard Punjabi parity term missing`);
  }
  if (question.intendedRuleId === "DIGIT_PARITY_COMPOSITION") {
    compositionQuestions += 1;
    assert.ok(/ਜਿਸਤ|ਟਾਂਕ/.test(learnerText), `${seed} digit-parity terminology missing`);
  }
  checked += 1;
}

assert.ok(parityQuestions > 0, "PARITY questions were not exercised");
assert.ok(compositionQuestions > 0, "DIGIT_PARITY_COMPOSITION questions were not exercised");

console.log("CLS-CP-004 Punjabi mathematical terminology audit passed.", {
  checked,
  parityQuestions,
  compositionQuestions,
});
