import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import {
  ENG001_CP004_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isEng001Cp004QuestionStudioRequestV1,
  languageV1Eng001Cp004QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp004-adapter-v1";

const packageDef = ENG001_CP004_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.engineId, "language-v1");
assert.equal(packageDef.packageId, "ENG-001");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.deepEqual(packageDef.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004"]);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

const registered = listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001");
assert.deepEqual(registered?.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004"]);

assert.equal(isEng001Cp004QuestionStudioRequestV1({ packageId: "ENG-001" }), false);
assert.equal(isEng001Cp004QuestionStudioRequestV1({ packageId: "ENG-001", canonicalProblemId: "ENG-001-CP004" }), true);
assert.equal(isEng001Cp004QuestionStudioRequestV1({ canonicalProblemId: "GR-PRN-004" }), true);
assert.equal(isEng001Cp004QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Pronouns" }), true);
assert.equal(isEng001Cp004QuestionStudioRequestV1({ packageId: "COM-001", canonicalProblemId: "ENG-001-CP004" }), false);

const baseRequest = {
  engineId: "language-v1" as const,
  packageId: "ENG-001",
  language: "en" as const,
  difficulty: "Medium",
  count: 12,
  seed: "eng001-cp004-question-studio-integration-test",
  runtimeMode: "review-only",
};

// Legacy package-only requests must still default to CP001.
const legacy = await generateQuestionStudioQuestions(baseRequest);
assert.equal(legacy.questions.length, 12);
assert.equal(legacy.questions.every((question) => question.cpId === "ENG-001-CP001"), true);

const request = {
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP004",
  subtopic: "Pronouns",
};
const result = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.deepEqual(result, replay);
assert.equal(result.questions.length, 12);
assert.equal(new Set(result.questions.map((question) => question.candidateId)).size, 12);
assert.equal(result.generationContext?.cpId, "ENG-001-CP004");
assert.equal(result.generationContext?.approvedReviewBlobSha, "sha256:3b2f805503203947071d50b8f6453785515b6355050a16f0fa777bcfb79df563");
assert.equal(result.generationContext?.approvedGeneratorHeadSha, "8b92158f3085409a773f12d09897d1160b2c8c04");

for (const question of result.questions) {
  assert.equal(question.packageId, "ENG-001");
  assert.equal(question.cpId, "ENG-001-CP004");
  assert.equal(question.subtopic, "Pronouns");
  assert.match(String(question.ruleId), /^GR-PRN-/);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP004-HUMAN-EDITORIAL-APPROVAL-V1/);
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
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.equal(getGeneratedItemApprovalDisposition({ ...question, generationContext: result.generationContext }).mode, "review_only");
}

for (const [qlId, ruleId, difficulty] of [
  ["ENG-001-QL001", "GR-PRN-001", "Easy"],
  ["ENG-001-QL002", "GR-PRN-004", "Hard"],
  ["ENG-001-QL007", "GR-PRN-008", "Hard"],
] as const) {
  const selected = await languageV1Eng001Cp004QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    patternId: qlId,
    canonicalProblemId: ruleId,
    count: 3,
    seed: `${qlId}:${ruleId}:cp004-filter`,
  });
  assert.equal(selected.questions.length, 3);
  assert.equal(selected.questions.every((question) => question.qlId === qlId), true);
  assert.equal(selected.questions.every((question) => question.ruleId === ruleId), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP004"), true);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const selected = await languageV1Eng001Cp004QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    canonicalProblemId: "ENG-001-CP004",
    count: 5,
    seed: `eng001:cp004:${difficulty}:filter`,
  });
  assert.equal(selected.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP004"), true);
}

await assert.rejects(
  languageV1Eng001Cp004QuestionStudioAdapterV1.generate({ ...request, language: "hi" }),
  /supports English only/i,
);
await assert.rejects(
  languageV1Eng001Cp004QuestionStudioAdapterV1.generate({ ...request, runtimeMode: "bank-only" }),
  /only supports review-only runtime/i,
);
await assert.rejects(
  languageV1Eng001Cp004QuestionStudioAdapterV1.generate({ ...request, difficulty: "Easy", canonicalProblemId: "GR-PRN-004" }),
  /GR-PRN-004 is not approved for Easy difficulty/i,
);

console.log("ENG-001 CP004 Question Studio review-only integration tests passed.");
