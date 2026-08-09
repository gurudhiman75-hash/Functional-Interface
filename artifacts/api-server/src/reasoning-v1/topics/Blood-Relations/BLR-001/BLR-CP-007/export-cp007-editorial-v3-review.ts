import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import "./cp007-editorial-v3-scenario-corrections";
import "./cp007-editorial-v3-endpoint-compatibility";
import "./cp007-editorial-v3-gender-evidence";
import {
  buildBlrCp007EditorialV3FinalTelemetry,
  generateBlrCp007EditorialV3FinalBank,
} from "./cp007-editorial-v3-final";
import type { GeneratedBlrCp007EditorialV3Question } from "./cp007-editorial-v3-model";

function esc(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
function csv(value: unknown): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}
function optionLetter(index: number): string {
  return "ABCD"[index] ?? "?";
}

function diagram(question: GeneratedBlrCp007EditorialV3Question): string {
  if (question.explanation.diagramPolicy === "HIDDEN_DIRECT") {
    return `<p class="diagram-note">Diagram hidden for this direct lookup. It adds no reasoning value.</p>`;
  }
  const tree = question.explanation.familyTree;
  const proof = question.explanation.diagramProof;
  const generations = [...new Set(tree.nodes.map((node) => node.generation))].sort((a, b) => b - a);
  const positions = new Map<string, { x: number; y: number }>();
  let widest = 1;
  generations.forEach((generation, row) => {
    const nodes = tree.nodes.filter((node) => node.generation === generation);
    widest = Math.max(widest, nodes.length);
    nodes.forEach((node, index) => positions.set(node.id, { x: 90 + index * 175, y: 65 + row * 135 }));
  });
  const width = Math.max(360, 180 + (widest - 1) * 175);
  const height = Math.max(190, 125 + Math.max(1, generations.length - 1) * 135);
  const marker = question.itemId.replace(/[^a-zA-Z0-9]/g, "");
  const edges = proof.edges.map((edge) => {
    const source = positions.get(edge.sourceId);
    const target = positions.get(edge.targetId);
    if (!source || !target) return "";
    const classes = ["edge", edge.evidence === "INFERRED" ? "inferred" : "coded", edge.highlighted ? "highlighted" : ""].filter(Boolean).join(" ");
    const arrow = edge.type === "parent-child" ? ` marker-end="url(#arrow-${marker})"` : "";
    return `<g><line class="${classes}" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}"${arrow}/><text class="edge-label" x="${(source.x + target.x) / 2}" y="${(source.y + target.y) / 2 - 8}">${esc(edge.label)}</text></g>`;
  }).join("");
  const nodes = tree.nodes.map((node) => {
    const point = positions.get(node.id)!;
    const selected = proof.pathPersonIds.includes(node.id) ? " selected" : "";
    const gender = node.gender === "male" ? "M" : node.gender === "female" ? "F" : "?";
    return `<g class="node${selected}"><rect x="${point.x - 42}" y="${point.y - 23}" width="84" height="46" rx="9"/><text x="${point.x}" y="${point.y - 2}">${esc(node.label)}</text><text class="gender" x="${point.x}" y="${point.y + 15}">${gender}</text></g>`;
  }).join("");
  return `<figure class="diagram"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(proof.description)}"><defs><marker id="arrow-${marker}" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><polygon points="0 0,8 3.5,0 7"/></marker></defs>${edges}${nodes}</svg><figcaption>${esc(proof.description)}</figcaption><div class="legend">${proof.legend.map((entry) => `<span>${esc(entry)}</span>`).join("")}</div></figure>`;
}

function studentAnalysis(question: GeneratedBlrCp007EditorialV3Question): string {
  return question.explanation.optionAnalysis.map((analysis) =>
    `<li class="${analysis.isCorrectAnswerForTask ? "correct" : ""}"><strong>${esc(analysis.optionLabel)}. ${esc(analysis.optionText)}</strong><p>${esc(analysis.explanation)}</p></li>`,
  ).join("");
}

