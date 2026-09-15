import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  GEO_CLI_001_CP001_REVIEW_BATCH_V3,
  auditGeoCli001Cp001ReviewBatchV3,
} from "./geo-cli-001-cp001-review-batch-v3";

const audit = auditGeoCli001Cp001ReviewBatchV3();
if (!audit.valid) throw new Error(audit.issues.join("\n"));

const outputDir = join(process.cwd(), "dist", "geography-review", "GEO-CLI-001-CP001-V3");
mkdirSync(outputDir, { recursive: true });

const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-CLI-001 CP001 — Climate Controls & Monsoon Character",
  "",
  `Question count: ${audit.questionCount}`,
  `Difficulty: Easy ${audit.difficultyCounts.Easy} / Medium ${audit.difficultyCounts.Medium} / Hard ${audit.difficultyCounts.Hard}`,
  `Answer positions: A${audit.answerPositions[0]} / B${audit.answerPositions[1]} / C${audit.answerPositions[2]} / D${audit.answerPositions[3]}`,
  "",
];

GEO_CLI_001_CP001_REVIEW_BATCH_V3.forEach((question, index) => {
  lines.push(`## ${index + 1}. ${question.stem}`);
  lines.push("");
  question.options.forEach((option, optionIndex) => lines.push(`${letters[optionIndex]}. ${option}`));
  lines.push("");
  lines.push(`**Answer:** ${letters[question.correctIndex]}. ${question.canonicalAnswer}`);
  lines.push("");
  lines.push(`**Explanation:** ${question.explanation}`);
  lines.push("");
  lines.push(`**Difficulty:** ${question.difficulty}`);
  lines.push(`**QL:** ${question.qlId} — ${question.qlName}`);
  lines.push("");
});

writeFileSync(join(outputDir, "GEO-CLI-001-CP001-REVIEW-BATCH-V3.md"), `${lines.join("\n")}\n`, "utf8");
writeFileSync(join(outputDir, "GEO-CLI-001-CP001-REVIEW-BATCH-V3.json"), `${JSON.stringify({ audit, questions: GEO_CLI_001_CP001_REVIEW_BATCH_V3 }, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ outputDir, ...audit }, null, 2));
