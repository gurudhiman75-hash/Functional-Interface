import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  SER_001_PACKAGE_ID,
  SER_001_QUESTION_STUDIO_DIFFICULTIES,
  SER_001_QUESTION_STUDIO_LANGUAGES,
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewSer001QuestionStudioReview,
  type Ser001QuestionStudioDifficulty,
  type Ser001QuestionStudioLanguage,
} from "../reasoning-v1/topics/Series/SER-001/SER-CP-007-QUESTION-STUDIO-INTEGRATION/question-studio-review-adapter";
import { SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1 } from "../reasoning-v1/topics/Series/SER-001/SER-CP-007-QUESTION-STUDIO-INTEGRATION/ser-001-internal-test-builder-activation-v1";
import {
  SER_CP007_PERMANENT_QL_IDS,
  type SerCp007PermanentQlId,
} from "../reasoning-v1/topics/Series/SER-001/SER-PERMANENT-QL-REGISTRY";

const router = Router();
const LANGUAGES = new Set<string>(SER_001_QUESTION_STUDIO_LANGUAGES);
const DIFFICULTIES = new Set<string>(SER_001_QUESTION_STUDIO_DIFFICULTIES);
const QL_IDS = new Set<string>(SER_CP007_PERMANENT_QL_IDS);
const ACTIVATION = SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1;
const RUN_MODEL = "reasoning-v1-ser-001-test-builder-v1" as const;
const LEGACY_REVIEW_MODEL = "reasoning-v1-ser-001" as const;

type SeriesPreviewResult = ReturnType<typeof previewSer001QuestionStudioReview>;
type SeriesPreviewQuestion = SeriesPreviewResult["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `SER-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: SeriesPreviewQuestion) {
  return [
    ...question.explanation.steps,
    question.explanation.conclusion ? `Conclusion: ${question.explanation.conclusion}` : "",
  ].filter(Boolean).join("\n");
}

export function ser001InternalQuestionBankPayloadV1(question: SeriesPreviewQuestion) {
  return {
    text: question.stem,
    stem: question.stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: explanationText(question),
    richExplanation: question.explanation,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId: SER_001_PACKAGE_ID,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Reasoning",
    subtopic: "Series",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    runtimeMode: question.runtimeMode,
    reviewStatus: question.reviewStatus,
    questionBankStatus: ACTIVATION.questionBankStatus,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: ACTIVATION.authorityId,
    testReleaseAuthority: ACTIVATION.authorityId,
    testEligibility: ACTIVATION.testEligibility,
    testEligible: true as const,
    testBuilderEligible: true as const,
    mockTestEligible: false as const,
    publiclyPublishable: true as const,
    publicReleaseAuthorized: false as const,
    studentDeliveryAuthorized: false as const,
    manualApprovalRequired: true as const,
    manualQuestionPublicationRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: ACTIVATION.authorityId,
    sourceReviewAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: SER_001_PACKAGE_ID,
      canonicalProblemId: "SER-CP-007" as const,
      permanentQlId: question.qlId,
      language: question.language,
      locale: question.locale,
      runtimeMode: question.runtimeMode,
      reviewStatus: question.reviewStatus,
      integrationAuthority: ACTIVATION.authorityId,
      sourceReviewAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
      questionBankStatus: ACTIVATION.questionBankStatus,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      questionBankAcceptanceAuthority: ACTIVATION.authorityId,
      testReleaseAuthority: ACTIVATION.authorityId,
      testEligibility: ACTIVATION.testEligibility,
      testEligible: true as const,
      testBuilderEligible: true as const,
      mockTestEligible: false as const,
      publiclyPublishable: true as const,
      publicReleaseAuthorized: false as const,
      studentDeliveryAuthorized: false as const,
      persistenceAllowed: true as const,
      reviewOnly: false as const,
      manualApprovalRequired: true as const,
      manualQuestionPublicationRequired: true as const,
      automaticStudentPublication: false as const,
    },
  } as const;
}

async function persistRun(
  questions: readonly SeriesPreviewQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (questions.length === 0) throw new Error("No SER-001 questions matched the request.");
  const runId = randomUUID();
  const publicCode = publicRunCode();
  const timestamp = new Date().toISOString();

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot,
        provider, model, prompt_tokens, completion_tokens, estimated_cost_paise,
        actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${publicCode}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}::jsonb, ${JSON.stringify(requestSnapshot)}::jsonb,
        'examtree', ${RUN_MODEL}, 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = ser001InternalQuestionBankPayloadV1(question);
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1,
          ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb,
          ${question.questionLanguageId}, ${timestamp}
        )
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id,
        reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.series_internal_run.created', 'generation_run', ${runId}::uuid,
        'SER-001 entered manual review with Question Bank and internal Test Builder eligibility enabled',
        ${`Created ${questions.length} SER-001 internal review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, activationAuthority: ACTIVATION.authorityId })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.series_internal_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId: SER_001_PACKAGE_ID,
          activationAuthority: ACTIVATION.authorityId, testBuilderEligible: true, mockTestEligible: false })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

function filters(source: Record<string, unknown>, max = 50) {
  const language = (asString(source.language) || "en") as Ser001QuestionStudioLanguage;
  const difficulty = asString(source.difficulty);
  const qlId = asString(source.qlId);
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported QL '${qlId}'.`);
  return {
    language,
    difficulty: difficulty ? difficulty as Ser001QuestionStudioDifficulty : undefined,
    qlId: qlId ? qlId as SerCp007PermanentQlId : undefined,
    count: asCount(source.count, 5, max),
    seed: asString(source.seed) || undefined,
  };
}

