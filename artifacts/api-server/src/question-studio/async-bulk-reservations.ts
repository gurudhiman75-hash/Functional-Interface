// Inert persistence foundation. NOT mounted on any route or dispatcher.
// Database migration is intentionally unapplied. Do not invoke before release review.
import { randomUUID, createHash } from "node:crypto";
import { sqlClient } from "../lib/db";
import { assertEnqueueIdentity, canonicalEnqueueRequest } from "./async-enqueue-contract";
import type { EnqueueIdentity } from "./async-enqueue-contract";
import type { UniversalStudioComputeInput } from "./universal-executor";
import { planAsyncChapterReviewBatches } from "./async-bulk-plan.mjs";

type BulkPlanChild = {
  batchIndex: number;
  count: number;
  idempotencyKey: string;
  selectedCpIds: readonly string[];
};

type BulkOperationReceipt = {
  id: string;
  status: string;
  requestedCount: number;
  reused: boolean;
  children: Array<BulkPlanChild & { generationRunId: string | null; status: string }>;
};

class ReservationCollision extends Error {}
function canonicalDigest(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function reject(code: string): never {
  throw Object.assign(new Error(code), { code, statusCode: 409 });
}

export async function reserveAsyncBulkReviewOperation(input: {
  identity: EnqueueIdentity;
  compute: UniversalStudioComputeInput;
}): Promise<BulkOperationReceipt> {
  assertEnqueueIdentity(input.identity);
  if (!input.identity.identityUserId) reject("BULK_ASYNC_ADMIN_ID_REQUIRED");
  // No per-run enqueue is performed here; each child must later pass its own
  // manifest, release-scope, RBAC, expiry and 1–20 count checks.
  const compute = input.compute;
  if (!compute?.request || compute.request.count !== compute.count ||
      compute.request.seed !== undefined ||
      typeof compute.request.packageId !== "string" ||
      typeof compute.request.engineId !== "string") {
    reject("BULK_ASYNC_REQUEST_INVALID");
  }
  const normalized = canonicalEnqueueRequest(compute);
  // Validate all inputs before any write. Use a stable operation UUID per
  // reservation; retries query the existing parent instead of creating children.
  const operationId = randomUUID();
  const children = planAsyncChapterReviewBatches({
    totalCount: compute.count,
    selectedCpIds: compute.selectedCpIds,
    operationId,
  }) as readonly BulkPlanChild[];
  const hash = canonicalDigest(normalized);
  const actor = input.identity.actorFirebaseUid;
  const key = "bulk:" + input.identity.idempotencyKey;
  const requestedBy = input.identity.identityUserId;
  try {
    await sqlClient.begin(async tx => {
      const inserted = await tx`
        INSERT INTO content.generation_bulk_operations (
          id,actor_firebase_uid,requested_by,idempotency_key,request_sha256,
          canonical_request,requested_count,child_count
        ) VALUES (
          ${operationId}::uuid,${actor},${requestedBy}::uuid,${key},${hash},
          (${JSON.stringify(normalized)}::text)::jsonb,${compute.count},${children.length}
        )
        ON CONFLICT (actor_firebase_uid,idempotency_key) DO NOTHING
        RETURNING id
      `;
      if (inserted.length !== 1) throw new ReservationCollision();
      for (const child of children) {
        await tx`
          INSERT INTO content.generation_bulk_children (
            operation_id,batch_index,requested_count,selected_cp_ids,idempotency_key
          ) VALUES (
            ${operationId}::uuid,${child.batchIndex},${child.count},
            (${JSON.stringify(child.selectedCpIds)}::text)::jsonb,${child.idempotencyKey}
          )
        `;
      }
    });
  } catch (error) {
    if (!(error instanceof ReservationCollision)) throw error;
  }
  const parents = await sqlClient`
    SELECT id,requested_by,request_sha256,requested_count,child_count,status
    FROM content.generation_bulk_operations
    WHERE actor_firebase_uid=${actor} AND idempotency_key=${key}
    LIMIT 1
  `;
  const parent = parents[0];
  if (!parent) reject("BULK_ASYNC_RESERVATION_RETRY");
  if (String(parent.request_sha256) !== hash ||
      String(parent.requested_by) !== requestedBy ||
      Number(parent.requested_count) !== compute.count) {
    reject("BULK_ASYNC_IDEMPOTENCY_CONFLICT");
  }
  const rows = await sqlClient`
    SELECT batch_index,requested_count,selected_cp_ids,idempotency_key,
           generation_run_id,status
    FROM content.generation_bulk_children
    WHERE operation_id=${String(parent.id)}::uuid
    ORDER BY batch_index ASC
  `;
  if (rows.length !== Number(parent.child_count) ||
      rows.reduce((sum, row) => sum + Number(row.requested_count), 0) !== compute.count) {
    reject("BULK_ASYNC_RESERVATION_INCOMPLETE");
  }
  return {
    id: String(parent.id),
    status: String(parent.status),
    requestedCount: compute.count,
    reused: String(parent.id) !== operationId,
    children: rows.map(row => ({
      batchIndex: Number(row.batch_index),
      count: Number(row.requested_count),
      selectedCpIds: row.selected_cp_ids as string[],
      idempotencyKey: String(row.idempotency_key),
      generationRunId: row.generation_run_id ? String(row.generation_run_id) : null,
      status: String(row.status),
    })),
  };
}
