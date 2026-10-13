// Opt-in outbox -> Cloud Tasks dispatch. Nothing imports/starts this publisher
// from app.ts or the existing Render outbox publisher. Only a separately
// authorized Cloud Run job can invoke runQuestionStudioTaskDispatchOnce.
import { sqlClient } from "../lib/db";
import { logger } from "../lib/logger";
import {
  createQuestionStudioTask,
  deliverQuestionStudioCloudTask,
  getQuestionStudioTaskConfig,
} from "./async-cloud-tasks-transport";

const EVENT_TYPE = "question_studio.generation_run.queued.v1";

function requireExplicitDispatchApproval() {
  if (process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_DISPATCH_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_TASK_RECEIVER_VERIFIED !== "true") {
    throw new Error("QUESTION_STUDIO_TASK_DISPATCH_DISABLED");
  }
}

// Returns true if one outbox event was handled, false if none is eligible.
export async function runQuestionStudioTaskDispatchOnce(): Promise<boolean> {
  requireExplicitDispatchApproval();
  const config = getQuestionStudioTaskConfig();
  return sqlClient.begin(async (tx) => {
    const rows = await tx`
      SELECT e.id::text AS "eventId", e.aggregate_id::text AS "runId",
             e.payload AS payload, e.attempts,
             r.status::text AS "runStatus"
      FROM platform.outbox_events e
      INNER JOIN content.generation_runs r
        ON r.id = e.aggregate_id
      WHERE e.event_type = ${EVENT_TYPE}
        AND e.aggregate_type = 'generation_run'
        AND e.published_at IS NULL
        AND e.available_at <= now()
      ORDER BY e.occurred_at, e.id
      LIMIT 1
      FOR UPDATE OF e SKIP LOCKED
    `;
    const event = rows[0];
    if (!event) return false;
    const eventId = String(event.eventId);
    const runId = String(event.runId);
    const attempts = Number(event.attempts) || 0;
    const payload = event.payload as {runId?:unknown;queueVersion?:unknown} | null;

    // Already finished or cancelled before Cloud Tasks enqueue: mark the
    // dedicated event handled without scheduling a task. The receiver will
    // check this state again in case cancellation races an existing task.
    if (["cancelled", "failed", "review", "approved", "partially_approved"].includes(String(event.runStatus))) {
      await tx`
        UPDATE platform.outbox_events
        SET published_at = now(), last_error = NULL
        WHERE id = ${eventId}::uuid AND published_at IS NULL
      `;
      return true;
    }
    if (payload?.runId !== runId || payload?.queueVersion !== 1 ||
        !["queued", "running"].includes(String(event.runStatus))) {
      await tx`
        UPDATE platform.outbox_events
        SET attempts = attempts + 1, last_error = 'TASK_OUTBOX_PAYLOAD_INVALID',
            available_at = now() + interval '1 hour'
        WHERE id = ${eventId}::uuid AND published_at IS NULL
      `;
      logger.error({eventId,runId},"Question Studio task event requires administrator investigation");
      return true;
    }
    if (attempts >= 8) {
      await tx`
        UPDATE platform.outbox_events
        SET last_error = 'TASK_DISPATCH_RETRY_LIMIT', available_at = now() + interval '6 hours'
        WHERE id = ${eventId}::uuid AND published_at IS NULL
      `;
      logger.error({eventId,runId},"Question Studio task exceeded dispatch retry budget");
      return true;
    }
    // Validate id/name before any network or mutation of published_at.
    createQuestionStudioTask({eventId,runId},config);
    try {
      const delivered = await deliverQuestionStudioCloudTask({eventId,runId},config);
      await tx`
        UPDATE platform.outbox_events
        SET attempts = attempts + 1, published_at = now(), last_error = NULL
        WHERE id = ${eventId}::uuid AND published_at IS NULL
      `;
      logger.info({
        eventId,runId,taskName:delivered.taskName,alreadyExists:delivered.alreadyExists,
      },"Question Studio Cloud Task recorded");
    } catch (error) {
      // A transient POST/DB crash can leave a Cloud Task created but the
      // Neon outbox row unacknowledged. Replay uses the same Cloud Task name,
      // receives ALREADY_EXISTS and commits the acknowledgement safely.
      const code = error && typeof error === "object" && "code" in error
        ? String(error.code).slice(0,90) : "TASK_CREATE_UNAVAILABLE";
      await tx`
        UPDATE platform.outbox_events
        SET attempts = attempts + 1, last_error = ${code},
            available_at = now() + interval '1 minute'
        WHERE id = ${eventId}::uuid AND published_at IS NULL
      `;
      logger.error({eventId,runId,code},"Question Studio task not yet recorded; retry scheduled");
    }
    return true;
  });
}
