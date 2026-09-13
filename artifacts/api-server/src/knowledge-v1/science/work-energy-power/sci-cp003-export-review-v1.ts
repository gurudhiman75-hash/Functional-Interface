import fs from "node:fs/promises";
import path from "node:path";
import { SCI_CP003_REVIEW_BATCH_V1, auditSciCp003ReviewBatchV1 } from "./sci-cp003-review-v1";

const audit = auditSciCp003ReviewBatchV1();
if (!audit.valid) throw new Error(`SCI-CP-003 export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/science-review/SCI-CP-003-V1");
await fs.mkdir(outDir, { recursive: true });

const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# SCI-CP-003 — Work, Energy & Power — Review Batch V1",
  "",
  "Status: REVIEW-ONLY CANDIDATE V1",
  "",
  `Questions: ${audit.questionCount}`,
  `Semantic unique: ${audit.semanticCount}`,
  `Difficulty: Easy ${audit.difficultyCounts.Easy} / Medium ${audit.difficultyCounts.Medium} / Hard ${audit.difficultyCounts.Hard}`,
  `Answer positions: A${audit.answerPositions[0]} / B${audit.answerPositions[1]} / C${audit.answerPositions[2]} / D${audit.answerPositions[3]}`,
  "",
];

let currentQl = "";
for (const question of SCI_CP003_REVIEW_BATCH_V1) {
  if (question.qlId !== currentQl) {
    currentQl = question.qlId;
    lines.push(`## ${question.qlId} — ${question.qlName}`, "");
  }
  lines.push(`### ${question.questionId} · ${question.difficulty}`, "", question.stem, "");
  question.options.forEach((option, index) => lines.push(`${letters[index]}. ${option}`));
  lines.push("", `**Answer:** ${letters[question.correctIndex]}. ${question.canonicalAnswer}`, "", `**Explanation:** ${question.explanation}`, "");
}

await fs.writeFile(path.join(outDir, "SCI-CP-003-REVIEW-V1.md"), `${lines.join("\n")}\n`, "utf8");
await fs.writeFile(path.join(outDir, "SCI-CP-003-REVIEW-V1.json"), `${JSON.stringify({ audit, questions: SCI_CP003_REVIEW_BATCH_V1 }, null, 2)}\n`, "utf8");
console.log(`Wrote SCI-CP-003 review artifact to ${outDir}`);
