import assert from "node:assert/strict";
import { generateClsCp004LocalizedQuestion } from "./cp004-localized-runtime";
import { generateClsCp004LocalizedReviewQuestion } from "./cp004-localized-review-runtime";

let checkedPunjabi = 0;
let parityQuestions = 0;
let compositionQuestions = 0;
let nearPowerQuestions = 0;
let triangularQuestions = 0;
let checkedHindi = 0;
let repairedHindiStemCount = 0;

for (let seed = 0; seed < 2000; seed += 1) {
  const basePunjabi = generateClsCp004LocalizedQuestion("pa-IN", seed);
  const punjabi = generateClsCp004LocalizedReviewQuestion("pa-IN", seed);

  assert.equal(punjabi.qlId, basePunjabi.qlId, `${seed} QL drift`);
  assert.equal(punjabi.prototypeId, basePunjabi.prototypeId, `${seed} prototype drift`);
  assert.equal(punjabi.intendedRuleId, basePunjabi.intendedRuleId, `${seed} rule drift`);
  assert.equal(punjabi.intendedRuleValue, basePunjabi.intendedRuleValue, `${seed} rule-value drift`);
  assert.deepEqual(punjabi.numbers, basePunjabi.numbers, `${seed} number-state drift`);
  assert.deepEqual(punjabi.options, basePunjabi.options, `${seed} options drift`);
  assert.equal(punjabi.correctIndex, basePunjabi.correctIndex, `${seed} correct-index drift`);
  assert.equal(punjabi.answer, basePunjabi.answer, `${seed} answer drift`);
  assert.equal(punjabi.difficulty, basePunjabi.difficulty, `${seed} difficulty drift`);
  assert.deepEqual(punjabi.ambiguityAudit, basePunjabi.ambiguityAudit, `${seed} ambiguity audit drift`);

  assert.equal(punjabi.metadata.runtimeVersion, "cls-cp004-multilingual-review-v4");
  assert.equal(punjabi.metadata.languageReviewVersion, "native-language-v4");

  const punjabiLearnerText = [
    punjabi.stem,
    ...punjabi.evidenceByOption,
    ...punjabi.explanation.coreConcept,
    ...punjabi.explanation.stepByStep,
  ].join("\n");

  assert.ok(!/ਜੁੜੀ ਸੰਖਿਆ|ਸਾਰੇ ਅੰਕ ਜੁੜੇ|ਅੰਕਾਂ ਵਿੱਚ ਜੁੜੇ ਅਤੇ ਟਾਂਕ/.test(punjabiLearnerText), `${seed} non-standard Punjabi parity wording leaked`);
  assert.ok(!/\d+ ਵਿੱਚ ਅੰਕਾਂ ਵਿੱਚ ਜਿਸਤ ਅਤੇ ਟਾਂਕ/.test(punjabiLearnerText), `${seed} duplicated Punjabi location grammar leaked`);
  assert.ok(!/\d+, ਕਿਸੇ ਪੂਰਨ (?:ਵਰਗ|ਘਣ) ਤੋਂ 1/.test(punjabiLearnerText), `${seed} unnecessary Punjabi near-power comma leaked`);
  assert.ok(!/ਇਸ ਲਈ ਇਹ ਤਿਕੋਣੀ ਹੈ, ਇਸ ਲਈ/.test(punjabiLearnerText), `${seed} repeated Punjabi connector leaked`);

  if (punjabi.intendedRuleId === "PARITY") {
    parityQuestions += 1;
    assert.ok(/ਜਿਸਤ ਸੰਖਿਆ|ਟਾਂਕ ਸੰਖਿਆ/.test(punjabiLearnerText), `${seed} standard Punjabi parity term missing`);
  }
  if (punjabi.intendedRuleId === "DIGIT_PARITY_COMPOSITION") {
    compositionQuestions += 1;
    assert.ok(/ਜਿਸਤ|ਟਾਂਕ/.test(punjabiLearnerText), `${seed} digit-parity terminology missing`);
  }
  if (punjabi.intendedRuleId === "NEAR_POWER_CLASS") nearPowerQuestions += 1;
  if (punjabi.intendedRuleId === "TRIANGULAR_STATUS") triangularQuestions += 1;
  checkedPunjabi += 1;

  const baseHindi = generateClsCp004LocalizedQuestion("hi-IN", seed);
  const hindi = generateClsCp004LocalizedReviewQuestion("hi-IN", seed);
  assert.deepEqual(hindi.numbers, baseHindi.numbers, `${seed} Hindi number-state drift`);
  assert.deepEqual(hindi.options, baseHindi.options, `${seed} Hindi option drift`);
  assert.equal(hindi.answer, baseHindi.answer, `${seed} Hindi answer drift`);
  assert.equal(hindi.correctIndex, baseHindi.correctIndex, `${seed} Hindi correct-index drift`);
  assert.equal(hindi.metadata.runtimeVersion, "cls-cp004-multilingual-review-v4");
  assert.equal(hindi.metadata.languageReviewVersion, "native-language-v4");

  const hindiLearnerText = [
    hindi.stem,
    ...hindi.evidenceByOption,
    ...hindi.explanation.coreConcept,
    ...hindi.explanation.stepByStep,
  ].join("\n");
  assert.ok(!hindi.stem.includes("विषम संख्या चुनिए"), `${seed} ambiguous Hindi parity wording leaked into classification stem`);
  assert.ok(!/\d+ में अंकों में सम और विषम/.test(hindiLearnerText), `${seed} duplicated Hindi location grammar leaked`);
  assert.ok(!/\d+, किसी पूर्ण (?:वर्ग|घन) से 1/.test(hindiLearnerText), `${seed} unnecessary Hindi near-power comma leaked`);
  assert.ok(!/इसलिए यह त्रिभुजीय है, इसलिए/.test(hindiLearnerText), `${seed} repeated Hindi connector leaked`);
  if (baseHindi.stem.includes("विषम संख्या चुनिए")) {
    repairedHindiStemCount += 1;
    assert.ok(hindi.stem.includes("अलग संख्या चुनिए"), `${seed} Hindi classification stem was not repaired`);
  }
  checkedHindi += 1;
}

assert.ok(parityQuestions > 0, "PARITY questions were not exercised");
assert.ok(compositionQuestions > 0, "DIGIT_PARITY_COMPOSITION questions were not exercised");
assert.ok(nearPowerQuestions > 0, "NEAR_POWER_CLASS questions were not exercised");
assert.ok(triangularQuestions > 0, "TRIANGULAR_STATUS questions were not exercised");
assert.ok(repairedHindiStemCount > 0, "Ambiguous Hindi stem variant was not exercised");

console.log("CLS-CP-004 native mathematical terminology audit passed.", {
  checkedPunjabi,
  checkedHindi,
  parityQuestions,
  compositionQuestions,
  nearPowerQuestions,
  triangularQuestions,
  repairedHindiStemCount,
});
