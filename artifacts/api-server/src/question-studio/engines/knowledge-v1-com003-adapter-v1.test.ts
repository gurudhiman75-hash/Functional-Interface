import { strict as assert } from "node:assert";

import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../standard-lifecycle";
import { COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1 } from "./com003-review-only-activation-authority-v1";
import {
  COM003_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  knowledgeV1Com003QuestionStudioAdapterV1,
} from "./knowledge-v1-com003-adapter-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";

const pkg = COM003_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.packageId, "COM-003");
assert.equal(pkg.engineId, "knowledge-v1");
assert.equal(pkg.lifecycleId, lifecycle.lifecycleId);
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankStatus, "NOT_STORED");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.equal(pkg.cpIds.length, 4);
assert.equal((pkg.metadata?.permanentQlIds as string[]).length, 19);
assert.equal(pkg.metadata?.difficultyFilterSupported, false);
assert.deepEqual(pkg.metadata?.supportedDifficulties, []);
assert.equal(pkg.metadata?.difficultyClassifierVersion, null);
assert.equal(pkg.metadata?.registrationAuthorityId, COM003_REVIEW_ONLY_ACTIVATION_AUTHORITY_V1.authorityId);

const knowledgePackages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(knowledgePackages.filter((entry) => entry.packageId === "COM-003").length, 1);

for (const language of ["en", "hi", "pa"] as const) {
  const request = {
    packageId: "COM-003",
    language,
    count: 12,
    patternId: "COM-003-QL-015",
    seed: `com003-review-only-adapter:${language}`,
    runtimeMode: "review-only",
  } as const;
  const first = await knowledgeV1Com003QuestionStudioAdapterV1.generate(request);
  const replay = await knowledgeV1Com003QuestionStudioAdapterV1.generate(request);
  assert.deepEqual(first, replay, `${language} deterministic replay must be exact`);
  assert.equal(first.questions.length, 12);
  assert.equal(new Set(first.questions.map((question) => String(question.questionId))).size, 12);
  assert.equal(first.generationContext?.lifecycleId, lifecycle.lifecycleId);
  assert.equal(first.generationContext?.questionBankWritable, false);
  assert.equal(first.generationContext?.testEligible, false);
  assert.equal(first.generationContext?.publiclyPublishable, false);
  assert.equal(first.generationContext?.productionReleaseAuthorized, false);
  assert.equal(first.generationContext?.difficultyFilterApplied, false);
  assert.equal(first.generationContext?.difficultyClassifierVersion, null);
  for (const question of first.questions) {
    assert.equal(question.packageId, "COM-003");
    assert.equal(question.patternId, "COM-003-QL-015");
    assert.equal(question.language, language);
    assert.equal(question.lifecycleId, lifecycle.lifecycleId);
    assert.equal(question.lifecycleStage, undefined);
    assert.equal(question.questionBankStatus, "NOT_STORED");
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
    assert.equal(question.productionReleaseAuthorized, false);
    assert.equal(question.difficulty, undefined);
    assert.equal(question.difficultyLabel, undefined);
    assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  }
}

const mixed = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "en",
  count: 50,
  seed: "com003-review-only-mixed-50",
});
assert.equal(mixed.questions.length, 50);
assert.equal(new Set(mixed.questions.map((question) => String(question.questionId))).size, 50);

await assert.rejects(
  () => knowledgeV1Com003QuestionStudioAdapterV1.generate({
    packageId: "COM-003",
    language: "en",
    count: 13,
    patternId: "COM-003-QL-001",
    seed: "com003-no-repeat-overflow",
  }),
  /exceeds the 12-question frozen candidate pool/i,
);

for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
  await assert.rejects(
    () => knowledgeV1Com003QuestionStudioAdapterV1.generate({
      packageId: "COM-003",
      language: "en",
      count: 1,
      seed: `com003-difficulty-block:${difficulty}`,
      difficulty,
    }),
    /difficulty filtering is not authorized/i,
  );
}

const english = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "en",
  count: 12,
  patternId: "COM-003-QL-003",
  seed: "com003-language-parity",
});
const hindi = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "hi",
  count: 12,
  patternId: "COM-003-QL-003",
  seed: "com003-language-parity",
});
const punjabi = await knowledgeV1Com003QuestionStudioAdapterV1.generate({
  packageId: "COM-003",
  language: "pa",
  count: 12,
  patternId: "COM-003-QL-003",
  seed: "com003-language-parity",
});
assert.deepEqual(
  english.questions.map((q) => q.sourceQuestionId),
  hindi.questions.map((q) => q.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((q) => q.sourceQuestionId),
  punjabi.questions.map((q) => q.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((q) => q.correctIndex),
  hindi.questions.map((q) => q.correctIndex),
);
assert.deepEqual(
  english.questions.map((q) => q.correctIndex),
  punjabi.questions.map((q) => q.correctIndex),
);

console.log("[COM003-STANDARD-REVIEW-ONLY-ADAPTER-V1]", {
  valid: true,
  packageId: pkg.packageId,
  lifecycleId: pkg.lifecycleId,
  qlCount: (pkg.metadata?.permanentQlIds as string[]).length,
  cpCount: pkg.cpIds.length,
  languages: pkg.supportedLanguages,
  mixedBatchChecked: mixed.questions.length,
  bankWritable: pkg.questionBankWritable,
  testEligible: pkg.testEligible,
});
