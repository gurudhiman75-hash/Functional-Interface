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

async function enforceCanonicalStudentStatus(req: Request, res: Response): Promise<boolean> {
  const firebaseUid = req.user?.id;
  if (!firebaseUid) return true;

  const rows = await sqlClient`
    SELECT u.status::text AS status, u.deleted_at AS "deletedAt"
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
    if (await enforceCanonicalStudentStatus(req, res)) next();
  } catch (error) {
    console.error("Unable to enforce canonical account status", error);
    res.status(503).json({ error: "Unable to verify account status", code: "ACCOUNT_STATUS_UNAVAILABLE" });
  }
};