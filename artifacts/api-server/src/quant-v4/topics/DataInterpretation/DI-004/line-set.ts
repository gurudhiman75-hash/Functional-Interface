import { hashSeed, pick, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di004Difficulty,
  Di004ExamProfile,
  Di004Explanation,
  Di004Option,
  Di004Question,
  Di004QuestionSet,
  Di004Stimulus,
  Di004TaskKind,
  Di004ValidationCheck,
} from "./types";

const PERIODS = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"] as const;
const BASE_POOL = [240, 260, 280, 300, 320, 340] as const;
const SCALE_POOL = [1, 2, 3] as const;
const CHANGE_POINT_POOL = [1, 2, 3, 4] as const;
const GAP_SHIFT_POOL = [0, 1, 2, 3, 4, 5] as const;
const GAP_MAGNITUDES = [10, 20, 30, 40, 50, 60] as const;
const A_TREND_PATTERNS = [
  [0, 30, 70, 60, 110, 150],
  [0, 40, 60, 100, 90, 140],
  [0, 20, 60, 100, 80, 130],
  [0, 50, 90, 70, 120, 160],
  [0, 30, 80, 120, 100, 170],
  [0, 60, 40, 100, 140, 180],
] as const;

const OPTION_COUNT_BY_PROFILE: Record<Di004ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di004TaskKind;
  difficulty: Di004Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di004Explanation;
  evidence: Readonly<Record<string, number>>;
}>;

