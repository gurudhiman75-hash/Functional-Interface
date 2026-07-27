import { sqlClient } from "./db";

type SqlExecutor = typeof sqlClient;

export class CommerceRefundError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode = 409, public readonly details?: unknown) { super(message); }
}

export async function reconcileProcessedRefund(input: {
  client: SqlExecutor;
  providerRefundId: string;
  providerPaymentId: string;
  amountMinor: number;
  processedAt?: string | null;
}) {
  const rows = await input.client`
    SELECT r.id::text AS "refundId", r.status AS "refundStatus", r.amount_minor::float8 AS "refundAmountMinor",
      pa.id::text AS "paymentAttemptId", pa.order_id::text AS "orderId", pa.amount_minor::float8 AS "capturedAmountMinor"
    FROM commerce.refunds r
    JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id
    WHERE pa.provider = 'razorpay'
      AND (r.provider_refund_id = ${input.providerRefundId} OR (r.provider_refund_id IS NULL AND pa.provider_payment_id = ${input.providerPaymentId} AND r.amount_minor = ${input.amountMinor}))
    ORDER BY r.created_at DESC LIMIT 1 FOR UPDATE OF r, pa
  `;
  const row = rows[0];
  if (!row) throw new CommerceRefundError("REFUND_REQUEST_NOT_FOUND", "No canonical refund request matches this provider refund", 404);
  if (Number(row.refundAmountMinor) !== input.amountMinor) throw new CommerceRefundError("REFUND_AMOUNT_MISMATCH", "Provider refund amount does not match the canonical request", 409);

  await input.client`
    UPDATE commerce.refunds SET provider_refund_id = ${input.providerRefundId}, status = 'processed', processed_at = ${input.processedAt ?? new Date().toISOString()}::timestamptz
    WHERE id = ${String(row.refundId)}::uuid
  `;
  const totals = await input.client`
    SELECT COALESCE(SUM(amount_minor),0)::float8 AS "refundedMinor"
    FROM commerce.refunds WHERE payment_attempt_id = ${String(row.paymentAttemptId)}::uuid AND status = 'processed'
  `;
  const refundedMinor = Number(totals[0]?.refundedMinor ?? 0);
  const capturedMinor = Number(row.capturedAmountMinor);
  if (refundedMinor > capturedMinor) throw new CommerceRefundError("REFUND_TOTAL_EXCEEDS_CAPTURE", "Processed refunds exceed the captured payment", 409);
  const full = refundedMinor === capturedMinor;
  await input.client`
    UPDATE commerce.payment_attempts SET status = ${full ? "refunded" : "partially_refunded"}, updated_at = now()
    WHERE id = ${String(row.paymentAttemptId)}::uuid
  `;
  await input.client`
    UPDATE commerce.orders SET status = ${full ? "refunded" : "partially_refunded"}, updated_at = now()
    WHERE id = ${String(row.orderId)}::uuid
  `;
  if (full) {
    await input.client`
      UPDATE commerce.entitlements e SET status = 'revoked', revoked_at = COALESCE(revoked_at, now()),
        revoke_reason = COALESCE(revoke_reason, 'Full payment refund processed'), updated_at = now()
      FROM commerce.order_items oi
      WHERE e.order_item_id = oi.id AND oi.order_id = ${String(row.orderId)}::uuid AND e.status = 'active'
    `;
  }
  return { orderId: String(row.orderId), refundedMinor, capturedMinor, fullRefund: full };
}
