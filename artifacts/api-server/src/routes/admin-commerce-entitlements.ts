import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class EntitlementAdminError extends Error {
  constructor(public code: string, message: string, public statusCode = 400, public details?: unknown) { super(message); }
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof EntitlementAdminError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "42P01" || code === "3F000") {
    res.status(503).json({ error: "The canonical Commerce migration has not been applied", code: "COMMERCE_SCHEMA_REQUIRED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "ADMIN_COMMERCE_ENTITLEMENT_FAILED" });
}

function text(value: unknown, max = 1000, required = false): string {
  const result = typeof value === "string" ? value.trim().slice(0, max) : "";
  if (required && !result) throw new EntitlementAdminError("ENTITLEMENT_FIELD_REQUIRED", "A required entitlement field is missing");
  return result;
}

async function audit(actorUserId: string, actionKey: string, entitlementId: string, summary: string, metadata: unknown, client = sqlClient) {
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key, action_key,
      entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid, null,
      ${actionKey}, 'commerce_entitlement', ${entitlementId}::uuid, ${summary}, ${client.json(metadata)}
    )
  `;
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("commerce.entitlements.read"), async (_req, res) => {
  try {
    const [students, products] = await Promise.all([
      sqlClient`
        SELECT u.id::text AS id, COALESCE(u.display_name, u.email, u.id::text) AS name, u.email
        FROM identity.users u
        JOIN identity.student_profiles sp ON sp.user_id = u.id
        WHERE u.deleted_at IS NULL AND u.status = 'active'::user_status
        ORDER BY COALESCE(u.display_name, u.email, u.id::text)
        LIMIT 5000
      `,
      sqlClient`
        SELECT p.id::text AS id, pv.id::text AS "productVersionId", p.code, pv.title,
          pv.validity_days AS "validityDays",
          (SELECT COUNT(*)::int FROM commerce.product_version_tests pvt WHERE pvt.product_version_id = pv.id) AS "testCount"
        FROM commerce.products p
        JOIN commerce.product_versions pv ON pv.product_id = p.id AND pv.version_number = p.current_version_number
        WHERE p.status IN ('active','draft')
        ORDER BY p.updated_at DESC
      `,
    ]);
    res.json({ students, products, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error, "Unable to load entitlement catalog"); }
});

router.get("/", requireAdminPermission("commerce.entitlements.read"), async (req, res) => {
  const search = text(req.query.search, 160).toLowerCase();
  const status = text(req.query.status, 32);
  try {
    const rows = await sqlClient`
      SELECT e.id::text AS id, e.user_id::text AS "userId", e.product_version_id::text AS "productVersionId",
        e.status, e.starts_at AS "startsAt", e.ends_at AS "endsAt", e.revoked_at AS "revokedAt",
        e.revoke_reason AS "revokeReason", e.grant_source AS "grantSource", e.created_at AS "createdAt",
        COALESCE(u.display_name, u.email, u.id::text) AS "studentName", u.email AS "studentEmail",
        p.code AS "productCode", pv.title AS "productTitle",
        (SELECT COUNT(*)::int FROM commerce.entitlement_tests et WHERE et.entitlement_id = e.id) AS "testCount"
      FROM commerce.entitlements e
      JOIN identity.users u ON u.id = e.user_id
      JOIN commerce.product_versions pv ON pv.id = e.product_version_id
      JOIN commerce.products p ON p.id = pv.product_id
      WHERE (${status} = '' OR e.status = ${status})
        AND (${search} = '' OR lower(COALESCE(u.display_name, '')) LIKE ${`%${search}%`}
          OR lower(COALESCE(u.email, '')) LIKE ${`%${search}%`}
          OR lower(p.code) LIKE ${`%${search}%`} OR lower(pv.title) LIKE ${`%${search}%`})
      ORDER BY e.created_at DESC LIMIT 1000
    `;
    res.json({ entitlements: rows, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error, "Unable to load entitlements"); }
});

router.post("/", requireAdminPermission("commerce.entitlements.manage"), async (req, res) => {
  const userId = text(req.body?.userId, 64, true);
  const productVersionId = text(req.body?.productVersionId, 64, true);
  const reason = text(req.body?.reason, 1000, true);
  const endsAt = req.body?.endsAt ? new Date(String(req.body.endsAt)).toISOString() : null;
  if (!uuid.test(userId) || !uuid.test(productVersionId)) return void res.status(400).json({ error: "Invalid entitlement identity", code: "INVALID_ENTITLEMENT_REFERENCE" });
  try {
    const actorUserId = req.adminSession!.user.id;
    const result = await sqlClient.begin(async (tx) => {
      const catalog = await tx`
        SELECT pv.id::text AS id, pv.validity_days AS "validityDays"
        FROM commerce.product_versions pv
        JOIN commerce.products p ON p.id = pv.product_id
        JOIN identity.users u ON u.id = ${userId}::uuid AND u.deleted_at IS NULL
        WHERE pv.id = ${productVersionId}::uuid
        LIMIT 1
      `;
      if (!catalog[0]) throw new EntitlementAdminError("ENTITLEMENT_REFERENCE_NOT_FOUND", "Student or product version not found", 404);
      const entitlementId = randomUUID();
      const idempotencyKey = `manual:${userId}:${productVersionId}:${randomUUID()}`;
      const resolvedEndsAt = endsAt ?? (catalog[0].validityDays == null ? null : new Date(Date.now() + Number(catalog[0].validityDays) * 86400000).toISOString());
      await tx`
        INSERT INTO commerce.entitlements (
          id, user_id, product_version_id, status, starts_at, ends_at, grant_source,
          idempotency_key, granted_by, created_at, updated_at
        ) VALUES (
          ${entitlementId}::uuid, ${userId}::uuid, ${productVersionId}::uuid, 'active', now(),
          ${resolvedEndsAt}::timestamptz, 'manual', ${idempotencyKey}, ${actorUserId}::uuid, now(), now()
        )
      `;
      await tx`
        INSERT INTO commerce.entitlement_tests (entitlement_id, test_id)
        SELECT ${entitlementId}::uuid, pvt.test_id
        FROM commerce.product_version_tests pvt
        WHERE pvt.product_version_id = ${productVersionId}::uuid
      `;
      await audit(actorUserId, "commerce.entitlement.manual_granted", entitlementId, "Granted manual commerce entitlement", { userId, productVersionId, endsAt: resolvedEndsAt, reason }, tx as typeof sqlClient);
      return { entitlementId };
    });
    res.status(201).json(result);
  } catch (error) { sendError(res, error, "Unable to grant entitlement"); }
});

router.post("/:entitlementId/revoke", requireAdminPermission("commerce.entitlements.manage"), async (req, res) => {
  const entitlementId = text(req.params.entitlementId, 64);
  const reason = text(req.body?.reason, 1000, true);
  if (!uuid.test(entitlementId)) return void res.status(400).json({ error: "Invalid entitlement identifier", code: "INVALID_ENTITLEMENT_ID" });
  try {
    const actorUserId = req.adminSession!.user.id;
    const updated = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        UPDATE commerce.entitlements
        SET status = 'revoked', revoked_at = COALESCE(revoked_at, now()), revoke_reason = ${reason}, updated_at = now()
        WHERE id = ${entitlementId}::uuid AND status <> 'revoked'
        RETURNING id::text AS id, user_id::text AS "userId", product_version_id::text AS "productVersionId"
      `;
      if (!rows[0]) throw new EntitlementAdminError("ENTITLEMENT_NOT_ACTIVE", "Entitlement was not found or is already revoked", 409);
      await audit(actorUserId, "commerce.entitlement.revoked", entitlementId, "Revoked commerce entitlement", { ...rows[0], reason }, tx as typeof sqlClient);
      return rows[0];
    });
    res.json(updated);
  } catch (error) { sendError(res, error, "Unable to revoke entitlement"); }
});

export default router;
