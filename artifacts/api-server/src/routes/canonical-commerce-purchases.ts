import { Router, type Response } from "express";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

class PurchaseHistoryError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
  ) {
    super(message);
  }
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof PurchaseHistoryError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "42P01" || code === "3F000") {
    res.status(503).json({ error: "Commerce is temporarily unavailable", code: "COMMERCE_SCHEMA_REQUIRED" });
    return;
  }
  console.error("Unable to load canonical student purchases", error);
  res.status(500).json({ error: "Unable to load purchases", code: "PURCHASE_HISTORY_FAILED" });
}

async function canonicalUserId(firebaseUid: string): Promise<string> {
  const rows = await sqlClient`
    SELECT u.id::text AS id
    FROM identity.auth_identities ai
    JOIN identity.users u
      ON u.id = ai.user_id
     AND u.deleted_at IS NULL
     AND u.status = 'active'::user_status
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE ai.provider = 'firebase'
      AND ai.provider_subject = ${firebaseUid}
    LIMIT 1
  `;
  if (!rows[0]) {
    throw new PurchaseHistoryError(
      "STUDENT_IDENTITY_REQUIRED",
      "Complete your ExamTree student profile before viewing purchase history",
      409,
    );
  }
  return String(rows[0].id);
}

router.get("/commerce/purchases", authenticate, async (req, res) => {
  try {
    const userId = await canonicalUserId(req.user!.id);

    const [orders, items, entitlements] = await Promise.all([
      sqlClient`
        SELECT
          o.id::text AS id,
          o.order_number::text AS "orderNumber",
          o.status,
          o.currency,
          o.subtotal_minor::float8 AS "subtotalMinor",
          o.discount_minor::float8 AS "discountMinor",
          o.tax_minor::float8 AS "taxMinor",
          o.total_minor::float8 AS "totalMinor",
          o.created_at AS "createdAt",
          o.updated_at AS "updatedAt",
          o.paid_at AS "paidAt",
          o.cancelled_at AS "cancelledAt",
          o.expires_at AS "expiresAt",
          (
            SELECT pa.status
            FROM commerce.payment_attempts pa
            WHERE pa.order_id = o.id
            ORDER BY pa.created_at DESC, pa.id DESC
            LIMIT 1
          ) AS "paymentStatus",
          COALESCE((
            SELECT SUM(r.amount_minor)
            FROM commerce.refunds r
            JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id
            WHERE pa.order_id = o.id
              AND r.status = 'processed'
          ), 0)::float8 AS "refundedMinor"
        FROM commerce.orders o
        WHERE o.user_id = ${userId}::uuid
        ORDER BY o.created_at DESC, o.id DESC
        LIMIT 200
      `,
      sqlClient`
        SELECT
          oi.id::text AS id,
          oi.order_id::text AS "orderId",
          oi.product_id::text AS "productId",
          oi.product_version_id::text AS "productVersionId",
          oi.quantity,
          oi.unit_price_minor::float8 AS "unitPriceMinor",
          oi.discount_minor::float8 AS "discountMinor",
          oi.tax_minor::float8 AS "taxMinor",
          oi.total_minor::float8 AS "totalMinor",
          oi.created_at AS "createdAt",
          p.code AS "productCode",
          pv.title,
          pv.description,
          pv.validity_days AS "validityDays",
          (SELECT COUNT(*)::int FROM commerce.product_version_tests pvt WHERE pvt.product_version_id = oi.product_version_id) AS "testCount"
        FROM commerce.order_items oi
        JOIN commerce.orders o ON o.id = oi.order_id
        JOIN commerce.products p ON p.id = oi.product_id
        JOIN commerce.product_versions pv ON pv.id = oi.product_version_id
        WHERE o.user_id = ${userId}::uuid
        ORDER BY oi.created_at DESC, oi.id DESC
        LIMIT 500
      `,
      sqlClient`
        SELECT
          e.id::text AS id,
          e.order_item_id::text AS "orderItemId",
          oi.order_id::text AS "orderId",
          e.product_version_id::text AS "productVersionId",
          p.id::text AS "productId",
          p.code AS "productCode",
          pv.title AS "productTitle",
          pv.description AS "productDescription",
          e.status,
          CASE
            WHEN e.revoked_at IS NOT NULL OR e.status = 'revoked' THEN 'revoked'
            WHEN e.starts_at > now() THEN 'scheduled'
            WHEN e.ends_at IS NOT NULL AND e.ends_at <= now() THEN 'expired'
            WHEN e.status = 'active' THEN 'active'
            ELSE e.status::text
          END AS "accessStatus",
          e.starts_at AS "startsAt",
          e.ends_at AS "endsAt",
          e.revoked_at AS "revokedAt",
          e.revoke_reason AS "revokeReason",
          e.grant_source AS "grantSource",
          e.created_at AS "createdAt",
          (SELECT COUNT(*)::int FROM commerce.entitlement_tests et WHERE et.entitlement_id = e.id) AS "testCount"
        FROM commerce.entitlements e
        JOIN commerce.product_versions pv ON pv.id = e.product_version_id
        JOIN commerce.products p ON p.id = pv.product_id
        LEFT JOIN commerce.order_items oi ON oi.id = e.order_item_id
        WHERE e.user_id = ${userId}::uuid
        ORDER BY e.created_at DESC, e.id DESC
        LIMIT 500
      `,
    ]);

    res.json({
      orders,
      items,
      entitlements,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
