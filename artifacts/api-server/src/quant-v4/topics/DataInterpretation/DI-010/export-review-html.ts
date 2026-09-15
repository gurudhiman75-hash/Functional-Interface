import { writeFileSync } from "node:fs";
import { renderDiFrequencyPolygonSvg } from "../visuals/frequency-polygon-svg";
import { DI010_TASK_KINDS } from "./frequency-polygon-set";
import { buildDi010ReviewSets } from "./review-utils";

function escapeHtml(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }

function renderTable(table: { headers: readonly string[]; rows: readonly (readonly string[])[] } | undefined) {
  if (!table) return "";
  const head = table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const body = table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

const outputPath = process.argv[2] ?? "DI-010-REVIEW-P2.html";
const sets = buildDi010ReviewSets();
const sections = sets.map((set, setIndex) => {
  const svg = renderDiFrequencyPolygonSvg(set.stimulus);
  const questions = set.questions.map((question, questionIndex) => {
    const options = question.options.map((option, optionIndex) => `<li><span class="letter">${String.fromCharCode(65 + optionIndex)}.</span> ${escapeHtml(option)}</li>`).join("");
    const steps = question.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
    const table = renderTable(question.explanation.workingTable);
    return `<article class="question"><div class="qhead"><strong>Q${questionIndex + 1}</strong><span>${escapeHtml(question.difficulty)}</span><code>${escapeHtml(question.kind)}</code></div><p class="stem">${escapeHtml(question.stem)}</p><ol class="options">${options}</ol><details open><summary>Answer & explanation</summary><p><strong>Answer:</strong> ${String.fromCharCode(65 + question.correctIndex)}. ${escapeHtml(question.answer)}</p><p>${escapeHtml(question.explanation.keyIdea)}</p><ul>${steps}</ul>${table}</details></article>`;
  }).join("");
  return `<section class="set"><header><div><h2>Set ${setIndex + 1}</h2><p>${escapeHtml(set.examProfile)} · ${escapeHtml(set.stimulus.shape)} · ${set.stimulus.classes.length} classes · width ${set.stimulus.classWidth}</p></div><code>${escapeHtml(set.seed)}</code></header><p class="instruction">${escapeHtml(set.stimulus.instruction)}</p><figure>${svg}</figure>${questions}</section>`;
}).join("");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DI-010 Frequency Polygon P2 Review</title><style>body{margin:0;background:#f6f7f9;color:#182230;font-family:Inter,Arial,sans-serif;line-height:1.5}.page{max-width:1050px;margin:auto;padding:28px 16px 60px}.hero,.set,.question{background:#fff;border:1px solid #e4e7ec;border-radius:16px}.hero{padding:22px 24px;margin-bottom:22px}.hero h1{margin:0 0 8px;font-size:28px}.hero p{margin:5px 0;color:#475467}.lock{display:inline-block;margin-top:8px;padding:5px 10px;border-radius:999px;background:#f2f4f7;font-size:12px;font-weight:700}.set{padding:22px;margin:22px 0}.set>header{display:flex;gap:16px;justify-content:space-between;align-items:flex-start}.set h2{margin:0;font-size:22px}.set header p{margin:4px 0;color:#667085}.instruction{font-weight:600;margin:18px 0 6px}figure{margin:8px 0 24px;border:1px solid #eaecf0;border-radius:14px;padding:10px;overflow:hidden}figure svg{display:block;width:100%;height:auto}.question{padding:18px 20px;margin:14px 0;background:#fcfcfd}.qhead{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.qhead span{font-size:12px;padding:3px 8px;border-radius:999px;background:#eef2ff}.qhead code,.set header code{font-size:11px;color:#475467}.stem{font-size:16px;font-weight:600}.options{list-style:none;padding:0;margin:10px 0}.options li{padding:6px 0}.letter{display:inline-block;width:24px;font-weight:700}details{margin-top:12px;border-top:1px solid #eaecf0;padding-top:10px}summary{cursor:pointer;font-weight:700}details p,details ul{margin:8px 0}.table-wrap{overflow:auto;margin-top:12px}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #d0d5dd;padding:7px 9px;text-align:center}th{background:#f2f4f7;font-weight:700}@media(max-width:650px){.page{padding:16px 10px 40px}.set{padding:14px}.question{padding:14px}.set>header{display:block}.hero h1{font-size:23px}}</style></head><body><main class="page"><section class="hero"><h1>DI-010 Frequency Polygon — P2 Question Review</h1><p>The accepted diagram system is unchanged. P2 rewrites the questions to use natural context, real DI operations and genuine grouped-data reasoning.</p><p>${sets.length} deterministic review sets · all ${DI010_TASK_KINDS.length} task families · Tier-I and Tier-II coverage.</p><span class="lock">REVIEW ONLY — publication locked</span></section>${sections}</main></body></html>`;
writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_DI_010_REVIEW_P2_HTML", outputPath, sets: sets.length, questions: sets.reduce((sum, set) => sum + set.questions.length, 0), taskFamilies: DI010_TASK_KINDS.length }));
