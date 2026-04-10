import { db } from "./lib/db";

async function resetDatabase() {
  try {
    console.log("Resetting database...");

    // Drop tables in correct order
    await db.execute(`DROP TABLE IF EXISTS "attempts"`);
    await db.execute(`DROP TABLE IF EXISTS "questions"`);
    await db.execute(`DROP TABLE IF EXISTS "tests"`);
    await db.execute(`DROP TABLE IF EXISTS "categories"`);
    await db.execute(`DROP TABLE IF EXISTS "users"`);

    console.log("✅ Database reset successfully!");
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
