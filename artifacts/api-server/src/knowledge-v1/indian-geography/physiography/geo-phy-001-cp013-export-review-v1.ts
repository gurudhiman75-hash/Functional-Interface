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
  "# GEO-PHY-001 CP013 — Exhaustive Physiography Master Review V1",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Permanent QLs covered:** ${audit.permanentQlBreadth} / 108  `,
  `**Owning checkpoints represented:** ${audit.sourceCheckpointBreadth} / 12  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}`,
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
    `**QL:** ${question.qlId}`,
    "",
    "---",
    "",
  );
});

const closureLines = [
  "# GEO-PHY-001 — Exhaustive Chapter Closure Report V1",
  "",
  `**Permanent QLs:** ${closure.permanentQlCount} (QL001–QL108)  `,
  `**Owning checkpoints:** ${closure.owningCheckpointCount}  `,
  `**Qualified owning questions:** ${closure.owningQuestionCount}  `,
  `**Payloads per permanent QL:** ${closure.payloadsPerPermanentQl}  `,
  `**Exhaustive master questions:** ${closure.exhaustiveMasterQuestionCount}  `,
  `**Master QLs covered:** ${closure.exhaustiveMasterQlBreadth} / 108  `,
  `**CP013 adds permanent QLs:** ${closure.cp013AddsPermanentQls ? "Yes" : "No"}  `,
  `**Status:** ${closure.readiness}`,
  "",
  "| Checkpoint | Permanent QL ownership |",
  "| --- | --- |",
  ...GEO_PHY_001_CHECKPOINT_OWNERSHIP_V1.map((row) =>
    `| ${row.checkpoint} | ${row.newPermanentQls ? `QL${String(row.firstQl).padStart(3, "0")}–QL${String(row.lastQl).padStart(3, "0")}` : "No new permanent QLs"} |`
  ),
  "",
  "All QL001–QL108 retain six unique owning payloads. CP013 covers every permanent QL once in the final master review. No QL109+ is created.",
  "",
  "Content closure does not by itself publish questions to public tests or production runtime; publication remains separately governed.",
];

const baseName = "GEO-PHY-001-CP013-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), lines.join("\n"));
fs.writeFileSync(path.join(outDir, `${baseName}.json`), JSON.stringify({ audit, questions: GEO_PHY_001_CP013_REVIEW_BATCH_V1 }, null, 2));
fs.writeFileSync(path.join(outDir, "GEO-PHY-001-CHAPTER-CLOSURE-READINESS-V1.md"), closureLines.join("\n"));
fs.writeFileSync(path.join(outDir, "GEO-PHY-001-CHAPTER-CLOSURE-READINESS-V1.json"), JSON.stringify(closure, null, 2));
console.log(JSON.stringify({ audit, closure }));
