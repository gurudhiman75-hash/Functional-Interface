import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { applyTrg002V4PedagogicDiagramLayerFinal } from "./exam-readiness-v4-pedagogic-diagrams-final";
import { renderTrg002SolutionDiagramSvg } from "./exam-readiness-v4-review-svg";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");

function stringify(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current, 2);
}

function explanationText(explanation: any) {
  return [
    explanation?.keyRule ?? "",
    ...(explanation?.steps ?? []).map((step: any) => step?.body ?? ""),
    explanation?.shortcut ?? "",
    ...(explanation?.traps ?? []),
  ].join(" ");
}

const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
let html = readFileSync(htmlPath, "utf8");
const rendered: string[] = [];
let helperPoints = 0;
let helperSegments = 0;
let teachingDimensions = 0;
let requestedRealignments = 0;
let explanationFacts = 0;
let explanationAligned = 0;

for (const row of pack.records as any[]) {
  const result = applyTrg002V4PedagogicDiagramLayerFinal({
    qlId: row.qlId,
    diagram: row.solutionDiagram,
    englishStem: row.english.stem,
    englishExplanationText: explanationText(row.english.explanation),
    englishAnswer: row.english.answer,
    topology: row.hindi?.v4ExamReadiness?.spatialTopology,
  });
  row.solutionDiagram = result.diagram;
  if (row.diagramEvidence?.solutionDiagram) row.diagramEvidence.solutionDiagram = result.diagram;
  helperPoints += result.audit.helperPointsLabeled;
  helperSegments += result.audit.helperSegmentsAdded;
  teachingDimensions += result.audit.teachingDimensionsAdded;
  requestedRealignments += result.audit.requestedLabelsRealigned;
  explanationFacts += result.audit.explanationFactsVisualized.length;
  if (result.diagram.reviewDimensionAudit?.explanationAligned === true) explanationAligned += 1;

  const figure = renderTrg002SolutionDiagramSvg({ ...result.diagram, qlId: row.qlId });
  const svg = figure.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${row.qlId}: pedagogic renderer did not emit a solution SVG.`);
  if (/\b(?:NaN|Infinity|-Infinity)\b/.test(svg)) throw new Error(`${row.qlId}: pedagogic diagram contains non-finite geometry.`);
  rendered.push(svg);
}

let index = 0;
html = html.replace(/<svg class="solution-diagram"[\s\S]*?<\/svg>/g, () => {
  const replacement = rendered[index++];
  if (!replacement) throw new Error(`Pedagogic SVG replacement underflow at ${index}.`);
  return replacement;
});
if (index !== 96 || rendered.length !== 96) throw new Error(`Expected 96 pedagogic SVG replacements, got replaced=${index} rendered=${rendered.length}.`);

html = html.replace(
  "bold semantically-audited solution geometry with explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence. Numeric values are attached only to their intended geometric relationships; changed-shadow and support-triangle states are explicitly represented; answer-equivalent derived helpers are suppressed; sloped callout leaders are ordered without crossings.",
  "bold semantically-audited pedagogic solution geometry aligned to the worked explanation. Given data, assumed variables, helper points, eye-level intersections, derived rises/drops, changed-state relations and multi-position distance relations are visualized when they are load-bearing to the solution, while requested values remain unsolved.",
);

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_PEDAGOGIC_DIAGRAM_PASS qls=96 explanationAligned=${explanationAligned} helperPoints=${helperPoints} helperSegments=${helperSegments} teachingDimensions=${teachingDimensions} requestedRealignments=${requestedRealignments} explanationFactsVisualized=${explanationFacts}`);
