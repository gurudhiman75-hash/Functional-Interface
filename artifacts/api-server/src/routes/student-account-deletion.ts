import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";

import {
  ACCOUNT_DELETION_CONFIRMATION,
  accountDeletionTombstoneEmail,
} from "../domain/student-account-deletion";
import { sqlClient } from "../lib/db";
import { auth } from "../lib/firebase-admin";
import { authenticate } from "../middlewares/auth";
import { requireRecentFirebaseAuthentication } from "../middlewares/require-recent-auth";

const router: IRouter = Router();

type FirebaseAccountLifecycle = {
  deleteUser(uid: string): Promise<void>;
  revokeRefreshTokens?(uid: string): Promise<void>;
};

type DeletionOperation = {
  canonicalUserId: string | null;
  attemptsDeleted: number;
  entitlementsDeleted: number;
  sessionsDeleted: number;
  rolesDeleted: number;
  retainedOrders: number;
  retainedCouponRedemptions: number;
};

class AccountDeletionNotAllowedError extends Error {
  readonly code = "ACCOUNT_DELETION_NOT_ALLOWED";
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isFirebaseUserNotFound(error: unknown): boolean {
  if (!error || typeof error !== "object" || !("code" in error)) return false;
  return String((error as { code?: unknown }).code ?? "") === "auth/user-not-found";
}

async function eraseCanonicalStudent(firebaseUid: string): Promise<DeletionOperation> {
  return sqlClient.begin(async (tx) => {
    const rows = await tx`
      SELECT
        u.id::text AS id,
        u.deleted_at AS "deletedAt",
        EXISTS (
          SELECT 1 FROM identity.student_profiles sp WHERE sp.user_id = u.id
        ) AS "hasStudentProfile",
        EXISTS (
          SELECT 1 FROM identity.admin_profiles ap WHERE ap.user_id = u.id
        ) AS "hasAdminProfile"
      FROM identity.auth_identities ai
      JOIN identity.users u ON u.id = ai.user_id
      WHERE ai.provider = 'firebase'
        AND ai.provider_subject = ${firebaseUid}
      LIMIT 1
      FOR UPDATE OF u
    `;

    const account = rows[0];
    if (!account) {
      return {
        canonicalUserId: null,
        attemptsDeleted: 0,
        entitlementsDeleted: 0,
        sessionsDeleted: 0,
        rolesDeleted: 0,
        retainedOrders: 0,
        retainedCouponRedemptions: 0,
      };
    }

    const userId = String(account.id);
    if (account.deletedAt) {
      return {
        canonicalUserId: userId,
        attemptsDeleted: 0,
        entitlementsDeleted: 0,
        sessionsDeleted: 0,
        rolesDeleted: 0,
        retainedOrders: 0,
        retainedCouponRedemptions: 0,
      };
    }
    if (!account.hasStudentProfile || account.hasAdminProfile) {
      throw new AccountDeletionNotAllowedError(
        "Self-service deletion is available only for learner accounts.",
      );
    }

    const retainedCommerce = await tx`
      SELECT
        (SELECT COUNT(*)::int FROM commerce.orders o WHERE o.user_id = ${userId}::uuid) AS "orders",
        (SELECT COUNT(*)::int FROM commerce.coupon_redemptions cr WHERE cr.user_id = ${userId}::uuid) AS "couponRedemptions"
    `;

    // Attempt responses cascade from learning.attempts. The two restrictive
    // attempt children must be removed first so learner history is actually
    // erased rather than merely hidden from the API.
    await tx`
      DELETE FROM learning.rank_snapshots
      WHERE attempt_id IN (
        SELECT id FROM learning.attempts WHERE user_id = ${userId}::uuid
      )
    `;
    await tx`
      DELETE FROM learning.score_revisions
      WHERE attempt_id IN (
        SELECT id FROM learning.attempts WHERE user_id = ${userId}::uuid
      )
    `;
    const attempts = await tx`
      DELETE FROM learning.attempts
      WHERE user_id = ${userId}::uuid
      RETURNING id
    `;

    const entitlements = await tx`
      DELETE FROM commerce.entitlements
      WHERE user_id = ${userId}::uuid
      RETURNING id
    `;
    const sessions = await tx`
      DELETE FROM identity.sessions
      WHERE user_id = ${userId}::uuid
      RETURNING id
    `;
    const roles = await tx`
      DELETE FROM identity.user_roles
      WHERE user_id = ${userId}::uuid
      RETURNING id
    `;

    // These ownership fields are optional and are not part of learner history,
    // but clearing them prevents a deleted learner identity from remaining an
    // owner if historical/test data ever created such rows.
    await tx`
      UPDATE content.generation_recipes
      SET owner_user_id = NULL, updated_at = now()
      WHERE owner_user_id = ${userId}::uuid
    `;
    await tx`
      UPDATE operations.jobs
      SET owner_user_id = NULL, updated_at = now()
      WHERE owner_user_id = ${userId}::uuid
    `;

    await tx`
      DELETE FROM identity.student_profiles
      WHERE user_id = ${userId}::uuid
    `;

    // Keep the audit timeline/action keys and timestamps needed for security,
    // while erasing user-provided/internal text and metadata that can contain
    // email addresses or other personal information.
    await tx`
      UPDATE platform.audit_events
      SET reason = 'Account data erased',
          summary = 'Retained pseudonymous audit record after account deletion',
          metadata = ${tx.json({ privacyErased: true })}
      WHERE actor_user_id = ${userId}::uuid
         OR entity_id = ${userId}::uuid
    `;

    const tombstoneEmail = accountDeletionTombstoneEmail(userId);
    await tx`
      UPDATE identity.users
      SET email = ${tombstoneEmail},
          phone = NULL,
          display_name = 'Deleted user',
          status = 'disabled'::user_status,
          last_login_at = NULL,
          deleted_at = now(),
          updated_at = now()
      WHERE id = ${userId}::uuid
    `;

    const retainedOrders = Number(retainedCommerce[0]?.orders ?? 0);
    const retainedCouponRedemptions = Number(retainedCommerce[0]?.couponRedemptions ?? 0);
    await tx`
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
        ${userId}::uuid,
        'student.account.privacy_erased',
        'student_profile',
        ${userId}::uuid,
        'User requested account deletion',
        'Learner-owned data erased and canonical identity anonymized',
        ${tx.json({
          attemptsDeleted: attempts.length,
          entitlementsDeleted: entitlements.length,
          sessionsDeleted: sessions.length,
          rolesDeleted: roles.length,
          retainedOrders,
          retainedCouponRedemptions,
          retentionBasis: 'financial-and-security-records',
        })}
      )
    `;

    // Keep the Firebase auth-identity mapping until Firebase deletion succeeds.
    // If Firebase is temporarily unavailable, auth middleware will still map the
    // UID to this disabled/deleted tombstone and prevent accidental reprovisioning.
    return {
      canonicalUserId: userId,
      attemptsDeleted: attempts.length,
      entitlementsDeleted: entitlements.length,
      sessionsDeleted: sessions.length,
      rolesDeleted: roles.length,
      retainedOrders,
      retainedCouponRedemptions,
    };
  });
}

async function removeFirebaseIdentity(firebaseUid: string): Promise<boolean> {
  const lifecycle = auth as Partial<FirebaseAccountLifecycle>;
  if (typeof lifecycle.deleteUser !== "function") return false;

  if (typeof lifecycle.revokeRefreshTokens === "function") {
    try {
      await lifecycle.revokeRefreshTokens(firebaseUid);
    } catch (error) {
      console.error("Unable to revoke Firebase refresh tokens during account deletion", error);
    }
  }

  try {
    await lifecycle.deleteUser(firebaseUid);
    return true;
  } catch (error) {
    if (isFirebaseUserNotFound(error)) return true;
    console.error("Unable to delete Firebase identity during account deletion", error);
    return false;
  }
}

async function finishCanonicalIdentityCleanup(
  canonicalUserId: string,
  firebaseUid: string,
): Promise<boolean> {
  try {
    await sqlClient.begin(async (tx) => {
      await tx`
        DELETE FROM identity.auth_identities
        WHERE user_id = ${canonicalUserId}::uuid
          AND provider = 'firebase'
          AND provider_subject = ${firebaseUid}
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id,
          actor_type,
          action_key,
          entity_type,
          entity_id,
          reason,
          summary,
          metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'system'::audit_actor_type,
          'student.account.firebase_identity_deleted',
          'student_profile',
          ${canonicalUserId}::uuid,
          'Completed account deletion identity cleanup',
          'Firebase identity deleted and canonical provider link removed',
          ${tx.json({ privacyErased: true })}
        )
      `;
    });
    return true;
  } catch (error) {
    console.error("Unable to finish canonical identity cleanup after Firebase deletion", error);
    return false;
  }
}

router.delete(
  "/me",
  authenticate,
  requireRecentFirebaseAuthentication,
  async (req, res) => {
    if (text(req.body?.confirmation) !== ACCOUNT_DELETION_CONFIRMATION) {
      res.status(400).json({
        error: `Type ${ACCOUNT_DELETION_CONFIRMATION} to confirm account deletion.`,
        code: "DELETION_CONFIRMATION_REQUIRED",
      });
      return;
    }

    const firebaseUid = req.user?.id?.trim() ?? "";
    if (!firebaseUid) {
      res.status(401).json({ error: "Sign in again.", code: "REAUTH_REQUIRED" });
      return;
    }

    let operation: DeletionOperation;
    try {
      operation = await eraseCanonicalStudent(firebaseUid);
    } catch (error) {
      if (error instanceof AccountDeletionNotAllowedError) {
        res.status(403).json({ error: error.message, code: error.code });
        return;
      }
      console.error("Unable to erase canonical learner account", error);
      res.status(503).json({
        error: "Account deletion could not be completed. Your account is unchanged; please try again.",
        code: "ACCOUNT_DELETION_FAILED",
      });
      return;
    }

    const firebaseDeleted = await removeFirebaseIdentity(firebaseUid);
    if (!firebaseDeleted) {
      // Canonical data is already erased and the retained provider mapping points
      // at a disabled tombstone, preventing reprovisioning while cleanup is retried.
      res.status(202).json({
        status: "pending",
        code: "DELETION_PENDING",
        message: "Your ExamTree data has been erased. Identity cleanup is still completing.",
      });
      return;
    }

    if (operation.canonicalUserId) {
      const cleanupComplete = await finishCanonicalIdentityCleanup(
        operation.canonicalUserId,
        firebaseUid,
      );
      if (!cleanupComplete) {
        res.status(202).json({
          status: "pending",
          code: "DELETION_PENDING",
          message: "Your account has been deleted. Final server cleanup is still completing.",
        });
        return;
      }
    }

    res.status(200).json({
      status: "deleted",
      attemptsDeleted: operation.attemptsDeleted,
      entitlementsDeleted: operation.entitlementsDeleted,
      retainedFinancialRecords:
        operation.retainedOrders + operation.retainedCouponRedemptions > 0,
    });
  },
);

export default router;
