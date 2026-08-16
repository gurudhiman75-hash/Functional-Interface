import { randomUUID } from "node:crypto";
import { Router } from "express";

import {
  convertApprovedGenerationItem,
  type ConvertedQuestion,
  type QuestionSqlExecutor,
} from "../lib/admin-question-conversion";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  generateQuestion as generateQuantV4Questions,
  listQuantV4Packages,
} from "../quant-v4/generation-engine";
import { requireAdminPermission } from "../lib/admin-rbac";

const router = Router();

const ITEM_STATUSES = new Set([
  "unreviewed",
  "needs_fix",
  "approved",
  "rejected",
]);

const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

function normalizeDifficulty(value: unknown) {
  const raw = asString(value);
  if (raw.toLowerCase() === "moderate") return "Medium";
  return DIFFICULTIES.has(raw) ? raw : "Medium";
}

function normalizeLanguage(value: unknown) {
  const raw = asString(value).toLowerCase();
  return LANGUAGES.has(raw) ? raw : "en";
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

router.use(authenticate);

router.get("/capabilities", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const packages = listQuantV4Packages().map((pkg) => ({
      packageId: String(pkg.packageId),
      topic: String(pkg.topic),
      subtopic: String(pkg.subtopic),
      label: String(pkg.label),
      enabled: Boolean(pkg.enabled),
      cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
      supportedLanguages: Array.isArray(pkg.supportedLanguages)
        ? pkg.supportedLanguages.map(String)
        : ["en"],
      runtimeMode: asString((pkg as any).runtimeMode) || undefined,
      supportedRuntimeModes: Array.isArray((pkg as any).supportedRuntimeModes)
        ? (pkg as any).supportedRuntimeModes.map(String)
        : [],
      dynamicCandidateCpIds: Array.isArray((pkg as any).dynamicCandidateCpIds)
        ? (pkg as any).dynamicCandidateCpIds.map(String)
        : [],
      questionBankStatus: asString((pkg as any).questionBankStatus) || undefined,
      testEligibility: asString((pkg as any).testEligibility) || undefined,
      publiclyPublishable:
      typeof (pkg as any).publiclyPublishable === "boolean"
        ? (pkg as any).publiclyPublishable
        : undefined,
    }));

    res.json({
      generationSystem: "quant-v4",
      packages,
      difficulties: ["Easy", "Medium", "Hard"],
      languages: ["en", "hi", "pa"],
      maxBatchSize: 50,
    });
  } catch (error) {
    console.error("Question Studio capabilities failed", error);
    res.status(500).json({ error: "Unable to load generation capabilities" });
  }
});

