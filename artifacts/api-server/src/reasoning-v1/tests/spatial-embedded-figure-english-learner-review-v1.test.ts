import { mkdirSync, writeFileSync } from "node:fs";

import { matchEmbeddedGraphV1, type EmbeddedEdgeV1, type EmbeddedGraphV1 } from "../foundation/spatial/embedded-figure-graph-v1";
import {
  generateEmbeddedFigureQuestionV1,
  type EmbeddedGeneratedQuestionV1,
} from "../foundation/spatial/embedded-figure-production-generator-v1";
import { EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/embedded-figure-source-saturated-discovery-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
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
    const width = highlighted ? 4.6 : 1.8;
    if (edge.kind === "LINE") {
      return `<line x1="${a.x.toFixed(2)}" y1="${a.y.toFixed(2)}" x2="${b.x.toFixed(2)}" y2="${b.y.toFixed(2)}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
    }
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.max(Math.hypot(dx, dy), 0.001);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    const controlX = midX - (dy / length) * edge.bulge * length;
    const controlY = midY + (dx / length) * edge.bulge * length;
    return `<path d="M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round"/>`;
  };

  const base = graph.edges.filter((edge) => !matchedEdgeIds.has(edge.id)).map((edge) => edgeMarkup(edge, false)).join("");
  const highlighted = graph.edges.filter((edge) => matchedEdgeIds.has(edge.id)).map((edge) => edgeMarkup(edge, true)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="review overlay"><rect width="120" height="120" fill="white"/>${base}${highlighted}</svg>`;
}

function candidatePool(): readonly EmbeddedGeneratedQuestionV1[] {
  return Object.freeze(Array.from({ length: 480 }, (_, index) => generateEmbeddedFigureQuestionV1(`EMB-REVIEW-${index}`)));
}

function selectReviewQuestions(candidates: readonly EmbeddedGeneratedQuestionV1[]): readonly EmbeddedGeneratedQuestionV1[] {
  const selected: EmbeddedGeneratedQuestionV1[] = [];
  const selectedSeeds = new Set<string>();
  const add = (question: EmbeddedGeneratedQuestionV1 | undefined) => {
    assert(question, "Unable to satisfy English learner-review coverage from deterministic pool.");
    if (!selectedSeeds.has(question.seed)) {
      selectedSeeds.add(question.seed);
      selected.push(question);
    }
  };

  const families = [...new Set(candidates.map((question) => question.motifFamily))].sort();
  for (const family of families) {
    for (const difficulty of ["L1", "L2", "L3"] as const) {
      add(candidates.find((question) => question.motifFamily === family && question.difficulty === difficulty));
    }
  }
  for (let stemVariant = 0; stemVariant < 8; stemVariant += 1) {
    add(candidates.find((question) => question.stemVariant === stemVariant));
  }
  for (let correctIndex = 0; correctIndex < 4; correctIndex += 1) {
    add(candidates.find((question) => question.correctIndex === correctIndex));
  }
  for (const kind of ["ROTATION_TRAP", "REFLECTION_TRAP", "MISSING_EDGE", "WRONG_INCIDENCE", "NON_UNIFORM_SCALE"] as const) {
    add(candidates.find((question) => question.distractorKindsByIndex.includes(kind)));
  }

  return Object.freeze(selected);
}

const candidates = candidatePool();
const reviewQuestions = selectReviewQuestions(candidates);
const families = new Set(reviewQuestions.map((question) => question.motifFamily));
const difficulties = new Set(reviewQuestions.map((question) => question.difficulty));
const stems = new Set(reviewQuestions.map((question) => question.stemVariant));
const answers = new Set(reviewQuestions.map((question) => question.correctIndex));
const distractors = new Set(reviewQuestions.flatMap((question) => question.distractorKindsByIndex.filter((kind) => kind !== "CORRECT")));

assert(families.size === 8, `Review pack covers ${families.size}/8 motif families.`);
assert(difficulties.size === 3, `Review pack covers ${difficulties.size}/3 difficulty bands.`);
assert(stems.size === 8, `Review pack covers ${stems.size}/8 stem variants.`);
assert(answers.size === 4, `Review pack covers ${answers.size}/4 answer positions.`);
assert(distractors.size === 5, `Review pack covers ${distractors.size}/5 distractor families.`);
assert(reviewQuestions.length >= 24 && reviewQuestions.length <= 40, `Review pack size ${reviewQuestions.length} is outside the intended 24–40 range.`);

let overlayChecks = 0;
const cards = reviewQuestions.map((question, reviewIndex) => {
  const solver = question.optionGraphs.map((option) => matchEmbeddedGraphV1(question.targetGraph, option, "FIXED_ORIENTATION"));
  const correct = solver[question.correctIndex]!;
  assert(correct.matched, `${question.seed}: review overlay could not resolve correct embedding.`);
  assert(solver.filter((result) => result.matched).length === 1, `${question.seed}: review question has multiple exact matches.`);
  const overlay = reviewOverlaySvg(question.optionGraphs[question.correctIndex]!, new Set(correct.matchedHostEdgeIds));
  assert(overlay.includes("#0f766e"), `${question.seed}: reviewer-only matched-path overlay missing.`);
  overlayChecks += 1;

  const options = question.optionSvgs.map((svg, index) => `
    <div class="option ${index === question.correctIndex ? "correct-review" : ""}">
      <div class="option-label">${optionLabel(index)}</div>
      <div class="figure">${svg}</div>
      <div class="review-meta">${escapeHtml(question.distractorKindsByIndex[index]!)}</div>
    </div>`).join("");

  return `<article class="card">
    <header>
      <div class="chips">
        <span>#${reviewIndex + 1}</span><span>${escapeHtml(question.motifFamily)}</span><span>${question.difficulty}</span><span>Stem ${question.stemVariant + 1}</span><span>${question.contentFingerprint}</span>
      </div>
      <h2>${escapeHtml(question.stem)}</h2>
    </header>
    <section class="target-block">
      <div><h3>Question figure</h3><div class="target figure">${question.targetSvg}</div></div>
      <div class="target-note"><strong>Reviewer metadata</strong><br/>Motif: ${escapeHtml(question.motifId)}<br/>Correct-host scale: ${question.targetScaleInCorrectHost.toFixed(3)}×<br/>Policy: ${question.equivalencePolicy}</div>
    </section>
    <section><h3>Options</h3><div class="options">${options}</div></section>
    <details>
      <summary>Reviewer answer, exact-path overlay and learner explanation</summary>
      <div class="solution-grid">
        <div><h3>Exact matched path in option ${question.answer}</h3><div class="overlay figure">${overlay}</div><p class="overlay-note">Teal = exact target edges. Grey = extra concealment geometry. This overlay is review evidence only and is never emitted in the production question.</p></div>
        <div class="explanation">
          <p><strong>Answer:</strong> Option ${question.answer}</p>
          <p><strong>Observe:</strong> ${escapeHtml(question.explanation.observation)}</p>
          <p><strong>Rule:</strong> ${escapeHtml(question.explanation.rule)}</p>
          <p><strong>Apply:</strong> ${escapeHtml(question.explanation.application)}</p>
          <p><strong>Check:</strong> ${escapeHtml(question.explanation.check)}</p>
        </div>
      </div>
    </details>
  </article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>EMB-001 English Learner Review V1</title>
<style>
  :root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a;background:#f8fafc}
  *{box-sizing:border-box} body{margin:0;background:#f8fafc} main{max-width:1120px;margin:0 auto;padding:20px}
  .intro,.card{background:white;border:1px solid #e2e8f0;border-radius:14px}.intro{padding:18px;margin-bottom:18px}.card{padding:18px;margin:0 0 18px}
  h1{font-size:24px;margin:0 0 10px} h2{font-size:17px;line-height:1.5;margin:12px 0} h3{font-size:14px;margin:0 0 8px}.muted{color:#64748b;font-size:13px;line-height:1.5}
  .chips{display:flex;flex-wrap:wrap;gap:6px}.chips span{font-size:11px;padding:4px 8px;background:#f1f5f9;border-radius:999px;color:#475569}
  .target-block{display:grid;grid-template-columns:minmax(180px,260px) 1fr;gap:16px;align-items:center;margin:14px 0}.target-note{font-size:12px;line-height:1.7;color:#475569}
  .figure{background:white;border:1px solid #cbd5e1;border-radius:10px;padding:8px}.figure svg{display:block;width:100%;height:auto}.target{max-width:240px}
  .options{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.option{position:relative}.option-label{font-weight:700;margin-bottom:5px}.review-meta{font-size:10px;color:#64748b;margin-top:5px;word-break:break-word}
  .correct-review .figure{outline:2px solid #94a3b8;outline-offset:2px} details{margin-top:16px;border-top:1px solid #e2e8f0;padding-top:12px} summary{cursor:pointer;font-weight:700;font-size:13px}
  .solution-grid{display:grid;grid-template-columns:minmax(220px,340px) 1fr;gap:18px;margin-top:14px}.overlay-note,.explanation{font-size:12px;line-height:1.6;color:#475569}.explanation p{margin:0 0 9px}
  @media(max-width:760px){main{padding:10px}.card{padding:13px}.options{grid-template-columns:repeat(2,minmax(0,1fr))}.target-block,.solution-grid{grid-template-columns:1fr}.target{max-width:210px}.review-meta{font-size:9px}}
</style>
</head>
<body><main>
<section class="intro"><h1>EMB-001 · English Learner Review V1</h1><p class="muted">Review-only evidence for the fixed-orientation SSC Embedded Figures rule class. ${reviewQuestions.length} deterministic questions cover all 8 structural motif families, L1/L2/L3, all 8 stem variants, A/B/C/D answer positions and all 5 misconception-owned distractor families. Permanent QL allocation remains zero; Question Studio and student publication remain disabled.</p></section>
${cards}
</main></body></html>`;

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-english-learner-review-v1.html", html);

const evidence = {
  status: "PASS_EMB_001_ENGLISH_LEARNER_REVIEW_V1_CANDIDATE",
  authorityId: "EMB-001-ENGLISH-LEARNER-REVIEW-V1-CANDIDATE",
  sourceAuthority: EMBEDDED_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId,
  reviewQuestionCount: reviewQuestions.length,
  coverage: {
    motifFamilies: [...families].sort(),
    difficultyBands: [...difficulties].sort(),
    stemVariants: [...stems].sort((a, b) => a - b),
    answerPositions: [...answers].sort((a, b) => a - b),
    distractorFamilies: [...distractors].sort(),
  },
  overlayChecks,
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
  nextGate: "DIRECT_VISUAL_REVIEW_THEN_ENGLISH_FREEZE_AND_PERMANENT_QL_PROPOSAL",
};
writeFileSync("dist/reasoning-v1/spatial/spa-emb-001-english-learner-review-v1-evidence.json", JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence, null, 2));
