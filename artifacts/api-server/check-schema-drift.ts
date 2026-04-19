/**
 * check-schema-drift.ts
 *
 * Compares the actual production DB schema against what the Drizzle schema expects.
 * Reports:
 *   - MISSING columns (will cause 500s on SELECT * or INSERT)
 *   - EXTRA NOT-NULL columns without defaults (will cause 500s on INSERT)
 *   - MISSING tables entirely
 *
 * Run:
 *   cd artifacts/api-server
 *   $env:DATABASE_URL = "postgres://..."
 *   pnpm run db:check
 */

import { db } from "./src/lib/db.js";
import { sql } from "drizzle-orm";

// ── Expected schema (derived from lib/db/src/index.ts) ───────────────────────
// Each entry: { table, columns: Set<string>, notNullNoDefault: Set<string> }
// notNullNoDefault = columns that are NOT NULL and have NO server-side default —
//   i.e. the app MUST supply a value on INSERT or it will fail with a constraint error.

const EXPECTED: Array<{
  table: string;
  columns: string[];
  notNullNoDefault: string[];
}> = [
  {
    table: "sections",
    columns: ["id", "name"],
    notNullNoDefault: ["id", "name"],
  },
  {
    table: "topics",
    columns: ["id", "name"],
    notNullNoDefault: ["id", "name"],
  },
  {
    table: "topics_global",
    columns: ["id", "name"],
    notNullNoDefault: ["id", "name"],
  },
  {
    table: "users",
    columns: ["id", "email", "name", "role", "created_at", "updated_at"],
    notNullNoDefault: ["id", "email", "name"],
  },
  {
    table: "categories",
    columns: ["id", "name", "description", "icon", "color", "tests_count"],
    notNullNoDefault: ["id", "name", "description", "icon", "color"],
  },
  {
    table: "bundles",
    columns: ["id", "name", "description", "category_id", "price", "original_price", "tests_count", "features", "is_popular", "order", "created_at"],
    notNullNoDefault: ["id", "name", "description", "category_id", "features"],
  },
  {
    table: "bundle_packages",
    columns: ["id", "bundle_id", "package_id"],
    notNullNoDefault: ["id", "bundle_id", "package_id"],
  },
  {
    table: "subcategories",
    columns: ["id", "category_id", "category_name", "name", "description", "languages"],
    notNullNoDefault: ["id", "category_id", "category_name", "name", "description"],
  },
  {
    table: "tests",
    columns: [
      "id", "name", "category", "category_id", "subcategory_id", "subcategory_name",
      "access", "kind", "duration", "total_questions", "attempts", "avg_score",
      "difficulty", "section_timing_mode", "section_timings", "section_settings",
      "sections", "languages", "price_cents", "is_free", "topic_id", "topic_name",
    ],
    notNullNoDefault: ["id", "name", "category", "category_id", "duration", "total_questions", "difficulty", "sections"],
  },
  {
    table: "user_test_entitlements",
    columns: ["user_id", "test_id", "source", "razorpay_order_id", "razorpay_payment_id", "created_at"],
    notNullNoDefault: ["user_id", "test_id"],
  },
  {
    table: "questions",
    columns: [
      "id", "client_id", "test_id", "text", "options", "correct", "section", "topic",
      "section_id", "topic_id", "global_topic_id", "explanation", "difficulty",
      "text_hi", "options_hi", "explanation_hi", "text_pa", "options_pa", "explanation_pa",
      "created_at",
    ],
    notNullNoDefault: ["test_id", "text", "options", "correct", "section", "explanation"],
  },
  {
    table: "attempts",
    columns: [
      "id", "user_id", "test_id", "test_name", "category", "score", "correct", "wrong",
      "unanswered", "total_questions", "time_spent", "date", "attempt_type",
      "section_stats", "section_time_spent", "question_review", "created_at",
    ],
    notNullNoDefault: ["id", "user_id", "test_id", "test_name", "category", "score", "correct", "wrong", "unanswered", "total_questions", "time_spent"],
  },
  {
    table: "responses",
    columns: ["id", "attempt_id", "question_id", "selected_option", "time_taken", "created_at"],
    notNullNoDefault: ["attempt_id", "question_id"],
  },
  {
    table: "test_questions",
    columns: ["id", "test_id", "question_id", "added_at"],
    notNullNoDefault: ["test_id", "question_id"],
  },
  {
    table: "packages",
    columns: [
      "id", "name", "description", "original_price_cents", "discount_percent",
      "final_price_cents", "test_count", "features", "is_popular", "order", "created_at",
    ],
    notNullNoDefault: ["id", "name", "description", "original_price_cents", "final_price_cents"],
  },
  {
    table: "package_tests",
    columns: ["id", "package_id", "test_id", "is_free"],
    notNullNoDefault: ["id", "package_id", "test_id"],
  },
  {
    table: "user_packages",
    columns: ["id", "user_id", "package_id", "razorpay_order_id", "razorpay_payment_id", "purchased_at", "created_at"],
    notNullNoDefault: ["id", "user_id", "package_id"],
  },
  {
    table: "user_bundles",
    columns: ["id", "user_id", "bundle_id", "razorpay_order_id", "razorpay_payment_id", "purchased_at", "created_at"],
    notNullNoDefault: ["id", "user_id", "bundle_id"],
  },
  {
    table: "leaderboard",
    columns: ["test_id", "user_id", "user_name", "score", "rank", "created_at"],
    notNullNoDefault: ["test_id", "user_id", "user_name", "score", "rank"],
  },
];

