import { randomUUID } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { analyzeGeneratedQuestionPayload } from "../lib/question-studio-quality";
import { getRegenerationEligibility } from "../lib/question-studio-regeneration";
import { authenticate } from "../middlewares/auth";
import {
  buildWor001QuestionStudioPayload,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-payload";
import {
  WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  previewWor001QuestionStudioReview,
  type WorQuestionStudioDifficulty,
  type WorQuestionStudioLanguage,
} from "../reasoning-v1/topics/Word-Dictionary-Order/WOR-001/question-studio-review";

const router = Router();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function isWorPayload(value: unknown): boolean {
  const payload = asRecord(value);
  return asString(payload.integrationAuthority) === WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY
    || asString(payload.packageId) === "WOR-001";
}

router.use(authenticate);

router.patch(
  "/items/:itemId/revision",
  requireAdminPermission("content.generation.review"),
  async (req: Request, res: Response, next: NextFunction) => {
    const itemId = asString(req.params.itemId);
    if (!UUID_RE.test(itemId)) {
      next();
      return;
    }
    try {
      const rows = await sqlClient`
        SELECT v.payload
        FROM content.generation_run_items i
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id
         AND v.version_number = i.current_version_number
        WHERE i.id = ${itemId}::uuid
        LIMIT 1
      `;
      if (!rows[0] || !isWorPayload(rows[0].payload)) {
        next();
        return;
      }
      res.status(409).json({
        error: "WOR-001 questions are source-controlled. Mark the item Needs fix, correct the WOR generator/localization source, then regenerate it so independent verification remains valid.",
        code: "WOR_SOURCE_GENERATOR_ONLY",
        revisionPolicy: "SOURCE_GENERATOR_ONLY",
      });
    } catch (error) {
      console.error("WOR-001 revision-policy check failed", error);
      res.status(500).json({ error: "Unable to validate WOR-001 revision policy." });
    }
  },
);

router.post(
  "/items/regenerate",
  requireAdminPermission("content.generation.run"),
  async (req: Request, res: Response, next: NextFunction) => {
    const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds : [];
    const itemIds = [...new Set(rawIds.map(asString).filter((id) => UUID_RE.test(id)))].slice(0, 50);
    if (itemIds.length === 0) {
      next();
      return;
    }

    try {
      const rows = await sqlClient`
        SELECT
          i.id::text AS id,
          i.status::text AS status,
          i.current_version_number AS "currentVersionNumber",
          i.accepted_question_id::text AS "acceptedQuestionId",
          i.generation_run_id::text AS "generationRunId",
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
      const worRows = rows.filter((row) => isWorPayload(row.payload));
      if (worRows.length === 0) {
        next();
        return;
      }
      if (worRows.length !== rows.length || rows.length !== itemIds.length) {
        res.status(409).json({
          error: "Regenerate WOR-001 items separately from other Question Studio packages so each item is routed to the correct generation engine.",
          code: "MIXED_GENERATION_ENGINES",
        });
        return;
      }

      const actorUserId = req.adminSession?.user.id;
      const reason = asString(req.body?.reason);
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      if (!reason) {
        res.status(400).json({ error: "A regeneration reason is required" });
        return;
      }

      const skipped: Array<{ itemId: string; code: string; message: string }> = [];
      const failed: Array<{ itemId: string; message: string }> = [];
      const prepared: Array<{
        itemId: string;
        generationRunId: string;
        itemNumber: number;
        runCode: string;
        currentVersionNumber: number;
        payload: Record<string, unknown>;
        providerItemId: string;
        quality: ReturnType<typeof analyzeGeneratedQuestionPayload>;
        seed: string;
      }> = [];

      for (const row of worRows) {
        const itemId = String(row.id);
        const eligibility = getRegenerationEligibility(
          String(row.status),
          row.acceptedQuestionId ? String(row.acceptedQuestionId) : null,
        );
        if (!eligibility.eligible) {
          skipped.push({ itemId, code: eligibility.code, message: eligibility.message });
          continue;
        }

        const sourcePayload = asRecord(row.payload);
        const language = (asString(sourcePayload.language) || "en") as WorQuestionStudioLanguage;
        const difficulty = asString(sourcePayload.difficultyLabel) as WorQuestionStudioDifficulty;
        const prototypeId = asString(sourcePayload.prototypeId) || asString(sourcePayload.patternId);
        const seed = [
          "wor-001-regeneration",
          String(row.runCode),
          itemId,
          Number(row.currentVersionNumber) + 1,
          randomUUID(),
        ].join(":");

        try {
          const generated = previewWor001QuestionStudioReview({
            language,
            prototypeId,
            difficulty: difficulty || undefined,
            seed,
            count: 1,
          }).questions[0];
          if (!generated) throw new Error("WOR-001 generator returned no replacement question.");
          const regeneratedAt = new Date().toISOString();
          const payload = buildWor001QuestionStudioPayload(generated, {
            sourceVersionNumber: Number(row.currentVersionNumber),
            sourceRunCode: String(row.runCode),
            reason,
            regeneratedAt,
          });
          prepared.push({
            itemId,
            generationRunId: String(row.generationRunId),
            itemNumber: Number(row.itemNumber),
            runCode: String(row.runCode),
            currentVersionNumber: Number(row.currentVersionNumber),
            payload,
            providerItemId: generated.questionLanguageId,
            quality: analyzeGeneratedQuestionPayload(payload),
            seed,
          });
        } catch (error) {
          failed.push({
            itemId,
            message: error instanceof Error ? error.message : "WOR-001 regeneration failed.",
          });
        }
      }

      if (prepared.length === 0) {
        res.status(422).json({
          error: "No selected WOR-001 items could be regenerated.",
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
              status::text AS status,
              current_version_number AS "currentVersionNumber",
              accepted_question_id::text AS "acceptedQuestionId"
            FROM content.generation_run_items
            WHERE id = ${candidate.itemId}::uuid
            FOR UPDATE
          `;
          const current = currentRows[0];
          if (!current) {
            writeSkipped.push({ itemId: candidate.itemId, code: "NOT_FOUND_DURING_WRITE", message: "Generated item disappeared before regeneration was saved." });
            continue;
          }
          const eligibility = getRegenerationEligibility(
            String(current.status),
            current.acceptedQuestionId ? String(current.acceptedQuestionId) : null,
          );
          if (!eligibility.eligible) {
            writeSkipped.push({ itemId: candidate.itemId, code: eligibility.code, message: eligibility.message });
            continue;
          }
          if (Number(current.currentVersionNumber) !== candidate.currentVersionNumber) {
            writeSkipped.push({ itemId: candidate.itemId, code: "STALE_VERSION", message: "A newer revision already exists. Refresh before regenerating again." });
            continue;
          }

          const nextVersionNumber = candidate.currentVersionNumber + 1;
          const versionId = randomUUID();
          await tx`
            INSERT INTO content.generation_item_versions (
              id, generation_item_id, version_number, payload, provider_item_id, created_at
            ) VALUES (
              ${versionId}::uuid, ${candidate.itemId}::uuid, ${nextVersionNumber},
              ${tx.json(candidate.payload)}, ${candidate.providerItemId}, now()
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
            WHERE id = ${candidate.itemId}::uuid
          `;
          await tx`
            INSERT INTO platform.audit_events (
              id, actor_type, actor_user_id, action_key, entity_type, entity_id,
              entity_version_id, reason, summary, metadata
            ) VALUES (
              ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
              'question_studio.wor_001_item.regenerated', 'generation_item', ${candidate.itemId}::uuid,
              ${versionId}::uuid, ${reason},
              ${`Regenerated WOR-001 item ${candidate.itemNumber} in ${candidate.runCode}`},
              ${tx.json({
                integrationAuthority: WOR_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
                previousVersionNumber: candidate.currentVersionNumber,
                versionNumber: nextVersionNumber,
                seed: candidate.seed,
                qualityScore: candidate.quality.score,
                questionBankWritable: false,
                testEligible: false,
              })}
            )
          `;
          await tx`
            INSERT INTO platform.outbox_events (
              id, aggregate_type, aggregate_id, event_type, payload
            ) VALUES (
              ${randomUUID()}::uuid, 'generation_item', ${candidate.itemId}::uuid,
              'question_studio.wor_001_item.regenerated',
              ${tx.json({
                itemId: candidate.itemId,
                generationRunId: candidate.generationRunId,
                versionNumber: nextVersionNumber,
                packageId: "WOR-001",
              })}
            )
          `;
          changedRunIds.add(candidate.generationRunId);
          regenerated.push({
            itemId: candidate.itemId,
            generationRunId: candidate.generationRunId,
            runCode: candidate.runCode,
            itemNumber: candidate.itemNumber,
            previousVersionNumber: candidate.currentVersionNumber,
            currentVersionNumber: nextVersionNumber,
            versionId,
            quality: candidate.quality,
          });
        }

        for (const runId of changedRunIds) {
          await tx`
            UPDATE content.generation_runs
            SET status = 'review'::generation_run_status,
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
      console.error("WOR-001 Question Studio regeneration failed", error);
      res.status(422).json({
        error: error instanceof Error ? error.message : "Unable to regenerate WOR-001 items.",
      });
    }
  },
);

export default router;
