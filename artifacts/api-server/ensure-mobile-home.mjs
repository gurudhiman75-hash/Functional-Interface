import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for production schema bootstrap");
}

const here = path.dirname(fileURLToPath(import.meta.url));
const homeMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-home-configuration.sql");
const promotionsMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-promotions.sql");
const promotionsV2MigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-02-mobile-promotions-v2.sql");
const firstPromotionMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-02-first-live-promotion.sql");
const notificationsMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-notifications.sql");
const contentPlanningMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-content-planning.sql");
const appConfigurationMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-app-configuration.sql");
const analyticsMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-analytics.sql");
const mediaMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-media-assets.sql");
const pagesMigrationPath = path.resolve(here, "../../docs/database-migrations/2026-10-01-mobile-pages.sql");
const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  prepare: false,
});

try {
  const [before] = await sql`
    SELECT to_regclass('platform.mobile_home_configuration')::text AS mobile_home_configuration
  `;

  if (before?.mobile_home_configuration) {
    console.log("[render-build] mobile home configuration schema already present");
  } else {
    console.log("[render-build] mobile home configuration schema missing; applying checked-in migration");
    const migrationSql = await readFile(homeMigrationPath, "utf8");
    await sql.unsafe(migrationSql);
  }

  const [after] = await sql`
    SELECT to_regclass('platform.mobile_home_configuration')::text AS mobile_home_configuration
  `;

  if (!after?.mobile_home_configuration) {
    throw new Error("Mobile Home migration completed without creating platform.mobile_home_configuration");
  }

  console.log("[render-build] mobile home configuration schema verified");
  const [pagesBefore] = await sql`
    SELECT to_regclass('platform.mobile_pages')::text AS mobile_pages
  `;
  if (!pagesBefore?.mobile_pages) {
    console.log("[render-build] mobile pages schema missing; applying checked-in migration");
    await sql.unsafe(await readFile(pagesMigrationPath, "utf8"));
  }
  const [pagesAfter] = await sql`
    SELECT to_regclass('platform.mobile_pages')::text AS mobile_pages
  `;
  if (!pagesAfter?.mobile_pages) {
    throw new Error("Mobile pages migration completed without creating platform.mobile_pages");
  }
  console.log("[render-build] mobile pages schema verified");


  const [promotionsBefore] = await sql`
    SELECT to_regclass('platform.mobile_promotions')::text AS mobile_promotions
  `;
  if (!promotionsBefore?.mobile_promotions) {
    console.log("[render-build] mobile promotions schema missing; applying checked-in migration");
    const promotionsSql = await readFile(promotionsMigrationPath, "utf8");
    await sql.unsafe(promotionsSql);
  }
  const [promotionsAfter] = await sql`
    SELECT to_regclass('platform.mobile_promotions')::text AS mobile_promotions
  `;
  if (!promotionsAfter?.mobile_promotions) {
    throw new Error("Mobile promotions migration completed without creating platform.mobile_promotions");
  }
  console.log("[render-build] mobile promotions schema verified");
  const [promotionsV2Before] = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema='platform'
        AND table_name='mobile_promotions'
        AND column_name='cta_label'
    ) AS has_cta_label
  `;
  if (!promotionsV2Before?.has_cta_label) {
    console.log("[render-build] mobile promotions v2 schema missing; applying checked-in migration");
    await sql.unsafe(await readFile(promotionsV2MigrationPath, "utf8"));
  }
  const [promotionsV2After] = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema='platform'
        AND table_name='mobile_promotions'
        AND column_name='cta_label'
    ) AS has_cta_label
  `;
  if (!promotionsV2After?.has_cta_label) {
    throw new Error("Mobile promotions v2 migration completed without cta_label");
  }
  console.log("[render-build] mobile promotions v2 schema verified");
  const [firstPromotionBefore] = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM platform.mobile_promotions
      WHERE id='7f9e7e53-7b75-4dd8-8d79-6e32d8c90d01'::uuid
    ) AS present
  `;
  if (!firstPromotionBefore?.present) {
    console.log("[render-build] first live mobile promotion missing; applying checked-in seed");
    await sql.unsafe(await readFile(firstPromotionMigrationPath, "utf8"));
  }
  const [firstPromotionAfter] = await sql`
    SELECT is_active AS active,placement,destination_type AS destination_type,destination_value AS destination_value
    FROM platform.mobile_promotions
    WHERE id='7f9e7e53-7b75-4dd8-8d79-6e32d8c90d01'::uuid
  `;
  if (!firstPromotionAfter?.active || firstPromotionAfter?.placement !== "login_popup") {
    throw new Error("First live mobile promotion seed verification failed");
  }
  console.log("[render-build] first live mobile promotion verified");



  const [notificationsBefore] = await sql`
    SELECT
      to_regclass('platform.mobile_push_devices')::text AS mobile_push_devices,
      to_regclass('platform.mobile_notification_campaigns')::text AS mobile_notification_campaigns,
      to_regclass('platform.mobile_notification_deliveries')::text AS mobile_notification_deliveries
  `;
  if (!notificationsBefore?.mobile_push_devices || !notificationsBefore?.mobile_notification_campaigns || !notificationsBefore?.mobile_notification_deliveries) {
    console.log("[render-build] mobile notifications schema missing; applying checked-in migration");
    const notificationsSql = await readFile(notificationsMigrationPath, "utf8");
    await sql.unsafe(notificationsSql);
  }
  const [notificationsAfter] = await sql`
    SELECT
      to_regclass('platform.mobile_push_devices')::text AS mobile_push_devices,
      to_regclass('platform.mobile_notification_campaigns')::text AS mobile_notification_campaigns,
      to_regclass('platform.mobile_notification_deliveries')::text AS mobile_notification_deliveries
  `;
  if (!notificationsAfter?.mobile_push_devices || !notificationsAfter?.mobile_notification_campaigns || !notificationsAfter?.mobile_notification_deliveries) {
    throw new Error("Mobile notifications migration completed without creating all required tables");
  }
  console.log("[render-build] mobile notifications schema verified");

  const [contentPlanningBefore] = await sql`
    SELECT to_regclass('platform.mobile_content_plan_items')::text AS mobile_content_plan_items
  `;
  if (!contentPlanningBefore?.mobile_content_plan_items) {
    console.log("[render-build] mobile content planning schema missing; applying checked-in migration");
    const contentPlanningSql = await readFile(contentPlanningMigrationPath, "utf8");
    await sql.unsafe(contentPlanningSql);
  }
  const [contentPlanningAfter] = await sql`
    SELECT to_regclass('platform.mobile_content_plan_items')::text AS mobile_content_plan_items
  `;
  if (!contentPlanningAfter?.mobile_content_plan_items) {
    throw new Error("Mobile content planning migration completed without creating platform.mobile_content_plan_items");
  }
  console.log("[render-build] mobile content planning schema verified");

  const [appConfigBefore] = await sql`
    SELECT to_regclass('platform.mobile_app_configuration')::text AS mobile_app_configuration
  `;
  if (!appConfigBefore?.mobile_app_configuration) {
    console.log("[render-build] mobile app configuration schema missing; applying checked-in migration");
    const appConfigSql = await readFile(appConfigurationMigrationPath, "utf8");
    await sql.unsafe(appConfigSql);
  }
  const [appConfigAfter] = await sql`
    SELECT to_regclass('platform.mobile_app_configuration')::text AS mobile_app_configuration
  `;
  if (!appConfigAfter?.mobile_app_configuration) {
    throw new Error("Mobile app configuration migration completed without creating platform.mobile_app_configuration");
  }
  console.log("[render-build] mobile app configuration schema verified");

  const [analyticsBefore] = await sql`
    SELECT to_regclass('platform.mobile_analytics_events')::text AS mobile_analytics_events
  `;
  if (!analyticsBefore?.mobile_analytics_events) {
    console.log("[render-build] mobile analytics schema missing; applying checked-in migration");
    const analyticsSql = await readFile(analyticsMigrationPath, "utf8");
    await sql.unsafe(analyticsSql);
  }
  const [analyticsAfter] = await sql`
    SELECT to_regclass('platform.mobile_analytics_events')::text AS mobile_analytics_events
  `;
  if (!analyticsAfter?.mobile_analytics_events) {
    throw new Error("Mobile analytics migration completed without creating platform.mobile_analytics_events");
  }
  console.log("[render-build] mobile analytics schema verified");

  const [mediaBefore] = await sql`
    SELECT to_regclass('platform.media_assets')::text AS media_assets
  `;
  if (!mediaBefore?.media_assets) {
    console.log("[render-build] media assets schema missing; applying checked-in migration");
    const mediaSql = await readFile(mediaMigrationPath, "utf8");
    await sql.unsafe(mediaSql);
  }
  const [mediaAfter] = await sql`
    SELECT to_regclass('platform.media_assets')::text AS media_assets
  `;
  if (!mediaAfter?.media_assets) {
    throw new Error("Media assets migration completed without creating platform.media_assets");
  }
  console.log("[render-build] media assets schema verified");
} finally {
  await sql.end({ timeout: 5 });
}
