import assert from "node:assert/strict";
import { languageV1Eng002Cp001QuestionStudioAdapterV1, ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";

const baseRequest = {
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Subject–Verb Agreement",
  language: "en" as const,
  runtimeMode: "review-only",
};

const packages = languageV1Eng002Cp001QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]?.cpIds.includes("ENG-002-CP001"), true);
assert.equal(packages[0]?.questionBankWritable, false);
assert.equal(packages[0]?.testEligible, false);
assert.equal(packages[0]?.productionReleaseAuthorized, false);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1Eng002Cp001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    difficulty,
    count: 5,
    seed: `eng002:cp001:${difficulty}:adapter-test`,
  });
  assert.equal(result.questions.length, 5);
  for (const question of result.questions) {
    assert.equal(question.cpId, "ENG-002-CP001");
    assert.equal(question.topic, "Sentence Improvement");
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.productionReleased, false);
    assert.equal(Array.isArray(question.options), true);
    assert.equal((question.options as unknown[]).length, 4);
    assert.equal((question.options as unknown[])[3], "No improvement");
    assert.match(String(question.sentence), /<u>.+<\/u>/);
    assert.equal(String(question.sentence).includes(" / "), false);
    assert.match(String(question.explanation), /Concept:/);
    assert.match(String(question.explanation), /Here:/);
    assert.match(String(question.explanation), /Correct sentence:/);
  }
}

const ruleFiltered = await languageV1Eng002Cp001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Easy",
  canonicalProblemId: "GR-SVA-002",
  count: 3,
  seed: "eng002:cp001:rule-filter",
});
assert.equal(ruleFiltered.questions.every((question) => question.ruleId === "GR-SVA-002"), true);

await assert.rejects(
  languageV1Eng002Cp001QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi", count: 1 }),
  /English only/i,
);
await assert.rejects(
  languageV1Eng002Cp001QuestionStudioAdapterV1.generate({ ...baseRequest, runtimeMode: "production", count: 1 }),
  /review-only/i,
);

console.log("ENG-002 CP001 Question Studio review-only adapter tests passed.");
