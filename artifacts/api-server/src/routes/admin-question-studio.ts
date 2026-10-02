import { randomUUID } from "node:crypto";
import { Router } from "express";

import {
  convertApprovedGenerationItem,
  type ConvertedQuestion,
  type QuestionSqlExecutor,
} from "../lib/admin-question-conversion";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { requireAdminPermission } from "../lib/admin-rbac";

const router = Router();

const ITEM_STATUSES = new Set([
  "unreviewed",
  "needs_fix",
  "approved",
  "rejected",
]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

router.use(authenticate);

router.get("/review-page", requireAdminPermission("content.generation.read"), async (req, res) => {
  const page = asPositiveInteger(req.query?.page, 1, 1000000);
  const pageSize = asPositiveInteger(req.query?.pageSize, 20, 50);
  const subject = asString(req.query?.subject) || null;
  const chapter = asString(req.query?.chapter) || null;
  const packageId = asString(req.query?.packageId) || null;
  const status = asString(req.query?.status) || null;
  const search = asString(req.query?.search).slice(0, 200);
  const searchPattern = search ? `%${search}%` : null;

  if (status && !ITEM_STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid review status filter" });
    return;
  }

  try {
    const totalRows = await sqlClient`
      SELECT COUNT(*)::int AS total
      FROM content.generation_runs r
      WHERE
        (${subject}::text IS NULL OR r.request_snapshot ->> 'subject' = ${subject})
        AND (
          ${chapter}::text IS NULL
          OR r.request_snapshot ->> 'topic' = ${chapter}
          OR r.request_snapshot ->> 'subtopic' = ${chapter}
        )
        AND (${packageId}::text IS NULL OR r.request_snapshot ->> 'packageId' = ${packageId})
        AND (
          ${status}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items si
            WHERE si.generation_run_id = r.id
              AND si.status::text = ${status}
          )
        )
        AND (
          ${searchPattern}::text IS NULL
          OR r.public_code ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'exam', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'subject', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'topic', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'subtopic', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'packageId', '') ILIKE ${searchPattern}
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items qi
            INNER JOIN content.generation_item_versions qv
              ON qv.generation_item_id = qi.id
             AND qv.version_number = qi.current_version_number
            WHERE qi.generation_run_id = r.id
              AND (
                COALESCE(qv.payload ->> 'text', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'stem', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'selectedCpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'canonicalProblemId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'cpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'qlId', '') ILIKE ${searchPattern}
              )
          )
        )
    `;

    const totalRuns = Number(totalRows[0]?.total ?? 0);
    const totalPages = totalRuns > 0 ? Math.ceil(totalRuns / pageSize) : 0;
    const normalizedPage = totalPages > 0 ? Math.min(page, totalPages) : 1;
    const offset = (normalizedPage - 1) * pageSize;

    const runs = await sqlClient`
      SELECT
        r.id,
        r.public_code AS "publicCode",
        r.status,
        r.attempt_number AS "attemptNumber",
        r.provider,
        r.model,
        r.prompt_tokens AS "promptTokens",
        r.completion_tokens AS "completionTokens",
        r.estimated_cost_paise AS "estimatedCostPaise",
        r.actual_cost_paise AS "actualCostPaise",
        r.budget_limit_paise AS "budgetLimitPaise",
        r.due_at AS "dueAt",
        r.failure_reason AS "failureReason",
        r.started_at AS "startedAt",
        r.completed_at AS "completedAt",
        r.created_at AS "createdAt",
        r.updated_at AS "updatedAt",
        r.request_snapshot AS "requestSnapshot",
        r.recipe_version_id AS "recipeVersionId",
        jsonb_build_object(
          'total', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
          ),
          'unreviewed', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'unreviewed'
          ),
          'needsFix', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'needs_fix'
          ),
          'approved', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'approved'
          ),
          'rejected', (
            SELECT COUNT(*)::int
            FROM content.generation_run_items summary_item
            WHERE summary_item.generation_run_id = r.id
              AND summary_item.status = 'rejected'
          )
        ) AS "reviewSummary"
      FROM content.generation_runs r
      WHERE
        (${subject}::text IS NULL OR r.request_snapshot ->> 'subject' = ${subject})
        AND (
          ${chapter}::text IS NULL
          OR r.request_snapshot ->> 'topic' = ${chapter}
          OR r.request_snapshot ->> 'subtopic' = ${chapter}
        )
        AND (${packageId}::text IS NULL OR r.request_snapshot ->> 'packageId' = ${packageId})
        AND (
          ${status}::text IS NULL
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items si
            WHERE si.generation_run_id = r.id
              AND si.status::text = ${status}
          )
        )
        AND (
          ${searchPattern}::text IS NULL
          OR r.public_code ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'exam', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'subject', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'topic', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'subtopic', '') ILIKE ${searchPattern}
          OR COALESCE(r.request_snapshot ->> 'packageId', '') ILIKE ${searchPattern}
          OR EXISTS (
            SELECT 1
            FROM content.generation_run_items qi
            INNER JOIN content.generation_item_versions qv
              ON qv.generation_item_id = qi.id
             AND qv.version_number = qi.current_version_number
            WHERE qi.generation_run_id = r.id
              AND (
                COALESCE(qv.payload ->> 'text', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'stem', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'selectedCpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'canonicalProblemId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'cpId', '') ILIKE ${searchPattern}
                OR COALESCE(qv.payload ->> 'qlId', '') ILIKE ${searchPattern}
              )
          )
        )
      ORDER BY r.created_at DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;

    const runIds = runs.map((run) => String(run.id));
    const items = runIds.length > 0
      ? await sqlClient`
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
              'cpId', v.payload -> 'cpId',
              'canonicalProblemId', v.payload -> 'canonicalProblemId',
              'selectedCpId', v.payload -> 'selectedCpId',
              'engineId', v.payload -> 'engineId',
              'questionLanguageId', v.payload -> 'questionLanguageId',
              'topic', v.payload -> 'topic',
              'subtopic', v.payload -> 'subtopic',
              'language', v.payload -> 'language',
              'seed', v.payload -> 'seed',
              'qlId', v.payload -> 'qlId',
              'qlName', v.payload -> 'qlName',
              'stimulusSvgs', v.payload -> 'stimulusSvgs',
              'optionSvgs', v.payload -> 'optionSvgs',
              'explanationSvgs', v.payload -> 'explanationSvgs',
              'optionLabels', v.payload -> 'optionLabels',
              'renderer', v.payload -> 'renderer',
              'semanticMetadata', v.payload -> 'semanticMetadata',
              'contentFingerprint', v.payload -> 'contentFingerprint'
            )) AS payload
          FROM content.generation_run_items i
          INNER JOIN content.generation_runs r
            ON r.id = i.generation_run_id
          LEFT JOIN content.generation_item_versions v
            ON v.generation_item_id = i.id
           AND v.version_number = i.current_version_number
          WHERE i.generation_run_id = ANY(${runIds}::uuid[])
            AND (${status}::text IS NULL OR i.status::text = ${status})
            AND (
              ${searchPattern}::text IS NULL
              OR r.public_code ILIKE ${searchPattern}
              OR COALESCE(r.request_snapshot ->> 'exam', '') ILIKE ${searchPattern}
              OR COALESCE(r.request_snapshot ->> 'subject', '') ILIKE ${searchPattern}
              OR COALESCE(r.request_snapshot ->> 'topic', '') ILIKE ${searchPattern}
              OR COALESCE(r.request_snapshot ->> 'subtopic', '') ILIKE ${searchPattern}
              OR COALESCE(r.request_snapshot ->> 'packageId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'text', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'stem', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'selectedCpId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'canonicalProblemId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'cpId', '') ILIKE ${searchPattern}
              OR COALESCE(v.payload ->> 'qlId', '') ILIKE ${searchPattern}
            )
          ORDER BY i.generation_run_id, i.item_number ASC
        `
      : [];

    const pageItemIds = items.map((item) => String(item.id));
    const duplicateMatches = pageItemIds.length > 0
      ? await sqlClient`
          WITH current_payloads AS (
            SELECT
              i.id,
              r.public_code AS "runCode",
              r.created_at AS "runCreatedAt",
              NULLIF(v.payload ->> 'contentFingerprint', '') AS fingerprint,
              LOWER(
                REGEXP_REPLACE(
                  TRIM(COALESCE(NULLIF(v.payload ->> 'text', ''), v.payload ->> 'stem', '')),
                  '[[:space:][:punct:]]+',
                  ' ',
                  'g'
                )
              ) AS "normalizedStem"
            FROM content.generation_run_items i
            INNER JOIN content.generation_runs r
              ON r.id = i.generation_run_id
            INNER JOIN content.generation_item_versions v
              ON v.generation_item_id = i.id
             AND v.version_number = i.current_version_number
          )
          SELECT DISTINCT ON (source.id)
            source.id::text AS "itemId",
            matched.id::text AS "matchedItemId",
            matched."runCode" AS "matchedRunCode",
            1::float AS similarity,
            true AS exact
          FROM current_payloads source
          INNER JOIN current_payloads matched
            ON matched.id <> source.id
           AND source."normalizedStem" <> ''
           AND source."normalizedStem" = matched."normalizedStem"
           AND (
             source.fingerprint IS NULL
             OR matched.fingerprint IS NULL
             OR source.fingerprint = matched.fingerprint
           )
          WHERE source.id = ANY(${pageItemIds}::uuid[])
          ORDER BY source.id, matched."runCreatedAt" DESC, matched.id
        `
      : [];

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
      duplicateMatches,
      pagination: {
        page: normalizedPage,
        pageSize,
        totalRuns,
        totalPages,
        hasPreviousPage: normalizedPage > 1,
        hasNextPage: totalPages > 0 && normalizedPage < totalPages,
      },
      filters: {
        subject,
        chapter,
        packageId,
        status,
        search: search || null,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Question Studio review page failed", error);
    res.status(500).json({ error: "Unable to load Question Studio review page" });
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