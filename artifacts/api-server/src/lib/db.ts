import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@workspace/db";

/** ExamTree has one canonical namespaced Neon database. */
const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sqlClient = postgres(connectionString);
export const adminSqlClient = sqlClient;

/**
 * Deprecated aliases retained temporarily for unregistered source modules.
 * They are aliases of the same canonical connection, never a second database.
 */
export const studentSqlClient = sqlClient;
export const db = drizzle(sqlClient, { schema });
export const isDedicatedAdminDatabaseConfigured = false;
