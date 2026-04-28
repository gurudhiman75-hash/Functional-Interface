import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { patterns, type Pattern } from "@workspace/db";
import { getInMemoryPatterns } from "./template.service";
import { SAMPLE_PATTERNS } from "./patterns.seed";
import type { PatternFilter } from "./generator.types";

function hasDb(): boolean {
  return Boolean(db);
}

async function ensureSeededPatterns() {
  if (!hasDb()) return;
  const existing = await db.select({ id: patterns.id }).from(patterns).limit(1);
  if (existing.length === 0) {
    await db.insert(patterns).values(SAMPLE_PATTERNS as any);
  }
}

export async function listPatterns(): Promise<Pattern[]> {
  if (!hasDb()) return getInMemoryPatterns();
  await ensureSeededPatterns();
  return db.select().from(patterns).orderBy(desc(patterns.createdAt));
}

export async function pickDiversePattern(filter: PatternFilter = {}): Promise<Pattern | null> {
  const ids = Array.isArray(filter.patternIds) ? filter.patternIds.filter(Boolean) : [];
  if (ids.length === 0) {
    return null;
  }

  if (!hasDb()) {
    const all = getInMemoryPatterns();
    const filtered = all.filter((pattern) =>
      (!filter.section || pattern.section === filter.section) &&
      (!filter.topic || pattern.topic === filter.topic) &&
      (!filter.subtopic || pattern.subtopic === filter.subtopic) &&
      (!filter.difficulty || pattern.difficulty === filter.difficulty) &&
      ids.includes(pattern.id),
    );
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)] ?? null;
  }

  await ensureSeededPatterns();

  const clauses = [];
  if (filter.section) clauses.push(eq(patterns.section, filter.section));
  if (filter.topic) clauses.push(eq(patterns.topic, filter.topic));
  if (filter.subtopic) clauses.push(eq(patterns.subtopic, filter.subtopic));
  if (filter.difficulty) clauses.push(eq(patterns.difficulty, filter.difficulty));
  clauses.push(inArray(patterns.id, ids));

  const rows = await db
    .select()
    .from(patterns)
    .where(and(...clauses))
    .orderBy(
      asc(patterns.usageCount),
      asc(sql`COALESCE(${patterns.lastUsedAt}, '1970-01-01'::timestamptz)`),
    )
    .limit(5);

  if (rows.length === 0) return null;
  return rows[Math.floor(Math.random() * rows.length)] ?? null;
}

export async function markPatternUsed(patternId: string) {
  if (!hasDb()) return;
  await db
    .update(patterns)
    .set({
      usageCount: sql`${patterns.usageCount} + 1`,
      lastUsedAt: new Date(),
    })
    .where(eq(patterns.id, patternId));
}
