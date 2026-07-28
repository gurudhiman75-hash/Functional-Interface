import { Router, type Response } from "express";

import { CommerceEntitlementError, requireTestAccess } from "../lib/canonical-commerce-entitlements";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function canonicalTestId(identifier: string): Promise<string | null> {
  const isUuid = uuid.test(identifier);
  const rows = await sqlClient`
    SELECT id::text AS id
    FROM assessment.tests
    WHERE deleted_at IS NULL
      AND ((${isUuid}::boolean AND id = ${isUuid ? identifier : null}::uuid) OR lower(public_code) = lower(${identifier}))
    LIMIT 1
  `;
  return rows[0] ? String(rows[0].id) : null;
}

function sendAccessError(res: Response, error: unknown): void {
  if (error instanceof CommerceEntitlementError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error("Unable to enforce test entitlement", error);
  res.status(503).json({ error: "Unable to verify test access", code: "TEST_ACCESS_UNAVAILABLE" });
}

async function guard(identifier: string, firebaseUid: string) {
  const testId = await canonicalTestId(identifier);
  if (!testId) return null;
  return requireTestAccess({ firebaseUid, testId });
}

router.get("/commerce/access/tests/:id", authenticate, async (req, res) => {
  const identifier = String(req.params.id ?? "").trim();
  if (!identifier) return void res.status(400).json({ error: "Test identifier required", code: "TEST_ID_REQUIRED" });
  try {
    const access = await guard(identifier, req.user!.id);
    if (!access) return void res.status(404).json({ error: "Test not found", code: "TEST_NOT_FOUND" });
    res.json({ allowed: true, paidAccessRequired: access.paidAccessRequired, entitlementId: access.entitlementId, reason: access.reason });
  } catch (error) {
    if (error instanceof CommerceEntitlementError && error.code === "TEST_ENTITLEMENT_REQUIRED") {
      return void res.status(200).json({ allowed: false, paidAccessRequired: true, entitlementId: null, reason: "entitlement_required" });
    }
    sendAccessError(res, error);
  }
});

router.post("/attempt-sessions", authenticate, async (req, res, next) => {
  const identifier = typeof req.body?.testId === "string" ? req.body.testId.trim() : "";
  if (!identifier) return next();
  try {
    const access = await guard(identifier, req.user!.id);
    if (!access) return next();
    next();
  } catch (error) { sendAccessError(res, error); }
});

router.get("/tests/:id", authenticate, async (req, res, next) => {
  const identifier = String(req.params.id ?? "").trim();
  if (!identifier) return next();
  try {
    const access = await guard(identifier, req.user!.id);
    if (!access) return next();
    next();
  } catch (error) { sendAccessError(res, error); }
});

export default router;
