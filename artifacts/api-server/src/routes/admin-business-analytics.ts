import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);
router.use(requireAdminPermission("commerce.orders.read"));

const allowedWindows = new Set([7, 30, 90, 365]);
function windowDays(value: unknown): number {
  const parsed = Number(value);
  return allowedWindows.has(parsed) ? parsed : 30;
}
function currencyCode(value: unknown): string {
  const currency = String(value ?? "INR").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(currency) ? currency : "INR";
}
function safeCsvCell(value: unknown): string {
  const text = String(value ?? "");
  const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
}

router.get("/business", async (req, res) => {
  const days = windowDays(req.query.window);
  const currency = currencyCode(req.query.currency);
  try {
    const [summaryRows, comparisonRows, daily, products, coupons, qualityRows, currencies] = await Promise.all([
      sqlClient`
        WITH bounds AS (SELECT now() - make_interval(days => ${days}) AS start_at),
        paid AS (
          SELECT o.id, o.user_id, o.total_minor, o.discount_minor
          FROM commerce.orders o, bounds b
          WHERE o.paid_at >= b.start_at AND o.currency=${currency}
            AND o.status IN ('paid','partially_refunded','refunded')
        ), refunds AS (
          SELECT COALESCE(SUM(r.amount_minor),0)::float8 AS amount
          FROM commerce.refunds r
          JOIN commerce.payment_attempts pa ON pa.id = r.payment_attempt_id
          JOIN commerce.orders o ON o.id = pa.order_id, bounds b
          WHERE r.status = 'processed' AND r.processed_at >= b.start_at AND o.currency=${currency}
        ), attempts AS (
          SELECT COUNT(*)::int AS count
          FROM commerce.orders o, bounds b
          WHERE o.created_at >= b.start_at AND o.currency=${currency}
        )
        SELECT COUNT(*)::int AS "paidOrders", COUNT(DISTINCT user_id)::int AS "payingStudents",
          COALESCE(SUM(total_minor),0)::float8 AS "grossRevenueMinor", (SELECT amount FROM refunds)::float8 AS "refundsMinor",
          (COALESCE(SUM(total_minor),0)-(SELECT amount FROM refunds))::float8 AS "netRevenueMinor",
          COALESCE(SUM(discount_minor),0)::float8 AS "discountMinor",
          CASE WHEN COUNT(*)=0 THEN 0 ELSE ROUND(AVG(total_minor))::float8 END AS "averageOrderValueMinor",
          (SELECT count FROM attempts)::int AS "createdOrders",
          CASE WHEN (SELECT count FROM attempts)=0 THEN 0 ELSE ROUND((COUNT(*)::numeric/(SELECT count FROM attempts))*10000)::int END AS "conversionBasisPoints",
          ${currency}::text AS currency
        FROM paid
      `,
      sqlClient`
        WITH bounds AS (SELECT now()-make_interval(days => ${days}) AS current_start, now()-make_interval(days => ${days * 2}) AS previous_start),
        bucketed AS (
          SELECT CASE WHEN o.paid_at>=b.current_start THEN 'current' ELSE 'previous' END AS bucket,
            COUNT(*)::int AS orders, COALESCE(SUM(o.total_minor),0)::float8 AS gross
          FROM commerce.orders o, bounds b
          WHERE o.paid_at>=b.previous_start AND o.paid_at<now() AND o.currency=${currency}
            AND o.status IN ('paid','partially_refunded','refunded') GROUP BY 1
        )
        SELECT COALESCE(MAX(orders) FILTER (WHERE bucket='current'),0)::int AS "currentOrders",
          COALESCE(MAX(orders) FILTER (WHERE bucket='previous'),0)::int AS "previousOrders",
          COALESCE(MAX(gross) FILTER (WHERE bucket='current'),0)::float8 AS "currentGrossMinor",
          COALESCE(MAX(gross) FILTER (WHERE bucket='previous'),0)::float8 AS "previousGrossMinor" FROM bucketed
      `,
      sqlClient`
        WITH days AS (SELECT generate_series((current_date-(${days - 1})::int),current_date,interval '1 day')::date AS day),
        paid AS (
          SELECT o.paid_at::date AS day, COUNT(*)::int AS orders, COALESCE(SUM(o.total_minor),0)::float8 AS gross
          FROM commerce.orders o WHERE o.paid_at>=current_date-(${days - 1})::int AND o.currency=${currency}
            AND o.status IN ('paid','partially_refunded','refunded') GROUP BY 1
        ), refunds AS (
          SELECT r.processed_at::date AS day, COALESCE(SUM(r.amount_minor),0)::float8 AS refunded
          FROM commerce.refunds r JOIN commerce.payment_attempts pa ON pa.id=r.payment_attempt_id JOIN commerce.orders o ON o.id=pa.order_id
          WHERE r.status='processed' AND r.processed_at>=current_date-(${days - 1})::int AND o.currency=${currency} GROUP BY 1
        )
        SELECT d.day, COALESCE(p.orders,0)::int AS orders, COALESCE(p.gross,0)::float8 AS "grossMinor",
          COALESCE(r.refunded,0)::float8 AS "refundsMinor", (COALESCE(p.gross,0)-COALESCE(r.refunded,0))::float8 AS "netMinor"
        FROM days d LEFT JOIN paid p ON p.day=d.day LEFT JOIN refunds r ON r.day=d.day ORDER BY d.day
      `,
      sqlClient`
        WITH paid_items AS (
          SELECT oi.product_id, COUNT(DISTINCT o.id)::int AS orders,
            COUNT(DISTINCT o.user_id)::int AS buyers,
            COALESCE(SUM(oi.total_minor),0)::float8 AS "revenueMinor"
          FROM commerce.order_items oi
          JOIN commerce.orders o ON o.id=oi.order_id
          WHERE o.paid_at>=now()-make_interval(days => ${days})
            AND o.currency=${currency}
            AND o.status IN ('paid','partially_refunded','refunded')
          GROUP BY oi.product_id
        ), active_grants AS (
          SELECT oi.product_id, COUNT(DISTINCT e.id)::int AS "activeEntitlements"
          FROM commerce.entitlements e
          JOIN commerce.order_items oi ON oi.id=e.order_item_id
          WHERE e.status='active' AND e.starts_at<=now() AND (e.ends_at IS NULL OR e.ends_at>now())
          GROUP BY oi.product_id
        )
        SELECT p.id::text AS "productId", p.code, pv.title,
          COALESCE(pi.orders,0)::int AS orders,
          COALESCE(pi.buyers,0)::int AS buyers,
          COALESCE(pi."revenueMinor",0)::float8 AS "revenueMinor",
          COALESCE(ag."activeEntitlements",0)::int AS "activeEntitlements"
        FROM commerce.products p
        JOIN commerce.product_versions pv ON pv.product_id=p.id AND pv.version_number=p.current_version_number
        LEFT JOIN paid_items pi ON pi.product_id=p.id
        LEFT JOIN active_grants ag ON ag.product_id=p.id
        WHERE pv.currency=${currency}
        ORDER BY "revenueMinor" DESC,p.code LIMIT 100
      `,
      sqlClient`
        SELECT c.id::text AS "couponId", c.code, c.discount_type AS "discountType",
          COUNT(DISTINCT cr.id) FILTER (WHERE o.id IS NOT NULL)::int AS redemptions,
          COUNT(DISTINCT o.user_id)::int AS students,
          COALESCE(SUM(o.discount_minor),0)::float8 AS "discountMinor", COALESCE(SUM(o.total_minor),0)::float8 AS "revenueMinor"
        FROM commerce.coupons c
        LEFT JOIN commerce.coupon_redemptions cr ON cr.coupon_id=c.id AND cr.redeemed_at>=now()-make_interval(days => ${days})
        LEFT JOIN commerce.orders o ON o.id=cr.order_id AND o.currency=${currency}
        WHERE c.currency=${currency}
        GROUP BY c.id ORDER BY redemptions DESC,c.code LIMIT 100
      `,
      sqlClient`
        SELECT
          COUNT(*) FILTER (WHERE o.status='paid' AND NOT EXISTS (SELECT 1 FROM commerce.payment_attempts pa WHERE pa.order_id=o.id AND pa.status IN ('captured','partially_refunded','refunded')))::int AS "paidWithoutCapturedPayment",
          COUNT(*) FILTER (WHERE o.status IN ('refunded','partially_refunded') AND NOT EXISTS (SELECT 1 FROM commerce.refunds r JOIN commerce.payment_attempts pa ON pa.id=r.payment_attempt_id WHERE pa.order_id=o.id AND r.status='processed'))::int AS "refundStatusWithoutProcessedRefund",
          COUNT(*) FILTER (WHERE o.status='paid' AND NOT EXISTS (SELECT 1 FROM commerce.order_items oi JOIN commerce.entitlements e ON e.order_item_id=oi.id WHERE oi.order_id=o.id))::int AS "paidWithoutEntitlement"
        FROM commerce.orders o WHERE o.currency=${currency}
      `,
      sqlClient`SELECT DISTINCT currency FROM commerce.orders ORDER BY currency`,
    ]);

    res.json({ windowDays: days, generatedAt: new Date().toISOString(), summary: summaryRows[0], comparison: comparisonRows[0], daily, products, coupons, quality: qualityRows[0], availableCurrencies: currencies.map((row) => String(row.currency)), scope: { studentRanks: false, piiExport: false, readOnly: true, currencyConversion: false } });
  } catch (error) {
    console.error("Unable to load business analytics", error);
    res.status(500).json({ error: "Unable to load business analytics", code: "BUSINESS_ANALYTICS_FAILED" });
  }
});

