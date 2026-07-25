import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";

type SqlExecutor = typeof sqlClient;

export class CommercePaymentError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 409,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export async function finalizeCapturedPayment(input: {
  client: SqlExecutor;
  provider: string;
  providerOrderId: string;
  providerPaymentId: string;
  amountMinor: number;
  currency: string;
  capturedAt?: string | null;
}): Promise<{ orderId: string; entitlementIds: string[]; alreadyFinalized: boolean }> {
  const { client } = input;
  const rows = await client`
    SELECT
      pa.id::text AS "paymentAttemptId",
      pa.order_id::text AS "orderId",
      pa.status AS "paymentStatus",
      pa.amount_minor::float8 AS "paymentAmountMinor",
      pa.currency AS "paymentCurrency",
      o.status AS "orderStatus",
      o.total_minor::float8 AS "orderTotalMinor",
      o.currency AS "orderCurrency",
      o.user_id::text AS "userId"
    FROM commerce.payment_attempts pa
    JOIN commerce.orders o ON o.id = pa.order_id
    WHERE pa.provider = ${input.provider}
      AND pa.provider_order_id = ${input.providerOrderId}
    LIMIT 1
    FOR UPDATE OF pa, o
  `;
  const row = rows[0];
  if (!row) throw new CommercePaymentError("PAYMENT_ATTEMPT_NOT_FOUND", "No canonical payment attempt matches this provider order", 404);

  const expectedAmount = Number(row.orderTotalMinor);
  const expectedCurrency = String(row.orderCurrency).trim().toUpperCase();
  if (input.amountMinor !== expectedAmount || input.amountMinor !== Number(row.paymentAmountMinor)) {
    throw new CommercePaymentError("PAYMENT_AMOUNT_MISMATCH", "Captured amount does not match the frozen order total", 409, { expectedAmount, receivedAmount: input.amountMinor });
  }
  if (input.currency.toUpperCase() !== expectedCurrency || String(row.paymentCurrency).trim().toUpperCase() !== expectedCurrency) {
    throw new CommercePaymentError("PAYMENT_CURRENCY_MISMATCH", "Captured currency does not match the frozen order currency", 409, { expectedCurrency, receivedCurrency: input.currency });
  }

  const existingEntitlements = await client`
    SELECT e.id::text AS id
    FROM commerce.entitlements e
    JOIN commerce.order_items oi ON oi.id = e.order_item_id
    WHERE oi.order_id = ${String(row.orderId)}::uuid
    ORDER BY e.created_at
  `;
  if (String(row.orderStatus) === "paid" && String(row.paymentStatus) === "captured") {
    return { orderId: String(row.orderId), entitlementIds: existingEntitlements.map((entry) => String(entry.id)), alreadyFinalized: true };
  }

  await client`
    UPDATE commerce.payment_attempts
    SET status = 'captured', provider_payment_id = ${input.providerPaymentId}, captured_at = ${input.capturedAt ?? new Date().toISOString()}::timestamptz, updated_at = now(), failure_code = null, failure_message = null
    WHERE id = ${String(row.paymentAttemptId)}::uuid
  `;
  await client`
    UPDATE commerce.orders
    SET status = 'paid', paid_at = COALESCE(paid_at, ${input.capturedAt ?? new Date().toISOString()}::timestamptz), updated_at = now()
    WHERE id = ${String(row.orderId)}::uuid
  `;

  const items = await client`
    SELECT oi.id::text AS "orderItemId", oi.product_version_id::text AS "productVersionId", pv.validity_days AS "validityDays"
    FROM commerce.order_items oi
    JOIN commerce.product_versions pv ON pv.id = oi.product_version_id
    WHERE oi.order_id = ${String(row.orderId)}::uuid
    ORDER BY oi.created_at, oi.id
  `;
  const entitlementIds: string[] = [];
  for (const item of items) {
    const entitlementId = randomUUID();
    const idempotencyKey = `paid-order-item:${String(item.orderItemId)}`;
    const inserted = await client`
      INSERT INTO commerce.entitlements (
        id, user_id, order_item_id, product_version_id, status, starts_at, ends_at,
        grant_source, idempotency_key, created_at, updated_at
      ) VALUES (
        ${entitlementId}::uuid, ${String(row.userId)}::uuid, ${String(item.orderItemId)}::uuid,
        ${String(item.productVersionId)}::uuid, 'active', now(),
        CASE WHEN ${item.validityDays == null ? null : Number(item.validityDays)}::integer IS NULL THEN NULL
             ELSE now() + make_interval(days => ${item.validityDays == null ? 0 : Number(item.validityDays)}::integer) END,
        'paid_order', ${idempotencyKey}, now(), now()
      )
      ON CONFLICT (user_id, idempotency_key) DO UPDATE SET updated_at = commerce.entitlements.updated_at
      RETURNING id::text AS id
    `;
    const resolvedId = String(inserted[0]?.id ?? entitlementId);
    entitlementIds.push(resolvedId);
    await client`
      INSERT INTO commerce.entitlement_tests (entitlement_id, test_id)
      SELECT ${resolvedId}::uuid, pvt.test_id
      FROM commerce.product_version_tests pvt
      WHERE pvt.product_version_id = ${String(item.productVersionId)}::uuid
      ON CONFLICT (entitlement_id, test_id) DO NOTHING
    `;
  }

  return { orderId: String(row.orderId), entitlementIds, alreadyFinalized: false };
}
