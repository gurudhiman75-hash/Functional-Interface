import assert from "node:assert/strict";

import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import {
  PUN_001_QUESTION_STUDIO_CP_IDS_V1,
  PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  PUN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  isPun001QuestionStudioRequestV1,
  languageV1Pun001QuestionStudioAdapterV1,
} from "./language-v1-pun001-adapter-v1";

const pkg = PUN_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
assert.equal(pkg.engineId, "language-v1");
assert.equal(pkg.packageId, "PUN-001");
assert.equal(pkg.lifecycleStage, "REVIEW_ONLY");
assert.equal(pkg.questionBankWritable, false);
assert.equal(pkg.testEligible, false);
assert.equal(pkg.mockTestEligible, false);
assert.equal(pkg.publiclyPublishable, false);
assert.equal(pkg.automaticStudentPublication, false);
assert.equal(pkg.productionReleaseAuthorized, false);
assert.deepEqual(pkg.supportedLanguages, ["pa"]);
assert.deepEqual(pkg.supportedDifficulties, ["Easy", "Medium", "Hard"]);
assert.equal(pkg.cpIds.length, 14);
assert.deepEqual(pkg.cpIds, PUN_001_QUESTION_STUDIO_CP_IDS_V1);
const metadata = pkg.metadata as Record<string, unknown>;
assert.equal(metadata.approvedCombinedContentTip, "b1c416e0463dd16c4e388864ba75877e0c727934");
assert.equal(metadata.finalGapClosureMergeCommit, "b1c416e0463dd16c4e388864ba75877e0c727934");
assert.equal(metadata.finalClosureDate, "2026-09-24");
assert.equal(metadata.chapterFreezeStatus, "OWNER_APPROVED_REVIEW_ONLY");
assert.equal(metadata.atomicAuthorityCount, 3828);
assert.equal(metadata.questionFamilyCount, 133);
assert.equal(metadata.aggregateSemanticCapacity, 9755590464);

const compositePackage = languageV1QuestionStudioAdapter
  .listPackages()
  .find((candidate) => candidate.packageId === PUN_001_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(compositePackage, "language-v1 must expose PUN-001");
assert.equal(compositePackage?.enabled, true);

assert.equal(
  isPun001QuestionStudioRequestV1({
    packageId: "PUN-001",
    language: "pa",
  }),
  true,
);
assert.equal(
  isPun001QuestionStudioRequestV1({
    canonicalProblemId: "PUN-001-CP009-F01",
    language: "pa",
  }),
  true,
);
assert.equal(
  isPun001QuestionStudioRequestV1({
    packageId: "ENG-003",
    language: "en",
  }),
  false,
);

const explicitRequest = {
  packageId: "PUN-001",
  canonicalProblemId: "PUN-001-CP009-F01",
  language: "pa" as const,
  difficulty: "Easy" as const,
  runtimeMode: "review-only",
  count: 6,
  seed: "pun001-regression-explicit",
};
const explicitA = await languageV1Pun001QuestionStudioAdapterV1.generate(explicitRequest);
const explicitB = await languageV1QuestionStudioAdapter.generate(explicitRequest);
assert.deepEqual(explicitA, explicitB, "composite language-v1 routing must preserve PUN-001 output");
assert.deepEqual(
  await languageV1Pun001QuestionStudioAdapterV1.generate(explicitRequest),
  explicitA,
  "PUN-001 generation must replay deterministically",
);
assert.equal(explicitA.questions.length, 6);

for (const question of explicitA.questions) {
  assert.equal(question.packageId, "PUN-001");
  assert.equal(question.cpId, "PUN-001-CP009");
  assert.equal(question.familyId, "F01");
  assert.equal(question.language, "pa");
  assert.equal(question.locale, "pa-IN");
  assert.equal(question.script, "Guru");
  assert.equal(question.difficulty, "Easy");
  assert.equal(question.registrationStatus, "REGISTERED_REVIEW_ONLY");
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.productionReleased, false);
  assert.equal(question.permanentQlAllocation, "NOT_ALLOCATED");

  const options = question.options as unknown[];
  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, 4);
  assert.ok(Number.isInteger(question.correctIndex));
  assert.ok((question.correctIndex as number) >= 0);
  assert.ok((question.correctIndex as number) < options.length);
  assert.ok(String(question.stem ?? "").trim());
  assert.ok(String(question.explanation ?? "").trim());
}

const chapterRequest = {
  packageId: "PUN-001",
  language: "pa" as const,
  difficulty: "Mixed" as const,
  runtimeMode: "review-only",
  count: 14,
  seed: "pun001-regression-chapter",
};
const chapter = await languageV1QuestionStudioAdapter.generate(chapterRequest);
assert.equal(chapter.questions.length, 14);
assert.deepEqual(
  [...new Set(chapter.questions.map((question) => String(question.cpId)))].sort(),
  [...PUN_001_QUESTION_STUDIO_CP_IDS_V1].sort(),
  "a 14-question chapter rotation must touch every PUN-001 checkpoint exactly once",
);
assert.deepEqual(
  [...new Set(chapter.questions.map((question) => String(question.difficulty)))].sort(),
  ["Easy", "Hard", "Medium"],
);
for (const question of chapter.questions) {
  assert.equal(question.reviewOnly, true);
  assert.equal(question.questionBankWritable, false);
  assert.equal(question.testEligible, false);
  assert.equal(question.mockTestEligible, false);
  assert.equal(question.publiclyPublishable, false);
}

await assert.rejects(
  () =>
    languageV1Pun001QuestionStudioAdapterV1.generate({
      packageId: "PUN-001",
      language: "en",
      count: 1,
    }),
  /Punjabi \(pa\) learner text only/,
);

await assert.rejects(
  () =>
    languageV1Pun001QuestionStudioAdapterV1.generate({
      packageId: "PUN-001",
      canonicalProblemId: "PUN-001-CP009-F01",
      language: "pa",
      difficulty: "Hard",
      count: 1,
    }),
  /does not support Hard/,
);

await assert.rejects(
  () =>
    languageV1Pun001QuestionStudioAdapterV1.generate({
      packageId: "PUN-001",
      canonicalProblemId: "PUN-001-CP015",
      language: "pa",
      count: 1,
    }),
  /Unknown PUN-001 selector/,
);

console.log("PUN-001 Question Studio review-only integration V1 passed");