function formatPercent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-004 received an invalid percentage fraction.");
  }
  const n = BigInt(numerator);
  const d = BigInt(denominator);
  const hundredths = (n * 10_000n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return `${whole}%`;
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}%`;
  return `${whole}.${String(fraction).padStart(2, "0")}%`;
}

function formatAverage(sum: number, count: number): string {
  if (!Number.isSafeInteger(sum) || !Number.isSafeInteger(count) || sum <= 0 || count <= 0) {
    throw new Error("DI-004 received an invalid average state.");
  }
  const n = BigInt(sum);
  const d = BigInt(count);
  const hundredths = (n * 100n + d / 2n) / d;
  const whole = hundredths / 100n;
  const fraction = Number(hundredths % 100n);
  if (fraction === 0) return String(whole);
  if (fraction % 10 === 0) return `${whole}.${fraction / 10}`;
  return `${whole}.${String(fraction).padStart(2, "0")}`;
}

function buildStimulus(seed: string): Di004Stimulus {
  const base = pick(seededRandom(`${seed}:base`), BASE_POOL);
  const scale = pick(seededRandom(`${seed}:scale`), SCALE_POOL);
  const trend = pick(seededRandom(`${seed}:trend`), A_TREND_PATTERNS);
  const changePoint = pick(seededRandom(`${seed}:change-point`), CHANGE_POINT_POOL);
  const gapShift = pick(seededRandom(`${seed}:gap-shift`), GAP_SHIFT_POOL);

  const points = PERIODS.map((period, index) => {
    const seriesA = base + trend[index]! * scale;
    const gap = GAP_MAGNITUDES[(index + gapShift) % GAP_MAGNITUDES.length]! * scale;
    const seriesB = index < changePoint ? seriesA + gap : seriesA - gap;
    if (seriesB <= 0) throw new Error("DI-004 generated a non-positive line value.");
    return { period, seriesA, seriesB };
  });

  return {
    kind: "LINE",
    title: "Quarterly online orders in Region A and Region B",
    instruction: "Study the line chart and answer the five questions that follow.",
    categories: PERIODS,
    series: [
      { id: "SERIES_A", label: "Region A" },
      { id: "SERIES_B", label: "Region B" },
    ],
    points,
    yAxisLabel: "Online orders",
    unit: "orders",
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di004Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({
    text: answer,
    misconceptionId: "CORRECT",
    derivation: "Exact recomputation from the shared DI-004 line-chart stimulus.",
  });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    throw new Error(`DI-004 could construct only ${retained.length} unique options; ${optionCount} are required.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-004 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function buildDrafts(seed: string, stimulus: Di004Stimulus): Draft[] {
  const points = stimulus.points;
  const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);

  const firstOvertakeIndex = points.findIndex((point, index) => index > 0 && point.seriesA > point.seriesB && points[index - 1]!.seriesA < points[index - 1]!.seriesB);
  if (firstOvertakeIndex < 1) throw new Error("DI-004 requires one explicit Region A overtake transition.");

  const gaps = points.map((point) => Math.abs(point.seriesA - point.seriesB));
  const minimumGap = Math.min(...gaps);
  const minimumGapIndex = gaps.indexOf(minimumGap);
  if (gaps.filter((gap) => gap === minimumGap).length !== 1) throw new Error("DI-004 requires a unique closest-lines period.");

  const increasingIntervals = points
    .slice(0, -1)
    .map((point, index) => ({ index, increase: points[index + 1]!.seriesA - point.seriesA }))
    .filter((entry) => entry.increase > 0);
  if (!increasingIntervals.length) throw new Error("DI-004 requires an increasing Region A interval.");
  const increaseInterval = pick(seededRandom(`${seed}:increase-interval`), increasingIntervals);
  const increaseFromIndex = increaseInterval.index;
  const increaseToIndex = increaseFromIndex + 1;
  const increaseFrom = points[increaseFromIndex]!.seriesA;
  const increaseTo = points[increaseToIndex]!.seriesA;
  const increaseDifference = increaseTo - increaseFrom;
  const increaseAnswer = formatPercent(increaseDifference, increaseFrom);
  const bIntervalDifference = Math.abs(points[increaseToIndex]!.seriesB - points[increaseFromIndex]!.seriesB);
  const bIntervalBase = points[increaseFromIndex]!.seriesB;

  const averageStart = pick(seededRandom(`${seed}:average-window`), [0, 1, 2, 3] as const);
  const averageIndexes = [averageStart, averageStart + 1, averageStart + 2] as const;
  const averageBValues = averageIndexes.map((index) => points[index]!.seriesB);
  const averageBSum = averageBValues.reduce((sum, value) => sum + value, 0);
  const averageBAnswer = formatAverage(averageBSum, 3);
  const averageASum = averageIndexes.reduce((sum, index) => sum + points[index]!.seriesA, 0);
  const totalWindowSum = averageIndexes.reduce((sum, index) => sum + points[index]!.seriesA + points[index]!.seriesB, 0);

  const bValues = points.map((point) => point.seriesB);
  const bMin = Math.min(...bValues);
  const bMax = Math.max(...bValues);
  const bRange = bMax - bMin;
  if (bRange <= 0) throw new Error("DI-004 requires a non-zero Region B range.");
  const bRangeAnswer = formatPercent(bRange, bMin);
  const aValues = points.map((point) => point.seriesA);
  const aMin = Math.min(...aValues);
  const aMax = Math.max(...aValues);
  const aRange = aMax - aMin;

  const overtakeWrongPeriods = PERIODS.filter((_, index) => index !== firstOvertakeIndex);
  const closestWrongPeriods = PERIODS.filter((_, index) => index !== minimumGapIndex);

  return [
    {
      kind: "FIRST_OVERTAKE_PERIOD",
      difficulty: "Medium",
      stem: "Region B was ahead initially. In which quarter did Region A first move above Region B?",
      answer: points[firstOvertakeIndex]!.period,
      candidates: overtakeWrongPeriods.map((period, index) => ({
        text: period,
        misconceptionId: `WRONG_OVERTAKE_PERIOD_${index + 1}`,
        derivation: `Selects ${period} without locating the first point after the two line series reverse order.`,
      })),
      explanation: {
        keyIdea: "An overtake occurs at the first plotted period where Region A is above Region B after being below it in the preceding period.",
        steps: [
          `In ${points[firstOvertakeIndex - 1]!.period}, Region A = ${points[firstOvertakeIndex - 1]!.seriesA} and Region B = ${points[firstOvertakeIndex - 1]!.seriesB}, so Region A is still lower.`,
          `In ${points[firstOvertakeIndex]!.period}, Region A = ${points[firstOvertakeIndex]!.seriesA} and Region B = ${points[firstOvertakeIndex]!.seriesB}, so Region A has moved above Region B for the first time.`,
        ],
        shortcut: "Scan the relative vertical order of the two lines from left to right; stop at the first reversal.",
        trap: "Do not choose the quarter with the largest gap. The question asks when the ordering first changes, not where the separation is greatest.",
      },
      evidence: { overtakeIndex: firstOvertakeIndex },
    },
    {
      kind: "CLOSEST_LINES_PERIOD",
      difficulty: "Medium",
      stem: "In which quarter were the numbers of online orders in Region A and Region B closest to each other?",
      answer: points[minimumGapIndex]!.period,
      candidates: closestWrongPeriods.map((period, index) => ({
        text: period,
        misconceptionId: `WRONG_CLOSEST_PERIOD_${index + 1}`,
        derivation: `Selects ${period} instead of comparing the absolute gap between the two plotted values in every quarter.`,
      })),
      explanation: {
        keyIdea: "The two lines are closest where the absolute difference between their values is the smallest.",
        steps: [
          `The six Region A–Region B gaps are ${gaps.join(", ")}.`,
          `The smallest gap is ${minimumGap}, occurring in ${points[minimumGapIndex]!.period}.`,
        ],
        shortcut: "Look for the visually narrowest vertical separation, then confirm it from the two values at that quarter.",
        trap: "A line crossing and the closest gap are not automatically the same thing; compare the actual vertical differences.",
      },
      evidence: { closestIndex: minimumGapIndex },
    },
    {
      kind: "CONSECUTIVE_PERCENT_INCREASE_A",
      difficulty: "Hard",
      stem: `By what percentage did Region A's online orders increase from ${points[increaseFromIndex]!.period} to ${points[increaseToIndex]!.period}?`,
      answer: increaseAnswer,
      candidates: [
        { text: formatPercent(increaseDifference, increaseTo), misconceptionId: "USE_NEW_VALUE_AS_BASE", derivation: "Divides the increase by the later Region A value instead of the earlier value." },
        { text: formatPercent(increaseTo, increaseFrom), misconceptionId: "REPORT_NEW_AS_PERCENT_OF_OLD", derivation: "Reports the later value as a percentage of the earlier value instead of the percentage increase." },
        { text: `${increaseDifference}%`, misconceptionId: "TREAT_ORDER_DIFFERENCE_AS_PERCENT", derivation: "Attaches a percent sign to the absolute increase in orders without dividing by the original value." },
        { text: formatPercent(bIntervalDifference, bIntervalBase), misconceptionId: "USE_REGION_B_INTERVAL", derivation: "Uses Region B's change over the same two quarters instead of Region A's change." },
        { text: formatPercent(increaseDifference, totalA), misconceptionId: "USE_FULL_SERIES_TOTAL_AS_BASE", derivation: "Divides one interval's increase by Region A's six-quarter total." },
        { text: formatPercent(increaseDifference, increaseFrom + increaseTo), misconceptionId: "USE_TWO_PERIOD_SUM_AS_BASE", derivation: "Uses the sum of the two Region A values as the percentage base." },
      ],
      explanation: {
        keyIdea: "For a consecutive-period percentage increase, the earlier Region A value is the comparison base.",
        steps: [
          `Increase = ${increaseTo} - ${increaseFrom} = ${increaseDifference}.`,
          `Percentage increase = ${increaseDifference}/${increaseFrom} × 100 = ${increaseAnswer}.`,
        ],
        shortcut: "On a time line, identify old and new values first; 'from X to Y' makes X the denominator.",
        trap: "Do not divide by the later value or switch to the other line just because both quarters are shown together.",
      },
      evidence: { fromIndex: increaseFromIndex, toIndex: increaseToIndex },
    },
    {
      kind: "THREE_PERIOD_AVERAGE_B",
      difficulty: "Hard",
      stem: `What was the average number of online orders in Region B from ${points[averageStart]!.period} through ${points[averageStart + 2]!.period}?`,
      answer: averageBAnswer,
      candidates: [
        { text: formatAverage(averageASum, 3), misconceptionId: "AVERAGE_REGION_A_INSTEAD", derivation: "Averages Region A over the same three quarters instead of Region B." },
        { text: String(averageBSum), misconceptionId: "USE_THREE_PERIOD_SUM", derivation: "Adds the three Region B values but forgets to divide by the number of quarters." },
        { text: formatAverage(averageBSum, 2), misconceptionId: "DIVIDE_BY_TWO", derivation: "Uses the correct three-quarter total but divides by 2 instead of 3." },
        { text: formatAverage(totalB, 6), misconceptionId: "USE_SIX_PERIOD_AVERAGE", derivation: "Calculates Region B's six-quarter average instead of the requested three-quarter window." },
        { text: formatAverage(totalWindowSum, 6), misconceptionId: "AVERAGE_BOTH_REGIONS", derivation: "Averages both regions across the three-quarter window instead of Region B alone." },
        { text: formatAverage(averageBValues[0]! + averageBValues[2]!, 2), misconceptionId: "IGNORE_MIDDLE_PERIOD", derivation: "Averages only the first and last Region B values and omits the middle quarter." },
      ],
      explanation: {
        keyIdea: "Read Region B at each of the three consecutive quarters, add those values, then divide by three.",
        steps: [
          `Region B values = ${averageBValues.join(", ")}; total = ${averageBValues.join(" + ")} = ${averageBSum}.`,
          `Average = ${averageBSum}/3 = ${averageBAnswer}.`,
        ],
        shortcut: "Trace only the Region B line across the requested window before doing any arithmetic; this prevents mixing the two series.",
        trap: "Do not use all six quarters or average both lines. The window and the series are both explicitly restricted.",
      },
      evidence: { startIndex: averageStart },
    },
    {
      kind: "B_RANGE_PERCENT_INCREASE",
      difficulty: "Hard",
      stem: "Region B's highest quarterly orders were what percentage higher than its lowest quarterly orders?",
      answer: bRangeAnswer,
      candidates: [
        { text: formatPercent(bRange, bMax), misconceptionId: "USE_MAXIMUM_AS_BASE", derivation: "Divides the Region B range by the maximum instead of the minimum comparison value." },
        { text: formatPercent(bMax, bMin), misconceptionId: "REPORT_MAX_AS_PERCENT_OF_MIN", derivation: "Reports the maximum as a percentage of the minimum rather than only how much higher it is." },
        { text: `${bRange}%`, misconceptionId: "TREAT_RANGE_AS_PERCENT", derivation: "Attaches a percent sign to the absolute Region B range without dividing by the minimum." },
        { text: formatPercent(bRange, totalB), misconceptionId: "USE_SERIES_TOTAL_AS_BASE", derivation: "Divides the highest-minus-lowest difference by Region B's six-quarter total." },
        { text: formatPercent(aRange, aMin), misconceptionId: "USE_REGION_A_RANGE", derivation: "Computes the highest-versus-lowest percentage for Region A instead of Region B." },
        { text: formatPercent(bRange, bMin + bMax), misconceptionId: "USE_EXTREME_SUM_AS_BASE", derivation: "Uses the sum of the two extreme values as the denominator instead of the minimum value." },
      ],
      explanation: {
        keyIdea: "For 'highest is what percent higher than lowest', subtract the lowest from the highest and divide by the lowest.",
        steps: [
          `Region B lowest = ${bMin}; highest = ${bMax}; difference = ${bRange}.`,
          `Percentage higher = ${bRange}/${bMin} × 100 = ${bRangeAnswer}.`,
        ],
        shortcut: "Identify the two vertical extremes of Region B first, then apply (high − low) / low.",
        trap: "The maximum is not the denominator for 'higher than the minimum'; the lower comparison value is the base.",
      },
      evidence: { minValue: bMin, maxValue: bMax },
    },
  ];
}

