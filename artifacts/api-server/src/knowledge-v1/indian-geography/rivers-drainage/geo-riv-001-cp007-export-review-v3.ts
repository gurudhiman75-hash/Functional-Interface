import fs from "node:fs";
import path from "node:path";
import { GEO_RIV_001_CP007_REVIEW_BATCH_V3, auditGeoRiv001Cp007ReviewBatchV3 } from "./geo-riv-001-cp007-review-batch-v3";

const outDir = path.resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP007-V3");
fs.mkdirSync(outDir, { recursive: true });
const audit = auditGeoRiv001Cp007ReviewBatchV3();
if (!audit.valid) throw new Error(audit.issues.join(", "));

const letters = ["A", "B", "C", "D"];
const lines: string[] = [
  "# GEO-RIV-001 CP007 — Tributaries & Confluences — All-Upstream Review Batch V3",
  "",
  "> **Scope note:** This batch uses qualified river relations from CP002–CP006. CP006 is now admitted after explicit human approval and merge into New-main.",
  "",
  `**Questions:** ${audit.questionCount}  `,
  `**Semantic unique:** ${audit.semanticUniqueCount}  `,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy} · Medium ${audit.difficultyCounts.Medium} · Hard ${audit.difficultyCounts.Hard}  `,
  `**Answer positions:** A ${audit.answerPositions[0]} · B ${audit.answerPositions[1]} · C ${audit.answerPositions[2]} · D ${audit.answerPositions[3]}  `,
  `**Upstream usage:** CP002 ${audit.upstreamCounts.cp002 ?? 0} · CP003 ${audit.upstreamCounts.cp003 ?? 0} · CP004 ${audit.upstreamCounts.cp004 ?? 0} · CP005 ${audit.upstreamCounts.cp005 ?? 0} · CP006 ${audit.upstreamCounts.cp006 ?? 0}`,
  "",
];

let currentQl = "";
GEO_RIV_001_CP007_REVIEW_BATCH_V3.forEach((q, index) => {
  if (q.qlId !== currentQl) { currentQl = q.qlId; lines.push(`## ${q.qlId} — ${q.qlName}`, ""); }
  lines.push(`### ${index + 1}. ${q.stem}`, "");
  q.options.forEach((option, i) => lines.push(`${letters[i]}. ${option}`));
  lines.push("", `**Answer:** ${letters[q.correctIndex]}. ${q.canonicalAnswer}`, "", `**Explanation:** ${q.explanation}`, "", `**Difficulty:** ${q.difficulty}`, "", `**Upstream facts:** ${q.upstreamFactIds.join(", ")}`, "", `**Sources:** ${q.sourceIds.join(", ")}`, "", "---", "");
});

const markdown = lines.join("\n");
const baseName = "GEO-RIV-001-CP007-REVIEW-BATCH-V3";
fs.writeFileSync(path.join(outDir, `${baseName}.md`), markdown);
fs.writeFileSync(path.join(outDir, `${baseName}.json`), JSON.stringify({ audit, questions: GEO_RIV_001_CP007_REVIEW_BATCH_V3 }, null, 2));
const escaped = markdown.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
fs.writeFileSync(path.join(outDir, `${baseName}.html`), `<!doctype html><html><head><meta charset="utf-8"><title>CP007 V3 Review</title><style>body{font-family:Arial,sans-serif;max-width:980px;margin:40px auto;line-height:1.5;padding:0 20px}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><pre>${escaped}</pre></body></html>`);
console.log(JSON.stringify(audit));
