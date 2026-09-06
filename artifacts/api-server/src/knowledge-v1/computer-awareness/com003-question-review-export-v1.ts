import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { COM003_PERMANENT_CPS, COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V4 } from "./com003-review-synthesis-v4";

const OUTPUT_PATH = resolve(process.cwd(), "dist/com003-question-review/COM-003-QUESTION-REVIEW-V1.html");

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function optionLetter(index: number) {
  return String.fromCharCode(65 + index);
}

const qlById = new Map(COM003_PERMANENT_QLS.map((ql) => [ql.qlId, ql]));
const questionsByQl = new Map(
  COM003_PERMANENT_QLS.map((ql) => [
    ql.qlId,
    COM003_ENGLISH_REVIEW_CORPUS_V4.filter((question) => question.qlId === ql.qlId),
  ]),
);

let globalQuestionNumber = 0;
const cpSections = COM003_PERMANENT_CPS.map((cp) => {
  const qlSections = cp.qlIds.map((qlId) => {
    const ql = qlById.get(qlId);
    if (!ql) throw new Error(`Missing QL metadata for ${qlId}`);
    const questions = questionsByQl.get(qlId) ?? [];
    if (questions.length !== 12) throw new Error(`${qlId} expected 12 frozen questions, found ${questions.length}`);

    const cards = questions.map((question, qIndex) => {
      globalQuestionNumber += 1;
      const correctLetter = optionLetter(question.correctIndex);
      const options = question.options
        .map(
          (option, optionIndex) => `
            <li class="option ${optionIndex === question.correctIndex ? "correct-option answer-reveal" : ""}">
              <span class="option-letter">${optionLetter(optionIndex)}.</span>
              <span>${escapeHtml(option)}</span>
            </li>`,
        )
        .join("");

      return `
        <article class="question-card" id="${escapeHtml(question.questionId)}" data-question-id="${escapeHtml(question.questionId)}">
          <div class="question-head">
            <div>
              <span class="global-number">Q${globalQuestionNumber}</span>
              <span class="ql-number">${escapeHtml(ql.qlId)} · #${qIndex + 1}</span>
            </div>
            <span class="surface-badge">${escapeHtml(question.surfaceMode)}</span>
          </div>
          <div class="stem">${escapeHtml(question.stem)}</div>
          <ol class="options" type="A">${options}</ol>
          <details class="answer-box">
            <summary>Answer & explanation</summary>
            <div class="answer-content">
              <div class="answer-line"><strong>Correct:</strong> ${correctLetter}. ${escapeHtml(question.canonicalAnswer)}</div>
              <div class="explanation"><strong>Explanation:</strong> ${escapeHtml(question.explanation)}</div>
              <div class="meta-grid">
                <div><strong>Target fact:</strong> ${escapeHtml(question.targetFactId)}</div>
                <div><strong>Distractor strategy:</strong> ${escapeHtml(question.distractorStrategy)}</div>
                <div><strong>Version scoped:</strong> ${question.versionScoped ? "Yes" : "No"}</div>
                <div><strong>Controlled pool:</strong> ${escapeHtml(question.controlledPoolId ?? "—")}</div>
                <div class="wide"><strong>Source fact IDs:</strong> ${question.sourceFactIds.map(escapeHtml).join(", ")}</div>
                <div class="wide"><strong>Source IDs:</strong> ${question.sourceIds.map(escapeHtml).join(", ")}</div>
              </div>
            </div>
          </details>
          <div class="review-box">
            <div class="review-actions">
              <button type="button" class="decision" data-value="ok">✓ OK</button>
              <button type="button" class="decision" data-value="fix">⚠ Needs Fix</button>
              <button type="button" class="decision" data-value="clear">Clear</button>
            </div>
            <textarea class="review-note" rows="2" placeholder="Reviewer note: ambiguity, stem, distractor, explanation, repetition, etc."></textarea>
          </div>
        </article>`;
    }).join("");

    return `
      <section class="ql-section" id="${escapeHtml(ql.qlId)}">
        <div class="ql-heading">
          <div>
            <div class="eyebrow">${escapeHtml(ql.qlId)}</div>
            <h3>${escapeHtml(ql.title)}</h3>
            <p>${escapeHtml(ql.learnerTask)}</p>
          </div>
          <div class="ql-stats">
            <div><strong>12</strong><span>questions</span></div>
            <div><strong>${escapeHtml(ql.distractorStrategy)}</strong><span>distractors</span></div>
            <div><strong>${ql.versionScoped ? "Yes" : "No"}</strong><span>version scoped</span></div>
          </div>
        </div>
        ${cards}
      </section>`;
  }).join("");

  return `
    <section class="cp-section">
      <div class="cp-heading">
        <div class="eyebrow">${escapeHtml(cp.cpId)}</div>
        <h2>${escapeHtml(cp.title)}</h2>
      </div>
      ${qlSections}
    </section>`;
}).join("");

