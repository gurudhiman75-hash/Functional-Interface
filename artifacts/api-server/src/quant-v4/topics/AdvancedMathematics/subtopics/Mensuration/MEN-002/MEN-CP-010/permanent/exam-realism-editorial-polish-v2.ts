type EditorialQuestion = {
  readonly clusterId: string;
  readonly sourceId: string;
  readonly stem: string;
  readonly answer: string;
  readonly options: readonly {
    readonly label: "A" | "B" | "C" | "D";
    readonly display: string;
    readonly isCorrect: boolean;
    readonly misconceptionId: string | null;
  }[];
  readonly explanation: {
    readonly keyRule: string;
    readonly steps: readonly { readonly title: string; readonly body: string }[];
    readonly shortcut: string;
    readonly traps: readonly string[];
  };
};

type TeachingPolicy = { readonly shortcut: string; readonly traps: readonly [string, string] };

const CLUSTER_TEACHING: Readonly<Record<string, TeachingPolicy>> = {
  PYRAMID_VOLUME_DIRECT: {
    shortcut: "Construct the base area first, then multiply by vertical height and divide by 3.",
    traps: ["Use the base area, not a raw base side or diagonal.", "A pyramid has one-third the volume of the corresponding prism."],
  },
  PYRAMID_VOLUME_INVERSE_HEIGHT: {
    shortcut: "Rearrange once: h = 3V/B; for a square base, B = a².",
    traps: ["Multiply the volume by 3 before dividing by base area.", "Do not confuse a square base side with its area."],
  },
  RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_DIRECT: {
    shortcut: "Mark the horizontal offset first, then use l² = h² + offset².",
    traps: ["Use half the base side for a square-pyramid face slant triangle.", "For a frustum, use the difference of corresponding radii/sides in the offset."],
  },
  RIGHT_PYRAMID_FRUSTUM_PYTHAGOREAN_INVERSE: {
    shortcut: "Use offset² = l² − h², then recover the requested radius, side or height.",
    traps: ["Subtract the squares before taking the square root.", "After finding the offset, convert it back to the requested base dimension correctly."],
  },
  PYRAMID_SURFACE_DIRECT: {
    shortcut: "For a regular pyramid, LSA = Pl/2; add the base area only when TSA is asked.",
    traps: ["Use face slant height in the triangular faces, not vertical height.", "Match the exposed-surface formula to whether LSA or TSA is requested."],
  },
  CONICAL_FRUSTUM_VOLUME_DIRECT: {
    shortcut: "Compute R² + Rr + r² first, then multiply by πh/3.",
    traps: ["Do not omit the mixed Rr term.", "Frustum volume uses vertical height, not slant height."],
  },
  CONICAL_FRUSTUM_SURFACE_DIRECT: {
    shortcut: "CSA = π(R+r)l; add the two circular ends only if total surface area is required.",
    traps: ["Use R+r, not R−r, in curved surface area.", "Match the end-disc treatment to whether CSA or TSA is requested."],
  },
  POLYGONAL_FRUSTUM_VOLUME_DIRECT: {
    shortcut: "Use V = h(A₁+√(A₁A₂)+A₂)/3 with the two parallel-base areas.",
    traps: ["Use base areas A₁ and A₂, not just their side lengths.", "The frustum formula still has the one-third factor."],
  },
  POLYGONAL_FRUSTUM_SURFACE_DIRECT: {
    shortcut: "LSA = (P₁+P₂)l/2; add the two base areas only for TSA.",
    traps: ["Use the perimeters of both parallel bases in LSA.", "Match base-area inclusion to whether LSA or TSA is requested."],
  },
  PYRAMID_VOLUME_INVERSE_BASE: {
    shortcut: "Recover base area from B = 3V/h, then convert that area into the requested side/length.",
    traps: ["Do not stop at base area when a base dimension is requested.", "Keep the one-third pyramid factor when rearranging the volume formula."],
  },
  CONICAL_FRUSTUM_VOLUME_INVERSE_HEIGHT: {
    shortcut: "Rearrange directly: h = 3V/[π(R²+Rr+r²)].",
    traps: ["Keep the mixed Rr term in the denominator.", "Cancel π only when it is genuinely common to the given volume expression."],
  },
  POLYGONAL_FRUSTUM_VOLUME_INVERSE_HEIGHT: {
    shortcut: "Use h = 3V/[A₁+√(A₁A₂)+A₂].",
    traps: ["Use the two base areas in the frustum expression.", "Do not replace √(A₁A₂) by A₁A₂."],
  },
  SIMILAR_SOLID_VOLUME_RATIO: {
    shortcut: "Cube both terms of the corresponding linear ratio.",
    traps: ["Do not use the linear ratio unchanged for volumes.", "Keep the order of the two solids the same after cubing."],
  },
  SIMILAR_SOLID_AREA_RATIO: {
    shortcut: "Square both terms of the corresponding linear ratio.",
    traps: ["Do not use the linear ratio unchanged for areas.", "Cube the ratio only for volumes, not surface areas."],
  },
  SIMILAR_SOLID_VOLUME_RATIO_INVERSE: {
    shortcut: "Take the cube root of both terms of the volume ratio.",
    traps: ["Do not take a square root of a volume ratio.", "Preserve the order of the two similar solids."],
  },
  SIMILAR_SOLID_AREA_RATIO_INVERSE: {
    shortcut: "Take the square root of both terms of the surface-area ratio.",
    traps: ["Do not take a cube root of an area ratio.", "Preserve the order of the two similar solids."],
  },
  PYRAMID_PRISM_SAME_BASE_HEIGHT_RATIO: {
    shortcut: "With the same base and height: Vpyramid = Bh/3 and Vprism = Bh.",
    traps: ["Do not compare different bases or heights.", "The pyramid is one-third, not one-half, of the corresponding prism."],
  },
  FRUSTUM_SIMILAR_SECTION_HEIGHT: {
    shortcut: "Use similarity first: corresponding linear dimensions are proportional to distances from the apex.",
    traps: ["Match the smaller dimension with the removed/top solid.", "Distinguish full height, removed height and frustum height before solving."],
  },
  PYRAMID_CROSS_SECTION_SIMILARITY: {
    shortcut: "section side/base side = apex-to-section distance/full pyramid height.",
    traps: ["Measure the section distance from the apex, as stated.", "Use a linear ratio for side lengths; do not square it."],
  },
  FRUSTUM_CAPACITY_CONVERSION: {
    shortcut: "Find frustum volume in cm³ first; divide by 1000 only at the final litre-conversion step.",
    traps: ["Do not report cubic centimetres directly as litres.", "Keep R²+Rr+r² and the one-third factor in the frustum volume."],
  },
  PYRAMID_FRUSTUM_SURFACE_COST: {
    shortcut: "Find only the surface actually covered, then multiply by the rate per unit area.",
    traps: ["Do not charge for a base or opening that is not covered.", "Keep area units consistent with the quoted rate."],
  },
  PYRAMID_FRUSTUM_VOLUME_SCALING: {
    shortcut: "For uniform similarity use k³; if base side and height change independently, use a²h factors.",
    traps: ["Do not simply add percentage changes.", "Use a cube only when every linear dimension shares the same scale factor."],
  },
  PYRAMID_FRUSTUM_AREA_SCALING: {
    shortcut: "Convert the linear change to scale factor k, then use k² for surface area.",
    traps: ["Do not use the linear percentage unchanged for area.", "Cube the scale factor only for volume."],
  },
  PYRAMID_SURFACE_INVERSE: {
    shortcut: "Remove any base area first, then solve l from LSA = Pl/2.",
    traps: ["If TSA is given, subtract the base area before solving for slant height.", "Use the base perimeter, not base area, in Pl/2."],
  },
  CONICAL_FRUSTUM_SURFACE_INVERSE: {
    shortcut: "Remove circular ends when necessary, then solve l from π(R+r)l.",
    traps: ["Use R+r in the curved-area relation.", "Subtract end-disc areas only when starting from TSA."],
  },
  POLYGONAL_FRUSTUM_SURFACE_INVERSE: {
    shortcut: "Remove the two parallel bases when necessary, then solve l from (P₁+P₂)l/2.",
    traps: ["Use both base perimeters in the lateral-area formula.", "If TSA is given, subtract both base areas before solving."],
  },
};

