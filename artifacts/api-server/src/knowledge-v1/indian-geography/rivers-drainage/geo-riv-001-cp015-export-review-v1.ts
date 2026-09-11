import fs from "node:fs";
import path from "node:path";
import { auditGeoRiv001Cp015ReviewBatchV1, GEO_RIV_001_CP015_REVIEW_BATCH_V1 } from "./geo-riv-001-cp015-review-batch-v1";

const audit = auditGeoRiv001Cp015ReviewBatchV1();
if (!audit.valid) throw new Error(`CP015 review export blocked: ${audit.issues.join(" | ")}`);

const outDir = path.resolve("artifacts/api-server/dist/geography/GEO-RIV-001-CP015-REVIEW-BATCH-V1");
fs.mkdirSync(outDir, { recursive: true });
const lines: string[] = [
  "# GEO-RIV-001 CP015 — Mixed Rivers Mastery — Review Batch V1",
  "",
  `Questions: ${audit.total}`,
  `Difficulty: Easy ${audit.difficulty.Easy} / Medium ${audit.difficulty.Medium} / Hard ${audit.difficulty.Hard}`,
  `Answer positions: A ${audit.positions[0]} / B ${audit.positions[1]} / C ${audit.positions[2]} / D ${audit.positions[3]}`,
  `Upstream QL coverage: ${audit.sourceQlCoverage}`,
  "",
];
let currentQl = "";
GEO_RIV_001_CP015_REVIEW_BATCH_V1.forEach((q, index) => {
  if (q.qlId !== currentQl) {
    currentQl = q.qlId;
    lines.push(`## ${q.qlId} — ${q.qlName}`, "");
  }
  lines.push(`### ${index + 1}. ${q.stem}`, "");
  q.options.forEach((option, optionIndex) => lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`));
  lines.push("", `**Answer:** ${String.fromCharCode(65 + q.correctIndex)} — ${q.canonicalAnswer}`, "", `**Explanation:** ${q.explanation}`, "", `*Lineage:* ${q.sourceCpId} / ${q.sourceQlId} / ${q.sourceQuestionId}`, "");
});
const markdown = lines.join("\n");
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP015-REVIEW-BATCH-V1.md"), markdown);
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP015-REVIEW-BATCH-V1.json"), JSON.stringify({ audit, questions: GEO_RIV_001_CP015_REVIEW_BATCH_V1 }, null, 2));
const escaped = markdown.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
fs.writeFileSync(path.join(outDir, "GEO-RIV-001-CP015-REVIEW-BATCH-V1.html"), `<!doctype html><meta charset="utf-8"><title>GEO-RIV-001 CP015 Review</title><pre>${escaped}</pre>`);
console.log(outDir);
