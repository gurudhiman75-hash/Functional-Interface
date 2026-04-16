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
      attempt_type TEXT DEFAULT 'REAL',
      section_stats JSONB,
      section_time_spent JSONB
    );
  `);

  // Add attempt_type to existing tables if it doesn't already exist (idempotent)
  await db.execute(sql`
    ALTER TABLE attempts ADD COLUMN IF NOT EXISTS attempt_type TEXT DEFAULT 'REAL';
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      original_price_cents INTEGER NOT NULL,
      discount_percent INTEGER NOT NULL DEFAULT 0,
      final_price_cents INTEGER NOT NULL,
      test_count INTEGER NOT NULL DEFAULT 0,
      features JSONB,
      is_popular INTEGER NOT NULL DEFAULT 0,
      "order" INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS package_tests (
      id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
      test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      is_free INTEGER NOT NULL DEFAULT 0,
      UNIQUE (package_id, test_id)
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_packages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
      razorpay_order_id TEXT,
      razorpay_payment_id TEXT,
      purchased_at TIMESTAMP NOT NULL DEFAULT NOW(),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, package_id)
    );
  `);

  console.log("Database tables created successfully!");

  // Bilingual support: add translation columns to questions and languages column to tests (idempotent)
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS text_hi TEXT;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS options_hi JSONB;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_hi TEXT;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS text_pa TEXT;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS options_pa JSONB;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation_pa TEXT;`);
  await db.execute(sql`ALTER TABLE tests ADD COLUMN IF NOT EXISTS languages JSONB;`);
  await db.execute(sql`ALTER TABLE questions ADD COLUMN IF NOT EXISTS client_id TEXT NOT NULL DEFAULT '';`);
  console.log("Bilingual columns added (if not already present).");

  process.exit(0);
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});