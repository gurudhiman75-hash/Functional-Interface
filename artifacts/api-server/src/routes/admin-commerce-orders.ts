import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { assessCashfreeRefundAcknowledgement, cashfreeMode, createCashfreeRefund } from "../lib/cashfree-payments";
import { reconcileCashfreeRefundRecord } from "../lib/cashfree-refunds";
import { authenticate } from "../middlewares/auth";

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
router.use(authenticate);

router.get("/", requireAdminPermission("commerce.orders.read"), async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase().slice(0, 160) : "";
  const status = typeof req.query.status === "string" ? req.query.status.trim() : "";
  try {
    const rows = await sqlClient`
      SELECT o.id::text AS id, o.order_number::text AS "orderNumber", o.status, o.currency,
        o.subtotal_minor::float8 AS "subtotalMinor", o.discount_minor::float8 AS "discountMinor", o.tax_minor::float8 AS "taxMinor", o.total_minor::float8 AS "totalMinor",
        o.created_at AS "createdAt", o.paid_at AS "paidAt", o.expires_at AS "expiresAt", u.id::text AS "userId", u.email, u.display_name AS "displayName",
        COALESCE(item_totals."itemCount", 0)::int AS "itemCount",
        COALESCE(item_totals."entitlementCount", 0)::int AS "entitlementCount",
        payment.status AS "paymentStatus",
        payment.provider_order_id AS "providerOrderId",
        payment.provider_payment_id AS "providerPaymentId",
        COALESCE(payment."refundedMinor", 0)::float8 AS "refundedMinor"
      FROM commerce.orders o
      JOIN identity.users u ON u.id = o.user_id
      LEFT JOIN LATERAL (
        SELECT COUNT(*)::int AS "itemCount", COUNT(e.id)::int AS "entitlementCount"
        FROM commerce.order_items oi
        LEFT JOIN commerce.entitlements e ON e.order_item_id = oi.id
        WHERE oi.order_id = o.id
      ) item_totals ON true
      LEFT JOIN LATERAL (
        SELECT pa.status, pa.provider_order_id, pa.provider_payment_id,
          COALESCE((
            SELECT SUM(r.amount_minor)
            FROM commerce.refunds r
            WHERE r.payment_attempt_id = pa.id AND r.status = 'processed'
          ), 0)::float8 AS "refundedMinor"
        FROM commerce.payment_attempts pa
        WHERE pa.order_id = o.id AND pa.provider IN ('razorpay', 'cashfree')
        ORDER BY pa.created_at DESC, pa.id DESC
        LIMIT 1
      ) payment ON true
      WHERE (${search} = '' OR lower(o.order_number::text) LIKE ${`%${search}%`} OR lower(u.email) LIKE ${`%${search}%`} OR lower(COALESCE(u.display_name,'')) LIKE ${`%${search}%`})
        AND (${status} = '' OR o.status = ${status})
      ORDER BY o.created_at DESC
      LIMIT 500
    `;
    res.json({ orders: rows, generatedAt: new Date().toISOString() });
  } catch (error) { console.error("Unable to load commerce orders", error); res.status(500).json({ error: "Unable to load orders" }); }
});

/**
 * Read-only financial reconciliation queue for operators.
 * Preserve signed historical evidence; a mismatched Cashfree payment ID is
 * flagged for provider verification, never automatically captured/refunded.
 */
