import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { generateSapCp004ReviewRecords } from "./review-export";
import { SAP_CP004_CATALOGUE } from "./runtime";

const markdownPath = resolve(process.argv[2] ?? "dist/SAP-CP-004-300-FULL-ENGLISH-REVIEW.md");
const htmlPath = resolve(process.argv[3] ?? "dist/SAP-CP-004-300-FULL-ENGLISH-REVIEW.html");
const records = generateSapCp004ReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const titleByPrototype = new Map(SAP_CP004_CATALOGUE.map((item) => [item.prototypeId, item.title]));

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMathText(value: string): string {
  let rendered = escapeHtml(value);
  rendered = rendered.replace(/(\([^)]+\)|-?\d+)\^(\d+)/g, "$1<sup>$2</sup>");
  rendered = rendered.replaceAll("□", '<span class="missing-variable" aria-label="missing value x">x</span>');
  return rendered.replaceAll("\n", "<br>");
}

const markdown: string[] = [
  "# SAP-CP-004 — 300-Question Full English Review Candidate",
  "",
  "**Checkpoint:** Numeric Powers, Roots, Factorials and Exact Special Forms  ",
  "**Status:** English review candidate; permanent allocation not yet approved  ",
  "**Proposed QL range:** SAP-QL-053 through SAP-QL-071  ",
  "**Lifecycle:** Inactive; Question Studio and test use disabled  ",
  "",
  "The proposed QL labels are review coordinates only. They are not permanent allocations until explicit approval and a separate allocation phase.",
  "",
];

for (const [index, record] of records.entries()) {
  markdown.push(
    `## Question ${index + 1} — ${record.proposedPermanentQlId}`,
    "",
    `**Authority:** ${titleByPrototype.get(record.prototypeId) ?? record.prototypeId}  `,
    `**Prototype:** ${record.prototypeId}  `,
    `**Difficulty:** ${record.difficulty}  `,
    `**Task direction:** ${record.taskDirection}  `,
    `**Answer semantic:** ${record.answerSemantic}  `,
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
    "### Explanation",
    "",
    record.explanation.coreConcept,
    "",
  );
  record.explanation.steps.forEach((step, stepIndex) => markdown.push(`${stepIndex + 1}. ${step}`));
  markdown.push("", record.explanation.finalAnswer, "", "### Distractor analysis", "");
  record.options.forEach((option, optionIndex) => {
    if (option.isCorrect) return;
    markdown.push(`- **${labels[optionIndex]}. ${option.value} — ${option.misconceptionId}:** ${option.analysis}`);
  });
  markdown.push("", "---", "");
}

const prototypeOptions = SAP_CP004_CATALOGUE.map((item) =>
  `<option value="${escapeHtml(item.prototypeId)}">${escapeHtml(item.proposedPermanentQlId)} — ${escapeHtml(item.title)}</option>`,
).join("\n");

