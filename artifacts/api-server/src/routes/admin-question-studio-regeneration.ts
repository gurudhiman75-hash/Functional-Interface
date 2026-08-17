import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { analyzeGeneratedQuestionPayload } from "../lib/question-studio-quality";
import {
  buildRegenerationPayload,
  buildRegenerationRequest,
  getRegenerationEligibility,
  type RegenerationSource,
} from "../lib/question-studio-regeneration";
import { authenticate } from "../middlewares/auth";
import { generateQuestion as generateQuestionStudioQuestion } from "../question-studio/shared-generation-engine";

const router = Router();

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

router.use(authenticate);

router.post(
  "/items/regenerate",
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds : [];
    const itemIds = [...new Set(rawIds.map(asString).filter(Boolean))].slice(0, 50);
    const reason = asString(req.body?.reason);
    const actorUserId = req.adminSession?.user.id;

    if (itemIds.length === 0) {
      res.status(400).json({ error: "At least one generated item is required" });
      return;
    }
    if (!reason) {
      res.status(400).json({ error: "A regeneration reason is required" });
      return;
    }
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }

    try {
      const rows = await sqlClient`
        SELECT
          i.id::text AS id,
          i.status,
          i.current_version_number AS "currentVersionNumber",
          i.accepted_question_id::text AS "acceptedQuestionId",
          i.generation_run_id::text AS "generationRunId",
          i.item_number AS "itemNumber",
          r.public_code AS "runCode",
          r.request_snapshot AS "requestSnapshot",
          v.payload
        FROM content.generation_run_items i
        INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id
         AND v.version_number = i.current_version_number
        WHERE i.id = ANY(${itemIds}::uuid[])
      `;

      const rowById = new Map(rows.map((row) => [String(row.id), row]));
      const skipped: Array<{ itemId: string; code: string; message: string }> = [];
      const failed: Array<{ itemId: string; message: string }> = [];
      const prepared: Array<{
        source: RegenerationSource & { generationRunId: string; itemNumber: number };
        payload: Record<string, unknown>;
        providerItemId: string | null;
        quality: ReturnType<typeof analyzeGeneratedQuestionPayload>;
        seed: string;
      }> = [];

      for (const itemId of itemIds) {
        const row = rowById.get(itemId);
        if (!row) {
          skipped.push({ itemId, code: "NOT_FOUND", message: "Generated item not found." });
          continue;
        }

        const source: RegenerationSource & { generationRunId: string; itemNumber: number } = {
          itemId,
          status: String(row.status),
          acceptedQuestionId: row.acceptedQuestionId ? String(row.acceptedQuestionId) : null,
          currentVersionNumber: Number(row.currentVersionNumber),
          runCode: String(row.runCode),
          requestSnapshot: asRecord(row.requestSnapshot),
          payload: asRecord(row.payload),
          generationRunId: String(row.generationRunId),
          itemNumber: Number(row.itemNumber),
        };
        const eligibility = getRegenerationEligibility(source.status, source.acceptedQuestionId);
        if (!eligibility.eligible) {
          skipped.push({ itemId, code: eligibility.code, message: eligibility.message });
          continue;
        }

        const seed = [
          "question-studio-regeneration",
          source.runCode,
          source.itemId,
          source.currentVersionNumber + 1,
          randomUUID(),
        ].join(":");

        try {
          const request = buildRegenerationRequest(source, seed);
          const generated = await generateQuestionStudioQuestion(request);
          const generatedQuestion = Array.isArray(generated.questions)
            ? generated.questions[0]
            : null;
          if (!generatedQuestion || typeof generatedQuestion !== "object") {
            failed.push({ itemId, message: "The generation engine returned no replacement question." });
            continue;
          }

          const regeneratedAt = new Date().toISOString();
          const payload = buildRegenerationPayload(
            generatedQuestion as Record<string, unknown>,
            generated.generationContext,
            source,
            reason,
            regeneratedAt,
          );
          prepared.push({
            source,
            payload,
            providerItemId: asString((generatedQuestion as Record<string, unknown>).questionId) || null,
            quality: analyzeGeneratedQuestionPayload(payload),
            seed,
          });
        } catch (error) {
          failed.push({
            itemId,
            message: error instanceof Error ? error.message : "Question regeneration failed.",
          });
        }
      }

      if (prepared.length === 0) {
        res.status(422).json({
          error: "No selected generated items could be regenerated.",
          regenerated: [],
          regeneratedCount: 0,
          skipped,
          failed,
        });
        return;
      }

      const writeResult = await sqlClient.begin(async (tx) => {
        const regenerated: Array<{
          itemId: string;
          generationRunId: string;
          runCode: string;
          itemNumber: number;
          previousVersionNumber: number;
          currentVersionNumber: number;
          versionId: string;
          quality: ReturnType<typeof analyzeGeneratedQuestionPayload>;
        }> = [];
        const writeSkipped: Array<{ itemId: string; code: string; message: string }> = [];
        const changedRunIds = new Set<string>();

        for (const candidate of prepared) {
          const currentRows = await tx`
            SELECT
              status,
              current_version_number AS "currentVersionNumber",
              accepted_question_id::text AS "acceptedQuestionId"
            FROM content.generation_run_items
            WHERE id = ${candidate.source.itemId}::uuid
            FOR UPDATE
          `;
          const current = currentRows[0];
          if (!current) {
            writeSkipped.push({
              itemId: candidate.source.itemId,
              code: "NOT_FOUND_DURING_WRITE",
              message: "Generated item disappeared before its replacement was saved.",
            });
            continue;
          }

          const eligibility = getRegenerationEligibility(
            String(current.status),
            current.acceptedQuestionId ? String(current.acceptedQuestionId) : null,
          );
          if (!eligibility.eligible) {
            writeSkipped.push({
              itemId: candidate.source.itemId,
              code: eligibility.code,
              message: eligibility.message,
            });
            continue;
          }
          if (Number(current.currentVersionNumber) !== candidate.source.currentVersionNumber) {
            writeSkipped.push({
              itemId: candidate.source.itemId,
              code: "STALE_VERSION",
              message: "A newer revision already exists. Refresh before regenerating again.",
            });
            continue;
          }

          const nextVersionNumber = candidate.source.currentVersionNumber + 1;
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
              ${candidate.source.itemId}::uuid,
              ${nextVersionNumber},
              ${tx.json(candidate.payload)},
              ${candidate.providerItemId},
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
            WHERE id = ${candidate.source.itemId}::uuid
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
              'question_studio.generated_item.regenerated',
              'generation_item',
              ${candidate.source.itemId}::uuid,
              ${versionId}::uuid,
              ${reason},
              ${`Regenerated item ${candidate.source.itemNumber} in ${candidate.source.runCode}`},
              ${tx.json({
                firebaseUid: req.user?.id,
                previousVersionNumber: candidate.source.currentVersionNumber,
                versionNumber: nextVersionNumber,
                seed: candidate.seed,
                qualityScore: candidate.quality.score,
                qualityReadyForApproval: candidate.quality.readyForApproval,
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
              'generation_item',
              ${candidate.source.itemId}::uuid,
              'question_studio.generated_item.regenerated',
              ${tx.json({
                itemId: candidate.source.itemId,
                generationRunId: candidate.source.generationRunId,
                versionNumber: nextVersionNumber,
              })}
            )
          `;

          changedRunIds.add(candidate.source.generationRunId);
          regenerated.push({
            itemId: candidate.source.itemId,
            generationRunId: candidate.source.generationRunId,
            runCode: candidate.source.runCode,
            itemNumber: candidate.source.itemNumber,
            previousVersionNumber: candidate.source.currentVersionNumber,
            currentVersionNumber: nextVersionNumber,
            versionId,
            quality: candidate.quality,
          });
        }

        for (const runId of changedRunIds) {
          await tx`
            UPDATE content.generation_runs
            SET
              status = 'review'::generation_run_status,
              attempt_number = attempt_number + 1,
              failure_reason = NULL,
              updated_at = now()
            WHERE id = ${runId}::uuid
              AND status <> 'cancelled'::generation_run_status
          `;
        }

        return { regenerated, writeSkipped };
      });

      res.json({
        regenerated: writeResult.regenerated,
        regeneratedCount: writeResult.regenerated.length,
        skipped: [...skipped, ...writeResult.writeSkipped],
        failed,
      });
    } catch (error) {
      console.error("Question Studio regeneration failed", error);
      const message = error instanceof Error ? error.message : "Unable to regenerate generated items";
      res.status(422).json({ error: message });
    }
  },
);

export default router;
