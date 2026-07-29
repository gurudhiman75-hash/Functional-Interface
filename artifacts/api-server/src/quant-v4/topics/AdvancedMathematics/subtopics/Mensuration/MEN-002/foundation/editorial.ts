import { formatIndianInteger } from "./exact";

interface EditableStep {
  title: string;
  body: string;
  equation?: string;
}

const EASY_ENGLISH_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bperpendicular directions\b/gi, "directions at right angles"],
  [/\bperpendicular\b/gi, "at right angles"],
  [/\bcongruent\b/gi, "equal"],
  [/\bconserved\b/gi, "unchanged"],
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
  [/\bsemiperimeter\b/gi, "half the perimeter"],
  [/\baxis-aligned\b/gi, "parallel to the box edges"],
  [/\bsuccessive change\b/gi, "combined percentage change"],
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
    .replace(/Move ([^.]*) to the other side/gi, "Take $1 away from the other side")
    .replace(/\s{2,}/g, " ")
    .trim();
  return formatIndianNumbersInLearnerText(simplified);
}

function removeMath(text: string) {
  return text
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/[\s:;,.-]+$/g, "")
    .trim();
}

function inlineEquation(equation: string) {
  const trimmed = equation.trim();
  if (trimmed.startsWith("$$") && trimmed.endsWith("$$")) {
    return `$${trimmed.slice(2, -2).trim()}$`;
  }
  return trimmed;
}

function easyShortcut(shortcut: string, steps: readonly EditableStep[]) {
  const finalEquation = [...steps].reverse().find((step) => Boolean(step.equation))?.equation;
  const simpleShortcut = simplifyMenCp007English(shortcut).replace(/^Quick way:\s*/i, "");
  let instruction = removeMath(simpleShortcut);
  if (instruction.length < 12 || !/[A-Za-z]/.test(instruction)) {
    instruction = "Put the given numbers directly into the final formula";
  }
  const sentence = instruction.endsWith(".") ? instruction : `${instruction}.`;
  if (!finalEquation) return formatIndianNumbersInLearnerText(`Quick way: ${sentence}`);
  return formatIndianNumbersInLearnerText(`Quick way: ${sentence} For this question, ${inlineEquation(finalEquation)}.`);
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
      shortcut: easyShortcut(input.shortcut, steps),
      traps: input.traps.map(simplifyMenCp007English),
    },
  };
}
