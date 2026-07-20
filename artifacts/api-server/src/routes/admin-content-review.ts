import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  ContentReviewError,
  normalizeCommentResolutionInput,
  normalizeReviewAssignmentInput,
  normalizeReviewCommentInput,
  normalizeReviewEntityType,
  reviewEntityKey,
  type ReviewEntityType,
} from "../lib/admin-content-review";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

const COLLABORATION_ACTIONS = [
  "content.review.assignment.changed",
  "content.review.comment.added",
  "content.review.comment.resolution.changed",
];

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof ContentReviewError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }
  console.error("Content Review request failed", error);
  res.status(500).json({ error: "Unable to complete the Content Review request" });
}

async function assertReviewEntityExists(
  entityType: ReviewEntityType,
  entityId: string,
  client: typeof sqlClient = sqlClient,
): Promise<void> {
  const rows = entityType === "generation_item"
    ? await client`
        SELECT id
        FROM content.generation_run_items
        WHERE id = ${entityId}::uuid
        LIMIT 1
      `
    : await client`
        SELECT id
        FROM content.questions
        WHERE id = ${entityId}::uuid AND deleted_at IS NULL
        LIMIT 1
      `;
  if (rows.length === 0) {
    throw new ContentReviewError(
      "REVIEW_ENTITY_NOT_FOUND",
      "The selected review item no longer exists.",
      404,
    );
  }
}

router.use(authenticate);

