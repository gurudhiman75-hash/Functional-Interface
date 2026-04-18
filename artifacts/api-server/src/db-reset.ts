import { db } from "./lib/db";

/**
 * Drops all tables in dependency-safe order.
 * After this, run `migrate.ts` to recreate the schema, then `db-init.ts` to seed data.
 */
async function resetDatabase() {
  try {
    console.log("Resetting database â€” dropping all tables...");

    // Drop in reverse dependency order
    await db.execute(`DROP TABLE IF EXISTS "responses" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "user_test_entitlements" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "user_bundles" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "user_packages" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "bundle_packages" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "package_tests" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "attempts" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "questions" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "packages" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "bundles" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "tests" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "subcategories" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "categories" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "users" CASCADE`);
    // Legacy table cleanup
    await db.execute(`DROP TABLE IF EXISTS "attempt_records" CASCADE`);

    console.log("âœ… All tables dropped.");
    console.log("â†’ Run migrate.ts to recreate the schema, then db-init.ts to seed data.");
  } catch (error) {
    console.error("âŒ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();
