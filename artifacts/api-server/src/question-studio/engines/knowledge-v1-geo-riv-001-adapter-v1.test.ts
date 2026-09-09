import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isGeoRiv001QuestionStudioRequestV1,
  knowledgeV1GeoRiv001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-riv-001-adapter-v1";

const packageDef = GEO_RIV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.packageId, "GEO-RIV-001");
assert.equal(packageDef.subject, "Static GK");
assert.equal(packageDef.topic, "Indian Geography");
assert.equal(packageDef.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.deepEqual(packageDef.supportedLanguages, ["en"]);
assert.deepEqual(packageDef.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(packageDef.cpIds, ["GEO-RIV-001-CP001"]);

assert.equal(isGeoRiv001QuestionStudioRequestV1({ packageId: "GEO-RIV-001" }), true);
assert.equal(
  isGeoRiv001QuestionStudioRequestV1({
    subject: "Static GK",
    topic: "Indian Geography",
    subtopic: "Indian Rivers & Drainage System",
  }),
  true,
);
assert.equal(isGeoRiv001QuestionStudioRequestV1({ packageId: "COM-008" }), false);

const baseRequest = {
  packageId: "GEO-RIV-001",
  language: "en" as const,
  count: 5,
  seed: "geo-riv-001-question-studio-test",
};

const first = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate(baseRequest);
const replay = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate(baseRequest);
assert.equal(first.questions.length, 5);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((question) => question.questionId)).size, 5);
for (const question of first.questions) {
  assert.equal(question.packageId, "GEO-RIV-001");
  assert.equal(question.language, "en");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.authoringReviewApproved, true);
  assert.equal(question.runtimeRegistered, true);
  assert.equal(question.readOnly, true);
  assert.equal(question.productionReleased, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
}

const hard = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Hard",
  count: 3,
  seed: "geo-riv-001-hard-filter",
});
assert.equal(hard.questions.length, 3);
assert.equal(hard.questions.every((question) => question.difficulty === "Hard"), true);

const ql = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  patternId: "GEO-RIV-001-QL-003",
  count: 2,
  seed: "geo-riv-001-ql-filter",
});
assert.equal(ql.questions.length, 2);
assert.equal(ql.questions.every((question) => question.qlId === "GEO-RIV-001-QL-003"), true);

await assert.rejects(
  knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    language: "hi",
  }),
  /currently supports English only/i,
);
await assert.rejects(
  knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);
await assert.rejects(
  knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    patternId: "GEO-RIV-001-QL-999",
  }),
  /Unknown GEO-RIV-001 selector/i,
);
