import fs from "node:fs";
import path from "node:path";
import { GEO_PHY_001_CP003_REVIEW_BATCH_V1, auditGeoPhy001Cp003ReviewBatchV1 } from "./geo-phy-001-cp003-review-batch-v1";

const audit = auditGeoPhy001Cp003ReviewBatchV1();
if (!audit.valid) throw new Error(`GEO-PHY-001 CP003 export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-PHY-001-CP003-V1");
fs.mkdirSync(outDir, { recursive: true });
const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-PHY-001 CP003 — Northern Plains & Regional Divisions — Review Batch V1",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Semantic unique:** ${audit.semanticCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}`,
  "",
  "---",
  "",
];

GEO_PHY_001_CP003_REVIEW_BATCH_V1.forEach((q, index) => {
  lines.push(
    `## ${index + 1}. ${q.stem}`,
    "",
    ...q.options.map((option, i) => `${letters[i]}. ${option}`),
    "",
    `**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`,
    "",
    `**Explanation:** ${q.explanation}`,
    "",
    `**Difficulty:** ${q.difficulty}`,
    "",
    `**QL:** ${q.qlId} — ${q.qlName}`,
    "",
    `**Source facts:** ${q.sourceFactIds.join(", ")}`,
    "",
    `**Sources:** ${q.sourceIds.join(", ")}`,
    "",
    "---",
    "",
  );
});

const base = "GEO-PHY-001-CP003-REVIEW-BATCH-V1";
fs.writeFileSync(path.join(outDir, `${base}.md`), lines.join("\n"));
fs.writeFileSync(path.join(outDir, `${base}.json`), JSON.stringify({ audit, questions: GEO_PHY_001_CP003_REVIEW_BATCH_V1 }, null, 2));
console.log(JSON.stringify(audit));
