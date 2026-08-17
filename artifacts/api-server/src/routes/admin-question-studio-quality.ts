import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { analyzeGeneratedQuestionPayload } from "../lib/question-studio-quality";
import { authenticate } from "../middlewares/auth";

const router = Router();

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPayloadRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

router.use(authenticate);

router.patch(
  "/items/bulk",
  requireAdminPermission("content.generation.review"),
  async (req: Request, res: Response, next: NextFunction) => {
    if (asString(req.body?.status) !== "approved") {
      next();
      return;
    }

    const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds : [];
    const itemIds = [...new Set(rawIds.map(asString).filter(Boolean))].slice(0, 100);
    if (itemIds.length === 0) {
      next();
      return;
    }

    try {
      const rows = await sqlClient`
        SELECT
          i.id::text AS id,
          i.item_number AS "itemNumber",
          r.public_code AS "runCode",
          v.payload
        FROM content.generation_run_items i
        INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id
         AND v.version_number = i.current_version_number
        WHERE i.id = ANY(${itemIds}::uuid[])
      `;

      const blocked = rows
        .map((row) => ({
          itemId: String(row.id),
          itemNumber: Number(row.itemNumber),
          runCode: String(row.runCode),
          quality: analyzeGeneratedQuestionPayload(row.payload),
        }))
        .filter((entry) => !entry.quality.readyForApproval);

      if (blocked.length > 0) {
        res.status(422).json({
          error: `${blocked.length} selected item(s) failed the Question Studio quality gate.`,
          code: "QUESTION_STUDIO_QUALITY_BLOCKED",
          blocked,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("Question Studio approval quality gate failed", error);
      res.status(500).json({ error: "Unable to validate generated items before approval" });
    }
  },
);

router.patch(
  "/items/:itemId/revision",
  requireAdminPermission("content.generation.review"),
  async (req, res) => {
    const itemId = asString(req.params.itemId);
    const actorUserId = req.adminSession?.user.id;
    const stem = asString(req.body?.stem);
    const explanation = asString(req.body?.explanation);
    const options = Array.isArray(req.body?.options)
      ? req.body.options.map((entry: unknown) => String(entry ?? "").trim())
      : [];
    const correctIndex = Number(req.body?.correctIndex);
    const changeReason = asString(req.body?.changeReason);

    if (!itemId) {
      res.status(400).json({ error: "Generated item is required" });
      return;
    }
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    if (!changeReason) {
      res.status(400).json({ error: "A revision reason is required" });
      return;
    }

    try {
      const result = await sqlClient.begin(async (tx) => {
        const currentRows = await tx`
          SELECT
            i.id,
            i.generation_run_id AS "generationRunId",
            i.item_number AS "itemNumber",
            i.current_version_number AS "currentVersionNumber",
            i.accepted_question_id AS "acceptedQuestionId",
            v.payload,
            r.public_code AS "runCode"
          FROM content.generation_run_items i
          INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
          INNER JOIN content.generation_item_versions v
            ON v.generation_item_id = i.id
           AND v.version_number = i.current_version_number
          WHERE i.id = ${itemId}::uuid
          FOR UPDATE OF i
        `;

        const current = currentRows[0];
        if (!current) {
          return { kind: "missing" as const };
        }
        if (current.acceptedQuestionId) {
          return { kind: "converted" as const };
        }

        const previousPayload = asPayloadRecord(current.payload);
        if (asString(previousPayload.revisionPolicy) === "SOURCE_GENERATOR_ONLY") {
          return { kind: "source_controlled" as const };
        }

        const nextPayload = {
          ...previousPayload,
          text: stem,
          stem,
          explanation,
          options,
          correctIndex,
          correct: correctIndex,
          validationResult: "editorial_revision",
        };
        const quality = analyzeGeneratedQuestionPayload(nextPayload);
        if (!quality.readyForApproval) {
          return { kind: "quality" as const, quality };
        }

        const nextVersionNumber = Number(current.currentVersionNumber) + 1;
        const versionId = randomUUID();

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
            ${nextVersionNumber},
            ${tx.json(nextPayload)},
            ${asString(previousPayload.questionId) || null},
            now()
          )
        `;

        await tx`
          UPDATE content.generation_run_items
          SET
            current_version_number = ${nextVersionNumber},
            status = 'unreviewed'::generation_item_status,
            retry_reason = NULL,
            reviewer_user_id = ${actorUserId}::uuid,
            updated_at = now()
          WHERE id = ${itemId}::uuid
        `;

        await tx`
          UPDATE content.generation_runs
          SET status = 'review'::generation_run_status, updated_at = now()
          WHERE id = ${String(current.generationRunId)}::uuid
            AND status <> 'cancelled'::generation_run_status
        `;

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
            'question_studio.generated_item.revised',
            'generation_item',
            ${itemId}::uuid,
            ${versionId}::uuid,
            ${changeReason},
            ${`Created revision ${nextVersionNumber} for generated item ${Number(current.itemNumber)}`},
            ${tx.json({
              firebaseUid: req.user?.id,
              runCode: current.runCode,
              previousVersionNumber: Number(current.currentVersionNumber),
              versionNumber: nextVersionNumber,
              qualityScore: quality.score,
            })}
          )
        `;

        return {
          kind: "updated" as const,
          item: {
            id: itemId,
            generationRunId: String(current.generationRunId),
            itemNumber: Number(current.itemNumber),
            currentVersionNumber: nextVersionNumber,
            status: "unreviewed",
            versionId,
            payload: nextPayload,
          },
          quality,
        };
      });

      if (result.kind === "missing") {
        res.status(404).json({ error: "Generated item not found" });
        return;
      }
      if (result.kind === "converted") {
        res.status(409).json({
          error: "This generated item is already in Question Bank. Edit the canonical question instead.",
          code: "GENERATION_ITEM_ALREADY_CONVERTED",
        });
        return;
      }
      if (result.kind === "source_controlled") {
        res.status(409).json({
          error: "This Question Studio package is source-controlled. Mark the item Needs fix, correct its generator/localization source, then regenerate it.",
          code: "SOURCE_GENERATOR_ONLY",
          revisionPolicy: "SOURCE_GENERATOR_ONLY",
        });
        return;
      }
      if (result.kind === "quality") {
        res.status(422).json({
          error: "Revision still contains approval-blocking quality issues.",
          code: "QUESTION_STUDIO_REVISION_BLOCKED",
          quality: result.quality,
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error("Question Studio item revision failed", error);
      const message = error instanceof Error ? error.message : "Unable to revise generated item";
      res.status(422).json({ error: message });
    }
  },
);

export default router;
