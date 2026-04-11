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

    // Seed initial data
    console.log("\nSeeding initial data...");

    const existingCategories = await db.select().from(categories);
    
    // If categories don't match what we expect, replace them
    if (existingCategories.length !== 8) {
      console.log(`Replacing ${existingCategories.length} categories with 8 complete ones`);
      
      // Delete all existing categories
      await db.execute(`DELETE FROM "categories"`);
      
      const categoryData = [
        { id: "1", name: "JEE Main", description: "Joint Entrance Examination for top engineering colleges", icon: "Cpu", color: "blue", testsCount: 3 },
        { id: "2", name: "NEET", description: "National Eligibility cum Entrance Test for medical aspirants", icon: "Heart", color: "emerald", testsCount: 2 },
        { id: "3", name: "CAT", description: "Common Admission Test for top management institutes", icon: "BarChart3", color: "violet", testsCount: 2 },
        { id: "4", name: "UPSC", description: "Civil Services Examination for government positions", icon: "Building2", color: "amber", testsCount: 1 },
        { id: "5", name: "GATE", description: "Graduate Aptitude Test in Engineering", icon: "Wrench", color: "orange", testsCount: 1 },
        { id: "6", name: "SSC CGL", description: "Staff Selection Commission Combined Graduate Level", icon: "FileText", color: "rose", testsCount: 1 },
        { id: "7", name: "Banking", description: "Banking and financial sector recruitment exams", icon: "Banknote", color: "indigo", testsCount: 2 },
        { id: "8", name: "Punjab", description: "Punjab state government exams and competitive tests", icon: "MapPin", color: "red", testsCount: 2 },
      ];

      for (const cat of categoryData) {
        await db.insert(categories).values(cat);
      }
      console.log("✓ Added 8 categories");
    } else {
      console.log("✓ Database already has 8 categories");
    }
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
