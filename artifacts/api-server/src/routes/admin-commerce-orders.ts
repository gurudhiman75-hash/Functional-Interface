import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
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
        WHERE pa.order_id = o.id AND pa.provider = 'razorpay'
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

router.post("/:orderId/refunds", requireAdminPermission("commerce.orders.manage"), async (req, res) => {
  const orderId = String(req.params.orderId ?? "");
  const amountMinor = Math.floor(Number(req.body?.amountMinor));
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 1000) : "";
  if (!uuid.test(orderId)) return void res.status(400).json({ error: "Invalid order identifier", code: "INVALID_ORDER_ID" });
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) return void res.status(400).json({ error: "Refund amount must be a positive integer in minor currency units", code: "INVALID_REFUND_AMOUNT" });
  if (reason.length < 8) return void res.status(400).json({ error: "A clear refund reason is required", code: "REFUND_REASON_REQUIRED" });
  const keyId = process.env.RAZORPAY_KEY_ID; const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return void res.status(503).json({ error: "Refund provider is not configured", code: "PAYMENT_PROVIDER_NOT_CONFIGURED" });
  const refundId = randomUUID();
  try {
    const prepared = await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext(${`commerce-refund:${orderId}`}))`;
      const rows = await tx`
        SELECT pa.id::text AS "paymentAttemptId", pa.provider_payment_id AS "providerPaymentId", pa.amount_minor::float8 AS "capturedMinor", pa.status AS "paymentStatus",
          o.order_number::text AS "orderNumber", o.status AS "orderStatus",
          COALESCE((SELECT SUM(r.amount_minor) FROM commerce.refunds r WHERE r.payment_attempt_id = pa.id AND r.status IN ('created','processed')),0)::float8 AS "reservedRefundMinor"
        FROM commerce.orders o JOIN commerce.payment_attempts pa ON pa.order_id = o.id AND pa.provider = 'razorpay'
        WHERE o.id = ${orderId}::uuid ORDER BY pa.created_at DESC LIMIT 1 FOR UPDATE OF o, pa
      `;
      const row = rows[0];
      if (!row || !row.providerPaymentId || !["captured","partially_refunded"].includes(String(row.paymentStatus))) throw Object.assign(new Error("Only captured payments can be refunded"), { statusCode: 409, code: "PAYMENT_NOT_REFUNDABLE" });
      const remainingMinor = Number(row.capturedMinor) - Number(row.reservedRefundMinor);
      if (amountMinor > remainingMinor) throw Object.assign(new Error("Refund exceeds the remaining captured amount"), { statusCode: 409, code: "REFUND_EXCEEDS_REMAINING", details: { remainingMinor } });
      await tx`INSERT INTO commerce.refunds (id, payment_attempt_id, status, amount_minor, reason, created_by, created_at) VALUES (${refundId}::uuid, ${String(row.paymentAttemptId)}::uuid, 'created', ${amountMinor}, ${reason}, ${req.adminSession!.user.id}::uuid, now())`;
      await tx`
        INSERT INTO platform.audit_events (id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata)
        VALUES (${randomUUID()}::uuid, 'user'::audit_actor_type, ${req.adminSession!.user.id}::uuid, 'commerce.refund.requested', 'commerce_order', ${orderId}::uuid, ${`Requested refund for order ${String(row.orderNumber)}`}, ${tx.json({ refundId, amountMinor, reason })})
      `;
      return { providerPaymentId: String(row.providerPaymentId), remainingMinor };
    });

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
    res.json({ order: orders[0], items, payments, events, entitlements, refunds, refundedMinor, refundableMinor: Math.max(0, Number(orders[0].totalMinor) - refundedMinor), generatedAt: new Date().toISOString(), readOnly: false });
  } catch (error) { console.error("Unable to load commerce order detail", error); res.status(500).json({ error: "Unable to load order detail" }); }
});

export default router;
