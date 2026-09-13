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
assert.deepEqual(registered?.cpIds, ["ENG-001-CP001", "ENG-001-CP002", "ENG-001-CP003", "ENG-001-CP004", "ENG-001-CP005", "ENG-001-CP006"]);

assert.equal(isEng001QuestionStudioRequestV1({ packageId: "ENG-001" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "ENG-001-CP002" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "ENG-001-CP003" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "GR-TNS-007" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ canonicalProblemId: "GR-ART-008" }), true);
assert.equal(isEng001QuestionStudioRequestV1({ packageId: "COM-001" }), false);

const baseRequest = {
  engineId: "language-v1" as const,
  packageId: "ENG-001",
  language: "en" as const,
  difficulty: "Medium",
  count: 8,
  seed: "eng001-legacy-question-studio-regression",
  runtimeMode: "review-only",
};

function assertReviewOnly(question: Record<string, unknown>, expectedCp: string, authorityPattern: RegExp) {
  assert.equal(question.packageId, "ENG-001");
  assert.equal(question.cpId, expectedCp);
  assert.equal(question.language, "en");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.humanReviewApproved, true);
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.automaticStudentPublication, false);
  assert.equal(question.productionReleaseAuthorized, false);
  assert.match(String(question.registrationAuthorityId), authorityPattern);
}

// Package-only requests must keep the historical CP001 default.
const cp001 = await generateQuestionStudioQuestions(baseRequest);
const cp001Replay = await generateQuestionStudioQuestions(baseRequest);
assert.deepEqual(cp001, cp001Replay);
assert.equal(cp001.questions.length, 8);
assert.equal(cp001.questions.every((question) => question.cpId === "ENG-001-CP001"), true);
for (const question of cp001.questions) {
  assertReviewOnly(question, "ENG-001-CP001", /ENG-001-CP001-HUMAN-EDITORIAL-APPROVAL-V1/);
  assert.equal(getGeneratedItemApprovalDisposition({ ...question, generationContext: cp001.generationContext }).mode, "review_only");
}

const cp002 = await generateQuestionStudioQuestions({
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP002",
  subtopic: "Tenses and Sequence of Tenses",
  seed: "eng001-cp002-legacy-regression",
});
assert.equal(cp002.questions.every((question) => question.cpId === "ENG-001-CP002"), true);
assert.equal(cp002.questions.every((question) => String(question.ruleId).startsWith("GR-TNS-")), true);
for (const question of cp002.questions) {
  assertReviewOnly(question, "ENG-001-CP002", /ENG-001-CP002-HUMAN-EDITORIAL-APPROVAL-V1/);
}

const cp003 = await generateQuestionStudioQuestions({
  ...baseRequest,
  canonicalProblemId: "ENG-001-CP003",
  subtopic: "Articles and Determiners",
  seed: "eng001-cp003-legacy-regression",
});
assert.equal(cp003.questions.every((question) => question.cpId === "ENG-001-CP003"), true);
assert.equal(cp003.questions.every((question) => String(question.ruleId).startsWith("GR-ART-")), true);
for (const question of cp003.questions) {
  assertReviewOnly(question, "ENG-001-CP003", /ENG-001-CP003-HUMAN-EDITORIAL-APPROVAL-V1/);
}

for (const [qlId, ruleId, difficulty, expectedCp] of [
  ["ENG-001-QL001", "GR-SVA-001", "Easy", "ENG-001-CP001"],
  ["ENG-001-QL002", "GR-TNS-007", "Hard", "ENG-001-CP002"],
  ["ENG-001-QL007", "GR-ART-005", "Hard", "ENG-001-CP003"],
] as const) {
  const selected = await languageV1Eng001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    patternId: qlId,
    canonicalProblemId: ruleId,
    count: 1,
    seed: `${qlId}:${ruleId}:legacy-filter`,
  });
  assert.equal(selected.questions[0]?.qlId, qlId);
  assert.equal(selected.questions[0]?.ruleId, ruleId);
  assert.equal(selected.questions[0]?.cpId, expectedCp);
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

console.log("ENG-001 CP001–CP003 legacy Question Studio regressions passed with CP004–CP006 package registration.");
