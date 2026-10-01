import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);

const LAYOUTS = new Set(["horizontal","grid","list","banner"]);
const DESTINATIONS = new Set(["none","exam","test_series","learn","page","url"]);

function text(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function slug(value: unknown): string {
  const raw = text(value, 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return raw.slice(0, 60);
}

function normalizeCard(value: unknown, index: number) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const destinationType = text(raw.destinationType, 40) || "none";
  return {
    id: text(raw.id, 80) || randomUUID(),
    title: text(raw.title, 140),
    subtitle: text(raw.subtitle, 280),
    badge: text(raw.badge, 60),
    iconName: text(raw.iconName, 80),
    iconUrl: text(raw.iconUrl, 1000),
    imageUrl: text(raw.imageUrl, 1000),
    ctaLabel: text(raw.ctaLabel, 60),
    destinationType: DESTINATIONS.has(destinationType) ? destinationType : "none",
    destinationValue: text(raw.destinationValue, 1000),
    isActive: raw.isActive !== false,
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Number(raw.sortOrder) : index + 1,
  };
}

function normalizeSection(value: unknown, index: number) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const layout = text(raw.layout, 40) || "horizontal";
  const cards = Array.isArray(raw.cards) ? raw.cards.slice(0, 60).map(normalizeCard) : [];
  return {
    id: text(raw.id, 80) || randomUUID(),
    title: text(raw.title, 140) || "Untitled section",
    subtitle: text(raw.subtitle, 280),
    iconName: text(raw.iconName, 80),
    iconUrl: text(raw.iconUrl, 1000),
    layout: LAYOUTS.has(layout) ? layout : "horizontal",
    isVisible: raw.isVisible !== false,
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Number(raw.sortOrder) : index + 1,
    cards,
  };
}

function normalizeConfiguration(value: unknown) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const sections = Array.isArray(raw.sections) ? raw.sections.slice(0, 50).map(normalizeSection) : [];
  return { sections };
}

router.get("/", requireAdminPermission("content.taxonomy.read"), async (_req, res) => {
  const rows = await sqlClient`
    SELECT id::text AS id, slug, title, description, native_route AS "nativeRoute",
           render_mode AS "renderMode", icon_name AS "iconName", is_active AS "isActive",
           show_app_bar AS "showAppBar", configuration, sort_order AS "sortOrder",
           updated_at AS "updatedAt", updated_by AS "updatedBy"
    FROM platform.mobile_pages
    ORDER BY sort_order, title
  `;
  res.json({ pages: rows });
});

router.post("/", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const pageSlug = slug(req.body?.slug);
  const title = text(req.body?.title, 140);
  if (!pageSlug || !title) {
    res.status(400).json({ error: "Page name and slug are required." });
    return;
  }
  try {
    const rows = await sqlClient`
      INSERT INTO platform.mobile_pages
        (slug,title,description,native_route,render_mode,icon_name,is_active,show_app_bar,configuration,sort_order,created_by,updated_by)
      VALUES
        (${pageSlug},${title},${text(req.body?.description,280)},NULL,'managed',${text(req.body?.iconName,80)},true,true,
         ${sqlClient.json({ sections: [] })},
         COALESCE((SELECT MAX(sort_order)+10 FROM platform.mobile_pages),10),
         ${req.user?.id ?? null},${req.user?.id ?? null})
      RETURNING id::text AS id, slug, title, description, native_route AS "nativeRoute",
                render_mode AS "renderMode", icon_name AS "iconName", is_active AS "isActive",
                show_app_bar AS "showAppBar", configuration, sort_order AS "sortOrder", updated_at AS "updatedAt"
    `;
    res.status(201).json({ page: rows[0] });
  } catch (error) {
    if ((error as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "A mobile page with this slug already exists." });
      return;
    }
    throw error;
  }
});

router.put("/:id", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const pageId = text(req.params.id, 80);
  const title = text(req.body?.title, 140);
  if (!title) {
    res.status(400).json({ error: "Page title is required." });
    return;
  }
  const renderMode = text(req.body?.renderMode, 20) === "native" ? "native" : "managed";
  const configuration = normalizeConfiguration(req.body?.configuration);
  const rows = await sqlClient`
    UPDATE platform.mobile_pages
    SET title=${title},
        description=${text(req.body?.description,280)},
        render_mode=${renderMode},
        icon_name=${text(req.body?.iconName,80)},
        is_active=${req.body?.isActive !== false},
        show_app_bar=${req.body?.showAppBar !== false},
        configuration=${sqlClient.json(configuration)},
        sort_order=${Number.isFinite(Number(req.body?.sortOrder)) ? Number(req.body.sortOrder) : 0},
        updated_by=${req.user?.id ?? null},
        updated_at=now()
    WHERE id=${pageId}::uuid
    RETURNING id::text AS id, slug, title, description, native_route AS "nativeRoute",
              render_mode AS "renderMode", icon_name AS "iconName", is_active AS "isActive",
              show_app_bar AS "showAppBar", configuration, sort_order AS "sortOrder", updated_at AS "updatedAt"
  `;
  if (!rows[0]) {
    res.status(404).json({ error: "Mobile page not found." });
    return;
  }
  res.json({ page: rows[0] });
});

router.delete("/:id", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const pageId = text(req.params.id, 80);
  const rows = await sqlClient`
    DELETE FROM platform.mobile_pages
    WHERE id=${pageId}::uuid AND native_route IS NULL
    RETURNING id::text AS id
  `;
  if (!rows[0]) {
    res.status(409).json({ error: "Only fully managed pages can be deleted. Native app pages must remain registered." });
    return;
  }
  res.status(204).end();
});

export default router;
