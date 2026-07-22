import { getAvg001QuestionEntry, renderTemplate } from "./library";
import {
  add,
  divide,
  equals,
  formatRational,
  gcd,
  multiply,
  rational,
  subtract,
  toNumber,
} from "./math";
import {
  AVG_001_PACKAGE_ID,
  type Avg001DisplayPolicy,
  type Avg001Language,
  type Avg001Parameters,
  type Avg001QuestionPackage,
  type Avg001ReasoningEvidence,
  type Avg001SolverResult,
  type Avg001ValidationCheck,
  type Rational,
} from "./types";

type Cp004Entry = ReturnType<typeof getAvg001QuestionEntry> & {
  unitKind?: string;
};

type NumericProfile = {
  targets: number[];
  deltas: number[];
  minimum: number;
  maximum: number;
};

const COUNT_POOLS = {
  Easy: [10, 12, 15, 18, 20, 24, 25, 30],
  Medium: [12, 15, 18, 20, 24, 25, 28, 30, 32, 36],
  Hard: [14, 16, 18, 21, 24, 27, 30, 32, 35, 40, 45],
} as const;

const PROFILES: Record<string, NumericProfile> = {
  marks: { targets: [48, 52, 55, 58, 60, 62, 65, 68, 72], deltas: [1, 2, 3, 4], minimum: 20, maximum: 100 },
  currency: { targets: [24000, 28000, 32000, 36000, 40000, 45000, 50000], deltas: [500, 1000, 1500, 2000], minimum: 1000, maximum: 100000 },
  kg: { targets: [36, 40, 45, 48, 50, 55, 60, 64], deltas: [1, 2, 3], minimum: 5, maximum: 120 },
  years: { targets: [24, 28, 30, 32, 35, 38, 40, 42], deltas: [1, 2, 3], minimum: 8, maximum: 80 },
  units: { targets: [32, 40, 45, 50, 60, 72, 80, 90], deltas: [1, 2, 4, 5], minimum: 5, maximum: 180 },
  runs: { targets: [28, 32, 36, 40, 44, 48, 52, 56], deltas: [1, 2, 3, 4], minimum: 5, maximum: 100 },
  none: { targets: [20, 24, 28, 30, 36, 40, 45, 50, 60], deltas: [1, 2, 3, 4], minimum: 1, maximum: 150 },
  kmh: { targets: [30, 36, 40, 45, 48, 54, 60, 72], deltas: [2, 4, 6, 8], minimum: 10, maximum: 140 },
  unitsPerHour: { targets: [30, 36, 40, 45, 50, 60, 72, 80], deltas: [2, 4, 5, 6], minimum: 5, maximum: 160 },
};

const DISTANCE_INTEGER_PAIRS: readonly [number, number][] = [
  [20, 30], [20, 60], [20, 80], [21, 28], [21, 42], [22, 66],
  [24, 40], [24, 48], [24, 72], [25, 100], [27, 54], [28, 70],
  [28, 84], [30, 42], [30, 45], [30, 60], [30, 70], [30, 90],
  [32, 96], [33, 66], [33, 88], [35, 63], [36, 60], [40, 60],
];

const DISTANCE_DECIMAL_PAIRS: readonly [number, number][] = [
  [20, 44], [21, 39], [21, 49], [21, 63], [22, 33], [22, 58],
  [22, 88], [23, 69], [24, 36], [24, 56], [24, 66], [24, 96],
  [25, 75], [26, 39], [26, 54], [27, 33], [27, 63], [27, 81],
  [28, 36], [28, 42], [28, 52], [29, 87], [30, 54], [32, 48],
];

