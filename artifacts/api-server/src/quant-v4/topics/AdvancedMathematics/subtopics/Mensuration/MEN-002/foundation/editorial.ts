import { formatIndianInteger } from "./exact";

interface EditableStep {
  title: string;
  body: string;
  equation?: string;
}

const EASY_ENGLISH_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bCancel the Common Surd\b/gi, "Cancel the Common Square-Root Factor"],
  [/\bKeep the Exact Surd\b/gi, "Keep the Exact Square-Root Form"],
  [/\bdecimal approximation\b/gi, "rounded decimal"],
  [/\bapproximation\b/gi, "rounded value"],
  [/\bcomplete edge-aligned cubes\b/gi, "complete cubes kept parallel to the block edges"],
  [/\bTest the Allowed arrangements\b/gi, "Test the Allowed Arrangements"],
  [/\bCalculate the Best arrangement\b/gi, "Calculate the Best Arrangement"],
  [/\bChoose the Best arrangement\b/gi, "Choose the Best Arrangement"],
  [/\bCombine the Three Perpendicular Directions\b/gi, "Use Length, Breadth and Height"],
  [/\bSquare the Three Perpendicular Dimensions\b/gi, "Square Length, Breadth and Height"],
  [/\ball three perpendicular dimensions\b/gi, "length, breadth and height"],
  [/\bthree perpendicular dimensions\b/gi, "the three dimensions"],
  [/\bmutually perpendicular edges\b/gi, "edges at right angles"],
  [/\bthird perpendicular dimension\b/gi, "height"],
  [/\bsame perpendicular height\b/gi, "same height"],
  [/\bperpendicular base and height\b/gi, "base and height"],
  [/\bperpendicular sides of the face\b/gi, "sides of the face at right angles"],
  [/\bperpendicular side lengths\b/gi, "side lengths at right angles"],
  [/\bperpendicular lengths\b/gi, "lengths at right angles"],
  [/\bperpendicular components\b/gi, "sides at right angles"],
  [/\bwith perpendicular distance\b/gi, "with the distance between them"],
  [/\btheir perpendicular distance\b/gi, "the distance between them"],
  [/\bperpendicular distance\b/gi, "distance between the parallel sides"],
  [/\bperpendicular height\b/gi, "height"],
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
  [/\bedge-aligned arrangement limits\b/gi, "fit limits along the three edges"],
  [/\bedge-aligned cutting\b/gi, "cutting along the block edges"],
  [/\bone-dimensional remainder\b/gi, "leftover length in only one direction"],
  [/\bunusable remainder\b/gi, "unused volume"],
  [/\bcomplete-block count\b/gi, "number of complete blocks"],
  [/\bwhole-number fits\b/gi, "complete blocks that fit"],
  [/\bwhole-number division\b/gi, "only complete blocks"],
  [/\borientations\b/gi, "arrangements"],
  [/\borientation\b/gi, "arrangement"],
  [/\bexact divisibility\b/gi, "exact fitting"],
  [/\bsuccessive change\b/gi, "combined percentage change"],
  [/\bcoefficient\b/gi, "number in front"],
  [/\blinear dimensions\b/gi, "side lengths"],
  [/\blinear dimension\b/gi, "side length"],
  [/\blinear factor\b/gi, "side-length factor"],
  [/\bspace occupied\b/gi, "volume"],
  [/\boccupies exactly\b/gi, "equals"],
  [/\bcapacity equivalence\b/gi, "capacity rule"],
  [/\bevaluate\b/gi, "calculate"],
  [/\bderive\b/gi, "find"],
  [/\bisolate\b/gi, "find"],
  [/\bdetermine\b/gi, "find"],
  [/\bpreserve\b/gi, "keep"],
  [/\bshared volume\b/gi, "same volume"],
  [/\bextracting\b/gi, "finding"],
  [/\bunaccounted for\b/gi, "unused"],
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
    .replace(/No rounded decimal is requested\./gi, "Keep the answer in square-root form; do not round it.")
    .replace(/Keep the surd exact because no rounded value is requested\./gi, "Keep the answer in square-root form; do not round it.")
    .replace(/Keep the square-root form exact because no rounded value is requested\./gi, "Keep the answer in square-root form; do not round it.")
    .replace(/The generated dimensions form an exact three-dimensional Pythagorean state\./gi, "The squares of the given lengths add to a perfect square.")
    .replace(/For independent dimension changes/gi, "When length, breadth and height change separately")
    .replace(/The difference is the unused volume\./gi, "The difference is the volume left over.")
    .replace(/The result is automatically in cubic metres\./gi, "All measurements are now in metres, so the answer is in cubic metres.")
    .replace(/Keep the rate dimension aligned with the measured quantity\./gi, "Use a rate whose unit matches the quantity in the question.")
    .replace(/With no mortar and exact fitting, count bricks along each dimension and multiply the three direction counts\./gi, "With no mortar, count how many bricks fit exactly along the length, breadth and height, then multiply the three counts.")
    .replace(/Each position in one direction combines with all positions in the other two\./gi, "Multiply the counts along length, breadth and height.")
    .replace(/A length is positive\./gi, "Take the positive square root to get the required length.")
    .replace(/No other arrangement gives a larger number of complete blocks\./gi, "Use the arrangement that gives the largest number of complete blocks.")
    .replace(/Compare the waste with the original volume\./gi, "Divide the wasted volume by the original volume and multiply by $100$.")
    .replace(/capacity-like volume/gi, "volume")
    .replace(/large-block volume/gi, "original block volume")
    .replace(/generated dimensions/gi, "given dimensions")
    .replace(/Pythagorean identity/gi, "Pythagorean formula")
    .replace(/squared components/gi, "squared lengths")
    .replace(/at right angles components/gi, "sides at right angles")
    .replace(/Rows, columns and layers combine by multiplying\./gi, "Multiply the row, column and layer counts to get the total.")
    .replace(/The same base shape continues through the full height\./gi, "The same base shape continues from bottom to top.")
    .replace(/The same base area continues through the full height\./gi, "The base area stays the same from bottom to top.")
    .replace(/Cubic units divided by length units leave square units\./gi, "Dividing cubic centimetres by centimetres gives square centimetres.")
    .replace(/Square units divided by height leave a perimeter\./gi, "Dividing the side area by the height gives the base perimeter.")
    .replace(/Area divided by perimeter leaves the vertical height\./gi, "Divide the side area by the base perimeter to get the height.")
    .replace(/Move \$l\^2\$ to the other side of the Pythagorean formula\./gi, "Subtract $l^2$ from $d^2$.")
    .replace(/For parallel to the box edges packing with rotation/gi, "When blocks may be rotated but must stay parallel to the box edges")
    .replace(/\bthe half the perimeter\b/gi, "half the perimeter")
    .replace(/\bbase half the perimeter\b/gi, "half the base perimeter")
    .replace(/(^|[.!?]\s+)find\b/g, "$1Find")
    .replace(/\s{2,}/g, " ")
    .trim();
  simplified = simplified.replace(/^([a-z])/, (letter) => letter.toUpperCase());
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
