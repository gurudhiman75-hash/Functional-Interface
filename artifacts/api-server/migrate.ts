import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";

async function migrate() {
  console.log("Creating database tables...");

  // Create tables in order
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      tests_count INTEGER NOT NULL DEFAULT 0
    );
  `);

  await db.execute(sql`
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
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS questions (
      id SERIAL PRIMARY KEY,
      test_id TEXT NOT NULL,
      text TEXT NOT NULL,
      options JSONB NOT NULL,
      correct INTEGER NOT NULL,
      section TEXT NOT NULL,
      explanation TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      test_name TEXT NOT NULL,
      category TEXT NOT NULL,
      score REAL NOT NULL,
      correct INTEGER NOT NULL,
      wrong INTEGER NOT NULL,
      unanswered INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      time_spent INTEGER NOT NULL,
      date TEXT NOT NULL,
      section_stats JSONB,
      section_time_spent JSONB
    );
  `);

  console.log("Database tables created successfully!");
  process.exit(0);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});