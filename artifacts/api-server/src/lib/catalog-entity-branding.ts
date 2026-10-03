import { sqlClient } from "./db";

export const CATALOG_BRANDING_ENTITY_TYPES = [
  "exam_family",
  "exam",
  "test_series",
  "test",
] as const;

export type CatalogBrandingEntityType = typeof CATALOG_BRANDING_ENTITY_TYPES[number];

let schemaPromise: Promise<void> | null = null;

export function isCatalogBrandingEntityType(value: string): value is CatalogBrandingEntityType {
  return (CATALOG_BRANDING_ENTITY_TYPES as readonly string[]).includes(value);
}

export function ensureCatalogBrandingSchema(): Promise<void> {
  schemaPromise ??= (async () => {
    await sqlClient`CREATE TABLE IF NOT EXISTS platform.catalog_entity_branding (
      entity_type text NOT NULL CHECK (entity_type IN ('exam_family','exam','test_series','test')),
      entity_id uuid NOT NULL,
      icon_name text NULL,
      icon_url text NULL,
      image_url text NULL,
      updated_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (entity_type, entity_id)
    )`;
    await sqlClient`CREATE INDEX IF NOT EXISTS catalog_entity_branding_updated_idx
      ON platform.catalog_entity_branding (updated_at DESC)`;
  })();
  return schemaPromise;
}

export async function readCatalogBranding(entityType: CatalogBrandingEntityType, entityId: string) {
  await ensureCatalogBrandingSchema();
  const rows = await sqlClient`
    SELECT
      entity_type AS "entityType",
      entity_id::text AS "entityId",
      COALESCE(icon_name, '') AS "iconName",
      COALESCE(icon_url, '') AS "iconUrl",
      COALESCE(image_url, '') AS "imageUrl",
      updated_at AS "updatedAt"
    FROM platform.catalog_entity_branding
    WHERE entity_type = ${entityType}
      AND entity_id = ${entityId}::uuid
    LIMIT 1
  `;
  return rows[0] ?? {
    entityType,
    entityId,
    iconName: "",
    iconUrl: "",
    imageUrl: "",
    updatedAt: null,
  };
}
