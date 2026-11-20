import { sqlClient } from "../lib/db";
import { backgroundBatchesEnabled } from "./background-batch-config";
import { recordQuestionStudioEnqueueIntent } from "./async-enqueue-foundation";
import {
  claimQuestionStudioAsyncTask,
  releaseQuestionStudioAsyncTaskLeaseAfterFailure,
} from "./async-task-lease-claim";
import { computeInputFromQueuedSnapshot } from "./async-task-receiver-snapshot";
import { commitQuestionStudioAsyncReview } from "./async-review-commit";
import { executeUniversalStudioCompute } from "./universal-executor";
import type { UniversalStudioComputeInput } from "./universal-executor";

async function nextRun(): Promise<string | undefined> {
  return sqlClient.begin(async tx => {
    const [child] = await tx`
      SELECT p.id, p.actor_firebase_uid, p.requested_by, p.canonical_request,
             c.batch_index, c.requested_count, c.selected_cp_ids, c.idempotency_key,
             c.generation_run_id
      FROM content.generation_bulk_operations p
      JOIN content.generation_bulk_children c ON c.operation_id=p.id
      LEFT JOIN content.generation_runs r ON r.id=c.generation_run_id
      WHERE p.execution_mode='background' AND p.status IN ('planned','in_progress')
        AND (
          (c.status='planned' AND c.generation_run_id IS NULL)
          OR (r.status IN ('queued','running') AND NOT EXISTS (
            SELECT 1 FROM content.generation_run_task_leases l
            WHERE l.generation_run_id=r.id AND l.completed_at IS NULL
              AND l.lease_expires_at > now()
          ))
        )
        AND NOT EXISTS (
          SELECT 1
          FROM content.generation_bulk_children earlier
          LEFT JOIN content.generation_runs prior ON prior.id=earlier.generation_run_id
          WHERE earlier.operation_id=p.id AND earlier.batch_index < c.batch_index
            AND (prior.status IS NULL OR prior.status NOT IN ('review','approved','partially_approved')
              OR earlier.requested_count <> (
                SELECT count(*) FROM content.generation_run_items i
                WHERE i.generation_run_id=prior.id
              ))
        )
      ORDER BY p.created_at, p.id, c.batch_index
      LIMIT 1
      FOR UPDATE OF p SKIP LOCKED
    `;
    if (!child) return undefined;
    if (child.generation_run_id) return String(child.generation_run_id);

    const compute = child.canonical_request as UniversalStudioComputeInput;
    const count = Number(child.requested_count);
    // If this process exits before linking the run, a retry reuses the
    // committed enqueue receipt with the same child key.
    const receipt = await recordQuestionStudioEnqueueIntent({
      identity: {
        actorFirebaseUid: String(child.actor_firebase_uid),
        identityUserId: String(child.requested_by),
        idempotencyKey: String(child.idempotency_key),
      },
      compute: {
        ...compute,
        count,
        selectedCpIds: child.selected_cp_ids as string[],
        request: { ...compute.request, count },
      },
    }, "background");
    await tx`
      UPDATE content.generation_bulk_children
      SET generation_run_id=${receipt.id}::uuid, status='queued', updated_at=now()
      WHERE operation_id=${String(child.id)}::uuid AND batch_index=${Number(child.batch_index)}
    `;
    return receipt.id;
  });
}

export async function drainBackgroundBatches(): Promise<void> {
  if (!backgroundBatchesEnabled()) throw new Error("QS_BACKGROUND_BATCHES_DISABLED");
  // Bound each scheduled job execution. Remaining work stays in the database.
  for (let processed = 0; processed < 20; processed += 1) {
    const runId = await nextRun();
    if (!runId) return;
    const claim = await claimQuestionStudioAsyncTask(runId, snapshot =>
      (snapshot as { backgroundBatch?: boolean } | null)?.backgroundBatch === true);
    if (claim.kind === "busy") return;
    if (claim.kind === "exhausted" || claim.kind === "terminal") continue;
    if (claim.kind !== "claimed") throw new Error(`Unexpected claim for ${runId}: ${claim.kind}`);
    try {
      const batch = await executeUniversalStudioCompute(computeInputFromQueuedSnapshot(claim.requestSnapshot));
      await commitQuestionStudioAsyncReview({ runId, leaseToken: claim.leaseToken, batch });
    } catch (error) {
      await releaseQuestionStudioAsyncTaskLeaseAfterFailure(runId, claim.leaseToken);
      throw error;
    }
  }
}
