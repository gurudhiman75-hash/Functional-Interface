/**
 * populate-global-topics.ts
 *
 * Safe, idempotent migration that:
 *   1. Normalises questions.topic strings (trim + title-case).
 *   2. Ensures every unique topic exists in topics_global (inserts if absent).
 *   3. Populates questions.global_topic_id by case-insensitive match.
 *   4. Never overwrites an already-set globalTopicId.
 *   5. Never drops / removes any column or table.
 *   6. Logs every null or unmatched topic for manual review.
 *   7. Reports whether a NOT NULL constraint can safely be applied.
 *
 * Run via:
 *   pnpm run db:populate-global-topics
 */

import { sql } from "drizzle-orm";
import { db } from "./src/lib/db";
import { randomUUID } from "node:crypto";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** "hello  world" → "Hello World" */
function toTitleCase(str: string): string {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

/** Normalise for comparison: trim + collapse whitespace + lower-case. */
function normalise(str: string): string {
  return str.trim().replace(/\s+/g, " ").toLowerCase();
}

// ── Row types ─────────────────────────────────────────────────────────────────

interface QuestionRow {
  id: number;
  topic: string | null;
  global_topic_id: string | null;
}

interface TopicGlobalRow {
  id: string;
  name: string;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function populateGlobalTopics(): Promise<void> {
  console.log("\n🔄  populate-global-topics: starting…\n");

  // ── Step 1: Fetch all existing topics_global entries ──────────────────────
  const existingTopicsResult = await db.execute<TopicGlobalRow>(sql`
    SELECT id, name FROM topics_global ORDER BY name
  `);
  const existingTopics: TopicGlobalRow[] = existingTopicsResult.rows ?? (existingTopicsResult as unknown as TopicGlobalRow[]);

  /** normalised_name → { id, name } */
  const topicMap = new Map<string, TopicGlobalRow>();
  for (const t of existingTopics) {
    topicMap.set(normalise(t.name), t);
  }
  console.log(`   topics_global: ${existingTopics.length} existing entries`);

  // ── Step 2: Collect all distinct topic strings from questions ─────────────
  const distinctTopicsResult = await db.execute<{ topic: string | null }>(sql`
    SELECT DISTINCT topic FROM questions ORDER BY topic
  `);
  const distinctTopics: (string | null)[] = (
    distinctTopicsResult.rows ?? (distinctTopicsResult as unknown as { topic: string | null }[])
  ).map((r) => r.topic);

  console.log(`   questions: ${distinctTopics.length} distinct topic value(s)\n`);

  const nullTopicQuestions: number[] = [];

  // ── Step 3: Ensure every topic exists in topics_global ───────────────────
  let inserted = 0;
  for (const rawTopic of distinctTopics) {
    if (rawTopic === null || rawTopic.trim() === "") {
      // Will be logged per-question later
      continue;
    }

    const key = normalise(rawTopic);
    if (!topicMap.has(key)) {
      const canonical = toTitleCase(rawTopic);
      const newId = `gtopic-${randomUUID()}`;
      await db.execute(sql`
        INSERT INTO topics_global (id, name)
        VALUES (${newId}, ${canonical})
        ON CONFLICT (name) DO NOTHING
      `);
      // After insert, re-fetch by normalised name (ON CONFLICT may have hit a
      // differently-cased existing entry — fetch the real winner).
      const fetchedResult = await db.execute<TopicGlobalRow>(sql`
        SELECT id, name FROM topics_global WHERE LOWER(TRIM(name)) = ${key}
      `);
      const fetched = (fetchedResult.rows ?? (fetchedResult as unknown as TopicGlobalRow[]))[0];
      if (fetched) {
        topicMap.set(key, fetched);
        inserted++;
        console.log(`   ✚ Inserted topics_global: "${fetched.name}" (${fetched.id})`);
      } else {
        console.warn(`   ⚠  Could not confirm insert for topic "${rawTopic}" — skipping.`);
      }
    }
  }

  if (inserted === 0) {
    console.log("   All distinct topics already present in topics_global.\n");
  } else {
    console.log(`\n   ${inserted} new topic(s) added to topics_global.\n`);
  }

  // ── Step 4: Fetch questions without globalTopicId ─────────────────────────
  const questionsResult = await db.execute<QuestionRow>(sql`
    SELECT id, topic, global_topic_id
    FROM   questions
    WHERE  global_topic_id IS NULL
    ORDER  BY id
  `);
  const questions: QuestionRow[] = questionsResult.rows ?? (questionsResult as unknown as QuestionRow[]);

  if (questions.length === 0) {
    console.log("✅  All questions already have global_topic_id — nothing to update.\n");
  } else {
    console.log(`   ${questions.length} question(s) need global_topic_id populated.\n`);
  }

  // ── Step 5: Populate globalTopicId per question ───────────────────────────
  let updated = 0;
  let skippedNull = 0;
  let skippedUnmatched = 0;
  const unmatchedLog: { id: number; topic: string | null; reason: string }[] = [];

  for (const q of questions) {
    // Already set (re-checked in-loop, defensive)
    if (q.global_topic_id !== null) continue;

    if (q.topic === null || q.topic.trim() === "") {
      skippedNull++;
      unmatchedLog.push({ id: q.id, topic: q.topic, reason: "topic is NULL or empty" });
      continue;
    }

    const key = normalise(q.topic);
    const match = topicMap.get(key);

    if (!match) {
      skippedUnmatched++;
      unmatchedLog.push({
        id: q.id,
        topic: q.topic,
        reason: `No topics_global entry for "${q.topic}" (normalised: "${key}")`,
      });
      continue;
    }

    await db.execute(sql`
      UPDATE questions
      SET    global_topic_id = ${match.id}
      WHERE  id = ${q.id}
        AND  global_topic_id IS NULL
    `);
    updated++;
  }

  // ── Step 6: Logs ──────────────────────────────────────────────────────────
  console.log(`\n── Results ─────────────────────────────────────────────────────`);
  console.log(`   Updated:           ${updated}`);
  console.log(`   Skipped (null):    ${skippedNull}`);
  console.log(`   Skipped (no match):${skippedUnmatched}`);

  if (unmatchedLog.length > 0) {
    console.log(`\n── Unmatched / NULL topics (${unmatchedLog.length} row(s)) ─────────────`);
    for (const entry of unmatchedLog) {
      console.log(`   question id=${entry.id}  topic=${JSON.stringify(entry.topic)}  reason: ${entry.reason}`);
    }
  }

  // ── Step 7: Verification ──────────────────────────────────────────────────
  console.log(`\n── Verification ────────────────────────────────────────────────`);

  const nullCountResult = await db.execute<{ cnt: string }>(sql`
    SELECT COUNT(*) AS cnt FROM questions WHERE global_topic_id IS NULL
  `);
  const nullCount = parseInt(
    (nullCountResult.rows ?? (nullCountResult as unknown as { cnt: string }[]))[0]?.cnt ?? "0",
    10
  );

  const uniqueTopicsInQuestionsResult = await db.execute<{ cnt: string }>(sql`
    SELECT COUNT(DISTINCT LOWER(TRIM(topic))) AS cnt
    FROM   questions
    WHERE  topic IS NOT NULL AND TRIM(topic) <> ''
  `);
  const uniqueTopicsInQuestions = parseInt(
    (uniqueTopicsInQuestionsResult.rows ?? (uniqueTopicsInQuestionsResult as unknown as { cnt: string }[]))[0]?.cnt ?? "0",
    10
  );

  const globalTopicsCountResult = await db.execute<{ cnt: string }>(sql`
    SELECT COUNT(*) AS cnt FROM topics_global
  `);
  const globalTopicsCount = parseInt(
    (globalTopicsCountResult.rows ?? (globalTopicsCountResult as unknown as { cnt: string }[]))[0]?.cnt ?? "0",
    10
  );

  console.log(`   questions with global_topic_id IS NULL : ${nullCount}`);
  console.log(`   distinct topics in questions           : ${uniqueTopicsInQuestions}`);
  console.log(`   total rows in topics_global            : ${globalTopicsCount}`);

  if (nullCount === 0) {
    console.log(`\n✅  All questions have global_topic_id populated.`);
    console.log(`   You may now safely add a NOT NULL constraint:`);
    console.log(`   ALTER TABLE questions ALTER COLUMN global_topic_id SET NOT NULL;\n`);
  } else {
    console.log(`\n⚠   ${nullCount} question(s) still have NULL global_topic_id.`);
    console.log(`   Resolve the unmatched topics above before adding NOT NULL constraint.\n`);
  }

  if (uniqueTopicsInQuestions === globalTopicsCount) {
    console.log(`✅  Unique topic count matches topics_global row count (${globalTopicsCount}).\n`);
  } else {
    console.log(
      `ℹ   Topic counts differ — questions has ${uniqueTopicsInQuestions} distinct topics,` +
      ` topics_global has ${globalTopicsCount} rows (expected if topics_global has extras).\n`
    );
  }
}

populateGlobalTopics().catch((err) => {
  console.error("❌  populate-global-topics failed:", err);
  process.exit(1);
});
