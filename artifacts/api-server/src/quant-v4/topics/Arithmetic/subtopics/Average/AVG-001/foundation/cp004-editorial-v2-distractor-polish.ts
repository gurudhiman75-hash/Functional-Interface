import { applyAvg001Cp004EditorialV2Candidate } from "./cp004-editorial-v2-polish";
import { toNumber } from "./math";
import type { Avg001QuestionPackage, Rational } from "./types";

export const AVG_001_CP004_DISTRACTOR_ANALYSIS_V2 =
  "AVG-CP-004 value-based distractor analysis v2";

function numberFrom(value: unknown) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && "numerator" in value) {
    return toNumber(value as Rational);
  }
  return undefined;
}

function shownNumber(pkg: Avg001QuestionPackage, key: string) {
  const rendered = pkg.parameters.renderVariables[key];
  if (rendered !== undefined && rendered !== "") {
    const parsed = Number(String(rendered).replace(/[₹,\s]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return numberFrom(pkg.parameters.values[key as keyof typeof pkg.parameters.values]);
}

function optionNumber(option: string) {
  const parsed = Number(option.replace(/[₹,]/g, "").match(/-?\d+(?:\.\d+)?/)?.[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function ratioParts(option: string) {
  const match = option.match(/^(\d+):(\d+)$/);
  return match ? [Number(match[1]), Number(match[2])] as const : undefined;
}

function matches(pkg: Avg001QuestionPackage, actual: number | undefined, target: number | undefined) {
  if (actual === undefined || target === undefined || !Number.isFinite(target)) return false;
  const tolerance = pkg.parameters.displayPolicy === "EXACT_INTEGER" ? 0.51 : 0.051;
  return Math.abs(actual - target) <= tolerance;
}

function mean(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined;
}

function weightedAverage(values: number[], weights: number[], omit?: number) {
  let total = 0;
  let count = 0;
  for (let index = 0; index < values.length; index += 1) {
    if (index === omit) continue;
    total += values[index]! * weights[index]!;
    count += weights[index]!;
  }
  return count ? total / count : undefined;
}

function subgroupReuseTag(option: number, averages: number[]) {
  const index = averages.findIndex((average) => Math.abs(option - average) < 0.051);
  return index >= 0 ? `SUBGROUP_${index + 1}_AVERAGE_REUSED` : undefined;
}

function tagForNumericOption(pkg: Avg001QuestionPackage, option: number) {
  const averages = (pkg.parameters.values.groupAverages ?? []).map(toNumber);
  const counts = pkg.parameters.values.groupCounts ?? [];
  const speed1 = shownNumber(pkg, "speed1");
  const speed2 = shownNumber(pkg, "speed2");
  const arithmeticSpeedMean = speed1 !== undefined && speed2 !== undefined
    ? (speed1 + speed2) / 2
    : undefined;

  switch (pkg.solveMode) {
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups": {
      if (matches(pkg, option, mean(averages))) return "UNWEIGHTED_MEAN";
      if (pkg.solveMode === "findCombinedAverageOfThreeOrFourGroups" && counts.length === averages.length) {
        const omitted = averages.findIndex((_, index) => matches(pkg, option, weightedAverage(averages, counts, index)));
        if (omitted >= 0) return `SUBGROUP_${omitted + 1}_OMITTED`;
      }
      return subgroupReuseTag(option, averages) ?? "WEIGHTED_ARITHMETIC_ERROR";
    }
    case "findGroupCountFromCombinedAverage": {
      const knownCount = shownNumber(pkg, "knownCount");
      const knownAverage = shownNumber(pkg, "knownAverage");
      const unknownAverage = shownNumber(pkg, "unknownAverage");
      const combinedAverage = shownNumber(pkg, "combinedAverage");
      const answer = optionNumber(pkg.answer);
      if (matches(pkg, option, knownCount)) return "KNOWN_GROUP_COUNT_REUSED";
      if (answer !== undefined && Math.abs(option - answer) === 1) return "COUNT_OFF_BY_ONE";
      if (knownCount !== undefined && knownAverage !== undefined && unknownAverage !== undefined && combinedAverage !== undefined) {
        const reversed = knownCount * (unknownAverage - combinedAverage) / (combinedAverage - knownAverage);
        if (matches(pkg, option, reversed)) return "INVERSE_DISTANCE_RATIO_REVERSED";
      }
      return "COUNT_EQUATION_ARITHMETIC_ERROR";
    }
    case "findMissingGroupAverage": {
      const known = shownNumber(pkg, "average1") ?? numberFrom(pkg.parameters.values.knownGroupAverage);
      const combined = shownNumber(pkg, "combinedAverage") ?? numberFrom(pkg.parameters.values.combinedAverage);
      if (matches(pkg, option, combined)) return "COMBINED_AVERAGE_REUSED";
      if (matches(pkg, option, known)) return "KNOWN_GROUP_AVERAGE_REUSED";
      if (known !== undefined && combined !== undefined && matches(pkg, option, (known + combined) / 2)) return "UNWEIGHTED_MEAN";
      return "SIGNED_TOTAL_BALANCE_ERROR";
    }
    case "findAverageSpeedEqualDistance": {
      if (matches(pkg, option, arithmeticSpeedMean)) return "ARITHMETIC_MEAN_TRAP";
      if (matches(pkg, option, speed1)) return "FIRST_SPEED_REUSED";
      if (matches(pkg, option, speed2)) return "SECOND_SPEED_REUSED";
      return "TIME_CONVERSION_ARITHMETIC_ERROR";
    }
    case "findAverageSpeedEqualTime": {
      if (speed1 !== undefined && speed2 !== undefined) {
        const harmonic = 2 * speed1 * speed2 / (speed1 + speed2);
        if (matches(pkg, option, harmonic)) return "HARMONIC_MEAN_TRAP";
      }
      if (matches(pkg, option, speed1)) return "FIRST_RATE_REUSED";
      if (matches(pkg, option, speed2)) return "SECOND_RATE_REUSED";
      return "RATE_ARITHMETIC_ERROR";
    }
    case "findAverageSpeedForUnequalDistances": {
      if (matches(pkg, option, arithmeticSpeedMean)) return "ARITHMETIC_MEAN_TRAP";
      if (speed1 !== undefined && speed2 !== undefined) {
        const harmonic = 2 * speed1 * speed2 / (speed1 + speed2);
        if (matches(pkg, option, harmonic)) return "EQUAL_DISTANCE_FORMULA_MISUSED";
        const distance1 = shownNumber(pkg, "distance1");
        const distance2 = shownNumber(pkg, "distance2");
        if (distance1 !== undefined && distance2 !== undefined) {
          const wrongDistanceWeightedMean = (distance1 * speed1 + distance2 * speed2) / (distance1 + distance2);
          if (matches(pkg, option, wrongDistanceWeightedMean)) return "SPEED_WEIGHTED_BY_DISTANCE";
        }
      }
      if (matches(pkg, option, speed1)) return "FIRST_SPEED_REUSED";
      if (matches(pkg, option, speed2)) return "SECOND_SPEED_REUSED";
      return "TOTAL_TIME_ARITHMETIC_ERROR";
    }
    case "findAverageSpeedForUnequalTimes": {
      if (matches(pkg, option, arithmeticSpeedMean)) return "ARITHMETIC_MEAN_TRAP";
      const time1 = shownNumber(pkg, "time1");
      const time2 = shownNumber(pkg, "time2");
      if (speed1 !== undefined && speed2 !== undefined && time1 !== undefined && time2 !== undefined) {
        const reversedWeights = (speed1 * time2 + speed2 * time1) / (time1 + time2);
        if (matches(pkg, option, reversedWeights)) return "TIME_WEIGHTS_REVERSED";
      }
      if (matches(pkg, option, speed1)) return "FIRST_SPEED_REUSED";
      if (matches(pkg, option, speed2)) return "SECOND_SPEED_REUSED";
      return "TIME_WEIGHT_ARITHMETIC_ERROR";
    }
    default:
      return "PLAUSIBLE_ARITHMETIC_ERROR";
  }
}

function tagForRatioOption(pkg: Avg001QuestionPackage, option: string) {
  const wrong = ratioParts(option);
  const correct = ratioParts(pkg.answer);
  if (!wrong || !correct) return "RATIO_SETUP_ERROR";
  if (wrong[0] === correct[1] && wrong[1] === correct[0]) return "RATIO_REVERSED";
  if (wrong[0] * correct[1] === wrong[1] * correct[0]) return "EQUIVALENT_RATIO_NOT_REDUCED";
  if (Math.abs(wrong[0] - correct[0]) <= 1 || Math.abs(wrong[1] - correct[1]) <= 1) return "RATIO_COMPONENT_ARITHMETIC_ERROR";
  return "OPPOSITE_DISTANCE_SETUP_ERROR";
}

function repairImplausibleCurrencyDistractors(pkg: Avg001QuestionPackage) {
  const repairedIndices = new Set<number>();
  const options = pkg.options.map((option, index) => {
    if (index !== pkg.correctIndex && option.startsWith("-₹")) {
      repairedIndices.add(index);
      return option.slice(1);
    }
    return option;
  });
  return { options, repairedIndices };
}

function distractorLine(pkg: Avg001QuestionPackage, repairedIndices: Set<number>) {
  const analysis = pkg.options
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, index }) => {
      const tag = repairedIndices.has(index)
        ? "SIGN_REVERSAL_ERROR"
        : pkg.parameters.answerType === "RATIO"
          ? tagForRatioOption(pkg, option)
          : tagForNumericOption(pkg, optionNumber(option) ?? Number.NaN);
      return `${String.fromCharCode(65 + index)} (${option}) [${tag}]`;
    })
    .join("; ");
  return `⚠️ Common traps and distractors: ${analysis}. Therefore, the required answer is ${pkg.answer}.`;
}

export function applyAvg001Cp004EditorialV2ReviewedCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp004EditorialV2Candidate(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-004" || candidate.language !== "en") {
    return candidate;
  }
  const { options, repairedIndices } = repairImplausibleCurrencyDistractors(candidate);
  const answer = options[candidate.correctIndex]!;
  const optionRepaired = { ...candidate, options, answer };
  const lines = [...optionRepaired.explanation.lines];
  lines[3] = distractorLine(optionRepaired, repairedIndices);
  return {
    ...optionRepaired,
    explanation: { lines },
    traceability: {
      ...optionRepaired.traceability,
      cp004DistractorAnalysisV2: AVG_001_CP004_DISTRACTOR_ANALYSIS_V2,
      implausibleCurrencyDistractorsRepaired: [...repairedIndices],
    },
  };
}
