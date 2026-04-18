import { and, asc, eq, isNull, or, sql } from "drizzle-orm";
import { attempts, leaderboard, users } from "@workspace/db";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type * as schema from "@workspace/db";

type Db = PostgresJsDatabase<typeof schema>;

/**
 * Recomputes the leaderboard for a single test and upserts the results.
 *
 * Rules:
 *  - Only REAL attempts count (NULL attemptType treated as REAL for legacy rows)
 *  - Per user, only their FIRST attempt (earliest createdAt) is counted
 *  - Ranked by score DESC, then createdAt ASC as tiebreaker
 *
 * Called asynchronously after every REAL attempt submission — does not block
 * the HTTP response.
 */
export async function refreshLeaderboard(testId: string, db: Db): Promise<void> {
  // Fetch all REAL attempts for the test, joined with user name
  const rows = await db
    .select({
      userId: attempts.userId,
      userName: users.name,
      score: attempts.score,
      createdAt: attempts.createdAt,
    })
    .from(attempts)
    .innerJoin(users, eq(attempts.userId, users.id))
    .where(
      and(
        eq(attempts.testId, testId),
        or(eq(attempts.attemptType, "REAL"), isNull(attempts.attemptType)),
      ),
    )
    .orderBy(asc(attempts.createdAt));

  // Keep only the first attempt per user
  const firstByUser = new Map<string, { userId: string; userName: string; score: number; createdAt: Date }>();
  for (const row of rows) {
    if (!firstByUser.has(row.userId)) {
      firstByUser.set(row.userId, row);
    }
  }

  // Sort by score DESC, then createdAt ASC
  const sorted = Array.from(firstByUser.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  // Build upsert rows with computed ranks
  const upsertRows = sorted.map((entry, index) => ({
    testId,
    userId: entry.userId,
    userName: entry.userName,
    score: entry.score,
    rank: index + 1,
    createdAt: entry.createdAt,
  }));

  if (upsertRows.length === 0) return;

  // Upsert all rows — on conflict (testId, userId) update score and rank
  await db
    .insert(leaderboard)
    .values(upsertRows)
    .onConflictDoUpdate({
      target: [leaderboard.testId, leaderboard.userId],
      set: {
        userName: sql`excluded.user_name`,
        score: sql`excluded.score`,
        rank: sql`excluded.rank`,
        createdAt: sql`excluded.created_at`,
      },
    });
}
