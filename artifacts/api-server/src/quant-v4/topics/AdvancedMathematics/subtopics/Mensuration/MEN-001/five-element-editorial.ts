import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001Parameters, Men001SolverResult } from "./types";

const UNIT_CHECK_PREFIX = "Unit check:";
const EXAM_SPEED_PREFIX = "⚡ Exam speed:";
const STANDARD_CIRCLE_AREAS = new Map<number, number>([
  [7, 154],
  [14, 616],
  [21, 1386],
]);

function numeric(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function format(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function isCircularFamily(parameters: Men001Parameters) {
  return (
    parameters.taskKind === "circleMeasurementApplication" ||
    /Circle|Circular|Arc|Sector|Semicircle|Quadrant|Annulus|Wheel/.test(parameters.solveMode)
  );
}

function isRingFamily(parameters: Men001Parameters) {
  return /CircularPath|Annulus|OuterCircular|InnerCircular/.test(parameters.solveMode);
}

function isWireFamily(parameters: Men001Parameters) {
  return /Wire/.test(parameters.solveMode);
}

function mentalPicture(parameters: Men001Parameters) {
  const mode = parameters.solveMode;
  if (isRingFamily(parameters)) {
    return "Picture the required region as a flat donut: the outer circle is complete, but the inner circle is removed.";
  }
  if (/Sector|Arc|CentralAngle/.test(mode)) {
    return "Picture the circle as a pizza, with the central angle selecting only one slice of the full 360° turn.";
  }
  if (/Semicircle/.test(mode)) {
    return "Picture a circle cut exactly through its centre, so the curved half and any straight diameter must be counted separately.";
  }
  if (/Quadrant/.test(mode)) {
    return "Picture one quarter of a circular plate, bounded by one curved arc and two perpendicular radii.";
  }
  if (/Wheel|Revolution/.test(mode)) {
    return "Picture a wheel rolling without slipping: every complete turn moves forward by one circumference.";
  }
  if (isWireFamily(parameters)) {
    return "Picture one fixed wire being bent into a new shape: its total boundary length stays unchanged even though the enclosed area changes.";
  }
  if (isCircularFamily(parameters)) {
    return "Picture a flat circular disc: radius reaches from the centre to the rim, while circumference follows the rim itself.";
  }
  if (/Path|Border/.test(mode)) {
    return "Picture a uniform strip running around a garden or floor, so its area is the larger boundary region minus the smaller inner region.";
  }
  if (/Tile|Floor/.test(mode)) {
    return "Picture the floor as one large flat rectangle covered by identical smaller tiles with no gaps or overlaps.";
  }
  if (/Composite|LShape|Stadium|Inscribed|Shaded|Remaining|Uncovered|CrossRoad/.test(mode)) {
    return "Picture the figure as standard flat shapes joined together or cut away, then count each included region exactly once.";
  }
  if (/Triangle|Heron|Isosceles|Equilateral/.test(mode)) {
    return "Picture a triangular sign: its area depends on a base and the perpendicular height meeting that base at 90°.";
  }
  if (/Rectangle|Square|Parallelogram|Rhombus|Kite|Trapezium|Quadrilateral/.test(mode)) {
    return "Picture the figure as a flat floor plan, where side lengths control the boundary and perpendicular dimensions control the area.";
  }
  if (/Scale|Map|Plan|Percentage/.test(mode)) {
    return "Picture the same flat shape being enlarged or reduced, so every linear change acts in two directions when area is involved.";
  }
  if (/Conversion|Unit/.test(mode)) {
    return "Picture the same physical measurement written with a different ruler unit; the size stays fixed while the numerical label changes.";
  }
  return "Picture the plane figure before choosing whether the question asks for its boundary, enclosed area, cost, count or scale.";
}

function variableLegend(parameters: Men001Parameters) {
  const mode = parameters.solveMode;
  if (isRingFamily(parameters)) {
    return "Here, R is the outer radius, r is the inner radius, and the ring or path area is π(R² − r²).";
  }
  if (/Sector|Arc|CentralAngle/.test(mode)) {
    return "Here, r is radius, θ is the central angle, and θ/360 selects the required fraction of the full circle.";
  }
  if (/Circle|Circular|Semicircle|Quadrant|Wheel|Revolution/.test(mode)) {
    return "Here, r is radius, d = 2r is diameter, circumference is 2πr = πd, and circle area is πr².";
  }
  if (/Triangle|Heron|Isosceles|Equilateral/.test(mode)) {
    return "Here, b is the selected base, h is its perpendicular height, and area is measured in square units.";
  }
  if (/Rectangle|Parallelogram/.test(mode)) {
    return "Here, l and b are perpendicular length and breadth; area is lb, while perimeter counts both pairs of opposite sides.";
  }
  if (/Square/.test(mode)) {
    return "Here, s is the side of the square; its perimeter is 4s and its area is s².";
  }
  if (/Rhombus|Kite|Diagonal/.test(mode)) {
    return "Here, d₁ and d₂ are the diagonals, and any stated perpendicular or half-diagonal relation must be used before calculating area or side length.";
  }
  if (/Trapezium/.test(mode)) {
    return "Here, a and b are the parallel sides and h is the perpendicular distance between them.";
  }
  if (/Path|Border/.test(mode)) {
    return "Here, the outer dimensions describe the complete region, the inner dimensions describe the excluded region, and path area is outer area minus inner area.";
  }
  if (/Scale|Map|Plan/.test(mode)) {
    return "Here, k is the linear scale factor; lengths and perimeters use k, but areas use k².";
  }
  if (/Percentage/.test(mode)) {
    return "Here, each percentage change acts as a multiplier on a linear dimension, so both multipliers must be combined for area.";
  }
  return "Here, each symbol keeps the physical meaning assigned in the question, and the final unit must match the requested dimension.";
}

function linearUnit(parameters: Men001Parameters, solver: Men001SolverResult) {
  if (solver.unit === "m" || solver.unit === "m²" || solver.unit === "₹/m" || solver.unit === "₹/m²") return "m";
  if (solver.unit === "cm" || solver.unit === "cm²") return "cm";
  if (/METRE/.test(parameters.unitPolicy)) return "m";
  if (/CENTIMETRE/.test(parameters.unitPolicy)) return "cm";
  return undefined;
}

function areaUnit(parameters: Men001Parameters, solver: Men001SolverResult) {
  const unit = linearUnit(parameters, solver);
  return unit ? `${unit}²` : undefined;
}

function unitNote(parameters: Men001Parameters, solver: Men001SolverResult) {
  const lUnit = linearUnit(parameters, solver);
  const aUnit = areaUnit(parameters, solver);
  switch (parameters.answerDimension) {
    case "AREA":
      return lUnit && aUnit
        ? `${UNIT_CHECK_PREFIX} keep every length in ${lUnit}; multiplying two lengths produces ${aUnit}.`
        : `${UNIT_CHECK_PREFIX} keep both dimensions in one linear unit and report the result in the corresponding square unit.`;
    case "LENGTH":
      return lUnit
        ? `${UNIT_CHECK_PREFIX} every length in this step remains in ${lUnit}; take only the positive physical length.`
        : `${UNIT_CHECK_PREFIX} keep all lengths in one compatible linear unit.`;
    case "COST":
      return /Fencing|Boundary|Perimeter/.test(parameters.solveMode)
        ? `${UNIT_CHECK_PREFIX} boundary length and the per-length rate must use matching units, leaving the final answer in ₹.`
        : `${UNIT_CHECK_PREFIX} area and the per-square-unit rate must use matching units, leaving the final answer in ₹.`;
    case "RATE":
      return solver.unit === "₹/m"
        ? `${UNIT_CHECK_PREFIX} divide rupees by the matching boundary length in metres to obtain ₹/m.`
        : `${UNIT_CHECK_PREFIX} divide rupees by the matching area in square metres to obtain ₹/m².`;
    case "COUNT":
      return solver.unit === "revolutions"
        ? `${UNIT_CHECK_PREFIX} distance and circumference must share one length unit, which cancels to a revolution count.`
        : `${UNIT_CHECK_PREFIX} total area and one-item area must share one square unit, which cancels to a count.`;
    case "PERCENT":
      return `${UNIT_CHECK_PREFIX} the dimension multipliers are unit-free, and the final relative change is reported as %.`;
    case "SCALAR":
      return `${UNIT_CHECK_PREFIX} matching physical units cancel, so the requested ratio or scale factor is unit-free.`;
    case "ANGLE":
      return `${UNIT_CHECK_PREFIX} the circular fraction is unit-free, and the final angular measure is reported in degrees.`;
  }
}

function appendUnitCheck(
  section: Extract<Men001ExplanationSection, { kind: "STEP" }>,
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) {
  if (section.paragraphs.some((paragraph) => paragraph.includes(UNIT_CHECK_PREFIX))) return section;
  const note = unitNote(parameters, solver);
  const paragraphs = section.paragraphs.length > 0
    ? [...section.paragraphs.slice(0, -1), `${section.paragraphs.at(-1)} ${note}`]
    : [note];
  return { ...section, paragraphs };
}

function standardCircleBenchmark(parameters: Men001Parameters, solver: Men001SolverResult) {
  if (!isCircularFamily(parameters)) return undefined;
  const unit = linearUnit(parameters, solver) ?? "cm";
  const candidates = [
    numeric(parameters.values.radius),
    numeric(parameters.values.outerRadius),
    numeric(parameters.values.innerRadius),
  ].filter((value): value is number => value !== undefined);
  const radii = [...new Set(candidates)].filter((value) => STANDARD_CIRCLE_AREAS.has(value));
  if (radii.length === 0) return undefined;
  const facts = radii.map((radius) => {
    const circumference = radius === 7 ? 44 : radius === 14 ? 88 : 132;
    return `r = ${radius} ${unit} gives circumference ${circumference} ${unit} and area ${STANDARD_CIRCLE_AREAS.get(radius)} ${unit}²`;
  });
  return `Standard circle benchmark: ${facts.join("; ")}.`;
}

function ringIdentityShortcut(parameters: Men001Parameters, solver: Men001SolverResult) {
  if (!isRingFamily(parameters)) return undefined;
  const outer = numeric(parameters.values.outerRadius);
  const inner = numeric(parameters.values.innerRadius);
  if (outer !== undefined && inner !== undefined) {
    return `Use R² − r² = (R − r)(R + r): (${format(outer)} − ${format(inner)})(${format(outer)} + ${format(inner)}) avoids two separate squares.`;
  }
  return "Use R² − r² = (R − r)(R + r) before multiplying by π; this is faster and reduces arithmetic errors.";
}

function enhanceShortcut(
  section: Extract<Men001ExplanationSection, { kind: "EXAM_SHORTCUT" }>,
  parameters: Men001Parameters,
  solver: Men001SolverResult,
) {
  const additions = [ringIdentityShortcut(parameters, solver), standardCircleBenchmark(parameters, solver)]
    .filter((value): value is string => Boolean(value));
  const current = section.paragraphs.join(" ").replace(/^⚡ Exam speed:\s*/i, "").trim();
  return {
    ...section,
    paragraphs: [`${EXAM_SPEED_PREFIX} ${[...additions, current].filter(Boolean).join(" ")}`],
  };
}

export function getMen001PublicTrapCode(strategyId: string) {
  return strategyId.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function codeTraps(
  section: Extract<Men001ExplanationSection, { kind: "COMMON_TRAPS" }>,
  strategyIds: readonly string[],
) {
  if (section.paragraphs.length !== strategyIds.length) {
    throw new Error("MEN-001 five-element editorial layer cannot align trap paragraphs with strategy IDs.");
  }
  return {
    ...section,
    paragraphs: section.paragraphs.map((paragraph, index) => {
      const clean = paragraph.replace(/\s*\[[A-Z0-9_]+\]\s*$/, "").trim();
      return `${clean} [${getMen001PublicTrapCode(strategyIds[index]!)}]`;
    }),
  };
}

export function applyMen001FiveElementBlueprint(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  strategyIds: readonly string[],
): Men001ExplanationSection[] {
  return sections.map((section): Men001ExplanationSection => {
    if (section.kind === "KEY_RULE") {
      const existing = section.paragraphs.join(" ").trim();
      return {
        ...section,
        paragraphs: [`${mentalPicture(parameters)} ${existing} ${variableLegend(parameters)}`.replace(/\s+/g, " ").trim()],
      };
    }
    if (section.kind === "STEP") return appendUnitCheck(section, parameters, solver);
    if (section.kind === "EXAM_SHORTCUT") return enhanceShortcut(section, parameters, solver);
    if (section.kind === "COMMON_TRAPS") return codeTraps(section, strategyIds);
    return section;
  });
}

function sorted(values: readonly string[]) {
  return [...values].sort().join("|");
}

export function auditMen001FiveElementBlueprint(
  sections: readonly Men001ExplanationSection[],
  parameters: Men001Parameters,
  solver: Men001SolverResult,
  strategyIds: readonly string[],
) {
  const keyRule = sections.find((section) => section.kind === "KEY_RULE");
  const steps = sections.filter((section) => section.kind === "STEP");
  const shortcut = sections.find((section) => section.kind === "EXAM_SHORTCUT");
  const traps = sections.find((section) => section.kind === "COMMON_TRAPS");
  const expectedCodes = strategyIds.map(getMen001PublicTrapCode);
  const actualCodes = traps?.paragraphs
    .map((paragraph) => paragraph.match(/\[([A-Z0-9_]+)\]\s*$/)?.[1])
    .filter((code): code is string => Boolean(code)) ?? [];
  const benchmark = standardCircleBenchmark(parameters, solver);

  return [
    {
      name: "mensuration-visual-anchor",
      passed: Boolean(keyRule) && keyRule!.paragraphs.length === 1 && /^(Think|Picture)\b/.test(keyRule!.paragraphs[0]!),
      message: "Every MEN-001 explanation must begin with one physical mental picture before its formula.",
    },
    {
      name: "mensuration-variable-meanings",
      passed: Boolean(keyRule) && keyRule!.paragraphs[0]!.includes("Here,"),
      message: "The key-rule tier must define the physical meaning of its variables.",
    },
    {
      name: "mensuration-unit-preserving-steps",
      passed: steps.length > 0 && steps.every((step) => step.paragraphs.some((paragraph) => paragraph.includes(UNIT_CHECK_PREFIX))),
      message: "Every worked step must explicitly preserve, transform or cancel its physical unit.",
    },
    {
      name: "mensuration-exam-speed",
      passed: Boolean(shortcut) && shortcut!.paragraphs.length === 1 && shortcut!.paragraphs[0]!.startsWith(EXAM_SPEED_PREFIX),
      message: "Every explanation must include a clearly marked exam-speed shortcut.",
    },
    {
      name: "mensuration-ring-identity",
      passed: !isRingFamily(parameters) || Boolean(shortcut?.paragraphs[0]?.includes("R² − r² = (R − r)(R + r)")),
      message: "Circular paths and annuli must use the difference-of-squares shortcut.",
    },
    {
      name: "mensuration-circle-benchmark",
      passed: !benchmark || Boolean(shortcut?.paragraphs[0]?.includes("Standard circle benchmark:")),
      message: "Radius 7, 14 or 21 must surface its standard circumference and area benchmark.",
    },
    {
      name: "mensuration-coded-option-traps",
      passed:
        Boolean(traps) &&
        traps!.paragraphs.length === strategyIds.length &&
        actualCodes.length === strategyIds.length &&
        sorted(actualCodes) === sorted(expectedCodes),
      message: "Every wrong option must retain one exact learner-facing misconception code.",
    },
    {
      name: "mensuration-five-element-blueprint",
      passed:
        Boolean(keyRule) && /^(Think|Picture)\b/.test(keyRule!.paragraphs[0]!) &&
        keyRule!.paragraphs[0]!.includes("Here,") &&
        steps.every((step) => step.paragraphs.some((paragraph) => paragraph.includes(UNIT_CHECK_PREFIX))) &&
        Boolean(shortcut?.paragraphs[0]?.startsWith(EXAM_SPEED_PREFIX)) &&
        actualCodes.length === strategyIds.length,
      message: "Picture, rule, unit-preserving steps, exam shortcut and coded trap analysis are all mandatory.",
    },
  ];
}
