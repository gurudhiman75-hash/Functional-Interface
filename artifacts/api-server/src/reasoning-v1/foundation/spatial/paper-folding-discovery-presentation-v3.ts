import {
  applyPfcFoldV1,
  type PfcFoldV1,
  type PfcLayerFragmentV1,
} from "./paper-folding-foundation-v1";
import {
  renderPfcDiscoveryOptionSvgV1,
  type PfcDiscoveryQuestionV1,
} from "./paper-folding-discovery-v1";
import {
  generatePfcDiscoveryQuestionV2,
  PFC_001_DISCOVERY_REMEDIATION_AUTHORITY_V2,
} from "./paper-folding-discovery-remediated-v2";
import type { SpatialPoint } from "./types";

export const PFC_001_DISCOVERY_PRESENTATION_AUTHORITY_V3 = Object.freeze({
  authorityId: "PFC-001-DISCOVERY-PRESENTATION-V3" as const,
  chapterCode: "PFC-001" as const,
  semanticAuthority: PFC_001_DISCOVERY_REMEDIATION_AUTHORITY_V2.authorityId,
  remediation: [
    "VISIBLE_FOLD_DIRECTION_ARROW",
    "HUMAN_LEARNER_EXPLANATION_WITHOUT_RAW_COORDINATES",
  ] as const,
  learnerOptionPixels: 112,
  stimulusReviewPixels: 520,
  permanentQlAllocationStatus: "NOT_ALLOCATED_LEARNER_REVIEW_REQUIRED" as const,
} as const);

