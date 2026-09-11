import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import {
  generateQuestionStudioQuestions,
  listQuestionStudioEngines,
  listQuestionStudioPackages,
} from "../engine-registry";
import {
  ENG001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isEng001QuestionStudioRequestV1,
  languageV1Eng001QuestionStudioAdapterV1,
} from "./language-v1-eng001-adapter-v1";

const packageDef = ENG001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.engineId, "language-v1");
assert.equal(packageDef.packageId, "ENG-001");
assert.equal(packageDef.subject, "English");
assert.equal(packageDef.topic, "Error Spotting");
assert.equal(packageDef.subtopic, "Subject–Verb Agreement");
assert.equal(packageDef.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDef.questionBankStatus, "NOT_STORED");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.deepEqual(packageDef.supportedLanguages, ["en"]);
assert.deepEqual(packageDef.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(packageDef.cpIds, ["ENG-001-CP001"]);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

assert.equal(listQuestionStudioEngines().includes("language-v1"), true);
const registered = listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001");
assert.equal(registered?.engineId, "language-v1");
assert.equal(registered?.enabled, true);

assert.equal(isEng001QuestionStudioRequestV1({ packageId: "ENG-001" }), true);
assert.equal(
  isEng001QuestionStudioRequestV1({
    subject: "English",
    topic: "Error Spotting",
    subtopic: "Subject–Verb Agreement",
  }),
  true,
);
assert.equal(isEng001QuestionStudioRequestV1({ packageId: "COM-001" }), false);

const baseRequest = {
  engineId: "language-v1" as const,
  packageId: "ENG-001",
  language: "en" as const,
  difficulty: "Medium",
  count: 12,
  seed: "eng001-question-studio-integration-test",
  runtimeMode: "review-only",
};

const first = await generateQuestionStudioQuestions(baseRequest);
const replay = await generateQuestionStudioQuestions(baseRequest);
assert.equal(first.engineId, "language-v1");
assert.equal(first.questions.length, 12);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((question) => question.candidateId)).size, 12);

for (const question of first.questions) {
  assert.equal(question.packageId, "ENG-001");
  assert.equal(question.cpId, "ENG-001-CP001");
  assert.equal(question.language, "en");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.authoringReviewApproved, true);
  assert.equal(question.humanReviewApproved, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionStudioDiscoverable, true);
  assert.equal(question.runtimeRegistered, true);
  assert.equal(question.readOnly, true);
  assert.equal(question.productionReleased, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP001-HUMAN-EDITORIAL-APPROVAL-V1/);
  assert.equal(Array.isArray(question.options), true);
  assert.equal(Number.isInteger(question.correctIndex), true);
  assert.equal(typeof question.explanation, "string");
  assert.equal(typeof question.correctedSentence, "string");
  assert.equal(String(question.text).includes("Identify the part of the sentence that contains an error."), true);
  assert.equal(getGeneratedItemApprovalDisposition({
    ...question,
    generationContext: first.generationContext,
  }).mode, "review_only");
}

for (const [qlId, ruleId, selectorDifficulty] of [
  ["ENG-001-QL001", "GR-SVA-001", "Easy"],
  ["ENG-001-QL002", "GR-SVA-005", "Medium"],
  ["ENG-001-QL007", "GR-SVA-008", "Medium"],
] as const) {
  const result = await languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty: selectorDifficulty,
    patternId: qlId,
    canonicalProblemId: ruleId,
    count: 3,
    seed: `${qlId}:${ruleId}:filter`,
  });
  assert.equal(result.questions.length, 3);
  assert.equal(result.questions.every((question) => question.qlId === qlId), true);
  assert.equal(result.questions.every((question) => question.ruleId === ruleId), true);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    count: 5,
    seed: `eng001:${difficulty}:filter`,
  });
  assert.equal(result.questions.every((question) => question.difficulty === difficulty), true);
}

await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi" }),
  /supports English only/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({ ...baseRequest, runtimeMode: "bank-only" }),
  /only supports review-only runtime/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({ ...baseRequest, patternId: "ENG-001-QL999" }),
  /Unknown ENG-001 selector/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({ ...baseRequest, count: 51 }),
  /count between 1 and 50/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty: "Medium",
    canonicalProblemId: "GR-SVA-001",
  }),
  /GR-SVA-001 is not approved for Medium difficulty/i,
);

console.log("ENG-001 CP001 Question Studio language-v1 integration tests passed.");
