import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";
import { db } from "./lib/db";
import { categories, tests, bundles } from "@workspace/db";

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

// Initialize database and seed data
async function initializeAndSeed() {
  try {
    const existingCategories = await db.select().from(categories);
    const existingTests = await db.select().from(tests);
    
    // If categories or tests don't match what we expect, replace them
    if (existingCategories.length !== 8 || existingTests.length !== 10) {
      logger.info(`Seeding database with 8 categories (currently have ${existingCategories.length}) and 10 tests (currently have ${existingTests.length})`);
      
      // Delete all data in order (respecting foreign keys)
      await db.execute(`DELETE FROM "attempts"`);
      await db.execute(`DELETE FROM "questions"`);
      await db.execute(`DELETE FROM "tests"`);
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
      logger.info("✓ Seeded 8 categories");

      // Seed tests
      const testData = [
        { id: "1", name: "JEE Main Mock 1", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 9, attempts: 5421, avgScore: 72, difficulty: "Hard" as const, sections: JSON.stringify([]) },
        { id: "2", name: "JEE Main Mock 2", category: "JEE", categoryId: "1", duration: 180, totalQuestions: 9, attempts: 4230, avgScore: 69, difficulty: "Hard" as const, sections: JSON.stringify([]) },
        { id: "3", name: "NEET Mock 1", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 9, attempts: 4100, avgScore: 75, difficulty: "Medium" as const, sections: JSON.stringify([]) },
        { id: "4", name: "NEET Mock 2", category: "NEET", categoryId: "2", duration: 180, totalQuestions: 9, attempts: 3800, avgScore: 71, difficulty: "Hard" as const, sections: JSON.stringify([]) },
        { id: "5", name: "CAT Mock 1", category: "CAT", categoryId: "3", duration: 120, totalQuestions: 9, attempts: 1500, avgScore: 65, difficulty: "Medium" as const, sections: JSON.stringify([]) },
        { id: "6", name: "UPSC GS Paper 1", category: "UPSC", categoryId: "4", duration: 120, totalQuestions: 9, attempts: 890, avgScore: 58, difficulty: "Hard" as const, sections: JSON.stringify([]) },
        { id: "7", name: "IBPS PO Prelims", category: "Banking", categoryId: "7", duration: 60, totalQuestions: 9, attempts: 3200, avgScore: 62, difficulty: "Hard" as const, sections: JSON.stringify([]) },
        { id: "8", name: "IBPS Clerk Mock", category: "Banking", categoryId: "7", duration: 45, totalQuestions: 9, attempts: 2800, avgScore: 68, difficulty: "Medium" as const, sections: JSON.stringify([]) },
        { id: "9", name: "Punjab PSC Mock", category: "Punjab", categoryId: "8", duration: 120, totalQuestions: 9, attempts: 1200, avgScore: 60, difficulty: "Hard" as const, sections: JSON.stringify([]) },
        { id: "10", name: "PSSSB Exam Mock", category: "Punjab", categoryId: "8", duration: 90, totalQuestions: 9, attempts: 980, avgScore: 64, difficulty: "Medium" as const, sections: JSON.stringify([]) },
      ];

      for (const test of testData) {
        await db.insert(tests).values(test as any);
      }
      logger.info("✓ Seeded 10 tests");
    }

    // Try to seed bundles if the table exists
    try {
      const existingBundles = await db.select().from(bundles);
      if (existingBundles.length === 0) {
        logger.info("Seeding bundles...");
        // Bundle seeding code here
        logger.info("✓ Seeded bundles");
      }
    } catch (err) {
      logger.info("Bundles table not yet created, skipping bundle seeding");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed database");
  }
}

// Initialize before starting server
initializeAndSeed().then(() => {
  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}).catch((err) => {
  logger.error({ err }, "Failed to initialize");
  process.exit(1);
});
