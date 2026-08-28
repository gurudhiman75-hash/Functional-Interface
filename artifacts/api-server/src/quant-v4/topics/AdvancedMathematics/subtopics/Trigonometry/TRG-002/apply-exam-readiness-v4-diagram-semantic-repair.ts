import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyTrg002V4DiagramSemanticCorrections } from "./exam-readiness-v4-diagram-semantics";
import { renderTrg002SolutionDiagramSvg } from "./exam-readiness-v4-review-svg";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");

function stringify(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current, 2);
}

function normalizeLengthDisplay(value: unknown) {
  return String(value ?? "")
    .replaceAll("−", "-")
    .replace(/\s+/gu, "")
    .replace(/m$/u, "")
    .trim();
}

function canonicalizeSlopedDimensionEndpointOrder(diagram: any) {
  const points = new Map<string, any>((diagram.points ?? []).map((point: any) => [String(point.id), point]));
  let swapped = 0;
  const arrows = (diagram.measurementArrows ?? []).map((arrow: any) => {
    const from = points.get(String(arrow.fromPointId));
    const to = points.get(String(arrow.toPointId));
    if (!from || !to) return arrow;
    const dx = Number(to.x) - Number(from.x);
    const dy = Number(to.y) - Number(from.y);
    const sloped = Math.abs(dx) > 1e-6 && Math.abs(dy) > 1e-6;
    if (!sloped || Number(from.x) <= Number(to.x)) return arrow;
    swapped += 1;
    return {
      ...arrow,
      fromPointId: arrow.toPointId,
      toPointId: arrow.fromPointId,
      semanticEndpointOrderCanonicalized: true,
    };
  });
  return { arrows, swapped };
}

type Line = { x1: number; y1: number; x2: number; y2: number };

function properSegmentsCross(a: Line, b: Line) {
  const orient = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) =>
    (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
  const a1 = orient(a.x1, a.y1, a.x2, a.y2, b.x1, b.y1);
  const a2 = orient(a.x1, a.y1, a.x2, a.y2, b.x2, b.y2);
  const b1 = orient(b.x1, b.y1, b.x2, b.y2, a.x1, a.y1);
  const b2 = orient(b.x1, b.y1, b.x2, b.y2, a.x2, a.y2);
  return a1 * a2 < -1e-6 && b1 * b2 < -1e-6;
}

function crossedCalloutLeaderCount(svg: string) {
  let crossed = 0;
  const calloutPrefixes = [...svg.matchAll(/<g class="measurement"[^>]*data-dimension-mode="callout"[^>]*>([\s\S]*?)<line data-dimension-line=/g)];
  for (const match of calloutPrefixes) {
    const leaders = [...String(match[1] ?? "").matchAll(/<line data-extension-line="true" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)]
      .map((line) => ({ x1: Number(line[1]), y1: Number(line[2]), x2: Number(line[3]), y2: Number(line[4]) }));
    if (leaders.length >= 2 && properSegmentsCross(leaders[0]!, leaders[1]!)) crossed += 1;
  }
  return crossed;
}

const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
let html = readFileSync(htmlPath, "utf8");
const rendered: string[] = [];
let removedFalseDimensions = 0;
let removedDuplicateSupportSegments = 0;
let removedAnswerEquivalentHelpers = 0;
let canonicalizedSlopedDimensions = 0;
let structuralCorrections = 0;
let semanticDimensions = 0;
let crossedCalloutLeaders = 0;

