export const TEST_QA_ACTIONS = {
  assignment: "assessment.test.qa_assignment.changed",
  comment: "assessment.test.qa_comment.added",
  resolution: "assessment.test.qa_comment.resolution.changed",
} as const;

export type TestQaAuditEvent = {
  id: string;
  occurredAt: string;
  actorUserId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  actionKey: string;
  entityId: string;
  entityVersionId: string | null;
  reason: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
};

export type TestQaComment = {
  id: string;
  testId: string;
  testVersionId: string;
  parentCommentId: string | null;
  message: string;
  actorUserId: string | null;
  actorName: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt: string | null;
  resolvedByName: string | null;
};

export type TestQaCollaboration = {
  assignment: {
    reviewerUserId: string | null;
    assignedAt: string | null;
    assignedByUserId: string | null;
    assignedByName: string | null;
    reason: string | null;
  };
  comments: TestQaComment[];
  openCommentCount: number;
};

export class TestQaError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "TestQaError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function text(value: unknown, field: string, min: number, max: number): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (normalized.length < min) {
    throw new TestQaError("TEST_QA_FIELD_REQUIRED", `${field} is required`);
  }
  if (normalized.length > max) {
    throw new TestQaError("TEST_QA_FIELD_TOO_LONG", `${field} is too long`);
  }
  return normalized;
}

export function isTestQaUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function uuid(value: unknown, field: string): string {
  const normalized = typeof value === "string" ? value.trim() : "";
  if (!isTestQaUuid(normalized)) {
    throw new TestQaError("INVALID_TEST_QA_IDENTIFIER", `${field} is invalid`);
  }
  return normalized;
}

function optionalUuid(value: unknown, field: string): string | null {
  if (value == null || value === "") return null;
  return uuid(value, field);
}

export function normalizeTestQaAssignmentInput(value: unknown) {
  const input = asRecord(value);
  const rawItems = Array.isArray(input.items) ? input.items : [];
  if (rawItems.length === 0 || rawItems.length > 100) {
    throw new TestQaError("INVALID_TEST_QA_ASSIGNMENT_BATCH", "Select between 1 and 100 tests");
  }
  const seen = new Set<string>();
  const items = rawItems.map((raw, index) => {
    const item = asRecord(raw);
    const testId = uuid(item.testId, `Test ${index + 1}`);
    const testVersionId = uuid(item.testVersionId, `Test version ${index + 1}`);
    const key = `${testId}:${testVersionId}`;
    if (seen.has(key)) {
      throw new TestQaError("DUPLICATE_TEST_QA_ASSIGNMENT", "A test version may appear only once");
    }
    seen.add(key);
    return { testId, testVersionId };
  });
  return {
    items,
    reviewerUserId: optionalUuid(input.reviewerUserId, "Reviewer"),
    reason: text(input.reason, "Assignment reason", 4, 500),
  };
}

export function normalizeTestQaCommentInput(value: unknown) {
  const input = asRecord(value);
  return {
    testId: uuid(input.testId, "Test"),
    testVersionId: uuid(input.testVersionId, "Test version"),
    parentCommentId: optionalUuid(input.parentCommentId, "Parent comment"),
    message: text(input.message, "Comment", 2, 4000),
  };
}

export function normalizeTestQaResolutionInput(commentIdValue: unknown, value: unknown) {
  const input = asRecord(value);
  if (typeof input.resolved !== "boolean") {
    throw new TestQaError("TEST_QA_RESOLUTION_REQUIRED", "Choose whether the comment is resolved");
  }
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  if (reason.length > 500) {
    throw new TestQaError("TEST_QA_FIELD_TOO_LONG", "Resolution reason is too long");
  }
  return {
    commentId: uuid(commentIdValue, "Comment"),
    resolved: input.resolved,
    reason,
  };
}

export function testQaKey(testId: string, testVersionId: string): string {
  return `${testId}:${testVersionId}`;
}

export function buildTestQaCollaboration(events: TestQaAuditEvent[]): Map<string, TestQaCollaboration> {
  const assignmentByKey = new Map<string, TestQaCollaboration["assignment"]>();
  const commentsByKey = new Map<string, TestQaComment[]>();
  const commentById = new Map<string, TestQaComment>();
  const latestResolution = new Map<string, { resolved: boolean; occurredAt: string; actorName: string }>();

  for (const event of [...events].sort((left, right) => (
    new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime()
  ))) {
    const versionId = event.entityVersionId;
    if (!versionId) continue;
    const key = testQaKey(event.entityId, versionId);
    const metadata = asRecord(event.metadata);
    const actorName = event.actorName || event.actorEmail || "Administrator";

    if (event.actionKey === TEST_QA_ACTIONS.assignment) {
      assignmentByKey.set(key, {
        reviewerUserId: metadata.assignedReviewerUserId == null
          ? null
          : String(metadata.assignedReviewerUserId),
        assignedAt: event.occurredAt,
        assignedByUserId: event.actorUserId,
        assignedByName: actorName,
        reason: event.reason,
      });
    } else if (event.actionKey === TEST_QA_ACTIONS.comment) {
      const comment: TestQaComment = {
        id: event.id,
        testId: event.entityId,
        testVersionId: versionId,
        parentCommentId: metadata.parentCommentId == null ? null : String(metadata.parentCommentId),
        message: event.reason || event.summary,
        actorUserId: event.actorUserId,
        actorName,
        createdAt: event.occurredAt,
        resolved: false,
        resolvedAt: null,
        resolvedByName: null,
      };
      const bucket = commentsByKey.get(key) ?? [];
      bucket.push(comment);
      commentsByKey.set(key, bucket);
      commentById.set(comment.id, comment);
    } else if (event.actionKey === TEST_QA_ACTIONS.resolution) {
      const commentId = typeof metadata.commentId === "string" ? metadata.commentId : "";
      if (commentId) {
        latestResolution.set(commentId, {
          resolved: metadata.resolved === true,
          occurredAt: event.occurredAt,
          actorName,
        });
      }
    }
  }

  for (const [commentId, resolution] of latestResolution) {
    const comment = commentById.get(commentId);
    if (!comment) continue;
    comment.resolved = resolution.resolved;
    comment.resolvedAt = resolution.occurredAt;
    comment.resolvedByName = resolution.actorName;
  }

  const keys = new Set([...assignmentByKey.keys(), ...commentsByKey.keys()]);
  return new Map([...keys].map((key) => {
    const comments = commentsByKey.get(key) ?? [];
    return [key, {
      assignment: assignmentByKey.get(key) ?? {
        reviewerUserId: null,
        assignedAt: null,
        assignedByUserId: null,
        assignedByName: null,
        reason: null,
      },
      comments,
      openCommentCount: comments.filter((comment) => !comment.resolved).length,
    }];
  }));
}
