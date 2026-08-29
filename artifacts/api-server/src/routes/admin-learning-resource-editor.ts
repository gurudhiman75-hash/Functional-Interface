import { Router, type IRouter } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

router.use(authenticate);

router.get("/options", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const [languages, exams] = await Promise.all([
      sqlClient`
        SELECT id::text AS id, code, name, native_name AS "nativeName"
        FROM catalog.languages
        WHERE is_active = true
        ORDER BY name
      `,
      sqlClient`
        SELECT
          exam.id::text AS id,
          exam.code,
          exam.name,
          family.id::text AS "familyId",
          family.code AS "familyCode",
          family.name AS "familyName"
        FROM catalog.exams exam
        JOIN catalog.exam_families family
          ON family.id = exam.family_id
         AND family.is_active = true
        JOIN catalog.exam_versions version
          ON version.exam_id = exam.id
         AND version.is_current = true
        WHERE exam.is_active = true
        ORDER BY family.name, exam.name
      `,
    ]);

    res.json({ languages, exams, maxExamTargets: 12 });
  } catch (error) {
    console.error("Unable to load learning resource editor options", error);
    res.status(500).json({
      error: "Unable to load learning resource editor options",
      code: "LEARNING_RESOURCE_EDITOR_OPTIONS_FAILED",
    });
  }
});

router.get("/:id", requireAdminPermission("content.questions.read"), async (req, res) => {
  const id = String(req.params.id ?? "").trim();
  if (!uuidPattern.test(id)) {
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
        resource.status,
        resource.published_at AS "publishedAt",
        resource.expires_at AS "expiresAt",
        resource.created_at AS "createdAt",
        resource.updated_at AS "updatedAt",
        COALESCE(
          array_agg(target.exam_id::text ORDER BY exam.name)
            FILTER (WHERE target.exam_id IS NOT NULL),
          '{}'
        ) AS "examIds"
      FROM content.learning_resources resource
      LEFT JOIN content.learning_resource_exams target
        ON target.resource_id = resource.id
      LEFT JOIN catalog.exams exam
        ON exam.id = target.exam_id
      WHERE resource.id = ${id}::uuid
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
    console.error("Unable to load learning resource editor detail", error);
    res.status(500).json({
      error: "Unable to load learning resource editor detail",
      code: "LEARNING_RESOURCE_EDITOR_DETAIL_FAILED",
    });
  }
});

export default router;
