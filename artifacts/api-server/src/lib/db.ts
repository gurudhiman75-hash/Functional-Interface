import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@workspace/db";

/** ExamTree has one canonical namespaced Neon database. */
const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

/** The single canonical ExamTree PostgreSQL client. */
export const sqlClient = postgres(connectionString);

/**
 * postgres.js 3.4.x can pass plain objects through its json() helper in some
 * prepared/transactional paths. Node then reaches Buffer.byteLength(object)
 * and throws ERR_INVALID_ARG_TYPE. ExamTree uses json()/tx.json() throughout
 * the admin control plane, so normalize the helper once at the shared client.
 *
 * PostgreSQL receives valid JSON text; explicit ::json/::jsonb casts continue
 * to work, and JSON/JSONB target columns infer their native type on INSERT.
 */
Object.defineProperty(sqlClient, "json", {
  configurable: true,
  writable: true,
  value: (value: unknown): string => JSON.stringify(value),
});

/**
 * Shared Drizzle facade retained for active routes that have not yet been
 * converted to schema-qualified canonical SQL. It uses the same sqlClient and
 * does not create a second connection.
 */
export const db = drizzle(sqlClient, { schema });
