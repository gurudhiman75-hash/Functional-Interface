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
assert.equal(packageDef.subtopic, "Approved grammar checkpoints");
assert.equal(packageDef.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDef.questionBankStatus, "NOT_STORED");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.deepEqual(packageDef.supportedLanguages, ["en"]);
assert.deepEqual(packageDef.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(packageDef.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003"]);
assert.equal(packageDef.metadata?.humanReviewApproved, true);
assert.equal(packageDef.metadata?.reviewOnly, true);

assert.equal(listQuestionStudioEngines().includes("language-v1"), true);
const registered = listQuestionStudioPackages().find((entry) => entry.packageId === "ENG-001");
assert.equal(registered?.engineId, "language-v1");
assert.equal(registered?.enabled, true);
assert.deepEqual(registered?.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004"]);

assert.equal(isEng001QuestionStudioRequestV1({ packageId: "ENG-001" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "ENG-001-CP002" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "ENG-001-CP003" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "GR-TNS-007" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "GR-ART-008" }), true);
assert.equal(
  isEng001QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Tenses and Sequence of Tenses" }),
  true,
);
assert.equal(
  isEng001QuestionStudioRequestV1({ subject: "English", topic: "Error Spotting", subtopic: "Articles and Determiners" }),
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

// Package-only requests retain the original CP001 behaviour for existing callers.
const first = await generateQuestionStudioQuestions(baseRequest);
const replay = await generateQuestionStudioQuestions(baseRequest);
assert.equal(first.engineId, "language-v1");
assert.equal(first.questions.length, 12);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((question) => question.candidateId)).size, 12);
assert.equal(first.questions.every((question) => question.cpId === "ENG-001-CP001"), true);

function assertReviewOnly(question: Record<string, unknown>, expectedCp: string, authorityPattern: RegExp) {
  assert.equal(question.packageId, "ENG-001");
  assert.equal(question.cpId, expectedCp);
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
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.match(String(question.registrationAuthorityId), authorityPattern);
  assert.equal(Array.isArray(question.options), true);
  assert.equal(Number.isInteger(question.correctIndex), true);
  assert.equal(typeof question.explanation, "string");
  assert.equal(typeof question.correctedSentence, "string");
  assert.equal(String(question.text).includes("Identify the part of the sentence that contains an error."), true);
}

for (const question of first.questions) {
  assertReviewOnly(question, "ENG-001-CP001", /ENG-001-CP001-HUMAN-EDITORIAL-APPROVAL-V1/);
  assert.equal(getGeneratedItemApprovalDisposition({ ...question, generationContext: first.generationContext }).mode, "review_only");
}

const cp002Request = {
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP002",
  subtopic: "Tenses and Sequence of Tenses",
  seed: "eng001-cp002-question-studio-integration-test",
};
const cp002 = await generateQuestionStudioQuestions(cp002Request);
const cp002Replay = await generateQuestionStudioQuestions(cp002Request);
assert.deepEqual(cp002, cp002Replay);
assert.equal(cp002.questions.length, 12);
assert.equal(new Set(cp002.questions.map((question) => question.candidateId)).size, 12);
assert.equal(cp002.generationContext?.cpId, "ENG-001-CP002");
assert.equal(cp002.generationContext?.approvedReviewBlobSha, "2bab0f00ffdd423e6b7d9522b01462217a7e1b64");
assert.equal(cp002.generationContext?.approvedGeneratorHeadSha, "5a5d8fcc72ef9f986626a8e49215a73c9471250c");
for (const question of cp002.questions) {
  assertReviewOnly(question, "ENG-001-CP002", /ENG-001-CP002-HUMAN-EDITORIAL-APPROVAL-V1/);
  assert.equal(question.subtopic, "Tenses and Sequence of Tenses");
  assert.match(String(question.ruleId), /^GR-TNS-/);
  assert.equal(getGeneratedItemApprovalDisposition({ ...question, generationContext: cp002.generationContext }).mode, "review_only");
}

const cp003Request = {
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP003",
  subtopic: "Articles and Determiners",
  seed: "eng001-cp003-question-studio-integration-test",
};
const cp003 = await generateQuestionStudioQuestions(cp003Request);
const cp003Replay = await generateQuestionStudioQuestions(cp003Request);
assert.deepEqual(cp003, cp003Replay);
assert.equal(cp003.questions.length, 12);
assert.equal(new Set(cp003.questions.map((question) => question.candidateId)).size, 12);
assert.equal(cp003.generationContext?.cpId, "ENG-001-CP003");
assert.equal(cp003.generationContext?.approvedReviewBlobSha, "sha256:cb887d0d7e9c282129c18faa1d90927704dea5b8f3b9a28907521cfbd0de3b98");
assert.equal(cp003.generationContext?.approvedGeneratorHeadSha, "c3856d90bf58327dcf2bd8011e62e6e03f62a2b1");
for (const question of cp003.questions) {
  assertReviewOnly(question, "ENG-001-CP003", /ENG-001-CP003-HUMAN-EDITORIAL-APPROVAL-V1/);
  assert.equal(question.subtopic, "Articles and Determiners");
  assert.match(String(question.ruleId), /^GR-ART-/);
  assert.equal(getGeneratedItemApprovalDisposition({ ...question, generationContext: cp003.generationContext }).mode, "review_only");
}

for (const [qlId, ruleId, selectorDifficulty, expectedCp] of [
  ["ENG-001-QL001", "GR-SVA-001", "Easy", "ENG-001-CP001"],
  ["ENG-001-QL002", "GR-SVA-005", "Medium", "ENG-001-CP001"],
  ["ENG-001-QL007", "GR-SVA-008", "Medium", "ENG-001-CP001"],
  ["ENG-001-QL001", "GR-TNS-003", "Easy", "ENG-001-CP002"],
  ["ENG-001-QL002", "GR-TNS-007", "Hard", "ENG-001-CP002"],
  ["ENG-001-QL007", "GR-TNS-008", "Hard", "ENG-001-CP002"],
  ["ENG-001-QL001", "GR-ART-001", "Easy", "ENG-001-CP003"],
  ["ENG-001-QL002", "GR-ART-008", "Hard", "ENG-001-CP003"],
  ["ENG-001-QL007", "GR-ART-005", "Hard", "ENG-001-CP003"],
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
  assert.equal(result.questions.every((question) => question.cpId === expectedCp), true);
}

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const cp001Result = await languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    canonicalProblemId: "ENG-001-CP001",
    count: 5,
    seed: `eng001:cp001:${difficulty}:filter`,
  });
  assert.equal(cp001Result.questions.every((question) => question.difficulty === difficulty), true);

  const cp002Result = await languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    canonicalProblemId: "ENG-001-CP002",
    count: 5,
    seed: `eng001:cp002:${difficulty}:filter`,
  });
  assert.equal(cp002Result.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(cp002Result.questions.every((question) => question.cpId === "ENG-001-CP002"), true);

  const cp003Result = await languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    canonicalProblemId: "ENG-001-CP003",
    count: 5,
    seed: `eng001:cp003:${difficulty}:filter`,
  });
  assert.equal(cp003Result.questions.every((question) => question.difficulty === difficulty), true);
  assert.equal(cp003Result.questions.every((question) => question.cpId === "ENG-001-CP003"), true);
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
  languageV1Eng001QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty: "Medium", canonicalProblemId: "GR-SVA-001" }),
  /GR-SVA-001 is not approved for Medium difficulty/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({ ...baseRequest, difficulty: "Easy", canonicalProblemId: "GR-ART-007" }),
  /GR-ART-007 is not approved for Easy difficulty/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "ENG-001-CP001",
    questionLanguageId: "GR-TNS-002",
  }),
  /Conflicting ENG-001 checkpoint selectors/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "ENG-001-CP002",
    questionLanguageId: "GR-SVA-005",
  }),
  /Conflicting ENG-001 checkpoint selectors/i,
);
await assert.rejects(
  languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "ENG-001-CP003",
    questionLanguageId: "GR-TNS-007",
  }),
  /Conflicting ENG-001 checkpoint selectors/i,
);

console.log("ENG-001 CP001 + CP002 + CP003 legacy Question Studio regression tests passed with CP004 package registration.");
