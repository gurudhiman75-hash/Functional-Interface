/**
 * normalize-questions.ts
 *
 * Safely backfills questions.section_id and questions.topic_id by matching
 * the free-text `section` / `topic` columns against the sections/topics
 * master tables.
 *
 * Safe to run multiple times (idempotent).
 * Does NOT fail on unmatched rows — those are logged for manual review.
 * Does NOT modify the `section` or `topic` text columns.
 */

import { sql } from "drizzle-orm";
import { db } from "./src/lib/db";

// ── Normalisation maps ────────────────────────────────────────────────────────

/** Canonical section name → master-table id */
const SECTION_ALIASES: Record<string, string> = {
  // Quant
  quant:                  "sec-quant",
  quantitative:           "sec-quant",
  "quantitative aptitude":"sec-quant",
  "quantitative ability": "sec-quant",
  qa:                     "sec-quant",
  maths:                  "sec-quant",
  mathematics:            "sec-quant",
  math:                   "sec-quant",
  arithmetic:             "sec-quant",
  numeracy:               "sec-quant",

  // Reasoning
  reasoning:              "sec-reasoning",
  "logical reasoning":    "sec-reasoning",
  "verbal reasoning":     "sec-reasoning",
  "non-verbal reasoning": "sec-reasoning",
  lr:                     "sec-reasoning",
  logic:                  "sec-reasoning",
  aptitude:               "sec-reasoning",

  // English
  english:                "sec-english",
  "english language":     "sec-english",
  "general english":      "sec-english",
  verbal:                 "sec-english",
  "verbal ability":       "sec-english",
  language:               "sec-english",
};

/** Canonical topic name → master-table id (scoped to section) */
const TOPIC_ALIASES: Record<string, string> = {
  // Quant topics
  arithmetic:             "topic-arithmetic",
  "basic arithmetic":     "topic-arithmetic",
  "number system":        "topic-arithmetic",
  numbers:                "topic-arithmetic",

  algebra:                "topic-algebra",
  "linear equations":     "topic-algebra",
  equations:              "topic-algebra",

  percentage:             "topic-percentage",
  percentages:            "topic-percentage",
  "%":                    "topic-percentage",

  ratio:                  "topic-ratio",
  "ratio and proportion": "topic-ratio",
  "ratios":               "topic-ratio",
  proportion:             "topic-ratio",

  // Reasoning topics
  "coding-decoding":      "topic-coding",
  "coding decoding":      "topic-coding",
  coding:                 "topic-coding",
  decoding:               "topic-coding",

  series:                 "topic-series",
  "number series":        "topic-series",
  "letter series":        "topic-series",
  sequence:               "topic-series",

  analogy:                "topic-analogy",
  analogies:              "topic-analogy",

  // English topics
  "error detection":      "topic-error",
  "error spotting":       "topic-error",
  "spotting errors":      "topic-error",
  "error finding":        "topic-error",
  errors:                 "topic-error",

  "fill in the blanks":   "topic-fillinblanks",
  "fill in the blank":    "topic-fillinblanks",
  "fill in blanks":       "topic-fillinblanks",
  fillers:                "topic-fillinblanks",
  "cloze test":           "topic-fillinblanks",

  // Catch-all for generic seed values
  general:                undefined as unknown as string, // intentionally unmatched
};

function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function resolveSectionId(section: string): string | null {
  return SECTION_ALIASES[normalise(section)] ?? null;
}

function resolveTopicId(topic: string): string | null {
  const r = TOPIC_ALIASES[normalise(topic)];
  return r ?? null;
}

// ── Main ─────────────────────────────────────────────────────────────────────

interface QuestionRow {
  id: number;
  section: string;
  topic: string;
  section_id: string | null;
  topic_id: string | null;
}

async function normalizeQuestions(): Promise<void> {
  console.log("\n🔄  normalize-questions: starting…\n");

  // Fetch all questions that still have NULL section_id or topic_id
  const rows = await db.execute<QuestionRow>(sql`
    SELECT id, section, topic, section_id, topic_id
    FROM   questions
    WHERE  section_id IS NULL OR topic_id IS NULL
    ORDER  BY id
  `);

  const questions = rows.rows ?? (rows as unknown as QuestionRow[]);

  if (questions.length === 0) {
    console.log("✅  All questions already have section_id and topic_id — nothing to do.");
    process.exit(0);
  }

  console.log(`   Found ${questions.length} question(s) to process.\n`);

  let updated = 0;
  let skipped = 0;
  const unmatched: { id: number; section: string; topic: string; reason: string }[] = [];

  for (const q of questions) {
    const sectionId = q.section_id ?? resolveSectionId(q.section);
    const topicId   = q.topic_id   ?? resolveTopicId(q.topic);

    if (!sectionId) {
      unmatched.push({ id: q.id, section: q.section, topic: q.topic, reason: `No section mapping for "${q.section}"` });
      skipped++;
      continue;
    }

    // If topic not matched, still update section_id and log the topic as unmatched
    if (!topicId) {
      unmatched.push({ id: q.id, section: q.section, topic: q.topic, reason: `No topic mapping for "${q.topic}" (section "${q.section}" → ${sectionId})` });
    }

    // Only write columns that changed
    const newSectionId = q.section_id !== sectionId ? sectionId : null;
    const newTopicId   = q.topic_id   !== topicId   ? topicId   : null;

    if (!newSectionId && !newTopicId) {
      // Both already set correctly
      skipped++;
      continue;
    }

    try {
      if (newSectionId && newTopicId) {
        await db.execute(sql`
          UPDATE questions
          SET    section_id = ${sectionId},
                 topic_id   = ${topicId}
          WHERE  id = ${q.id}
        `);
      } else if (newSectionId) {
        await db.execute(sql`
          UPDATE questions
          SET    section_id = ${sectionId}
          WHERE  id = ${q.id}
        `);
      } else if (newTopicId) {
        await db.execute(sql`
          UPDATE questions
          SET    topic_id = ${topicId}
          WHERE  id = ${q.id}
        `);
      }
      updated++;
    } catch (err) {
      unmatched.push({
        id: q.id,
        section: q.section,
        topic: q.topic,
        reason: `DB update failed: ${(err as Error).message}`,
      });
      skipped++;
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log(`\n📊  Results:`);
  console.log(`   ✅  Updated : ${updated}`);
  console.log(`   ⏭   Skipped : ${skipped}`);
  console.log(`   ⚠️   Unmatched: ${unmatched.length}\n`);

  if (unmatched.length > 0) {
    console.log("⚠️  The following rows need manual review:");
    console.log("─".repeat(80));
    for (const u of unmatched) {
      console.log(`  id=${u.id}  section="${u.section}"  topic="${u.topic}"`);
      console.log(`    → ${u.reason}`);
    }
    console.log("─".repeat(80));
    console.log("\n   Add aliases to SECTION_ALIASES / TOPIC_ALIASES and re-run to fix them.\n");
  }

  console.log("✅  normalize-questions complete.\n");
  process.exit(0);
}

normalizeQuestions().catch((err) => {
  console.error("normalize-questions failed:", err);
  process.exit(1);
});
