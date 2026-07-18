import { Router, type IRouter } from "express";

import { sqlClient } from "../lib/db";
import { resolveCategoryIcon } from "../lib/category-icons";

const router: IRouter = Router();

async function loadCategories(identifier?: string) {
  return sqlClient`
    SELECT
      ef.code AS id,
      ef.name,
      ('Mock tests for ' || ef.name) AS description,
      COUNT(DISTINCT t.id)::int AS "testsCount"
    FROM catalog.exam_families ef
    LEFT JOIN catalog.exams e
      ON e.family_id = ef.id
     AND e.is_active = true
    LEFT JOIN catalog.exam_versions ev
      ON ev.exam_id = e.id
     AND ev.is_current = true
    LEFT JOIN assessment.tests t
      ON t.exam_version_id = ev.id
     AND t.status = 'live'::test_status
     AND t.deleted_at IS NULL
    WHERE ef.is_active = true
      AND (${identifier ?? null}::text IS NULL OR lower(ef.code) = lower(${identifier ?? null}))
    GROUP BY ef.id, ef.code, ef.name
    ORDER BY ef.name
  `;
}

function serializeCategory(row: Record<string, unknown>) {
  const name = String(row.name ?? "Exams");
  return {
    id: String(row.id),
    name,
    description: String(row.description ?? ""),
    icon: resolveCategoryIcon(name, ""),
    color: "#2563eb",
    testsCount: Number(row.testsCount ?? 0),
  };
}

router.get("/", async (_req, res) => {
  try {
    const rows = await loadCategories();
    return res.json(rows.map((row) => serializeCategory(row as Record<string, unknown>)));
  } catch (error) {
    console.error("Unable to load canonical categories", error);
    return res.status(500).json({ error: "Unable to load categories" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const rows = await loadCategories(String(req.params.id ?? "").trim());
    if (!rows[0]) return res.status(404).json({ error: "Category not found" });
    return res.json(serializeCategory(rows[0] as Record<string, unknown>));
  } catch (error) {
    console.error("Unable to load canonical category", error);
    return res.status(500).json({ error: "Unable to load category" });
  }
});

export default router;
