import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
// The shared facade keeps Quant requests on the guarded question-studio-review-engine path
// while adding Reasoning packages such as WOR-001 to the same persistence workflow.
import {
  generateQuestion as generateQuestionStudioQuestions,
  isWor001QuestionStudioRequest,
  listQuestionStudioPackages,
} from "../question-studio/shared-generation-engine";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asPositiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0
    ? Math.min(parsed, max)
    : fallback;
}

function normalizeDifficulty(value: unknown) {
  const raw = asString(value);
  if (raw.toLowerCase() === "moderate") return "Medium";
  return DIFFICULTIES.has(raw) ? raw : "Medium";
}

function normalizeLanguage(value: unknown) {
  const raw = asString(value).toLowerCase();
  return LANGUAGES.has(raw) ? raw : "en";
}

function normalizeSelector(value: unknown) {
  return asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isAverageRequest(body: any) {
  const packageId = normalizeSelector(body?.packageId ?? body?.archetypeId);
  const patternId = normalizeSelector(body?.patternId);
  const topic = normalizeSelector(body?.topic);
  const subtopic = normalizeSelector(body?.subtopic);
  return (
    packageId === "avg 001" ||
    patternId.includes("avg 001") ||
    (topic === "average" && !subtopic) ||
    (topic === "arithmetic" && subtopic === "average")
  );
}

function isNumberSystemRequest(body: any) {
  const packageId = normalizeSelector(body?.packageId ?? body?.archetypeId);
  const patternId = normalizeSelector(body?.patternId);
  const topic = normalizeSelector(body?.topic);
  const subtopic = normalizeSelector(body?.subtopic);
  const selectors = new Set(["number system", "numbers", "number theory"]);
  return (
    packageId === "num 001" ||
    patternId.includes("num 001") ||
    (selectors.has(topic) && !subtopic) ||
    (topic === "arithmetic" && selectors.has(subtopic))
  );
}

function isSimplificationRequest(body: any) {
  const packageId = normalizeSelector(body?.packageId ?? body?.archetypeId);
  const patternId = normalizeSelector(body?.patternId);
  const topic = normalizeSelector(body?.topic);
  const subtopic = normalizeSelector(body?.subtopic);
  const selectors = new Set([
    "simplification approximation",
    "simplification and approximation",
    "simplification",
    "approximation",
  ]);
  return (
    packageId === "sap" ||
    patternId === "sap" ||
    patternId.includes("sap ql") ||
    (selectors.has(topic) && !subtopic) ||
    (topic === "arithmetic" && selectors.has(subtopic))
  );
}

function isTimeAndWorkRequest(body: any) {
  const packageId = normalizeSelector(body?.packageId ?? body?.archetypeId);
  const patternId = normalizeSelector(body?.patternId);
  const topic = normalizeSelector(body?.topic);
  const subtopic = normalizeSelector(body?.subtopic);
  const selectors = new Set([
    "time work",
    "time and work",
    "work and time",
    "pipes cisterns",
    "pipes and cisterns",
  ]);
  return (
    packageId === "tmw 001" ||
    patternId.includes("tmw 001") ||
    (selectors.has(topic) && !subtopic) ||
    (topic === "arithmetic" && selectors.has(subtopic))
  );
}

function inferNumberSystemCpFromQl(value: unknown) {
  const match = /^NUM-QL-(\d{3})$/u.exec(asString(value));
  if (!match) return undefined;
  const number = Number(match[1]);
  if (number >= 1 && number <= 17) return "NUM-CP-003";
  if (number >= 18 && number <= 45) return "NUM-CP-004";
  if (number >= 124 && number <= 144) return "NUM-CP-001";
  return undefined;
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

router.use(authenticate);

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
        supportedLanguages: Array.isArray(pkg.supportedLanguages)
          ? pkg.supportedLanguages.map(String)
          : ["en"],
        runtimeMode: asString(pkg.runtimeMode) || undefined,
        supportedRuntimeModes: Array.isArray(pkg.supportedRuntimeModes)
          ? pkg.supportedRuntimeModes.map(String)
          : [],
        questionBankStatus: asString(pkg.questionBankStatus) || undefined,
        testEligibility: asString(pkg.testEligibility) || undefined,
        publiclyPublishable:
          typeof pkg.publiclyPublishable === "boolean"
            ? pkg.publiclyPublishable
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
      console.error("Question Studio capabilities failed", error);
      res.status(500).json({ error: "Unable to load generation capabilities" });
    }
  },
);