const cards = records.map((record, index) => {
  const title = titleByPrototype.get(record.prototypeId) ?? record.prototypeId;
  const options = record.options.map((option, optionIndex) =>
    `<li class="${option.isCorrect ? "correct-option" : ""}"><span class="option-label">${labels[optionIndex]}.</span> ${renderMathText(option.value)}</li>`,
  ).join("");
  const steps = record.explanation.steps.map((step) => `<li>${renderMathText(step)}</li>`).join("");
  const distractors = record.options.map((option, optionIndex) => option.isCorrect ? "" :
    `<li><strong>${labels[optionIndex]}. ${renderMathText(option.value)} — ${escapeHtml(option.misconceptionId ?? "")}</strong><br>${escapeHtml(option.analysis)}</li>`,
  ).join("");
  const search = `${record.questionId} ${record.proposedPermanentQlId} ${title} ${record.prototypeId} ${record.stem} ${record.canonicalAnswer} ${record.explanation.coreConcept} ${record.explanation.steps.join(" ")}`.toLowerCase();
  return `<details class="question-card" id="q-${String(index + 1).padStart(3, "0")}" data-prototype="${escapeHtml(record.prototypeId)}" data-difficulty="${record.difficulty}" data-direction="${record.taskDirection}" data-search="${escapeHtml(search)}">
<summary>
  <span class="question-index">${String(index + 1).padStart(3, "0")}</span>
  <span class="summary-copy"><strong>${escapeHtml(record.proposedPermanentQlId)} — ${escapeHtml(title)}</strong><span>${renderMathText(record.stem.replaceAll("\n", " "))}</span></span>
  <span class="tags"><span class="tag ${record.difficulty.toLowerCase()}">${record.difficulty}</span><span class="tag">${record.taskDirection}</span><span class="tag answer">Answer ${labels[record.correctIndex]}</span></span>
</summary>
<div class="question-body">
  <section><h3>Question</h3><p class="stem">${renderMathText(record.stem)}</p><ol class="options" type="A">${options}</ol></section>
  <section class="answer-box"><strong>Correct answer:</strong> ${labels[record.correctIndex]}. ${renderMathText(record.canonicalAnswer)}</section>
  <section><h3>Explanation</h3><p>${escapeHtml(record.explanation.coreConcept)}</p><ol>${steps}</ol><p class="final-answer">${renderMathText(record.explanation.finalAnswer)}</p></section>
  <section><h3>Distractor analysis</h3><ul class="distractors">${distractors}</ul></section>
  <section class="metadata"><strong>Prototype:</strong> ${escapeHtml(record.prototypeId)} · <strong>Answer semantic:</strong> ${record.answerSemantic} · <strong>Seed:</strong> ${record.seed}</section>
</div>
</details>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SAP-CP-004 — 300-Question English Review</title>
<style>
:root{color-scheme:light;--bg:#f5f7fb;--panel:#fff;--text:#172033;--muted:#5c687d;--line:#dce3ee;--accent:#2457d6;--soft:#eaf0ff;--easy:#16794b;--medium:#916100;--hard:#b42318}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;line-height:1.58}
header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line);backdrop-filter:blur(10px)}
.toolbar{max-width:1500px;margin:auto;padding:12px 20px;display:grid;grid-template-columns:minmax(250px,1fr) repeat(3,minmax(155px,auto)) auto auto;gap:9px}
input,select,button{min-height:42px;border:1px solid #cbd4e2;border-radius:9px;background:#fff;color:var(--text);font:inherit;padding:8px 10px}button{cursor:pointer;font-weight:700}.primary{background:var(--accent);color:#fff;border-color:var(--accent)}
main{max-width:1500px;margin:auto;padding:22px 20px 50px}.intro{background:#fff;border:1px solid var(--line);border-radius:16px;padding:25px 29px;box-shadow:0 5px 18px rgba(19,33,68,.08)}.intro h1{margin-top:0;line-height:1.2}.warning{padding:12px 14px;border-left:4px solid var(--medium);background:#fff8e6;border-radius:7px}.status{display:flex;gap:10px;flex-wrap:wrap;margin:17px 0}.pill{background:#fff;border:1px solid var(--line);border-radius:999px;padding:7px 11px;font-weight:700}
.question-list{display:grid;gap:11px}.question-card{background:#fff;border:1px solid var(--line);border-radius:13px;overflow:clip;box-shadow:0 2px 9px rgba(19,33,68,.05)}.question-card[open]{box-shadow:0 5px 18px rgba(19,33,68,.1)}summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:13px;padding:15px 17px}summary::-webkit-details-marker{display:none}summary::after{content:"＋";color:var(--accent);font-size:1.25rem;font-weight:800}.question-card[open] summary::after{content:"−"}.question-index{background:var(--soft);color:var(--accent);border-radius:8px;padding:4px 8px;font-weight:800;font-variant-numeric:tabular-nums}.summary-copy{display:grid;min-width:0;flex:1}.summary-copy span{color:var(--muted);font-size:.91rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tags{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.tag{border:1px solid var(--line);border-radius:999px;padding:3px 8px;font-size:.72rem;font-weight:800;background:#f8fafc}.tag.easy{color:var(--easy);background:#eaf8f1}.tag.medium{color:var(--medium);background:#fff7df}.tag.hard{color:var(--hard);background:#fff0ee}.tag.answer{color:var(--accent);background:var(--soft)}
.question-body{border-top:1px solid var(--line);padding:22px 29px 29px}.question-body h3{border-bottom:1px solid #edf1f7;padding-bottom:5px}.stem{font-size:1.06rem;font-weight:600}.options{padding-left:2.2rem}.options li{margin:.42rem 0;padding-left:.25rem}.option-label{display:none}.correct-option{font-weight:650}.answer-box{margin:17px 0;padding:12px 14px;background:var(--soft);border-radius:9px}.final-answer{font-weight:750}.distractors li{margin:.7rem 0}.metadata{margin-top:20px;padding-top:12px;border-top:1px solid var(--line);color:var(--muted);font-size:.88rem}.missing-variable{display:inline-flex;min-width:1.4em;height:1.4em;align-items:center;justify-content:center;border:1.5px solid #61708c;border-radius:.22em;background:#f5f8ff;color:#173f9f;font-weight:800;vertical-align:-.1em}sup{font-size:.72em;line-height:0}.hidden{display:none}.empty{display:none;text-align:center;padding:28px;background:#fff;border:1px solid var(--line);border-radius:12px;color:var(--muted)}.empty.visible{display:block}
@media(max-width:1050px){.toolbar{grid-template-columns:1fr 1fr}.toolbar input{grid-column:1/-1}.tags{display:none}}@media(max-width:650px){.toolbar{grid-template-columns:1fr}main{padding:12px 9px 35px}.intro{padding:19px 17px}.question-body{padding:18px 16px}.summary-copy span{white-space:normal;max-height:3em}}
@media print{header,.status{display:none}.question-card{break-inside:avoid;box-shadow:none}.question-card>*:not(summary){display:block}.question-body{display:block!important}}
</style>
</head>
<body>
<header><div class="toolbar">
<input id="search" type="search" placeholder="Search question, value, explanation or QL…">
<select id="prototype"><option value="">All proposed QLs</option>${prototypeOptions}</select>
<select id="difficulty"><option value="">All difficulties</option><option>EASY</option><option>MEDIUM</option><option>HARD</option></select>
<select id="direction"><option value="">All directions</option><option>FORWARD</option><option>INVERSE</option><option>COMPARISON</option><option>DIAGNOSIS</option></select>
<button class="primary" id="expand">Expand visible</button><button id="collapse">Collapse all</button>
</div></header>
<main>
<section class="intro"><h1>SAP-CP-004 — Full 300-Question English Review Candidate</h1><p><strong>Numeric Powers, Roots, Factorials and Exact Special Forms</strong></p><p class="warning"><strong>Review boundary:</strong> SAP-QL-053 through SAP-QL-071 are proposed coordinates only. They are not permanent identities, and no Question Studio or mock-test activation is included.</p></section>
<div class="status"><span class="pill"><span id="visible">300</span> visible questions</span><span class="pill">19 authorities</span><span class="pill">Standalone offline HTML</span></div>
<section class="question-list">${cards}</section><div class="empty" id="empty">No questions match the selected filters.</div>
</main>
<script>
const cards=[...document.querySelectorAll('.question-card')];const search=document.getElementById('search');const prototype=document.getElementById('prototype');const difficulty=document.getElementById('difficulty');const direction=document.getElementById('direction');const visible=document.getElementById('visible');const empty=document.getElementById('empty');
function apply(){const term=search.value.trim().toLowerCase();let count=0;for(const card of cards){const show=(!term||card.dataset.search.includes(term))&&(!prototype.value||card.dataset.prototype===prototype.value)&&(!difficulty.value||card.dataset.difficulty===difficulty.value)&&(!direction.value||card.dataset.direction===direction.value);card.classList.toggle('hidden',!show);if(show)count++}visible.textContent=String(count);empty.classList.toggle('visible',count===0)}
search.addEventListener('input',apply);prototype.addEventListener('change',apply);difficulty.addEventListener('change',apply);direction.addEventListener('change',apply);document.getElementById('expand').addEventListener('click',()=>cards.filter(c=>!c.classList.contains('hidden')).forEach(c=>c.open=true));document.getElementById('collapse').addEventListener('click',()=>cards.forEach(c=>c.open=false));
if(location.hash){const target=document.querySelector(location.hash);if(target instanceof HTMLDetailsElement){target.open=true;target.scrollIntoView({block:'start'})}}
</script>
</body></html>`;

mkdirSync(dirname(markdownPath), { recursive: true });
mkdirSync(dirname(htmlPath), { recursive: true });
writeFileSync(markdownPath, markdown.join("\n"), "utf8");
writeFileSync(htmlPath, html, "utf8");

console.log(JSON.stringify({
  status: "WROTE_SAP_CP004_FULL_ENGLISH_REVIEW",
  markdownPath,
  htmlPath,
  questionCount: records.length,
  proposedQlRange: "SAP-QL-053..SAP-QL-071",
  lifecycle: "INACTIVE_REVIEW_CANDIDATE",
}, null, 2));
