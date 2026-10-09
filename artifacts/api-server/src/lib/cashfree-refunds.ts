import { cashfreeRefundReference, fetchCashfreeRefund } from "./cashfree-payments";
import { CommerceRefundError, reconcileProcessedRefund } from "./canonical-commerce-refunds";
import { sqlClient } from "./db";

/** Confirm all refund details directly with Cashfree before changing paid access.
 * No browser input or standalone webhook body can mark a refund processed.
 */
export async function reconcileCashfreeRefundRecord(refundId: string, canonicalOrderId?: string) {
  const rows = await sqlClient`
    SELECT r.id::text AS "refundId", r.status AS "refundStatus", r.amount_minor::float8 AS "amountMinor",
      pa.provider_order_id AS "providerOrderId", pa.provider_payment_id AS "providerPaymentId",
      o.id::text AS "orderId", pa.currency
    FROM commerce.refunds r
    JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id
    JOIN commerce.orders o ON o.id = pa.order_id
    WHERE r.id = ${refundId}::uuid AND pa.provider = 'cashfree'
    LIMIT 1
  `;
  const row = rows[0];
  if (!row || (canonicalOrderId && String(row.orderId) !== canonicalOrderId))
    throw new CommerceRefundError("REFUND_REQUEST_NOT_FOUND", "Cashfree refund does not match this order", 404);
  if (!row.providerOrderId || !row.providerPaymentId)
    throw new CommerceRefundError("REFUND_PAYMENT_MISSING", "Captured Cashfree payment reference is missing", 409);
  if (row.refundStatus === "failed") return { refundId, status: "failed", fullRefund: false };
  const response = await fetchCashfreeRefund(String(row.providerOrderId), refundId);
  const amountMinor = Math.round(Number(response.refund_amount) * 100);
  const providerRefundId = String(response.cf_refund_id ?? "");
  const status = String(response.refund_status ?? "").toUpperCase();
  if (String(response.refund_id ?? "") !== cashfreeRefundReference(refundId)
      || String(response.order_id ?? "") !== String(row.providerOrderId)
      || String(response.cf_payment_id ?? "") !== String(row.providerPaymentId)
      || String(response.refund_currency ?? "").toUpperCase() !== String(row.currency)
      || !Number.isSafeInteger(amountMinor) || amountMinor !== Number(row.amountMinor)
      || !providerRefundId || !["PENDING","ONHOLD","SUCCESS","FAILED","CANCELLED"].includes(status)) {
    throw new CommerceRefundError("CASHFREE_REFUND_MISMATCH", "Cashfree refund evidence does not match the captured payment", 409);
  }
  return sqlClient.begin(async tx => {
    const locked = await tx`
      SELECT r.status, r.provider_refund_id AS "providerRefundId" FROM commerce.refunds r
      JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id
      WHERE r.id = ${refundId}::uuid AND pa.provider = 'cashfree' FOR UPDATE OF r
    `;
    if (!locked[0]) throw new CommerceRefundError("REFUND_REQUEST_NOT_FOUND", "Refund record disappeared", 404);
    if (locked[0].providerRefundId && String(locked[0].providerRefundId) !== providerRefundId)
      throw new CommerceRefundError("CASHFREE_REFUND_ID_MISMATCH", "Cashfree refund reference changed", 409);
    if (locked[0].status === "processed") return { refundId, status: "processed", fullRefund: false, alreadyProcessed: true };
    if (locked[0].status === "failed") return { refundId, status: "failed", fullRefund: false };
    if (status === "SUCCESS") {
      const processedAt = response.processed_at && !Number.isNaN(Date.parse(response.processed_at))
        ? new Date(response.processed_at).toISOString() : null;
      const result = await reconcileProcessedRefund({
        client: tx as typeof sqlClient, provider: "cashfree", canonicalRefundId: refundId,
        providerRefundId, providerPaymentId: String(row.providerPaymentId), amountMinor, processedAt,
      });
      return { refundId, status: "processed", ...result };
    }
    if (status === "FAILED" || status === "CANCELLED") {
      await tx`UPDATE commerce.refunds SET status = 'failed', provider_refund_id = ${providerRefundId} WHERE id = ${refundId}::uuid AND status = 'created'`;
      return { refundId, status: "failed", fullRefund: false };
    }
    await tx`UPDATE commerce.refunds SET provider_refund_id = ${providerRefundId} WHERE id = ${refundId}::uuid AND status = 'created'`;
    return { refundId, status: "created", providerStatus: status, fullRefund: false };
  });
}
