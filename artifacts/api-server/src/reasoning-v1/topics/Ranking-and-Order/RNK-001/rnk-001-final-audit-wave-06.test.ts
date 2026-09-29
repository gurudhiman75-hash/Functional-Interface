import assert from "node:assert/strict";

import { RNK_001_CHAPTER_AUTHORITY } from "./manifest";
import { generateRnk001QuestionStudioBatch } from "./rnk-001-question-studio-integration-v2";

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const ENGLISH_WORD = /[A-Za-z]{2,}/u;

const bannedHindiCalques = [
  /माँगे गए सिरों में रैंकें/u,
  /अंतिम आगे से रैंक/u,
  /अंतिम पीछे से रैंक/u,
  /सुबह बैच/u,
  /शाम बैच/u,
  /सही रैंक क्या तय होती है/u,
  /का सबसे नीचे का संभव स्थान/u,
];

const bannedPunjabiCalques = [
  /ਮੰਗੇ ਸਿਰਿਆਂ ਵਿੱਚ ਰੈਂਕਾਂ/u,
  /ਅੰਤਿਮ ਅੱਗੋਂ ਰੈਂਕ/u,
  /ਅੰਤਿਮ ਪਿੱਛੋਂ ਰੈਂਕ/u,
  /ਸਵੇਰ ਬੈਚ/u,
  /ਸ਼ਾਮ ਬੈਚ/u,
  /ਸਹੀ ਰੈਂਕ ਕੀ ਤੈਅ ਹੁੰਦੀ ਹੈ/u,
];

function visibleText(question: Record<string, any>): string {
  return [
    String(question.stem ?? ""),
    ...(question.options as readonly unknown[]).map(String),
    String(question.explanation ?? ""),
  ].join("\n");
}

let audited = 0;

for (const language of ["hi", "pa"] as const) {
  for (let round = 0; round < 4; round += 1) {
    const batch = await generateRnk001QuestionStudioBatch({
      packageId: "RNK-001",
      language,
      count: 42,
      seed: `rnk-wave06:${language}:round-${round}`,
    });

    assert.equal(batch.questions.length, 42);
    assert.deepEqual(
      [...new Set((batch.questions as Array<Record<string, any>>).map((question) => question.qlId))].sort(),
      RNK_001_CHAPTER_AUTHORITY.permanentQlIds,
    );

    for (const raw of batch.questions as Array<Record<string, any>>) {
      audited += 1;
      const qlId = String(raw.qlId);
      const stem = String(raw.stem ?? "");
      const explanation = String(raw.explanation ?? "");
      const text = visibleText(raw);

      assert.ok(stem.trim().length >= 12, `${qlId}/${language} has an abnormally thin stem`);
      assert.ok(explanation.trim().length >= 8, `${qlId}/${language} has an abnormally thin explanation`);
      assert.doesNotMatch(text, ENGLISH_WORD, `${qlId}/${language} leaked an English word into native learner text`);

      if (language === "hi") {
        assert.match(stem, DEVANAGARI, `${qlId} Hindi stem must contain Devanagari`);
        assert.match(explanation, DEVANAGARI, `${qlId} Hindi explanation must contain Devanagari`);
        assert.doesNotMatch(text, GURMUKHI, `${qlId} Hindi output contains Punjabi script`);
        for (const pattern of bannedHindiCalques) {
          assert.doesNotMatch(text, pattern, `${qlId} regressed to an older mechanical Hindi phrase`);
        }
      } else {
        assert.match(stem, GURMUKHI, `${qlId} Punjabi stem must contain Gurmukhi`);
        assert.match(explanation, GURMUKHI, `${qlId} Punjabi explanation must contain Gurmukhi`);
        assert.doesNotMatch(text, DEVANAGARI, `${qlId} Punjabi output contains Hindi script`);
        for (const pattern of bannedPunjabiCalques) {
          assert.doesNotMatch(text, pattern, `${qlId} regressed to an older mechanical Punjabi phrase`);
        }
      }

      assert.equal(raw.validation.valid, true);
      assert.equal(new Set((raw.options as readonly unknown[]).map(String)).size, raw.options.length);
      assert.equal(raw.correctIndex >= 0 && raw.correctIndex < raw.options.length, true);
      assert.equal(raw.questionBankWritable, false);
      assert.equal(raw.testEligible, false);
      assert.equal(raw.mockTestEligible, false);
      assert.equal(raw.publiclyPublishable, false);
      assert.equal(raw.productionReleaseAuthorized, false);
    }
  }
}

console.log(JSON.stringify({
  verdict: "PASS_RNK_001_FINAL_AUDIT_WAVE_06_NATIVE_LEARNER_SURFACE",
  qlCoverage: "RNK-QL-001..042",
  languages: ["hi", "pa"],
  generatedNativeInstancesAudited: audited,
  generationCalls: 8,
  englishWordLeakageRejected: true,
  crossScriptLeakageRejected: true,
  historicalCalqueRegressionRejected: true,
  lifecycle: "REVIEW_ONLY",
}, null, 2));
