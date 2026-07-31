import type { MenCp008AnyPrototypeId } from "../../cp008-chapter-audit/compression";

interface TeachingExplanation {
  keyRule: string;
  steps: Array<{ title: string; body: string; equation?: string }>;
  shortcut: string;
  traps: string[];
}

export interface MenCp008EditorialInput {
  prototypeId: MenCp008AnyPrototypeId;
  solveMode: string;
  stem: string;
  piPolicy: string;
  explanation: TeachingExplanation;
}

interface TripletMatch {
  values: readonly [number, number, number];
  label: string;
}

const PRIMITIVE_TRIPLETS: readonly (readonly [number, number, number])[] = [
  [3, 4, 5],
  [5, 12, 13],
  [7, 24, 25],
  [8, 15, 17],
  [9, 40, 41],
  [12, 35, 37],
  [20, 21, 29],
] as const;

function plainStem(stem: string) {
  return stem
    .split(/Use\s+\$?\\pi/i)[0]!
    .replace(/\\text\{([^}]*)\}/g, " $1 ")
    .replace(/[${}\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stemNumbers(stem: string) {
  return (plainStem(stem).match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

function findScaledTriplet(stem: string): TripletMatch | null {
  const numbers = new Set(stemNumbers(stem));
  for (const primitive of PRIMITIVE_TRIPLETS) {
    for (let scale = 1; scale <= 12; scale += 1) {
      const values = primitive.map((value) => value * scale) as [number, number, number];
      const matches = values.filter((value) => numbers.has(value)).length;
      if (matches >= 2) {
        return { values, label: values.join("-") };
      }
    }
  }
  return null;
}

function extractNamedDimension(stem: string, name: "radius" | "height" | "slant height") {
  const text = plainStem(stem);
  const escaped = name.replace(" ", "\\s+");
  const afterLabel = text.match(new RegExp(`${escaped}(?:\\s+is|\\s+of|\\s*=|:)?\\s*(\\d+(?:\\.\\d+)?)`, "i"));
  if (afterLabel) return Number(afterLabel[1]);
  const beforeLabel = text.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:cm|m|mm)?\\s*(?:in\\s+)?${escaped}`, "i"));
  return beforeLabel ? Number(beforeLabel[1]) : null;
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
    return "Think of a right cone as an ice-cream cone or a party hat.";
  }
  if (isCylinder(input)) {
    return "Think of a cylinder as a stack of circular coins piled straight up.";
  }
  return "Picture the solid before choosing which length, surface, or volume is being measured.";
}

function circleBenchmark(input: MenCp008EditorialInput) {
  if (input.piPolicy !== "PI_22_OVER_7") return null;
  const radius = extractNamedDimension(input.stem, "radius");
  if (radius === 7) {
    return "For radius 7, keep the SSC benchmarks circumference = 44 and base area = 154 ready; use only the quantity the question asks for.";
  }
  if (radius === 14) {
    return "For radius 14, keep the SSC benchmarks circumference = 88 and base area = 616 ready; use only the quantity the question asks for.";
  }
  return null;
}

function speedTips(input: MenCp008EditorialInput) {
  const tips: string[] = [];
  const triplet = isCone(input) ? findScaledTriplet(input.stem) : null;
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
  return {
    ...input.explanation,
    keyRule: `${picture} ${input.explanation.keyRule}`,
    shortcut: `⚡ Exam speed: ${tips.join(" ")} ${input.explanation.shortcut}`,
  };
}

export function auditMenCp008Editorial(
  input: MenCp008EditorialInput,
  explanation: TeachingExplanation,
) {
  const { triplet } = speedTips(input);
  const radius = extractNamedDimension(input.stem, "radius");
  const expectedCircleBenchmark = input.piPolicy === "PI_22_OVER_7" && (radius === 7 || radius === 14);
  const expectedCircleText = radius === 7
    ? explanation.shortcut.includes("circumference = 44") && explanation.shortcut.includes("base area = 154")
    : radius === 14
      ? explanation.shortcut.includes("circumference = 88") && explanation.shortcut.includes("base area = 616")
      : true;

  return [
    {
      name: "visual shape first",
      passed: /^(Think|Picture)\b/.test(explanation.keyRule),
      message: "Every CP-008 explanation must begin with a physical mental picture before any formula.",
    },
    {
      name: "exam-smart shortcut",
      passed: explanation.shortcut.startsWith("⚡ Exam speed:"),
      message: "Every CP-008 shortcut must open with an exam-speed cue.",
    },
    {
      name: "triplet recognition",
      passed: !triplet || explanation.shortcut.includes(triplet.label),
      message: "Cone states containing a standard Pythagorean triplet must name it explicitly.",
    },
    {
      name: "circle benchmark",
      passed: !expectedCircleBenchmark || expectedCircleText,
      message: "Radius 7 or 14 under pi = 22/7 must surface the standard circumference and base-area benchmarks.",
    },
    {
      name: "CP-011 ownership boundary",
      passed: !/hollow pipe|drilled through the cent(?:er|re)|\(R\^2-r\^2\)|25\^2\s*-\s*21\^2/i.test(`${explanation.keyRule}\n${explanation.shortcut}`),
      message: "Hollow-pipe and wall-thickness teaching belongs to MEN-CP-011, not MEN-CP-008.",
    },
  ];
}
