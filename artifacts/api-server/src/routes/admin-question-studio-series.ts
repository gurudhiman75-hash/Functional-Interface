import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  generateReasoningV1Questions,
  listReasoningV1Packages,
  ReasoningV1RequestError,
  type ReasoningV1Difficulty,
  type ReasoningV1Language,
} from "../reasoning-v1/generation-engine";
import { listQuantV4Packages } from "../quant-v4/generation-engine";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);
const SERIES_PACKAGE_ID = "SER-001" as const;
const SERIES_SUBJECT = "General Intelligence & Reasoning";
const SERIES_TOPIC = "Series";
const SERIES_SUBTOPIC = "Missing Figure / Missing Character Series";

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

function normalizeDifficulty(value: unknown): ReasoningV1Difficulty {
  const raw = asString(value);
  if (raw.toLowerCase() === "moderate") return "Medium";
  return DIFFICULTIES.has(raw) ? raw as ReasoningV1Difficulty : "Medium";
}

function normalizeLanguage(value: unknown): ReasoningV1Language {
  const raw = asString(value).toLowerCase();
  return LANGUAGES.has(raw) ? raw as ReasoningV1Language : "en";
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

function capabilityPackage(pkg: any) {
  return {
    packageId: String(pkg.packageId),
    topic: String(pkg.topic),
    subtopic: String(pkg.subtopic),
    label: String(pkg.label),
    enabled: Boolean(pkg.enabled),
    active: typeof pkg.active === "boolean" ? pkg.active : undefined,
    questionStudioDiscoverable:
      typeof pkg.questionStudioDiscoverable === "boolean"
        ? pkg.questionStudioDiscoverable
        : undefined,
    generationDomain: asString(pkg.generationDomain) || undefined,
    cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
    permanentQlIds: Array.isArray(pkg.permanentQlIds)
      ? pkg.permanentQlIds.map(String)
      : [],
    supportedLanguages: Array.isArray(pkg.supportedLanguages)
      ? pkg.supportedLanguages.map(String)
      : ["en"],
    runtimeMode: asString(pkg.runtimeMode) || undefined,
    supportedRuntimeModes: Array.isArray(pkg.supportedRuntimeModes)
      ? pkg.supportedRuntimeModes.map(String)
      : [],
    dynamicCandidateCpIds: Array.isArray(pkg.dynamicCandidateCpIds)
      ? pkg.dynamicCandidateCpIds.map(String)
      : [],
    reviewStatus: asString(pkg.reviewStatus) || undefined,
    questionBankStatus: asString(pkg.questionBankStatus) || undefined,
    questionBankWritable:
      typeof pkg.questionBankWritable === "boolean"
        ? pkg.questionBankWritable
        : undefined,
    testEligibility: asString(pkg.testEligibility) || undefined,
    testEligible:
      typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
    publiclyPublishable:
      typeof pkg.publiclyPublishable === "boolean"
        ? pkg.publiclyPublishable
        : undefined,
  };
}

router.get(
  "/capabilities",
  authenticate,
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const quantPackages = listQuantV4Packages().map(capabilityPackage);
      const reasoningPackages = listReasoningV1Packages().map(capabilityPackage);
      const packages = [...quantPackages, ...reasoningPackages].sort(
        (left, right) => left.packageId.localeCompare(right.packageId),
      );

      res.json({
        generationSystem: "quant-v4",
        generationSystems: ["quant-v4", "reasoning-v1"],
        packages,
        difficulties: ["Easy", "Medium", "Hard"],
        languages: ["en", "hi", "pa"],
        maxBatchSize: 50,
      });
    } catch (error) {
      console.error("Question Studio multi-domain capabilities failed", error);
      res.status(500).json({ error: "Unable to load generation capabilities" });
    }
  },
);

router.post(
  "/runs",
  (req, _res, next) => {
    if (asString(req.body?.packageId) !== SERIES_PACKAGE_ID) {
      next("route");
      return;
    }
    next();
  },
  authenticate,
  requireAdminPermission("content.generation.run"),
  async (req, res) => {
    const count = asPositiveInteger(req.body?.count, 5, 50);
    const packageId = SERIES_PACKAGE_ID;
    const topic = SERIES_TOPIC;
    const subtopic = SERIES_SUBTOPIC;
    const exam = asString(req.body?.exam) || "SSC CGL";
    const subject = SERIES_SUBJECT;
    const language = normalizeLanguage(req.body?.language);
    const difficulty = normalizeDifficulty(req.body?.difficulty);
    const seed = asString(req.body?.seed) || undefined;
    const runtimeMode = asString(req.body?.runtimeMode) || "FROZEN_REVIEW";
    const canonicalProblemId =
      asString(req.body?.canonicalProblemId)
      || asString(req.body?.cpId)
      || "SER-CP-007";
    const questionLanguageId =
      asString(req.body?.questionLanguageId) || undefined;

    const runId = randomUUID();
    const code = publicRunCode();
    const timestamp = new Date().toISOString();
    const requestSnapshot = {
      exam,
      subject,
      difficulty,
      count,
      packageId,
      topic,
      subtopic,
      language,
      seed,
      runtimeMode,
      canonicalProblemId,
      questionLanguageId,
      generationDomain: "reasoning-v1",
      requestedByFirebaseUid: req.user?.id,
    };

    try {
      const result = await generateReasoningV1Questions({
        packageId,
        difficulty,
        language,
        seed,
        count,
        runtimeMode,
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
            'reasoning-v1',
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

        for (let index = 0; index < generatedQuestions.length; index += 1) {
          const itemId = randomUUID();
          const versionId = randomUUID();
          const generated = generatedQuestions[index] as Record<string, any>;
          const payload = {
            ...generated,
            subject,
            topic,
            subtopic,
            generationContext: {
              ...(generated.generationContext ?? {}),
              ...result.generationContext,
              subject,
              topic,
              subtopic,
              authorityId:
                generated.authorityId
                ?? generated.generationContext?.authorityId
                ?? null,
              subtypeId:
                generated.subtypeId
                ?? generated.generationContext?.subtypeId
                ?? null,
              taskKind:
                generated.taskKind
                ?? generated.generationContext?.taskKind
                ?? null,
              renderingContract:
                generated.renderingContract
                ?? generated.generationContext?.renderingContract
                ?? null,
            },
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
              ${asString(generated.questionId) || null},
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
            'Admin generated a Series Question Studio review batch',
            ${`Generated ${generatedQuestions.length} Reasoning V1 questions in ${code}`},
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
            ${JSON.stringify({
              runId,
              publicCode: code,
              itemCount: generatedQuestions.length,
              generationDomain: "reasoning-v1",
              packageId,
            })}
          )
        `;
      });

      res.status(201).json({
        id: runId,
        publicCode: code,
        status: "review",
        itemCount: generatedQuestions.length,
        generationSystem: "reasoning-v1",
        packageId,
        runtimeMode: "FROZEN_REVIEW",
        questionBankStatus: "NOT_STORED",
        testEligibility: "INELIGIBLE",
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("Series Question Studio generation failed", error);
      const statusCode = error instanceof ReasoningV1RequestError
        ? error.statusCode
        : 500;
      const message = error instanceof Error
        ? error.message
        : "Series question generation failed";
      res.status(statusCode).json({ error: message });
    }
  },
);

export default router;