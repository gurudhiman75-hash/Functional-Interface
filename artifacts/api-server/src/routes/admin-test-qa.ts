import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import {
  TEST_QA_ACTIONS,
  TestQaError,
  buildTestQaCollaboration,
  normalizeTestQaAssignmentInput,
  normalizeTestQaCommentInput,
  normalizeTestQaResolutionInput,
  testQaKey,
  type TestQaAuditEvent,
} from "../lib/admin-test-qa";
import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function sendError(res: Response, error: unknown): void {
  if (error instanceof TestQaError) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details,
    });
    return;
  }
  console.error("Test QA request failed", error);
  res.status(500).json({ error: "Unable to complete the Test QA request" });
}

async function assertCurrentTestVersion(
  client: SqlExecutor,
  testId: string,
  testVersionId: string,
): Promise<{ publicCode: string; status: string }> {
  const rows = await client`
    SELECT
      public_code AS "publicCode",
      status::text AS status,
      current_draft_version_id::text AS "currentDraftVersionId"
    FROM assessment.tests
    WHERE id = ${testId}::uuid
      AND deleted_at IS NULL
    LIMIT 1
  `;
  const test = rows[0];
  if (!test) {
    throw new TestQaError("TEST_QA_TEST_NOT_FOUND", "The selected test no longer exists", 404);
  }
  if (String(test.status) === "archived") {
    throw new TestQaError("TEST_QA_TEST_ARCHIVED", "Restore the test before reviewing it", 409);
  }
  if (String(test.currentDraftVersionId ?? "") !== testVersionId) {
    throw new TestQaError(
      "TEST_QA_VERSION_CONFLICT",
      "This test changed after the QA workspace loaded. Refresh before continuing.",
      409,
    );
  }
  return { publicCode: String(test.publicCode), status: String(test.status) };
}

async function loadVersionSnapshot(client: SqlExecutor, versionId: string) {
  const versions = await client`
    SELECT
      v.id::text AS id,
      v.version_number AS "versionNumber",
      v.title,
      v.description,
      v.duration_seconds AS "durationSeconds",
      v.total_marks::float8 AS "totalMarks",
      v.instructions,
      v.settings,
      v.change_reason AS "changeReason",
      v.created_at AS "createdAt",
      (SELECT COUNT(*)::int FROM assessment.test_sections s WHERE s.test_version_id = v.id) AS "sectionCount",
      (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = v.id) AS "questionCount"
    FROM assessment.test_versions v
    WHERE v.id = ${versionId}::uuid
    LIMIT 1
  `;
  const version = versions[0];
  if (!version) return null;

  const sections = await client`
    SELECT
      s.id::text AS id,
      s.section_key AS "sectionKey",
      s.name,
      s.sort_order AS "sortOrder",
      s.duration_seconds AS "durationSeconds",
      s.settings,
      COALESCE(
        json_agg(
          json_build_object(
            'questionVersionId', tq.question_version_id,
            'position', tq.position,
            'marks', tq.marks::float8,
            'negativeMarks', tq.negative_marks::float8,
            'publicCode', q.public_code,
            'stem', qv.stem,
            'difficulty', qv.difficulty
          ) ORDER BY tq.position
        ) FILTER (WHERE tq.question_version_id IS NOT NULL),
        '[]'::json
      ) AS questions
    FROM assessment.test_sections s
    LEFT JOIN assessment.test_questions tq ON tq.test_section_id = s.id
    LEFT JOIN content.question_versions qv ON qv.id = tq.question_version_id
    LEFT JOIN content.questions q ON q.id = qv.question_id
    WHERE s.test_version_id = ${versionId}::uuid
    GROUP BY s.id
    ORDER BY s.sort_order
  `;
  return { ...version, sections };
}

router.use(authenticate);

