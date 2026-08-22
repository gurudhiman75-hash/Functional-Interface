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

const pack = JSON.parse(readFileSync(jsonPath, "utf8"));
let html = readFileSync(htmlPath, "utf8");
const rendered: string[] = [];
let removedFalseDimensions = 0;
let removedDuplicateSupportSegments = 0;
let removedAnswerEquivalentHelpers = 0;
let structuralCorrections = 0;
let semanticDimensions = 0;

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

  if (afterLeakFilter.length < 2) {
    throw new Error(`${row.qlId}: answer-leak filtering left fewer than two meaningful dimensions (${afterLeakFilter.length}).`);
  }
  if (afterLeakFilter.some((arrow: any) => String(arrow.kind ?? "").includes("DERIVED_HELPER") && normalizeLengthDisplay(arrow.label) === answerValue)) {
    throw new Error(`${row.qlId}: answer-equivalent derived helper still leaks the requested answer.`);
  }

  if (repaired.diagram.reviewDimensionAudit) {
    repaired.diagram.reviewDimensionAudit.autoDimensions = afterLeakFilter.length;
    repaired.diagram.reviewDimensionAudit.totalDimensions = afterLeakFilter.length;
    repaired.diagram.reviewDimensionAudit.answerEquivalentHelperLeaks = 0;
  }
  if (repaired.diagram.semanticDiagramAudit) {
    repaired.diagram.semanticDiagramAudit.removedAnswerEquivalentHelpers = removedHere;
    repaired.diagram.semanticDiagramAudit.remainingDimensions = afterLeakFilter.length;
    repaired.diagram.semanticDiagramAudit.answerEquivalentHelperLeaks = 0;
    if (removedHere > 0) repaired.diagram.semanticDiagramAudit.structuralCorrections.push(`REMOVED_ANSWER_EQUIVALENT_HELPERS_${removedHere}`);
  }

  row.solutionDiagram = repaired.diagram;
  if (row.diagramEvidence?.solutionDiagram) row.diagramEvidence.solutionDiagram = repaired.diagram;
  removedFalseDimensions += repaired.audit.removedFalseDimensions;
  removedDuplicateSupportSegments += repaired.audit.removedDuplicateSupportSegments;
  structuralCorrections += repaired.diagram.semanticDiagramAudit?.structuralCorrections?.length ?? 0;
  semanticDimensions += afterLeakFilter.length;

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
  "bold semantically-audited solution geometry with explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence. Numeric values are attached only to their intended geometric relationships; changed-shadow and support-triangle states are explicitly represented; answer-equivalent derived helpers are suppressed.",
);

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_SEMANTIC_DIAGRAM_REPAIR_PASS qls=96 removedFalseDimensions=${removedFalseDimensions} removedDuplicateSupportSegments=${removedDuplicateSupportSegments} removedAnswerEquivalentHelpers=${removedAnswerEquivalentHelpers} structuralCorrections=${structuralCorrections} semanticDimensions=${semanticDimensions} answerEquivalentHelperLeaks=0`);