if (globalQuestionNumber !== 228) throw new Error(`Expected 228 frozen English questions, rendered ${globalQuestionNumber}`);

const qlRows = COM003_PERMANENT_QLS.map((ql) => `
  <tr>
    <td><a href="#${escapeHtml(ql.qlId)}">${escapeHtml(ql.qlId)}</a></td>
    <td>${escapeHtml(ql.title)}</td>
    <td>${escapeHtml(ql.cpId)}</td>
    <td>12</td>
    <td>${ql.versionScoped ? "Yes" : "No"}</td>
  </tr>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>COM-003 Question Review V1</title>
<style>
  :root { --ink:#172033; --muted:#64748b; --line:#d8dee9; --soft:#f6f8fb; --card:#fff; --accent:#2948b8; --ok:#147d45; --fix:#b45309; }
  * { box-sizing:border-box; }
  body { margin:0; font-family:Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color:var(--ink); background:#eef2f7; line-height:1.48; }
  a { color:var(--accent); text-decoration:none; }
  .page { max-width:1180px; margin:0 auto; padding:28px 20px 60px; }
  .hero { background:linear-gradient(135deg,#172554,#243b83); color:#fff; border-radius:18px; padding:30px; box-shadow:0 14px 36px rgba(15,23,42,.16); }
  .hero h1 { margin:4px 0 10px; font-size:30px; line-height:1.15; }
  .hero p { margin:6px 0; color:#dbe7ff; }
  .hero-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-top:22px; }
  .hero-stat { background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.18); border-radius:12px; padding:14px; }
  .hero-stat strong { display:block; font-size:22px; }
  .hero-stat span { font-size:12px; color:#dbe7ff; }
  .toolbar { position:sticky; top:0; z-index:20; margin:18px 0; background:rgba(255,255,255,.96); backdrop-filter:blur(8px); border:1px solid var(--line); border-radius:12px; padding:10px 12px; display:flex; flex-wrap:wrap; align-items:center; gap:8px; box-shadow:0 6px 16px rgba(15,23,42,.06); }
  .toolbar button { border:1px solid #cbd5e1; background:#fff; border-radius:8px; padding:8px 11px; cursor:pointer; }
  .toolbar .summary { margin-left:auto; display:flex; gap:10px; font-size:13px; }
  .summary span { padding:6px 9px; border-radius:8px; background:var(--soft); }
  .intro, .index { background:#fff; border:1px solid var(--line); border-radius:14px; padding:20px; margin:18px 0; }
  .intro ul { margin:10px 0 0 20px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th, td { border-bottom:1px solid #e5e7eb; padding:9px 8px; text-align:left; vertical-align:top; }
  th { background:#f8fafc; position:sticky; top:58px; }
  .cp-section { margin-top:34px; }
  .cp-heading { background:#dfe7ff; border-left:5px solid var(--accent); padding:16px 18px; border-radius:12px; }
  .cp-heading h2 { margin:2px 0 0; font-size:22px; }
  .eyebrow { font-size:11px; letter-spacing:.08em; text-transform:uppercase; font-weight:800; color:#52627a; }
  .ql-section { margin:22px 0 36px; }
  .ql-heading { display:flex; justify-content:space-between; gap:18px; background:#fff; border:1px solid var(--line); border-radius:14px; padding:18px; margin-bottom:12px; }
  .ql-heading h3 { margin:3px 0 6px; font-size:19px; }
  .ql-heading p { margin:0; color:#475569; max-width:760px; }
  .ql-stats { display:grid; grid-template-columns:repeat(3,minmax(92px,1fr)); gap:8px; min-width:330px; }
  .ql-stats div { background:var(--soft); border-radius:10px; padding:10px; }
  .ql-stats strong, .ql-stats span { display:block; }
  .ql-stats strong { font-size:12px; overflow-wrap:anywhere; }
  .ql-stats span { font-size:10px; color:var(--muted); margin-top:4px; }
  .question-card { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:18px; margin:10px 0; box-shadow:0 3px 10px rgba(15,23,42,.035); }
  .question-card.status-ok { border-left:5px solid var(--ok); }
  .question-card.status-fix { border-left:5px solid var(--fix); }
  .question-head { display:flex; justify-content:space-between; gap:8px; align-items:center; margin-bottom:12px; }
  .global-number { font-weight:800; color:#152a6a; margin-right:8px; }
  .ql-number { font-size:12px; color:var(--muted); }
  .surface-badge { background:#edf2ff; color:#3349a8; border-radius:999px; font-size:10px; font-weight:700; padding:5px 8px; }
  .stem { font-size:16px; font-weight:650; margin:7px 0 12px; }
  .options { list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:8px 14px; }
  .option { padding:9px 10px; border:1px solid #e2e8f0; border-radius:9px; background:#fbfcfe; display:flex; gap:8px; }
  .option-letter { font-weight:800; min-width:22px; }
  .answer-box { margin-top:12px; border-top:1px dashed #cbd5e1; padding-top:10px; }
  .answer-box summary { cursor:pointer; color:#1d4ed8; font-weight:700; }
  .answer-content { margin-top:10px; padding:12px; background:#f8fafc; border-radius:10px; }
  .answer-line { color:#0f5132; }
  .explanation { margin-top:7px; }
  .meta-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px 14px; margin-top:10px; padding-top:8px; border-top:1px solid #e2e8f0; font-size:11px; color:#58677c; }
  .meta-grid .wide { grid-column:1 / -1; overflow-wrap:anywhere; }
  .review-box { margin-top:13px; display:grid; grid-template-columns:auto 1fr; gap:12px; align-items:start; }
  .review-actions { display:flex; gap:6px; flex-wrap:wrap; }
  .decision { border:1px solid #cbd5e1; border-radius:8px; padding:7px 9px; background:#fff; cursor:pointer; }
  .decision.active-ok { background:#dcfce7; border-color:#86efac; color:#166534; }
  .decision.active-fix { background:#ffedd5; border-color:#fdba74; color:#9a3412; }
  .review-note { width:100%; border:1px solid #cbd5e1; border-radius:8px; padding:8px; font:inherit; font-size:12px; resize:vertical; }
  .footer { color:var(--muted); font-size:12px; text-align:center; margin-top:34px; }
  @media (max-width:800px) { .hero-grid{grid-template-columns:1fr 1fr}.ql-heading{display:block}.ql-stats{min-width:0;margin-top:12px}.options{grid-template-columns:1fr}.review-box{grid-template-columns:1fr}.toolbar .summary{width:100%;margin-left:0}.meta-grid{grid-template-columns:1fr} }
  @media print { body{background:#fff}.page{max-width:none;padding:0}.toolbar,.review-box{display:none}.question-card{break-inside:avoid;box-shadow:none}.answer-box{display:block}.answer-box > summary{display:none}.answer-box[open] .answer-content,.answer-content{display:block}.cp-section{break-before:page}.hero{box-shadow:none;background:#fff;color:#000;border:1px solid #aaa}.hero p,.hero-stat span{color:#333}.hero-stat{border-color:#aaa} }
</style>
</head>
<body>
<div class="page">
  <header class="hero">
    <div class="eyebrow" style="color:#cbd9ff">Examtree · Computer Awareness · COM-003</div>
    <h1>Office & Productivity Software — Question Review V1</h1>
    <p>Frozen English V4 review corpus. Use this file for exam-realness, stem, distractor, ambiguity, repetition, explanation and coverage review.</p>
    <p><strong>Review authority:</strong> COM-003 English Freeze V1 · Question Studio REVIEW_ONLY. This file does not authorize Question Bank/public release.</p>
    <div class="hero-grid">
      <div class="hero-stat"><strong>228</strong><span>English questions</span></div>
      <div class="hero-stat"><strong>19</strong><span>permanent QLs</span></div>
      <div class="hero-stat"><strong>4</strong><span>CP groups</span></div>
      <div class="hero-stat"><strong>12</strong><span>questions per QL</span></div>
    </div>
  </header>

  <div class="toolbar">
    <button type="button" id="expandAnswers">Expand all answers</button>
    <button type="button" id="collapseAnswers">Collapse answers</button>
    <button type="button" onclick="window.print()">Print / Save PDF</button>
    <button type="button" id="exportNotes">Export review notes</button>
    <div class="summary">
      <span>OK: <strong id="okCount">0</strong></span>
      <span>Needs Fix: <strong id="fixCount">0</strong></span>
      <span>Unreviewed: <strong id="unreviewedCount">228</strong></span>
    </div>
  </div>

  <section class="intro">
    <h2 style="margin-top:0">How to review</h2>
    <ul>
      <li>Judge whether the stem looks like a real SSC/Bank/Punjab competitive-exam question, not a textbook definition dump.</li>
      <li>Check distractors for plausibility, same-class quality, ambiguity and accidental clues.</li>
      <li>Check repetition across the 12 questions inside each QL.</li>
      <li>Open “Answer & explanation” only after judging the question; verify the answer and whether the explanation is question-specific and concise.</li>
      <li>Mark <strong>Needs Fix</strong> and type a note. Decisions/notes are saved in this browser through localStorage.</li>
    </ul>
  </section>

  <section class="index">
    <h2 style="margin-top:0">QL coverage index</h2>
    <table>
      <thead><tr><th>QL</th><th>Title</th><th>CP</th><th>Questions</th><th>Version scoped</th></tr></thead>
      <tbody>${qlRows}</tbody>
    </table>
  </section>

  ${cpSections}

  <div class="footer">Generated deterministically from COM003_ENGLISH_REVIEW_CORPUS_V4. Total rendered questions: 228.</div>
</div>
<script>
(function(){
  const PREFIX = 'examtree-com003-review-v1:';
  const cards = [...document.querySelectorAll('.question-card')];
  const okCount = document.getElementById('okCount');
  const fixCount = document.getElementById('fixCount');
  const unreviewedCount = document.getElementById('unreviewedCount');
  function read(id){ try{return JSON.parse(localStorage.getItem(PREFIX+id)||'{}')}catch{return {}} }
  function write(id,value){ localStorage.setItem(PREFIX+id,JSON.stringify(value)); }
  function paint(card,state){
    card.classList.toggle('status-ok',state.decision==='ok');
    card.classList.toggle('status-fix',state.decision==='fix');
    card.querySelectorAll('.decision').forEach(btn=>{
      btn.classList.toggle('active-ok',btn.dataset.value==='ok'&&state.decision==='ok');
      btn.classList.toggle('active-fix',btn.dataset.value==='fix'&&state.decision==='fix');
    });
    card.querySelector('.review-note').value = state.note || '';
  }
  function updateSummary(){
    let ok=0,fix=0;
    cards.forEach(card=>{const s=read(card.dataset.questionId);if(s.decision==='ok')ok++;if(s.decision==='fix')fix++;});
    okCount.textContent=String(ok); fixCount.textContent=String(fix); unreviewedCount.textContent=String(cards.length-ok-fix);
  }
  cards.forEach(card=>{
    const id=card.dataset.questionId; paint(card,read(id));
    card.querySelectorAll('.decision').forEach(btn=>btn.addEventListener('click',()=>{
      const s=read(id); s.decision=btn.dataset.value==='clear' ? undefined : btn.dataset.value; write(id,s); paint(card,s); updateSummary();
    }));
    const note=card.querySelector('.review-note'); note.addEventListener('input',()=>{const s=read(id);s.note=note.value;write(id,s);});
  });
  document.getElementById('expandAnswers').addEventListener('click',()=>document.querySelectorAll('.answer-box').forEach(d=>d.open=true));
  document.getElementById('collapseAnswers').addEventListener('click',()=>document.querySelectorAll('.answer-box').forEach(d=>d.open=false));
  document.getElementById('exportNotes').addEventListener('click',()=>{
    const rows=cards.map(card=>{const s=read(card.dataset.questionId);return {questionId:card.dataset.questionId,decision:s.decision||'unreviewed',note:s.note||''};}).filter(r=>r.decision!=='unreviewed'||r.note);
    const blob=new Blob([JSON.stringify({artifact:'COM-003-QUESTION-REVIEW-V1',exportedAt:new Date().toISOString(),reviews:rows},null,2)],{type:'application/json'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='COM-003-QUESTION-REVIEW-V1-notes.json';a.click();URL.revokeObjectURL(a.href);
  });
  updateSummary();
})();
</script>
</body>
</html>`;

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, html, "utf8");
console.log("[COM003-QUESTION-REVIEW-EXPORT-V1]", {
  output: OUTPUT_PATH,
  questionCount: globalQuestionNumber,
  qlCount: COM003_PERMANENT_QLS.length,
  cpCount: COM003_PERMANENT_CPS.length,
});
