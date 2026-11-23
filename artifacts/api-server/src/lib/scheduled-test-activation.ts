import { randomUUID } from "node:crypto";

import { cacheDel } from "./cache";
import { sqlClient } from "./db";

/**
 * Scheduled-test activation.
 *
 * A test scheduled with approve-schedule/schedule has a publication row with
 * scheduled_at set and published_at NULL. When that time arrives this switches
 * the test live on exactly that scheduled version. Idempotent and safe to run
 * from any instance (row locks + status re-check).
 */
export async function activateDueScheduledTests(client: typeof sqlClient = sqlClient): Promise<string[]> {
  const candidates = await client`
    SELECT DISTINCT t.id::text AS id
    FROM assessment.tests t
    JOIN assessment.test_publications p ON p.test_id = t.id
    WHERE t.status = 'scheduled'::test_status
      AND t.deleted_at IS NULL
      AND p.published_at IS NULL
      AND p.scheduled_at IS NOT NULL
      AND p.scheduled_at <= now()
    LIMIT 50
  `;
  const activated: string[] = [];
  for (const candidate of candidates) {
    const testId = String(candidate.id);
    const done = await client.begin(async (tx) => {
      const tests = await tx`
        SELECT public_code AS "publicCode", status::text AS status
        FROM assessment.tests WHERE id = ${testId}::uuid FOR UPDATE SKIP LOCKED
      `;
      if (!tests[0] || tests[0].status !== "scheduled") return false;
      const pubs = await tx`
        SELECT id::text AS id, test_version_id::text AS "testVersionId", scheduled_at AS "scheduledAt"
        FROM assessment.test_publications
        WHERE test_id = ${testId}::uuid AND published_at IS NULL
          AND scheduled_at IS NOT NULL AND scheduled_at <= now()
        ORDER BY publication_number DESC
        LIMIT 1
        FOR UPDATE
      `;
      const pub = pubs[0];
      if (!pub) return false;
      await tx`
        UPDATE assessment.test_publications
        SET published_at = now(),
            settings_snapshot = COALESCE(settings_snapshot, '{}'::jsonb) || '{"status":"live","activatedBy":"scheduler"}'::jsonb
        WHERE id = ${String(pub.id)}::uuid
      `;
      await tx`
        UPDATE assessment.tests
        SET status = 'live'::test_status,
            published_version_id = ${String(pub.testVersionId)}::uuid,
            updated_at = now()
        WHERE id = ${testId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, action_key, entity_type, entity_id, entity_version_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'system'::audit_actor_type, 'assessment.test.published', 'test',
          ${testId}::uuid, ${String(pub.testVersionId)}::uuid,
          ${`${String(tests[0].publicCode)} went live on schedule`},
          ${tx.json({ previousStatus: "scheduled", status: "live", scheduledAt: pub.scheduledAt, publicationId: pub.id, activatedBy: "scheduler" })}
        )
      `;
      return true;
    });
    if (done) activated.push(testId);
  }
  if (activated.length) {
    await cacheDel("tests:list:canonical-mobile-v2").catch(() => undefined);
  }
  return activated;
}

const MIN_INTERVAL_MS = 60_000;
let lastRunAt = 0;
let running: Promise<void> | null = null;

/** Throttled (once a minute per instance); never throws. */
export async function maybeActivateDueScheduledTests(
  now = Date.now(),
  run: () => Promise<string[]> = () => activateDueScheduledTests(),
): Promise<void> {
  if (process.env.EXAMTREE_SCHEDULED_ACTIVATION_DISABLED === "true") return;
  if (running) return running;
  if (now - lastRunAt < MIN_INTERVAL_MS) return;
  lastRunAt = now;
  running = run()
    .then((ids) => { if (ids.length) console.info(`[scheduler] ${ids.length} scheduled test(s) went live`, ids); })
    .catch((error) => { lastRunAt = 0; console.error("[scheduler] scheduled test activation failed", error); })
    .finally(() => { running = null; });
  return running;
}
