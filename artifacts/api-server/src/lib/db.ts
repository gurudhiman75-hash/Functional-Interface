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

type JsonCapableSql = {
  json?: (value: unknown) => unknown;
  savepoint?: (...args: unknown[]) => unknown;
};

type VariadicFunction = (...args: unknown[]) => unknown;

function installSafeJsonSerializer(client: JsonCapableSql): void {
  Object.defineProperty(client, "json", {
    configurable: true,
    writable: true,
    value: (value: unknown): string => JSON.stringify(value),
  });

  if (typeof client.savepoint === "function") {
    const nativeSavepoint = client.savepoint.bind(client) as VariadicFunction;
    Object.defineProperty(client, "savepoint", {
      configurable: true,
      writable: true,
      value: (...args: unknown[]) => {
        const callbackIndex = args.findIndex((argument) => typeof argument === "function");
        if (callbackIndex >= 0) {
          const callback = args[callbackIndex] as (transaction: JsonCapableSql) => unknown;
          args[callbackIndex] = (transaction: JsonCapableSql) => {
            installSafeJsonSerializer(transaction);
            return callback(transaction);
          };
        }
        return nativeSavepoint(...args);
      },
    });
  }
}

/**
 * postgres.js 3.4.x can pass plain objects through json() in prepared and
 * transactional paths. Node then reaches Buffer.byteLength(object) and throws
 * ERR_INVALID_ARG_TYPE. ExamTree uses sql.json()/tx.json() across the admin
 * control plane, so normalize the root client, every transaction and savepoint.
 */
installSafeJsonSerializer(sqlClient);

const nativeBegin = sqlClient.begin.bind(sqlClient) as VariadicFunction;
Object.defineProperty(sqlClient, "begin", {
  configurable: true,
  writable: true,
  value: (...args: unknown[]) => {
    const callbackIndex = args.findIndex((argument) => typeof argument === "function");
    if (callbackIndex >= 0) {
      const callback = args[callbackIndex] as (transaction: JsonCapableSql) => unknown;
      args[callbackIndex] = (transaction: JsonCapableSql) => {
        installSafeJsonSerializer(transaction);
        return callback(transaction);
      };
    }
    return nativeBegin(...args);
  },
});

/**
 * Shared Drizzle facade retained for active routes that have not yet been
 * converted to schema-qualified canonical SQL. It uses the same sqlClient and
 * does not create a second connection.
 */
export const db = drizzle(sqlClient, { schema });
