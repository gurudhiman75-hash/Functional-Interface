/**
 * check-normalization.ts
 *
 * Inspects the questions table and reports how many rows are missing
 * sectionId / topicId FK values.
 *
 * Usage:
 *   pnpm db:check-normalization
 *
 * Exit codes:
 *   0  – all rows are fully normalised  → safe to remove string-field fallbacks
 *   1  – some rows still lack IDs        → keep fallback, run db:normalize-questions first
 *
 * This script is READ-ONLY. It never modifies data.
 */

import { sql } from "drizzle-orm";
import { db } from "./src/lib/db";

async function main() {
  console.log("── Normalization status check ──────────────────────────────────");

  const [totRow] = await db.execute<{ total: string }>(
    sql`SELECT COUNT(*)::text AS total FROM questions`,
  );
  const total = Number(totRow.total);

  const [missSecRow] = await db.execute<{ count: string }>(
    sql`SELECT COUNT(*)::text AS count FROM questions WHERE section_id IS NULL`,
  );
  const missingSectionId = Number(missSecRow.count);

  const [missTopRow] = await db.execute<{ count: string }>(
    sql`SELECT COUNT(*)::text AS count FROM questions WHERE topic_id IS NULL`,
  );
  const missingTopicId = Number(missTopRow.count);

  const missingEither = Math.max(missingSectionId, missingTopicId);
  const pct = total > 0 ? ((total - missingEither) / total) * 100 : 100;

  console.log(`Total questions : ${total}`);
  console.log(`Missing section_id : ${missingSectionId}`);
  console.log(`Missing topic_id   : ${missingTopicId}`);
  console.log(`Normalised         : ${(total - missingEither)} / ${total}  (${pct.toFixed(1)}%)`);
  console.log("────────────────────────────────────────────────────────────────");

  if (missingSectionId === 0 && missingTopicId === 0) {
    console.log("✅  ALL rows normalised.");
    console.log("   String-field fallbacks in analytics.ts are no longer needed.");
    console.log("   Deprecation plan:");
    console.log("     Step 1 – Remove ?? fallbacks from analytics.ts (sectionStr / topicStr)");
    console.log("     Step 2 – Run a migration: ALTER TABLE questions DROP COLUMN section, DROP COLUMN topic");
    console.log("     Step 3 – Remove `section` / `topic` from the Drizzle schema");
    process.exit(0);
  } else {
    console.log("⚠️   Some rows are NOT yet normalised.");
    console.log("   Action required: run  pnpm db:normalize-questions  to backfill IDs,");
    console.log("   then re-run this check.");
    console.log("   String-field fallbacks MUST remain in analytics.ts until this check passes.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("check-normalization failed:", err);
  process.exit(1);
});
