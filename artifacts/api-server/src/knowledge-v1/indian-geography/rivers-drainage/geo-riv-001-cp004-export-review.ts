import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  GEO_RIV_001_CP004_REVIEW_BATCH_V1,
  auditGeoRiv001Cp004ReviewBatchV1,
} from "./geo-riv-001-cp004-review-batch-v1";

const audit = auditGeoRiv001Cp004ReviewBatchV1();
if (!audit.valid) throw new Error(`GEO-RIV-001 CP004 review batch failed: ${audit.issues.join(", ")}`);

const outDir = resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP004");
mkdirSync(outDir, { recursive: true });

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

writeFileSync(resolve(outDir, "GEO-RIV-001-CP004-REVIEW-BATCH-V1.json"), JSON.stringify({
  chapterId: "GEO-RIV-001",
  cpId: "GEO-RIV-001-CP004",
  authority: "V1",
  status: "REVIEW_ONLY",
  visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT",
  audit,
  questions: GEO_RIV_001_CP004_REVIEW_BATCH_V1,
}, null, 2), "utf8");

const lines: string[] = [
  "# GEO-RIV-001-CP004 Review Batch V1",
  "",
  "**Chapter:** Indian Rivers & Drainage System",
  "**CP:** Brahmaputra River System",
  "**Status:** Review-only; not frozen or runtime registered",
  `**Questions:** ${audit.questionCount}`,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}`,
  `**Semantically unique questions:** ${audit.semanticUniqueCount}`,
  "**Visual policy:** Maps/photos/diagrams may be attached manually during editorial review when useful; visuals are not required for validity.",
  "",
  "---",
  "",
];

const cards: string[] = [];
for (const [index, q] of GEO_RIV_001_CP004_REVIEW_BATCH_V1.entries()) {
  const optionLines = q.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`);
  lines.push(`## ${index + 1}. ${q.qlId} · ${q.qlName} · ${q.difficulty}`, "", q.stem, "", ...optionLines, "");
  lines.push(`**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "", `**Explanation:** ${q.explanation}`, "", `**Source IDs:** ${q.sourceIds.join(", ")}`, `**Fact IDs:** ${q.sourceFactIds.join(", ")}`, `**Solver:** ${q.solverAuthority}`, "", "---", "");

  const optionHtml = q.options.map((option, optionIndex) => `<li${optionIndex === q.correctIndex ? ' class="correct"' : ""}><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option)}</li>`).join("");
  cards.push(`<article class="question-card"><div class="meta">${index + 1} · ${escapeHtml(q.qlId)} · ${escapeHtml(q.qlName)} · ${escapeHtml(q.difficulty)}</div><h2>${escapeHtml(q.stem).replaceAll("\n", "<br/>")}</h2><ol class="options">${optionHtml}</ol><div class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + q.correctIndex)}. ${escapeHtml(q.canonicalAnswer)}</div><div class="explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div><details><summary>Provenance</summary><p><strong>Source IDs:</strong> ${escapeHtml(q.sourceIds.join(", "))}</p><p><strong>Fact IDs:</strong> ${escapeHtml(q.sourceFactIds.join(", "))}</p></details></article>`);
}

writeFileSync(resolve(outDir, "GEO-RIV-001-CP004-REVIEW-BATCH-V1.md"), lines.join("\n"), "utf8");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>GEO-RIV-001 CP004 Review Batch V1</title><style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f8fafc;color:#0f172a}main{max-width:900px;margin:0 auto;padding:24px}header{margin-bottom:24px}.summary{color:#475569;line-height:1.65}.question-card{background:white;border:1px solid #dbe3ec;border-radius:14px;padding:20px;margin:0 0 18px}.meta{font-size:12px;color:#64748b;font-weight:700}.question-card h2{font-size:17px;line-height:1.5;margin:10px 0 14px}.options{padding-left:24px;line-height:1.8}.options li{padding:2px 6px}.options .correct{background:#ecfdf5;border-radius:6px}.answer{margin-top:12px;padding:10px 12px;border-radius:8px;background:#ecfdf5}.explanation{margin-top:10px;line-height:1.6}details{margin-top:12px;font-size:12px;color:#64748b}summary{cursor:pointer;font-weight:700;color:#475569}</style></head><body><main><header><h1>GEO-RIV-001-CP004 Review Batch V1</h1><div class="summary">Brahmaputra River System · Review-only · ${audit.questionCount} questions.<br/>Maps/photos/diagrams are optional manual editorial attachments.</div></header>${cards.join("\n")}</main></body></html>`;
writeFileSync(resolve(outDir, "GEO-RIV-001-CP004-REVIEW-BATCH-V1.html"), html, "utf8");

console.log(JSON.stringify({ outDir, audit }, null, 2));
