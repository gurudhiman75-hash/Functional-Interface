import assert from "node:assert/strict";

import { evaluateCurrentAffairsReleaseReadiness } from "./release-policy";

const base = {
  compilations: [
    { languageCode: "en" as const, status: "draft", eventIds: ["e1", "e2", "e3", "e4", "e5"] },
    { languageCode: "hi" as const, status: "draft", eventIds: ["e5", "e3", "e1", "e4", "e2"] },
    { languageCode: "pa" as const, status: "draft", eventIds: ["e2", "e1", "e5", "e3", "e4"] },
  ],
  verifiedEventCount: 5,
  expectedEventCount: 5,
  currentAuthoringCount: 5,
  currentHindiLocalizationCount: 5,
  currentPunjabiLocalizationCount: 5,
  openConflictCount: 0,
  duplicateStoryThreadCount: 0,
  questions: {
    required: true,
    runPresent: true,
    totalItems: 10,
    approvedItems: 10,
    hindiReadyItems: 10,
    punjabiReadyItems: 10,
  },
};

assert.equal(evaluateCurrentAffairsReleaseReadiness(base).ready, true);

const missingPunjabi = evaluateCurrentAffairsReleaseReadiness({
  ...base,
  compilations: base.compilations.filter((item) => item.languageCode !== "pa"),
});
assert.equal(missingPunjabi.ready, false);
assert.ok(missingPunjabi.blockers.some((item) => item.includes("Punjabi compilation")));

const eventMismatch = evaluateCurrentAffairsReleaseReadiness({
  ...base,
  compilations: base.compilations.map((item) => item.languageCode === "hi"
    ? { ...item, eventIds: ["e1", "e2", "e3", "e4"] }
    : item),
});
assert.equal(eventMismatch.ready, false);
assert.equal(eventMismatch.checks.eventParity, false);

const unapprovedQuestion = evaluateCurrentAffairsReleaseReadiness({
  ...base,
  questions: { ...base.questions, approvedItems: 9 },
});
assert.equal(unapprovedQuestion.ready, false);
assert.equal(unapprovedQuestion.checks.quizReady, false);

const missingQuestionLocalization = evaluateCurrentAffairsReleaseReadiness({
  ...base,
  questions: { ...base.questions, punjabiReadyItems: 9 },
});
assert.equal(missingQuestionLocalization.ready, false);
assert.equal(missingQuestionLocalization.checks.questionLocalizationParity, false);

const duplicateStory = evaluateCurrentAffairsReleaseReadiness({
  ...base,
  duplicateStoryThreadCount: 1,
});
assert.equal(duplicateStory.ready, false);
assert.equal(duplicateStory.checks.storyConsolidated, false);

const tinyPackWithoutQuiz = evaluateCurrentAffairsReleaseReadiness({
  ...base,
  compilations: base.compilations.map((item) => ({ ...item, eventIds: ["e1", "e2", "e3"] })),
  expectedEventCount: 3,
  verifiedEventCount: 3,
  currentAuthoringCount: 3,
  currentHindiLocalizationCount: 3,
  currentPunjabiLocalizationCount: 3,
  questions: {
    required: false,
    runPresent: false,
    totalItems: 0,
    approvedItems: 0,
    hindiReadyItems: 0,
    punjabiReadyItems: 0,
  },
});
assert.equal(tinyPackWithoutQuiz.ready, true);

process.stdout.write("Current Affairs Studio CP014 release policy contracts passed\n");
