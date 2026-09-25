import { strict as assert } from "node:assert";

import { auditGeoSoi001ChapterClosureV1 } from "../../knowledge-v1/indian-geography/soils/geo-soi-001-chapter-closure-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  GEO_SOI_001_CONTENT_AUTHORITY_VERSION_V1,
  GEO_SOI_001_QUESTION_STUDIO_CORPUS_V1,
  GEO_SOI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isGeoSoi001QuestionStudioRequestV1,
  knowledgeV1GeoSoi001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-soi-001-adapter-v1";

const audit = auditGeoSoi001ChapterClosureV1();
assert.equal(audit.valid, true);
assert.equal(audit.owningQuestionCount, 648);
assert.equal(audit.permanentQlCount, 108);
assert.deepEqual(audit.difficultyCounts, { Easy: 216, Medium: 360, Hard: 72 });
assert.deepEqual(audit.answerPositions, [162, 162, 162, 162]);

const packageDef = GEO_SOI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(packageDef.packageId, "GEO-SOI-001");
assert.equal(packageDef.subject, "Static GK");
assert.equal(packageDef.topic, "Indian Geography");
assert.equal(packageDef.subtopic, "Soils of India");
assert.equal(packageDef.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.deepEqual(packageDef.supportedLanguages, ["en"]);
assert.deepEqual(packageDef.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(packageDef.metadata?.cpCount, 12);
assert.equal(packageDef.metadata?.qlCount, 108);
assert.equal(packageDef.metadata?.englishQuestionCount, 648);
assert.equal(packageDef.metadata?.payloadsPerPermanentQl, 6);
assert.equal(packageDef.metadata?.exhaustiveMasterQuestionCount, 108);
assert.equal(GEO_SOI_001_CONTENT_AUTHORITY_VERSION_V1, "GEO-SOI-001-CONTENT-CLOSED-V1");

assert.equal(GEO_SOI_001_QUESTION_STUDIO_CORPUS_V1.length, 648);
const qlCounts = new Map<string, number>();
const cpCounts = new Map<string, number>();
for (const question of GEO_SOI_001_QUESTION_STUDIO_CORPUS_V1) {
  qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  cpCounts.set(question.cpId, (cpCounts.get(question.cpId) ?? 0) + 1);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
}
assert.equal(qlCounts.size, 108);
assert.equal(cpCounts.size, 12);
for (let ql = 1; ql <= 108; ql += 1) {
  assert.equal(qlCounts.get(`GEO-SOI-001-QL-${String(ql).padStart(3, "0")}`), 6);
}
for (let cp = 1; cp <= 12; cp += 1) {
  assert.equal(cpCounts.get(`GEO-SOI-001-CP${String(cp).padStart(3, "0")}`), 54);
}

assert.equal(isGeoSoi001QuestionStudioRequestV1({ packageId: "GEO-SOI-001" }), true);
assert.equal(
  isGeoSoi001QuestionStudioRequestV1({ subject: "Static GK", topic: "Indian Geography", subtopic: "Soils of India" }),
  true,
);
assert.equal(isGeoSoi001QuestionStudioRequestV1({ packageId: "GEO-RIV-001" }), false);

const packages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(packages.some((pkg) => pkg.packageId === "GEO-SOI-001"), true);
assert.equal(new Set(packages.map((pkg) => pkg.packageId)).size, packages.length);

const baseRequest = {
  packageId: "GEO-SOI-001",
  language: "en" as const,
  count: 12,
  seed: "geo-soi-001-question-studio-test",
};
const first = await knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate(baseRequest);
const replay = await knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate(baseRequest);
assert.deepEqual(first, replay);
assert.equal(first.questions.length, 12);
assert.equal(new Set(first.questions.map((q) => q.questionId)).size, 12);
assert.equal(first.questions.every((q) => q.registrationStatus === "REGISTERED_REVIEW_ONLY"), true);
assert.equal(first.questions.every((q) => q.runtimeRegistered === true), true);
assert.equal(first.questions.every((q) => q.readOnly === true), true);
assert.equal(first.questions.every((q) => q.productionReleased === false), true);

const composite = await knowledgeV1QuestionStudioAdapter.generate({ ...baseRequest, count: 6 });
assert.equal(composite.questions.length, 6);
assert.equal(composite.questions.every((q) => q.packageId === "GEO-SOI-001"), true);

const cpFiltered = await knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  canonicalProblemId: "GEO-SOI-001-CP012",
  count: 4,
});
assert.equal(cpFiltered.questions.every((q) => q.cpId === "GEO-SOI-001-CP012"), true);

const qlFiltered = await knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  patternId: "GEO-SOI-001-QL-108",
  count: 2,
});
assert.equal(qlFiltered.questions.every((q) => q.qlId === "GEO-SOI-001-QL-108"), true);
assert.equal(qlFiltered.questions.every((q) => q.cpId === "GEO-SOI-001-CP012"), true);

const hard = await knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Hard",
  count: 10,
});
assert.equal(hard.questions.every((q) => q.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate({ ...baseRequest, canonicalProblemId: "GEO-SOI-001-CP013" }),
  /Unknown GEO-SOI-001 selector/i,
);
await assert.rejects(
  knowledgeV1GeoSoi001QuestionStudioAdapterV1.generate({ ...baseRequest, language: "hi" }),
  /currently supports English only/i,
);
