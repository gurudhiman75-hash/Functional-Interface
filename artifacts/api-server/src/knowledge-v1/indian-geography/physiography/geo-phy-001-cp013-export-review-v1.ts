import fs from "node:fs";
import path from "node:path";
import { GEO_PHY_001_CP013_REVIEW_BATCH_V1, auditGeoPhy001Cp013ReviewBatchV1 } from "./geo-phy-001-cp013-review-batch-v1";
import { GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1, auditGeoPhy001ChapterClosureV1 } from "./geo-phy-001-chapter-closure-v1";

const audit = auditGeoPhy001Cp013ReviewBatchV1();
const closure = auditGeoPhy001ChapterClosureV1();
if (!audit.valid || !closure.valid) throw new Error(`GEO-PHY-001 CP013 export blocked: ${[...audit.issues, ...closure.issues].join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-PHY-001-CP013-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-PHY-001 CP013 — Mixed Physiography Mastery — Review Batch V1",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}  `,
  `**Existing QL breadth:** ${audit.existingQlBreadth} QLs represented`,
  "",
  "---",
  "",
];

GEO_PHY_001_CP013_REVIEW_BATCH_V1.forEach((question, index) => {
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
    "",
    `**QL:** ${question.qlId} — ${question.qlName}`,
    "",
    "---",
    "",
  );
});

const closureLines = [
  "# GEO-PHY-001 — Chapter Closure Readiness V1",
  "",
  `**Permanent QLs:** ${closure.permanentQlCount} (${String(closure.firstQl).padStart(3, "0")}–${String(closure.lastQl).padStart(3, "0")})  `,
  `**Checkpoints:** ${closure.checkpointCount}  `,
  `**CP013 adds permanent QLs:** ${closure.cp013AddsPermanentQls ? "Yes" : "No"}  `,
  `**Status:** ${closure.readiness}`,
  "",
  "| Checkpoint | Permanent QL ownership |",
  "| --- | --- |",
  ...GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1.map((row) =>
    `| ${row.checkpoint} | ${row.newPermanentQls ? `QL${String(row.firstQl).padStart(3, "0")}–QL${String(row.lastQl).padStart(3, "0")}` : "No new permanent QLs"} |`
  ),
  "",
  "This is a readiness audit only. Final CP013 approval is still required before any chapter-level promotion or publication decision.",
];

const baseName = "GEO-PHY-001-CP013-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), lines.join("\n"));
fs.writeFileSync(path.join(outDir, `${baseName}.json`), JSON.stringify({ audit, questions: GEO_PHY_001_CP013_REVIEW_BATCH_V1 }, null, 2));
fs.writeFileSync(path.join(outDir, "GEO-PHY-001-CHAPTER-CLOSURE-READINESS-V1.md"), closureLines.join("\n"));
fs.writeFileSync(path.join(outDir, "GEO-PHY-001-CHAPTER-CLOSURE-READINESS-V1.json"), JSON.stringify(closure, null, 2));
console.log(JSON.stringify({ audit, closure }));
