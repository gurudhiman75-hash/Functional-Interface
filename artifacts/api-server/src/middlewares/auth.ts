import { randomUUID } from "node:crypto";
import { type Request, type Response, type NextFunction } from "express";
import { auth } from "../lib/firebase-admin";
import type { AdminSession } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        displayName?: string;
        emailVerified?: boolean;
      };
      adminSession?: AdminSession;
    }
  }
}

async function reconcileVerifiedFirebaseStudentIdentity(req: Request): Promise<boolean> {
  const firebaseUid = req.user?.id?.trim() ?? "";
  const email = req.user?.email?.trim().toLowerCase() ?? "";
  if (!firebaseUid || !email || req.user?.emailVerified !== true) return false;

  return sqlClient.begin(async (sql) => {
    const currentRows = await sql`
      SELECT ai.user_id::text AS "userId"
      FROM identity.auth_identities ai
      WHERE ai.provider = 'firebase'
        AND ai.provider_subject = ${firebaseUid}
      LIMIT 1
      FOR UPDATE
    `;
    if (currentRows[0]) return false;

    const candidates = await sql`
      SELECT u.id::text AS id
      FROM identity.users u
      JOIN identity.student_profiles sp ON sp.user_id = u.id
      WHERE lower(u.email) = ${email}
        AND u.deleted_at IS NULL
        AND u.status = 'active'::user_status
      ORDER BY u.created_at ASC
      LIMIT 2
      FOR UPDATE OF u
    `;
    if (candidates.length !== 1) return false;

    const canonicalUserId = String(candidates[0]!.id);
    const identityRows = await sql`
      SELECT id::text AS id, provider_subject AS "providerSubject"
      FROM identity.auth_identities
      WHERE provider = 'firebase'
        AND user_id = ${canonicalUserId}::uuid
      LIMIT 1
      FOR UPDATE
    `;

    const previousSubject = identityRows[0]?.providerSubject
      ? String(identityRows[0].providerSubject)
      : null;

    if (identityRows[0]) {
      await sql`
        UPDATE identity.auth_identities
        SET provider_subject = ${firebaseUid},
            updated_at = now()
        WHERE id = ${String(identityRows[0].id)}::uuid
      `;
    } else {
      await sql`
        INSERT INTO identity.auth_identities (
          user_id,
          provider,
          provider_subject,
          created_at,
          updated_at
        ) VALUES (
          ${canonicalUserId}::uuid,
          'firebase',
          ${firebaseUid},
          now(),
          now()
        )
      `;
    }

    await sql`
      UPDATE identity.users
      SET last_login_at = now(),
          updated_at = now()
      WHERE id = ${canonicalUserId}::uuid
    `;

    await sql`
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
      ) VALUES (
        ${randomUUID()}::uuid,
        'user'::audit_actor_type,
        ${canonicalUserId}::uuid,
        'student.identity.firebase_uid_reconciled',
        'student_profile',
        ${canonicalUserId}::uuid,
        'Verified Firebase email matched one active canonical student while the token UID had no canonical mapping',
        'Reconciled stale Firebase UID for active student login',
        ${JSON.stringify({
          provider: 'firebase',
          verifiedEmail: email,
          previousProviderSubject: previousSubject,
          newProviderSubject: firebaseUid,
          source: 'auth-middleware',
        })}::jsonb
      )
    `;

    return true;
  }).catch((error) => {
    console.error("Unable to reconcile verified Firebase student identity", error);
    return false;
  });
}

async function enforceCanonicalStudentStatus(req: Request, res: Response): Promise<boolean> {
  const firebaseUid = req.user?.id;
  if (!firebaseUid) return true;

  const rows = await sqlClient`
    SELECT u.status::text AS status, u.deleted_at AS "deletedAt",
      EXISTS (
        SELECT 1
        FROM platform.audit_events recovery
        WHERE recovery.entity_id = u.id
          AND recovery.action_key = 'student.account.firebase_identity_relinked'
          AND recovery.occurred_at > now() - interval '30 days'
          AND NOT EXISTS (
            SELECT 1
            FROM platform.audit_events later_lifecycle
            WHERE later_lifecycle.entity_id = u.id
              AND later_lifecycle.occurred_at > recovery.occurred_at
              AND later_lifecycle.action_key LIKE 'student.account.%'
              AND later_lifecycle.action_key <> 'student.account.firebase_identity_relinked'
          )
      ) AS "recoveryRecentlyCompleted"
    FROM identity.auth_identities ai
    JOIN identity.users u ON u.id = ai.user_id
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE ai.provider = 'firebase'
      AND ai.provider_subject = ${firebaseUid}
    LIMIT 1
  `;

  const account = rows[0];
  // First-login Firebase users do not have a canonical row yet. Allow the
  // provisioning endpoint to create it. Admin identities do not have a student
  // profile and therefore are also unaffected by this student-only guard.
  if (!account) return true;

  const status = String(account.status ?? "");
  if (account.deletedAt || status === "disabled") {
    res.status(403).json({
      error: "This ExamTree account is unavailable.",
      code: "ACCOUNT_UNAVAILABLE",
    });
    return false;
  }
  if (status === "suspended") {
    if (account.recoveryRecentlyCompleted) {
      res.status(403).json({
        error: "Your account recovery was completed successfully. For your protection, the account remains suspended until an administrator completes the final reactivation review.",
        code: "ACCOUNT_RECOVERY_COMPLETED",
      });
      return false;
    }
    res.status(403).json({
      error: "This ExamTree account has been suspended.",
      code: "ACCOUNT_SUSPENDED",
    });
    return false;
  }
  return true;
}

function isRevokedTokenError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = "code" in error ? String((error as { code?: unknown }).code ?? "") : "";
  return code === "auth/id-token-revoked" || code === "auth/user-disabled";
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Mounted collaboration and hardening routers may share one request. Once a
  // trusted upstream invocation has verified the Firebase token, reuse that
  // server-populated identity, but still enforce the latest canonical status.
  if (req.user?.id) {
    try {
      await reconcileVerifiedFirebaseStudentIdentity(req);
      if (await enforceCanonicalStudentStatus(req, res)) next();
    } catch (error) {
      console.error("Unable to enforce canonical account status", error);
      res.status(503).json({ error: "Unable to verify account status", code: "ACCOUNT_STATUS_UNAVAILABLE" });
    }
    return;
  }

  if (!auth) {
    return void res.status(500).json({ error: "Authentication not configured" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return void res.status(401).json({ error: "No token provided", code: "AUTH_TOKEN_REQUIRED" });
  }

  const token = authHeader.substring(7);
  try {
    // checkRevoked=true makes admin session revocation effective immediately
    // instead of allowing an already-issued Firebase ID token for up to an hour.
    const decodedToken = await auth.verifyIdToken(token, true);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      displayName: typeof decodedToken.name === "string" ? decodedToken.name : undefined,
      emailVerified: decodedToken.email_verified,
    };
  } catch (error) {
    if (isRevokedTokenError(error)) {
      return void res.status(401).json({
        error: "Your ExamTree session was ended by an administrator.",
        code: "SESSION_REVOKED",
      });
    }
    return void res.status(401).json({ error: "Invalid token", code: "AUTH_TOKEN_INVALID" });
  }

  try {
    await reconcileVerifiedFirebaseStudentIdentity(req);
    if (await enforceCanonicalStudentStatus(req, res)) next();
  } catch (error) {
    console.error("Unable to enforce canonical account status", error);
    res.status(503).json({ error: "Unable to verify account status", code: "ACCOUNT_STATUS_UNAVAILABLE" });
  }
};
