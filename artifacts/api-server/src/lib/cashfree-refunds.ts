import { assessCashfreeRefundEvidence, fetchCashfreeRefund, isRoundedCashfreePaymentReference } from "./cashfree-payments";
import { CommerceRefundError, reconcileProcessedRefund } from "./canonical-commerce-refunds";
import { sqlClient } from "./db";

/** Confirm all refund details directly with Cashfree before changing paid access.
 * No browser input or standalone webhook body can mark a refund processed.
 */
export async function reconcileCashfreeRefundRecord(refundId: string, canonicalOrderId?: string) {
  const rows = await sqlClient`
    SELECT r.id::text AS "refundId", r.status AS "refundStatus", r.amount_minor::float8 AS "amountMinor",
      pa.id::text AS "paymentAttemptId", pa.amount_minor::float8 AS "capturedAmountMinor",
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
  const evidence = assessCashfreeRefundEvidence(response, {
    refundId, orderId: String(row.providerOrderId),
    paymentId: String(row.providerPaymentId),
    amountMinor: Number(row.amountMinor), currency: String(row.currency),
  });
  // Historical payment captures could store a rounded 19-digit gateway ID.
  // Never treat a different payment ID as valid without BOTH exact provider
  // refund GET evidence AND an independently signed and processed payment
  // success event for the same order, captured amount and currency.
  const verifiedPaymentId = String(response.cf_payment_id ?? "");
  const repairCandidate =
    evidence.mismatched.length === 1 && evidence.mismatched[0] === "cf_payment_id"
    && evidence.missing.length === 0
    && isRoundedCashfreePaymentReference(String(row.providerPaymentId), verifiedPaymentId);
  if (!repairCandidate && (evidence.mismatched.length || evidence.missing.length)) {
    // Report only field names, never payment numbers, provider secrets or the
    // raw gateway response. A mismatch must NEVER mark a refund processed.
    const fields = { mismatched: evidence.mismatched, missing: evidence.missing };
    console.warn("Cashfree refund evidence verification incomplete", { refundId, fields });
    throw new CommerceRefundError(
      evidence.mismatched.length ? "CASHFREE_REFUND_MISMATCH" : "CASHFREE_REFUND_EVIDENCE_INCOMPLETE",
      evidence.mismatched.length
        ? "Cashfree refund evidence disagrees on: " + evidence.mismatched.join(", ")
        : "Cashfree refund evidence is missing: " + evidence.missing.join(", "),
      409, fields,
    );
  }
  const amountMinor = evidence.amountMinor!;
  const providerRefundId = evidence.providerRefundId!;
  const status = evidence.status!;
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
    if (repairCandidate) {
      // Recheck the canonical record under lock before correcting a rounding
      // artifact. Never overwrite a legitimate different provider payment.
      const payment = await tx`
        SELECT id::text AS id, provider_payment_id AS "paymentId", status, 
          amount_minor::float8 AS "capturedMinor", currency, provider_order_id AS "providerOrderId"
        FROM commerce.payment_attempts
        WHERE id = ${String(row.paymentAttemptId)}::uuid AND provider = 'cashfree'
        FOR UPDATE
      `;
      const captured = payment[0];
      if (!captured || captured.status !== "captured"
          || String(captured.paymentId) !== String(row.providerPaymentId)
          || Number(captured.capturedMinor) !== Number(row.capturedAmountMinor)
          || String(captured.providerOrderId) !== String(row.providerOrderId)
          || String(captured.currency) !== String(row.currency)) {
        throw new CommerceRefundError("CASHFREE_PAYMENT_REFERENCE_CHANGED",
          "Captured Cashfree payment reference changed during verification", 409);
      }
      // This is a second, independent signature-verified payment statement,
      // tied to the same canonical attempt; mere rounded numeric similarity
      // is never sufficient evidence to rewrite payment records.
      const proof = await tx`
        SELECT pe.id FROM commerce.payment_events pe
        WHERE pe.provider = 'cashfree'
          AND pe.payment_attempt_id = ${String(row.paymentAttemptId)}::uuid
          AND pe.event_type = 'PAYMENT_SUCCESS_WEBHOOK'
          AND pe.signature_verified = true AND pe.processed_at IS NOT NULL
          AND pe.provider_event_id = ${"PAYMENT_SUCCESS_WEBHOOK:" + verifiedPaymentId}
          AND pe.payload #>> '{data,order,order_id}' = ${String(row.providerOrderId)}
          AND pe.payload #>> '{data,payment,cf_payment_id}' = ${verifiedPaymentId}
          AND pe.payload #>> '{data,payment,payment_status}' = 'SUCCESS'
          AND pe.payload #>> '{data,payment,payment_currency}' = ${String(row.currency)}
          AND (pe.payload #>> '{data,payment,payment_amount}')::numeric * 100 = ${Number(row.capturedAmountMinor)}
        LIMIT 1
      `;
      if (!proof[0]) {
        throw new CommerceRefundError("CASHFREE_PAYMENT_PROOF_REQUIRED",
          "Cashfree refund payment ID differs; matching signed payment evidence is required", 409);
      }
      await tx`
        UPDATE commerce.payment_attempts
        SET provider_payment_id = ${verifiedPaymentId}, updated_at = now()
        WHERE id = ${String(row.paymentAttemptId)}::uuid
          AND provider_payment_id = ${String(row.providerPaymentId)}
      `;
      console.info("Repaired legacy rounded Cashfree payment reference from verified GET and signed success event",
        { refundId });
    }
    if (status === "SUCCESS") {
      const processedAt = response.processed_at && !Number.isNaN(Date.parse(response.processed_at))
        ? new Date(response.processed_at).toISOString() : null;
      const result = await reconcileProcessedRefund({
        client: tx as typeof sqlClient, provider: "cashfree", canonicalRefundId: refundId,
        providerRefundId, providerPaymentId: repairCandidate ? verifiedPaymentId : String(row.providerPaymentId), amountMinor, processedAt,
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
