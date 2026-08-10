import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { buildMenCp009V3StudentReviewBatch } from "./student-review-batch-v3";
import {
  MEN_CP_009_STUDENT_VIEW_AUTHORITY,
  buildMenCp009StudentView,
} from "./student-view-v3";

const review = buildMenCp009V3StudentReviewBatch();
const rows = review.rows.map(buildMenCp009StudentView);
const outputPath = resolve(
  process.cwd(),
  "dist/quant-v4/MEN-CP-009-ENGLISH-REVIEW-V3.html",
);
mkdirSync(dirname(outputPath), { recursive: true });

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderQuestion(row: (typeof rows)[number], index: number): string {
  const options = row.options
    .map(
      (option) => `<div class="option ${option.isCorrect ? "correct" : ""}">
        <span class="label">${escapeHtml(option.label)}</span>
        <span>${escapeHtml(option.display)}</span>
        ${option.isCorrect ? '<span class="correct-mark">Correct</span>' : ""}
      </div>`,
    )
    .join("");

  const explanation = row.explanationLines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");

  return `<article class="question-card" data-ql="${escapeHtml(row.permanentQlId)}" data-family="${escapeHtml(row.familyId)}" data-difficulty="${escapeHtml(row.difficulty)}" data-text="${escapeHtml(`${row.stem} ${row.permanentQlId} ${row.familyId}`.toLowerCase())}">
    <header>
      <div>
        <div class="question-number">Question ${index + 1}</div>
        <div class="ql">${escapeHtml(row.permanentQlId)}</div>
      </div>
      <div class="badges"><span>${escapeHtml(row.difficulty)}</span><span>${escapeHtml(row.target)}</span></div>
    </header>
    <section class="stem">${escapeHtml(row.stem)}</section>
    <section class="options">${options}</section>
    <section class="answer"><strong>Answer:</strong> ${escapeHtml(row.answer)}</section>
    <section class="solution">
      <h3>Solution</h3>
      ${explanation}
    </section>
    <details>
      <summary>Reviewer metadata</summary>
      <div class="meta-grid">
        <span><strong>Family:</strong> ${escapeHtml(row.familyId)}</span>
        <span><strong>Solve mode:</strong> ${escapeHtml(row.solveMode)}</span>
        <span><strong>Seed:</strong> ${escapeHtml(row.seed)}</span>
        <span><strong>Math verification:</strong> ${row.sourceVerificationPassed ? "PASS" : "FAIL"}</span>
        <span><strong>Runtime validation:</strong> ${row.sourceValidationPassed ? "PASS" : "FAIL"}</span>
        <span><strong>Diagram:</strong> omitted — not useful for this direct CP-009 item</span>
      </div>
    </details>
  </article>`;
}

const qlOptions = [...new Set(rows.map((row) => row.permanentQlId))]
  .map((ql) => `<option value="${escapeHtml(ql)}">${escapeHtml(ql)}</option>`)
  .join("");
