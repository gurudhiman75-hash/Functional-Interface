import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { cacheDel } from "../lib/cache";
import {
  ensureCatalogBrandingSchema,
  isCatalogBrandingEntityType,
  readCatalogBranding,
} from "../lib/catalog-entity-branding";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: unknown, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validAssetUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

router.use(authenticate);

router.get("/:entityType/:entityId", requireAdminPermission("content.taxonomy.read"), async (req, res) => {
  const entityType = text(req.params.entityType, 40);
  const entityId = text(req.params.entityId, 80);
  if (!isCatalogBrandingEntityType(entityType) || !uuid.test(entityId)) {
    return void res.status(400).json({ error: "Invalid branding target", code: "CATALOG_BRANDING_TARGET_INVALID" });
  }
  try {
    if (entityType === "test") await cacheDel("tests:list:canonical-mobile-v2");
    res.json(await readCatalogBranding(entityType, entityId));
  } catch (error) {
    console.error("Unable to load catalog branding", error);
    res.status(500).json({ error: "Unable to load catalog branding", code: "CATALOG_BRANDING_LOAD_FAILED" });
  }
});

router.patch("/:entityType/:entityId", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const entityType = text(req.params.entityType, 40);
  const entityId = text(req.params.entityId, 80);
  const iconName = text(req.body?.iconName, 120);
  const iconUrl = text(req.body?.iconUrl, 2000);
  const imageUrl = text(req.body?.imageUrl, 2000);
  const reason = text(req.body?.reason, 1000);
  if (!isCatalogBrandingEntityType(entityType) || !uuid.test(entityId)) {
    return void res.status(400).json({ error: "Invalid branding target", code: "CATALOG_BRANDING_TARGET_INVALID" });
  }
  if (!validAssetUrl(iconUrl) || !validAssetUrl(imageUrl)) {
    return void res.status(400).json({ error: "Icon and image URLs must be valid HTTP(S) URLs", code: "CATALOG_BRANDING_URL_INVALID" });
  }
  if (reason.length < 3) {
    return void res.status(400).json({ error: "A short change reason is required", code: "CATALOG_BRANDING_REASON_REQUIRED" });
  }

  try {
    await ensureCatalogBrandingSchema();
    const actor = req.adminSession!.user.id;
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO platform.catalog_entity_branding
          (entity_type, entity_id, icon_name, icon_url, image_url, updated_by, updated_at)
        VALUES (
          ${entityType},
          ${entityId}::uuid,
          ${iconName || null},
          ${iconUrl || null},
          ${imageUrl || null},
          ${actor}::uuid,
          now()
        )
        ON CONFLICT (entity_type, entity_id)
        DO UPDATE SET
          icon_name = EXCLUDED.icon_name,
          icon_url = EXCLUDED.icon_url,
          image_url = EXCLUDED.image_url,
          updated_by = EXCLUDED.updated_by,
          updated_at = now()
      `;
      await tx`
        INSERT INTO platform.audit_events
          (id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, reason, metadata)
        VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actor}::uuid,
          'catalog.branding.updated',
          ${entityType},
          ${entityId}::uuid,
          ${`Updated catalog branding for ${entityType}`},
          ${reason},
          ${tx.json({ iconName, iconUrl, imageUrl })}
        )
      `;
    });
    res.json(await readCatalogBranding(entityType, entityId));
  } catch (error) {
    console.error("Unable to update catalog branding", error);
    res.status(500).json({ error: "Unable to update catalog branding", code: "CATALOG_BRANDING_UPDATE_FAILED" });
  }
});

export default router;
