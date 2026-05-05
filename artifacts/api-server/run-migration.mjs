import postgres from 'postgres';

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error("DATABASE_URL environment variable is required");
const sql = postgres(DB_URL);

console.log('Running bilingual migration...');
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS text_hi TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS options_hi JSONB`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_hi TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS text_pa TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS options_pa JSONB`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_pa TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS seating_diagram JSONB`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS seating_explanation_flow JSONB`;
await sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS languages JSONB`;
await sql`ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS languages JSONB`;
console.log('Migration complete — all bilingual columns added.');

console.log('Adding topic column to questions...');
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS topic TEXT NOT NULL DEFAULT 'General'`;
console.log('✓ questions.topic column');

console.log('Running sections/topics FK migration on questions...');
await sql`
  CREATE TABLE IF NOT EXISTS sections (
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS topics (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    UNIQUE(section_id, name)
  )
`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS section_id TEXT REFERENCES sections(id) ON DELETE SET NULL`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS topic_id   TEXT REFERENCES topics(id)  ON DELETE SET NULL`;
await sql`CREATE INDEX IF NOT EXISTS questions_section_id_idx ON questions(section_id)`;
await sql`CREATE INDEX IF NOT EXISTS questions_topic_id_idx   ON questions(topic_id)`;
console.log('✓ questions.section_id / topic_id FKs');

console.log('Running topic_id/topic_name migration on tests...');
await sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS topic_id   TEXT REFERENCES topics(id) ON DELETE SET NULL`;
await sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS topic_name TEXT`;
console.log('✓ tests.topic_id / topic_name columns');

console.log('Running generation_jobs migration...');
await sql`
  CREATE TABLE IF NOT EXISTS generation_jobs (
    id                   TEXT PRIMARY KEY,
    status               TEXT NOT NULL DEFAULT 'queued',
    pattern_id           TEXT,
    pattern_snapshot     JSONB NOT NULL,
    request_payload      JSONB NOT NULL,
    result_payload       JSONB,
    generation_metadata  JSONB,
    error_message        TEXT,
    queued_at            TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at           TIMESTAMP,
    completed_at         TIMESTAMP,
    updated_at           TIMESTAMP NOT NULL DEFAULT NOW()
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS generation_jobs_status_queued_at_idx
  ON generation_jobs(status, queued_at)
`;
console.log('âœ“ generation_jobs');

console.log('Running reasoning_scenario_cache migration...');
await sql`
  CREATE TABLE IF NOT EXISTS reasoning_scenario_cache (
    key                  TEXT PRIMARY KEY,
    pattern_id           TEXT,
    generation_domain    TEXT,
    generator_version    TEXT NOT NULL,
    motif_version        TEXT NOT NULL,
    topology_version     TEXT NOT NULL,
    request_fingerprint  TEXT NOT NULL,
    payload              JSONB NOT NULL,
    artifact_metadata    JSONB,
    created_at           TIMESTAMP NOT NULL DEFAULT NOW(),
    last_accessed_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    hit_count            INTEGER NOT NULL DEFAULT 0
  )
`;
await sql`
  CREATE INDEX IF NOT EXISTS reasoning_scenario_cache_pattern_id_idx
  ON reasoning_scenario_cache(pattern_id)
`;
await sql`
  CREATE INDEX IF NOT EXISTS reasoning_scenario_cache_domain_pattern_idx
  ON reasoning_scenario_cache(generation_domain, pattern_id)
`;
console.log('âœ“ reasoning_scenario_cache');

await sql.end();
process.exit(0);
