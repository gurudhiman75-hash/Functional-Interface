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

const CLUSTER_TEACHING: Readonly<Record<string, { shortcut: string; traps: readonly [string, string] }>> = {
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
    traps: ["Use face slant height in the triangular faces, not vertical height.", "Do not add the base when only lateral surface area is required."],
  },
  CONICAL_FRUSTUM_VOLUME_DIRECT: {
    shortcut: "Compute R² + Rr + r² first, then multiply by πh/3.",
    traps: ["Do not omit the mixed Rr term.", "Frustum volume uses vertical height, not slant height."],
  },
  CONICAL_FRUSTUM_SURFACE_DIRECT: {
    shortcut: "CSA = π(R+r)l; add the two circular ends only if total surface area is required.",
    traps: ["Use R+r, not R−r, in curved surface area.", "Do not include open circular ends in a sheet-area question."],
  },
  POLYGONAL_FRUSTUM_VOLUME_DIRECT: {
    shortcut: "Use V = h(A₁+√(A₁A₂)+A₂)/3 with the two parallel-base areas.",
    traps: ["Use base areas A₁ and A₂, not just their side lengths.", "The frustum formula still has the one-third factor."],
  },
  POLYGONAL_FRUSTUM_SURFACE_DIRECT: {
    shortcut: "LSA = (P₁+P₂)l/2; add the two base areas only for TSA.",
    traps: ["Use the perimeters of both parallel bases in LSA.", "Do not add base areas unless the required surface includes them."],
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

function trimNumber(value: number) {
  return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function simpleLengthFractionToDecimal(display: string) {
  const match = /^(-?\d+)\/(\d+)\s+(cm|m)$/.exec(display.trim());
  if (!match) return display;
  const denominator = Number(match[2]);
  if (!denominator) return display;
  const value = Number(match[1]) / denominator;
  // Length answers such as 21/2 cm are clearer in exam options as 10.5 cm.
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

  const inheritedTeaching = !question.sourceId.startsWith("EXAM-V2");
  const policy = CLUSTER_TEACHING[question.clusterId];
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
