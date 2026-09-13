import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import { ENG001_CP007_STANDARD_REVIEW_ONLY_PACKAGE_V1, isEng001Cp007QuestionStudioRequestV1, languageV1Eng001Cp007QuestionStudioAdapterV1 } from "./language-v1-eng001-cp007-adapter-v1";

const expectedCps = ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006", "ENG-001-CP007"];
const packageDef = ENG001_CP007_STANDARD_REVIEW_ONLY_PACKAGE_V1;
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

assert.equal(isEng001Cp007QuestionStudioRequestV1({ packageId: "ENG-001" }), false);
assert.equal(isEng001Cp007QuestionStudioRequestV1({ packageId: "ENG-001", canonicalProblemId: "ENG-001-CP007" }), true);
assert.equal(isEng001Cp007QuestionStudioRequestV1({ canonicalProblemId: "GR-CON-009" }), true);
assert.equal(isEng001Cp007QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Conjunctions & Parallelism" }), true);
assert.equal(isEng001Cp007QuestionStudioRequestV1({ packageId: "COM-001", canonicalProblemId: "ENG-001-CP007" }), false);

const baseRequest = { engineId: "language-v1" as const, packageId: "ENG-001", language: "en" as const, difficulty: "Medium", count: 12, seed: "eng001-cp007-question-studio-integration-test", runtimeMode: "review-only" };
const request = { ...baseRequest, canonicalProblemId: "ENG-001-CP007", subtopic: "Conjunctions & Parallelism" };
const result = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.deepEqual(result, replay);
assert.equal(result.questions.length, 12);
assert.equal(new Set(result.questions.map((question) => question.candidateId)).size, 12);
assert.equal(result.generationContext?.cpId, "ENG-001-CP007");
assert.equal(result.generationContext?.approvedReviewBlobSha, "sha256:c7443c9deaf95b91855d67c44d42f856e5eb916ef3cf41bc1578a29c444c8817");
assert.equal(result.generationContext?.approvedGeneratorHeadSha, "5d8834a241c44b65ce1c95988afba7b05e054543");
for (const question of result.questions) {
  assert.equal(question.cpId, "ENG-001-CP007");
  assert.equal(question.subtopic, "Conjunctions & Parallelism");
  assert.match(String(question.ruleId), /^GR-CON-/);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP007-HUMAN-EDITORIAL-APPROVAL-V1/);
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
for (const [qlId, ruleId, difficulty] of [["ENG-001-QL001", "GR-CON-001", "Easy"], ["ENG-001-QL002", "GR-CON-006", "Medium"], ["ENG-001-QL007", "GR-CON-010", "Hard"]] as const) {
  const selected = await languageV1Eng001Cp007QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty, patternId: qlId, canonicalProblemId: ruleId, count: 1, seed: `${qlId}:${ruleId}:cp007-filter` });
  assert.equal(selected.questions[0]?.qlId, qlId);
  assert.equal(selected.questions[0]?.ruleId, ruleId);
  assert.equal(selected.questions[0]?.cpId, "ENG-001-CP007");
}
await assert.rejects(languageV1Eng001Cp007QuestionStudioAdapterV1.generate({ ...request, language: "hi" }), /supports English only/i);
await assert.rejects(languageV1Eng001Cp007QuestionStudioAdapterV1.generate({ ...request, runtimeMode: "bank-only" }), /only supports review-only runtime/i);
console.log("ENG-001 CP007 Question Studio review-only integration tests passed.");
