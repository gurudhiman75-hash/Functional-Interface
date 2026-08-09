import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  relationDisplay,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import {
  buildBlrCp007EditorialV2FinalReviewTelemetry,
  generateBlrCp007EditorialV2FinalReviewBank,
} from "./cp007-editorial-v2-final-review";
import type { GeneratedBlrCp007EditorialV2Question } from "./cp007-editorial-v2-model";

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

function relationText(value: BlrCp006Relation | undefined): string {
  return value
    ? relationDisplay(value).toLocaleLowerCase("en-IN")
    : "relation not established";
}

function pairKey(left: string, right: string): string {
  return [left, right].sort((a, b) => a.localeCompare(b, "en-IN")).join("|");
}

function directEdge(
  statement: BlrCp006CodedStatement,
  relationId: BlrCp006DirectRelation,
): { key: string; label: string } {
  const label = `${statement.leftId} is the ${relationText(relationId)} of ${statement.rightId}`;
  if (relationId === "FATHER" || relationId === "MOTHER") {
    return { key: `parent:${statement.leftId}>${statement.rightId}`, label };
  }
  if (relationId === "SON" || relationId === "DAUGHTER") {
    return { key: `parent:${statement.rightId}>${statement.leftId}`, label };
  }
  if (relationId === "BROTHER" || relationId === "SISTER") {
    return { key: `sibling:${pairKey(statement.leftId, statement.rightId)}`, label };
  }
  return { key: `spouse:${pairKey(statement.leftId, statement.rightId)}`, label };
}

function reviewEdges(question: GeneratedBlrCp007EditorialV2Question) {
  const direct = new Map<string, string>();
  question.completedStatements.forEach((statement) => {
    const relationId = question.codeKey.find((entry) => entry.token === statement.token)?.relationId;
    if (!relationId) return;
    const value = directEdge(statement, relationId);
    direct.set(value.key, value.label);
  });
  return question.explanation.diagramProof.edges.map((edge) => {
    const key = edge.type === "parent-child"
      ? `parent:${edge.sourceId}>${edge.targetId}`
      : edge.type === "sibling"
        ? `sibling:${pairKey(edge.sourceId, edge.targetId)}`
        : `spouse:${pairKey(edge.sourceId, edge.targetId)}`;
    return { ...edge, label: direct.get(key) ?? edge.label };
  });
}

function svg(question: GeneratedBlrCp007EditorialV2Question): string {
  const tree = question.explanation.familyTree;
  const proof = question.explanation.diagramProof;
  const edges = reviewEdges(question);
  const rows = [...new Set(tree.nodes.map((node) => node.generation))]
    .sort((left, right) => right - left);
  const positions = new Map<string, { x: number; y: number }>();
  let widest = 1;
  rows.forEach((generation, row) => {
    const nodes = tree.nodes.filter((node) => node.generation === generation);
    widest = Math.max(widest, nodes.length);
    nodes.forEach((node, index) => {
      positions.set(node.id, {
        x: 90 + index * 190,
        y: 70 + row * 150,
      });
    });
  });
  const width = Math.max(360, 180 + (widest - 1) * 190);
  const height = Math.max(210, 145 + Math.max(1, rows.length - 1) * 150);
  const id = question.itemId.replace(/[^a-zA-Z0-9]/g, "");
  const edgeMarkup = edges.map((edge) => {
    const source = positions.get(edge.sourceId);
    const target = positions.get(edge.targetId);
    if (!source || !target) return "";
    const classes = [
      "edge",
      edge.type,
      edge.evidence === "INFERRED" ? "inferred" : "coded",
      edge.highlighted ? "highlighted" : "",
    ].filter(Boolean).join(" ");
    const arrow = edge.type === "parent-child" ? ` marker-end="url(#arrow-${id})"` : "";
    const labelX = (source.x + target.x) / 2;
    const labelY = (source.y + target.y) / 2 - 9;
    return `<g><line class="${classes}" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}"${arrow}/><text class="edge-label" x="${labelX}" y="${labelY}">${esc(edge.label)}</text></g>`;
  }).join("");
  const nodeMarkup = tree.nodes.map((node) => {
    const point = positions.get(node.id)!;
    const gender = node.gender === "male" ? "M" : node.gender === "female" ? "F" : "?";
    const queried = proof.pathPersonIds.includes(node.id) ? " queried" : "";
    return `<g class="node${queried}"><rect x="${point.x - 45}" y="${point.y - 25}" width="90" height="50" rx="10"/><text x="${point.x}" y="${point.y - 3}">${esc(node.label)}</text><text class="gender" x="${point.x}" y="${point.y + 16}">${gender}</text></g>`;
  }).join("");
  return `<figure class="diagram"><svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title-${id} desc-${id}"><title id="title-${id}">${esc(proof.title)}</title><desc id="desc-${id}">${esc(proof.description)}</desc><defs><marker id="arrow-${id}" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><polygon points="0 0,8 3.5,0 7"/></marker></defs>${edgeMarkup}${nodeMarkup}</svg><figcaption>${esc(proof.description)}</figcaption><div class="legend">${proof.legend.map((entry) => `<span>${esc(entry)}</span>`).join("")}</div></figure>`;
}

