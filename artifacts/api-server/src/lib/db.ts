import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@workspace/db";

/**
 * ExamTree now uses the canonical namespaced Neon database as its only runtime
 * database. ADMIN_DATABASE_URL remains a temporary deployment compatibility
 * input while Render is switched to store the same value in DATABASE_URL.
 */
const connectionString = process.env.ADMIN_DATABASE_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sqlClient = postgres(connectionString);
export const adminSqlClient = sqlClient;

/**
 * Compatibility exports for modules that have not yet been deleted. They point
 * at the same canonical connection and must not be used to access legacy
 * public-schema data.
 */
export const studentSqlClient = sqlClient;
export const db = drizzle(sqlClient, { schema });
export const isDedicatedAdminDatabaseConfigured = false;
