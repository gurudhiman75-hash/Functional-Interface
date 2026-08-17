import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  SAP_CP006_FULL_REVIEW_CATALOGUE,
  SAP_CP006_FULL_REVIEW_TOTAL,
  generateSapCp006FullReviewRecords,
} from "./full-review-export-final";

const markdownPath = resolve(process.argv[2] ?? "dist/SAP-CP-006-300-FULL-ENGLISH-REVIEW.md");
const htmlPath = resolve(process.argv[3] ?? "dist/SAP-CP-006-300-FULL-ENGLISH-REVIEW.html");
const jsonPath = resolve(process.argv[4] ?? "dist/SAP-CP-006-300-FULL-ENGLISH-REVIEW.json");
const records = generateSapCp006FullReviewRecords();
const labels = ["A", "B", "C", "D"] as const;
const titleByPrototype = new Map(SAP_CP006_FULL_REVIEW_CATALOGUE.map((item) => [item.prototypeId, item.title]));

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

const markdown: string[] = [
  "# SAP-CP-006 — 300-Question Full English Review Candidate",
  "",
  "**Checkpoint:** Missing Values, Equality, Comparison and Exact Synthesis  ",
  "**Status:** Inactive human-review candidate; no permanent allocation  ",
  "**Candidate coordinates:** SAP-QL-092 through SAP-QL-112  ",
  "**Coverage:** 21 solve identities; 300 unique questions; 14–15 per identity  ",
  "**Presentation:** QL-099 includes small-table variants; QL-112 uses four-class data sufficiency  ",
  "",
];

for (const [index, record] of records.entries()) {
  const title = titleByPrototype.get(record.prototypeId) ?? record.prototypeId;
  markdown.push(
    `## Question ${index + 1} — ${record.proposedPermanentQlId}`,
    "",
    `**Authority:** ${title}  `,
    `**Direction:** ${record.taskDirection}  `,
    `**Difficulty:** ${record.difficulty}  `,
    `**Seed:** ${record.seed}  `,
    "",
    record.stem,
    "",
  );
  record.options.forEach((option, optionIndex) => markdown.push(`${labels[optionIndex]}. ${option.value}`));
  markdown.push("", `**Correct answer:** ${labels[record.correctIndex]}. ${record.canonicalAnswer}`, "", "### Explanation", "", record.explanation.coreConcept, "");
  record.explanation.steps.forEach((step, stepIndex) => markdown.push(`${stepIndex + 1}. ${step}`));
  markdown.push("", "### Verification", "");
  record.explanation.verification.forEach((step) => markdown.push(`- ${step}`));
  markdown.push("", record.explanation.finalAnswer, "", "### Distractor analysis", "");
  record.options.forEach((option, optionIndex) => {
    if (!option.isCorrect) markdown.push(`- **${labels[optionIndex]}. ${option.value} — ${option.misconceptionId}:** ${option.analysis}`);
  });
  markdown.push("", "---", "");
}

const cards = records.map((record, index) => {
  const title = titleByPrototype.get(record.prototypeId) ?? record.prototypeId;
  const options = record.options.map((option, optionIndex) => `<li><b>${labels[optionIndex]}.</b> ${escapeHtml(option.value)}</li>`).join("");
  const steps = record.explanation.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const verification = record.explanation.verification.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const distractors = record.options.map((option, optionIndex) => option.isCorrect ? "" : `<li><b>${labels[optionIndex]}. ${escapeHtml(option.value)} — ${escapeHtml(option.misconceptionId ?? "")}</b><br>${escapeHtml(option.analysis)}</li>`).join("");
  const search = `${record.questionId} ${record.proposedPermanentQlId} ${title} ${record.prototypeId} ${record.stem} ${record.canonicalAnswer}`.toLowerCase();
  return `<details class="card" data-prototype="${escapeHtml(record.prototypeId)}" data-direction="${record.taskDirection}" data-search="${escapeHtml(search)}"><summary><b>${String(index + 1).padStart(3, "0")} · ${escapeHtml(record.proposedPermanentQlId)} · ${escapeHtml(title)}</b><span>${record.difficulty} · ${record.taskDirection} · Answer ${labels[record.correctIndex]}</span></summary><div class="body"><h3>Question</h3><pre>${escapeHtml(record.stem)}</pre><ol>${options}</ol><p class="answer"><b>Correct:</b> ${labels[record.correctIndex]}. ${escapeHtml(record.canonicalAnswer)}</p><h3>Core concept</h3><p>${escapeHtml(record.explanation.coreConcept)}</p><h3>Solution</h3><ol>${steps}</ol><h3>Verification</h3><ul>${verification}</ul><h3>Distractors</h3><ul>${distractors}</ul></div></details>`;
}).join("\n");

