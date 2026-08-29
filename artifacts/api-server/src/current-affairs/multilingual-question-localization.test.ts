import assert from "node:assert/strict";

import { localizeCurrentAffairsQuestion } from "./multilingual-question-localization";

const recallSource = {
  text: "What was the policy repo rate associated with ‘RBI policy rates: repo rate at 5.50%’ ?",
  stem: "What was the policy repo rate associated with ‘RBI policy rates: repo rate at 5.50%’ ?",
  options: ["5.25%", "5.50%", "5.75%", "6.00%"],
  correctIndex: 1,
  explanation: "The correct answer is 5.50%. For RBI policy rates, the verified policy repo rate is 5.50%.",
  canonicalAnswer: "5.50%",
  language: "en",
  generationContext: {
    questionBankAcceptanceMode: "BANK_ONLY",
    publiclyPublishable: false,
    automaticStudentPublication: false,
  },
  provenance: {
    eventId: "event-1",
    factId: "fact-1",
    factKey: "policy_repo_rate",
    factValue: "5.50%",
  },
};

const hiRecall = localizeCurrentAffairsQuestion({
  sourceGenerationVersionId: "version-1",
  languageCode: "hi",
  family: "CA-QL-001",
  factKey: "policy_repo_rate",
  factValue: "5.50%",
  localizedEventTitle: "RBI नीति दरें: रेपो दर 5.50%",
  sourcePayload: recallSource,
});
assert.equal(hiRecall.status, "ready");
assert.equal(hiRecall.quality.answerIndexPreserved, true);
assert.equal(hiRecall.quality.optionCountPreserved, true);
assert.equal(hiRecall.quality.factValuePreserved, true);
assert.equal((hiRecall.payload?.options as string[])[1], "5.50%");
assert.equal(hiRecall.payload?.correctIndex, 1);
assert.equal(hiRecall.payload?.canonicalAnswer, "5.50%");
assert.equal(hiRecall.payload?.language, "hi");
assert.equal((hiRecall.payload?.generationContext as Record<string, unknown>).questionBankAcceptanceMode, "BANK_ONLY");
assert.equal((hiRecall.payload?.generationContext as Record<string, unknown>).automaticStudentPublication, false);

const paRecall = localizeCurrentAffairsQuestion({
  sourceGenerationVersionId: "version-1",
  languageCode: "pa",
  family: "CA-QL-001",
  factKey: "policy_repo_rate",
  factValue: "5.50%",
  localizedEventTitle: "RBI ਨੀਤੀ ਦਰਾਂ: ਰੇਪੋ ਦਰ 5.50%",
  sourcePayload: recallSource,
});
assert.equal(paRecall.status, "ready");
assert.match(String(paRecall.payload?.stem ?? ""), /ਕੀ ਹੈ/u);
assert.equal(paRecall.payload?.correctIndex, recallSource.correctIndex);

const associationSource = {
  text: "Which current-affairs event is correctly associated with the orbit altitude ‘747 km’?",
  stem: "Which current-affairs event is correctly associated with the orbit altitude ‘747 km’?",
  options: [
    "RBI Financial Inclusion Index stands at 67.0",
    "NISAR: key ISRO mission facts",
    "MoU between SEBI and NISM",
    "Punjab Government programme update: ₹12,500 crore outlay",
  ],
  correctIndex: 1,
  explanation: "The correct answer is ‘NISAR: key ISRO mission facts’. Its verified orbit altitude is 747 km.",
  canonicalAnswer: "NISAR: key ISRO mission facts",
  language: "en",
  generationContext: { questionBankAcceptanceMode: "BANK_ONLY" },
  provenance: {
    eventId: "event-2",
    factId: "fact-2",
    factKey: "orbit_altitude",
    factValue: "747 km",
  },
};

const hiTitleMap = {
  "RBI Financial Inclusion Index stands at 67.0": "RBI वित्तीय समावेशन सूचकांक: 67.0",
  "NISAR: key ISRO mission facts": "NISAR: ISRO मिशन के प्रमुख तथ्य",
  "MoU between SEBI and NISM": "समझौता ज्ञापन (MoU): SEBI and NISM",
  "Punjab Government programme update: ₹12,500 crore outlay": "पंजाब सरकार कार्यक्रम: ₹12,500 crore परिव्यय",
};
const hiAssociation = localizeCurrentAffairsQuestion({
  sourceGenerationVersionId: "version-2",
  languageCode: "hi",
  family: "CA-QL-002",
  factKey: "orbit_altitude",
  factValue: "747 km",
  localizedEventTitle: "NISAR: ISRO मिशन के प्रमुख तथ्य",
  sourcePayload: associationSource,
  localizedEventTitleByEnglishTitle: hiTitleMap,
});
assert.equal(hiAssociation.status, "ready");
assert.equal(hiAssociation.payload?.correctIndex, 1);
assert.equal((hiAssociation.payload?.options as string[])[1], "NISAR: ISRO मिशन के प्रमुख तथ्य");
assert.equal(hiAssociation.payload?.canonicalAnswer, "NISAR: ISRO मिशन के प्रमुख तथ्य");
assert.match(String(hiAssociation.payload?.stem ?? ""), /747 km/);

const missingOption = localizeCurrentAffairsQuestion({
  sourceGenerationVersionId: "version-2",
  languageCode: "pa",
  family: "CA-QL-002",
  factKey: "orbit_altitude",
  factValue: "747 km",
  localizedEventTitle: "NISAR: ISRO ਮਿਸ਼ਨ ਦੇ ਮੁੱਖ ਤੱਥ",
  sourcePayload: associationSource,
  localizedEventTitleByEnglishTitle: {
    "NISAR: key ISRO mission facts": "NISAR: ISRO ਮਿਸ਼ਨ ਦੇ ਮੁੱਖ ਤੱਥ",
  },
});
assert.equal(missingOption.status, "needs_editorial");
assert.ok(missingOption.quality.missingEventTitleOptions.length >= 1);
assert.equal(missingOption.payload, undefined);

console.log("Current Affairs Studio CP011 multilingual question localization contracts passed");
