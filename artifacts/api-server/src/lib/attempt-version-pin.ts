import { sqlClient } from "./db";

/**
 * Attempt version pinning.
 *
 * A student who started a test keeps the exact test version of the publication
 * their attempt belongs to, even if an admin publishes a newer version while
 * they are mid-attempt. Submission already scores against the attempt's
 * publication version; this makes the runner serve the same version.
 *
 * Returns the pinned test_version_id, or null when the caller has no
 * unfinished attempt (then the current published version applies).
 */
export async function pinnedAttemptVersionId(
  firebaseUid: string | undefined | null,
  testId: string,
  client: typeof sqlClient = sqlClient,
): Promise<string | null> {
  if (!firebaseUid || !testId) return null;
  const rows = await client`
    SELECT publication.test_version_id::text AS "testVersionId"
    FROM learning.attempts attempt
    JOIN assessment.test_publications publication ON publication.id = attempt.test_publication_id
    JOIN identity.auth_identities identity
      ON identity.user_id = attempt.user_id AND identity.provider = 'firebase'
    WHERE identity.provider_subject = ${firebaseUid}
      AND publication.test_id = ${testId}::uuid
      AND attempt.status = 'in_progress'
      AND attempt.abandoned_at IS NULL
    ORDER BY attempt.started_at DESC
    LIMIT 1
  `;
  const value = rows[0]?.testVersionId;
  return typeof value === "string" ? value : null;
}

/** Version-level fields a runner shows (title, timer, marks, settings). */
export async function loadTestVersionMeta(testVersionId: string, client: typeof sqlClient = sqlClient) {
  const rows = await client`
    SELECT title, description, duration_seconds AS "durationSeconds",
      total_marks::float8 AS "totalMarks", settings
    FROM assessment.test_versions
    WHERE id = ${testVersionId}::uuid
  `;
  return (rows[0] as Record<string, unknown> | undefined) ?? null;
}
