import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { resolveSubcategoryIcon } from "../lib/subcategory-icons";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        e.code AS id,
        ef.code AS "categoryId",
        ef.name AS "categoryName",
        e.name,
        COALESCE(e.description, 'Mock tests for ' || e.name) AS description,
        COALESCE(
          array_agg(DISTINCT l.code ORDER BY l.code)
            FILTER (WHERE l.code IS NOT NULL),
          ARRAY['en']::text[]
        ) AS languages
      FROM catalog.exams e
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN catalog.exam_versions ev
        ON ev.exam_id = e.id
       AND ev.is_current = true
      LEFT JOIN catalog.exam_version_languages evl ON evl.exam_version_id = ev.id
      LEFT JOIN catalog.languages l
        ON l.id = evl.language_id
       AND l.is_active = true
      WHERE e.is_active = true
        AND ef.is_active = true
      GROUP BY e.id, e.code, e.name, e.description, ef.code, ef.name
      ORDER BY ef.name, e.name
    `;

    return res.json(rows.map((row) => ({
      id: String(row.id),
      categoryId: String(row.categoryId),
      categoryName: String(row.categoryName),
      name: String(row.name),
      description: String(row.description ?? ""),
      languages: Array.isArray(row.languages) ? row.languages.map(String) : ["en"],
      icon: resolveSubcategoryIcon(String(row.categoryName), String(row.name)),
    })));
  } catch (error) {
    console.error("Unable to load canonical subcategories", error);
    return res.status(500).json({ error: "Unable to load subcategories" });
  }
});

export default router;