for (const row of pack.records as any[]) {
  const repaired = applyTrg002V4DiagramSemanticCorrections({
    qlId: row.qlId,
    diagram: row.solutionDiagram,
    englishStem: row.english.stem,
  });

  const answerValue = normalizeLengthDisplay(row.english.answer);
  const beforeLeakFilter = Array.isArray(repaired.diagram.measurementArrows)
    ? repaired.diagram.measurementArrows
    : [];
  const afterLeakFilter = beforeLeakFilter.filter((arrow: any) => {
    const kind = String(arrow.kind ?? "");
    if (!kind.includes("DERIVED_HELPER")) return true;
    return normalizeLengthDisplay(arrow.label) !== answerValue;
  });
  const removedHere = beforeLeakFilter.length - afterLeakFilter.length;
  removedAnswerEquivalentHelpers += removedHere;
  repaired.diagram.measurementArrows = afterLeakFilter;

  const canonicalized = canonicalizeSlopedDimensionEndpointOrder(repaired.diagram);
  repaired.diagram.measurementArrows = canonicalized.arrows;
  canonicalizedSlopedDimensions += canonicalized.swapped;

  if (canonicalized.arrows.length < 2) {
    throw new Error(`${row.qlId}: semantic filtering left fewer than two meaningful dimensions (${canonicalized.arrows.length}).`);
  }
  if (canonicalized.arrows.some((arrow: any) => String(arrow.kind ?? "").includes("DERIVED_HELPER") && normalizeLengthDisplay(arrow.label) === answerValue)) {
    throw new Error(`${row.qlId}: answer-equivalent derived helper still leaks the requested answer.`);
  }

  if (repaired.diagram.reviewDimensionAudit) {
    repaired.diagram.reviewDimensionAudit.autoDimensions = canonicalized.arrows.length;
    repaired.diagram.reviewDimensionAudit.totalDimensions = canonicalized.arrows.length;
    repaired.diagram.reviewDimensionAudit.answerEquivalentHelperLeaks = 0;
    repaired.diagram.reviewDimensionAudit.crossedCalloutLeaders = 0;
  }
  if (repaired.diagram.semanticDiagramAudit) {
    repaired.diagram.semanticDiagramAudit.removedAnswerEquivalentHelpers = removedHere;
    repaired.diagram.semanticDiagramAudit.canonicalizedSlopedDimensions = canonicalized.swapped;
    repaired.diagram.semanticDiagramAudit.remainingDimensions = canonicalized.arrows.length;
    repaired.diagram.semanticDiagramAudit.answerEquivalentHelperLeaks = 0;
    repaired.diagram.semanticDiagramAudit.crossedCalloutLeaders = 0;
    if (removedHere > 0) repaired.diagram.semanticDiagramAudit.structuralCorrections.push(`REMOVED_ANSWER_EQUIVALENT_HELPERS_${removedHere}`);
    if (canonicalized.swapped > 0) repaired.diagram.semanticDiagramAudit.structuralCorrections.push(`CANONICALIZED_SLOPED_DIMENSION_ENDPOINTS_${canonicalized.swapped}`);
  }

  row.solutionDiagram = repaired.diagram;
  if (row.diagramEvidence?.solutionDiagram) row.diagramEvidence.solutionDiagram = repaired.diagram;
  removedFalseDimensions += repaired.audit.removedFalseDimensions;
  removedDuplicateSupportSegments += repaired.audit.removedDuplicateSupportSegments;
  structuralCorrections += repaired.diagram.semanticDiagramAudit?.structuralCorrections?.length ?? 0;
  semanticDimensions += canonicalized.arrows.length;

  const figure = renderTrg002SolutionDiagramSvg({ ...repaired.diagram, qlId: row.qlId });
  const svg = figure.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${row.qlId}: semantic diagram renderer did not emit an SVG.`);
  if (/\b(?:NaN|Infinity|-Infinity)\b/.test(svg)) throw new Error(`${row.qlId}: semantic diagram contains a non-finite coordinate.`);
  const crossedHere = crossedCalloutLeaderCount(svg);
  if (crossedHere !== 0) throw new Error(`${row.qlId}: ${crossedHere} sloped dimension callout(s) still have crossed leaders.`);
  crossedCalloutLeaders += crossedHere;
  rendered.push(svg);
}

let index = 0;
html = html.replace(/<svg class="solution-diagram"[\s\S]*?<\/svg>/g, () => {
  const replacement = rendered[index++];
  if (!replacement) throw new Error(`Semantic SVG replacement underflow at index ${index}.`);
  return replacement;
});
if (index !== 96 || rendered.length !== 96) throw new Error(`Expected 96 semantic SVG replacements, got replaced=${index} rendered=${rendered.length}.`);

html = html.replace(
  "bold rendered solution geometry with all explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence.",
  "bold semantically-audited solution geometry with explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence. Numeric values are attached only to their intended geometric relationships; changed-shadow and support-triangle states are explicitly represented; answer-equivalent derived helpers are suppressed; sloped callout leaders are ordered without crossings.",
);

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_SEMANTIC_DIAGRAM_REPAIR_PASS qls=96 removedFalseDimensions=${removedFalseDimensions} removedDuplicateSupportSegments=${removedDuplicateSupportSegments} removedAnswerEquivalentHelpers=${removedAnswerEquivalentHelpers} canonicalizedSlopedDimensions=${canonicalizedSlopedDimensions} structuralCorrections=${structuralCorrections} semanticDimensions=${semanticDimensions} answerEquivalentHelperLeaks=0 crossedCalloutLeaders=${crossedCalloutLeaders}`);