router.get("/dashboard", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const runs = await sqlClient`
      SELECT
        id,
        public_code AS "publicCode",
        status,
        attempt_number AS "attemptNumber",
        provider,
        model,
        prompt_tokens AS "promptTokens",
        completion_tokens AS "completionTokens",
        estimated_cost_paise AS "estimatedCostPaise",
        actual_cost_paise AS "actualCostPaise",
        budget_limit_paise AS "budgetLimitPaise",
        due_at AS "dueAt",
        failure_reason AS "failureReason",
        started_at AS "startedAt",
        completed_at AS "completedAt",
        created_at AS "createdAt",
        updated_at AS "updatedAt",
        request_snapshot AS "requestSnapshot",
        recipe_version_id AS "recipeVersionId"
      FROM content.generation_runs
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const items = await sqlClient`
      SELECT
        i.id,
        i.generation_run_id AS "generationRunId",
        i.item_number AS "itemNumber",
        i.status,
        i.current_version_number AS "currentVersionNumber",
        i.retry_reason AS "retryReason",
        i.reviewer_user_id AS "reviewerUserId",
        i.accepted_question_id AS "acceptedQuestionId",
        i.accepted_question_version_id AS "acceptedQuestionVersionId",
        i.created_at AS "createdAt",
        i.updated_at AS "updatedAt",
        v.id AS "versionId",
        jsonb_strip_nulls(jsonb_build_object(
          'text', v.payload -> 'text',
          'stem', v.payload -> 'stem',
          'options', v.payload -> 'options',
          'explanation', v.payload -> 'explanation',
          'correct', v.payload -> 'correct',
          'correctIndex', v.payload -> 'correctIndex',
          'difficulty', v.payload -> 'difficulty',
          'difficultyLabel', v.payload -> 'difficultyLabel',
          'patternId', v.payload -> 'patternId',
          'packageId', v.payload -> 'packageId',
          'topic', v.payload -> 'topic',
          'subtopic', v.payload -> 'subtopic',
          'language', v.payload -> 'language',
          'seed', v.payload -> 'seed',
          'qlId', v.payload -> 'qlId',
          'qlName', v.payload -> 'qlName',
          'stimulusSvgs', v.payload -> 'stimulusSvgs',
          'optionSvgs', v.payload -> 'optionSvgs',
          'optionLabels', v.payload -> 'optionLabels',
          'renderer', v.payload -> 'renderer',
          'contentFingerprint', v.payload -> 'contentFingerprint'
        )) AS payload
      FROM content.generation_run_items i
      INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
      LEFT JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id
       AND v.version_number = i.current_version_number
      ORDER BY r.created_at DESC, i.item_number ASC
      LIMIT 5000
    `;

    const recipes = await sqlClient`
      SELECT
        r.id,
        r.name,
        r.visibility,
        r.current_version_number AS "currentVersionNumber",
        r.created_at AS "createdAt",
        r.updated_at AS "updatedAt",
        v.id AS "versionId",
        v.configuration,
        v.version_notes AS "versionNotes"
      FROM content.generation_recipes r
      LEFT JOIN content.generation_recipe_versions v
        ON v.recipe_id = r.id
       AND v.version_number = r.current_version_number
      WHERE r.deleted_at IS NULL
      ORDER BY r.updated_at DESC
    `;

    const itemsByRun = new Map<string, typeof items>();
    for (const item of items) {
      const runId = String(item.generationRunId);
      const bucket = itemsByRun.get(runId) ?? [];
      bucket.push(item);
      itemsByRun.set(runId, bucket);
    }

    res.json({
      runs: runs.map((run) => ({
        ...run,
        items: itemsByRun.get(String(run.id)) ?? [],
      })),
      recipes,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Question Studio dashboard failed", error);
    res.status(500).json({ error: "Unable to load Question Studio dashboard" });
  }
});

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const count = asPositiveInteger(req.body?.count, 5, 50);
  const packageId = asString(req.body?.packageId) || undefined;
  const patternId = asString(req.body?.patternId) || undefined;
  const topic = asString(req.body?.topic) || "Arithmetic";
  const subtopic = asString(req.body?.subtopic) || "Percentage";
  const exam = asString(req.body?.exam) || "SSC CGL";
  const subject = asString(req.body?.subject) || "Quantitative Aptitude";
  const language = normalizeLanguage(req.body?.language);
  const difficulty = normalizeDifficulty(req.body?.difficulty);
  const seed = asString(req.body?.seed) || undefined;
  const runtimeMode = asString(req.body?.runtimeMode) || undefined;
  const canonicalProblemId =
    asString(req.body?.canonicalProblemId) || asString(req.body?.cpId) || undefined;
  const questionLanguageId = asString(req.body?.questionLanguageId) || undefined;

  if (!packageId && !patternId && !(topic && subtopic)) {
    res.status(400).json({
      error: "A package, pattern, or topic/subtopic selection is required",
    });
    return;
  }

  const runId = randomUUID();
  const code = publicRunCode();
  const now = new Date();
  const timestamp = now.toISOString();
  const requestSnapshot = {
    exam,
    subject,
    difficulty,
    count,
    packageId,
    patternId,
    topic,
    subtopic,
    language,
    seed,
    runtimeMode,
    canonicalProblemId,
    questionLanguageId,
    requestedByFirebaseUid: req.user?.id,
  };

  try {
    const result = await generateQuantV4Questions({
      packageId: packageId as never,
      patternId,
      topic,
      subtopic,
      difficulty,
      language: language as "en" | "hi" | "pa",
      seed,
      count,
      runtimeMode: runtimeMode as "CANONICAL_REVIEW" | "DYNAMIC_CANDIDATE" | undefined,
      canonicalProblemId,
      questionLanguageId,
    });

    const generatedQuestions = Array.isArray(result.questions)
      ? result.questions
      : [];

    if (generatedQuestions.length === 0) {
      res.status(422).json({ error: "The generation engine returned no questions" });
      return;
    }

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.generation_runs (
          id,
          public_code,
          status,
          attempt_number,
          prompt_snapshot,
          request_snapshot,
          provider,
          model,
          prompt_tokens,
          completion_tokens,
          estimated_cost_paise,
          actual_cost_paise,
          started_at,
          completed_at,
          created_at,
          updated_at
        ) VALUES (
          ${runId}::uuid,
          ${code},
          'review'::generation_run_status,
          1,
          ${JSON.stringify(requestSnapshot)},
          ${JSON.stringify(requestSnapshot)},
          'examtree',
          'quant-v4',
          0,
          0,
          0,
          0,
          ${timestamp},
          ${timestamp},
          ${timestamp},
          ${timestamp}
        )
      `;

      for (let index = 0; index < generatedQuestions.length; index++) {
        const itemId = randomUUID();
        const versionId = randomUUID();
        const payload = {
          ...generatedQuestions[index],
          generationContext: result.generationContext,
          validationResult: "pending",
        };

        await tx`
          INSERT INTO content.generation_run_items (
            id,
            generation_run_id,
            item_number,
            status,
            current_version_number,
            created_at,
            updated_at
          ) VALUES (
            ${itemId}::uuid,
            ${runId}::uuid,
            ${index + 1},
            'unreviewed'::generation_item_status,
            1,
            ${timestamp},
            ${timestamp}
          )
        `;

        await tx`
          INSERT INTO content.generation_item_versions (
            id,
            generation_item_id,
            version_number,
            payload,
            provider_item_id,
            created_at
          ) VALUES (
            ${versionId}::uuid,
            ${itemId}::uuid,
            1,
            ${JSON.stringify(payload)},
            ${asString((generatedQuestions[index] as Record<string, unknown>)?.questionId) || null},
            ${timestamp}
          )
        `;
      }

      await tx`
        INSERT INTO platform.audit_events (
          id,
          actor_type,
          actor_user_id,
          action_key,
          entity_type,
          entity_id,
          reason,
          summary,
          metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${req.adminSession?.user.id ?? null}::uuid,
          'question_studio.generation_run.created',
          'generation_run',
          ${runId}::uuid,
          'Admin generated a Question Studio batch',
          ${`Generated ${generatedQuestions.length} Quant V4 questions in ${code}`},
          ${JSON.stringify({
            firebaseUid: req.user?.id,
            requestSnapshot,
          })}
        )
      `;

      await tx`
        INSERT INTO platform.outbox_events (
          id,
          aggregate_type,
          aggregate_id,
          event_type,
          payload
        ) VALUES (
          ${randomUUID()}::uuid,
          'generation_run',
          ${runId}::uuid,
          'question_studio.generation_run.created',
          ${JSON.stringify({ runId, publicCode: code, itemCount: generatedQuestions.length })}
        )
      `;
    });

    res.status(201).json({
      id: runId,
      publicCode: code,
      status: "review",
      itemCount: generatedQuestions.length,
      generationSystem: "quant-v4",
    });
  } catch (error) {
    console.error("Question Studio generation failed", error);
    const message = error instanceof Error
      ? error.message
      : "Question generation failed";
    res.status(500).json({ error: message });
  }
});

