import assert from "node:assert/strict";

import {
  COM002_LOCALIZATION_VERSION_V5,
  localizeCom002QuestionV5,
} from "./com002-localization-v5";
import { generateCom002ReviewQuestionV6 } from "./com002-review-synthesis-v6";

const qlIds = Array.from(
  { length: 13 },
  (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`,
);
const languages = ["hi", "pa"] as const;

const badHindi = [
  /फ़ाइल-स्टोरेज संसाधन ऑपरेटिंग सिस्टम का कार्य है।/u,
  / क्रिया का प्रभाव है:/u,
  / का अर्थ है:/u,
  /रीनेम क्रिया[^।\n?]*बदलता है/u,
];
const badPunjabi = [
  /ਫ਼ਾਈਲ-ਸਟੋਰੇਜ ਸਰੋਤ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਦਾ ਕੰਮ ਹੈ।/u,
  / ਕਾਰਵਾਈ ਦਾ ਪ੍ਰਭਾਵ ਹੈ:/u,
  / ਦਾ ਅਰਥ ਹੈ:/u,
  /ਰੀਨੇਮ ਕਾਰਵਾਈ[^।\n?]*ਬਦਲਦਾ ਹੈ/u,
];

let audited = 0;
let strictCpuParity = 0;
let strictMemoryParity = 0;

for (const qlId of qlIds) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `english-v6-localization-v5:${qlId}:${index}`;
    const english = generateCom002ReviewQuestionV6({ qlId, seed });

    for (const language of languages) {
      const question = localizeCom002QuestionV5({ qlId, seed, language });
      const replay = localizeCom002QuestionV5({ qlId, seed, language });

      assert.deepEqual(replay, question, `${qlId}/${seed}/${language}: V5 replay drift`);
      assert.equal(question.localizationV5.version, COM002_LOCALIZATION_VERSION_V5);
      assert.equal(question.localizationV5.englishGeneratorVersion, "COM-002-ENGLISH-GENERATOR-V6-ERRATA-REVIEW-CANDIDATE-1");
      assert.equal(question.localizationV5.englishQuestionId, english.questionId);
      assert.equal(question.qlId, english.qlId);
      assert.equal(question.cpId, english.cpId);
      assert.equal(question.surfaceMode, english.surfaceMode);
      assert.equal(question.targetFactId, english.targetFactId);
      assert.deepEqual(question.sourceIds, english.sourceIds);
      assert.deepEqual(question.sourceFactIds, english.sourceFactIds);
      assert.equal(question.solverAuthority, english.solverAuthority);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
      assert.equal(question.reviewOnly, true);
      assert.equal(question.runtimeRegistered, false);
      assert.equal("localizationV4" in question, false);
      assert.equal("lifecycleV4" in question, false);
      assert.equal(question.lifecycleV5.englishV5BaseFrozen, true);
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
      const badPatterns = language === "hi" ? badHindi : badPunjabi;
      for (const pattern of badPatterns) {
        assert.doesNotMatch(learnerText, pattern, `${qlId}/${seed}/${language}: known V4 editorial defect survived V5`);
      }

      if (language === "hi") {
        assert.match(question.stem, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi stem missing Devanagari`);
        assert.match(question.explanation, /[\u0900-\u097F]/u, `${qlId}/${seed}: Hindi explanation missing Devanagari`);
      } else {
        assert.match(question.stem, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi stem missing Gurmukhi`);
        assert.match(question.explanation, /[\u0A00-\u0A7F]/u, `${qlId}/${seed}: Punjabi explanation missing Gurmukhi`);
      }

      english.options.forEach((option, optionIndex) => {
        if (option === "gives CPU time to processes") {
          assert.equal(
            question.options[optionIndex],
            language === "hi" ? "प्रक्रियाओं को CPU समय देता है" : "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ CPU ਸਮਾਂ ਦਿੰਦਾ ਹੈ",
          );
          strictCpuParity += 1;
        }
        if (option === "gives memory to processes") {
          assert.equal(
            question.options[optionIndex],
            language === "hi" ? "प्रक्रियाओं को मेमोरी देता है" : "ਪ੍ਰਕਿਰਿਆਵਾਂ ਨੂੰ ਮੈਮੋਰੀ ਦਿੰਦਾ ਹੈ",
          );
          strictMemoryParity += 1;
        }
      });

      audited += 1;
    }
  }
}

// Re-run the exact human-review wave seeds that exposed the defects in V4.
for (const qlId of [
  "COM-002-QL-001",
  "COM-002-QL-004",
  "COM-002-QL-006",
  "COM-002-QL-009",
  "COM-002-QL-010",
  "COM-002-QL-013",
]) {
  for (const suffix of ["A", "B"] as const) {
    const seed = `human-review-wave1:${qlId}:${suffix}`;
    for (const language of languages) {
      const question = localizeCom002QuestionV5({ qlId, seed, language });
      const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
      for (const pattern of language === "hi" ? badHindi : badPunjabi) {
        assert.doesNotMatch(learnerText, pattern, `${qlId}/${seed}/${language}: review-wave defect survived V5`);
      }
    }
  }
}

assert.equal(audited, 1040);
assert.ok(strictCpuParity > 0, "V5 corpus must exercise strict CPU-time option parity override");
assert.ok(strictMemoryParity > 0, "V5 corpus must exercise strict memory option parity override");
console.log("[com002-localization-v5] PASS", {
  questions: audited,
  strictCpuParity,
  strictMemoryParity,
  candidateOnly: true,
  semanticProvenancePreserved: true,
  knownEditorialDefectsRemoved: true,
});
