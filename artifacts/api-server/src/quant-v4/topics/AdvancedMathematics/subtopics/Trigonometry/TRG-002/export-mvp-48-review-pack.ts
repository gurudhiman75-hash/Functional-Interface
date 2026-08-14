import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { TRG_002_MVP_48_IDS } from "./mvp-48-registry";
import { generateFinalEditorialTrg002Mvp48Question } from "./mvp-final-editorial-runtime";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts");
mkdirSync(outDir, { recursive: true });

function esc(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pointMap(diagram: any) {
  return new Map<string, any>(diagram.points.map((point: any) => [point.id, point]));
}

function segmentSvg(segment: any, points: Map<string, any>) {
  const a = points.get(segment.fromPointId);
  const b = points.get(segment.toPointId);
  if (!a || !b) return "";
  const dashed = segment.kind === "EYE_LEVEL" ? ' stroke-dasharray="8 7"' : "";
  const width = segment.kind === "GROUND" ? 3 : segment.kind === "VERTICAL_OBJECT" || segment.kind === "LADDER" || segment.kind === "WIRE" ? 4 : 2.5;
  const arrow = segment.kind === "MOVEMENT" ? ' marker-end="url(#movementArrow)"' : "";
  return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="currentColor" stroke-width="${width}"${dashed}${arrow}/>`;
}

function annotationSvg(annotation: any, points: Map<string, any>) {
  const a = points.get(annotation.fromPointId);
  const b = points.get(annotation.toPointId);
  if (!a || !b) return "";
  let x = (a.x + b.x) / 2;
  let y = (a.y + b.y) / 2;
  const offset = 20;
  if (annotation.placement === "ABOVE") y -= offset;
  if (annotation.placement === "BELOW") y += offset;
  if (annotation.placement === "LEFT") x -= offset;
  if (annotation.placement === "RIGHT") x += offset;
  return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" class="measurement">${esc(annotation.label)}</text>`;
}

function normalizeSignedRadians(value: number) {
  let normalized = value;
  while (normalized > Math.PI) normalized -= Math.PI * 2;
  while (normalized <= -Math.PI) normalized += Math.PI * 2;
  return normalized;
}

function angleSvg(angle: any, points: Map<string, any>) {
  const v = points.get(angle.vertexPointId);
  const r = points.get(angle.rayPointId);
  if (!v || !r) return "";

  const dx = r.x - v.x;
  const dy = r.y - v.y;
  const rayAngle = Math.atan2(dy, dx);
  const referenceAngle = angle.referenceDirection === "LEFT" ? Math.PI : 0;
  const delta = normalizeSignedRadians(rayAngle - referenceAngle);
  const radius = 38;
  const labelRadius = 62;
  const startX = v.x + Math.cos(referenceAngle) * radius;
  const startY = v.y + Math.sin(referenceAngle) * radius;
  const endX = v.x + Math.cos(rayAngle) * radius;
  const endY = v.y + Math.sin(rayAngle) * radius;
  const midAngle = referenceAngle + delta / 2;
  const labelX = v.x + Math.cos(midAngle) * labelRadius;
  const labelY = v.y + Math.sin(midAngle) * labelRadius;
  const sweep = delta >= 0 ? 1 : 0;

  return `<path d="M ${startX} ${startY} A ${radius} ${radius} 0 0 ${sweep} ${endX} ${endY}" class="angle-arc"/><text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" class="angle">${esc(angle.label)}</text>`;
}

function diagramSvg(question: any) {
  const diagram = question.solutionDiagram;
  const points = pointMap(diagram);
  const segments = diagram.segments.map((segment: any) => segmentSvg(segment, points)).join("\n");
  const annotations = (question.solutionAnnotations ?? []).map((annotation: any) => annotationSvg(annotation, points)).join("\n");
  const angles = diagram.angles.map((angle: any) => angleSvg(angle, points)).join("\n");
  const pointLabels = diagram.labels.map((label: any) => {
    const p = points.get(label.pointId);
    return p ? `<text x="${p.x + 10}" y="${p.y - 10}" class="point-label">${esc(label.text)}</text>` : "";
  }).join("\n");
  const pointDots = diagram.points
    .filter((point: any) => !String(point.id).startsWith("eye-level-"))
    .map((point: any) => `<circle cx="${point.x}" cy="${point.y}" r="4" fill="currentColor"/>`)
    .join("\n");
  return `<svg viewBox="0 0 ${diagram.width} ${diagram.height}" role="img" aria-label="${esc(question.qlId)} solution diagram">
    <defs><marker id="movementArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    ${segments}${pointDots}${angles}${annotations}${pointLabels}
  </svg>`;
}

const rows = TRG_002_MVP_48_IDS.map((qlId, index) => {
  const seed = `trg002-render-review-${String(index + 1).padStart(2, "0")}`;
  const question: any = generateFinalEditorialTrg002Mvp48Question(qlId, seed);
  if (!question.validation.valid) throw new Error(`${qlId}: final runtime validation is false during review export.`);
  if (!question.solutionDiagram) throw new Error(`${qlId}: missing required solution diagram during review export.`);
  const options = question.options.map((option: any) => `<li class="${option.isCorrect ? "correct" : ""}"><b>${esc(option.label)}.</b> ${esc(option.display)}${option.isCorrect ? " ✓" : ""}</li>`).join("");
  const steps = question.explanation.steps.map((step: any) => `<li><b>${esc(step.title)}:</b> ${esc(step.body)}</li>`).join("");
  return `<article class="question-card" id="${esc(qlId)}">
    <header><h2>${esc(qlId)} · ${esc(question.cpId)} · ${esc(question.difficulty)}</h2><div class="family">${esc(question.lockedFamily)} · ${esc(question.solveMode)}</div></header>
    <p class="stem">${esc(question.stem)}</p>
    <div class="columns"><section><h3>Options</h3><ol class="options">${options}</ol><h3>Explanation</h3><p><b>Rule:</b> ${esc(question.explanation.keyRule)}</p><ol>${steps}</ol><p><b>Trap:</b> ${esc(question.explanation.traps.join(" "))}</p></section><section class="diagram"><h3>Solution diagram</h3>${diagramSvg(question)}</section></div>
  </article>`;
});

const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>TRG-002 48-QL Runtime Review Pack</title><style>
body{font-family:Arial,Helvetica,sans-serif;margin:0;background:#f5f5f5;color:#111}.page{max-width:1500px;margin:auto;padding:24px}.summary,.question-card{background:white;border:1px solid #ddd;border-radius:10px;padding:20px;margin:0 0 20px}.question-card h2{margin:0 0 6px;font-size:20px}.family{color:#555;font-size:13px}.stem{font-size:17px;line-height:1.45}.columns{display:grid;grid-template-columns:0.9fr 1.1fr;gap:24px}.options{list-style:none;padding:0}.options li{padding:5px 0}.options .correct{font-weight:700}.diagram svg{width:100%;height:auto;border:1px solid #ccc;background:white;color:#111}.measurement{font-size:22px;font-weight:700;paint-order:stroke;stroke:white;stroke-width:5px;stroke-linejoin:round}.angle-arc{fill:none;stroke:currentColor;stroke-width:3}.angle{font-size:22px;font-weight:700;paint-order:stroke;stroke:white;stroke-width:5px}.point-label{font-size:20px;font-weight:700;paint-order:stroke;stroke:white;stroke-width:5px}@media(max-width:900px){.columns{grid-template-columns:1fr}}
</style></head><body><main class="page"><section class="summary"><h1>TRG-002 48-QL Runtime Review Pack</h1><p>Generated from <code>mvp-final-editorial-runtime.ts</code>. All diagrams are solution-stage projections from the same canonical spatial state used by the solver and explanation.</p><p><b>Count:</b> 48 QLs · <b>solution diagrams:</b> 48 · <b>stem diagrams:</b> 0 automatic</p></section>${rows.join("\n")}</main></body></html>`;

const json = TRG_002_MVP_48_IDS.map((qlId, index) => {
  const question: any = generateFinalEditorialTrg002Mvp48Question(qlId, `trg002-render-review-${String(index + 1).padStart(2, "0")}`);
  return {
    qlId,
    cpId: question.cpId,
    difficulty: question.difficulty,
    stem: question.stem,
    answer: question.answer,
    options: question.options.map((o: any) => ({ label: o.label, display: o.display, isCorrect: o.isCorrect, misconceptionId: o.misconceptionId })),
    explanation: question.explanation,
    strategy: question.solutionDiagram.strategy,
    solutionDiagram: question.solutionDiagram,
    solutionAnnotations: question.solutionAnnotations ?? [],
    validation: question.validation,
  };
});

writeFileSync(join(outDir, "TRG-002-MVP-48-RUNTIME-REVIEW.html"), html, "utf8");
writeFileSync(join(outDir, "TRG-002-MVP-48-RUNTIME-REVIEW.json"), JSON.stringify(json, null, 2), "utf8");
console.log(`TRG002_REVIEW_EXPORT_OK count=${json.length} diagrams=${json.filter((item) => item.solutionDiagram).length}`);
