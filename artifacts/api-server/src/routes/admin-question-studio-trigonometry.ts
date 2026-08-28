import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  generateQuestion,
  isTrg001QuestionStudioRequest,
  isTrg002V4GenerationRequest,
  listQuestionStudioPackages,
} from "../question-studio/shared-generation-engine-trigonometry";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function normalizeDifficulty(value: unknown) {
  const raw = asString(value);
  if (raw.toLowerCase() === "moderate") return "Medium";
  if (!raw) return "Medium";
  const canonical = `${raw.charAt(0).toUpperCase()}${raw.slice(1).toLowerCase()}`;
  return DIFFICULTIES.has(canonical) ? canonical : "Medium";
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

function requestedTrigonometryPackage(body: Record<string, unknown>) {
  if (isTrg001QuestionStudioRequest(body)) return "TRG-001" as const;
  if (isTrg002V4GenerationRequest(body)) return "TRG-002" as const;
  return null;
}

router.use(authenticate);

/**
 * Latest additive Question Studio surface for the Trigonometry family.
 * It is mounted before the CP013 and legacy routers. GET /capabilities returns
 * the complete aggregate package list; non-Trigonometry POST requests fall
 * through unchanged to the previous Question Studio layers.
 */
router.get(
  "/capabilities",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const packages = listQuestionStudioPackages().map((pkg: any) => ({
        packageId: String(pkg.packageId),
        topic: String(pkg.topic),
        subtopic: String(pkg.subtopic),
        subject: asString(pkg.subject) || undefined,
        label: String(pkg.label),
        enabled: Boolean(pkg.enabled),
        cpIds: Array.isArray(pkg.cpIds)
          ? pkg.cpIds.map(String)
          : Array.isArray(pkg.canonicalProblems)
            ? pkg.canonicalProblems.map((item: any) => String(item?.id ?? "")).filter(Boolean)
            : [],
        permanentQlCount: Number.isFinite(Number(pkg.permanentQlCount ?? pkg.qlCount))
          ? Number(pkg.permanentQlCount ?? pkg.qlCount)
          : undefined,
        supportedLanguages: Array.isArray(pkg.supportedLanguages)
          ? pkg.supportedLanguages.map(String)
          : ["en"],
        runtimeMode: asString(pkg.runtimeMode) || undefined,
        supportedRuntimeModes: Array.isArray(pkg.supportedRuntimeModes)
          ? pkg.supportedRuntimeModes.map(String)
          : [],
        reviewStatus: asString(pkg.reviewStatus) || undefined,
        freezeStatus: asString(pkg.freezeStatus) || undefined,
        localizationStatus: asString(pkg.localizationStatus) || undefined,
        questionBankStatus: asString(pkg.questionBankStatus) || undefined,
        questionBankWritable: typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
        testEligibility: asString(pkg.testEligibility) || undefined,
        testEligible: typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
        mockTestEligible: typeof pkg.mockTestEligible === "boolean" ? pkg.mockTestEligible : undefined,
        publiclyPublishable: typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
        publicReleaseAuthorized: typeof pkg.publicReleaseAuthorized === "boolean" ? pkg.publicReleaseAuthorized : undefined,
        automaticStudentPublication: typeof pkg.automaticStudentPublication === "boolean"
          ? pkg.automaticStudentPublication
          : undefined,
      }));

      res.json({
        generationSystem: "question-studio",
        packages,
        difficulties: ["Easy", "Medium", "Hard"],
        languages: ["en", "hi", "pa"],
        maxBatchSize: 50,
      });
    } catch (error) {
      console.error("Trigonometry Question Studio capabilities failed", error);
      res.status(500).json({ error: "Unable to load generation capabilities" });
    }
  },
);

