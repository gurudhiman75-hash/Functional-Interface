import type { Men001ExplanationIllustration } from "./types";

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function text(
  x: number,
  y: number,
  value: unknown,
  anchor: "start" | "middle" | "end" = "middle",
  className = "diagram-label",
) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="${className}">${escapeHtml(value)}</text>`;
}

function svg(body: string, accessibleText: string) {
  return `<svg class="mensuration-diagram" viewBox="0 0 440 260" role="img" aria-label="${escapeHtml(accessibleText)}" xmlns="http://www.w3.org/2000/svg">
    <title>${escapeHtml(accessibleText)}</title>
    ${body}
  </svg>`;
}

function numericLabel(value: unknown) {
  const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  degreesClockwiseFromTop: number,
) {
  const radians = ((degreesClockwiseFromTop - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function arcPath(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  const start = polarPoint(cx, cy, radius, 0);
  const end = polarPoint(cx, cy, radius, angle);
  const largeArc = angle > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

function sectorPath(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) {
  const start = polarPoint(cx, cy, radius, 0);
  const end = polarPoint(cx, cy, radius, angle);
  const largeArc = angle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

function renderCentralAngle(
  illustration: Men001ExplanationIllustration,
  solveMode: string,
  answer: string,
) {
  const labels = illustration.labels as Record<string, string>;
  const knownAngle = numericLabel(labels.centralAngle);
  const recoveredAngle = numericLabel(answer);
  const angle = clamp(knownAngle ?? recoveredAngle ?? 90, 20, 340);
  const cx = 220;
  const cy = 132;
  const radius = 94;
  const start = polarPoint(cx, cy, radius, 0);
  const end = polarPoint(cx, cy, radius, angle);
  const midpoint = polarPoint(cx, cy, 112, angle / 2);
  const radiusLabel = polarPoint(cx, cy, 52, 0);
  const angleLabel = polarPoint(cx, cy, 43, angle / 2);
  const usesSector = /Sector/i.test(solveMode) || /sector/i.test(labels.measuredPart ?? "");
  const showsPerimeter = /Perimeter/i.test(solveMode);

  return svg(`
    <circle cx="${cx}" cy="${cy}" r="${radius}" class="shape"/>
    ${usesSector ? `<path d="${sectorPath(cx, cy, radius, angle)}" class="sector-fill"/>` : ""}
    <line x1="${cx}" y1="${cy}" x2="${start.x.toFixed(2)}" y2="${start.y.toFixed(2)}" class="guide"/>
    <line x1="${cx}" y1="${cy}" x2="${end.x.toFixed(2)}" y2="${end.y.toFixed(2)}" class="guide"/>
    <path d="${arcPath(cx, cy, radius, angle)}" class="arc"/>
    <path d="${arcPath(cx, cy, 38, angle)}" class="angle-arc"/>
    ${showsPerimeter ? `<path d="M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} M ${cx} ${cy} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}" class="boundary-accent"/>` : ""}
    ${text(radiusLabel.x - 8, radiusLabel.y, labels.radius, "end")}
    ${text(angleLabel.x, angleLabel.y + 5, labels.centralAngle)}
    ${text(midpoint.x, midpoint.y + 5, labels.measuredPart, midpoint.x < cx ? "end" : "start")}
  `, illustration.accessibleText);
}

function renderCirclePartBoundary(
  illustration: Men001ExplanationIllustration,
  solveMode: string,
) {
  const labels = illustration.labels as Record<string, string>;
  if (/Quadrant/i.test(solveMode)) {
    return svg(`
      <path d="M 135 205 L 135 65 A 140 140 0 0 1 275 205 Z" class="shape sector-fill"/>
      <path d="M 135 65 A 140 140 0 0 1 275 205" class="arc"/>
      <path d="M 135 205 L 135 65 M 135 205 L 275 205" class="boundary-accent"/>
      <rect x="135" y="191" width="14" height="14" class="right-angle"/>
      ${text(222, 112, labels.curvedBoundary, "start")}
      ${text(205, 232, labels.straightEdges)}
      ${text(120, 137, labels.radius, "end")}
    `, illustration.accessibleText);
  }

  return svg(`
    <path d="M95 190 A125 125 0 0 1 345 190" class="shape"/>
    <line x1="95" y1="190" x2="345" y2="190" class="boundary-accent"/>
    <line x1="220" y1="190" x2="220" y2="65" class="guide"/>
    <path d="M95 190 A125 125 0 0 1 345 190" class="arc"/>
    ${text(220, 45, labels.curvedBoundary)}
    ${text(220, 222, labels.straightEdges)}
    ${text(235, 130, labels.radius, "start")}
  `, illustration.accessibleText);
}

function renderRhombus(
  illustration: Men001ExplanationIllustration,
) {
  const labels = illustration.labels as Record<string, string>;
  const diagonalA = numericLabel(labels.diagonalA) ?? 16;
  const diagonalB = numericLabel(labels.diagonalB) ?? 30;
  const ratio = clamp(diagonalB / diagonalA, 0.6, 2.4);
  const halfX = ratio >= 1 ? Math.max(45, 105 / ratio) : 145;
  const halfY = ratio >= 1 ? 105 : Math.max(45, 145 * ratio);
  const cx = 220;
  const cy = 130;
  const left = cx - halfX;
  const right = cx + halfX;
  const top = cy - halfY;
  const bottom = cy + halfY;

  return svg(`
    <polygon points="${cx},${top} ${right},${cy} ${cx},${bottom} ${left},${cy}" class="shape"/>
    <line x1="${left}" y1="${cy}" x2="${right}" y2="${cy}" class="guide"/>
    <line x1="${cx}" y1="${top}" x2="${cx}" y2="${bottom}" class="guide"/>
    <path d="M ${cx} ${cy} h 13 v 13 h -13" class="right-angle"/>
    ${text(cx, bottom + 22, labels.diagonalA)}
    ${text(cx + 18, top + halfY / 2, labels.halfDiagonalB, "start")}
    ${text(left + halfX / 2, cy - 10, labels.halfDiagonalA)}
    ${text(cx + 18, top + 18, labels.diagonalB, "start")}
    ${text(right - 14, top + halfY / 2 - 4, labels.side, "end")}
  `, illustration.accessibleText);
}

function renderPerpendicularQuadrilateral(
  illustration: Men001ExplanationIllustration,
) {
  const labels = illustration.labels as Record<string, string>;
  return svg(`
    <polygon points="55,145 175,42 390,145 265,228" class="shape"/>
    <line x1="55" y1="145" x2="390" y2="145" class="guide"/>
    <line x1="175" y1="42" x2="175" y2="145" class="guide"/>
    <line x1="265" y1="228" x2="265" y2="145" class="guide"/>
    <path d="M175 145 h14 v-14 M265 145 h-14 v14" class="right-angle"/>
    ${text(222, 165, labels.diagonal)}
    ${text(160, 92, labels.perpendicularA, "end")}
    ${text(280, 190, labels.perpendicularB, "start")}
  `, illustration.accessibleText);
}

function renderCompositeArea(
  illustration: Men001ExplanationIllustration,
  solveMode: string,
) {
  const labels = illustration.labels as Record<string, string>;
  const operation = labels.operation ?? "";

  if (/RectangleSemicircleCompositeArea|RectangleLengthFromCompositeArea/i.test(solveMode)) {
    return svg(`
      <rect x="65" y="65" width="230" height="150" class="shape piece-a"/>
      <path d="M295 65 A75 75 0 0 1 295 215 Z" class="shape piece-b"/>
      <line x1="295" y1="65" x2="295" y2="215" class="guide omitted"/>
      ${text(170, 145, labels.primaryShape)}
      ${text(342, 145, labels.secondaryShape)}
      ${text(220, 38, operation)}
    `, illustration.accessibleText);
  }

  if (/StadiumCompositeArea/i.test(solveMode)) {
    return svg(`
      <rect x="120" y="65" width="200" height="150" class="shape piece-a"/>
      <path d="M120 65 A75 75 0 0 0 120 215 Z" class="shape piece-b"/>
      <path d="M320 65 A75 75 0 0 1 320 215 Z" class="shape piece-b"/>
      <line x1="120" y1="65" x2="120" y2="215" class="guide omitted"/>
      <line x1="320" y1="65" x2="320" y2="215" class="guide omitted"/>
      ${text(220, 145, labels.primaryShape)}
      ${text(220, 38, labels.secondaryShape)}
    `, illustration.accessibleText);
  }

  if (/RectangleTriangleCompositeArea/i.test(solveMode)) {
    return svg(`
      <rect x="95" y="105" width="250" height="120" class="shape piece-a"/>
      <polygon points="95,105 220,35 345,105" class="shape piece-b"/>
      <line x1="95" y1="105" x2="345" y2="105" class="guide omitted"/>
      ${text(220, 175, labels.primaryShape)}
      ${text(220, 82, labels.secondaryShape)}
      ${text(220, 248, operation)}
    `, illustration.accessibleText);
  }

  if (/TwoRectangleCompositeArea/i.test(solveMode)) {
    return svg(`
      <rect x="60" y="70" width="210" height="150" class="shape piece-a"/>
      <rect x="270" y="125" width="115" height="95" class="shape piece-b"/>
      <line x1="270" y1="125" x2="270" y2="220" class="guide omitted"/>
      ${text(160, 145, labels.primaryShape)}
      ${text(327, 177, labels.secondaryShape)}
      ${text(220, 42, operation)}
    `, illustration.accessibleText);
  }

  if (/LShapeAreaBySubtraction/i.test(solveMode)) {
    return svg(`
      <path d="M70 45 H365 V215 H235 V135 H70 Z" class="shape piece-a"/>
      <rect x="235" y="45" width="130" height="90" class="cutout-fill"/>
      <path d="M235 45 V135 H365" class="guide omitted"/>
      ${text(145, 145, labels.primaryShape)}
      ${text(300, 95, labels.secondaryShape)}
      ${text(220, 242, operation)}
    `, illustration.accessibleText);
  }

  if (/SquareMinusCircleShadedArea|SquareSideFromShadedArea/i.test(solveMode)) {
    return svg(`
      <rect x="100" y="25" width="220" height="220" class="shape piece-a"/>
      <circle cx="210" cy="135" r="110" class="shape cutout-fill"/>
      ${text(210, 18, labels.primaryShape)}
      ${text(210, 140, labels.secondaryShape)}
      ${text(350, 135, operation, "start")}
    `, illustration.accessibleText);
  }

  if (/CircleMinusSquareShadedArea|CircleRadiusFromCircleMinusSquareShadedArea/i.test(solveMode)) {
    return svg(`
      <circle cx="220" cy="132" r="108" class="shape piece-a"/>
      <polygon points="220,24 328,132 220,240 112,132" class="shape cutout-fill"/>
      ${text(220, 18, labels.primaryShape)}
      ${text(220, 138, labels.secondaryShape)}
      ${text(355, 132, operation, "start")}
    `, illustration.accessibleText);
  }

  if (/RectangleMinusTwoSemicirclesArea/i.test(solveMode)) {
    return svg(`
      <rect x="70" y="60" width="300" height="160" class="shape piece-a"/>
      <path d="M70 60 A80 80 0 0 1 70 220 Z" class="shape cutout-fill"/>
      <path d="M370 60 A80 80 0 0 0 370 220 Z" class="shape cutout-fill"/>
      ${text(220, 145, labels.primaryShape)}
      ${text(220, 42, labels.secondaryShape)}
      ${text(220, 246, operation)}
    `, illustration.accessibleText);
  }

  if (/FourCornerQuadrantsShadedArea/i.test(solveMode)) {
    return svg(`
      <rect x="90" y="20" width="240" height="240" class="shape piece-a"/>
      <path d="M90 20 H210 A120 120 0 0 1 90 140 Z" class="shape cutout-fill"/>
      <path d="M330 20 V140 A120 120 0 0 1 210 20 Z" class="shape cutout-fill"/>
      <path d="M330 260 H210 A120 120 0 0 1 330 140 Z" class="shape cutout-fill"/>
      <path d="M90 260 V140 A120 120 0 0 1 210 260 Z" class="shape cutout-fill"/>
      ${text(210, 140, labels.primaryShape)}
      ${text(210, 12, labels.secondaryShape)}
      ${text(365, 140, operation, "start")}
    `, illustration.accessibleText);
  }

  if (/OverlappingRectanglesUnionArea/i.test(solveMode)) {
    return svg(`
      <rect x="55" y="55" width="235" height="140" class="shape piece-a translucent"/>
      <rect x="175" y="100" width="210" height="125" class="shape piece-b translucent"/>
      <rect x="175" y="100" width="115" height="95" class="overlap-fill"/>
      ${text(130, 120, labels.primaryShape)}
      ${text(320, 175, labels.secondaryShape)}
      ${text(232, 152, "overlap")}
      ${text(220, 38, operation)}
    `, illustration.accessibleText);
  }

  return svg(`
    <rect x="55" y="65" width="220" height="145" class="shape piece-a"/>
    <rect x="250" y="105" width="135" height="105" class="shape piece-b"/>
    ${text(150, 135, labels.primaryShape)}
    ${text(318, 160, labels.secondaryShape)}
    ${text(220, 42, operation)}
  `, illustration.accessibleText);
}

function renderInscribedRelation(
  illustration: Men001ExplanationIllustration,
  solveMode: string,
) {
  const labels = illustration.labels as Record<string, string>;

  if (/InscribedSquareAreaInCircle/i.test(solveMode)) {
    return svg(`
      <circle cx="220" cy="130" r="105" class="shape"/>
      <polygon points="220,25 325,130 220,235 115,130" class="shape inner secondary-fill"/>
      <line x1="115" y1="130" x2="325" y2="130" class="guide"/>
      ${text(220, 18, labels.outerShape)}
      ${text(220, 138, labels.innerShape)}
      ${text(220, 255, labels.relation)}
    `, illustration.accessibleText);
  }

  if (/LargestCircleRadiusInRectangle/i.test(solveMode)) {
    return svg(`
      <rect x="55" y="60" width="330" height="140" class="shape"/>
      <circle cx="220" cy="130" r="70" class="shape inner secondary-fill"/>
      <line x1="150" y1="130" x2="290" y2="130" class="guide"/>
      ${text(220, 48, labels.outerShape)}
      ${text(220, 138, labels.innerShape)}
      ${text(220, 230, labels.relation)}
    `, illustration.accessibleText);
  }

  return svg(`
    <rect x="110" y="20" width="220" height="220" class="shape"/>
    <circle cx="220" cy="130" r="110" class="shape inner secondary-fill"/>
    <line x1="110" y1="130" x2="330" y2="130" class="guide"/>
    ${text(220, 15, labels.outerShape)}
    ${text(220, 138, labels.innerShape)}
    ${text(220, 257, labels.relation)}
  `, illustration.accessibleText);
}

function renderRegularHexagon(
  illustration: Men001ExplanationIllustration,
) {
  const labels = illustration.labels as Record<string, string>;
  const cx = 220;
  const cy = 130;
  const radius = 100;
  const points = Array.from({ length: 6 }, (_, index) =>
    polarPoint(cx, cy, radius, index * 60),
  );
  const polygon = points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
  const spokes = points
    .map((point) => `<line x1="${cx}" y1="${cy}" x2="${point.x.toFixed(2)}" y2="${point.y.toFixed(2)}" class="guide"/>`)
    .join("");
  const sideMidpoint = {
    x: (points[0]!.x + points[1]!.x) / 2,
    y: (points[0]!.y + points[1]!.y) / 2,
  };

  return svg(`
    <polygon points="${polygon}" class="shape"/>
    ${spokes}
    <circle cx="${cx}" cy="${cy}" r="3" class="centre-dot"/>
    ${text(sideMidpoint.x + 12, sideMidpoint.y - 8, labels.side, "start")}
    ${text(cx, cy + 5, `${labels.triangleCount} equal triangles`)}
  `, illustration.accessibleText);
}

function renderCompositeBoundary(
  illustration: Men001ExplanationIllustration,
  solveMode: string,
) {
  const labels = illustration.labels as Record<string, string>;

  if (/RectangleSemicircleCompositePerimeter/i.test(solveMode)) {
    return svg(`
      <path d="M70 205 L70 55 L285 55 A75 75 0 0 1 285 205 Z" class="shape piece-a"/>
      <line x1="285" y1="55" x2="285" y2="205" class="guide omitted"/>
      <path d="M70 205 L70 55 L285 55 M285 205 L70 205" class="boundary-accent"/>
      <path d="M285 55 A75 75 0 0 1 285 205" class="arc"/>
      ${text(150, 230, labels.straightBoundary)}
      ${text(350, 132, labels.curvedBoundary, "start")}
      ${text(275, 140, labels.omittedSharedEdge, "end")}
    `, illustration.accessibleText);
  }

  if (/StadiumCompositePerimeter|StadiumStraightLengthFromPerimeter/i.test(solveMode)) {
    return svg(`
      <path d="M125 55 H315 A75 75 0 0 1 315 205 H125 A75 75 0 0 1 125 55 Z" class="shape piece-a"/>
      <line x1="125" y1="55" x2="125" y2="205" class="guide omitted"/>
      <line x1="315" y1="55" x2="315" y2="205" class="guide omitted"/>
      <path d="M125 55 H315 M315 205 H125" class="boundary-accent"/>
      <path d="M315 55 A75 75 0 0 1 315 205 M125 205 A75 75 0 0 1 125 55" class="arc"/>
      ${text(220, 42, labels.straightBoundary)}
      ${text(220, 238, labels.curvedBoundary)}
    `, illustration.accessibleText);
  }

  if (/LShapePerimeter/i.test(solveMode)) {
    return svg(`
      <path d="M70 45 H365 V125 H240 V220 H70 Z" class="shape piece-a boundary-accent"/>
      ${text(175, 142, labels.straightBoundary)}
      ${text(300, 105, labels.omittedSharedEdge)}
    `, illustration.accessibleText);
  }

  if (/JoinedRectanglesCompositePerimeter/i.test(solveMode)) {
    return svg(`
      <rect x="55" y="50" width="245" height="170" class="shape piece-a"/>
      <rect x="300" y="105" width="95" height="115" class="shape piece-b"/>
      <line x1="300" y1="105" x2="300" y2="220" class="guide omitted"/>
      <path d="M55 220 V50 H300 V105 H395 V220 H55" class="boundary-accent"/>
      ${text(175, 145, labels.straightBoundary)}
      ${text(288, 165, labels.omittedSharedEdge, "end")}
    `, illustration.accessibleText);
  }

  if (/SquareWithCircularHoleBoundary/i.test(solveMode)) {
    return svg(`
      <rect x="105" y="20" width="220" height="220" class="shape piece-a boundary-accent"/>
      <circle cx="215" cy="130" r="62" class="shape cutout-fill arc"/>
      ${text(215, 14, labels.straightBoundary)}
      ${text(215, 135, labels.curvedBoundary)}
      ${text(215, 257, labels.omittedSharedEdge)}
    `, illustration.accessibleText);
  }

  return svg(`
    <path d="M70 205 L70 75 L275 75 A92 92 0 0 1 275 205 Z" class="shape piece-a"/>
    <line x1="275" y1="75" x2="275" y2="205" class="guide omitted"/>
    ${text(145, 225, labels.straightBoundary)}
    ${text(350, 130, labels.curvedBoundary)}
    ${text(265, 142, labels.omittedSharedEdge, "end")}
  `, illustration.accessibleText);
}

export function renderMen001ReviewIllustration(
  illustration: Men001ExplanationIllustration,
  solveMode: string,
  answer: string,
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
        <path d="M220 210 h14 v-14" class="right-angle"/>
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
        ${text(245, 118, labels.diagonal)}
      `, illustration.accessibleText);

    case "RHOMBUS_HALF_DIAGONALS":
      return renderRhombus(illustration);

    case "QUADRILATERAL_DIAGONAL_PERPENDICULARS":
      return renderPerpendicularQuadrilateral(illustration);

    case "CIRCLE_CENTRAL_ANGLE":
      return renderCentralAngle(illustration, solveMode, answer);

    case "ANNULUS_RADII":
      return svg(`
        <circle cx="220" cy="130" r="100" class="shape band-fill"/>
        <circle cx="220" cy="130" r="55" class="shape inner cutout-fill"/>
        <line x1="220" y1="130" x2="320" y2="130" class="guide"/>
        <line x1="220" y1="130" x2="220" y2="75" class="guide"/>
        ${text(275, 120, labels.outerRadius)}
        ${text(235, 96, labels.innerRadius, "start")}
      `, illustration.accessibleText);

    case "CIRCLE_PART_BOUNDARY":
      return renderCirclePartBoundary(illustration, solveMode);

    case "RECTANGULAR_BORDER_BAND":
      return svg(`
        <rect x="55" y="40" width="330" height="185" class="shape band-fill"/>
        <rect x="105" y="78" width="230" height="109" class="shape inner cutout-fill"/>
        <line x1="55" y1="235" x2="385" y2="235" class="dimension-line"/>
        <line x1="45" y1="40" x2="45" y2="225" class="dimension-line"/>
        ${text(220, 252, labels.outerLength)}
        ${text(34, 135, labels.outerBreadth)}
        ${text(220, 175, labels.innerLength)}
        ${text(116, 137, labels.innerBreadth, "start")}
        ${text(80, 70, labels.pathWidth)}
        ${text(325, 60, labels.region)}
      `, illustration.accessibleText);

    case "CIRCULAR_BORDER_BAND":
      return svg(`
        <circle cx="220" cy="130" r="100" class="shape band-fill"/>
        <circle cx="220" cy="130" r="58" class="shape inner cutout-fill"/>
        <line x1="220" y1="130" x2="320" y2="130" class="guide"/>
        <line x1="220" y1="130" x2="220" y2="72" class="guide"/>
        <line x1="278" y1="130" x2="320" y2="130" class="dimension-line"/>
        ${text(270, 120, labels.outerRadius)}
        ${text(234, 98, labels.innerRadius, "start")}
        ${text(300, 154, labels.pathWidth)}
        ${text(105, 62, labels.region)}
      `, illustration.accessibleText);

    case "COMPOSITE_AREA_PARTS":
      return renderCompositeArea(illustration, solveMode);

    case "INSCRIBED_PLANE_RELATION":
      return renderInscribedRelation(illustration, solveMode);

    case "REGULAR_HEXAGON_SPLIT":
      return renderRegularHexagon(illustration);

    case "COMPOSITE_EXPOSED_BOUNDARY":
      return renderCompositeBoundary(illustration, solveMode);
  }
}