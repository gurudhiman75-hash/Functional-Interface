import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  GEO_RIV_001_CP002_REVIEW_BATCH_V1,
  auditGeoRiv001Cp002ReviewBatchV1,
} from "./geo-riv-001-cp002-review-batch-v1";

const audit = auditGeoRiv001Cp002ReviewBatchV1();
if (!audit.valid) throw new Error(`GEO-RIV-001 CP002 review batch failed: ${audit.issues.join(", ")}`);

const outDir = resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP002");
const mapsDir = resolve(outDir, "maps");
mkdirSync(mapsDir, { recursive: true });

function safeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

const jsonPath = resolve(outDir, "GEO-RIV-001-CP002-REVIEW-BATCH-V1.json");
writeFileSync(jsonPath, JSON.stringify({
  chapterId: "GEO-RIV-001",
  cpId: "GEO-RIV-001-CP002",
  authority: "V1",
  status: "REVIEW_ONLY",
  learnerMapAuthority: "GEO-ATLAS-001-PENDING",
  schematicDebugAuthority: "GEO-RIV-SCHEMATIC-V1",
  audit,
  questions: GEO_RIV_001_CP002_REVIEW_BATCH_V1,
}, null, 2), "utf8");

const lines: string[] = [
  "# GEO-RIV-001-CP002 Review Batch V1",
  "",
  "**Chapter:** Indian Rivers & Drainage System",
  "**CP:** Indus River System",
  "**Status:** Review-only; not frozen or runtime registered",
  `**Questions:** ${audit.questionCount}`,
  `**Difficulty:** Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}`,
  `**Semantically unique questions:** ${audit.semanticUniqueCount}`,
  `**Learner-facing actual maps:** ${audit.mappedQuestionCount}`,
  `**Internal schematic candidates:** ${audit.internalSchematicCandidateCount}`,
  "**Map status:** Learner maps are intentionally withheld until GEO-ATLAS-001 real GIS geometry is attached and approved.",
  "",
  "---",
  "",
];

const cards: string[] = [];
for (const [index, q] of GEO_RIV_001_CP002_REVIEW_BATCH_V1.entries()) {
  const optionLines = q.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`);
  let mapRelativePath: string | undefined;
  if (q.explanationMap?.learnerMapEligible) {
    const mapName = `${String(index + 1).padStart(2, "0")}-${safeFileName(q.questionId)}.svg`;
    writeFileSync(resolve(mapsDir, mapName), q.explanationMap.svg, "utf8");
    mapRelativePath = `maps/${mapName}`;
  }

  lines.push(`## ${index + 1}. ${q.qlId} · ${q.qlName} · ${q.difficulty}`, "", q.stem, "", ...optionLines, "");
  lines.push(`**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "", `**Explanation:** ${q.explanation}`);
  if (q.explanationMap?.learnerMapEligible && mapRelativePath) {
    lines.push("", `**Actual map:** ${q.explanationMap.spec.title}`, "", `![${q.explanationMap.altText}](${mapRelativePath})`, "", `_${q.explanationMap.spec.caption}_`);
  }
  lines.push("", `**Source IDs:** ${q.sourceIds.join(", ")}`, `**Fact IDs:** ${q.sourceFactIds.join(", ")}`, `**Solver:** ${q.solverAuthority}`, "", "---", "");

  const optionHtml = q.options.map((option, optionIndex) => `<li${optionIndex === q.correctIndex ? ' class="correct"' : ""}><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option)}</li>`).join("");
  const mapHtml = q.explanationMap?.learnerMapEligible
    ? `<figure class="mini-map"><div class="map-svg">${q.explanationMap.svg}</div><figcaption>${escapeHtml(q.explanationMap.spec.caption)}</figcaption></figure>`
    : "";
  cards.push(`<article class="question-card"><div class="meta">${index + 1} · ${escapeHtml(q.qlId)} · ${escapeHtml(q.qlName)} · ${escapeHtml(q.difficulty)}</div><h2>${escapeHtml(q.stem)}</h2><ol class="options">${optionHtml}</ol><div class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + q.correctIndex)}. ${escapeHtml(q.canonicalAnswer)}</div><div class="explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>${mapHtml}<details><summary>Provenance</summary><p><strong>Source IDs:</strong> ${escapeHtml(q.sourceIds.join(", "))}</p><p><strong>Fact IDs:</strong> ${escapeHtml(q.sourceFactIds.join(", "))}</p></details></article>`);
}

const mdPath = resolve(outDir, "GEO-RIV-001-CP002-REVIEW-BATCH-V1.md");
writeFileSync(mdPath, lines.join("\n"), "utf8");

const htmlPath = resolve(outDir, "GEO-RIV-001-CP002-REVIEW-BATCH-V1.html");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>GEO-RIV-001 CP002 Review Batch V1</title><style>body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f8fafc;color:#0f172a}main{max-width:900px;margin:0 auto;padding:24px}header{margin-bottom:24px}.summary{color:#475569;line-height:1.65}.question-card{background:white;border:1px solid #dbe3ec;border-radius:14px;padding:20px;margin:0 0 18px}.meta{font-size:12px;color:#64748b;font-weight:700}.question-card h2{font-size:17px;line-height:1.5;margin:10px 0 14px}.options{padding-left:24px;line-height:1.8}.options li{padding:2px 6px}.options .correct{background:#ecfdf5;border-radius:6px}.answer{margin-top:12px;padding:10px 12px;border-radius:8px;background:#ecfdf5}.explanation{margin-top:10px;line-height:1.6}.mini-map{margin:14px 0 6px;padding:10px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;max-width:380px}.map-svg svg{width:100%;height:auto;display:block}.mini-map figcaption{font-size:11px;color:#64748b;line-height:1.45;margin-top:6px}details{margin-top:12px;font-size:12px;color:#64748b}summary{cursor:pointer;font-weight:700;color:#475569}</style></head><body><main><header><h1>GEO-RIV-001-CP002 Review Batch V1</h1><div class="summary">Indus River System · Review-only · ${audit.questionCount} questions.<br/><strong>Actual GIS maps pending GEO-ATLAS-001.</strong> Internal schematic diagrams are not emitted as learner maps.</div></header>${cards.join("\n")}</main></body></html>`;
writeFileSync(htmlPath, html, "utf8");

console.log(JSON.stringify({ jsonPath, mdPath, htmlPath, mapsDir, audit }, null, 2));