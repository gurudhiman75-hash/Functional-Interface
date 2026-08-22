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

const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
let html = readFileSync(htmlPath, "utf8");
const rendered: string[] = [];
let removedFalseDimensions = 0;
let removedDuplicateSupportSegments = 0;
let structuralCorrections = 0;
let semanticDimensions = 0;

for (const row of pack.records as any[]) {
  const repaired = applyTrg002V4DiagramSemanticCorrections({
    qlId: row.qlId,
    diagram: row.solutionDiagram,
    englishStem: row.english.stem,
  });
  row.solutionDiagram = repaired.diagram;
  if (row.diagramEvidence?.solutionDiagram) row.diagramEvidence.solutionDiagram = repaired.diagram;
  removedFalseDimensions += repaired.audit.removedFalseDimensions;
  removedDuplicateSupportSegments += repaired.audit.removedDuplicateSupportSegments;
  structuralCorrections += repaired.audit.structuralCorrections.length;
  semanticDimensions += repaired.audit.remainingDimensions;

  const figure = renderTrg002SolutionDiagramSvg({ ...repaired.diagram, qlId: row.qlId });
  const svg = figure.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${row.qlId}: semantic diagram renderer did not emit an SVG.`);
  if (/\b(?:NaN|Infinity|-Infinity)\b/.test(svg)) throw new Error(`${row.qlId}: semantic diagram contains a non-finite coordinate.`);
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
  "bold semantically-audited solution geometry with explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence. Numeric values are attached only to their intended geometric relationships; changed-shadow and support-triangle states are explicitly represented.",
);

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_SEMANTIC_DIAGRAM_REPAIR_PASS qls=96 removedFalseDimensions=${removedFalseDimensions} removedDuplicateSupportSegments=${removedDuplicateSupportSegments} structuralCorrections=${structuralCorrections} semanticDimensions=${semanticDimensions}`);
