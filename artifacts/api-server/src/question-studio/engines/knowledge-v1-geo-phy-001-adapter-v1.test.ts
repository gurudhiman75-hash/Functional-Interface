import { strict as assert } from "node:assert";

import { auditGeoPhy001ChapterClosureV1 } from "../../knowledge-v1/indian-geography/physiography/geo-phy-001-chapter-closure-v1";
import { knowledgeV1QuestionStudioAdapter } from "./knowledge-v1-adapter";
import {
  GEO_PHY_001_CHAPTER_CLOSE_AUTHORITY_ID_V1,
  GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1,
  GEO_PHY_001_MASTERY_AUTHORITY_ID_V1,
  GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1,
  GEO_PHY_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isGeoPhy001QuestionStudioRequestV1,
  knowledgeV1GeoPhy001QuestionStudioAdapterV1,
} from "./knowledge-v1-geo-phy-001-adapter-v1";

const closure = auditGeoPhy001ChapterClosureV1();
assert.equal(closure.valid, true);
assert.equal(closure.readiness, "EXHAUSTIVE_AND_READY_TO_CLOSE");
assert.equal(closure.owningQuestionCount, 648);
assert.equal(closure.permanentQlCount, 108);
assert.equal(closure.payloadsPerPermanentQl, 6);

const packageDef = GEO_PHY_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
const expectedCpIds = Array.from(
  { length: 12 },
  (_, index) => `GEO-PHY-001-CP${String(index + 1).padStart(3, "0")}`,
);

assert.equal(packageDef.packageId, "GEO-PHY-001");
assert.equal(packageDef.subject, "Static GK");
assert.equal(packageDef.topic, "Indian Geography");
assert.equal(packageDef.subtopic, "Indian Physiography & Physical Divisions");
assert.equal(packageDef.lifecycleStage, "REVIEW_ONLY");
assert.equal(packageDef.questionBankWritable, false);
assert.equal(packageDef.testEligible, false);
assert.equal(packageDef.mockTestEligible, false);
assert.equal(packageDef.publiclyPublishable, false);
assert.equal(packageDef.productionReleaseAuthorized, false);
assert.deepEqual(packageDef.supportedLanguages, ["en"]);
assert.deepEqual(packageDef.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.deepEqual(packageDef.cpIds, expectedCpIds);
assert.equal(packageDef.metadata?.cpCount, 12);
assert.equal(packageDef.metadata?.qlCount, 108);
assert.equal(packageDef.metadata?.englishQuestionCount, 648);
assert.equal(packageDef.metadata?.payloadsPerPermanentQl, 6);
assert.equal(packageDef.metadata?.exhaustiveMasterQuestionCount, 108);
assert.equal(packageDef.metadata?.masteryPermanentQlOwner, false);
assert.equal(packageDef.metadata?.learnerLanguageNormalized, true);
assert.equal(packageDef.metadata?.chapterCloseAuthorityId, GEO_PHY_001_CHAPTER_CLOSE_AUTHORITY_ID_V1);
assert.equal(packageDef.metadata?.masteryAuthorityId, GEO_PHY_001_MASTERY_AUTHORITY_ID_V1);
assert.equal(GEO_PHY_001_CONTENT_AUTHORITY_VERSION_V1, "GEO-PHY-001-CONTENT-CLOSED-V1");

assert.equal(GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1.length, 648);
const qlCounts = new Map<string, number>();
const cpCounts = new Map<string, number>();
const heavyLearnerWording = /physiographic|physical division|geologically|correctly classified|incorrectly classified|structurally fold|alluvial depositional|depositional surface|structural continuity|relief contrast|offshore island|major major|is old stable plateau|is dry sandy region|is river-built plain/i;
const internalLearnerWording = /\bNCERT\b|sourceFact|review-only|runtimeRegistered|generator|qualification gate|provenance|administrative dataset/i;

for (const question of GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1) {
  qlCounts.set(question.qlId, (qlCounts.get(question.qlId) ?? 0) + 1);
  cpCounts.set(question.cpId, (cpCounts.get(question.cpId) ?? 0) + 1);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(question.options[question.correctIndex], question.canonicalAnswer);
  assert.ok(question.sourceIds.length > 0);
  assert.ok(question.sourceFactIds.length > 0);
  const learner = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
  assert.doesNotMatch(learner, heavyLearnerWording);
  assert.doesNotMatch(learner, internalLearnerWording);
}

assert.equal(qlCounts.size, 108);
assert.equal(cpCounts.size, 12);
for (let ql = 1; ql <= 108; ql += 1) {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  assert.equal(qlCounts.get(qlId), 6, `${qlId} should expose six Question Studio payloads`);
}
for (const cpId of expectedCpIds) {
  assert.equal(cpCounts.get(cpId), 54, `${cpId} should expose 54 Question Studio questions`);
}

assert.equal(isGeoPhy001QuestionStudioRequestV1({ packageId: "GEO-PHY-001" }), true);
assert.equal(
  isGeoPhy001QuestionStudioRequestV1({
    subject: "Static GK",
    topic: "Indian Geography",
    subtopic: "Indian Physiography & Physical Divisions",
  }),
  true,
);
assert.equal(isGeoPhy001QuestionStudioRequestV1({ packageId: "GEO-RIV-001" }), false);

const compositePackages = knowledgeV1QuestionStudioAdapter.listPackages();
assert.equal(compositePackages.some((pkg) => pkg.packageId === "GEO-PHY-001"), true);
assert.equal(new Set(compositePackages.map((pkg) => pkg.packageId)).size, compositePackages.length);

const baseRequest = {
  packageId: "GEO-PHY-001",
  language: "en" as const,
  count: 12,
  seed: "geo-phy-001-question-studio-close-test",
};

const first = await knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate(baseRequest);
const replay = await knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate(baseRequest);
assert.equal(first.questions.length, 12);
assert.deepEqual(first, replay);
assert.equal(new Set(first.questions.map((question) => question.questionId)).size, 12);
for (const question of first.questions) {
  assert.equal(question.packageId, "GEO-PHY-001");
  assert.equal(question.language, "en");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.authoringReviewApproved, true);
  assert.equal(question.runtimeRegistered, true);
  assert.equal(question.readOnly, true);
  assert.equal(question.productionReleased, false);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.match(String(question.registrationAuthorityId), /GEO-PHY-001-CP(?:00[1-9]|01[0-2])-CLOSED-REVIEW-V1/);
}

