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
          SELECT id::text AS id
          FROM assessment.test_series
          WHERE id = ANY(${configuredSeriesIds}::uuid[])
            AND deleted_at IS NULL
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
