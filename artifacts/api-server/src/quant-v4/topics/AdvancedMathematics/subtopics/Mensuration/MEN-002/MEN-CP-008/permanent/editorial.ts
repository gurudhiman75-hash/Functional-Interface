import type { MenCp008AnyPrototypeId } from "../../cp008-chapter-audit/compression";

interface TeachingStep {
  title: string;
  body: string;
  equation?: string;
}

interface TeachingExplanation {
  keyRule: string;
  steps: TeachingStep[];
  shortcut: string;
  traps: string[];
}

interface EditorialOption {
  label: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  misconceptionId: string | null;
}

export interface MenCp008EditorialInput {
  prototypeId: MenCp008AnyPrototypeId;
  solveMode: string;
  stem: string;
  piPolicy: string;
  target: string;
  unit: string;
  options: readonly EditorialOption[];
  explanation: TeachingExplanation;
}

interface TripletMatch {
  values: readonly [number, number, number];
  label: string;
}

type StepUnitKind = "LENGTH" | "AREA" | "VOLUME" | "UNITLESS" | "GENERIC";

const PRIMITIVE_TRIPLETS: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [7, 24, 25],
  [8, 15, 17],
  [9, 40, 41],
  [12, 35, 37],
  [20, 21, 29],
] as const;

const UNIT_NOTE_PREFIX = "Unit check:";

