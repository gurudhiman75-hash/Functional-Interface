import { randomUUID } from "node:crypto";
import { Router } from "express";

import { encodeGeneratedSpatialSvgImage } from "../lib/admin-question-conversion";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1 } from "../reasoning-v1/foundation/spatial/cubes-dice-question-studio-bank-activation-v1";
import {
  CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1,
  generateCubesDiceQuestionStudioRegisteredBatchV1,
  type CubesDiceRegisteredQuestionV1,
} from "../reasoning-v1/foundation/spatial/cubes-dice-question-studio-registered-runtime-v1";
import type {
  CubesDiceQuestionStudioLanguageV2,
  CubesDiceQuestionStudioQlIdV2,
} from "../reasoning-v1/foundation/spatial/cubes-dice-question-studio-seeded-runtime-v2";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const QL_IDS = new Set(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"]);
const RUN_MODEL = "reasoning-v1-cnd-001-bank-only" as const;

const QLS = Object.freeze([
  Object.freeze({ permanentQlId: "SPA-QL-043", proposalId: "CND-CAN-A-DIE-FACE-RELATIONS", name: "Die face relations from two views", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-044", proposalId: "CND-CAN-B-CUBE-NET-FOLDING", name: "Cube-net opposite-face relations", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-045", proposalId: "CND-CAN-C-PAINTED-CUBE-EXPOSURE", name: "Painted-cube face exposure counts", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-046", proposalId: "CND-CAN-D-VOXEL-STACK-OCCUPANCY", name: "Stable unit-cube stack reasoning", baseDifficulty: "Medium" }),
  Object.freeze({ permanentQlId: "SPA-QL-047", proposalId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION", name: "Top, front and right projections", baseDifficulty: "Medium" }),
] as const);

const ACTIVATION = CND_001_QUESTION_STUDIO_BANK_ONLY_ACTIVATION_AUTHORITY_V1;

const PACKAGE = Object.freeze({
  packageId: "SPA-001-CND-001-REVIEW" as const,
  chapterCode: "CND-001" as const,
  label: "Cubes & Dice — Internal Question Studio + Question Bank" as const,
  qlIds: Object.freeze(QLS.map((entry) => entry.permanentQlId)),
  qls: QLS,
  permanentQlCount: 5,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  supportedDifficulties: Object.freeze(["Easy", "Medium", "Hard"] as const),
  registrationAuthority: CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.authorityId,
  activationAuthority: ACTIVATION.authorityId,
  activationMode: "ACTIVE_INTERNAL_BANK_ONLY" as const,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  previewGenerationAuthorized: true,
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: "READY_FOR_STORAGE" as const,
  questionBankWritable: true,
  questionBankAcceptanceMode: "BANK_ONLY" as const,
  manualApprovalRequired: true,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
});

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function filters(source: Record<string, unknown>, max = 20) {
  const language = asString(source.language) || "en";
  const qlId = asString(source.qlId);
  if (!LANGUAGES.has(language)) throw new Error(`Unsupported CND language '${language}'.`);
  if (qlId && !QL_IDS.has(qlId)) throw new Error(`Unsupported CND QL '${qlId}'.`);
  return {
    language: language as CubesDiceQuestionStudioLanguageV2,
    qlId: qlId ? qlId as CubesDiceQuestionStudioQlIdV2 : undefined,
    count: asCount(source.count, 5, max),
    seed: asString(source.seed) || "cnd-question-studio-review",
  };
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `CND-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function detailedSolutionText(question: CubesDiceRegisteredQuestionV1): string {
  const blocks: string[] = [`Logic / Rule: ${question.solution.logicRule}`];
  for (const table of question.solution.tables) {
    blocks.push(table.title);
    blocks.push(table.headers.join(" | "));
    for (const row of table.rows) blocks.push(row.join(" | "));
  }
  question.solution.steps.forEach((step, index) => blocks.push(`${index + 1}. ${step}`));
  if (question.solution.note) blocks.push(`Note: ${question.solution.note}`);
  blocks.push(question.solution.answerLine);
  return blocks.join("\n");
}

export function buildCndQuestionBankPayloadV1(question: CubesDiceRegisteredQuestionV1) {
  const stimulusImage = encodeGeneratedSpatialSvgImage(
    question.stimulusSvgs[0],
    `${question.qlId} Cubes and Dice figure`,
  );
  const persistedStem = `${question.stem}\n\n${stimulusImage}`;
  const scalarOptions = question.options.map((option) => String(option));

  return {
    text: persistedStem,
    stem: persistedStem,
    options: scalarOptions,
    optionLabels: [...question.optionLabels],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.canonicalAnswer,
    explanation: detailedSolutionText(question),
    richExplanation: question.solution,
    renderer: {
      kind: "CND_SANITIZED_STIMULUS_WITH_SCALAR_OPTIONS_V1" as const,
      sourceStimulusCount: 1 as const,
      stimulusEmbeddedAsSanitizedDataImage: true as const,
    },
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    qlName: question.qlName,
    packageId: "SPA-001-CND-001" as const,
    sourcePackageId: question.packageId,
    canonicalProblemId: "CND-001" as const,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionLanguageId,
    topic: "Reasoning",
    subtopic: "Cubes & Dice",
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    taskKind: question.taskKind,
    stemVariantId: question.stemVariantId,
    contentFingerprint: question.contentFingerprint,
    runtimeMode: "CANONICAL_REVIEW" as const,
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,
    questionStudioRegistrationStatus: "REGISTERED_BANK_ONLY_INTERNAL" as const,
    persistenceAllowed: true as const,
    questionBankStatus: ACTIVATION.questionBankStatus,
    questionBankWritable: true as const,
    questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: ACTIVATION.authorityId,
    testEligibility: ACTIVATION.testEligibility,
    testEligible: false as const,
    testBuilderEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    publicReleaseAuthorized: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: ACTIVATION.authorityId,
    sourceRegistrationAuthority:
      CND_001_QUESTION_STUDIO_REVIEW_ONLY_REGISTRATION_AUTHORITY_V1.authorityId,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      packageId: "SPA-001-CND-001" as const,
      chapterCode: "CND-001" as const,
      qlId: question.qlId,
      language: question.language,
      locale: question.locale,
      runtimeMode: "CANONICAL_REVIEW" as const,
      reviewStatus: "APPROVED_EDITORIAL_CANONICAL" as const,
      integrationAuthority: ACTIVATION.authorityId,
      questionStudioDiscoverable: true as const,
      registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL" as const,
      persistenceAllowed: true as const,
      questionBankStatus: ACTIVATION.questionBankStatus,
      questionBankWritable: true as const,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      questionBankAcceptanceAuthority: ACTIVATION.authorityId,
      testEligibility: ACTIVATION.testEligibility,
      testEligible: false as const,
      testBuilderEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      publicReleaseAuthorized: false as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
  } as const;
}

async function persistRun(
  questions: readonly CubesDiceRegisteredQuestionV1[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No CND-001 questions matched the request.");
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
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = buildCndQuestionBankPayloadV1(question);
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number,
          created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1},
          'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
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
        'question_studio.cnd_001_run.created', 'generation_run', ${runId}::uuid,
        'CND-001 entered the standard manual review lifecycle with BANK_ONLY Question Bank acceptance',
        ${`Created ${questions.length} CND-001 review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          activationAuthority: ACTIVATION.authorityId,
          questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
          questionBankWritable: true,
          testEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.cnd_001_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          chapterCode: "CND-001",
          activationAuthority: ACTIVATION.authorityId,
          questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

router.use(authenticate);

router.get(
  "/reasoning/spatial/cubes-dice/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "reasoning-v1",
      package: PACKAGE,
      maxPreviewBatchSize: 20,
      maxRunBatchSize: 50,
      registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
      databaseWriteEnabled: true,
      persistenceAllowed: true,
      questionBankConversionEligibleAfterApproval: true,
      questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
      testEligibleAfterApproval: false,
      publiclyPublishableAfterApproval: false,
      automaticStudentPublication: false,
    });
  },
);

router.get(
  "/reasoning/spatial/cubes-dice/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const input = filters(req.query as Record<string, unknown>, 20);
      const questions = generateCubesDiceQuestionStudioRegisteredBatchV1(input);
      res.json({
        generationSystem: "reasoning-v1",
        packageId: PACKAGE.packageId,
        activationMode: PACKAGE.activationMode,
        registrationAuthority: PACKAGE.registrationAuthority,
        activationAuthority: PACKAGE.activationAuthority,
        questions,
        internalReviewEligible: true,
        persistenceAllowed: true,
        questionBankWritable: true,
        questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
        testEligible: false,
        publiclyPublishable: false,
      });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview CND questions." });
    }
  },
);

router.get(
  "/reasoning/spatial/cubes-dice/status",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const runRows = await sqlClient`
        SELECT
          COUNT(DISTINCT r.id)::int AS "generationRunCount",
          COUNT(i.id)::int AS "generationItemCount",
          COUNT(i.id) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
          COUNT(i.accepted_question_id)::int AS "questionBankCount"
        FROM content.generation_runs r
        LEFT JOIN content.generation_run_items i ON i.generation_run_id = r.id
        WHERE r.model = ${RUN_MODEL}
      `;
      const counts = runRows[0] ?? {};
      res.json({
        packageId: PACKAGE.packageId,
        chapterCode: PACKAGE.chapterCode,
        permanentQlCount: PACKAGE.permanentQlCount,
        supportedLanguages: PACKAGE.supportedLanguages,
        registrationStatus: "REGISTERED_BANK_ONLY_INTERNAL",
        registrationAuthority: PACKAGE.registrationAuthority,
        activationAuthority: ACTIVATION.authorityId,
        questionStudioDiscoverable: true,
        previewGenerationAuthorized: true,
        persistenceAllowed: true,
        questionBankStatus: ACTIVATION.questionBankStatus,
        questionBankWritable: true,
        questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
        manualApprovalRequired: true,
        testEligibility: ACTIVATION.testEligibility,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        generationRunCount: Number(counts.generationRunCount ?? 0),
        generationItemCount: Number(counts.generationItemCount ?? 0),
        approvedItemCount: Number(counts.approvedItemCount ?? 0),
        questionBankCount: Number(counts.questionBankCount ?? 0),
        nextGate: ACTIVATION.nextGate,
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unable to load CND-001 status." });
    }
  },
);

router.post(
  "/reasoning/spatial/cubes-dice/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const input = filters((req.body ?? {}) as Record<string, unknown>, 50);
      const questions = generateCubesDiceQuestionStudioRegisteredBatchV1(input);
      const persisted = await persistRun(questions, {
        chapterCode: "CND-001",
        packageId: PACKAGE.packageId,
        qlId: input.qlId ?? null,
        language: input.language,
        count: input.count,
        seed: input.seed,
        activationAuthority: ACTIVATION.authorityId,
        questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
        persistenceAllowed: true,
        questionBankWritable: true,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
        requestedByFirebaseUid: req.user?.id,
      }, actorUserId);
      res.status(201).json({
        ...persisted,
        generationSystem: "reasoning-v1",
        packageId: PACKAGE.packageId,
        chapterCode: "CND-001",
        activationAuthority: ACTIVATION.authorityId,
        questionBankConversionEligibleAfterApproval: true,
        questionBankAcceptanceMode: ACTIVATION.questionBankAcceptanceMode,
        testEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      });
    } catch (error) {
      console.error("CND-001 Question Studio run failed", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create CND-001 review run." });
    }
  },
);

export { PACKAGE as CND_001_QUESTION_STUDIO_REVIEW_PACKAGE_V1 };
export default router;
