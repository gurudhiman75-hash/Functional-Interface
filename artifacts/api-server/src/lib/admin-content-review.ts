export type ReviewEntityType = "generation_item" | "question";

export type ReviewItemReference = {
  entityType: ReviewEntityType;
  entityId: string;
};

export class ContentReviewError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ContentReviewError";
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asUuid(value: unknown, code: string, message: string): string {
  const text = asText(value);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(text)) {
    throw new ContentReviewError(code, message);
  }
  return text;
}

export function normalizeReviewEntityType(value: unknown): ReviewEntityType {
  const text = asText(value);
  if (text !== "generation_item" && text !== "question") {
    throw new ContentReviewError(
      "INVALID_REVIEW_ENTITY_TYPE",
      "Review items must be generated items or canonical questions.",
    );
  }
  return text;
}

export function normalizeReviewAssignmentInput(value: unknown): {
  items: ReviewItemReference[];
  reviewerUserId: string | null;
  reason: string;
} {
  const input = asRecord(value);
  const rawItems = Array.isArray(input.items) ? input.items : [];
  if (rawItems.length === 0 || rawItems.length > 100) {
    throw new ContentReviewError(
      "INVALID_REVIEW_ASSIGNMENT_BATCH",
      "Assign between 1 and 100 review items at a time.",
    );
  }
  const seen = new Set<string>();
  const items = rawItems.map((entry, index) => {
    const record = asRecord(entry);
    const entityType = normalizeReviewEntityType(record.entityType);
    const entityId = asUuid(
      record.entityId,
      "INVALID_REVIEW_ENTITY_ID",
      `Review item ${index + 1} has an invalid identifier.`,
    );
    const key = `${entityType}:${entityId}`;
    if (seen.has(key)) {
      throw new ContentReviewError(
        "DUPLICATE_REVIEW_ASSIGNMENT_ITEM",
        "Each review item may appear only once in an assignment request.",
      );
    }
    seen.add(key);
    return { entityType, entityId };
  });
  const reviewerUserId = input.reviewerUserId == null || input.reviewerUserId === ""
    ? null
    : asUuid(input.reviewerUserId, "INVALID_REVIEWER_ID", "Select a valid reviewer.");
  const reason = asText(input.reason);
  if (reason.length < 4 || reason.length > 500) {
    throw new ContentReviewError(
      "REVIEW_ASSIGNMENT_REASON_REQUIRED",
      "An assignment reason of 4–500 characters is required.",
    );
  }
  return { items, reviewerUserId, reason };
}

export function normalizeReviewCommentInput(value: unknown): {
  message: string;
  parentCommentId: string | null;
} {
  const input = asRecord(value);
  const message = asText(input.message);
  if (message.length < 2 || message.length > 4000) {
    throw new ContentReviewError(
      "INVALID_REVIEW_COMMENT",
      "Review comments must contain 2–4000 characters.",
    );
  }
  const parentCommentId = input.parentCommentId == null || input.parentCommentId === ""
    ? null
    : asUuid(input.parentCommentId, "INVALID_PARENT_COMMENT_ID", "Reply target is invalid.");
  return { message, parentCommentId };
}

export function normalizeCommentResolutionInput(value: unknown): {
  resolved: boolean;
  reason: string;
} {
  const input = asRecord(value);
  if (typeof input.resolved !== "boolean") {
    throw new ContentReviewError(
      "INVALID_COMMENT_RESOLUTION",
      "Comment resolution state is required.",
    );
  }
  const reason = asText(input.reason);
  if (reason.length > 500) {
    throw new ContentReviewError(
      "INVALID_COMMENT_RESOLUTION_REASON",
      "Resolution reason cannot exceed 500 characters.",
    );
  }
  return { resolved: input.resolved, reason };
}

export function reviewEntityKey(entityType: ReviewEntityType, entityId: string): string {
  return `${entityType}:${entityId}`;
}
