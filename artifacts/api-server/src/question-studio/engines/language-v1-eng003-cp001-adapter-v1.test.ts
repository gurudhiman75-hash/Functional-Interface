import assert from "node:assert/strict";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1, languageV1Eng003Cp001QuestionStudioAdapterV1 } from "./language-v1-eng003-cp001-adapter-v1";

const baseRequest = {
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Subject–Verb Agreement",
  language: "en" as const,
  runtimeMode: "review-only",
};

const packages = languageV1Eng003Cp001QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]?.cpIds.includes("ENG-003-CP001"), true);
assert.equal(packages[0]?.questionBankWritable, false);
assert.equal(packages[0]?.testEligible, false);
assert.equal(packages[0]?.mockTestEligible, false);
assert.equal(packages[0]?.publiclyPublishable, false);
assert.equal(packages[0]?.automaticStudentPublication, false);
assert.equal(packages[0]?.productionReleaseAuthorized, false);
assert.equal(packages[0]?.metadata?.humanReviewApproved, true);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1Eng003Cp001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    count: 5,
    seed: `eng003:cp001:${difficulty}:adapter-test`,
  });
  assert.equal(result.questions.length, 5);
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  for (const question of result.questions) {
    assert.equal(question.cpId, "ENG-003-CP001");
    assert.equal(question.topic, "Fill in the Blanks / Grammar Fillers");
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
    assert.equal(String(question.sentence).includes("_____"), true);
    assert.match(String(question.explanation), /Concept:/);
    assert.match(String(question.explanation), /Here[:,]/);
    assert.match(String(question.explanation), /Correct sentence:/);
  }
}

const ruleFiltered = await languageV1Eng003Cp001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Easy",
  canonicalProblemId: "GR-SVA-002",
  count: 3,
  seed: "eng003:cp001:rule-filter",
});
assert.equal(ruleFiltered.questions.every((question) => question.ruleId === "GR-SVA-002"), true);

const compositePackage = languageV1QuestionStudioAdapter.listPackages();
assert.equal(compositePackage.some((pkg) => pkg.packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1), true);
const compositeEng003 = await languageV1QuestionStudioAdapter.generate({
  ...baseRequest,
  canonicalProblemId: "ENG-003-CP001",
  patternId: "GR-SVA-002",
  difficulty: "Easy",
  count: 2,
  seed: "eng003:cp001:composite",
});
assert.equal(compositeEng003.questions.every((question) => question.cpId === "ENG-003-CP001"), true);
assert.equal(compositeEng003.questions.every((question) => String(question.sentence).includes("_____")), true);

// Shared GR-SVA rule IDs must not steal an explicitly selected ENG-002 request.
const compositeEng002 = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-002-CP001",
  patternId: "GR-SVA-002",
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Subject–Verb Agreement",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Easy",
  count: 1,
  seed: "eng003:collision-guard",
});
assert.equal(compositeEng002.questions[0]?.cpId, "ENG-002-CP001");
assert.match(String(compositeEng002.questions[0]?.sentence), /<u>.+<\/u>/);

await assert.rejects(
  languageV1Eng003Cp001QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi", count: 1 }),
  /English only/i,
);
await assert.rejects(
  languageV1Eng003Cp001QuestionStudioAdapterV1.generate({ ...baseRequest, runtimeMode: "production", count: 1 }),
  /review-only/i,
);

console.log("ENG-003 CP001 Question Studio review-only lifecycle tests passed.");
