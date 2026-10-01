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
      configuration: { ...configuration, heroSlides: slides },
      updatedAt: rows[0]?.updatedAt ?? null,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to load public mobile home configuration", error);
    res.status(500).json({ error: "Unable to load mobile home configuration", code: "MOBILE_HOME_PUBLIC_LOAD_FAILED" });
  }
});

export default router;
