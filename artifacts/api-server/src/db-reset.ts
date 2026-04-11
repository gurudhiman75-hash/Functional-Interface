import { db } from "./lib/db";

async function resetDatabase() {
  try {
    console.log("Resetting database...");

    // Drop tables in correct order
    await db.execute(`DROP TABLE IF EXISTS "attempts"`);
    await db.execute(`DROP TABLE IF EXISTS "questions"`);
    await db.execute(`DROP TABLE IF EXISTS "tests"`);
    await db.execute(`DROP TABLE IF EXISTS "bundles"`);
    await db.execute(`DROP TABLE IF EXISTS "categories"`);
    await db.execute(`DROP TABLE IF EXISTS "users"`);

    console.log("✅ Database reset successfully!");

    // Recreate tables
    console.log("Recreating tables...");
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY,
        "email" text NOT NULL,
        "name" text NOT NULL,
        "role" text NOT NULL DEFAULT 'student',
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "categories" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "description" text NOT NULL,
        "icon" text NOT NULL,
        "color" text NOT NULL,
        "tests_count" integer NOT NULL DEFAULT 0
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "bundles" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "description" text NOT NULL,
        "category_id" text NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
        "price" integer NOT NULL DEFAULT 0,
        "original_price" integer,
        "tests_count" integer NOT NULL DEFAULT 0,
        "features" jsonb NOT NULL,
        "is_popular" integer NOT NULL DEFAULT 0,
        "order" integer NOT NULL DEFAULT 0,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "tests" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "category" text NOT NULL,
        "category_id" text NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
        "bundle_id" text REFERENCES "bundles"("id") ON DELETE SET NULL,
        "duration" integer NOT NULL,
        "total_questions" integer NOT NULL,
        "attempts" integer NOT NULL DEFAULT 0,
        "avg_score" real NOT NULL DEFAULT 0,
        "difficulty" text NOT NULL,
        "section_timing_mode" text DEFAULT 'none',
        "section_timings" jsonb,
        "section_settings" jsonb,
        "sections" jsonb NOT NULL
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "questions" (
        "id" serial PRIMARY KEY,
        "test_id" text NOT NULL REFERENCES "tests"("id") ON DELETE CASCADE,
        "text" text NOT NULL,
        "options" jsonb NOT NULL,
        "correct" integer NOT NULL,
        "section" text NOT NULL,
        "explanation" text
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "attempts" (
        "id" text PRIMARY KEY,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "test_id" text NOT NULL REFERENCES "tests"("id") ON DELETE CASCADE,
        "score" integer NOT NULL,
        "accuracy" real NOT NULL,
        "time_taken" integer NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tables recreated successfully!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