// ── Query actual DB ───────────────────────────────────────────────────────────

type DbColumn = { table_name: string; column_name: string; is_nullable: string; column_default: string | null };

const rows = await db.execute(sql`
  SELECT table_name, column_name, is_nullable, column_default
  FROM information_schema.columns
  WHERE table_schema = 'public'
  ORDER BY table_name, ordinal_position
`) as unknown as DbColumn[];

// Group by table
const dbTables = new Map<string, Map<string, { nullable: boolean; hasDefault: boolean }>>();
for (const row of rows) {
  if (!dbTables.has(row.table_name)) dbTables.set(row.table_name, new Map());
  dbTables.get(row.table_name)!.set(row.column_name, {
    nullable: row.is_nullable === "YES",
    hasDefault: row.column_default !== null,
  });
}

// ── Compare ───────────────────────────────────────────────────────────────────

let issues = 0;
let warnings = 0;

console.log("\n=== Schema Drift Check ===\n");

for (const expected of EXPECTED) {
  const dbCols = dbTables.get(expected.table);

  if (!dbCols) {
    console.error(`❌ MISSING TABLE: "${expected.table}"`);
    issues++;
    continue;
  }

  const expectedSet = new Set(expected.columns);
  const notNullSet = new Set(expected.notNullNoDefault);

  // Missing columns
  for (const col of expectedSet) {
    if (!dbCols.has(col)) {
      console.error(`❌ MISSING COLUMN: ${expected.table}.${col}`);
      issues++;
    }
  }

  // Extra NOT NULL columns without defaults (dangerous for INSERT)
  for (const [col, meta] of dbCols) {
    if (!expectedSet.has(col) && !meta.nullable && !meta.hasDefault) {
      console.warn(`⚠️  EXTRA NOT-NULL column (no default): ${expected.table}.${col}  ← INSERT will fail without supplying this`);
      warnings++;
    }
  }

  // Extra nullable/defaulted columns (safe, just informational)
  const extras: string[] = [];
  for (const [col] of dbCols) {
    if (!expectedSet.has(col)) {
      const m = dbCols.get(col)!;
      if (m.nullable || m.hasDefault) extras.push(col);
    }
  }
  if (extras.length > 0) {
    console.log(`ℹ️  Extra (safe) columns in ${expected.table}: ${extras.join(", ")}`);
  }
}

// Tables in DB not in expected schema (could be old/dropped tables)
for (const [tableName] of dbTables) {
  if (!EXPECTED.find((e) => e.table === tableName)) {
    console.log(`ℹ️  Unknown table in DB (not in Drizzle schema): ${tableName}`);
  }
}

console.log("\n=== Summary ===");
if (issues === 0 && warnings === 0) {
  console.log("✅ No issues found. DB schema matches Drizzle schema.");
} else {
  if (issues > 0) console.error(`❌ ${issues} critical issue(s) — will cause 500 errors`);
  if (warnings > 0) console.warn(`⚠️  ${warnings} warning(s) — may cause INSERT failures`);
  console.log("\nRun 'pnpm run db:migrate' to fix missing columns/tables.");
}

process.exit(issues > 0 ? 1 : 0);
