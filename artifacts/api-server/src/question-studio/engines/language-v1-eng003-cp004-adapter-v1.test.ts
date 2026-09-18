import assert from "node:assert/strict";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng003-cp001-adapter-v1";
import { languageV1Eng003Cp004QuestionStudioAdapterV1 } from "./language-v1-eng003-cp004-adapter-v1";
import { languageV1Eng003Cp006QuestionStudioAdapterV1 } from "./language-v1-eng003-cp006-adapter-v1";

const baseRequest = {
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-003-CP004",
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Pronouns",
  language: "en" as const,
  runtimeMode: "review-only",
};

const packages = languageV1QuestionStudioAdapter.listPackages();
const eng003Package = packages.find((pkg) => pkg.packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(eng003Package);
assert.equal(eng003Package.cpIds.includes("ENG-003-CP004"), true);
assert.equal(eng003Package.questionBankWritable, false);
assert.equal(eng003Package.testEligible, false);
assert.equal(eng003Package.mockTestEligible, false);
assert.equal(eng003Package.publiclyPublishable, false);
assert.equal(eng003Package.automaticStudentPublication, false);
assert.equal(eng003Package.productionReleaseAuthorized, false);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1Eng003Cp004QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    count: 5,
    seed: `eng003:cp004:${difficulty}:adapter-test`,
  });
  assert.equal(result.questions.length, 5);
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  for (const question of result.questions) {
    assert.equal(question.cpId, "ENG-003-CP004");
    assert.equal(question.subtopic, "Pronouns");
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.productionReleased, false);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(Array.isArray(question.options), true);
    assert.equal((question.options as unknown[]).length, 4);
    assert.equal((question.options as unknown[]).includes("No improvement"), false);
    assert.equal((String(question.sentence).match(/_____/g) ?? []).length, 1);
    assert.match(String(question.explanation), /Correct sentence:/);
  }
}

const ruleFiltered = await languageV1Eng003Cp004QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Medium",
  patternId: "GR-PRN-007",
  count: 2,
  seed: "eng003:cp004:rule-filter",
});
assert.equal(ruleFiltered.questions.every((q) => q.ruleId === "GR-PRN-007"), true);

const compositeEng003 = await languageV1QuestionStudioAdapter.generate({
  ...baseRequest,
  patternId: "GR-PRN-010",
  difficulty: "Hard",
  count: 1,
  seed: "eng003:cp004:composite",
});
assert.equal(compositeEng003.questions[0]?.cpId, "ENG-003-CP004");
assert.equal(String(compositeEng003.questions[0]?.sentence).includes("_____"), true);

const packageSubtopic = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Pronouns",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Medium",
  count: 1,
  seed: "eng003:cp004:subtopic-route",
});
assert.equal(packageSubtopic.questions[0]?.cpId, "ENG-003-CP004");

const compositeEng002 = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-002-CP004",
  patternId: "GR-PRN-007",
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Pronouns",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Medium",
  count: 1,
  seed: "eng003:cp004:collision-guard",
});
assert.equal(compositeEng002.questions[0]?.cpId, "ENG-002-CP004");
assert.equal(String(compositeEng002.questions[0]?.sentence).includes("_____"), false);

await assert.rejects(
  languageV1Eng003Cp004QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi", count: 1 }),
  /English only/i,
);
await assert.rejects(
  languageV1Eng003Cp004QuestionStudioAdapterV1.generate({ ...baseRequest, runtimeMode: "production", count: 1 }),
  /review-only/i,
);

console.log("ENG-003 CP004 Question Studio review-only lifecycle tests passed.");


const cp006ApprovalHeadSmoke = await languageV1Eng003Cp006QuestionStudioAdapterV1.generate({
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-003-CP006",
  patternId: "GR-CMP-009",
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Adjectives, Adverbs and Comparison",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Hard",
  count: 3,
  seed: "eng003:cp006:approval-head-smoke",
});
assert.equal(cp006ApprovalHeadSmoke.questions.length, 3);
assert.equal(cp006ApprovalHeadSmoke.questions.every((q) => q.cpId === "ENG-003-CP006"), true);
assert.equal(cp006ApprovalHeadSmoke.questions.every((q) => q.ruleId === "GR-CMP-009"), true);
assert.equal(cp006ApprovalHeadSmoke.questions.every((q) => q.reviewOnly === true), true);
assert.equal(cp006ApprovalHeadSmoke.questions.every((q) => q.productionReleaseAuthorized === false), true);
assert.equal(cp006ApprovalHeadSmoke.questions.every((q) => (String(q.sentence).match(/_____/g) ?? []).length === 1), true);
assert.equal(cp006ApprovalHeadSmoke.questions.every((q) => !(q.options as unknown[]).includes("No improvement")), true);

const cp006CompositeRoute = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  patternId: "GR-CMP-010",
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Adjectives, Adverbs and Comparison",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Hard",
  count: 1,
  seed: "eng003:cp006:composite-route",
});
assert.equal(cp006CompositeRoute.questions[0]?.cpId, "ENG-003-CP006");
