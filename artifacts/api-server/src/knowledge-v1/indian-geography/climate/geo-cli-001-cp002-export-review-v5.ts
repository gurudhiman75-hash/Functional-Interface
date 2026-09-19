import fs from "node:fs";
import path from "node:path";
import {
  GEO_CLI_001_CP002_REVIEW_BATCH_V5,
  auditGeoCli001Cp002ReviewBatchV5,
} from "./geo-cli-001-cp002-review-batch-v5";

const audit = auditGeoCli001Cp002ReviewBatchV5();
if (!audit.valid) throw new Error("GEO-CLI-001 CP002 V5 export blocked: " + audit.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-CLI-001-CP002-V5");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-CLI-001 CP002 — Monsoon Mechanism & Seasonal Wind Reversal — Review Batch V5",
  "",
  "Post-merge remediation: missing Madagascar/Mascarene High and Tibetan Plateau mechanism coverage added; all explanations rewritten question-by-question.",
  "",
  "Question count: " + audit.questionCount,
  "Difficulty: Easy " + audit.difficultyCounts.Easy + " / Medium " + audit.difficultyCounts.Medium + " / Hard " + audit.difficultyCounts.Hard,
  "Answer positions: A" + audit.answerPositions[0] + " / B" + audit.answerPositions[1] + " / C" + audit.answerPositions[2] + " / D" + audit.answerPositions[3],
  "",
];

GEO_CLI_001_CP002_REVIEW_BATCH_V5.forEach((question, index) => {
  lines.push(
    "## " + (index + 1) + ". " + question.stem,
    "",
    ...question.options.map((option, i) => letters[i] + ". " + option),
    "",
    "**Answer:** " + letters[question.correctIndex] + ". " + question.canonicalAnswer,
    "",
    "**Explanation:** " + question.explanation,
    "",
    "**Difficulty:** " + question.difficulty,
    "**QL:** " + question.qlId + " — " + question.qlName,
    "",
  );
});

const baseName = "GEO-CLI-001-CP002-REVIEW-BATCH-V5";
fs.writeFileSync(path.join(outDir, baseName + ".md"), lines.join("\n"));
fs.writeFileSync(
  path.join(outDir, baseName + ".json"),
  JSON.stringify({ audit, questions: GEO_CLI_001_CP002_REVIEW_BATCH_V5 }, null, 2),
);
console.log(JSON.stringify(audit));
