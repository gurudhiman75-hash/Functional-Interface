import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import {
  defaultWebExamPageConfiguration,
  ensureWebExamPagesSchema,
  normalizeWebExamPageConfiguration,
} from "../lib/web-exam-page-config";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);

function text(value: unknown, max = 240) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function examSlug(value: unknown) {
  return text(value, 100).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

router.get("/", requireAdminPermission("content.taxonomy.read"), async (_req, res) => {
  await ensureWebExamPagesSchema();
  const [pages, exams] = await Promise.all([
    sqlClient`
      SELECT id::text AS id, exam_slug AS "examSlug", title, is_active AS "isActive",
             configuration, updated_at AS "updatedAt"
      FROM platform.web_exam_pages
      ORDER BY exam_slug
    `,
    sqlClient`
      SELECT e.id::text AS id, e.code, e.name, f.name AS "familyName"
      FROM catalog.exams e
      JOIN catalog.exam_families f ON f.id = e.family_id
      WHERE e.is_active = true AND f.is_active = true
      ORDER BY f.name, e.name
      LIMIT 1000
    `,
  ]);

  res.json({
    pages: pages.map((page) => ({
      ...page,
      configuration: normalizeWebExamPageConfiguration(page.configuration),
    })),
    exams,
    defaultConfiguration: defaultWebExamPageConfiguration(),
  });
});

router.put("/:examSlug", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  await ensureWebExamPagesSchema();
  const slug = examSlug(req.params.examSlug);
  if (!slug) {
    res.status(400).json({ error: "Exam page slug is required." });
    return;
  }

  const configuration = normalizeWebExamPageConfiguration(req.body?.configuration);
  const title = text(req.body?.title, 180);
  const rows = await sqlClient`
    INSERT INTO platform.web_exam_pages
      (exam_slug, title, is_active, configuration, created_by, updated_by)
    VALUES
      (${slug}, ${title}, ${req.body?.isActive !== false}, ${sqlClient.json(configuration)}, ${req.user?.id ?? null}, ${req.user?.id ?? null})
    ON CONFLICT (exam_slug) DO UPDATE
    SET title = EXCLUDED.title,
        is_active = EXCLUDED.is_active,
        configuration = EXCLUDED.configuration,
        updated_by = EXCLUDED.updated_by,
        updated_at = now()
    RETURNING id::text AS id, exam_slug AS "examSlug", title, is_active AS "isActive",
              configuration, updated_at AS "updatedAt"
  `;

  res.json({
    page: {
      ...rows[0],
      configuration: normalizeWebExamPageConfiguration(rows[0]?.configuration),
    },
  });
});

router.delete("/:examSlug", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  await ensureWebExamPagesSchema();
  const slug = examSlug(req.params.examSlug);
  await sqlClient`DELETE FROM platform.web_exam_pages WHERE exam_slug = ${slug}`;
  res.status(204).end();
});

export default router;