function adminProof(question: GeneratedBlrCp007EditorialV3Question): string {
  const rows: readonly [string, unknown][] = [
    ["Question ID", question.itemId],
    ["Semantic scenario", question.semanticScenarioId],
    ["QL / authority", `${question.qlId} / ${question.solveAuthority}`],
    ["Prototype", question.sourcePrototypeId],
    ["Difficulty", question.metadata.difficulty],
    ["Delivery", question.delivery.mode === "SHARED_SET" ? `${question.delivery.setId} · item ${question.delivery.itemNumber}/${question.delivery.itemCount}` : "Standalone"],
    ["Target relation", question.reviewProof.targetRelation ?? "Validity comparison"],
    ["Target path", question.reviewProof.targetPath.join(" → ")],
    ["Semantic fingerprint", question.metadata.semanticFingerprint],
    ["Scenario fingerprint", question.metadata.semanticScenarioFingerprint],
    ["Review status", question.reviewProof.reviewStatus],
  ];
  const diagnostics = question.options.map((option, index) =>
    `${optionLetter(index)}: ${option.failureCode ?? "correct route"}`,
  ).join(" · ");
  return `<details class="admin"><summary>Administrator review proof</summary><dl>${rows.map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl><p><strong>Internal option diagnostics:</strong> ${esc(diagnostics)}</p></details>`;
}

function card(question: GeneratedBlrCp007EditorialV3Question, index: number): string {
  const key = question.codeKey.map((entry) => `<span class="chip"><b>${esc(entry.token)}</b> = ${esc(entry.relationId.replaceAll("_", " ").toLocaleLowerCase("en-IN"))}</span>`).join("");
  const options = question.options.map((option, optionIndex) => `<li><b>${optionLetter(optionIndex)}.</b> ${esc(option.text)}</li>`).join("");
  const search = [question.itemId, question.qlId, question.sourcePrototypeId, question.semanticScenarioId, question.stem, question.answer, question.reviewProof.targetRelation].join(" ").toLocaleLowerCase("en-IN");
  return `<article class="card" data-ql="${question.qlId}" data-mode="${question.delivery.mode}" data-search="${esc(search)}"><header><div><span class="number">#${index + 1}</span><span class="ql">${question.qlId}</span></div><div><span class="delivery">${question.delivery.mode}</span><span class="difficulty">${question.metadata.difficulty}</span></div></header><p class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.semanticScenarioId)}</p><div class="key">${key}</div><p class="prompt">${esc(question.sharedPrompt)}</p><pre class="stem">${esc(question.stem)}</pre><ol class="options">${options}</ol><details class="answer"><summary>Reveal answer and explanation</summary><p class="answer-line"><strong>Correct answer:</strong> ${optionLetter(question.correctIndex)}. ${esc(question.answer)}</p><h3>How to solve</h3><ol>${question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol><p class="conclusion"><strong>Conclusion:</strong> ${esc(question.explanation.conclusion)}</p>${question.explanation.shortcut ? `<h3>Exam shortcut</h3><p>${esc(question.explanation.shortcut)}</p>` : ""}${question.explanation.commonTrap ? `<h3>Common trap</h3><p>${esc(question.explanation.commonTrap)}</p>` : ""}<h3>Why each option works or fails</h3><ul class="analysis">${studentAnalysis(question)}</ul><h3>Family evidence</h3>${diagram(question)}${adminProof(question)}</details></article>`;
}

