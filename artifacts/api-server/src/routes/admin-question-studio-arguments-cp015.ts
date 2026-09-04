import { randomUUID } from "node:crypto";
import { Router } from "express";

import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { listQuestionStudioPackages } from "../question-studio/shared-generation-engine-arg";
import {
  ARG_CP015_CHECKPOINT_ID,
  ARG_CP015_LEARNER_RELEASE,
  ARG_CP015_QUESTION_STUDIO_AUTHORITY,
  ARG_CP015_QUESTION_STUDIO_PACKAGE,
  generateArgCp015QuestionStudioBatch,
  isArgCp015CurrentRequest,
  isArgCp015RealPaperRequest,
  type ArgCp015QuestionStudioInput,
} from "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-perceived-diversity-expansion.ts";

const router = Router();

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function positiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `GEN-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function currentPackage(pkg: any) {
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
  };
  if (String(pkg.packageId) !== "ARG-001") return base;
  return Object.freeze({
    ...base,
    cpIds: Object.freeze([...new Set([...base.cpIds, ...ARG_CP015_QUESTION_STUDIO_PACKAGE.cpIds, "ARG-CP-007"])]),
    currentCoreCheckpointId: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentCoreCheckpointId,
    currentRealPaperCheckpointId: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentRealPaperCheckpointId,
    currentReleaseCheckpointId: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentReleaseCheckpointId,
    currentQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.currentQuestionStudioAuthority,
    sourceQuestionStudioAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.sourceQuestionStudioAuthority,
    approvalAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.approvalAuthority,
    diversityAuthority: ARG_CP015_QUESTION_STUDIO_PACKAGE.diversityAuthority,
    runtimeMode: ARG_CP015_QUESTION_STUDIO_PACKAGE.runtimeMode,
    reviewStatus: ARG_CP015_QUESTION_STUDIO_PACKAGE.reviewStatus,
    noRepeatWithinBatch: true,
    twoArgumentProfilesUseApprovedCoreSurface: true,
    learnerRelease: ARG_CP015_QUESTION_STUDIO_PACKAGE.learnerRelease,
    manualApprovalRequired: false,
    persistenceAllowed: true,
    questionBankStatus: "WRITABLE",
    questionBankWritable: true,
    testEligibility: "ELIGIBLE",
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  });
}

function normalizedArgRequest(body: Readonly<Record<string, unknown>>, count: number): ArgCp015QuestionStudioInput {
  const seed = text(body.seed);
  const language = text(body.language);
  const difficulty = text(body.difficulty);
  const qlId = text(body.qlId);
  const canonicalProblemId = text(body.canonicalProblemId);
  const patternId = text(body.patternId);
  const cpId = text(body.cpId);
  const examProfile = text(body.examProfile);
  const paperProfile = text(body.paperProfile);
  const deliveryProfile = text(body.deliveryProfile);
  const profileMode = text(body.profileMode);
  return {
    count,
    ...(seed ? { seed } : {}),
    ...(language ? { language } : {}),
    ...(difficulty ? { difficulty } : {}),
    ...(qlId ? { qlId } : {}),
    ...(canonicalProblemId ? { canonicalProblemId } : {}),
    ...(patternId ? { patternId } : {}),
    ...(cpId ? { cpId } : {}),
    ...(examProfile ? { examProfile } : {}),
    ...(paperProfile ? { paperProfile } : {}),
    ...(deliveryProfile ? { deliveryProfile } : {}),
    ...(profileMode ? { profileMode } : {}),
  };
}

router.use(authenticate);

router.get("/capabilities", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    res.json({
      generationSystem: "question-studio",
      packages: listQuestionStudioPackages().map(currentPackage),
      difficulties: ["Easy", "Medium", "Hard"],
      languages: ["en", "hi", "pa"],
      maxBatchSize: 50,
      arg001CurrentAuthority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
    });
  } catch (error) {
    console.error("ARG-001 CP015 capabilities failed", error);
    res.status(500).json({ error: "Unable to load generation capabilities" });
  }
});

router.post("/runs", requireAdminPermission("content.generation.run"), async (req, res, next) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  if (!isArgCp015CurrentRequest(body)) {
    next();
    return;
  }

  const count = positiveInteger(body.count, 5, 50);
  const generationInput = normalizedArgRequest(body, count);
  const realPaper = isArgCp015RealPaperRequest(generationInput);
  const runId = randomUUID();
  const code = publicRunCode();
  const timestamp = new Date().toISOString();

  try {
    const result = generateArgCp015QuestionStudioBatch(generationInput);
    const questions = result.questions;
    if (questions.length === 0) {
      res.status(422).json({ error: "The ARG-001 CP015 diversity engine returned no questions" });
      return;
    }

    const requestSnapshot = {
      exam: text(body.exam) || (realPaper ? "Real-paper profile" : "SSC CGL"),
      subject: text(body.subject) || "Reasoning Ability",
      topic: text(body.topic) || "Reasoning",
      subtopic: text(body.subtopic) || "Statement & Arguments",
      packageId: "ARG-001",
      requestedCpId: text(body.cpId) || undefined,
      resolvedCheckpointId: ARG_CP015_CHECKPOINT_ID,
      profileMode: realPaper ? "real-paper" : "core",
      examProfile: text(body.examProfile ?? body.paperProfile ?? body.deliveryProfile) || undefined,
      difficulty: text(body.difficulty) || "Mixed",
      qlId: text(body.qlId ?? body.canonicalProblemId) || undefined,
      language: text(body.language) || "en",
      count,
      seed: text(body.seed) || undefined,
      authority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
      learnerRelease: ARG_CP015_LEARNER_RELEASE,
      requestedByFirebaseUid: req.user?.id,
    };

    await sqlClient.begin(async (tx) => {
      await tx`INSERT INTO content.generation_runs (
        id, public_code, status, attempt_number, prompt_snapshot, request_snapshot, provider, model,
        prompt_tokens, completion_tokens, estimated_cost_paise, actual_cost_paise, started_at, completed_at, created_at, updated_at
      ) VALUES (
        ${runId}::uuid, ${code}, 'review'::generation_run_status, 1,
        ${JSON.stringify(requestSnapshot)}, ${JSON.stringify(requestSnapshot)}, 'examtree', 'reasoning-v1-arg-001-cp015-diversity',
        0, 0, 0, 0, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )`;

      for (let index = 0; index < questions.length; index += 1) {
        const question = questions[index]!;
        if (
          question.questionBankWritable !== true
          || question.testEligible !== true
          || question.mockTestEligible !== true
          || question.publiclyPublishable !== false
          || question.publicReleaseAuthorized !== false
          || question.studentDeliveryAuthorized !== false
          || question.automaticStudentPublication !== false
          || question.learnerRelease !== ARG_CP015_LEARNER_RELEASE
          || question.manualApprovalRequired !== false
          || question.currentQuestionStudioAuthority !== ARG_CP015_QUESTION_STUDIO_AUTHORITY
        ) throw new Error("ARG-001 CP015 attempted persistence outside the approved internal-only lifecycle boundary.");

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
        'Admin generated an ARG-001 CP015 diversity-hardened internal-eligible batch',
        ${`Generated ${questions.length} CP015 Statement & Arguments questions in ${code}`},
        ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot })}
      )`;
    });

    res.status(201).json({
      id: runId,
      publicCode: code,
      status: "review",
      itemCount: questions.length,
      generationSystem: "reasoning-v1",
      chapter: "ARG-001",
      checkpointId: ARG_CP015_CHECKPOINT_ID,
      authority: ARG_CP015_QUESTION_STUDIO_AUTHORITY,
      learnerRelease: ARG_CP015_LEARNER_RELEASE,
      profileMode: realPaper ? "real-paper" : "core",
    });
  } catch (error) {
    console.error("ARG-001 CP015 diversity generation failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Question generation failed" });
  }
});

export default router;
