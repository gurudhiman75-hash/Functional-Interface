import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { BLR_CP007_CONTRACTS, type GeneratedBlrCp007Question } from "./cp007-model";
import { buildBlrCp007FinalFreezeSummary } from "./cp007-final-freeze";
import { buildBlrCp007Telemetry, generateBlrCp007FrozenBank } from "./cp007-runtime";

function esc(value: unknown): string {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function csv(value: unknown): string { return `"${String(value).replaceAll('"', '""')}"`; }

function svg(question: GeneratedBlrCp007Question): string {
  const tree = question.explanation.familyTree;
  const generations = [...new Set(tree.nodes.map((node) => node.generation))].sort((a, b) => b - a);
  const rowIndex = new Map(generations.map((generation, index) => [generation, index]));
  const positions = new Map<string, { x: number; y: number }>();
  let maxRow = 1;
  for (const generation of generations) {
    const nodes = tree.nodes.filter((node) => node.generation === generation);
    maxRow = Math.max(maxRow, nodes.length);
    nodes.forEach((node, index) => positions.set(node.id, { x: 100 + index * 170, y: 70 + (rowIndex.get(generation) ?? 0) * 130 }));
  }
  const width = Math.max(680, 200 + (maxRow - 1) * 170);
  const height = Math.max(210, 150 + (generations.length - 1) * 130);
  const edges = tree.edges.map((edge) => {
    const source = positions.get(edge.sourceId);
    const target = positions.get(edge.targetId);
    if (!source || !target) return "";
    const dash = edge.type === "sibling" ? ' stroke-dasharray="7 5"' : "";
    return `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" class="edge ${edge.type}"${dash}/>`;
  }).join("");
  const nodes = tree.nodes.map((node) => {
    const point = positions.get(node.id)!;
    const gender = node.gender === "male" ? "M" : node.gender === "female" ? "F" : "?";
    return `<g class="node"><rect x="${point.x - 48}" y="${point.y - 26}" width="96" height="52" rx="12"/><text x="${point.x}" y="${point.y - 3}">${esc(node.label)}</text><text class="gender" x="${point.x}" y="${point.y + 17}">${gender}</text></g>`;
  }).join("");
  return `<div class="diagram-scroll"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(tree.accessibleSummary)}">${edges}${nodes}</svg></div>`;
}

function card(question: GeneratedBlrCp007Question, index: number): string {
  const options = question.options.map((option, optionIndex) => `<li><span class="letter">${"ABCD"[optionIndex]}.</span> ${esc(option.text)}</li>`).join("");
  const optionAnalysis = question.explanation.optionAnalysis.map((entry) => `<li><strong>${entry.optionLabel}. ${esc(entry.optionText)}</strong> — ${esc(entry.explanation)}</li>`).join("");
  const key = question.codeKey.map((entry) => `<span class="key-chip"><b>${esc(entry.token)}</b> = is the ${esc(entry.relationId.toLocaleLowerCase("en-IN").replaceAll("_", "-"))} of</span>`).join("");
  return `<article class="card" data-ql="${question.qlId}" data-search="${esc([question.itemId, question.qlId, question.sourcePrototypeId, question.stem, question.answer].join(" ").toLocaleLowerCase("en-IN"))}">
    <header><div><span class="number">#${index + 1}</span><span class="ql">${question.qlId}</span></div><span class="difficulty">${question.metadata.difficulty}</span></header>
    <div class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.topologyId)}</div>
    <div class="key">${key}</div>
    <p class="prompt">${esc(question.sharedPrompt)}</p>
    <pre class="stem">${esc(question.stem)}</pre>
    <ol class="options">${options}</ol>
    <details class="answer"><summary>Reveal answer and explanation</summary>
      <div class="answer-line"><strong>Correct answer:</strong> ${"ABCD"[question.correctIndex]}. ${esc(question.answer)}</div>
      <h3>📌 Core Concept</h3><ul>${question.explanation.coreConcept.map((value) => `<li>${esc(value)}</li>`).join("")}</ul>
      <h3>📝 Construction Audit</h3><ol>${question.explanation.constructionAudit.map((value) => `<li>${esc(value)}</li>`).join("")}</ol>
      <h3>🔍 Completed Graph Audit</h3><ol>${question.explanation.graphAudit.map((value) => `<li>${esc(value)}</li>`).join("")}</ol>
      <p class="conclusion"><strong>Conclusion:</strong> ${esc(question.explanation.conclusion)}</p>
      <h3>⚡ Exam Speed Shortcut</h3><p>${esc(question.explanation.examShortcut)}</p>
      <h3>⚠️ Common Traps</h3><ul>${question.explanation.commonTraps.map((value) => `<li>${esc(value)}</li>`).join("")}</ul>
      <h3>Option Analysis</h3><ul>${optionAnalysis}</ul>
      <h3>Family Diagram</h3>${svg(question)}
      <details class="ascii"><summary>ASCII fallback</summary><pre>${esc(question.explanation.familyTree.asciiFallback)}</pre></details>
    </details>
  </article>`;
}

function reviewHtml(bank: readonly GeneratedBlrCp007Question[]): string {
  const qls = [...new Set(bank.map((question) => question.qlId))];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>BLR-CP-007 Coded Relation Construction Review</title>
<style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f4f6fa}*{box-sizing:border-box}body{margin:0}
.hero{padding:28px 24px;background:#172033;color:white}.hero h1{margin:0 0 8px;font-size:clamp(24px,4vw,38px)}.hero p{margin:4px 0;color:#d9e1f2}
.controls{position:sticky;top:0;z-index:5;display:flex;gap:10px;flex-wrap:wrap;padding:12px 18px;background:white;border-bottom:1px solid #dbe1ea}
.controls input,.controls select,.controls button{font:inherit;padding:9px 12px;border:1px solid #c8d0dc;border-radius:9px;background:white}
main{max-width:1120px;margin:20px auto;padding:0 14px}.card{background:white;border:1px solid #dbe1ea;border-radius:16px;padding:18px;margin:0 0 18px;box-shadow:0 5px 18px #1720330d}
.card header{display:flex;justify-content:space-between;align-items:center}.number{font-weight:800;margin-right:10px}.ql{background:#e9efff;padding:5px 9px;border-radius:999px;font-weight:700}
.difficulty{font-size:12px;font-weight:800}.meta{font-size:12px;color:#687386;margin:8px 0 12px}.key{display:flex;gap:7px;flex-wrap:wrap}.key-chip{background:#eef7f2;border:1px solid #cce7d7;padding:7px 9px;border-radius:9px}
.prompt{color:#4d596b}.stem{white-space:pre-wrap;font:600 16px/1.55 Inter,system-ui,sans-serif;background:#f8fafc;padding:14px;border-radius:11px}.options{padding-left:24px}.options li{padding:7px 4px}.letter{font-weight:800}
.answer{margin-top:12px;border-top:1px solid #e2e7ef;padding-top:12px}.answer summary{cursor:pointer;font-weight:800}.answer-line{margin:14px 0;padding:12px;background:#eef7f2;border-radius:10px}.conclusion{padding:11px;background:#fff8df;border-radius:10px}
.diagram-scroll{overflow:auto;border:1px solid #dbe1ea;border-radius:12px;background:#fbfcfe}.diagram-scroll svg{min-width:680px;width:100%;height:auto}.edge{stroke:#6b778c;stroke-width:2}.marriage{stroke-width:4}.parent-child{stroke:#405f9c}.sibling{stroke:#7d648f}
.node rect{fill:white;stroke:#45536b;stroke-width:2}.node text{text-anchor:middle;font-weight:800;font-size:14px}.node .gender{font-size:11px;font-weight:600;fill:#69758a}.ascii pre{white-space:pre-wrap}.hidden{display:none!important}
@media(max-width:700px){.hero{padding:20px 15px}.controls{padding:10px}.controls input{width:100%}.card{padding:14px}.stem{font-size:15px}}
</style></head>
<body><section class="hero"><h1>BLR-CP-007 — Coded Relation Construction</h1>
<p>${bank.length} English review questions · 21 source prototypes · 5 permanent QLs · 296 completed coded assertions</p>
<p>Answers are hidden by default. Every item includes token construction, independent graph verification and a family diagram.</p></section>
<section class="controls"><input id="search" placeholder="Search questions, QL or prototype"/><select id="ql"><option value="">All QLs</option>${qls.map((ql) => `<option>${ql}</option>`).join("")}</select><button id="reveal">Reveal all answers</button><button id="hide">Hide all answers</button><span id="count">${bank.length} shown</span></section>
<main>${bank.map(card).join("")}</main>
<script>
const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),ql=document.getElementById('ql'),count=document.getElementById('count');
function filter(){const text=search.value.toLowerCase().trim(),q=ql.value;let shown=0;cards.forEach(card=>{const ok=(!text||card.dataset.search.includes(text))&&(!q||card.dataset.ql===q);card.classList.toggle('hidden',!ok);if(ok)shown++});count.textContent=shown+' shown'}
search.addEventListener('input',filter);ql.addEventListener('change',filter);document.getElementById('reveal').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=true);document.getElementById('hide').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=false);
</script></body></html>`;
}

function freezeMarkdown(): string {
  return `# BLR-CP-007 — Coded Relation Construction

Status: **English discovery frozen at \`BLR-QL-031..BLR-QL-035\`; permanent review runtime available; release and merge locked**.

## Permanent QLs

- \`BLR-QL-031 — SELECT_CODED_EXPRESSION\`
- \`BLR-QL-032 — COMPLETE_MISSING_CODE_TOKEN\`
- \`BLR-QL-033 — COMPLETE_ORDERED_CODE_TOKEN_PAIR\`
- \`BLR-QL-034 — COMPLETE_MISSING_PERSON\`
- \`BLR-QL-035 — SELECT_CODED_STATEMENT_BY_VALIDITY\`

Next available Blood Relations identity: \`BLR-QL-036\`.

## Frozen inventory

- 168 English review questions
- 21 source prototypes and topologies
- 5 permanent solve authorities
- 296 completed coded assertions
- 672 diagnostic option analyses
- 168 / 168 unique learner signatures
- 42 / 42 / 42 / 42 answer-position balance

## Guarantees

- every code meaning is supplied explicitly;
- symbols are never treated as arithmetic;
- every coded pair is interpreted left to right;
- one-token and two-token blanks preserve exact position and order;
- missing-person candidates are verified through the complete graph;
- validity questions independently compare decoded expressions with written claims;
- all displayed expressions exactly match the assertions consumed by the verifier;
- gender comes only from explicit gender-bearing relations, never from labels;
- family diagrams and ASCII fallbacks are retained.

## Boundary

Pure decoding remains CP-006. Open-ended code induction, Data Sufficiency, Question Studio, Question Bank, localisation, tests, publication, production staging and merge remain disabled.
`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-final-freeze-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007FrozenBank();
const telemetry = buildBlrCp007Telemetry(bank);
const summary = buildBlrCp007FinalFreezeSummary();

writeFileSync(resolve(outputDir, "blr-cp007-final-freeze-summary.json"), JSON.stringify({ ...telemetry, ...summary }, null, 2));
writeFileSync(resolve(outputDir, "blr-cp007-permanent-contracts.json"), JSON.stringify(BLR_CP007_CONTRACTS, null, 2));
writeFileSync(resolve(outputDir, "blr-cp007-final-freeze-records.jsonl"), bank.map((question) => JSON.stringify(question)).join("\n") + "\n");
writeFileSync(resolve(outputDir, "blr-cp007-final-freeze-records.csv"), [
  ["itemId","qlId","authority","prototype","seed","difficulty","stem","optionA","optionB","optionC","optionD","correctIndex","answer"].map(csv).join(","),
  ...bank.map((question) => [question.itemId, question.qlId, question.solveAuthority, question.sourcePrototypeId, question.seed, question.metadata.difficulty, question.stem, ...question.options.map((option) => option.text), question.correctIndex, question.answer].map(csv).join(",")),
].join("\n") + "\n");
writeFileSync(resolve(outputDir, "blr-cp007-final-freeze-review.html"), reviewHtml(bank));
writeFileSync(resolve(outputDir, "BLR-CP-007-FINAL-DISCOVERY-FREEZE.md"), freezeMarkdown());

console.log(JSON.stringify({
  outputDir,
  recordCount: bank.length,
  files: [
    "blr-cp007-final-freeze-summary.json",
    "blr-cp007-permanent-contracts.json",
    "blr-cp007-final-freeze-records.jsonl",
    "blr-cp007-final-freeze-records.csv",
    "blr-cp007-final-freeze-review.html",
    "BLR-CP-007-FINAL-DISCOVERY-FREEZE.md",
  ],
}, null, 2));