router.use(authenticate);

router.get("/reasoning/series/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "reasoning-v1",
    activationMode: ACTIVATION.status,
    package: {
      ...SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
      name: "SER-001 Series — Internal Question Studio + Test Builder",
      label: "Series — 140 Frozen Templates",
      reviewOnly: false,
      questionBankStatus: ACTIVATION.questionBankStatus,
      questionBankWritable: true,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      testEligibility: ACTIVATION.testEligibility,
      testEligible: true,
      testBuilderEligible: true,
      mockTestEligible: false,
      publiclyPublishable: true,
      publicReleaseAuthorized: false,
      studentDeliveryAuthorized: false,
      automaticStudentPublication: false,
      integrationAuthority: ACTIVATION.authorityId,
    },
    maxBatchSize: 50,
    permanentQlCount: SER_CP007_PERMANENT_QL_IDS.length,
    frozenTemplateCount: ACTIVATION.frozenTemplateCount,
    multilingualProofPayloadCount: ACTIVATION.multilingualFrozenPayloadCount,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    questionBankWriteEnabled: true,
    questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
    testEligible: true,
    testBuilderEligible: true,
    mockTestEligible: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
  });
});

router.get("/reasoning/series/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const input = filters(req.query as Record<string, unknown>, 20);
    const result = previewSer001QuestionStudioReview(input);
    res.json({
      ...result,
      activationAuthority: ACTIVATION.authorityId,
      productionEligible: true,
      reviewOnly: false,
      questionBankWritable: true,
      testEligible: true,
      testBuilderEligible: true,
      mockTestEligible: false,
      publicReleaseAuthorized: false,
      studentDeliveryAuthorized: false,
    });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Series questions." });
  }
});

router.post("/reasoning/series/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }
  try {
    const input = filters((req.body ?? {}) as Record<string, unknown>, 50);
    const result = previewSer001QuestionStudioReview(input);
    const persisted = await persistRun(result.questions, {
      packageId: SER_001_PACKAGE_ID,
      language: input.language,
      difficulty: input.difficulty ?? null,
      qlId: input.qlId ?? null,
      count: input.count,
      seed: input.seed ?? null,
      activationAuthority: ACTIVATION.authorityId,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      questionBankWritable: true,
      testEligible: true,
      testBuilderEligible: true,
      mockTestEligible: false,
      publicReleaseAuthorized: false,
      studentDeliveryAuthorized: false,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);
    res.status(201).json({
      ...persisted,
      generationSystem: "reasoning-v1",
      packageId: SER_001_PACKAGE_ID,
      activationAuthority: ACTIVATION.authorityId,
      questionBankWritable: true,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      testEligible: true,
      testBuilderEligible: true,
      mockTestEligible: false,
      publiclyPublishable: true,
      publicReleaseAuthorized: false,
      studentDeliveryAuthorized: false,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("Series Question Studio run failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Series review run." });
  }
});

router.get("/reasoning/series/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
      WHERE r.model IN (${LEGACY_REVIEW_MODEL}, ${RUN_MODEL})
    `;
    res.json({
      packageId: SER_001_PACKAGE_ID,
      permanentQlCount: SER_CP007_PERMANENT_QL_IDS.length,
      frozenTemplateCount: ACTIVATION.frozenTemplateCount,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: ACTIVATION.authorityId,
      sourceReviewAuthority: SER_001_QUESTION_STUDIO_REVIEW_PACKAGE.integrationAuthority,
      reviewOnly: false,
      questionBankStatus: ACTIVATION.questionBankStatus,
      questionBankWritable: true,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      manualApprovalRequired: true,
      manualQuestionPublicationRequired: true,
      testEligibility: ACTIVATION.testEligibility,
      testEligible: true,
      testBuilderEligible: true,
      mockTestEligible: false,
      publiclyPublishable: true,
      publicReleaseAuthorized: false,
      studentDeliveryAuthorized: false,
      automaticStudentPublication: false,
      nextGate: ACTIVATION.nextGate,
    });
  } catch {
    res.status(500).json({ error: "Unable to load Series review status." });
  }
});

export default router;
