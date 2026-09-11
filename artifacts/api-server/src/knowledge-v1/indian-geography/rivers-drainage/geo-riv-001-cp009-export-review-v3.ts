import fs from "node:fs";
import path from "node:path";
import { GEO_RIV_001_CP009_REVIEW_BATCH_V3, auditGeoRiv001Cp009ReviewBatchV3 } from "./geo-riv-001-cp009-review-batch-v3";
import { GEO_RIV_001_CP009_REVIEW_SCOPE_V1 } from "./geo-riv-001-cp009-scope";

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP009-V3");
fs.mkdirSync(outDir, { recursive: true });
const audit = auditGeoRiv001Cp009ReviewBatchV3();
if (!audit.valid) throw new Error(audit.issues.join(", "));

const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-RIV-001 CP009 — Rivers and States — Review Batch V3",
  "",
  "**Lifecycle:** Review-only. No freeze or Question Studio registration until explicit human approval.  ",
  "**Semantic rule:** FLOWS_THROUGH means the river's main course/main stem crosses the state. Basin/catchment drainage is a separate relation.  ",
  "**Negative-answer scope:** Absence may reject a main-course claim only for the rivers covered by this checkpoint; it is not evidence that the state lies outside the river basin.  ",
  `**Course-state facts:** ${audit.scopeAudit.courseFactCount} across ${audit.scopeAudit.riverCount} rivers and ${audit.scopeAudit.stateCount} states  `,
  `**Questions:** ${audit.questionCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}  `,
  `**V2 answer matrix preserved:** ${audit.answerMatrixPreserved ? "Yes" : "No"}  `,
  `**Universal geography completeness claimed:** ${GEO_RIV_001_CP009_REVIEW_SCOPE_V1.universalGeographyCompletenessClaim ? "Yes" : "No"}`,
  "",
];

let currentQl = "";
GEO_RIV_001_CP009_REVIEW_BATCH_V3.forEach((question, index) => {
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
    ...(question.upstreamFactIds.length ? [`**Upstream facts:** ${question.upstreamFactIds.join(", ")}`, ""] : []),
    "---",
    "",
  );
});

const markdown = lines.join("\n");
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP009-REVIEW-BATCH-V3.md"), markdown);
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP009-REVIEW-BATCH-V3.json"), JSON.stringify({ scope: GEO_RIV_001_CP009_REVIEW_SCOPE_V1, audit, questions: GEO_RIV_001_CP009_REVIEW_BATCH_V3 }, null, 2));
const escaped = markdown.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP009-REVIEW-BATCH-V3.html"), `<!doctype html><html><head><meta charset="utf-8"><title>CP009 Review V3</title><style>body{font-family:Arial,sans-serif;max-width:980px;margin:40px auto;line-height:1.5;padding:0 20px}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${escaped}</pre></body></html>`);
console.log(JSON.stringify(audit));
