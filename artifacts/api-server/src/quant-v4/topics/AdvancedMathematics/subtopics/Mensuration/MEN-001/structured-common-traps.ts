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

function words(value: string) {
  return value
    .replace(/-instead-of-/g, " instead of ")
    .replace(/-as-/g, " as ")
    .replace(/-/g, " ")
    .replace(/half factor/g, "the 1/2 factor")
    .replace(/quarter factor/g, "the 1/4 factor")
    .replace(/scale square/g, "the squared scale factor")
    .replace(/square centimetres/g, "square centimetres")
    .replace(/square metres/g, "square metres")
    .replace(/\s+/g, " ")
    .trim();
}

function generatedExplanation(strategyId: string) {
  const patterns: readonly [RegExp, (rest: string) => string][] = [
    [/^omit-(.+)$/, (rest) => `omits ${words(rest)}`],
    [/^use-(.+)$/, (rest) => `uses ${words(rest)}`],
    [/^report-(.+)$/, (rest) => `reports ${words(rest)} before reaching the quantity asked for`],
    [/^retain-(.+)$/, (rest) => `stops at ${words(rest)} instead of completing the required calculation`],
    [/^double-(.+)$/, (rest) => `doubles ${words(rest)}`],
    [/^triple-(.+)$/, (rest) => `triples ${words(rest)}`],
    [/^quadruple-(.+)$/, (rest) => `multiplies ${words(rest)} by four`],
    [/^halve-(.+)$/, (rest) => `halves ${words(rest)}`],
    [/^square-(.+)$/, (rest) => `squares ${words(rest)}`],
    [/^add-(.+)$/, (rest) => `adds ${words(rest)}`],
    [/^subtract-(.+)$/, (rest) => `subtracts ${words(rest)}`],
    [/^divide-(.+)$/, (rest) => `divides ${words(rest)}`],
    [/^multiply-(.+)$/, (rest) => `multiplies ${words(rest)}`],
    [/^choose-(.+)$/, (rest) => `chooses ${words(rest)}`],
    [/^treat-(.+)$/, (rest) => `treats ${words(rest)}`],
    [/^confuse-(.+)$/, (rest) => `confuses ${words(rest)}`],
  ];
  for (const [pattern, render] of patterns) {
    const match = strategyId.match(pattern);
    if (match?.[1]) return render(match[1]);
  }
  return `applies the mistaken operation “${words(strategyId)}”`;
}

function consequence(strategyId: string) {
  if (/^(omit|retain|report)-/.test(strategyId)) {
    return "A required stage of the governing relation is missing.";
  }
  if (/^(double|triple|quadruple|add)-/.test(strategyId)) {
    return "This normally overstates the requested result.";
  }
  if (/^(halve|divide|subtract)-/.test(strategyId)) {
    return "This normally understates the requested result.";
  }
  if (/^square-/.test(strategyId)) {
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
