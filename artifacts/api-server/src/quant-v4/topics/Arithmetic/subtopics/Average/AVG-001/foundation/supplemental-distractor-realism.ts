import {
  add,
  divide,
  formatRational,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import type {
  Avg001DisplayPolicy,
  Avg001QuestionPackage,
  Rational,
} from "./types";

const SUPPORTED_MODES = new Set([
  "findAverageFromSumAndCount",
  "findCombinedAverageOfTwoGroups",
  "findCombinedAverageOfThreeOrFourGroups",
  "findAverageAfterUniformTransformation",
  "findCommonDifferenceFromAverageCountAndExtreme",
]);

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function sum(values: readonly Rational[]) {
  return values.reduce((current, value) => add(current, value), rational(0));
}

function numericVariable(pkg: Avg001QuestionPackage, key: string) {
  const value = pkg.parameters.renderVariables[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new Error(`${pkg.questionLanguageId}: missing numeric ${key}`);
}

function answerPolicy(pkg: Avg001QuestionPackage): Avg001DisplayPolicy {
  return pkg.parameters.answerType === "COUNT"
    ? "EXACT_INTEGER"
    : pkg.parameters.displayPolicy;
}

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  return `${sign}${leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}${decimal}`;
}

function renderDistractor(value: Rational, policy: Avg001DisplayPolicy) {
  const numeric = toNumber(value);
  if (policy === "EXACT_INTEGER") return String(Math.round(numeric));
  if (policy === "EXACT_DECIMAL_1") return numeric.toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return numeric.toFixed(2);
  return formatRational(value, "EXACT_FRACTION");
}

function formatLikeAnswer(pkg: Avg001QuestionPackage, value: Rational) {
  const policy = answerPolicy(pkg);
  const rendered = renderDistractor(value, policy);
  const canonicalRaw = formatRational(pkg.solver.exactAnswer, policy);
  if (pkg.answer === canonicalRaw) return rendered;
  if (pkg.answer.startsWith("₹")) return `₹${groupIndianDigits(rendered)}`;
  if (pkg.answer.includes(canonicalRaw)) return pkg.answer.replace(canonicalRaw, rendered);

  const match = pkg.answer.match(/^([^0-9-]*)(-?[0-9][0-9,]*(?:\.[0-9]+)?(?:\/[0-9]+)?)(.*)$/);
  if (match) return `${match[1]}${rendered}${match[3]}`;
  return rendered;
}

function candidatesFor(pkg: Avg001QuestionPackage) {
  const values = pkg.parameters.values;
  const candidates: Array<{ strategyId: string; value: Rational }> = [];
  const put = (strategyId: string, value: Rational) =>
    candidates.push({ strategyId: `misconception:${strategyId}`, value });

  if (pkg.solveMode === "findAverageFromSumAndCount") {
    put("used-total-as-average", values.total);
    put("subtracted-count-from-total", subtract(values.total, rational(values.count)));
    put("added-count-to-total", add(values.total, rational(values.count)));
    if (values.count > 1) put("divided-by-one-fewer-item", divide(values.total, rational(values.count - 1)));
    put("divided-by-one-extra-item", divide(values.total, rational(values.count + 1)));
  } else if (
    pkg.solveMode === "findCombinedAverageOfTwoGroups" ||
    pkg.solveMode === "findCombinedAverageOfThreeOrFourGroups"
  ) {
    const averages = values.groupAverages ?? [];
    put("added-group-averages-without-weighting", sum(averages));
    put("divided-total-by-number-of-groups", divide(values.combinedTotal!, rational(averages.length)));
    put("selected-first-group-average", averages[0]!);
    put("selected-last-group-average", averages.at(-1)!);
    put("used-unweighted-mean", divide(sum(averages), rational(averages.length)));
  } else if (pkg.solveMode === "findAverageAfterUniformTransformation") {
    const oldAverage = values.oldAverage ?? values.average;
    const factor = numericVariable(pkg, "factor");
    const change = numericVariable(pkg, "change");
    put("used-wrong-sign-for-change", subtract(oldAverage, rational(change)));
    put("applied-change-twice", add(oldAverage, rational(2 * change)));
    put("added-factor-instead-of-multiplying", add(oldAverage, rational(factor)));
    put("used-one-fewer-multiplication", multiply(oldAverage, rational(Math.max(1, factor - 1))));
    put("used-change-as-new-average", rational(change));
    put("used-factor-as-new-average", rational(factor));
  } else {
    const extreme = rational(numericVariable(pkg, "extremeValue"));
    const average = rational(numericVariable(pkg, "average"));
    const span = rational(Math.abs(extreme.numerator - average.numerator));
    const halfGaps = rational((values.count - 1) / 2);
    put("used-extreme-average-gap-as-common-difference", span);
    put("used-number-of-one-side-gaps-as-common-difference", halfGaps);
    put("off-by-one-lower-common-difference", subtract(pkg.solver.exactAnswer, rational(1)));
    put("off-by-one-higher-common-difference", add(pkg.solver.exactAnswer, rational(1)));
    put("divided-by-all-gaps", divide(span, rational(values.count - 1)));
  }
  return candidates;
}

export function supportsAvg001SupplementalDistractors(pkg: Avg001QuestionPackage) {
  return SUPPORTED_MODES.has(pkg.solveMode);
}

export function applyAvg001SupplementalDistractorRealism(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const selected: Array<{ strategyId: string; rendered: string }> = [];
  for (const candidate of candidatesFor(pkg)) {
    const rendered = formatLikeAnswer(pkg, candidate.value);
    if (rendered === pkg.answer || selected.some((item) => item.rendered === rendered)) continue;
    selected.push({ strategyId: candidate.strategyId, rendered });
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${pkg.questionLanguageId}: unable to build three exact-safe misconception distractors`);
  }

  const correctIndex = hash(`${pkg.seed}:${pkg.questionLanguageId}:supplemental-options-v1`) % 4;
  const options = selected.map((item) => item.rendered);
  options.splice(correctIndex, 0, pkg.answer);

  return {
    ...pkg,
    options,
    correctIndex,
    validation: {
      ...pkg.validation,
      checks: [
        ...pkg.validation.checks,
        {
          name: "distractor-realism",
          passed: true,
          message: "All three wrong options come from exact-safe misconception strategies",
        },
      ],
    },
    traceability: {
      ...pkg.traceability,
      distractorPolicy: "MISCONCEPTION_V1",
      distractorStrategyIds: selected.map((item) => item.strategyId),
    },
  };
}
