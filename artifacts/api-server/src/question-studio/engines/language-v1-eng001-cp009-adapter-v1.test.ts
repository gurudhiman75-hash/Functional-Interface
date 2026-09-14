import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import { ENG001_CP009_STANDARD_REVIEW_ONLY_PACKAGE_V1, isEng001Cp009QuestionStudioRequestV1, languageV1Eng001Cp009QuestionStudioAdapterV1 } from "./language-v1-eng001-cp009-adapter-v1";

const expectedCp009Cps = ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006", "ENG-001-CP007", "ENG-001-CP008", "ENG-001-CP009"];
const expectedCurrentCps = [...expectedCp009Cps, "ENG-001-CP010", "ENG-001-CP011"];
const packageDef = ENG001_CP009_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.engineId, "language-v1");
assert.equal(packageDef.packageId, "ENG-001");
assert.deepEqual(packageDef.cpIds, expectedCp009Cps);
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);
assert.deepEqual(listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001")?.cpIds, expectedCurrentCps);

assert.equal(isEng001Cp009QuestionStudioRequestV1({ packageId: "ENG-001" }), false);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ packageId: "ENG-001", canonicalProblemId: "ENG-001-CP009" }), true);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ canonicalProblemId: "GR-GIP-005" }), true);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Gerunds, Infinitives & Participles" }), true);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Nouns & Quantifiers" }), false);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Pronouns" }), false);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Modifiers" }), false);
assert.equal(isEng001Cp009QuestionStudioRequestV1({ packageId: "COM-001", canonicalProblemId: "ENG-001-CP009" }), false);

const baseRequest = { engineId: "language-v1" as const, packageId: "ENG-001", language: "en" as const, difficulty: "Medium", count: 12, seed: "eng001-cp009-question-studio-integration-test", runtimeMode: "review-only" };
const request = { ...baseRequest, canonicalProblemId: "ENG-001-CP009", subtopic: "Gerunds, Infinitives & Participles" };
const result = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.deepEqual(result, replay);
assert.equal(result.questions.length, 12);
assert.equal(new Set(result.questions.map((question) => question.candidateId)).size, 12);
assert.equal(result.generationContext?.cpId, "ENG-001-CP009");
assert.equal(result.generationContext?.approvedReviewBlobSha, "sha256:6a59e8cdbc1b1b061205a55690e68fc76724ffd7b24f2cecfdce8de5368e465f");
assert.equal(result.generationContext?.approvedGeneratorHeadSha, "044ec531bbe9f3c0efd6a39596359bab4bd30857");
for (const question of result.questions) {
  assert.equal(question.cpId, "ENG-001-CP009");
  assert.equal(question.subtopic, "Gerunds, Infinitives & Participles");
  assert.match(String(question.ruleId), /^GR-GIP-/);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP009-HUMAN-EDITORIAL-APPROVAL-V1/);
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
for (const [qlId, ruleId, difficulty] of [["ENG-001-QL001", "GR-GIP-001", "Easy"], ["ENG-001-QL002", "GR-GIP-005", "Medium"], ["ENG-001-QL007", "GR-GIP-010", "Hard"]] as const) {
  const selected = await languageV1Eng001Cp009QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty, patternId: qlId, canonicalProblemId: ruleId, count: 1, seed: `${qlId}:${ruleId}:cp009-filter` });
  assert.equal(selected.questions[0]?.qlId, qlId);
  assert.equal(selected.questions[0]?.ruleId, ruleId);
  assert.equal(selected.questions[0]?.cpId, "ENG-001-CP009");
}
for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const selected = await languageV1Eng001Cp009QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty, canonicalProblemId: "ENG-001-CP009", count: 5, seed: `eng001:cp009:${difficulty}:filter` });
  assert.equal(selected.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP009"), true);
}
await assert.rejects(languageV1Eng001Cp009QuestionStudioAdapterV1.generate({ ...request, count: 21 }), /count between 1 and 20/i);
await assert.rejects(languageV1Eng001Cp009QuestionStudioAdapterV1.generate({ ...request, language: "hi" }), /supports English only/i);
await assert.rejects(languageV1Eng001Cp009QuestionStudioAdapterV1.generate({ ...request, runtimeMode: "bank-only" }), /only supports review-only runtime/i);
console.log("ENG-001 CP009 Question Studio review-only integration tests passed with CP011 registered globally.");