router.get("/business.csv", async (req, res) => {
  const days = windowDays(req.query.window);
  const currency = currencyCode(req.query.currency);
  try {
    const rows = await sqlClient`
      SELECT o.order_number::text AS "orderNumber", o.paid_at AS "paidAt", o.status, o.currency,
        o.subtotal_minor::float8 AS "subtotalMinor", o.discount_minor::float8 AS "discountMinor", o.total_minor::float8 AS "grossMinor",
        COALESCE((SELECT SUM(r.amount_minor) FROM commerce.refunds r JOIN commerce.payment_attempts pa ON pa.id=r.payment_attempt_id WHERE pa.order_id=o.id AND r.status='processed'),0)::float8 AS "refundsMinor"
      FROM commerce.orders o WHERE o.paid_at>=now()-make_interval(days => ${days}) AND o.currency=${currency}
        AND o.status IN ('paid','partially_refunded','refunded') ORDER BY o.paid_at DESC,o.order_number DESC LIMIT 10000
    `;
    const header = ["order_number","paid_at","status","currency","subtotal_minor","discount_minor","gross_minor","refunds_minor","net_minor"];
    const lines = [header.join(","), ...rows.map((row) => [row.orderNumber,row.paidAt ? new Date(String(row.paidAt)).toISOString() : "",row.status,row.currency,row.subtotalMinor,row.discountMinor,row.grossMinor,row.refundsMinor,Number(row.grossMinor)-Number(row.refundsMinor)].map(safeCsvCell).join(","))];
    res.setHeader("Content-Type","text/csv; charset=utf-8");
    res.setHeader("Content-Disposition",`attachment; filename="business-analytics-${currency}-${days}d.csv"`);
    res.send(`\uFEFF${lines.join("\n")}`);
  } catch (error) {
    console.error("Unable to export business analytics", error);
    res.status(500).json({ error: "Unable to export business analytics", code: "BUSINESS_ANALYTICS_EXPORT_FAILED" });
  }
});

export default router;
