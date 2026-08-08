import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
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
            'locale', v.payload -> 'locale',
            'seed', v.payload -> 'seed',
            'runtimeMode', v.payload -> 'runtimeMode',
            'reviewStatus', v.payload -> 'reviewStatus',
            'questionBankStatus', v.payload -> 'questionBankStatus',
            'questionBankWritable', v.payload -> 'questionBankWritable',
            'testEligibility', v.payload -> 'testEligibility',
            'testEligible', v.payload -> 'testEligible',
            'publiclyPublishable', v.payload -> 'publiclyPublishable',
            'generationContext', v.payload -> 'generationContext'
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
      console.error("Question Studio lifecycle dashboard failed", error);
      res.status(500).json({ error: "Unable to load Question Studio dashboard" });
    }
  },
);

export default router;