const SOURCE_TEACHING: Readonly<Record<string, TeachingPolicy>> = {
  "MEN-CP010-PROT-SQUARE-PYRAMID-LSA": {
    shortcut: "For a square pyramid, LSA = 2al.",
    traps: ["Use face slant height l, not vertical height.", "Do not add the square base when lateral surface area is asked."],
  },
  "V3-REGULAR-PYRAMID-LSA": {
    shortcut: "For a regular pyramid, LSA = Pl/2.",
    traps: ["Use the base perimeter P, not the base area.", "Do not add the base area when lateral surface area is asked."],
  },
  "MEN-CP010-PROT-SQUARE-PYRAMID-TSA": {
    shortcut: "For a square pyramid, TSA = a² + 2al.",
    traps: ["Use face slant height l in the triangular faces.", "Include the square base exactly once for total surface area."],
  },
  "V3-REGULAR-PYRAMID-TSA": {
    shortcut: "For a regular pyramid, TSA = B + Pl/2.",
    traps: ["Use perimeter P in the lateral term Pl/2.", "Include the base area B exactly once for total surface area."],
  },
  "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA": {
    shortcut: "For a conical frustum, CSA = π(R+r)l.",
    traps: ["Use R+r, not R−r, in the curved-area formula.", "Do not add either circular end when curved surface area is asked."],
  },
  "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA": {
    shortcut: "Find CSA = π(R+r)l, then add πR² and πr².",
    traps: ["Use R+r, not R−r, in the curved-area term.", "Include both circular ends exactly once for total surface area."],
  },
  "MEN-CP010-PROT-SQUARE-FRUSTUM-LSA": {
    shortcut: "For a square frustum, LSA = 2(A+a)l.",
    traps: ["Use both parallel-base side lengths in A+a.", "Do not add either square base when lateral surface area is asked."],
  },
  "V3-REGULAR-FRUSTUM-LSA": {
    shortcut: "For a regular-polygon frustum, LSA = (P₁+P₂)l/2.",
    traps: ["Use both base perimeters P₁ and P₂.", "Do not add the parallel-base areas when lateral surface area is asked."],
  },
  "MEN-CP010-PROT-SQUARE-FRUSTUM-TSA": {
    shortcut: "Find LSA = 2(A+a)l, then add A² and a².",
    traps: ["Use both side lengths in the lateral-area term.", "Include both square bases exactly once for total surface area."],
  },
};

