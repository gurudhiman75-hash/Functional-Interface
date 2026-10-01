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
            SELECT s.id::text AS id,s.code,s.name,e.name AS "examName",
              (SELECT COUNT(*)::int FROM assessment.test_series_items item
               WHERE item.series_id=s.id AND item.series_version_number=s.current_version_number) AS "testCount"
            FROM assessment.test_series s
            JOIN catalog.exam_versions ev ON ev.id=s.exam_version_id
            JOIN catalog.exams e ON e.id=ev.exam_id
            WHERE s.id = ANY(${testSeriesIds}::uuid[]) AND s.deleted_at IS NULL
          `,
    ]);
    const familyById = new Map(featuredExamFamilies.map((row) => [String(row.id), row]));
    const seriesById = new Map(featuredTestSeries.map((row) => [String(row.id), row]));
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
        featuredExamFamilies: examFamilyIds.map((id) => familyById.get(id)).filter(Boolean),
        featuredTestSeries: testSeriesIds.map((id) => seriesById.get(id)).filter(Boolean),
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
