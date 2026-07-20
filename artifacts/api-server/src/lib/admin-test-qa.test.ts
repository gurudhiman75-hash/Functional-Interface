import assert from "node:assert/strict";
import test from "node:test";

import {
  TEST_QA_ACTIONS,
  TestQaError,
  buildTestQaCollaboration,
  normalizeTestQaAssignmentInput,
  normalizeTestQaCommentInput,
  normalizeTestQaResolutionInput,
} from "./admin-test-qa";

const TEST_ID = "11111111-1111-4111-8111-111111111111";
const VERSION_ID = "22222222-2222-4222-8222-222222222222";
const REVIEWER_ID = "33333333-3333-4333-8333-333333333333";
const COMMENT_ID = "44444444-4444-4444-8444-444444444444";

test("normalizes audited QA assignment batches", () => {
  const result = normalizeTestQaAssignmentInput({
    items: [{ testId: TEST_ID, testVersionId: VERSION_ID }],
    reviewerUserId: REVIEWER_ID,
    reason: "Assign final publication review",
  });
  assert.equal(result.items.length, 1);
  assert.equal(result.reviewerUserId, REVIEWER_ID);
});

test("rejects duplicate QA assignment entries", () => {
  assert.throws(
    () => normalizeTestQaAssignmentInput({
      items: [
        { testId: TEST_ID, testVersionId: VERSION_ID },
        { testId: TEST_ID, testVersionId: VERSION_ID },
      ],
      reason: "Duplicate",
    }),
    (error: unknown) => error instanceof TestQaError
      && error.code === "DUPLICATE_TEST_QA_ASSIGNMENT",
  );
});

test("normalizes threaded comments and resolutions", () => {
  const comment = normalizeTestQaCommentInput({
    testId: TEST_ID,
    testVersionId: VERSION_ID,
    parentCommentId: COMMENT_ID,
    message: "Recheck section timing before approval.",
  });
  assert.equal(comment.parentCommentId, COMMENT_ID);

  const resolution = normalizeTestQaResolutionInput(COMMENT_ID, {
    resolved: true,
    reason: "Timing corrected in the latest draft.",
  });
  assert.equal(resolution.resolved, true);
});

test("reconstructs latest assignment and comment resolution", () => {
  const state = buildTestQaCollaboration([
    {
      id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      occurredAt: "2026-07-20T01:00:00.000Z",
      actorUserId: REVIEWER_ID,
      actorName: "Admin",
      actorEmail: null,
      actionKey: TEST_QA_ACTIONS.assignment,
      entityId: TEST_ID,
      entityVersionId: VERSION_ID,
      reason: "Initial assignment",
      summary: "Assigned reviewer",
      metadata: { assignedReviewerUserId: REVIEWER_ID },
    },
    {
      id: COMMENT_ID,
      occurredAt: "2026-07-20T02:00:00.000Z",
      actorUserId: REVIEWER_ID,
      actorName: "Admin",
      actorEmail: null,
      actionKey: TEST_QA_ACTIONS.comment,
      entityId: TEST_ID,
      entityVersionId: VERSION_ID,
      reason: "Fix the marks total.",
      summary: "QA comment",
      metadata: { parentCommentId: null },
    },
    {
      id: "55555555-5555-4555-8555-555555555555",
      occurredAt: "2026-07-20T03:00:00.000Z",
      actorUserId: REVIEWER_ID,
      actorName: "Admin",
      actorEmail: null,
      actionKey: TEST_QA_ACTIONS.resolution,
      entityId: TEST_ID,
      entityVersionId: VERSION_ID,
      reason: "Resolved",
      summary: "Comment resolved",
      metadata: { commentId: COMMENT_ID, resolved: true },
    },
  ]);

  const collaboration = state.get(`${TEST_ID}:${VERSION_ID}`);
  assert.equal(collaboration?.assignment.reviewerUserId, REVIEWER_ID);
  assert.equal(collaboration?.openCommentCount, 0);
  assert.equal(collaboration?.comments[0]?.resolved, true);
});
