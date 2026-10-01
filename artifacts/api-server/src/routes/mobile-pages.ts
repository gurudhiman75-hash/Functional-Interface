import { Router } from "express";
import { sqlClient } from "../lib/db";

const router = Router();

router.get("/mobile/pages", async (_req, res) => {
  const rows = await sqlClient`
    SELECT slug, title, description, native_route AS "nativeRoute", render_mode AS "renderMode",
           icon_name AS "iconName", show_app_bar AS "showAppBar", configuration, sort_order AS "sortOrder"
    FROM platform.mobile_pages
    WHERE is_active=true
    ORDER BY sort_order, title
  `;
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ pages: rows, generatedAt: new Date().toISOString() });
});

router.get("/mobile/pages/:slug", async (req, res) => {
  const pageSlug = String(req.params.slug || "").trim().toLowerCase();
  const rows = await sqlClient`
    SELECT slug, title, description, native_route AS "nativeRoute", render_mode AS "renderMode",
           icon_name AS "iconName", show_app_bar AS "showAppBar", configuration, sort_order AS "sortOrder"
    FROM platform.mobile_pages
    WHERE slug=${pageSlug} AND is_active=true
    LIMIT 1
  `;
  if (!rows[0]) {
    res.status(404).json({ error: "Mobile page not found." });
    return;
  }
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ page: rows[0], generatedAt: new Date().toISOString() });
});

export default router;