function q(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function polygonPoints(points: readonly SpatialPoint[]): string {
  return points.map((point) => `${q(point.x)},${q(point.y)}`).join(" ");
}

function foldArrow(fold: PfcFoldV1, markerId: string): string {
  const dx = fold.line.b.x - fold.line.a.x;
  const dy = fold.line.b.y - fold.line.a.y;
  const length = Math.hypot(dx, dy);
  if (length <= 0) return "";
  const nx = -dy / length;
  const ny = dx / length;
  const sign = fold.movingSide === "POSITIVE" ? 1 : -1;
  const t = fold.kind === "DIAGONAL" || fold.kind === "CORNER" ? 0.55 : 0.35;
  const anchor = {
    x: fold.line.a.x + dx * t,
    y: fold.line.a.y + dy * t,
  };
  const start = {
    x: anchor.x + nx * sign * 18,
    y: anchor.y + ny * sign * 18,
  };
  const end = {
    x: anchor.x + nx * sign * 3,
    y: anchor.y + ny * sign * 3,
  };
  return `<line x1="${q(start.x)}" y1="${q(start.y)}" x2="${q(end.x)}" y2="${q(end.y)}" stroke="black" stroke-width="2.2" marker-end="url(#${markerId})"/>`;
}

export function renderPfcDiscoveryStimulusSvgV3(
  question: PfcDiscoveryQuestionV1,
  size = 520,
): string {
  let fragments: PfcLayerFragmentV1[] = [{
    fragmentId: "SHEET-ROOT",
    sourceSheetRegionId: "SHEET-ROOT",
    polygon: question.sheetBoundary.map((point) => ({ ...point })),
    transformHistory: [],
  }];
  const panels: string[] = [];
  const panelCount = question.folds.length + 2;
  const panelWidth = 126;
  const markerId = `pfc-arrow-${question.questionId.replace(/[^a-zA-Z0-9]/g, "")}`;

  panels.push(`<g transform="translate(8,12)"><text x="50" y="-3" text-anchor="middle" font-size="9">Paper</text><polygon points="${polygonPoints(question.sheetBoundary)}" fill="white" stroke="black" stroke-width="1.8"/></g>`);

  question.folds.forEach((fold, index) => {
    fragments = applyPfcFoldV1(fragments, fold);
    const x = 8 + (index + 1) * panelWidth;
    const visiblePolygons = fragments
      .map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.72" stroke="black" stroke-width="1.15"/>`)
      .join("");
    panels.push(`<g transform="translate(${x},12)"><text x="50" y="-3" text-anchor="middle" font-size="9">Fold ${index + 1}</text>${visiblePolygons}<line x1="${q(fold.line.a.x)}" y1="${q(fold.line.a.y)}" x2="${q(fold.line.b.x)}" y2="${q(fold.line.b.y)}" stroke="black" stroke-width="1" stroke-dasharray="4 3"/>${foldArrow(fold, markerId)}</g>`);
  });

  const finalX = 8 + (panelCount - 1) * panelWidth;
  const finalPolygons = fragments
    .map((fragment) => `<polygon points="${polygonPoints(fragment.polygon)}" fill="white" fill-opacity="0.72" stroke="black" stroke-width="1.15"/>`)
    .join("");
  const finalCuts = question.cuts
    .map((cut) => `<circle cx="${q(cut.center.x)}" cy="${q(cut.center.y)}" r="${q(Math.max(2.8, cut.radius))}" fill="${cut.kind === "POINT_HOLE" ? "black" : "white"}" stroke="black" stroke-width="1.5"/>`)
    .join("");
  panels.push(`<g transform="translate(${finalX},12)"><text x="50" y="-3" text-anchor="middle" font-size="9">Cut</text>${finalPolygons}${finalCuts}</g>`);

  const viewWidth = 16 + panelCount * panelWidth;
  const viewHeight = 130;
  const scale = size / Math.max(viewWidth, viewHeight);
  const width = Math.round(viewWidth * scale);
  const height = Math.round(viewHeight * scale);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="Paper folding and cutting sequence"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="black"/></marker></defs><rect width="100%" height="100%" fill="white"/>${panels.join("")}</svg>`;
}

function learnerExplanation(question: PfcDiscoveryQuestionV1): string {
  const answer = question.correctOptionId;
  switch (question.representationId) {
    case "PFC-PROT-01-SINGLE-AXIAL-HOLE":
      return `There is one fold, so the punch passes through two layers. When the fold is opened, the hole appears at the same distance on the opposite side of the fold line. The two matching holes are shown in option ${answer}.`;
    case "PFC-PROT-02-SINGLE-AXIAL-EDGE-NOTCH":
      return `The cut is made on the outer edge of the folded paper. Opening the fold creates the same notch at the matching edge position on the other side. The cuts stay on the boundary, which matches option ${answer}.`;
    case "PFC-PROT-03-PERPENDICULAR-DOUBLE-FOLD":
      return `The paper is folded twice in perpendicular directions, making four layers at the punch. Open the second fold first to get a matching pair, then open the first fold to mirror that pair again. Four symmetric holes appear, as in option ${answer}.`;
    case "PFC-PROT-04-REPEATED-SAME-DIRECTION":
      return `Both folds are in the same direction. Open the second fold first, which mirrors the punch once, and then open the first fold, which mirrors both marks again. The final four-hole pattern is option ${answer}.`;
    case "PFC-PROT-05-CORNER-FOLD":
      return `Only the folded corner lies over the paper, so the punch passes through two layers in that overlap. Opening the corner reflects one hole across the diagonal fold line. The matching diagonal pair is shown in option ${answer}.`;
    case "PFC-PROT-06-DIAGONAL-FOLD":
      return `The fold is diagonal. When the paper is opened, the punch is reflected across that diagonal line at the same perpendicular distance. The original and reflected holes form the pair in option ${answer}.`;
    case "PFC-PROT-07-DIAGONAL-PLUS-AXIAL":
      return `Two different fold lines are used. Open the diagonal fold first, then open the axial fold. Each opening reflects the existing marks across that fold line, giving the four-hole arrangement in option ${answer}.`;
    case "PFC-PROT-08-MULTIPLE-CUTS":
      return `Two punches are made while four layers are together. Each punch therefore produces four positions after both folds are opened. Keeping the two punch patterns separate gives eight holes in total, matching option ${answer}.`;
    case "PFC-PROT-09-MULTI-FOLD-EDGE-NOTCH":
      return `The cut is on the boundary of the folded packet. Opening the two folds copies that notch to the corresponding boundary positions; it does not become an interior hole. The four edge notches are shown in option ${answer}.`;
    case "PFC-PROT-10-THREE-FOLD-ADVANCED":
      return `Three folds put eight layers under the punch. Open the last fold first, then the second, then the first. The marks double from 1 to 2, then 4, then 8, producing the pattern in option ${answer}.`;
  }
}

export function generatePfcDiscoveryQuestionV3(discoveryIndex: number): PfcDiscoveryQuestionV1 {
  const question = generatePfcDiscoveryQuestionV2(discoveryIndex);
  return {
    ...question,
    explanation: learnerExplanation(question),
  };
}

export function generatePfcDiscoveryCorpusV3(): PfcDiscoveryQuestionV1[] {
  return Array.from({ length: 800 }, (_, index) => generatePfcDiscoveryQuestionV3(index));
}

export function renderPfcDiscoveryReviewHtmlV3(questions: readonly PfcDiscoveryQuestionV1[]): string {
  const cards = questions.map((question) => `<article style="border:1px solid #ccc;border-radius:10px;padding:16px;margin:16px 0;background:#fff"><h2 style="margin:0 0 4px">${question.questionId} · ${question.representationId}</h2><p style="margin:4px 0 12px">${question.difficulty} · ${question.representationTitle}</p><p><strong>Question:</strong> A square paper is folded in the arrow direction and cut as shown. Which option shows the paper after it is fully unfolded?</p><div style="overflow:auto">${renderPfcDiscoveryStimulusSvgV3(question, 520)}</div><div style="display:grid;grid-template-columns:repeat(4,minmax(112px,1fr));gap:12px;margin-top:14px">${question.options.map((option) => `<div style="text-align:center"><strong>${option.optionId}</strong><div>${renderPfcDiscoveryOptionSvgV1(option, 112)}</div></div>`).join("")}</div><p><strong>Answer:</strong> ${question.correctOptionId}</p><p><strong>Explanation:</strong> ${question.explanation}</p></article>`).join("\n");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PFC-001 Discovery Learner Review V3</title></head><body style="font-family:Arial,sans-serif;background:#f5f5f5;color:#111;max-width:1100px;margin:0 auto;padding:16px"><h1>PFC-001 Discovery Learner Review V3</h1><p>Fold arrows show the moving side. Questions and answers come from semantic fold-state authority; SVG is presentation only.</p>${cards}</body></html>`;
}
