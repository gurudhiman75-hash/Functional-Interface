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

function expectedDiagramLabels(state: MenCp011State) {
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

function dimensionMarkup(
  state: MenCp011State,
  markerId: string,
  geometry: { cx: number; cy: number; outer: number; inner: number },
) {
  const { cx, cy, outer, inner } = geometry;
  const labels = expectedDiagramLabels(state);
  const outerLabel = labels[0]!;
  const innerLabel = labels[1]!;
  const thicknessLabel = state.representation === "OUTER_RADIUS_AND_THICKNESS"
    ? labels.find((label) => label.startsWith("t ="))
    : undefined;

  if (state.representation === "DIAMETERS") {
    return `
    <line data-dimension="outer-diameter" x1="${cx - outer}" y1="${cy}" x2="${cx + outer}" y2="${cy}" stroke="#2457d6" stroke-width="2" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    <text x="${cx}" y="${cy - 12}" text-anchor="middle" font-size="15" font-weight="700" fill="#173c7a">${outerLabel}</text>
    <line data-dimension="inner-diameter" x1="${cx}" y1="${cy - inner}" x2="${cx}" y2="${cy + inner}" stroke="#64748b" stroke-width="2" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    <text x="${cx + 13}" y="${cy + inner + 18}" font-size="15" font-weight="700" fill="#334155">${innerLabel}</text>`;
  }

  if (state.representation === "OUTER_RADIUS_AND_THICKNESS") {
    const diagonal = Math.round(outer / Math.sqrt(2));
    return `
    <line data-dimension="outer-radius" x1="${cx}" y1="${cy}" x2="${cx + diagonal}" y2="${cy - diagonal}" stroke="#2457d6" stroke-width="2" marker-end="url(#${markerId})"/>
    <text x="${cx + diagonal + 9}" y="${cy - diagonal - 7}" font-size="15" font-weight="700" fill="#173c7a">${outerLabel}</text>
    <line data-dimension="inner-radius" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - inner}" stroke="#64748b" stroke-width="2" marker-end="url(#${markerId})"/>
    <text x="${cx + 9}" y="${cy - Math.round(inner / 2)}" font-size="15" font-weight="700" fill="#334155">${innerLabel}</text>
    <line data-dimension="wall-thickness" x1="${cx + inner}" y1="${cy}" x2="${cx + outer}" y2="${cy}" stroke="#b26a00" stroke-width="2" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    <text x="${cx + Math.round((inner + outer) / 2)}" y="${cy + 22}" text-anchor="middle" font-size="15" font-weight="700" fill="#8a4d00">${thicknessLabel}</text>`;
  }

  return `
    <line data-dimension="outer-radius" x1="${cx}" y1="${cy}" x2="${cx + outer}" y2="${cy}" stroke="#2457d6" stroke-width="2" marker-end="url(#${markerId})"/>
    <text x="${cx + Math.round(outer / 2)}" y="${cy - 12}" text-anchor="middle" font-size="15" font-weight="700" fill="#173c7a">${outerLabel}</text>
    <line data-dimension="inner-radius" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - inner}" stroke="#64748b" stroke-width="2" marker-end="url(#${markerId})"/>
    <text x="${cx + 10}" y="${cy - Math.round(inner / 2)}" font-size="15" font-weight="700" fill="#334155">${innerLabel}</text>`;
}

function diagramFor(state: MenCp011State): MenCp011Diagram {
  const markerId = `arrow-v2-${state.prototypeId.replaceAll("_", "-")}-${state.seed.replace(/[^A-Za-z0-9-]/g, "-")}`;
  const labels = expectedDiagramLabels(state);
  const lengthLabel = labels.at(-1) ?? `h = ${state.height} cm`;

  const cx = 150;
  const cy = 176;
  const outer = 92;
  const radiusRatio = Number(state.innerRadius) / Number(state.outerRadius);
  const inner = Math.max(30, Math.min(78, Math.round(outer * radiusRatio)));

  const sectionLeft = 330;
  const sectionRight = 665;
  const sectionCentre = 176;
  const sectionOuterHalf = 76;
  const sectionInnerHalf = Math.max(
    24,
    Math.min(64, Math.round(sectionOuterHalf * radiusRatio)),
  );
  const outerTop = sectionCentre - sectionOuterHalf;
  const outerBottom = sectionCentre + sectionOuterHalf;
  const innerTop = sectionCentre - sectionInnerHalf;
  const innerBottom = sectionCentre + sectionInnerHalf;
  const sectionWidth = sectionRight - sectionLeft;
  const upperWallHeight = innerTop - outerTop;
  const lowerWallHeight = outerBottom - innerBottom;
  const dimensions = dimensionMarkup(state, markerId, { cx, cy, outer, inner });

  const svg = `<svg class="men-cp011-diagram" data-diagram-version="TUBE_ORTHOGRAPHIC_V2" viewBox="0 0 720 340" role="img" aria-label="Two-view technical schematic of a hollow cylindrical pipe">
  <title>Hollow cylindrical pipe — end view and longitudinal section</title>
  <desc>A concept sketch, not to scale. The end view shows concentric outer and inner circles. The longitudinal section shows the empty cylindrical void continuing through the full pipe length.</desc>
  <defs>
    <marker id="${markerId}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 Z" fill="#2457d6"/></marker>
  </defs>

  <text x="360" y="22" text-anchor="middle" font-size="13" fill="#5d6b82">concept sketch · not to scale</text>

  <g data-view="end-cross-section">
    <text x="${cx}" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">End view: annular cross-section</text>
    <circle data-region="annular-material" cx="${cx}" cy="${cy}" r="${outer}" fill="#dfe9ff" stroke="#204b9b" stroke-width="3"/>
    <circle data-region="open-inner-void" cx="${cx}" cy="${cy}" r="${inner}" fill="#ffffff" stroke="#526477" stroke-width="3"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="#334155"/>
    ${dimensions}
    <text x="${cx}" y="${cy + 7}" text-anchor="middle" font-size="12" fill="#64748b">empty opening</text>
    <path d="M${cx - 45} ${cy - outer - 12} Q${cx} ${cy - outer - 30} ${cx + 45} ${cy - outer - 12}" fill="none" stroke="#5d6b82" stroke-width="1.5"/>
    <text x="${cx}" y="${cy - outer - 34}" text-anchor="middle" font-size="12" fill="#5d6b82">metal ring</text>
  </g>

  <g data-view="longitudinal-section">
    <text x="${Math.round((sectionLeft + sectionRight) / 2)}" y="48" text-anchor="middle" font-size="14" font-weight="700" fill="#334155">Longitudinal section through the axis</text>
    <rect data-region="upper-material-wall" x="${sectionLeft}" y="${outerTop}" width="${sectionWidth}" height="${upperWallHeight}" fill="#dfe9ff"/>
    <rect data-region="lower-material-wall" x="${sectionLeft}" y="${innerBottom}" width="${sectionWidth}" height="${lowerWallHeight}" fill="#c7d8ff"/>
    <rect data-region="continuous-inner-void" x="${sectionLeft}" y="${innerTop}" width="${sectionWidth}" height="${innerBottom - innerTop}" fill="#ffffff"/>

    <line x1="${sectionLeft}" y1="${outerTop}" x2="${sectionRight}" y2="${outerTop}" stroke="#204b9b" stroke-width="3"/>
    <line x1="${sectionLeft}" y1="${outerBottom}" x2="${sectionRight}" y2="${outerBottom}" stroke="#204b9b" stroke-width="3"/>
    <line x1="${sectionLeft}" y1="${innerTop}" x2="${sectionRight}" y2="${innerTop}" stroke="#526477" stroke-width="3"/>
    <line x1="${sectionLeft}" y1="${innerBottom}" x2="${sectionRight}" y2="${innerBottom}" stroke="#526477" stroke-width="3"/>

    <line data-open-end="near-top-wall" x1="${sectionLeft}" y1="${outerTop}" x2="${sectionLeft}" y2="${innerTop}" stroke="#204b9b" stroke-width="3"/>
    <line data-open-end="near-bottom-wall" x1="${sectionLeft}" y1="${innerBottom}" x2="${sectionLeft}" y2="${outerBottom}" stroke="#204b9b" stroke-width="3"/>
    <line data-open-end="far-top-wall" x1="${sectionRight}" y1="${outerTop}" x2="${sectionRight}" y2="${innerTop}" stroke="#204b9b" stroke-width="3"/>
    <line data-open-end="far-bottom-wall" x1="${sectionRight}" y1="${innerBottom}" x2="${sectionRight}" y2="${outerBottom}" stroke="#204b9b" stroke-width="3"/>

    <line x1="${sectionLeft - 10}" y1="${sectionCentre}" x2="${sectionRight + 10}" y2="${sectionCentre}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="8 6"/>
    <text x="${Math.round((sectionLeft + sectionRight) / 2)}" y="${sectionCentre + 5}" text-anchor="middle" font-size="13" fill="#64748b">continuous empty cylindrical void</text>
    <text x="${Math.round((sectionLeft + sectionRight) / 2)}" y="${outerTop + Math.max(17, Math.round(upperWallHeight / 2) + 5)}" text-anchor="middle" font-size="13" fill="#173c7a">material wall</text>

    <line data-dimension="pipe-length" x1="${sectionLeft}" y1="292" x2="${sectionRight}" y2="292" stroke="#2457d6" stroke-width="2" marker-start="url(#${markerId})" marker-end="url(#${markerId})"/>
    <line x1="${sectionLeft}" y1="${outerBottom + 7}" x2="${sectionLeft}" y2="302" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
    <line x1="${sectionRight}" y1="${outerBottom + 7}" x2="${sectionRight}" y2="302" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 4"/>
    <text x="${Math.round((sectionLeft + sectionRight) / 2)}" y="318" text-anchor="middle" font-size="15" font-weight="700" fill="#173c7a">${lengthLabel}</text>
  </g>
</svg>`;

  return {
    kind: "HOLLOW_CYLINDER",
    svg,
    accessibleText: "Two-view technical schematic of a hollow cylindrical pipe. The circular end view shows annular material between concentric outer and inner boundaries. The longitudinal section shows the empty cylindrical void running continuously through the full pipe length.",
    visibleLabels: labels,
    notToScale: true,
  };
}

function representationGeometrySafe(state: MenCp011State, svg: string) {
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
    diagram.svg.includes('data-diagram-version="TUBE_ORTHOGRAPHIC_V2"') &&
    diagram.svg.includes('data-view="end-cross-section"') &&
    diagram.svg.includes('data-view="longitudinal-section"') &&
    diagram.svg.includes('data-region="annular-material"') &&
    diagram.svg.includes('data-region="open-inner-void"') &&
    diagram.svg.includes('data-region="continuous-inner-void"') &&
    diagram.svg.includes('data-open-end="near-top-wall"') &&
    diagram.svg.includes('data-open-end="far-top-wall"') &&
    !diagram.svg.includes("M135 65 L395 65") &&
    !diagram.svg.includes("L455 110 L195 110 Z");

  const diagramChecks: ValidationCheck[] = [
    {
      name: "orthographic hollow-tube topology",
      passed: topologySafe,
      message: "The pipe diagram must use a concentric annular end view and a longitudinal section with a continuous open void, never a cuboid-style perspective shell.",
    },
    {
      name: "representation-correct dimension arrows",
      passed: representationGeometrySafe(base.state, diagram.svg),
      message: "Radius, diameter and thickness questions must use their own geometrically correct dimension arrows.",
    },
    {
      name: "unit-aware diagram",
      passed:
        diagram.kind === "HOLLOW_CYLINDER" &&
        diagram.notToScale &&
        diagram.svg.includes("not to scale") &&
        diagram.svg.includes("continuous empty cylindrical void") &&
        diagramUnitSafe &&
        labelAlignment,
      message: "The corrected deterministic schematic must match the canonical state and retain physical units.",
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
