import assert from "node:assert/strict";

import {
  listEnabledReasoningV1QuestionStudioPackages,
  listReasoningV1QuestionStudioReviewPackages,
  persistReasoningV1QuestionStudioReview,
  previewReasoningV1QuestionStudioReview,
} from "../../../question-studio-review-registry";
import {
  generateQuestion as generateSharedQuestionStudioQuestion,
  listQuestionStudioPackages,
} from "../../../../question-studio/shared-generation-engine";
import {
  buildWor001QuestionStudioPayload,
  WOR_001_QUESTION_STUDIO_RELEASE_FREEZE,
} from "./question-studio-payload";

async function run() {
  const packages = listReasoningV1QuestionStudioReviewPackages();
  assert.ok(packages.some((entry) => entry.packageId === "WOR-001"), "WOR-001 is missing from the shared Reasoning V1 Question Studio registry.");

  const enabled = listEnabledReasoningV1QuestionStudioPackages();
  assert.ok(enabled.some((entry) => entry.packageId === "WOR-001"), "WOR-001 is not discoverable as a registered Question Studio review package.");

  const preview = previewReasoningV1QuestionStudioReview({
    packageId: "WOR-001",
    language: "en",
    prototypeId: "WOR-PROT-020",
    difficulty: "Easy",
    count: 1,
    seed: "shared-registry-contract",
  });

  assert.equal(preview.questions.length, 1);
  const question = preview.questions[0]!;
  assert.equal(question.packageId, "WOR-001");
  assert.equal(question.chapterId, "WOR-001");
  assert.equal(question.prototypeId, "WOR-PROT-020");
  assert.equal(question.permanentQlId, "WOR-QL-003");
  assert.equal(question.qlId, "WOR-QL-003");
  assert.equal(question.lifecycleStatus, "REVIEW_ONLY");
  assert.equal(question.questionStudioVisible, true);
  assert.equal(question.validation.valid, true);

  const payload = buildWor001QuestionStudioPayload(question);
  assert.equal(payload.canonicalProblemId, question.prototypeId, "Prototype identity must remain available for source-level regeneration traceability.");
  assert.equal(payload.checkpointId, question.checkpointId);
  assert.equal(payload.permanentQlId, "WOR-QL-003");
  assert.equal(payload.qlId, "WOR-QL-003");
  assert.equal(payload.permanentQlAllocationStatus, "ALLOCATED_INACTIVE");
  assert.equal(payload.humanContentReviewStatus, "PENDING");
  assert.equal(payload.nativeHumanSignoffStatus, "PENDING");
  assert.equal(payload.releaseFreezeStatus, WOR_001_QUESTION_STUDIO_RELEASE_FREEZE);
  assert.equal(payload.revisionPolicy, "SOURCE_GENERATOR_ONLY");
  assert.equal(payload.questionBankStatus, "NOT_STORED");
  assert.equal(payload.questionBankWritable, false);
  assert.equal(payload.testEligibility, "INELIGIBLE");
  assert.equal(payload.testEligible, false);
  assert.equal(payload.mockTestEligible, false);
  assert.equal(payload.publiclyPublishable, false);
  assert.equal(payload.automaticStudentPublication, false);

  assert.throws(
    () => persistReasoningV1QuestionStudioReview({
      packageId: "WOR-001",
      language: "en",
      prototypeId: "WOR-PROT-020",
      difficulty: "Easy",
      count: 1,
      seed: "shared-registry-contract",
    }),
    /authenticated shared Question Studio review-run route/,
    "Shared registry must not bypass the authenticated shared Question Studio persistence route.",
  );

  const cockpitPackages = listQuestionStudioPackages();
  const cockpitWor = cockpitPackages.find((entry: any) => entry.packageId === "WOR-001") as any;
  assert.ok(cockpitWor, "WOR-001 must be exposed through the normal Question Studio capabilities list.");
  assert.equal(cockpitWor.enabled, true);
  assert.deepEqual(cockpitWor.supportedLanguages, ["en", "hi", "pa"]);
  assert.equal(cockpitWor.permanentQlCount, 8);
  assert.equal(cockpitWor.permanentQlAllocationStatus, "ALLOCATED_INACTIVE");
  assert.equal(cockpitWor.questionBankStatus, "NOT_STORED");
  assert.equal(cockpitWor.testEligibility, "INELIGIBLE");
  assert.equal(cockpitWor.publiclyPublishable, false);

  const generated = await generateSharedQuestionStudioQuestion({
    packageId: "WOR-001",
    patternId: "WOR-PROT-020",
    difficulty: "Easy",
    language: "en",
    count: 1,
    seed: "shared-cockpit-contract",
  });
  assert.equal(generated.questions.length, 1);
  const generatedPayload = generated.questions[0] as Record<string, unknown>;
  assert.equal(generatedPayload.packageId, "WOR-001");
  assert.equal(generatedPayload.patternId, "WOR-PROT-020");
  assert.equal(generatedPayload.permanentQlId, "WOR-QL-003");
  assert.equal(generatedPayload.revisionPolicy, "SOURCE_GENERATOR_ONLY");
  assert.equal(generatedPayload.questionBankWritable, false);
  assert.equal(generatedPayload.testEligible, false);
  assert.equal(generatedPayload.publiclyPublishable, false);
  const generationContext = generated.generationContext as Record<string, unknown>;
  assert.equal(generationContext.generationDomain, "reasoning-v1");
  assert.equal(generationContext.permanentQlCount, 8);
  assert.equal(generationContext.permanentQlAllocationStatus, "ALLOCATED_INACTIVE");
  assert.equal(generationContext.releaseFreezeStatus, WOR_001_QUESTION_STUDIO_RELEASE_FREEZE);

  console.log("WOR-001 shared Question Studio contract passed.", {
    reasoningRegistryPackageCount: packages.length,
    cockpitPackageCount: cockpitPackages.length,
    prototypeId: question.prototypeId,
    permanentQlId: payload.permanentQlId,
    canonicalProblemId: payload.canonicalProblemId,
  });
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});