import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1,
  GEO_RIV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isGeoRiv001QuestionStudioRequestV1,
  knowledgeV1GeoRiv001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-riv-001-adapter-v1";

const packageDef = GEO_RIV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
const expectedCpIds = Array.from(
  { length: 14 },
  (_, index) => `GEO-RIV-001-CP${String(index + 1).padStart(3, "0")}`,
);

assert.equal(packageDef.packageId, "GEO-RIV-001");
assert.equal(packageDef.subject, "Static GK");
assert.equal(packageDef.topic, "Indian Geography");
assert.equal(packageDef.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.deepEqual(packageDef.supportedLanguages, ["en"]);
assert.deepEqual(packageDef.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(packageDef.cpIds, expectedCpIds);
assert.equal(packageDef.metadata?.cpCount, 14);
assert.equal(packageDef.metadata?.qlCount, 127);
assert.equal(packageDef.metadata?.englishQuestionCount, 762);
assert.equal(packageDef.metadata?.masteryPermanentQlOwner, false);
assert.match(String(packageDef.metadata?.chapterCloseAuthorityId), /GEO-RIV-001-CHAPTER-CLOSE-V1/);
assert.match(String(packageDef.metadata?.masteryAuthorityId), /GEO-RIV-001-CP015-ENGLISH-FREEZE-V1/);

for (let cpNumber = 1; cpNumber <= 14; cpNumber += 1) {
  const token = `CP${String(cpNumber).padStart(3, "0")}-ENGLISH-FREEZE-V1`;
  assert.match(GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1, new RegExp(token));
}
assert.doesNotMatch(GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1, /CP015-ENGLISH-FREEZE-V1/);

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
  assert.match(String(question.registrationAuthorityId), /GEO-RIV-001-CP(?:00[1-9]|01[0-4])-ENGLISH-FREEZE-V1/);
}

for (let cpNumber = 1; cpNumber <= 14; cpNumber += 1) {
  const cpId = `GEO-RIV-001-CP${String(cpNumber).padStart(3, "0")}`;
  const result = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: cpId,
    count: 4,
    seed: `${cpId}-filter`,
  });
  assert.equal(result.questions.length, 4);
  assert.equal(result.questions.every((question) => question.cpId === cpId), true);
  assert.equal(
    result.questions.every((question) => question.registrationAuthorityId === `${cpId}-ENGLISH-FREEZE-V1`),
    true,
  );
}

for (const [qlId, cpId] of [
  ["GEO-RIV-001-QL-003", "GEO-RIV-001-CP001"],
  ["GEO-RIV-001-QL-013", "GEO-RIV-001-CP002"],
  ["GEO-RIV-001-QL-022", "GEO-RIV-001-CP003"],
  ["GEO-RIV-001-QL-031", "GEO-RIV-001-CP004"],
  ["GEO-RIV-001-QL-040", "GEO-RIV-001-CP005"],
  ["GEO-RIV-001-QL-049", "GEO-RIV-001-CP006"],
  ["GEO-RIV-001-QL-060", "GEO-RIV-001-CP007"],
  ["GEO-RIV-001-QL-068", "GEO-RIV-001-CP008"],
  ["GEO-RIV-001-QL-076", "GEO-RIV-001-CP009"],
  ["GEO-RIV-001-QL-086", "GEO-RIV-001-CP010"],
  ["GEO-RIV-001-QL-095", "GEO-RIV-001-CP011"],
  ["GEO-RIV-001-QL-103", "GEO-RIV-001-CP012"],
  ["GEO-RIV-001-QL-115", "GEO-RIV-001-CP013"],
  ["GEO-RIV-001-QL-124", "GEO-RIV-001-CP014"],
] as const) {
  const result = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    patternId: qlId,
    count: 2,
    seed: `${qlId}-filter`,
  });
  assert.equal(result.questions.every((question) => question.qlId === qlId), true);
  assert.equal(result.questions.every((question) => question.cpId === cpId), true);
}

await assert.rejects(
  knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "GEO-RIV-001-CP001",
    patternId: "GEO-RIV-001-QL-013",
  }),
  /Conflicting GEO-RIV-001 CP\/QL selectors/i,
);
await assert.rejects(
  knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "GEO-RIV-001-CP014",
    patternId: "GEO-RIV-001-QL-115",
  }),
  /Conflicting GEO-RIV-001 CP\/QL selectors/i,
);
await assert.rejects(
  knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "GEO-RIV-001-CP015",
  }),
  /Unknown GEO-RIV-001 selector/i,
);
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
