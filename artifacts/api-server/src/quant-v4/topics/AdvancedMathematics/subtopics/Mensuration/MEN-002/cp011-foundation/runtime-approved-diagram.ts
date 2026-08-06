import {
  classifyMenCp011Difficulty,
  generateMenCp011FoundationPrototype as generateBaseMenCp011FoundationPrototype,
} from "./runtime-base";
import type {
  MenCp011Diagram,
  MenCp011Package,
  MenCp011PrototypeId,
  MenCp011State,
} from "./types";

type ValidationCheck = MenCp011Package["validation"]["checks"][number];

function expectedDiagramLabels(state: MenCp011State): string[] {
  switch (state.representation) {
    case "DIAMETERS":
      return [
        `D = ${state.outerDiameter} cm`,
        `d = ${state.innerDiameter} cm`,
        `h = ${state.height} cm`,
      ];
    case "OUTER_RADIUS_AND_THICKNESS":
      return [
        `R = ${state.outerRadius} cm`,
        `r = ${state.innerRadius} cm`,
        `t = ${state.thickness} cm`,
        `h = ${state.height} cm`,
      ];
    case "INVERSE_INNER_RADIUS":
      return [`R = ${state.outerRadius} cm`, "r = ?", `h = ${state.height} cm`];
    case "RADII":
      return [
        `R = ${state.outerRadius} cm`,
        `r = ${state.innerRadius} cm`,
        `h = ${state.height} cm`,
      ];
  }
}

function legendFor(state: MenCp011State): string {
  switch (state.representation) {
    case "DIAMETERS":
      return "D = Outer diameter · d = Inner diameter · h = Height";
    case "OUTER_RADIUS_AND_THICKNESS":
      return "R = Outer radius · r = Inner radius · t = Wall thickness · h = Height";
    case "INVERSE_INNER_RADIUS":
    case "RADII":
      return "R = Outer radius · r = Inner radius · h = Height";
  }
}

function topFaceDimensions(
  state: MenCp011State,
  markerId: string,
  geometry: {
    cx: number;
    topCy: number;
    outerRx: number;
    innerRx: number;
  },
): string {
  const { cx, topCy, outerRx, innerRx } = geometry;
  const labels = expectedDiagramLabels(state);
  const outerLabel = labels[0]!;
  const innerLabel = labels[1]!;

  if (state.representation === "DIAMETERS") {
    return `
    <g data-dimension-group="diameters" data-scope="top-face-only">
      <line data-dimension="outer-diameter" data-orientation="horizontal" x1="${cx - outerRx}" y1="${topCy - 18}" x2="${cx + outerRx}" y2="${topCy - 18}" stroke="#1d4ed8" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      <text x="${cx}" y="${topCy - 30}" text-anchor="middle" font-size="16" font-weight="700" fill="#173c7a">${outerLabel}</text>
      <line data-dimension="inner-diameter" data-orientation="horizontal" x1="${cx - innerRx}" y1="${topCy + 16}" x2="${cx + innerRx}" y2="${topCy + 16}" stroke="#1d4ed8" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      <text x="${cx}" y="${topCy + 38}" text-anchor="middle" font-size="16" font-weight="700" fill="#173c7a">${innerLabel}</text>
    </g>`;
  }

  const radiusMarkup = `
    <g data-dimension-group="radii" data-scope="top-face-only">
      <circle data-role="top-centre" cx="${cx}" cy="${topCy}" r="3" fill="#1d4ed8"/>
      <line data-dimension="outer-radius" data-orientation="horizontal" x1="${cx}" y1="${topCy - 18}" x2="${cx + outerRx}" y2="${topCy - 18}" stroke="#1d4ed8" stroke-width="2.4" marker-end="url(#${markerId})"/>
      <text x="${cx + Math.round(outerRx / 2)}" y="${topCy - 31}" text-anchor="middle" font-size="16" font-weight="700" fill="#173c7a">${outerLabel}</text>
      <line data-dimension="inner-radius" data-orientation="horizontal" x1="${cx}" y1="${topCy + 15}" x2="${cx + innerRx}" y2="${topCy + 15}" stroke="#1d4ed8" stroke-width="2.4" marker-end="url(#${markerId})"/>
      <text x="${cx + Math.round(innerRx / 2)}" y="${topCy + 37}" text-anchor="middle" font-size="16" font-weight="700" fill="#173c7a">${innerLabel}</text>
    </g>`;

  if (state.representation !== "OUTER_RADIUS_AND_THICKNESS") {
    return radiusMarkup;
  }

  const thicknessLabel = labels.find((label) => label.startsWith("t ="))!;
  const outerLeft = cx - outerRx;
  const innerLeft = cx - innerRx;
  return `${radiusMarkup}
    <g data-dimension-group="thickness" data-scope="top-rim-only">
      <line data-dimension="wall-thickness" data-orientation="horizontal" data-alignment="top-rim" x1="${outerLeft}" y1="${topCy + 28}" x2="${innerLeft}" y2="${topCy + 28}" stroke="#1d4ed8" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      <text x="${outerLeft - 18}" y="${topCy + 34}" text-anchor="end" font-size="16" font-weight="700" fill="#173c7a">${thicknessLabel}</text>
    </g>`;
}

