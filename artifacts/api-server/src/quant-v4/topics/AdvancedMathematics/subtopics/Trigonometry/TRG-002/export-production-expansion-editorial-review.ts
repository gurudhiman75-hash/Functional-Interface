import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TRG_002_PRODUCTION_EXPANSION_48_IDS } from "./production-96-registry";
import { generateFinalEditorialTrg002ProductionExpansionQuestion } from "./production-final-editorial-runtime";

const outDir = join(
  process.cwd(),
  "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/production-expansion-48",
);
mkdirSync(outDir, { recursive: true });

function esc(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const records = TRG_002_PRODUCTION_EXPANSION_48_IDS.map((qlId, index) => {
  const seed = `trg002-production-editorial-review-${String(index + 1).padStart(2, "0")}`;
  const question: any = generateFinalEditorialTrg002ProductionExpansionQuestion(qlId, seed);
  if (question.validation?.valid !== true) throw new Error(`${qlId}: validation failed during Phase-8 editorial review export.`);
  if (question.finalEditorialReview?.status !== "PASS") throw new Error(`${qlId}: editorial PASS missing during review export.`);
  if (!question.solutionDiagram) throw new Error(`${qlId}: required solution diagram metadata missing during review export.`);
  return {
    qlId,
    cpId: question.cpId,
    difficulty: question.difficulty,
    lockedFamily: question.lockedFamily,
    solveMode: question.solveMode,
    seed,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((option: any) => ({
      label: option.label,
      display: option.display,
      isCorrect: option.isCorrect,
      misconceptionId: option.misconceptionId,
    })),
    explanation: question.explanation,
    solutionDiagramStrategy: question.solutionDiagram.strategy,
    solutionDiagram: question.solutionDiagram,
    solutionAnnotations: question.solutionAnnotations ?? [],
    validation: question.validation,
    verification: {
      spatial: question.verification?.spatial,
      answer: question.verification?.answer,
      diagram: question.verification?.diagram,
      diagramPolicy: question.verification?.diagramPolicy,
    },
    reviewStatus: question.reviewStatus,
    aiEditorialStatus: question.aiEditorialStatus,
    humanReviewStatus: question.humanReviewStatus,
    freezeStatus: question.freezeStatus,
    finalEditorialReview: question.finalEditorialReview,
  };
});

if (records.length !== 48) throw new Error(`Expected 48 Phase-8 editorial records, got ${records.length}.`);

const cards = records.map((record) => {
  const options = record.options
    .map((option) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${esc(option.label)}.</b> ${esc(option.display)}${option.isCorrect ? " ✓" : ""}<span class="misconception">${esc(option.misconceptionId ?? "CORRECT")}</span></li>`)
    .join("");
  const steps = record.explanation.steps
    .map((step: any) => `<li><b>${esc(step.title)}:</b> ${esc(step.body)}</li>`)
    .join("");
  return `<article class="question-card" id="${esc(record.qlId)}">
    <header><h2>${esc(record.qlId)} · ${esc(record.cpId)} · ${esc(record.difficulty)}</h2><div class="family">${esc(record.lockedFamily)} · ${esc(record.solveMode)}</div></header>
    <p class="stem">${esc(record.stem)}</p>
    <div class="columns">
      <section><h3>Options</h3><ol class="options">${options}</ol><h3>Explanation</h3><p><b>Rule:</b> ${esc(record.explanation.keyRule)}</p><ol>${steps}</ol><p><b>Trap:</b> ${esc(record.explanation.traps.join(" "))}</p></section>
      <section><h3>Diagram metadata</h3><p><b>Strategy:</b> ${esc(record.solutionDiagramStrategy)}</p><details><summary>Canonical solution-diagram JSON</summary><pre>${esc(JSON.stringify(record.solutionDiagram, null, 2))}</pre></details><h3>Review boundary</h3><ul><li>AI editorial: ${esc(record.aiEditorialStatus)}</li><li>Human review: ${esc(record.humanReviewStatus)}</li><li>Rendered visual inspection: ${esc(record.finalEditorialReview.renderedVisualInspection)}</li><li>App/UI inspection: ${esc(record.finalEditorialReview.appUiRenderedInspection)}</li><li>Freeze: ${esc(record.freezeStatus)}</li></ul></section>
    </div>
  </article>`;
}).join("\n");

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 Phase-8 48-QL Editorial Review</title><style>
body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f5f5f5;color:#111}.page{max-width:1500px;margin:auto;padding:24px}.summary,.question-card{background:white;border:1px solid #ddd;border-radius:10px;padding:20px;margin:0 0 20px}.question-card h2{margin:0 0 6px;font-size:20px}.family{color:#555;font-size:13px}.stem{font-size:17px;line-height:1.45}.columns{display:grid;grid-template-columns:1fr 1fr;gap:24px}.options{list-style:none;padding:0}.options li{padding:6px 0}.options .correct{font-weight:700}.misconception{display:block;color:#666;font-size:12px;margin-left:24px}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#f7f7f7;border:1px solid #ddd;padding:12px;border-radius:6px;font-size:12px}@media(max-width:900px){.columns{grid-template-columns:1fr}}
</style></head><body><main class="page"><section class="summary"><h1>TRG-002 Phase-8 48-QL Editorial Review Pack</h1><p>Deterministic designated runtime instance for each of the 48 Phase-8 expansion QLs.</p><p><b>Scope:</b> stems, options, misconception IDs, explanations, canonical validation/verification and solution-diagram metadata. This artifact does <b>not</b> claim rendered visual inspection or human approval.</p><p><b>Count:</b> 48 · <b>AI editorial:</b> PASS · <b>Human review:</b> PENDING · <b>Rendered visual:</b> PENDING · <b>Freeze:</b> NOT FROZEN</p></section>${cards}</main></body></html>`;

writeFileSync(
  join(outDir, "TRG-002-PHASE8-48-EDITORIAL-REVIEW.json"),
  JSON.stringify(records, null, 2),
  "utf8",
);
writeFileSync(
  join(outDir, "TRG-002-PHASE8-48-EDITORIAL-REVIEW.html"),
  html,
  "utf8",
);

console.log(`TRG002_PHASE8_EDITORIAL_REVIEW_EXPORT_PASS count=${records.length} visual=PENDING human=PENDING freeze=NOT_FROZEN`);
