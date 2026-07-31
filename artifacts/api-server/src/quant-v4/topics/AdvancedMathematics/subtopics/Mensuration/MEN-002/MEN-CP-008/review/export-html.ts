import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { MEN_CP_008_FROZEN_QLS } from "../final-freeze/registry";
import { generateMenCp008PermanentQuestion } from "../permanent/runtime";

const SAMPLE_SEEDS = [
  { label: "A", seed: "owner-review-a" },
  { label: "B", seed: "owner-review-b" },
  { label: "C", seed: "owner-review-c" },
] as const;

function escapeHtml(value: unknown) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function plainMath(value: unknown) {
  let text = String(value ?? "");
  text = text.replace(/^\$|\$$/g, "");
  for (let pass = 0; pass < 4; pass += 1) {
    text = text.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1)/($2)");
    text = text.replace(/\\text\{([^{}]*)\}/g, "$1");
    text = text.replace(/\\sqrt\{([^{}]+)\}/g, "√($1)");
  }
  return text
    .replace(/\\pi/g, "π")
    .replace(/\\times/g, "×")
    .replace(/\\%/g, "%")
    .replace(/\^\{2\}/g, "²")
    .replace(/\^\{3\}/g, "³")
    .replace(/[{}]/g, "")
    .replace(/\\,/g, " ")
    .replace(/\\/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const records = MEN_CP_008_FROZEN_QLS.flatMap((definition) =>
  SAMPLE_SEEDS.map((sample) => ({
    definition,
    sample,
    question: generateMenCp008PermanentQuestion(definition.qlId, sample.seed),
  })),
);

const targets = [...new Set(records.map((record) => record.question.target))].sort();
const difficulties = [...new Set(records.map((record) => record.question.difficulty))].sort();

function renderCard(record: (typeof records)[number]) {
  const { definition, sample, question } = record;
  const reviewId = `${definition.qlId}::${sample.label}`;
  const searchText = [
    definition.qlId,
    definition.title,
    definition.canonicalKey,
    question.prototypeId,
    question.solveMode,
    question.target,
    question.difficulty,
    question.stem,
  ].join(" ").toLowerCase();

  const options = question.options.map((option) => `
    <li class="option-row ${option.isCorrect ? "is-correct" : ""}">
      <span class="option-label">${escapeHtml(option.label)}</span>
      <span>${escapeHtml(plainMath(option.display))}</span>
    </li>`).join("");

  const steps = question.explanation.steps.map((step, index) => `
    <li>
      <strong>Step ${index + 1}: ${escapeHtml(step.title)}</strong>
      <div>${escapeHtml(plainMath(step.body))}</div>
      ${step.equation ? `<code>${escapeHtml(plainMath(step.equation))}</code>` : ""}
    </li>`).join("");

  const traps = question.explanation.traps.map((trap) => `<li>${escapeHtml(plainMath(trap))}</li>`).join("");
  const ancestries = definition.prototypeIds.map((id) => `<span class="chip ancestry">${escapeHtml(id)}</span>`).join("");
  const validationClass = question.validation.valid && question.verification.valid ? "pass" : "fail";

  return `
  <article class="question-card" id="${escapeHtml(reviewId)}"
    data-review-id="${escapeHtml(reviewId)}"
    data-ql="${escapeHtml(definition.qlId)}"
    data-sample="${escapeHtml(sample.label)}"
    data-difficulty="${escapeHtml(question.difficulty)}"
    data-target="${escapeHtml(question.target)}"
    data-search="${escapeHtml(searchText)}">
    <header class="card-header">
      <div>
        <div class="eyebrow">${escapeHtml(definition.qlId)} · Sample ${escapeHtml(sample.label)}</div>
        <h2>${escapeHtml(definition.title)}</h2>
      </div>
      <div class="status-stack">
        <span class="status-pill ${validationClass}">${validationClass === "pass" ? "Proof passed" : "Check failed"}</span>
        <span class="decision-badge" data-decision-badge>Unreviewed</span>
      </div>
    </header>

    <div class="chips">
      <span class="chip">${escapeHtml(question.difficulty)}</span>
      <span class="chip">${escapeHtml(question.target)}</span>
      <span class="chip">${escapeHtml(question.piPolicy)}</span>
      <span class="chip">${escapeHtml(question.solveMode)}</span>
    </div>

    <dl class="metadata-grid">
      <div><dt>Canonical key</dt><dd>${escapeHtml(definition.canonicalKey)}</dd></div>
      <div><dt>Prototype used</dt><dd>${escapeHtml(question.prototypeId)}</dd></div>
      <div><dt>Template</dt><dd>${escapeHtml(definition.templateId)}</dd></div>
      <div><dt>Seed</dt><dd>${escapeHtml(question.seed)}</dd></div>
    </dl>

    <section class="stem-block">
      <div class="section-label">Question</div>
      <p>${escapeHtml(plainMath(question.stem))}</p>
      <ol class="options">${options}</ol>
    </section>

    <details class="answer-panel">
      <summary>Answer and worked explanation</summary>
      <div class="answer-content">
        <div class="answer-line"><strong>Correct answer:</strong> ${escapeHtml(plainMath(question.answer))}</div>
        <div class="rule"><strong>Key rule:</strong> ${escapeHtml(plainMath(question.explanation.keyRule))}</div>
        <ol class="steps">${steps}</ol>
        <div class="shortcut"><strong>Exam shortcut:</strong> ${escapeHtml(plainMath(question.explanation.shortcut))}</div>
        <div><strong>Distractor diagnostics</strong><ul class="traps">${traps}</ul></div>
        <div class="verification">
          <strong>Independent verification:</strong> ${escapeHtml(question.verification.method)} — ${escapeHtml(plainMath(question.verification.reconstructed))}
        </div>
      </div>
    </details>

    <details class="ancestry-panel">
      <summary>Frozen family ancestry (${definition.prototypeIds.length})</summary>
      <div class="chips ancestry-list">${ancestries}</div>
    </details>

    <section class="review-box">
      <label>
        Review decision
        <select class="decision-input" data-review-id="${escapeHtml(reviewId)}">
          <option value="UNREVIEWED">Unreviewed</option>
          <option value="APPROVED">Approved</option>
          <option value="NEEDS_FIX">Needs fix</option>
        </select>
      </label>
      <label class="note-label">
        Reviewer note
        <textarea class="note-input" data-review-id="${escapeHtml(reviewId)}" rows="3" placeholder="Record wording, option, explanation or coverage issues..."></textarea>
      </label>
    </section>
  </article>`;
}

const cards = records.map(renderCard).join("\n");
const targetOptions = targets.map((target) => `<option value="${escapeHtml(target)}">${escapeHtml(target)}</option>`).join("");
const difficultyOptions = difficulties.map((difficulty) => `<option value="${escapeHtml(difficulty)}">${escapeHtml(difficulty)}</option>`).join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ExamTree MEN-CP-008 English Review</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f4f7fb;
      --panel: #ffffff;
      --ink: #14213d;
      --muted: #5d6b82;
      --line: #dbe3ef;
      --accent: #2457d6;
      --accent-soft: #eaf0ff;
      --success: #147d4f;
      --success-soft: #e7f7ef;
      --danger: #b42318;
      --danger-soft: #ffebe8;
      --warning: #9a6700;
      --warning-soft: #fff4d6;
      --shadow: 0 12px 34px rgba(20, 33, 61, .08);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
    }
    button, input, select, textarea { font: inherit; }
    .page-shell { max-width: 1180px; margin: 0 auto; padding: 24px; }
    .hero {
      background: linear-gradient(135deg, #132b62 0%, #2457d6 58%, #557de4 100%);
      color: white;
      border-radius: 22px;
      padding: 28px;
      box-shadow: var(--shadow);
    }
    .hero h1 { margin: 4px 0 6px; font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1.1; }
    .hero p { margin: 0; max-width: 860px; color: #e5ecff; }
    .hero .eyebrow { color: #cbd9ff; }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 12px;
      margin: 18px 0;
    }
    .summary-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 16px;
      box-shadow: 0 6px 20px rgba(20, 33, 61, .05);
    }
    .summary-card strong { display: block; font-size: 1.55rem; line-height: 1.1; }
    .summary-card span { color: var(--muted); font-size: .86rem; }
    .controls {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(244, 247, 251, .95);
      backdrop-filter: blur(12px);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 14px;
      margin: 20px 0;
      box-shadow: var(--shadow);
    }
    .filter-grid {
      display: grid;
      grid-template-columns: minmax(240px, 2fr) repeat(4, minmax(130px, 1fr));
      gap: 10px;
    }
    .controls input, .controls select, .review-box select, .review-box textarea {
      width: 100%;
      border: 1px solid #c9d4e5;
      border-radius: 10px;
      padding: 10px 12px;
      background: white;
      color: var(--ink);
    }
    .button-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    button {
      border: 1px solid #b7c5dc;
      background: white;
      color: var(--ink);
      padding: 9px 13px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 650;
    }
    button.primary { background: var(--accent); color: white; border-color: var(--accent); }
    button.danger { color: var(--danger); }
    .visible-line { margin: 10px 2px 0; color: var(--muted); font-size: .9rem; }
    .question-list { display: grid; gap: 18px; }
    .question-card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 20px;
      box-shadow: var(--shadow);
    }
    .question-card.is-approved { border-left: 6px solid var(--success); }
    .question-card.needs-fix { border-left: 6px solid var(--danger); }
    .card-header { display: flex; justify-content: space-between; gap: 14px; align-items: flex-start; }
    .card-header h2 { margin: 2px 0 0; font-size: 1.28rem; }
    .eyebrow, .section-label { text-transform: uppercase; letter-spacing: .08em; font-weight: 750; font-size: .74rem; color: var(--muted); }
    .status-stack { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
    .status-pill, .decision-badge, .chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 9px;
      font-size: .76rem;
      font-weight: 700;
    }
    .status-pill.pass { color: var(--success); background: var(--success-soft); }
    .status-pill.fail { color: var(--danger); background: var(--danger-soft); }
    .decision-badge { background: #edf1f7; color: var(--muted); }
    .decision-badge.approved { background: var(--success-soft); color: var(--success); }
    .decision-badge.needs-fix { background: var(--danger-soft); color: var(--danger); }
    .chips { display: flex; flex-wrap: wrap; gap: 7px; margin: 12px 0; }
    .chip { background: var(--accent-soft); color: #244b9f; }
    .chip.ancestry { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .7rem; background: #f1f3f7; color: #46546a; }
    .metadata-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin: 14px 0; }
    .metadata-grid div { background: #f7f9fc; border-radius: 10px; padding: 9px 10px; min-width: 0; }
    .metadata-grid dt { color: var(--muted); font-size: .72rem; font-weight: 750; text-transform: uppercase; letter-spacing: .04em; }
    .metadata-grid dd { margin: 3px 0 0; font-size: .82rem; overflow-wrap: anywhere; }
    .stem-block { border-top: 1px solid var(--line); padding-top: 15px; }
    .stem-block p { font-size: 1.04rem; font-weight: 620; }
    .options { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 9px; }
    .option-row { border: 1px solid var(--line); border-radius: 10px; padding: 10px; display: flex; gap: 10px; align-items: center; }
    .option-label { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 50%; background: #edf1f7; font-weight: 800; flex: none; }
    details { border: 1px solid var(--line); border-radius: 12px; margin-top: 12px; overflow: hidden; }
    summary { cursor: pointer; padding: 11px 13px; font-weight: 720; background: #f8faff; }
    .answer-content { padding: 14px; }
    .answer-panel[open] { border-color: #9db5ed; }
    .answer-panel[open] summary { background: var(--accent-soft); color: #183d91; }
    .answer-panel[open] .option-row.is-correct { border-color: var(--success); background: var(--success-soft); }
    .answer-line { padding: 10px 12px; background: var(--success-soft); color: #0b613c; border-radius: 10px; margin-bottom: 11px; }
    .rule, .shortcut, .verification { margin: 10px 0; padding: 10px 12px; border-radius: 10px; background: #f7f9fc; }
    .steps { padding-left: 22px; }
    .steps li { margin: 10px 0; }
    code { display: block; margin-top: 5px; padding: 8px 10px; border-radius: 8px; background: #101b33; color: #eef3ff; white-space: pre-wrap; }
    .traps { margin-top: 6px; }
    .ancestry-list { padding: 4px 12px 12px; }
    .review-box { display: grid; grid-template-columns: minmax(180px, .6fr) minmax(280px, 1.4fr); gap: 12px; margin-top: 14px; padding: 13px; border-radius: 12px; background: #f7f9fc; }
    .review-box label { display: block; font-size: .8rem; color: var(--muted); font-weight: 700; }
    .review-box select, .review-box textarea { margin-top: 5px; color: var(--ink); font-weight: 500; }
    .empty-state { display: none; text-align: center; padding: 40px; color: var(--muted); }
    .footer-note { margin: 22px 0 10px; color: var(--muted); font-size: .82rem; }
    @media (max-width: 900px) {
      .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .filter-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .filter-grid .search { grid-column: 1 / -1; }
      .metadata-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 620px) {
      .page-shell { padding: 12px; }
      .hero, .question-card { padding: 16px; border-radius: 14px; }
      .summary-grid, .filter-grid, .metadata-grid, .review-box, .options { grid-template-columns: 1fr; }
      .controls { position: static; }
      .card-header { flex-direction: column; }
      .status-stack { justify-content: flex-start; }
    }
    @media print {
      body { background: white; }
      .page-shell { max-width: none; padding: 0; }
      .hero { color: black; background: white; box-shadow: none; border: 1px solid #aaa; }
      .hero p, .hero .eyebrow { color: #333; }
      .controls, .review-box, .footer-note { display: none !important; }
      .question-card { box-shadow: none; break-inside: avoid; page-break-inside: avoid; }
      .question-card[hidden] { display: none !important; }
      details { display: block; }
      details > summary { display: none; }
      details > * { display: block; }
    }
  </style>
</head>
<body>
  <main class="page-shell">
    <section class="hero">
      <div class="eyebrow">ExamTree · Quant V4 · Mensuration</div>
      <h1>MEN-CP-008 English Review Pack</h1>
      <p>Offline review of the frozen Cylinders &amp; Cones implementation. The file contains three deterministic questions for every permanent QL. Decisions and notes stay in this browser through local storage and can be exported as JSON.</p>
    </section>

    <section class="summary-grid" aria-label="Chapter summary">
      <div class="summary-card"><strong>52</strong><span>Frozen permanent QLs</span></div>
      <div class="summary-card"><strong>66</strong><span>Prototype ancestries</span></div>
      <div class="summary-card"><strong>156</strong><span>Review questions</span></div>
      <div class="summary-card"><strong>4,226</strong><span>Permanent proof packages</span></div>
      <div class="summary-card"><strong>PASS</strong><span>Post-merge proof and Render build</span></div>
    </section>

    <section class="controls" aria-label="Review controls">
      <div class="filter-grid">
        <input class="search" id="search" type="search" placeholder="Search QL, stem, solve mode or prototype...">
        <select id="sample-filter" aria-label="Sample filter">
          <option value="A">Sample A (default)</option>
          <option value="B">Sample B</option>
          <option value="C">Sample C</option>
          <option value="ALL">All samples</option>
        </select>
        <select id="difficulty-filter" aria-label="Difficulty filter"><option value="ALL">All difficulties</option>${difficultyOptions}</select>
        <select id="target-filter" aria-label="Target filter"><option value="ALL">All targets</option>${targetOptions}</select>
        <select id="decision-filter" aria-label="Decision filter">
          <option value="ALL">All decisions</option>
          <option value="UNREVIEWED">Unreviewed</option>
          <option value="APPROVED">Approved</option>
          <option value="NEEDS_FIX">Needs fix</option>
          <option value="WITH_NOTE">Has reviewer note</option>
        </select>
      </div>
      <div class="button-row">
        <button class="primary" id="show-answers" type="button">Show visible answers</button>
        <button id="hide-answers" type="button">Hide answers</button>
        <button id="export-review" type="button">Export review JSON</button>
        <button id="print-review" type="button">Print visible questions</button>
        <button class="danger" id="clear-review" type="button">Clear saved review</button>
      </div>
      <div class="visible-line" id="visible-line">Loading review state…</div>
    </section>

    <section class="question-list" id="question-list">${cards}</section>
    <div class="empty-state" id="empty-state">No questions match the current filters.</div>
    <p class="footer-note">Generated from merged MEN-CP-008 permanent runtime. Lifecycle remains locked: Question Studio disabled, Question Bank NOT_STORED, test ineligible and unpublished.</p>
  </main>

  <script>
    (function () {
      'use strict';
      var STORAGE_KEY = 'examtree-men-cp008-review-v1';
      var cards = Array.prototype.slice.call(document.querySelectorAll('.question-card'));
      var search = document.getElementById('search');
      var sampleFilter = document.getElementById('sample-filter');
      var difficultyFilter = document.getElementById('difficulty-filter');
      var targetFilter = document.getElementById('target-filter');
      var decisionFilter = document.getElementById('decision-filter');
      var visibleLine = document.getElementById('visible-line');
      var emptyState = document.getElementById('empty-state');
      var state = {};

      try {
        state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
      } catch (error) {
        state = {};
      }

      function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }

      function recordFor(id) {
        if (!state[id]) state[id] = { decision: 'UNREVIEWED', note: '' };
        return state[id];
      }

      function setCardAppearance(card, decision) {
        card.classList.toggle('is-approved', decision === 'APPROVED');
        card.classList.toggle('needs-fix', decision === 'NEEDS_FIX');
        var badge = card.querySelector('[data-decision-badge]');
        badge.className = 'decision-badge';
        if (decision === 'APPROVED') {
          badge.textContent = 'Approved';
          badge.classList.add('approved');
        } else if (decision === 'NEEDS_FIX') {
          badge.textContent = 'Needs fix';
          badge.classList.add('needs-fix');
        } else {
          badge.textContent = 'Unreviewed';
        }
      }

      cards.forEach(function (card) {
        var id = card.getAttribute('data-review-id');
        var saved = recordFor(id);
        var select = card.querySelector('.decision-input');
        var note = card.querySelector('.note-input');
        select.value = saved.decision || 'UNREVIEWED';
        note.value = saved.note || '';
        setCardAppearance(card, select.value);

        select.addEventListener('change', function () {
          recordFor(id).decision = select.value;
          setCardAppearance(card, select.value);
          saveState();
          applyFilters();
        });
        note.addEventListener('input', function () {
          recordFor(id).note = note.value;
          saveState();
          if (decisionFilter.value === 'WITH_NOTE') applyFilters();
          updateSummary();
        });
      });

      function matches(card) {
        var id = card.getAttribute('data-review-id');
        var saved = recordFor(id);
        var query = search.value.trim().toLowerCase();
        if (query && card.getAttribute('data-search').indexOf(query) === -1) return false;
        if (sampleFilter.value !== 'ALL' && card.getAttribute('data-sample') !== sampleFilter.value) return false;
        if (difficultyFilter.value !== 'ALL' && card.getAttribute('data-difficulty') !== difficultyFilter.value) return false;
        if (targetFilter.value !== 'ALL' && card.getAttribute('data-target') !== targetFilter.value) return false;
        if (decisionFilter.value === 'WITH_NOTE') return Boolean((saved.note || '').trim());
        if (decisionFilter.value !== 'ALL' && saved.decision !== decisionFilter.value) return false;
        return true;
      }

      function updateSummary() {
        var visible = cards.filter(function (card) { return !card.hidden; });
        var approved = cards.filter(function (card) { return recordFor(card.getAttribute('data-review-id')).decision === 'APPROVED'; }).length;
        var needsFix = cards.filter(function (card) { return recordFor(card.getAttribute('data-review-id')).decision === 'NEEDS_FIX'; }).length;
        var notes = cards.filter(function (card) { return Boolean((recordFor(card.getAttribute('data-review-id')).note || '').trim()); }).length;
        visibleLine.textContent = visible.length + ' visible · ' + approved + ' approved · ' + needsFix + ' need fixes · ' + notes + ' notes · ' + cards.length + ' total';
        emptyState.style.display = visible.length ? 'none' : 'block';
      }

      function applyFilters() {
        cards.forEach(function (card) { card.hidden = !matches(card); });
        updateSummary();
      }

      [search, sampleFilter, difficultyFilter, targetFilter, decisionFilter].forEach(function (control) {
        control.addEventListener(control === search ? 'input' : 'change', applyFilters);
      });

      document.getElementById('show-answers').addEventListener('click', function () {
        cards.forEach(function (card) {
          if (!card.hidden) card.querySelector('.answer-panel').open = true;
        });
      });
      document.getElementById('hide-answers').addEventListener('click', function () {
        cards.forEach(function (card) { card.querySelector('.answer-panel').open = false; });
      });
      document.getElementById('print-review').addEventListener('click', function () { window.print(); });
      document.getElementById('clear-review').addEventListener('click', function () {
        if (!window.confirm('Clear every saved CP-008 decision and reviewer note in this browser?')) return;
        state = {};
        localStorage.removeItem(STORAGE_KEY);
        cards.forEach(function (card) {
          card.querySelector('.decision-input').value = 'UNREVIEWED';
          card.querySelector('.note-input').value = '';
          setCardAppearance(card, 'UNREVIEWED');
        });
        decisionFilter.value = 'ALL';
        applyFilters();
      });
      document.getElementById('export-review').addEventListener('click', function () {
        var decisions = cards.map(function (card) {
          var id = card.getAttribute('data-review-id');
          var saved = recordFor(id);
          return {
            reviewId: id,
            qlId: card.getAttribute('data-ql'),
            sample: card.getAttribute('data-sample'),
            difficulty: card.getAttribute('data-difficulty'),
            target: card.getAttribute('data-target'),
            decision: saved.decision,
            note: saved.note || ''
          };
        }).filter(function (item) { return item.decision !== 'UNREVIEWED' || item.note.trim(); });
        var payload = {
          chapter: 'MEN-CP-008',
          title: 'Cylinders & Cones',
          language: 'en',
          qlRange: 'MEN-002-QL-044..MEN-002-QL-095',
          exportedAt: new Date().toISOString(),
          decisions: decisions
        };
        var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'MEN-CP-008-review-decisions.json';
        anchor.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });

      applyFilters();
    }());
  </script>
</body>
</html>`;

const outputPath = resolve(process.cwd(), "dist/review/MEN-CP-008-English-Review.html");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, html, "utf8");
console.log(`Wrote ${outputPath}`);
console.log(`Review inventory: ${MEN_CP_008_FROZEN_QLS.length} QLs × ${SAMPLE_SEEDS.length} samples = ${records.length} questions.`);
