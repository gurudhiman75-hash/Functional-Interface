import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { MEN_CP_009_FROZEN_QLS_V2, auditMenCp009CoverageV2 } from "./registry";
import { buildMenCp009V2ReviewBatch } from "./review-batch";
import type { MenCp009QuestionV2 } from "./runtime";

const audit = auditMenCp009CoverageV2();
const review = buildMenCp009V2ReviewBatch();
const outputPath = resolve(
  process.cwd(),
  "dist/quant-v4/MEN-CP-009-ENGLISH-REVIEW-V2.html",
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

function badge(value: string, className = "") {
  return `<span class="badge ${className}">${escapeHtml(value)}</span>`;
}

function renderExplanation(question: MenCp009QuestionV2): string {
  if ("keyRule" in question.explanation) {
    const steps = question.explanation.steps
      .map(
        (step, index) => `
          <li>
            <div class="step-title">Step ${index + 1}: ${escapeHtml(step.title)}</div>
            <div>${escapeHtml(step.body)}</div>
            ${step.equation ? `<div class="equation">${escapeHtml(step.equation)}</div>` : ""}
          </li>`,
      )
      .join("");
    const traps = question.explanation.traps
      .map((trap) => `<li>${escapeHtml(trap)}</li>`)
      .join("");
    return `
      <div class="explanation-grid">
        <section class="explanation-block">
          <h4>Key rule</h4>
          <p>${escapeHtml(question.explanation.keyRule)}</p>
        </section>
        <section class="explanation-block wide">
          <h4>Worked explanation</h4>
          <ol class="steps">${steps}</ol>
        </section>
        <section class="explanation-block">
          <h4>Shortcut</h4>
          <p>${escapeHtml(question.explanation.shortcut)}</p>
        </section>
        <section class="explanation-block">
          <h4>Common traps</h4>
          <ul>${traps}</ul>
        </section>
      </div>`;
  }

  return `
    <div class="explanation-grid">
      <section class="explanation-block">
        <h4>Physical picture</h4>
        <p>${escapeHtml(question.explanation.physicalPicture)}</p>
      </section>
      <section class="explanation-block">
        <h4>Governing rule</h4>
        <div class="equation">${escapeHtml(question.explanation.governingRule)}</div>
      </section>
      <section class="explanation-block wide">
        <h4>Worked explanation</h4>
        <ol class="steps">${question.explanation.steps
          .map((step) => `<li>${escapeHtml(step)}</li>`)
          .join("")}</ol>
      </section>
      <section class="explanation-block">
        <h4>Shortcut</h4>
        <p>${escapeHtml(question.explanation.shortcut)}</p>
      </section>
      <section class="explanation-block">
        <h4>Option analysis</h4>
        <ul>${question.explanation.optionAnalysis
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join("")}</ul>
      </section>
    </div>`;
}

function renderQuestion(question: MenCp009QuestionV2, index: number): string {
  const piPolicy = "piPolicy" in question ? question.piPolicy : "CANCELS_OUT";
  const optionRows = question.options
    .map(
      (option) => `
        <div class="option ${option.isCorrect ? "correct" : ""}">
          <span class="option-label">${escapeHtml(option.label)}</span>
          <span class="option-text">${escapeHtml(option.display)}</span>
          ${option.isCorrect ? '<span class="correct-chip">Correct</span>' : ""}
        </div>`,
    )
    .join("");

  const misconceptionRows = question.options
    .filter((option) => !option.isCorrect && option.misconceptionId)
    .map(
      (option) => `
        <tr>
          <td>${escapeHtml(option.label)}</td>
          <td>${escapeHtml(option.display)}</td>
          <td>${escapeHtml(option.misconceptionId)}</td>
        </tr>`,
    )
    .join("");

  const failedChecks = question.validation.checks.filter((check) => !check.passed);
  const verifyExpected = "expected" in question.verification
    ? question.verification.expected
    : question.verification.reconstructed;

  return `
    <article class="question-card"
      id="q-${index + 1}"
      data-ql="${escapeHtml(question.permanentQlId)}"
      data-family="${escapeHtml(question.familyId)}"
      data-difficulty="${escapeHtml(question.difficulty)}"
      data-target="${escapeHtml(question.target)}">
      <header class="question-header">
        <div>
          <div class="question-number">Question ${index + 1}</div>
          <h3>${escapeHtml(question.permanentQlId)} · ${escapeHtml(question.familyId)}</h3>
        </div>
        <div class="badges">
          ${badge(question.difficulty, question.difficulty === "Hard" ? "hard" : "medium")}
          ${badge(question.target)}
          ${badge(piPolicy)}
        </div>
      </header>

      <div class="metadata-line">
        <span><strong>Solve mode:</strong> ${escapeHtml(question.solveMode)}</span>
        <span><strong>Seed:</strong> ${escapeHtml(question.seed)}</span>
      </div>

      <section class="stem-block">
        <h4>Question</h4>
        <p class="stem">${escapeHtml(question.stem)}</p>
      </section>

      <div class="question-layout">
        <section>
          <h4>Options</h4>
          <div class="options">${optionRows}</div>
          <div class="answer-panel">
            <strong>Correct answer:</strong> ${escapeHtml(question.answer)}
          </div>
        </section>
        <section class="diagram-panel">
          <h4>Diagram</h4>
          <div class="diagram">${question.diagram.svg}</div>
          <div class="diagram-alt">${escapeHtml(question.diagram.alt)}</div>
        </section>
      </div>

      <section class="explanation-section">
        <h4 class="section-heading">Student explanation</h4>
        ${renderExplanation(question)}
      </section>

      <details class="editorial-audit">
        <summary>Editorial / technical audit</summary>
        <div class="audit-grid">
          <div><strong>Validation:</strong> ${question.validation.valid ? "PASS" : "FAIL"}</div>
          <div><strong>Independent verification:</strong> ${question.verification.valid ? "PASS" : "FAIL"}</div>
          <div><strong>Verifier result:</strong> ${escapeHtml(verifyExpected)}</div>
          <div><strong>Authority:</strong> ${escapeHtml(question.authority)}</div>
        </div>
        ${failedChecks.length ? `<div class="warning"><strong>Failed checks:</strong> ${failedChecks.map((check) => escapeHtml(check.name)).join(", ")}</div>` : ""}
        <h5>Distractor misconception map</h5>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Option</th><th>Displayed value</th><th>Internal misconception tag</th></tr></thead>
            <tbody>${misconceptionRows}</tbody>
          </table>
        </div>
      </details>
    </article>`;
}

const qlOptions = MEN_CP_009_FROZEN_QLS_V2.map(
  (row) => `<option value="${escapeHtml(row.qlId)}">${escapeHtml(row.qlId)} — ${escapeHtml(row.title)}</option>`,
).join("");

const familyOptions = [...new Set(review.rows.map((row) => row.familyId))]
  .sort()
  .map((family) => `<option value="${escapeHtml(family)}">${escapeHtml(family)}</option>`)
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MEN-CP-009 Spheres & Hemispheres — English Review V2</title>
<style>
:root{color-scheme:light;--bg:#f4f6f8;--card:#fff;--ink:#17202a;--muted:#65717d;--line:#dce2e8;--soft:#eef2f6;--ok:#176b3a;--okbg:#eaf7ef;--warn:#8a4b08;--accent:#284b63}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.55}
.container{width:min(1200px,94vw);margin:0 auto}.hero{background:#fff;border-bottom:1px solid var(--line);padding:34px 0 24px}.hero h1{margin:0 0 8px;font-size:clamp(26px,4vw,42px);line-height:1.12}.hero p{margin:6px 0;color:var(--muted)}
.summary-grid{display:grid;grid-template-columns:repeat(6,minmax(110px,1fr));gap:10px;margin-top:22px}.stat{background:var(--soft);border-radius:12px;padding:12px}.stat b{display:block;font-size:22px}.stat span{font-size:12px;color:var(--muted)}
.lifecycle{margin-top:16px;padding:12px 14px;border:1px solid #f0d6b5;background:#fff7ed;border-radius:10px;color:#7a4308;font-size:14px}.toolbar-wrap{position:sticky;top:0;z-index:20;background:rgba(244,246,248,.96);backdrop-filter:blur(8px);border-bottom:1px solid var(--line)}.toolbar{display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:10px;padding:12px 0}.toolbar input,.toolbar select{width:100%;border:1px solid #cbd4dc;background:#fff;border-radius:9px;padding:9px 10px;font:inherit}.toolbar label{display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:14px}
.result-line{padding:0 0 10px;color:var(--muted);font-size:13px}.ql-index{margin:24px 0;background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px}.ql-index h2{margin:0 0 12px}.ql-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px 20px}.ql-grid a{color:var(--accent);text-decoration:none;font-size:13px}.ql-grid a:hover{text-decoration:underline}
.question-card{background:var(--card);border:1px solid var(--line);border-radius:16px;margin:20px 0;padding:22px;box-shadow:0 2px 10px rgba(24,35,45,.04)}.question-header{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;border-bottom:1px solid var(--line);padding-bottom:12px}.question-number{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}.question-header h3{margin:3px 0 0;font-size:18px}.badges{display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}.badge{display:inline-block;border:1px solid #cbd5df;background:#f8fafc;border-radius:999px;padding:3px 8px;font-size:11px}.badge.hard{background:#fff0f0;border-color:#f0c8c8}.badge.medium{background:#fff8df;border-color:#eadba5}.metadata-line{display:flex;flex-wrap:wrap;gap:8px 22px;color:var(--muted);font-size:12px;margin:11px 0 17px}.stem-block{background:#f8fafc;border-radius:12px;padding:15px 17px}.stem-block h4,.question-card h4{margin:0 0 8px}.stem{font-size:18px;font-weight:600;margin:0}.question-layout{display:grid;grid-template-columns:1.1fr .9fr;gap:22px;margin-top:20px}.options{display:grid;gap:9px}.option{display:grid;grid-template-columns:32px 1fr auto;align-items:center;gap:9px;padding:10px 12px;border:1px solid var(--line);border-radius:10px}.option.correct{border-color:#91c9a6;background:var(--okbg)}.option-label{display:grid;place-items:center;width:27px;height:27px;border-radius:50%;background:#edf1f4;font-weight:700}.correct-chip{font-size:11px;color:var(--ok);font-weight:700}.answer-panel{margin-top:12px;padding:11px 13px;background:var(--okbg);border-left:4px solid var(--ok);border-radius:7px}.diagram-panel{min-width:0}.diagram{width:100%;max-width:520px;margin:auto}.diagram svg{max-width:100%;height:auto}.diagram-alt{text-align:center;color:var(--muted);font-size:11px;margin-top:5px}
.explanation-section{margin-top:22px}.section-heading{border-bottom:1px solid var(--line);padding-bottom:7px}.explanation-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.explanation-block{background:#fafbfc;border:1px solid #e8edf1;border-radius:10px;padding:12px 14px}.explanation-block.wide{grid-column:1/-1}.explanation-block p,.explanation-block ul,.explanation-block ol{margin:5px 0}.steps{padding-left:22px}.steps li{margin:8px 0}.step-title{font-weight:700}.equation{font-family:"SFMono-Regular",Consolas,monospace;overflow-wrap:anywhere;background:#f1f4f6;border-radius:6px;padding:7px 9px;margin-top:6px}.editorial-audit{margin-top:16px;border-top:1px dashed #bdc7cf;padding-top:12px}.editorial-audit summary{cursor:pointer;font-weight:700;color:#43515e}.audit-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:6px 20px;margin:12px 0;font-size:13px}.warning{padding:8px;background:#fff1f1;border-radius:7px}.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse;font-size:12px}th,td{text-align:left;border:1px solid var(--line);padding:7px}th{background:#f2f5f7}.hidden{display:none!important}body.hide-answers .option.correct{border-color:var(--line);background:#fff}body.hide-answers .correct-chip,body.hide-answers .answer-panel{display:none}.footer{padding:35px 0 50px;color:var(--muted);font-size:13px}
@media(max-width:900px){.summary-grid{grid-template-columns:repeat(3,1fr)}.toolbar{grid-template-columns:1fr 1fr}.toolbar .search{grid-column:1/-1}.question-layout{grid-template-columns:1fr}.explanation-grid{grid-template-columns:1fr}.explanation-block.wide{grid-column:auto}.ql-grid{grid-template-columns:1fr}}
@media(max-width:560px){.summary-grid{grid-template-columns:repeat(2,1fr)}.toolbar{grid-template-columns:1fr}.toolbar .search{grid-column:auto}.question-card{padding:15px}.question-header{display:block}.badges{justify-content:flex-start;margin-top:10px}.stem{font-size:16px}.audit-grid{grid-template-columns:1fr}}
@media print{.toolbar-wrap,.ql-index{display:none}.question-card{break-inside:avoid;box-shadow:none}.editorial-audit{display:none}body{background:#fff}.container{width:100%}}
</style>
</head>
<body>
<header class="hero">
  <div class="container">
    <div class="question-number">ExamTree · MEN-002 · MEN-CP-009</div>
    <h1>Spheres & Hemispheres — English Review V2</h1>
    <p>Human-readable exam-readiness review of the final frozen English implementation.</p>
    <p>Every card below is generated from the same deterministic runtime used by the CP-009 proof suite.</p>
    <div class="summary-grid">
      <div class="stat"><b>${audit.permanentQlCount}</b><span>Permanent QLs</span></div>
      <div class="stat"><b>${review.rows.length}</b><span>Review questions</span></div>
      <div class="stat"><b>${review.uniqueStems}</b><span>Unique stems</span></div>
      <div class="stat"><b>${audit.permanentQlCount * 80}</b><span>Proof packages</span></div>
      <div class="stat"><b>A${review.answerPositions.A} B${review.answerPositions.B} C${review.answerPositions.C} D${review.answerPositions.D}</b><span>Answer balance</span></div>
      <div class="stat"><b>${audit.unresolvedExplicitSolveModeCount}</b><span>Unresolved solve modes</span></div>
    </div>
    <div class="lifecycle"><strong>Lifecycle:</strong> English implementation frozen for review. Question Studio, Question Bank, mock-test eligibility and public publication remain locked. This file does not assert human approval.</div>
  </div>
</header>

<div class="toolbar-wrap">
  <div class="container">
    <div class="toolbar">
      <input class="search" id="search" type="search" placeholder="Search stem, QL, family, solve mode…" aria-label="Search questions" />
      <select id="qlFilter"><option value="">All QLs</option>${qlOptions}</select>
      <select id="familyFilter"><option value="">All families</option>${familyOptions}</select>
      <select id="difficultyFilter"><option value="">All difficulty</option><option>Medium</option><option>Hard</option></select>
      <label><input id="answerToggle" type="checkbox" checked /> Show answers</label>
    </div>
    <div class="result-line"><span id="visibleCount">${review.rows.length}</span> of ${review.rows.length} questions shown</div>
  </div>
</div>

<main class="container">
  <section class="ql-index">
    <h2>QL index</h2>
    <div class="ql-grid">
      ${MEN_CP_009_FROZEN_QLS_V2.map((row, index) => `<a href="#q-${index * 4 + 1}">${escapeHtml(row.qlId)} — ${escapeHtml(row.title)} (4)</a>`).join("")}
    </div>
  </section>
  <div id="questions">
    ${review.rows.map(renderQuestion).join("\n")}
  </div>
</main>

<footer class="footer"><div class="container">MEN-CP009-COVERAGE-CLOSURE-V2 · ${escapeHtml(audit.firstQlId)}..${escapeHtml(audit.lastQlId)} · generated review surface</div></footer>
<script>
(function(){
  const cards = Array.from(document.querySelectorAll('.question-card'));
  const search = document.getElementById('search');
  const ql = document.getElementById('qlFilter');
  const family = document.getElementById('familyFilter');
  const difficulty = document.getElementById('difficultyFilter');
  const answerToggle = document.getElementById('answerToggle');
  const visibleCount = document.getElementById('visibleCount');
  function apply(){
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const card of cards){
      const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
      const matchesQl = !ql.value || card.dataset.ql === ql.value;
      const matchesFamily = !family.value || card.dataset.family === family.value;
      const matchesDifficulty = !difficulty.value || card.dataset.difficulty === difficulty.value;
      const show = matchesSearch && matchesQl && matchesFamily && matchesDifficulty;
      card.classList.toggle('hidden', !show);
      if(show) visible += 1;
    }
    visibleCount.textContent = String(visible);
  }
  for (const control of [search, ql, family, difficulty]){
    control.addEventListener(control === search ? 'input' : 'change', apply);
  }
  answerToggle.addEventListener('change', function(){
    document.body.classList.toggle('hide-answers', !answerToggle.checked);
  });
})();
</script>
</body>
</html>\n`;

writeFileSync(outputPath, html, "utf8");

console.log(
  JSON.stringify(
    {
      outputPath,
      authority: "MEN-CP009-COVERAGE-CLOSURE-V2",
      permanentQlCount: audit.permanentQlCount,
      reviewRecordCount: review.rows.length,
      uniqueStems: review.uniqueStems,
      answerPositions: review.answerPositions,
      unresolvedExplicitSolveModes: audit.unresolvedExplicitSolveModeCount,
    },
    null,
    2,
  ),
);
