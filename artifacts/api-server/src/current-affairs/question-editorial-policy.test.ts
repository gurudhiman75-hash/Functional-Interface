import assert from "node:assert/strict";

import { evaluateCurrentAffairsQuestionEditorialReadiness } from "./question-editorial-policy";

const sourcePayload = {
  language: "en",
  stem: "Which policy rate was reported as 5.50%?",
  explanation: "The verified repo rate is 5.50%.",
  options: ["5.00%", "5.25%", "5.50%", "5.75%"],
  correctIndex: 2,
  generationContext: {
    questionBankAcceptanceMode: "BANK_ONLY",
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
};

function localization(languageCode: "hi" | "pa", sourceGenerationVersionId = "v1", correctIndex = 2) {
  return {
    id: `${languageCode}-1`,
    languageCode,
    status: "manual",
    generationItemId: "item-1",
    sourceGenerationVersionId,
    payload: {
      language: languageCode,
      stem: languageCode === "hi" ? "सत्यापित रेपो दर 5.50% थी।" : "ਤਸਦੀਕ ਕੀਤੀ ਰੇਪੋ ਦਰ 5.50% ਸੀ।",
      explanation: languageCode === "hi" ? "सही मान 5.50% है।" : "ਸਹੀ ਮੁੱਲ 5.50% ਹੈ।",
      options: ["5.00%", "5.25%", "5.50%", "5.75%"],
      correctIndex,
      generationContext: {
        questionBankAcceptanceMode: "BANK_ONLY",
        publiclyPublishable: false,
        automaticStudentPublication: false,
      },
    },
  };
}

const ready = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "unreviewed",
  currentSourceGenerationVersionId: "v1",
  sourcePayload,
  questionFamily: "CA-QL-001",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  acceptedQuestionId: null,
  activePromotion: false,
  activeApprovedRelease: false,
  hindi: localization("hi"),
  punjabi: localization("pa"),
});
assert.equal(ready.editable, true);
assert.equal(ready.approvable, true);
assert.deepEqual(ready.blockers, []);

const staleHindi = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "unreviewed",
  currentSourceGenerationVersionId: "v2",
  sourcePayload,
  questionFamily: "CA-QL-001",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  activePromotion: false,
  activeApprovedRelease: false,
  hindi: localization("hi", "v1"),
  punjabi: localization("pa", "v2"),
});
assert.equal(staleHindi.approvable, false);
assert.equal(staleHindi.checks.hindiCurrent, false);

const wrongAnswer = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "unreviewed",
  currentSourceGenerationVersionId: "v1",
  sourcePayload,
  questionFamily: "CA-QL-001",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  activePromotion: false,
  activeApprovedRelease: false,
  hindi: localization("hi", "v1", 1),
  punjabi: localization("pa"),
});
assert.equal(wrongAnswer.approvable, false);
assert.equal(wrongAnswer.checks.answerParity, false);

const released = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "approved",
  currentSourceGenerationVersionId: "v1",
  sourcePayload,
  questionFamily: "CA-QL-001",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  activePromotion: false,
  activeApprovedRelease: true,
  hindi: localization("hi"),
  punjabi: localization("pa"),
});
assert.equal(released.editable, false);
assert.equal(released.approvable, false);

const publicPayload = {
  ...sourcePayload,
  generationContext: {
    ...sourcePayload.generationContext,
    publiclyPublishable: true,
  },
};
const publicQuestion = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "unreviewed",
  currentSourceGenerationVersionId: "v1",
  sourcePayload: publicPayload,
  questionFamily: "CA-QL-001",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  activePromotion: false,
  activeApprovedRelease: false,
  hindi: localization("hi"),
  punjabi: localization("pa"),
});
assert.equal(publicQuestion.editable, false);
assert.equal(publicQuestion.approvable, false);

console.log("current-affairs question editorial policy contracts passed");
