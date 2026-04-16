
import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";
import { db } from "./lib/db";
import { categories, tests, bundles } from "@workspace/db";
import { ensureSampleQuestions } from "./lib/seed-questions";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// Initialize database schema
async function ensureSchema() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS "subcategories" (
      "id" text PRIMARY KEY,
      "category_id" text NOT NULL REFERENCES "categories"("id") ON DELETE CASCADE,
      "category_name" text NOT NULL,
      "name" text NOT NULL,
      "description" text NOT NULL
    )
  `);

  await db.execute(`
    ALTER TABLE "tests"
    ADD COLUMN IF NOT EXISTS "subcategory_id" text NOT NULL DEFAULT ''
  `);

  await db.execute(`
    ALTER TABLE "tests"
    ADD COLUMN IF NOT EXISTS "subcategory_name" text NOT NULL DEFAULT ''
  `);

  await db.execute(`
    ALTER TABLE "tests"
    ADD COLUMN IF NOT EXISTS "access" text NOT NULL DEFAULT 'free'
  `);

  await db.execute(`
    ALTER TABLE "tests"
    ADD COLUMN IF NOT EXISTS "kind" text NOT NULL DEFAULT 'full-length'
  `);

  await db.execute(`
    ALTER TABLE "questions"
    ADD COLUMN IF NOT EXISTS "client_id" text NOT NULL DEFAULT ''
  `);

  await db.execute(`
    ALTER TABLE "tests"
    ADD COLUMN IF NOT EXISTS "price_cents" integer
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS "user_test_entitlements" (
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "test_id" text NOT NULL REFERENCES "tests"("id") ON DELETE CASCADE,
      "source" text NOT NULL DEFAULT 'razorpay',
      "stripe_checkout_session_id" text,
      "created_at" timestamp DEFAULT now() NOT NULL,
      PRIMARY KEY ("user_id", "test_id")
    )
  `);

  await db.execute(`
    ALTER TABLE "user_test_entitlements"
    ADD COLUMN IF NOT EXISTS "razorpay_order_id" text
  `);

  await db.execute(`
    ALTER TABLE "user_test_entitlements"
    ADD COLUMN IF NOT EXISTS "razorpay_payment_id" text
  `);

  await db.execute(`
    ALTER TABLE "user_test_entitlements"
    ALTER COLUMN "source" SET DEFAULT 'razorpay'
  `);

  await db.execute(`
    ALTER TABLE "attempts"
    ADD COLUMN IF NOT EXISTS "question_review" jsonb
  `);

  await db.execute(`
    UPDATE "tests"
    SET "price_cents" = 499
    WHERE "access" = 'paid' AND ("price_cents" IS NULL OR "price_cents" = 0)
  `);
}

// Seed default data only if database is empty
async function seedDefaultDataOnce() {
  try {
    const existingCategories = await db.select().from(categories);
    
    // Only seed if no categories exist (database is empty)
    if (existingCategories.length > 0) {
      logger.info(`Database already contains ${existingCategories.length} categories. Skipping seed.`);
      return;
    }
    
    logger.info("Database is empty. Seeding with default data...");
    
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
    logger.info("✓ Seeded 8 default categories");

    // Seed default tests
    const testData = [
      { id: "1", name: "JEE Main Mock 1", category: "JEE", categoryId: "1", access: "free" as const, kind: "full-length" as const, duration: 180, totalQuestions: 9, attempts: 5421, avgScore: 72, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "2", name: "JEE Main Mock 2", category: "JEE", categoryId: "1", access: "paid" as const, kind: "full-length" as const, duration: 180, totalQuestions: 9, attempts: 4230, avgScore: 69, difficulty: "Hard" as const, sections: JSON.stringify([]), priceCents: 499 },
      { id: "3", name: "NEET Mock 1", category: "NEET", categoryId: "2", access: "free" as const, kind: "full-length" as const, duration: 180, totalQuestions: 9, attempts: 4100, avgScore: 75, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      { id: "4", name: "NEET Mock 2", category: "NEET", categoryId: "2", access: "paid" as const, kind: "sectional" as const, duration: 180, totalQuestions: 9, attempts: 3800, avgScore: 71, difficulty: "Hard" as const, sections: JSON.stringify([]), priceCents: 499 },
      { id: "5", name: "CAT Mock 1", category: "CAT", categoryId: "3", access: "free" as const, kind: "topic-wise" as const, duration: 120, totalQuestions: 9, attempts: 1500, avgScore: 65, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      { id: "6", name: "UPSC GS Paper 1", category: "UPSC", categoryId: "4", access: "free" as const, kind: "full-length" as const, duration: 120, totalQuestions: 9, attempts: 890, avgScore: 58, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "7", name: "IBPS PO Prelims", category: "Banking", categoryId: "7", access: "free" as const, kind: "full-length" as const, duration: 60, totalQuestions: 9, attempts: 3200, avgScore: 62, difficulty: "Hard" as const, sections: JSON.stringify([]) },
      { id: "8", name: "IBPS Clerk Mock", category: "Banking", categoryId: "7", access: "paid" as const, kind: "full-length" as const, duration: 60, totalQuestions: 9, attempts: 2800, avgScore: 68, difficulty: "Medium" as const, sections: JSON.stringify([]), priceCents: 499 },
    ];

    await db.insert(tests).values(testData);
    logger.info("✓ Seeded 8 default tests");
    
    // Seed sample questions for tests
    await ensureSampleQuestions();
    logger.info("✓ Database initialization complete");
  } catch (error) {
    logger.error({ error }, "Database seeding failed");
    throw error;
  }
}

// Initialize database on startup (schema only, data only if empty)
async function initializeDatabase() {
  await ensureSchema();
  await seedDefaultDataOnce();
}

// Start server
(async () => {
  try {
    await initializeDatabase();
    app.listen(port, "0.0.0.0", () => {
      logger.info(`API server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
})();
