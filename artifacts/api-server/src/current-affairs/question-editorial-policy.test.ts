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

const associationSource = {
  ...sourcePayload,
  stem: "Which current-affairs event is associated with the value 5.50%?",
  explanation: "Event Alpha is associated with 5.50%.",
  options: ["Event Alpha", "Event Beta", "Event Gamma", "Event Delta"],
  correctIndex: 0,
};
const hiExpected = ["घटना अल्फा", "घटना बीटा", "घटना गामा", "घटना डेल्टा"];
const paExpected = ["ਘਟਨਾ ਅਲਫਾ", "ਘਟਨਾ ਬੀਟਾ", "ਘਟਨਾ ਗਾਮਾ", "ਘਟਨਾ ਡੈਲਟਾ"];
const associationLocalization = (languageCode: "hi" | "pa", optionValues: string[]) => ({
  id: `${languageCode}-association`,
  languageCode,
  status: "manual",
  generationItemId: "item-1",
  sourceGenerationVersionId: "v1",
  payload: {
    language: languageCode,
    stem: languageCode === "hi" ? "कौन सी घटना 5.50% से जुड़ी है?" : "ਕਿਹੜੀ ਘਟਨਾ 5.50% ਨਾਲ ਜੁੜੀ ਹੈ?",
    explanation: languageCode === "hi" ? "सही घटना 5.50% से जुड़ी है।" : "ਸਹੀ ਘਟਨਾ 5.50% ਨਾਲ ਜੁੜੀ ਹੈ।",
    options: optionValues,
    correctIndex: 0,
    generationContext: {
      questionBankAcceptanceMode: "BANK_ONLY",
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  },
});
const badAssociation = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "unreviewed",
  currentSourceGenerationVersionId: "v1",
  sourcePayload: associationSource,
  questionFamily: "CA-QL-002",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  activePromotion: false,
  activeApprovedRelease: false,
  expectedHindiOptions: hiExpected,
  expectedPunjabiOptions: paExpected,
  hindi: associationLocalization("hi", [hiExpected[0]!, "गलत बीटा", hiExpected[2]!, hiExpected[3]!]),
  punjabi: associationLocalization("pa", paExpected),
});
assert.equal(badAssociation.approvable, false);
assert.equal(badAssociation.checks.answerParity, true);
assert.equal(badAssociation.checks.optionSemanticParity, false);

const goodAssociation = evaluateCurrentAffairsQuestionEditorialReadiness({
  generationItemId: "item-1",
  generationItemStatus: "unreviewed",
  currentSourceGenerationVersionId: "v1",
  sourcePayload: associationSource,
  questionFamily: "CA-QL-002",
  factValue: "5.50%",
  eventVerified: true,
  hasOpenConflict: false,
  activePromotion: false,
  activeApprovedRelease: false,
  expectedHindiOptions: hiExpected,
  expectedPunjabiOptions: paExpected,
  hindi: associationLocalization("hi", hiExpected),
  punjabi: associationLocalization("pa", paExpected),
});
assert.equal(goodAssociation.approvable, true);
assert.equal(goodAssociation.checks.optionSemanticParity, true);

console.log("current-affairs question editorial policy contracts passed");
