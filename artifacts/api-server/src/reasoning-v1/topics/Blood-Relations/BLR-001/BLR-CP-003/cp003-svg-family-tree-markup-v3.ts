import type { BlrCp003SvgFamilyTreeDiagram } from "./cp003-svg-family-tree";
import { renderBlrCp003SvgFamilyTreeMarkup as renderV2 } from "./cp003-svg-family-tree-markup-v2";

const SIBLING_ARROW_DEFS = `<defs><marker id="blr-sibling-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5"/></marker></defs>`;
const SIBLING_LINE_END = `stroke-dasharray="8 6" stroke-linecap="round"`;
const SIBLING_LINE_WITH_ARROWS = `${SIBLING_LINE_END} marker-start="url(#blr-sibling-arrow)" marker-end="url(#blr-sibling-arrow)"`;

export function renderBlrCp003SvgFamilyTreeMarkup(
  diagram: BlrCp003SvgFamilyTreeDiagram,
): string {
  const markup = renderV2(diagram);
  const withMarkerDefinition = markup.replace(/<svg([^>]*)>/, `<svg$1>${SIBLING_ARROW_DEFS}`);
  return withMarkerDefinition.replaceAll(SIBLING_LINE_END, SIBLING_LINE_WITH_ARROWS);
}
