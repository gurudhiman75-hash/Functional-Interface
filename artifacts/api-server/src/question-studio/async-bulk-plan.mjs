// Pure, inert planning for future administrator-approved bulk async review.
// This module never enqueues, dispatches, publishes, or touches the database.
// A parent operation must durably record each child before any approved launch.
import { createHash } from "node:crypto";

export const MAX_BULK_REVIEW_REQUEST = 250;
export const MAX_CHAPTER_REVIEW_CHILD = 20;

export function planAsyncChapterReviewBatches({
  totalCount, selectedCpIds = [], operationId,
}) {
  if (!Number.isSafeInteger(totalCount) || totalCount < 1 ||
      totalCount > MAX_BULK_REVIEW_REQUEST) {
    throw new RangeError("BULK_ASYNC_TOTAL_COUNT_INVALID");
  }
  if (typeof operationId !== "string" ||
      !/^[a-zA-Z0-9:_-]{8,128}$/.test(operationId)) {
    throw new TypeError("BULK_ASYNC_OPERATION_ID_INVALID");
  }
  if (!Array.isArray(selectedCpIds) ||
      selectedCpIds.some(cp => typeof cp !== "string" || !cp.trim()) ||
      new Set(selectedCpIds).size !== selectedCpIds.length ||
      selectedCpIds.length > MAX_CHAPTER_REVIEW_CHILD) {
    throw new RangeError("BULK_ASYNC_CP_SELECTION_INVALID");
  }
  const batchCount = Math.ceil(totalCount / MAX_CHAPTER_REVIEW_CHILD);
  const minCount = Math.floor(totalCount / batchCount);
  if (selectedCpIds.length > minCount) {
    throw new RangeError("BULK_ASYNC_CP_SELECTION_EXCEEDS_SMALLEST_BATCH");
  }
  const extra = totalCount % batchCount;
  const batches = Array.from({length:batchCount}, (_, index) => {
    const count = minCount + (index < extra ? 1 : 0);
    const key = createHash("sha256")
      .update(JSON.stringify(["qs-chapter-bulk-v1", operationId, index]))
      .digest("hex");
    return Object.freeze({
      batchIndex: index,
      count,
      selectedCpIds: Object.freeze([...selectedCpIds]),
      idempotencyKey: "chapterbulk:" + key,
    });
  });
  return Object.freeze(batches);
}
