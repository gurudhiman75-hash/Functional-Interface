import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { buildBlrCp005Telemetry, generateBlrCp005FrozenBank } from "./cp005-bank";
import { BLR_CP005_FINAL_FREEZE_MARKDOWN, buildBlrCp005FinalFreeze } from "./cp005-final-freeze";
import { BLR_CP005_PERMANENT_CONTRACTS, relationDisplay, type BlrCp005FamilyTreeDiagram, type GeneratedBlrCp005Question } from "./cp005-model";

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]!);
}

function csv(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function positionsFor(tree: BlrCp005FamilyTreeDiagram): {
  width: number;
  height: number;
  positions: Map<string, { x: number; y: number }>;
  rows: number[];
} {
  const rows = [...new Set(tree.nodes.map((node) => node.generation))].sort((left, right) => right - left);
  const maxRow = Math.max(...rows.map((generation) => tree.nodes.filter((node) => node.generation === generation).length), 1);
  const width = Math.max(620, maxRow * 150 + 100);
  const height = Math.max(190, rows.length * 140 + 70);
  const positions = new Map<string, { x: number; y: number }>();
  rows.forEach((generation, rowIndex) => {
    const nodes = tree.nodes.filter((node) => node.generation === generation);
    const gap = width / (nodes.length + 1);
    nodes.forEach((node, index) => positions.set(node.id, { x: gap * (index + 1), y: 58 + rowIndex * 140 }));
  });
  return { width, height, positions, rows };
}

function renderTree(tree: BlrCp005FamilyTreeDiagram): string {
  const { width, height, positions, rows } = positionsFor(tree);
  const pathIds = new Set(tree.query.pathPersonIds);
  const edgeSvg = tree.edges.map((edge) => {
    const source = positions.get(edge.sourceId);
    const target = positions.get(edge.targetId);
    if (!source || !target) return "";
    const path = pathIds.has(edge.sourceId) && pathIds.has(edge.targetId) ? " evidence" : "";
    if (edge.type === "marriage") {
      return `<line class="edge marriage${path}" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}"/>`;
    }
    if (edge.type === "sibling") {
      return `<line class="edge sibling${path}" x1="${source.x}" y1="${source.y + 30}" x2="${target.x}" y2="${target.y + 30}"/>`;
    }
    const middle = (source.y + target.y) / 2;
    return `<path class="edge parent${path}" d="M ${source.x} ${source.y + 30} V ${middle} H ${target.x} V ${target.y - 30}"/>`;
  }).join("");
  const rowLabels = rows.map((generation, index) =>
    `<text class="generation" x="10" y="${62 + index * 140}">Gen ${generation >= 0 ? "+" : ""}${generation}</text>`,
  ).join("");
  const nodeSvg = tree.nodes.map((node) => {
    const position = positions.get(node.id)!;
    const evidence = pathIds.has(node.id) ? " evidence" : "";
    return `<g>
      <rect class="person ${node.gender}${evidence}" x="${position.x - 50}" y="${position.y - 27}" width="100" height="54" rx="10"/>
      <text class="name" x="${position.x}" y="${position.y - 2}">${escapeHtml(node.label)}</text>
      <text class="gender" x="${position.x}" y="${position.y + 16}">${node.gender === "male" ? "Male" : node.gender === "female" ? "Female" : "Gender open"}</text>
    </g>`;
  }).join("");
  return `<section class="model-card">
    <div class="model-heading"><strong>${escapeHtml(tree.modelLabel)}</strong><span>${escapeHtml(tree.query.answerLabel)}</span></div>
    <div class="svg-scroll"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(tree.accessibleSummary)}">${rowLabels}${edgeSvg}${nodeSvg}</svg></div>
    <details><summary>ASCII and assignment</summary><pre>${escapeHtml(tree.asciiFallback)}</pre></details>
  </section>`;
}

function renderQuestion(question: GeneratedBlrCp005Question, index: number): string {
  const options = question.options.map((option, optionIndex) =>
    `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.text)}${option.modelStatus ? `<span class="status">${escapeHtml(option.modelStatus)}</span>` : ""}</li>`,
  ).join("");
  const modelAudit = question.explanation.modelAudit.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  const optionAnalysis = question.explanation.optionAnalysis.map((option) =>
    `<li><strong>${option.optionLabel}. ${escapeHtml(option.optionText)}</strong> — ${escapeHtml(option.explanation)}</li>`,
  ).join("");
  return `<article class="question" data-checkpoint="${question.checkpointId}" data-ql="${question.qlId}" data-authority="${question.solveAuthority}">
    <header class="question-header">
      <div><div class="eyebrow">Review ${index + 1} · ${question.qlId}</div><h2>${escapeHtml(question.solveAuthority.replaceAll("_", " "))}</h2></div>
      <div class="badges"><span>${escapeHtml(question.metadata.difficulty)}</span><span>${question.modelSpace.modelCount} models</span></div>
    </header>
    <dl class="metadata"><div><dt>Prototype</dt><dd>${escapeHtml(question.sourcePrototypeId)}</dd></div><div><dt>Scenario</dt><dd>${escapeHtml(question.scenarioId)}</dd></div><div><dt>Item</dt><dd>${escapeHtml(question.itemId)}</dd></div></dl>
    <section class="prompt"><strong>Information</strong><p>${escapeHtml(question.sharedPrompt)}</p></section>
    <section class="stem"><strong>Question</strong><p>${escapeHtml(question.stem)}</p></section>
    <ol class="options">${options}</ol>
    <details class="models"><summary>Show all valid family models (${question.modelSpace.modelCount})</summary><div class="model-grid">${question.explanation.familyTrees.map(renderTree).join("")}</div></details>
    <details class="answer"><summary>Answer and explanation</summary>
      <p class="answer-line"><strong>Correct answer: ${String.fromCharCode(65 + question.correctIndex)}. ${escapeHtml(question.options[question.correctIndex]?.text)}</strong></p>
      <h3>Core concept</h3><ul>${question.explanation.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      <h3>Complete model audit</h3><ol>${modelAudit}</ol>
      <h3>Conclusion</h3><p>${escapeHtml(question.explanation.conclusion)}</p>
      <h3>Exam shortcut</h3><p>${escapeHtml(question.explanation.examShortcut)}</p>
      <h3>Option analysis</h3><ul>${optionAnalysis}</ul>
    </details>
  </article>`;
}

function reviewHtml(bank: readonly GeneratedBlrCp005Question[]): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>BLR-CP-005 Final English Review</title>
<style>
:root{color-scheme:light dark;--bg:#f4f6f9;--card:#fff;--text:#18222d;--muted:#64717e;--line:#d9e1e9;--accent:#155fae;--soft:#eaf3ff;--good:#16703d;--male:#2968ad;--female:#a1447e}
@media(prefers-color-scheme:dark){:root{--bg:#10161c;--card:#19222b;--text:#edf2f7;--muted:#aab5c0;--line:#394653;--accent:#80bfff;--soft:#172d43;--good:#7bd99c;--male:#86c0ff;--female:#f0a7d3}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,Segoe UI,sans-serif}header.page{position:sticky;top:0;z-index:10;background:var(--card);border-bottom:1px solid var(--line);padding:14px 18px}header.page h1{margin:0 0 9px;font-size:1.25rem}.controls{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:8px}input,select,button{font:inherit;padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)}.stats{margin-top:8px;color:var(--muted);font-size:.9rem}main{max-width:1180px;margin:auto;padding:16px}.question{background:var(--card);border:1px solid var(--line);border-radius:13px;padding:17px;margin-bottom:16px;box-shadow:0 2px 9px rgba(0,0,0,.05)}.question-header{display:flex;justify-content:space-between;gap:12px}.question h2{font-size:1.05rem;margin:4px 0}.eyebrow{color:var(--accent);font-size:.8rem;font-weight:750}.badges span,.status{display:inline-block;border:1px solid var(--line);border-radius:999px;padding:2px 7px;margin:0 0 4px 5px;font-size:.78rem}.metadata{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:.8rem}.metadata div{min-width:0}.metadata dt{color:var(--muted)}.metadata dd{margin:2px 0;overflow-wrap:anywhere}.prompt,.stem{padding:11px 13px;border-radius:8px;margin:11px 0}.prompt{background:var(--soft);border-left:4px solid var(--accent)}.prompt p,.stem p{white-space:pre-wrap;line-height:1.5;margin:5px 0}.options{padding-left:0;list-style:none;display:grid;gap:7px}.options li{border:1px solid var(--line);border-radius:8px;padding:9px}.answer[open] .options .correct,.correct{border-color:var(--good)}details{margin-top:11px}summary{cursor:pointer;font-weight:700}.model-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:10px;margin-top:10px}.model-card{border:1px solid var(--line);border-radius:10px;overflow:hidden}.model-heading{display:flex;justify-content:space-between;padding:8px 10px;border-bottom:1px solid var(--line);font-size:.84rem}.svg-scroll{overflow-x:auto}.model-card svg{min-width:560px;width:100%;height:auto;background:var(--card)}.edge{stroke:var(--muted);stroke-width:2;fill:none}.edge.marriage{stroke-width:5}.edge.sibling{stroke-dasharray:5 4}.edge.evidence{stroke:var(--accent);stroke-width:4}.person{fill:var(--card);stroke:var(--line);stroke-width:2}.person.male{stroke:var(--male)}.person.female{stroke:var(--female)}.person.evidence{stroke:var(--accent);stroke-width:4}.name{fill:var(--text);font-size:13px;font-weight:700;text-anchor:middle}.gender,.generation{fill:var(--muted);font-size:10px;text-anchor:middle}.generation{text-anchor:start;font-weight:700}.model-card pre{white-space:pre-wrap;padding:10px;font-size:.75rem}.answer{border-top:1px solid var(--line);padding-top:10px}.answer-line{color:var(--good)}.hidden{display:none}@media(max-width:640px){.controls{grid-template-columns:1fr 1fr}.controls input{grid-column:1/-1}.metadata{grid-template-columns:1fr}.question-header{display:block}.model-grid{grid-template-columns:1fr}}
</style></head><body>
<header class="page"><h1>BLR-CP-005 — Determinacy, Possibility and Uncertainty</h1><div class="controls"><select id="ql"><option value="">All QLs</option>${[...new Set(bank.map((q) => q.qlId))].map((ql) => `<option>${ql}</option>`).join("")}</select><select id="difficulty"><option value="">All difficulties</option><option>EASY</option><option>MEDIUM</option><option>HARD</option></select><input id="search" placeholder="Search stem, prompt or authority"><button id="answers">Open all answers</button></div><div class="stats" id="stats"></div></header>
<main id="questions">${bank.map(renderQuestion).join("")}</main>
<script>
const ql=document.getElementById('ql'),difficulty=document.getElementById('difficulty'),search=document.getElementById('search'),stats=document.getElementById('stats'),cards=[...document.querySelectorAll('.question')],answers=document.getElementById('answers');let open=false;
function filter(){const term=search.value.toLowerCase();let shown=0;cards.forEach(card=>{const match=(!ql.value||card.dataset.ql===ql.value)&&(!difficulty.value||card.querySelector('.badges').textContent.includes(difficulty.value))&&(!term||card.textContent.toLowerCase().includes(term));card.classList.toggle('hidden',!match);if(match)shown++});stats.textContent='Showing '+shown+' of '+cards.length+' questions · 432 valid family models rendered';}
[ql,difficulty,search].forEach(el=>el.addEventListener(el===search?'input':'change',filter));answers.addEventListener('click',()=>{open=!open;document.querySelectorAll('details.answer').forEach(d=>d.open=open);answers.textContent=open?'Close all answers':'Open all answers'});filter();
</script></body></html>`;
}

const outputDir = resolve(process.argv[2] ?? "cp005-final-freeze-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp005FrozenBank();
const telemetry = buildBlrCp005Telemetry(bank);
const freeze = buildBlrCp005FinalFreeze();

writeFileSync(resolve(outputDir, "blr-cp005-final-freeze-summary.json"), `${JSON.stringify({ ...telemetry, freezeVersion: freeze.freezeVersion, releaseBoundary: freeze.releaseBoundary }, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp005-permanent-contracts.json"), `${JSON.stringify(BLR_CP005_PERMANENT_CONTRACTS, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp005-final-freeze-records.jsonl"), `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`);

const csvHeader = ["index", "qlId", "authority", "prototypeId", "scenarioId", "topologyId", "seed", "itemId", "modelCount", "difficulty", "sharedPrompt", "stem", "optionA", "optionB", "optionC", "optionD", "correctIndex", "correctAnswer", "answer", "modelAssignments", "modelAudit", "semanticFingerprint"];
const csvRows = bank.map((question, index) => [
  index + 1, question.qlId, question.solveAuthority, question.sourcePrototypeId,
  question.scenarioId, question.topologyId, question.seed, question.itemId,
  question.modelSpace.modelCount, question.metadata.difficulty, question.sharedPrompt, question.stem,
  ...question.options.map((option) => option.text), question.correctIndex,
  question.options[question.correctIndex]?.text ?? "", question.answer,
  question.modelSpace.assignments, question.explanation.modelAudit, question.metadata.semanticFingerprint,
].map(csv).join(","));
writeFileSync(resolve(outputDir, "blr-cp005-final-freeze-records.csv"), `${csvHeader.join(",")}\n${csvRows.join("\n")}\n`);
writeFileSync(resolve(outputDir, "blr-cp005-final-freeze-review.html"), reviewHtml(bank));
writeFileSync(resolve(outputDir, "BLR-CP-005-FINAL-DISCOVERY-FREEZE.md"), BLR_CP005_FINAL_FREEZE_MARKDOWN);

console.log(JSON.stringify({ outputDir, ...telemetry, files: [
  "blr-cp005-final-freeze-summary.json",
  "blr-cp005-permanent-contracts.json",
  "blr-cp005-final-freeze-records.jsonl",
  "blr-cp005-final-freeze-records.csv",
  "blr-cp005-final-freeze-review.html",
  "BLR-CP-005-FINAL-DISCOVERY-FREEZE.md",
] }, null, 2));
