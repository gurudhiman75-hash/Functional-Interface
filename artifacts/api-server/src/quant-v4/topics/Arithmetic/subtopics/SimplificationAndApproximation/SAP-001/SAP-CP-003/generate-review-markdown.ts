import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp003ReviewRecords } from "./review-export";

const outputPath = resolve(process.argv[2] ?? "dist/SAP-CP-003-300-QUESTIONS-AND-ANSWERS-V3.md");
const records = generateSapCp003ReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const lines: string[] = [
  "# SAP-CP-003 — 300 Questions and Answers — Editorial Remediation V3",
  "",
  "**Checkpoint:** Decimals, Percentages and Exact Representation Switching  ",
  "**Status:** Human editorial review approved on 2026-08-08  ",
  "**Permanent QL allocation:** SAP-QL-034 through SAP-QL-052 retained  ",
  "**Question Studio and mock use:** Disabled pending merge and subsequent activation authorisation  ",
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
  status: "WROTE_SAP_CP003_COMPACT_REVIEW_V3_APPROVED",
  outputPath,
  questionCount: records.length,
  uniquePayloads: new Set(records.map((record) => record.canonicalPayloadKey)).size,
  prototypeCount: new Set(records.map((record) => record.prototypeId)).size,
  lifecycle: "INACTIVE_HUMAN_REVIEW_APPROVED_AWAITING_MERGE_AUTHORIZATION",
}, null, 2));
