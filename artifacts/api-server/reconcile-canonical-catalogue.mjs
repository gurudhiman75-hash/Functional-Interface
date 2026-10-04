import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.log("[render-build] canonical catalogue reconciliation skipped: DATABASE_URL unavailable");
  process.exit(0);
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

try {
  const legacyCandidates = await sql`
    SELECT
      exam.id::text AS id,
      exam.code,
      exam.name,
      family.code AS "familyCode"
    FROM catalog.exams exam
    JOIN catalog.exam_families family ON family.id=exam.family_id
    WHERE exam.is_active=true
      AND NOT EXISTS (
        SELECT 1
        FROM platform.audit_events event
        WHERE event.entity_type='exam'
          AND event.entity_id=exam.id
          AND event.action_key IN (
            'settings.exam.created',
            'settings.exam.metadata_updated',
            'settings.exam.status_changed'
          )
      )
      AND NOT EXISTS (
        SELECT 1
        FROM catalog.exam_versions version
        JOIN platform.audit_events event
          ON event.entity_type='exam_version'
         AND event.entity_id=version.id
         AND event.action_key IN (
           'settings.exam_version.created',
           'settings.exam_version.activated'
         )
        WHERE version.exam_id=exam.id
      )
      AND NOT EXISTS (
        SELECT 1
        FROM assessment.test_series series
        JOIN catalog.exam_versions version ON version.id=series.exam_version_id
        JOIN assessment.test_series_versions current_version
          ON current_version.series_id=series.id
         AND current_version.version_number=series.current_version_number
        WHERE version.exam_id=exam.id
          AND series.deleted_at IS NULL
          AND COALESCE(NULLIF(current_version.configuration->>'learnerVisibility',''),'live') <> 'hidden'
      )
      AND NOT EXISTS (
        SELECT 1
        FROM catalog.exam_versions version
        JOIN assessment.tests test ON test.exam_version_id=version.id
        WHERE version.exam_id=exam.id
          AND version.is_current=true
          AND test.deleted_at IS NULL
          AND test.status='live'::test_status
      )
    ORDER BY family.code, exam.code
  `;

  if (legacyCandidates.length > 0) {
    const ids = legacyCandidates.map((row) => String(row.id));
    await sql`
      UPDATE catalog.exams
      SET is_active=false,
          updated_at=now()
      WHERE id = ANY(${ids}::uuid[])
    `;
  }

  const retiredFamilies = await sql`
    UPDATE catalog.exam_families family
    SET is_active=false
    WHERE family.is_active=true
      AND NOT EXISTS (
        SELECT 1
        FROM catalog.exams exam
        WHERE exam.family_id=family.id
          AND exam.is_active=true
      )
      AND NOT EXISTS (
        SELECT 1
        FROM platform.audit_events event
        WHERE event.entity_type='exam_family'
          AND event.entity_id=family.id
          AND event.action_key='settings.exam_family.created'
      )
    RETURNING family.code, family.name
  `;

  console.log(
    "[render-build] canonical catalogue reconciliation " +
      JSON.stringify({
        retiredLegacyExams: legacyCandidates.map((row) => ({
          code: String(row.code),
          name: String(row.name),
          familyCode: String(row.familyCode),
        })),
        retiredLegacyFamilies: retiredFamilies.map((row) => ({
          code: String(row.code),
          name: String(row.name),
        })),
      }),
  );
} catch (error) {
  console.error(
    "[render-build] canonical catalogue reconciliation failed",
    error instanceof Error ? error.message : String(error),
  );
  throw error;
} finally {
  await sql.end({ timeout: 5 });
}