const familyOptions = [...new Set(rows.map((row) => row.familyId))]
  .sort()
  .map((family) => `<option value="${escapeHtml(family)}">${escapeHtml(family)}</option>`)
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MEN-CP-009 Spheres & Hemispheres — Learner Review V3</title>
<style>
:root{--bg:#f5f6f8;--card:#fff;--ink:#17202a;--muted:#68737d;--line:#dfe4e8;--soft:#f8fafb;--ok:#166534;--okbg:#edf8f0}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5}.wrap{width:min(980px,94vw);margin:auto}.hero{background:#fff;border-bottom:1px solid var(--line);padding:28px 0}.hero h1{margin:0 0 8px;font-size:clamp(25px,4vw,38px)}.hero p{margin:5px 0;color:var(--muted)}.standards{margin-top:16px;padding:13px 15px;border-radius:10px;background:#f0f7ff;border:1px solid #d5e7f8}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:18px}.stat{background:var(--soft);border-radius:10px;padding:11px}.stat b{display:block;font-size:21px}.stat span{font-size:12px;color:var(--muted)}.toolbar-shell{position:sticky;top:0;z-index:10;background:rgba(245,246,248,.97);border-bottom:1px solid var(--line)}.toolbar{display:grid;grid-template-columns:2fr 1fr 1fr auto;gap:8px;padding:10px 0}.toolbar input,.toolbar select{min-width:0;border:1px solid #cbd3da;border-radius:8px;background:#fff;padding:9px;font:inherit}.toolbar label{display:flex;align-items:center;gap:6px;font-size:13px}.result{padding-bottom:9px;color:var(--muted);font-size:12px}.question-card{background:var(--card);border:1px solid var(--line);border-radius:14px;margin:18px 0;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,.035)}.question-card header{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line);padding-bottom:10px}.question-number{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.ql{font-weight:700;margin-top:2px}.badges{display:flex;gap:5px;flex-wrap:wrap}.badges span{font-size:11px;border:1px solid #d5dce2;border-radius:999px;padding:3px 7px;background:#fafbfc}.stem{font-size:18px;font-weight:600;padding:17px 0 13px}.options{display:grid;gap:8px}.option{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:8px;border:1px solid var(--line);border-radius:9px;padding:9px 11px}.label{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:#eef1f4;font-weight:700}.option.correct{background:var(--okbg);border-color:#a8d7b4}.correct-mark{font-size:11px;color:var(--ok);font-weight:700}.answer{margin-top:11px;padding:10px 12px;border-left:4px solid var(--ok);background:var(--okbg);border-radius:6px}.solution{margin-top:17px;padding-top:14px;border-top:1px solid var(--line)}.solution h3{font-size:15px;margin:0 0 7px}.solution p{margin:4px 0;font-size:15px}.question-card details{margin-top:15px;padding-top:10px;border-top:1px dashed #cbd3da;color:#46515b}.question-card summary{cursor:pointer;font-size:13px;font-weight:700}.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 18px;margin-top:9px;font-size:12px}.hidden{display:none!important}body.hide-answers .option.correct{background:#fff;border-color:var(--line)}body.hide-answers .correct-mark,body.hide-answers .answer{display:none}.footer{padding:26px 0 45px;color:var(--muted);font-size:12px}@media(max-width:720px){.stats{grid-template-columns:1fr 1fr}.toolbar{grid-template-columns:1fr 1fr}.toolbar .search{grid-column:1/-1}.meta-grid{grid-template-columns:1fr}.stem{font-size:17px}}@media(max-width:460px){.toolbar{grid-template-columns:1fr}.toolbar .search{grid-column:auto}.question-card{padding:15px}.option{grid-template-columns:28px 1fr}.correct-mark{grid-column:2}.stats{grid-template-columns:1fr 1fr}}
</style>
</head>
<body>
<section class="hero"><div class="wrap">
  <h1>MEN-CP-009 — Spheres & Hemispheres</h1>
  <p><strong>Learner Review V3</strong> · authority ${escapeHtml(MEN_CP_009_STUDENT_VIEW_AUTHORITY)}</p>
  <p>This review keeps the verified mathematics and options, but removes generator-style wording, generic answer-selection trailers, raw LaTeX, unnecessary diagrams, and explanation clutter.</p>
  <div class="standards"><strong>Presentation rule:</strong> natural MCQ stem → four options → short solution. The stem ends when the mathematical question has been asked; no “choose the correct option” or “calculate carefully” filler is appended.</div>
  <div class="stats">
    <div class="stat"><b>${rows.length}</b><span>review questions</span></div>
    <div class="stat"><b>${new Set(rows.map((row) => row.permanentQlId)).size}</b><span>permanent QLs</span></div>
    <div class="stat"><b>0</b><span>generic stem trailers</span></div>
    <div class="stat"><b>0</b><span>generic diagrams shown</span></div>
  </div>
</div></section>
<div class="toolbar-shell"><div class="wrap">
  <div class="toolbar">
    <input class="search" id="search" placeholder="Search question, QL or family" />
    <select id="ql"><option value="">All QLs</option>${qlOptions}</select>
    <select id="family"><option value="">All families</option>${familyOptions}</select>
    <label><input id="hideAnswers" type="checkbox" /> Hide answers</label>
  </div>
  <div class="result" id="result"></div>
</div></div>
<main class="wrap" id="questions">${rows.map(renderQuestion).join("\n")}</main>
<footer class="footer"><div class="wrap">Engineering/product locks are unchanged. This V3 artefact is for learner-facing English review and does not assert human approval or product activation.</div></footer>
<script>
const cards=[...document.querySelectorAll('.question-card')];
const search=document.getElementById('search');const ql=document.getElementById('ql');const family=document.getElementById('family');const result=document.getElementById('result');const hideAnswers=document.getElementById('hideAnswers');
function apply(){const s=search.value.trim().toLowerCase();let visible=0;for(const card of cards){const ok=(!s||card.dataset.text.includes(s))&&(!ql.value||card.dataset.ql===ql.value)&&(!family.value||card.dataset.family===family.value);card.classList.toggle('hidden',!ok);if(ok)visible++;}result.textContent=visible+' of '+cards.length+' questions shown';}
search.addEventListener('input',apply);ql.addEventListener('change',apply);family.addEventListener('change',apply);hideAnswers.addEventListener('change',()=>document.body.classList.toggle('hide-answers',hideAnswers.checked));apply();
</script>
</body>
</html>`;

writeFileSync(outputPath, html, "utf8");
console.log(`Wrote ${rows.length} learner-facing CP-009 review questions to ${outputPath}`);
