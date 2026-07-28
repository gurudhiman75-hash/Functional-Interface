import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001QuestionLanguageEntry } from "./types";

export interface Men001OptionResult {
  options: readonly string[];
  correctIndex: number;
  distractors: readonly string[];
}

const EXPLANATION_OVERRIDES: Readonly<Record<string, string>> = {
  "omit-half-factor": "forgetting the 1/2 in the triangle-area formula and calculating bh instead of 1/2 bh",
  "omit-quarter-factor": "forgetting the 1/4 in the equilateral-triangle area formula",
  "omit-diagonal-half-factor": "forgetting the 1/2 in the diagonal-area formula",
  "omit-half-general-quadrilateral": "forgetting that the diagonal creates two triangles, so the combined formula still contains 1/2",
  "omit-scale-square": "using the linear scale factor only once even though area changes in both length and breadth",
  "use-equal-side-as-height": "using the sloping equal side as the height of the isosceles triangle",
  "use-half-base-as-height": "using half of the base as the height without applying Pythagoras",
  "retain-equal-side": "copying the given equal side instead of finding the perpendicular height",
  "use-semiperimeter-as-area": "stopping at the semiperimeter and treating it as an area",
  "square-semiperimeter": "squaring the semiperimeter instead of completing Heron's formula",
  "halve-heron-area": "dividing the Heron's-formula result by 2 even though the formula already gives the full triangle area",
  "double-heron-area": "doubling the area obtained from Heron's formula",
  "use-radius-as-diameter": "putting the radius into the formula as though it were the diameter",
  "use-diameter-as-radius": "putting the diameter into the formula as though it were the radius",
  "use-full-circle-area": "using the area of a full circle when the figure contains only a semicircle, quadrant or sector",
  "use-circumference-as-area": "using the distance around a circle as though it were the area inside it",
  "use-circle-area-instead-of-square": "calculating the area of the original circle and stopping before reshaping the wire into a square",
  "use-square-area-instead-of-circle": "calculating the area of the original square instead of the new circle made from the same wire",
  "retain-wire-length": "reporting the total wire length instead of using it to find the requested side, radius or area",
  "add-inner-area": "adding the inner area even though a path or border is the outer area minus the inner area",
  "omit-inner-area": "using the whole outer area and forgetting to remove the inner region",
  "use-linear-conversion-factor": "dividing or multiplying by 100 as though the measurement were a length instead of an area",

  "cp006-cm2-to-m2-divide-by-100": "dividing by 100 as though cm² were a length conversion instead of an area conversion",
  "cp006-cm2-to-m2-divide-by-1000": "dividing by 1,000 instead of the full square-unit factor 10,000",
  "cp006-cm2-to-m2-no-conversion": "keeping the square-centimetre number unchanged while labelling it as square metres",
  "cp006-m2-to-cm2-multiply-by-100": "multiplying by 100 as though m² were a length conversion instead of an area conversion",
  "cp006-m2-to-cm2-multiply-by-1000": "multiplying by 1,000 instead of the full square-unit factor 10,000",
  "cp006-m2-to-cm2-no-conversion": "keeping the square-metre number unchanged while labelling it as square centimetres",

  "cp006-square-area-report-circle-area": "stopping at the area of the original circle instead of finding the area of the reshaped square",
  "cp006-square-area-use-radius-square": "using r² as though the circle's radius were also the side of the square",
  "cp006-square-area-use-wire-square-over-eight": "using the wire length in an incorrect area expression instead of first dividing it among four square sides",
  "cp006-circle-area-report-source-square-area": "stopping at the area of the original square instead of finding the area of the reshaped circle",
};

