import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { ContentReviewError } from "../lib/admin-content-review";
import {
  computeChapterReadiness,
  contentIntelligenceReportHash,
  duplicatePairKey,
  findDuplicateCandidates,
  hasUnresolvedPlaceholder,
  normalizeChapterFreezeInput,
  normalizeDuplicateDecisionInput,
  type DuplicateDecisionRecord,
  type IntelligenceQuestionSnapshot,
} from "../lib/admin-content-intelligence";
import { requireAdminPermission, type AdminSession } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;
const QUESTION_SCAN_LIMIT = 1000;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function assertUuid(value: unknown, field: string): string {
  const text = asText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    throw new ContentReviewError("INVALID_CONTENT_INTELLIGENCE_ID", `${field} is invalid.`);
  }
  return text;
}

function session(req: { adminSession?: AdminSession }): AdminSession {
  if (!req.adminSession) {
    throw new ContentReviewError("ADMIN_SESSION_REQUIRED", "Administrator session is required.", 401);
  }
  return req.adminSession;
}

function sendError(res: Response, error: unknown, fallback = "Unable to complete the Content Review intelligence request"): void {
  if (error instanceof ContentReviewError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

async function loadChapterCatalog(client: SqlExecutor = sqlClient) {
  return client`
    WITH RECURSIVE roots AS (
      SELECT id, code, node_type, name, description
      FROM catalog.taxonomy_nodes
      WHERE deleted_at IS NULL
        AND is_active = true
        AND node_type IN ('chapter'::taxonomy_node_type, 'subtopic'::taxonomy_node_type)
    ), hierarchy(root_id, descendant_id) AS (
      SELECT id, id FROM roots
      UNION
      SELECT hierarchy.root_id, edge.child_id
      FROM hierarchy
      JOIN catalog.taxonomy_edges edge ON edge.parent_id = hierarchy.descendant_id
    )
    SELECT
      root.id::text AS id,
      root.code,
      root.node_type::text AS "nodeType",
      root.name,
      root.description,
      COUNT(DISTINCT question.id)::int AS "questionCount",
      COUNT(DISTINCT question.id) FILTER (
        WHERE question.status::text IN ('approved', 'published')
      )::int AS "approvedQuestionCount",
      MAX(mapping.target_coverage)::int AS "targetCoverage",
      latest_freeze.occurred_at AS "freezeChangedAt",
      latest_freeze.actor_name AS "freezeChangedByName",
      latest_freeze.metadata AS "freezeMetadata"
    FROM roots root
    LEFT JOIN hierarchy ON hierarchy.root_id = root.id
    LEFT JOIN content.question_taxonomy_links link ON link.taxonomy_node_id = hierarchy.descendant_id
    LEFT JOIN content.questions question
      ON COALESCE(question.current_draft_version_id, question.approved_version_id, question.published_version_id) = link.question_version_id
     AND question.deleted_at IS NULL
    LEFT JOIN catalog.exam_taxonomy_nodes mapping
      ON mapping.taxonomy_node_id = root.id
     AND mapping.is_active = true
    LEFT JOIN LATERAL (
      SELECT
        event.occurred_at,
        COALESCE(actor.display_name, actor.email) AS actor_name,
        event.metadata
      FROM platform.audit_events event
      LEFT JOIN identity.users actor ON actor.id = event.actor_user_id
      WHERE event.entity_type = 'taxonomy_node'
        AND event.entity_id = root.id
        AND event.action_key = 'content.chapter.freeze.changed'
      ORDER BY event.occurred_at DESC, event.id DESC
      LIMIT 1
    ) latest_freeze ON true
    GROUP BY root.id, latest_freeze.occurred_at, latest_freeze.actor_name, latest_freeze.metadata
    HAVING COUNT(DISTINCT question.id) > 0 OR MAX(mapping.target_coverage) IS NOT NULL
    ORDER BY root.name, root.code
  `;
}

async function assertChapterNode(chapterNodeId: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT id::text AS id, code, node_type::text AS "nodeType", name, description
    FROM catalog.taxonomy_nodes
    WHERE id = ${chapterNodeId}::uuid
      AND deleted_at IS NULL
      AND is_active = true
      AND node_type IN ('chapter'::taxonomy_node_type, 'subtopic'::taxonomy_node_type)
    LIMIT 1
  `;
  if (!rows[0]) {
    throw new ContentReviewError("CHAPTER_NOT_FOUND", "The selected chapter or subtopic does not exist.", 404);
  }
  return rows[0];
}

async function loadChapterQuestions(chapterNodeId: string, client: SqlExecutor = sqlClient) {
  return client`
    WITH RECURSIVE descendants(id) AS (
      SELECT ${chapterNodeId}::uuid
      UNION
      SELECT edge.child_id
      FROM catalog.taxonomy_edges edge
      JOIN descendants current ON current.id = edge.parent_id
    )
    SELECT DISTINCT ON (question.id)
      question.id::text AS id,
      question.public_code AS "publicCode",
      question.status::text AS status,
      version.id::text AS "versionId",
      version.stem,
      version.explanation,
      version.question_type::text AS "questionType",
      version.difficulty::text AS difficulty,
      question.updated_at AS "updatedAt",
      COALESCE((
        SELECT json_agg(
          json_build_object('text', option.text, 'isCorrect', option.is_correct)
          ORDER BY option.sort_order
        )
        FROM content.question_options option
        WHERE option.question_version_id = version.id
      ), '[]'::json) AS options,
      (
        SELECT COUNT(DISTINCT test_question.test_version_id)::int
        FROM assessment.test_questions test_question
        WHERE test_question.question_version_id = version.id
      ) AS "testUsageCount"
    FROM descendants
    JOIN content.question_taxonomy_links link ON link.taxonomy_node_id = descendants.id
    JOIN content.questions question
      ON COALESCE(question.current_draft_version_id, question.approved_version_id, question.published_version_id) = link.question_version_id
     AND question.deleted_at IS NULL
    JOIN content.question_versions version ON version.id = link.question_version_id
    ORDER BY question.id, link.is_primary DESC, version.version_number DESC
    LIMIT ${QUESTION_SCAN_LIMIT + 1}
  `;
}

async function loadDuplicateDecisions(chapterNodeId: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT
      event.occurred_at AS "occurredAt",
      COALESCE(actor.display_name, actor.email, 'Administrator') AS "actorName",
      event.reason,
      event.metadata
    FROM platform.audit_events event
    LEFT JOIN identity.users actor ON actor.id = event.actor_user_id
    WHERE event.entity_type = 'taxonomy_node'
      AND event.entity_id = ${chapterNodeId}::uuid
      AND event.action_key = 'content.duplicate.decision.recorded'
    ORDER BY event.occurred_at ASC, event.id ASC
    LIMIT 50000
  `;
  const decisions = new Map<string, DuplicateDecisionRecord>();
  for (const row of rows) {
    const metadata = asRecord(row.metadata);
    const pairKey = asText(metadata.pairKey);
    const decision = asText(metadata.decision);
    if (!pairKey || !["duplicate", "intentional_variant", "false_positive"].includes(decision)) continue;
    decisions.set(pairKey, {
      decision: decision as DuplicateDecisionRecord["decision"],
      canonicalQuestionId: metadata.canonicalQuestionId == null ? null : String(metadata.canonicalQuestionId),
      reason: row.reason == null ? null : String(row.reason),
      decidedAt: row.occurredAt == null ? null : new Date(row.occurredAt as string | number | Date).toISOString(),
      decidedByName: row.actorName == null ? null : String(row.actorName),
    });
  }
  return decisions;
}

async function loadOpenCommentCount(questionIds: string[], client: SqlExecutor = sqlClient): Promise<number> {
  if (questionIds.length === 0) return 0;
  const rows = await client`
    SELECT id::text AS id, action_key AS "actionKey", entity_id::text AS "entityId", metadata
    FROM platform.audit_events
    WHERE entity_type = 'question'
      AND entity_id = ANY(${questionIds}::uuid[])
      AND action_key IN (
        'content.review.comment.added',
        'content.review.comment.resolution.changed'
      )
    ORDER BY occurred_at ASC, id ASC
    LIMIT 50000
  `;
  const commentEntity = new Map<string, string>();
  const resolution = new Map<string, boolean>();
  for (const row of rows) {
    const metadata = asRecord(row.metadata);
    if (row.actionKey === "content.review.comment.added") {
      commentEntity.set(String(row.id), String(row.entityId));
    } else {
      const commentId = asText(metadata.commentId);
      if (commentId) resolution.set(commentId, metadata.resolved === true);
    }
  }
  let open = 0;
  for (const commentId of commentEntity.keys()) {
    if (resolution.get(commentId) !== true) open += 1;
  }
  return open;
}

async function loadLatestFreeze(chapterNodeId: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT
      event.occurred_at AS "occurredAt",
      COALESCE(actor.display_name, actor.email, 'Administrator') AS "actorName",
      event.reason,
      event.metadata
    FROM platform.audit_events event
    LEFT JOIN identity.users actor ON actor.id = event.actor_user_id
    WHERE event.entity_type = 'taxonomy_node'
      AND event.entity_id = ${chapterNodeId}::uuid
      AND event.action_key = 'content.chapter.freeze.changed'
    ORDER BY event.occurred_at DESC, event.id DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function targetCoverageForChapter(chapterNodeId: string, client: SqlExecutor = sqlClient): Promise<number | null> {
  const rows = await client`
    SELECT MAX(target_coverage)::int AS target
    FROM catalog.exam_taxonomy_nodes
    WHERE taxonomy_node_id = ${chapterNodeId}::uuid
      AND is_active = true
  `;
  const target = rows[0]?.target;
  return target == null ? null : Number(target);
}

async function buildChapterReport(chapterNodeId: string, client: SqlExecutor = sqlClient) {
  const chapter = await assertChapterNode(chapterNodeId, client);
  const rawQuestions = await loadChapterQuestions(chapterNodeId, client);
  const scanTruncated = rawQuestions.length > QUESTION_SCAN_LIMIT;
  const selectedRows = rawQuestions.slice(0, QUESTION_SCAN_LIMIT);
  const questions: IntelligenceQuestionSnapshot[] = selectedRows.map((row) => ({
    id: String(row.id),
    publicCode: String(row.publicCode),
    status: String(row.status),
    versionId: String(row.versionId),
    stem: String(row.stem ?? ""),
    explanation: String(row.explanation ?? ""),
    questionType: String(row.questionType ?? ""),
    difficulty: String(row.difficulty ?? ""),
    options: Array.isArray(row.options)
      ? row.options.map((option) => ({
          text: String(asRecord(option).text ?? ""),
          isCorrect: asRecord(option).isCorrect === true,
        }))
      : [],
    updatedAt: new Date(row.updatedAt as string | number | Date).toISOString(),
    testUsageCount: Number(row.testUsageCount ?? 0),
  }));
  const questionIds = questions.map((question) => question.id);
  const [decisions, openCommentCount, latestFreeze, targetCoverage] = await Promise.all([
    loadDuplicateDecisions(chapterNodeId, client),
    loadOpenCommentCount(questionIds, client),
    loadLatestFreeze(chapterNodeId, client),
    targetCoverageForChapter(chapterNodeId, client),
  ]);
  const duplicateCandidates = findDuplicateCandidates(questions, decisions);
  const unresolvedCriticalDuplicateCount = duplicateCandidates.filter((candidate) =>
    candidate.severity === "critical"
    && !["intentional_variant", "false_positive"].includes(candidate.decision.decision),
  ).length;
  const unresolvedWarningDuplicateCount = duplicateCandidates.filter((candidate) =>
    candidate.severity === "warning"
    && candidate.decision.decision === "unresolved",
  ).length;
  const approvedQuestionCount = questions.filter((question) => ["approved", "published"].includes(question.status)).length;
  const unresolvedPlaceholderCount = questions.filter((question) =>
    hasUnresolvedPlaceholder(question.stem) || hasUnresolvedPlaceholder(question.explanation),
  ).length;
  const testUsageCount = questions.reduce((sum, question) => sum + question.testUsageCount, 0);
  const readiness = computeChapterReadiness({
    questionCount: questions.length,
    approvedQuestionCount,
    targetCoverage,
    unresolvedPlaceholderCount,
    unresolvedCriticalDuplicateCount,
    unresolvedWarningDuplicateCount,
    openCommentCount,
    testUsageCount,
    scanTruncated,
  });
  const metrics = {
    questionCount: questions.length,
    approvedQuestionCount,
    targetCoverage,
    unresolvedPlaceholderCount,
    unresolvedCriticalDuplicateCount,
    unresolvedWarningDuplicateCount,
    openCommentCount,
    testUsageCount,
    duplicateCandidateCount: duplicateCandidates.length,
    scanTruncated,
  };
  const reportCore = {
    chapter: {
      id: String(chapter.id),
      code: String(chapter.code),
      nodeType: String(chapter.nodeType),
      name: String(chapter.name),
      description: chapter.description == null ? null : String(chapter.description),
    },
    metrics,
    readiness,
    questionVersions: questions.map((question) => ({
      questionId: question.id,
      publicCode: question.publicCode,
      versionId: question.versionId,
      status: question.status,
    })),
    duplicateDecisions: duplicateCandidates.map((candidate) => ({
      pairKey: candidate.pairKey,
      kind: candidate.kind,
      severity: candidate.severity,
      score: candidate.score,
      decision: candidate.decision,
    })),
  };
  const reportHash = contentIntelligenceReportHash(reportCore);
  const freezeMetadata = asRecord(latestFreeze?.metadata);
  const recordedState = asText(freezeMetadata.state) || "open";
  const frozenReportHash = asText(freezeMetadata.reportHash) || null;
  const freezeState = recordedState === "frozen" && frozenReportHash !== reportHash ? "stale" : recordedState;

  return {
    ...reportCore,
    questions,
    duplicateCandidates,
    languageReadiness: {
      canonicalLanguage: "English",
      english: questions.length > 0 && unresolvedPlaceholderCount === 0 ? "ready" : "blocked",
      hindi: "not_connected",
      punjabi: "not_connected",
      note: "Hindi and Punjabi are reported honestly but are not yet connected to canonical per-language publication gates.",
    },
    freeze: {
      state: freezeState,
      recordedState,
      changedAt: latestFreeze?.occurredAt == null ? null : new Date(latestFreeze.occurredAt as string | number | Date).toISOString(),
      changedByName: latestFreeze?.actorName == null ? null : String(latestFreeze.actorName),
      reason: latestFreeze?.reason == null ? null : String(latestFreeze.reason),
      reportHash: frozenReportHash,
    },
    reportHash,
    generatedAt: new Date().toISOString(),
  };
}

async function writeAuditEvent(
  client: SqlExecutor,
  actor: AdminSession,
  input: {
    actionKey: string;
    chapterNodeId: string;
    reason: string;
    summary: string;
    metadata: Record<string, unknown>;
  },
): Promise<void> {
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key,
      action_key, entity_type, entity_id, reason, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid,
      'user'::audit_actor_type,
      ${actor.user.id}::uuid,
      ${actor.roles[0] ?? null},
      ${input.actionKey},
      'taxonomy_node',
      ${input.chapterNodeId}::uuid,
      ${input.reason},
      ${input.summary},
      ${client.json(input.metadata)}
    )
  `;
}

router.use(authenticate);

router.get("/intelligence/chapters", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const rows = await loadChapterCatalog();
    res.json({
      chapters: rows.map((row) => {
        const metadata = asRecord(row.freezeMetadata);
        return {
          id: String(row.id),
          code: String(row.code),
          nodeType: String(row.nodeType),
          name: String(row.name),
          description: row.description == null ? null : String(row.description),
          questionCount: Number(row.questionCount ?? 0),
          approvedQuestionCount: Number(row.approvedQuestionCount ?? 0),
          targetCoverage: row.targetCoverage == null ? null : Number(row.targetCoverage),
          freezeState: asText(metadata.state) || "open",
          freezeChangedAt: row.freezeChangedAt == null ? null : new Date(row.freezeChangedAt as string | number | Date).toISOString(),
          freezeChangedByName: row.freezeChangedByName == null ? null : String(row.freezeChangedByName),
        };
      }),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to load chapter intelligence catalogue");
  }
});

router.get("/intelligence/chapters/:chapterNodeId", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const chapterNodeId = assertUuid(req.params.chapterNodeId, "chapterNodeId");
    res.json(await buildChapterReport(chapterNodeId));
  } catch (error) {
    sendError(res, error, "Unable to build the chapter intelligence report");
  }
});

router.get("/intelligence/chapters/:chapterNodeId/report.json", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const chapterNodeId = assertUuid(req.params.chapterNodeId, "chapterNodeId");
    const report = await buildChapterReport(chapterNodeId);
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${report.chapter.code.toLowerCase()}-freeze-readiness.json"`);
    res.send(JSON.stringify(report, null, 2));
  } catch (error) {
    sendError(res, error, "Unable to export the chapter intelligence report");
  }
});

