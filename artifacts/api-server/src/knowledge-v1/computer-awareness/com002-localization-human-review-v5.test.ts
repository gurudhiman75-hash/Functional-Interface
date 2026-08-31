import assert from "node:assert/strict";

import { localizeCom002QuestionV5 } from "./com002-localization-v5";
import { generateCom002ReviewQuestionV6 } from "./com002-review-synthesis-v6";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

const badPatterns = {
  hi: [
    /फ़ाइल-स्टोरेज संसाधन ऑपरेटिंग सिस्टम का कार्य है।/u,
    / क्रिया का प्रभाव है:/u,
    / का अर्थ है:/u,
    /रीनेम क्रिया[^।\n?]*बदलता है/u,
  ],
  pa: [
    /ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।/u,
    / ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਹੈ:/u,
    / ਦਾ ਅਰਥ ਹੈ:/u,
    /ਰੀਨੇਮ ਕਾਰਵਾਈ[^।\n?]*ਬਦਲਦਾ ਹੈ/u,
  ],
} as const;

let number = 0;
for (const qlId of qlIds) {
  // Reuse the exact V4 review seed so the V5 pack is a direct before/after
  // editorial comparison instead of sampling a different semantic item.
  const seed = `localization-human-review-v4:${qlId}`;
  const english = generateCom002ReviewQuestionV6({ qlId, seed });

  for (const language of languages) {
    number += 1;
    const question = localizeCom002QuestionV5({ qlId, seed, language });
    const replay = localizeCom002QuestionV5({ qlId, seed, language });

    assert.deepEqual(replay, question);
    assert.equal(question.localizationV5.englishQuestionId, english.questionId);
    assert.equal(question.qlId, english.qlId);
    assert.equal(question.surfaceMode, english.surfaceMode);
    assert.equal(question.targetFactId, english.targetFactId);
    assert.deepEqual(question.sourceFactIds, english.sourceFactIds);
    assert.deepEqual(question.sourceIds, english.sourceIds);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
    assert.equal(question.lifecycleV5.englishV6ErrataCandidate, true);
    assert.equal(question.lifecycleV5.localizationHumanReviewAccepted, false);
    assert.equal(question.lifecycleV5.localizationFingerprintsPinned, false);
    assert.equal(question.lifecycleV5.localizationFrozen, false);
    assert.equal(question.lifecycleV5.questionStudioActive, false);
    assert.equal(question.lifecycleV5.questionBankWritable, false);
    assert.equal(question.lifecycleV5.testEligible, false);
    assert.equal(question.lifecycleV5.mockTestEligible, false);
    assert.equal(question.lifecycleV5.publiclyPublishable, false);
    assert.equal(question.lifecycleV5.productionReleaseAuthorized, false);

    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    for (const pattern of badPatterns[language]) {
      assert.doesNotMatch(learnerText, pattern, `${qlId}/${language}: known V4 defect survived V5 review pack`);
    }

    console.log(`\n[COM002-LOCALIZATION-HUMAN-REVIEW-V5] Q${String(number).padStart(2, "0")} ${qlId} ${language.toUpperCase()} ${question.surfaceMode}`);
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
console.log(`[com002-localization-human-review-v5] PASS questions=${number} english=V6-candidate localization=V5 humanAccepted=false sameV4Seeds=true`);
