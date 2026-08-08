import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(root, "PROBABILITY-REVIEW-QUESTIONS-AND-EXPLANATIONS.md");
const outputPath = join(root, "PROBABILITY-REVIEW-QUESTIONS-AND-EXPLANATIONS.html");

interface ReviewQuestion {
  number: number;
  qlId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  packageId: string;
  cpId: string;
  stem: string;
  options: Array<{ label: string; value: string }>;
  correctAnswer: string;
  explanation: string[];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function texToLinear(expression: string): string {
  let value = expression.trim();
  let previous = "";
  while (previous !== value) {
    previous = value;
    value = value
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "($1/$2)")
      .replace(/\\binom\{([^{}]+)\}\{([^{}]+)\}/g, "C($1, $2)");
  }

  value = value
    .replace(/\\!/g, "")
    .replace(/\\left/g, "")
    .replace(/\\right/g, "")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cup/g, "∪")
    .replace(/\\cap/g, "∩")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\ne/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\^\{([^{}]+)\}/g, "^$1")
    .replace(/_\{([^{}]+)\}/g, "_$1")
    .replace(/[{}]/g, "")
    .replace(/\\([A-Za-z]+)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const simpleFraction = value.match(/^\(([^()/]+\/[^()/]+)\)$/);
  return simpleFraction ? simpleFraction[1]! : value;
}

