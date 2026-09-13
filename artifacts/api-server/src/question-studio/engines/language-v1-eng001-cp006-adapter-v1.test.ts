import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import {
  ENG001_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isEng001Cp006QuestionStudioRequestV1,
  languageV1Eng001Cp006QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp006-adapter-v1";

const packageDef = ENG001_CP006_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.engineId, "language-v1");
assert.equal(packageDef.packageId, "ENG-001");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.deepEqual(packageDef.cpIds, [
  "ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003",
  "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006",
]);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

const registered = listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001");
assert.deepEqual(registered?.cpIds, [
  "ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003",
  "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006",
]);

assert.equal(isEng001Cp006QuestionStudioRequestV1({ packageId: "ENG-001" }), false);
assert.equal(isEng001Cp006QuestionStudioRequestV1({ packageId: "ENG-001", canonicalProblemId: "ENG-001-CP006" }), true);
assert.equal(isEng001Cp006QuestionStudioRequestV1({ canonicalProblemId: "GR-CMP-004" }), true);
assert.equal(isEng001Cp006QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Adjectives, Adverbs and Comparison" }), true);
assert.equal(isEng001Cp006QuestionStudioRequestV1({ packageId: "COM-001", canonicalProblemId: "ENG-001-CP006" }), false);

const baseRequest = {
  engineId: "language-v1" as const,
  packageId: "ENG-001",
  language: "en" as const,
  difficulty: "Medium",
  count: 12,
  seed: "eng001-cp006-question-studio-integration-test",
  runtimeMode: "review-only",
};

const legacy = await generateQuestionStudioQuestions(baseRequest);
assert.equal(legacy.questions.length, 12);
assert.equal(legacy.questions.every((question) => question.cpId === "ENG-001-CP001"), true);

const request = {
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP006",
  subtopic: "Adjectives, Adverbs and Comparison",
};
const result = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.deepEqual(result, replay);
assert.equal(result.questions.length, 12);
assert.equal(new Set(result.questions.map((question) => question.candidateId)).size, 12);
assert.equal(result.generationContext?.cpId, "ENG-001-CP006");
assert.equal(result.generationContext?.approvedReviewBlobSha, "sha256:b0346c171f0313ebdc7aacf690b7da80eb17a4a6e59a3d9bac10054455c614b3");
assert.equal(result.generationContext?.approvedGeneratorHeadSha, "3442a2e404216ab4dd628e31daf6187431a04c2d");

for (const question of result.questions) {
  assert.equal(question.packageId, "ENG-001");
  assert.equal(question.cpId, "ENG-001-CP006");
  assert.equal(question.subtopic, "Adjectives, Adverbs and Comparison");
  assert.match(String(question.ruleId), /^GR-CMP-/);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP006-HUMAN-EDITORIAL-APPROVAL-V1/);
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
  ["ENG-001-QL001", "GR-CMP-001", "Easy"],
  ["ENG-001-QL002", "GR-CMP-006", "Medium"],
  ["ENG-001-QL007", "GR-CMP-009", "Hard"],
] as const) {
  const selected = await languageV1Eng001Cp006QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    patternId: qlId,
    canonicalProblemId: ruleId,
    count: 1,
    seed: `${qlId}:${ruleId}:cp006-filter`,
  });
  assert.equal(selected.questions.length, 1);
  assert.equal(selected.questions.every((question) => question.qlId === qlId), true);
  assert.equal(selected.questions.every((question) => question.ruleId === ruleId), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP006"), true);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const selected = await languageV1Eng001Cp006QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    canonicalProblemId: "ENG-001-CP006",
    count: 5,
    seed: `eng001:cp006:${difficulty}:filter`,
  });
  assert.equal(selected.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP006"), true);
}

await assert.rejects(
  languageV1Eng001Cp006QuestionStudioAdapterV1.generate({ ...request, language: "hi" }),
  /supports English only/i,
);
await assert.rejects(
  languageV1Eng001Cp006QuestionStudioAdapterV1.generate({ ...request, runtimeMode: "bank-only" }),
  /only supports review-only runtime/i,
);
await assert.rejects(
  languageV1Eng001Cp006QuestionStudioAdapterV1.generate({ ...request, difficulty: "Easy", canonicalProblemId: "GR-CMP-006" }),
  /GR-CMP-006 is not approved for Easy difficulty/i,
);

console.log("ENG-001 CP006 Question Studio review-only integration tests passed.");
