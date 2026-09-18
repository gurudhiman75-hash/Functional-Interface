import assert from "node:assert/strict";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng003-cp001-adapter-v1";
import { languageV1Eng003Cp002QuestionStudioAdapterV1 } from "./language-v1-eng003-cp002-adapter-v1";

const baseRequest = {
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-003-CP002",
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Tenses and Sequence of Tenses",
  language: "en" as const,
  runtimeMode: "review-only",
};

const packages = languageV1QuestionStudioAdapter.listPackages();
const eng003Package = packages.find((pkg) => pkg.packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(eng003Package);
assert.equal(eng003Package.cpIds.includes("ENG-003-CP001"), true);
assert.equal(eng003Package.cpIds.includes("ENG-003-CP002"), true);
assert.equal(eng003Package.questionBankWritable, false);
assert.equal(eng003Package.testEligible, false);
assert.equal(eng003Package.mockTestEligible, false);
assert.equal(eng003Package.publiclyPublishable, false);
assert.equal(eng003Package.automaticStudentPublication, false);
assert.equal(eng003Package.productionReleaseAuthorized, false);
assert.equal(eng003Package.metadata?.humanReviewApproved, true);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1Eng003Cp002QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    count: 5,
    seed: `eng003:cp002:${difficulty}:adapter-test`,
  });
  assert.equal(result.questions.length, 5);
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  for (const question of result.questions) {
    assert.equal(question.cpId, "ENG-003-CP002");
    assert.equal(question.topic, "Fill in the Blanks / Grammar Fillers");
    assert.equal(question.subtopic, "Tenses and Sequence of Tenses");
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
    assert.match(String(question.explanation), /Concept:/);
    assert.match(String(question.explanation), /Here[:,]/);
    assert.match(String(question.explanation), /Correct sentence:/);
  }
}

const ruleFiltered = await languageV1Eng003Cp002QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Medium",
  patternId: "GR-TNS-005",
  count: 3,
  seed: "eng003:cp002:rule-filter",
});
assert.equal(ruleFiltered.questions.every((question) => question.ruleId === "GR-TNS-005"), true);

const compositeEng003Cp002 = await languageV1QuestionStudioAdapter.generate({
  ...baseRequest,
  patternId: "GR-TNS-007",
  difficulty: "Hard",
  count: 2,
  seed: "eng003:cp002:composite",
});
assert.equal(compositeEng003Cp002.questions.every((question) => question.cpId === "ENG-003-CP002"), true);
assert.equal(compositeEng003Cp002.questions.every((question) => String(question.sentence).includes("_____")), true);

// The chapter package may also route CP002 from the approved tense subtopic without a CP selector.
const subtopicRouted = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Tenses and Sequence of Tenses",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Medium",
  count: 1,
  seed: "eng003:cp002:subtopic-route",
});
assert.equal(subtopicRouted.questions[0]?.cpId, "ENG-003-CP002");

// Shared GR-TNS rule IDs must not steal an explicitly selected ENG-002 request.
const compositeEng002 = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-002-CP002",
  patternId: "GR-TNS-007",
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Tenses and Sequence of Tenses",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Hard",
  count: 1,
  seed: "eng003:cp002:collision-guard",
});
assert.equal(compositeEng002.questions[0]?.cpId, "ENG-002-CP002");
assert.match(String(compositeEng002.questions[0]?.sentence), /<u>.+<\/u>/);
assert.equal(String(compositeEng002.questions[0]?.sentence).includes("_____"), false);

await assert.rejects(
  languageV1Eng003Cp002QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi", count: 1 }),
  /English only/i,
);
await assert.rejects(
  languageV1Eng003Cp002QuestionStudioAdapterV1.generate({ ...baseRequest, runtimeMode: "production", count: 1 }),
  /review-only/i,
);

console.log("ENG-003 CP002 Question Studio review-only lifecycle tests passed.");
