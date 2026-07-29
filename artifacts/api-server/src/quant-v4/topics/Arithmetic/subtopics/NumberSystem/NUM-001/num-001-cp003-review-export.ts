import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { generateNumCp003Prototype } from "./foundation/runtime-reviewed";
import { NUM_CP003_PROTOTYPE_IDS } from "./foundation/types";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const records = NUM_CP003_PROTOTYPE_IDS.flatMap((prototypeId) =>
  ["review-0", "review-1", "review-2"].map((seed) => generateNumCp003Prototype(prototypeId, seed)),
);

const jsonPath = resolve(outputDirectory, "num-001-cp003-prototype-review.json");
const markdownPath = resolve(outputDirectory, "num-001-cp003-prototype-review.md");

writeFileSync(
  jsonPath,
  JSON.stringify(records, (_key, value) => typeof value === "bigint" ? value.toString() : value, 2),
  "utf8",
);

const markdown = [
  "# NUM-CP-003 Prototype Foundation — English Review Pack",
  "",
  `Questions: ${records.length}`,
  `Temporary prototypes: ${NUM_CP003_PROTOTYPE_IDS.length}`,
  "Permanent QLs: 0",
  "",
  ...records.flatMap((record, index) => [
    `## ${index + 1}. ${record.prototypeId} — ${record.seed}`,
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
    "---",
    "",
  ]),
].join("\n");

writeFileSync(markdownPath, markdown, "utf8");
console.log(JSON.stringify({ status: "PASS", records: records.length, jsonPath, markdownPath }, null, 2));
