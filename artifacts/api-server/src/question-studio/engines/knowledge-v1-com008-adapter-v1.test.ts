import assert from "node:assert/strict";
import { auditCom008FreezeV1 } from "../../knowledge-v1/computer-awareness/com008-data-representation-freeze-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  COM008_STANDARD_BANK_ONLY_PACKAGE_V1,
  knowledgeV1Com008QuestionStudioAdapterV1,
} from "./knowledge-v1-com008-adapter-v1";

const freezeAudit = auditCom008FreezeV1();
assert.equal(freezeAudit.valid, true, freezeAudit.issues.join(","));

const packages = knowledgeV1Com008QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length, 1);
assert.equal(packages[0]?.packageId, "COM-008");
assert.equal(packages[0]?.runtimeMode, "review-only");
assert.equal(packages[0]?.lifecycleStage, "BANK_ONLY");
assert.equal(packages[0]?.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(packages[0]?.questionBankWritable, true);
assert.equal(packages[0]?.questionBankAcceptanceMode, "BANK_ONLY");
assert.equal(packages[0]?.metadata?.reviewOnly, false);
assert.equal(packages[0]?.metadata?.humanReviewApproved, true);
assert.equal(packages[0]?.testEligible, false);
assert.equal(packages[0]?.mockTestEligible, false);
assert.equal(packages[0]?.publiclyPublishable, false);
assert.equal(packages[0]?.productionReleaseAuthorized, false);
assert.equal(COM008_STANDARD_BANK_ONLY_PACKAGE_V1.metadata?.englishQuestionCount, 32);
assert.equal(COM008_STANDARD_BANK_ONLY_PACKAGE_V1.metadata?.hindiQuestionCount, 32);
assert.equal(COM008_STANDARD_BANK_ONLY_PACKAGE_V1.metadata?.punjabiQuestionCount, 32);

const first = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  count: 8,
  seed: "com008-test",
});
assert.equal(first.questions.length, 8);
assert.equal(new Set(first.questions.map((q: any) => q.questionId)).size, 8);
assert.ok(first.questions.every((q: any) => q.packageId === "COM-008"));
assert.ok(first.questions.every((q: any) => q.difficulty === "Easy" || q.difficulty === "Medium"));
assert.ok(first.questions.every((q: any) => q.questionBankAcceptanceMode === "BANK_ONLY"));
assert.ok(first.questions.every((q: any) => q.questionBankWritable === true));
assert.ok(first.questions.every((q: any) => q.testEligible === false));
assert.ok(first.questions.every((q: any) => q.publiclyPublishable === false));
assert.ok(first.questions.every((q: any) => q.productionReleaseAuthorized === false));
assert.ok(first.questions.every((q: any) => q.questionStudioReview.humanReviewApproved === true));
assert.ok(first.questions.every((q: any) => q.questionStudioReview.registrationStatus === "REGISTERED_BANK_ONLY_INTERNAL"));

const replay = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  count: 8,
  seed: "com008-test",
});
assert.deepEqual(first.questions, replay.questions);

const hindi = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "hi",
  count: 32,
  seed: "com008-parity",
});
const punjabi = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "pa",
  count: 32,
  seed: "com008-parity",
});
const english = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  count: 32,
  seed: "com008-parity",
});
assert.deepEqual(
  english.questions.map((q: any) => q.sourceQuestionId),
  hindi.questions.map((q: any) => q.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((q: any) => q.sourceQuestionId),
  punjabi.questions.map((q: any) => q.sourceQuestionId),
);
assert.deepEqual(
  english.questions.map((q: any) => q.correctIndex),
  hindi.questions.map((q: any) => q.correctIndex),
);
assert.deepEqual(
  english.questions.map((q: any) => q.correctIndex),
  punjabi.questions.map((q: any) => q.correctIndex),
);
assert.ok(hindi.questions.every((q: any) => /[\u0900-\u097f]/.test(q.text)));
assert.ok(punjabi.questions.every((q: any) => /[\u0a00-\u0a7f]/.test(q.text)));

const easy = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  difficulty: "Easy",
  count: 4,
});
assert.ok(easy.questions.every((q: any) => q.difficulty === "Easy"));

const medium = await knowledgeV1Com008QuestionStudioAdapterV1.generate({
  packageId: "COM-008",
  language: "en",
  difficulty: "Medium",
  count: 4,
});
assert.ok(medium.questions.every((q: any) => q.difficulty === "Medium"));

await assert.rejects(
  () =>
    knowledgeV1Com008QuestionStudioAdapterV1.generate({
      packageId: "COM-008",
      language: "en",
      difficulty: "Hard",
      count: 1,
    }),
  /Hard difficulty is not authorized/,
);
await assert.rejects(
  () =>
    knowledgeV1Com008QuestionStudioAdapterV1.generate({
      packageId: "COM-008",
      language: "en",
      patternId: "COM-008-QL-001",
      count: 5,
    }),
  /without repeats/,
);

const routed = await knowledgeV1QuestionStudioAdapter.generate({
  packageId: "COM-008",
  language: "en",
  patternId: "COM-008-QL-001",
  count: 2,
  seed: "com008-route-v1",
});
assert.equal(routed.questions.length, 2);
assert.equal(routed.generationContext?.packageId, "COM-008");
assert.ok(routed.questions.every((q: any) => q.cpId === "COM-008-CP-001"));

console.log("COM-008 Question Studio BANK_ONLY adapter tests passed");
