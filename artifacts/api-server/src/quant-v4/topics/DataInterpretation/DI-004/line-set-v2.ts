import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di004V2Difficulty,
  Di004V2ExamProfile,
  Di004V2Explanation,
  Di004V2LinePoint,
  Di004V2Option,
  Di004V2Question,
  Di004V2QuestionSet,
  Di004V2Stimulus,
  Di004V2TaskKind,
  Di004V2ValidationCheck,
} from "./line-v2-types";

const OPTION_COUNT_BY_PROFILE: Record<Di004V2ExamProfile, 4 | 5> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

const BASE_POOL = [360, 420, 480, 540, 600, 660] as const;
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

const CONTEXTS = [
  {
    id: "ANNUAL_SALES",
    title: "Annual sales of two companies",
    yAxisLabel: "Sales",
    unitLabel: "units",
    periodSets: [
      ["2018", "2019", "2020", "2021", "2022", "2023"],
      ["2019", "2020", "2021", "2022", "2023", "2024"],
      ["2020", "2021", "2022", "2023", "2024", "2025"],
    ],
    seriesPairs: [
      ["Company A", "Company B"], ["Company P", "Company Q"], ["Firm A", "Firm B"], ["Firm P", "Firm Q"],
      ["Brand A", "Brand B"], ["Brand P", "Brand Q"], ["Store A", "Store B"], ["Store P", "Store Q"],
      ["Division A", "Division B"], ["Division P", "Division Q"], ["Enterprise A", "Enterprise B"], ["Enterprise P", "Enterprise Q"],
    ],
  },
  {
    id: "ANNUAL_PRODUCTION",
    title: "Annual production of two manufacturing units",
    yAxisLabel: "Production",
    unitLabel: "units",
    periodSets: [
      ["2018", "2019", "2020", "2021", "2022", "2023"],
      ["2019", "2020", "2021", "2022", "2023", "2024"],
      ["2020", "2021", "2022", "2023", "2024", "2025"],
    ],
    seriesPairs: [
      ["Factory A", "Factory B"], ["Factory P", "Factory Q"], ["Plant A", "Plant B"], ["Plant P", "Plant Q"],
      ["Unit A", "Unit B"], ["Unit P", "Unit Q"], ["Workshop A", "Workshop B"], ["Workshop P", "Workshop Q"],
      ["Production Unit A", "Production Unit B"], ["Production Unit P", "Production Unit Q"], ["Plant X", "Plant Y"], ["Factory X", "Factory Y"],
    ],
  },
  {
    id: "MONTHLY_ORDERS",
    title: "Monthly orders received by two sellers",
    yAxisLabel: "Orders",
    unitLabel: "orders",
    periodSets: [
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ],
    seriesPairs: [
      ["Seller A", "Seller B"], ["Seller P", "Seller Q"], ["Store A", "Store B"], ["Store P", "Store Q"],
      ["Portal A", "Portal B"], ["Portal P", "Portal Q"], ["Outlet A", "Outlet B"], ["Outlet P", "Outlet Q"],
      ["Platform A", "Platform B"], ["Platform P", "Platform Q"], ["Website A", "Website B"], ["Website P", "Website Q"],
    ],
  },
  {
    id: "ANNUAL_ENROLMENT",
    title: "Annual enrolment in two institutes",
    yAxisLabel: "Students enrolled",
    unitLabel: "students",
    periodSets: [
      ["2018", "2019", "2020", "2021", "2022", "2023"],
      ["2019", "2020", "2021", "2022", "2023", "2024"],
      ["2020", "2021", "2022", "2023", "2024", "2025"],
    ],
    seriesPairs: [
      ["Institute A", "Institute B"], ["Institute P", "Institute Q"], ["College A", "College B"], ["College P", "College Q"],
      ["Academy A", "Academy B"], ["Academy P", "Academy Q"], ["Centre A", "Centre B"], ["Centre P", "Centre Q"],
      ["Campus A", "Campus B"], ["Campus P", "Campus Q"], ["School A", "School B"], ["School P", "School Q"],
    ],
  },
  {
    id: "ANNUAL_EXPORTS",
    title: "Annual exports of two firms",
    yAxisLabel: "Exports",
    unitLabel: "tonnes",
    periodSets: [
      ["2018", "2019", "2020", "2021", "2022", "2023"],
      ["2019", "2020", "2021", "2022", "2023", "2024"],
      ["2020", "2021", "2022", "2023", "2024", "2025"],
    ],
    seriesPairs: [
      ["Firm A", "Firm B"], ["Firm P", "Firm Q"], ["Company A", "Company B"], ["Company P", "Company Q"],
      ["Exporter A", "Exporter B"], ["Exporter P", "Exporter Q"], ["Group A", "Group B"], ["Group P", "Group Q"],
      ["Enterprise A", "Enterprise B"], ["Enterprise P", "Enterprise Q"], ["Business A", "Business B"], ["Business P", "Business Q"],
    ],
  },
  {
    id: "MONTHLY_PASSENGERS",
    title: "Monthly passengers carried by two services",
    yAxisLabel: "Passengers",
    unitLabel: "passengers",
    periodSets: [
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
      ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    ],
    seriesPairs: [
      ["Service A", "Service B"], ["Service P", "Service Q"], ["Route A", "Route B"], ["Route P", "Route Q"],
      ["Operator A", "Operator B"], ["Operator P", "Operator Q"], ["Line A", "Line B"], ["Line P", "Line Q"],
      ["Network A", "Network B"], ["Network P", "Network Q"], ["Carrier A", "Carrier B"], ["Carrier P", "Carrier Q"],
    ],
  },
] as const;

const EASY_KINDS: readonly Di004V2TaskKind[] = [
  "CROSS_SERIES_DIFFERENCE",
  "COMBINED_PERIOD_TOTAL",
];

const MEDIUM_KINDS: readonly Di004V2TaskKind[] = [
  "FIRST_OVERTAKE_PERIOD",
  "CLOSEST_LINES_PERIOD",
  "THREE_PERIOD_AVERAGE",
  "CONSECUTIVE_PERCENT_INCREASE",
  "TWO_PERIOD_SERIES_RATIO",
  "TWO_PERIOD_COMBINED_TOTAL",
];

const HARD_KINDS: readonly Di004V2TaskKind[] = [
  "TOTAL_SERIES_RATIO",
  "COMBINED_PERIOD_PERCENT_EXCESS",
  "TOTAL_SERIES_PERCENT_EXCESS",
  "THREE_VS_THREE_RATIO",
];

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;

