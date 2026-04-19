/**
 * seed-english-topics.ts
 *
 * Safe, idempotent script that inserts the canonical English section topics
 * into topics_global. Uses ON CONFLICT DO NOTHING — safe to run multiple
 * times in production with zero risk of duplicates or data loss.
 *
 * Run via:
 *   pnpm --filter @workspace/api-server db:seed-english-topics
 */

import { sql } from "drizzle-orm";
import { db } from "./src/lib/db";
import { randomUUID } from "node:crypto";

// ── English topic taxonomy ────────────────────────────────────────────────────
// Grouped by category for readability; all inserted flat into topics_global.

const ENGLISH_TOPICS: string[] = [
  // GRAMMAR
  "Error Detection",
  "Sentence Improvement",
  "Fill in the Blanks",
  "Cloze Test",
  "Para Jumbles",
  "Sentence Rearrangement",

  // PARTS OF SPEECH
  "Noun",
  "Pronoun",
  "Verb",
  "Adjective",
  "Adverb",
  "Preposition",
  "Conjunction",
  "Articles",

  // TENSE & STRUCTURE
  "Tenses",
  "Subject-Verb Agreement",
  "Active & Passive Voice",
  "Direct & Indirect Speech",

  // VOCABULARY
  "Synonyms",
  "Antonyms",
  "One Word Substitution",
  "Idioms & Phrases",
  "Spelling Correction",
  "Word Usage",

  // COMPREHENSION
  "Reading Comprehension",

  // ADVANCED
  "Phrase Replacement",
  "Sentence Correction (Advanced)",
  "Match the Column",
  "Word Swap",
];

interface TopicGlobalRow {
  id: string;
  name: string;
}

/** Normalise for comparison: trim + collapse whitespace + lower-case. */
function normalise(str: string): string {
  return str.trim().replace(/\s+/g, " ").toLowerCase();
}

async function seedEnglishTopics(): Promise<void> {
  console.log("\n🔄  seed-english-topics: starting…\n");
  console.log(`   Topics to ensure: ${ENGLISH_TOPICS.length}\n`);

  // Fetch all existing topics_global entries
  const existingResult = await db.execute<TopicGlobalRow>(
    sql`SELECT id, name FROM topics_global ORDER BY name`,
  );
  const existing: TopicGlobalRow[] =
    existingResult.rows ?? (existingResult as unknown as TopicGlobalRow[]);

  const topicMap = new Map<string, TopicGlobalRow>();
  for (const t of existing) {
    topicMap.set(normalise(t.name), t);
  }
  console.log(`   topics_global: ${existing.length} existing entries\n`);

  let inserted = 0;
  let skipped = 0;

  for (const name of ENGLISH_TOPICS) {
    const key = normalise(name);

    if (topicMap.has(key)) {
      console.log(`   ✔  Already exists: "${topicMap.get(key)!.name}"`);
      skipped++;
      continue;
    }

    const newId = `gtopic-${randomUUID()}`;
    await db.execute(sql`
      INSERT INTO topics_global (id, name)
      VALUES (${newId}, ${name})
      ON CONFLICT (name) DO NOTHING
    `);

    // Re-fetch to confirm (another concurrent insert may have won the race)
    const fetchedResult = await db.execute<TopicGlobalRow>(
      sql`SELECT id, name FROM topics_global WHERE LOWER(TRIM(name)) = ${key}`,
    );
    const fetched = (
      fetchedResult.rows ?? (fetchedResult as unknown as TopicGlobalRow[])
    )[0];

    if (fetched) {
      topicMap.set(key, fetched);
      console.log(`   ✚  Inserted: "${fetched.name}" (${fetched.id})`);
      inserted++;
    } else {
      console.warn(`   ⚠  Could not confirm insert for "${name}" — skipping.`);
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅  Done.
     Inserted : ${inserted}
     Skipped  : ${skipped} (already present)
     Total    : ${ENGLISH_TOPICS.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  process.exit(0);
}

seedEnglishTopics().catch((err) => {
  console.error("\n❌  seed-english-topics failed:", err);
  process.exit(1);
});
