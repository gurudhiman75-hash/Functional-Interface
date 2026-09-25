import fs from "node:fs";
import path from "node:path";
import {
  GEO_VEG_001_CP001_REVIEW_BATCH_V1,
  auditGeoVeg001Cp001ReviewBatchV1,
} from "./geo-veg-001-cp001-review-batch-v1";

const audit = auditGeoVeg001Cp001ReviewBatchV1();
if (!audit.valid) throw new Error(audit.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-VEG-001-CP001-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines = [
  "# GEO-VEG-001 CP001 — Vegetation Basics & Controlling Factors — Review Batch V1",
  "",
  "Questions: " + audit.questionCount,
  "Difficulty: Easy " + audit.difficultyCounts.Easy + " / Medium " + audit.difficultyCounts.Medium + " / Hard " + audit.difficultyCounts.Hard,
  "",
];

GEO_VEG_001_CP001_REVIEW_BATCH_V1.forEach((q, i) => {
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

const name = "GEO-VEG-001-CP001-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, name + ".md"), lines.join("\n"));
fs.writeFileSync(path.join(outDir, name + ".json"), JSON.stringify({ audit, questions: GEO_VEG_001_CP001_REVIEW_BATCH_V1 }, null, 2));
