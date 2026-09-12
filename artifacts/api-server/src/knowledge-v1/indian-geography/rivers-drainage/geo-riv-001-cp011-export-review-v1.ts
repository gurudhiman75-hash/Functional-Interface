import fs from "node:fs";
import path from "node:path";
import { GEO_RIV_001_CP011_AUTHORITY_V1 } from "./geo-riv-001-cp011-facts";
import { GEO_RIV_001_CP011_REVIEW_BATCH_V1, auditGeoRiv001Cp011ReviewBatchV1 } from "./geo-riv-001-cp011-review-batch-v1";

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP011-V1");
fs.mkdirSync(outDir, { recursive: true });
const audit = auditGeoRiv001Cp011ReviewBatchV1();
if (!audit.valid) throw new Error(audit.issues.join(", "));

const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-RIV-001 CP011 — River Basins & Drainage Patterns — Review Batch V1",
  "",
  "**Lifecycle:** Review-only. No freeze or Question Studio registration until explicit human approval.  ",
  "**Semantic boundary:** Basin membership, state drainage/traversal, pattern recognition and physiographic controls are distinct relations.  ",
  "**Learner-facing river naming:** Proper river names use the `River + name` form; basin names retain their standard form (for example, Ganga Basin).  ",
  `**Basin memberships:** ${GEO_RIV_001_CP011_AUTHORITY_V1.basinMembershipCount} across ${GEO_RIV_001_CP011_AUTHORITY_V1.basinCount} basin systems.  `,
  `**Drainage patterns:** ${GEO_RIV_001_CP011_AUTHORITY_V1.patternCount}.  `,
  `**Questions:** ${audit.questionCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}  `,
  "",
];

let currentQl = "";
GEO_RIV_001_CP011_REVIEW_BATCH_V1.forEach((question, index) => {
  if (question.qlId !== currentQl) {
    currentQl = question.qlId;
    lines.push(`## ${question.qlId} — ${question.qlName}`, "");
  }
  lines.push(`### ${index + 1}. ${question.stem}`, "");
  question.options.forEach((option, optionIndex) => lines.push(`${letters[optionIndex]}. ${option}`));
  lines.push(
    "",
    `**Answer:** ${letters[question.correctIndex]}. ${question.canonicalAnswer}`,
    "",
    `**Explanation:** ${question.explanation}`,
    "",
    `**Difficulty:** ${question.difficulty}`,
    "",
    `**Source facts:** ${question.sourceFactIds.join(", ")}`,
    "",
    "---",
    "",
  );
});

const markdown = lines.join("\n");
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP011-REVIEW-BATCH-V1.md"), markdown);
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP011-REVIEW-BATCH-V1.json"), JSON.stringify({ authority: GEO_RIV_001_CP011_AUTHORITY_V1, audit, questions: GEO_RIV_001_CP011_REVIEW_BATCH_V1 }, null, 2));
const escaped = markdown.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP011-REVIEW-BATCH-V1.html"), `<!doctype html><html><head><meta charset="utf-8"><title>CP011 Review V1</title><style>body{font-family:Arial,sans-serif;max-width:980px;margin:40px auto;line-height:1.5;padding:0 20px}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${escaped}</pre></body></html>`);
console.log(JSON.stringify(audit));