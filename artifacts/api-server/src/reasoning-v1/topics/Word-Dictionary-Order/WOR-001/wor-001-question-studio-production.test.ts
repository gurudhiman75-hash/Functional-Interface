import assert from "node:assert/strict";

import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine";
import {
  WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS,
  WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS,
  WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS,
  WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES,
  WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS,
  WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS,
  isWor001ProductionQuestionStudioPrototype,
} from "./question-studio-production-authority";
import { WOR_001_QUESTION_STUDIO_RELEASE_FREEZE } from "./question-studio-payload";

async function run() {
  const productionIds = WOR_001_QUESTION_STUDIO_PRODUCTION_PROTOTYPES.map((entry) => entry.prototypeId);
  const deferredIds = [...WOR_001_QUESTION_STUDIO_SOURCE_DEFERRED_PROTOTYPE_IDS];

  assert.equal(productionIds.length, 15);
  assert.equal(new Set(productionIds).size, 15);
  assert.equal(deferredIds.length, 9);
  assert.ok(productionIds.every(isWor001ProductionQuestionStudioPrototype));
  assert.ok(deferredIds.every((id) => !isWor001ProductionQuestionStudioPrototype(id)));
  assert.equal(WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS.length, 4);
  assert.ok(!WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS.some((entry) => entry.checkpointId === "WOR-CP-003"));

  const packages = listQuestionStudioPackages();
  const wor = packages.find((entry: any) => entry.packageId === "WOR-001") as any;
  assert.ok(wor, "Frozen WOR-001 package must be discoverable in Question Studio capabilities.");
  assert.equal(wor.enabled, true);
  assert.equal(wor.subject, "Reasoning Ability");
  assert.equal(wor.prototypeCount, 15);
  assert.equal(wor.sourceDeferredPrototypeCount, 9);
  assert.equal(wor.examReadinessStatus, WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS);
  assert.equal(wor.englishContentReviewStatus, WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS);
  assert.equal(wor.reviewStatus, WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS);
  assert.equal(wor.releaseFreezeStatus, WOR_001_QUESTION_STUDIO_RELEASE_FREEZE);
  assert.ok(!wor.cpIds.includes("WOR-CP-003"));
  assert.equal(wor.questionBankWritable, false);
  assert.equal(wor.publiclyPublishable, false);

  const fullBatch = await generateSharedQuestionStudioQuestion({
    packageId: "WOR-001",
    language: "en",
    count: 15,
    seed: "wor-production-boundary-all-candidates",
  });
  const generatedIds = (fullBatch.questionPackages as Array<{ prototypeId: string; permanentQlId: string | null }>);
  assert.equal(generatedIds.length, 15);
  assert.deepEqual(
    new Set(generatedIds.map((entry) => entry.prototypeId)),
    new Set(productionIds),
    "A full frozen WOR Question Studio batch must traverse the 15 production candidates only.",
  );
  assert.ok(generatedIds.every((entry) => entry.permanentQlId !== null));
  assert.ok(generatedIds.every((entry) => !deferredIds.includes(entry.prototypeId as any)));

  const generationContext = fullBatch.generationContext as Record<string, unknown>;
  assert.equal(generationContext.reviewStatus, WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS);
  assert.equal(generationContext.examReadinessStatus, WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS);
  assert.equal(generationContext.englishContentReviewStatus, WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS);
  assert.equal(generationContext.productionPrototypeCount, 15);
  assert.equal(generationContext.sourceDeferredPrototypeCount, 9);
  assert.equal(generationContext.releaseFreezeStatus, WOR_001_QUESTION_STUDIO_RELEASE_FREEZE);
  assert.equal(generationContext.questionBankWritable, false);
  assert.equal(generationContext.testEligible, false);
  assert.equal(generationContext.mockTestEligible, false);
  assert.equal(generationContext.publiclyPublishable, false);

  await assert.rejects(
    () => generateSharedQuestionStudioQuestion({
      packageId: "WOR-001",
      patternId: "WOR-PROT-010",
      language: "en",
      count: 1,
      seed: "research-prototype-must-not-enter-production",
    }),
    /source\/research-only/,
  );

  await assert.rejects(
    () => generateSharedQuestionStudioQuestion({
      packageId: "WOR-001",
      cpId: "WOR-CP-003",
      language: "en",
      count: 1,
      seed: "research-checkpoint-must-not-enter-production",
    }),
    /no frozen release-candidate/,
  );

  for (const language of ["en", "hi", "pa"] as const) {
    const generated = await generateSharedQuestionStudioQuestion({
      packageId: "WOR-001",
      patternId: "WOR-PROT-020",
      difficulty: "Easy",
      language,
      count: 1,
      seed: `production-locale-${language}`,
    });
    const payload = generated.questions[0] as Record<string, unknown>;
    assert.equal(payload.permanentQlId, "WOR-QL-003");
    assert.equal(payload.examReadinessStatus, WOR_001_QUESTION_STUDIO_EXAM_READINESS_STATUS);
    assert.equal(payload.englishContentReviewStatus, WOR_001_QUESTION_STUDIO_ENGLISH_REVIEW_STATUS);
    assert.equal(payload.reviewStatus, WOR_001_QUESTION_STUDIO_PRODUCTION_REVIEW_STATUS);
    assert.equal(payload.revisionPolicy, "SOURCE_GENERATOR_ONLY");
    assert.equal(payload.questionBankWritable, false);
    assert.equal(payload.testEligible, false);
    assert.equal(payload.mockTestEligible, false);
    assert.equal(payload.publiclyPublishable, false);
  }

  console.log("WOR-001 frozen production Question Studio plug audit passed.", {
    productionPrototypeCount: productionIds.length,
    sourceDeferredPrototypeCount: deferredIds.length,
    productionCheckpointIds: WOR_001_QUESTION_STUDIO_PRODUCTION_CHECKPOINTS.map((entry) => entry.checkpointId),
    releaseFreeze: WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
  });
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
