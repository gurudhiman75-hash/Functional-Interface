import assert from "node:assert/strict";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";

const packages = languageV1QuestionStudioAdapter.listPackages();
const eng002 = packages.find((pkg) => pkg.packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(eng002);
assert.deepEqual(eng002.cpIds, ["ENG-002-CP001", "ENG-002-CP002", "ENG-002-CP003", "ENG-002-CP004", "ENG-002-CP005", "ENG-002-CP006", "ENG-002-CP007", "ENG-002-CP008"]);
assert.equal(eng002.questionBankWritable, false);
assert.equal(eng002.testEligible, false);
assert.equal(eng002.mockTestEligible, false);
assert.equal(eng002.publiclyPublishable, false);
assert.equal(eng002.productionReleaseAuthorized, false);
assert.equal((eng002.metadata as Record<string, unknown>).reviewOnly, true);

const cp007Base = {
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Conjunctions and Parallelism",
  language: "en" as const,
  runtimeMode: "review-only",
  canonicalProblemId: "ENG-002-CP007",
};
const cp008Base = {
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Nouns and Quantifiers",
  language: "en" as const,
  runtimeMode: "review-only",
  canonicalProblemId: "ENG-002-CP008",
};

for (const [cpId, base] of [["ENG-002-CP007", cp007Base], ["ENG-002-CP008", cp008Base]] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await languageV1QuestionStudioAdapter.generate({ ...base, difficulty, count: 5, seed: `${cpId}:${difficulty}:adapter-test` });
    assert.equal(result.questions.length, 5);
    assert.equal(result.generationContext.cpId, cpId);
    assert.equal(result.generationContext.runtimeMode, "review-only");
    assert.equal(result.generationContext.reviewOnly, true);
    for (const question of result.questions) {
      assert.equal(question.cpId, cpId);
      assert.equal(question.topic, "Sentence Improvement");
      assert.equal(question.reviewOnly, true);
      assert.equal(question.questionStudioDiscoverable, true);
      assert.equal(question.questionStudioGenerationEnabled, true);
      assert.equal(question.productionReleased, false);
      assert.equal(question.readOnly, true);
      assert.equal(Array.isArray(question.options), true);
      assert.equal((question.options as unknown[]).length, 4);
      assert.equal((question.options as unknown[])[3], "No improvement");
      assert.match(String(question.sentence), /<u>.+<\/u>/);
      assert.equal(String(question.sentence).includes(" / "), false);
      assert.match(String(question.explanation), /Concept:/);
      assert.match(String(question.explanation), /Correct sentence:/);
    }
  }
}

const cp007Filtered = await languageV1QuestionStudioAdapter.generate({ ...cp007Base, difficulty: "Easy", canonicalProblemId: "GR-CON-001", count: 3, seed: "eng002:cp007:rule-filter" });
assert.equal(cp007Filtered.questions.every((question) => question.ruleId === "GR-CON-001"), true);
const cp008Filtered = await languageV1QuestionStudioAdapter.generate({ ...cp008Base, difficulty: "Easy", canonicalProblemId: "GR-NQN-001", count: 3, seed: "eng002:cp008:rule-filter" });
assert.equal(cp008Filtered.questions.every((question) => question.ruleId === "GR-NQN-001"), true);

await assert.rejects(languageV1QuestionStudioAdapter.generate({ ...cp007Base, language: "hi", count: 1 }), /English only/i);
await assert.rejects(languageV1QuestionStudioAdapter.generate({ ...cp008Base, runtimeMode: "production", count: 1 }), /review-only/i);
await assert.rejects(languageV1QuestionStudioAdapter.generate({ ...cp007Base, canonicalProblemId: "GR-NQN-001", count: 1 }), /selector|explicit/i);

console.log("ENG-002 CP007/CP008 Question Studio review-only adapter tests passed.");
