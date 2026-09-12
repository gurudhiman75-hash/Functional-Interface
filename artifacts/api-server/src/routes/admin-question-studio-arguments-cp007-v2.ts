import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { listQuestionStudioPackages } from "../question-studio/shared-generation-engine-arg";
import {
  ARG_CP007_CHECKPOINT_ID,
  ARG_CP007_EXAM_PROFILES,
  generateArgCp007ExamProfileBatch,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp007-exam-profile-generator-v2.ts";
import { ARG_QL_IDS, type ArgQlId } from "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/types.ts";

const router = Router();
const PROFILE_IDS = new Set<string>(Object.keys(ARG_CP007_EXAM_PROFILES));
const LANGUAGES = new Set(["en", "hi", "pa"]);

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeProfile(value: unknown): ArgCp007ExamProfile | undefined {
  const normalized = text(value).toUpperCase();
  return PROFILE_IDS.has(normalized) ? normalized as ArgCp007ExamProfile : undefined;
}

function normalizeQl(value: unknown): ArgQlId | undefined {
  const normalized = text(value).toUpperCase();
  return (ARG_QL_IDS as readonly string[]).includes(normalized) ? normalized as ArgQlId : undefined;
}

function normalizeLanguage(value: unknown) {
  const normalized = text(value).toLowerCase();
  return LANGUAGES.has(normalized) ? normalized : "en";
}

function normalizeDifficulty(profile: ArgCp007ExamProfile, value: unknown): ArgCp007Difficulty {
  const normalized = text(value).toLowerCase();
  const requested: ArgCp007Difficulty | undefined = normalized === "easy" ? "Easy" : normalized === "hard" ? "Hard" : normalized === "medium" || normalized === "moderate" ? "Medium" : undefined;
  const supported = ARG_CP007_EXAM_PROFILES[profile].supportedDifficulties as readonly ArgCp007Difficulty[];
  const resolved = requested ?? supported[0]!;
  if (!supported.includes(resolved)) throw new Error(`${profile} does not support ${resolved}. Supported: ${supported.join(", ")}`);
  return resolved;
}

function localeForLanguage(language: string) {
  if (language === "hi") return "hi-IN" as const;
  if (language === "pa") return "pa-IN" as const;
  return "en-IN" as const;
}

function positiveInteger(value: unknown, fallback: number, max: number) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function isCp007Request(body: Record<string, unknown>) {
  const explicitProfile = normalizeProfile(body.examProfile ?? body.paperProfile ?? body.deliveryProfile);
  const cpId = text(body.cpId).toUpperCase();
  const profileMode = text(body.profileMode).toLowerCase();
  return Boolean(explicitProfile) || cpId === ARG_CP007_CHECKPOINT_ID || profileMode === "real-paper";
}

function publicRunCode() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `GEN-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

router.use(authenticate);

router.get("/capabilities", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const packages = listQuestionStudioPackages().map((pkg: any) => {
      const base = {
        packageId: String(pkg.packageId),
        topic: String(pkg.topic),
        subtopic: String(pkg.subtopic),
        subject: text(pkg.subject) || undefined,
        label: String(pkg.label),
        enabled: Boolean(pkg.enabled),
        cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
        canonicalProblems: Array.isArray(pkg.canonicalProblems) ? pkg.canonicalProblems : [],
        permanentQlCount: Number(pkg.permanentQlCount ?? 0),
        permanentQlIds: Array.isArray(pkg.permanentQlIds) ? pkg.permanentQlIds.map(String) : [],
        supportedLanguages: Array.isArray(pkg.supportedLanguages) ? pkg.supportedLanguages.map(String) : ["en"],
        supportedDifficulties: Array.isArray(pkg.supportedDifficulties) ? pkg.supportedDifficulties.map(String) : [],
        runtimeMode: text(pkg.runtimeMode) || undefined,
        reviewStatus: text(pkg.reviewStatus) || undefined,
        questionStudioDiscoverable: typeof pkg.questionStudioDiscoverable === "boolean" ? pkg.questionStudioDiscoverable : undefined,
        questionStudioGenerationEnabled: typeof pkg.questionStudioGenerationEnabled === "boolean" ? pkg.questionStudioGenerationEnabled : undefined,
        questionBankStatus: text(pkg.questionBankStatus) || undefined,
        questionBankWritable: typeof pkg.questionBankWritable === "boolean" ? pkg.questionBankWritable : undefined,
        testEligibility: text(pkg.testEligibility) || undefined,
        testEligible: typeof pkg.testEligible === "boolean" ? pkg.testEligible : undefined,
        mockTestEligible: typeof pkg.mockTestEligible === "boolean" ? pkg.mockTestEligible : undefined,
        publiclyPublishable: typeof pkg.publiclyPublishable === "boolean" ? pkg.publiclyPublishable : undefined,
        automaticStudentPublication: typeof pkg.automaticStudentPublication === "boolean" ? pkg.automaticStudentPublication : undefined,
      };
      if (String(pkg.packageId) !== "ARG-001") return base;
      return Object.freeze({
        ...base,
        cpIds: Object.freeze([...new Set([...base.cpIds, ARG_CP007_CHECKPOINT_ID])]),
        examProfileCheckpointId: ARG_CP007_CHECKPOINT_ID,
        realPaperParityStatus: "CP007_V2_REVIEW_CONNECTED",
        examProfiles: Object.freeze(Object.values(ARG_CP007_EXAM_PROFILES)),
      });
    });
    res.json({ generationSystem: "question-studio", packages, difficulties: ["Easy", "Medium", "Hard"], languages: ["en", "hi", "pa"], maxBatchSize: 50 });
  } catch (error) {
    console.error("ARG-001 CP007 V2 capabilities failed", error);
    res.status(500).json({ error: "Unable to load generation capabilities" });
  }
});

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (!isCp007Request(body)) {
    next();
    return;
  }

  try {
    const profile = normalizeProfile(body.examProfile ?? body.paperProfile ?? body.deliveryProfile) ?? "SSC_RECENT_2X4";
    const difficulty = normalizeDifficulty(profile, body.difficulty);
    const qlId = normalizeQl(body.qlId ?? body.canonicalProblemId);
    const language = normalizeLanguage(body.language);
    const count = positiveInteger(body.count, 5, 50);
    const seed = text(body.seed) || undefined;
    const runId = randomUUID();
    const code = publicRunCode();
    const timestamp = new Date().toISOString();
    const requestSnapshot = {
      exam: text(body.exam) || (profile.startsWith("BANKING") ? "Banking" : "SSC / State Exam"),
      subject: text(body.subject) || "Reasoning Ability",
      topic: text(body.topic) || "Reasoning",
      subtopic: text(body.subtopic) || "Statement & Arguments",
      packageId: "ARG-001",
      cpId: ARG_CP007_CHECKPOINT_ID,
      examProfile: profile,
      difficulty,
      qlId,
      language,
      count,
      seed,
      requestedByFirebaseUid: req.user?.id,
    };

    const result = generateArgCp007ExamProfileBatch({ profile, difficulty, qlId, locale: localeForLanguage(language), seed, count });
    const questions = result.questions.map((raw) => Object.freeze({
      ...raw,
      questionId: `ARG-001:${raw.qlId}:${raw.profile}:${raw.contentFingerprint.slice(0, 20)}`,
      packageId: "ARG-001" as const,
      subject: "Reasoning Ability" as const,
      topic: "Reasoning" as const,
      subtopic: "Statement & Arguments" as const,
      language,
      runtimeMode: "REVIEW_ONLY_CP007_REAL_PAPER_PARITY_V2" as const,
      reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
      lifecycleStatus: "REVIEW_ONLY" as const,
      questionStudioVisible: true as const,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }));

    await sqlClient.begin(async (tx) => {
      await tx`INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot, provider, model,
        prompt_tokens, completion_tokens, estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)}, 'examtree', 'reasoning-v1-arg-001-cp007-v2',
        0, 0, 0, 0, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )`;

      for (let index = 0; index < questions.length; index += 1) {
        const question = questions[index]!;
        if (question.questionBankWritable || question.testEligible || question.mockTestEligible || question.publiclyPublishable || question.automaticStudentPublication) {
          throw new Error("ARG-001 CP007 V2 attempted to open a learner-delivery gate.");
        }
        const itemId = randomUUID();
        const versionId = randomUUID();
        await tx`INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp})`;
        await tx`INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1,
          ${JSON.stringify({ ...question, generationContext: result.generationContext, validationResult: "pending" })},
          ${question.questionId}, ${timestamp}
        )`;
      }

      await tx`INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession?.user.id ?? null}::uuid,
        'question_studio.generation_run.created', 'generation_run', ${runId}::uuid,
        'Admin generated an ARG-001 CP007 real-paper review batch',
        ${`Generated ${questions.length} ${profile} Statement & Arguments questions in ${code}`},
        ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot })}
      )`;
      await tx`INSERT INTO platform.outbox_events (
        id, aggregate_type, aggregate_id, event_type, payload
      ) VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid, 'question_studio.generation_run.created',
        ${JSON.stringify({ runId, publicCode: code, itemCount: questions.length, chapter: "ARG-001", cpId: ARG_CP007_CHECKPOINT_ID, examProfile: profile })}
      )`;
    });

    res.status(201).json({ id: runId, publicCode: code, status: "review", itemCount: questions.length, generationSystem: "reasoning-v1", chapter: "ARG-001", checkpointId: ARG_CP007_CHECKPOINT_ID, examProfile: profile });
  } catch (error) {
    console.error("ARG-001 CP007 V2 generation failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Question generation failed" });
  }
});

export default router;