router.post(
  "/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res, next) => {
    const requestBody = (req.body ?? {}) as Record<string, unknown>;
    const packageId = requestedTrigonometryPackage(requestBody);
    if (!packageId) {
      next();
      return;
    }

    const count = asPositiveInteger(requestBody.count, 5, 50);
    const language = normalizeLanguage(requestBody.language);
    const difficulty = normalizeDifficulty(requestBody.difficulty);
    const seed = asString(requestBody.seed) || undefined;
    const canonicalProblemId = asString(requestBody.canonicalProblemId) || asString(requestBody.cpId) || undefined;
    const questionLanguageId = asString(requestBody.questionLanguageId) || undefined;
    const patternId = asString(requestBody.patternId) || packageId;
    const exam = asString(requestBody.exam) || "SSC CGL";
    const subject = asString(requestBody.subject) || "Quantitative Aptitude";
    const topic = asString(requestBody.topic) || "Advanced Mathematics";
    const subtopic = asString(requestBody.subtopic)
      || (packageId === "TRG-001"
        ? "Trigonometry — Ratios, Values & Identities"
        : "Trigonometry — Heights & Distances");

    const runId = randomUUID();
    const code = publicRunCode();
    const timestamp = new Date().toISOString();
    const requestSnapshot = {
      exam,
      subject,
      difficulty,
      count,
      packageId,
      patternId,
      topic,
      subtopic,
      canonicalProblemId,
      questionLanguageId,
      language,
      seed,
      requestedByFirebaseUid: req.user?.id,
    };

    try {
      const result = await generateQuestion({
        packageId,
        patternId,
        topic,
        subtopic,
        canonicalProblemId,
        questionLanguageId,
        difficulty,
        language,
        seed,
        count,
      });
      const generatedQuestions = Array.isArray(result.questions) ? result.questions : [];
      if (generatedQuestions.length === 0) {
        res.status(422).json({ error: "The generation engine returned no questions" });
        return;
      }

      if (result.generationContext?.publiclyPublishable !== false
        || result.generationContext?.publicReleaseAuthorized !== false) {
        throw new Error(`${packageId}: Trigonometry Question Studio run attempted to bypass the public-release lock.`);
      }

      await sqlClient.begin(async (tx) => {
        await tx`
          INSERT INTO content.generation_runs (
            id, public_code, status, attempt_number, prompt_snapshot,
            request_snapshot, provider, model, prompt_tokens,
            completion_tokens, estimated_cost_paise, actual_cost_paise,
            started_at, completed_at, created_at, updated_at
          ) VALUES (
            ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
            ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
            'examtree', ${`quant-v4-${packageId.toLowerCase()}`}, 0, 0, 0, 0,
            ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
          )
        `;

        for (let index = 0; index < generatedQuestions.length; index += 1) {
          const itemId = randomUUID();
          const versionId = randomUUID();
          const question = generatedQuestions[index] as Record<string, unknown>;
          const payload = {
            ...question,
            generationContext: result.generationContext,
            validationResult: "pending",
          };

          await tx`
            INSERT INTO content.generation_run_items (
              id, generation_run_id, item_number, status,
              current_version_number, created_at, updated_at
            ) VALUES (
              ${itemId}::uuid, ${runId}::uuid, ${index + 1},
              'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
            )
          `;

          await tx`
            INSERT INTO content.generation_item_versions (
              id, generation_item_id, version_number, payload,
              provider_item_id, created_at
            ) VALUES (
              ${versionId}::uuid, ${itemId}::uuid, 1,
              ${JSON.stringify(payload)}, ${asString(question.questionId) || null},
              ${timestamp}
            )
          `;
        }

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type,
            entity_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid, 'user'::audit_actor_type,
            ${req.adminSession?.user.id ?? null}::uuid,
            'question_studio.generation_run.created', 'generation_run',
            ${runId}::uuid, 'Admin generated a Trigonometry Question Studio batch',
            ${`Generated ${generatedQuestions.length} ${packageId} questions in ${code}`},
            ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot, generationContext: result.generationContext })}
          )
        `;

        await tx`
          INSERT INTO platform.outbox_events (
            id, aggregate_type, aggregate_id, event_type, payload
          ) VALUES (
            ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
            'question_studio.generation_run.created',
            ${JSON.stringify({ runId, publicCode: code, itemCount: generatedQuestions.length, packageId })}
          )
        `;
      });

      res.status(201).json({
        id: runId,
        publicCode: code,
        status: "review",
        itemCount: generatedQuestions.length,
        packageId,
        generationSystem: "quant-v4",
        publiclyPublishable: false,
        publicReleaseAuthorized: false,
      });
    } catch (error) {
      console.error(`${packageId} Question Studio generation failed`, error);
      const statusCode = Number((error as any)?.statusCode);
      res.status(Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 500 ? statusCode : 500).json({
        error: error instanceof Error ? error.message : "Question generation failed",
      });
    }
  },
);

export default router;
