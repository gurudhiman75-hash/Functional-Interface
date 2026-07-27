import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { analyzeGeneratedQuestionPayload } from "../lib/question-studio-quality";
import {
  buildRegenerationPayload,
  getRegenerationEligibility,
  type RegenerationSource,
} from "../lib/question-studio-regeneration";
import { authenticate } from "../middlewares/auth";
import { listQuantV4Packages } from "../quant-v4/question-studio-generation-engine";
import {
  generateQuestion as generateReasoningV1Questions,
  isOps001Request,
  listReasoningV1Packages,
  type ReasoningV1Difficulty,
  type ReasoningV1Language,
} from "../reasoning-v1/generation-engine";
import {
  OPS_CHECKPOINT_RANGES,
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
} from "../reasoning-v1/topics/Mathematical-Operations/OPS-001/registry";

const router = Router();
const LANGUAGES = new Set(["en", "hi", "pa"]);
const DIFFICULTIES = new Set(["Easy", "Medium", "Hard"]);

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asPositiveInteger(value: unknown, fallback: number, max: number): number {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
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

function publicRunCode(): string {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();
  return `GEN-${date}-${suffix}`;
}

function packageCpIds(pkg: any): string[] {
  if (Array.isArray(pkg.cpIds)) return pkg.cpIds.map(String);
  if (Array.isArray(pkg.canonicalProblems)) {
    return pkg.canonicalProblems
      .map((entry: any) => String(entry?.id ?? ""))
      .filter(Boolean);
  }
  return [];
}

function packageCapabilities(pkg: any) {
  return {
    packageId: String(pkg.packageId),
    topic: String(pkg.topic),
    subtopic: String(pkg.subtopic),
    label: String(pkg.label),
    enabled: Boolean(pkg.enabled),
    cpIds: packageCpIds(pkg),
    supportedLanguages: Array.isArray(pkg.supportedLanguages)
      ? pkg.supportedLanguages.map(String)
      : ["en"],
    section: String(pkg.section ?? (pkg.domain === "reasoning" ? "Reasoning" : "Quant")),
    domain: String(pkg.domain ?? "quant"),
    generationDomain: String(pkg.generationDomain ?? pkg.type ?? "quant-v4"),
    publiclyPublishable: pkg.publiclyPublishable !== false,
    maturity: String(pkg.maturity ?? "RUNTIME"),
    qlCount: Number(pkg.qlCount ?? 0) || undefined,
  };
}

function rowIsOps(row: any): boolean {
  const payload = asRecord(row?.payload);
  const snapshot = asRecord(row?.requestSnapshot);
  return isOps001Request({
    packageId: asString(payload.packageId) || asString(snapshot.packageId),
    patternId: asString(payload.patternId) || asString(snapshot.patternId),
    topic: asString(payload.topic) || asString(snapshot.topic),
    subtopic: asString(payload.subtopic) || asString(snapshot.subtopic),
  });
}

router.use(authenticate);

router.get(
  "/capabilities",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const packages = [
        ...listQuantV4Packages(),
        ...listReasoningV1Packages(),
      ];
      const unique = new Map<string, ReturnType<typeof packageCapabilities>>();
      for (const pkg of packages) {
        unique.set(String(pkg.packageId), packageCapabilities(pkg));
      }
      res.json({
        generationSystem: "examtree-v1",
        generationSystems: ["quant-v4", "reasoning-v1"],
        packages: [...unique.values()],
        difficulties: ["Easy", "Medium", "Hard"],
        languages: ["en", "hi", "pa"],
        maxBatchSize: 50,
      });
    } catch (error) {
      console.error("Question Studio combined capabilities failed", error);
      res.status(500).json({ error: "Unable to load generation capabilities" });
    }
  },
);

router.get(
  "/packages/OPS-001/manifest",
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    res.json({
      package: listReasoningV1Packages()[0],
      qlFreezeVersion: OPS_QL_FREEZE_VERSION,
      checkpointRanges: OPS_CHECKPOINT_RANGES,
      questionLogics: OPS_QL_ENTRIES,
      publication: {
        publiclyPublishable: false,
        publicationEnabled: false,
      },
    });
  },
);

router.get(
  "/packages/OPS-001/preview",
  requireAdminPermission("content.generation.read"),
  async (req, res) => {
    try {
      const result = await generateReasoningV1Questions({
        packageId: "OPS-001",
        canonicalProblemId: asString(req.query.canonicalProblemId) || undefined,
        questionLanguageId: asString(req.query.questionLanguageId) || undefined,
        difficulty: normalizeDifficulty(req.query.difficulty),
        language: normalizeLanguage(req.query.language),
        seed: asString(req.query.seed) || "ops-001-admin-preview",
        count: asPositiveInteger(req.query.count, 1, 20),
      });
      res.json(result);
    } catch (error) {
      const statusCode = Number((error as { statusCode?: unknown })?.statusCode) || 400;
      res.status(statusCode).json({
        error: error instanceof Error ? error.message : "OPS-001 preview failed",
      });
    }
  },
);