router.get("/reconciliation/health", requireAdminPermission("commerce.orders.read"), async (_req, res) => {
  try {
    const [conflictingSuccesses, unresolvedRefunds, expiredPendingOrders] = await Promise.all([
      sqlClient`
        SELECT pa.order_id::text AS "orderId", o.status AS "orderStatus",
          pa.status AS "paymentStatus",
          COUNT(*) FILTER (
            WHERE pe.payload#>>'{data,payment,cf_payment_id}'
              IS DISTINCT FROM pa.provider_payment_id
          )::int AS "conflictingSuccessEvents",
          COUNT(*) FILTER (WHERE pe.processing_error IS NOT NULL)::int AS "flaggedEvents",
          COUNT(*)::int AS "signedSuccessEvents"
        FROM commerce.payment_events pe
        JOIN commerce.payment_attempts pa ON pa.id = pe.payment_attempt_id
        JOIN commerce.orders o ON o.id = pa.order_id
        WHERE pe.provider = 'cashfree'
          AND pe.event_type = 'PAYMENT_SUCCESS_WEBHOOK'
          AND pe.signature_verified = true AND pe.processed_at IS NOT NULL
          AND pa.provider_payment_id IS NOT NULL
        GROUP BY pa.order_id, o.status, pa.status
        HAVING COUNT(*) FILTER (
          WHERE pe.payload#>>'{data,payment,cf_payment_id}'
            IS DISTINCT FROM pa.provider_payment_id
        ) > 0
        ORDER BY "conflictingSuccessEvents" DESC, pa.order_id
        LIMIT 100
      `,
      sqlClient`
        SELECT r.id::text AS "refundId", o.id::text AS "orderId",
          r.status AS "refundStatus", r.amount_minor::float8 AS "amountMinor",
          r.created_at AS "createdAt",
          r.provider_refund_id IS NOT NULL AS "providerReferencePresent"
        FROM commerce.refunds r
        JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id
        JOIN commerce.orders o ON o.id = pa.order_id
        WHERE pa.provider = 'cashfree'
          AND r.status NOT IN ('processed', 'failed', 'cancelled')
        ORDER BY r.created_at ASC LIMIT 100
      `,
      sqlClient`
        SELECT o.id::text AS "orderId", o.status AS "orderStatus",
          o.expires_at AS "expiresAt", pa.status AS "paymentStatus"
        FROM commerce.orders o
        JOIN commerce.payment_attempts pa ON pa.order_id = o.id
        WHERE pa.provider = 'cashfree'
          AND o.status = 'payment_pending'
          AND o.expires_at < now()
        ORDER BY o.expires_at ASC LIMIT 100
      `,
    ]);
    res.json({
      requiresProviderVerification: true,
      summary: {
        conflictingSuccessOrders: conflictingSuccesses.length,
        unresolvedRefunds: unresolvedRefunds.length,
        expiredPendingOrders: expiredPendingOrders.length,
      },
      conflictingSuccesses,
      unresolvedRefunds,
      expiredPendingOrders,
      // Counts are bounded to 100 rows per category; do not mistake limits
      // for proof of a clean ledger if the queue reaches that threshold.
      truncated: [conflictingSuccesses, unresolvedRefunds, expiredPendingOrders].some((rows) => rows.length === 100),
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to load commerce reconciliation health", error);
    res.status(500).json({ error: "Unable to load commerce reconciliation health", code: "COMMERCE_RECONCILIATION_HEALTH_FAILED" });
  }
});

router.post("/:orderId/refunds", requireAdminPermission("commerce.orders.manage"), async (req, res) => {
  const orderId = String(req.params.orderId ?? "");
  const amountMinor = Math.floor(Number(req.body?.amountMinor));
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 1000) : "";
  if (!uuid.test(orderId)) return void res.status(400).json({ error: "Invalid order identifier", code: "INVALID_ORDER_ID" });
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) return void res.status(400).json({ error: "Refund amount must be a positive integer in minor currency units", code: "INVALID_REFUND_AMOUNT" });
  if (reason.length < 8) return void res.status(400).json({ error: "A clear refund reason is required", code: "REFUND_REASON_REQUIRED" });
  let provider: "razorpay" | "cashfree";
  try {
    const payments = await sqlClient`
      SELECT provider FROM commerce.payment_attempts
      WHERE order_id = ${orderId}::uuid AND provider IN ('razorpay','cashfree')
        AND status IN ('captured','partially_refunded')
      ORDER BY created_at DESC LIMIT 1
    `;
    const selected = String(payments[0]?.provider ?? "");
    if (selected !== "razorpay" && selected !== "cashfree")
      return void res.status(409).json({ error: "No refundable captured payment was found", code: "PAYMENT_NOT_REFUNDABLE" });
    provider = selected;
  } catch (error) {
    console.error("Unable to identify refund provider", error);
    return void res.status(503).json({ error: "Unable to verify payment provider", code: "REFUND_PROVIDER_LOOKUP_FAILED" });
  }
  // A production Cashfree refund is disabled unless the merchant explicitly
  // enables it after sandbox reconciliation has been accepted.
  if (provider === "cashfree" && cashfreeMode() === "production" && process.env.CASHFREE_REFUNDS_ENABLED !== "true")
    return void res.status(409).json({ error: "Cashfree production refunds have not been enabled", code: "CASHFREE_REFUNDS_NOT_ENABLED" });
  const keyId = process.env.RAZORPAY_KEY_ID; const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (provider === "razorpay" && (!keyId || !keySecret))
    return void res.status(503).json({ error: "Refund provider is not configured", code: "PAYMENT_PROVIDER_NOT_CONFIGURED" });
  const refundId = randomUUID();
  try {
    const prepared = await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext(${`commerce-refund:${orderId}`}))`;
      const rows = await tx`
        SELECT pa.id::text AS "paymentAttemptId", pa.provider_order_id AS "providerOrderId",
          pa.provider_payment_id AS "providerPaymentId", pa.amount_minor::float8 AS "capturedMinor",
          pa.status AS "paymentStatus", pa.currency, o.order_number::text AS "orderNumber",
          COALESCE((SELECT SUM(r.amount_minor) FROM commerce.refunds r WHERE r.payment_attempt_id = pa.id AND r.status IN ('created','processed')),0)::float8 AS "reservedRefundMinor"
        FROM commerce.orders o JOIN commerce.payment_attempts pa ON pa.order_id = o.id AND pa.provider = ${provider}
        WHERE o.id = ${orderId}::uuid AND o.status IN ('paid','partially_refunded')
        ORDER BY pa.created_at DESC LIMIT 1 FOR UPDATE OF o, pa
      `;
      const row = rows[0];
      if (!row || !row.providerPaymentId || !["captured","partially_refunded"].includes(String(row.paymentStatus)))
        throw Object.assign(new Error("Only captured payments can be refunded"), { statusCode: 409, code: "PAYMENT_NOT_REFUNDABLE" });
      if (provider === "cashfree" && (!row.providerOrderId || String(row.currency) !== "INR"))
        throw Object.assign(new Error("Cashfree order reference or currency is invalid"), { statusCode: 409, code: "CASHFREE_ORDER_INVALID" });
      const remainingMinor = Number(row.capturedMinor) - Number(row.reservedRefundMinor);
      if (amountMinor > remainingMinor)
        throw Object.assign(new Error("Refund exceeds the remaining captured amount"), { statusCode: 409, code: "REFUND_EXCEEDS_REMAINING", details: { remainingMinor } });
      await tx`INSERT INTO commerce.refunds (id, payment_attempt_id, status, amount_minor, reason, created_by, created_at)
        VALUES (${refundId}::uuid, ${String(row.paymentAttemptId)}::uuid, 'created', ${amountMinor}, ${reason}, ${req.adminSession!.user.id}::uuid, now())`;
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata)
        VALUES (${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession!.user.id}::uuid, 'commerce.refund.requested', 'commerce_order',
          ${orderId}::uuid, ${`Requested refund for order ${String(row.orderNumber)}`}, ${tx.json({ refundId, amountMinor, reason, provider })})
      `;
      return { providerPaymentId: String(row.providerPaymentId), providerOrderId: String(row.providerOrderId ?? ""), remainingMinor };
    });

    if (provider === "cashfree") {
      let gatewayRefund;
      try {
        gatewayRefund = await createCashfreeRefund({
          orderId: prepared.providerOrderId, refundUuid: refundId, amountMinor, reason,
        });
      } catch (error) {
        // A timeout/5xx is ambiguous: Cashfree may have accepted the refund.
        // Keep the idempotently-addressable request reserved for reconciliation.
        const httpStatus = Number((error as { providerHttpStatus?: number }).providerHttpStatus);
        if (httpStatus >= 400 && httpStatus < 500 && httpStatus !== 409 && httpStatus !== 429)
          await sqlClient`UPDATE commerce.refunds SET status = 'failed' WHERE id = ${refundId}::uuid AND status = 'created'`;
        throw error;
      }
      const receipt = assessCashfreeRefundAcknowledgement(gatewayRefund, {
        orderId: prepared.providerOrderId, paymentId: prepared.providerPaymentId,
        refundId, amountMinor, currency: "INR",
      });
      if (receipt.conflicts.length) {
        // Do not trust conflicting POST fields. The provider has already
        // acknowledged the request, so a second POST could double-refund.
        console.warn("Cashfree refund acknowledgement needs independent verification", {
          refundId, conflictingFields: receipt.conflicts,
        });
      }
      if (receipt.providerRefundId) {
        await sqlClient`UPDATE commerce.refunds SET provider_refund_id = ${receipt.providerRefundId}
          WHERE id = ${refundId}::uuid AND status = 'created'
            AND (provider_refund_id IS NULL OR provider_refund_id = ${receipt.providerRefundId})`;
      }
      // Always read the refund by its deterministic merchant reference.
      // A successful POST can have a sparse receipt; only verified GET
      // evidence may mark it processed or revoke student access.
      let status = "created";
      let verified = false;
      try {
        const checked = await reconcileCashfreeRefundRecord(refundId, orderId);
        status = checked.status;
        verified = true;
      } catch (error) {
        console.warn("Cashfree refund accepted but GET verification is pending", {
          refundId, reason: error instanceof Error ? error.message : "Gateway check unavailable",
        });
      }
      res.status(202).json({
        refundId, providerRefundId: receipt.providerRefundId,
        status, verified, amountMinor,
        message: verified
          ? "Cashfree refund status verified."
          : "Refund request was sent to Cashfree. Verification is pending; do not submit another refund. Use Check Cashfree status.",
      });
      return;
    }

    const response = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(prepared.providerPaymentId)}/refund`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountMinor, notes: { canonicalRefundId: refundId, canonicalOrderId: orderId, reason } }),
    });
    const providerBody = await response.json().catch(() => ({})) as Record<string, unknown>;
    if (!response.ok || typeof providerBody.id !== "string") {
      await sqlClient`UPDATE commerce.refunds SET status = 'failed' WHERE id = ${refundId}::uuid`;
      throw Object.assign(new Error(String(providerBody.description ?? providerBody.error ?? "Refund provider rejected the request")), { statusCode: 502, code: "REFUND_PROVIDER_REJECTED" });
    }
    await sqlClient`UPDATE commerce.refunds SET provider_refund_id = ${providerBody.id} WHERE id = ${refundId}::uuid`;
    res.status(202).json({ refundId, providerRefundId: providerBody.id, status: "created", amountMinor });
  } catch (error) {
    const typed = error as { statusCode?: number; code?: string; details?: unknown; message?: string };
    console.error("Unable to request commerce refund", error);
    res.status(typed.statusCode ?? 500).json({ error: typed.message ?? "Unable to request refund", code: typed.code ?? "REFUND_REQUEST_FAILED", details: typed.details });
  }
});


router.post("/:orderId/refunds/:refundId/reconcile", requireAdminPermission("commerce.orders.manage"), async (req, res) => {
  const orderId = String(req.params.orderId ?? "");
  const refundId = String(req.params.refundId ?? "");
  if (!uuid.test(orderId) || !uuid.test(refundId))
    return void res.status(400).json({ error: "Invalid order or refund identifier", code: "INVALID_REFUND_REFERENCE" });
  try {
    const result = await reconcileCashfreeRefundRecord(refundId, orderId);
    res.json(result);
  } catch (error) {
    const typed = error as { statusCode?: number; code?: string; message?: string };
    console.error("Unable to reconcile Cashfree refund", error);
    res.status(typed.statusCode ?? 503).json({ error: typed.message ?? "Unable to verify provider refund", code: typed.code ?? "REFUND_RECONCILE_FAILED" });
  }
});

router.get("/:orderId", requireAdminPermission("commerce.orders.read"), async (req, res) => {
  const orderId = String(req.params.orderId ?? ""); if (!uuid.test(orderId)) return void res.status(400).json({ error: "Invalid order identifier" });
  try {
    const orders = await sqlClient`
      SELECT o.id::text AS id, o.order_number::text AS "orderNumber", o.status, o.currency, o.subtotal_minor::float8 AS "subtotalMinor", o.discount_minor::float8 AS "discountMinor",
        o.tax_minor::float8 AS "taxMinor", o.total_minor::float8 AS "totalMinor", o.pricing_snapshot AS "pricingSnapshot", o.created_at AS "createdAt", o.updated_at AS "updatedAt",
        o.paid_at AS "paidAt", o.cancelled_at AS "cancelledAt", o.expires_at AS "expiresAt", u.id::text AS "userId", u.email, u.display_name AS "displayName"
      FROM commerce.orders o JOIN identity.users u ON u.id = o.user_id WHERE o.id = ${orderId}::uuid LIMIT 1
    `;
    if (!orders[0]) return void res.status(404).json({ error: "Order not found" });
    const [items, payments, events, entitlements, refunds] = await Promise.all([
      sqlClient`SELECT oi.id::text AS id, oi.product_id::text AS "productId", oi.product_version_id::text AS "productVersionId", oi.unit_price_minor::float8 AS "unitPriceMinor", oi.discount_minor::float8 AS "discountMinor", oi.tax_minor::float8 AS "taxMinor", oi.total_minor::float8 AS "totalMinor", oi.item_snapshot AS "itemSnapshot", p.code AS "productCode", pv.title, pv.version_number AS "versionNumber" FROM commerce.order_items oi JOIN commerce.products p ON p.id = oi.product_id JOIN commerce.product_versions pv ON pv.id = oi.product_version_id WHERE oi.order_id = ${orderId}::uuid ORDER BY oi.created_at`,
      sqlClient`SELECT id::text AS id, provider, provider_order_id AS "providerOrderId", provider_payment_id AS "providerPaymentId", status, amount_minor::float8 AS "amountMinor", currency, failure_code AS "failureCode", failure_message AS "failureMessage", authorized_at AS "authorizedAt", captured_at AS "capturedAt", created_at AS "createdAt" FROM commerce.payment_attempts WHERE order_id = ${orderId}::uuid ORDER BY created_at DESC`,
      sqlClient`SELECT pe.id::text AS id, pe.provider_event_id AS "providerEventId", pe.event_type AS "eventType", pe.signature_verified AS "signatureVerified", pe.received_at AS "receivedAt", pe.processed_at AS "processedAt", pe.processing_error AS "processingError" FROM commerce.payment_events pe JOIN commerce.payment_attempts pa ON pa.id = pe.payment_attempt_id WHERE pa.order_id = ${orderId}::uuid ORDER BY pe.received_at DESC LIMIT 200`,
      sqlClient`SELECT e.id::text AS id, e.status, e.starts_at AS "startsAt", e.ends_at AS "endsAt", e.revoked_at AS "revokedAt", e.revoke_reason AS "revokeReason", e.grant_source AS "grantSource", e.created_at AS "createdAt", COUNT(et.test_id)::int AS "testCount" FROM commerce.entitlements e JOIN commerce.order_items oi ON oi.id = e.order_item_id LEFT JOIN commerce.entitlement_tests et ON et.entitlement_id = e.id WHERE oi.order_id = ${orderId}::uuid GROUP BY e.id ORDER BY e.created_at`,
      sqlClient`SELECT r.id::text AS id, r.provider_refund_id AS "providerRefundId", r.status, r.amount_minor::float8 AS "amountMinor", r.reason, r.created_at AS "createdAt", r.processed_at AS "processedAt" FROM commerce.refunds r JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id WHERE pa.order_id = ${orderId}::uuid ORDER BY r.created_at DESC`,
    ]);
    const refundedMinor = refunds.filter((r) => String(r.status) === "processed").reduce((sum, r) => sum + Number(r.amountMinor), 0);
    res.json({ order: orders[0], items, payments, events, entitlements, refunds, refundedMinor, refundableMinor: Math.max(0, Number(orders[0].totalMinor) - refunds.filter((r) => ["processed", "created"].includes(String(r.status))).reduce((sum, r) => sum + Number(r.amountMinor), 0)), generatedAt: new Date().toISOString(), readOnly: false });
  } catch (error) { console.error("Unable to load commerce order detail", error); res.status(500).json({ error: "Unable to load order detail" }); }
});

export default router;
