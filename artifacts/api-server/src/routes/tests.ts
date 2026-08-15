import { Router, type IRouter } from "express";

import { evaluateTestAccess, resolveCanonicalStudentUserId } from "../lib/canonical-commerce-entitlements";
import { cacheGet, cacheSet, TTL } from "../lib/cache";
import { sqlClient } from "../lib/db";
import { legacyMobileQuestion, legacyMobileSection, legacyMobileTest } from "../lib/mobile-test-compat";
import { authenticate } from "../middlewares/auth";
import { optionalAuthenticate } from "../middlewares/optionalAuth";

const router: IRouter = Router();
const MOBILE_TESTS_CACHE_KEY = "tests:list:canonical-mobile-v2";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function intValue(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.trunc(value);
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.trunc(parsed);
  }
  return fallback;
}

async function loadCanonicalTestMetadata(identifier?: string) {
  const normalized = identifier?.trim() || null;
  const uuidIdentifier = normalized && isUuid(normalized) ? normalized : null;

  return sqlClient`
    SELECT
      t.id::text AS id,
      t.public_code AS "publicCode",
      tv.id::text AS "publishedVersionId",
      tv.title,
      tv.description,
      tv.duration_seconds AS "durationSeconds",
      tv.total_marks::float8 AS "totalMarks",
      tv.settings,
      ef.code AS "examFamilyCode",
      ef.name AS "examFamilyName",
      e.code AS "examCode",
      e.name AS "examName",
      COALESCE((
        SELECT COUNT(*)::int
        FROM assessment.test_questions tq
        WHERE tq.test_version_id = tv.id
      ), 0) AS "questionCount",
      COALESCE((
        SELECT AVG(tq.marks)::float8
        FROM assessment.test_questions tq
        WHERE tq.test_version_id = tv.id
      ), 1) AS "marksPerQuestion",
      COALESCE((
        SELECT AVG(tq.negative_marks)::float8
        FROM assessment.test_questions tq
        WHERE tq.test_version_id = tv.id
      ), 0) AS "negativeMarks",
      COALESCE((
        SELECT array_agg(l.code ORDER BY l.code)
        FROM catalog.exam_version_languages evl
        JOIN catalog.languages l
          ON l.id = evl.language_id
         AND l.is_active = true
        WHERE evl.exam_version_id = t.exam_version_id
      ), ARRAY[COALESCE(tv.settings->>'languageCode', 'en')]) AS languages,
      COALESCE(commerce_meta."priceMinor", 0) > 0 AS "paidAccessRequired",
      commerce_meta."priceMinor",
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', s.id::text,
            'sectionKey', s.section_key,
            'name', s.name,
            'sortOrder', s.sort_order
          ) ORDER BY s.sort_order
        )
        FROM assessment.test_sections s
        WHERE s.test_version_id = tv.id
      ), '[]'::json) AS sections,
      publication."publishedAt"
    FROM assessment.tests t
    JOIN assessment.test_versions tv ON tv.id = t.published_version_id
    JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    LEFT JOIN LATERAL (
      SELECT MAX(pv.sale_price_minor)::int AS "priceMinor"
      FROM commerce.products p
      JOIN commerce.product_versions pv
        ON pv.product_id = p.id
       AND pv.version_number = p.current_version_number
      JOIN commerce.product_version_tests pvt ON pvt.product_version_id = pv.id
      WHERE p.status = 'active'
        AND pvt.test_id = t.id
    ) commerce_meta ON true
    LEFT JOIN LATERAL (
      SELECT
        p.published_at AS "publishedAt",
        p.closes_at AS "closesAt"
      FROM assessment.test_publications p
      WHERE p.test_id = t.id
        AND p.test_version_id = tv.id
        AND p.published_at IS NOT NULL
      ORDER BY p.publication_number DESC
      LIMIT 1
    ) publication ON true
    WHERE t.status = 'live'::test_status
      AND t.deleted_at IS NULL
      AND (publication."closesAt" IS NULL OR publication."closesAt" > now())
      AND NOT EXISTS (
        SELECT 1
        FROM assessment.test_series series
        JOIN assessment.test_series_versions series_version
          ON series_version.series_id = series.id
         AND series_version.version_number = series.current_version_number
        JOIN assessment.test_series_items series_item
          ON series_item.series_version_id = series_version.id
         AND series_item.test_id = t.id
        WHERE series.deleted_at IS NULL
      )
      AND (
        ${normalized}::text IS NULL
        OR t.id = ${uuidIdentifier}::uuid
        OR lower(t.public_code) = lower(${normalized})
      )
    ORDER BY COALESCE(publication."publishedAt", t.updated_at) DESC
  `;
}

