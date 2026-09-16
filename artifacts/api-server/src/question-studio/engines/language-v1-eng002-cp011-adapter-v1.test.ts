import assert from "node:assert/strict";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";

const baseRequest = {
  packageId: ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "English",
  topic: "Sentence Improvement",
  subtopic: "Conditionals",
  language: "en" as const,
  runtimeMode: "review-only",
  canonicalProblemId: "ENG-002-CP011",
};

const malformed = /\bhad\s+(?:qualify|lead|handle|back|complete|identify)\b|\bwould\s+(?:completed|identified|handled|backed)\b|\bwould have was\b/i;
const barePassiveIf = /^(?:If|if)\s+(?!.*\b(?:had|has|have|was|were|would have)\s+been\b).+?\s+been\s+(?:sealed|issued|preserved)\b/i;

const packages = languageV1QuestionStudioAdapter.listPackages();
const eng002 = packages.find((pkg) => pkg.packageId === ENG002_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(eng002);
assert.deepEqual(eng002.cpIds, ["ENG-002-CP001", "ENG-002-CP002", "ENG-002-CP003", "ENG-002-CP004", "ENG-002-CP005", "ENG-002-CP006", "ENG-002-CP007", "ENG-002-CP008", "ENG-002-CP009", "ENG-002-CP010", "ENG-002-CP011"]);
assert.equal(eng002.questionBankWritable, false);
assert.equal(eng002.testEligible, false);
assert.equal(eng002.mockTestEligible, false);
assert.equal(eng002.publiclyPublishable, false);
assert.equal(eng002.productionReleaseAuthorized, false);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  const result = await languageV1QuestionStudioAdapter.generate({ ...baseRequest, difficulty, count: 5, seed: `eng002:cp011:${difficulty}:adapter-test` });
  assert.equal(result.questions.length, 5);
  for (const question of result.questions) {
    assert.equal(question.cpId, "ENG-002-CP011");
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
    for (const option of (question.options as unknown[]).slice(0, 3)) {
      assert.equal(malformed.test(String(option)), false, `malformed CP011 option escaped into Question Studio: ${String(option)}`);
      assert.equal(barePassiveIf.test(String(option)), false, `bare passive CP011 option escaped into Question Studio: ${String(option)}`);
    }
  }
}

const filtered = await languageV1QuestionStudioAdapter.generate({ ...baseRequest, difficulty: "Easy", canonicalProblemId: "GR-CND-001", count: 3, seed: "eng002:cp011:rule-filter" });
assert.equal(filtered.questions.every((question) => question.ruleId === "GR-CND-001"), true);
await assert.rejects(languageV1QuestionStudioAdapter.generate({ ...baseRequest, language: "hi", count: 1 }), /English only/i);
await assert.rejects(languageV1QuestionStudioAdapter.generate({ ...baseRequest, runtimeMode: "production", count: 1 }), /review-only/i);

console.log("ENG-002 CP011 Question Studio review-only adapter tests passed.");
