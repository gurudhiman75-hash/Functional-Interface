import { Router } from "express";

import { sqlClient } from "../lib/db";

const router = Router();

router.get("/mobile/home-config", async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT configuration, updated_at AS "updatedAt"
      FROM platform.mobile_home_configuration
      WHERE singleton_key = 'default'
      LIMIT 1
    `;
    const configuration = (rows[0]?.configuration ?? {}) as Record<string, unknown>;
    const examFamilyIds = Array.isArray(configuration.featuredExamFamilyIds)
      ? configuration.featuredExamFamilyIds.map(String).filter(Boolean)
      : [];
    const testSeriesIds = Array.isArray(configuration.featuredTestSeriesIds)
      ? configuration.featuredTestSeriesIds.map(String).filter(Boolean)
      : [];
    const [featuredExamFamilies, featuredTestSeries] = await Promise.all([
      examFamilyIds.length === 0
        ? Promise.resolve([])
        : sqlClient`
            SELECT id::text AS id, code, name
            FROM catalog.exam_families
            WHERE id = ANY(${examFamilyIds}::uuid[]) AND is_active = true
          `,
      testSeriesIds.length === 0
        ? Promise.resolve([])
        : sqlClient`
            SELECT
              s.id::text AS id,
              s.code,
              s.name,
              e.name AS "examName",
              COUNT(item.id)::int AS "testCount"
            FROM assessment.test_series s
            JOIN assessment.test_series_versions version
              ON version.series_id = s.id
             AND version.version_number = s.current_version_number
            JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
            JOIN catalog.exams e ON e.id = ev.exam_id
            LEFT JOIN assessment.test_series_items item
              ON item.series_version_id = version.id
            LEFT JOIN assessment.tests test
              ON test.id = item.test_id
             AND test.deleted_at IS NULL
            LEFT JOIN assessment.test_versions published
              ON published.id = test.published_version_id
            LEFT JOIN LATERAL (
              SELECT publication.published_at, publication.closes_at
              FROM assessment.test_publications publication
              WHERE publication.test_id = test.id
                AND publication.test_version_id = test.published_version_id
                AND publication.published_at IS NOT NULL
              ORDER BY publication.publication_number DESC
              LIMIT 1
            ) publication ON true
            WHERE s.id = ANY(${testSeriesIds}::uuid[])
              AND s.deleted_at IS NULL
              AND (version.availability_end_at IS NULL OR version.availability_end_at > now())
              AND COALESCE(
                NULLIF(version.configuration->>'learnerVisibility', ''),
                'live'
              ) <> 'hidden'
            GROUP BY s.id, version.id, e.id
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
    const familyById = new Map(
      featuredExamFamilies.map((row) => [String(row.id), row]),
    );
    const seriesById = new Map(
      featuredTestSeries.map((row) => [String(row.id), row]),
    );
    const validExamFamilyIds = examFamilyIds.filter((id) => familyById.has(id));
    const validTestSeriesIds = testSeriesIds.filter((id) => seriesById.has(id));
    const now = Date.now();
    const slides = Array.isArray(configuration.heroSlides)
      ? configuration.heroSlides.filter((slide) => {
          if (!slide || typeof slide !== "object") return false;
          const value = slide as Record<string, unknown>;
          if (value.isActive === false) return false;
          const start = typeof value.startAt === "string" && value.startAt ? new Date(value.startAt).getTime() : null;
          const end = typeof value.endAt === "string" && value.endAt ? new Date(value.endAt).getTime() : null;
          return (start == null || start <= now) && (end == null || end >= now);
        })
      : [];
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    res.json({
      configuration: {
        ...configuration,
        heroSlides: slides,
        featuredExamFamilyIds: validExamFamilyIds,
        featuredTestSeriesIds: validTestSeriesIds,
        featuredExamFamilies: validExamFamilyIds
          .map((id) => familyById.get(id))
          .filter(Boolean),
        featuredTestSeries: validTestSeriesIds
          .map((id) => seriesById.get(id))
          .filter(Boolean),
      },
      updatedAt: rows[0]?.updatedAt ?? null,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to load public mobile home configuration", error);
    res.status(500).json({ error: "Unable to load mobile home configuration", code: "MOBILE_HOME_PUBLIC_LOAD_FAILED" });
  }
});

export default router;
