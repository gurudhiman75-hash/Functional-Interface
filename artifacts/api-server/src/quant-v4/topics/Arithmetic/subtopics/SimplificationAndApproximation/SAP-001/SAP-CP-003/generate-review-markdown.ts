import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp003ReviewRecords } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-003-300-QUESTIONS-AND-ANSWERS.md");
const records = generateSapCp003ReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const lines: string[] = [
  "# SAP-CP-003 — 300 Questions and Answers",
  "",
  "**Checkpoint:** Decimals, Percentages and Exact Representation Switching  ",
  "**Status:** Executable discovery; human review pending  ",
  "**Permanent QL allocation:** Not allocated  ",
  "",
];

for (const record of records) {
  lines.push(`## ${record.questionId}`, "", record.stem, "");
  record.options.forEach((option, index) => lines.push(`${labels[index]}. ${option.value}`));
  lines.push("", `**Answer:** ${labels[record.correctIndex]}. ${record.correctAnswer}`, "", "---", "");
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({
  status: "WROTE_SAP_CP003_COMPACT_REVIEW",
  outputPath,
  questionCount: records.length,
  uniquePayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
}, null, 2));
