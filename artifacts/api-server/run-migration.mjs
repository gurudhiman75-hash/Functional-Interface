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
await sql.end();
process.exit(0);
