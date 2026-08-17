import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  SAP_CP006_REVIEW_CATALOGUE,
  generateSapCp006ReviewRecords,
} from "./review-export";

const markdownPath = resolve(process.argv[2] ?? "dist/SAP-CP-006-120-FOUNDATION-REVIEW.md");
const jsonPath = resolve(process.argv[3] ?? "dist/SAP-CP-006-120-FOUNDATION-REVIEW.json");
const records = generateSapCp006ReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const titleByPrototype = new Map(SAP_CP006_REVIEW_CATALOGUE.map((item) => [item.prototypeId, item.title]));

const markdown: string[] = [
  "# SAP-CP-006 — 120-Question Foundation Review",
  "",
  "**Checkpoint:** Missing Values, Equality, Comparison and Exact Synthesis  ",
  "**Status:** Provisional review surface; inactive and unallocated  ",
  "**Candidate coordinates:** SAP-QL-092 through SAP-QL-103  ",
  "**Coverage:** 12 foundation modes × 10 questions = 120 questions  ",
  "",
];

for (const [index, record] of records.entries()) {
  markdown.push(
    `## Question ${index + 1} — ${record.proposedPermanentQlId}`,
    "",
    `**Authority:** ${titleByPrototype.get(record.prototypeId) ?? record.prototypeId}  `,
    `**Direction:** ${record.taskDirection}  `,
    `**Difficulty:** ${record.difficulty}  `,
    `**Seed:** ${record.seed}  `,
    "",
    record.stem,
    "",
  );
  record.options.forEach((option, optionIndex) => markdown.push(`${labels[optionIndex]}. ${option.value}`));
  markdown.push("", `**Correct answer:** ${labels[record.correctIndex]}. ${record.canonicalAnswer}`, "", "### Explanation", "", record.explanation.coreConcept, "");
  record.explanation.steps.forEach((step, stepIndex) => markdown.push(`${stepIndex + 1}. ${step}`));
  markdown.push("", "### Verification", "");
  record.explanation.verification.forEach((step) => markdown.push(`- ${step}`));
  markdown.push("", record.explanation.finalAnswer, "", "### Distractor analysis", "");
  record.options.forEach((option, optionIndex) => {
    if (!option.isCorrect) markdown.push(`- **${labels[optionIndex]}. ${option.value} — ${option.misconceptionId}:** ${option.analysis}`);
  });
  markdown.push("", "---", "");
}

for (const path of [markdownPath, jsonPath]) mkdirSync(dirname(path), { recursive: true });
writeFileSync(markdownPath, markdown.join("\n"), "utf8");
writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf8");
console.log(JSON.stringify({ status: "WROTE_SAP_CP006_FOUNDATION_REVIEW", questionCount: records.length, markdownPath, jsonPath }, null, 2));
