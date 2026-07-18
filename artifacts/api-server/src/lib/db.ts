import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL?.trim();
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

/** The single canonical ExamTree database connection. */
export const sqlClient = postgres(connectionString);