router.get(
  "/workspace",
  requireAdminPermission("content.questions.read"),
  async (_req, res) => {
    try {
      const reviewers = await sqlClient`
        SELECT
          u.id::text AS id,
          u.email,
          u.display_name AS "displayName",
          p.employee_code AS "employeeCode",
          p.department,
          p.title
        FROM identity.admin_profiles p
        INNER JOIN identity.users u ON u.id = p.user_id
        WHERE p.is_suspended = false
          AND u.deleted_at IS NULL
          AND u.status = 'active'::user_status
        ORDER BY u.display_name, u.email
      `;

      const generatedItems = await sqlClient`
        SELECT
          i.id::text AS "entityId",
          r.public_code AS "publicCode",
          i.status,
          i.current_version_number AS "versionNumber",
          i.reviewer_user_id::text AS "physicalReviewerUserId",
          i.retry_reason AS "retryReason",
          i.created_at AS "createdAt",
          i.updated_at AS "updatedAt",
          r.due_at AS "dueAt",
          r.request_snapshot AS "requestSnapshot",
          v.id::text AS "versionId",
          v.payload AS "currentPayload",
          pv.id::text AS "previousVersionId",
          pv.version_number AS "previousVersionNumber",
          pv.payload AS "previousPayload"
        FROM content.generation_run_items i
        INNER JOIN content.generation_runs r ON r.id = i.generation_run_id
        INNER JOIN content.generation_item_versions v
          ON v.generation_item_id = i.id
         AND v.version_number = i.current_version_number
        LEFT JOIN content.generation_item_versions pv
          ON pv.generation_item_id = i.id
         AND pv.version_number = i.current_version_number - 1
        WHERE i.accepted_question_id IS NULL
        ORDER BY i.updated_at DESC, r.created_at DESC, i.item_number
        LIMIT 3000
      `;

      const questions = await sqlClient`
        SELECT
          q.id::text AS "entityId",
          q.public_code AS "publicCode",
          q.status,
          q.lock_version AS "lockVersion",
          q.created_at AS "createdAt",
          q.updated_at AS "updatedAt",
          v.id::text AS "versionId",
          v.version_number AS "versionNumber",
          v.stem,
          v.explanation,
          v.difficulty,
          v.question_type AS "questionType",
          e.name AS "examName",
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', o.id,
                'key', o.option_key,
                'text', o.text,
                'sortOrder', o.sort_order,
                'isCorrect', o.is_correct
              ) ORDER BY o.sort_order
            )
            FROM content.question_options o
            WHERE o.question_version_id = v.id
          ), '[]'::json) AS options,
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', n.id,
                'code', n.code,
                'nodeType', n.node_type,
                'name', n.name,
                'isPrimary', l.is_primary
              ) ORDER BY l.is_primary DESC, n.node_type, n.name
            )
            FROM content.question_taxonomy_links l
            INNER JOIN catalog.taxonomy_nodes n ON n.id = l.taxonomy_node_id
            WHERE l.question_version_id = v.id
          ), '[]'::json) AS taxonomy,
          pv.id::text AS "previousVersionId",
          pv.version_number AS "previousVersionNumber",
          pv.stem AS "previousStem",
          pv.explanation AS "previousExplanation",
          pv.difficulty AS "previousDifficulty",
          COALESCE((
            SELECT json_agg(
              json_build_object(
                'id', po.id,
                'key', po.option_key,
                'text', po.text,
                'sortOrder', po.sort_order,
                'isCorrect', po.is_correct
              ) ORDER BY po.sort_order
            )
            FROM content.question_options po
            WHERE po.question_version_id = pv.id
          ), '[]'::json) AS "previousOptions"
        FROM content.questions q
        INNER JOIN content.question_versions v
          ON v.id = COALESCE(q.current_draft_version_id, q.approved_version_id, q.published_version_id)
        LEFT JOIN LATERAL (
          SELECT previous.*
          FROM content.question_versions previous
          WHERE previous.question_id = q.id
            AND previous.version_number < v.version_number
          ORDER BY previous.version_number DESC
          LIMIT 1
        ) pv ON true
        LEFT JOIN catalog.exam_versions ev ON ev.id = v.exam_version_id
        LEFT JOIN catalog.exams e ON e.id = ev.exam_id
        WHERE q.deleted_at IS NULL
          AND q.status IN (
            'draft'::question_status,
            'generated'::question_status,
            'under_review'::question_status,
            'needs_fix'::question_status,
            'rejected'::question_status
          )
        ORDER BY q.updated_at DESC
        LIMIT 2000
      `;

      const allEntityIds = [
        ...generatedItems.map((item) => String(item.entityId)),
        ...questions.map((question) => String(question.entityId)),
      ];
      const collaborationEvents = allEntityIds.length === 0
        ? []
        : await sqlClient`
            SELECT
              ae.id::text AS id,
              ae.occurred_at AS "occurredAt",
              ae.actor_user_id::text AS "actorUserId",
              actor.display_name AS "actorName",
              actor.email AS "actorEmail",
              ae.action_key AS "actionKey",
              ae.entity_type AS "entityType",
              ae.entity_id::text AS "entityId",
              ae.entity_version_id::text AS "entityVersionId",
              ae.reason,
              ae.summary,
              ae.metadata
            FROM platform.audit_events ae
            LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
            WHERE ae.action_key = ANY(${COLLABORATION_ACTIONS}::varchar[])
              AND ae.entity_id = ANY(${allEntityIds}::uuid[])
              AND ae.entity_type IN ('generation_item', 'question')
            ORDER BY ae.occurred_at ASC, ae.id ASC
            LIMIT 20000
          `;

      const reviewerById = new Map(
        reviewers.map((reviewer) => [String(reviewer.id), reviewer]),
      );
      const assignmentByEntity = new Map<string, Record<string, unknown>>();
      const commentsByEntity = new Map<string, Array<Record<string, unknown>>>();
      const commentById = new Map<string, Record<string, unknown>>();
      const resolutionByComment = new Map<string, { resolved: boolean; occurredAt: unknown; actorName: unknown }>();

      for (const event of collaborationEvents) {
        const entityType = String(event.entityType) as ReviewEntityType;
        const entityId = String(event.entityId);
        const key = reviewEntityKey(entityType, entityId);
        const metadata = asRecord(event.metadata);
        if (event.actionKey === "content.review.assignment.changed") {
          assignmentByEntity.set(key, {
            reviewerUserId: metadata.assignedReviewerUserId == null
              ? null
              : String(metadata.assignedReviewerUserId),
            assignedAt: event.occurredAt,
            assignedByUserId: event.actorUserId,
            assignedByName: event.actorName ?? event.actorEmail ?? null,
            reason: event.reason,
          });
        } else if (event.actionKey === "content.review.comment.added") {
          const comment = {
            id: String(event.id),
            entityType,
            entityId,
            entityVersionId: event.entityVersionId ? String(event.entityVersionId) : null,
            parentCommentId: metadata.parentCommentId == null ? null : String(metadata.parentCommentId),
            message: event.reason ?? event.summary,
            actorUserId: event.actorUserId ? String(event.actorUserId) : null,
            actorName: event.actorName ?? event.actorEmail ?? "Administrator",
            createdAt: event.occurredAt,
            resolved: false,
            resolvedAt: null,
            resolvedByName: null,
          };
          const bucket = commentsByEntity.get(key) ?? [];
          bucket.push(comment);
          commentsByEntity.set(key, bucket);
          commentById.set(String(event.id), comment);
        } else if (event.actionKey === "content.review.comment.resolution.changed") {
          const commentId = asText(metadata.commentId);
          if (commentId) {
            resolutionByComment.set(commentId, {
              resolved: metadata.resolved === true,
              occurredAt: event.occurredAt,
              actorName: event.actorName ?? event.actorEmail ?? "Administrator",
            });
          }
        }
      }

      for (const [commentId, resolution] of resolutionByComment) {
        const comment = commentById.get(commentId);
        if (!comment) continue;
        comment.resolved = resolution.resolved;
        comment.resolvedAt = resolution.occurredAt;
        comment.resolvedByName = resolution.actorName;
      }

      function collaborationFor(
        entityType: ReviewEntityType,
        entityId: string,
        physicalReviewerUserId?: unknown,
      ) {
        const key = reviewEntityKey(entityType, entityId);
        const eventAssignment = assignmentByEntity.get(key);
        const reviewerUserId = eventAssignment
          ? eventAssignment.reviewerUserId
          : physicalReviewerUserId == null
            ? null
            : String(physicalReviewerUserId);
        const reviewer = reviewerUserId ? reviewerById.get(String(reviewerUserId)) : null;
        const comments = commentsByEntity.get(key) ?? [];
        return {
          assignment: {
            reviewerUserId,
            reviewerName: reviewer?.displayName ?? reviewer?.email ?? null,
            assignedAt: eventAssignment?.assignedAt ?? null,
            assignedByUserId: eventAssignment?.assignedByUserId ?? null,
            assignedByName: eventAssignment?.assignedByName ?? null,
            reason: eventAssignment?.reason ?? null,
          },
          comments,
          openCommentCount: comments.filter((comment) => comment.resolved !== true).length,
        };
      }

      res.json({
        reviewers,
        items: [
          ...generatedItems.map((item) => ({
            key: reviewEntityKey("generation_item", String(item.entityId)),
            entityType: "generation_item",
            source: "Question Studio",
            ...item,
            collaboration: collaborationFor(
              "generation_item",
              String(item.entityId),
              item.physicalReviewerUserId,
            ),
          })),
          ...questions.map((question) => ({
            key: reviewEntityKey("question", String(question.entityId)),
            entityType: "question",
            source: "Question Bank",
            ...question,
            collaboration: collaborationFor("question", String(question.entityId)),
          })),
        ],
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.patch(
  "/assignments",
  requireAdminPermission("content.questions.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new ContentReviewError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const input = normalizeReviewAssignmentInput(req.body);
      if (input.reviewerUserId) {
        const reviewers = await sqlClient`
          SELECT u.id
          FROM identity.users u
          INNER JOIN identity.admin_profiles p ON p.user_id = u.id
          WHERE u.id = ${input.reviewerUserId}::uuid
            AND u.deleted_at IS NULL
            AND u.status = 'active'::user_status
            AND p.is_suspended = false
          LIMIT 1
        `;
        if (reviewers.length === 0) {
          throw new ContentReviewError("REVIEWER_NOT_AVAILABLE", "Selected reviewer is unavailable.", 422);
        }
      }

      await sqlClient.begin(async (tx) => {
        await tx`SELECT pg_advisory_xact_lock(hashtext('examtree.content.review.assignment'))`;
        for (const item of input.items) {
          await assertReviewEntityExists(item.entityType, item.entityId, tx as typeof sqlClient);
          if (item.entityType === "generation_item") {
            await tx`
              UPDATE content.generation_run_items
              SET reviewer_user_id = ${input.reviewerUserId}::uuid, updated_at = now()
              WHERE id = ${item.entityId}::uuid
            `;
          }
          await tx`
            INSERT INTO platform.audit_events (
              id,
              actor_type,
              actor_user_id,
              effective_role_key,
              action_key,
              entity_type,
              entity_id,
              reason,
              summary,
              metadata
            ) VALUES (
              ${randomUUID()}::uuid,
              'user'::audit_actor_type,
              ${actorUserId}::uuid,
              ${req.adminSession?.roles[0] ?? null},
              'content.review.assignment.changed',
              ${item.entityType},
              ${item.entityId}::uuid,
              ${input.reason},
              ${input.reviewerUserId ? 'Assigned content review item' : 'Cleared content review assignment'},
              ${tx.json({ assignedReviewerUserId: input.reviewerUserId })}
            )
          `;
        }
      });

      res.json({ updatedCount: input.items.length });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  "/items/:entityType/:entityId/comments",
  requireAdminPermission("content.questions.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new ContentReviewError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const entityType = normalizeReviewEntityType(req.params.entityType);
      const entityId = asText(req.params.entityId);
      if (!isUuid(entityId)) {
        throw new ContentReviewError("INVALID_REVIEW_ENTITY_ID", "Review item identifier is invalid.");
      }
      const input = normalizeReviewCommentInput(req.body);
      await assertReviewEntityExists(entityType, entityId);
      if (input.parentCommentId) {
        const parent = await sqlClient`
          SELECT id
          FROM platform.audit_events
          WHERE id = ${input.parentCommentId}::uuid
            AND action_key = 'content.review.comment.added'
            AND entity_type = ${entityType}
            AND entity_id = ${entityId}::uuid
          LIMIT 1
        `;
        if (parent.length === 0) {
          throw new ContentReviewError("PARENT_COMMENT_NOT_FOUND", "Reply target is unavailable.", 404);
        }
      }

      const commentId = randomUUID();
      await sqlClient`
        INSERT INTO platform.audit_events (
          id,
          actor_type,
          actor_user_id,
          effective_role_key,
          action_key,
          entity_type,
          entity_id,
          reason,
          summary,
          metadata
        ) VALUES (
          ${commentId}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          ${req.adminSession?.roles[0] ?? null},
          'content.review.comment.added',
          ${entityType},
          ${entityId}::uuid,
          ${input.message},
          'Added a content review comment',
          ${sqlClient.json({ parentCommentId: input.parentCommentId })}
        )
      `;

      res.status(201).json({ commentId });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.patch(
  "/comments/:commentId/resolution",
  requireAdminPermission("content.questions.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new ContentReviewError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      }
      const commentId = asText(req.params.commentId);
      if (!isUuid(commentId)) {
        throw new ContentReviewError("INVALID_REVIEW_COMMENT_ID", "Review comment identifier is invalid.");
      }
      const input = normalizeCommentResolutionInput(req.body);
      const comments = await sqlClient`
        SELECT
          id::text AS id,
          entity_type AS "entityType",
          entity_id::text AS "entityId"
        FROM platform.audit_events
        WHERE id = ${commentId}::uuid
          AND action_key = 'content.review.comment.added'
        LIMIT 1
      `;
      const comment = comments[0];
      if (!comment) {
        throw new ContentReviewError("REVIEW_COMMENT_NOT_FOUND", "Review comment not found.", 404);
      }

      const eventId = randomUUID();
      await sqlClient`
        INSERT INTO platform.audit_events (
          id,
          actor_type,
          actor_user_id,
          effective_role_key,
          action_key,
          entity_type,
          entity_id,
          reason,
          summary,
          metadata
        ) VALUES (
          ${eventId}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          ${req.adminSession?.roles[0] ?? null},
          'content.review.comment.resolution.changed',
          ${String(comment.entityType)},
          ${String(comment.entityId)}::uuid,
          ${input.reason || null},
          ${input.resolved ? 'Resolved a content review comment' : 'Reopened a content review comment'},
          ${sqlClient.json({ commentId, resolved: input.resolved })}
        )
      `;

      res.json({ eventId, resolved: input.resolved });
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
