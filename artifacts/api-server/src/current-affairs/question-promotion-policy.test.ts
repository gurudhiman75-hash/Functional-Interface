import assert from "node:assert/strict";

import {
  evaluateCurrentAffairsQuestionPromotionReadiness,
  promotionPayloadHash,
} from "./question-promotion-policy";

const sourcePayload = {
  stem: "Who was appointed Chairperson of Example Board?",
  explanation: "Asha Singh was appointed Chairperson of Example Board.",
  options: ["Asha Singh", "Ravi Kumar", "Meera Kaur", "Vikram Shah"],
  correctIndex: 0,
  language: "en",
  generationContext: {
    questionBankAcceptanceMode: "BANK_ONLY",
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
};

const base = {
  releaseStatus: "approved",
  releaseApprovedAt: "2026-08-29T09:00:00.000Z",
  generationItemId: "item-1",
  generationItemStatus: "approved",
  currentSourceGenerationVersionId: "version-1",
  frozenSourceGenerationVersionId: "version-1",
  sourcePayload,
  hindi: {
    languageCode: "hi" as const,
    status: "ready",
    generationItemId: "item-1",
    sourceGenerationVersionId: "version-1",
    updatedAt: "2026-08-29T08:59:59.000Z",
    payload: {
      ...sourcePayload,
      stem: "उदाहरण बोर्ड की अध्यक्ष किसे नियुक्त किया गया?",
      explanation: "आशा सिंह को उदाहरण बोर्ड की अध्यक्ष नियुक्त किया गया।",
      options: ["आशा सिंह", "रवि कुमार", "मीरा कौर", "विक्रम शाह"],
      language: "hi",
    },
  },
  punjabi: {
    languageCode: "pa" as const,
    status: "manual",
    generationItemId: "item-1",
    sourceGenerationVersionId: "version-1",
    updatedAt: "2026-08-29T08:58:00.000Z",
    payload: {
      ...sourcePayload,
      stem: "ਉਦਾਹਰਨ ਬੋਰਡ ਦੀ ਚੇਅਰਪਰਸਨ ਕਿਸ ਨੂੰ ਨਿਯੁਕਤ ਕੀਤਾ ਗਿਆ?",
      explanation: "ਆਸ਼ਾ ਸਿੰਘ ਨੂੰ ਉਦਾਹਰਨ ਬੋਰਡ ਦੀ ਚੇਅਰਪਰਸਨ ਨਿਯੁਕਤ ਕੀਤਾ ਗਿਆ।",
      options: ["ਆਸ਼ਾ ਸਿੰਘ", "ਰਵੀ ਕੁਮਾਰ", "ਮੀਰਾ ਕੌਰ", "ਵਿਕਰਮ ਸ਼ਾਹ"],
      language: "pa",
    },
  },
};

const ready = evaluateCurrentAffairsQuestionPromotionReadiness(base);
assert.equal(ready.ready, true);
assert.equal(ready.source?.correctIndex, 0);
assert.equal(ready.hindi?.options.length, 4);
assert.equal(ready.punjabi?.options.length, 4);
assert.match(promotionPayloadHash(sourcePayload), /^[a-f0-9]{64}$/);

const changedEnglish = evaluateCurrentAffairsQuestionPromotionReadiness({
  ...base,
  currentSourceGenerationVersionId: "version-2",
});
assert.equal(changedEnglish.ready, false);
assert.ok(changedEnglish.blockers.some((item) => item.includes("English generation item changed")));

const changedHindiAfterRelease = evaluateCurrentAffairsQuestionPromotionReadiness({
  ...base,
  hindi: { ...base.hindi, updatedAt: "2026-08-29T09:00:01.000Z" },
});
assert.equal(changedHindiAfterRelease.ready, false);
assert.ok(changedHindiAfterRelease.blockers.some((item) => item.includes("HI localization changed")));

const answerIndexChanged = evaluateCurrentAffairsQuestionPromotionReadiness({
  ...base,
  punjabi: {
    ...base.punjabi,
    payload: { ...(base.punjabi.payload as Record<string, unknown>), correctIndex: 1 },
  },
});
assert.equal(answerIndexChanged.ready, false);
assert.ok(answerIndexChanged.blockers.some((item) => item.includes("correct-answer index")));

const notBankOnly = evaluateCurrentAffairsQuestionPromotionReadiness({
  ...base,
  sourcePayload: {
    ...sourcePayload,
    generationContext: {
      ...sourcePayload.generationContext,
      questionBankAcceptanceMode: "FULL_RELEASE",
    },
  },
});
assert.equal(notBankOnly.ready, false);
assert.ok(notBankOnly.blockers.some((item) => item.includes("BANK_ONLY")));

const publicSource = evaluateCurrentAffairsQuestionPromotionReadiness({
  ...base,
  sourcePayload: {
    ...sourcePayload,
    generationContext: {
      ...sourcePayload.generationContext,
      publiclyPublishable: true,
    },
  },
});
assert.equal(publicSource.ready, false);
assert.ok(publicSource.blockers.some((item) => item.includes("publication closed")));

process.stdout.write("Current Affairs Studio CP015 question promotion policy contracts passed\n");
