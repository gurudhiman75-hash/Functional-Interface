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
import { authenticate } from "../middlewares/auth";

const router = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const STATUSES = new Set(["unreviewed", "needs_fix", "approved", "rejected"]);

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
  const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds : [];
  const itemIds = [...new Set(rawIds.map(text).filter((id) => UUID_RE.test(id)))].slice(0, 500);
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
            v.payload
          FROM content.generation_run_items i
          LEFT JOIN content.generation_item_versions v
            ON v.generation_item_id = i.id
           AND v.version_number = i.current_version_number
          WHERE i.id = ${itemId}::uuid
          FOR UPDATE OF i
        `;
        const item = rows[0];
        if (!item) throw Object.assign(new Error("Generated item not found"), { code: "ITEM_NOT_FOUND" });
        if (status === "approved" && item.acceptedQuestionId) {
          throw Object.assign(new Error("Generated item is already converted to Question Bank"), { code: "ITEM_ALREADY_CONVERTED" });
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