function proofPanel(question: GeneratedBlrCp007EditorialV2Question): string {
  const proof = question.reviewProof;
  const values: readonly [string, unknown][] = [
    ["Question ID", proof.questionId],
    ["Seed", proof.seed],
    ["QL / prototype", `${proof.qlId} / ${proof.prototypeId}`],
    ["Task / difficulty", `${proof.taskKind} / ${proof.difficulty}`],
    ["Topology", proof.familyTopologyId],
    ["Target relation", proof.targetRelation ?? "claim-validity task"],
    ["Target path", proof.targetPath.join(" → ") || "direct claim comparison"],
    ["Semantic fingerprint", proof.semanticFingerprint],
    ["Independent solver", proof.independentSolverStatus],
    ["Unique correct options", proof.uniqueCorrectOptionCount],
    ["Graph / renderer", `${proof.graphValidityStatus} / ${proof.rendererValidationStatus}`],
    ["Dataset version", proof.datasetVersion],
    ["Review status", proof.reviewStatus],
    ["Reviewer note", proof.reviewerNote],
  ];
  return `<details class="proof"><summary>Administrator review proof</summary><dl>${values.map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl></details>`;
}

function card(question: GeneratedBlrCp007EditorialV2Question, index: number): string {
  const key = question.codeKey.map((entry) => `<span class="chip"><b>${esc(entry.token)}</b> = is the ${esc(relationText(entry.relationId))} of</span>`).join("");
  const options = question.options.map((option, optionIndex) => `<li><b>${"ABCD"[optionIndex]}.</b> ${esc(option.text)}</li>`).join("");
  const analyses = question.explanation.optionAnalysis.map((entry) => `<li class="${entry.isCorrectAnswerForTask ? "selected" : ""}"><strong>${entry.optionLabel}. ${esc(entry.optionText)}</strong><small>${entry.statementValidity === "NOT_APPLICABLE" ? "" : `Statement ${entry.statementValidity.toLocaleLowerCase("en-IN")} · `}${entry.failureCode ?? "correct route"}</small><p>${esc(entry.explanation)}</p></li>`).join("");
  const search = [question.itemId, question.qlId, question.sourcePrototypeId, question.stem, question.answer, question.explanation.mode].join(" ").toLocaleLowerCase("en-IN");
  return `<article class="card" data-ql="${question.qlId}" data-search="${esc(search)}"><header><div><span class="number">#${index + 1}</span><span class="ql">${question.qlId}</span></div><div><span class="mode">${esc(question.explanation.mode)}</span><span class="difficulty">${question.metadata.difficulty}</span></div></header><p class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.topologyId)}</p><div class="key">${key}</div><p class="prompt">${esc(question.sharedPrompt)}</p><pre class="stem">${esc(question.stem)}</pre><ol class="options">${options}</ol><details class="answer"><summary>Reveal answer and explanation</summary><p class="answer-line"><strong>Correct answer:</strong> ${"ABCD"[question.correctIndex]}. ${esc(question.answer)}</p><h3>How to solve</h3><ol>${question.explanation.steps.map((entry) => `<li>${esc(entry)}</li>`).join("")}</ol><p class="conclusion"><strong>Therefore:</strong> ${esc(question.explanation.conclusion)}</p>${question.explanation.shortcut ? `<h3>Exam shortcut</h3><p>${esc(question.explanation.shortcut)}</p>` : ""}${question.explanation.commonTrap ? `<h3>Closest trap</h3><p>${esc(question.explanation.commonTrap)}</p>` : ""}<h3>Why each option works or fails</h3><ul class="analyses">${analyses}</ul><h3>Combined family diagram</h3>${svg(question)}<details><summary>ASCII fallback</summary><pre>${esc(question.explanation.familyTree.asciiFallback)}</pre></details>${proofPanel(question)}</details></article>`;
}