router.post("/intelligence/duplicate-decisions", requireAdminPermission("content.questions.approve"), async (req, res) => {
  try {
    const actor = session(req);
    const input = normalizeDuplicateDecisionInput(req.body);
    const report = await buildChapterReport(input.chapterNodeId);
    const pairKey = duplicatePairKey(input.leftQuestionId, input.rightQuestionId);
    const candidate = report.duplicateCandidates.find((entry) => entry.pairKey === pairKey);
    if (!candidate) {
      throw new ContentReviewError(
        "DUPLICATE_CANDIDATE_STALE",
        "This pair is no longer a duplicate candidate. Refresh the chapter report.",
        409,
      );
    }
    await writeAuditEvent(sqlClient, actor, {
      actionKey: "content.duplicate.decision.recorded",
      chapterNodeId: input.chapterNodeId,
      reason: input.reason,
      summary: `Recorded ${input.decision.replace("_", " ")} decision for ${candidate.left.publicCode} and ${candidate.right.publicCode}`,
      metadata: {
        pairKey,
        leftQuestionId: input.leftQuestionId,
        rightQuestionId: input.rightQuestionId,
        decision: input.decision,
        canonicalQuestionId: input.canonicalQuestionId,
        matchKind: candidate.kind,
        severity: candidate.severity,
        score: candidate.score,
        versionIds: [candidate.left.versionId, candidate.right.versionId],
      },
    });
    res.json(await buildChapterReport(input.chapterNodeId));
  } catch (error) {
    sendError(res, error, "Unable to record the duplicate decision");
  }
});

