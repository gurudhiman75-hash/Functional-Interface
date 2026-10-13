// Internal ONLY: transactionally record a queued generation run, unique
// idempotency reservation and outbox event. This function is NOT mounted on an
// API route, called by a job, or enabled in production by merging its source.
// A dedicated authenticated API rollout will wire this after migration,
// Cloud Tasks delivery, retry/idempotence and review-commit tests have passed.
import { randomUUID } from "node:crypto";
import { sqlClient } from "../lib/db";
import { validateUniversalStudioComputeInput } from "./universal-executor";
import {
  EnqueueValidationError,
  assertEnqueueIdentity,
  canonicalEnqueueRequest,
  digestCanonicalEnqueueRequest,
  type CanonicalEnqueueInput,
} from "./async-enqueue-contract";

export type QueuedGenerationReceipt = {
  id: string;
  publicCode: string;
  status: string;
  reused: boolean;
  retryAfterSeconds: number | null;
};

class ExistingIdempotencyReservation extends Error {}

export async function recordQuestionStudioEnqueueIntent(
  input: CanonicalEnqueueInput,
): Promise<QueuedGenerationReceipt> {
  // Fail closed until explicit async rollout AND durable dispatcher are ready.
  if (process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_QUEUE_ENABLED !== "true" ||
      process.env.EXAMTREE_QUESTION_STUDIO_ASYNC_OUTBOX_ENABLED !== "true") {
    throw new EnqueueValidationError("QUESTION_STUDIO_ASYNC_QUEUE_DISABLED",
      "Asynchronous generation has not been enabled", 503);
  }
  assertEnqueueIdentity(input.identity);
  validateUniversalStudioComputeInput(input.compute);

  const actorUid = input.identity.actorFirebaseUid;
  const key = input.identity.idempotencyKey;
  const requestSha = digestCanonicalEnqueueRequest(input.compute);
  const runId = randomUUID();
  const publicCode = `GEN-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
  const canonical = canonicalEnqueueRequest(input.compute);
  // A retry of a task always reuses this seed and produces deterministic
  // candidates even when the admin did not supply an explicit one.
  const seeded = {
    ...canonical,
    request: { ...canonical.request, seed: canonical.request.seed || `qs-async:${runId}` },
  };
  const snapshot = {
    ...seeded,
    requestedByFirebaseUid: actorUid,
    queueVersion: 1,
  };
  const actorUuid = input.identity.identityUserId ?? null;
  const reqSnapshot = JSON.stringify(snapshot);

  try {
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.generation_runs (
          id, public_code, requested_by, status, attempt_number,
          prompt_snapshot, request_snapshot, provider, model,
          prompt_tokens, completion_tokens, estimated_cost_paise,
          actual_cost_paise, due_at, created_at, updated_at
        ) VALUES (
          ${runId}::uuid, ${publicCode}, ${actorUuid}::uuid,
          'queued'::generation_run_status, 1,
          ${reqSnapshot}, (${reqSnapshot}::text)::jsonb, 'examtree',
          'question-studio-universal-v1',
          0, 0, 0, 0, now() + interval '15 minutes',
          now(), now()
        )
      `;
      const reserved = await tx`
        INSERT INTO content.generation_enqueue_idempotency (
          actor_firebase_uid, idempotency_key, request_sha256, generation_run_id
        ) VALUES (
          ${actorUid}, ${key}, ${requestSha}, ${runId}::uuid
        )
        ON CONFLICT (actor_firebase_uid, idempotency_key) DO NOTHING
        RETURNING generation_run_id
      `;
      if (reserved.length !== 1) {
        // Throwing here rolls back the newly-created run and all its writes;
        // an existing successful reservation is read below after rollback.
        throw new ExistingIdempotencyReservation();
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key,
          entity_type, entity_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUuid}::uuid,
          'question_studio.generation_run.queued', 'generation_run', ${runId}::uuid,
          'Authorized admin requested asynchronous deterministic generation',
          ${`Queued ${input.compute.count} ${input.compute.request.packageId} candidates in ${publicCode}`},
          (${JSON.stringify({firebaseUid:actorUid, packageId:input.compute.request.packageId,
                           engineId:input.compute.request.engineId, queueVersion:1})}::text)::jsonb
        )
      `;
      await tx`
        INSERT INTO platform.outbox_events (
          id, aggregate_type, aggregate_id, event_type, payload
        ) VALUES (
          ${randomUUID()}::uuid, 'generation_run', ${runId}::uuid,
          'question_studio.generation_run.queued.v1',
          (${JSON.stringify({runId, queueVersion:1})}::text)::jsonb
        )
      `;
    });
    return {
      id: runId,
      publicCode,
      status: "queued",
      reused: false,
      retryAfterSeconds: 3,
    };
  } catch (error) {
    if (!(error instanceof ExistingIdempotencyReservation)) throw error;
  }

  // A same-key concurrent caller waits on the unique constraint before
  // ON CONFLICT returns, so the previous transaction is now committed.
  // Reused keys with different normalized requests are always rejected.
  const rows = await sqlClient`
    SELECT r.id, r.public_code, r.status::text AS status,
           k.request_sha256
    FROM content.generation_enqueue_idempotency k
    INNER JOIN content.generation_runs r ON r.id = k.generation_run_id
    WHERE k.actor_firebase_uid = ${actorUid}
      AND k.idempotency_key = ${key}
    LIMIT 1
  `;
  const previous = rows[0];
  if (!previous) {
    throw new EnqueueValidationError("GENERATION_ENQUEUE_CONFLICT_RETRY",
      "Generation request is being committed; retry with the same key", 409);
  }
  if (previous.request_sha256 !== requestSha) {
    throw new EnqueueValidationError("GENERATION_IDEMPOTENCY_CONFLICT",
      "The same idempotency key cannot be used for a different generation request", 409);
  }
  const status = String(previous.status);
  return {
    id: String(previous.id),
    publicCode: String(previous.public_code),
    status,
    reused: true,
    retryAfterSeconds: ["queued","running","validation"].includes(status) ? 3 : null,
  };
}
