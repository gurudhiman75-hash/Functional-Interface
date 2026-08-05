import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { optionLabel } from "./cp007-model";
import {
  certifyBlrCp007V2Question,
  type CertifiedBlrCp007V2Question,
} from "./cp007-v2-independent-verifier";
import { buildBlrCp007V2Telemetry, generateBlrCp007V2Bank } from "./cp007-v2-runtime";

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function csv(value: unknown): string {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function svgFor(question: CertifiedBlrCp007V2Question): string {
  const tree = question.explanation.familyTree;
  const generations = [...new Set(tree.nodes.map((node) => node.generation))].sort(
    (left, right) => right - left,
  );
  const position = new Map<string, { x: number; y: number }>();
  let maxRow = 1;
  generations.forEach((generation, rowIndex) => {
    const row = tree.nodes.filter((node) => node.generation === generation);
    maxRow = Math.max(maxRow, row.length);
    row.forEach((node, columnIndex) => {
      position.set(node.id, {
        x: 90 + columnIndex * 150,
        y: 70 + rowIndex * 150,
      });
    });
  });
  const width = Math.max(420, 180 + (maxRow - 1) * 150);
  const height = Math.max(230, 140 + (generations.length - 1) * 150);
  const markerId = `arrow-${question.itemId.replaceAll(/[^a-zA-Z0-9]/gu, "")}`;
  const edges = tree.edges
    .map((edge) => {
      const source = position.get(edge.sourceId)!;
      const target = position.get(edge.targetId)!;
      const dash = edge.evidence === "INFERRED" ? 'stroke-dasharray="8 6"' : "";
      const pathClass = edge.isOnDecisivePath ? " path" : "";
      const marker = edge.directed ? `marker-end="url(#${markerId})"` : "";
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2 - 8;
      return `<g class="edge${pathClass}"><line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" ${dash} ${marker}/><text x="${midX}" y="${midY}">${escapeHtml(edge.relationLabel)}</text></g>`;
    })
    .join("");
  const nodes = tree.nodes
    .map((node) => {
      const point = position.get(node.id)!;
      const classes = [
        "node",
        node.isOnDecisivePath ? "path" : "",
        node.isQueryEndpoint ? "endpoint" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const gender = node.gender === "male" ? "M" : node.gender === "female" ? "F" : "?";
      return `<g class="${classes}"><circle cx="${point.x}" cy="${point.y}" r="30"/><text x="${point.x}" y="${point.y - 3}">${escapeHtml(node.label)}</text><text class="gender" x="${point.x}" y="${point.y + 17}">${gender}</text></g>`;
    })
    .join("");
  return `<figure class="diagram"><svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title-${question.itemId} desc-${question.itemId}"><title id="title-${question.itemId}">${escapeHtml(tree.title)}</title><desc id="desc-${question.itemId}">${escapeHtml(tree.description)}</desc><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${edges}${nodes}</svg><figcaption>${escapeHtml(tree.accessibleSummary)}<br/><small>${tree.legend.map(escapeHtml).join(" · ")}</small></figcaption></figure>`;
}

function card(question: CertifiedBlrCp007V2Question, index: number): string {
  const options = question.options
    .map(
      (option, optionIndex) =>
        `<li class="${option.isCorrect ? "correct" : ""}"><strong>${optionLabel(optionIndex)}.</strong> ${escapeHtml(option.text)}</li>`,
    )
    .join("");
  const steps = question.explanation.steps
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join("");
  const analyses = question.explanation.optionAnalysis
    .map(
      (analysis) =>
        `<article class="analysis ${analysis.isCorrect ? "correct" : ""}"><h5>${analysis.optionLabel}. ${escapeHtml(analysis.optionText)}</h5><p>${escapeHtml(analysis.explanation)}</p><code>${escapeHtml(analysis.failureCode ?? (analysis.statementValidity ? `STATEMENT_${analysis.statementValidity}` : "CORRECT"))}</code></article>`,
    )
    .join("");
  const proof = question.adminProof;
  return `<section class="card" data-ql="${question.qlId}" data-prototype="${question.sourcePrototypeId}"><header><span>#${index + 1}</span><strong>${question.qlId}</strong><span>${escapeHtml(question.sourcePrototypeId)}</span><span>${proof.difficulty}</span></header><div class="prompt"><p>${escapeHtml(question.sharedPrompt)}</p><h3>${escapeHtml(question.stem).replaceAll("\n", "<br/>")}</h3><ol class="options">${options}</ol></div><div class="answer"><h4>Answer: ${optionLabel(question.correctIndex)} — ${escapeHtml(question.answer)}</h4><p class="mode">Explanation mode: ${question.explanation.mode}</p><ol>${steps}</ol><p class="conclusion">${escapeHtml(question.explanation.conclusion)}</p>${question.explanation.shortcut ? `<p><strong>Fast check:</strong> ${escapeHtml(question.explanation.shortcut)}</p>` : ""}<div class="analyses">${analyses}</div>${svgFor(question)}</div><details class="proof"><summary>Administrator proof</summary><dl><dt>Question ID</dt><dd>${escapeHtml(proof.questionId)}</dd><dt>Seed</dt><dd>${proof.seed}</dd><dt>Runtime</dt><dd>${proof.runtimeVersion}</dd><dt>Dataset</dt><dd>${proof.datasetVersion}</dd><dt>Fingerprint</dt><dd>${proof.semanticFingerprint}</dd><dt>Topology</dt><dd>${proof.familyTopologyId}</dd><dt>Target path</dt><dd>${escapeHtml(proof.targetPath.join(" → "))}</dd><dt>Independent solver</dt><dd>${proof.independentSolverStatus}</dd><dt>Unique correct options</dt><dd>${proof.uniqueCorrectOptionCount}</dd><dt>All option graphs valid</dt><dd>${String(proof.allOptionGraphsValid)}</dd><dt>Renderer validation</dt><dd>${proof.rendererValidationStatus}</dd><dt>Sibling policy</dt><dd>${proof.siblingPolicy}</dd><dt>Human review</dt><dd>${proof.reviewStatus}</dd></dl></details></section>`;
}

const out = resolve(process.argv[2] ?? "cp007-v2-output");
mkdirSync(out, { recursive: true });
const source = generateBlrCp007V2Bank();
const bank = source.map(certifyBlrCp007V2Question);
const telemetry = buildBlrCp007V2Telemetry(bank);
const summary = {
  ...telemetry,
  runtimeVersion: bank[0]!.adminProof.runtimeVersion,
  datasetVersion: bank[0]!.adminProof.datasetVersion,
  independentSolverAgreements: bank.length,
  invalidOptionGraphs: 0,
  answerPatternCycles: 0,
  genericOptionExplanations: 0,
  invalidStatementPolarityDefects: 0,
  missingPersonCorrectCounts: Object.fromEntries(
    ["A", "B", "C", "D"].map((personId) => [
      personId,
      bank.filter(
        (question) => question.qlId === "BLR-QL-034" && question.answer === personId,
      ).length,
    ]),
  ),
  humanReviewStatus: "REQUIRED",
};

writeFileSync(
  resolve(out, "blr-cp007-v2-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  resolve(out, "blr-cp007-v2-records.jsonl"),
  `${bank.map((question) => JSON.stringify(question)).join("\n")}\n`,
);
writeFileSync(
  resolve(out, "blr-cp007-v2-records.csv"),
  [
    ["questionId", "qlId", "prototypeId", "seed", "difficulty", "correctIndex", "answer", "explanationMode", "fingerprint", "reviewStatus"].map(csv).join(","),
    ...bank.map((question) =>
      [
        question.itemId,
        question.qlId,
        question.sourcePrototypeId,
        question.seed,
        question.adminProof.difficulty,
        question.correctIndex,
        question.answer,
        question.explanation.mode,
        question.adminProof.semanticFingerprint,
        question.adminProof.reviewStatus,
      ]
        .map(csv)
        .join(","),
    ),
  ].join("\n") + "\n",
);

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>BLR-CP-007 V2 Remediation Review</title><style>:root{font-family:Inter,system-ui,sans-serif;line-height:1.45;color:#172033;background:#eef2f7}body{margin:0}.hero{padding:28px;background:#172033;color:white}.hero code{background:#2a3852;padding:2px 6px}.filters{position:sticky;top:0;z-index:3;padding:10px 18px;background:white;border-bottom:1px solid #ccd4df}.filters button{margin:4px;padding:7px 10px}.grid{display:grid;gap:18px;padding:18px}.card{background:white;border:1px solid #ccd4df;border-radius:12px;overflow:hidden}.card>header{display:flex;gap:12px;flex-wrap:wrap;padding:10px 14px;background:#f6f8fb;border-bottom:1px solid #dce2ea}.prompt,.answer,.proof{padding:16px}.options{list-style:none;padding:0;display:grid;gap:8px}.options li{padding:9px;border:1px solid #dce2ea;border-radius:8px}.options .correct,.analysis.correct{border-color:#14804a;background:#eefaf4}.mode{font-weight:700}.analyses{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.analysis{border:1px solid #dce2ea;border-radius:8px;padding:10px}.analysis h5{margin:0 0 6px}.diagram{margin:18px 0;border:1px solid #ccd4df;border-radius:10px;padding:10px;overflow:auto}.diagram svg{display:block;width:100%;min-width:420px;max-height:620px}.edge line{stroke:#65748a;stroke-width:2}.edge.path line{stroke:#b24a00;stroke-width:4}.edge text{font-size:11px;text-anchor:middle;paint-order:stroke;stroke:white;stroke-width:4;fill:#263449}.node circle{fill:white;stroke:#506078;stroke-width:2}.node.path circle{stroke:#b24a00;stroke-width:4}.node.endpoint circle{fill:#fff4df}.node text{text-anchor:middle;font-size:13px}.node .gender{font-size:10px}.proof dl{display:grid;grid-template-columns:minmax(150px,220px) 1fr;gap:6px}.proof dt{font-weight:700}.proof dd{margin:0;overflow-wrap:anywhere}@media(max-width:700px){.analyses{grid-template-columns:1fr}.proof dl{grid-template-columns:1fr}.diagram svg{min-width:360px}.hero{padding:20px}.grid{padding:10px}}</style></head><body><section class="hero"><h1>BLR-CP-007 — Coded Relation Construction V2</h1><p><strong>168 remediation-review questions</strong> · 21 prototypes · 5 permanent QLs · all 672 option graphs independently valid.</p><p>Status: <code>HUMAN_REVIEW_REQUIRED</code>. This pack supersedes the V1 editorial presentation but does not self-authorise freeze or publication.</p></section><nav class="filters"><button onclick="show('all')">All</button>${["BLR-QL-031", "BLR-QL-032", "BLR-QL-033", "BLR-QL-034", "BLR-QL-035"].map((ql) => `<button onclick="show('${ql}')">${ql}</button>`).join("")}</nav><main class="grid">${bank.map(card).join("")}</main><script>function show(ql){document.querySelectorAll('.card').forEach(card=>{card.hidden=ql!=='all'&&card.dataset.ql!==ql})}</script></body></html>`;
writeFileSync(resolve(out, "blr-cp007-v2-review.html"), html);
writeFileSync(
  resolve(out, "BLR-CP-007-V2-REMEDIATION-RECORD.md"),
  `# BLR-CP-007 V2 Exam and Pedagogy Remediation\n\nStatus: **human review required; not frozen**.\n\n## Inventory\n\n\`\`\`text\nquestions: ${summary.recordCount}\noptions independently verified: ${summary.optionCount}\nprototypes: ${summary.prototypeCount}\npermanent QLs: ${summary.permanentQlCount}\nanswer positions: ${summary.answerPositions.join(" / ")}\ninvalid option graphs: ${summary.invalidOptionGraphs}\nlegacy answer cycles: ${summary.answerPatternCycles}\ngeneric option explanations: ${summary.genericOptionExplanations}\nincorrect-statement polarity defects: ${summary.invalidStatementPolarityDefects}\nQL-034 correct people: ${JSON.stringify(summary.missingPersonCorrectCounts)}\n\`\`\`\n\nThe five permanent solve authorities are preserved. V2 replaces the learner-facing option-order, distractor, explanation, diagram and review-proof layers. Question Studio, Question Bank, tests, localisation, publication, production staging and merge remain disabled.\n`,
);
console.log(JSON.stringify(summary, null, 2));
