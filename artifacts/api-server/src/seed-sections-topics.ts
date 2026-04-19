/**
 * seed-sections-topics.ts
 *
 * Idempotent seed script that inserts master sections and global topics into
 * the `sections` and `topics_global` tables.
 *
 * Run via:
 *   pnpm --filter @workspace/api-server exec ts-node src/seed-sections-topics.ts
 *   — or build first and run the compiled output.
 *
 * Uses `onConflictDoNothing()` so it is safe to re-run at any time.
 */

import { db } from "./lib/db";
import { sections, topicsGlobal } from "@workspace/db";

// ── Data ──────────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "sec-quant",    name: "Quantitative Aptitude" },
  { id: "sec-reason",  name: "Reasoning" },
  { id: "sec-english", name: "English" },
  { id: "sec-ga",      name: "General Awareness" },
  { id: "sec-comp",    name: "Computer" },
  { id: "sec-punjabi", name: "Punjabi" },
] satisfies { id: string; name: string }[];

/** Topics listed in insertion order; IDs are stable slug-based strings. */
const TOPICS: { id: string; name: string }[] = [
  // ── Quantitative Aptitude ──────────────────────────────────────────────────
  { id: "top-number-system",          name: "Number System" },
  { id: "top-lcm-hcf",                name: "LCM & HCF" },
  { id: "top-simplification",         name: "Simplification / Approximation" },
  { id: "top-percentage",             name: "Percentage" },
  { id: "top-ratio-proportion",       name: "Ratio & Proportion" },
  { id: "top-average",                name: "Average" },
  { id: "top-profit-loss",            name: "Profit & Loss" },
  { id: "top-simple-interest",        name: "Simple Interest" },
  { id: "top-compound-interest",      name: "Compound Interest" },
  { id: "top-time-work",              name: "Time & Work" },
  { id: "top-pipe-cistern",           name: "Pipe & Cistern" },
  { id: "top-time-speed-distance",    name: "Time, Speed & Distance" },
  { id: "top-boat-stream",            name: "Boat & Stream" },
  { id: "top-mixture-alligation",     name: "Mixture & Alligation" },
  { id: "top-partnership",            name: "Partnership" },
  { id: "top-algebra-basics",         name: "Algebra Basics" },
  { id: "top-linear-equations",       name: "Linear Equations" },
  { id: "top-quadratic-equations",    name: "Quadratic Equations" },
  { id: "top-inequalities",           name: "Inequalities" },
  { id: "top-lines-angles",           name: "Lines & Angles" },
  { id: "top-triangles",              name: "Triangles" },
  { id: "top-quadrilaterals",         name: "Quadrilaterals" },
  { id: "top-circles",                name: "Circles" },
  { id: "top-mensuration-2d",         name: "Mensuration 2D" },
  { id: "top-mensuration-3d",         name: "Mensuration 3D" },
  { id: "top-table-di",               name: "Table DI" },
  { id: "top-bar-graph-di",           name: "Bar Graph DI" },
  { id: "top-pie-chart-di",           name: "Pie Chart DI" },
  { id: "top-line-graph-di",          name: "Line Graph DI" },
  { id: "top-caselet-di",             name: "Caselet DI" },

  // ── Reasoning ─────────────────────────────────────────────────────────────
  { id: "top-coding-decoding",        name: "Coding-Decoding" },
  { id: "top-number-series",          name: "Number Series" },
  { id: "top-alphabet-series",        name: "Alphabet Series" },
  { id: "top-odd-one-out",            name: "Odd One Out" },
  { id: "top-analogy",                name: "Analogy" },
  { id: "top-classification",         name: "Classification" },
  { id: "top-seating-linear",         name: "Seating Arrangement (Linear)" },
  { id: "top-seating-circular",       name: "Seating Arrangement (Circular)" },
  { id: "top-puzzle-basic",           name: "Puzzle (Basic)" },
  { id: "top-puzzle-advanced",        name: "Puzzle (Advanced)" },
  { id: "top-blood-relations",        name: "Blood Relations" },
  { id: "top-direction-sense",        name: "Direction Sense" },
  { id: "top-order-ranking",          name: "Order & Ranking" },
  { id: "top-syllogism",              name: "Syllogism" },
  { id: "top-stmt-conclusion",        name: "Statement & Conclusion" },
  { id: "top-stmt-assumption",        name: "Statement & Assumption" },
  { id: "top-stmt-argument",          name: "Statement & Argument" },
  { id: "top-cause-effect",           name: "Cause & Effect" },
  { id: "top-mirror-image",           name: "Mirror Image" },
  { id: "top-water-image",            name: "Water Image" },
  { id: "top-paper-folding",          name: "Paper Folding" },
  { id: "top-paper-cutting",          name: "Paper Cutting" },
  { id: "top-figure-series",          name: "Figure Series" },
  { id: "top-embedded-figures",       name: "Embedded Figures" },

  // ── English ───────────────────────────────────────────────────────────────
  { id: "top-error-detection",        name: "Error Detection" },
  { id: "top-sentence-improvement",   name: "Sentence Improvement" },
  { id: "top-fill-blanks",            name: "Fill in the Blanks" },
  { id: "top-active-passive",         name: "Active Passive" },
  { id: "top-direct-indirect",        name: "Direct Indirect" },
  { id: "top-synonyms",               name: "Synonyms" },
  { id: "top-antonyms",               name: "Antonyms" },
  { id: "top-one-word-substitution",  name: "One Word Substitution" },
  { id: "top-idioms-phrases",         name: "Idioms & Phrases" },
  { id: "top-spelling-correction",    name: "Spelling Correction" },
  { id: "top-reading-comprehension",  name: "Reading Comprehension" },
  { id: "top-cloze-test",             name: "Cloze Test" },
  { id: "top-para-jumbles",           name: "Para Jumbles" },

  // ── General Awareness ─────────────────────────────────────────────────────
  { id: "top-history",                name: "History" },
  { id: "top-geography",              name: "Geography" },
  { id: "top-polity",                 name: "Polity" },
  { id: "top-economics",              name: "Economics" },
  { id: "top-physics",                name: "Physics" },
  { id: "top-chemistry",              name: "Chemistry" },
  { id: "top-biology",                name: "Biology" },
  { id: "top-current-affairs",        name: "Current Affairs" },

  // ── Computer ──────────────────────────────────────────────────────────────
  { id: "top-computer-basics",        name: "Basics of Computer" },
  { id: "top-ms-office",              name: "MS Office" },
  { id: "top-internet",               name: "Internet" },
  { id: "top-hardware-software",      name: "Hardware & Software" },
  { id: "top-networking",             name: "Networking" },

  // ── Punjabi ───────────────────────────────────────────────────────────────
  { id: "top-punjabi-grammar",        name: "Punjabi Grammar" },
  { id: "top-punjabi-vocabulary",     name: "Punjabi Vocabulary" },
  { id: "top-punjabi-comprehension",  name: "Punjabi Comprehension" },
];

