import { Router } from "express";

import { sqlClient } from "../lib/db";
import { ensureWebExamPagesSchema, normalizeWebExamPageConfiguration } from "../lib/web-exam-page-config";

const router = Router();

function examSlug(value: unknown) {
  return typeof value === "string"
    ? value.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80)
    : "";
}

router.get("/web/exam-pages/:examSlug", async (req, res) => {
  await ensureWebExamPagesSchema();
  const slug = examSlug(req.params.examSlug);
  const rows = await sqlClient`
    SELECT title, configuration, updated_at AS "updatedAt"
    FROM platform.web_exam_pages
    WHERE exam_slug = ${slug} AND is_active = true
    LIMIT 1
  `;

  const page = rows[0];
  res.json({
    examSlug: slug,
    configured: Boolean(page),
    title: page ? String(page.title ?? "") : "",
    configuration: page ? normalizeWebExamPageConfiguration(page.configuration) : null,
    updatedAt: page?.updatedAt ?? null,
  });
});

export default router;
