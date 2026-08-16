import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";

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

async function recordUnresolvedStudentIdentity(req: Request, testIdentifier: string): Promise<void> {
  const firebaseUid = req.user?.id ?? "";
  const email = String(req.user?.email ?? "").trim().toLowerCase();
  if (!firebaseUid || !email) return;

  try {
    const rows = await sqlClient`
      SELECT u.id::text AS id
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE lower(u.email) = ${email}
        AND u.deleted_at IS NULL
      LIMIT 1
    `;
    const canonicalUserId = rows[0]?.id ? String(rows[0].id) : "";
    if (!canonicalUserId) return;

    const metadata = JSON.stringify({
      provider: "firebase",
      providerSubject: firebaseUid,
      tokenEmail: email,
      emailVerified: req.user?.emailVerified === true,
      testIdentifier,
      source: "mobile-attempt-access-guard",
    });

    await sqlClient`
      INSERT INTO platform.audit_events (
        id,
        actor_type,
        actor_user_id,
        action_key,
        entity_type,
        entity_id,
        reason,
        summary,
        metadata
      )
      SELECT
        ${randomUUID()}::uuid,
        'user'::audit_actor_type,
        NULL,
        'student.identity.unresolved',
        'student_profile',
        ${canonicalUserId}::uuid,
        'Authenticated Firebase identity did not resolve to the canonical student profile',
        'Recorded unresolved Firebase identity during mobile attempt start',
        ${metadata}::jsonb
      WHERE NOT EXISTS (
        SELECT 1
        FROM platform.audit_events existing
        WHERE existing.action_key = 'student.identity.unresolved'
          AND existing.entity_id = ${canonicalUserId}::uuid
          AND existing.occurred_at > now() - interval '10 minutes'
          AND existing.metadata ->> 'providerSubject' = ${firebaseUid}
      )
    `;
  } catch (error) {
    console.error("Unable to record unresolved student identity diagnostic", error);
  }
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
  } catch (error) {
    if (error instanceof CommerceEntitlementError && error.code === "STUDENT_IDENTITY_REQUIRED") {
      await recordUnresolvedStudentIdentity(req, identifier);
    }
    sendAccessError(res, error);
  }
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