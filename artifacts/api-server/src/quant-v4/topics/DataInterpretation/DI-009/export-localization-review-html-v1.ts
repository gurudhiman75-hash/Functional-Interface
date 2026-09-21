import { writeFileSync } from "node:fs";
import { renderDiHistogramSvg } from "../visuals/histogram-svg";
import { escapeHtml } from "./review-utils";
import { DI009_PERMANENT_QLS } from "./permanent-ql-registry";
import {
  generateDi009LocalizedReviewQuestion,
  type Di009LocalizationLocale,
} from "./localization-review-v1";

const outputPath = process.argv[2] || "/tmp/DI-009-LOCALIZATION-REVIEW-V1.html";
const locales: readonly Di009LocalizationLocale[] = ["hi-IN", "pa-IN"];

function table(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const sections = locales.map((locale) => {
  const languageHeading = locale === "hi-IN" ? "Hindi Review (hi-IN)" : "Punjabi Review (pa-IN)";
  const cards = DI009_PERMANENT_QLS.map((descriptor, index) => {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "SSC_CGL_TIER_II" as const;
    const seed = `DI009-LOCALIZATION-REVIEW-${locale}-${descriptor.qlId}`;
    const pkg = generateDi009LocalizedReviewQuestion({ seed, examProfile, taskKind: descriptor.taskKind, locale });
    const q = pkg.question;
    const svg = renderDiHistogramSvg(pkg.stimulus);
    const options = q.options.map((option, optionIndex) => `<li><b>${String.fromCharCode(65 + optionIndex)}.</b> ${escapeHtml(option)}</li>`).join("");
    const steps = q.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
    const working = q.explanation.workingTable ? table(q.explanation.workingTable.headers, q.explanation.workingTable.rows) : "";
    return `<article class="card">
      <div class="meta">${escapeHtml(descriptor.qlId)} · ${escapeHtml(descriptor.taskKind)} · ${escapeHtml(q.difficulty)} · ${escapeHtml(examProfile)}</div>
      <div class="chart">${svg}</div>
      <h3>${escapeHtml(q.stem)}</h3>
      <ol class="options">${options}</ol>
      <div class="answer"><strong>Answer:</strong> ${escapeHtml(q.answer)}</div>
      <div class="explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation.keyIdea)}<ol>${steps}</ol>${working}</div>
    </article>`;
  }).join("");
  return `<section><h2>${languageHeading}</h2>${cards}</section>`;
}).join("");

const html = `<!doctype html><html lang="und"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DI-009 Hindi Punjabi Localization Review V1</title><style>
*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#172033;font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;line-height:1.5}main{width:min(1160px,calc(100% - 24px));margin:24px auto 60px}.hero,.card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:24px;margin-bottom:22px;box-shadow:0 8px 24px rgba(16,24,40,.05)}h1{margin:0 0 8px}h2{margin:36px 0 16px}.meta{color:#667085;font-size:.86rem;margin-bottom:14px}.chart{overflow-x:auto;border:1px solid #edf0f4;border-radius:12px;padding:10px;background:#fff}.chart svg{display:block;width:100%;min-width:720px;max-width:940px;height:auto;margin:auto}.options{list-style:none;padding:0}.options li{background:#fafbfc;border:1px solid #eef1f5;border-radius:8px;padding:8px 10px;margin:6px 0}.answer{background:#eef8f1;border-radius:8px;padding:10px 12px;margin:12px 0}table{width:100%;border-collapse:collapse;margin:12px 0}th,td{border:1px solid #e5e7eb;padding:7px 9px;text-align:left}th{background:#f7f8fa}@media(max-width:700px){main{width:calc(100% - 10px)}.hero,.card{padding:14px}.chart svg{min-width:700px}}</style></head><body><main>
<section class="hero"><h1>DI-009 Histogram — Hindi/Punjabi Localization Review V1</h1><p>Review candidate only. Learner-facing values contain no decimals. Percentage, grouped mean and grouped mode explicitly use nearest-whole answers. Hindi/Punjabi are not yet active in Question Studio.</p><p><strong>13 QLs × 2 locales = 26 review questions.</strong></p></section>
${sections}
</main></body></html>`;

writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({ status: "WROTE_DI_009_LOCALIZATION_VISUAL_REVIEW_V1", outputPath, questions: DI009_PERMANENT_QLS.length * locales.length }));
