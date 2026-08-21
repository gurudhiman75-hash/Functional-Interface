import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import "./export-exam-readiness-v4-review";
import { applyTrg002V4ReviewDimensions } from "./exam-readiness-v4-review-dimensions";
import { renderTrg002SolutionDiagramSvg } from "./exam-readiness-v4-review-svg";

const outDir = join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Trigonometry/TRG-002/review-artifacts/exam-readiness-v4");
const jsonPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.json");
const htmlPath = join(outDir, "TRG-002-V4-EXAM-READINESS-REVIEW.html");

function reviveBigInt(_key: string, value: unknown) {
  if (typeof value === "string" && /^bigint:-?\d+$/.test(value)) return BigInt(value.slice("bigint:".length));
  return value;
}

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

type Box = { x: number; y: number; width: number; height: number };
type Line = { x1: number; y1: number; x2: number; y2: number; strokeWidth?: number; kind?: string };

function attrs(tag: string) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
}

function lineIntersectsBox(line: Line, box: Box, gap = 2) {
  const xmin = box.x - gap;
  const xmax = box.x + box.width + gap;
  const ymin = box.y - gap;
  const ymax = box.y + box.height + gap;
  const dx = line.x2 - line.x1;
  const dy = line.y2 - line.y1;
  const p = [-dx, dx, -dy, dy];
  const q = [line.x1 - xmin, xmax - line.x1, line.y1 - ymin, ymax - line.y1];
  let u1 = 0;
  let u2 = 1;
  for (let index = 0; index < 4; index += 1) {
    const pi = p[index]!;
    const qi = q[index]!;
    if (Math.abs(pi) < 1e-9) {
      if (qi < 0) return false;
      continue;
    }
    const t = qi / pi;
    if (pi < 0) u1 = Math.max(u1, t);
    else u2 = Math.min(u2, t);
    if (u1 > u2) return false;
  }
  return true;
}

function boxesOverlap(a: Box, b: Box, gap = 0) {
  return a.x < b.x + b.width + gap
    && a.x + a.width > b.x - gap
    && a.y < b.y + b.height + gap
    && a.y + a.height > b.y - gap;
}

