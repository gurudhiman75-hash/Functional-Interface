import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES,
  isBlrChapterStudioPackageId,
  previewBlrChapterQuestionStudio,
  releaseAuthorityForBlrChapterPackage,
  type BlrChapterStudioDifficulty,
  type BlrChapterStudioLanguage,
  type BlrChapterStudioPackageId,
} from "../reasoning-v1/topics/Blood-Relations/BLR-001/question-studio-chapter-adapter";
import {
  BLR_CP006_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "../reasoning-v1/topics/Blood-Relations/BLR-001/BLR-CP-006/question-studio-review-adapter";
import { BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY } from "../reasoning-v1/topics/Blood-Relations/BLR-001/BLR-CP-006/cp006-multilingual-frozen";
import {
  BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "../reasoning-v1/topics/Blood-Relations/BLR-001/BLR-CP-007/question-studio-review-adapter";

const router = Router();
const CP007_RELEASE_AUTHORITY = "BLR_CP007_PRODUCT_RELEASE_APPROVED_2026_08_09" as const;
const CHAPTER_PACKAGE_AUTHORITY = "BLR_001_QUESTION_STUDIO_COMPLETE_CHAPTER" as const;
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);
const LANGUAGES = new Set(["en", "hi", "pa"]);

type PreviewQuestion = ReturnType<typeof previewBlrChapterQuestionStudio>["questions"][number];

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function activatedPackage<T extends Record<string, unknown>>(pkg: T, releaseAuthority: string) {
  return {
    ...pkg,
    enabled: true,
    reviewOnly: false,
    adminReviewVisible: true,
    questionStudioVisible: true,
    persistenceAllowed: true,
    databaseWriteEnabled: true,
    questionBankEligible: true,
    mockTestEligible: true,
    publiclyPublishable: true,
    releaseAuthority,
  } as const;
}

function publicRunCode(checkpointId: string) {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const cp = checkpointId.slice(-3).replace(/^0+/, "") || "0";
  return `BLR${cp}-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function explanationText(question: PreviewQuestion) {
  return [
    ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
    `Conclusion: ${question.explanation.conclusion}`,
    question.explanation.shortcut ? `Shortcut: ${question.explanation.shortcut}` : "",
    question.explanation.commonTrap ? `Common trap: ${question.explanation.commonTrap}` : "",
  ].filter(Boolean).join("\n");
}

function productionPayload(
  question: PreviewQuestion,
  packageId: BlrChapterStudioPackageId,
  releaseAuthority: string,
) {
  const stem = question.sharedPrompt ? `${question.sharedPrompt}\n\n${question.stem}` : question.stem;
  return {
    text: stem,
    stem,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: explanationText(question),
    richExplanation: question.explanation,
    decodedStatements: question.decodedStatements,
    reasoningGraph: question.reasoningGraph,
    renderer: question.renderer,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    qlId: question.qlId,
    packageId,
    canonicalProblemId: question.canonicalProblemId,
    canonicalItemId: question.canonicalItemId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Blood Relations",
    subtopic: String(BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES.find((pkg) => pkg.packageId === packageId)?.subtopic ?? "Blood Relations"),
    subject: "Reasoning Ability",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    runtimeMode: "CANONICAL_REVIEW",
    sourceRuntimeMode: question.parameters.runtimeMode,
    reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
    questionBankStatus: "READY_FOR_STORAGE",
    testEligibility: "ELIGIBLE",
    publiclyPublishable: true,
    mockTestEligible: true,
    releaseAuthority,
    traceability: question.traceability,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId,
      runtimeMode: "CANONICAL_REVIEW",
      sourceRuntimeMode: question.parameters.runtimeMode,
      reviewStatus: "APPROVED_EDITORIAL_CANONICAL",
      questionBankStatus: "READY_FOR_STORAGE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
      mockTestEligible: true,
      releaseAuthority,
      corpusAuthority: question.parameters.corpusAuthority,
      recordAuthority: question.parameters.recordAuthority,
    },
  };
}

async function persistRun(
  questions: readonly PreviewQuestion[],
  packageId: BlrChapterStudioPackageId,
  releaseAuthority: string,
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Blood Relations questions matched the request.");
  const runId = randomUUID();
  const publicCode = publicRunCode(questions[0]!.canonicalProblemId);
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
        'examtree', 'reasoning-v1-blr-chapter', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = productionPayload(question, packageId, releaseAuthority);
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
        'question_studio.reasoning_run.created', 'generation_run', ${runId}::uuid,
        'Blood Relations chapter runtime entered Question Studio review',
        ${`Created ${questions.length} Blood Relations review items in ${publicCode}`},
        ${JSON.stringify({ requestSnapshot, releaseAuthority, packageId })}::jsonb
      )
    `;
    await tx`
      INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
        'question_studio.reasoning_run.created',
        ${JSON.stringify({ runId, publicCode, itemCount: questions.length, packageId })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review", itemCount: questions.length };
}

router.get(
  "/reasoning/packages",
  authenticate,
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    const packages = [
      activatedPackage(BLR_CP007_QUESTION_STUDIO_REVIEW_PACKAGE, CP007_RELEASE_AUTHORITY),
      ...BLR_001_CHAPTER_QUESTION_STUDIO_PACKAGES.map((pkg) => activatedPackage(pkg, CHAPTER_PACKAGE_AUTHORITY)),
      activatedPackage(BLR_CP006_QUESTION_STUDIO_REVIEW_PACKAGE, BLR_CP006_MULTILINGUAL_FREEZE_AUTHORITY),
    ];
    res.json({
      generationSystem: "reasoning-v1",
      activationMode: "PRODUCTION_REVIEW",
      chapterId: "BLR-001",
      chapterLabel: "Blood Relations",
      chapterQlRange: "BLR-QL-001..BLR-QL-035",
      packages,
      maxBatchSize: 50,
      databaseWriteEnabled: true,
      persistenceAllowed: true,
    });
  },
);

router.get(
  "/reasoning/preview",
  (req, _res, next) => isBlrChapterStudioPackageId(req.query.packageId) ? next() : next("route"),
  authenticate,
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const packageId = asString(req.query.packageId) as BlrChapterStudioPackageId;
      const language = (asString(req.query.language) || "en") as BlrChapterStudioLanguage;
      const difficulty = asString(req.query.difficulty);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      const result = previewBlrChapterQuestionStudio({
        packageId,
        language,
        qlId: asString(req.query.qlId) || undefined,
        difficulty: difficulty ? difficulty as BlrChapterStudioDifficulty : undefined,
        canonicalItemId: asString(req.query.canonicalItemId) || undefined,
        questionLanguageId: asString(req.query.questionLanguageId) || undefined,
        seed: asString(req.query.seed) || undefined,
        count: asCount(req.query.count, 1, 20),
      });
      res.json({ ...result, releaseAuthority: releaseAuthorityForBlrChapterPackage(packageId, language), productionEligible: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Unable to preview Blood Relations questions." });
    }
  },
);

router.post(
  "/reasoning/runs",
  (req, _res, next) => isBlrChapterStudioPackageId(req.body?.packageId) ? next() : next("route"),
  authenticate,
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }
    try {
      const packageId = asString(req.body?.packageId) as BlrChapterStudioPackageId;
      const language = (asString(req.body?.language) || "en") as BlrChapterStudioLanguage;
      const difficulty = asString(req.body?.difficulty);
      if (!LANGUAGES.has(language)) throw new Error(`Unsupported language '${language}'.`);
      if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported difficulty '${difficulty}'.`);
      const count = asCount(req.body?.count, 5, 50);
      const seed = asString(req.body?.seed) || undefined;
      const result = previewBlrChapterQuestionStudio({
        packageId,
        language,
        qlId: asString(req.body?.qlId) || undefined,
        difficulty: difficulty ? difficulty as BlrChapterStudioDifficulty : undefined,
        seed,
        count,
      });
      const releaseAuthority = releaseAuthorityForBlrChapterPackage(packageId, language);
      const persisted = await persistRun(
        result.questions,
        packageId,
        releaseAuthority,
        {
          packageId,
          language,
          difficulty: difficulty || null,
          qlId: asString(req.body?.qlId) || null,
          count,
          seed: seed || null,
          releaseAuthority,
          requestedByFirebaseUid: req.user?.id,
        },
        actorUserId,
      );
      res.status(201).json({ ...persisted, generationSystem: "reasoning-v1" });
    } catch (error) {
      console.error("Blood Relations chapter Question Studio run failed", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Unable to create Blood Relations review run." });
    }
  },
);

export default router;