function html(bank: readonly GeneratedBlrCp007EditorialV2Question[]): string {
  const qls = [...new Set(bank.map((question) => question.qlId))];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 Editorial V2 Final Human Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f4f6fa}*{box-sizing:border-box}body{margin:0}.hero{padding:28px 24px;background:#172033;color:#fff}.hero h1{margin:0 0 8px;font-size:clamp(24px,4vw,38px)}.hero p{margin:5px 0;color:#d9e1f2}.warning{display:inline-block;margin-top:10px;padding:8px 11px;border:1px solid #ffcc76;border-radius:9px;background:#4d3410;color:#fff2d2;font-weight:800}.controls{position:sticky;top:0;z-index:5;display:flex;gap:10px;flex-wrap:wrap;padding:12px 18px;background:#fff;border-bottom:1px solid #dbe1ea}.controls input,.controls select,.controls button{font:inherit;padding:9px 12px;border:1px solid #c8d0dc;border-radius:9px;background:#fff}.controls input{min-width:280px}main{max-width:1180px;margin:20px auto;padding:0 14px}.card{background:#fff;border:1px solid #dbe1ea;border-radius:16px;padding:18px;margin:0 0 18px;box-shadow:0 5px 18px #1720330d}.card header{display:flex;justify-content:space-between;gap:10px;align-items:center}.number{font-weight:800;margin-right:10px}.ql,.mode,.difficulty{display:inline-block;padding:5px 9px;border-radius:999px;font-size:12px;font-weight:800}.ql{background:#e9efff}.mode{background:#eef7f2;margin-right:6px}.difficulty{background:#fff2d8}.meta{font-size:12px;color:#687386}.key{display:flex;gap:7px;flex-wrap:wrap}.chip{background:#eef7f2;border:1px solid #cce7d7;padding:7px 9px;border-radius:9px}.prompt{color:#4d596b}.stem{white-space:pre-wrap;font:600 16px/1.55 Inter,system-ui,sans-serif;background:#f8fafc;padding:14px;border-radius:11px}.options{padding-left:24px}.options li{padding:7px 4px}.answer{margin-top:12px;border-top:1px solid #e2e7ef;padding-top:12px}.answer summary{cursor:pointer;font-weight:800}.answer-line{padding:12px;background:#eef7f2;border-radius:10px}.conclusion{padding:11px;background:#fff8df;border-radius:10px}.analyses{list-style:none;padding:0}.analyses li{border-left:4px solid #b8c1d1;background:#f8fafc;padding:10px 12px;margin:8px 0}.analyses li.selected{border-color:#2b8a57;background:#effaf4}.analyses small{display:block;color:#687386;margin-top:4px}.analyses p{margin:7px 0 0}.diagram{border:1px solid #dbe1ea;border-radius:12px;background:#fbfcfe;padding:10px;overflow:auto}.diagram svg{display:block;width:100%;min-width:340px;height:auto}.edge{stroke:#53627a;stroke-width:2;fill:none}.edge.inferred{stroke-dasharray:8 6;opacity:.72}.edge.highlighted{stroke:#aa3d21;stroke-width:5}.marriage{stroke:#76538b}.sibling{stroke:#697386}.parent-child{stroke:#355d9a}.edge-label{text-anchor:middle;font-size:10px;fill:#33405a;paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round}.node rect{fill:#fff;stroke:#45536b;stroke-width:2}.node.queried rect{stroke:#aa3d21;stroke-width:4}.node text{text-anchor:middle;font-weight:800;font-size:14px}.node .gender{font-size:11px;font-weight:600;fill:#69758a}.legend{display:flex;gap:6px;flex-wrap:wrap}.legend span{font-size:11px;background:#eef1f6;padding:5px 7px;border-radius:7px}.proof{margin-top:12px;border:1px dashed #8a96a8;padding:10px;border-radius:10px}.proof dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:7px}.proof dl div{background:#f5f7fa;padding:8px;border-radius:7px}.proof dt{font-size:11px;color:#687386}.proof dd{margin:4px 0 0;font-weight:700;overflow-wrap:anywhere}.hidden{display:none!important}@media(max-width:700px){.hero{padding:20px 15px}.controls{padding:10px}.controls input{width:100%;min-width:0}.card{padding:14px}.card header{align-items:flex-start;flex-direction:column}.diagram svg{min-width:320px}}
</style></head><body><section class="hero"><h1>BLR-CP-007 — Editorial V2 Final Human Review</h1><p>${bank.length} English questions · 21 source prototypes · 5 permanent QLs</p><p>V1 solver authority is preserved; option security, explanations, QL-034 candidates, diagrams and review proof are remediated.</p><span class="warning">Human review required — not frozen, localised, staged or released.</span></section><section class="controls"><input id="search" placeholder="Search question, QL, prototype or mode"/><select id="ql"><option value="">All QLs</option>${qls.map((ql) => `<option>${ql}</option>`).join("")}</select><button id="reveal">Reveal all</button><button id="hide">Hide all</button><span id="count">${bank.length} shown</span></section><main>${bank.map(card).join("")}</main><script>
const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),ql=document.getElementById('ql'),count=document.getElementById('count');function filter(){const text=search.value.toLowerCase().trim(),q=ql.value;let shown=0;cards.forEach(card=>{const ok=(!text||card.dataset.search.includes(text))&&(!q||card.dataset.ql===q);card.classList.toggle('hidden',!ok);if(ok)shown++});count.textContent=shown+' shown'}search.addEventListener('input',filter);ql.addEventListener('change',filter);document.getElementById('reveal').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=true);document.getElementById('hide').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=false);
</script></body></html>`;
}

function markdown(): string {
  return `# BLR-CP-007 — Editorial V2 Final Human-Review Candidate\n\nStatus: **executable remediation complete; human approval required; V1 final-freeze review superseded**.\n\nThe five permanent QLs and graph solver remain unchanged. V2 remediates answer-sequence leakage, generic option explanations, invalid-statement polarity, semicolon leakage, QL-034 filler candidates, forced explanation sections, diagram direction/evidence semantics, accessibility and missing freeze-proof metadata.\n\nQL-034 now lists P, Q, R and S naturally as the candidates and uses only the decisive coded family statements. Every one of the 128 substitutions remains graph-valid, and each candidate is correct exactly eight times.\n\nThe artifact remains review-only. Relation-target breadth, exam realism, difficulty calibration and final wording must be approved manually before any chapter freeze, localisation, Question Studio work or release.\n`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v2-final-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV2FinalReviewBank();
