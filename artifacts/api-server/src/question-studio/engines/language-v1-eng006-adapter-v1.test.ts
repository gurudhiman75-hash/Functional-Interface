import assert from "node:assert/strict";
import { ENG006_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/one-word-substitution/ENG-006/eng-006-human-approval-v1";
import {
  ENG006_CP_IDS_V1,
  ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
  languageV1Eng006QuestionStudioAdapterV1,
} from "./language-v1-eng006-adapter-v1";

const packages = languageV1Eng006QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length, 1);
const pkg = packages[0]!;
assert.equal(pkg.packageId, ENG006_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.deepEqual(pkg.cpIds, [...ENG006_CP_IDS_V1]);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal((pkg.metadata as any).uniqueSubstitutions, 1400);

for (const cp of ENG006_CP_IDS_V1) {
  const result = await languageV1Eng006QuestionStudioAdapterV1.generate({
    packageId: ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
    patternId: cp,
    difficulty: "Medium",
    count: 3,
    language: "en",
    seed: `adapter:${cp}`,
  });
  assert.equal(result.questions.length, 3);
  for (const question of result.questions) {
    assert.equal(question.cpId, cp);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.productionReleased, false);
    assert.equal(question.registrationAuthorityId, ENG006_HUMAN_EDITORIAL_APPROVAL_V1.authorityId);
    assert.equal((question.options as unknown[]).length, 4);
    assert.ok(typeof question.explanation === "string" && question.explanation.length >= 20);
  }
}

const mixed = await languageV1Eng006QuestionStudioAdapterV1.generate({
  packageId: ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
  difficulty: "Mixed",
  count: 20,
  seed: "eng006-mixed",
});
assert.equal(mixed.questions.length, 20);
assert.ok(new Set(mixed.questions.map((question) => question.cpId)).size >= 4);

await assert.rejects(
  () => languageV1Eng006QuestionStudioAdapterV1.generate({
    packageId: ENG006_QUESTION_STUDIO_PACKAGE_ID_V1,
    runtimeMode: "bank-only",
    count: 1,
  }),
  /review-only/,
);

console.log("ENG-006 Question Studio review-only adapter validation passed.");
