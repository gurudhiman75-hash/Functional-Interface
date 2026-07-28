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
};

const PRIMARY_ACTIONS = new Set([
  "add", "choose", "cost", "count", "divide", "double", "expand", "halve", "ignore",
  "miss", "multiply", "omit", "paint", "report", "retain", "shrink", "subtract", "take",
  "tile", "treat", "triple", "use",
]);
const SECONDARY_ACTIONS = new Set(["average", "quarter", "root", "single", "square"]);

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

function phrase(tokens: readonly string[]) {
  return tokens
    .join(" ")
    .replace(/\bhalf factor\b/g, "the 1/2 factor")
    .replace(/\bquarter factor\b/g, "the 1/4 factor")
    .replace(/\bscale square\b/g, "the squared scale factor")
    .replace(/\bradius square\b/g, "the radius squared")
    .replace(/\bwire square over eight\b/g, "the wire length squared divided by 8")
    .replace(/\bwire square\b/g, "the wire length squared")
    .replace(/\broot ([a-z ]+)/g, "the square root of $1")
    .replace(/\s+/g, " ")
    .trim();
}

function withArticle(value: string) {
  if (!value) return "the intermediate value";
  if (/^(the|a|an|one|only|half|double|triple|four|all|both)\b/i.test(value)) return value;
  return `the ${value}`;
}

function actionDetails(strategyId: string) {
  const tokens = cleanTokens(strategyId);
  let actionIndex = tokens.findIndex((token) => PRIMARY_ACTIONS.has(token));
  if (actionIndex < 0) actionIndex = tokens.findIndex((token) => SECONDARY_ACTIONS.has(token));
  if (actionIndex < 0) return { tokens, actionIndex: -1, action: "fallback", context: "", target: phrase(tokens) };
  return {
    tokens,
    actionIndex,
    action: tokens[actionIndex]!,
    context: phrase(tokens.slice(0, actionIndex)),
    target: phrase(tokens.slice(actionIndex + 1)),
  };
}

function generatedExplanation(strategyId: string) {
  const { tokens, actionIndex, action, context, target } = actionDetails(strategyId);
  if (actionIndex < 0) return `using ${withArticle(target)} as the final answer before the calculation is complete`;

  const object = withArticle(target);
  const required = context ? `the ${context}` : "the value asked for";
  const asParts = target.split(" as ");
  const insteadParts = target.split(" instead of ");

  switch (action) {
    case "report": return `reporting ${object} instead of ${required}`;
    case "retain": return `stopping at ${object} instead of completing ${required}`;
    case "use": {
      if (insteadParts.length === 2) return `using ${withArticle(insteadParts[0]!)} instead of ${withArticle(insteadParts[1]!)}`;
      if (asParts.length === 2) return `using ${withArticle(asParts[0]!)} as ${withArticle(asParts[1]!)}`;
      return `using ${object} in the wrong place`;
    }
    case "omit": return `leaving out ${object}`;
    case "add": return `adding ${object} when it should not be added`;
    case "subtract": return `subtracting ${object} at the wrong point`;
    case "multiply": return `multiplying by ${object} unnecessarily`;
    case "divide": return `dividing by ${object} unnecessarily`;
    case "double": return `doubling ${object}`;
    case "triple": return `tripling ${object}`;
    case "halve": return `halving ${object}`;
    case "quarter": return `taking one quarter of ${object}`;
    case "square": return `squaring ${object}`;
    case "root": return `taking the square root of ${object}`;
    case "take": return tokens[actionIndex + 1] === "root"
      ? `taking the square root of ${withArticle(phrase(tokens.slice(actionIndex + 2)))}`
      : `taking ${object}`;
    case "single": return `counting only one ${target || "part"}`;
    case "average": return `using the average of ${object}`;
    case "choose": return `choosing ${object} instead of ${required}`;
    case "cost": return `calculating the cost of ${object} instead of ${required}`;
    case "count": return `counting ${object} instead of the complete requirement`;
    case "tile": return `tiling ${object} instead of the required region`;
    case "paint": return `painting ${object} instead of the required exposed area`;
    case "ignore": return `ignoring ${object}`;
    case "miss": return `missing ${object}`;
    case "expand": return `changing ${object} only once even though both dimensions change`;
    case "shrink": return `reducing ${object} only once even though both dimensions change`;
    case "treat": return `treating ${object} as ${required}`;
  }
}

function answerName(entry: Men001QuestionLanguageEntry) {
  switch (entry.answerDimension) {
    case "AREA": return "area with a square unit";
    case "LENGTH": return "length with a linear unit";
    case "COST": return "total cost";
    case "RATE": return "rate per matching unit";
    case "ANGLE": return "angle in degrees";
    case "COUNT": return "whole-number count";
    case "PERCENT": return "percentage change";
    case "SCALAR": return "scale factor";
  }
}

function generatedCorrection(strategyId: string, entry: Men001QuestionLanguageEntry) {
  const { action, target } = actionDetails(strategyId);
  const object = withArticle(target);
  if (action === "omit" || action === "miss" || action === "ignore") {
    return `Put ${object} back into the calculation before choosing an option.`;
  }
  if (action === "report" || action === "retain") {
    return `That is only an intermediate value. Continue until you have the ${answerName(entry)} asked for.`;
  }
  if (["double", "triple", "add", "multiply", "expand"].includes(action)) {
    return "This adds an extra factor and makes the answer too large. Follow the formula once, line by line.";
  }
  if (["halve", "quarter", "divide", "subtract", "shrink"].includes(action)) {
    return "This removes a factor that the formula still needs. Check each operation before simplifying.";
  }
  if (["square", "root"].includes(action)) {
    return `Check the required ${answerName(entry)} and its unit before changing the power.`;
  }
  return `Check what the question asks for and use the formula that produces the ${answerName(entry)}.`;
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
