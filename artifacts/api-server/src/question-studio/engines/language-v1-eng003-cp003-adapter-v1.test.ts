import assert from "node:assert/strict";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng003-cp001-adapter-v1";
import { languageV1Eng003Cp003QuestionStudioAdapterV1 } from "./language-v1-eng003-cp003-adapter-v1";

const baseRequest = {
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-003-CP003",
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Articles and Determiners",
  language: "en" as const,
  runtimeMode: "review-only",
};

const packages = languageV1QuestionStudioAdapter.listPackages();
const eng003Package = packages.find((pkg) => pkg.packageId === ENG003_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(eng003Package);
assert.equal(eng003Package.cpIds.includes("ENG-003-CP001"), true);
assert.equal(eng003Package.cpIds.includes("ENG-003-CP002"), true);
assert.equal(eng003Package.cpIds.includes("ENG-003-CP003"), true);
assert.equal(eng003Package.questionBankWritable, false);
assert.equal(eng003Package.testEligible, false);
assert.equal(eng003Package.mockTestEligible, false);
assert.equal(eng003Package.publiclyPublishable, false);
assert.equal(eng003Package.automaticStudentPublication, false);
assert.equal(eng003Package.productionReleaseAuthorized, false);
assert.equal(eng003Package.metadata?.humanReviewApproved, true);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1Eng003Cp003QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    count: 5,
    seed: `eng003:cp003:${difficulty}:adapter-test`,
  });
  assert.equal(result.questions.length, 5);
  assert.equal(result.generationContext?.reviewOnly, true);
  assert.equal(result.generationContext?.productionReleaseAuthorized, false);
  for (const question of result.questions) {
    assert.equal(question.cpId, "ENG-003-CP003");
    assert.equal(question.topic, "Fill in the Blanks / Grammar Fillers");
    assert.equal(question.subtopic, "Articles and Determiners");
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
    assert.match(String(question.explanation), /Here,/);
    assert.match(String(question.explanation), /Correct sentence:/);
  }
}

const ruleFiltered = await languageV1Eng003Cp003QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Medium",
  patternId: "GR-ART-005",
  count: 3,
  seed: "eng003:cp003:rule-filter",
});
assert.equal(ruleFiltered.questions.every((question) => question.ruleId === "GR-ART-005"), true);

const compositeEng003Cp003 = await languageV1QuestionStudioAdapter.generate({
  ...baseRequest,
  patternId: "GR-ART-009",
  difficulty: "Medium",
  count: 2,
  seed: "eng003:cp003:composite",
});
assert.equal(compositeEng003Cp003.questions.every((question) => question.cpId === "ENG-003-CP003"), true);
assert.equal(compositeEng003Cp003.questions.every((question) => String(question.sentence).includes("_____")), true);

const subtopicRouted = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Fill in the Blanks / Grammar Fillers",
  subtopic: "Articles and Determiners",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Medium",
  count: 1,
  seed: "eng003:cp003:subtopic-route",
});
assert.equal(subtopicRouted.questions[0]?.cpId, "ENG-003-CP003");

// Shared GR-ART rule IDs must not steal explicitly selected ENG-002 sentence-improvement requests.
const compositeEng002 = await languageV1QuestionStudioAdapter.generate({
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  canonicalProblemId: "ENG-002-CP003",
  patternId: "GR-ART-009",
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Articles and Determiners",
  language: "en",
  runtimeMode: "review-only",
  difficulty: "Medium",
  count: 1,
  seed: "eng003:cp003:collision-guard",
});
assert.equal(compositeEng002.questions[0]?.cpId, "ENG-002-CP003");
assert.match(String(compositeEng002.questions[0]?.sentence), /<u>.+<\/u>/);
assert.equal(String(compositeEng002.questions[0]?.sentence).includes("_____"), false);

await assert.rejects(
  languageV1Eng003Cp003QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi", count: 1 }),
  /English only/i,
);
await assert.rejects(
  languageV1Eng003Cp003QuestionStudioAdapterV1.generate({ ...baseRequest, runtimeMode: "production", count: 1 }),
  /review-only/i,
);

console.log("ENG-003 CP003 Question Studio review-only lifecycle tests passed.");
