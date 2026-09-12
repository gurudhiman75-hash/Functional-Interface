import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Current Affairs schema bootstrap");
}

const migrationFiles = [
  "20260828_current_affairs_studio.sql",
  "20260829_current_affairs_ingestion.sql",
  "20260829_current_affairs_intelligence.sql",
  "20260829_current_affairs_content.sql",
  "20260829_current_affairs_automation.sql",
  "20260829_current_affairs_daily_orchestration.sql",
  "20260829_current_affairs_official_sources.sql",
  "20260829_current_affairs_primary_fact_enrichment.sql",
  "20260829_current_affairs_primary_fact_event_bridge.sql",
  "20260829_current_affairs_original_authoring.sql",
  "20260829_current_affairs_authoring_gate.sql",
  "20260829_current_affairs_multilingual_notes.sql",
  "20260829_current_affairs_multilingual_question_drafts.sql",
  "20260829_current_affairs_story_threads.sql",
  "20260829_current_affairs_editorial_release.sql",
  "20260829_current_affairs_question_bank_promotion.sql",
  "20260829_current_affairs_quiz_delivery.sql",
  "20260829_current_affairs_spaced_repetition.sql",
  "20260830_current_affairs_personalization.sql",
  "20260830_current_affairs_inapp_notifications.sql",
  "20260830_current_affairs_question_editorial_guard.sql",
  "20260830_current_affairs_production_ops.sql",
  "20260831_current_affairs_primary_source_recovery.sql",
  "20260831_current_affairs_source_families_discovery.sql",
  "20260831_current_affairs_punjab_official_resilience.sql",
  "20260831_current_affairs_daily_discovery_census.sql",
  "20260831_current_affairs_open_news_discovery.sql",
  "20260901_current_affairs_master_pack_editorial_approval.sql",
  "20260903_current_affairs_selected_processing_runs.sql",
  "20260905_current_affairs_selected_processing_localization_method.sql",
];

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(here, "migrations");
const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 20,
  idle_timeout: 5,
  prepare: false,
});

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

try {
  await sql`SELECT pg_advisory_lock(hashtext('examtree-current-affairs-schema-bootstrap'))`;
  await sql`CREATE SCHEMA IF NOT EXISTS platform`;
  await sql`
    CREATE TABLE IF NOT EXISTS platform.current_affairs_schema_migrations (
      filename TEXT PRIMARY KEY,
      content_sha256 TEXT NOT NULL CHECK (content_sha256 ~ '^[0-9a-f]{64}$'),
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  for (const filename of migrationFiles) {
    const migrationSql = await readFile(path.join(migrationsDir, filename), "utf8");
    const digest = sha256(migrationSql);
    const [existing] = await sql`
      SELECT content_sha256 AS "contentSha256"
      FROM platform.current_affairs_schema_migrations
      WHERE filename = ${filename}
      LIMIT 1
    `;

    if (existing) {
      if (existing.contentSha256 !== digest) {
        throw new Error(`Current Affairs migration drift detected for ${filename}`);
      }
      console.log(`[render-build] Current Affairs migration already recorded: ${filename}`);
      continue;
    }

    console.log(`[render-build] applying Current Affairs migration: ${filename}`);
    await sql.begin(async (tx) => {
      await tx.unsafe(migrationSql);
      await tx`
        INSERT INTO platform.current_affairs_schema_migrations (filename, content_sha256)
        VALUES (${filename}, ${digest})
      `;
    });
  }

  const [verified] = await sql`
    SELECT
      to_regclass('content.current_affairs_sources')::text AS sources,
      to_regclass('content.current_affairs_events')::text AS events,
      to_regclass('content.current_affairs_compilations')::text AS compilations,
      to_regclass('content.current_affairs_ops_runs')::text AS ops_runs,
      to_regclass('content.current_affairs_daily_discovery_census')::text AS discovery_census,
      to_regclass('content.current_affairs_daily_master_packs')::text AS master_packs,
      to_regclass('content.current_affairs_daily_master_pack_approvals')::text AS master_pack_approvals,
      to_regclass('content.current_affairs_daily_master_pack_approval_packs')::text AS master_pack_approval_packs,
      to_regclass('content.current_affairs_selected_processing_runs')::text AS selected_processing_runs
  `;

  if (!verified?.sources || !verified?.events || !verified?.compilations || !verified?.ops_runs
    || !verified?.discovery_census || !verified?.master_packs
    || !verified?.master_pack_approvals || !verified?.master_pack_approval_packs
    || !verified?.selected_processing_runs) {
    throw new Error("Current Affairs schema bootstrap finished without all required production tables");
  }

  const [gdelt] = await sql`
    SELECT source_key, source_tier, ingestion_mode, is_primary_source, allow_raw_text_persistence
    FROM content.current_affairs_sources
    WHERE source_key='gdelt_open_news'
    LIMIT 1
  `;
  if (!gdelt
    || String(gdelt.source_tier) !== 'specialist'
    || String(gdelt.ingestion_mode) !== 'api'
    || Boolean(gdelt.is_primary_source)
    || Boolean(gdelt.allow_raw_text_persistence)) {
    throw new Error("Current Affairs open-news discovery provider did not bootstrap with the required non-primary metadata-only policy");
  }

  const [countRow] = await sql`
    SELECT count(*)::int AS count
    FROM platform.current_affairs_schema_migrations
  `;
  if (Number(countRow?.count ?? 0) < migrationFiles.length) {
    throw new Error("Current Affairs migration ledger is incomplete after bootstrap");
  }

  console.log(`[render-build] Current Affairs schema verified (${migrationFiles.length} migrations)`);
} finally {
  try {
    await sql`SELECT pg_advisory_unlock(hashtext('examtree-current-affairs-schema-bootstrap'))`;
  } catch {
    // Connection teardown releases the session-level advisory lock as a fallback.
  }
  await sql.end({ timeout: 5 });
}
