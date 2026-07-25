import type { Men001ExplanationIllustration } from "./types";

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function text(x: number, y: number, value: unknown, anchor: "start" | "middle" | "end" = "middle") {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="diagram-label">${escapeHtml(value)}</text>`;
}

function svg(body: string, accessibleText: string) {
  return `<svg class="mensuration-diagram" viewBox="0 0 440 260" role="img" aria-label="${escapeHtml(accessibleText)}" xmlns="http://www.w3.org/2000/svg">
    <title>${escapeHtml(accessibleText)}</title>
    ${body}
  </svg>`;
}

export function renderMen001ReviewIllustration(
  illustration: Men001ExplanationIllustration,
): string {
  const labels = illustration.labels as Record<string, string>;

  switch (illustration.kind) {
    case "TRIANGLE_SIDE_LABELS":
      return svg(`
        <polygon points="70,205 220,45 375,205" class="shape"/>
        ${text(122, 118, labels.sideA)}
        ${text(320, 118, labels.sideB)}
        ${text(220, 235, labels.sideC)}
      `, illustration.accessibleText);

    case "ISOSCELES_ALTITUDE_SPLIT":
      return svg(`
        <polygon points="65,210 220,40 375,210" class="shape"/>
        <line x1="220" y1="40" x2="220" y2="210" class="guide"/>
        <rect x="220" y="196" width="14" height="14" class="right-angle"/>
        ${text(125, 115, labels.equalSide)}
        ${text(315, 115, labels.equalSide)}
        ${text(220, 238, labels.base)}
        ${text(235, 130, labels.height, "start")}
        ${text(145, 200, labels.halfBase)}
      `, illustration.accessibleText);

    case "RECTANGLE_DIAGONAL_SPLIT":
      return svg(`
        <rect x="70" y="55" width="300" height="155" class="shape"/>
        <line x1="70" y1="210" x2="370" y2="55" class="guide"/>
        ${text(220, 238, labels.length)}
        ${text(48, 138, labels.breadth)}
        ${text(220, 120, labels.diagonal)}
      `, illustration.accessibleText);

    case "RHOMBUS_HALF_DIAGONALS":
      return svg(`
        <polygon points="220,30 385,130 220,230 55,130" class="shape"/>
        <line x1="55" y1="130" x2="385" y2="130" class="guide"/>
        <line x1="220" y1="30" x2="220" y2="230" class="guide"/>
        <rect x="220" y="130" width="13" height="13" class="right-angle"/>
        ${text(220, 252, labels.diagonalA)}
        ${text(248, 82, labels.diagonalB, "start")}
        ${text(135, 119, labels.halfDiagonalA)}
        ${text(238, 79, labels.halfDiagonalB, "start")}
        ${text(310, 72, labels.side)}
      `, illustration.accessibleText);

    case "QUADRILATERAL_DIAGONAL_PERPENDICULARS":
      return svg(`
        <polygon points="60,165 190,45 385,120 245,225" class="shape"/>
        <line x1="60" y1="165" x2="385" y2="120" class="guide"/>
        <line x1="190" y1="45" x2="205" y2="145" class="guide"/>
        <line x1="245" y1="225" x2="230" y2="142" class="guide"/>
        ${text(222, 122, labels.diagonal)}
        ${text(164, 93, labels.perpendicularA, "end")}
        ${text(267, 187, labels.perpendicularB, "start")}
      `, illustration.accessibleText);

    case "CIRCLE_CENTRAL_ANGLE":
      return svg(`
        <circle cx="220" cy="130" r="94" class="shape"/>
        <line x1="220" y1="130" x2="220" y2="36" class="guide"/>
        <line x1="220" y1="130" x2="300" y2="82" class="guide"/>
        <path d="M220 78 A52 52 0 0 1 265 103" class="arc"/>
        ${text(255, 68, labels.centralAngle)}
        ${text(204, 84, labels.radius, "end")}
        ${text(310, 75, labels.measuredPart, "start")}
      `, illustration.accessibleText);

    case "ANNULUS_RADII":
      return svg(`
        <circle cx="220" cy="130" r="100" class="shape"/>
        <circle cx="220" cy="130" r="55" class="shape inner"/>
        <line x1="220" y1="130" x2="320" y2="130" class="guide"/>
        <line x1="220" y1="130" x2="220" y2="75" class="guide"/>
        ${text(275, 120, labels.outerRadius)}
        ${text(235, 96, labels.innerRadius, "start")}
      `, illustration.accessibleText);

    case "CIRCLE_PART_BOUNDARY":
      return svg(`
        <path d="M95 190 A125 125 0 0 1 345 190" class="shape"/>
        <line x1="95" y1="190" x2="345" y2="190" class="shape"/>
        <line x1="220" y1="190" x2="220" y2="65" class="guide"/>
        ${text(220, 45, labels.curvedBoundary)}
        ${text(220, 222, labels.straightEdges)}
        ${text(235, 130, labels.radius, "start")}
      `, illustration.accessibleText);

    case "RECTANGULAR_BORDER_BAND":
      return svg(`
        <rect x="55" y="40" width="330" height="185" class="shape band-fill"/>
        <rect x="105" y="78" width="230" height="109" class="shape inner white-fill"/>
        ${text(220, 248, labels.outerLength)}
        ${text(34, 135, labels.outerBreadth)}
        ${text(220, 175, labels.innerLength)}
        ${text(116, 137, labels.innerBreadth, "start")}
        ${text(80, 70, labels.pathWidth)}
        ${text(325, 60, labels.region)}
      `, illustration.accessibleText);

    case "CIRCULAR_BORDER_BAND":
      return svg(`
        <circle cx="220" cy="130" r="100" class="shape band-fill"/>
        <circle cx="220" cy="130" r="58" class="shape inner white-fill"/>
        <line x1="220" y1="130" x2="320" y2="130" class="guide"/>
        <line x1="220" y1="130" x2="220" y2="72" class="guide"/>
        ${text(270, 120, labels.outerRadius)}
        ${text(234, 98, labels.innerRadius, "start")}
        ${text(300, 154, labels.pathWidth)}
        ${text(105, 62, labels.region)}
      `, illustration.accessibleText);

    case "COMPOSITE_AREA_PARTS":
      return svg(`
        <rect x="55" y="65" width="220" height="145" class="shape band-fill"/>
        <rect x="250" y="105" width="135" height="105" class="shape secondary-fill"/>
        ${text(150, 135, labels.primaryShape)}
        ${text(318, 160, labels.secondaryShape)}
        ${text(220, 42, labels.operation)}
        ${text(270, 225, labels.sharedBoundary)}
      `, illustration.accessibleText);

    case "INSCRIBED_PLANE_RELATION":
      return svg(`
        <rect x="85" y="28" width="270" height="204" class="shape"/>
        <circle cx="220" cy="130" r="100" class="shape inner"/>
        ${text(220, 18, labels.outerShape)}
        ${text(220, 135, labels.innerShape)}
        ${text(220, 252, labels.relation)}
      `, illustration.accessibleText);

    case "REGULAR_HEXAGON_SPLIT":
      return svg(`
        <polygon points="220,28 340,80 340,180 220,232 100,180 100,80" class="shape"/>
        <line x1="220" y1="130" x2="220" y2="28" class="guide"/>
        <line x1="220" y1="130" x2="340" y2="80" class="guide"/>
        <line x1="220" y1="130" x2="340" y2="180" class="guide"/>
        <line x1="220" y1="130" x2="220" y2="232" class="guide"/>
        <line x1="220" y1="130" x2="100" y2="180" class="guide"/>
        <line x1="220" y1="130" x2="100" y2="80" class="guide"/>
        ${text(280, 46, labels.side)}
        ${text(220, 125, `${labels.triangleCount} equal triangles`)}
      `, illustration.accessibleText);

    case "COMPOSITE_EXPOSED_BOUNDARY":
      return svg(`
        <path d="M70 205 L70 75 L275 75 A92 92 0 0 1 275 205 Z" class="shape band-fill"/>
        <line x1="275" y1="75" x2="275" y2="205" class="guide omitted"/>
        ${text(145, 225, labels.straightBoundary)}
        ${text(350, 130, labels.curvedBoundary)}
        ${text(265, 142, labels.omittedSharedEdge, "end")}
      `, illustration.accessibleText);
  }
}
