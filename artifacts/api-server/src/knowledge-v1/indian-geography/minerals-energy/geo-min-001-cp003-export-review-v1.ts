import fs from "node:fs";
import path from "node:path";
import { GEO_MIN_001_CP003_REVIEW_BATCH_V1, auditGeoMin001Cp003ReviewBatchV1 } from "./geo-min-001-cp003-review-batch-v1";

const audit = auditGeoMin001Cp003ReviewBatchV1();
if (!audit.valid) throw new Error(audit.issues.join(" | "));
const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-MIN-001-CP003-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines = [
  "# GEO-MIN-001 CP003 — Review Batch V1",
  "",
  "Questions: " + audit.questionCount,
  "Permanent QLs: " + audit.permanentQlCount,
  "Difficulty: Easy " + audit.difficultyCounts.Easy + " / Medium " + audit.difficultyCounts.Medium + " / Hard " + audit.difficultyCounts.Hard,
  "Answer positions: " + audit.answerPositions.join(" / "),
  "",
];
GEO_MIN_001_CP003_REVIEW_BATCH_V1.forEach((q, i) => {
  lines.push(
    "## " + (i + 1) + ". " + q.stem,
    "",
    ...q.options.map((option, j) => letters[j] + ". " + option),
    "",
    "**Answer:** " + letters[q.correctIndex] + ". " + q.canonicalAnswer,
    "",
    "**Explanation:** " + q.explanation,
    "",
    "**Difficulty:** " + q.difficulty,
    "**QL:** " + q.qlId + " — " + q.qlName,
    ""
  );
});
const name = "GEO-MIN-001-CP003-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, name + ".md"), lines.join("\n"));
fs.writeFileSync(path.join(outDir, name + ".json"), JSON.stringify({ audit, questions: GEO_MIN_001_CP003_REVIEW_BATCH_V1 }, null, 2));
