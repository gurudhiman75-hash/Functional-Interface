import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  generateQuestion,
  isDsf001NormalQuestionStudioRequest,
} from "../question-studio/shared-generation-engine-sri";
import { DSF_CP017_QUESTION_STUDIO_AUTHORITY } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-017/question-studio-review-v1";

const router = Router();
const LANGUAGES = new Set(["en"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function normalizeLanguage(value: unknown): "en" {
  const language = asString(value).toLowerCase() || "en";
  if (!LANGUAGES.has(language)) {
    throw new Error(
      `The current DSF normal-workflow breadth supports English only. '${language}' remains on the existing approved localization route.`,
    );
  }
  return "en";
}

function normalizeDifficulty(value: unknown): "Easy" | "Medium" | "Hard" | undefined {
  const raw = asString(value);
  if (!raw) return undefined;
  if (raw.toLowerCase() === "moderate") return "Medium";
  if (!DIFFICULTIES.has(raw)) throw new Error(`Unsupported Data Sufficiency difficulty '${raw}'.`);
  return raw as "Easy" | "Medium" | "Hard";
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `DSF-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function assertReviewOnlyPayload(question: Record<string, unknown>): void {
  if (question.questionStudioDiscoverable !== true || question.persistenceAllowed !== true || question.reviewOnly !== true) {
    throw new Error("DSF CP017 attempted to persist a question outside the normal Question Studio review lifecycle.");
  }
  if (
    question.questionBankWritable !== false
    || question.testEligible !== false
    || question.mockTestEligible !== false
    || question.publiclyPublishable !== false
    || question.automaticStudentPublication !== false
  ) {
    throw new Error("DSF CP017 attempted to persist a question with downstream learner-release gates open.");
  }
}

router.use(authenticate);

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  if (!isDsf001NormalQuestionStudioRequest(req.body ?? {})) {
    next();
    return;
  }

  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required." });
      return;
    }

    const count = asCount(req.body?.count, 5, 50);
    const language = normalizeLanguage(req.body?.language);
    const difficulty = normalizeDifficulty(req.body?.difficulty);
    const seed = asString(req.body?.seed) || `dsf-normal-review-${Date.now()}`;
    const packageId = "DSF-001";
    const patternId = asString(req.body?.patternId) || "DSF-QL-001";
    const canonicalProblemId = asString(req.body?.canonicalProblemId) || undefined;
    const cpId = asString(req.body?.cpId) || undefined;
    const exam = asString(req.body?.exam) || "SSC CGL";
    const subject = "Reasoning Ability";
    const topic = "Reasoning";
    const subtopic = "Data Sufficiency";

    const requestSnapshot = {
      exam,
      subject,
      topic,
      subtopic,
      difficulty: difficulty ?? "Mixed",
      count,
      packageId,
      patternId,
      canonicalProblemId,
      cpId,
      language,
      seed,
      integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
      requestedByFirebaseUid: req.user?.id,
    };

    const result = await generateQuestion({
      packageId,
      patternId,
      topic,
      subtopic,
      canonicalProblemId,
      cpId,
      difficulty,
      language,
      seed,
      count,
    });
    const generatedQuestions = Array.isArray((result as any).questions) ? (result as any).questions as Record<string, unknown>[] : [];
    if (!generatedQuestions.length) {
      res.status(422).json({ error: "The DSF Question Studio engine returned no questions." });
      return;
    }

    for (const question of generatedQuestions) assertReviewOnlyPayload(question);

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
          'examtree', 'reasoning-v1-dsf-cp017-normal-review-v1', 0, 0, 0, 0,
          ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
        )
      `;

      for (let index = 0; index < generatedQuestions.length; index += 1) {
        const question = generatedQuestions[index]!;
        const itemId = randomUUID();
        const versionId = randomUUID();
        const payload = {
          ...question,
          generationContext: (result as any).generationContext,
          validationResult: "pending",
        };
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
            ${asString(question.questionId) || null}, ${timestamp}
          )
        `;
      }

      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'question_studio.data_sufficiency_normal_run.created', 'generation_run', ${runId}::uuid,
          'DSF CP017 entered the standard Question Studio review lifecycle; downstream release gates remain locked',
          ${`Created ${generatedQuestions.length} Data Sufficiency review items in ${publicCode}`},
          ${JSON.stringify({
            requestSnapshot,
            integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
            reviewOnly: true,
            questionBankWritable: false,
            testEligible: false,
            mockTestEligible: false,
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
          'question_studio.data_sufficiency_normal_run.created',
          ${JSON.stringify({
            runId,
            publicCode,
            itemCount: generatedQuestions.length,
            packageId,
            integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
          })}::jsonb
        )
      `;
    });

    res.status(201).json({
      id: runId,
      publicCode,
      status: "review",
      itemCount: generatedQuestions.length,
      generationSystem: "reasoning-v1",
      packageId,
      chapter: "Data Sufficiency",
      integrationAuthority: DSF_CP017_QUESTION_STUDIO_AUTHORITY,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    });
  } catch (error) {
    console.error("DSF normal Question Studio run failed", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to create Data Sufficiency review run.",
    });
  }
});

export default router;