import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();

const ALLOWED_SECTIONS = ["hero", "exam_categories", "featured_test_series", "continue_learning"] as const;
const DESTINATION_TYPES = new Set(["exam", "test_series", "learn", "url", "none"]);

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  destinationType: string;
  destinationValue: string;
  isActive: boolean;
  startAt: string | null;
  endAt: string | null;
  sortOrder: number;
};

function text(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function ids(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of value) {
    const id = text(item, 80);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result.slice(0, 24);
}

function dateOrNull(value: unknown): string | null {
  const raw = text(value, 80);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normalizeSlide(input: unknown, index: number): HeroSlide {
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const destinationType = text(raw.destinationType, 40) || "none";
  return {
    id: text(raw.id, 80) || randomUUID(),
    title: text(raw.title, 140),
    subtitle: text(raw.subtitle, 280),
    imageUrl: text(raw.imageUrl, 1000),
    ctaLabel: text(raw.ctaLabel, 60),
    destinationType: DESTINATION_TYPES.has(destinationType) ? destinationType : "none",
    destinationValue: text(raw.destinationValue, 1000),
    isActive: raw.isActive !== false,
    startAt: dateOrNull(raw.startAt),
    endAt: dateOrNull(raw.endAt),
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Math.max(0, Math.min(999, Number(raw.sortOrder))) : index + 1,
  };
}

function normalizeConfiguration(input: unknown) {
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const heroSlides = Array.isArray(raw.heroSlides)
    ? raw.heroSlides.slice(0, 20).map(normalizeSlide).filter((slide) => slide.title.length >= 2)
    : [];
  const requestedOrder = Array.isArray(raw.sectionOrder) ? raw.sectionOrder.map((value) => text(value, 50)) : [];
  const sectionOrder = [
    ...requestedOrder.filter((value, index) => (ALLOWED_SECTIONS as readonly string[]).includes(value) && requestedOrder.indexOf(value) === index),
    ...ALLOWED_SECTIONS.filter((value) => !requestedOrder.includes(value)),
  ];
  return {
    heroSlides: heroSlides.sort((a, b) => a.sortOrder - b.sortOrder),
    featuredExamFamilyIds: ids(raw.featuredExamFamilyIds),
    featuredTestSeriesIds: ids(raw.featuredTestSeriesIds),
    sectionOrder,
  };
}

async function ensureReferences(configuration: ReturnType<typeof normalizeConfiguration>) {
  if (configuration.featuredExamFamilyIds.length > 0) {
    const rows = await sqlClient`SELECT id::text AS id FROM catalog.exam_families WHERE id = ANY(${configuration.featuredExamFamilyIds}::uuid[]) AND is_active = true`;
    const found = new Set(rows.map((row) => String(row.id)));
    const missing = configuration.featuredExamFamilyIds.filter((id) => !found.has(id));
    if (missing.length > 0) throw Object.assign(new Error("One or more featured exam categories are unavailable."), { statusCode: 409, code: "MOBILE_HOME_EXAM_REFERENCE_INVALID" });
  }
  if (configuration.featuredTestSeriesIds.length > 0) {
    const rows = await sqlClient`SELECT id::text AS id FROM assessment.test_series WHERE id = ANY(${configuration.featuredTestSeriesIds}::uuid[]) AND deleted_at IS NULL`;
    const found = new Set(rows.map((row) => String(row.id)));
    const missing = configuration.featuredTestSeriesIds.filter((id) => !found.has(id));
    if (missing.length > 0) throw Object.assign(new Error("One or more featured test series are unavailable."), { statusCode: 409, code: "MOBILE_HOME_SERIES_REFERENCE_INVALID" });
  }
}

async function loadConfiguration() {
  const rows = await sqlClient`
    SELECT configuration, updated_at AS "updatedAt", updated_by::text AS "updatedBy"
    FROM platform.mobile_home_configuration
    WHERE singleton_key = 'default'
    LIMIT 1
  `;
  return rows[0] ?? { configuration: normalizeConfiguration({}), updatedAt: null, updatedBy: null };
}

router.use(authenticate);

router.get("/", requireAdminPermission("content.taxonomy.read"), async (_req, res) => {
  try {
    const [record, examFamilies, testSeries] = await Promise.all([
      loadConfiguration(),
      sqlClient`
        SELECT id::text AS id, code, name, description
        FROM catalog.exam_families
        WHERE is_active = true
        ORDER BY name
      `,
      sqlClient`
        SELECT
          s.id::text AS id,
          s.code,
          s.name,
          s.current_version_number AS "currentVersionNumber",
          e.name AS "examName"
        FROM assessment.test_series s
        JOIN catalog.exam_versions ev ON ev.id = s.exam_version_id
        JOIN catalog.exams e ON e.id = ev.exam_id
        WHERE s.deleted_at IS NULL
        ORDER BY s.updated_at DESC, s.name
        LIMIT 250
      `,
    ]);
    res.json({
      configuration: normalizeConfiguration(record.configuration),
      catalog: { examFamilies, testSeries },
      updatedAt: record.updatedAt,
      updatedBy: record.updatedBy,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Unable to load mobile home configuration", error);
    res.status(500).json({ error: "Unable to load mobile home configuration", code: "MOBILE_HOME_LOAD_FAILED" });
  }
});

router.put("/", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  try {
    const configuration = normalizeConfiguration(req.body?.configuration ?? req.body);
    await ensureReferences(configuration);
    const actorUserId = req.adminSession!.user.id;
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO platform.mobile_home_configuration (singleton_key, configuration, updated_by, updated_at)
        VALUES ('default', ${tx.json(configuration)}, ${actorUserId}::uuid, now())
        ON CONFLICT (singleton_key) DO UPDATE
        SET configuration = EXCLUDED.configuration,
            updated_by = EXCLUDED.updated_by,
            updated_at = EXCLUDED.updated_at
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, reason, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'mobile.home.configuration.updated',
          'mobile_home_configuration',
          NULL,
          'Updated mobile app home configuration',
          'Admin saved the mobile homepage presentation configuration',
          ${tx.json({
            heroSlideCount: configuration.heroSlides.length,
            featuredExamFamilyCount: configuration.featuredExamFamilyIds.length,
            featuredTestSeriesCount: configuration.featuredTestSeriesIds.length,
            sectionOrder: configuration.sectionOrder,
          })}
        )
      `;
    });
    res.json({ configuration, updatedAt: new Date().toISOString() });
  } catch (error) {
    const typed = error as { statusCode?: number; code?: string; message?: string };
    console.error("Unable to update mobile home configuration", error);
    res.status(typed.statusCode ?? 500).json({
      error: typed.message ?? "Unable to update mobile home configuration",
      code: typed.code ?? "MOBILE_HOME_UPDATE_FAILED",
    });
  }
});

export default router;
