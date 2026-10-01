import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);

const LAYOUTS = new Set(["horizontal","grid","list","banner"]);
const DESTINATIONS = new Set(["none","exam","exam_family","test_series","learn","native","page","url"]);
const DATA_SOURCES = new Set(["manual","exam_families","test_series","managed_pages"]);
const STYLES = new Set(["default","compact","image","minimal","featured"]);
const GAPS = new Set(["compact","normal","relaxed"]);
const ENTITY_TYPES = new Set(["none","exam_family","exam","test_series"]);

function text(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function integer(value: unknown, fallback: number, min: number, max: number): number {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}
function slug(value: unknown): string {
  const raw = text(value, 80).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return raw.slice(0, 60);
}
function normalizeDestination(raw: Record<string, unknown>) {
  const destinationType = text(raw.destinationType, 40) || "none";
  return {
    destinationType: DESTINATIONS.has(destinationType) ? destinationType : "none",
    destinationValue: text(raw.destinationValue, 1000),
  };
}
function normalizeCard(value: unknown, index: number) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    id: text(raw.id, 80) || randomUUID(),
    title: text(raw.title, 140),
    subtitle: text(raw.subtitle, 280),
    badge: text(raw.badge, 60),
    iconName: text(raw.iconName, 80),
    iconUrl: text(raw.iconUrl, 1000),
    imageUrl: text(raw.imageUrl, 1000),
    ctaLabel: text(raw.ctaLabel, 60),
    ...normalizeDestination(raw),
    span: integer(raw.span, 1, 1, 4),
    style: STYLES.has(text(raw.style, 30)) ? text(raw.style, 30) : "default",
    isActive: raw.isActive !== false,
    sortOrder: integer(raw.sortOrder, index + 1, 1, 500),
  };
}
function normalizeHero(value: unknown) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    enabled: raw.enabled === true,
    title: text(raw.title, 140),
    subtitle: text(raw.subtitle, 400),
    badge: text(raw.badge, 60),
    imageUrl: text(raw.imageUrl, 1000),
    iconUrl: text(raw.iconUrl, 1000),
    ctaLabel: text(raw.ctaLabel, 60),
    ...normalizeDestination(raw),
    style: STYLES.has(text(raw.style, 30)) ? text(raw.style, 30) : "featured",
  };
}
function normalizeSection(value: unknown, index: number) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const layout = text(raw.layout, 40) || "horizontal";
  const dataSource = text(raw.dataSource, 40) || "manual";
  return {
    id: text(raw.id, 80) || randomUUID(),
    title: text(raw.title, 140) || "Untitled section",
    subtitle: text(raw.subtitle, 280),
    iconName: text(raw.iconName, 80),
    iconUrl: text(raw.iconUrl, 1000),
    layout: LAYOUTS.has(layout) ? layout : "horizontal",
    columns: integer(raw.columns, 2, 1, 4),
    gap: GAPS.has(text(raw.gap, 30)) ? text(raw.gap, 30) : "normal",
    style: STYLES.has(text(raw.style, 30)) ? text(raw.style, 30) : "default",
    dataSource: DATA_SOURCES.has(dataSource) ? dataSource : "manual",
    dataLimit: integer(raw.dataLimit, 24, 1, 100),
    sourceParentSlug: slug(raw.sourceParentSlug),
    isVisible: raw.isVisible !== false,
    sortOrder: integer(raw.sortOrder, index + 1, 1, 500),
    cards: Array.isArray(raw.cards) ? raw.cards.slice(0, 100).map(normalizeCard) : [],
  };
}
function normalizeConfiguration(value: unknown) {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const entityType = text(raw.entityType, 40) || "none";
  return {
    parentSlug: slug(raw.parentSlug),
    entityType: ENTITY_TYPES.has(entityType) ? entityType : "none",
    entityId: text(raw.entityId, 100),
    hero: normalizeHero(raw.hero),
    sections: Array.isArray(raw.sections) ? raw.sections.slice(0, 60).map(normalizeSection) : [],
  };
}

router.get("/", requireAdminPermission("content.taxonomy.read"), async (_req, res) => {
  const [pages, examFamilies, testSeries, exams] = await Promise.all([
    sqlClient`
      SELECT id::text AS id, slug, title, description, native_route AS "nativeRoute",
             render_mode AS "renderMode", icon_name AS "iconName", is_active AS "isActive",
             show_app_bar AS "showAppBar", configuration, sort_order AS "sortOrder",
             updated_at AS "updatedAt", updated_by AS "updatedBy"
      FROM platform.mobile_pages
      ORDER BY sort_order, title
    `,
    sqlClient`
      SELECT id::text AS id, code, name, description
      FROM catalog.exam_families
      WHERE is_active=true
      ORDER BY name
    `,
    sqlClient`
      SELECT s.id::text AS id,s.code,s.name,e.name AS "examName"
      FROM assessment.test_series s
      JOIN catalog.exam_versions ev ON ev.id=s.exam_version_id
      JOIN catalog.exams e ON e.id=ev.exam_id
      WHERE s.deleted_at IS NULL
      ORDER BY s.updated_at DESC,s.name
      LIMIT 500
    `,
    sqlClient`
      SELECT e.id::text AS id,e.code,e.name,f.name AS "familyName"
      FROM catalog.exams e
      JOIN catalog.exam_families f ON f.id=e.family_id
      WHERE e.is_active=true AND f.is_active=true
      ORDER BY f.name,e.name
      LIMIT 1000
    `,
  ]);
  res.json({
    pages: pages.map((page) => ({ ...page, configuration: normalizeConfiguration(page.configuration) })),
    catalog: { examFamilies, testSeries, exams },
  });
});

router.post("/", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const pageSlug = slug(req.body?.slug);
  const title = text(req.body?.title, 140);
  if (!pageSlug || !title) {
    res.status(400).json({ error: "Page name and slug are required." });
    return;
  }
  try {
    const configuration = normalizeConfiguration({
      parentSlug: req.body?.parentSlug,
      entityType: req.body?.entityType,
      entityId: req.body?.entityId,
      hero: {},
      sections: [],
    });
    const rows = await sqlClient`
      INSERT INTO platform.mobile_pages
        (slug,title,description,native_route,render_mode,icon_name,is_active,show_app_bar,configuration,sort_order,created_by,updated_by)
      VALUES
        (${pageSlug},${title},${text(req.body?.description,280)},NULL,'managed',${text(req.body?.iconName,80)},true,true,
         ${sqlClient.json(configuration)},
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
        sort_order=${integer(req.body?.sortOrder,0,0,10000)},
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