function mapMetadataRow(row: JsonRecord) {
  const rawSections = Array.isArray(row.sections) ? row.sections : [];
  const sections = rawSections
    .filter(isRecord)
    .map((section) => legacyMobileSection(section));
  return legacyMobileTest(row, sections);
}

// GET /api/tests/category-free-ids?category=SSC
router.get("/category-free-ids", async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  if (!category) return res.status(400).json({ error: "category query param is required" });

  try {
    const rows = await loadCanonicalTestMetadata();
    const normalized = category.toLowerCase();
    const payload = rows
      .filter((row) => {
        const item = row as JsonRecord;
        const matchesCategory = String(item.examFamilyCode ?? "").toLowerCase() === normalized
          || String(item.examFamilyName ?? "").toLowerCase() === normalized;
        return matchesCategory && item.paidAccessRequired !== true;
      })
      .map((row) => ({ id: String(row.id), name: String(row.title) }));
    return res.json(payload);
  } catch (error) {
    console.error("[tests] Unable to load free category tests", error);
    return res.status(500).json({ error: "Failed to load category tests" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const cached = await cacheGet<unknown[]>(MOBILE_TESTS_CACHE_KEY);
    if (cached) return res.json(cached);

    const rows = await loadCanonicalTestMetadata();
    const payload = rows.map((row) => mapMetadataRow(row as JsonRecord));
    await cacheSet(MOBILE_TESTS_CACHE_KEY, payload, TTL.TESTS_LIST);
    return res.json(payload);
  } catch (error) {
    console.error("[tests] Unable to load canonical mobile test catalogue", error);
    return res.status(500).json({ error: "Failed to load tests" });
  }
});

router.get("/my-tests", authenticate, async (req, res) => {
  try {
    const canonicalUserId = await resolveCanonicalStudentUserId(req.user!.id);
    if (!canonicalUserId) return res.json({ purchasedTests: [] });

    const rows = await sqlClient`
      SELECT DISTINCT ON (t.id)
        t.id::text AS id,
        tv.id::text AS "publishedVersionId",
        tv.title,
        tv.description,
        tv.duration_seconds AS "durationSeconds",
        tv.settings,
        ef.code AS "examFamilyCode",
        ef.name AS "examFamilyName",
        e.code AS "examCode",
        e.name AS "examName",
        COALESCE((SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = tv.id), 0) AS "questionCount",
        COALESCE((SELECT AVG(tq.marks)::float8 FROM assessment.test_questions tq WHERE tq.test_version_id = tv.id), 1) AS "marksPerQuestion",
        COALESCE((SELECT AVG(tq.negative_marks)::float8 FROM assessment.test_questions tq WHERE tq.test_version_id = tv.id), 0) AS "negativeMarks",
        COALESCE((SELECT array_agg(l.code ORDER BY l.code) FROM catalog.exam_version_languages evl JOIN catalog.languages l ON l.id = evl.language_id AND l.is_active = true WHERE evl.exam_version_id = t.exam_version_id), ARRAY[COALESCE(tv.settings->>'languageCode', 'en')]) AS languages,
        true AS "paidAccessRequired",
        commerce_meta."priceMinor",
        entitlement.created_at AS "purchasedAt",
        entitlement.grant_source AS source
      FROM commerce.entitlements entitlement
      JOIN commerce.entitlement_tests entitlement_test ON entitlement_test.entitlement_id = entitlement.id
      JOIN assessment.tests t ON t.id = entitlement_test.test_id
      JOIN assessment.test_versions tv ON tv.id = t.published_version_id
      JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN LATERAL (
        SELECT MAX(pv.sale_price_minor)::int AS "priceMinor"
        FROM commerce.products p
        JOIN commerce.product_versions pv ON pv.product_id = p.id AND pv.version_number = p.current_version_number
        JOIN commerce.product_version_tests pvt ON pvt.product_version_id = pv.id
        WHERE p.status = 'active' AND pvt.test_id = t.id
      ) commerce_meta ON true
      WHERE entitlement.user_id = ${canonicalUserId}::uuid
        AND entitlement.status = 'active'
        AND entitlement.starts_at <= now()
        AND (entitlement.ends_at IS NULL OR entitlement.ends_at > now())
        AND t.status = 'live'::test_status
        AND t.deleted_at IS NULL
      ORDER BY t.id, entitlement.created_at DESC
    `;

    return res.json({
      purchasedTests: rows.map((row) => {
        const item = row as JsonRecord;
        return {
          ...legacyMobileTest(item),
          purchasedAt: item.purchasedAt ?? null,
          source: item.source ?? null,
          razorpayOrderId: null,
          razorpayPaymentId: null,
        };
      }),
    });
  } catch (error) {
    console.error("[tests] Unable to load canonical purchased tests", error);
    return res.status(500).json({ error: "Failed to fetch purchased tests" });
  }
});

router.get("/:id", optionalAuthenticate, async (req, res) => {
  const idParam = req.params["id"];
  const identifier = typeof idParam === "string" ? idParam.trim() : idParam?.[0]?.trim();
  if (!identifier) return res.status(400).json({ error: "Missing test id" });

  try {
    const testRows = await loadCanonicalTestMetadata(identifier);
    const rawTest = testRows[0];
    if (!rawTest) return res.status(404).json({ error: "Test not found" });
    const test = rawTest as JsonRecord;
    const testId = String(test.id);
    const priceMinor = Math.max(0, intValue(test.priceMinor, 499));

    if (test.paidAccessRequired === true) {
      if (!req.user?.id) {
        return res.status(401).json({
          error: "Sign in required to open this paid test",
          code: "LOGIN_REQUIRED",
          testId,
          priceCents: priceMinor,
        });
      }

      const canonicalUserId = await resolveCanonicalStudentUserId(req.user.id);
      if (!canonicalUserId) {
        return res.status(401).json({
          error: "Sign in required to open this paid test",
          code: "LOGIN_REQUIRED",
          testId,
          priceCents: priceMinor,
        });
      }

      const access = await evaluateTestAccess({ userId: canonicalUserId, testId });
      if (!access.allowed) {
        return res.status(403).json({
          error: "Purchase required to access this test",
          code: "PAYMENT_REQUIRED",
          testId,
          priceCents: priceMinor,
        });
      }
    }

    const publishedVersionId = String(test.publishedVersionId);
    const sectionRows = await sqlClient`
      SELECT
        s.id::text AS id,
        s.section_key AS "sectionKey",
        s.name,
        s.sort_order AS "sortOrder"
      FROM assessment.test_sections s
      WHERE s.test_version_id = ${publishedVersionId}::uuid
      ORDER BY s.sort_order
    `;

    const questionRows = await sqlClient`
      SELECT
        tq.test_section_id::text AS "testSectionId",
        s.name AS "sectionName",
        s.sort_order AS "sectionSortOrder",
        tq.question_version_id::text AS "questionVersionId",
        tq.position,
        tq.marks::float8 AS marks,
        tq.negative_marks::float8 AS "negativeMarks",
        q.public_code AS "publicCode",
        qv.question_type AS "questionType",
        qv.difficulty,
        qv.stem,
        qv.explanation,
        qv.answer_model AS "answerModel",
        qv.default_marks::float8 AS "defaultMarks",
        COALESCE(
          json_agg(
            json_build_object(
              'key', option.option_key,
              'text', option.text,
              'sortOrder', option.sort_order,
              'isCorrect', option.is_correct
            ) ORDER BY option.sort_order
          ) FILTER (WHERE option.id IS NOT NULL),
          '[]'::json
        ) AS options
      FROM assessment.test_questions tq
      JOIN assessment.test_sections s ON s.id = tq.test_section_id
      JOIN content.question_versions qv ON qv.id = tq.question_version_id
      JOIN content.questions q ON q.id = qv.question_id
      LEFT JOIN content.question_options option ON option.question_version_id = qv.id
      WHERE tq.test_version_id = ${publishedVersionId}::uuid
      GROUP BY
        tq.test_section_id,
        s.name,
        s.sort_order,
        tq.question_version_id,
        tq.position,
        tq.marks,
        tq.negative_marks,
        q.public_code,
        qv.question_type,
        qv.difficulty,
        qv.stem,
        qv.explanation,
        qv.answer_model,
        qv.default_marks
      ORDER BY s.sort_order, tq.position
    `;

    if (questionRows.length === 0) {
      return res.status(404).json({
        error: "Test has no questions yet",
        code: "NO_QUESTIONS",
        testId,
      });
    }

    const questionsBySection = new Map<string, unknown[]>();
    for (const [index, rawQuestion] of questionRows.entries()) {
      const question = rawQuestion as JsonRecord;
      const sectionId = String(question.testSectionId);
      const current = questionsBySection.get(sectionId) ?? [];
      current.push(legacyMobileQuestion(question, index));
      questionsBySection.set(sectionId, current);
    }

    const sections = sectionRows.map((rawSection) => {
      const section = rawSection as JsonRecord;
      return legacyMobileSection(
        section,
        questionsBySection.get(String(section.id)) ?? [],
      );
    });

    return res.json(legacyMobileTest(test, sections));
  } catch (error) {
    console.error(`[tests] GET /:id error for id=${identifier}:`, error);
    return res.status(500).json({
      error: "Failed to load test",
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
