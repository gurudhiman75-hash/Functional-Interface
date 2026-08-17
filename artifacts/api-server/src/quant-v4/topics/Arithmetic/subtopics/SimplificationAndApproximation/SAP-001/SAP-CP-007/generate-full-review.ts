import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  SAP_CP007_FULL_REVIEW_CATALOGUE,
  generateSapCp007FullReviewRecords,
} from "./full-review-export";

const markdownPath = resolve(process.argv[2] ?? "dist/SAP-CP-007-300-FULL-ENGLISH-REVIEW.md");
const htmlPath = resolve(process.argv[3] ?? "dist/SAP-CP-007-300-FULL-ENGLISH-REVIEW.html");
const jsonPath = resolve(process.argv[4] ?? "dist/SAP-CP-007-300-FULL-ENGLISH-REVIEW.json");
const records = generateSapCp007FullReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const titleByPrototype = new Map(SAP_CP007_FULL_REVIEW_CATALOGUE.map((item) => [item.prototypeId, item.title]));

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

const markdown: string[] = [
  "# SAP-CP-007 — 300-Question Full English Review Candidate",
  "",
  "**Checkpoint:** Rounding, Place Value and Precision Control  ",
  "**Tie rule:** Half away from zero  ",
  "**Status:** Inactive human-review candidate; no permanent QL allocation  ",
  "**Candidate coordinates:** SAP-QL-113 through SAP-QL-128  ",
  "**Coverage:** 16 solve identities / 300 unique review questions  ",
  "**Source guard:** Significant figures remain held pending registered exam evidence  ",
  "**Lifecycle:** Question Studio, bank, tests and publication remain disabled  ",
  "",
];

for (const [index, record] of records.entries()) {
  const title = titleByPrototype.get(record.prototypeId) ?? record.prototypeId;
  markdown.push(
    `## Question ${index + 1} — ${record.proposedPermanentQlId}`,
    "",
    `**Authority:** ${title}  `,
    `**Prototype:** ${record.prototypeId}  `,
    `**Difficulty:** ${record.difficulty}  `,
    `**Task direction:** ${record.taskDirection}  `,
    `**Seed:** ${record.seed}  `,
    "",
    "### Question",
    "",
    record.stem,
    "",
  );
  record.options.forEach((option, optionIndex) => markdown.push(`${labels[optionIndex]}. ${option.value}`));
  markdown.push(
    "",
    `**Correct answer:** ${labels[record.correctIndex]}. ${record.canonicalAnswer}`,
    "",
    "### Core concept",
    "",
    record.explanation.coreConcept,
    "",
    "### Step-by-step solution",
    "",
  );
  record.explanation.steps.forEach((step, stepIndex) => markdown.push(`${stepIndex + 1}. ${step}`));
  markdown.push("", "### Verification", "");
  record.explanation.verification.forEach((step) => markdown.push(`- ${step}`));
  markdown.push("", record.explanation.finalAnswer, "", "### Distractor analysis", "");
  record.options.forEach((option, optionIndex) => {
    if (!option.isCorrect) markdown.push(`- **${labels[optionIndex]}. ${option.value} — ${option.misconceptionId}:** ${option.analysis}`);
  });
  markdown.push("", "---", "");
}

