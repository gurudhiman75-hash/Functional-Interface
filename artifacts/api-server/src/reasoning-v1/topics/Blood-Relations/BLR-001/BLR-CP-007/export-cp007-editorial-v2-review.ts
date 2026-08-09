import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  relationDisplay,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import {
  buildBlrCp007EditorialV2ReviewTelemetry,
  generateBlrCp007EditorialV2ReviewBank,
} from "./cp007-editorial-v2-review";
import type {
  GeneratedBlrCp007EditorialV2Question,
} from "./cp007-editorial-v2-model";

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

function directEdge(input: {
  statement: BlrCp006CodedStatement;
  relationId: BlrCp006DirectRelation;
}): { key: string; label: string } {
  const { statement, relationId } = input;
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

function displayEdges(question: GeneratedBlrCp007EditorialV2Question) {
  const direct = new Map<string, string>();
  question.completedStatements.forEach((statement) => {
    const relationId = question.codeKey.find((entry) => entry.token === statement.token)?.relationId;
    if (!relationId) return;
    const edge = directEdge({ statement, relationId });
    direct.set(edge.key, edge.label);
  });
  return question.explanation.diagramProof.edges.map((edge) => {
    const key = edge.type === "parent-child"
      ? `parent:${edge.sourceId}>${edge.targetId}`
      : edge.type === "sibling"
        ? `sibling:${pairKey(edge.sourceId, edge.targetId)}`
        : `spouse:${pairKey(edge.sourceId, edge.targetId)}`;
    return {
      ...edge,
      label: direct.get(key) ?? edge.label,
    };
  });
}

function svg(question: GeneratedBlrCp007EditorialV2Question): string {
  const tree = question.explanation.familyTree;
  const proof = question.explanation.diagramProof;
  const edges = displayEdges(question);
  const generations = [...new Set(tree.nodes.map((node) => node.generation))]
    .sort((left, right) => right - left);
  const rowIndex = new Map(generations.map((generation, index) => [generation, index]));
  const positions = new Map<string, { x: number; y: number }>();
  let widestRow = 1;
  generations.forEach((generation) => {
    const nodes = tree.nodes.filter((node) => node.generation === generation);
    widestRow = Math.max(widestRow, nodes.length);
    const rowWidth = Math.max(1, nodes.length - 1) * 180;
    const startX = 90 + Math.max(0, (widestRow - nodes.length) * 90);
    nodes.forEach((node, index) => {
      positions.set(node.id, {
        x: startX + (nodes.length === 1 ? rowWidth / 2 : index * 180),
        y: 70 + (rowIndex.get(generation) ?? 0) * 145,
      });
    });
  });
  const width = Math.max(360, 180 + (widestRow - 1) * 180);
  const height = Math.max(210, 145 + Math.max(1, generations.length - 1) * 145);
  const markerId = `arrow-${question.itemId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const renderedEdges = edges.map((edge) => {
    const source = positions.get(edge.sourceId);
    const target = positions.get(edge.targetId);
    if (!source || !target) return "";
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2 - 8;
    const classes = [
      "edge",
      edge.type,
      edge.evidence === "INFERRED" ? "inferred" : "coded",
      edge.highlighted ? "highlighted" : "",
    ].filter(Boolean).join(" ");
    const arrow = edge.type === "parent-child" ? ` marker-end="url(#${markerId})"` : "";
    return `<g class="edge-group"><line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" class="${classes}"${arrow}/><text class="edge-label" x="${midX}" y="${midY}">${esc(edge.label)}</text></g>`;
  }).join("");
  const renderedNodes = tree.nodes.map((node) => {
    const point = positions.get(node.id)!;
    const gender = node.gender === "male" ? "M" : node.gender === "female" ? "F" : "?";
    const queried = proof.pathPersonIds.includes(node.id) ? " queried" : "";
    return `<g class="node${queried}"><rect x="${point.x - 46}" y="${point.y - 25}" width="92" height="50" rx="11"/><text x="${point.x}" y="${point.y - 3}">${esc(node.label)}</text><text class="gender" x="${point.x}" y="${point.y + 16}">${gender}</text></g>`;
  }).join("");
  return `<figure class="diagram"><svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${markerId}-title ${markerId}-desc"><title id="${markerId}-title">${esc(proof.title)}</title><desc id="${markerId}-desc">${esc(proof.description)}</desc><defs><marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><polygon points="0 0, 8 3.5, 0 7"/></marker></defs>${renderedEdges}${renderedNodes}</svg><figcaption>${esc(proof.description)}</figcaption><div class="legend">${proof.legend.map((entry) => `<span>${esc(entry)}</span>`).join("")}</div></figure>`;
}

