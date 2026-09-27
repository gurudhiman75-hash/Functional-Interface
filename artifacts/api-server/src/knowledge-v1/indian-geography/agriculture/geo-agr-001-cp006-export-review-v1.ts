import fs from "node:fs";
import path from "node:path";
import {
  GEO_AGR_001_CP006_MASTERY_V1,
  auditGeoAgr001Cp006MasteryV1,
  auditGeoAgr001ChapterClosureV1,
} from "./geo-agr-001-cp006-mastery-v1";

const mastery = auditGeoAgr001Cp006MasteryV1();
const closure = auditGeoAgr001ChapterClosureV1();
if (!mastery.valid) throw new Error(mastery.issues.join(" | "));
if (!closure.valid) throw new Error(closure.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-AGR-001-CP006-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines = [
  "# GEO-AGR-001 CP006 — Exhaustive Agriculture Mastery / Closure — Review Batch V1",
  "",
  "Questions: " + mastery.questionCount,
  "Permanent QLs represented: " + mastery.permanentQlCount,
  "Difficulty: Easy " + mastery.difficultyCounts.Easy + " / Medium " + mastery.difficultyCounts.Medium + " / Hard " + mastery.difficultyCounts.Hard,
  "Answer positions: A" + mastery.answerPositions[0] + " / B" + mastery.answerPositions[1] + " / C" + mastery.answerPositions[2] + " / D" + mastery.answerPositions[3],
  "",
];
GEO_AGR_001_CP006_MASTERY_V1.forEach((q, i) => {
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
    "**Source owning question:** " + q.sourceOwningQuestionId,
    ""
  );
});
fs.writeFileSync(path.join(outDir, "GEO-AGR-001-CP006-REVIEW-BATCH-V1.md"), lines.join("\n"));
fs.writeFileSync(
  path.join(outDir, "GEO-AGR-001-CP006-CLOSURE-AUDIT-V1.json"),
  JSON.stringify({ mastery, closure }, null, 2),
);
