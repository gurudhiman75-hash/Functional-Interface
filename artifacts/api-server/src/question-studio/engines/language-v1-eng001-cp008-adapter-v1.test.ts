import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import { ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1, isEng001Cp008QuestionStudioRequestV1, languageV1Eng001Cp008QuestionStudioAdapterV1 } from "./language-v1-eng001-cp008-adapter-v1";

const expectedCps = ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006", "ENG-001-CP007", "ENG-001-CP008"];
const packageDef = ENG001_CP008_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.engineId, "language-v1");
assert.equal(packageDef.packageId, "ENG-001");
assert.deepEqual(packageDef.cpIds, expectedCps);
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);
assert.deepEqual(listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001")?.cpIds, expectedCps);

assert.equal(isEng001Cp008QuestionStudioRequestV1({ packageId: "ENG-001" }), false);
assert.equal(isEng001Cp008QuestionStudioRequestV1({ packageId: "ENG-001", canonicalProblemId: "ENG-001-CP008" }), true);
assert.equal(isEng001Cp008QuestionStudioRequestV1({ canonicalProblemId: "GR-NQN-005" }), true);
assert.equal(isEng001Cp008QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Nouns & Quantifiers" }), true);
assert.equal(isEng001Cp008QuestionStudioRequestV1({ packageId: "COM-001", canonicalProblemId: "ENG-001-CP008" }), false);

const baseRequest = { engineId: "language-v1" as const, packageId: "ENG-001", language: "en" as const, difficulty: "Medium", count: 12, seed: "eng001-cp008-question-studio-integration-test", runtimeMode: "review-only" };
const request = { ...baseRequest, canonicalProblemId: "ENG-001-CP008", subtopic: "Nouns & Quantifiers" };
const result = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.deepEqual(result, replay);
assert.equal(result.questions.length, 12);
assert.equal(new Set(result.questions.map((question) => question.candidateId)).size, 12);
assert.equal(result.generationContext?.cpId, "ENG-001-CP008");
assert.equal(result.generationContext?.approvedReviewBlobSha, "sha256:d700c67cfa22a1573cd381e2000f84d3d24200354b877d93c0ac2c9736bf36c0");
assert.equal(result.generationContext?.approvedGeneratorHeadSha, "72c9d800c7787da29dca5703101a0a3e9714bc8e");
for (const question of result.questions) {
  assert.equal(question.cpId, "ENG-001-CP008");
  assert.equal(question.subtopic, "Nouns & Quantifiers");
  assert.match(String(question.ruleId), /^GR-NQN-/);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP008-HUMAN-EDITORIAL-APPROVAL-V1/);
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
for (const [qlId, ruleId, difficulty] of [["ENG-001-QL001", "GR-NQN-001", "Easy"], ["ENG-001-QL002", "GR-NQN-005", "Medium"], ["ENG-001-QL007", "GR-NQN-010", "Hard"]] as const) {
  const selected = await languageV1Eng001Cp008QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty, patternId: qlId, canonicalProblemId: ruleId, count: 1, seed: `${qlId}:${ruleId}:cp008-filter` });
  assert.equal(selected.questions[0]?.qlId, qlId);
  assert.equal(selected.questions[0]?.ruleId, ruleId);
  assert.equal(selected.questions[0]?.cpId, "ENG-001-CP008");
}
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const selected = await languageV1Eng001Cp008QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty, canonicalProblemId: "ENG-001-CP008", count: 5, seed: `eng001:cp008:${difficulty}:filter` });
  assert.equal(selected.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP008"), true);
}
await assert.rejects(languageV1Eng001Cp008QuestionStudioAdapterV1.generate({ ...request, language: "hi" }), /supports English only/i);
await assert.rejects(languageV1Eng001Cp008QuestionStudioAdapterV1.generate({ ...request, runtimeMode: "bank-only" }), /only supports review-only runtime/i);
console.log("ENG-001 CP008 Question Studio review-only integration tests passed.");