function proofPanel(question: GeneratedBlrCp007EditorialV2Question): string {
  const proof = question.reviewProof;
  const rows: readonly [string, unknown][] = [
    ["Question ID", proof.questionId],
    ["Seed", proof.seed],
    ["QL", proof.qlId],
    ["Prototype", proof.prototypeId],
    ["Task", proof.taskKind],
    ["Difficulty", proof.difficulty],
    ["Topology", proof.familyTopologyId],
    ["Target relation", proof.targetRelation ?? "claim-validity task"],
    ["Target path", proof.targetPath.join(" → ") || "direct claim comparison"],
    ["Semantic fingerprint", proof.semanticFingerprint],
    ["Independent solver", proof.independentSolverStatus],
    ["Unique correct options", proof.uniqueCorrectOptionCount],
    ["Graph validation", proof.graphValidityStatus],
    ["Renderer validation", proof.rendererValidationStatus],
    ["Dataset version", proof.datasetVersion],
    ["Review status", proof.reviewStatus],
    ["Reviewer note", proof.reviewerNote],
  ];
  return `<details class="proof"><summary>Administrator review proof</summary><dl>${rows.map(([term, value]) => `<div><dt>${esc(term)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl></details>`;
}

function card(question: GeneratedBlrCp007EditorialV2Question, index: number): string {
  const options = question.options.map((option, optionIndex) => `<li><span class="letter">${"ABCD"[optionIndex]}.</span> ${esc(option.text)}</li>`).join("");
  const key = question.codeKey.map((entry) => `<span class="key-chip"><b>${esc(entry.token)}</b> = is the ${esc(relationText(entry.relationId))} of</span>`).join("");
  const analyses = question.explanation.optionAnalysis.map((entry) => {
    const state = entry.isCorrectAnswerForTask ? "correct-choice" : "not-choice";
    const validity = entry.statementValidity === "NOT_APPLICABLE" ? "" : ` · statement ${entry.statementValidity.toLocaleLowerCase("en-IN")}`;
    const code = entry.failureCode ? ` · ${entry.failureCode}` : "";
    return `<li class="${state}"><strong>${entry.optionLabel}. ${esc(entry.optionText)}</strong><span class="diagnostic">${validity}${code}</span><p>${esc(entry.explanation)}</p></li>`;
  }).join("");
  const optionalShortcut = question.explanation.shortcut
    ? `<h3>Exam shortcut</h3><p>${esc(question.explanation.shortcut)}</p>`
    : "";
  const optionalTrap = question.explanation.commonTrap
    ? `<h3>Closest trap</h3><p>${esc(question.explanation.commonTrap)}</p>`
    : "";
  const search = [
    question.itemId,
    question.qlId,
    question.sourcePrototypeId,
    question.topologyId,
    question.stem,
    question.answer,
    question.explanation.mode,
  ].join(" ").toLocaleLowerCase("en-IN");
  return `<article class="card" data-ql="${question.qlId}" data-search="${esc(search)}"><header><div><span class="number">#${index + 1}</span><span class="ql">${question.qlId}</span></div><div><span class="mode">${esc(question.explanation.mode)}</span><span class="difficulty">${question.metadata.difficulty}</span></div></header><div class="meta">${esc(question.sourcePrototypeId)} · ${esc(question.topologyId)}</div><div class="key">${key}</div><p class="prompt">${esc(question.sharedPrompt)}</p><pre class="stem">${esc(question.stem)}</pre><ol class="options">${options}</ol><details class="answer"><summary>Reveal answer and explanation</summary><div class="answer-line"><strong>Correct answer:</strong> ${"ABCD"[question.correctIndex]}. ${esc(question.answer)}</div><h3>How to solve</h3><ol class="steps">${question.explanation.steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol><p class="conclusion"><strong>Therefore:</strong> ${esc(question.explanation.conclusion)}</p>${optionalShortcut}${optionalTrap}<h3>Why each option works or fails</h3><ul class="analyses">${analyses}</ul><h3>Combined family diagram</h3>${svg(question)}<details class="ascii"><summary>ASCII fallback</summary><pre>${esc(question.explanation.familyTree.asciiFallback)}</pre></details>${proofPanel(question)}</details></article>`;
}

function reviewHtml(bank: readonly GeneratedBlrCp007EditorialV2Question[]): string {
  const qls = [...new Set(bank.map((question) => question.qlId))];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 Editorial V2 Human Review</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#172033;background:#f4f6fa}*{box-sizing:border-box}body{margin:0}.hero{padding:28px 24px;background:#172033;color:#fff}.hero h1{margin:0 0 8px;font-size:clamp(24px,4vw,38px)}.hero p{margin:5px 0;color:#d9e1f2}.warning{display:inline-block;margin-top:10px;padding:8px 11px;border:1px solid #ffcc76;border-radius:9px;background:#4d3410;color:#fff2d2;font-weight:800}.controls{position:sticky;top:0;z-index:5;display:flex;gap:10px;flex-wrap:wrap;padding:12px 18px;background:#fff;border-bottom:1px solid #dbe1ea}.controls input,.controls select,.controls button{font:inherit;padding:9px 12px;border:1px solid #c8d0dc;border-radius:9px;background:#fff}.controls input{min-width:280px}main{max-width:1180px;margin:20px auto;padding:0 14px}.card{background:#fff;border:1px solid #dbe1ea;border-radius:16px;padding:18px;margin:0 0 18px;box-shadow:0 5px 18px #1720330d}.card header{display:flex;justify-content:space-between;gap:10px;align-items:center}.number{font-weight:800;margin-right:10px}.ql,.mode,.difficulty{display:inline-block;padding:5px 9px;border-radius:999px;font-size:12px;font-weight:800}.ql{background:#e9efff}.mode{background:#eef7f2;margin-right:6px}.difficulty{background:#fff2d8}.meta{font-size:12px;color:#687386;margin:8px 0 12px}.key{display:flex;gap:7px;flex-wrap:wrap}.key-chip{background:#eef7f2;border:1px solid #cce7d7;padding:7px 9px;border-radius:9px}.prompt{color:#4d596b}.stem{white-space:pre-wrap;font:600 16px/1.55 Inter,system-ui,sans-serif;background:#f8fafc;padding:14px;border-radius:11px}.options{padding-left:24px}.options li{padding:7px 4px}.letter{font-weight:800}.answer{margin-top:12px;border-top:1px solid #e2e7ef;padding-top:12px}.answer summary{cursor:pointer;font-weight:800}.answer-line{margin:14px 0;padding:12px;background:#eef7f2;border-radius:10px}.conclusion{padding:11px;background:#fff8df;border-radius:10px}.analyses{list-style:none;padding:0}.analyses li{border-left:4px solid #b8c1d1;background:#f8fafc;padding:10px 12px;margin:8px 0}.analyses li.correct-choice{border-color:#2b8a57;background:#effaf4}.diagnostic{display:block;color:#6b7688;font-size:12px;margin-top:3px}.analyses p{margin:7px 0 0}.diagram{margin:10px 0;border:1px solid #dbe1ea;border-radius:12px;background:#fbfcfe;padding:10px;overflow:auto}.diagram svg{display:block;width:100%;min-width:340px;height:auto}.edge{stroke:#53627a;stroke-width:2;fill:none}.edge.inferred{stroke-dasharray:8 6;opacity:.72}.edge.highlighted{stroke:#aa3d21;stroke-width:5}.marriage{stroke:#76538b}.sibling{stroke:#697386}.parent-child{stroke:#355d9a}.edge-label{text-anchor:middle;font-size:10px;fill:#33405a;paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round}.node rect{fill:#fff;stroke:#45536b;stroke-width:2}.node.queried rect{stroke:#aa3d21;stroke-width:4}.node text{text-anchor:middle;font-weight:800;font-size:14px}.node .gender{font-size:11px;font-weight:600;fill:#69758a}.diagram figcaption{padding:8px 4px;color:#4d596b}.legend{display:flex;gap:6px;flex-wrap:wrap}.legend span{font-size:11px;background:#eef1f6;padding:5px 7px;border-radius:7px}.ascii pre{white-space:pre-wrap}.proof{margin-top:12px;border:1px dashed #8a96a8;padding:10px;border-radius:10px}.proof dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:7px}.proof dl div{background:#f5f7fa;padding:8px;border-radius:7px}.proof dt{font-size:11px;color:#687386}.proof dd{margin:4px 0 0;font-weight:700;overflow-wrap:anywhere}.hidden{display:none!important}@media(max-width:700px){.hero{padding:20px 15px}.controls{padding:10px}.controls input{width:100%;min-width:0}.card{padding:14px}.stem{font-size:15px}.card header{align-items:flex-start;flex-direction:column}.diagram svg{min-width:320px}}
</style></head><body><section class="hero"><h1>BLR-CP-007 — Editorial V2 Human Review</h1><p>${bank.length} English review questions · 21 source prototypes · 5 permanent QLs</p><p>Option security, statement polarity, adaptive explanations, missing-person candidates, diagram semantics and review metadata have been remediated.</p><span class="warning">Human review required — this is not a final freeze or release artifact.</span></section><section class="controls"><input id="search" placeholder="Search question, QL, prototype or explanation mode"/><select id="ql"><option value="">All QLs</option>${qls.map((ql) => `<option>${ql}</option>`).join("")}</select><button id="reveal">Reveal all</button><button id="hide">Hide all</button><span id="count">${bank.length} shown</span></section><main>${bank.map(card).join("")}</main><script>
const cards=[...document.querySelectorAll('.card')],search=document.getElementById('search'),ql=document.getElementById('ql'),count=document.getElementById('count');function filter(){const text=search.value.toLowerCase().trim(),q=ql.value;let shown=0;cards.forEach(card=>{const ok=(!text||card.dataset.search.includes(text))&&(!q||card.dataset.ql===q);card.classList.toggle('hidden',!ok);if(ok)shown++});count.textContent=shown+' shown'}search.addEventListener('input',filter);ql.addEventListener('change',filter);document.getElementById('reveal').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=true);document.getElementById('hide').onclick=()=>document.querySelectorAll('.answer').forEach(x=>x.open=false);
</script></body></html>`;
}

function statusMarkdown(): string {
  return `# BLR-CP-007 — Editorial V2 Remediation Review\n\nStatus: **executable human-review candidate; V1 final-freeze review superseded; manual freeze and release blocked**.\n\n## Permanent identity\n\nThe five permanent QLs remain unchanged:\n\n- \`BLR-QL-031 — SELECT_CODED_EXPRESSION\`;\n- \`BLR-QL-032 — COMPLETE_MISSING_CODE_TOKEN\`;\n- \`BLR-QL-033 — COMPLETE_ORDERED_CODE_TOKEN_PAIR\`;\n- \`BLR-QL-034 — COMPLETE_MISSING_PERSON\`;\n- \`BLR-QL-035 — SELECT_CODED_STATEMENT_BY_VALIDITY\`.\n\n## Confirmed V2 remediation\n\n- prototype-local cyclic answer rotations replaced with seeded Fisher-Yates ordering;\n- statement validity separated from correctness-for-task;\n- all 16 selected invalid statements and 48 valid unselected statements explained with correct polarity;\n- all 672 options receive specific diagnostic explanations;\n- QL-034 uses existing candidates P/Q/R/S, each correct eight times, with all 128 substitutions graph-valid;\n- semicolon formatting occurs in both correct and wrong options;\n- explanations are selected by reasoning need rather than a forced audit template;\n- diagram proof exposes directional labels, coded versus inferred evidence, highlighted query path and accessibility description;\n- full-sibling V1 policy is explicit;\n- every review card exposes ID, seed, topology, fingerprint, solver status, uniqueness, renderer status and human-review state.\n\n## Remaining gate\n\nThis artifact does not grant final freeze. Human review must assess exam realism, relation-target breadth, QL-033 construction depth, QL-034 naturalness, diagram readability and overall explanation quality. Only an approved immutable V2 dataset may proceed to chapter-wide audit, localisation or release work.\n`;
}