router.get(
  "/workspace",
  requireAdminPermission("tests.read"),
  async (req, res) => {
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
      const tests = await sqlClient`
        SELECT
          id::text AS "testId",
          current_draft_version_id::text AS "testVersionId"
        FROM assessment.tests
        WHERE deleted_at IS NULL
          AND status <> 'archived'::test_status
          AND current_draft_version_id IS NOT NULL
      `;
      const testIds = tests.map((test) => String(test.testId));
      const events = testIds.length === 0
        ? []
        : await sqlClient`
            SELECT
              ae.id::text AS id,
              ae.occurred_at AS "occurredAt",
              ae.actor_user_id::text AS "actorUserId",
              actor.display_name AS "actorName",
              actor.email AS "actorEmail",
              ae.action_key AS "actionKey",
              ae.entity_id::text AS "entityId",
              ae.entity_version_id::text AS "entityVersionId",
              ae.reason,
              ae.summary,
              ae.metadata
            FROM platform.audit_events ae
            LEFT JOIN identity.users actor ON actor.id = ae.actor_user_id
            WHERE ae.entity_type = 'test'
              AND ae.entity_id = ANY(${testIds}::uuid[])
              AND ae.action_key = ANY(${Object.values(TEST_QA_ACTIONS)}::varchar[])
            ORDER BY ae.occurred_at ASC, ae.id ASC
            LIMIT 20000
          `;
      const collaborationByKey = buildTestQaCollaboration(events as TestQaAuditEvent[]);
      const reviewerById = new Map(reviewers.map((reviewer) => [String(reviewer.id), reviewer]));

      res.json({
        reviewers,
        currentAdminUserId: req.adminSession?.user.id ?? null,
        collaboration: tests.map((test) => {
          const testId = String(test.testId);
          const testVersionId = String(test.testVersionId);
          const state = collaborationByKey.get(testQaKey(testId, testVersionId)) ?? {
            assignment: {
              reviewerUserId: null,
              assignedAt: null,
              assignedByUserId: null,
              assignedByName: null,
              reason: null,
            },
            comments: [],
            openCommentCount: 0,
          };
          const reviewer = state.assignment.reviewerUserId
            ? reviewerById.get(state.assignment.reviewerUserId)
            : null;
          return {
            testId,
            testVersionId,
            ...state,
            assignment: {
              ...state.assignment,
              reviewerName: reviewer?.displayName ?? reviewer?.email ?? null,
            },
          };
        }),
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.patch(
  "/assignments",
  requireAdminPermission("tests.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new TestQaError("ADMIN_SESSION_REQUIRED", "Administrator session required", 403);
      }
      const input = normalizeTestQaAssignmentInput(req.body);
      if (input.reviewerUserId) {
        const reviewers = await sqlClient`
          SELECT p.user_id
          FROM identity.admin_profiles p
          INNER JOIN identity.users u ON u.id = p.user_id
          WHERE p.user_id = ${input.reviewerUserId}::uuid
            AND p.is_suspended = false
            AND u.deleted_at IS NULL
            AND u.status = 'active'::user_status
          LIMIT 1
        `;
        if (reviewers.length === 0) {
          throw new TestQaError("TEST_QA_REVIEWER_UNAVAILABLE", "The selected reviewer is unavailable", 422);
        }
      }

      await sqlClient.begin(async (tx) => {
        for (const item of input.items) {
          const test = await assertCurrentTestVersion(tx as SqlExecutor, item.testId, item.testVersionId);
          await tx`
            INSERT INTO platform.audit_events (
              id, actor_type, actor_user_id, effective_role_key,
              action_key, entity_type, entity_id, entity_version_id,
              reason, summary, metadata
            ) VALUES (
              ${randomUUID()}::uuid,
              'user'::audit_actor_type,
              ${actorUserId}::uuid,
              ${req.adminSession?.roles[0] ?? null},
              ${TEST_QA_ACTIONS.assignment},
              'test',
              ${item.testId}::uuid,
              ${item.testVersionId}::uuid,
              ${input.reason},
              ${input.reviewerUserId
                ? `Assigned QA reviewer for ${test.publicCode}`
                : `Cleared QA reviewer for ${test.publicCode}`},
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
  "/comments",
  requireAdminPermission("tests.update"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new TestQaError("ADMIN_SESSION_REQUIRED", "Administrator session required", 403);
      }
      const input = normalizeTestQaCommentInput(req.body);
      const commentId = randomUUID();
      await sqlClient.begin(async (tx) => {
        const test = await assertCurrentTestVersion(tx as SqlExecutor, input.testId, input.testVersionId);
        if (input.parentCommentId) {
          const parents = await tx`
            SELECT id
            FROM platform.audit_events
            WHERE id = ${input.parentCommentId}::uuid
              AND action_key = ${TEST_QA_ACTIONS.comment}
              AND entity_type = 'test'
              AND entity_id = ${input.testId}::uuid
              AND entity_version_id = ${input.testVersionId}::uuid
            LIMIT 1
          `;
          if (parents.length === 0) {
            throw new TestQaError("TEST_QA_PARENT_COMMENT_NOT_FOUND", "The parent comment is unavailable", 404);
          }
        }
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key,
            action_key, entity_type, entity_id, entity_version_id,
            reason, summary, metadata
          ) VALUES (
            ${commentId}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${req.adminSession?.roles[0] ?? null},
            ${TEST_QA_ACTIONS.comment},
            'test',
            ${input.testId}::uuid,
            ${input.testVersionId}::uuid,
            ${input.message},
            ${`Added a QA comment to ${test.publicCode}`},
            ${tx.json({ parentCommentId: input.parentCommentId })}
          )
        `;
      });
      res.status(201).json({ commentId });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.patch(
  "/comments/:commentId/resolution",
  requireAdminPermission("tests.approve"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        throw new TestQaError("ADMIN_SESSION_REQUIRED", "Administrator session required", 403);
      }
      const input = normalizeTestQaResolutionInput(req.params.commentId, req.body);
      await sqlClient.begin(async (tx) => {
        const comments = await tx`
          SELECT
            entity_id::text AS "testId",
            entity_version_id::text AS "testVersionId"
          FROM platform.audit_events
          WHERE id = ${input.commentId}::uuid
            AND action_key = ${TEST_QA_ACTIONS.comment}
            AND entity_type = 'test'
          LIMIT 1
        `;
        const comment = comments[0];
        if (!comment?.testId || !comment?.testVersionId) {
          throw new TestQaError("TEST_QA_COMMENT_NOT_FOUND", "QA comment not found", 404);
        }
        const test = await assertCurrentTestVersion(
          tx as SqlExecutor,
          String(comment.testId),
          String(comment.testVersionId),
        );
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, effective_role_key,
            action_key, entity_type, entity_id, entity_version_id,
            reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${req.adminSession?.roles[0] ?? null},
            ${TEST_QA_ACTIONS.resolution},
            'test',
            ${String(comment.testId)}::uuid,
            ${String(comment.testVersionId)}::uuid,
            ${input.reason || null},
            ${`${input.resolved ? "Resolved" : "Reopened"} a QA comment on ${test.publicCode}`},
            ${tx.json({ commentId: input.commentId, resolved: input.resolved })}
          )
        `;
      });
      res.json({ commentId: input.commentId, resolved: input.resolved });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.get(
  "/tests/:testId/comparison",
  requireAdminPermission("tests.read"),
  async (req, res) => {
    try {
      const testId = req.params.testId;
      if (!/^[0-9a-f-]{36}$/i.test(testId)) {
        throw new TestQaError("INVALID_TEST_QA_IDENTIFIER", "Test identifier is invalid");
      }
      const tests = await sqlClient`
        SELECT current_draft_version_id::text AS "currentVersionId"
        FROM assessment.tests
        WHERE id = ${testId}::uuid
          AND deleted_at IS NULL
        LIMIT 1
      `;
      const currentVersionId = String(tests[0]?.currentVersionId ?? "");
      if (!currentVersionId) {
        throw new TestQaError("TEST_QA_VERSION_NOT_FOUND", "The test has no draft version", 404);
      }
      const previousRows = await sqlClient`
        SELECT previous.id::text AS id
        FROM assessment.test_versions current
        LEFT JOIN LATERAL (
          SELECT candidate.id
          FROM assessment.test_versions candidate
          WHERE candidate.test_id = current.test_id
            AND candidate.version_number < current.version_number
          ORDER BY candidate.version_number DESC
          LIMIT 1
        ) previous ON true
        WHERE current.id = ${currentVersionId}::uuid
        LIMIT 1
      `;
      const previousVersionId = previousRows[0]?.id ? String(previousRows[0].id) : null;
      const current = await loadVersionSnapshot(sqlClient, currentVersionId);
      const previous = previousVersionId
        ? await loadVersionSnapshot(sqlClient, previousVersionId)
        : null;
      const currentQuestionIds = new Set(
        (current?.sections ?? []).flatMap((section: any) => (
          Array.isArray(section.questions)
            ? section.questions.map((question: any) => String(question.questionVersionId))
            : []
        )),
      );
      const previousQuestionIds = new Set(
        (previous?.sections ?? []).flatMap((section: any) => (
          Array.isArray(section.questions)
            ? section.questions.map((question: any) => String(question.questionVersionId))
            : []
        )),
      );
      res.json({
        current,
        previous,
        changes: {
          title: previous ? String(previous.title) !== String(current?.title) : false,
          duration: previous ? Number(previous.durationSeconds) !== Number(current?.durationSeconds) : false,
          totalMarks: previous ? Number(previous.totalMarks) !== Number(current?.totalMarks) : false,
          sections: previous ? Number(previous.sectionCount) !== Number(current?.sectionCount) : false,
          questions: previous ? Number(previous.questionCount) !== Number(current?.questionCount) : false,
          addedQuestionVersionIds: [...currentQuestionIds].filter((id) => !previousQuestionIds.has(id)),
          removedQuestionVersionIds: [...previousQuestionIds].filter((id) => !currentQuestionIds.has(id)),
        },
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