const telemetry = buildBlrCp007EditorialV2FinalReviewTelemetry(bank);
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-final-summary.json"), JSON.stringify(telemetry, null, 2));
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-final-records.jsonl"), bank.map((question) => JSON.stringify(question)).join("\n") + "\n");
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-final-records.csv"), [
  ["itemId","qlId","authority","prototype","seed","difficulty","explanationMode","stem","optionA","optionB","optionC","optionD","correctIndex","answer","fingerprint","reviewStatus"].map(csv).join(","),
  ...bank.map((question) => [question.itemId, question.qlId, question.solveAuthority, question.sourcePrototypeId, question.seed, question.metadata.difficulty, question.explanation.mode, question.stem, ...question.options.map((option) => option.text), question.correctIndex, question.answer, question.metadata.semanticFingerprint, question.reviewProof.reviewStatus].map(csv).join(",")),
].join("\n") + "\n");
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-final-review.html"), html(bank));
writeFileSync(resolve(outputDir, "BLR-CP-007-EDITORIAL-V2-FINAL-REVIEW.md"), markdown());
console.log(JSON.stringify({
  outputDir,
  recordCount: bank.length,
  telemetry,
  files: [
    "blr-cp007-editorial-v2-final-summary.json",
    "blr-cp007-editorial-v2-final-records.jsonl",
    "blr-cp007-editorial-v2-final-records.csv",
    "blr-cp007-editorial-v2-final-review.html",
    "BLR-CP-007-EDITORIAL-V2-FINAL-REVIEW.md",
  ],
}, null, 2));