const outputDir = resolve(process.argv[2] ?? "cp007-editorial-v2-review-output");
mkdirSync(outputDir, { recursive: true });
const bank = generateBlrCp007EditorialV2ReviewBank();
const telemetry = buildBlrCp007EditorialV2ReviewTelemetry(bank);

writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-summary.json"), JSON.stringify(telemetry, null, 2));
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-records.jsonl"), bank.map((question) => JSON.stringify(question)).join("\n") + "\n");
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-records.csv"), [
  ["itemId","qlId","authority","prototype","seed","difficulty","explanationMode","stem","optionA","optionB","optionC","optionD","correctIndex","answer","fingerprint","reviewStatus"].map(csv).join(","),
  ...bank.map((question) => [question.itemId, question.qlId, question.solveAuthority, question.sourcePrototypeId, question.seed, question.metadata.difficulty, question.explanation.mode, question.stem, ...question.options.map((option) => option.text), question.correctIndex, question.answer, question.metadata.semanticFingerprint, question.reviewProof.reviewStatus].map(csv).join(",")),
].join("\n") + "\n");
writeFileSync(resolve(outputDir, "blr-cp007-editorial-v2-review.html"), reviewHtml(bank));
writeFileSync(resolve(outputDir, "BLR-CP-007-EDITORIAL-V2-REMEDIATION.md"), statusMarkdown());

console.log(JSON.stringify({
  outputDir,
  recordCount: bank.length,
  telemetry,
  files: [
    "blr-cp007-editorial-v2-summary.json",
    "blr-cp007-editorial-v2-records.jsonl",
    "blr-cp007-editorial-v2-records.csv",
    "blr-cp007-editorial-v2-review.html",
    "BLR-CP-007-EDITORIAL-V2-REMEDIATION.md",
  ],
}, null, 2));
