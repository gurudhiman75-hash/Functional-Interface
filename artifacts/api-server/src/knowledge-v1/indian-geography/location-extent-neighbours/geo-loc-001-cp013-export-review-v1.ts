import fs from "node:fs";
import path from "node:path";
import {
  GEO_LOC_001_CP013_REVIEW_BATCH_V1,
  auditGeoLoc001Cp013ReviewBatchV1,
} from "./geo-loc-001-cp013-review-batch-v1";

const audit = auditGeoLoc001Cp013ReviewBatchV1();
if (!audit.valid) throw new Error(audit.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-LOC-001-CP013-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines = [
  "# GEO-LOC-001 CP013 — Exhaustive Location & Map Mastery — Review Batch V1",
  "",
  "Questions: " + audit.questionCount,
  "Difficulty: Easy " + audit.difficultyCounts.Easy + " / Medium " + audit.difficultyCounts.Medium + " / Hard " + audit.difficultyCounts.Hard,
  "Answer positions: A " + audit.answerPositions[0] + " / B " + audit.answerPositions[1] + " / C " + audit.answerPositions[2] + " / D " + audit.answerPositions[3],
  "",
];
GEO_LOC_001_CP013_REVIEW_BATCH_V1.forEach((q, i) => {
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
const name = "GEO-LOC-001-CP013-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, name + ".md"), lines.join("\n"));
fs.writeFileSync(path.join(outDir, name + ".json"), JSON.stringify({ audit, questions: GEO_LOC_001_CP013_REVIEW_BATCH_V1 }, null, 2));
