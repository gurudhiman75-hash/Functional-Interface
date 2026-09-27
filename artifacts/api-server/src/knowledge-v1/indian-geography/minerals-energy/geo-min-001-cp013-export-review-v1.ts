import fs from "node:fs";
import path from "node:path";
import {
  GEO_MIN_001_CP013_MASTERY_V1,
  auditGeoMin001Cp013MasteryV1,
  auditGeoMin001ChapterClosureV1,
} from "./geo-min-001-cp013-mastery-v1";

const mastery = auditGeoMin001Cp013MasteryV1();
const closure = auditGeoMin001ChapterClosureV1();
if (!mastery.valid) throw new Error(mastery.issues.join(" | "));
if (!closure.valid) throw new Error(closure.issues.join(" | "));

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-MIN-001-CLOSURE-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines = [
  "# GEO-MIN-001 CP013 — Exhaustive Mastery / Closure — Review Batch V1",
  "",
  "Questions: " + mastery.questionCount,
  "Permanent semantic QLs represented: " + mastery.permanentQlCount,
  "Owning questions audited: " + closure.owningQuestionCount,
  "Lifecycle: Review only; no public/test-bank release.",
  "",
];

GEO_MIN_001_CP013_MASTERY_V1.forEach((q, i) => {
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

fs.writeFileSync(path.join(outDir, "GEO-MIN-001-CP013-REVIEW-BATCH-V1.md"), lines.join("\n"));
fs.writeFileSync(
  path.join(outDir, "GEO-MIN-001-CHAPTER-CLOSURE-AUDIT-V1.json"),
  JSON.stringify({ mastery, closure }, null, 2),
);
