import { randomUUID } from "crypto";
import { and, desc, eq, gt, isNull, or, sql, type SQL } from "drizzle-orm";
import { attemptDrafts } from "@workspace/db";
import { db } from "../lib/db";
import type {
  AttemptDraft,
  AttemptDraftState,
  AttemptDraftType,
  SaveAttemptDraftInput,
} from "../types/attempt-drafts";

type AttemptDraftRow = typeof attemptDrafts.$inferSelect;

export class StaleAttemptDraftError extends Error {
  readonly draftId: string;
  readonly currentVersion: number;

  constructor(draftId: string, currentVersion: number) {
    super("Attempt draft version is stale");
    this.name = "StaleAttemptDraftError";
    this.draftId = draftId;
    this.currentVersion = currentVersion;
  }
}

function toAttemptDraft(row: AttemptDraftRow): AttemptDraft {
  return {
    ...row,
    state: row.state as AttemptDraftState,
    attemptType: row.attemptType as AttemptDraftType,
  };
}

function activeDraftWhere(): SQL {
  return or(isNull(attemptDrafts.expiresAt), gt(attemptDrafts.expiresAt, new Date())) as SQL;
}

function draftIdentityWhere(params: {
  userId: string;
  testId: string;
  attemptType: AttemptDraftType;
  originalAttemptId?: string | null;
}): SQL {
  const originalAttemptId = params.originalAttemptId ?? null;
  return and(
    eq(attemptDrafts.userId, params.userId),
    eq(attemptDrafts.testId, params.testId),
    eq(attemptDrafts.attemptType, params.attemptType),
    originalAttemptId === null
      ? isNull(attemptDrafts.originalAttemptId)
      : eq(attemptDrafts.originalAttemptId, originalAttemptId),
  ) as SQL;
}

export class AttemptDraftService {
  async getDraft(userId: string, draftId: string): Promise<AttemptDraft | null> {
    const [draft] = await db
      .select()
      .from(attemptDrafts)
      .where(and(eq(attemptDrafts.id, draftId), eq(attemptDrafts.userId, userId), activeDraftWhere()))
      .limit(1);

    return draft ? toAttemptDraft(draft) : null;
  }

  async listDrafts(params: {
    userId: string;
    testId?: string;
    attemptType?: AttemptDraftType;
  }): Promise<AttemptDraft[]> {
    const conditions = [eq(attemptDrafts.userId, params.userId), activeDraftWhere()];
    if (params.testId) conditions.push(eq(attemptDrafts.testId, params.testId));
    if (params.attemptType) conditions.push(eq(attemptDrafts.attemptType, params.attemptType));

    const rows = await db
      .select()
      .from(attemptDrafts)
      .where(and(...conditions))
      .orderBy(desc(attemptDrafts.updatedAt));

    return rows.map(toAttemptDraft);
  }

  async saveDraft(params: SaveAttemptDraftInput): Promise<AttemptDraft> {
    return db.transaction(async (tx) => {
      const [existing] = await tx
        .select()
        .from(attemptDrafts)
        .where(
          draftIdentityWhere({
            userId: params.userId,
            testId: params.testId,
            attemptType: params.attemptType,
            originalAttemptId: params.originalAttemptId,
          }),
        )
        .limit(1);

      if (existing) {
        if (
          params.expectedVersion !== undefined &&
          existing.version !== params.expectedVersion
        ) {
          throw new StaleAttemptDraftError(existing.id, existing.version);
        }

        const [updated] = await tx
          .update(attemptDrafts)
          .set({
            testName: params.testName,
            category: params.category,
            state: params.state,
            status: params.status ?? "in_progress",
            lastDevice: params.lastDevice,
            expiresAt: params.expiresAt ?? null,
            version: sql`${attemptDrafts.version} + 1`,
          })
          .where(
            params.expectedVersion === undefined
              ? eq(attemptDrafts.id, existing.id)
              : and(eq(attemptDrafts.id, existing.id), eq(attemptDrafts.version, params.expectedVersion)),
          )
          .returning();

        if (!updated) {
          const [latest] = await tx
            .select({ version: attemptDrafts.version })
            .from(attemptDrafts)
            .where(eq(attemptDrafts.id, existing.id))
            .limit(1);
          throw new StaleAttemptDraftError(existing.id, latest?.version ?? existing.version);
        }

        return toAttemptDraft(updated);
      }

      const [created] = await tx
        .insert(attemptDrafts)
        .values({
          id: randomUUID(),
          userId: params.userId,
          testId: params.testId,
          testName: params.testName,
          category: params.category,
          attemptType: params.attemptType,
          originalAttemptId: params.originalAttemptId ?? null,
          state: params.state,
          status: params.status ?? "in_progress",
          lastDevice: params.lastDevice,
          expiresAt: params.expiresAt ?? null,
        })
        .returning();

      return toAttemptDraft(created);
    });
  }

  async deleteDraft(userId: string, draftId: string): Promise<boolean> {
    const rows = await db
      .delete(attemptDrafts)
      .where(and(eq(attemptDrafts.id, draftId), eq(attemptDrafts.userId, userId)))
      .returning({ id: attemptDrafts.id });

    return rows.length > 0;
  }

  async cleanupExpiredDrafts(): Promise<number> {
    const rows = await db
      .delete(attemptDrafts)
      .where(sql`${attemptDrafts.expiresAt} IS NOT NULL AND ${attemptDrafts.expiresAt} < NOW()`)
      .returning({ id: attemptDrafts.id });

    return rows.length;
  }
}

export const attemptDraftService = new AttemptDraftService();
