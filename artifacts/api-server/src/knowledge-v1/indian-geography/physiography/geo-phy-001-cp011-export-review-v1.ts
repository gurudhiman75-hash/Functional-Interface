import fs from "node:fs";
import path from "node:path";
import {
  GEO_PHY_001_CP011_REVIEW_BATCH_V2,
  auditGeoPhy001Cp011ReviewBatchV2,
} from "./geo-phy-001-cp011-review-batch-v2";

const audit = auditGeoPhy001Cp011ReviewBatchV2();
if (!audit.valid) throw new Error(`GEO-PHY-001 CP011 export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-PHY-001-CP011-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-PHY-001 CP011 — Comparative Physiography & Classification — Review Batch V1",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Semantic unique:** ${audit.semanticCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}  `,
  `**Hard answer variety:** ${audit.hardAnswerVariety}  `,
  `**Used source facts:** ${audit.usedSourceFactCount}`,
  "",
  "---",
  "",
];

GEO_PHY_001_CP011_REVIEW_BATCH_V2.forEach((question, index) => {
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
    `**Source facts:** ${question.sourceFactIds.join(", ")}`,
    "",
    `**Sources:** ${question.sourceIds.join(", ")}`,
    "",
    "---",
    "",
  );
});

const baseName = "GEO-PHY-001-CP011-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), lines.join("\n"));
fs.writeFileSync(
  path.join(outDir, `${baseName}.json`),
  JSON.stringify({ audit, questions: GEO_PHY_001_CP011_REVIEW_BATCH_V2 }, null, 2),
);
console.log(JSON.stringify(audit));