function diagramFor(state: MenCp011State): MenCp011Diagram {
  const markerId = `arrow-approved-${state.prototypeId.replaceAll("_", "-")}-${state.seed.replace(/[^A-Za-z0-9-]/g, "-")}`;
  const labels = expectedDiagramLabels(state);
  const heightLabel = labels.at(-1) ?? `h = ${state.height} cm`;

  const cx = 310;
  const topCy = 118;
  const bottomCy = 308;
  const outerRx = 150;
  const outerRy = 48;
  const radiusRatio = Number(state.innerRadius) / Number(state.outerRadius);
  const innerRx = Math.max(72, Math.min(126, Math.round(outerRx * radiusRatio)));
  const innerRy = Math.max(25, Math.min(41, Math.round(outerRy * radiusRatio)));
  const dimensionX = cx + outerRx + 88;
  const dimensions = topFaceDimensions(state, markerId, {
    cx,
    topCy,
    outerRx,
    innerRx,
  });
  const legend = legendFor(state);

  const svg = `<svg class="men-cp011-diagram" data-diagram-version="TUBE_EXAMTREE_APPROVED_V1" data-closure="uncut-wall" viewBox="0 0 720 430" role="img" aria-label="Single ExamTree hollow cylindrical tube diagram">
  <title>Hollow cylindrical tube</title>
  <desc>A single uncut hollow cylindrical tube on a white background, not to scale. The top annular opening is visible. The empty void continues through the full height and is shown by dashed hidden inner boundaries and a dashed inner ellipse at the bottom.</desc>
  <defs>
    <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="#1d4ed8"/></marker>
  </defs>

  <rect data-background="white" x="0" y="0" width="720" height="430" fill="#ffffff"/>
  <text x="360" y="20" text-anchor="middle" font-size="12" fill="#64748b">concept sketch · not to scale</text>

  <g data-view="single-closed-tube" data-object="hollow-cylinder">
    <g data-region="top-annular-opening">
      <ellipse data-region="top-outer-ellipse" cx="${cx}" cy="${topCy}" rx="${outerRx}" ry="${outerRy}" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <ellipse data-region="top-inner-ellipse" cx="${cx}" cy="${topCy}" rx="${innerRx}" ry="${innerRy}" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    </g>

    <line data-region="outer-left-wall" x1="${cx - outerRx}" y1="${topCy}" x2="${cx - outerRx}" y2="${bottomCy}" stroke="#111827" stroke-width="3"/>
    <line data-region="outer-right-wall" x1="${cx + outerRx}" y1="${topCy}" x2="${cx + outerRx}" y2="${bottomCy}" stroke="#111827" stroke-width="3"/>

    <line data-region="hidden-inner-left-wall" x1="${cx - innerRx}" y1="${topCy + 4}" x2="${cx - innerRx}" y2="${bottomCy}" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>
    <line data-region="hidden-inner-right-wall" x1="${cx + innerRx}" y1="${topCy + 4}" x2="${cx + innerRx}" y2="${bottomCy}" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>

    <ellipse data-region="bottom-outer-ellipse" cx="${cx}" cy="${bottomCy}" rx="${outerRx}" ry="${outerRy}" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    <ellipse data-region="bottom-inner-hidden-ellipse" cx="${cx}" cy="${bottomCy}" rx="${innerRx}" ry="${innerRy}" fill="none" stroke="#4b5563" stroke-width="2.2" stroke-dasharray="9 7"/>

    ${dimensions}

    <g data-dimension-group="height" data-position="outside-right">
      <line x1="${cx + outerRx}" y1="${topCy}" x2="${dimensionX}" y2="${topCy}" stroke="#1d4ed8" stroke-width="1.8" stroke-dasharray="6 5"/>
      <line x1="${cx + outerRx}" y1="${bottomCy}" x2="${dimensionX}" y2="${bottomCy}" stroke="#1d4ed8" stroke-width="1.8" stroke-dasharray="6 5"/>
      <line data-dimension="pipe-length" data-orientation="vertical" x1="${dimensionX}" y1="${topCy}" x2="${dimensionX}" y2="${bottomCy}" stroke="#1d4ed8" stroke-width="2.4" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
      <text x="${dimensionX + 18}" y="${Math.round((topCy + bottomCy) / 2) + 6}" font-size="16" font-weight="700" fill="#173c7a">${heightLabel}</text>
    </g>
  </g>

  <g data-region="variable-legend">
    <rect x="105" y="378" width="510" height="38" rx="8" fill="#ffffff" stroke="#1d4ed8" stroke-width="2"/>
    <text x="360" y="403" text-anchor="middle" font-size="15" font-weight="600" fill="#111827">${legend}</text>
  </g>
</svg>`;

  return {
    kind: "HOLLOW_CYLINDER",
    svg,
    accessibleText: "Single uncut ExamTree hollow cylindrical tube diagram on a white background. Matching outer ellipses define the top and bottom. The inner opening is visible at the top; dashed inner walls and a dashed inner bottom ellipse show the empty bore continuing through the full height. All radius, diameter and thickness measurements stay horizontal on the top face, while height is outside the tube.",
    visibleLabels: labels,
    notToScale: true,
  };
}