type Draft = Readonly<{
  kind: Di004V2TaskKind;
  difficulty: Di004V2Difficulty;
  stemSurfaceId: "S1" | "S2" | "S3";
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di004V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
}>;

function nearestWholePercent(numerator: number, denominator: number): number {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-004 V2 received an invalid percentage fraction.");
  }
  return Math.round((numerator * 100) / denominator);
}

function nearestWholeAverage(sum: number, count: number): number {
  if (!Number.isSafeInteger(sum) || !Number.isSafeInteger(count) || sum <= 0 || count <= 0) {
    throw new Error("DI-004 V2 received an invalid average state.");
  }
  return Math.round(sum / count);
}

function surface(seed: string, variants: readonly [string, string, string]) {
  const index = pick(seededRandom(seed), [0, 1, 2] as const);
  return {
    stemSurfaceId: (`S${index + 1}`) as "S1" | "S2" | "S3",
    stem: variants[index],
  };
}

function buildStimulus(seed: string): Di004V2Stimulus {
  const context = pick(seededRandom(`${seed}:context`), CONTEXTS);
  const pair = pick(seededRandom(`${seed}:series-pair`), context.seriesPairs);
  const periods = pick(seededRandom(`${seed}:periods`), context.periodSets);
  const base = pick(seededRandom(`${seed}:base`), BASE_POOL);
  const scale = pick(seededRandom(`${seed}:scale`), SCALE_POOL);
  const trend = pick(seededRandom(`${seed}:trend`), A_TREND_PATTERNS);

  let points: Di004V2LinePoint[] = [];
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const changePoint = pick(seededRandom(`${seed}:change-point:${attempt}`), CHANGE_POINT_POOL);
    const gapShift = pick(seededRandom(`${seed}:gap-shift:${attempt}`), GAP_SHIFT_POOL);
    const candidate = periods.map((period, index): Di004V2LinePoint => {
      const seriesA = base + trend[index]! * scale;
      const gap = GAP_MAGNITUDES[(index + gapShift) % GAP_MAGNITUDES.length]! * scale;
      const seriesB = index < changePoint ? seriesA + gap : seriesA - gap;
      return { period, seriesA, seriesB };
    });
    const totalA = candidate.reduce((sum, point) => sum + point.seriesA, 0);
    const totalB = candidate.reduce((sum, point) => sum + point.seriesB, 0);
    if (candidate.every((point) => point.seriesA > 0 && point.seriesB > 0) && totalA !== totalB) {
      points = candidate;
      break;
    }
  }

  if (points.length !== 6) throw new Error("DI-004 V2 could not construct a valid non-trivial line stimulus.");

  return {
    kind: "LINE",
    contextId: context.id,
    title: `${context.title}: ${pair[0]} and ${pair[1]}`,
    instruction: "Study the line graph and answer the questions that follow.",
    categories: [...periods],
    series: [
      { id: "SERIES_A", label: pair[0] },
      { id: "SERIES_B", label: pair[1] },
    ],
    points,
    yAxisLabel: context.yAxisLabel,
    unitLabel: context.unitLabel,
  };
}

