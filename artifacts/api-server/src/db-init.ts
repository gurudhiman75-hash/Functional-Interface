import { db } from "./lib/db";
import { users, categories, tests, questions, attempts } from "@workspace/db";

async function initializeDatabase() {
  try {
    console.log("Initializing database...");

    // Create tables
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
    console.log("✓ Users table created");

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
    console.log("✓ Categories table created");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "tests" (
        "id" text PRIMARY KEY,
        "name" text NOT NULL,
        "category" text NOT NULL,
        "category_id" text NOT NULL REFERENCES "categories"("id"),
        "duration" integer NOT NULL,
        "total_questions" integer NOT NULL,
        "attempts" integer NOT NULL DEFAULT 0,
        "avg_score" integer NOT NULL DEFAULT 0,
        "difficulty" text NOT NULL,
        "section_timing_mode" text DEFAULT 'none',
        "section_timings" jsonb,
        "section_settings" jsonb,
        "sections" jsonb NOT NULL DEFAULT '[]',
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Tests table created");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "questions" (
        "id" serial PRIMARY KEY,
        "test_id" text NOT NULL REFERENCES "tests"("id"),
        "text" text NOT NULL,
        "options" jsonb NOT NULL,
        "correct" integer NOT NULL,
        "section" text NOT NULL,
        "explanation" text NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Questions table created");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS "attempts" (
        "id" text PRIMARY KEY,
        "user_id" text NOT NULL REFERENCES "users"("id"),
        "test_id" text NOT NULL REFERENCES "tests"("id"),
        "test_name" text NOT NULL,
        "category" text NOT NULL,
        "score" real NOT NULL,
        "correct" integer NOT NULL,
        "wrong" integer NOT NULL,
        "unanswered" integer NOT NULL,
        "total_questions" integer NOT NULL,
        "time_spent" integer NOT NULL,
        "date" text NOT NULL,
        "section_stats" jsonb,
        "section_time_spent" jsonb,
        "created_at" timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✓ Attempts table created");

    console.log("\n✅ Database initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