function plainStem(stem: string) {
  return stem
    .split(/(?:Use|Take|When)\s+\$?\\pi/i)[0]!
    .replace(/\\text\{([^}]*)\}/g, " $1 ")
    .replace(/[${}\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractNamedDimension(stem: string, name: "radius" | "height" | "slant height") {
  const text = plainStem(stem);
  const escaped = name.replace(" ", "\\s+");
  const labelPattern = name === "height" ? "(?<!slant\\s)height" : escaped;
  const afterLabel = text.match(new RegExp(`${labelPattern}(?:\\s+is|\\s+of|\\s*=|:)?\\s*(\\d+(?:\\.\\d+)?)`, "i"));
  if (afterLabel) return Number(afterLabel[1]);
  const beforeLabel = text.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:cm|m|mm|km)?\\s*(?:in\\s+)?${labelPattern}`, "i"));
  return beforeLabel ? Number(beforeLabel[1]) : null;
}

function extractLinearUnit(stem: string, finalUnit: string) {
  const stemUnit = plainStem(stem).match(/\b(mm|cm|km|m)\b/i)?.[1];
  if (stemUnit) return stemUnit.toLowerCase();
  const finalMatch = finalUnit.match(/^(mm|cm|km|m)(?:²|³|\^2|\^3)?$/i)?.[1];
  return finalMatch?.toLowerCase() ?? null;
}

function findScaledTriplet(input: MenCp008EditorialInput): TripletMatch | null {
  const knownDimensions = [
    extractNamedDimension(input.stem, "radius"),
    extractNamedDimension(input.stem, "height"),
    extractNamedDimension(input.stem, "slant height"),
  ].filter((value): value is number => value !== null);
  if (knownDimensions.length !== 2) return null;

  for (const primitive of PRIMITIVE_TRIPLETS) {
    for (let scale = 1; scale <= 12; scale += 1) {
      const values = primitive.map((value) => value * scale) as [number, number, number];
      if (knownDimensions.every((value) => values.includes(value))) {
        return { values, label: values.join("-") };
      }
    }
  }
  return null;
}

function isCone(input: MenCp008EditorialInput) {
  return input.prototypeId.includes("CONE") || /\bcone\b/i.test(input.stem);
}

function isCylinder(input: MenCp008EditorialInput) {
  return input.prototypeId.includes("CYLINDER") || /\bcylinder\b/i.test(input.stem);
}

function mentalPicture(input: MenCp008EditorialInput) {
  const id = input.prototypeId;
  if (id.includes("RECTANGLE-ROLLING")) {
    return "Picture a rectangular sheet being joined edge to edge to make a tube; the wrapped side becomes the circular rim.";
  }
  if (id.includes("SEMICIRCLE-SECTOR")) {
    return "Picture a flat semicircular sheet being rolled into a party hat.";
  }
  if (id.includes("SIMILAR")) {
    return "Picture a smaller party hat cut from the top of a larger one by a slice parallel to the base.";
  }
  if (id.includes("ROLLER")) {
    return "Picture a paint roller laying down one rectangular strip each time it turns.";
  }
  if (id.includes("TENT") || id.includes("CANVAS")) {
    return "Picture the cloth skin of a party hat; the circular floor is a separate surface.";
  }
  if (isCone(input) && isCylinder(input)) {
    return "Picture a straight tin can beside a pointed party hat so their circular bases and heights can be compared.";
  }
  if (isCone(input)) {
    return "Think of a right cone as an ice-cream cone or a party hat tapering to one point.";
  }
  if (isCylinder(input)) {
    return "Think of a cylinder as a stack of circular coins piled straight up.";
  }
  return "Picture the solid before choosing which length, surface, or volume is being measured.";
}

function variableLegend(input: MenCp008EditorialInput) {
  const id = input.prototypeId;
  if (id.includes("ROLLER")) {
    return "Here, $r$ is the roller radius and its stated length is the width of the rectangular strip covered in one turn.";
  }
  if (id.includes("RECTANGLE-ROLLING")) {
    return "Here, the wrapped side becomes circumference $2\\pi r$, while the other side becomes cylinder height $h$.";
  }
  if (id.includes("SEMICIRCLE-SECTOR")) {
    return "Here, the sector radius becomes cone slant height $l$, and the sector arc becomes base circumference $2\\pi r$.";
  }
  if (id.includes("SIMILAR")) {
    return "Here, corresponding radii and perpendicular heights share one linear scale factor, while volumes use its cube.";
  }
  if (isCone(input) && isCylinder(input)) {
    return "Here, each radius belongs to its own circular base, each $h$ is perpendicular height, and a cone keeps its factor $\\frac13$.";
  }
  if (isCone(input)) {
    return "Here, $r$ is base radius, $h$ is perpendicular height, and $l$ is slant height along the side.";
  }
  if (isCylinder(input)) {
    return "Here, $r$ is circular-base radius and $h$ is the perpendicular height of the cylinder.";
  }
  return "Here, every symbol must retain the physical meaning assigned in the question.";
}

function formatPhysicalUnit(base: string, power: 1 | 2 | 3) {
  return power === 1
    ? `$\\text{${base}}$`
    : `$\\text{${base}}^${power}$`;
}

function finalUnitNote(input: MenCp008EditorialInput) {
  const unit = input.unit;
  const physical = unit.match(/^(mm|cm|km|m)(²|³|\^2|\^3)?$/i);
  if (physical) {
    const power = physical[2] === "²" || physical[2] === "^2"
      ? 2
      : physical[2] === "³" || physical[2] === "^3"
        ? 3
        : 1;
    return `${UNIT_NOTE_PREFIX} report the final result in ${formatPhysicalUnit(physical[1]!.toLowerCase(), power)}.`;
  }
  if (unit === "litres") {
    return `${UNIT_NOTE_PREFIX} report capacity in $\\text{litres}$ after converting from cubic centimetres.`;
  }
  if (unit === "₹") {
    return `${UNIT_NOTE_PREFIX} report the monetary result in $\\text{₹}$ after the area unit cancels against the rate denominator.`;
  }
  if (unit === "revolutions") {
    return `${UNIT_NOTE_PREFIX} report the final count in $\\text{revolutions}$; it is not an area or length.`;
  }
  if (unit === "%") {
    return `${UNIT_NOTE_PREFIX} report the relative change as a percentage, $\\%$.`;
  }
  if (unit === "times") {
    return `${UNIT_NOTE_PREFIX} the final ratio is unit-free because matching physical units cancel.`;
  }
  return `${UNIT_NOTE_PREFIX} retain the requested answer unit $\\text{${unit}}$.`;
}

function inferStepUnitKind(step: TeachingStep): StepUnitKind {
  const text = `${step.title}\n${step.body}\n${step.equation ?? ""}`.toLowerCase();
  if (/ratio|multiplier|scale factor|percentage|percent|\bm\s*=|:\s*\d/.test(text)) return "UNITLESS";
  if (/(?:r|h|l|R|H)\^\{?2\}?\s*=|squared radius|squared height|find \$?r\^2|find \$?h\^2/.test(text)) return "AREA";
  if (/\bvolume\b|\bcapacity\b|cubic|r\^\{?2\}?h|r²h|attach pi/.test(text)) return "VOLUME";
  if (/\barea\b|surface|canvas|swept|circumference.*length|2rh|r\(h\+r\)/.test(text)) return "AREA";
  if (/slant height|perpendicular height|\bradius\b|\bdiameter\b|\blength\b|positive (?:square )?root|take the root|subtract the radius/.test(text)) return "LENGTH";
  if (/cancel.*pi|remove.*pi|reduce|cross-multiply|clear the fraction|simplify the factor/.test(text)) return "UNITLESS";
  return "GENERIC";
}

function intermediateUnitNote(input: MenCp008EditorialInput, step: TeachingStep) {
  const base = extractLinearUnit(input.stem, input.unit);
  const kind = inferStepUnitKind(step);
  if (kind === "UNITLESS") {
    return `${UNIT_NOTE_PREFIX} this ratio or algebraic factor is unit-free because like dimensions cancel.`;
  }
  if (!base) {
    return `${UNIT_NOTE_PREFIX} preserve dimensional consistency while simplifying this intermediate expression.`;
  }
  if (kind === "LENGTH") {
    return `${UNIT_NOTE_PREFIX} this intermediate length is measured in ${formatPhysicalUnit(base, 1)}.`;
  }
  if (kind === "AREA") {
    return `${UNIT_NOTE_PREFIX} two length factors produce ${formatPhysicalUnit(base, 2)}.`;
  }
  if (kind === "VOLUME") {
    return `${UNIT_NOTE_PREFIX} three length factors produce ${formatPhysicalUnit(base, 3)}.`;
  }
  return `${UNIT_NOTE_PREFIX} keep every stated length in ${formatPhysicalUnit(base, 1)} while simplifying this step.`;
}

function withUnitChecks(input: MenCp008EditorialInput) {
  return input.explanation.steps.map((step, index, steps) => {
    if (step.body.includes(UNIT_NOTE_PREFIX)) return step;
    const note = index === steps.length - 1
      ? finalUnitNote(input)
      : intermediateUnitNote(input, step);
    return { ...step, body: `${step.body} ${note}` };
  });
}

export function getMenCp008PublicTrapCode(misconceptionId: string | null) {
  if (!misconceptionId) return "UNCLASSIFIED_DISTRACTOR";
  const sanitized = misconceptionId.toUpperCase().replace(/[^A-Z0-9_]+/g, "_");
  return sanitized.startsWith("FALLBACK_")
    ? "GENERAL_CALCULATION_ERROR"
    : sanitized;
}

function withTrapCodes(input: MenCp008EditorialInput) {
  const wrongOptions = input.options.filter((option) => !option.isCorrect);
  return input.explanation.traps.map((trap, index) => {
    const label = trap.match(/^Option ([A-D])\b/)?.[1] as EditorialOption["label"] | undefined;
    const option = (label
      ? wrongOptions.find((candidate) => candidate.label === label)
      : undefined) ?? wrongOptions[index];
    const cleanTrap = trap.replace(/\s*\[[A-Z0-9_]+\]\s*$/, "").trim();
    return `${cleanTrap} [${getMenCp008PublicTrapCode(option?.misconceptionId ?? null)}]`;
  });
}

function circleBenchmark(input: MenCp008EditorialInput) {
  if (input.piPolicy !== "PI_22_OVER_7") return null;
  const radius = extractNamedDimension(input.stem, "radius");
  const base = extractLinearUnit(input.stem, input.unit) ?? "cm";
  if (radius === 7) {
    return `For radius $7\\text{ ${base}}$, keep circumference $44\\text{ ${base}}$ and base area $154\\text{ ${base}}^2$ ready; use only the quantity asked for.`;
  }
  if (radius === 14) {
    return `For radius $14\\text{ ${base}}$, keep circumference $88\\text{ ${base}}$ and base area $616\\text{ ${base}}^2$ ready; use only the quantity asked for.`;
  }
  if (radius === 21) {
    return `For radius $21\\text{ ${base}}$, keep circumference $132\\text{ ${base}}$ and base area $1386\\text{ ${base}}^2$ ready; use only the quantity asked for.`;
  }
  return null;
}

function speedTips(input: MenCp008EditorialInput) {
  const tips: string[] = [];
  const triplet = isCone(input) ? findScaledTriplet(input) : null;
  if (triplet) {
    tips.push(`Recognise the standard right-triangle triplet ${triplet.label}; write the missing side immediately instead of expanding the square root.`);
  }
  const benchmark = circleBenchmark(input);
  if (benchmark) tips.push(benchmark);

  if (input.prototypeId.includes("ROLLER")) {
    tips.push("One complete turn covers circumference × roller length, so cancel common factors before multiplying by the number of turns.");
  } else if (input.prototypeId.includes("RECTANGLE-ROLLING")) {
    tips.push("Mark the wrapped side as the circumference and the other side as the cylinder height before comparing volumes.");
  } else if (input.prototypeId.includes("SIMILAR")) {
    tips.push("For similar cones, cube the linear scale factor to obtain the volume scale factor.");
  } else if (input.prototypeId.includes("SEMICIRCLE-SECTOR")) {
    tips.push("The sector radius becomes the cone's slant height, while the sector arc becomes the base circumference.");
  } else if (/RATIO/i.test(input.solveMode) || /ratio/i.test(input.stem)) {
    tips.push("Cancel the common pi factor first and compare only the remaining radius and height factors.");
  } else if (isCone(input)) {
    tips.push("Keep radius, vertical height and slant height in their right-triangle roles, then cancel before multiplying.");
  } else {
    tips.push("Treat pi times radius squared as one circular-base block; multiply by height only when the question asks for volume.");
  }
  return { tips, triplet };
}

export function enhanceMenCp008Explanation(input: MenCp008EditorialInput): TeachingExplanation {
  const { tips } = speedTips(input);
  const picture = mentalPicture(input);
  const legend = variableLegend(input);
  return {
    ...input.explanation,
    keyRule: `${picture} ${input.explanation.keyRule} ${legend}`,
    steps: withUnitChecks(input),
    shortcut: `⚡ Exam speed: ${tips.join(" ")} ${input.explanation.shortcut}`,
    traps: withTrapCodes(input),
  };
}

function sorted(values: readonly string[]) {
  return [...values].sort().join("|");
}

export function auditMenCp008Editorial(
  input: MenCp008EditorialInput,
  explanation: TeachingExplanation,
) {
  const { triplet } = speedTips(input);
  const radius = extractNamedDimension(input.stem, "radius");
  const expectedCircleBenchmark = input.piPolicy === "PI_22_OVER_7" && (radius === 7 || radius === 14 || radius === 21);
  const expectedCircleText = radius === 7
    ? explanation.shortcut.includes("circumference $44") && explanation.shortcut.includes("base area $154")
    : radius === 14
      ? explanation.shortcut.includes("circumference $88") && explanation.shortcut.includes("base area $616")
      : radius === 21
        ? explanation.shortcut.includes("circumference $132") && explanation.shortcut.includes("base area $1386")
        : true;
  const wrongOptions = input.options.filter((option) => !option.isCorrect);
  const expectedLabels = wrongOptions.map((option) => option.label);
  const actualLabels = explanation.traps
    .map((trap) => trap.match(/^Option ([A-D])\b/)?.[1])
    .filter((label): label is string => Boolean(label));
  const expectedCodes = wrongOptions.map((option) => getMenCp008PublicTrapCode(option.misconceptionId));
  const actualCodes = explanation.traps
    .map((trap) => trap.match(/\[([A-Z0-9_]+)\]\s*$/)?.[1])
    .filter((code): code is string => Boolean(code));

  return [
    {
      name: "visual shape first",
      passed: /^(Think|Picture)\b/.test(explanation.keyRule),
      message: "Every CP-008 explanation must begin with a physical mental picture before any formula.",
    },
    {
      name: "formula variable definitions",
      passed: explanation.keyRule.includes("Here,"),
      message: "The governing rule must define the physical meaning of its variables.",
    },
    {
      name: "unit-preserving calculations",
      passed: explanation.steps.length >= 2 && explanation.steps.every((step) => step.body.includes(UNIT_NOTE_PREFIX)),
      message: "Every worked step must retain or explicitly account for its physical unit.",
    },
    {
      name: "exam-smart shortcut",
      passed: explanation.shortcut.startsWith("⚡ Exam speed:"),
      message: "Every CP-008 shortcut must open with an exam-speed cue.",
    },
    {
      name: "triplet recognition",
      passed: !triplet || explanation.shortcut.includes(triplet.label),
      message: "Cone states with exactly two sides from a standard Pythagorean triplet must name it explicitly.",
    },
    {
      name: "circle benchmark",
      passed: !expectedCircleBenchmark || expectedCircleText,
      message: "Radius 7, 14 or 21 under pi = 22/7 must surface standard circumference and base-area benchmarks with units.",
    },
    {
      name: "option trap labels",
      passed: actualLabels.length === 3 && sorted(actualLabels) === sorted(expectedLabels),
      message: "Each wrong option must have one matching learner-facing misconception explanation.",
    },
    {
      name: "option trap codes",
      passed: actualCodes.length === 3 && sorted(actualCodes) === sorted(expectedCodes),
      message: "Each distractor explanation must end with the exact public misconception code for that option.",
    },
    {
      name: "five-element teaching blueprint",
      passed:
        /^(Think|Picture)\b/.test(explanation.keyRule) &&
        explanation.keyRule.includes("Here,") &&
        explanation.steps.every((step) => step.body.includes(UNIT_NOTE_PREFIX)) &&
        explanation.shortcut.startsWith("⚡ Exam speed:") &&
        actualCodes.length === 3,
      message: "Picture, rule, unit-preserving steps, exam shortcut and coded trap analysis are all mandatory.",
    },
    {
      name: "CP-011 ownership boundary",
      passed: !/hollow pipe|drilled through the cent(?:er|re)|\(R\^2-r\^2\)|25\^2\s*-\s*21\^2/i.test(`${explanation.keyRule}\n${explanation.shortcut}`),
      message: "Hollow-pipe and wall-thickness teaching belongs to MEN-CP-011, not MEN-CP-008.",
    },
  ];
}