router.post("/intelligence/chapters/:chapterNodeId/freeze", requireAdminPermission("content.questions.approve"), async (req, res) => {
  try {
    const actor = session(req);
    const chapterNodeId = assertUuid(req.params.chapterNodeId, "chapterNodeId");
    const input = normalizeChapterFreezeInput(req.body);
    const report = await buildChapterReport(chapterNodeId);
    if (input.action === "freeze" && !report.readiness.ready) {
      throw new ContentReviewError(
        "CHAPTER_NOT_FREEZE_READY",
        "Resolve every blocking readiness issue before freezing this chapter.",
        409,
        { blockers: report.readiness.blockers, reportHash: report.reportHash },
      );
    }
    const state = input.action === "freeze" ? "frozen" : "open";
    await writeAuditEvent(sqlClient, actor, {
      actionKey: "content.chapter.freeze.changed",
      chapterNodeId,
      reason: input.reason,
      summary: `${input.action === "freeze" ? "Froze" : input.action === "reopen" ? "Reopened" : "Unfroze"} chapter ${report.chapter.code}`,
      metadata: {
        state,
        action: input.action,
        reportHash: report.reportHash,
        readiness: report.readiness,
        metrics: report.metrics,
        questionVersions: report.questionVersions,
        languageReadiness: report.languageReadiness,
      },
    });
    res.json(await buildChapterReport(chapterNodeId));
  } catch (error) {
    sendError(res, error, "Unable to change the chapter freeze state");
  }
});

export default router;
