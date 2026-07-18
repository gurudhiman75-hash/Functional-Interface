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
 * Shared Drizzle facade retained for active routes that have not yet been
 * converted to schema-qualified canonical SQL. It uses the same sqlClient and
 * does not create a second connection.
 */
export const db = drizzle(sqlClient, { schema });
