import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class CommerceProductError extends Error {
  constructor(public code: string, message: string, public statusCode = 400, public details?: unknown) {
    super(message);
  }
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof CommerceProductError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const code = (error as { code?: string })?.code;
  if (code === "42P01" || code === "3F000") {
    res.status(503).json({ error: "The canonical Commerce migration has not been applied", code: "COMMERCE_SCHEMA_REQUIRED" });
    return;
  }
  if (code === "23505") {
    res.status(409).json({ error: "Package code, version, test membership or order already exists", code: "COMMERCE_PRODUCT_CONFLICT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "ADMIN_COMMERCE_PRODUCT_FAILED" });
}

function cleanText(value: unknown, max: number, required = false): string {
  const result = typeof value === "string" ? value.trim().slice(0, max) : "";
  if (required && !result) throw new CommerceProductError("COMMERCE_FIELD_REQUIRED", "A required package field is missing");
  return result;
}

function normalizeInput(body: unknown) {
  const value = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const code = cleanText(value.code, 120, true).toUpperCase().replace(/[^A-Z0-9_-]+/g, "-");
  const title = cleanText(value.title, 255, true);
  const description = cleanText(value.description, 10000);
  const currency = cleanText(value.currency, 3, true).toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new CommerceProductError("INVALID_CURRENCY", "Currency must be a three-letter ISO code");
  const listPriceMinor = Math.floor(Number(value.listPriceMinor));
  const salePriceMinor = Math.floor(Number(value.salePriceMinor));
  if (!Number.isSafeInteger(listPriceMinor) || listPriceMinor < 0) throw new CommerceProductError("INVALID_LIST_PRICE", "List price must be a non-negative integer in minor currency units");
  if (!Number.isSafeInteger(salePriceMinor) || salePriceMinor < 0 || salePriceMinor > listPriceMinor) throw new CommerceProductError("INVALID_SALE_PRICE", "Sale price must be between zero and the list price");
  const validityDays = value.validityDays == null || value.validityDays === "" ? null : Math.floor(Number(value.validityDays));
  if (validityDays != null && (!Number.isSafeInteger(validityDays) || validityDays <= 0)) throw new CommerceProductError("INVALID_VALIDITY", "Validity days must be a positive integer");
  const saleStartAt = value.saleStartAt ? new Date(String(value.saleStartAt)).toISOString() : null;
  const saleEndAt = value.saleEndAt ? new Date(String(value.saleEndAt)).toISOString() : null;
  if (saleStartAt && saleEndAt && saleEndAt <= saleStartAt) throw new CommerceProductError("INVALID_SALE_WINDOW", "Sale end must be after sale start");
  const changeReason = cleanText(value.changeReason, 1000, true);
  const testIds = Array.from(new Set(Array.isArray(value.testIds) ? value.testIds.map(String) : []));
  if (testIds.some((id) => !uuid.test(id))) throw new CommerceProductError("INVALID_TEST_ID", "Every package test identifier must be a UUID");
  if (testIds.length === 0) throw new CommerceProductError("PACKAGE_TEST_REQUIRED", "A package must include at least one canonical test");
  return { code, title, description, currency, listPriceMinor, salePriceMinor, validityDays, saleStartAt, saleEndAt, changeReason, testIds };
}

async function assertTests(client: SqlExecutor, testIds: string[]) {
  const rows = await client`
    SELECT id::text AS id, status::text AS status, deleted_at AS "deletedAt"
    FROM assessment.tests
    WHERE id = ANY(${testIds}::uuid[])
  `;
  const found = new Set(rows.filter((row) => !row.deletedAt).map((row) => String(row.id)));
  const missing = testIds.filter((id) => !found.has(id));
  if (missing.length) throw new CommerceProductError("PACKAGE_TEST_MISSING", `${missing.length} selected test(s) do not exist or are archived`, 409, { testIds: missing });
}

async function insertVersion(client: SqlExecutor, productId: string, versionNumber: number, actorUserId: string, input: ReturnType<typeof normalizeInput>) {
  const versionId = randomUUID();
  await client`
    INSERT INTO commerce.product_versions (
      id, product_id, version_number, title, description, currency, list_price_minor,
      sale_price_minor, validity_days, sale_start_at, sale_end_at, configuration,
      change_reason, created_by, created_at
    ) VALUES (
      ${versionId}::uuid, ${productId}::uuid, ${versionNumber}, ${input.title}, ${input.description},
      ${input.currency}, ${input.listPriceMinor}, ${input.salePriceMinor}, ${input.validityDays},
      ${input.saleStartAt}::timestamptz, ${input.saleEndAt}::timestamptz, '{}'::jsonb,
      ${input.changeReason}, ${actorUserId}::uuid, now()
    )
  `;
  for (let index = 0; index < input.testIds.length; index += 1) {
    await client`
      INSERT INTO commerce.product_version_tests (id, product_version_id, test_id, sort_order, created_at)
      VALUES (${randomUUID()}::uuid, ${versionId}::uuid, ${input.testIds[index]}::uuid, ${index + 1}, now())
    `;
  }
  return versionId;
}

async function audit(client: SqlExecutor, actorUserId: string, actionKey: string, productId: string, summary: string, metadata: unknown) {
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, effective_role_key, action_key,
      entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid, null,
      ${actionKey}, 'commerce_product', ${productId}::uuid, ${summary}, ${client.json(metadata)}
    )
  `;
}

async function loadDetail(productId: string, client: SqlExecutor = sqlClient) {
  const products = await client`
    SELECT p.id::text AS id, p.code, p.status, p.current_version_number AS "currentVersionNumber",
      p.created_by::text AS "createdBy", p.created_at AS "createdAt", p.updated_at AS "updatedAt", p.archived_at AS "archivedAt"
    FROM commerce.products p WHERE p.id = ${productId}::uuid LIMIT 1
  `;
  const product = products[0];
  if (!product) return null;
  const versions = await client`
    SELECT v.id::text AS id, v.version_number AS "versionNumber", v.title, v.description, v.currency,
      v.list_price_minor::float8 AS "listPriceMinor", v.sale_price_minor::float8 AS "salePriceMinor",
      v.validity_days AS "validityDays", v.sale_start_at AS "saleStartAt", v.sale_end_at AS "saleEndAt",
      v.change_reason AS "changeReason", v.created_by::text AS "createdBy", v.created_at AS "createdAt",
      (SELECT COUNT(*)::int FROM commerce.product_version_tests pvt WHERE pvt.product_version_id = v.id) AS "testCount"
    FROM commerce.product_versions v WHERE v.product_id = ${productId}::uuid ORDER BY v.version_number DESC
  `;
  const currentVersion = versions.find((row) => Number(row.versionNumber) === Number(product.currentVersionNumber)) ?? null;
  const tests = currentVersion ? await client`
    SELECT pvt.test_id::text AS "testId", pvt.sort_order AS "sortOrder", t.public_code AS "publicCode",
      t.status::text AS status, COALESCE(tv.title, t.public_code) AS title
    FROM commerce.product_version_tests pvt
    JOIN assessment.tests t ON t.id = pvt.test_id
    LEFT JOIN assessment.test_versions tv ON tv.id = COALESCE(t.published_version_id, t.current_draft_version_id)
    WHERE pvt.product_version_id = ${String(currentVersion.id)}::uuid ORDER BY pvt.sort_order
  ` : [];
  const blockers = [
    ...(tests.length === 0 ? ["Package has no tests"] : []),
    ...tests.filter((test) => !["live", "scheduled", "completed"].includes(String(test.status))).map((test) => `${String(test.publicCode)} is ${String(test.status)}`),
  ];
  return { product, versions, currentVersion, tests, readiness: { ready: blockers.length === 0, blockers }, generatedAt: new Date().toISOString() };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("commerce.products.read"), async (_req, res) => {
  try {
    const tests = await sqlClient`
      SELECT t.id::text AS id, t.public_code AS "publicCode", t.status::text AS status,
        COALESCE(tv.title, t.public_code) AS title, t.updated_at AS "updatedAt"
      FROM assessment.tests t
      LEFT JOIN assessment.test_versions tv ON tv.id = COALESCE(t.published_version_id, t.current_draft_version_id)
      WHERE t.deleted_at IS NULL ORDER BY t.updated_at DESC LIMIT 5000
    `;
    res.json({ tests, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error, "Unable to load package catalog"); }
});

router.get("/", requireAdminPermission("commerce.products.read"), async (req, res) => {
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase().slice(0, 160) : "";
  try {
    const rows = await sqlClient`
      SELECT p.id::text AS id, p.code, p.status, p.current_version_number AS "currentVersionNumber",
        p.updated_at AS "updatedAt", v.title, v.currency, v.list_price_minor::float8 AS "listPriceMinor",
        v.sale_price_minor::float8 AS "salePriceMinor", v.validity_days AS "validityDays",
        (SELECT COUNT(*)::int FROM commerce.product_version_tests pvt WHERE pvt.product_version_id = v.id) AS "testCount"
      FROM commerce.products p
      JOIN commerce.product_versions v ON v.product_id = p.id AND v.version_number = p.current_version_number
      WHERE ${search} = '' OR lower(p.code) LIKE ${`%${search}%`} OR lower(v.title) LIKE ${`%${search}%`}
      ORDER BY p.updated_at DESC LIMIT 500
    `;
    res.json({ products: rows, generatedAt: new Date().toISOString() });
  } catch (error) { sendError(res, error, "Unable to load packages"); }
});

router.get("/:productId", requireAdminPermission("commerce.products.read"), async (req, res) => {
  const productId = String(req.params.productId ?? "");
  if (!uuid.test(productId)) return res.status(400).json({ error: "Invalid package identifier", code: "INVALID_COMMERCE_PRODUCT_ID" });
  try {
    const detail = await loadDetail(productId);
    if (!detail) return res.status(404).json({ error: "Package not found", code: "COMMERCE_PRODUCT_NOT_FOUND" });
    res.json(detail);
  } catch (error) { sendError(res, error, "Unable to load package"); }
});

router.post("/", requireAdminPermission("commerce.products.manage"), async (req, res) => {
  try {
    const actorUserId = req.adminSession!.user.id;
    const input = normalizeInput(req.body);
    const result = await sqlClient.begin(async (tx) => {
      await assertTests(tx as SqlExecutor, input.testIds);
      const productId = randomUUID();
      await tx`
        INSERT INTO commerce.products (id, code, current_version_number, status, created_by, created_at, updated_at)
        VALUES (${productId}::uuid, ${input.code}, 1, 'draft', ${actorUserId}::uuid, now(), now())
      `;
      const versionId = await insertVersion(tx as SqlExecutor, productId, 1, actorUserId, input);
      await audit(tx as SqlExecutor, actorUserId, "commerce.product.created", productId, `Created package ${input.code}`, { versionId, testIds: input.testIds, changeReason: input.changeReason });
      return loadDetail(productId, tx as SqlExecutor);
    });
    res.status(201).json(result);
  } catch (error) { sendError(res, error, "Unable to create package"); }
});

router.post("/:productId/versions", requireAdminPermission("commerce.products.manage"), async (req, res) => {
  const productId = String(req.params.productId ?? "");
  if (!uuid.test(productId)) return res.status(400).json({ error: "Invalid package identifier", code: "INVALID_COMMERCE_PRODUCT_ID" });
  try {
    const actorUserId = req.adminSession!.user.id;
    const input = normalizeInput(req.body);
    const result = await sqlClient.begin(async (tx) => {
      await assertTests(tx as SqlExecutor, input.testIds);
      const rows = await tx`SELECT code, current_version_number AS "currentVersionNumber" FROM commerce.products WHERE id = ${productId}::uuid FOR UPDATE`;
      if (!rows[0]) throw new CommerceProductError("COMMERCE_PRODUCT_NOT_FOUND", "Package not found", 404);
      const versionNumber = Number(rows[0].currentVersionNumber) + 1;
      const versionId = await insertVersion(tx as SqlExecutor, productId, versionNumber, actorUserId, input);
      await tx`UPDATE commerce.products SET current_version_number = ${versionNumber}, updated_at = now() WHERE id = ${productId}::uuid`;
      await audit(tx as SqlExecutor, actorUserId, "commerce.product.version.created", productId, `Created package version ${versionNumber}`, { versionId, versionNumber, testIds: input.testIds, changeReason: input.changeReason });
      return loadDetail(productId, tx as SqlExecutor);
    });
    res.status(201).json(result);
  } catch (error) { sendError(res, error, "Unable to version package"); }
});

router.post("/:productId/status", requireAdminPermission("commerce.products.manage"), async (req, res) => {
  const productId = String(req.params.productId ?? "");
  const status = String(req.body?.status ?? "");
  const reason = cleanText(req.body?.reason, 1000, true);
  if (!uuid.test(productId)) return res.status(400).json({ error: "Invalid package identifier", code: "INVALID_COMMERCE_PRODUCT_ID" });
  if (!["draft", "active", "archived"].includes(status)) return res.status(400).json({ error: "Invalid package status", code: "INVALID_COMMERCE_PRODUCT_STATUS" });
  try {
    const actorUserId = req.adminSession!.user.id;
    const result = await sqlClient.begin(async (tx) => {
      const current = await loadDetail(productId, tx as SqlExecutor);
      if (!current) throw new CommerceProductError("COMMERCE_PRODUCT_NOT_FOUND", "Package not found", 404);
      if (status === "active" && !current.readiness.ready) throw new CommerceProductError("PACKAGE_NOT_READY", "Package cannot be activated until every current-version test is release-ready", 409, current.readiness);
      await tx`UPDATE commerce.products SET status = ${status}, archived_at = ${status === "archived" ? new Date().toISOString() : null}::timestamptz, updated_at = now() WHERE id = ${productId}::uuid`;
      await audit(tx as SqlExecutor, actorUserId, "commerce.product.status.changed", productId, `Changed package status to ${status}`, { previousStatus: current.product.status, status, reason });
      return loadDetail(productId, tx as SqlExecutor);
    });
    res.json(result);
  } catch (error) { sendError(res, error, "Unable to change package status"); }
});

export default router;
