import assert from "node:assert/strict";
import { ENG005_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/idioms-phrases/ENG-005/eng-005-human-approval-v1";
import {
  ENG005_CP_IDS_V1,
  ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
  languageV1Eng005QuestionStudioAdapterV1,
} from "./language-v1-eng005-adapter-v1";

const packages = languageV1Eng005QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length, 1);
const pkg = packages[0]!;
assert.equal(pkg.packageId, ENG005_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.deepEqual(pkg.cpIds, [...ENG005_CP_IDS_V1]);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal((pkg.metadata as any).uniqueExpressions, 840);
assert.equal((pkg.metadata as any).cp004ContextTemplatesRuntimeAuthorized, false);

for (const cp of ENG005_CP_IDS_V1) {
  for (const mode of ["idiom-to-meaning", "meaning-to-idiom"] as const) {
    const result = await languageV1Eng005QuestionStudioAdapterV1.generate({
      packageId: ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: cp,
      subtopic: mode,
      difficulty: "Medium",
      count: 3,
      language: "en",
      seed: `adapter:${cp}:${mode}`,
    });
    assert.equal(result.questions.length, 3);
    for (const question of result.questions) {
      assert.equal(question.cpId, cp);
      assert.equal(question.reviewOnly, true);
      assert.equal(question.questionBankWritable, false);
      assert.equal(question.productionReleased, false);
      assert.equal(question.registrationAuthorityId, ENG005_HUMAN_EDITORIAL_APPROVAL_V1.authorityId);
      assert.equal(question.mode, mode);
      assert.equal((question.options as unknown[]).length, 4);
      assert.equal(question.cp004ContextTemplatesRuntimeAuthorized, false);
      assert.ok(!("context" in question));
    }
  }
}

const mixed = await languageV1Eng005QuestionStudioAdapterV1.generate({
  packageId: ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
  difficulty: "Mixed",
  count: 20,
  seed: "eng005-mixed",
});
assert.equal(mixed.questions.length, 20);
assert.ok(new Set(mixed.questions.map((question) => question.cpId)).size >= 3);

await assert.rejects(
  () => languageV1Eng005QuestionStudioAdapterV1.generate({
    packageId: ENG005_QUESTION_STUDIO_PACKAGE_ID_V1,
    runtimeMode: "bank-only",
    count: 1,
  }),
  /review-only/,
);

console.log("ENG-005 Question Studio review-only adapter validation passed.");