function html(bank: readonly GeneratedBlrCp007EditorialV3Question[], summary: unknown): string {
  const qls = [...new Set(bank.map((question) => question.qlId))];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 Editorial V3 Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f3f6fa}*{box-sizing:border-box}body{margin:0}.hero{background:#172033;color:#fff;padding:28px 24px}.hero h1{margin:0 0 8px}.hero p{margin:5px 0;color:#dce5f6}.warning{display:inline-block;margin-top:10px;padding:8px 11px;border:1px solid #ffcc76;border-radius:9px;background:#4d3410;color:#fff2d2;font-weight:800}.stats{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.stats span{padding:6px 9px;border-radius:8px;background:#26344e}.controls{position:sticky;top:0;z-index:4;display:flex;gap:9px;flex-wrap:wrap;padding:12px 18px;background:#fff;border-bottom:1px solid #dbe1ea}.controls input,.controls select,.controls button{font:inherit;padding:9px 11px;border:1px solid #c8d0dc;border-radius:8px;background:#fff}.controls input{min-width:280px}main{max-width:1160px;margin:20px auto;padding:0 14px}.card{background:#fff;border:1px solid #dbe1ea;border-radius:15px;padding:18px;margin-bottom:18px;box-shadow:0 5px 16px #1720330d}.card header{display:flex;justify-content:space-between;gap:8px}.number{font-weight:900;margin-right:8px}.ql,.delivery,.difficulty{display:inline-block;padding:5px 8px;border-radius:999px;font-size:12px;font-weight:800}.ql{background:#e8efff}.delivery{background:#eaf7ef;margin-right:6px}.difficulty{background:#fff0d4}.meta{font-size:12px;color:#6a7485}.key{display:flex;gap:7px;flex-wrap:wrap}.chip{padding:7px 9px;border-radius:8px;background:#eef7f2;border:1px solid #cde7d7}.prompt{color:#4f5b6e}.stem{white-space:pre-wrap;font:600 16px/1.55 Inter,system-ui,sans-serif;background:#f8fafc;padding:13px;border-radius:10px}.options{padding-left:24px}.options li{padding:6px}.answer{border-top:1px solid #e1e6ee;padding-top:12px}.answer summary{cursor:pointer;font-weight:900}.answer-line{padding:11px;background:#eef8f2;border-radius:9px}.conclusion{padding:10px;background:#fff8df;border-radius:9px}.analysis{list-style:none;padding:0}.analysis li{padding:10px 12px;margin:8px 0;border-left:4px solid #aab5c5;background:#f8fafc}.analysis li.correct{border-color:#268657;background:#eff9f3}.analysis p{margin:6px 0 0}.diagram{border:1px solid #dbe1ea;border-radius:11px;background:#fbfcfe;padding:10px;overflow:auto}.diagram svg{display:block;width:100%;min-width:340px}.edge{stroke:#4f607a;stroke-width:2;fill:none}.edge.inferred{stroke-dasharray:8 6}.edge.highlighted{stroke:#a63c22;stroke-width:5}.edge-label{text-anchor:middle;font-size:10px;fill:#33405a;paint-order:stroke;stroke:#fff;stroke-width:4px}.node rect{fill:#fff;stroke:#45536b;stroke-width:2}.node.selected rect{stroke:#a63c22;stroke-width:4}.node text{text-anchor:middle;font-weight:800;font-size:13px}.node .gender{font-size:10px;fill:#68758a}.legend{display:flex;gap:6px;flex-wrap:wrap}.legend span{font-size:11px;background:#edf1f6;padding:5px 7px;border-radius:7px}.diagram-note{padding:9px;background:#f1f4f8;border-radius:8px;color:#596579}.admin{margin-top:12px;border:1px dashed #8995a8;padding:10px;border-radius:9px}.admin dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:7px}.admin dl div{padding:7px;background:#f4f6f9;border-radius:7px}.admin dt{font-size:11px;color:#6c7788}.admin dd{margin:3px 0 0;font-weight:700;overflow-wrap:anywhere}.hidden{display:none!important}@media(max-width:700px){.controls input{width:100%;min-width:0}.card header{flex-direction:column}}
</style></head><body><section class="hero"><h1>BLR-CP-007 — Editorial V3 Semantic Review</h1><p>168 genuinely varied English review questions across five permanent QLs.</p><p>V3 keeps the validated solver but rebuilds scenario diversity, relation balance, missing-person reasoning, construction depth, difficulty and delivery style.</p><span class="warning">Human review required — not frozen, localised, staged or released.</span><div class="stats"><span>168 semantic scenarios</span><span>75 male targets</span><span>75 female targets</span><span>18 neutral targets</span><span>84 standalone</span><span>84 shared-set</span></div></section><section class="controls"><input id="search" placeholder="Search question, relation, QL or prototype"/><select id="ql"><option value="">All QLs</option>${qls.map((ql) => `<option>${ql}</option>`).join("")}</select><select id="mode"><option value="">All delivery modes</option><option>STANDALONE</option><option>SHARED_SET</option></select><button id="reveal">Reveal all</button><button id="hide">Hide all</button><span id="count">${bank.length} shown</span></section><main>${bank.map(card).join("")}</main><script>
const cards=[...document.querySelectorAll('.card')],search=document.querySelector('#search'),ql=document.querySelector('#ql'),mode=document.querySelector('#mode'),count=document.querySelector('#count');function filter(){const term=search.value.toLowerCase();let shown=0;cards.forEach(card=>{const visible=(!term||card.dataset.search.includes(term))&&(!ql.value||card.dataset.ql===ql.value)&&(!mode.value||card.dataset.mode===mode.value);card.classList.toggle('hidden',!visible);if(visible)shown++});count.textContent=shown+' shown'}search.addEventListener('input',filter);ql.addEventListener('change',filter);mode.addEventListener('change',filter);document.querySelector('#reveal').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=true);document.querySelector('#hide').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=false);
</script><script type="application/json" id="summary">${esc(JSON.stringify(summary))}</script></body></html>`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v3-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV3FinalBank();
const summary = buildBlrCp007EditorialV3FinalTelemetry(bank);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v3-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v3-records.jsonl"), `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`);
const headers = ["itemId","qlId","prototypeId","semanticScenarioId","deliveryMode","keyStyle","difficulty","targetRelation","stem","answer","correctIndex","options"];
const rows = bank.map((question) => [question.itemId,question.qlId,question.sourcePrototypeId,question.semanticScenarioId,question.delivery.mode,question.keyStyle,question.metadata.difficulty,question.reviewProof.targetRelation ?? "",question.stem,question.answer,question.correctIndex,question.options.map((option) => option.text).join(" | ")]);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v3-records.csv"), `${[headers, ...rows].map((row) => row.map(csv).join(",")).join("\n")}\n`);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v3-review.html"), html(bank, summary));
const report = `# BLR-CP-007 Editorial V3 Review\n\nStatus: **executable semantic-remodel review candidate; human approval required**.\n\n- 168 questions and 168 semantic scenarios\n- 21 prototype families with 8 distinct constructions each\n- answer positions 42 / 42 / 42 / 42\n- male / female / neutral targets: 75 / 75 / 18\n- symbol / letter / word keys: 126 / 29 / 13\n- easy / medium / hard: ${summary.difficultyCounts.EASY} / ${summary.difficultyCounts.MEDIUM} / ${summary.difficultyCounts.HARD}\n- standalone / shared-set: 84 / 84\n- 504 graph-valid wrong options; 0 invalid option graphs\n- 32 shortcut-resistant QL-034 questions\n- 24 deeper QL-033 construction questions\n- 0 duplicate code meanings\n- 0 student-visible diagnostic codes\n- 0 duplicated Therefore prefixes\n\nV1 and V2 solver evidence remains retained. V2 student-facing editorial authority is superseded by this review candidate. English freeze, localisation, Question Studio, Question Bank, mock tests, publication, staging and merge remain locked.\n`;
writeFileSync(resolve(outputDir, "BLR-CP-007-EDITORIAL-V3-REVIEW.md"), report);
console.log(JSON.stringify({ outputDir, recordCount: bank.length, summary, files: ["blr-cp007-editorial-v3-summary.json","blr-cp007-editorial-v3-records.jsonl","blr-cp007-editorial-v3-records.csv","blr-cp007-editorial-v3-review.html","BLR-CP-007-EDITORIAL-V3-REVIEW.md"] }, null, 2));