router.post(
  "/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res, next) => {
    const simplificationRequest = isSimplificationRequest(req.body);
    const numberSystemRequest = isNumberSystemRequest(req.body);
    const averageRequest = isAverageRequest(req.body);
    const timeAndWorkRequest = isTimeAndWorkRequest(req.body);
    const worRequest = isWor001QuestionStudioRequest(req.body ?? {});
    if (!averageRequest && !numberSystemRequest && !timeAndWorkRequest && !simplificationRequest && !worRequest) {
      next();
      return;
    }

    const count = asPositiveInteger(req.body?.count, 5, 50);
    const defaultPackageId = numberSystemRequest ? "NUM-001" : "AVG-001";
    const selectedPackageId = worRequest
      ? "WOR-001"
      : simplificationRequest
        ? "SAP"
        : timeAndWorkRequest
          ? "TMW-001"
          : defaultPackageId;
    const defaultSubtopic = numberSystemRequest ? "Number System" : "Average";
    const selectedSubtopic = worRequest
      ? "Word & Dictionary Order"
      : simplificationRequest
        ? "Simplification & Approximation"
        : timeAndWorkRequest
          ? "Time & Work"
          : defaultSubtopic;
    const packageId = asString(req.body?.packageId) || selectedPackageId;
    const patternId = asString(req.body?.patternId) || undefined;
    const topic = worRequest ? "Reasoning" : asString(req.body?.topic) || "Arithmetic";
    const subtopic = asString(req.body?.subtopic) || selectedSubtopic;
    const exam = asString(req.body?.exam) || "SSC CGL";
    const subject = worRequest ? "Reasoning Ability" : asString(req.body?.subject) || "Quantitative Aptitude";
    const language = normalizeLanguage(req.body?.language);
    const requestedDifficulty = asString(req.body?.difficulty);
    const difficulty = worRequest && requestedDifficulty.toLowerCase() === "mixed"
      ? "Mixed"
      : normalizeDifficulty(requestedDifficulty);
    const seed = asString(req.body?.seed) || undefined;
    const canonicalProblemId = asString(req.body?.canonicalProblemId) || undefined;
    const questionLanguageId = asString(req.body?.questionLanguageId) || undefined;
    const inferredNumberSystemCp = numberSystemRequest
      ? inferNumberSystemCpFromQl(questionLanguageId)
      : undefined;

    if (
      numberSystemRequest
      && canonicalProblemId
      && inferredNumberSystemCp
      && canonicalProblemId !== inferredNumberSystemCp
    ) {
      res.status(400).json({
        error: `${questionLanguageId} is owned by ${inferredNumberSystemCp}, not ${canonicalProblemId}.`,
      });
      return;
    }

    if (numberSystemRequest && language !== "en") {
      const targetCp = canonicalProblemId ?? inferredNumberSystemCp ?? "NUM-CP-001";
      if (targetCp !== "NUM-CP-001") {
        res.status(400).json({
          error: "NUM-001 supports English Question Studio generation only for NUM-CP-003 and NUM-CP-004; Hindi/Punjabi controlled review is available for NUM-CP-001.",
        });
        return;
      }
    }

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
      const result = await generateQuestionStudioQuestions({
        packageId: selectedPackageId,
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
            id, public_code, status, attempt_number, prompt_snapshot,
            request_snapshot, provider, model, prompt_tokens,
            completion_tokens, estimated_cost_paise, actual_cost_paise,
            started_at, completed_at, created_at, updated_at
          ) VALUES (
            ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
            ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)},
            'examtree', ${worRequest ? "reasoning-v1-wor-001" : "quant-v4"}, 0, 0, 0, 0,
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
            ${runId}::uuid, 'Admin generated a Question Studio batch',
            ${`Generated ${generatedQuestions.length} ${selectedPackageId} questions in ${code}`},
            ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot })}
          )
        `;

        await tx`
          INSERT INTO platform.outbox_events (
            id, aggregate_type, aggregate_id, event_type, payload
          ) VALUES (
            ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
            'question_studio.generation_run.created',
            ${JSON.stringify({ runId, publicCode: code, itemCount: generatedQuestions.length })}
          )
        `;
      });

      res.status(201).json({
        id: runId,
        publicCode: code,
        status: "review",
        itemCount: generatedQuestions.length,
        generationSystem: worRequest ? "reasoning-v1" : "quant-v4",
      });
    } catch (error) {
      console.error(`${selectedPackageId} Question Studio generation failed`, error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Question generation failed",
      });
    }
  },
);

export default router;