// ── Seed ──────────────────────────────────────────────────────────────────────

async function seedSectionsAndTopics() {
  console.log("Seeding master sections and global topics…\n");

  // ── Sections ──────────────────────────────────────────────────────────────
  console.log("Inserting sections…");
  let sectionInserted = 0;
  let sectionSkipped = 0;

  for (const sec of SECTIONS) {
    const result = await db
      .insert(sections)
      .values(sec)
      .onConflictDoNothing()
      .returning({ id: sections.id });

    if (result.length > 0) {
      sectionInserted++;
      console.log(`  ✓ [new]  ${sec.name}`);
    } else {
      sectionSkipped++;
      console.log(`  – [skip] ${sec.name}`);
    }
  }

  console.log(`\nSections: ${sectionInserted} inserted, ${sectionSkipped} already existed.\n`);

  // ── Topics ────────────────────────────────────────────────────────────────
  console.log("Inserting global topics…");
  let topicInserted = 0;
  let topicSkipped = 0;

  for (const topic of TOPICS) {
    const result = await db
      .insert(topicsGlobal)
      .values(topic)
      .onConflictDoNothing()
      .returning({ id: topicsGlobal.id });

    if (result.length > 0) {
      topicInserted++;
      console.log(`  ✓ [new]  ${topic.name}`);
    } else {
      topicSkipped++;
      console.log(`  – [skip] ${topic.name}`);
    }
  }

  console.log(`\nTopics: ${topicInserted} inserted, ${topicSkipped} already existed.`);
  console.log("\nDone.\n");
}

seedSectionsAndTopics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
