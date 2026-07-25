import { sqlClient } from "./db";

type SqlExecutor = typeof sqlClient;

export class CommerceEntitlementError extends Error {
  constructor(public readonly code: string, message: string, public readonly statusCode = 403, public readonly details?: unknown) {
    super(message);
  }
}

export async function resolveCanonicalStudentUserId(firebaseUid: string, client: SqlExecutor = sqlClient): Promise<string | null> {
  const rows = await client`
    SELECT u.id::text AS id
    FROM identity.auth_identities ai
    JOIN identity.users u ON u.id = ai.user_id AND u.deleted_at IS NULL AND u.status = 'active'::user_status
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE ai.provider = 'firebase' AND ai.provider_subject = ${firebaseUid}
    LIMIT 1
  `;
  return rows[0] ? String(rows[0].id) : null;
}

export async function evaluateTestAccess(input: {
  userId: string;
  testId: string;
  client?: SqlExecutor;
}): Promise<{ allowed: boolean; paidAccessRequired: boolean; entitlementId: string | null; reason: string }> {
  const client = input.client ?? sqlClient;
  const paidRows = await client`
    SELECT EXISTS (
      SELECT 1
      FROM commerce.products p
      JOIN commerce.product_versions pv ON pv.product_id = p.id AND pv.version_number = p.current_version_number
      JOIN commerce.product_version_tests pvt ON pvt.product_version_id = pv.id
      WHERE p.status = 'active'
        AND pv.sale_price_minor > 0
        AND pvt.test_id = ${input.testId}::uuid
    ) AS "paidAccessRequired"
  `;
  const paidAccessRequired = Boolean(paidRows[0]?.paidAccessRequired);
  if (!paidAccessRequired) return { allowed: true, paidAccessRequired: false, entitlementId: null, reason: "free_or_unlisted" };

  const rows = await client`
    SELECT e.id::text AS id
    FROM commerce.entitlements e
    JOIN commerce.entitlement_tests et ON et.entitlement_id = e.id
    WHERE e.user_id = ${input.userId}::uuid
      AND et.test_id = ${input.testId}::uuid
      AND e.status = 'active'
      AND e.starts_at <= now()
      AND (e.ends_at IS NULL OR e.ends_at > now())
    ORDER BY e.ends_at DESC NULLS FIRST, e.created_at DESC
    LIMIT 1
  `;
  if (rows[0]) return { allowed: true, paidAccessRequired: true, entitlementId: String(rows[0].id), reason: "active_entitlement" };
  return { allowed: false, paidAccessRequired: true, entitlementId: null, reason: "entitlement_required" };
}

export async function requireTestAccess(input: { firebaseUid: string; testId: string; client?: SqlExecutor }) {
  const client = input.client ?? sqlClient;
  const userId = await resolveCanonicalStudentUserId(input.firebaseUid, client);
  if (!userId) throw new CommerceEntitlementError("STUDENT_IDENTITY_REQUIRED", "Complete your ExamTree student profile before starting this test", 409);
  const access = await evaluateTestAccess({ userId, testId: input.testId, client });
  if (!access.allowed) throw new CommerceEntitlementError("TEST_ENTITLEMENT_REQUIRED", "Purchase or receive access to this test before starting it", 403, { testId: input.testId });
  return { userId, ...access };
}
