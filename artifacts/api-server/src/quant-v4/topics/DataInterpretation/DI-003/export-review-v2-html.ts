import { writeFileSync } from "node:fs";
import { renderDiGroupedBarSvg } from "../visuals/grouped-bar-svg";
import { buildDi003V2ReviewSets } from "./review-utils-v2";

function esc(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function workingTable(table: { headers: readonly string[]; rows: readonly (readonly string[])[] } | undefined) {
  if (!table) return "";
  return `<div class="work-table"><table><thead><tr>${table.headers.map((cell) => `<th>${esc(cell)}</th>`).join("")}</tr></thead><tbody>${table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}

const outputPath = process.argv[2] ?? "DI-003-REVIEW-V2.html";
const sets = buildDi003V2ReviewSets();
const sections = sets.map((set, setIndex) => {
  const svg = renderDiGroupedBarSvg({
    title: set.stimulus.title,
    yAxisLabel: set.stimulus.yAxisLabel,
    seriesALabel: set.stimulus.series[0].label,
    seriesBLabel: set.stimulus.series[1].label,
    points: set.stimulus.points,
  });
  const questions = set.questions.map((question, questionIndex) => {
    const options = question.options.map((option, optionIndex) => `<li><span class="letter">${String.fromCharCode(65 + optionIndex)}.</span><span>${esc(option)}</span></li>`).join("");
    const steps = question.explanation.steps.map((step, stepIndex) => `<li><span class="step-no">${stepIndex + 1}</span><span>${esc(step)}</span></li>`).join("");
    return `<article class="question"><div class="qmeta"><strong>Q${questionIndex + 1}</strong><span class="difficulty ${question.difficulty.toLowerCase()}">${question.difficulty}</span><code>${esc(question.kind)}</code></div><p class="stem">${esc(question.stem)}</p><ol class="options">${options}</ol><details open><summary>Answer & explanation</summary><p class="answer"><strong>Answer:</strong> ${String.fromCharCode(65 + question.correctIndex)}. ${esc(question.answer)}</p><p class="idea">${esc(question.explanation.keyIdea)}</p><ol class="steps">${steps}</ol>${workingTable(question.explanation.workingTable)}</details></article>`;
  }).join("");
  return `<section class="set"><div class="set-head"><div><span class="set-number">Set ${setIndex + 1}</span><h2>${esc(set.examProfile.replaceAll("_", " "))}</h2><p>${esc(set.stimulus.contextId.replaceAll("_", " "))}</p></div><span class="option-count">${set.optionCount} options</span></div><p class="instruction">${esc(set.stimulus.instruction)}</p><div class="chart">${svg}</div>${questions}</section>`;
}).join("");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DI-003 Grouped Bar V2 Review</title><style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#172033;background:#f5f7fa}*{box-sizing:border-box}body{margin:0}.shell{max-width:1060px;margin:0 auto;padding:32px 18px 72px}.hero,.set{background:#fff;border:1px solid #e4e7ec;border-radius:18px;box-shadow:0 5px 22px rgba(16,24,40,.05)}.hero{padding:26px 28px;margin-bottom:24px}.hero h1{font-size:28px;margin:0 0 8px}.hero p{margin:6px 0;color:#475467;line-height:1.55}.notice{margin-top:15px;padding:12px 14px;border-radius:10px;background:#fff8e6;color:#7a4b00;font-size:14px}.stats{display:flex;gap:9px;flex-wrap:wrap;margin-top:15px}.stat{border:1px solid #e4e7ec;border-radius:999px;padding:7px 11px;font-size:13px;background:#fafafa;color:#344054}.set{padding:24px;margin:22px 0}.set-head{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #eaecf0;padding-bottom:15px}.set-number{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#667085}.set h2{font-size:20px;margin:4px 0}.set-head p{margin:3px 0 0;color:#667085;font-size:13px}.option-count{height:max-content;font-size:12px;background:#f2f4f7;border-radius:999px;padding:6px 9px;color:#475467}.instruction{color:#475467;margin:16px 0 10px}.chart{border:1px solid #e4e7ec;border-radius:14px;padding:8px;background:#fff;overflow-x:auto}.chart svg{display:block;width:100%;height:auto;min-width:680px}.question{padding:22px 0;border-top:1px solid #eef0f3}.question:first-of-type{margin-top:10px}.qmeta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.qmeta strong{font-size:15px}.qmeta code{font-size:11px;background:#f2f4f7;color:#475467;border-radius:6px;padding:4px 6px}.difficulty{font-size:11px;font-weight:700;border-radius:999px;padding:4px 7px}.difficulty.easy{background:#ecfdf3;color:#027a48}.difficulty.medium{background:#fffaeb;color:#b54708}.difficulty.hard{background:#fef3f2;color:#b42318}.stem{font-size:16px;line-height:1.55;margin:13px 0}.options{list-style:none;padding:0;margin:10px 0 16px;display:grid;gap:8px}.options li{display:flex;gap:10px;border:1px solid #e4e7ec;border-radius:10px;padding:10px 12px;background:#fcfcfd}.letter{font-weight:700;min-width:22px}details{border-left:3px solid #98a2b3;padding:4px 0 4px 15px}summary{cursor:pointer;font-weight:700}.answer{margin:12px 0 6px}.idea{margin:7px 0;color:#344054}.steps{list-style:none;padding:0;margin:9px 0;display:grid;gap:7px}.steps li{display:flex;gap:9px;line-height:1.5}.step-no{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:22px;border-radius:50%;background:#f2f4f7;font-size:12px;font-weight:700}.work-table{overflow-x:auto;margin-top:12px}.work-table table{border-collapse:collapse;width:100%;font-size:13px}.work-table th,.work-table td{border:1px solid #e4e7ec;padding:8px 10px;text-align:center}.work-table th{background:#f8fafc;color:#475467}.footer{color:#667085;font-size:13px;text-align:center;margin-top:28px}@media(max-width:720px){.shell{padding:18px 10px 48px}.hero,.set{border-radius:14px;padding:18px}.hero h1{font-size:23px}}
</style></head><body><main class="shell"><section class="hero"><h1>DI-003 Grouped Bar Interpretation — V2</h1><p>Human-review pack for the rebuilt grouped-bar question engine. Charts are rendered by the proposed shared ExamTree grouped-bar presentation layer.</p><div class="notice"><strong>Review only.</strong> Question Studio discovery, Question Bank writes, tests, mocks and student/public publication remain disabled.</div><div class="stats"><span class="stat">${sets.length} sets</span><span class="stat">${sets.reduce((sum, set) => sum + set.questions.length, 0)} questions</span><span class="stat">12 task families</span><span class="stat">1 Easy + 2 Medium + 2 Hard per set</span><span class="stat">SSC + Banking</span></div></section>${sections}<p class="footer">DI-003 V2 review candidate · no production promotion authorized</p></main></body></html>`;

writeFileSync(outputPath, html, "utf8");
console.log(JSON.stringify({ status: "EXPORTED_DI_003_REVIEW_V2_HTML", outputPath, sets: sets.length, questions: sets.reduce((sum, set) => sum + set.questions.length, 0) }));
