import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";
import Razorpay from "razorpay";

import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class CheckoutError extends Error {
  constructor(public code: string, message: string, public statusCode = 400, public details?: unknown) { super(message); }
}

function sendError(res: Response, error: unknown): void {
  if (error instanceof CheckoutError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "42P01" || code === "3F000") {
    res.status(503).json({ error: "Commerce is temporarily unavailable", code: "COMMERCE_SCHEMA_REQUIRED" });
    return;
  }
  console.error("Canonical checkout failed", error);
  res.status(500).json({ error: "Unable to create checkout", code: "CHECKOUT_FAILED" });
}

async function canonicalUserId(firebaseUid: string): Promise<string> {
  const rows = await sqlClient`
    SELECT u.id::text AS id
    FROM identity.auth_identities ai
    JOIN identity.users u ON u.id = ai.user_id AND u.deleted_at IS NULL AND u.status = 'active'::user_status
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE ai.provider = 'firebase' AND ai.provider_subject = ${firebaseUid}
    LIMIT 1
  `;
  if (!rows[0]) throw new CheckoutError("STUDENT_IDENTITY_REQUIRED", "Complete your ExamTree student profile before purchasing a package", 409);
  return String(rows[0].id);
}

router.get("/commerce/products", async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT p.id::text AS id, p.code, v.title, v.description, v.currency,
        v.list_price_minor::float8 AS "listPriceMinor", v.sale_price_minor::float8 AS "salePriceMinor",
        v.validity_days AS "validityDays", v.sale_start_at AS "saleStartAt", v.sale_end_at AS "saleEndAt",
        (SELECT COUNT(*)::int FROM commerce.product_version_tests pvt WHERE pvt.product_version_id = v.id) AS "testCount"
      FROM commerce.products p
      JOIN commerce.product_versions v ON v.product_id = p.id AND v.version_number = p.current_version_number
      WHERE p.status = 'active'
        AND (v.sale_start_at IS NULL OR v.sale_start_at <= now())
        AND (v.sale_end_at IS NULL OR v.sale_end_at > now())
      ORDER BY p.updated_at DESC
    `;
    res.json({ products: rows, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error); }
});

router.post("/commerce/orders", authenticate, async (req, res) => {
  const productId = String(req.body?.productId ?? "");
  const idempotencyKey = String(req.body?.idempotencyKey ?? "").trim().slice(0, 160);
  if (!uuid.test(productId)) return void res.status(400).json({ error: "Invalid package identifier", code: "INVALID_PRODUCT_ID" });
  if (idempotencyKey.length < 12) return void res.status(400).json({ error: "A stable checkout idempotency key is required", code: "IDEMPOTENCY_KEY_REQUIRED" });

  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) throw new CheckoutError("PAYMENT_PROVIDER_NOT_CONFIGURED", "Online payments are not configured", 503);
    const userId = await canonicalUserId(req.user!.id);

    const prepared = await sqlClient.begin(async (tx) => {
      await tx`SELECT pg_advisory_xact_lock(hashtext(${`commerce-checkout:${userId}:${idempotencyKey}`}))`;
      const existing = await tx`
        SELECT o.id::text AS "orderId", o.order_number::text AS "orderNumber", o.status,
          o.total_minor::float8 AS "totalMinor", o.currency,
          pa.id::text AS "paymentAttemptId", pa.provider_order_id AS "providerOrderId"
        FROM commerce.orders o
        LEFT JOIN commerce.payment_attempts pa ON pa.order_id = o.id AND pa.provider = 'razorpay'
        WHERE o.user_id = ${userId}::uuid AND o.idempotency_key = ${idempotencyKey}
        ORDER BY pa.created_at DESC NULLS LAST LIMIT 1
      `;
      if (existing[0]) return { ...existing[0], existing: true };

      const products = await tx`
        SELECT p.id::text AS "productId", p.current_version_number AS "versionNumber", v.id::text AS "productVersionId",
          p.code, v.title, v.description, v.currency, v.list_price_minor::float8 AS "listPriceMinor",
          v.sale_price_minor::float8 AS "salePriceMinor", v.validity_days AS "validityDays",
          v.sale_start_at AS "saleStartAt", v.sale_end_at AS "saleEndAt"
        FROM commerce.products p
        JOIN commerce.product_versions v ON v.product_id = p.id AND v.version_number = p.current_version_number
        WHERE p.id = ${productId}::uuid AND p.status = 'active'
        LIMIT 1 FOR SHARE OF p, v
      `;
      const product = products[0];
      if (!product) throw new CheckoutError("PRODUCT_NOT_AVAILABLE", "This package is not available for purchase", 404);
      const now = Date.now();
      if (product.saleStartAt && new Date(String(product.saleStartAt)).getTime() > now) throw new CheckoutError("SALE_NOT_STARTED", "This package sale has not started", 409);
      if (product.saleEndAt && new Date(String(product.saleEndAt)).getTime() <= now) throw new CheckoutError("SALE_ENDED", "This package sale has ended", 409);

      const orderId = randomUUID();
      const orderItemId = randomUUID();
      const paymentAttemptId = randomUUID();
      const totalMinor = Number(product.salePriceMinor);
      const pricingSnapshot = {
        version: 1,
        productId: String(product.productId),
        productVersionId: String(product.productVersionId),
        productCode: String(product.code),
        title: String(product.title),
        currency: String(product.currency).trim(),
        listPriceMinor: Number(product.listPriceMinor),
        salePriceMinor: totalMinor,
        capturedAt: new Date().toISOString(),
      };
      const orders = await tx`
        INSERT INTO commerce.orders (
          id, user_id, status, currency, subtotal_minor, discount_minor, tax_minor, total_minor,
          pricing_snapshot, idempotency_key, expires_at, created_at, updated_at
        ) VALUES (
          ${orderId}::uuid, ${userId}::uuid, 'created', ${String(product.currency).trim()}, ${totalMinor}, 0, 0, ${totalMinor},
          ${tx.json(pricingSnapshot)}, ${idempotencyKey}, now() + interval '30 minutes', now(), now()
        ) RETURNING order_number::text AS "orderNumber"
      `;
      await tx`
        INSERT INTO commerce.order_items (
          id, order_id, product_id, product_version_id, quantity, unit_price_minor,
          discount_minor, tax_minor, total_minor, item_snapshot, created_at
        ) VALUES (
          ${orderItemId}::uuid, ${orderId}::uuid, ${productId}::uuid, ${String(product.productVersionId)}::uuid,
          1, ${totalMinor}, 0, 0, ${totalMinor}, ${tx.json(pricingSnapshot)}, now()
        )
      `;
      await tx`
        INSERT INTO commerce.payment_attempts (
          id, order_id, provider, status, amount_minor, currency, idempotency_key, created_at, updated_at
        ) VALUES (
          ${paymentAttemptId}::uuid, ${orderId}::uuid, 'razorpay', 'created', ${totalMinor},
          ${String(product.currency).trim()}, ${idempotencyKey}, now(), now()
        )
      `;
      return { orderId, orderNumber: String(orders[0].orderNumber), status: "created", totalMinor, currency: String(product.currency).trim(), paymentAttemptId, providerOrderId: null, existing: false };
    });

    if (prepared.providerOrderId) {
      res.json({ orderId: prepared.orderId, orderNumber: prepared.orderNumber, status: prepared.status, amountMinor: prepared.totalMinor, currency: String(prepared.currency).trim(), provider: "razorpay", providerOrderId: prepared.providerOrderId, keyId });
      return;
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const providerOrder = await razorpay.orders.create({
      amount: Number(prepared.totalMinor),
      currency: String(prepared.currency).trim(),
      receipt: `ET-${prepared.orderNumber}`.slice(0, 40),
      notes: { canonicalOrderId: String(prepared.orderId) },
    });
    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE commerce.payment_attempts
        SET provider_order_id = ${providerOrder.id}, status = 'created', updated_at = now()
        WHERE id = ${String(prepared.paymentAttemptId)}::uuid AND provider_order_id IS NULL
      `;
      await tx`
        UPDATE commerce.orders SET status = 'payment_pending', updated_at = now()
        WHERE id = ${String(prepared.orderId)}::uuid AND status = 'created'
      `;
    });
    res.status(prepared.existing ? 200 : 201).json({
      orderId: prepared.orderId,
      orderNumber: prepared.orderNumber,
      status: "payment_pending",
      amountMinor: Number(prepared.totalMinor),
      currency: String(prepared.currency).trim(),
      provider: "razorpay",
      providerOrderId: providerOrder.id,
      keyId,
    });
  } catch (error) { sendError(res, error); }
});

export default router;
