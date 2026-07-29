import { formatIndianInteger } from "./exact";

interface EditableStep {
  title: string;
  body: string;
  equation?: string;
}

const EASY_ENGLISH_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bSquare the Three Perpendicular Dimensions\b/gi, "Square Length, Breadth and Height"],
  [/\ball three perpendicular dimensions\b/gi, "length, breadth and height"],
  [/\bthree perpendicular dimensions\b/gi, "the three dimensions"],
  [/\bperpendicular directions\b/gi, "directions at right angles"],
  [/\bperpendicular\b/gi, "at right angles"],
  [/\bcongruent\b/gi, "equal"],
  [/\bconserved\b/gi, "unchanged"],
  [/\bconstant cross-sectional area\b/gi, "base area"],
  [/\bconstant cross-section\b/gi, "base area"],
  [/\btrapezoidal cross-section\b/gi, "trapezoidal base area"],
  [/\bL-shaped cross-section\b/gi, "L-shaped base area"],
  [/\bcross-sectional area\b/gi, "base area"],
  [/\bcross-section\b/gi, "base shape"],
  [/\breconstructing\b/gi, "checking"],
  [/\breconstructs\b/gi, "checks"],
  [/\breconstructed\b/gi, "checked"],
  [/\breconstruct\b/gi, "check"],
  [/\brecovering\b/gi, "finding"],
  [/\brecovers\b/gi, "finds"],
  [/\brecovered\b/gi, "found"],
  [/\brecover\b/gi, "find"],
  [/\bboundary length\b/gi, "perimeter"],
  [/\bfull rectangular boundary\b/gi, "whole rectangle"],
  [/\bdimension-wise\b/gi, "along each direction"],
  [/\bmultiplicatively\b/gi, "by multiplying"],
  [/\bbase semiperimeter\b/gi, "half the base perimeter"],
  [/\bsemiperimeter\b/gi, "half the perimeter"],
  [/\baxis-aligned\b/gi, "parallel to the box edges"],
  [/\bsuccessive change\b/gi, "combined percentage change"],
  [/\bcoefficient of (\$\\sqrt[23]\$)/gi, "number before $1"],
  [/\bcoefficient\b/gi, "number in front"],
  [/\blinear dimensions\b/gi, "side lengths"],
  [/\blinear dimension\b/gi, "side length"],
  [/\bspace occupied\b/gi, "volume"],
  [/\boccupies exactly\b/gi, "equals"],
  [/\bcapacity equivalence\b/gi, "capacity rule"],
  [/\bevaluate\b/gi, "calculate"],
  [/\bderive\b/gi, "find"],
  [/\bisolate\b/gi, "find"],
  [/\bdetermine\b/gi, "find"],
];

function groupLargeNumber(digits: string) {
  return formatIndianInteger(BigInt(digits));
}

export function formatIndianNumbersInLearnerText(text: string) {
  return text.replace(/(?<![\d,])\d{4,}(?![\d,])/g, groupLargeNumber);
}

export function simplifyMenCp007English(text: string) {
  let simplified = text;
  for (const [pattern, replacement] of EASY_ENGLISH_REPLACEMENTS) {
    simplified = simplified.replace(pattern, replacement);
  }
  simplified = simplified
    .replace(/Rows, columns and layers combine by multiplying\./gi, "Multiply the row, column and layer counts to get the total.")
    .replace(/The same base shape continues through the full height\./gi, "The same base shape continues from bottom to top.")
    .replace(/The same base area continues through the full height\./gi, "The base area stays the same from bottom to top.")
    .replace(/Cubic units divided by length units leave square units\./gi, "Dividing cubic centimetres by centimetres gives square centimetres.")
    .replace(/Square units divided by height leave a perimeter\./gi, "Dividing the side area by the height gives the base perimeter.")
    .replace(/Area divided by perimeter leaves the vertical height\./gi, "Divide the side area by the base perimeter to get the height.")
    .replace(/Move \$l\^2\$ to the other side of the Pythagorean identity\./gi, "Subtract $l^2$ from $d^2$.")
    .replace(/For parallel to the box edges packing with rotation/gi, "When blocks may be rotated but must stay parallel to the box edges")
    .replace(/\bthe half the perimeter\b/gi, "half the perimeter")
    .replace(/\bbase half the perimeter\b/gi, "half the base perimeter")
    .replace(/\s{2,}/g, " ")
    .trim();
  return formatIndianNumbersInLearnerText(simplified);
}

function inlineEquation(equation: string) {
  const trimmed = equation.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return `$${trimmed.slice(2, -2).trim()}$`;
  }
  return trimmed;
}

function sentence(text: string) {
  const cleaned = text.trim().replace(/[\s:;,.-]+$/g, "");
  return cleaned.endsWith(".") ? cleaned : `${cleaned}.`;
}

function easyShortcut(steps: readonly EditableStep[]) {
  const finalStep = [...steps].reverse().find((step) => Boolean(step.equation));
  if (!finalStep?.equation) {
    return "Quick way: Follow the last calculation using the numbers given in the question.";
  }
  const title = simplifyMenCp007English(finalStep.title);
  const body = simplifyMenCp007English(finalStep.body);
  const instruction = body.length >= 18
    ? sentence(body)
    : `${sentence(title)} ${sentence(body)}`;
  return formatIndianNumbersInLearnerText(
    `Quick way: ${instruction} For this question, ${inlineEquation(finalStep.equation)}.`,
  );
}

export function polishMenCp007English<
  TStep extends EditableStep,
  TOption extends { display: string },
>(input: {
  stem: string;
  options: readonly TOption[];
  keyRule: string;
  steps: readonly TStep[];
  shortcut: string;
  traps: readonly string[];
}) {
  const steps = input.steps.map((step) => ({
    ...step,
    title: simplifyMenCp007English(step.title),
    body: simplifyMenCp007English(step.body),
    ...(step.equation ? { equation: formatIndianNumbersInLearnerText(step.equation) } : {}),
  })) as TStep[];

  return {
    stem: simplifyMenCp007English(input.stem),
    options: input.options.map((option) => ({
      ...option,
      display: formatIndianNumbersInLearnerText(option.display),
    })) as TOption[],
    explanation: {
      keyRule: simplifyMenCp007English(input.keyRule),
      steps,
      shortcut: easyShortcut(steps),
      traps: input.traps.map(simplifyMenCp007English),
    },
  };
}
