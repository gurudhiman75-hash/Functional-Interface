import { writeFileSync } from "node:fs";
import { renderDiGroupedBarSvg } from "../visuals/grouped-bar-svg";
import { DI003_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi003LocalizedReviewQuestion, type Di003LocalizationLocale } from "./localization-review-v1";

function esc(value: string) { return value.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }
function renderTable(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `<table><thead><tr>${headers.map((h)=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row)=>`<tr>${row.map((v)=>`<td>${esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const outputPath = process.argv[2] || "/tmp/DI-003-LOCALIZATION-REVIEW-V1.html";
const locales: readonly Di003LocalizationLocale[] = ["hi-IN", "pa-IN"];

const sections = locales.map((locale) => {
  const heading = locale === "hi-IN" ? "Hindi Review (hi-IN)" : "Punjabi Review (pa-IN)";
  const cards = DI003_PERMANENT_QLS.map((descriptor,index) => {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const seed = `DI003-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi003LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
    const q = pkg.question, s = pkg.stimulus;
    const svg = renderDiGroupedBarSvg({
      title: s.title,
      yAxisLabel: s.yAxisLabel,
      seriesALabel: s.series[0].label,
      seriesBLabel: s.series[1].label,
      points: s.points,
      description: s.description,
    });
    const options = q.options.map((o,i)=>`<li><b>${String.fromCharCode(65+i)}.</b> ${esc(o)}</li>`).join("");
    const steps = q.explanation.steps.map((step)=>`<li>${esc(step)}</li>`).join("");
    const working = q.explanation.workingTable ? renderTable(q.explanation.workingTable.headers,q.explanation.workingTable.rows) : "";
    return `<article class="card"><div class="meta">${esc(descriptor.qlId)} · ${esc(descriptor.taskKind)} · ${esc(q.difficulty)} · ${esc(examProfile)}</div><div class="chart">${svg}</div><h3>${esc(q.stem)}</h3><ol class="options">${options}</ol><div class="answer"><strong>Answer:</strong> ${esc(q.answer)}</div><div class="exp"><strong>Explanation:</strong> ${esc(q.explanation.keyIdea)}<ol>${steps}</ol>${working}</div></article>`;
  }).join("");
  return `<section><h2>${heading}</h2>${cards}</section>`;
}).join("");

const html = `<!doctype html><html lang="und"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DI-003 Localization Review V1</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#172033;font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;line-height:1.5}main{width:min(1160px,calc(100% - 24px));margin:24px auto 60px}.hero,.card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px;margin-bottom:22px;box-shadow:0 8px 24px rgba(16,24,40,.05)}h1{margin:0 0 8px}h2{margin:36px 0 16px}.meta{color:#667085;font-size:.86rem;margin-bottom:14px}.chart{overflow-x:auto;border:1px solid #edf0f4;border-radius:12px;padding:10px;background:#fff}.chart svg{display:block;width:100%;min-width:720px;max-width:940px;height:auto;margin:auto}.options{list-style:none;padding:0}.options li{background:#fafbfc;border:1px solid #eef1f5;border-radius:8px;padding:8px 10px;margin:6px 0}.answer{background:#eef8f1;border-radius:8px;padding:10px 12px;margin:12px 0}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #e5e7eb;padding:7px 9px;text-align:left}th{background:#f7f8fa}@media(max-width:700px){main{width:calc(100% - 10px)}.hero,.card{padding:14px}.chart svg{min-width:700px}}</style></head><body><main><section class="hero"><h1>DI-003 Grouped Bar Interpretation — Hindi/Punjabi Localization Review V1</h1><p>Frozen multilingual controlled-review authority. Learner-facing values contain no decimals. Hindi/Punjabi are active only in controlled Question Studio review.</p><p><strong>12 QLs × 2 locales = 24 review questions.</strong></p></section>${sections}</main></body></html>`;
writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({ status: "WROTE_DI_003_LOCALIZATION_VISUAL_REVIEW_V1", outputPath, questions: DI003_PERMANENT_QLS.length * locales.length }));