const compositeResult = await knowledgeV1QuestionStudioAdapter.generate({
  ...baseRequest,
  count: 6,
  seed: "geo-phy-composite-route-test",
});
assert.equal(compositeResult.questions.length, 6);
assert.equal(compositeResult.questions.every((question) => question.packageId === "GEO-PHY-001"), true);

for (let cpNumber = 1; cpNumber <= 12; cpNumber += 1) {
  const cpId = `GEO-PHY-001-CP${String(cpNumber).padStart(3, "0")}`;
  const result = await knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: cpId,
    count: 4,
    seed: `${cpId}-filter`,
  });
  assert.equal(result.questions.length, 4);
  assert.equal(result.questions.every((question) => question.cpId === cpId), true);
  assert.equal(
    result.questions.every((question) => question.registrationAuthorityId === `${cpId}-CLOSED-REVIEW-V1`),
    true,
  );
}

for (let ql = 1; ql <= 108; ql += 1) {
  const qlId = `GEO-PHY-001-QL-${String(ql).padStart(3, "0")}`;
  const cpNumber = Math.floor((ql - 1) / 9) + 1;
  const cpId = `GEO-PHY-001-CP${String(cpNumber).padStart(3, "0")}`;
  const result = await knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    patternId: qlId,
    count: 2,
    seed: `${qlId}-filter`,
  });
  assert.equal(result.questions.length, 2);
  assert.equal(result.questions.every((question) => question.qlId === qlId), true);
  assert.equal(result.questions.every((question) => question.cpId === cpId), true);
}

const hard = await knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
  ...baseRequest,
  difficulty: "Hard",
  count: 10,
  seed: "hard-filter",
});
assert.equal(hard.questions.every((question) => question.difficulty === "Hard"), true);

await assert.rejects(
  knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "GEO-PHY-001-CP001",
    patternId: "GEO-PHY-001-QL-010",
  }),
  /Conflicting GEO-PHY-001 CP\/QL selectors/i,
);
await assert.rejects(
  knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    canonicalProblemId: "GEO-PHY-001-CP013",
  }),
  /Unknown GEO-PHY-001 selector/i,
);
await assert.rejects(
  knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    language: "hi",
  }),
  /currently supports English only/i,
);
await assert.rejects(
  knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    runtimeMode: "bank-only",
  }),
  /only supports review-only runtime/i,
);
await assert.rejects(
  knowledgeV1GeoPhy001QuestionStudioAdapterV1.generate({
    ...baseRequest,
    patternId: "GEO-PHY-001-QL-109",
  }),
  /Unknown GEO-PHY-001 selector/i,
);
