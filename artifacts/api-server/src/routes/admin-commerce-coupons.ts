import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type SqlExecutor = typeof sqlClient;

class CouponError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode = 400, public readonly details?: unknown) {
    super(message);
  }
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof CouponError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "42P01" || code === "3F000") {
    res.status(503).json({ error: "The canonical Commerce migration has not been applied", code: "COMMERCE_SCHEMA_REQUIRED" });
    return;
  }
  if (code === "23505") {
    res.status(409).json({ error: "Coupon code already exists", code: "COUPON_CONFLICT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "ADMIN_COMMERCE_COUPON_FAILED" });
}

function text(value: unknown, max: number, required = false): string {
  const result = typeof value === "string" ? value.trim().slice(0, max) : "";
  if (required && !result) throw new CouponError("COUPON_FIELD_REQUIRED", "A required coupon field is missing");
  return result;
}

function integer(value: unknown, field: string, nullable = false): number | null {
  if (nullable && (value == null || value === "")) return null;
  const parsed = Math.floor(Number(value));
  if (!Number.isSafeInteger(parsed) || parsed < 0) throw new CouponError("INVALID_COUPON_VALUE", `${field} must be a non-negative integer`);
  return parsed;
}

function normalize(body: unknown) {
  const value = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const code = text(value.code, 80, true).toUpperCase().replace(/[^A-Z0-9_-]+/g, "-");
  const discountType = text(value.discountType, 24, true);
  if (!['fixed', 'percentage'].includes(discountType)) throw new CouponError("INVALID_DISCOUNT_TYPE", "Discount type must be fixed or percentage");
  const discountValue = integer(value.discountValue, "Discount value")!;
  if (discountValue <= 0) throw new CouponError("INVALID_DISCOUNT_VALUE", "Discount value must be greater than zero");
  if (discountType === 'percentage' && discountValue > 10000) throw new CouponError("INVALID_DISCOUNT_VALUE", "Percentage discounts use basis points and cannot exceed 10000");
  const currencyRaw = text(value.currency, 3).toUpperCase();
  const currency = currencyRaw || null;
  if (currency && !/^[A-Z]{3}$/.test(currency)) throw new CouponError("INVALID_CURRENCY", "Currency must be a three-letter ISO code");
  if (discountType === 'fixed' && !currency) throw new CouponError("COUPON_CURRENCY_REQUIRED", "Fixed discounts require a currency");
  const maximumDiscountMinor = integer(value.maximumDiscountMinor, "Maximum discount", true);
  const minimumOrderMinor = integer(value.minimumOrderMinor, "Minimum order") ?? 0;
  const maxRedemptions = integer(value.maxRedemptions, "Maximum redemptions", true);
  const maxRedemptionsPerUser = integer(value.maxRedemptionsPerUser, "Maximum redemptions per user", true);
  if (maxRedemptions === 0 || maxRedemptionsPerUser === 0) throw new CouponError("INVALID_REDEMPTION_LIMIT", "Redemption limits must be positive when supplied");
  const startsAt = value.startsAt ? new Date(String(value.startsAt)).toISOString() : null;
  const endsAt = value.endsAt ? new Date(String(value.endsAt)).toISOString() : null;
  if (startsAt && endsAt && endsAt <= startsAt) throw new CouponError("INVALID_COUPON_WINDOW", "Coupon end must be after coupon start");
  const productIds = Array.from(new Set(Array.isArray(value.productIds) ? value.productIds.map(String) : []));
  if (productIds.some((id) => !uuid.test(id))) throw new CouponError("INVALID_PRODUCT_ID", "Every coupon package identifier must be a UUID");
  return { code, discountType, discountValue, currency, maximumDiscountMinor, minimumOrderMinor, startsAt, endsAt, maxRedemptions, maxRedemptionsPerUser, productIds };
}

async function assertProducts(client: SqlExecutor, productIds: string[]): Promise<void> {
  if (!productIds.length) return;
  const rows = await client`SELECT id::text AS id FROM commerce.products WHERE id = ANY(${productIds}::uuid[])`;
  const found = new Set(rows.map((row) => String(row.id)));
  const missing = productIds.filter((id) => !found.has(id));
  if (missing.length) throw new CouponError("COUPON_PRODUCT_MISSING", `${missing.length} selected package(s) do not exist`, 409, { productIds: missing });
}

async function audit(client: SqlExecutor, actorUserId: string, actionKey: string, couponId: string, summary: string, metadata: unknown): Promise<void> {
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key, action_key,
      entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid, null,
      ${actionKey}, 'commerce_coupon', ${couponId}::uuid, ${summary}, ${client.json(metadata)}
    )
  `;
}

async function loadDetail(couponId: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT c.id::text AS id, c.code, c.status, c.discount_type AS "discountType",
      c.discount_value::float8 AS "discountValue", c.currency,
      c.maximum_discount_minor::float8 AS "maximumDiscountMinor",
      c.minimum_order_minor::float8 AS "minimumOrderMinor", c.starts_at AS "startsAt", c.ends_at AS "endsAt",
      c.max_redemptions AS "maxRedemptions", c.max_redemptions_per_user AS "maxRedemptionsPerUser",
      c.created_at AS "createdAt", c.updated_at AS "updatedAt",
      (SELECT COUNT(*)::int FROM commerce.coupon_redemptions cr JOIN commerce.orders o ON o.id = cr.order_id WHERE cr.coupon_id = c.id AND o.status IN ('paid','partially_refunded','refunded')) AS "paidRedemptions",
      (SELECT COUNT(*)::int FROM commerce.coupon_products cp WHERE cp.coupon_id = c.id) AS "productCount"
    FROM commerce.coupons c WHERE c.id = ${couponId}::uuid LIMIT 1
  `;
  if (!rows[0]) return null;
  const products = await client`
    SELECT p.id::text AS id, p.code, p.status, v.title
    FROM commerce.coupon_products cp
    JOIN commerce.products p ON p.id = cp.product_id
    JOIN commerce.product_versions v ON v.product_id = p.id AND v.version_number = p.current_version_number
    WHERE cp.coupon_id = ${couponId}::uuid ORDER BY v.title, p.code
  `;
  return { coupon: rows[0], products, generatedAt: new Date().toISOString() };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("commerce.coupons.read"), async (_req, res) => {
  try {
    const products = await sqlClient`
      SELECT p.id::text AS id, p.code, p.status, v.title, v.currency,
        v.sale_price_minor::float8 AS "salePriceMinor"
      FROM commerce.products p
      JOIN commerce.product_versions v ON v.product_id = p.id AND v.version_number = p.current_version_number
      ORDER BY p.updated_at DESC LIMIT 1000
    `;
    res.json({ products, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error, "Unable to load coupon catalogue"); }
});

router.get("/", requireAdminPermission("commerce.coupons.read"), async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase().slice(0, 100) : "";
  const status = typeof req.query.status === "string" ? req.query.status.trim() : "";
  try {
    const rows = await sqlClient`
      SELECT c.id::text AS id, c.code, c.status, c.discount_type AS "discountType",
        c.discount_value::float8 AS "discountValue", c.currency,
        c.maximum_discount_minor::float8 AS "maximumDiscountMinor",
        c.minimum_order_minor::float8 AS "minimumOrderMinor", c.starts_at AS "startsAt", c.ends_at AS "endsAt",
        c.max_redemptions AS "maxRedemptions", c.max_redemptions_per_user AS "maxRedemptionsPerUser",
        c.updated_at AS "updatedAt",
        (SELECT COUNT(*)::int FROM commerce.coupon_redemptions cr JOIN commerce.orders o ON o.id = cr.order_id WHERE cr.coupon_id = c.id AND o.status IN ('paid','partially_refunded','refunded')) AS "paidRedemptions",
        (SELECT COUNT(*)::int FROM commerce.coupon_products cp WHERE cp.coupon_id = c.id) AS "productCount"
      FROM commerce.coupons c
      WHERE (${search} = '' OR lower(c.code) LIKE ${`%${search}%`})
        AND (${status} = '' OR c.status = ${status})
      ORDER BY c.updated_at DESC LIMIT 500
    `;
    res.json({ coupons: rows, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error, "Unable to load coupons"); }
});

router.get("/:couponId", requireAdminPermission("commerce.coupons.read"), async (req, res) => {
  const couponId = String(req.params.couponId ?? "");
  if (!uuid.test(couponId)) return void res.status(400).json({ error: "Invalid coupon identifier", code: "INVALID_COUPON_ID" });
  try {
    const detail = await loadDetail(couponId);
    if (!detail) return void res.status(404).json({ error: "Coupon not found", code: "COUPON_NOT_FOUND" });
    res.json(detail);
  } catch (error) { sendError(res, error, "Unable to load coupon"); }
});

router.post("/", requireAdminPermission("commerce.coupons.manage"), async (req, res) => {
  try {
    const actorUserId = req.adminSession!.user.id;
    const input = normalize(req.body);
    const result = await sqlClient.begin(async (tx) => {
      await assertProducts(tx as SqlExecutor, input.productIds);
      const couponId = randomUUID();
      await tx`
        INSERT INTO commerce.coupons (
          id, code, status, discount_type, discount_value, currency, maximum_discount_minor,
          minimum_order_minor, starts_at, ends_at, max_redemptions, max_redemptions_per_user,
          created_by, created_at, updated_at
        ) VALUES (
          ${couponId}::uuid, ${input.code}, 'draft', ${input.discountType}, ${input.discountValue}, ${input.currency},
          ${input.maximumDiscountMinor}, ${input.minimumOrderMinor}, ${input.startsAt}::timestamptz, ${input.endsAt}::timestamptz,
          ${input.maxRedemptions}, ${input.maxRedemptionsPerUser}, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (const productId of input.productIds) {
        await tx`INSERT INTO commerce.coupon_products (coupon_id, product_id) VALUES (${couponId}::uuid, ${productId}::uuid)`;
      }
      await audit(tx as SqlExecutor, actorUserId, "commerce.coupon.created", couponId, `Created coupon ${input.code}`, input);
      return loadDetail(couponId, tx as SqlExecutor);
    });
    res.status(201).json(result);
  } catch (error) { sendError(res, error, "Unable to create coupon"); }
});

router.post("/:couponId/status", requireAdminPermission("commerce.coupons.manage"), async (req, res) => {
  const couponId = String(req.params.couponId ?? "");
  const status = String(req.body?.status ?? "");
  const reason = text(req.body?.reason, 1000, true);
  if (!uuid.test(couponId)) return void res.status(400).json({ error: "Invalid coupon identifier", code: "INVALID_COUPON_ID" });
  if (!['draft','active','paused','expired','archived'].includes(status)) return void res.status(400).json({ error: "Invalid coupon status", code: "INVALID_COUPON_STATUS" });
  try {
    const actorUserId = req.adminSession!.user.id;
    const result = await sqlClient.begin(async (tx) => {
      const rows = await tx`SELECT code, status, starts_at AS "startsAt", ends_at AS "endsAt" FROM commerce.coupons WHERE id = ${couponId}::uuid FOR UPDATE`;
      const current = rows[0];
      if (!current) throw new CouponError("COUPON_NOT_FOUND", "Coupon not found", 404);
      if (status === 'active' && current.endsAt && new Date(String(current.endsAt)).getTime() <= Date.now()) throw new CouponError("COUPON_EXPIRED", "An expired coupon cannot be activated", 409);
      await tx`UPDATE commerce.coupons SET status = ${status}, updated_at = now() WHERE id = ${couponId}::uuid`;
      await audit(tx as SqlExecutor, actorUserId, "commerce.coupon.status.changed", couponId, `Changed coupon status to ${status}`, { previousStatus: current.status, status, reason });
      return loadDetail(couponId, tx as SqlExecutor);
    });
    res.json(result);
  } catch (error) { sendError(res, error, "Unable to change coupon status"); }
});

export default router;
