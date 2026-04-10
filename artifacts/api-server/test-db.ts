import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

const sql = postgres(connectionString);

async function testConnection() {
  try {
    console.log("Testing database connection...");
    const result = await sql`SELECT 1 as test`;
    console.log("Connection successful:", result);

    // Create tables
    console.log("Creating tables...");
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        tests_count INTEGER NOT NULL DEFAULT 0
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        duration INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        attempts INTEGER NOT NULL DEFAULT 0,
        avg_score REAL NOT NULL DEFAULT 0,
        difficulty TEXT NOT NULL,
        section_timing_mode TEXT DEFAULT 'none',
        section_timings JSONB,
        section_settings JSONB,
        sections JSONB NOT NULL
      );
    `;

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await sql.end();
  }
}

testConnection();