function inlineHtml(value: string): string {
  const parts: string[] = [];
  let cursor = 0;
  for (const match of value.matchAll(/\\\((.+?)\\\)/g)) {
    const index = match.index ?? 0;
    parts.push(escapeHtml(value.slice(cursor, index)));
    const linear = texToLinear(match[1]!);
    parts.push(`<span class="math-token" title="${escapeHtml(linear)}">${escapeHtml(linear)}</span>`);
    cursor = index + match[0].length;
  }
  parts.push(escapeHtml(value.slice(cursor)));
  return parts.join("")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function parseQuestions(markdown: string): ReviewQuestion[] {
  const questions: ReviewQuestion[] = [];
  const lines = markdown.split(/\r?\n/);
  let packageId = "";
  let cpId = "";

  for (let index = 0; index < lines.length;) {
    const line = lines[index]!;
    if (line.startsWith("## PRB-")) {
      packageId = line.slice(3).split("—")[0]!.trim();
      index += 1;
      continue;
    }
    if (line.startsWith("### PRB-CP-")) {
      cpId = line.slice(4).trim();
      index += 1;
      continue;
    }
    if (!line.startsWith("#### Question ")) {
      index += 1;
      continue;
    }

    const heading = line.slice(5).trim();
    const headingMatch = heading.match(/^Question\s+(\d+)\s+—\s+(PRB-QL-\d+)\s+\((Easy|Medium|Hard)\)$/);
    if (!headingMatch) throw new Error(`Unexpected HTML source heading: ${heading}`);

    const block: string[] = [];
    index += 1;
    while (index < lines.length) {
      const next = lines[index]!;
      if (next.startsWith("#### Question ") || next.startsWith("### PRB-CP-") || next.startsWith("## PRB-")) break;
      block.push(next);
      index += 1;
    }

    let stem = "";
    let correctAnswer = "";
    let mode: "options" | "explanation" | undefined;
    const options: ReviewQuestion["options"] = [];
    const explanation: string[] = [];

    for (const raw of block) {
      const current = raw.trim();
      if (current.startsWith("**Question:**")) {
        stem = current.slice("**Question:**".length).trim();
        mode = undefined;
      } else if (current === "**Options:**") {
        mode = "options";
      } else if (current.startsWith("**Correct answer:**")) {
        correctAnswer = current.slice("**Correct answer:**".length).trim();
        mode = undefined;
      } else if (current === "**Explanation:**") {
        mode = "explanation";
      } else if (mode === "options") {
        const optionMatch = current.match(/^- \*\*([A-E])\.\*\*\s*(.*)$/);
        if (optionMatch) options.push({ label: optionMatch[1]!, value: optionMatch[2]! });
      } else if (mode === "explanation" && current && current !== "---") {
        explanation.push(current);
      }
    }

    if (!stem || !correctAnswer || options.length < 4 || !explanation.length) {
      throw new Error(`Incomplete HTML source block for ${headingMatch[2]}`);
    }

    questions.push({
      number: Number(headingMatch[1]),
      qlId: headingMatch[2]!,
      difficulty: headingMatch[3] as ReviewQuestion["difficulty"],
      packageId,
      cpId,
      stem,
      options,
      correctAnswer,
      explanation,
    });
  }

  return questions;
}

function explanationHtml(lines: string[]): string {
  const output: string[] = [];
  let numbered: string[] = [];
  const flushNumbered = (): void => {
    if (!numbered.length) return;
    output.push(`<ol class="working-steps">${numbered.map((line) => `<li>${inlineHtml(line)}</li>`).join("")}</ol>`);
    numbered = [];
  };

  for (const line of lines) {
    const numberedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (numberedMatch) {
      numbered.push(numberedMatch[1]!);
      continue;
    }

    flushNumbered();
    const labelled = line.match(/^- \*\*(Method|Simplification|Key point|Answer):\*\*\s*(.*)$/);
    if (labelled) {
      const label = labelled[1]!;
      const className = label === "Method" ? "method-box" : label === "Simplification" ? "simplify-box" : label === "Key point" ? "key-box" : "final-answer-box";
      const displayLabel = label === "Answer" ? "Final answer" : label;
      output.push(`<div class="explanation-box ${className}"><div class="box-label">${displayLabel}</div><div>${inlineHtml(labelled[2]!)}</div></div>`);
    } else if (line) {
      output.push(`<p>${inlineHtml(line)}</p>`);
    }
  }

  flushNumbered();
  return output.join("");
}

function questionCard(question: ReviewQuestion): string {
  const options = question.options.map(({ label, value }) =>
    `<li><span class="option-label">${label}.</span><span>${inlineHtml(value)}</span></li>`,
  ).join("");

  return `<article class="question-card" id="${question.qlId}" data-number="${question.number}" data-package="${question.packageId}" data-cp="${question.cpId}" data-difficulty="${question.difficulty}" data-ql="${question.qlId}">
<div class="question-heading"><div><span class="question-number">Question ${question.number}</span><span class="ql-id">${question.qlId}</span></div><span class="difficulty ${question.difficulty.toLowerCase()}">${question.difficulty}</span></div>
<div class="stem">${inlineHtml(question.stem)}</div>
<ol class="options">${options}</ol>
<section class="answer-section"><div class="correct-answer"><span>Correct answer</span><strong>${inlineHtml(question.correctAnswer)}</strong></div><div class="worked-solution"><h3>Worked solution</h3>${explanationHtml(question.explanation)}</div></section>
<details class="review-panel"><summary>Reviewer notes</summary><div class="review-grid"><label>Review status<select class="review-status"><option value="unreviewed">Unreviewed</option><option value="approved">Approved</option><option value="issue">Needs correction</option></select></label><label>Notes<textarea class="review-notes" rows="3" placeholder="Record issues with the stem, options, answer or explanation."></textarea></label></div></details>
</article>`;
}

const markdown = readFileSync(sourcePath, "utf8");
const questions = parseQuestions(markdown);
if (questions.length !== 135) throw new Error(`Expected 135 HTML questions, found ${questions.length}.`);

const packageCounts = new Map<string, number>();
const difficultyCounts = new Map<string, number>();
const cpIds: string[] = [];
for (const question of questions) {
  packageCounts.set(question.packageId, (packageCounts.get(question.packageId) ?? 0) + 1);
  difficultyCounts.set(question.difficulty, (difficultyCounts.get(question.difficulty) ?? 0) + 1);
  if (!cpIds.includes(question.cpId)) cpIds.push(question.cpId);
}

const styles = `:root{--page:#f3f6fb;--paper:#fff;--ink:#172033;--muted:#667085;--line:#d8e0ec;--brand:#1849a9;--brand-soft:#edf3ff;--success:#067647;--success-soft:#ecfdf3;--warning:#b54708;--warning-soft:#fff6ed;--danger:#b42318;--danger-soft:#fef3f2;--purple:#6941c6;--purple-soft:#f4f3ff;--shadow:0 8px 24px rgba(16,24,40,.07)}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--page);color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.62}.topbar{position:sticky;top:0;z-index:20;border-bottom:1px solid var(--line);background:rgba(255,255,255,.97)}.topbar-inner{max-width:1180px;margin:auto;padding:13px 18px}.title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:11px}.title-row h1{margin:0;font-size:clamp(1.15rem,2vw,1.55rem)}.subtitle{color:var(--muted);font-size:.86rem}.pills,.actions{display:flex;flex-wrap:wrap;gap:7px}.pill{border:1px solid var(--line);border-radius:999px;background:#fff;padding:4px 9px;color:var(--muted);font-size:.78rem}.filters{display:grid;grid-template-columns:minmax(240px,1.7fr) repeat(3,minmax(130px,.7fr)) auto;gap:9px;align-items:end}.filters label,.review-grid label{display:grid;gap:4px;color:var(--muted);font-size:.75rem;font-weight:750}input,select,textarea,button{font:inherit}input,select,textarea{width:100%;border:1px solid #c7d0dd;border-radius:9px;background:#fff;color:var(--ink);padding:9px 10px}button{border:1px solid var(--brand);border-radius:9px;background:var(--brand);color:#fff;cursor:pointer;padding:9px 11px;font-weight:750}button.secondary{border-color:#c7d0dd;background:#fff;color:var(--ink)}main{max-width:980px;margin:auto;padding:25px 18px 70px}.intro,.question-card{border:1px solid var(--line);border-radius:15px;background:var(--paper);box-shadow:var(--shadow)}.intro{margin-bottom:24px;padding:22px 24px}.formula-note{border-left:4px solid var(--purple);border-radius:7px;background:var(--purple-soft);padding:10px 13px}.question-card{margin:16px 0;padding:22px 24px;scroll-margin-top:185px}.question-card.review-approved{border-left:5px solid var(--success)}.question-card.review-issue{border-left:5px solid var(--danger)}.question-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}.question-number{font-weight:850;font-size:1.08rem}.ql-id{margin-left:8px;color:var(--muted);font-size:.8rem;font-weight:700}.difficulty{border-radius:999px;padding:3px 9px;font-size:.72rem;font-weight:850}.difficulty.easy{color:var(--success);background:var(--success-soft)}.difficulty.medium{color:var(--warning);background:var(--warning-soft)}.difficulty.hard{color:var(--danger);background:var(--danger-soft)}.stem{margin-bottom:13px;font-size:1.02rem;font-weight:620}.options{margin:0 0 17px;padding:0;list-style:none;display:grid;gap:7px}.options li{border:1px solid #e1e7f0;border-radius:9px;background:#fafcff;padding:8px 10px}.option-label{display:inline-block;width:25px;color:var(--brand);font-weight:850}.math-token{display:inline-block;border-radius:4px;background:#f3f6fb;padding:0 .18em;font-family:"Cambria Math","Times New Roman",serif;font-weight:650;white-space:nowrap}.answer-section{border-top:1px dashed var(--line);padding-top:15px}.correct-answer{display:flex;align-items:baseline;gap:9px;border-left:4px solid var(--success);border-radius:7px;background:var(--success-soft);padding:9px 12px}.correct-answer span,.box-label{font-size:.76rem;font-weight:850;text-transform:uppercase}.worked-solution h3{margin:18px 0 9px;font-size:1rem}.explanation-box{margin:9px 0;border-radius:9px;padding:10px 12px}.method-box{background:var(--brand-soft)}.simplify-box{background:var(--purple-soft)}.key-box{background:var(--warning-soft)}.final-answer-box{background:var(--success-soft)}.working-steps{margin:10px 0 12px;padding-left:28px}.working-steps li{margin:8px 0}.review-panel{margin-top:17px;border-top:1px solid var(--line);padding-top:11px}.review-panel summary{cursor:pointer;color:var(--brand);font-weight:780}.review-grid{display:grid;grid-template-columns:190px 1fr;gap:12px;margin-top:11px}.review-grid textarea{resize:vertical;min-height:82px}.hide-answers .answer-section,.hidden-card{display:none!important}.no-results{display:none;border:1px dashed var(--line);border-radius:12px;background:#fff;padding:28px;text-align:center;color:var(--muted)}.no-results.visible{display:block}@media(max-width:900px){.title-row{flex-direction:column}.filters{grid-template-columns:1fr 1fr}.filters label:first-child,.actions{grid-column:1/-1}}@media(max-width:600px){.topbar-inner,main{padding-left:11px;padding-right:11px}.filters{grid-template-columns:1fr}.filters label:first-child,.actions{grid-column:auto}.question-card{padding:17px 15px}.review-grid{grid-template-columns:1fr}}@media print{body{background:#fff}.topbar,.review-panel{display:none!important}main{max-width:none;padding:0}.intro,.question-card{box-shadow:none}.question-card{break-inside:avoid}.hide-answers .answer-section{display:block!important}}`;

const clientScript = `(()=>{const cards=[...document.querySelectorAll('.question-card')],root=document.getElementById('reviewDocument'),search=document.getElementById('searchInput'),pkg=document.getElementById('packageFilter'),diff=document.getElementById('difficultyFilter'),cp=document.getElementById('cpFilter'),count=document.getElementById('visibleCount'),empty=document.getElementById('noResults'),toggle=document.getElementById('toggleAnswers'),key='examtree-probability-calculation-review-v2';function filter(){const q=search.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const visible=(!q||card.textContent.toLowerCase().includes(q))&&(!pkg.value||card.dataset.package===pkg.value)&&(!diff.value||card.dataset.difficulty===diff.value)&&(!cp.value||card.dataset.cp===cp.value);card.classList.toggle('hidden-card',!visible);if(visible)shown++});count.textContent='Showing '+shown;empty.classList.toggle('visible',shown===0)}[search,pkg,diff,cp].forEach(control=>{control.addEventListener('input',filter);control.addEventListener('change',filter)});toggle.addEventListener('click',()=>{const hidden=root.classList.toggle('hide-answers');toggle.textContent=hidden?'Show answers':'Hide answers'});document.getElementById('jumpExample').addEventListener('click',()=>{search.value='';pkg.value='';diff.value='';cp.value='';filter();document.getElementById('PRB-QL-702')?.scrollIntoView({behavior:'smooth',block:'start'})});let state={};try{state=JSON.parse(localStorage.getItem(key)||'{}')}catch{}function save(){localStorage.setItem(key,JSON.stringify(state))}function style(card,status){card.classList.toggle('review-approved',status==='approved');card.classList.toggle('review-issue',status==='issue')}cards.forEach(card=>{const ql=card.dataset.ql,status=card.querySelector('.review-status'),notes=card.querySelector('.review-notes'),saved=state[ql]||{status:'unreviewed',notes:''};status.value=saved.status;notes.value=saved.notes;style(card,status.value);status.addEventListener('change',()=>{state[ql]={status:status.value,notes:notes.value};save();style(card,status.value)});notes.addEventListener('input',()=>{state[ql]={status:status.value,notes:notes.value};save()})});document.getElementById('exportReview').addEventListener('click',()=>{const rows=[['questionNumber','packageId','cpId','qlId','difficulty','status','notes']];cards.forEach(card=>rows.push([card.dataset.number,card.dataset.package,card.dataset.cp,card.dataset.ql,card.dataset.difficulty,card.querySelector('.review-status').value,card.querySelector('.review-notes').value]));const quote=value=>'"'+String(value).replaceAll('"','""')+'"',csv=rows.map(row=>row.map(quote).join(',')).join('\\n'),blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='probability-human-review-notes.csv';document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url)});filter()})();`;

const cpOptions = cpIds.map((cpId) => `<option value="${cpId}">${cpId}</option>`).join("");
const cards = questions.map(questionCard).join("\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Probability Review — Calculation-Teaching Edition</title><style>${styles}</style></head><body><header class="topbar"><div class="topbar-inner"><div class="title-row"><div><h1>Probability Review — Calculation-Teaching Edition</h1><div class="subtitle">135 questions · complete arithmetic · offline and copy-safe formulas</div></div><div class="pills"><span class="pill">SSC: ${packageCounts.get("PRB-001")}</span><span class="pill">Banking: ${packageCounts.get("PRB-002")}</span><span class="pill">Easy: ${difficultyCounts.get("Easy")}</span><span class="pill">Medium: ${difficultyCounts.get("Medium")}</span><span class="pill">Hard: ${difficultyCounts.get("Hard")}</span><span class="pill" id="visibleCount">Showing 135</span></div></div><div class="filters"><label>Search<input id="searchInput" type="search" placeholder="Question number, QL ID, concept or wording"></label><label>Package<select id="packageFilter"><option value="">All packages</option><option value="PRB-001">PRB-001 — SSC</option><option value="PRB-002">PRB-002 — Banking</option></select></label><label>Difficulty<select id="difficultyFilter"><option value="">All difficulties</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select></label><label>Content package<select id="cpFilter"><option value="">All CPs</option>${cpOptions}</select></label><div class="actions"><button id="toggleAnswers" class="secondary">Hide answers</button><button id="jumpExample" class="secondary">Open Q114</button><button id="exportReview" class="secondary">Export notes</button><button onclick="window.print()">Print</button></div></div></div></header><main id="reviewDocument"><section class="intro"><h2>Editorial review set</h2><p>This edition replaces answer-key jumps with calculation-first working for combinations, committees, simultaneous selections, permutations and queue arrangements.</p><p class="formula-note"><strong>Formula reliability:</strong> formulas are stored as visible text. No external script or internet connection is required, and copied calculations retain every number and operator.</p></section>${cards}<div id="noResults" class="no-results">No questions match the selected filters.</div></main><script>${clientScript}</script></body></html>`;

if ((html.match(/class="question-card"/g) ?? []).length !== 135) throw new Error("HTML card count proof failed.");
for (const fragment of ["C(14, 4)", "14!/(4!", "C(8, 3)", "336/1001", "48/143"]) {
  if (!html.includes(fragment)) throw new Error(`HTML calculation proof is missing ${fragment}.`);
}
if (html.includes("\\(") || html.includes("\\)")) throw new Error("HTML contains unresolved MathJax delimiters.");
if (/<script\s+src=/i.test(html) || /https?:\/\//i.test(html)) throw new Error("HTML must remain standalone and offline-safe.");

writeFileSync(outputPath, html);
console.log(JSON.stringify({ outputPath, questions: questions.length, bytes: Buffer.byteLength(html), q114CalculationProof: true }));
