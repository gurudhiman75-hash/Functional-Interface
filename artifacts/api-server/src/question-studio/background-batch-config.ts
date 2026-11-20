export function backgroundBatchesEnabled(env = process.env): boolean {
  return env.EXAMTREE_API_STAGING === "true" &&
    env.EXAMTREE_QS_BACKGROUND_BATCHES_ENABLED === "true" &&
    env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED === "true" &&
    env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED === "true" &&
    env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED === "true" &&
    env.EXAMTREE_QUESTION_STUDIO_TASK_CLAIM_ENABLED === "true" &&
    env.EXAMTREE_QUESTION_STUDIO_TASK_REVIEW_COMMIT_ENABLED === "true";
}
