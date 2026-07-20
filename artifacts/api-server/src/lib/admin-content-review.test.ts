import assert from "node:assert/strict";
import test from "node:test";

import {
  ContentReviewError,
  normalizeCommentResolutionInput,
  normalizeReviewAssignmentInput,
  normalizeReviewCommentInput,
  reviewEntityKey,
} from "./admin-content-review";

const ITEM_ID = "11111111-1111-4111-8111-111111111111";
const REVIEWER_ID = "22222222-2222-4222-8222-222222222222";

test("normalizes a mixed review assignment batch", () => {
  const result = normalizeReviewAssignmentInput({
    items: [
      { entityType: "generation_item", entityId: ITEM_ID },
      { entityType: "question", entityId: "33333333-3333-4333-8333-333333333333" },
    ],
    reviewerUserId: REVIEWER_ID,
    reason: "Balance the editorial queue",
  });

  assert.equal(result.items.length, 2);
  assert.equal(result.reviewerUserId, REVIEWER_ID);
  assert.equal(result.reason, "Balance the editorial queue");
});

test("rejects duplicate assignment references", () => {
  assert.throws(
    () => normalizeReviewAssignmentInput({
      items: [
        { entityType: "question", entityId: ITEM_ID },
        { entityType: "question", entityId: ITEM_ID },
      ],
      reviewerUserId: null,
      reason: "Clear duplicated ownership",
    }),
    (error: unknown) => error instanceof ContentReviewError
      && error.code === "DUPLICATE_REVIEW_ASSIGNMENT_ITEM",
  );
});

test("normalizes threaded comments and resolution", () => {
  const comment = normalizeReviewCommentInput({
    message: "Please verify the distractor based on the latest version.",
    parentCommentId: ITEM_ID,
  });
  const resolution = normalizeCommentResolutionInput({
    resolved: true,
    reason: "Distractor corrected in the next version",
  });

  assert.equal(comment.parentCommentId, ITEM_ID);
  assert.equal(resolution.resolved, true);
  assert.equal(reviewEntityKey("question", ITEM_ID), `question:${ITEM_ID}`);
});

test("requires a meaningful assignment reason", () => {
  assert.throws(
    () => normalizeReviewAssignmentInput({
      items: [{ entityType: "generation_item", entityId: ITEM_ID }],
      reviewerUserId: REVIEWER_ID,
      reason: "x",
    }),
    (error: unknown) => error instanceof ContentReviewError
      && error.code === "REVIEW_ASSIGNMENT_REASON_REQUIRED",
  );
});
