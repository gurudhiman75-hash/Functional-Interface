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
      SELECT o.id::text AS id, o.order_number::text AS "orderNumber", o.status,
        o.currency, o.subtotal_minor::float8 AS "subtotalMinor", o.discount_minor::float8 AS "discountMinor",
        o.tax_minor::float8 AS "taxMinor", o.total_minor::float8 AS "totalMinor",
        o.created_at AS "createdAt", o.paid_at AS "paidAt", o.expires_at AS "expiresAt",
        u.id::text AS "userId", u.email, u.display_name AS "displayName",
        COUNT(DISTINCT oi.id)::int AS "itemCount",
        COUNT(DISTINCT e.id)::int AS "entitlementCount",
        MAX(pa.status) FILTER (WHERE pa.provider = 'razorpay') AS "paymentStatus",
        MAX(pa.provider_order_id) FILTER (WHERE pa.provider = 'razorpay') AS "providerOrderId",
        MAX(pa.provider_payment_id) FILTER (WHERE pa.provider = 'razorpay') AS "providerPaymentId"
      FROM commerce.orders o
      JOIN identity.users u ON u.id = o.user_id
      LEFT JOIN commerce.order_items oi ON oi.order_id = o.id
      LEFT JOIN commerce.entitlements e ON e.order_item_id = oi.id
      LEFT JOIN commerce.payment_attempts pa ON pa.order_id = o.id
      WHERE (${search} = '' OR lower(o.order_number::text) LIKE ${`%${search}%`} OR lower(u.email) LIKE ${`%${search}%`} OR lower(COALESCE(u.display_name,'')) LIKE ${`%${search}%`})
        AND (${status} = '' OR o.status = ${status})
      GROUP BY o.id, u.id
      ORDER BY o.created_at DESC
      LIMIT 500
    `;
    res.json({ orders: rows, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Unable to load commerce orders", error);
    res.status(500).json({ error: "Unable to load orders" });
  }
});

router.get("/:orderId", requireAdminPermission("commerce.orders.read"), async (req, res) => {
  const orderId = String(req.params.orderId ?? "");
  if (!uuid.test(orderId)) return void res.status(400).json({ error: "Invalid order identifier" });
  try {
    const orders = await sqlClient`
      SELECT o.id::text AS id, o.order_number::text AS "orderNumber", o.status, o.currency,
        o.subtotal_minor::float8 AS "subtotalMinor", o.discount_minor::float8 AS "discountMinor",
        o.tax_minor::float8 AS "taxMinor", o.total_minor::float8 AS "totalMinor",
        o.pricing_snapshot AS "pricingSnapshot", o.created_at AS "createdAt", o.updated_at AS "updatedAt",
        o.paid_at AS "paidAt", o.cancelled_at AS "cancelledAt", o.expires_at AS "expiresAt",
        u.id::text AS "userId", u.email, u.display_name AS "displayName"
      FROM commerce.orders o JOIN identity.users u ON u.id = o.user_id
      WHERE o.id = ${orderId}::uuid LIMIT 1
    `;
    if (!orders[0]) return void res.status(404).json({ error: "Order not found" });
    const [items, payments, events, entitlements] = await Promise.all([
      sqlClient`
        SELECT oi.id::text AS id, oi.product_id::text AS "productId", oi.product_version_id::text AS "productVersionId",
          oi.unit_price_minor::float8 AS "unitPriceMinor", oi.discount_minor::float8 AS "discountMinor",
          oi.tax_minor::float8 AS "taxMinor", oi.total_minor::float8 AS "totalMinor", oi.item_snapshot AS "itemSnapshot",
          p.code AS "productCode", pv.title, pv.version_number AS "versionNumber"
        FROM commerce.order_items oi
        JOIN commerce.products p ON p.id = oi.product_id
        JOIN commerce.product_versions pv ON pv.id = oi.product_version_id
        WHERE oi.order_id = ${orderId}::uuid ORDER BY oi.created_at
      `,
      sqlClient`
        SELECT id::text AS id, provider, provider_order_id AS "providerOrderId", provider_payment_id AS "providerPaymentId",
          status, amount_minor::float8 AS "amountMinor", currency, failure_code AS "failureCode",
          failure_message AS "failureMessage", authorized_at AS "authorizedAt", captured_at AS "capturedAt", created_at AS "createdAt"
        FROM commerce.payment_attempts WHERE order_id = ${orderId}::uuid ORDER BY created_at DESC
      `,
      sqlClient`
        SELECT pe.id::text AS id, pe.provider_event_id AS "providerEventId", pe.event_type AS "eventType",
          pe.signature_verified AS "signatureVerified", pe.received_at AS "receivedAt", pe.processed_at AS "processedAt",
          pe.processing_error AS "processingError"
        FROM commerce.payment_events pe
        JOIN commerce.payment_attempts pa ON pa.id = pe.payment_attempt_id
        WHERE pa.order_id = ${orderId}::uuid ORDER BY pe.received_at DESC LIMIT 200
      `,
      sqlClient`
        SELECT e.id::text AS id, e.status, e.starts_at AS "startsAt", e.ends_at AS "endsAt",
          e.grant_source AS "grantSource", e.created_at AS "createdAt",
          COUNT(et.test_id)::int AS "testCount"
        FROM commerce.entitlements e
        JOIN commerce.order_items oi ON oi.id = e.order_item_id
        LEFT JOIN commerce.entitlement_tests et ON et.entitlement_id = e.id
        WHERE oi.order_id = ${orderId}::uuid
        GROUP BY e.id ORDER BY e.created_at
      `,
    ]);
    res.json({ order: orders[0], items, payments, events, entitlements, generatedAt: new Date().toISOString(), readOnly: true });
  } catch (error) {
    console.error("Unable to load commerce order detail", error);
    res.status(500).json({ error: "Unable to load order detail" });
  }
});

export default router;
