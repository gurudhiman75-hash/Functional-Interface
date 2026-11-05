// Pure progress projection, not a dispatcher. Caller must have verified
// ownership/administrator authorization before supplying persisted child rows.
export function summarizeAsyncBulkReview(operation, children) {
  if (!operation || !Array.isArray(children) || !Number.isSafeInteger(operation.requestedCount) ||
      operation.requestedCount < 1 || operation.requestedCount > 250 ||
      children.length < 1 || children.length > 13) {
    throw new RangeError("BULK_ASYNC_PROGRESS_INVALID");
  }
  const indexes = new Set();
  let accounted = 0, generated = 0, awaitingReview = 0;
  const statuses = { planned:0, active:0, completed:0, failed:0, needsReconciliation:0 };
  const batches = children.map(child => {
    if (!Number.isSafeInteger(child.batchIndex) || child.batchIndex < 0 ||
        indexes.has(child.batchIndex) || !Number.isSafeInteger(child.count) ||
        child.count < 1 || child.count > 20 ||
        !Number.isSafeInteger(child.generatedCount) ||
        child.generatedCount < 0 || child.generatedCount > child.count) {
      throw new RangeError("BULK_ASYNC_PROGRESS_CHILD_INVALID");
    }
    indexes.add(child.batchIndex);
    accounted += child.count;
    generated += child.generatedCount;
    const status = child.status;
    if (status === "planned" || status === "reserved") statuses.planned++;
    else if (["dispatch_requested","queued","running"].includes(status)) statuses.active++;
    else if (["review","completed"].includes(status)) {
      if (child.generatedCount !== child.count) {
        throw new RangeError("BULK_ASYNC_INCOMPLETE_REVIEW_BATCH");
      }
      statuses.completed++;
      awaitingReview += child.generatedCount;
    } else if (status === "failed" || status === "cancelled") statuses.failed++;
    else if (status === "needs_reconciliation") statuses.needsReconciliation++;
    else throw new RangeError("BULK_ASYNC_PROGRESS_STATUS_INVALID");
    return {batchIndex:child.batchIndex,count:child.count,generatedCount:child.generatedCount,
      status,runId:child.runId ?? null};
  }).sort((a,b)=>a.batchIndex-b.batchIndex);
  if (accounted !== operation.requestedCount ||
      batches.some((b,i)=>b.batchIndex!==i)) throw new RangeError("BULK_ASYNC_PROGRESS_TOTAL_INVALID");
  return {
    requestedCount:operation.requestedCount,generatedCount:generated,awaitingReview,
    completedBatches:statuses.completed,failedBatches:statuses.failed,
    activeBatches:statuses.active,plannedBatches:statuses.planned,
    needsReconciliationBatches:statuses.needsReconciliation,batches,
    readyForReview:statuses.completed === batches.length && generated === operation.requestedCount,
    requiresAttention:statuses.failed>0 || statuses.needsReconciliation>0,
  };
}
