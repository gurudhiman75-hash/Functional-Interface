import { randomUUID } from "node:crypto";
import { Router } from "express";

import {
  convertApprovedGenerationItem,
  type ConvertedQuestion,
  type QuestionSqlExecutor,
} from "../lib/admin-question-conversion";
import {
  getGeneratedItemApprovalDisposition,
  type GeneratedItemApprovalMode,
} from "../lib/admin-question-studio-approval-policy";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { analyzeGeneratedQuestionPayload } from "../lib/question-studio-quality";
import { authenticate } from "../middlewares/auth";

const router = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STATUSES = new Set(["unreviewed", "needs_fix", "approved", "rejected"]);
const MAX_BULK_REVIEW_ITEMS = 500;

type ItemResult = {
  itemId: string;
  generationRunId?: string;
  previousStatus?: string;
  status?: string;
  ok: boolean;
  code?: string;
  message?: string;
  approvalMode?: GeneratedItemApprovalMode | null;
  conversionSkippedReason?: string | null;
  convertedQuestion?: ConvertedQuestion | null;
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function failure(itemId: string, error: unknown): ItemResult {
  const candidate = error as { code?: unknown; message?: unknown };
  return {
    itemId,
    ok: false,
    code: typeof candidate?.code === "string" ? candidate.code : "GENERATION_ITEM_UPDATE_FAILED",
    message: typeof candidate?.message === "string" ? candidate.message : "Generated item update failed",
  };
}

async function refreshRunStatus(runId: string): Promise<void> {
  const counts = await sqlClient`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE status = 'approved')::int AS approved
    FROM content.generation_run_items
    WHERE generation_run_id = ${runId}::uuid
  `;
  const total = Number(counts[0]?.total ?? 0);
  const approved = Number(counts[0]?.approved ?? 0);
  const runStatus = total > 0 && approved === total
    ? "approved"
    : approved > 0
      ? "partially_approved"
      : "review";
  await sqlClient`
    UPDATE content.generation_runs
    SET status = ${runStatus}::generation_run_status, updated_at = now()
    WHERE id = ${runId}::uuid
  `;
}

router.use(authenticate);

router.patch("/items/bulk", requireAdminPermission("content.generation.review"), async (req, res) => {
  const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds.map(text).filter(Boolean) : [];
  if (rawIds.length > MAX_BULK_REVIEW_ITEMS) {
    res.status(400).json({
      error: `At most ${MAX_BULK_REVIEW_ITEMS} generated items can be reviewed in one request`,
      code: "TOO_MANY_REVIEW_ITEMS",
    });
    return;
  }
  const invalidIds = rawIds.filter((id) => !UUID_RE.test(id));
  if (invalidIds.length > 0) {
    res.status(400).json({
      error: "All generated item IDs must be valid UUIDs",
      code: "INVALID_GENERATION_ITEM_ID",
      invalidItemIds: invalidIds,
    });
    return;
  }
  const itemIds = [...new Set(rawIds)];
  const expectedStatuses = req.body?.expectedStatuses && typeof req.body.expectedStatuses === "object"
    && !Array.isArray(req.body.expectedStatuses)
    ? req.body.expectedStatuses as Record<string, unknown>
    : {};
  const missingExpectedStatusIds = itemIds.filter((id) => !STATUSES.has(text(expectedStatuses[id])));
  if (missingExpectedStatusIds.length > 0) {
    res.status(400).json({
      error: "Expected current status is required for every generated item",
      code: "EXPECTED_REVIEW_STATUS_REQUIRED",
      itemIds: missingExpectedStatusIds,
    });
    return;
  }
  const status = text(req.body?.status);
  const reason = text(req.body?.reason).slice(0, 1000);
  const actorUserId = req.adminSession?.user.id;

  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required" });
    return;
  }
  if (itemIds.length === 0) {
    res.status(400).json({ error: "At least one valid generated item is required", code: "ITEMS_REQUIRED" });
    return;
  }
  if (!STATUSES.has(status)) {
    res.status(400).json({ error: "Invalid generated-item status", code: "INVALID_ITEM_STATUS" });
    return;
  }
  if ((status === "needs_fix" || status === "rejected") && !reason) {
    res.status(400).json({ error: "A reason is required for this action", code: "REASON_REQUIRED" });
    return;
  }

  const results: ItemResult[] = [];
  const affectedRunIds = new Set<string>();
  const converted: ConvertedQuestion[] = [];

  for (const itemId of itemIds) {
    try {
      const result = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT
            i.id::text AS id,
            i.generation_run_id::text AS "generationRunId",
            i.status::text AS status,
            i.accepted_question_id::text AS "acceptedQuestionId",
            r.status::text AS "runStatus",
            v.payload
          FROM content.generation_run_items i
          INNER JOIN content.generation_runs r
            ON r.id = i.generation_run_id
          LEFT JOIN content.generation_item_versions v
            ON v.generation_item_id = i.id
           AND v.version_number = i.current_version_number
          WHERE i.id = ${itemId}::uuid
          FOR UPDATE OF i
        `;
        const item = rows[0];
        if (!item) throw Object.assign(new Error("Generated item not found"), { code: "ITEM_NOT_FOUND" });
        const expectedStatus = text(expectedStatuses[itemId]);
        if (String(item.status) !== expectedStatus) {
          throw Object.assign(
            new Error(`Generated item changed from ${expectedStatus} to ${String(item.status)}; refresh before reviewing`),
            {
              code: "GENERATION_ITEM_STATUS_CONFLICT",
              expectedStatus,
              currentStatus: String(item.status),
            },
          );
        }

        if (String(item.runStatus) === "cancelled") {
          throw Object.assign(
            new Error("Cancelled generation runs are immutable"),
            { code: "GENERATION_RUN_CANCELLED" },
          );
        }
        if (item.acceptedQuestionId) {
          throw Object.assign(
            new Error("Generated item is already converted to Question Bank; review the canonical question instead"),
            { code: "ITEM_ALREADY_CONVERTED" },
          );
        }

        if (String(item.status) === status) {
          throw Object.assign(
            new Error(`Generated item is already ${status.replaceAll("_", " ")}`),
            { code: "NO_REVIEW_STATUS_CHANGE" },
          );
        }

        if (status === "approved") {
          const quality = analyzeGeneratedQuestionPayload(item.payload);
          if (!quality.readyForApproval) {
            throw Object.assign(
              new Error("Generated item failed the transactional approval quality gate"),
              {
                code: "QUESTION_STUDIO_QUALITY_BLOCKED",
                quality,
              },
            );
          }

          const payload = item.payload && typeof item.payload === "object"
            ? item.payload as Record<string, unknown>
            : {};
          const sourceStem = text(payload.text) || text(payload.stem);
          const sourceFingerprint = text(payload.contentFingerprint) || null;
          const duplicates = sourceStem
            ? await tx`
                WITH current_payloads AS (
                  SELECT
                    other.id,
                    run.public_code AS "runCode",
                    NULLIF(version.payload ->> 'contentFingerprint', '') AS fingerprint,
                    LOWER(
                      REGEXP_REPLACE(
                        TRIM(COALESCE(NULLIF(version.payload ->> 'text', ''), version.payload ->> 'stem', '')),
                        '[[:space:][:punct:]]+',
                        ' ',
                        'g'
                      )
                    ) AS "normalizedStem"
                  FROM content.generation_run_items other
                  INNER JOIN content.generation_runs run
                    ON run.id = other.generation_run_id
                  INNER JOIN content.generation_item_versions version
                    ON version.generation_item_id = other.id
                   AND version.version_number = other.current_version_number
                  WHERE other.id <> ${itemId}::uuid
                )
                SELECT
                  current_payloads.id::text AS "matchedItemId",
                  current_payloads."runCode" AS "matchedRunCode"
                FROM current_payloads
                WHERE current_payloads."normalizedStem" = LOWER(
                  REGEXP_REPLACE(TRIM(${sourceStem}), '[[:space:][:punct:]]+', ' ', 'g')
                )
                  AND (
                    ${sourceFingerprint}::text IS NULL
                    OR current_payloads.fingerprint IS NULL
                    OR current_payloads.fingerprint = ${sourceFingerprint}
                  )
                LIMIT 1
              `
            : [];

          if (duplicates.length > 0) {
            throw Object.assign(
              new Error("Generated item is an exact duplicate of an existing generated question"),
              {
                code: "QUESTION_STUDIO_DUPLICATE_BLOCKED",
                duplicate: {
                  matchedItemId: String(duplicates[0]?.matchedItemId ?? ""),
                  matchedRunCode: String(duplicates[0]?.matchedRunCode ?? ""),
                  similarity: 1,
                  exact: true,
                },
              },
            );
          }
        }

        if (String(item.status) === "approved" && status !== "approved" && !reason) {
          throw Object.assign(
            new Error("A reason is required to reopen an approved review-only item"),
            { code: "APPROVED_REOPEN_REASON_REQUIRED" },
          );
        }

        await tx`
          UPDATE content.generation_run_items
          SET status = ${status}::generation_item_status,
              retry_reason = ${reason || null},
              reviewer_user_id = ${actorUserId}::uuid,
              updated_at = now()
          WHERE id = ${itemId}::uuid
        `;

        let approvalMode: GeneratedItemApprovalMode | null = null;
        let conversionSkippedReason: string | null = null;
        let convertedQuestion: ConvertedQuestion | null = null;
        if (status === "approved") {
          const disposition = getGeneratedItemApprovalDisposition(item.payload);
          approvalMode = disposition.mode;
          conversionSkippedReason = disposition.reason;

          if (disposition.mode === "question_bank") {
            convertedQuestion = await convertApprovedGenerationItem(
              tx as QuestionSqlExecutor,
              itemId,
              actorUserId,
            );
            if (!convertedQuestion) {
              throw Object.assign(new Error("Approved item could not be converted to Question Bank"), { code: "CONVERSION_FAILED" });
            }
          }
        }

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type,
            entity_id, entity_version_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${`question_studio.generated_item.${status}`},
            'generation_item',
            ${itemId}::uuid,
            ${convertedQuestion?.questionVersionId ?? null}::uuid,
            ${reason || conversionSkippedReason || null},
            ${approvalMode === "review_only"
              ? `Generated item approved for editorial review only from ${String(item.status)}`
              : `Generated item moved from ${String(item.status)} to ${status}`},
            ${tx.json({
              previousStatus: item.status,
              status,
              approvalMode,
              conversionSkippedReason,
              questionId: convertedQuestion?.questionId ?? null,
              questionVersionId: convertedQuestion?.questionVersionId ?? null,
            })}
          )
        `;

        return {
          itemId,
          generationRunId: String(item.generationRunId),
          previousStatus: String(item.status),
          status,
          ok: true,
          approvalMode,
          conversionSkippedReason,
          convertedQuestion,
        } satisfies ItemResult;
      });
      results.push(result);
      if (result.generationRunId) affectedRunIds.add(result.generationRunId);
      if (result.convertedQuestion) converted.push(result.convertedQuestion);
    } catch (error) {
      results.push(failure(itemId, error));
    }
  }

  for (const runId of affectedRunIds) {
    try {
      await refreshRunStatus(runId);
    } catch (error) {
      console.error("Unable to refresh generation run status", runId, error);
    }
  }

  const succeeded = results.filter((result) => result.ok).length;
  const failed = results.length - succeeded;
  res.json({
    items: results.filter((result) => result.ok).map((result) => ({
      id: result.itemId,
      generationRunId: result.generationRunId,
      previousStatus: result.previousStatus,
      status: result.status,
      approvalMode: result.approvalMode ?? null,
      conversionSkippedReason: result.conversionSkippedReason ?? null,
      convertedQuestion: result.convertedQuestion ?? null,
    })),
    updatedCount: succeeded,
    converted,
    convertedCount: converted.length,
    reviewOnlyApprovedCount: results.filter(
      (result) => result.ok && result.approvalMode === "review_only",
    ).length,
    attempted: results.length,
    succeeded,
    failed,
    results,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
