import fs from "node:fs";
import path from "node:path";
import {
  GEO_CLI_001_CP008_REVIEW_BATCH_V2,
  auditGeoCli001Cp008ReviewBatchV2,
} from "./geo-cli-001-cp008-review-batch-v2";

const audit = auditGeoCli001Cp008ReviewBatchV2();
if (!audit.valid) throw new Error(`GEO-CLI-001 CP008 V2 export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-CLI-001-CP008-V2");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-CLI-001 CP008 — Regional Rainfall & Orographic Patterns — Review Batch V2",
  "",
  "Revision note: learner-facing stems simplified and tightened for exam-grade style; facts, options, answers, difficulty and QL ownership unchanged from V1.",
  "",
  `Question count: ${audit.questionCount}`,
  `Difficulty: Easy ${audit.difficultyCounts.Easy} / Medium ${audit.difficultyCounts.Medium} / Hard ${audit.difficultyCounts.Hard}`,
  `Answer positions: A${audit.answerPositions[0]} / B${audit.answerPositions[1]} / C${audit.answerPositions[2]} / D${audit.answerPositions[3]}`,
  "",
];

GEO_CLI_001_CP008_REVIEW_BATCH_V2.forEach((question, index) => {
  lines.push(
    `## ${index + 1}. ${question.stem}`,
    "",
    ...question.options.map((option, i) => `${letters[i]}. ${option}`),
    "",
    `**Answer:** ${letters[question.correctIndex]}. ${question.canonicalAnswer}`,
    "",
    `**Explanation:** ${question.explanation}`,
    "",
    `**Difficulty:** ${question.difficulty}`,
    `**QL:** ${question.qlId} — ${question.qlName}`,
    "",
  );
});

const baseName = "GEO-CLI-001-CP008-REVIEW-BATCH-V2";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), lines.join("\n"));
fs.writeFileSync(path.join(outDir, `${baseName}.json`), JSON.stringify({ audit, questions: GEO_CLI_001_CP008_REVIEW_BATCH_V2 }, null, 2));
console.log(JSON.stringify(audit));