const CORRECTION_OVERRIDES: Readonly<Record<string, string>> = {
  "omit-half-factor": "Write A = 1/2 bh first, or halve an even base or height before multiplying.",
  "omit-quarter-factor": "Keep the complete formula A = (√3/4)a² before substituting the side.",
  "omit-diagonal-half-factor": "Use A = 1/2 d₁d₂; the half factor is part of the area formula.",
  "omit-half-general-quadrilateral": "Add the two triangle areas, each calculated with 1/2 × base × height.",
  "omit-scale-square": "For area, square the linear factor: k becomes k².",
  "use-equal-side-as-height": "The height must meet the base at 90°. Find it from the half-base and equal side using Pythagoras.",
  "use-half-base-as-height": "The half-base is one horizontal leg, not the vertical height. Use a² + b² = c² to find the height.",
  "retain-equal-side": "The given equal side is the hypotenuse of the small right triangle; calculate the perpendicular height.",
  "use-semiperimeter-as-area": "Semiperimeter is only s. Continue with A = √[s(s-a)(s-b)(s-c)].",
  "square-semiperimeter": "Heron's formula multiplies s by three differences; it is not simply s².",
  "halve-heron-area": "Do not divide again—the square root from Heron's formula is already the full area.",
  "double-heron-area": "Do not multiply again—the formula already covers the complete triangle.",
  "use-radius-as-diameter": "Remember d = 2r. Check whether the formula needs r or d before substituting.",
  "use-diameter-as-radius": "Divide the diameter by 2 before using any formula containing r.",
  "use-full-circle-area": "Take the correct fraction of πr²: 1/2 for a semicircle, 1/4 for a quadrant, or θ/360 for a sector.",
  "use-circumference-as-area": "Circumference has a linear unit; area must have a square unit. Use πr² for the enclosed region.",
  "use-circle-area-instead-of-square": "Do not stop at πr². First turn the circumference into the square's perimeter, find its side, and then square that side.",
  "use-square-area-instead-of-circle": "Use the square's perimeter as the circle's circumference, find r, and then calculate πr².",
  "retain-wire-length": "The wire length is only an intermediate value. Divide or equate it to the new boundary to find what the question asks for.",
  "add-inner-area": "A border is the ring between two boundaries, so subtract inner area from outer area.",
  "omit-inner-area": "Remove the inner region: border or path area = outer area − inner area.",
  "use-linear-conversion-factor": "Area conversion uses 100² = 10,000, not 100.",

  "cp006-cm2-to-m2-divide-by-100": "Length conversion uses 100, but area conversion uses 100² = 10,000. Divide cm² by 10,000 to obtain m².",
  "cp006-cm2-to-m2-divide-by-1000": "Use 1 m² = 10,000 cm², so divide by 10,000.",
  "cp006-cm2-to-m2-no-conversion": "Convert the unit as well as the label: divide the cm² value by 10,000.",
  "cp006-m2-to-cm2-multiply-by-100": "Length conversion uses 100, but area conversion uses 100² = 10,000. Multiply m² by 10,000 to obtain cm².",
  "cp006-m2-to-cm2-multiply-by-1000": "Use 1 m² = 10,000 cm², so multiply by 10,000.",
  "cp006-m2-to-cm2-no-conversion": "Convert the numerical value too: multiply the m² value by 10,000.",

  "cp006-square-area-report-circle-area": "This is the original circle's area. Do not stop here—the question asks for the reshaped square, so find its side from the same wire and then square it.",
  "cp006-square-area-use-radius-square": "The square's side is not equal to r. First use 4s = 2πr, then calculate s².",
  "cp006-square-area-use-wire-square-over-eight": "First divide the full wire length by 4 to get the square's side; only then square that side.",
  "cp006-circle-area-report-source-square-area": "This is the original square's area. Continue by using its perimeter as the circle's circumference, find r, and then calculate πr².",
};

const ACTIONS = new Set([
  "add", "average", "choose", "cost", "count", "divide", "double", "expand", "halve",
  "ignore", "miss", "multiply", "omit", "paint", "quarter", "report", "retain", "root",
  "shrink", "single", "square", "subtract", "take", "tile", "treat", "triple", "use",
]);

