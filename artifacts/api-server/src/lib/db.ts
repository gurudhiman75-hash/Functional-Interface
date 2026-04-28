import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { parse as parseDotenv } from "dotenv";
import * as schema from "@workspace/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the DB connection string with this priority:
//   1. The DATABASE_URL declared in artifacts/api-server/.env (authoritative)
//   2. Whatever DATABASE_URL the runtime/workspace already injected
// This prevents an ambient DATABASE_URL (e.g. the Replit built-in Postgres)
// from shadowing the project's actual database (Neon) when the runtime ignores
// the --env-file override.
function resolveDatabaseUrl(): string | undefined {
  // Try a few candidate locations for the api-server's .env so this works
  // whether the process is launched from the repo root, the artifact dir, or
  // anywhere else.
  const candidates = [
    process.cwd(),
    path.resolve(process.cwd(), "artifacts/api-server"),
    path.resolve(__dirname, "../.."),
    path.resolve(__dirname, "../../.."),
  ];
  for (const dir of candidates) {
    const envPath = path.join(dir, ".env");
    try {
      if (fs.existsSync(envPath)) {
        const parsed = parseDotenv(fs.readFileSync(envPath));
        const fromFile = parsed["DATABASE_URL"];
        if (fromFile && fromFile.trim()) return fromFile.trim();
      }
    } catch {
      // ignore and try next candidate
    }
  }
  return process.env.DATABASE_URL;
}

const connectionString = resolveDatabaseUrl();
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}
// Make sure other code that reads process.env.DATABASE_URL sees the same
// value we resolved.
process.env.DATABASE_URL = connectionString;

const client = postgres(connectionString);
export const db = drizzle(client, { schema });