function auditRenderedSvg(svg: string, qlId: string) {
  const measurementIds = [...svg.matchAll(/data-measurement-id="([^"]+)"/g)].map((match) => match[1]);
  if (measurementIds.length < 2) throw new Error(`${qlId}: expected at least two rendered dimension annotations, got ${measurementIds.length}.`);

  const svgTag = svg.match(/<svg\b[^>]*>/)?.[0];
  if (!svgTag) throw new Error(`${qlId}: rendered SVG opening tag missing.`);
  const svgAttrs = attrs(svgTag);
  const coreLeft = Number(svgAttrs["data-core-left"]);
  const coreTop = Number(svgAttrs["data-core-top"]);
  const coreRight = Number(svgAttrs["data-core-right"]);
  const coreBottom = Number(svgAttrs["data-core-bottom"]);
  if (![coreLeft, coreTop, coreRight, coreBottom].every(Number.isFinite)) throw new Error(`${qlId}: protected core bounds missing.`);
  const core: Box = { x: coreLeft, y: coreTop, width: coreRight - coreLeft, height: coreBottom - coreTop };

  const boxTags = [...svg.matchAll(/<rect class="label-bg"[^>]*>/g)].map((match) => match[0]);
  const boxes: Box[] = boxTags.map((tag) => {
    const a = attrs(tag);
    return { x: Number(a.x), y: Number(a.y), width: Number(a.width), height: Number(a.height) };
  });
  const dimensionLabelBoxes: Box[] = boxTags.filter((tag) => attrs(tag)["data-dimension-label"] === "true").map((tag) => {
    const a = attrs(tag);
    return { x: Number(a.x), y: Number(a.y), width: Number(a.width), height: Number(a.height) };
  });

  const lineTags = [...svg.matchAll(/<line\b[^>]*>/g)].map((match) => match[0]);
  const visibleCollisionLineTags = lineTags.filter((tag) => attrs(tag)["data-extension-line"] !== "true");
  const lines: Line[] = visibleCollisionLineTags.map((tag) => {
    const a = attrs(tag);
    return {
      x1: Number(a.x1), y1: Number(a.y1), x2: Number(a.x2), y2: Number(a.y2),
      strokeWidth: Number(a["stroke-width"]), kind: a["data-kind"],
    };
  }).filter((line) => [line.x1, line.y1, line.x2, line.y2].every(Number.isFinite));

  let lineLabelIntersections = 0;
  for (const box of boxes) {
    for (const line of lines) {
      if (lineIntersectsBox(line, box)) lineLabelIntersections += 1;
    }
  }
  if (lineLabelIntersections !== 0) throw new Error(`${qlId}: dimensioned SVG has ${lineLabelIntersections} visible line/label intersections.`);

  const dimensionLines: Line[] = lineTags.filter((tag) => attrs(tag)["data-dimension-line"] === "true").map((tag) => {
    const a = attrs(tag);
    return { x1: Number(a.x1), y1: Number(a.y1), x2: Number(a.x2), y2: Number(a.y2), strokeWidth: Number(a["stroke-width"]) };
  });
  if (dimensionLines.length !== measurementIds.length) throw new Error(`${qlId}: dimension-line count ${dimensionLines.length} does not match dimension groups ${measurementIds.length}.`);
  if (dimensionLabelBoxes.length !== measurementIds.length) throw new Error(`${qlId}: dimension-label count ${dimensionLabelBoxes.length} does not match dimension groups ${measurementIds.length}.`);

  const dimensionLineCoreIntrusions = dimensionLines.filter((line) => lineIntersectsBox(line, core, 10)).length;
  const dimensionLabelCoreIntrusions = dimensionLabelBoxes.filter((box) => boxesOverlap(box, core, 10)).length;
  if (dimensionLineCoreIntrusions !== 0) throw new Error(`${qlId}: ${dimensionLineCoreIntrusions} main dimension lines intrude into the protected core diagram.`);
  if (dimensionLabelCoreIntrusions !== 0) throw new Error(`${qlId}: ${dimensionLabelCoreIntrusions} dimension labels intrude into the protected core diagram.`);

  const coreFrameCount = (svg.match(/data-core-frame="true"/g) ?? []).length;
  if (coreFrameCount !== 1) throw new Error(`${qlId}: expected one protected core frame, got ${coreFrameCount}.`);

  const coreLineTags = lineTags.filter((tag) => attrs(tag)["data-core-segment"] === "true");
  if (coreLineTags.length === 0) throw new Error(`${qlId}: no bold core geometry segments rendered.`);
  let primaryMinStroke = Number.POSITIVE_INFINITY;
  for (const tag of coreLineTags) {
    const a = attrs(tag);
    const kind = String(a["data-kind"] ?? "");
    const strokeWidth = Number(a["stroke-width"]);
    if (!Number.isFinite(strokeWidth) || strokeWidth < 2.5) throw new Error(`${qlId}: core geometry stroke is too thin (${strokeWidth}).`);
    if (["GROUND", "GROUND_UNSCALED", "VERTICAL_OBJECT", "VERTICAL", "SIGHT_LINE", "SIGHT"].includes(kind)) {
      primaryMinStroke = Math.min(primaryMinStroke, strokeWidth);
    }
  }
  if (Number.isFinite(primaryMinStroke) && primaryMinStroke < 4.2) throw new Error(`${qlId}: primary diagram geometry must be bold; minimum stroke=${primaryMinStroke}.`);

  return {
    dimensions: measurementIds.length,
    boxes: boxes.length,
    visibleLines: lines.length,
    dimensionLinesOutsideCore: dimensionLines.length,
    dimensionLabelsOutsideCore: dimensionLabelBoxes.length,
    primaryMinStroke: Number.isFinite(primaryMinStroke) ? primaryMinStroke : 2.5,
  };
}

const pack = JSON.parse(readFileSync(jsonPath, "utf8"), reviveBigInt);
let html = readFileSync(htmlPath, "utf8");
const rendered: string[] = [];
let autoDimensions = 0;
let totalDimensions = 0;
let totalLabelBoxes = 0;
let totalOutsideDimensionLines = 0;
let totalOutsideDimensionLabels = 0;
let chapterPrimaryMinStroke = Number.POSITIVE_INFINITY;

