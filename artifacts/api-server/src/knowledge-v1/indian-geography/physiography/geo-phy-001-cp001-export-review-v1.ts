import fs from "node:fs";
import path from "node:path";
import { GEO_PHY_001_CP001_REVIEW_BATCH_V1, auditGeoPhy001Cp001ReviewBatchV1 } from "./geo-phy-001-cp001-review-batch-v1";

const audit = auditGeoPhy001Cp001ReviewBatchV1();
if (!audit.valid) throw new Error(`GEO-PHY-001 CP001 export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-PHY-001-CP001-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-PHY-001 CP001 — Major Physical Regions — Review Batch V2",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Semantic unique:** ${audit.semanticCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}`,
  "",
  "---",
  "",
];

GEO_PHY_001_CP001_REVIEW_BATCH_V1.forEach((question, index) => {
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

const markdown = lines.join("\n");
const baseName = "GEO-PHY-001-CP001-REVIEW-BATCH-V2";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), markdown);
fs.writeFileSync(path.join(outDir, `${baseName}.json`), JSON.stringify({ audit, questions: GEO_PHY_001_CP001_REVIEW_BATCH_V1 }, null, 2));
console.log(JSON.stringify(audit));