function representationGeometrySafe(state: MenCp011State, svg: string): boolean {
  const has = (dimension: string) => svg.includes(`data-dimension="${dimension}"`);
  if (!has("pipe-length")) return false;

  switch (state.representation) {
    case "DIAMETERS":
      return has("outer-diameter") &&
        has("inner-diameter") &&
        !has("outer-radius") &&
        !has("inner-radius") &&
        !has("wall-thickness");
    case "OUTER_RADIUS_AND_THICKNESS":
      return has("outer-radius") &&
        has("inner-radius") &&
        has("wall-thickness") &&
        !has("outer-diameter") &&
        !has("inner-diameter");
    case "INVERSE_INNER_RADIUS":
    case "RADII":
      return has("outer-radius") &&
        has("inner-radius") &&
        !has("outer-diameter") &&
        !has("inner-diameter") &&
        !has("wall-thickness");
  }
}

function rebuildValidation(
  base: MenCp011Package,
  diagram: MenCp011Diagram,
): MenCp011Package["validation"] {
  const retainedChecks = base.validation.checks.filter((check) =>
    check.name !== "unit-aware diagram" &&
    check.name !== "no invented inverse dimension",
  );
  const expectedLabels = expectedDiagramLabels(base.state);
  const labelAlignment =
    expectedLabels.length === diagram.visibleLabels.length &&
    expectedLabels.every((label, index) => diagram.visibleLabels[index] === label);
  const diagramUnitSafe = diagram.visibleLabels.every((label) =>
    !/\d/.test(label) || /\bcm\b/.test(label),
  );
  const inverseDiagramSafe = base.state.representation !== "INVERSE_INNER_RADIUS" ||
    (
      diagram.visibleLabels.includes("r = ?") &&
      !diagram.visibleLabels.includes(`r = ${base.state.innerRadius} cm`) &&
      !diagram.svg.includes(`r = ${base.state.innerRadius} cm`)
    );
  const topologySafe =
    diagram.svg.includes('data-diagram-version="TUBE_EXAMTREE_APPROVED_V1"') &&
    diagram.svg.includes('data-view="single-closed-tube"') &&
    diagram.svg.includes('data-closure="uncut-wall"') &&
    diagram.svg.includes('data-background="white"') &&
    diagram.svg.includes('data-region="top-outer-ellipse"') &&
    diagram.svg.includes('data-region="top-inner-ellipse"') &&
    diagram.svg.includes('data-region="bottom-outer-ellipse"') &&
    diagram.svg.includes('data-region="bottom-inner-hidden-ellipse"') &&
    diagram.svg.includes('data-region="hidden-inner-left-wall"') &&
    diagram.svg.includes('data-region="hidden-inner-right-wall"') &&
    diagram.svg.includes('data-region="variable-legend"') &&
    !diagram.svg.includes('data-view="end-cross-section"') &&
    !diagram.svg.includes('data-view="longitudinal-section"') &&
    !diagram.svg.includes('data-role="radius-vertical-guide"');
  const topDimensionSafe =
    !diagram.svg.includes('data-dimension="outer-radius" data-orientation="vertical"') &&
    !diagram.svg.includes('data-dimension="inner-radius" data-orientation="vertical"') &&
    !diagram.svg.includes('data-dimension="outer-diameter" data-orientation="vertical"') &&
    !diagram.svg.includes('data-dimension="inner-diameter" data-orientation="vertical"') &&
    (
      base.state.representation !== "OUTER_RADIUS_AND_THICKNESS" ||
      diagram.svg.includes('data-dimension="wall-thickness" data-orientation="horizontal" data-alignment="top-rim"')
    );

  const diagramChecks: ValidationCheck[] = [
    {
      name: "approved single-tube topology",
      passed: topologySafe,
      message: "The diagram must use one uncut ExamTree tube with matching top and bottom ellipses, hidden bore lines, a white background and a variable legend.",
    },
    {
      name: "top-face measurement geometry",
      passed: topDimensionSafe && representationGeometrySafe(base.state, diagram.svg),
      message: "Radius, diameter and wall-thickness measurements must remain horizontal and geometrically aligned on the top face; height must stay outside the tube.",
    },
    {
      name: "unit-aware diagram",
      passed:
        diagram.kind === "HOLLOW_CYLINDER" &&
        diagram.notToScale &&
        diagram.svg.includes("not to scale") &&
        diagram.svg.includes("empty void") &&
        diagramUnitSafe &&
        labelAlignment,
      message: "The approved deterministic tube diagram must match the canonical state and retain physical units.",
    },
    {
      name: "no invented inverse dimension",
      passed: inverseDiagramSafe,
      message: "An unknown inner radius must remain symbolic in both diagram metadata and visible SVG text.",
    },
  ];
  const checks = [...retainedChecks, ...diagramChecks];
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateMenCp011FoundationPrototype(
  prototypeId: MenCp011PrototypeId,
  seed: string,
): MenCp011Package {
  const base = generateBaseMenCp011FoundationPrototype(prototypeId, seed);
  const diagram = diagramFor(base.state);
  return {
    ...base,
    diagram,
    validation: rebuildValidation(base, diagram),
  };
}

export { classifyMenCp011Difficulty };