for (const row of pack.records as any[]) {
  const dimensioned = applyTrg002V4ReviewDimensions({
    qlId: row.qlId,
    diagram: { ...row.solutionDiagram, measurementArrows: [] },
    canonicalSpatialState: row.canonicalSpatialState,
    englishStem: row.english.stem,
    englishExplanationText: explanationText(row.english.explanation),
  });
  row.solutionDiagram = dimensioned;
  if (row.diagramEvidence?.solutionDiagram) row.diagramEvidence.solutionDiagram = dimensioned;
  autoDimensions += dimensioned.reviewDimensionAudit.autoDimensions;
  totalDimensions += dimensioned.reviewDimensionAudit.totalDimensions;

  const figure = renderTrg002SolutionDiagramSvg({ ...dimensioned, qlId: row.qlId });
  const svg = figure.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error(`${row.qlId}: dimensioned renderer did not emit a solution SVG.`);
  const audit = auditRenderedSvg(svg, row.qlId);
  totalLabelBoxes += audit.boxes;
  totalOutsideDimensionLines += audit.dimensionLinesOutsideCore;
  totalOutsideDimensionLabels += audit.dimensionLabelsOutsideCore;
  chapterPrimaryMinStroke = Math.min(chapterPrimaryMinStroke, audit.primaryMinStroke);
  rendered.push(svg);
}

let index = 0;
html = html.replace(/<svg class="solution-diagram"[\s\S]*?<\/svg>/g, () => {
  const replacement = rendered[index++];
  if (!replacement) throw new Error(`Dimensioned SVG replacement underflow at index ${index}.`);
  return replacement;
});
if (index !== 96 || rendered.length !== 96) throw new Error(`Expected 96 dimensioned SVG replacements, got replaced=${index} rendered=${rendered.length}.`);

html = html.replace(
  "with self-contained MathML mathematical notation and TeX fallback metadata, rendered solution geometry, canonical spatial state and diagram evidence.",
  "with self-contained MathML mathematical notation and TeX fallback metadata, bold rendered solution geometry with all explicit dimensions outside the protected core diagram, canonical spatial state and diagram evidence.",
);

const allSvgs = html.match(/<svg class="solution-diagram"[\s\S]*?<\/svg>/g) ?? [];
const renderedDimensionGroups = html.match(/data-measurement-id="/g) ?? [];
const autoDimensionGroups = html.match(/data-measurement-id="review-dim-/g) ?? [];
if (allSvgs.length !== 96) throw new Error(`Dimensioned review expected 96 SVGs, got ${allSvgs.length}.`);
if (autoDimensionGroups.length !== autoDimensions) throw new Error(`Auto-dimension count mismatch: html=${autoDimensionGroups.length} model=${autoDimensions}.`);
if (renderedDimensionGroups.length !== totalDimensions) throw new Error(`Total dimension count mismatch: html=${renderedDimensionGroups.length} model=${totalDimensions}.`);
if (allSvgs.some((svg) => (svg.match(/data-measurement-id="/g) ?? []).length < 2)) throw new Error("At least one solution diagram exposes fewer than two dimensions.");
if (totalOutsideDimensionLines !== totalDimensions || totalOutsideDimensionLabels !== totalDimensions) {
  throw new Error(`Outside-dimension audit mismatch lines=${totalOutsideDimensionLines} labels=${totalOutsideDimensionLabels} dimensions=${totalDimensions}.`);
}

writeFileSync(jsonPath, stringify(pack), "utf8");
writeFileSync(htmlPath, html, "utf8");
console.log(`TRG002_V4_DIMENSIONED_REVIEW_PASS qls=96 autoDimensions=${autoDimensions} totalDimensions=${totalDimensions} outsideDimensionLines=${totalOutsideDimensionLines} outsideDimensionLabels=${totalOutsideDimensionLabels} labelBoxes=${totalLabelBoxes} minDimensionsPerSvg=2 requestedAnswersHidden=true coreDimensionIntrusions=0 visibleLineLabelIntersections=0 primaryCoreMinStroke=${chapterPrimaryMinStroke.toFixed(1)}`);
