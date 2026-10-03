import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.log("[render-build] catalogue audit skipped: DATABASE_URL unavailable");
  process.exit(0);
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

try {
  const [row] = await sql`
    SELECT json_build_object(
      'families', (
        SELECT COALESCE(json_agg(json_build_object(
          'id', family.id,
          'code', family.code,
          'name', family.name,
          'isActive', family.is_active,
          'adminCreated', EXISTS (
            SELECT 1
            FROM platform.audit_events event
            WHERE event.entity_type='exam_family'
              AND event.entity_id=family.id
              AND event.action_key='settings.exam_family.created'
          )
        ) ORDER BY family.name), '[]'::json)
        FROM catalog.exam_families family
      ),
      'exams', (
        SELECT COALESCE(json_agg(json_build_object(
          'id', exam.id,
          'code', exam.code,
          'name', exam.name,
          'familyCode', family.code,
          'isActive', exam.is_active,
          'adminCreated', EXISTS (
            SELECT 1
            FROM platform.audit_events event
            WHERE event.entity_type='exam'
              AND event.entity_id=exam.id
              AND event.action_key='settings.exam.created'
          ),
          'updatedAt', exam.updated_at
        ) ORDER BY exam.updated_at DESC, exam.name), '[]'::json)
        FROM catalog.exams exam
        JOIN catalog.exam_families family ON family.id=exam.family_id
      ),
      'series', (
        SELECT COALESCE(json_agg(json_build_object(
          'id', series.id,
          'code', series.code,
          'name', series.name,
          'examCode', exam.code,
          'learnerVisibility', COALESCE(NULLIF(current_version.configuration->>'learnerVisibility',''),'live'),
          'deleted', series.deleted_at IS NOT NULL,
          'updatedAt', series.updated_at
        ) ORDER BY series.updated_at DESC, series.name), '[]'::json)
        FROM assessment.test_series series
        JOIN catalog.exam_versions exam_version ON exam_version.id=series.exam_version_id
        JOIN catalog.exams exam ON exam.id=exam_version.exam_id
        JOIN assessment.test_series_versions current_version
          ON current_version.series_id=series.id
         AND current_version.version_number=series.current_version_number
      ),
      'homeConfig', (
        SELECT configuration
        FROM platform.mobile_home_configuration
        WHERE singleton_key='default'
        LIMIT 1
      )
    ) AS snapshot
  `;
  console.log("[render-build] catalogue production audit " + JSON.stringify(row?.snapshot ?? {}));
} catch (error) {
  console.error("[render-build] catalogue production audit failed", error instanceof Error ? error.message : String(error));
} finally {
  await sql.end({ timeout: 5 });
}
