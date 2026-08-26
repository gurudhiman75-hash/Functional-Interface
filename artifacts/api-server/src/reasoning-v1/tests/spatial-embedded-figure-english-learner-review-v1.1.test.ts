import { mkdirSync, writeFileSync } from "node:fs";

import { matchEmbeddedGraphV1, type EmbeddedEdgeV1, type EmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import {
  EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1,
  generateEmbeddedFigureVisualRealismQuestionV1,
  type EmbeddedVisualRealismQuestionV1,
} from "../foundation/spatial/embedded-figure-visual-realism-remediation-v1";
import { EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/embedded-figure-source-saturated-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function optionLabel(index: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"] as const)[index]!;
}

function reviewOverlaySvg(graph: EmbeddedGraphV1, matchedEdgeIds: ReadonlySet<string>): string {
  const vertexById = new Map(graph.vertices.map((vertex) => [vertex.id, vertex]));
  const edgeMarkup = (edge: EmbeddedEdgeV1, highlighted: boolean): string => {
    const a = vertexById.get(edge.a)!;
    const b = vertexById.get(edge.b)!;
    const stroke = highlighted ? "#0f766e" : "#cbd5e1";
    const width = highlighted ? 4.4 : 1.7;
    if (edge.kind === "LINE") return `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.max(Math.hypot(dx, dy), 0.001);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const controlX = midX - (dy / length) * edge.bulge * length;
    const controlY = midY + (dx / length) * edge.bulge * length;
    return `<path d="M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="review exact-path overlay"><rect width="120" height="120" fill="white"/>${graph.edges.filter((edge) => !matchedEdgeIds.has(edge.id)).map((edge) => edgeMarkup(edge, false)).join("")}${graph.edges.filter((edge) => matchedEdgeIds.has(edge.id)).map((edge) => edgeMarkup(edge, true)).join("")}</svg>`;
}

const candidates = Object.freeze(Array.from({ length: 640 }, (_, index) => generateEmbeddedFigureVisualRealismQuestionV1(`EMB-VR-REVIEW-${index}`)));
const selected: EmbeddedVisualRealismQuestionV1[] = [];
const selectedSeeds = new Set<string>();
const add = (question: EmbeddedVisualRealismQuestionV1 | undefined) => {
  assert(question, "Unable to satisfy EMB-001 V1.1 learner-review coverage from deterministic pool.");
  if (selectedSeeds.has(question.seed)) return;
  selectedSeeds.add(question.seed);
  selected.push(question);
};

const families = [...new Set(candidates.map((question) => question.motifFamily))].sort();
for (const family of families) {
  for (const difficulty of ["L1", "L2", "L3"] as const) add(candidates.find((question) => question.motifFamily === family && question.difficulty === difficulty));
}
for (let stem = 0; stem < 8; stem += 1) add(candidates.find((question) => question.stemVariant === stem));
for (let answer = 0; answer < 4; answer += 1) add(candidates.find((question) => question.correctIndex === answer));
for (const trap of ["ROTATION_TRAP", "REFLECTION_TRAP", "MISSING_EDGE", "WRONG_INCIDENCE", "NON_UNIFORM_SCALE"] as const) add(candidates.find((question) => question.distractorKindsByIndex.includes(trap)));

const reviewQuestions = Object.freeze(selected);
const familyCoverage = new Set(reviewQuestions.map((question) => question.motifFamily));
const difficultyCoverage = new Set(reviewQuestions.map((question) => question.difficulty));
const stemCoverage = new Set(reviewQuestions.map((question) => question.stemVariant));
const answerCoverage = new Set(reviewQuestions.map((question) => question.correctIndex));
const distractorCoverage = new Set(reviewQuestions.flatMap((question) => question.distractorKindsByIndex.filter((kind) => kind !== "CORRECT")));
assert(reviewQuestions.length >= 24 && reviewQuestions.length <= 40, `Review pack size ${reviewQuestions.length} outside 24–40.`);
assert(familyCoverage.size === 8, `Review pack covers ${familyCoverage.size}/8 motif families.`);
assert(difficultyCoverage.size === 3, `Review pack covers ${difficultyCoverage.size}/3 difficulties.`);
assert(stemCoverage.size === 8, `Review pack covers ${stemCoverage.size}/8 stem variants.`);
assert(answerCoverage.size === 4, `Review pack covers ${answerCoverage.size}/4 answer positions.`);
assert(distractorCoverage.size === 5, `Review pack covers ${distractorCoverage.size}/5 distractor families.`);

let overlayChecks = 0;
let connectedConcealmentChecks = 0;
const cards = reviewQuestions.map((question, reviewIndex) => {
  const solver = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const correct = solver[question.correctIndex]!;
  assert(correct.matched && solver.filter((result) => result.matched).length === 1, `${question.seed}: learner-review pack lost exact-one-answer property.`);
  const overlay = reviewOverlaySvg(question.optionGraphs[question.correctIndex]!, new Set(correct.matchedHostEdgeIds));
  overlayChecks += 1;
  connectedConcealmentChecks += question.visualValidation.concealmentEdgeCounts.length;

  const options = question.optionSvgs.map((svg, index) => `<div class="option"><div class="label">${optionLabel(index)}</div><div class="figure">${svg}</div></div>`).join("");
  return `<article class="card">
    <div class="chips"><span>#${reviewIndex + 1}</span><span>${escapeHtml(question.motifFamily)}</span><span>${question.difficulty}</span><span>Stem ${question.stemVariant + 1}</span><span>${question.geometryFingerprint}</span></div>
    <h2>${escapeHtml(question.stem)}</h2>
    <div class="target-row"><div><h3>Question figure</h3><div class="figure target">${question.targetSvg}</div></div><div class="meta">Motif: ${escapeHtml(question.motifId)}<br/>Policy: ${question.equivalencePolicy}<br/>Connected concealment edges A–D: ${question.visualValidation.concealmentEdgeCounts.join(" / ")}<br/>Correct-host scale: ${question.targetScaleInCorrectHost.toFixed(3)}×</div></div>
    <h3>Options</h3><div class="options">${options}</div>
    <details><summary>Reviewer answer and exact-path proof</summary><div class="solution"><div><div class="figure overlay">${overlay}</div><p>Teal = exact target path in option ${question.answer}; grey = connected concealment geometry. This overlay is reviewer-only.</p></div><div><p><strong>Answer:</strong> ${question.answer}</p><p><strong>Observe:</strong> ${escapeHtml(question.explanation.observation)}</p><p><strong>Rule:</strong> ${escapeHtml(question.explanation.rule)}</p><p><strong>Apply:</strong> ${escapeHtml(question.explanation.application)}</p><p><strong>Check:</strong> ${escapeHtml(question.explanation.check)}</p></div></div></details>
  </article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>EMB-001 English Learner Review V1.1</title><style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a;background:#f8fafc}*{box-sizing:border-box}body{margin:0;background:#f8fafc}main{max-width:1120px;margin:0 auto;padding:20px}.intro,.card{background:white;border:1px solid #e2e8f0;border-radius:14px}.intro{padding:18px;margin-bottom:18px}.card{padding:18px;margin-bottom:18px}h1{font-size:24px;margin:0 0 8px}h2{font-size:17px;line-height:1.45;margin:12px 0}h3{font-size:13px;margin:0 0 8px}.muted,.meta,details{font-size:12px;line-height:1.6;color:#475569}.chips{display:flex;flex-wrap:wrap;gap:6px}.chips span{font-size:10px;background:#f1f5f9;border-radius:999px;padding:4px 7px;color:#475569}.target-row{display:grid;grid-template-columns:230px 1fr;gap:18px;align-items:center;margin:14px 0}.figure{border:1px solid #cbd5e1;border-radius:9px;background:white;padding:7px}.figure svg{display:block;width:100%;height:auto}.target{max-width:220px}.options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.label{font-weight:700;font-size:12px;margin-bottom:5px}details{border-top:1px solid #e2e8f0;margin-top:15px;padding-top:11px}summary{font-weight:700;cursor:pointer;color:#334155}.solution{display:grid;grid-template-columns:minmax(220px,330px) 1fr;gap:18px;margin-top:12px}.solution p{margin:0 0 8px}.overlay{max-width:320px}@media(max-width:760px){main{padding:10px}.card{padding:12px}.target-row,.solution{grid-template-columns:1fr}.options{grid-template-columns:repeat(2,minmax(0,1fr))}.target{max-width:200px}}
</style></head><body><main><section class="intro"><h1>EMB-001 · English Learner Review V1.1</h1><p class="muted">Connected-concealment remediation candidate. ${reviewQuestions.length} deterministic questions cover all 8 motif families × L1/L2/L3, all 8 stems, all answer positions and all five misconception-owned distractor families. Options are intentionally neutral; answer/path evidence is collapsed below each item. Permanent QLs remain zero.</p></section>${cards}</main></body></html>`;

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-english-learner-review-v1.1.html", html);
const evidence = {
  status: "PASS_EMB_001_ENGLISH_LEARNER_REVIEW_V1_1_CANDIDATE",
  authorityId: "EMB-001-ENGLISH-LEARNER-REVIEW-V1.1-CANDIDATE",
  visualRemediationAuthority: EMBEDDED_FIGURE_VISUAL_REALISM_REMEDIATION_V1.authorityId,
  sourceAuthority: EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  reviewQuestionCount: reviewQuestions.length,
  coverage: {
    motifFamilies: [...familyCoverage].sort(),
    difficultyBands: [...difficultyCoverage].sort(),
    stemVariants: [...stemCoverage].sort((a, b) => a - b),
    answerPositions: [...answerCoverage].sort((a, b) => a - b),
    distractorFamilies: [...distractorCoverage].sort(),
  },
  overlayChecks,
  connectedConcealmentChecks,
  governance: {
    candidateOnly: true,
    englishFrozen: false,
    productOwnerApproved: false,
    permanentQlCount: 0,
    nextFreeSpatialQlId: "SPA-QL-041",
    questionStudioRegistered: false,
    questionBankWritable: false,
    automaticStudentPublication: false,
  },
  nextGate: "DIRECT_VISUAL_REVIEW_OF_ALL_ITEMS_THEN_ENGLISH_FREEZE_AND_PERMANENT_QL_PROPOSAL",
};
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-english-learner-review-v1.1-evidence.json", JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
