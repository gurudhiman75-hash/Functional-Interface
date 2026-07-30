import { useId, useLayoutEffect, useRef } from "react";

import FamilyTreeDiagram from "./FamilyTreeDiagram";
import type { FamilyTreeDiagramData } from "./family-tree-types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const CARD_HALF_WIDTH = 75;
const LEGACY_SIBLING_LINE_OFFSET = 12;
const SIBLING_ROUTE_DEPTH = 18;
const SIBLING_LABEL_OFFSET = 14;

function numericAttribute(element: Element, name: string): number | null {
  const value = Number(element.getAttribute(name));
  return Number.isFinite(value) ? value : null;
}

function ensureArrowMarker(svg: SVGSVGElement, markerId: string): void {
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NAMESPACE, "defs");
    svg.prepend(defs);
  }
  if (defs.querySelector(`[id="${markerId}"]`)) return;

  const marker = document.createElementNS(SVG_NAMESPACE, "marker");
  marker.setAttribute("id", markerId);
  marker.setAttribute("viewBox", "0 0 10 10");
  marker.setAttribute("refX", "9");
  marker.setAttribute("refY", "5");
  marker.setAttribute("markerWidth", "9");
  marker.setAttribute("markerHeight", "9");
  marker.setAttribute("markerUnits", "userSpaceOnUse");
  marker.setAttribute("orient", "auto-start-reverse");

  const arrow = document.createElementNS(SVG_NAMESPACE, "path");
  arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
  arrow.setAttribute("fill", "#4f46e5");
  marker.append(arrow);
  defs.append(marker);
}

function routeSiblingConnectors(root: HTMLElement, markerId: string): void {
  const svg = root.querySelector<SVGSVGElement>("svg");
  if (!svg) return;
  ensureArrowMarker(svg, markerId);

  const legacyLines = svg.querySelectorAll<SVGLineElement>('line[stroke-dasharray="8 6"]');
  for (const line of legacyLines) {
    const x1 = numericAttribute(line, "x1");
    const x2 = numericAttribute(line, "x2");
    const y1 = numericAttribute(line, "y1");
    const y2 = numericAttribute(line, "y2");
    if (x1 === null || x2 === null || y1 === null || y2 === null) continue;

    const leftCardCentre = Math.min(x1, x2) - CARD_HALF_WIDTH;
    const rightCardCentre = Math.max(x1, x2) + CARD_HALF_WIDTH;
    const cardBottom = Math.min(y1, y2) - LEGACY_SIBLING_LINE_OFFSET;
    const routeY = cardBottom + SIBLING_ROUTE_DEPTH;

    const path = document.createElementNS(SVG_NAMESPACE, "path");
    path.setAttribute(
      "d",
      `M ${leftCardCentre} ${cardBottom} V ${routeY} H ${rightCardCentre} V ${cardBottom}`,
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", line.getAttribute("stroke") ?? "#4f46e5");
    path.setAttribute("stroke-width", line.getAttribute("stroke-width") ?? "4");
    path.setAttribute("stroke-dasharray", "8 6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("marker-start", `url(#${markerId})`);
    path.setAttribute("marker-end", `url(#${markerId})`);
    path.setAttribute("data-sibling-route", "card-bottom-bracket");

    const group = line.parentElement;
    line.replaceWith(path);

    const label = group?.querySelector<SVGTextElement>("text");
    if (label?.textContent?.trim().toLowerCase() === "siblings") {
      label.setAttribute("x", String((leftCardCentre + rightCardCentre) / 2));
      label.setAttribute("y", String(routeY + SIBLING_LABEL_OFFSET));
    }
  }
}

export default function RoutedFamilyTreeDiagram({
  data,
  className,
}: {
  data: FamilyTreeDiagramData;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markerId = `blr-sibling-arrow-${useId().replaceAll(":", "")}`;

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const applyRouting = () => routeSiblingConnectors(root, markerId);
    applyRouting();

    const observer = new MutationObserver(applyRouting);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [data, markerId]);

  return (
    <div ref={rootRef} data-family-tree-routing="card-bottom-sibling-bracket">
      <FamilyTreeDiagram data={data} className={className} />
    </div>
  );
}