function readableOption(value: string) {
  return value
    .trim()
    .replace(/^\$\$/, "")
    .replace(/\$\$$/, "")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "√$1")
    .replace(/\\text\{m\}\^\{2\}/g, "m²")
    .replace(/\\text\{cm\}\^\{2\}/g, "cm²")
    .replace(/\\text\{([^{}]+)\}/g, "$1")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\pi/g, "π")
    .replace(/\\%/g, "%")
    .replace(/\\,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTokens(strategyId: string) {
  const tokens = strategyId.split("-").filter(Boolean);
  while (tokens.length > 0 && (/^cp\d+$/i.test(tokens[0]!) || /^(ex|legacy|refined|additional)$/i.test(tokens[0]!))) {
    tokens.shift();
  }
  return tokens;
}

function words(tokens: readonly string[]) {
  return tokens
    .join(" ")
    .replace(/\bhalf factor\b/g, "the 1/2 factor")
    .replace(/\bquarter factor\b/g, "the 1/4 factor")
    .replace(/\bscale square\b/g, "the squared scale factor")
    .replace(/\bradius square\b/g, "the radius squared")
    .replace(/\bwire square over eight\b/g, "the wire length squared divided by 8")
    .replace(/\bwire square\b/g, "the wire length squared")
    .replace(/\bcm2\b/g, "cm²")
    .replace(/\bm2\b/g, "m²")
    .replace(/\s+/g, " ")
    .trim();
}

function withArticle(value: string) {
  if (!value) return "an intermediate value";
  if (/^(the|a|an|one|two|three|four|five|six|seven|eight|nine|ten|only|half|double|triple|all|both|its|their|\d)\b/i.test(value)) return value;
  return `the ${value}`;
}

function actionDetails(strategyId: string) {
  const tokens = cleanTokens(strategyId);
  const actionIndex = tokens.findIndex((token) => ACTIONS.has(token));
  return {
    tokens,
    actionIndex,
    action: actionIndex >= 0 ? tokens[actionIndex]! : "fallback",
    before: actionIndex >= 0 ? tokens.slice(0, actionIndex) : [],
    after: actionIndex >= 0 ? tokens.slice(actionIndex + 1) : tokens,
  };
}

function splitPhrase(value: string, separator: string) {
  const index = value.indexOf(separator);
  return index < 0
    ? undefined
    : [value.slice(0, index).trim(), value.slice(index + separator.length).trim()] as const;
}

function generatedExplanation(strategyId: string) {
  const { tokens, action, before, after } = actionDetails(strategyId);
  const beforeText = words(before);
  const afterText = words(after);
  const instead = splitPhrase(afterText, " instead of ");
  const as = splitPhrase(afterText, " as ");
  const by = splitPhrase(afterText, " by ");

  switch (action) {
    case "report":
    case "retain": {
      const source = instead?.[0] ?? afterText;
      const destination = instead?.[1] ?? beforeText;
      return destination
        ? `stopping at ${withArticle(source)} instead of calculating ${withArticle(destination)}`
        : `stopping at ${withArticle(source)} before the requested calculation is complete`;
    }
    case "choose": {
      const source = instead?.[0] ?? afterText;
      const destination = instead?.[1] ?? beforeText;
      return destination
        ? `choosing ${withArticle(source)} instead of ${withArticle(destination)}`
        : `choosing ${withArticle(source)} without checking which value the question asks for`;
    }
    case "use": {
      if (instead) return `using ${withArticle(instead[0])} instead of ${withArticle(instead[1])}`;
      if (as) return `using ${withArticle(as[0])} as ${withArticle(as[1])}`;
      return `using ${withArticle(afterText)} in a formula where it does not belong`;
    }
    case "divide":
      if (afterText.startsWith("by ")) return `dividing by ${afterText.slice(3)} unnecessarily`;
      return by
        ? `dividing ${withArticle(by[0])} by ${withArticle(by[1])}`
        : `dividing by ${withArticle(afterText)} unnecessarily`;
    case "multiply":
      if (afterText.startsWith("by ")) return `multiplying by ${afterText.slice(3)} unnecessarily`;
      return by
        ? `multiplying ${withArticle(by[0])} by ${withArticle(by[1])}`
        : `multiplying by ${withArticle(afterText)} unnecessarily`;
    case "add":
      return `adding ${withArticle(afterText)} when the formula requires a different operation`;
    case "subtract":
      return `subtracting ${withArticle(afterText)} at the wrong stage`;
    case "omit":
    case "miss":
    case "ignore":
      return `leaving out ${withArticle(afterText)}`;
    case "double": return `doubling ${withArticle(afterText)}`;
    case "triple": return `tripling ${withArticle(afterText)}`;
    case "halve": return `halving ${withArticle(afterText)}`;
    case "quarter": return `taking one quarter of ${withArticle(afterText)}`;
    case "square": return `squaring ${withArticle(afterText)}`;
    case "root": return `taking the square root of ${withArticle(afterText)}`;
    case "take": return tokens[actionDetails(strategyId).actionIndex + 1] === "root"
      ? `taking the square root of ${withArticle(words(tokens.slice(actionDetails(strategyId).actionIndex + 2)))}`
      : `taking ${withArticle(afterText)}`;
    case "single": return `counting only one ${afterText || "part"}`;
    case "average": return `using an average of ${withArticle(afterText)}`;
    case "cost": return instead
      ? `calculating the cost of ${withArticle(instead[0])} instead of ${withArticle(instead[1])}`
      : `calculating the cost of ${withArticle(afterText)} instead of the required region or boundary`;
    case "count": return instead
      ? `counting ${withArticle(instead[0])} instead of ${withArticle(instead[1])}`
      : `counting ${withArticle(afterText)} instead of the complete requirement`;
    case "tile": return instead
      ? `covering ${withArticle(instead[0])} instead of ${withArticle(instead[1])}`
      : `covering ${withArticle(afterText)} instead of the required region`;
    case "paint": return instead
      ? `painting ${withArticle(instead[0])} instead of ${withArticle(instead[1])}`
      : `painting ${withArticle(afterText)} instead of the exposed region`;
    case "expand": return `applying the increase to ${withArticle(afterText)} only once even though both dimensions change`;
    case "shrink": return `applying the decrease to ${withArticle(afterText)} only once even though both dimensions change`;
    case "treat": return as
      ? `treating ${withArticle(as[0])} as ${withArticle(as[1])}`
      : `treating ${withArticle(afterText)} as the requested quantity`;
    default:
      return `using ${withArticle(words(tokens))} without completing the full method`;
  }
}

function correctMethod(entry: Men001QuestionLanguageEntry) {
  const mode = entry.solveMode;

  if (/findTriangleAreaBaseHeight|findRightTriangleAreaFromLegs/.test(mode)) {
    return "Use A = 1/2 bh with a base and its perpendicular height.";
  }
  if (/findMissingHeightFromAreaAndBase/.test(mode)) {
    return "From A = 1/2 bh, double the area and divide by the base: h = 2A/b.";
  }
  if (/findMissingBaseFromAreaAndHeight/.test(mode)) {
    return "From A = 1/2 bh, double the area and divide by the height: b = 2A/h.";
  }
  if (/Isosceles/.test(mode)) {
    return "Halve the base, use Pythagoras to find the perpendicular height, and then apply A = 1/2 bh.";
  }
  if (/Heron|TriangleAreaFromSideRatio/.test(mode)) {
    return "Find the actual three sides and complete Heron's formula; use 1/2 bh only when the sides form a right triangle.";
  }
  if (/Equilateral/.test(mode)) {
    return "Use the equilateral-triangle relation required by the question and keep the 3-side perimeter factor separate from the area formula.";
  }
  if (/RectangleArea|FloorArea/.test(mode)) {
    return "Use rectangle area = length × breadth with both measurements in the same unit.";
  }
  if (/RectanglePerimeter|Boundary|Fencing/.test(mode) && !/Area/.test(mode)) {
    return "Use P = 2(l + b) and include both pairs of opposite sides.";
  }
  if (/RectangleLengthFromArea|RectangleBreadthFromArea/.test(mode)) {
    return "Use A = lb backwards by dividing the area by the known side.";
  }
  if (/Rectangle.*FromPerimeter/.test(mode)) {
    return "First halve the perimeter to get l + b, then subtract the known side.";
  }
  if (/SquareArea/.test(mode) && !/Wire/.test(mode)) {
    return "Use A = s² with the square's side, or take the positive square root when the area is given.";
  }
  if (/SquarePerimeter|SquareSideFromPerimeter/.test(mode)) {
    return "Use P = 4s; multiply the side by 4 or divide the perimeter by 4 as required.";
  }
  if (/Circle.*Wire|Wire.*Circle|Square.*Wire|Wire.*Square|RectangleWire/.test(mode)) {
    return "Set the old boundary equal to the new boundary, find the new side or radius, and only then calculate the requested area or length.";
  }
  if (/CircleArea|AreaFromCircumference/.test(mode)) {
    return "Find the radius first and use A = πr²; circumference and diameter are not area values.";
  }
  if (/Circumference|ArcLength|SectorPerimeter|SemicirclePerimeter|QuadrantPerimeter/.test(mode)) {
    return "Use the required arc fraction and include every straight edge stated by the perimeter question.";
  }
  if (/SectorArea|SemicircleArea|QuadrantArea/.test(mode)) {
    return "Find πr² and take the correct fraction: θ/360, 1/2, or 1/4.";
  }
  if (/RadiusFrom|DiameterFrom/.test(mode)) {
    return "Use the circle formula backwards, distinguish radius from diameter, and keep the positive length.";
  }
  if (/Parallelogram/.test(mode)) {
    return "Use base × perpendicular height; a sloping side is not the height.";
  }
  if (/Rhombus|Kite|Diagonal/.test(mode)) {
    return "Use the correct diagonal relation and retain the 1/2 factor where the area formula requires it.";
  }
  if (/Trapezium/.test(mode)) {
    return "Use A = 1/2(a + b)h with the two parallel sides and the perpendicular height.";
  }
  if (/Path|Border|Shaded|Remaining|Uncovered|Annulus/.test(mode)) {
    return "Calculate the complete outer area and subtract the inner or excluded area exactly once.";
  }
  if (/Composite|LShape|Union|CrossRoad|Stadium/.test(mode)) {
    return "Split the figure into non-overlapping parts, add included regions, and subtract any cut-out or overlap once.";
  }
  if (/Tile/.test(mode)) {
    return "Put both areas in the same square unit and divide total covered area by the area of one tile.";
  }
  if (/Cost|Rate/.test(mode)) {
    return "Finish the area or boundary calculation first, then apply the stated money rate with its matching unit.";
  }
  if (/AreaPercent|PercentageDimensionChanges/.test(mode)) {
    return "Apply both dimension multipliers; for equal change p%, use 2p ± p²/100 rather than adding percentages only.";
  }
  if (/AreaAfterLinearScaling|AreaFromScaled|MapArea|ActualArea/.test(mode)) {
    return "Area uses the square of the linear scale factor, k²; length and perimeter use k only once.";
  }
  if (/PerimeterAfterLinearScaling|ScaleFactorFromPerimeters|MapLength|ActualLength/.test(mode)) {
    return "Use the linear scale factor once for a length or perimeter, and keep the ratio in the requested direction.";
  }
  if (/Conversion|convertSquare|MixedLengthUnits|SideUnitConversion/.test(mode)) {
    return entry.answerDimension === "AREA"
      ? "Convert both dimensions: 1 m² = 10,000 cm². Then apply the area formula in one square unit."
      : "Convert every length to one unit before applying the perimeter or length formula.";
  }
  if (/Revolution|Wheel/.test(mode)) {
    return "One revolution covers one circumference; compare total distance with πd or 2πr.";
  }
  if (/Angle/.test(mode)) {
    return "Use the angle relation shown by the figure and report the result in degrees.";
  }

  switch (entry.answerDimension) {
    case "AREA": return "Use the area formula for the stated shape and keep all lengths in one unit before calculating.";
    case "LENGTH": return "Use the matching perimeter or inverse-area formula and keep the answer in a linear unit.";
    case "COST": return "Find the complete geometric measure first, then multiply by the stated rate.";
    case "RATE": return "Divide the total cost by the matching area or boundary length.";
    case "COUNT": return "Find the total requirement and divide by the amount covered in one item or revolution.";
    case "PERCENT": return "Compare the final value with the original 100% after applying every stated change.";
    case "SCALAR": return "Form the requested ratio in the correct direction and take a square root only when it comes from areas.";
    case "ANGLE": return "Use the stated angle relation and report the result in degrees.";
  }
}

function generatedCorrection(strategyId: string, entry: Men001QuestionLanguageEntry) {
  const { action } = actionDetails(strategyId);
  const method = correctMethod(entry);
  if (["report", "retain", "choose"].includes(action)) {
    return `That value belongs to a different stage of the solution. ${method}`;
  }
  if (["omit", "miss", "ignore"].includes(action)) {
    return `A necessary part of the calculation has been skipped. ${method}`;
  }
  if (["add", "double", "triple", "multiply", "square", "expand"].includes(action)) {
    return `An extra operation has been applied. ${method}`;
  }
  if (["divide", "halve", "quarter", "subtract", "root", "shrink"].includes(action)) {
    return `The calculation has removed or changed a factor incorrectly. ${method}`;
  }
  if (["use", "treat", "take", "single", "average", "cost", "count", "tile", "paint"].includes(action)) {
    return `The wrong measurement or intermediate value has been used. ${method}`;
  }
  return method;
}

function describe(strategyId: string, entry: Men001QuestionLanguageEntry) {
  const mistake = EXPLANATION_OVERRIDES[strategyId] ?? generatedExplanation(strategyId);
  const correction = CORRECTION_OVERRIDES[strategyId] ?? generatedCorrection(strategyId, entry);
  return `Common mistake: ${mistake}. ${correction}`;
}

export function buildMen001CommonTraps(
  entry: Men001QuestionLanguageEntry,
  optionResult: Men001OptionResult,
): Men001ExplanationSection {
  if (entry.distractorStrategyIds.length !== optionResult.distractors.length) {
    throw new Error(`${entry.qlId} cannot align distractor strategies with generated options.`);
  }

  const paragraphs = entry.distractorStrategyIds.map((strategyId, index) => {
    const distractor = optionResult.distractors[index];
    if (!distractor) throw new Error(`${entry.qlId} is missing distractor ${index + 1}.`);
    const optionIndex = optionResult.options.indexOf(distractor);
    if (optionIndex < 0 || optionIndex === optionResult.correctIndex) {
      throw new Error(`${entry.qlId} cannot locate a generated distractor in the shuffled options.`);
    }
    const optionLetter = String.fromCharCode(65 + optionIndex);
    return `Option ${optionLetter} (${readableOption(distractor)}): ${describe(strategyId, entry)}`;
  });

  return {
    kind: "COMMON_TRAPS",
    title: "Common Traps",
    paragraphs,
    equations: [],
  };
}
