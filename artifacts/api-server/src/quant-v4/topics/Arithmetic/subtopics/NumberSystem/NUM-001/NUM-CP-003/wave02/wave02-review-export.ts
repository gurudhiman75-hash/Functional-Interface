import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp003Wave02 } from "./runtime";
import { NUM_CP003_WAVE02_IDS } from "./types";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const records = NUM_CP003_WAVE02_IDS.flatMap((prototypeId) =>
  ["review-0", "review-1", "review-2"].map((seed) => generateNumCp003Wave02(prototypeId, seed)),
);

const jsonPath = resolve(outputDirectory, "num-001-cp003-gap-wave-02-review.json");
const markdownPath = resolve(outputDirectory, "num-001-cp003-gap-wave-02-review.md");

writeFileSync(
  jsonPath,
  JSON.stringify(records, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# NUM-CP-003 Gap Wave 02 — English Review Pack",
  "",
  `Questions: ${records.length}`,
  `Temporary prototypes: ${NUM_CP003_WAVE02_IDS.length}`,
  "Permanent QLs: 0",
  "",
  ...records.flatMap((record, index) => [
    `## ${index + 1}. ${record.prototypeId} — ${record.seed}`,
    "",
    `**Difficulty:** ${record.difficulty}`,
    "",
    `**Answer semantic:** ${record.answerSemantic}`,
    "",
    `**Stem:** ${record.stem}`,
    "",
    ...record.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}${optionIndex === record.correctIndex ? " **✓**" : ""}`),
    "",
    `**Answer:** ${record.answer}`,
    "",
    `**Core Concept:** ${record.explanation.coreConcept}`,
    "",
    `**Strategy:** ${record.explanation.strategy}`,
    "",
    ...record.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
    "",
    `**Shortcut:** ${record.explanation.shortcut}`,
    "",
    `**Verification:** ${record.explanation.verification}`,
    "",
    `**Conclusion:** ${record.explanation.conclusion}`,
    "",
    "**Option audit:**",
    ...record.optionAudit.map((row) => `- ${row.text}: ${row.misconceptionId} — ${row.diagnostic}`),
    "",
    "**Lifecycle:** temporary, not stored, test-ineligible, not public, not Question Studio discoverable.",
    "",
    "---",
    "",
  ]),
].join("\n");

writeFileSync(markdownPath, markdown, "utf8");
console.log(JSON.stringify({ status: "PASS", records: records.length, jsonPath, markdownPath }, null, 2));