const prototypeOptions = SAP_CP007_FULL_REVIEW_CATALOGUE.map((item) => `<option value="${escapeHtml(item.prototypeId)}">${escapeHtml(item.proposedPermanentQlId)} — ${escapeHtml(item.title)}</option>`).join("");
const cards = records.map((record, index) => {
  const title = titleByPrototype.get(record.prototypeId) ?? record.prototypeId;
  const options = record.options.map((option, optionIndex) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${labels[optionIndex]}.</b> ${escapeHtml(option.value)}</li>`).join("");
  const steps = record.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const verification = record.explanation.verification.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const distractors = record.options.map((option, optionIndex) => option.isCorrect ? "" : `<li><b>${labels[optionIndex]}. ${escapeHtml(option.value)} — ${escapeHtml(option.misconceptionId ?? "")}</b><br>${escapeHtml(option.analysis)}</li>`).join("");
  const search = `${record.questionId} ${record.proposedPermanentQlId} ${title} ${record.prototypeId} ${record.stem} ${record.canonicalAnswer}`.toLowerCase();
  return `<details class="card" data-prototype="${escapeHtml(record.prototypeId)}" data-difficulty="${record.difficulty}" data-direction="${record.taskDirection}" data-search="${escapeHtml(search)}"><summary><span class="num">${String(index + 1).padStart(3, "0")}</span><span class="copy"><strong>${escapeHtml(record.proposedPermanentQlId)} — ${escapeHtml(title)}</strong><span>${escapeHtml(record.stem)}</span></span><span class="tags"><i>${record.difficulty}</i><i>${record.taskDirection}</i><i>Answer ${labels[record.correctIndex]}</i></span></summary><div class="body"><h3>Question</h3><p class="stem">${escapeHtml(record.stem)}</p><ol class="options">${options}</ol><p class="answer"><b>Correct answer:</b> ${labels[record.correctIndex]}. ${escapeHtml(record.canonicalAnswer)}</p><h3>Core concept</h3><p>${escapeHtml(record.explanation.coreConcept)}</p><h3>Step-by-step solution</h3><ol>${steps}</ol><h3>Verification</h3><ul>${verification}</ul><p><b>${escapeHtml(record.explanation.finalAnswer)}</b></p><h3>Distractor analysis</h3><ul>${distractors}</ul><p class="meta">Prototype: ${escapeHtml(record.prototypeId)} · seed ${record.seed} · candidate coordinate ${escapeHtml(record.proposedPermanentQlId)}</p></div></details>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAP-CP-007 — 300 Question Review</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#172033;font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;line-height:1.55}header{position:sticky;top:0;background:#fff;border-bottom:1px solid #dde3ec;z-index:5}.toolbar{max-width:1450px;margin:auto;padding:10px 14px;display:grid;grid-template-columns:1fr repeat(3,minmax(150px,auto)) auto auto;gap:8px}input,select,button{min-height:40px;border:1px solid #cbd4e2;border-radius:8px;background:#fff;padding:7px 9px;font:inherit}button{cursor:pointer;font-weight:700}main{max-width:1450px;margin:auto;padding:18px 14px 50px}.intro{background:#fff;border:1px solid #dde3ec;border-radius:14px;padding:22px}.warning{border-left:4px solid #a66b00;background:#fff8e8;padding:10px 12px}.stats{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.pill{background:#fff;border:1px solid #dde3ec;border-radius:999px;padding:6px 10px;font-weight:700}.list{display:grid;gap:10px}.card{background:#fff;border:1px solid #dde3ec;border-radius:12px;overflow:hidden}.card.hidden{display:none}summary{cursor:pointer;display:flex;align-items:center;gap:12px;padding:14px}.num{background:#eaf0ff;color:#2457d6;border-radius:7px;padding:4px 7px;font-weight:800}.copy{display:grid;min-width:0;flex:1}.copy span{color:#5c687d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.92rem}.tags{display:flex;gap:5px;flex-wrap:wrap}.tags i{font-style:normal;border:1px solid #dde3ec;border-radius:999px;padding:3px 7px;font-size:.72rem;font-weight:800}.body{border-top:1px solid #dde3ec;padding:18px 25px 25px}.stem{font-size:1.05rem;font-weight:650;white-space:pre-line}.options li{margin:.4rem 0}.answer{background:#eaf0ff;padding:10px 12px;border-radius:8px}.meta{border-top:1px solid #edf1f7;padding-top:10px;color:#68748a;font-size:.88rem}.empty{display:none;background:#fff;padding:20px;text-align:center;border-radius:10px}.empty.show{display:block}@media(max-width:900px){.toolbar{grid-template-columns:1fr 1fr}.toolbar input{grid-column:1/-1}.tags{display:none}}@media(max-width:560px){.toolbar{grid-template-columns:1fr}.body{padding:15px}.copy span{white-space:normal}}</style></head><body><header><div class="toolbar"><input id="search" placeholder="Search question, QL, value…"><select id="prototype"><option value="">All QLs</option>${prototypeOptions}</select><select id="difficulty"><option value="">All difficulties</option><option>EASY</option><option>MEDIUM</option><option>HARD</option></select><select id="direction"><option value="">All directions</option><option>FORWARD</option><option>INVERSE</option><option>PLACE_VALUE</option><option>ERROR</option><option>COMPARISON</option><option>DIAGNOSIS</option></select><button id="expand">Expand visible</button><button id="collapse">Collapse all</button></div></header><main><section class="intro"><h1>SAP-CP-007 — 300-Question English Review Candidate</h1><p><strong>Rounding, Place Value and Precision Control</strong></p><p class="warning"><b>Review boundary:</b> SAP-QL-113..SAP-QL-128 are candidate coordinates only. Significant figures remain source-guarded. All runtime lifecycle surfaces remain inactive.</p></section><div class="stats"><span class="pill"><span id="visible">300</span> visible</span><span class="pill">16 solve identities</span><span class="pill">75 answers per A/B/C/D position</span><span class="pill">Half away from zero</span></div><section class="list">${cards}</section><div id="empty" class="empty">No questions match the current filters.</div></main><script>const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),prototype=document.getElementById('prototype'),difficulty=document.getElementById('difficulty'),direction=document.getElementById('direction'),visible=document.getElementById('visible'),empty=document.getElementById('empty');function apply(){const term=search.value.trim().toLowerCase();let count=0;for(const card of cards){const show=(!term||card.dataset.search.includes(term))&&(!prototype.value||card.dataset.prototype===prototype.value)&&(!difficulty.value||card.dataset.difficulty===difficulty.value)&&(!direction.value||card.dataset.direction===direction.value);card.classList.toggle('hidden',!show);if(show)count++}visible.textContent=String(count);empty.classList.toggle('show',count===0)}search.addEventListener('input',apply);prototype.addEventListener('change',apply);difficulty.addEventListener('change',apply);direction.addEventListener('change',apply);document.getElementById('expand').onclick=()=>cards.filter(c=>!c.classList.contains('hidden')).forEach(c=>c.open=true);document.getElementById('collapse').onclick=()=>cards.forEach(c=>c.open=false);</script></body></html>`;

for (const path of [markdownPath, htmlPath, jsonPath]) mkdirSync(dirname(path), { recursive: true });
writeFileSync(markdownPath, markdown.join("\n"), "utf8");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf8");

console.log(JSON.stringify({ status: "WROTE_SAP_CP007_FULL_ENGLISH_REVIEW", questionCount: records.length, admittedIdentities: 16, candidateQlRange: "SAP-QL-113..SAP-QL-128", answerBalance: "75/75/75/75", significantFigures: "SOURCE_GUARDED_HOLD", markdownPath, htmlPath, jsonPath, lifecycle: "INACTIVE_REVIEW_CANDIDATE" }, null, 2));
