import 'dotenv/config';
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@workspace/db";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const sqlClient = postgres(connectionString);
export const db = drizzle(sqlClient, { schema });

/**
 * The existing ExamTree student platform and the new namespaced admin schema
 * currently live in separate Neon projects. Keep that boundary explicit so an
 * admin rollout cannot accidentally switch or migrate the student database.
 *
 * Local development may omit ADMIN_DATABASE_URL only when DATABASE_URL already
 * points to a database containing the content/platform schemas.
 */
const adminConnectionString = process.env.ADMIN_DATABASE_URL ?? connectionString;
export const adminSqlClient = postgres(adminConnectionString);
export const isDedicatedAdminDatabaseConfigured = Boolean(process.env.ADMIN_DATABASE_URL);