router.patch("/items/bulk", requireAdminPermission("content.generation.review"), async (req, res) => {
  const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds : [];
  const itemIds = [...new Set(rawIds.map(asString).filter(Boolean))].slice(0, 100);
  const status = asString(req.body?.status);
  const reason = asString(req.body?.reason);
  const actorUserId = req.adminSession?.user.id;

  if (itemIds.length === 0) {
    res.status(400).json({ error: "At least one generated item is required" });
    return;
  }
  if (!ITEM_STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid generated-item status" });
    return;
  }
  if ((status === "needs_fix" || status === "rejected") && !reason) {
    res.status(400).json({ error: "A reason is required for this action" });
    return;
  }
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required" });
    return;
  }

  try {
    const result = await sqlClient.begin(async (tx) => {
      const changed: Array<{
        id: string;
        generationRunId: string;
        previousStatus: string;
        status: string;
        convertedQuestion: ConvertedQuestion | null;
      }> = [];
      const converted: ConvertedQuestion[] = [];

      for (const itemId of itemIds) {
        const before = await tx`
          SELECT id, generation_run_id AS "generationRunId", status
          FROM content.generation_run_items
          WHERE id = ${itemId}::uuid
          FOR UPDATE
        `;
        if (before.length === 0) continue;

        const row = before[0];
        const updated = await tx`
          UPDATE content.generation_run_items
          SET
            status = ${status}::generation_item_status,
            retry_reason = ${reason || null},
            reviewer_user_id = ${actorUserId}::uuid,
            updated_at = now()
          WHERE id = ${itemId}::uuid
          RETURNING id, generation_run_id AS "generationRunId", status
        `;
        if (updated.length === 0) continue;

        let convertedQuestion: ConvertedQuestion | null = null;
        if (status === "approved") {
          convertedQuestion = await convertApprovedGenerationItem(
            tx as QuestionSqlExecutor,
            itemId,
            actorUserId,
          );
          if (convertedQuestion) converted.push(convertedQuestion);
        }

        changed.push({
          id: String(updated[0].id),
          generationRunId: String(updated[0].generationRunId),
          previousStatus: String(row.status),
          status: String(updated[0].status),
          convertedQuestion,
        });

        await tx`
          INSERT INTO platform.audit_events (
            id,
            actor_type,
            actor_user_id,
            action_key,
            entity_type,
            entity_id,
            entity_version_id,
            reason,
            summary,
            metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${`question_studio.generated_item.${status}`},
            'generation_item',
            ${itemId}::uuid,
            ${convertedQuestion?.questionVersionId ?? null}::uuid,
            ${reason || null},
            ${`Generated item moved to ${status}`},
            ${JSON.stringify({
              firebaseUid: req.user?.id,
              previousStatus: row.status,
              status,
              questionId: convertedQuestion?.questionId ?? null,
            })}
          )
        `;
      }

      const runIds = [...new Set(changed.map((item) => item.generationRunId))];
      for (const runId of runIds) {
        const counts = await tx`
          SELECT
            COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
            COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected,
            COUNT(*) FILTER (WHERE status = 'needs_fix')::int AS "needsFix"
          FROM content.generation_run_items
          WHERE generation_run_id = ${runId}::uuid
        `;
        const count = counts[0];
        const total = Number(count?.total ?? 0);
        const approved = Number(count?.approved ?? 0);
        const runStatus = total > 0 && approved === total
          ? "approved"
          : approved > 0
            ? "partially_approved"
            : "review";

        await tx`
          UPDATE content.generation_runs
          SET status = ${runStatus}::generation_run_status, updated_at = now()
          WHERE id = ${runId}::uuid
        `;
      }

      return { changed, converted };
    });

    res.json({
      items: result.changed,
      updatedCount: result.changed.length,
      converted: result.converted,
      convertedCount: result.converted.length,
    });
  } catch (error) {
    console.error("Question Studio bulk update failed", error);
    const message = error instanceof Error ? error.message : "Unable to update generated items";
    res.status(422).json({ error: message });
  }
});

export default router;