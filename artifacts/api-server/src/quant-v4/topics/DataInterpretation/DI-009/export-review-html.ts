import { writeFileSync } from "node:fs";
import { escapeHtml, selectDi009V2ReviewSets } from "./review-utils";

const outputPath = process.argv[2] || "DI-009-REVIEW-V2.html";
const sets = selectDi009V2ReviewSets();

function table(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const sections = sets.map((set, setIndex) => {
  const questions = set.questions.map((question, questionIndex) => {
    const options = question.options.map((option, index) => `<li><span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${escapeHtml(option)}</li>`).join("");
    const steps = question.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
    const working = question.explanation.workingTable ? table(question.explanation.workingTable.headers, question.explanation.workingTable.rows) : "";
    return `<article class="question"><h3>Q${questionIndex + 1}. ${escapeHtml(question.stem)}</h3><ol class="options">${options}</ol><div class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + question.correctIndex)}. ${escapeHtml(question.answer)}</div><div class="explanation"><strong>Explanation:</strong> ${escapeHtml(question.explanation.keyIdea)}<ol>${steps}</ol>${working}</div><div class="meta">${escapeHtml(question.kind)} · ${escapeHtml(question.difficulty)}</div></article>`;
  }).join("");
  return `<section class="set"><h2>Set ${setIndex + 1} — ${escapeHtml(set.examProfile)}</h2><p class="set-meta"><strong>Shape:</strong> ${escapeHtml(set.stimulus.shape)} &nbsp; <strong>Classes:</strong> ${set.stimulus.bins.length} &nbsp; <strong>Context:</strong> ${escapeHtml(set.stimulus.title)}</p><div class="histogram">${set.stimulus.svg}</div>${questions}</section>`;
}).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DI-009 Histogram V2 Review</title><style>
:root{--bg:#f4f6f9;--card:#fff;--text:#172033;--muted:#667085;--line:#d8dee8;--accent:#234a91;--answer:#eef8f0}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;line-height:1.55}main{width:min(1080px,calc(100% - 24px));margin:24px auto 60px}.hero,.set{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:clamp(18px,4vw,38px);margin-bottom:24px;box-shadow:0 8px 24px rgba(16,24,40,.06)}h1{margin-top:0;font-size:clamp(28px,5vw,42px)}h2{color:var(--accent);border-bottom:1px solid var(--line);padding-bottom:12px}.set-meta,.meta{color:var(--muted)}.histogram{overflow-x:auto;margin:20px 0 30px;padding:8px;border:1px solid var(--line);border-radius:12px;background:#fff}.histogram svg{display:block;width:100%;min-width:650px;max-width:800px;height:auto;margin:auto}.question{padding:20px 0;border-top:1px solid var(--line)}.question h3{font-size:1.06rem;margin:0 0 12px}.options{list-style:none;padding:0;margin:10px 0}.options li{padding:7px 10px;margin:6px 0;background:#f8fafc;border-radius:8px}.option-letter{font-weight:700;display:inline-block;width:24px}.answer{background:var(--answer);padding:9px 12px;border-radius:8px;margin:12px 0}.explanation{padding:4px 0}.meta{font-size:.86rem;margin-top:12px}table{width:100%;border-collapse:collapse;margin:14px 0;font-size:.93rem}th,td{border:1px solid var(--line);padding:7px 9px;text-align:left}th{background:#f5f7fa}@media(max-width:700px){main{width:calc(100% - 12px)}.hero,.set{padding:15px}.histogram{overflow-x:auto}}@media print{body{background:#fff}main{width:100%;margin:0}.hero,.set{box-shadow:none;border:0;break-after:page}.histogram svg{min-width:0}.question{break-inside:avoid}}
</style></head><body><main><section class="hero"><h1>DI-009 Histogram — V2 Review Pack</h1><p>Review-only. The histogram itself is the stimulus; no fallback frequency table is shown beside the question.</p><p><strong>${sets.length} sets · ${sets.reduce((sum, set) => sum + set.questions.length, 0)} questions · 13/13 contract families represented</strong></p></section>${sections}</main></body></html>`;

writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({ outputPath, sets: sets.length, questions: sets.reduce((sum, set) => sum + set.questions.length, 0) }));