const qlOptions = SAP_CP006_FULL_REVIEW_CATALOGUE.map((item) => `<option value="${escapeHtml(item.prototypeId)}">${escapeHtml(item.proposedPermanentQlId)} — ${escapeHtml(item.title)}</option>`).join("");
const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SAP CP-006 Review</title><style>*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#182236;font:15px/1.55 system-ui,Segoe UI,Arial}header{position:sticky;top:0;z-index:3;background:white;border-bottom:1px solid #dce3ee;padding:10px}nav{max-width:1400px;margin:auto;display:grid;grid-template-columns:1fr 280px 220px auto auto;gap:8px}input,select,button{padding:9px;border:1px solid #cbd5e1;border-radius:8px;background:white}main{max-width:1400px;margin:auto;padding:18px}.intro,.card{background:white;border:1px solid #dce3ee;border-radius:12px}.intro{padding:20px;margin-bottom:12px}.card{margin:9px 0;overflow:hidden}.card.hidden{display:none}summary{cursor:pointer;padding:13px;display:flex;justify-content:space-between;gap:12px}.body{border-top:1px solid #e5eaf1;padding:18px}.answer{background:#edf3ff;padding:10px;border-radius:8px}pre{white-space:pre-wrap;font:inherit;font-weight:650}.stats{font-weight:800}.warn{border-left:4px solid #a66b00;padding:9px 12px;background:#fff8e8}@media(max-width:800px){nav{grid-template-columns:1fr}.body{padding:13px}summary{display:block}}</style></head><body><header><nav><input id="search" placeholder="Search question, QL, value…"><select id="ql"><option value="">All QLs</option>${qlOptions}</select><select id="direction"><option value="">All directions</option><option>INVERSE</option><option>COMPARISON</option><option>ORDERING</option><option>SYNTHESIS</option><option>VERIFICATION</option><option>DATA_SUFFICIENCY</option></select><button id="expand">Expand visible</button><button id="collapse">Collapse</button></nav></header><main><section class="intro"><h1>SAP-CP-006 — 300-Question English Review</h1><p class="warn">Candidate QLs 092–112 only. QL-099 contains small-table variants; QL-112 uses data sufficiency. All lifecycle surfaces remain inactive.</p><p class="stats"><span id="visible">${SAP_CP006_FULL_REVIEW_TOTAL}</span> visible · 21 identities · 14–15 questions each · 75 answers per A/B/C/D</p></section>${cards}</main><script>const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),ql=document.getElementById('ql'),direction=document.getElementById('direction'),visible=document.getElementById('visible');function filter(){const t=search.value.toLowerCase().trim();let n=0;cards.forEach(c=>{const show=(!t||c.dataset.search.includes(t))&&(!ql.value||c.dataset.prototype===ql.value)&&(!direction.value||c.dataset.direction===direction.value);c.classList.toggle('hidden',!show);if(show)n++});visible.textContent=String(n)}search.oninput=filter;ql.onchange=filter;direction.onchange=filter;document.getElementById('expand').onclick=()=>cards.filter(c=>!c.classList.contains('hidden')).forEach(c=>c.open=true);document.getElementById('collapse').onclick=()=>cards.forEach(c=>c.open=false);</script></body></html>`;

for (const path of [markdownPath, htmlPath, jsonPath]) mkdirSync(dirname(path), { recursive: true });
writeFileSync(markdownPath, markdown.join("\n"), "utf8");
writeFileSync(htmlPath, html, "utf8");
writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf8");
console.log(JSON.stringify({ status: "WROTE_SAP_CP006_FINAL_REVIEW", questionCount: records.length, identities: 21, candidateQlRange: "SAP-QL-092..SAP-QL-112", markdownPath, htmlPath, jsonPath, lifecycle: "INACTIVE_REVIEW_CANDIDATE" }, null, 2));