router.post(
  "/runs",
  requireAdminPermission("content.generation.run"),
  async (req, res, next) => {
    if (!isOps001Request(req.body ?? {})) {
      next();
      return;
    }

    const count = asPositiveInteger(req.body?.count, 5, 50);
    const difficulty = normalizeDifficulty(req.body?.difficulty);
    const language = normalizeLanguage(req.body?.language);
    const seed = asString(req.body?.seed) || undefined;
    const canonicalProblemId = asString(req.body?.canonicalProblemId) || undefined;
    const questionLanguageId = asString(req.body?.questionLanguageId) || undefined;
    const exam = asString(req.body?.exam) || "SSC CGL";
    const subject = "Reasoning Ability";
    const topic = "Mathematical Operations";
    const subtopic = "Symbol Substitution";
    const runId = randomUUID();
    const code = publicRunCode();
    const timestamp = new Date().toISOString();
    const requestSnapshot = {
      exam,
      subject,
      difficulty,
      count,
      packageId: "OPS-001",
      patternId: asString(req.body?.patternId) || undefined,
      topic,
      subtopic,
      canonicalProblemId,
      questionLanguageId,
      language,
      seed,
      generationDomain: "reasoning-v1",
      publiclyPublishable: false,
      publicationEnabled: false,
      requestedByFirebaseUid: req.user?.id,
    };

    try {
      const result = await generateReasoningV1Questions({
        packageId: "OPS-001",
        canonicalProblemId,
        questionLanguageId,
        difficulty,
        language,
        seed,
        count,
      });
      const generatedQuestions = Array.isArray(result.questions) ? result.questions : [];
      if (generatedQuestions.length === 0) {
        res.status(422).json({ error: "The OPS-001 generation engine returned no questions" });
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
            'examtree', 'reasoning-v1', 0, 0, 0, 0,
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
            publiclyPublishable: false,
            publicationEnabled: false,
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
            ${runId}::uuid, 'Admin generated an internal OPS-001 review batch',
            ${`Generated ${generatedQuestions.length} OPS-001 questions in ${code}`},
            ${JSON.stringify({ firebaseUid: req.user?.id, requestSnapshot })}
          )
        `;
        await tx`
          INSERT INTO platform.outbox_events (
            id, aggregate_type, aggregate_id, event_type, payload
          ) VALUES (
            ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
            'question_studio.generation_run.created',
            ${JSON.stringify({
              runId,
              publicCode: code,
              itemCount: generatedQuestions.length,
              packageId: "OPS-001",
              generationDomain: "reasoning-v1",
              publiclyPublishable: false,
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
        publiclyPublishable: false,
      });
    } catch (error) {
      console.error("OPS-001 Question Studio generation failed", error);
      const statusCode = Number((error as { statusCode?: unknown })?.statusCode) || 500;
      res.status(statusCode).json({
        error: error instanceof Error ? error.message : "OPS-001 generation failed",
      });
    }
  },
);

router.post(
  "/items/regenerate",
  requireAdminPermission("content.generation.run"),
  async (req, res, next) => {
    const rawIds = Array.isArray(req.body?.itemIds) ? req.body.itemIds : [];
    const itemIds = [...new Set(rawIds.map(asString).filter(Boolean))].slice(0, 50);
    if (itemIds.length === 0) {
      next();
      return;
    }

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
    const opsRows = rows.filter(rowIsOps);
    if (opsRows.length === 0) {
      next();
      return;
    }
    if (opsRows.length !== rows.length || rows.length !== itemIds.length) {
      res.status(400).json({
        error: "Regenerate OPS-001 and non-OPS items in separate selections.",
      });
      return;
    }

    const reason = asString(req.body?.reason);
    const actorUserId = req.adminSession?.user.id;
    if (!reason) {
      res.status(400).json({ error: "A regeneration reason is required" });
      return;
    }
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }

    const skipped: Array<{ itemId: string; code: string; message: string }> = [];
    const failed: Array<{ itemId: string; message: string }> = [];
    const prepared: Array<{
      source: RegenerationSource & { generationRunId: string; itemNumber: number };
      payload: Record<string, unknown>;
      providerItemId: string | null;
      quality: ReturnType<typeof analyzeGeneratedQuestionPayload>;
      seed: string;
    }> = [];

    for (const row of rows) {
      const source: RegenerationSource & { generationRunId: string; itemNumber: number } = {
        itemId: String(row.id),
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
        skipped.push({
          itemId: source.itemId,
          code: eligibility.code,
          message: eligibility.message,
        });
        continue;
      }

      const payload = source.payload;
      const metadata = asRecord(payload.metadata);
      const seed = [
        "question-studio-regeneration",
        source.runCode,
        source.itemId,
        source.currentVersionNumber + 1,
        randomUUID(),
      ].join(":");
      try {
        const generated = await generateReasoningV1Questions({
          packageId: "OPS-001",
          canonicalProblemId:
            asString(payload.canonicalProblemId) ||
            asString(metadata.checkpointId) ||
            asString(source.requestSnapshot.canonicalProblemId) ||
            undefined,
          questionLanguageId:
            asString(payload.questionLanguageId) ||
            asString(metadata.qlId) ||
            undefined,
          difficulty:
            asString(payload.difficultyLabel) ||
            asString(payload.difficulty) ||
            asString(source.requestSnapshot.difficulty) ||
            "Medium",
          language: normalizeLanguage(
            asString(payload.language) ||
            asString(metadata.language) ||
            asString(source.requestSnapshot.language),
          ),
          seed,
          count: 1,
        });
        const generatedQuestion = Array.isArray(generated.questions)
          ? generated.questions[0]
          : null;
        if (!generatedQuestion || typeof generatedQuestion !== "object") {
          failed.push({
            itemId: source.itemId,
            message: "The OPS-001 engine returned no replacement question.",
          });
          continue;
        }
        const regeneratedAt = new Date().toISOString();
        const nextPayload = buildRegenerationPayload(
          generatedQuestion as Record<string, unknown>,
          generated.generationContext,
          source,
          reason,
          regeneratedAt,
        );
        prepared.push({
          source,
          payload: {
            ...nextPayload,
            publiclyPublishable: false,
            publicationEnabled: false,
          },
          providerItemId: asString((generatedQuestion as Record<string, unknown>).questionId) || null,
          quality: analyzeGeneratedQuestionPayload(nextPayload),
          seed,
        });
      } catch (error) {
        failed.push({
          itemId: source.itemId,
          message: error instanceof Error ? error.message : "OPS-001 regeneration failed.",
        });
      }
    }

    if (prepared.length === 0) {
      res.status(422).json({
        error: "No selected OPS-001 items could be regenerated.",
        regenerated: [],
        regeneratedCount: 0,
        skipped,
        failed,
      });
      return;
    }

    const writeResult = await sqlClient.begin(async (tx) => {
      const regenerated: Array<Record<string, unknown>> = [];
      const writeSkipped: Array<{ itemId: string; code: string; message: string }> = [];
      const changedRunIds = new Set<string>();

      for (const candidate of prepared) {
        const currentRows = await tx`
          SELECT status, current_version_number AS "currentVersionNumber",
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
            id, generation_item_id, version_number, payload,
            provider_item_id, created_at
          ) VALUES (
            ${versionId}::uuid, ${candidate.source.itemId}::uuid,
            ${nextVersionNumber}, ${tx.json(candidate.payload)},
            ${candidate.providerItemId}, now()
          )
        `;
        await tx`
          UPDATE content.generation_run_items
          SET current_version_number = ${nextVersionNumber},
              status = 'unreviewed'::generation_item_status,
              retry_reason = NULL,
              reviewer_user_id = ${actorUserId}::uuid,
              updated_at = now()
          WHERE id = ${candidate.source.itemId}::uuid
        `;
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type,
            entity_id, entity_version_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid, 'user'::audit_actor_type,
            ${actorUserId}::uuid,
            'question_studio.generated_item.regenerated', 'generation_item',
            ${candidate.source.itemId}::uuid, ${versionId}::uuid,
            ${reason},
            ${`Regenerated OPS-001 item ${candidate.source.itemNumber} in ${candidate.source.runCode}`},
            ${tx.json({
              packageId: "OPS-001",
              generationDomain: "reasoning-v1",
              previousVersionNumber: candidate.source.currentVersionNumber,
              versionNumber: nextVersionNumber,
              seed: candidate.seed,
              qualityScore: candidate.quality.score,
              publiclyPublishable: false,
            })}
          )
        `;
        await tx`
          INSERT INTO platform.outbox_events (
            id, aggregate_type, aggregate_id, event_type, payload
          ) VALUES (
            ${randomUUID()}::uuid, 'generation_item',
            ${candidate.source.itemId}::uuid,
            'question_studio.generated_item.regenerated',
            ${tx.json({
              itemId: candidate.source.itemId,
              generationRunId: candidate.source.generationRunId,
              versionNumber: nextVersionNumber,
              packageId: "OPS-001",
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
  },
);

export default router;