function buildOptions(seed: string, optionCount: 4 | 5, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Di004V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared DI-004 V2 line stimulus." });
  candidates.forEach(add);

  if (retained.length < optionCount) {
    const numeric = answer.match(/^(\\d+)$/u);
    const percent = answer.match(/^(\\d+)%$/u);
    const ratio = answer.match(/^(\\d+):(\\d+)$/u);

    if (numeric) {
      const value = Number(numeric[1]);
      const step = Math.max(10, Math.round(value / 10 / 10) * 10);
      for (const multiplier of [-3, -2, -1, 1, 2, 3, 4]) {
        const distractor = value + multiplier * step;
        if (distractor <= 0) continue;
        add({
          text: String(distractor),
          misconceptionId: multiplier > 0 ? `SCALE_HIGH_${multiplier}` : `SCALE_LOW_${Math.abs(multiplier)}`,
          derivation: "Uses a nearby arithmetic result after a common aggregation or subtraction error.",
        });
      }
    } else if (percent) {
      const value = Number(percent[1]);
      for (const delta of [-20, -15, -10, -5, 5, 10, 15, 20]) {
        const distractor = value + delta;
        if (distractor <= 0) continue;
        add({
          text: `${distractor}%`,
          misconceptionId: delta > 0 ? `PERCENT_HIGH_${delta}` : `PERCENT_LOW_${Math.abs(delta)}`,
          derivation: "Uses a nearby percentage after a base-value or rounding error.",
        });
      }
    } else if (ratio) {
      const left = Number(ratio[1]);
      const right = Number(ratio[2]);
      for (let delta = 1; delta <= 6; delta += 1) {
        add({ text: ratioDisplay(left + delta, right), misconceptionId: `RATIO_LEFT_${delta}`, derivation: "Perturbs the first subtotal before simplifying the ratio." });
        add({ text: ratioDisplay(left, right + delta), misconceptionId: `RATIO_RIGHT_${delta}`, derivation: "Perturbs the second subtotal before simplifying the ratio." });
      }
    }
  }

  if (retained.length < optionCount) {
    throw new Error(`DI-004 V2 could construct only ${retained.length} unique options for answer ${answer}.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-004 V2 lost the correct option during deterministic shuffling.");

  return {
    options: shuffled.map((option) => option.text),
    optionMetadata: shuffled,
    correctIndex,
  };
}

function pair(seed: string, values: readonly (readonly [number, number])[]) {
  return pick(seededRandom(seed), values);
}

function buildAllDrafts(seed: string, stimulus: Di004V2Stimulus): Draft[] {
  const points = stimulus.points;
  const labelA = stimulus.series[0].label;
  const labelB = stimulus.series[1].label;
  const valuesA = points.map((point) => point.seriesA);
  const valuesB = points.map((point) => point.seriesB);
  const totalA = valuesA.reduce((sum, value) => sum + value, 0);
  const totalB = valuesB.reduce((sum, value) => sum + value, 0);

  const targetIndex = pick(seededRandom(`${seed}:easy-period`), [0, 1, 2, 3, 4, 5] as const);
  const crossDifference = Math.abs(valuesA[targetIndex]! - valuesB[targetIndex]!);
  const combinedAtTarget = valuesA[targetIndex]! + valuesB[targetIndex]!;

  const firstOvertakeIndex = points.findIndex((point, index) =>
    index > 0 && point.seriesA > point.seriesB && points[index - 1]!.seriesA < points[index - 1]!.seriesB,
  );
  if (firstOvertakeIndex < 1) throw new Error("DI-004 V2 requires one explicit overtake transition.");

  const gaps = points.map((point) => Math.abs(point.seriesA - point.seriesB));
  const minimumGap = Math.min(...gaps);
  const closestIndex = gaps.indexOf(minimumGap);
  if (gaps.filter((gap) => gap === minimumGap).length !== 1) throw new Error("DI-004 V2 requires a unique closest-lines period.");

  const averageSeries = pick(seededRandom(`${seed}:average-series`), ["A", "B"] as const);
  const averageStart = pick(seededRandom(`${seed}:average-window`), [0, 1, 2, 3] as const);
  const averageIndexes = [averageStart, averageStart + 1, averageStart + 2] as const;
  const averageValues = averageIndexes.map((index) => averageSeries === "A" ? valuesA[index]! : valuesB[index]!);
  const averageSum = averageValues.reduce((sum, value) => sum + value, 0);
  const averageAnswer = nearestWholeAverage(averageSum, 3);
  const otherAverageValues = averageIndexes.map((index) => averageSeries === "A" ? valuesB[index]! : valuesA[index]!);
  const otherAverageAnswer = nearestWholeAverage(otherAverageValues.reduce((sum, value) => sum + value, 0), 3);
  const averageLabel = averageSeries === "A" ? labelA : labelB;

  const increaseSeries = pick(seededRandom(`${seed}:increase-series`), ["A", "B"] as const);
  const increaseValues = increaseSeries === "A" ? valuesA : valuesB;
  const increaseLabel = increaseSeries === "A" ? labelA : labelB;
  const increasingIntervals = [0, 1, 2, 3, 4].filter((index) => increaseValues[index + 1]! > increaseValues[index]!);
  if (!increasingIntervals.length) throw new Error("DI-004 V2 requires an increasing interval.");
  const increaseFromIndex = pick(seededRandom(`${seed}:increase-interval`), increasingIntervals);
  const increaseToIndex = increaseFromIndex + 1;
  const increaseFrom = increaseValues[increaseFromIndex]!;
  const increaseTo = increaseValues[increaseToIndex]!;
  const increaseDifference = increaseTo - increaseFrom;
  const increaseAnswer = nearestWholePercent(increaseDifference, increaseFrom);

  const periodPairs = [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 3], [2, 4], [2, 5],
    [3, 4], [3, 5], [4, 5],
  ] as const;

  const ratioPair = shuffle(seededRandom(`${seed}:two-period-ratio`), periodPairs).find(([first, second]) =>
    valuesA[first]! + valuesA[second]! !== valuesB[first]! + valuesB[second]!,
  );
  if (!ratioPair) throw new Error("DI-004 V2 could not find a non-trivial two-period series ratio.");
  const [ratioP1, ratioP2] = ratioPair;
  const ratioASubtotal = valuesA[ratioP1]! + valuesA[ratioP2]!;
  const ratioBSubtotal = valuesB[ratioP1]! + valuesB[ratioP2]!;
  const twoPeriodRatioAnswer = ratioDisplay(ratioASubtotal, ratioBSubtotal);

  const totalPair = pair(`${seed}:four-value-total`, periodPairs);
  const [totalP1, totalP2] = totalPair;
  const fourValueTotal = valuesA[totalP1]! + valuesB[totalP1]! + valuesA[totalP2]! + valuesB[totalP2]!;

  const totalSeriesRatio = ratioDisplay(totalA, totalB);

  const combinedTotals = points.map((point) => point.seriesA + point.seriesB);
  const percentPair = shuffle(seededRandom(`${seed}:combined-percent-pair`), periodPairs).find(([first, second]) =>
    combinedTotals[first]! !== combinedTotals[second]!,
  );
  if (!percentPair) throw new Error("DI-004 V2 could not find two periods with different combined totals.");
  const [percentP1, percentP2] = percentPair;
  const largerCombinedIndex = combinedTotals[percentP1]! > combinedTotals[percentP2]! ? percentP1 : percentP2;
  const smallerCombinedIndex = largerCombinedIndex === percentP1 ? percentP2 : percentP1;
  const combinedDifference = combinedTotals[largerCombinedIndex]! - combinedTotals[smallerCombinedIndex]!;
  const combinedPercentAnswer = nearestWholePercent(combinedDifference, combinedTotals[smallerCombinedIndex]!);

  const largerSeries = totalA > totalB ? "A" : "B";
  const largerSeriesTotal = Math.max(totalA, totalB);
  const smallerSeriesTotal = Math.min(totalA, totalB);
  const totalDifference = largerSeriesTotal - smallerSeriesTotal;
  const totalPercentAnswer = nearestWholePercent(totalDifference, smallerSeriesTotal);
  const largerSeriesLabel = largerSeries === "A" ? labelA : labelB;
  const smallerSeriesLabel = largerSeries === "A" ? labelB : labelA;

  const groupCandidates = [
    { a: [0, 1, 2] as const, b: [3, 4, 5] as const },
    { a: [3, 4, 5] as const, b: [0, 1, 2] as const },
    { a: [0, 2, 4] as const, b: [1, 3, 5] as const },
    { a: [1, 3, 5] as const, b: [0, 2, 4] as const },
  ];
  const grouping = shuffle(seededRandom(`${seed}:three-vs-three`), groupCandidates).find((candidate) => {
    const left = candidate.a.reduce((sum, index) => sum + valuesA[index]!, 0);
    const right = candidate.b.reduce((sum, index) => sum + valuesB[index]!, 0);
    return left !== right;
  });
  if (!grouping) throw new Error("DI-004 V2 could not find a non-trivial three-versus-three ratio.");
  const groupAValue = grouping.a.reduce((sum, index) => sum + valuesA[index]!, 0);
  const groupBValue = grouping.b.reduce((sum, index) => sum + valuesB[index]!, 0);
  const threeVsThreeAnswer = ratioDisplay(groupAValue, groupBValue);
  const groupAPeriods = grouping.a.map((index) => points[index]!.period);
  const groupBPeriods = grouping.b.map((index) => points[index]!.period);

  const diffSurface = surface(`${seed}:CROSS_SERIES_DIFFERENCE:surface`, [
    `What is the difference between ${labelA} and ${labelB} in ${points[targetIndex]!.period}?`,
    `By how much did the values of ${labelA} and ${labelB} differ in ${points[targetIndex]!.period}?`,
    `Find the absolute difference between the two series for ${points[targetIndex]!.period}.`,
  ]);

  const combinedSurface = surface(`${seed}:COMBINED_PERIOD_TOTAL:surface`, [
    `What was the combined value of ${labelA} and ${labelB} in ${points[targetIndex]!.period}?`,
    `Find the total for both series together in ${points[targetIndex]!.period}.`,
    `In ${points[targetIndex]!.period}, what is the sum of the values shown for ${labelA} and ${labelB}?`,
  ]);

  const overtakeSurface = surface(`${seed}:FIRST_OVERTAKE_PERIOD:surface`, [
    `${labelB} was higher initially. In which period did ${labelA} first move above ${labelB}?`,
    `From left to right, when did ${labelA} first overtake ${labelB}?`,
    `Identify the first period in which ${labelA} became greater than ${labelB} after being lower in the previous period.`,
  ]);

  const closestSurface = surface(`${seed}:CLOSEST_LINES_PERIOD:surface`, [
    `In which period were the values of ${labelA} and ${labelB} closest to each other?`,
    `For which period was the gap between the two series the smallest?`,
    `At what point on the graph is the absolute difference between ${labelA} and ${labelB} minimum?`,
  ]);

  const averageSurface = surface(`${seed}:THREE_PERIOD_AVERAGE:surface`, [
    `What was the average value of ${averageLabel} from ${points[averageStart]!.period} through ${points[averageStart + 2]!.period}? Give the nearest whole number.`,
    `Find the average for ${averageLabel} over ${points[averageStart]!.period}, ${points[averageStart + 1]!.period} and ${points[averageStart + 2]!.period}, to the nearest whole number.`,
    `To the nearest whole number, what is the mean of ${averageLabel}'s values in the three periods from ${points[averageStart]!.period} to ${points[averageStart + 2]!.period}?`,
  ]);

  const increaseSurface = surface(`${seed}:CONSECUTIVE_PERCENT_INCREASE:surface`, [
    `By what percentage did ${increaseLabel} increase from ${points[increaseFromIndex]!.period} to ${points[increaseToIndex]!.period}? Give the nearest whole percent.`,
    `The value for ${increaseLabel} rose between ${points[increaseFromIndex]!.period} and ${points[increaseToIndex]!.period}. What was the percentage increase, to the nearest whole percent?`,
    `Taking ${points[increaseFromIndex]!.period} as the base, by what percentage did ${increaseLabel} increase in ${points[increaseToIndex]!.period}? Round to the nearest whole percent.`,
  ]);

  const twoPeriodRatioSurface = surface(`${seed}:TWO_PERIOD_SERIES_RATIO:surface`, [
    `What is the ratio of the combined ${labelA} values for ${points[ratioP1]!.period} and ${points[ratioP2]!.period} to the combined ${labelB} values for the same two periods?`,
    `Add ${labelA} across ${points[ratioP1]!.period} and ${points[ratioP2]!.period}, and do the same for ${labelB}. What is the ratio of the two totals?`,
    `For ${points[ratioP1]!.period} and ${points[ratioP2]!.period} together, find ${labelA} : ${labelB}.`,
  ]);

  const fourValueSurface = surface(`${seed}:TWO_PERIOD_COMBINED_TOTAL:surface`, [
    `What is the total of both series together for ${points[totalP1]!.period} and ${points[totalP2]!.period}?`,
    `Find the combined ${labelA} and ${labelB} value across ${points[totalP1]!.period} and ${points[totalP2]!.period}.`,
    `Adding all four plotted values for ${points[totalP1]!.period} and ${points[totalP2]!.period}, what total is obtained?`,
  ]);

  const totalRatioSurface = surface(`${seed}:TOTAL_SERIES_RATIO:surface`, [
    `What is the ratio of the six-period total for ${labelA} to the six-period total for ${labelB}?`,
    `Find ${labelA} : ${labelB} after adding all six periods for each series.`,
    `The totals of ${labelA} and ${labelB} over the entire graph are in what ratio?`,
  ]);

  const combinedPercentSurface = surface(`${seed}:COMBINED_PERIOD_PERCENT_EXCESS:surface`, [
    `The combined value of both series in ${points[largerCombinedIndex]!.period} was what percent higher than in ${points[smallerCombinedIndex]!.period}? Give the nearest whole percent.`,
    `By what percentage did the two-series total in ${points[largerCombinedIndex]!.period} exceed the two-series total in ${points[smallerCombinedIndex]!.period}, to the nearest whole percent?`,
    `Taking the combined value in ${points[smallerCombinedIndex]!.period} as the base, how much higher was the combined value in ${points[largerCombinedIndex]!.period}, in percentage terms?`,
  ]);

  const totalPercentSurface = surface(`${seed}:TOTAL_SERIES_PERCENT_EXCESS:surface`, [
    `Over all six periods, ${largerSeriesLabel}'s total was what percent higher than ${smallerSeriesLabel}'s total? Give the nearest whole percent.`,
    `By what percentage did the six-period total of ${largerSeriesLabel} exceed that of ${smallerSeriesLabel}? Round to the nearest whole percent.`,
    `Taking ${smallerSeriesLabel}'s six-period total as the base, find the percentage excess of ${largerSeriesLabel}'s total.`,
  ]);

  const groupRatioSurface = surface(`${seed}:THREE_VS_THREE_RATIO:surface`, [
    `What is the ratio of ${labelA}'s total for ${groupAPeriods.join(", ")} to ${labelB}'s total for ${groupBPeriods.join(", ")}?`,
    `Add ${labelA} over ${groupAPeriods.join(", ")} and ${labelB} over ${groupBPeriods.join(", ")}. Find the ratio of these totals.`,
    `The sum of ${labelA} for ${groupAPeriods.join(", ")} is in what ratio to the sum of ${labelB} for ${groupBPeriods.join(", ")}?`,
  ]);

  return [
    {
      kind: "CROSS_SERIES_DIFFERENCE",
      difficulty: "Easy",
      ...diffSurface,
      answer: String(crossDifference),
      candidates: [
        { text: String(combinedAtTarget), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two values instead of finding their difference." },
        { text: String(valuesA[targetIndex]!), misconceptionId: "USE_SERIES_A_ONLY", derivation: "Uses only the first series value." },
        { text: String(valuesB[targetIndex]!), misconceptionId: "USE_SERIES_B_ONLY", derivation: "Uses only the second series value." },
        ...gaps.map((gap, index) => ({ gap, index })).filter(({ index }) => index !== targetIndex).map(({ gap, index }) => ({
          text: String(gap), misconceptionId: `USE_GAP_PERIOD_${index + 1}`, derivation: `Uses the gap from ${points[index]!.period} instead of the requested period.`,
        })),
      ],
      explanation: {
        keyIdea: "Read both series for the same period and subtract the smaller value from the larger value.",
        steps: [
          `${labelA} = ${valuesA[targetIndex]}; ${labelB} = ${valuesB[targetIndex]}.`,
          `Difference = |${valuesA[targetIndex]} - ${valuesB[targetIndex]}| = ${crossDifference}.`,
        ],
      },
      evidence: { targetIndex },
    },
    {
      kind: "COMBINED_PERIOD_TOTAL",
      difficulty: "Easy",
      ...combinedSurface,
      answer: String(combinedAtTarget),
      candidates: [
        { text: String(crossDifference), misconceptionId: "SUBTRACT_INSTEAD_OF_ADD", derivation: "Finds the difference instead of the combined total." },
        { text: String(valuesA[targetIndex]!), misconceptionId: "USE_SERIES_A_ONLY", derivation: "Uses only the first series value." },
        { text: String(valuesB[targetIndex]!), misconceptionId: "USE_SERIES_B_ONLY", derivation: "Uses only the second series value." },
        { text: String(combinedTotals[(targetIndex + 1) % 6]!), misconceptionId: "USE_ADJACENT_PERIOD_TOTAL", derivation: "Uses the combined total from a different period." },
        { text: String(totalA), misconceptionId: "USE_FULL_SERIES_A_TOTAL", derivation: "Uses the six-period total of the first series." },
      ],
      explanation: {
        keyIdea: "Add the two plotted values for the requested period.",
        steps: [
          `${labelA} = ${valuesA[targetIndex]} and ${labelB} = ${valuesB[targetIndex]}.`,
          `Combined value = ${valuesA[targetIndex]} + ${valuesB[targetIndex]} = ${combinedAtTarget}.`,
        ],
      },
      evidence: { targetIndex },
    },
    {
      kind: "FIRST_OVERTAKE_PERIOD",
      difficulty: "Medium",
      ...overtakeSurface,
      answer: points[firstOvertakeIndex]!.period,
      candidates: points.filter((_, index) => index !== firstOvertakeIndex).map((point, index) => ({
        text: point.period, misconceptionId: `WRONG_OVERTAKE_${index + 1}`, derivation: "Chooses another plotted period without locating the first reversal in line order.",
      })),
      explanation: {
        keyIdea: "Find the first period where the first series becomes higher after being lower in the immediately preceding period.",
        steps: [
          `In ${points[firstOvertakeIndex - 1]!.period}, ${labelA} = ${valuesA[firstOvertakeIndex - 1]} and ${labelB} = ${valuesB[firstOvertakeIndex - 1]}, so ${labelA} is lower.`,
          `In ${points[firstOvertakeIndex]!.period}, ${labelA} = ${valuesA[firstOvertakeIndex]} and ${labelB} = ${valuesB[firstOvertakeIndex]}, so ${labelA} has moved above ${labelB} for the first time.`,
        ],
      },
      evidence: { overtakeIndex: firstOvertakeIndex },
    },
    {
      kind: "CLOSEST_LINES_PERIOD",
      difficulty: "Medium",
      ...closestSurface,
      answer: points[closestIndex]!.period,
      candidates: points.filter((_, index) => index !== closestIndex).map((point, index) => ({
        text: point.period, misconceptionId: `WRONG_CLOSEST_${index + 1}`, derivation: "Chooses another period instead of comparing the absolute gap across all six periods.",
      })),
      explanation: {
        keyIdea: "Compare the absolute difference between the two series in every period and select the smallest gap.",
        steps: [
          `The six gaps are ${gaps.join(", ")}.`,
          `The smallest gap is ${minimumGap}, which occurs in ${points[closestIndex]!.period}.`,
        ],
        workingTable: {
          headers: ["Period", "Gap"],
          rows: points.map((point, index) => [point.period, String(gaps[index]!)]),
        },
      },
      evidence: { closestIndex },
    },
    {
      kind: "THREE_PERIOD_AVERAGE",
      difficulty: "Medium",
      ...averageSurface,
      answer: String(averageAnswer),
      candidates: [
        { text: String(averageSum), misconceptionId: "USE_SUM_NOT_AVERAGE", derivation: "Adds the three values but does not divide by three." },
        { text: String(nearestWholeAverage(averageSum, 2)), misconceptionId: "DIVIDE_BY_TWO", derivation: "Divides the three-period total by two instead of three." },
        { text: String(nearestWholeAverage(averageSum, 4)), misconceptionId: "DIVIDE_BY_FOUR", derivation: "Divides the three-period total by four instead of three." },
        { text: String(otherAverageAnswer), misconceptionId: "AVERAGE_OTHER_SERIES", derivation: "Averages the other line over the same periods." },
        { text: String(nearestWholeAverage(averageValues[0]! + averageValues[2]!, 2)), misconceptionId: "IGNORE_MIDDLE_PERIOD", derivation: "Averages only the first and last periods." },
      ],
      explanation: {
        keyIdea: "Add the three requested values from the same series and divide by three.",
        steps: [
          `${averageLabel} values = ${averageValues.join(", ")}; total = ${averageSum}.`,
          `Average = ${averageSum}/3 ≈ ${averageAnswer} to the nearest whole number.`,
        ],
      },
      evidence: { startIndex: averageStart, seriesCode: averageSeries },
    },
    {
      kind: "CONSECUTIVE_PERCENT_INCREASE",
      difficulty: "Medium",
      ...increaseSurface,
      answer: `${increaseAnswer}%`,
      candidates: [
        { text: `${nearestWholePercent(increaseDifference, increaseTo)}%`, misconceptionId: "USE_NEW_VALUE_AS_BASE", derivation: "Uses the later value as the percentage base." },
        { text: `${nearestWholePercent(increaseTo, increaseFrom)}%`, misconceptionId: "REPORT_NEW_AS_PERCENT_OF_OLD", derivation: "Reports the full later value relative to the earlier value." },
        { text: `${nearestWholePercent(increaseDifference, increaseFrom + increaseTo)}%`, misconceptionId: "USE_PAIR_SUM_AS_BASE", derivation: "Uses the two-period sum as the base." },
        { text: `${nearestWholePercent(increaseDifference, totalA + totalB)}%`, misconceptionId: "USE_GRAPH_TOTAL_AS_BASE", derivation: "Uses the whole graph total as the percentage base." },
        { text: `${Math.abs(valuesA[increaseFromIndex]! - valuesB[increaseFromIndex]!)}%`, misconceptionId: "USE_LINE_GAP_AS_PERCENT", derivation: "Uses the cross-series gap instead of the time-series increase." },
      ],
      explanation: {
        keyIdea: "For a percentage increase, subtract the earlier value from the later value and divide by the earlier value.",
        steps: [
          `Increase = ${increaseTo} - ${increaseFrom} = ${increaseDifference}.`,
          `Percentage increase = ${increaseDifference}/${increaseFrom} × 100 ≈ ${increaseAnswer}%.`,
        ],
      },
      evidence: { fromIndex: increaseFromIndex, toIndex: increaseToIndex, seriesCode: increaseSeries },
    },
    {
      kind: "TWO_PERIOD_SERIES_RATIO",
      difficulty: "Medium",
      ...twoPeriodRatioSurface,
      answer: twoPeriodRatioAnswer,
      candidates: [
        { text: ratioDisplay(ratioBSubtotal, ratioASubtotal), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the two series totals." },
        { text: ratioDisplay(valuesA[ratioP1]!, valuesB[ratioP1]!), misconceptionId: "USE_FIRST_PERIOD_ONLY", derivation: "Uses only the first named period." },
        { text: ratioDisplay(valuesA[ratioP2]!, valuesB[ratioP2]!), misconceptionId: "USE_SECOND_PERIOD_ONLY", derivation: "Uses only the second named period." },
        { text: ratioDisplay(valuesA[ratioP1]! + valuesB[ratioP1]!, valuesA[ratioP2]! + valuesB[ratioP2]!), misconceptionId: "RATIO_PERIOD_TOTALS", derivation: "Compares the two period totals instead of the two series subtotals." },
        { text: ratioDisplay(valuesA[ratioP1]! + valuesB[ratioP2]!, valuesB[ratioP1]! + valuesA[ratioP2]!), misconceptionId: "CROSS_MIX_SERIES", derivation: "Mixes one value from each series into both ratio terms." },
      ],
      explanation: {
        keyIdea: "Add each series across the same two periods, then simplify the ratio of the two subtotals.",
        steps: [
          `${labelA} subtotal = ${valuesA[ratioP1]} + ${valuesA[ratioP2]} = ${ratioASubtotal}.`,
          `${labelB} subtotal = ${valuesB[ratioP1]} + ${valuesB[ratioP2]} = ${ratioBSubtotal}.`,
          `Ratio = ${ratioASubtotal}:${ratioBSubtotal} = ${twoPeriodRatioAnswer}.`,
        ],
      },
      evidence: { firstIndex: ratioP1, secondIndex: ratioP2 },
    },
    {
      kind: "TWO_PERIOD_COMBINED_TOTAL",
      difficulty: "Medium",
      ...fourValueSurface,
      answer: String(fourValueTotal),
      candidates: [
        { text: String(valuesA[totalP1]! + valuesA[totalP2]!), misconceptionId: "USE_SERIES_A_ONLY", derivation: "Adds only the first series across the two periods." },
        { text: String(valuesB[totalP1]! + valuesB[totalP2]!), misconceptionId: "USE_SERIES_B_ONLY", derivation: "Adds only the second series across the two periods." },
        { text: String(combinedTotals[totalP1]!), misconceptionId: "USE_FIRST_PERIOD_ONLY", derivation: "Uses only the combined total of the first period." },
        { text: String(combinedTotals[totalP2]!), misconceptionId: "USE_SECOND_PERIOD_ONLY", derivation: "Uses only the combined total of the second period." },
        { text: String(Math.abs(combinedTotals[totalP1]! - combinedTotals[totalP2]!)), misconceptionId: "USE_PERIOD_DIFFERENCE", derivation: "Finds the difference between period totals instead of adding them." },
      ],
      explanation: {
        keyIdea: "Add both series in each of the two named periods, then add the two period totals.",
        steps: [
          `${points[totalP1]!.period} total = ${valuesA[totalP1]} + ${valuesB[totalP1]} = ${combinedTotals[totalP1]}.`,
          `${points[totalP2]!.period} total = ${valuesA[totalP2]} + ${valuesB[totalP2]} = ${combinedTotals[totalP2]}.`,
          `Required total = ${combinedTotals[totalP1]} + ${combinedTotals[totalP2]} = ${fourValueTotal}.`,
        ],
      },
      evidence: { firstIndex: totalP1, secondIndex: totalP2 },
    },
    {
      kind: "TOTAL_SERIES_RATIO",
      difficulty: "Hard",
      ...totalRatioSurface,
      answer: totalSeriesRatio,
      candidates: [
        { text: ratioDisplay(totalB, totalA), misconceptionId: "REVERSE_TOTAL_RATIO", derivation: "Reverses the two six-period totals." },
        { text: ratioDisplay(valuesA[0]!, valuesB[0]!), misconceptionId: "USE_FIRST_PERIOD_ONLY", derivation: "Uses only the first plotted period." },
        { text: ratioDisplay(valuesA[5]!, valuesB[5]!), misconceptionId: "USE_LAST_PERIOD_ONLY", derivation: "Uses only the last plotted period." },
        { text: ratioDisplay(totalA, totalA + totalB), misconceptionId: "FIRST_TO_COMBINED", derivation: "Compares the first series total with the combined graph total." },
        { text: ratioDisplay(totalA + totalB, totalB), misconceptionId: "COMBINED_TO_SECOND", derivation: "Uses the combined graph total as the first ratio term." },
      ],
      explanation: {
        keyIdea: "Add all six values for each line separately, then simplify the ratio of the two totals.",
        steps: [
          `${labelA} six-period total = ${valuesA.join(" + ")} = ${totalA}.`,
          `${labelB} six-period total = ${valuesB.join(" + ")} = ${totalB}.`,
          `Ratio = ${totalA}:${totalB} = ${totalSeriesRatio}.`,
        ],
        workingTable: {
          headers: ["Series", "Six-period total"],
          rows: [[labelA, String(totalA)], [labelB, String(totalB)]],
        },
      },
      evidence: { totalA, totalB },
    },
    {
      kind: "COMBINED_PERIOD_PERCENT_EXCESS",
      difficulty: "Hard",
      ...combinedPercentSurface,
      answer: `${combinedPercentAnswer}%`,
      candidates: [
        { text: `${nearestWholePercent(combinedDifference, combinedTotals[largerCombinedIndex]!)}%`, misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger period total as the percentage base." },
        { text: `${nearestWholePercent(combinedTotals[largerCombinedIndex]!, combinedTotals[smallerCombinedIndex]!)}%`, misconceptionId: "REPORT_LARGER_AS_PERCENT_OF_SMALLER", derivation: "Reports the full larger total relative to the smaller total." },
        { text: `${nearestWholePercent(combinedDifference, combinedTotals[largerCombinedIndex]! + combinedTotals[smallerCombinedIndex]!)}%`, misconceptionId: "USE_PAIR_SUM_AS_BASE", derivation: "Uses the sum of the two period totals as the base." },
        { text: `${nearestWholePercent(Math.abs(valuesA[largerCombinedIndex]! - valuesA[smallerCombinedIndex]!), Math.min(valuesA[largerCombinedIndex]!, valuesA[smallerCombinedIndex]!))}%`, misconceptionId: "USE_SERIES_A_ONLY", derivation: "Compares only the first series across the two periods." },
        { text: `${nearestWholePercent(Math.abs(valuesB[largerCombinedIndex]! - valuesB[smallerCombinedIndex]!), Math.min(valuesB[largerCombinedIndex]!, valuesB[smallerCombinedIndex]!))}%`, misconceptionId: "USE_SERIES_B_ONLY", derivation: "Compares only the second series across the two periods." },
      ],
      explanation: {
        keyIdea: "Combine both series in each period first, then compare the difference with the smaller combined total.",
        steps: [
          `${points[largerCombinedIndex]!.period} combined = ${combinedTotals[largerCombinedIndex]}; ${points[smallerCombinedIndex]!.period} combined = ${combinedTotals[smallerCombinedIndex]}.`,
          `Difference = ${combinedTotals[largerCombinedIndex]} - ${combinedTotals[smallerCombinedIndex]} = ${combinedDifference}.`,
          `Percentage higher = ${combinedDifference}/${combinedTotals[smallerCombinedIndex]} × 100 ≈ ${combinedPercentAnswer}%.`,
        ],
      },
      evidence: { largerIndex: largerCombinedIndex, smallerIndex: smallerCombinedIndex },
    },
    {
      kind: "TOTAL_SERIES_PERCENT_EXCESS",
      difficulty: "Hard",
      ...totalPercentSurface,
      answer: `${totalPercentAnswer}%`,
      candidates: [
        { text: `${nearestWholePercent(totalDifference, largerSeriesTotal)}%`, misconceptionId: "USE_LARGER_AS_BASE", derivation: "Uses the larger six-period total as the base." },
        { text: `${nearestWholePercent(largerSeriesTotal, smallerSeriesTotal)}%`, misconceptionId: "REPORT_LARGER_AS_PERCENT_OF_SMALLER", derivation: "Reports the full larger total relative to the smaller total." },
        { text: `${nearestWholePercent(totalDifference, totalA + totalB)}%`, misconceptionId: "USE_COMBINED_GRAPH_TOTAL", derivation: "Uses the combined total of both series as the percentage base." },
        { text: `${nearestWholePercent(Math.abs(valuesA[0]! - valuesB[0]!), Math.min(valuesA[0]!, valuesB[0]!))}%`, misconceptionId: "USE_FIRST_PERIOD_ONLY", derivation: "Compares only the first period instead of six-period totals." },
        { text: `${nearestWholePercent(Math.abs(valuesA[5]! - valuesB[5]!), Math.min(valuesA[5]!, valuesB[5]!))}%`, misconceptionId: "USE_LAST_PERIOD_ONLY", derivation: "Compares only the last period instead of six-period totals." },
      ],
      explanation: {
        keyIdea: "Add all six values for both series, find the difference between the totals, and divide by the smaller total.",
        steps: [
          `${labelA} total = ${totalA}; ${labelB} total = ${totalB}.`,
          `Difference between totals = ${largerSeriesTotal} - ${smallerSeriesTotal} = ${totalDifference}.`,
          `Percentage excess = ${totalDifference}/${smallerSeriesTotal} × 100 ≈ ${totalPercentAnswer}%.`,
        ],
      },
      evidence: { totalA, totalB },
    },
    {
      kind: "THREE_VS_THREE_RATIO",
      difficulty: "Hard",
      ...groupRatioSurface,
      answer: threeVsThreeAnswer,
      candidates: [
        { text: ratioDisplay(groupBValue, groupAValue), misconceptionId: "REVERSE_GROUP_RATIO", derivation: "Reverses the two three-period group totals." },
        { text: ratioDisplay(grouping.a.reduce((sum, index) => sum + valuesB[index]!, 0), groupBValue), misconceptionId: "USE_SERIES_B_FOR_BOTH", derivation: "Uses the second series for both groups." },
        { text: ratioDisplay(groupAValue, grouping.b.reduce((sum, index) => sum + valuesA[index]!, 0)), misconceptionId: "USE_SERIES_A_FOR_BOTH", derivation: "Uses the first series for both groups." },
        { text: ratioDisplay(totalA, totalB), misconceptionId: "USE_FULL_SERIES_TOTALS", derivation: "Uses all six periods for both series instead of the requested three-period groups." },
        { text: ratioDisplay(valuesA[grouping.a[0]]!, valuesB[grouping.b[0]]!), misconceptionId: "USE_FIRST_VALUE_ONLY", derivation: "Uses only one value from each three-period group." },
      ],
      explanation: {
        keyIdea: "Add the three specified values from the first series and the three specified values from the second series, then simplify the ratio.",
        steps: [
          `${labelA} group total = ${grouping.a.map((index) => valuesA[index]!).join(" + ")} = ${groupAValue}.`,
          `${labelB} group total = ${grouping.b.map((index) => valuesB[index]!).join(" + ")} = ${groupBValue}.`,
          `Ratio = ${groupAValue}:${groupBValue} = ${threeVsThreeAnswer}.`,
        ],
        workingTable: {
          headers: ["Group", "Periods", "Total"],
          rows: [
            [labelA, groupAPeriods.join(", "), String(groupAValue)],
            [labelB, groupBPeriods.join(", "), String(groupBValue)],
          ],
        },
      },
      evidence: {
        a1: grouping.a[0], a2: grouping.a[1], a3: grouping.a[2],
        b1: grouping.b[0], b2: grouping.b[1], b3: grouping.b[2],
      },
    },
  ];
}

function selectedKinds(seed: string): Di004V2TaskKind[] {
  const easy = shuffle(seededRandom(`${seed}:easy-kinds`), EASY_KINDS).slice(0, 1);
  const medium = shuffle(seededRandom(`${seed}:medium-kinds`), MEDIUM_KINDS).slice(0, 2);
  const hard = shuffle(seededRandom(`${seed}:hard-kinds`), HARD_KINDS).slice(0, 2);
  return shuffle(seededRandom(`${seed}:question-order`), [...easy, ...medium, ...hard]);
}

function validateSet(set: Omit<Di004V2QuestionSet, "validation">) {
  const checks: Di004V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });

  add("LINE_KIND", set.stimulus.kind === "LINE", "DI-004 V2 must expose line semantics.");
  add("SIX_PERIODS", set.stimulus.points.length === 6 && set.stimulus.categories.length === 6, "DI-004 V2 requires six plotted periods.");
  add("POSITIVE_INTEGER_POINTS", set.stimulus.points.every((point) => Number.isSafeInteger(point.seriesA) && Number.isSafeInteger(point.seriesB) && point.seriesA > 0 && point.seriesB > 0), "Every plotted value must be a positive safe integer.");
  add("ORDER_REVERSAL", set.stimulus.points.some((point) => point.seriesA < point.seriesB) && set.stimulus.points.some((point) => point.seriesA > point.seriesB), "The two lines must reverse order.");
  add("FIVE_LINKED_QUESTIONS", set.questions.length === 5, "Each DI-004 V2 set must contain exactly five linked questions.");
  add("DIFFICULTY_MIX", set.questions.filter((q) => q.difficulty === "Easy").length === 1
    && set.questions.filter((q) => q.difficulty === "Medium").length === 2
    && set.questions.filter((q) => q.difficulty === "Hard").length === 2,
  "Each set must contain exactly 1 Easy, 2 Medium and 2 Hard questions.");
  add("OPTION_SHAPE", set.questions.every((q) => q.options.length === set.optionCount && new Set(q.options).size === set.optionCount), "Every question must expose the profile-specific number of unique options.");
  add("ANSWER_INDEX", set.questions.every((q) => q.options[q.correctIndex] === q.answer), "Every correct index must point to the canonical answer.");
  add("NO_DECIMAL_PERCENT", set.questions.every((q) => !/\\d+\\.\\d+%/u.test(q.stem + " " + q.answer)), "Learner-facing percentage answers must not contain decimals.");
  add("NO_FORCED_SHORTCUT_TRAP", set.questions.every((q) => !(q.explanation as any).shortcut && !(q.explanation as any).trap), "V2 explanations must not contain forced shortcut/trap boilerplate.");
  add("HARD_MULTI_STEP", set.questions.filter((q) => q.difficulty === "Hard").every((q) => q.explanation.steps.length >= 3), "Hard questions must keep multi-step explanations.");
  add("LIFECYCLE_LOCK", !set.traceability.questionStudioDiscoverable && set.traceability.questionBankStatus === "NOT_STORED" && !set.traceability.questionBankWritable && set.traceability.testEligibility === "INELIGIBLE" && !set.traceability.testEligible && !set.traceability.mockTestEligible && !set.traceability.publiclyPublishable && !set.traceability.automaticStudentPublication && !set.traceability.productionReleaseAuthorized, "DI-004 V2 must remain review-only before approval.");

  return { valid: checks.every((check) => check.passed), checks } as const;
}

export function generateDi004V2Set(input: { seed?: string; examProfile?: Di004V2ExamProfile } = {}): Di004V2QuestionSet {
  const seed = String(input.seed ?? "DI004-V2-DEFAULT").trim() || "DI004-V2-DEFAULT";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_I";
  const optionCount = OPTION_COUNT_BY_PROFILE[examProfile];
  const setId = `DI-004-V2-${hashSeed(seed).toString(16).padStart(8, "0")}`;
  const stimulus = buildStimulus(seed);
  const allDrafts = buildAllDrafts(seed, stimulus);
  const byKind = new Map(allDrafts.map((draft) => [draft.kind, draft] as const));
  const kinds = selectedKinds(seed);

  const questions = kinds.map((kind, index): Di004V2Question => {
    const draft = byKind.get(kind);
    if (!draft) throw new Error(`DI-004 V2 is missing draft logic for ${kind}.`);
    const options = buildOptions(`${seed}:${kind}:${index}`, optionCount, draft.answer, draft.candidates);
    return {
      questionId: `${setId}:Q${index + 1}`,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stemSurfaceId: draft.stemSurfaceId,
      stem: draft.stem,
      options: options.options,
      optionMetadata: options.optionMetadata,
      correctIndex: options.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });

  const withoutValidation = {
    packageId: "DI-004" as const,
    reviewVersion: "V2" as const,
    setId,
    seed,
    language: "en" as const,
    examProfile,
    optionCount,
    setDifficulty: "LINE_MIXED_V2" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-004" as const,
      representation: "LINE" as const,
      parentFoundation: "DI-001" as const,
      setContractVersion: "DI-004-SET-CONTRACT-V2" as const,
      questionLogicVersion: "DI-004-QUESTION-LOGIC-V2" as const,
      arithmeticAuthority: "INTEGER_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING" as const,
      reviewStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
      questionStudioDiscoverable: false as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      productionReleaseAuthorized: false as const,
    },
  };

  const validation = validateSet(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`DI-004 V2 validation failed for ${seed}: ${failed}.`);
  }

  return { ...withoutValidation, validation };
}

export const DI004_V2_CONTEXT_COUNT = CONTEXTS.length;
export const DI004_V2_SERIES_PAIR_COUNT = CONTEXTS.reduce((sum, context) => sum + context.seriesPairs.length, 0);
export const DI004_V2_ENTITY_LABEL_COUNT = DI004_V2_SERIES_PAIR_COUNT * 2;
export const DI004_V2_TASK_KINDS = Object.freeze([...EASY_KINDS, ...MEDIUM_KINDS, ...HARD_KINDS]);
