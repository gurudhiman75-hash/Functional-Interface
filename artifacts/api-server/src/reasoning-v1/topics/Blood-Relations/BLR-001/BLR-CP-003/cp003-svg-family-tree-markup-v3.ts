import type { BlrCp003SvgFamilyTreeDiagram } from "./cp003-svg-family-tree";
import { renderBlrCp003SvgFamilyTreeMarkup as renderV2 } from "./cp003-svg-family-tree-markup-v2";

const CARD_HALF_WIDTH = 75;
const LEGACY_SIBLING_LINE_OFFSET = 12;
const SIBLING_CARD_EDGE_INSET = 18;
const SIBLING_ARROW_CLEARANCE = 8;
const SIBLING_ROUTE_DEPTH = 18;
const SIBLING_LABEL_OFFSET = 14;

const SIBLING_ARROW_DEFS = `<defs><marker id="blr-sibling-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="-90"><path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5"/></marker></defs>`;

const SIBLING_GROUP_PATTERN = /<g><line x1="(-?\d+(?:\.\d+)?)" y1="(-?\d+(?:\.\d+)?)" x2="(-?\d+(?:\.\d+)?)" y2="(-?\d+(?:\.\d+)?)" stroke="#4f46e5" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round"\/><text x="(-?\d+(?:\.\d+)?)" y="(-?\d+(?:\.\d+)?)" text-anchor="middle" font-size="10" font-weight="700" fill="#4f46e5">SIBLINGS<\/text><\/g>/g;

function numberText(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.00$/, "");
}

function routeSiblingGroup(
  _match: string,
  rawX1: string,
  rawY1: string,
  rawX2: string,
  rawY2: string,
): string {
  const x1 = Number(rawX1);
  const x2 = Number(rawX2);
  const y1 = Number(rawY1);
  const y2 = Number(rawY2);

  const leftCardCentre = Math.min(x1, x2) - CARD_HALF_WIDTH;
  const rightCardCentre = Math.max(x1, x2) + CARD_HALF_WIDTH;
  const leftAnchorX = leftCardCentre + CARD_HALF_WIDTH - SIBLING_CARD_EDGE_INSET;
  const rightAnchorX = rightCardCentre - CARD_HALF_WIDTH + SIBLING_CARD_EDGE_INSET;
  const cardBottom = Math.min(y1, y2) - LEGACY_SIBLING_LINE_OFFSET;
  const arrowTipY = cardBottom + SIBLING_ARROW_CLEARANCE;
  const routeY = arrowTipY + SIBLING_ROUTE_DEPTH;
  const labelX = (leftAnchorX + rightAnchorX) / 2;
  const labelY = routeY + SIBLING_LABEL_OFFSET;

  return `<g data-sibling-route="card-bottom-bracket" data-sibling-target="inner-card-bottom" data-sibling-arrow-clearance="${SIBLING_ARROW_CLEARANCE}"><path d="M ${numberText(leftAnchorX)} ${numberText(arrowTipY)} V ${numberText(routeY)} H ${numberText(rightAnchorX)} V ${numberText(arrowTipY)}" fill="none" stroke="#4f46e5" stroke-width="4" stroke-dasharray="8 6" stroke-linecap="round" stroke-linejoin="round" marker-start="url(#blr-sibling-arrow)" marker-end="url(#blr-sibling-arrow)"/><text x="${numberText(labelX)}" y="${numberText(labelY)}" text-anchor="middle" font-size="10" font-weight="700" fill="#4f46e5">SIBLINGS</text></g>`;
}

export function renderBlrCp003SvgFamilyTreeMarkup(
  diagram: BlrCp003SvgFamilyTreeDiagram,
): string {
  const markup = renderV2(diagram);
  const routedMarkup = markup.replace(SIBLING_GROUP_PATTERN, routeSiblingGroup);
  return routedMarkup.replace(/<svg([^>]*)>/, `<svg$1>${SIBLING_ARROW_DEFS}`);
}
