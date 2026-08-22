import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import {
  DSF_CP002_ANSWER_PROFILES,
  DSF_CP002_DIFFICULTIES,
  DSF_CP002_DOMAINS,
  DSF_CP002_LANGUAGES,
  DSF_CP002_QUESTION_STUDIO_AUTHORITY,
  DSF_CP002_QUESTION_STUDIO_PACKAGE,
  generateDsfQuestionStudioBatch,
  type DsfQuestionStudioInput,
  type DsfQuestionStudioQuestion,
  type DsfStudioAnswerProfile,
  type DsfStudioDifficulty,
  type DsfStudioDomainId,
  type DsfStudioLanguage,
  type DsfStudioSolveMode,
} from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/DSF-CP-002/question-studio-integration-v1";
import { SUFFICIENCY_CLASSES, type SufficiencyClass } from "../reasoning-v1/topics/Data-Sufficiency/DSF-001/foundation";

const router = Router();
const DOMAIN_IDS = new Set<string>(DSF_CP002_DOMAINS.map((domain) => domain.id));
const SOLVE_MODES = new Set<string>(DSF_CP002_DOMAINS.flatMap((domain) => [...domain.solveModes]));
const DIFFICULTIES = new Set<string>(DSF_CP002_DIFFICULTIES);
const SEMANTIC_CLASSES = new Set<string>(SUFFICIENCY_CLASSES);
const LANGUAGES = new Set<string>(DSF_CP002_LANGUAGES);
const ANSWER_PROFILES = new Set<string>(DSF_CP002_ANSWER_PROFILES);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asCount(value: unknown, fallback = 5, max = 50): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
}

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `DSF-${date}-${randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function requestFilters(source: Record<string, unknown>): DsfQuestionStudioInput {
  const language = asString(source.language) || "en";
  const answerProfile = asString(source.answerProfile) || "GENERIC_DS_STANDARD_5_EN";
  const domain = asString(source.domain);
  const solveMode = asString(source.solveMode);
  const semanticClass = asString(source.semanticClass);
  const difficulty = asString(source.difficulty);

  if (!LANGUAGES.has(language)) throw new Error(`Unsupported Data Sufficiency language '${language}'.`);
  if (!ANSWER_PROFILES.has(answerProfile)) throw new Error(`Unsupported Data Sufficiency answer profile '${answerProfile}'.`);
  if (domain && !DOMAIN_IDS.has(domain)) throw new Error(`Unsupported Data Sufficiency domain '${domain}'.`);
  if (solveMode && !SOLVE_MODES.has(solveMode)) throw new Error(`Unsupported Data Sufficiency solve mode '${solveMode}'.`);
  if (semanticClass && !SEMANTIC_CLASSES.has(semanticClass)) throw new Error(`Unsupported sufficiency class '${semanticClass}'.`);
  if (difficulty && !DIFFICULTIES.has(difficulty)) throw new Error(`Unsupported Data Sufficiency difficulty '${difficulty}'.`);

  if (domain && solveMode) {
    const domainEntry = DSF_CP002_DOMAINS.find((entry) => entry.id === domain)!;
    if (!domainEntry.solveModes.includes(solveMode as never)) {
      throw new Error(`${solveMode} does not belong to ${domain}.`);
    }
  }

  return {
    language: language as DsfStudioLanguage,
    answerProfile: answerProfile as DsfStudioAnswerProfile,
    domain: domain ? domain as DsfStudioDomainId : undefined,
    solveMode: solveMode ? solveMode as DsfStudioSolveMode : undefined,
    semanticClass: semanticClass ? semanticClass as SufficiencyClass : undefined,
    difficulty: difficulty ? difficulty as DsfStudioDifficulty : undefined,
  };
}

function reviewPayload(question: DsfQuestionStudioQuestion) {
  const correctOption = question.options[question.correctIndex]!;
  const text = `${question.stem}\nI. ${question.statements[0].text}\nII. ${question.statements[1].text}`;
  return {
    text,
    stem: question.stem,
    questionPrompt: question.questionPrompt,
    statements: question.statements,
    options: question.options.map((option) => option.value),
    optionDetails: question.options.map((option) => ({
      label: option.key,
      text: option.value,
      isCorrect: option.isCorrect,
      semanticClass: option.semanticClass,
    })),
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: correctOption.value,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation.steps.join("\n"),
    richExplanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    qlId: question.qlId,
    packageId: question.packageId,
    sourceCheckpointId: question.sourceCheckpointId,
    integrationCheckpointId: question.integrationCheckpointId,
    questionId: question.questionId,
    sourceGenerationIdentity: question.sourceGenerationIdentity,
    sourceChapterId: question.sourceChapterId,
    solveMode: question.solveModeId,
    targetKind: question.targetKind,
    domain: question.domain,
    domainLabel: question.domainLabel,
    topic: "Data Sufficiency",
    subtopic: question.domainLabel,
    subject: "Reasoning",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    answerProfile: question.answerProfile,
    renderer: "TEXT_MATH" as const,
    questionStudioRegistrationStatus: "REGISTERED" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    mockTestEligible: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: question.integrationAuthority,
    sourceFreezeAuthority: question.sourceFreezeAuthority,
    sourceValidation: question.validation,
    generationContext: {
      generationDomain: "reasoning-v1" as const,
      chapter: "Data Sufficiency" as const,
      packageId: question.packageId,
      qlId: question.qlId,
      sourceChapterId: question.sourceChapterId,
      domain: question.domain,
      solveMode: question.solveModeId,
      semanticClass: question.canonicalAnswer,
      difficulty: question.difficulty,
      language: question.language,
      locale: question.locale,
      answerProfile: question.answerProfile,
      integrationAuthority: question.integrationAuthority,
      sourceFreezeAuthority: question.sourceFreezeAuthority,
      questionStudioDiscoverable: true as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      manualApprovalRequired: true as const,
      automaticStudentPublication: false as const,
    },
  };
}

async function persistRun(
  questions: readonly DsfQuestionStudioQuestion[],
  requestSnapshot: Record<string, unknown>,
  actorUserId: string,
) {
  if (!questions.length) throw new Error("No Data Sufficiency questions matched the request.");
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
        'examtree', 'reasoning-v1-dsf-frozen-cp001-v1', 0, 0, 0, 0,
        ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}, ${timestamp}
      )
    `;

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      const itemId = randomUUID();
      const versionId = randomUUID();
      const payload = reviewPayload(question);
      await tx`
        INSERT INTO content.generation_run_items (
          id, generation_run_id, item_number, status, current_version_number, created_at, updated_at
        ) VALUES (
          ${itemId}::uuid, ${runId}::uuid, ${index + 1}, 'unreviewed'::generation_item_status, 1, ${timestamp}, ${timestamp}
        )
      `;
      await tx`
        INSERT INTO content.generation_item_versions (
          id, generation_item_id, version_number, payload, provider_item_id, created_at
        ) VALUES (
          ${versionId}::uuid, ${itemId}::uuid, 1, ${JSON.stringify(payload)}::jsonb,
          ${question.questionId}, ${timestamp}
        )
      `;
    }

    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, reason, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'question_studio.data_sufficiency_run.created', 'generation_run', ${runId}::uuid,
        'Frozen DSF-CP-001 authority entered the Question Studio review queue through DSF-CP-002 without opening downstream publication gates',
        ${`Created ${questions.length} Data Sufficiency review items in ${publicCode}`},
        ${JSON.stringify({
          requestSnapshot,
          integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
          sourceFreezeAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
          permanentQlIds: DSF_CP002_QUESTION_STUDIO_PACKAGE.permanentQlIds,
          productionDomainCount: 4,
          solveModeCount: 8,
          questionBankWritable: false,
          testEligible: false,
          publiclyPublishable: false,
        })}::jsonb
      )
    `;

    await tx`
      INSERT INTO platform.outbox_events (id, aggregate_type, aggregate_id, event_type, payload)
      VALUES (
        ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid, 'question_studio.data_sufficiency_run.created',
        ${JSON.stringify({
          runId,
          publicCode,
          itemCount: questions.length,
          chapter: "Data Sufficiency",
          integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
          sourceFreezeAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
          reviewOnly: true,
          questionBankWritable: false,
        })}::jsonb
      )
    `;
  });

  return { id: runId, publicCode, status: "review" as const, itemCount: questions.length };
}

router.use(authenticate);

router.get("/reasoning/data-sufficiency/package", requireAdminPermission("content.generation.read"), (_req, res) => {
  res.json({
    generationSystem: "reasoning-v1",
    activationMode: "QUESTION_STUDIO_CONNECTED",
    package: DSF_CP002_QUESTION_STUDIO_PACKAGE,
    maxBatchSize: 50,
    databaseWriteEnabled: true,
    persistenceAllowed: true,
    reviewOnly: true,
    questionBankWriteEnabled: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  });
});

router.get("/reasoning/data-sufficiency/preview", requireAdminPermission("content.generation.read"), (req, res) => {
  try {
    const filters = requestFilters(req.query as Record<string, unknown>);
    const result = generateDsfQuestionStudioBatch({
      ...filters,
      seed: asString(req.query.seed) || "dsf-question-studio-preview",
      count: asCount(req.query.count, 1, 20),
    });
    res.json({ ...result, productionEligible: false, reviewOnly: true });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unable to preview Data Sufficiency questions.",
    });
  }
});

router.post("/reasoning/data-sufficiency/runs", requireAdminPermission("content.generation.run"), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  if (!actorUserId) {
    res.status(403).json({ error: "Administrator session required." });
    return;
  }

  try {
    const filters = requestFilters((req.body ?? {}) as Record<string, unknown>);
    const count = asCount(req.body?.count, 5, 50);
    const seed = asString(req.body?.seed) || `dsf-run:${Date.now()}`;
    const result = generateDsfQuestionStudioBatch({ ...filters, seed, count });
    const persisted = await persistRun(result.questions, {
      chapter: "Data Sufficiency",
      domain: filters.domain ?? null,
      solveMode: filters.solveMode ?? null,
      semanticClass: filters.semanticClass ?? null,
      difficulty: filters.difficulty ?? null,
      language: filters.language ?? "en",
      answerProfile: filters.answerProfile ?? "GENERIC_DS_STANDARD_5_EN",
      count,
      seed,
      integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
      sourceFreezeAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      requestedByFirebaseUid: req.user?.id,
    }, actorUserId);

    res.status(201).json({
      ...persisted,
      generationSystem: "reasoning-v1",
      chapter: "Data Sufficiency",
      language: filters.language ?? "en",
      answerProfile: filters.answerProfile ?? "GENERIC_DS_STANDARD_5_EN",
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Data Sufficiency Question Studio run failed", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unable to create Data Sufficiency review run.",
    });
  }
});

router.get("/reasoning/data-sufficiency/status", requireAdminPermission("content.generation.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        count(*)::int AS "generationItemCount",
        count(*) FILTER (WHERE i.status = 'approved')::int AS "approvedItemCount",
        count(*) FILTER (WHERE i.accepted_question_id IS NOT NULL)::int AS "questionBankCount"
      FROM content.generation_run_items i
      INNER JOIN content.generation_item_versions v
        ON v.generation_item_id = i.id AND v.version_number = i.current_version_number
      WHERE v.payload ->> 'integrationAuthority' = ${DSF_CP002_QUESTION_STUDIO_AUTHORITY}
    `;

    res.json({
      chapter: "Data Sufficiency",
      permanentQlCount: DSF_CP002_QUESTION_STUDIO_PACKAGE.permanentQlIds.length,
      domainCount: DSF_CP002_QUESTION_STUDIO_PACKAGE.domains.length,
      solveModeCount: DSF_CP002_QUESTION_STUDIO_PACKAGE.solveModeCount,
      generationItemCount: Number(rows[0]?.generationItemCount ?? 0),
      approvedItemCount: Number(rows[0]?.approvedItemCount ?? 0),
      questionBankCount: Number(rows[0]?.questionBankCount ?? 0),
      integrationAuthority: DSF_CP002_QUESTION_STUDIO_AUTHORITY,
      sourceFreezeAuthority: DSF_CP002_QUESTION_STUDIO_PACKAGE.sourceFreezeAuthority,
      supportedLanguages: DSF_CP002_QUESTION_STUDIO_PACKAGE.supportedLanguages,
      supportedAnswerProfiles: DSF_CP002_QUESTION_STUDIO_PACKAGE.supportedAnswerProfiles,
      examSpecificAnswerProfilesImplemented: false,
      questionStudioDiscoverable: true,
      persistenceAllowed: true,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  } catch (error) {
    console.error("Data Sufficiency Question Studio status failed", error);
    res.status(500).json({ error: "Unable to load Data Sufficiency Question Studio status." });
  }
});

export default router;
