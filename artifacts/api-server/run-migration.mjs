import postgres from 'postgres';

const DB_URL = process.env.DATABASE_URL ?? 'postgresql://neondb_owner:npg_jrClF89HhBNc@ep-royal-lake-an4mjn23-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = postgres(DB_URL);

console.log('Running bilingual migration...');
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS text_hi TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS options_hi JSONB`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_hi TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS text_pa TEXT`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS options_pa JSONB`;
await sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_pa TEXT`;
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

await sql.end();
process.exit(0);
