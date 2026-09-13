import { strict as assert } from "node:assert";

import { getGeneratedItemApprovalDisposition } from "../../lib/admin-question-studio-approval-policy";
import { generateQuestionStudioQuestions, listQuestionStudioPackages } from "../engine-registry";
import {
  ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isEng001Cp005QuestionStudioRequestV1,
  languageV1Eng001Cp005QuestionStudioAdapterV1,
} from "./language-v1-eng001-cp005-adapter-v1";

const packageDef = ENG001_CP005_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.engineId, "language-v1");
assert.equal(packageDef.packageId, "ENG-001");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.automaticStudentPublication, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.deepEqual(packageDef.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005"]);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

const registered = listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001");
assert.deepEqual(registered?.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006"]);

assert.equal(isEng001Cp005QuestionStudioRequestV1({ packageId: "ENG-001" }), false);
assert.equal(isEng001Cp005QuestionStudioRequestV1({ packageId: "ENG-001", canonicalProblemId: "ENG-001-CP005" }), true);
assert.equal(isEng001Cp005QuestionStudioRequestV1({ canonicalProblemId: "GR-PRP-004" }), true);
assert.equal(isEng001Cp005QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Prepositions" }), true);
assert.equal(isEng001Cp005QuestionStudioRequestV1({ packageId: "COM-001", canonicalProblemId: "ENG-001-CP005" }), false);

const baseRequest = {
  engineId: "language-v1" as const,
  packageId: "ENG-001",
  language: "en" as const,
  difficulty: "Medium",
  count: 12,
  seed: "eng001-cp005-question-studio-integration-test",
  runtimeMode: "review-only",
};

// Legacy package-only requests must still default to CP001.
const legacy = await generateQuestionStudioQuestions(baseRequest);
assert.equal(legacy.questions.length, 12);
assert.equal(legacy.questions.every((question) => question.cpId === "ENG-001-CP001"), true);

const request = {
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP005",
  subtopic: "Prepositions",
};
const result = await generateQuestionStudioQuestions(request);
const replay = await generateQuestionStudioQuestions(request);
assert.deepEqual(result, replay);
assert.equal(result.questions.length, 12);
assert.equal(new Set(result.questions.map((question) => question.candidateId)).size, 12);
assert.equal(result.generationContext?.cpId, "ENG-001-CP005");
assert.equal(result.generationContext?.approvedReviewBlobSha, "sha256:27a983dc368153145d488a5ff6614e9497a76baed8bbef852fdaa7f67dc3db4c");
assert.equal(result.generationContext?.approvedGeneratorHeadSha, "24243c3e2001cbbf9ab01b2fa03d4d9eb16ae033");

for (const question of result.questions) {
  assert.equal(question.packageId, "ENG-001");
  assert.equal(question.cpId, "ENG-001-CP005");
  assert.equal(question.subtopic, "Prepositions");
  assert.match(String(question.ruleId), /^GR-PRP-/);
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.match(String(question.registrationAuthorityId), /ENG-001-CP005-HUMAN-EDITORIAL-APPROVAL-V1/);
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
  ["ENG-001-QL001", "GR-PRP-001", "Easy"],
  ["ENG-001-QL002", "GR-PRP-004", "Hard"],
  ["ENG-001-QL007", "GR-PRP-009", "Hard"],
] as const) {
  const selected = await languageV1Eng001Cp005QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    patternId: qlId,
    canonicalProblemId: ruleId,
    count: 1,
    seed: `${qlId}:${ruleId}:cp005-filter`,
  });
  assert.equal(selected.questions.length, 1);
  assert.equal(selected.questions.every((question) => question.qlId === qlId), true);
  assert.equal(selected.questions.every((question) => question.ruleId === ruleId), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP005"), true);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const selected = await languageV1Eng001Cp005QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    canonicalProblemId: "ENG-001-CP005",
    count: 5,
    seed: `eng001:cp005:${difficulty}:filter`,
  });
  assert.equal(selected.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(selected.questions.every((question) => question.cpId === "ENG-001-CP005"), true);
}

await assert.rejects(
  languageV1Eng001Cp005QuestionStudioAdapterV1.generate({ ...request, language: "hi" }),
  /supports English only/i,
);
await assert.rejects(
  languageV1Eng001Cp005QuestionStudioAdapterV1.generate({ ...request, runtimeMode: "bank-only" }),
  /only supports review-only runtime/i,
);
await assert.rejects(
  languageV1Eng001Cp005QuestionStudioAdapterV1.generate({ ...request, difficulty: "Easy", canonicalProblemId: "GR-PRP-004" }),
  /GR-PRP-004 is not approved for Easy difficulty/i,
);

console.log("ENG-001 CP005 Question Studio review-only integration tests passed.");
