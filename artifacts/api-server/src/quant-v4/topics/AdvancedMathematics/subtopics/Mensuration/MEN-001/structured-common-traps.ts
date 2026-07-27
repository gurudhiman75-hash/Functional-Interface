import type { Men001ExplanationSection } from "./structured-explanation";
import type { Men001QuestionLanguageEntry } from "./types";

export interface Men001OptionResult {
  options: readonly string[];
  correctIndex: number;
  distractors: readonly string[];
}

const EXPLANATION_OVERRIDES: Readonly<Record<string, string>> = {
  "omit-half-factor": "forgets the \\(\\frac{1}{2}\\) factor in the triangle-area formula and reports \\(bh\\) instead of \\(\\frac{1}{2}bh\\)",
  "omit-quarter-factor": "forgets the \\(\\frac{1}{4}\\) factor in the equilateral-triangle area formula",
  "omit-diagonal-half-factor": "forgets the \\(\\frac{1}{2}\\) factor in the diagonal-area formula",
  "omit-half-general-quadrilateral": "forgets the \\(\\frac{1}{2}\\) factor when the diagonal splits the quadrilateral into two triangles",
  "omit-scale-square": "uses the linear scale factor for area instead of squaring it",
  "use-equal-side-as-height": "uses the equal sloping side as the perpendicular height of the isosceles triangle",
  "use-half-base-as-height": "uses half of the base as the altitude without applying Pythagoras",
  "retain-equal-side": "reports the given equal side instead of the required perpendicular height",
  "use-semiperimeter-as-area": "stops at the semiperimeter and reports it as though it were an area",
  "square-semiperimeter": "squares the semiperimeter instead of completing Heron's formula",
  "halve-heron-area": "halves the area after Heron's formula even though no extra half factor is required",
  "double-heron-area": "doubles the area obtained from Heron's formula",
  "use-radius-as-diameter": "treats the radius as though it were the diameter",
  "use-diameter-as-radius": "treats the diameter as though it were the radius",
  "use-full-circle-area": "uses the area of a full circle where only a semicircle or sector is required",
  "use-circumference-as-area": "reports a boundary length as though it were an enclosed area",
  "use-circle-area-instead-of-square": "reports the original circle's area instead of the area of the reshaped square",
  "use-square-area-instead-of-circle": "reports the original square's area instead of the area of the reshaped circle",
  "retain-wire-length": "reports the conserved wire length instead of finding the requested side, radius or area",
  "add-inner-area": "adds the inner area although a border or path requires outer area minus inner area",
  "omit-inner-area": "uses only the outer area and forgets to remove the inner region",
  "use-linear-conversion-factor": "uses the linear unit-conversion factor for an area conversion instead of squaring it",
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
  if (actionIndex < 0) {
    return `uses ${withArticle(target)} as the answer instead of completing the required relation`;
  }

  const object = withArticle(target);
  const required = context ? `the required ${context}` : "the quantity asked for";
  const asParts = target.split(" as ");
  const insteadParts = target.split(" instead of ");

  switch (action) {
    case "report": return `reports ${object} instead of ${required}`;
    case "retain": return `stops at ${object} instead of completing ${required}`;
    case "use": {
      if (insteadParts.length === 2) return `uses ${withArticle(insteadParts[0]!)} instead of ${withArticle(insteadParts[1]!)}`;
      if (asParts.length === 2) return `uses ${withArticle(asParts[0]!)} as ${withArticle(asParts[1]!)}`;
      return `uses ${object} when finding ${required}`;
    }
    case "omit": return `omits ${object} from ${required}`;
    case "add": return `adds ${object} although ${required} needs a different operation`;
    case "subtract": return `subtracts ${object} at the wrong stage of ${required}`;
    case "multiply": return `multiplies by ${object} when finding ${required}`;
    case "divide": return `divides by ${object} when finding ${required}`;
    case "double": return `doubles ${object}`;
    case "triple": return `triples ${object}`;
    case "halve": return `halves ${object}`;
    case "quarter": return `takes one quarter of ${object}`;
    case "square": return `squares ${object}`;
    case "root": return `takes the square root of ${object}`;
    case "take": return tokens[actionIndex + 1] === "root"
      ? `takes the square root of ${withArticle(phrase(tokens.slice(actionIndex + 2)))}`
      : `takes ${object}`;
    case "single": return `counts only one ${target || "required part"}`;
    case "average": return `uses the average of ${object}`;
    case "choose": return `chooses ${object} instead of ${required}`;
    case "cost": return `calculates the cost of ${object} instead of ${required}`;
    case "count": return `counts ${object} instead of the complete requirement`;
    case "tile": return `tiles ${object} instead of the required region`;
    case "paint": return `paints ${object} instead of the required exposed area`;
    case "ignore": return `ignores ${object}`;
    case "miss": return `misses ${object}`;
    case "expand": return `expands ${object} only once instead of changing both required dimensions`;
    case "shrink": return `shrinks ${object} only once instead of changing both required dimensions`;
    case "treat": return `treats ${object} as ${required}`;
  }
}

function consequence(strategyId: string) {
  const { action } = actionDetails(strategyId);
  if (["omit", "retain", "report", "miss", "ignore"].includes(action)) {
    return "A required stage of the governing relation is missing.";
  }
  if (["double", "triple", "add", "expand"].includes(action)) {
    return "This normally overstates the requested result.";
  }
  if (["halve", "quarter", "divide", "subtract", "shrink"].includes(action)) {
    return "This normally understates the requested result.";
  }
  if (["square", "root"].includes(action)) {
    return "This changes the dimension or power of the required quantity.";
  }
  return "It answers a different geometric quantity or uses the wrong relation.";
}

function describe(strategyId: string) {
  const explanation = EXPLANATION_OVERRIDES[strategyId] ?? generatedExplanation(strategyId);
  return `${explanation.charAt(0).toUpperCase()}${explanation.slice(1)}. ${consequence(strategyId)}`;
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
    return `Option ${optionLetter} (${readableOption(distractor)}): ${describe(strategyId)}`;
  });

  return {
    kind: "COMMON_TRAPS",
    title: "Common Traps",
    paragraphs,
    equations: [],
  };
}