function trimNumber(value: number) {
  return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function simpleLengthFractionToDecimal(display: string) {
  const match = /^(-?\d+)\/(\d+)\s+(cm|m)$/.exec(display.trim());
  if (!match) return display;
  const denominator = Number(match[2]);
  if (!denominator) return display;
  const value = Number(match[1]) / denominator;
  return `${trimNumber(value)} ${match[3]}`;
}

function improperAreaFractionToMixed(display: string) {
  const match = /^(\d+)\/(\d+)\s+(cm²|m²)$/.exec(display.trim());
  if (!match) return display;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!denominator || numerator < denominator) return display;
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (remainder === 0) return `${whole} ${match[3]}`;
  return `${whole} ${remainder}/${denominator} ${match[3]}`;
}

function roundMachinePrecisionDisplay(display: string) {
  const match = /^(-?\d+\.\d{6,})(\s*(?:cm³|m³|cm²|m²|cm|m|litres))$/.exec(display.trim());
  if (!match) return display;
  return `${Number(match[1]).toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}${match[2]}`;
}

function replaceDisplayInSteps(
  steps: readonly { readonly title: string; readonly body: string }[],
  replacements: readonly [string, string][],
) {
  return steps.map((step) => ({
    ...step,
    body: replacements.reduce(
      (body, [from, to]) => from === to ? body : body.split(from).join(to),
      step.body,
    ),
  }));
}

export function polishMenCp010EditorialPresentationV2<T extends EditorialQuestion>(question: T): T {
  let stem = question.stem;
  let answer = question.answer;
  let options = question.options.map((option) => ({ ...option }));
  let steps = question.explanation.steps.map((step) => ({ ...step }));

  if (question.sourceId === "CP010-D2-APP-BUCKET-CAPACITY-LITRES") {
    stem = stem
      .replace(/larger radius = /g, "larger radius ")
      .replace(/smaller radius = /g, "smaller radius ")
      .replace(/vertical height = /g, "vertical height ");
  }

  if (question.sourceId === "CP010-D2-SIMILAR-CROSS-SECTION-SIDE") {
    const replacements: [string, string][] = options.map((option) => [
      option.display,
      simpleLengthFractionToDecimal(option.display),
    ]);
    options = options.map((option, index) => ({ ...option, display: replacements[index]![1] }));
    const newAnswer = simpleLengthFractionToDecimal(answer);
    replacements.push([answer, newAnswer]);
    answer = newAnswer;
    steps = replaceDisplayInSteps(steps, replacements);
  }

  if (
    question.sourceId === "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA" &&
    /Take π = 22\/7/.test(stem)
  ) {
    const replacements: [string, string][] = options.map((option) => [
      option.display,
      improperAreaFractionToMixed(option.display),
    ]);
    options = options.map((option, index) => ({ ...option, display: replacements[index]![1] }));
    const newAnswer = improperAreaFractionToMixed(answer);
    replacements.push([answer, newAnswer]);
    answer = newAnswer;
    steps = replaceDisplayInSteps(steps, replacements);
  }

  // Remove raw floating-point tails from learner-facing quantities while
  // preserving mathematically meaningful exact values such as 95.3125%.
  const precisionReplacements: [string, string][] = options.map((option) => [
    option.display,
    roundMachinePrecisionDisplay(option.display),
  ]);
  options = options.map((option, index) => ({ ...option, display: precisionReplacements[index]![1] }));
  const roundedAnswer = roundMachinePrecisionDisplay(answer);
  precisionReplacements.push([answer, roundedAnswer]);
  answer = roundedAnswer;
  steps = replaceDisplayInSteps(steps, precisionReplacements);

  const inheritedTeaching = !question.sourceId.startsWith("EXAM-V2");
  const policy = SOURCE_TEACHING[question.sourceId] ?? CLUSTER_TEACHING[question.clusterId];
  const explanation = inheritedTeaching && policy
    ? {
        ...question.explanation,
        steps,
        shortcut: policy.shortcut,
        traps: policy.traps,
      }
    : {
        ...question.explanation,
        steps,
      };

  return {
    ...question,
    stem,
    answer,
    options,
    explanation,
  } as T;
}
