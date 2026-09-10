import { strict as assert } from "node:assert";

import {
  GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1,
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
assert.deepEqual(packageDef.cpIds, ["GEO-RIV-001-CP001", "GEO-RIV-001-CP002", "GEO-RIV-001-CP003"]);
assert.equal(packageDef.metadata?.cpCount, 3);
assert.equal(packageDef.metadata?.qlCount, 27);
assert.equal(packageDef.metadata?.englishQuestionCount, 162);
assert.match(GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1, /CP001-ENGLISH-FREEZE-V1/);
assert.match(GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1, /CP002-ENGLISH-FREEZE-V1/);
assert.match(GEO_RIV_001_CONTENT_AUTHORITY_VERSION_V1, /CP003-ENGLISH-FREEZE-V1/);

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
  assert.match(String(question.registrationAuthorityId), /GEO-RIV-001-CP00[123]-ENGLISH-FREEZE-V1/);
}

const cp001 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  canonicalProblemId: "GEO-RIV-001-CP001",
  count: 4,
  seed: "geo-riv-001-cp001-filter",
});
assert.equal(cp001.questions.every((question) => question.cpId === "GEO-RIV-001-CP001"), true);
assert.equal(cp001.questions.every((question) => question.registrationAuthorityId === "GEO-RIV-001-CP001-ENGLISH-FREEZE-V1"), true);

const cp002 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  canonicalProblemId: "GEO-RIV-001-CP002",
  count: 4,
  seed: "geo-riv-001-cp002-filter",
});
assert.equal(cp002.questions.every((question) => question.cpId === "GEO-RIV-001-CP002"), true);
assert.equal(cp002.questions.every((question) => question.registrationAuthorityId === "GEO-RIV-001-CP002-ENGLISH-FREEZE-V1"), true);

const cp003 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  canonicalProblemId: "GEO-RIV-001-CP003",
  count: 4,
  seed: "geo-riv-001-cp003-filter",
});
assert.equal(cp003.questions.every((question) => question.cpId === "GEO-RIV-001-CP003"), true);
assert.equal(cp003.questions.every((question) => question.registrationAuthorityId === "GEO-RIV-001-CP003-ENGLISH-FREEZE-V1"), true);

const hardCp002 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  canonicalProblemId: "GEO-RIV-001-CP002",
  difficulty: "Hard",
  count: 3,
  seed: "geo-riv-001-cp002-hard-filter",
});
assert.equal(hardCp002.questions.length, 3);
assert.equal(hardCp002.questions.every((question) => question.cpId === "GEO-RIV-001-CP002"), true);
assert.equal(hardCp002.questions.every((question) => question.difficulty === "Hard"), true);

const hardCp003 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  canonicalProblemId: "GEO-RIV-001-CP003",
  difficulty: "Hard",
  count: 3,
  seed: "geo-riv-001-cp003-hard-filter",
});
assert.equal(hardCp003.questions.length, 3);
assert.equal(hardCp003.questions.every((question) => question.cpId === "GEO-RIV-001-CP003"), true);
assert.equal(hardCp003.questions.every((question) => question.difficulty === "Hard"), true);

const qlCp001 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  patternId: "GEO-RIV-001-QL-003",
  count: 2,
  seed: "geo-riv-001-ql003-filter",
});
assert.equal(qlCp001.questions.every((question) => question.qlId === "GEO-RIV-001-QL-003"), true);
assert.equal(qlCp001.questions.every((question) => question.cpId === "GEO-RIV-001-CP001"), true);

const qlCp002 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  patternId: "GEO-RIV-001-QL-013",
  count: 2,
  seed: "geo-riv-001-ql013-filter",
});
assert.equal(qlCp002.questions.every((question) => question.qlId === "GEO-RIV-001-QL-013"), true);
assert.equal(qlCp002.questions.every((question) => question.cpId === "GEO-RIV-001-CP002"), true);

const qlCp003 = await knowledgeV1GeoRiv001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  patternId: "GEO-RIV-001-QL-022",
  count: 2,
  seed: "geo-riv-001-ql022-filter",
});
assert.equal(qlCp003.questions.every((question) => question.qlId === "GEO-RIV-001-QL-022"), true);
assert.equal(qlCp003.questions.every((question) => question.cpId === "GEO-RIV-001-CP003"), true);

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
    canonicalProblemId: "GEO-RIV-001-CP002",
    patternId: "GEO-RIV-001-QL-022",
  }),
  /Conflicting GEO-RIV-001 CP\/QL selectors/i,
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