function hash(value: string) {
  let h = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function prng(seed: string) {
  let state = hash(seed) || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function pick<T>(items: readonly T[], next: () => number) {
  if (!items.length) throw new Error("Cannot pick from an empty CP-004 range");
  return items[Math.floor(next() * items.length)]!;
}

function natural(value: Rational) {
  if (value.denominator === 1) return String(value.numerator);
  const numeric = toNumber(value);
  if (Number.isInteger(numeric * 10)) return numeric.toFixed(1);
  return `${value.numerator}/${value.denominator}`;
}

function groupIndianDigits(value: string) {
  const match = value.match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3);
  const groupedLeading = leading.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${groupedLeading},${lastThree}${decimal}`;
}

function entryUnit(entry: Cp004Entry) {
  return entry.unitKind ?? "none";
}

function profileFor(entry: Cp004Entry) {
  return PROFILES[entryUnit(entry)] ?? PROFILES.none!;
}

function targetValue(entry: Cp004Entry, next: () => number, forceInteger = false) {
  const profile = profileFor(entry);
  const base = pick(profile.targets, next);
  const useHalf = !forceInteger && entry.displayPolicy === "EXACT_DECIMAL_1";
  return useHalf ? rational(base * 2 + 1, 2) : rational(base);
}

function withinProfile(value: Rational, profile: NumericProfile) {
  const numeric = toNumber(value);
  return numeric >= profile.minimum && numeric <= profile.maximum;
}

function formatStemNumber(value: Rational, entry: Cp004Entry) {
  const rendered = natural(value);
  return entryUnit(entry) === "currency" ? groupIndianDigits(rendered) : rendered;
}

function constructPairState(
  entry: Cp004Entry,
  next: () => number,
  options: { forceIntegerTarget?: boolean; countMode?: boolean } = {},
) {
  const profile = profileFor(entry);
  const counts = COUNT_POOLS[entry.difficulty];
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const count1 = pick(counts, next);
    let count2 = pick(counts, next);
    if (count2 === count1 && next() > 0.35) {
      count2 = counts[(counts.indexOf(count2) + 1) % counts.length]!;
    }
    const target = targetValue(entry, next, options.forceIntegerTarget);
    const common = gcd(count1, count2);
    const leftWeight = count1 / common;
    const rightWeight = count2 / common;
    const delta = rational(pick(profile.deltas, next));
    const direction = options.countMode ? 1 : next() < 0.5 ? 1 : -1;
    const average1 = subtract(target, multiply(delta, rational(direction * rightWeight)));
    const average2 = add(target, multiply(delta, rational(direction * leftWeight)));
    if (!withinProfile(average1, profile) || !withinProfile(average2, profile) || equals(average1, average2)) continue;
    const groupCounts = [count1, count2];
    const groupAverages = [average1, average2];
    const groupTotals = groupAverages.map((average, index) => multiply(average, rational(groupCounts[index]!)));
    const combinedCount = count1 + count2;
    const combinedTotal = add(groupTotals[0]!, groupTotals[1]!);
    const combinedAverage = divide(combinedTotal, rational(combinedCount));
    if (!equals(combinedAverage, target)) continue;
    return { groupCounts, groupAverages, groupTotals, combinedCount, combinedTotal, combinedAverage };
  }
  throw new Error(`Unable to construct CP-004 pair state for ${entry.qlId}`);
}

function constructMultiState(entry: Cp004Entry, next: () => number) {
  const profile = profileFor(entry);
  const counts = COUNT_POOLS[entry.difficulty];
  const groupCount = entry.requiredVariables.includes("count4") ? 4 : 3;
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const groupCounts = Array.from({ length: groupCount }, () => pick(counts, next));
    const combinedCount = groupCounts.reduce((sum, value) => sum + value, 0);
    const combinedAverage = targetValue(entry, next);
    const groupAverages: Rational[] = [];
    let previousTotal = rational(0);
    for (let index = 0; index < groupCount - 1; index += 1) {
      const delta = rational(pick(profile.deltas, next));
      const factor = 1 + Math.floor(next() * 3);
      const direction = (index + Math.floor(next() * 2)) % 2 === 0 ? 1 : -1;
      const average = add(combinedAverage, multiply(delta, rational(direction * factor)));
      groupAverages.push(average);
      previousTotal = add(previousTotal, multiply(average, rational(groupCounts[index]!)));
    }
    const requiredTotal = multiply(combinedAverage, rational(combinedCount));
    const lastAverage = divide(subtract(requiredTotal, previousTotal), rational(groupCounts.at(-1)!));
    groupAverages.push(lastAverage);
    if (groupAverages.some((average) => !withinProfile(average, profile) || ![1, 2, 5, 10].includes(average.denominator))) continue;
    const groupTotals = groupAverages.map((average, index) => multiply(average, rational(groupCounts[index]!)));
    const combinedTotal = groupTotals.reduce(add, rational(0));
    if (!equals(combinedTotal, requiredTotal)) continue;
    return { groupCounts, groupAverages, groupTotals, combinedCount, combinedTotal, combinedAverage };
  }
  throw new Error(`Unable to construct CP-004 multi-group state for ${entry.qlId}`);
}

function constructSpeedState(entry: Cp004Entry, next: () => number) {
  if (entry.solveMode === "findAverageSpeedEqualDistance") {
    const pool = entry.displayPolicy === "EXACT_INTEGER" ? DISTANCE_INTEGER_PAIRS : DISTANCE_DECIMAL_PAIRS;
    const [first, second] = pick(pool, next);
    const speed1 = rational(first);
    const speed2 = rational(second);
    const combinedAverage = divide(multiply(rational(2), multiply(speed1, speed2)), add(speed1, speed2));
    formatRational(combinedAverage, entry.displayPolicy);
    return { speed1, speed2, combinedAverage };
  }
  const profile = profileFor(entry);
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const base = pick(profile.targets, next);
    const gap = pick([4, 6, 8, 10, 12, 14, 16], next);
    const wantsDecimal = entry.displayPolicy === "EXACT_DECIMAL_1";
    const speed1 = rational(Math.max(5, base - gap));
    const speed2 = rational(base + gap + (wantsDecimal ? 1 : 0));
    const combinedAverage = divide(add(speed1, speed2), rational(2));
    try {
      formatRational(combinedAverage, entry.displayPolicy);
      return { speed1, speed2, combinedAverage };
    } catch {
      // Try another exact state.
    }
  }
  throw new Error(`Unable to construct CP-004 equal-time state for ${entry.qlId}`);
}

function constructParameters(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001Parameters {
  const entry = getAvg001QuestionEntry(input.questionLanguageId) as Cp004Entry;
  if (entry.cpId !== "AVG-CP-004") throw new Error(`CP-004 runtime received ${entry.cpId}`);
  if (input.language !== "en") throw new Error(`AVG-001 CP-004 supports English only; received ${input.language}`);
  const next = prng(`${input.seed}:${entry.qlId}:cp004`);
  let groupCounts: number[] = [];
  let groupAverages: Rational[] = [];
  let groupTotals: Rational[] = [];
  let combinedCount = 0;
  let combinedAverage = rational(0);
  let combinedTotal = rational(0);
  let speed1: Rational | undefined;
  let speed2: Rational | undefined;
  if (entry.solveMode === "findAverageSpeedEqualDistance" || entry.solveMode === "findAverageSpeedEqualTime") {
    const state = constructSpeedState(entry, next);
    speed1 = state.speed1;
    speed2 = state.speed2;
    combinedAverage = state.combinedAverage;
    combinedCount = 2;
    combinedTotal = add(speed1, speed2);
  } else if (entry.solveMode === "findCombinedAverageOfThreeOrFourGroups") {
    ({ groupCounts, groupAverages, groupTotals, combinedCount, combinedAverage, combinedTotal } = constructMultiState(entry, next));
  } else {
    ({ groupCounts, groupAverages, groupTotals, combinedCount, combinedAverage, combinedTotal } = constructPairState(entry, next, {
      forceIntegerTarget: entry.solveMode === "findGroupCountFromCombinedAverage",
      countMode: entry.solveMode === "findGroupCountFromCombinedAverage",
    }));
  }
  const renderVariables: Record<string, string | number> = {};
  groupCounts.forEach((value, index) => { renderVariables[`count${index + 1}`] = value; });
  groupAverages.forEach((value, index) => { renderVariables[`average${index + 1}`] = formatStemNumber(value, entry); });
  if (entry.solveMode === "findGroupCountFromCombinedAverage") {
    renderVariables.knownCount = groupCounts[0]!;
    renderVariables.knownAverage = formatStemNumber(groupAverages[0]!, entry);
    renderVariables.unknownAverage = formatStemNumber(groupAverages[1]!, entry);
    renderVariables.combinedAverage = formatStemNumber(combinedAverage, entry);
  }
  if (entry.solveMode === "findMissingGroupAverage") {
    renderVariables.count1 = groupCounts[0]!;
    renderVariables.average1 = formatStemNumber(groupAverages[0]!, entry);
    renderVariables.count2 = groupCounts[1]!;
    renderVariables.combinedAverage = formatStemNumber(combinedAverage, entry);
  }
  if (speed1 && speed2) {
    renderVariables.speed1 = natural(speed1);
    renderVariables.speed2 = natural(speed2);
  }
  return {
    packageId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-004",
    questionLanguageId: entry.qlId,
    seed: input.seed,
    language: input.language,
    difficulty: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    answerType: entry.answerType,
    displayPolicy: entry.displayPolicy,
    contextDomain: entry.contextDomain,
    scenarioVariant: entry.scenarioVariant,
    values: {
      count: combinedCount,
      average: combinedAverage,
      total: combinedTotal,
      groupCounts,
      groupAverages,
      groupTotals,
      combinedCount,
      combinedAverage,
      combinedTotal,
      knownGroupCount: groupCounts[0],
      knownGroupAverage: groupAverages[0],
      unknownGroupCount: groupCounts[1],
      unknownGroupAverage: groupAverages[1],
      speed1,
      speed2,
    },
    renderVariables,
  };
}

function solveCp004(parameters: Avg001Parameters): Avg001SolverResult {
  const values = parameters.values;
  let exactAnswer: Rational;
  let equation: string;
  switch (parameters.solveMode) {
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups":
    case "findAverageSpeedEqualDistance":
    case "findAverageSpeedEqualTime":
      exactAnswer = values.combinedAverage!;
      equation = `Combined average = ${natural(exactAnswer)}`;
      break;
    case "findGroupCountFromCombinedAverage":
      exactAnswer = rational(values.unknownGroupCount!);
      equation = `Unknown group count = ${natural(exactAnswer)}`;
      break;
    case "findMissingGroupAverage":
      exactAnswer = values.unknownGroupAverage!;
      equation = `Missing group average = ${natural(exactAnswer)}`;
      break;
    default:
      throw new Error(`Unsupported CP-004 solve mode ${parameters.solveMode}`);
  }
  return {
    exactAnswer,
    answer: formatRational(exactAnswer, parameters.displayPolicy),
    equation,
    workingValues: {
      combinedCount: values.combinedCount ?? values.count,
      combinedAverage: natural(values.combinedAverage ?? values.average),
      combinedTotal: natural(values.combinedTotal ?? values.total),
      groupCounts: (values.groupCounts ?? []).join(","),
      groupAverages: (values.groupAverages ?? []).map(natural).join(","),
    },
  };
}

function independentlyVerifyCp004(parameters: Avg001Parameters) {
  const values = parameters.values;
  let exactAnswer: Rational;
  let method: string;
  switch (parameters.solveMode) {
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups": {
      const total = (values.groupTotals ?? []).reduce(add, rational(0));
      const count = (values.groupCounts ?? []).reduce((sum, value) => sum + value, 0);
      exactAnswer = divide(total, rational(count));
      method = "Rebuilt every group total and divided their sum by the combined count";
      break;
    }
    case "findGroupCountFromCombinedAverage":
      exactAnswer = divide(
        multiply(rational(values.knownGroupCount!), subtract(values.combinedAverage!, values.knownGroupAverage!)),
        subtract(values.unknownGroupAverage!, values.combinedAverage!),
      );
      method = "Balanced the weighted deviations on the two sides of the combined average";
      break;
    case "findMissingGroupAverage": {
      const totalNeeded = multiply(values.combinedAverage!, rational(values.combinedCount!));
      const knownTotal = multiply(values.knownGroupAverage!, rational(values.knownGroupCount!));
      exactAnswer = divide(subtract(totalNeeded, knownTotal), rational(values.unknownGroupCount!));
      method = "Subtracted the known group total from the required combined total";
      break;
    }
    case "findAverageSpeedEqualDistance":
      exactAnswer = divide(multiply(rational(2), multiply(values.speed1!, values.speed2!)), add(values.speed1!, values.speed2!));
      method = "Used total equal distance divided by the sum of travel times";
      break;
    case "findAverageSpeedEqualTime":
      exactAnswer = divide(add(values.speed1!, values.speed2!), rational(2));
      method = "Used the arithmetic mean because both rates apply for equal time";
      break;
    default:
      throw new Error("Independent CP-004 verifier received an unsupported mode");
  }
  return { supported: true, exactAnswer, displayAnswer: formatRational(exactAnswer, parameters.displayPolicy), method };
}

function buildReasoningEvidence(parameters: Avg001Parameters, solver: Avg001SolverResult): Avg001ReasoningEvidence {
  const values = parameters.values;
  return {
    conceptId: parameters.solveMode === "findAverageSpeedEqualDistance" ? "equal-distance-harmonic-average" : parameters.solveMode === "findAverageSpeedEqualTime" ? "equal-time-arithmetic-average" : "weighted-group-aggregation",
    givens: {
      groupCounts: (values.groupCounts ?? []).join(", "),
      groupAverages: (values.groupAverages ?? []).map(natural).join(", "),
      combinedCount: values.combinedCount ?? values.count,
      combinedAverage: natural(values.combinedAverage ?? values.average),
      speed1: values.speed1 ? natural(values.speed1) : "",
      speed2: values.speed2 ? natural(values.speed2) : "",
    },
    equations: ["Group total = Group average × Group count", "Combined average = Sum of group totals ÷ Combined count"],
    intermediateValues: {
      groupTotals: (values.groupTotals ?? []).map(natural).join(", "),
      combinedTotal: natural(values.combinedTotal ?? values.total),
    },
    decisiveCalculation: solver.equation,
    verification: `Independent weighted check gives ${solver.answer}`,
    finalContext: getAvg001QuestionEntry(parameters.questionLanguageId).finalContext,
  };
}

function answerWithUnit(entry: Cp004Entry, answer: string) {
  const grouped = entryUnit(entry) === "currency" ? groupIndianDigits(answer) : answer;
  switch (entryUnit(entry)) {
    case "currency": return `₹${grouped}`;
    case "marks": return `${grouped} marks`;
    case "kg": return `${grouped} kg`;
    case "years": return `${grouped} years`;
    case "units": return `${grouped} units`;
    case "runs": return `${grouped} runs`;
    case "kmh": return `${grouped} km/h`;
    case "unitsPerHour": return `${grouped} units per hour`;
    default: return grouped;
  }
}

function renderCp004Explanation(parameters: Avg001Parameters, solver: Avg001SolverResult) {
  const entry = getAvg001QuestionEntry(parameters.questionLanguageId) as Cp004Entry;
  const values = parameters.values;
  const counts = values.groupCounts ?? [];
  const averages = values.groupAverages ?? [];
  const totals = values.groupTotals ?? [];
  const combinedCount = values.combinedCount ?? values.count;
  const combinedAverage = values.combinedAverage ?? values.average;
  const combinedTotal = values.combinedTotal ?? values.total;
  const result = answerWithUnit(entry, solver.answer);
  switch (parameters.solveMode) {
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups": {
      const productText = averages.map((average, index) => `${natural(average)}\\times${counts[index]}`).join("+");
      return { lines: [
        "Convert each group average into its group total.",
        `The group totals are ${totals.map(natural).join(", ")}.`,
        `Add the totals and use the combined count ${combinedCount}.`,
        `$$(${productText})\\div${combinedCount}=${solver.answer}$$`,
        `Therefore, ${entry.finalContext} = ${result}.`,
      ] };
    }
    case "findGroupCountFromCombinedAverage": {
      const knownCount = values.knownGroupCount!;
      const knownAverage = values.knownGroupAverage!;
      const unknownAverage = values.unknownGroupAverage!;
      return { lines: [
        "The lower and higher group averages balance around the combined average.",
        `The known group has ${knownCount} members at average ${natural(knownAverage)}.`,
        "Use the two weighted deviations to find the unknown group size.",
        `$$${knownCount}\\times(${natural(combinedAverage)}-${natural(knownAverage)})\\div(${natural(unknownAverage)}-${natural(combinedAverage)})=${solver.answer}$$`,
        `Therefore, ${entry.finalContext} = ${solver.answer}.`,
      ] };
    }
    case "findMissingGroupAverage": {
      const knownCount = values.knownGroupCount!;
      const knownAverage = values.knownGroupAverage!;
      const unknownCount = values.unknownGroupCount!;
      const knownTotal = multiply(knownAverage, rational(knownCount));
      return { lines: [
        `The known group total is ${natural(knownAverage)} × ${knownCount} = ${natural(knownTotal)}.`,
        `The required combined total is ${natural(combinedAverage)} × ${combinedCount} = ${natural(combinedTotal)}.`,
        "The second group total is the difference between these totals.",
        `$$(${natural(combinedTotal)}-${natural(knownTotal)})\\div${unknownCount}=${solver.answer}$$`,
        `Therefore, ${entry.finalContext} = ${result}.`,
      ] };
    }
    case "findAverageSpeedEqualDistance": {
      const speed1 = values.speed1!;
      const speed2 = values.speed2!;
      return { lines: [
        "The two distances are equal, but the travel times are different.",
        "So the slower speed has more effect on the journey average.",
        "Use twice the product divided by the sum of the speeds.",
        `$$2\\times${natural(speed1)}\\times${natural(speed2)}\\div(${natural(speed1)}+${natural(speed2)})=${solver.answer}$$`,
        `Therefore, ${entry.finalContext} = ${result}.`,
      ] };
    }
    case "findAverageSpeedEqualTime": {
      const speed1 = values.speed1!;
      const speed2 = values.speed2!;
      return { lines: [
        "Both rates apply for the same amount of time.",
        "Therefore, the two rates have equal weight in the average.",
        "Add the rates and divide by two.",
        `$$(${natural(speed1)}+${natural(speed2)})\\div2=${solver.answer}$$`,
        `Therefore, ${entry.finalContext} = ${result}.`,
      ] };
    }
    default:
      throw new Error(`No CP-004 explanation for ${parameters.solveMode}`);
  }
}

function formatOption(value: Rational, policy: Avg001DisplayPolicy, canonical = false) {
  if (canonical) return formatRational(value, policy);
  if (policy === "EXACT_INTEGER") return String(Math.max(1, Math.round(toNumber(value))));
  if (policy === "EXACT_DECIMAL_1") return Math.max(0.1, toNumber(value)).toFixed(1);
  if (policy === "EXACT_DECIMAL_2") return Math.max(0.01, toNumber(value)).toFixed(2);
  return natural(value);
}

function generateOptions(parameters: Avg001Parameters, solver: Avg001SolverResult) {
  const values = parameters.values;
  const candidates: Rational[] = [];
  const step = entryUnit(getAvg001QuestionEntry(parameters.questionLanguageId) as Cp004Entry) === "currency" ? rational(500) : rational(1);
  switch (parameters.solveMode) {
    case "findCombinedAverageOfTwoGroups":
    case "findCombinedAverageOfThreeOrFourGroups": {
      const averages = values.groupAverages ?? [];
      candidates.push(divide(averages.reduce(add, rational(0)), rational(averages.length)));
      candidates.push(averages[0]!);
      if (averages[1]) candidates.push(averages[1]);
      break;
    }
    case "findGroupCountFromCombinedAverage":
      candidates.push(rational(values.knownGroupCount!), rational(values.unknownGroupCount! - 1), rational(values.unknownGroupCount! + 1), rational(values.unknownGroupCount! + 2));
      break;
    case "findMissingGroupAverage":
      candidates.push(values.combinedAverage!, values.knownGroupAverage!);
      break;
    case "findAverageSpeedEqualDistance":
      candidates.push(divide(add(values.speed1!, values.speed2!), rational(2)), values.speed1!, values.speed2!);
      break;
    case "findAverageSpeedEqualTime":
      candidates.push(divide(multiply(rational(2), multiply(values.speed1!, values.speed2!)), add(values.speed1!, values.speed2!)), values.speed1!, values.speed2!);
      break;
  }
  candidates.push(subtract(solver.exactAnswer, step), add(solver.exactAnswer, step), subtract(solver.exactAnswer, multiply(step, rational(2))), add(solver.exactAnswer, multiply(step, rational(2))));
  const canonical = formatOption(solver.exactAnswer, parameters.displayPolicy, true);
  const unique = [canonical];
  for (const candidate of candidates) {
    if (candidate.numerator <= 0) continue;
    const rendered = formatOption(candidate, parameters.displayPolicy);
    if (!unique.includes(rendered)) unique.push(rendered);
    if (unique.length === 4) break;
  }
  if (unique.length !== 4) throw new Error(`Insufficient CP-004 options for ${parameters.questionLanguageId}`);
  const shift = hash(`${parameters.seed}:cp004-options`) % 4;
  const options = [...unique];
  for (let index = 0; index < shift; index += 1) options.push(options.shift()!);
  return { options, correctIndex: options.indexOf(canonical) };
}

function buildFingerprint(parameters: Avg001Parameters, solver: Avg001SolverResult) {
  const values = parameters.values;
  return JSON.stringify({
    cpId: parameters.canonicalProblemId,
    solveMode: parameters.solveMode,
    scenarioVariant: parameters.scenarioVariant,
    groupCounts: values.groupCounts,
    groupAverages: values.groupAverages,
    combinedAverage: values.combinedAverage,
    speed1: values.speed1,
    speed2: values.speed2,
    answer: solver.exactAnswer,
  });
}

function validateCp004(pkg: Omit<Avg001QuestionPackage, "validation">) {
  const checks: Avg001ValidationCheck[] = [];
  const addCheck = (name: string, passed: boolean, message: string) => checks.push({ name, passed, message });
  const values = pkg.parameters.values;
  addCheck("language", pkg.language === "en", "CP-004 is English only");
  addCheck("cp-contract", pkg.canonicalProblemId === "AVG-CP-004", "Package belongs to CP-004");
  addCheck("resolved-stem", !/[{}]|undefined|NaN|Infinity|null/.test(pkg.stem), "Stem is fully resolved");
  addCheck("independent-verifier", pkg.independentVerification.supported && equals(pkg.solver.exactAnswer, pkg.independentVerification.exactAnswer) && pkg.answer === pkg.independentVerification.displayAnswer, "Independent verifier agrees exactly");
  addCheck("options", pkg.options.length === 4 && new Set(pkg.options).size === 4 && pkg.options[pkg.correctIndex] === pkg.answer, "Four unique options contain the answer once");
  addCheck("explanation", pkg.explanation.lines.length === 5 && pkg.explanation.lines.some((line) => line.includes(pkg.answer)), "Explanation has five concise lines and contains the answer");
  addCheck("maturity", pkg.maturity === "RUNTIME_PROOF" && !pkg.publiclyPublishable, "CP-004 remains unpublished");
  if (values.groupAverages?.length) {
    const numericAverages = values.groupAverages.map(toNumber);
    const numericCombined = toNumber(values.combinedAverage!);
    addCheck("weighted-bounds", numericCombined >= Math.min(...numericAverages) && numericCombined <= Math.max(...numericAverages), "Combined average lies between the group averages");
    addCheck("weighted-total", equals(values.groupTotals!.reduce(add, rational(0)), values.combinedTotal!), "Group totals add to the combined total");
  }
  if (values.speed1 && values.speed2) {
    const numericAnswer = toNumber(pkg.solver.exactAnswer);
    addCheck("speed-bounds", numericAnswer >= Math.min(toNumber(values.speed1), toNumber(values.speed2)) && numericAnswer <= Math.max(toNumber(values.speed1), toNumber(values.speed2)), "Average speed lies between the two speeds");
  }
  return { valid: checks.every((check) => check.passed), checks };
}

export function runAvg001Cp004Pipeline(input: { questionLanguageId: string; seed: string; language: Avg001Language }): Avg001QuestionPackage {
  const entry = getAvg001QuestionEntry(input.questionLanguageId);
  const parameters = constructParameters(input);
  const solver = solveCp004(parameters);
  const independentVerification = independentlyVerifyCp004(parameters);
  const reasoningEvidence = buildReasoningEvidence(parameters, solver);
  const explanation = renderCp004Explanation(parameters, solver);
  const stem = renderTemplate(entry.template, parameters.renderVariables);
  const { options, correctIndex } = generateOptions(parameters, solver);
  const mathematicalFingerprint = buildFingerprint(parameters, solver);
  const base = {
    packageId: AVG_001_PACKAGE_ID,
    archetypeId: AVG_001_PACKAGE_ID,
    canonicalProblemId: "AVG-CP-004" as const,
    questionLanguageId: entry.qlId,
    questionId: `AVG-001:${entry.qlId}:${input.seed}`,
    seed: input.seed,
    language: input.language,
    difficultyBand: entry.difficulty,
    taskKind: entry.taskKind,
    solveMode: entry.solveMode,
    stem,
    options,
    correctIndex,
    answer: solver.answer,
    parameters,
    solver,
    independentVerification,
    reasoningEvidence,
    explanation,
    maturity: "RUNTIME_PROOF" as const,
    publiclyPublishable: false,
    mathematicalFingerprint,
    traceability: {
      packageId: AVG_001_PACKAGE_ID,
      canonicalProblemId: "AVG-CP-004",
      questionLanguageId: entry.qlId,
      taskKind: entry.taskKind,
      solveMode: entry.solveMode,
      answerType: entry.answerType,
      contextDomain: entry.contextDomain,
      scenarioVariant: entry.scenarioVariant,
    },
  };
  const validation = validateCp004(base);
  if (!validation.valid) {
    throw new Error(validation.checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.message}`).join("\n"));
  }
  return { ...base, validation };
}
