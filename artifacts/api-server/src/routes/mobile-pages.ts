import { Router } from "express";
import { sqlClient } from "../lib/db";

const router = Router();

type JsonRecord = Record<string, unknown>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonRecord : {};
}
function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

async function enrichConfiguration(configurationValue: unknown) {
  const configuration = asRecord(configurationValue);
  const sections = Array.isArray(configuration.sections) ? configuration.sections : [];
  const pageRows = await sqlClient`
    SELECT slug,title,description,configuration
    FROM platform.mobile_pages
    WHERE is_active=true
  `;
  const pageByEntity = new Map<string, { slug: string; title: string }>();
  const managedChildren = new Map<string, Array<{ slug: string; title: string; description: string }>>();
  for (const row of pageRows) {
    const cfg = asRecord(row.configuration);
    const entityType = text(cfg.entityType);
    const entityId = text(cfg.entityId);
    if (entityType && entityType !== "none" && entityId) {
      pageByEntity.set(`${entityType}:${entityId}`, { slug: String(row.slug), title: String(row.title) });
    }
    const parentSlug = text(cfg.parentSlug);
    if (parentSlug) {
      const items = managedChildren.get(parentSlug) ?? [];
      items.push({ slug: String(row.slug), title: String(row.title), description: String(row.description ?? "") });
      managedChildren.set(parentSlug, items);
    }
  }

  const enrichedSections = [];
  for (const sectionValue of sections) {
    const section = asRecord(sectionValue);
    const dataSource = text(section.dataSource) || "manual";
    const limit = Math.max(1, Math.min(100, Number(section.dataLimit) || 24));
    let cards = Array.isArray(section.cards) ? section.cards : [];

    if (dataSource === "exam_families") {
      const rows = await sqlClient`
        SELECT id::text AS id, code, name, description
        FROM catalog.exam_families
        WHERE is_active=true
        ORDER BY name
        LIMIT ${limit}
      `;
      cards = rows.map((row, index) => {
        const bound = pageByEntity.get(`exam_family:${String(row.id)}`);
        return {
          id: `family-${row.id}`,
          title: row.name,
          subtitle: row.description ?? "",
          badge: "",
          iconName: "government",
          iconUrl: "",
          imageUrl: "",
          ctaLabel: "Explore",
          destinationType: bound ? "page" : "exam_family",
          destinationValue: bound?.slug ?? String(row.id),
          span: 1,
          style: "default",
          isActive: true,
          sortOrder: index + 1,
        };
      });
    } else if (dataSource === "test_series") {
      const rows = await sqlClient`
        SELECT s.id::text AS id,s.name,e.name AS "examName"
        FROM assessment.test_series s
        JOIN catalog.exam_versions ev ON ev.id=s.exam_version_id
        JOIN catalog.exams e ON e.id=ev.exam_id
        WHERE s.deleted_at IS NULL
        ORDER BY s.updated_at DESC,s.name
        LIMIT ${limit}
      `;
      cards = rows.map((row, index) => ({
        id: `series-${row.id}`,
        title: row.name,
        subtitle: row.examName ?? "",
        badge: "Test series",
        iconName: "test",
        iconUrl: "",
        imageUrl: "",
        ctaLabel: "Open",
        destinationType: "test_series",
        destinationValue: String(row.id),
        span: 1,
        style: "default",
        isActive: true,
        sortOrder: index + 1,
      }));
    } else if (dataSource === "managed_pages") {
      const parentSlug = text(section.sourceParentSlug);
      const items = (managedChildren.get(parentSlug) ?? []).slice(0, limit);
      cards = items.map((item, index) => ({
        id: `page-${item.slug}`,
        title: item.title,
        subtitle: item.description,
        badge: "",
        iconName: "grid",
        iconUrl: "",
        imageUrl: "",
        ctaLabel: "Open",
        destinationType: "page",
        destinationValue: item.slug,
        span: 1,
        style: "default",
        isActive: true,
        sortOrder: index + 1,
      }));
    }
    enrichedSections.push({ ...section, cards });
  }
  return { ...configuration, sections: enrichedSections };
}

async function decorateRows(rows: Record<string, unknown>[]) {
  return Promise.all(rows.map(async (row) => ({
    ...row,
    configuration: await enrichConfiguration(row.configuration),
  })));
}

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
  const decorated = await decorateRows(rows as Record<string, unknown>[]);
  res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  res.json({ page: decorated[0], generatedAt: new Date().toISOString() });
});

export default router;
