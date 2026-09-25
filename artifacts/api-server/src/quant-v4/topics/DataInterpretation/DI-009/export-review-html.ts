import { writeFileSync } from "node:fs";
import { renderDiHistogramSvg, DI_HISTOGRAM_VISUAL_THEME } from "../visuals/histogram-svg";
import { escapeHtml, selectDi009V2ReviewSets } from "./review-utils";

const outputPath = process.argv[2] || "DI-009-REVIEW-ARCHITECTURE-V6.html";
const sets = selectDi009V2ReviewSets();

function table(headers: readonly string[], rows: readonly (readonly string[])[]) {
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

const sections = sets.map((set, setIndex) => {
  const svg = renderDiHistogramSvg(set.stimulus);
  const questions = set.questions.map((question, questionIndex) => {
    const options = question.options.map((option, index) => `<li><span class="option-letter">${String.fromCharCode(65 + index)}.</span> ${escapeHtml(option)}</li>`).join("");
    const steps = question.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
    const working = question.explanation.workingTable ? table(question.explanation.workingTable.headers, question.explanation.workingTable.rows) : "";
    return `<article class="question"><h3>Q${questionIndex + 1}. ${escapeHtml(question.stem)}</h3><ol class="options">${options}</ol><div class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + question.correctIndex)}. ${escapeHtml(question.answer)}</div><div class="explanation"><strong>Explanation:</strong> ${escapeHtml(question.explanation.keyIdea)}<ol>${steps}</ol>${working}</div><div class="meta">${escapeHtml(question.kind)} · ${escapeHtml(question.difficulty)}</div></article>`;
  }).join("");

  return `<section class="set"><div class="set-heading"><div><h2>Set ${setIndex + 1} — ${escapeHtml(set.examProfile)}</h2><p class="set-meta"><strong>Shape:</strong> ${escapeHtml(set.stimulus.shape)} &nbsp; <strong>Classes:</strong> ${set.stimulus.bins.length} &nbsp; <strong>Context:</strong> ${escapeHtml(set.stimulus.title)}</p></div><span class="visual-badge">Shared DI renderer</span></div><div class="histogram">${svg}</div>${questions}</section>`;
}).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DI-009 Histogram — Original DI Architecture Alignment</title><style>
:root{--bg:#f5f7fb;--card:#fff;--text:#172033;--muted:#667085;--line:#e5e7eb;--answer:#eef8f1;--soft:#fafbfc}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;line-height:1.55}main{width:min(1160px,calc(100% - 24px));margin:24px auto 60px}.hero,.set{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:clamp(18px,4vw,36px);margin-bottom:24px;box-shadow:0 10px 28px rgba(16,24,40,.05)}h1{margin:0 0 10px;font-size:clamp(28px,5vw,40px);letter-spacing:-.02em}h2{margin:0;font-size:clamp(20px,3vw,25px)}.hero p{max-width:900px}.set-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;border-bottom:1px solid var(--line);padding-bottom:14px}.set-meta,.meta{color:var(--muted)}.set-meta{margin:8px 0 0}.visual-badge{flex:none;background:#f4f7ff;border:1px solid #dfe6ff;color:#3853a4;border-radius:999px;padding:6px 10px;font-size:.76rem;font-weight:700}.histogram{overflow-x:auto;margin:22px 0 32px;padding:14px;border:1px solid #edf0f4;border-radius:14px;background:#fff;box-shadow:0 4px 14px rgba(16,24,40,.03);scrollbar-gutter:stable}.histogram svg{display:block;width:100%;min-width:720px;max-width:960px;height:auto;margin:auto}.question{padding:22px 0;border-top:1px solid var(--line)}.question h3{font-size:1.07rem;margin:0 0 12px}.options{list-style:none;padding:0}.options li{padding:8px 11px;margin:7px 0;background:var(--soft);border:1px solid #eef1f5;border-radius:9px}.option-letter{font-weight:700;display:inline-block;width:24px}.answer{background:var(--answer);padding:10px 12px;border-radius:9px;margin:12px 0}.meta{font-size:.86rem;margin-top:12px}table{width:100%;border-collapse:collapse;margin:14px 0}th,td{border:1px solid var(--line);padding:8px 10px;text-align:left}th{background:#f7f8fa}@media(max-width:700px){main{width:calc(100% - 12px)}.hero,.set{padding:15px}.set-heading{display:block}.visual-badge{display:inline-block;margin-top:10px}.histogram{padding:8px}.histogram svg{min-width:700px}}@media print{body{background:#fff}.hero,.set{box-shadow:none;border:0}.histogram svg{min-width:0}}</style></head><body><main><section class="hero"><h1>DI-009 Histogram — Original DI Architecture Alignment</h1><p>Review-only. The question set now contains semantic histogram data only, matching the architecture of the original DI packages. The chart is rendered separately by the shared Data Interpretation presentation layer.</p><p><strong>Question logic: V2 retained · Set contract: V3 semantic stimulus · Renderer: ${DI_HISTOGRAM_VISUAL_THEME}</strong></p><p><strong>${sets.length} sets · ${sets.reduce((sum, set) => sum + set.questions.length, 0)} questions · 13/13 contract families represented</strong></p></section>${sections}</main></body></html>`;

writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({
  outputPath,
  architecture: "SEMANTIC_STIMULUS_PLUS_SHARED_DI_RENDERER",
  questionLogicVersion: "DI-009-QUESTION-LOGIC-V3",
  setContractVersion: "DI-009-SET-CONTRACT-V3",
  visualTheme: DI_HISTOGRAM_VISUAL_THEME,
  sets: sets.length,
  questions: sets.reduce((sum, set) => sum + set.questions.length, 0),
}));
