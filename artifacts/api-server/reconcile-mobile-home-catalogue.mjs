import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  console.log("[render-build] mobile home catalogue reconciliation skipped: DATABASE_URL unavailable");
  process.exit(0);
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

function strings(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item ?? "").trim()).filter(Boolean)
    : [];
}

try {
  const [record] = await sql`
    SELECT configuration
    FROM platform.mobile_home_configuration
    WHERE singleton_key='default'
    LIMIT 1
  `;

  if (!record) {
    console.log("[render-build] mobile home catalogue reconciliation skipped: no configuration row");
    process.exit(0);
  }

  const configuration =
    record.configuration && typeof record.configuration === "object"
      ? record.configuration
      : {};

  const configuredFamilyIds = strings(configuration.featuredExamFamilyIds);
  const configuredSeriesIds = strings(configuration.featuredTestSeriesIds);

  const [familyRows, seriesRows] = await Promise.all([
    configuredFamilyIds.length === 0
      ? Promise.resolve([])
      : sql`
          SELECT id::text AS id
          FROM catalog.exam_families
          WHERE id = ANY(${configuredFamilyIds}::uuid[])
            AND is_active=true
        `,
    configuredSeriesIds.length === 0
      ? Promise.resolve([])
      : sql`
          SELECT s.id::text AS id
          FROM assessment.test_series s
          JOIN assessment.test_series_versions version
            ON version.series_id = s.id
           AND version.version_number = s.current_version_number
          LEFT JOIN assessment.test_series_items item
            ON item.series_version_id = version.id
          LEFT JOIN assessment.tests test
            ON test.id = item.test_id
           AND test.deleted_at IS NULL
          LEFT JOIN assessment.test_publications publication
            ON publication.test_id = test.id
           AND publication.test_version_id = test.published_version_id
           AND publication.published_at IS NOT NULL
          WHERE s.id = ANY(${configuredSeriesIds}::uuid[])
            AND s.deleted_at IS NULL
            AND (version.availability_end_at IS NULL OR version.availability_end_at > now())
            AND COALESCE(
              NULLIF(version.configuration->>'learnerVisibility', ''),
              'live'
            ) <> 'hidden'
          GROUP BY s.id, version.id
          HAVING
            COALESCE(
              NULLIF(version.configuration->>'learnerVisibility', ''),
              'live'
            ) = 'coming_soon'
            OR (
              COALESCE(
                NULLIF(version.configuration->>'learnerVisibility', ''),
                'live'
              ) = 'live'
              AND COUNT(item.id) FILTER (
                WHERE test.status = 'live'::test_status
                  AND publication.published_at IS NOT NULL
                  AND (
                    publication.closes_at IS NULL
                    OR publication.closes_at > now()
                  )
              ) > 0
            )
        `,
  ]);

  const validFamilyIds = new Set(familyRows.map((row) => String(row.id)));
  const validSeriesIds = new Set(seriesRows.map((row) => String(row.id)));
  const nextFamilyIds = configuredFamilyIds.filter((id) => validFamilyIds.has(id));
  const nextSeriesIds = configuredSeriesIds.filter((id) => validSeriesIds.has(id));

  const changed =
    nextFamilyIds.length !== configuredFamilyIds.length ||
    nextSeriesIds.length !== configuredSeriesIds.length;

  if (!changed) {
    console.log("[render-build] mobile home catalogue references already valid");
    process.exit(0);
  }

  const nextConfiguration = {
    ...configuration,
    featuredExamFamilyIds: nextFamilyIds,
    featuredTestSeriesIds: nextSeriesIds,
  };

  await sql`
    UPDATE platform.mobile_home_configuration
    SET configuration=${sql.json(nextConfiguration)},
        updated_at=now()
    WHERE singleton_key='default'
  `;

  console.log(
    "[render-build] reconciled mobile home catalogue references " +
      JSON.stringify({
        removedExamFamilyIds: configuredFamilyIds.filter((id) => !validFamilyIds.has(id)),
        removedTestSeriesIds: configuredSeriesIds.filter((id) => !validSeriesIds.has(id)),
        remainingExamFamilyIds: nextFamilyIds,
        remainingTestSeriesIds: nextSeriesIds,
      }),
  );
} catch (error) {
  console.error(
    "[render-build] mobile home catalogue reconciliation failed",
    error instanceof Error ? error.message : String(error),
  );
  throw error;
} finally {
  await sql.end({ timeout: 5 });
}
