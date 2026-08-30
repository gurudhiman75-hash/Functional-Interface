import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import currentAffairsNotificationsRouter from "./current-affairs-notifications";
import currentAffairsPersonalizationRouter from "./current-affairs-personalization";
import currentAffairsQuizzesRouter from "./current-affairs-quizzes";

const router: IRouter = Router();
const resourceCategories = new Set(["current_affairs", "notes", "formula_sheet"]);
const resourceFormats = new Set(["article", "pdf"]);
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const publicCodePattern = /^[A-Z][A-Z0-9_-]{2,79}$/;

function optionalFilter(value: unknown, allowed: Set<string>): string | null | undefined {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return allowed.has(normalized) ? normalized : undefined;
}

function languageFilter(value: unknown): string | null | undefined {
  if (value == null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim().toLowerCase();
  return /^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/.test(normalized)
    ? normalized
    : undefined;
}

function listLimit(value: unknown): number | null {
  if (value == null || value === "") return 50;
  if (typeof value !== "string" || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 1 && parsed <= 100
    ? parsed
    : null;
}

function resourceIdentifier(value: unknown): { id: string | null; code: string | null } | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (uuidPattern.test(normalized)) return { id: normalized, code: null };
  const upper = normalized.toUpperCase();
  if (publicCodePattern.test(upper)) return { id: null, code: upper };
  return null;
}

router.use(currentAffairsQuizzesRouter);
router.use(currentAffairsPersonalizationRouter);
router.use(currentAffairsNotificationsRouter);

router.get("/learning-resources", async (req, res) => {
  const category = optionalFilter(req.query.category, resourceCategories);
  const format = optionalFilter(req.query.format, resourceFormats);
  const language = languageFilter(req.query.language);
  const limit = listLimit(req.query.limit);

  if (category === undefined || format === undefined || language === undefined || limit == null) {
    res.status(400).json({
      error: "Invalid learning resource filter",
      code: "INVALID_LEARNING_RESOURCE_FILTER",
    });
    return;
  }

  try {
    const rows = await sqlClient`
      SELECT
        resource.id::text AS id,
        resource.public_code AS "publicCode",
        resource.category,
        resource.format,
        resource.title,
        resource.summary,
        resource.language_code AS "languageCode",
        resource.content_date AS "contentDate",
        resource.content_url AS "contentUrl",
        NULLIF(BTRIM(COALESCE(resource.body_markdown, '')), '') IS NOT NULL AS "hasInlineContent",
        resource.published_at AS "publishedAt",
        resource.expires_at AS "expiresAt",
        COUNT(target.exam_id) = 0 AS "isGeneral",
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', exam.id::text,
              'code', exam.code,
              'name', exam.name,
              'familyId', family.id::text,
              'familyCode', family.code,
              'familyName', family.name
            )
          ) FILTER (WHERE exam.id IS NOT NULL),
          '[]'::json
        ) AS exams
      FROM content.learning_resources resource
      LEFT JOIN content.learning_resource_exams target
        ON target.resource_id = resource.id
      LEFT JOIN catalog.exams exam
        ON exam.id = target.exam_id
       AND exam.is_active = true
      LEFT JOIN catalog.exam_families family
        ON family.id = exam.family_id
       AND family.is_active = true
      WHERE resource.status = 'published'
        AND resource.published_at IS NOT NULL
        AND resource.published_at <= now()
        AND (resource.expires_at IS NULL OR resource.expires_at > now())
        AND (${category}::text IS NULL OR resource.category = ${category})
        AND (${format}::text IS NULL OR resource.format = ${format})
        AND (${language}::text IS NULL OR lower(resource.language_code) = ${language})
      GROUP BY resource.id
      ORDER BY
        resource.content_date DESC NULLS LAST,
        resource.published_at DESC,
        resource.public_code
      LIMIT ${limit}
    `;

    res.json({
      resources: rows,
      filters: { category, format, language },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to list published learning resources", error);
    res.status(500).json({
      error: "Unable to load learning resources",
      code: "LEARNING_RESOURCES_LOAD_FAILED",
    });
  }
});

router.get("/learning-resources/:id", async (req, res) => {
  const identifier = resourceIdentifier(req.params.id);
  if (!identifier) {
    res.status(400).json({
      error: "Invalid learning resource identifier",
      code: "INVALID_LEARNING_RESOURCE_ID",
    });
    return;
  }

  try {
    const rows = await sqlClient`
      SELECT
        resource.id::text AS id,
        resource.public_code AS "publicCode",
        resource.category,
        resource.format,
        resource.title,
        resource.summary,
        resource.language_code AS "languageCode",
        resource.content_date AS "contentDate",
        resource.body_markdown AS "bodyMarkdown",
        resource.content_url AS "contentUrl",
        resource.published_at AS "publishedAt",
        resource.expires_at AS "expiresAt",
        COUNT(target.exam_id) = 0 AS "isGeneral",
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', exam.id::text,
              'code', exam.code,
              'name', exam.name,
              'familyId', family.id::text,
              'familyCode', family.code,
              'familyName', family.name
            )
          ) FILTER (WHERE exam.id IS NOT NULL),
          '[]'::json
        ) AS exams
      FROM content.learning_resources resource
      LEFT JOIN content.learning_resource_exams target
        ON target.resource_id = resource.id
      LEFT JOIN catalog.exams exam
        ON exam.id = target.exam_id
       AND exam.is_active = true
      LEFT JOIN catalog.exam_families family
        ON family.id = exam.family_id
       AND family.is_active = true
      WHERE resource.status = 'published'
        AND resource.published_at IS NOT NULL
        AND resource.published_at <= now()
        AND (resource.expires_at IS NULL OR resource.expires_at > now())
        AND (
          (${identifier.id}::uuid IS NOT NULL AND resource.id = ${identifier.id}::uuid)
          OR (${identifier.code}::text IS NOT NULL AND resource.public_code = ${identifier.code})
        )
      GROUP BY resource.id
      LIMIT 1
    `;

    if (!rows[0]) {
      res.status(404).json({
        error: "Learning resource not found",
        code: "LEARNING_RESOURCE_NOT_FOUND",
      });
      return;
    }

    res.json({ resource: rows[0] });
  } catch (error) {
    console.error("Unable to load published learning resource", error);
    res.status(500).json({
      error: "Unable to load learning resource",
      code: "LEARNING_RESOURCE_LOAD_FAILED",
    });
  }
});

export default router;