function validateSet(set: Omit<Di004QuestionSet, "validation">) {
  const checks: Di004ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("LINE_KIND", set.stimulus.kind === "LINE", "DI-004 must expose line-chart stimulus semantics.");
  add("SIX_PERIODS", set.stimulus.points.length === 6 && set.stimulus.categories.length === 6, "DI-004 requires six plotted periods.");
  add("POSITIVE_INTEGER_POINTS", set.stimulus.points.every((point) => Number.isSafeInteger(point.seriesA) && Number.isSafeInteger(point.seriesB) && point.seriesA > 0 && point.seriesB > 0), "Every plotted value must be a positive safe integer.");
  add("ORDER_REVERSAL", set.stimulus.points.some((point) => point.seriesA < point.seriesB) && set.stimulus.points.some((point) => point.seriesA > point.seriesB), "DI-004 requires both relative line orderings so an overtake is visible.");
  add("LINKED_QUESTION_COUNT", set.questions.length === 5, "DI-004 requires five linked child questions.");
  add("DISTINCT_TASK_KINDS", new Set(set.questions.map((question) => question.kind)).size === 5, "Each DI-004 child must test a distinct line-chart task.");
  add("SET_ID_PARITY", set.questions.every((question) => question.setId === set.setId), "Every child must retain the same line-chart parent set ID.");
  add("OPTION_COUNT", set.questions.every((question) => question.options.length === set.optionCount), `Every DI-004 child must expose ${set.optionCount} options.`);
  add("UNIQUE_OPTIONS", set.questions.every((question) => new Set(question.options).size === question.options.length), "Every line-chart child must have unique displayed options.");
  add("ONE_CORRECT", set.questions.every((question) => question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer), "Every child must have exactly one bound correct option.");
  add("EXPLANATION_SPECIFICITY", set.questions.every((question) => question.explanation.steps.length >= 2 && question.explanation.keyIdea.length > 35 && question.explanation.trap.length > 30), "Every DI-004 child requires a worked, question-specific explanation.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.publiclyPublishable, "DI-004 Phase 3 must remain review-only.");

  return { valid: checks.every((check) => check.passed), checks };
}

export function generateDi004LineSet(input: { seed?: string; examProfile?: Di004ExamProfile } = {}): Di004QuestionSet {
  const seed = input.seed ?? "DI-004:LINE:P3";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const stimulus = buildStimulus(seed);
  const drafts = buildDrafts(seed, stimulus);
  const setId = `DI-004-SET-${hashSeed(`${seed}:${examProfile}`).toString(36)}`;

  const questions = drafts.map((draft, index): Di004Question => {
    const questionId = `${setId}-Q${index + 1}`;
    const optionPackage = buildOptions(`${seed}:${examProfile}:${draft.kind}`, optionCount, draft.answer, draft.candidates);
    return {
      questionId,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stem: draft.stem,
      options: optionPackage.options,
      optionMetadata: optionPackage.optionMetadata,
      correctIndex: optionPackage.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation: Omit<Di004QuestionSet, "validation"> = {
    packageId: "DI-004",
    setId,
    seed,
    language: "en",
    examProfile,
    optionCount,
    setDifficulty: "LINE_TREND_MIXED",
    stimulus,
    questions,
    traceability: {
      packageId: "DI-004",
      representation: "LINE",
      parentFoundation: "DI-001",
      advancedTableSibling: "DI-002",
      groupedBarSibling: "DI-003",
      setContractVersion: "DI-004-SET-CONTRACT-V1",
      arithmeticAuthority: "EXACT_INTEGER_RATIONAL",
      reviewStatus: "UNREVIEWED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };

  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`DI-004 set validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}
