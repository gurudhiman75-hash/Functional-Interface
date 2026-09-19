import fs from "node:fs";
import path from "node:path";
import {
  GEO_CLI_001_CP013_REVIEW_BATCH_V6,
  auditGeoCli001Cp013ReviewBatchV6,
} from "./geo-cli-001-cp013-review-batch-v6";

const audit = auditGeoCli001Cp013ReviewBatchV6();
if (!audit.valid) throw new Error("GEO-CLI-001 CP013 V6 export blocked: " + audit.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-CLI-001-CP013-V6");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-CLI-001 CP013 — Exhaustive Mixed Climate Mastery — Review Batch V6",
  "",
  "V6 is synchronized to the post-merge remediated owning authority V3.",
  "",
  "Question count: " + audit.questionCount,
  "QL coverage: " + audit.qlCount,
  "Difficulty: Easy " + audit.difficultyCounts.Easy + " / Medium " + audit.difficultyCounts.Medium + " / Hard " + audit.difficultyCounts.Hard,
  "Answer positions: A" + audit.answerPositions[0] + " / B" + audit.answerPositions[1] + " / C" + audit.answerPositions[2] + " / D" + audit.answerPositions[3],
  "Semantic refreshes from V5: " + audit.semanticRefreshCount,
  "Stem refreshes from V5: " + audit.stemRefreshCount,
  "",
];

GEO_CLI_001_CP013_REVIEW_BATCH_V6.forEach((question, index) => {
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
    "**Source question:** " + question.sourceQuestionId,
    "",
  );
});

const baseName = "GEO-CLI-001-CP013-REVIEW-BATCH-V6";
fs.writeFileSync(path.join(outDir, baseName + ".md"), lines.join("\n"));
fs.writeFileSync(path.join(outDir, baseName + ".json"), JSON.stringify({ audit, questions: GEO_CLI_001_CP013_REVIEW_BATCH_V6 }, null, 2));
console.log(JSON.stringify(audit));
