import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { GEO_RIV_001_CP005_REVIEW_BATCH_V2, auditGeoRiv001Cp005ReviewBatchV2 } from "./geo-riv-001-cp005-review-batch-v2";

const audit = auditGeoRiv001Cp005ReviewBatchV2();
if (!audit.valid) throw new Error(`GEO-RIV-001 CP005 V2 review batch failed: ${audit.issues.join(", ")}`);
const outDir = resolve(process.cwd(), "dist/geography-review/GEO-RIV-001-CP005-V2");
mkdirSync(outDir, { recursive: true });
const esc = (v: string) => v.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");

writeFileSync(resolve(outDir, "GEO-RIV-001-CP005-REVIEW-BATCH-V2.json"), JSON.stringify({ chapterId: "GEO-RIV-001", cpId: "GEO-RIV-001-CP005", authority: "V2", status: "REVIEW_ONLY", visualPolicy: "OPTIONAL_MANUAL_EDITORIAL_ATTACHMENT", audit, questions: GEO_RIV_001_CP005_REVIEW_BATCH_V2 }, null, 2), "utf8");

const md = ["# GEO-RIV-001-CP005 Review Batch V2", "", "**CP:** East-flowing Peninsular Rivers", "**Status:** Review-only; not frozen or runtime registered", `**Questions:** ${audit.questionCount}`, `**Difficulty:** Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}`, `**Semantically unique questions:** ${audit.semanticUniqueCount}`, "**Visual policy:** Maps/photos/diagrams are optional manual editorial attachments.", "", "---", ""];
const cards: string[] = [];
for (const [i, q] of GEO_RIV_001_CP005_REVIEW_BATCH_V2.entries()) {
  md.push(`## ${i + 1}. ${q.qlId} · ${q.qlName} · ${q.difficulty}`, "", q.stem, "", ...q.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`), "", `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`, "", `**Explanation:** ${q.explanation}`, "", `**Source IDs:** ${q.sourceIds.join(", ")}`, `**Fact IDs:** ${q.sourceFactIds.join(", ")}`, "", "---", "");
  cards.push(`<article><div class="meta">${i + 1} · ${esc(q.qlId)} · ${esc(q.qlName)} · ${esc(q.difficulty)}</div><h2>${esc(q.stem).replaceAll("\n", "<br/>")}</h2><ol>${q.options.map((o,j)=>`<li${j===q.correctIndex?' class="correct"':''}><b>${String.fromCharCode(65+j)}.</b> ${esc(o)}</li>`).join("")}</ol><p class="answer"><b>Answer:</b> ${String.fromCharCode(65+q.correctIndex)}. ${esc(q.canonicalAnswer)}</p><p><b>Explanation:</b> ${esc(q.explanation)}</p><details><summary>Provenance</summary><p>${esc(q.sourceIds.join(", "))}</p><p>${esc(q.sourceFactIds.join(", "))}</p></details></article>`);
}
writeFileSync(resolve(outDir, "GEO-RIV-001-CP005-REVIEW-BATCH-V2.md"), md.join("\n"), "utf8");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CP005 Review</title><style>body{font-family:system-ui;margin:0;background:#f8fafc;color:#0f172a}main{max-width:900px;margin:auto;padding:24px}article{background:#fff;border:1px solid #dbe3ec;border-radius:14px;padding:20px;margin-bottom:18px}.meta,details{color:#64748b;font-size:12px}h2{font-size:17px;line-height:1.5}li{line-height:1.8;padding:2px 6px}.correct,.answer{background:#ecfdf5;border-radius:7px}.answer{padding:10px}</style></head><body><main><h1>GEO-RIV-001-CP005 Review Batch V2</h1><p>East-flowing Peninsular Rivers · Review-only · ${audit.questionCount} questions · Easy ${audit.difficultyCounts.Easy ?? 0} · Medium ${audit.difficultyCounts.Medium ?? 0} · Hard ${audit.difficultyCounts.Hard ?? 0}</p>${cards.join("\n")}</main></body></html>`;
writeFileSync(resolve(outDir, "GEO-RIV-001-CP005-REVIEW-BATCH-V2.html"), html, "utf8");
console.log(JSON.stringify({ outDir, audit }, null, 2));
