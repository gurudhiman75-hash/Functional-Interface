import assert from "node:assert/strict";

import { COM002_ENGLISH_FREEZE_AUTHORITY_V5 } from "./com002-english-freeze-v5";
import { localizeCom002QuestionV4 } from "./com002-localization-v4";
import { generateCom002ReviewQuestionV5 } from "./com002-review-synthesis-v5";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

let number = 0;
for (const qlId of qlIds) {
  const seed = `localization-human-review-v4:${qlId}`;
  const english = generateCom002ReviewQuestionV5({ qlId, seed });

  for (const language of languages) {
    number += 1;
    const question = localizeCom002QuestionV4({ qlId, seed, language });
    const replay = localizeCom002QuestionV4({ qlId, seed, language });

    assert.deepEqual(replay, question);
    assert.equal(question.localizationV4.englishQuestionId, english.questionId);
    assert.equal(question.localizationV4.englishFreezeAuthorityId, COM002_ENGLISH_FREEZE_AUTHORITY_V5.authorityId);
    assert.equal(question.qlId, english.qlId);
    assert.equal(question.surfaceMode, english.surfaceMode);
    assert.equal(question.targetFactId, english.targetFactId);
    assert.deepEqual(question.sourceFactIds, english.sourceFactIds);
    assert.deepEqual(question.sourceIds, english.sourceIds);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.lifecycleV4.englishV5Frozen, true);
    assert.equal(question.lifecycleV4.localizationHumanReviewAccepted, false);
    assert.equal(question.lifecycleV4.localizationFingerprintsPinned, false);
    assert.equal(question.lifecycleV4.localizationFrozen, false);
    assert.equal(question.lifecycleV4.questionStudioActive, false);
    assert.equal(question.lifecycleV4.questionBankWritable, false);
    assert.equal(question.lifecycleV4.testEligible, false);
    assert.equal(question.lifecycleV4.mockTestEligible, false);
    assert.equal(question.lifecycleV4.publiclyPublishable, false);
    assert.equal(question.lifecycleV4.productionReleaseAuthorized, false);

    if (language === "hi") {
      assert.doesNotMatch(`${question.stem}\n${question.explanation}`, /ना के लिए/u);
    } else {
      assert.doesNotMatch(`${question.stem}\n${question.explanation}`, /(?:ਣਾ|ਨਾ) ਲਈ/u);
    }

    console.log(`\n[COM002-LOCALIZATION-HUMAN-REVIEW-V4] Q${String(number).padStart(2, "0")} ${qlId} ${language.toUpperCase()} ${question.surfaceMode}`);
    console.log(`Seed: ${seed}`);
    console.log(question.stem);
    question.options.forEach((option, index) => {
      console.log(`${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? "  <-- CORRECT" : ""}`);
    });
    console.log(`Answer: ${question.canonicalAnswer}`);
    console.log(`Explanation: ${question.explanation}`);
    console.log(`Sources: ${question.sourceIds.join(", ")}`);
    console.log(`Facts: ${question.sourceFactIds.join(", ")}`);
  }
}

assert.equal(number, 26);
console.log(`[com002-localization-human-review-v4] PASS questions=${number} english=V5-frozen localization=V4 humanAccepted=false`);
