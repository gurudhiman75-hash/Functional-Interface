import { hashSeed, pick, ratioDisplay, seededRandom, shuffle } from "../DI-001/exact";
import type {
  Di003V2Difficulty,
  Di003V2ExamProfile,
  Di003V2Explanation,
  Di003V2Option,
  Di003V2Question,
  Di003V2QuestionSet,
  Di003V2Stimulus,
  Di003V2TaskKind,
  Di003V2ValidationCheck,
} from "./grouped-bar-v2-types";

export const DI003_V2_TASK_KINDS: readonly Di003V2TaskKind[] = [
  "DIRECT_BAR_VALUE",
  "HIGHEST_CATEGORY_FOR_SERIES",
  "LOWEST_CATEGORY_FOR_SERIES",
  "CROSS_SERIES_DIFFERENCE",
  "COMBINED_CATEGORY_TOTAL",
  "WITHIN_SERIES_DIFFERENCE",
  "CATEGORY_RATIO_WITHIN_SERIES",
  "SERIES_AVERAGE",
  "COMBINED_CATEGORY_RATIO",
  "PERCENT_CHANGE_WITHIN_SERIES",
  "CATEGORY_SHARE_OF_SERIES_TOTAL",
  "TOTAL_SERIES_PERCENT_EXCESS",
];

export const DI003_V2_DIFFICULTY: Readonly<Record<Di003V2TaskKind, Di003V2Difficulty>> = {
  DIRECT_BAR_VALUE: "Easy",
  HIGHEST_CATEGORY_FOR_SERIES: "Easy",
  LOWEST_CATEGORY_FOR_SERIES: "Easy",
  CROSS_SERIES_DIFFERENCE: "Medium",
  COMBINED_CATEGORY_TOTAL: "Medium",
  WITHIN_SERIES_DIFFERENCE: "Medium",
  CATEGORY_RATIO_WITHIN_SERIES: "Medium",
  SERIES_AVERAGE: "Medium",
  COMBINED_CATEGORY_RATIO: "Hard",
  PERCENT_CHANGE_WITHIN_SERIES: "Hard",
  CATEGORY_SHARE_OF_SERIES_TOTAL: "Hard",
  TOTAL_SERIES_PERCENT_EXCESS: "Hard",
};

const OPTION_COUNT: Readonly<Record<Di003V2ExamProfile, 4 | 5>> = {
  SSC_CGL_TIER_I: 4,
  BANKING_PRELIMS: 5,
};

const SERIES_A_POOL = [400, 500, 600, 700, 800, 900, 1000] as const;
const SERIES_B_POOL = [100, 200, 300, 400, 500, 600, 700] as const;
const SCALE_POOL = [1, 2] as const;

const CONTEXTS = [
  {
    id: "ANNUAL_SALES",
    title: "Annual sales of Product A and Product B",
    categories: ["2021", "2022", "2023", "2024", "2025"],
    seriesA: "Product A",
    seriesB: "Product B",
    yAxisLabel: "Sales (units)",
    unit: "units",
  },
  {
    id: "MONTHLY_PRODUCTION",
    title: "Monthly production of Factory A and Factory B",
    categories: ["January", "February", "March", "April", "May"],
    seriesA: "Factory A",
    seriesB: "Factory B",
    yAxisLabel: "Production (units)",
    unit: "units",
  },
  {
    id: "TEST_SELECTIONS",
    title: "Candidates selected in Test I and Test II",
    categories: ["Centre P", "Centre Q", "Centre R", "Centre S", "Centre T"],
    seriesA: "Test I",
    seriesB: "Test II",
    yAxisLabel: "Selected candidates",
    unit: "candidates",
  },
  {
    id: "LIBRARY_ISSUES",
    title: "Books issued by Section A and Section B",
    categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    seriesA: "Section A",
    seriesB: "Section B",
    yAxisLabel: "Books issued",
    unit: "books",
  },
  {
    id: "TICKET_SALES",
    title: "Tickets sold by Counter A and Counter B",
    categories: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    seriesA: "Counter A",
    seriesB: "Counter B",
    yAxisLabel: "Tickets sold",
    unit: "tickets",
  },
  {
    id: "PACKAGE_DISPATCH",
    title: "Packages dispatched by Warehouse A and Warehouse B",
    categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    seriesA: "Warehouse A",
    seriesB: "Warehouse B",
    yAxisLabel: "Packages dispatched",
    unit: "packages",
  },
] as const;

type Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

type Draft = Readonly<{
  kind: Di003V2TaskKind;
  difficulty: Di003V2Difficulty;
  stemSurfaceId: string;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Di003V2Explanation;
  evidence: Readonly<Record<string, string | number>>;
  normalize?: (value: string) => string;
}>;

function fmt(value: number) {
  return String(Math.round(value));
}

function formatPercent(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || numerator < 0 || denominator <= 0) {
    throw new Error("DI-003 V2 received an invalid percentage fraction.");
  }
  return `${Math.round((numerator * 100) / denominator)}%`;
}

function normalText(value: string) {
  return value.trim().replace(/\s+/gu, " ").toLowerCase();
}

function normalRatio(value: string) {
  const match = value.trim().match(/^(\d+)\s*:\s*(\d+)$/u);
  return match ? ratioDisplay(Number(match[1]), Number(match[2])) : normalText(value);
}

function surface(seed: string, values: readonly string[]) {
  const index = hashSeed(seed) % values.length;
  return { id: `S${index + 1}`, text: values[index]! };
}

function pair(seed: string, length: number): [number, number] {
  return shuffle(seededRandom(seed), Array.from({ length }, (_, index) => index)).slice(0, 2) as [number, number];
}

function fallbackCandidates(answer: string, numericStep: number): Candidate[] {
  const ratio = answer.match(/^(\d+)\s*:\s*(\d+)$/u);
  if (ratio) {
    const left = Number(ratio[1]);
    const right = Number(ratio[2]);
    return [
      { text: `${right}:${left}`, misconceptionId: "FALLBACK_REVERSED_RATIO", derivation: "Reverses the requested ratio order." },
      { text: ratioDisplay(left, left + right), misconceptionId: "FALLBACK_PART_TO_TOTAL", derivation: "Compares the first part with the combined total." },
      { text: ratioDisplay(left + right, right), misconceptionId: "FALLBACK_TOTAL_TO_PART", derivation: "Compares the combined total with the second part." },
      { text: `${left + 1}:${right}`, misconceptionId: "FALLBACK_NEARBY_RATIO_LEFT", derivation: "Uses a nearby first ratio term after a reading slip." },
      { text: `${left}:${right + 1}`, misconceptionId: "FALLBACK_NEARBY_RATIO_RIGHT", derivation: "Uses a nearby second ratio term after a reading slip." },
    ];
  }

  const percent = answer.match(/^(\d+(?:\.\d+)?)%$/u);
  if (percent) {
    const value = Number(percent[1]);
    return [-10, -5, 5, 10, 15]
      .map((delta, index) => ({
        text: `${fmt(value + delta)}%`,
        misconceptionId: `FALLBACK_PERCENT_${index}`,
        derivation: "Uses a nearby percentage produced by a small denominator or reading error.",
      }))
      .filter((candidate) => !candidate.text.startsWith("-"));
  }

  if (/^\d+(?:\.\d+)?$/u.test(answer)) {
    const value = Number(answer);
    return [-2, -1, 1, 2, 3]
      .map((multiple, index) => ({
        text: fmt(value + multiple * numericStep),
        misconceptionId: `FALLBACK_NEARBY_VALUE_${index}`,
        derivation: "Uses a nearby chart-scale value after a small reading or arithmetic error.",
      }))
      .filter((candidate) => !candidate.text.startsWith("-"));
  }

  return [];
}

function buildOptions(input: {
  seed: string;
  optionCount: 4 | 5;
  answer: string;
  candidates: readonly Candidate[];
  numericStep: number;
  normalize?: (value: string) => string;
}) {
  const normalize = input.normalize ?? normalText;
  const seen = new Set<string>();
  const retained: Di003V2Option[] = [];
  const add = (candidate: Candidate) => {
    const key = normalize(candidate.text);
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: input.answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the shared grouped-bar stimulus." });
  input.candidates.forEach(add);
  fallbackCandidates(input.answer, input.numericStep).forEach(add);
  if (retained.length < input.optionCount) {
    throw new Error(`DI-003 V2 ${input.seed} has only ${retained.length} unique options for ${input.answer}.`);
  }

  const shuffled = shuffle(seededRandom(`${input.seed}:options`), retained.slice(0, input.optionCount));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("DI-003 V2 lost the correct option during shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildStimulus(seed: string): Di003V2Stimulus {
  const context = pick(seededRandom(`${seed}:context`), CONTEXTS);
  const scale = pick(seededRandom(`${seed}:scale`), SCALE_POOL);
  const aValues = shuffle(seededRandom(`${seed}:series-a`), SERIES_A_POOL).slice(0, 5).map((value) => value * scale);
  const bValues = shuffle(seededRandom(`${seed}:series-b`), SERIES_B_POOL).slice(0, 5).map((value) => value * scale);
  return {
    kind: "GROUPED_BAR",
    contextId: context.id,
    title: context.title,
    instruction: "Study the grouped bar chart and answer the questions that follow.",
    categories: context.categories,
    series: [
      { id: "SERIES_A", label: context.seriesA },
      { id: "SERIES_B", label: context.seriesB },
    ],
    points: context.categories.map((category, index) => ({ category, seriesA: aValues[index]!, seriesB: bValues[index]! })),
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
  };
}

function buildDrafts(seed: string, stimulus: Di003V2Stimulus): Draft[] {
  const points = stimulus.points;
  const aLabel = stimulus.series[0].label;
  const bLabel = stimulus.series[1].label;
  const totalA = points.reduce((sum, point) => sum + point.seriesA, 0);
  const totalB = points.reduce((sum, point) => sum + point.seriesB, 0);
  if (totalA <= totalB) throw new Error("DI-003 V2 state requires Series A total to exceed Series B total.");

  const directSeriesA = hashSeed(`${seed}:direct-series`) % 2 === 0;
  const directIndex = hashSeed(`${seed}:direct-category`) % points.length;
  const directPoint = points[directIndex]!;
  const directLabel = directSeriesA ? aLabel : bLabel;
  const directValue = directSeriesA ? directPoint.seriesA : directPoint.seriesB;
  const otherSeriesValue = directSeriesA ? directPoint.seriesB : directPoint.seriesA;
  const directSurface = surface(`${seed}:DIRECT_BAR_VALUE:stem`, [
    `What is the value of ${directLabel} for ${directPoint.category}?`,
    `According to the chart, how many ${stimulus.unit} are shown for ${directLabel} in ${directPoint.category}?`,
    `For ${directPoint.category}, what value is shown for ${directLabel}?`,
  ]);

  const highestSeriesA = hashSeed(`${seed}:highest-series`) % 2 === 0;
  const highestLabel = highestSeriesA ? aLabel : bLabel;
  const highestPoint = points.reduce((best, point) => (highestSeriesA ? point.seriesA > best.seriesA : point.seriesB > best.seriesB) ? point : best, points[0]!);
  const highestSurface = surface(`${seed}:HIGHEST_CATEGORY_FOR_SERIES:stem`, [
    `In which category is ${highestLabel} the highest?`,
    `For ${highestLabel}, which category has the maximum value?`,
    `Which category has the highest ${highestLabel} value?`,
  ]);

  const lowestSeriesA = hashSeed(`${seed}:lowest-series`) % 2 === 0;
  const lowestLabel = lowestSeriesA ? aLabel : bLabel;
  const lowestPoint = points.reduce((best, point) => (lowestSeriesA ? point.seriesA < best.seriesA : point.seriesB < best.seriesB) ? point : best, points[0]!);
  const lowestSurface = surface(`${seed}:LOWEST_CATEGORY_FOR_SERIES:stem`, [
    `In which category is ${lowestLabel} the lowest?`,
    `For ${lowestLabel}, which category has the minimum value?`,
    `Which category has the lowest ${lowestLabel} value?`,
  ]);

  const differenceChoices = points.map((point, index) => ({ index, value: Math.abs(point.seriesA - point.seriesB) })).filter((entry) => entry.value > 0);
  const differenceEntry = pick(seededRandom(`${seed}:cross-difference`), differenceChoices);
  const differencePoint = points[differenceEntry.index]!;
  const crossDifference = differenceEntry.value;
  const differenceSurface = surface(`${seed}:CROSS_SERIES_DIFFERENCE:stem`, [
    `What is the difference between ${aLabel} and ${bLabel} in ${differencePoint.category}?`,
    `In ${differencePoint.category}, what is the difference between the two series?`,
    `Find the absolute difference between ${aLabel} and ${bLabel} for ${differencePoint.category}.`,
  ]);

  const combinedIndex = hashSeed(`${seed}:combined-total`) % points.length;
  const combinedPoint = points[combinedIndex]!;
  const combinedTotal = combinedPoint.seriesA + combinedPoint.seriesB;
  const combinedSurface = surface(`${seed}:COMBINED_CATEGORY_TOTAL:stem`, [
    `What is the combined value of ${aLabel} and ${bLabel} in ${combinedPoint.category}?`,
    `Find the total of ${aLabel} and ${bLabel} for ${combinedPoint.category}.`,
    `Together, what value do ${aLabel} and ${bLabel} give for ${combinedPoint.category}?`,
  ]);

  const withinSeriesA = hashSeed(`${seed}:within-series`) % 2 === 0;
  const withinLabel = withinSeriesA ? aLabel : bLabel;
  const [withinLeft, withinRight] = pair(`${seed}:within-pair`, points.length);
  const withinA = withinSeriesA ? points[withinLeft]!.seriesA : points[withinLeft]!.seriesB;
  const withinB = withinSeriesA ? points[withinRight]!.seriesA : points[withinRight]!.seriesB;
  const withinDifference = Math.abs(withinA - withinB);
  const withinSurface = surface(`${seed}:WITHIN_SERIES_DIFFERENCE:stem`, [
    `What is the difference in ${withinLabel} between ${points[withinLeft]!.category} and ${points[withinRight]!.category}?`,
    `For ${withinLabel}, how much do the values for ${points[withinLeft]!.category} and ${points[withinRight]!.category} differ?`,
    `Find the absolute difference between the ${withinLabel} values for ${points[withinLeft]!.category} and ${points[withinRight]!.category}.`,
  ]);

  const ratioSeriesA = hashSeed(`${seed}:ratio-series`) % 2 === 0;
  const ratioLabel = ratioSeriesA ? aLabel : bLabel;
  const [ratioLeft, ratioRight] = pair(`${seed}:ratio-pair`, points.length);
  const ratioA = ratioSeriesA ? points[ratioLeft]!.seriesA : points[ratioLeft]!.seriesB;
  const ratioB = ratioSeriesA ? points[ratioRight]!.seriesA : points[ratioRight]!.seriesB;
  const categoryRatio = ratioDisplay(ratioA, ratioB);
  const ratioSurface = surface(`${seed}:CATEGORY_RATIO_WITHIN_SERIES:stem`, [
    `What is the ratio of ${ratioLabel} in ${points[ratioLeft]!.category} to ${points[ratioRight]!.category}?`,
    `For ${ratioLabel}, the values in ${points[ratioLeft]!.category} and ${points[ratioRight]!.category} are in what ratio, in that order?`,
    `Find ${points[ratioLeft]!.category} : ${points[ratioRight]!.category} for ${ratioLabel}.`,
  ]);

  const averageSeriesA = hashSeed(`${seed}:average-series`) % 2 === 0;
  const averageLabel = averageSeriesA ? aLabel : bLabel;
  const averageValues = points.map((point) => averageSeriesA ? point.seriesA : point.seriesB);
  const averageTotal = averageValues.reduce((sum, value) => sum + value, 0);
  const average = averageTotal / points.length;
  const averageSurface = surface(`${seed}:SERIES_AVERAGE:stem`, [
    `What is the average value of ${averageLabel} across all five categories?`,
    `Find the mean of the five ${averageLabel} values.`,
    `On average, what value does ${averageLabel} have per category?`,
  ]);

  const [firstIndex, secondIndex] = pair(`${seed}:combined-ratio`, points.length);
  const firstCombined = points[firstIndex]!.seriesA + points[firstIndex]!.seriesB;
  const secondCombined = points[secondIndex]!.seriesA + points[secondIndex]!.seriesB;
  const combinedRatio = ratioDisplay(firstCombined, secondCombined);
  const combinedRatioSurface = surface(`${seed}:COMBINED_CATEGORY_RATIO:stem`, [
    `What is the ratio of the combined values of both series in ${points[firstIndex]!.category} to ${points[secondIndex]!.category}?`,
    `Add the two series values in each named category. What is ${points[firstIndex]!.category} : ${points[secondIndex]!.category}?`,
    `The combined totals for ${points[firstIndex]!.category} and ${points[secondIndex]!.category} are in what ratio, in that order?`,
  ]);

  const [changeLeft, changeRight] = pair(`${seed}:percent-change`, points.length);
  const lowerIndex = points[changeLeft]!.seriesA < points[changeRight]!.seriesA ? changeLeft : changeRight;
  const higherIndex = lowerIndex === changeLeft ? changeRight : changeLeft;
  const lowerValue = points[lowerIndex]!.seriesA;
  const higherValue = points[higherIndex]!.seriesA;
  const changeDifference = higherValue - lowerValue;
  const percentChange = formatPercent(changeDifference, lowerValue);
  const percentSurface = surface(`${seed}:PERCENT_CHANGE_WITHIN_SERIES:stem`, [
    `To the nearest whole percent, ${aLabel} in ${points[higherIndex]!.category} is what percentage higher than in ${points[lowerIndex]!.category}?`,
    `By approximately what whole percent does ${aLabel} increase from ${points[lowerIndex]!.category} to ${points[higherIndex]!.category}?`,
    `Find the percentage by which the ${aLabel} value for ${points[higherIndex]!.category} exceeds that for ${points[lowerIndex]!.category}, rounded to the nearest whole percent.`,
  ]);

  const shareSeriesA = hashSeed(`${seed}:share-series`) % 2 === 0;
  const shareLabel = shareSeriesA ? aLabel : bLabel;
  const shareTotal = shareSeriesA ? totalA : totalB;
  const shareIndex = hashSeed(`${seed}:share-category`) % points.length;
  const shareValue = shareSeriesA ? points[shareIndex]!.seriesA : points[shareIndex]!.seriesB;
  const shareAnswer = formatPercent(shareValue, shareTotal);
  const shareSurface = surface(`${seed}:CATEGORY_SHARE_OF_SERIES_TOTAL:stem`, [
    `To the nearest whole percent, ${shareLabel} in ${points[shareIndex]!.category} is what percentage of the ${shareLabel} total across all five categories?`,
    `Approximately what whole percent of the five-category ${shareLabel} total comes from ${points[shareIndex]!.category}?`,
    `Find the share of ${points[shareIndex]!.category} in the total of ${shareLabel}, rounded to the nearest whole percent.`,
  ]);

  const totalDifference = totalA - totalB;
  const totalExcess = formatPercent(totalDifference, totalB);
  const excessSurface = surface(`${seed}:TOTAL_SERIES_PERCENT_EXCESS:stem`, [
    `To the nearest whole percent, by what percentage does the total of ${aLabel} exceed the total of ${bLabel}?`,
    `The five-category total for ${aLabel} is approximately what whole percent higher than the total for ${bLabel}?`,
    `Find the percentage by which the overall ${aLabel} total is greater than the overall ${bLabel} total, rounded to the nearest whole percent.`,
  ]);

  const categoryTextCandidates = (answerCategory: string): Candidate[] => points
    .filter((point) => point.category !== answerCategory)
    .map((point, index) => ({
      text: point.category,
      misconceptionId: `OTHER_CATEGORY_${index}`,
      derivation: `Selects ${point.category} instead of the category containing the required extreme value.`,
    }));

  const otherCategoryValues = (seriesA: boolean, excludedIndex: number): Candidate[] => points
    .filter((_point, index) => index !== excludedIndex)
    .map((point, index) => ({
      text: String(seriesA ? point.seriesA : point.seriesB),
      misconceptionId: `OTHER_BAR_${index}`,
      derivation: `Reads a different ${seriesA ? aLabel : bLabel} bar from the chart.`,
    }));

  return [
    {
      kind: "DIRECT_BAR_VALUE", difficulty: "Easy", stemSurfaceId: directSurface.id, stem: directSurface.text, answer: String(directValue),
      candidates: [
        { text: String(otherSeriesValue), misconceptionId: "OTHER_SERIES_SAME_CATEGORY", derivation: "Reads the other series in the named category." },
        ...otherCategoryValues(directSeriesA, directIndex),
      ],
      explanation: { keyIdea: `Read the ${directLabel} value for ${directPoint.category}.`, steps: [`The chart shows ${directLabel} = ${directValue} ${stimulus.unit} for ${directPoint.category}.`, `Therefore, the required value is ${directValue}.`] },
      evidence: { categoryIndex: directIndex, seriesId: directSeriesA ? "SERIES_A" : "SERIES_B" },
    },
    {
      kind: "HIGHEST_CATEGORY_FOR_SERIES", difficulty: "Easy", stemSurfaceId: highestSurface.id, stem: highestSurface.text, answer: highestPoint.category,
      candidates: categoryTextCandidates(highestPoint.category),
      explanation: { keyIdea: `Compare the five ${highestLabel} values and identify the largest one.`, steps: [`The largest ${highestLabel} value is ${highestSeriesA ? highestPoint.seriesA : highestPoint.seriesB}.`, `It occurs in ${highestPoint.category}.`] },
      evidence: { seriesId: highestSeriesA ? "SERIES_A" : "SERIES_B", categoryIndex: points.indexOf(highestPoint) },
    },
    {
      kind: "LOWEST_CATEGORY_FOR_SERIES", difficulty: "Easy", stemSurfaceId: lowestSurface.id, stem: lowestSurface.text, answer: lowestPoint.category,
      candidates: categoryTextCandidates(lowestPoint.category),
      explanation: { keyIdea: `Compare the five ${lowestLabel} values and identify the smallest one.`, steps: [`The smallest ${lowestLabel} value is ${lowestSeriesA ? lowestPoint.seriesA : lowestPoint.seriesB}.`, `It occurs in ${lowestPoint.category}.`] },
      evidence: { seriesId: lowestSeriesA ? "SERIES_A" : "SERIES_B", categoryIndex: points.indexOf(lowestPoint) },
    },
    {
      kind: "CROSS_SERIES_DIFFERENCE", difficulty: "Medium", stemSurfaceId: differenceSurface.id, stem: differenceSurface.text, answer: String(crossDifference),
      candidates: [
        { text: String(differencePoint.seriesA + differencePoint.seriesB), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two bars instead of finding their difference." },
        { text: String(differencePoint.seriesA), misconceptionId: "READ_SERIES_A_ONLY", derivation: `Reports only the ${aLabel} bar in the named category.` },
        { text: String(differencePoint.seriesB), misconceptionId: "READ_SERIES_B_ONLY", derivation: `Reports only the ${bLabel} bar in the named category.` },
        { text: String(totalA), misconceptionId: "USE_SERIES_A_TOTAL", derivation: `Uses the full ${aLabel} total instead of the same-category difference.` },
        { text: String(totalB), misconceptionId: "USE_SERIES_B_TOTAL", derivation: `Uses the full ${bLabel} total instead of the same-category difference.` },
      ],
      explanation: { keyIdea: "Use the two series values in the named category and subtract the smaller value from the larger.", steps: [`${aLabel} = ${differencePoint.seriesA}; ${bLabel} = ${differencePoint.seriesB}.`, `Difference = |${differencePoint.seriesA} - ${differencePoint.seriesB}| = ${crossDifference}.`] },
      evidence: { categoryIndex: differenceEntry.index },
    },
    {
      kind: "COMBINED_CATEGORY_TOTAL", difficulty: "Medium", stemSurfaceId: combinedSurface.id, stem: combinedSurface.text, answer: String(combinedTotal),
      candidates: [
        { text: String(combinedPoint.seriesA), misconceptionId: "SERIES_A_ONLY", derivation: `Uses only the ${aLabel} bar.` },
        { text: String(combinedPoint.seriesB), misconceptionId: "SERIES_B_ONLY", derivation: `Uses only the ${bLabel} bar.` },
        { text: String(Math.abs(combinedPoint.seriesA - combinedPoint.seriesB)), misconceptionId: "SUBTRACT_INSTEAD_OF_ADD", derivation: "Subtracts the two bars instead of adding them." },
        { text: String(totalA), misconceptionId: "WHOLE_SERIES_A_TOTAL", derivation: `Uses the five-category ${aLabel} total.` },
        { text: String(totalB), misconceptionId: "WHOLE_SERIES_B_TOTAL", derivation: `Uses the five-category ${bLabel} total.` },
      ],
      explanation: { keyIdea: "A combined category total is found by adding the two series values in that category.", steps: [`${aLabel} = ${combinedPoint.seriesA}; ${bLabel} = ${combinedPoint.seriesB}.`, `${combinedPoint.seriesA} + ${combinedPoint.seriesB} = ${combinedTotal}.`] },
      evidence: { categoryIndex: combinedIndex },
    },
    {
      kind: "WITHIN_SERIES_DIFFERENCE", difficulty: "Medium", stemSurfaceId: withinSurface.id, stem: withinSurface.text, answer: String(withinDifference),
      candidates: [
        { text: String(withinA + withinB), misconceptionId: "ADD_TWO_CATEGORIES", derivation: "Adds the two named bars instead of subtracting them." },
        { text: String(withinA), misconceptionId: "FIRST_CATEGORY_ONLY", derivation: "Reports the first named bar without comparison." },
        { text: String(withinB), misconceptionId: "SECOND_CATEGORY_ONLY", derivation: "Reports the second named bar without comparison." },
        { text: String(Math.abs(points[withinLeft]!.seriesA - points[withinLeft]!.seriesB)), misconceptionId: "CROSS_SERIES_FIRST_CATEGORY", derivation: "Compares the two series within the first category instead." },
        { text: String(Math.abs(points[withinRight]!.seriesA - points[withinRight]!.seriesB)), misconceptionId: "CROSS_SERIES_SECOND_CATEGORY", derivation: "Compares the two series within the second category instead." },
      ],
      explanation: { keyIdea: `Use only the two ${withinLabel} values named in the question.`, steps: [`The two values are ${withinA} and ${withinB}.`, `Difference = |${withinA} - ${withinB}| = ${withinDifference}.`] },
      evidence: { seriesId: withinSeriesA ? "SERIES_A" : "SERIES_B", firstIndex: withinLeft, secondIndex: withinRight },
    },
    {
      kind: "CATEGORY_RATIO_WITHIN_SERIES", difficulty: "Medium", stemSurfaceId: ratioSurface.id, stem: ratioSurface.text, answer: categoryRatio, normalize: normalRatio,
      candidates: [
        { text: ratioDisplay(ratioB, ratioA), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two named categories." },
        { text: ratioDisplay(points[ratioLeft]!.seriesA, points[ratioRight]!.seriesB), misconceptionId: "MIX_SERIES", derivation: "Mixes values from the two different series." },
        { text: ratioDisplay(ratioA, ratioA + ratioB), misconceptionId: "PART_TO_TWO_CATEGORY_TOTAL", derivation: "Compares the first value with the sum of both named values." },
        { text: ratioDisplay(ratioA + ratioB, ratioB), misconceptionId: "TWO_CATEGORY_TOTAL_TO_PART", derivation: "Compares the sum of both values with the second value." },
        { text: ratioDisplay(totalA, totalB), misconceptionId: "WHOLE_SERIES_RATIO", derivation: "Uses the overall two-series totals instead of the named categories." },
      ],
      explanation: { keyIdea: `Take the two ${ratioLabel} values in the order stated and simplify their ratio.`, steps: [`Required values = ${ratioA} and ${ratioB}.`, `${ratioA}:${ratioB} = ${categoryRatio}.`] },
      evidence: { seriesId: ratioSeriesA ? "SERIES_A" : "SERIES_B", firstIndex: ratioLeft, secondIndex: ratioRight },
    },
    {
      kind: "SERIES_AVERAGE", difficulty: "Medium", stemSurfaceId: averageSurface.id, stem: averageSurface.text, answer: fmt(average),
      candidates: [
        { text: String(averageTotal), misconceptionId: "TOTAL_NOT_AVERAGE", derivation: "Adds all five bars but does not divide by five." },
        { text: fmt((averageSeriesA ? totalB : totalA) / points.length), misconceptionId: "OTHER_SERIES_AVERAGE", derivation: "Finds the average of the other series." },
        ...averageValues.slice(0, 3).map((value, index) => ({ text: String(value), misconceptionId: `SINGLE_BAR_${index}`, derivation: "Uses one bar value instead of the five-category mean." })),
      ],
      explanation: { keyIdea: `Add all five ${averageLabel} values, then divide by 5.`, steps: [`${averageValues.join(" + ")} = ${averageTotal}.`, `${averageTotal} ÷ 5 = ${fmt(average)}.`], workingTable: { headers: ["Series total", "Number of categories", "Average"], rows: [[String(averageTotal), "5", fmt(average)]] } },
      evidence: { seriesId: averageSeriesA ? "SERIES_A" : "SERIES_B", total: averageTotal },
    },
    {
      kind: "COMBINED_CATEGORY_RATIO", difficulty: "Hard", stemSurfaceId: combinedRatioSurface.id, stem: combinedRatioSurface.text, answer: combinedRatio, normalize: normalRatio,
      candidates: [
        { text: ratioDisplay(secondCombined, firstCombined), misconceptionId: "REVERSE_COMBINED_RATIO", derivation: "Reverses the required category order." },
        { text: ratioDisplay(points[firstIndex]!.seriesA, points[secondIndex]!.seriesA), misconceptionId: "SERIES_A_ONLY", derivation: `Uses only ${aLabel} instead of combining both bars.` },
        { text: ratioDisplay(points[firstIndex]!.seriesB, points[secondIndex]!.seriesB), misconceptionId: "SERIES_B_ONLY", derivation: `Uses only ${bLabel} instead of combining both bars.` },
        { text: ratioDisplay(points[firstIndex]!.seriesA + points[secondIndex]!.seriesA, points[firstIndex]!.seriesB + points[secondIndex]!.seriesB), misconceptionId: "GROUP_BY_SERIES", derivation: "Groups the four bars by series instead of by category." },
        { text: ratioDisplay(firstCombined, points[secondIndex]!.seriesA), misconceptionId: "OMIT_SECOND_BAR", derivation: "Omits one bar from the second category total." },
      ],
      explanation: { keyIdea: "First add both series values within each category, then form the ratio in the stated order.", steps: [`${points[firstIndex]!.category}: ${points[firstIndex]!.seriesA} + ${points[firstIndex]!.seriesB} = ${firstCombined}.`, `${points[secondIndex]!.category}: ${points[secondIndex]!.seriesA} + ${points[secondIndex]!.seriesB} = ${secondCombined}.`, `${firstCombined}:${secondCombined} = ${combinedRatio}.`], workingTable: { headers: ["Category", aLabel, bLabel, "Combined"], rows: [[points[firstIndex]!.category, String(points[firstIndex]!.seriesA), String(points[firstIndex]!.seriesB), String(firstCombined)], [points[secondIndex]!.category, String(points[secondIndex]!.seriesA), String(points[secondIndex]!.seriesB), String(secondCombined)]] } },
      evidence: { firstIndex, secondIndex },
    },
    {
      kind: "PERCENT_CHANGE_WITHIN_SERIES", difficulty: "Hard", stemSurfaceId: percentSurface.id, stem: percentSurface.text, answer: percentChange,
      candidates: [
        { text: formatPercent(changeDifference, higherValue), misconceptionId: "HIGHER_AS_BASE", derivation: "Uses the higher value as the percentage base." },
        { text: formatPercent(higherValue, lowerValue), misconceptionId: "REPORT_HIGHER_AS_PERCENT", derivation: "Reports the higher value as a percent of the lower value, not the increase." },
        { text: `${changeDifference}%`, misconceptionId: "ABSOLUTE_CHANGE_AS_PERCENT", derivation: "Attaches a percent sign to the numerical difference." },
        { text: formatPercent(changeDifference, totalA), misconceptionId: "SERIES_TOTAL_AS_BASE", derivation: "Uses the five-category series total as the denominator." },
        { text: formatPercent(changeDifference, lowerValue + higherValue), misconceptionId: "PAIR_SUM_AS_BASE", derivation: "Uses the sum of the two bars as the denominator." },
      ],
      explanation: { keyIdea: "For percentage increase, divide the increase by the lower starting value and multiply by 100.", steps: [`Increase = ${higherValue} - ${lowerValue} = ${changeDifference}.`, `Percentage increase = ${changeDifference}/${lowerValue} × 100 ≈ ${percentChange} to the nearest whole percent.`], workingTable: { headers: ["Lower value", "Higher value", "Increase", "% increase"], rows: [[String(lowerValue), String(higherValue), String(changeDifference), percentChange]] } },
      evidence: { lowerIndex, higherIndex },
    },
    {
      kind: "CATEGORY_SHARE_OF_SERIES_TOTAL", difficulty: "Hard", stemSurfaceId: shareSurface.id, stem: shareSurface.text, answer: shareAnswer,
      candidates: [
        { text: formatPercent(shareValue, shareSeriesA ? totalB : totalA), misconceptionId: "OTHER_SERIES_TOTAL_DENOMINATOR", derivation: "Divides the correct bar by the other series total." },
        { text: formatPercent(shareValue, totalA + totalB), misconceptionId: "BOTH_SERIES_TOTAL_DENOMINATOR", derivation: "Uses the combined total of both series as the denominator." },
        { text: formatPercent(shareTotal, shareValue), misconceptionId: "REVERSE_PART_WHOLE", derivation: "Reverses the part-to-whole fraction." },
        { text: formatPercent(shareValue, shareTotal - shareValue), misconceptionId: "EXCLUDE_TARGET_FROM_TOTAL", derivation: "Excludes the named category from the series total." },
        { text: formatPercent(points[shareIndex]!.seriesA + points[shareIndex]!.seriesB, totalA + totalB), misconceptionId: "CATEGORY_SHARE_OF_ALL", derivation: "Finds the named category's share of both series combined." },
      ],
      explanation: { keyIdea: `Use the ${shareLabel} value in the named category as the part and the five-category ${shareLabel} total as the whole.`, steps: [`${shareLabel} total = ${shareSeriesA ? points.map((point) => point.seriesA).join(" + ") : points.map((point) => point.seriesB).join(" + ")} = ${shareTotal}.`, `Required percentage = ${shareValue}/${shareTotal} × 100 ≈ ${shareAnswer} to the nearest whole percent.`], workingTable: { headers: ["Named-category value", "Series total", "Share"], rows: [[String(shareValue), String(shareTotal), shareAnswer]] } },
      evidence: { seriesId: shareSeriesA ? "SERIES_A" : "SERIES_B", categoryIndex: shareIndex },
    },
    {
      kind: "TOTAL_SERIES_PERCENT_EXCESS", difficulty: "Hard", stemSurfaceId: excessSurface.id, stem: excessSurface.text, answer: totalExcess,
      candidates: [
        { text: formatPercent(totalDifference, totalA), misconceptionId: "LARGER_TOTAL_AS_BASE", derivation: `Uses the larger ${aLabel} total as the percentage base.` },
        { text: formatPercent(totalA, totalB), misconceptionId: "REPORT_LARGER_AS_PERCENT", derivation: `Reports the ${aLabel} total as a percent of ${bLabel}, not the excess.` },
        { text: `${totalDifference}%`, misconceptionId: "ABSOLUTE_TOTAL_DIFFERENCE_AS_PERCENT", derivation: "Attaches a percent sign to the numerical total difference." },
        { text: formatPercent(totalDifference, totalA + totalB), misconceptionId: "COMBINED_TOTAL_AS_BASE", derivation: "Uses the combined total of both series as the denominator." },
        { text: formatPercent(totalB, totalA), misconceptionId: "REVERSE_TOTAL_SHARE", derivation: `Finds ${bLabel} as a percentage of ${aLabel} instead.` },
      ],
      explanation: { keyIdea: `Compare the two series totals and use the smaller ${bLabel} total as the base for “percent higher”.`, steps: [`${aLabel} total = ${totalA}; ${bLabel} total = ${totalB}.`, `Excess = ${totalA} - ${totalB} = ${totalDifference}.`, `Percentage excess = ${totalDifference}/${totalB} × 100 ≈ ${totalExcess} to the nearest whole percent.`], workingTable: { headers: [aLabel, bLabel, "Difference", "% excess"], rows: [[String(totalA), String(totalB), String(totalDifference), totalExcess]] } },
      evidence: { totalA, totalB },
    },
  ];
}

function chooseMixedTasks(seed: string, drafts: readonly Draft[]) {
  const chooseDifficulty = (difficulty: Di003V2Difficulty, count: number) => shuffle(
    seededRandom(`${seed}:mix:${difficulty}`),
    drafts.filter((draft) => draft.difficulty === difficulty),
  ).slice(0, count);
  return shuffle(seededRandom(`${seed}:mix:order`), [
    ...chooseDifficulty("Easy", 1),
    ...chooseDifficulty("Medium", 2),
    ...chooseDifficulty("Hard", 2),
  ]);
}

function hasDecimalLearnerSurface(question: Di003V2Question) {
  const table = question.explanation.workingTable;
  return /\d+\.\d+/u.test([
    question.stem,
    ...question.options,
    question.answer,
    question.explanation.keyIdea,
    ...question.explanation.steps,
    ...(table?.headers ?? []),
    ...(table?.rows.flat() ?? []),
  ].join(" "));
}

function validate(base: Omit<Di003V2QuestionSet, "validation">) {
  const checks: Di003V2ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  add("FIVE_CATEGORIES", base.stimulus.points.length === 5, "Grouped-bar V2 requires five categories.");
  add("TWO_SERIES", base.stimulus.series.length === 2, "Grouped-bar V2 requires two visible series.");
  add("POSITIVE_BARS", base.stimulus.points.every((point) => point.seriesA > 0 && point.seriesB > 0), "All bars must be positive.");
  add("FIVE_DISTINCT_TASKS", base.questions.length === 5 && new Set(base.questions.map((question) => question.kind)).size === 5, "Each set requires five distinct tasks.");
  add("DIFFICULTY_MIX", base.questions.filter((question) => question.difficulty === "Easy").length === 1 && base.questions.filter((question) => question.difficulty === "Medium").length === 2 && base.questions.filter((question) => question.difficulty === "Hard").length === 2, "Each set requires 1 Easy, 2 Medium and 2 Hard questions.");
  add("DIFFICULTY_POLICY", base.questions.every((question) => question.difficulty === DI003_V2_DIFFICULTY[question.kind]), "A question drifted from its family difficulty.");
  add("OPTION_CONTRACT", base.questions.every((question) => question.options.length === base.optionCount && new Set(question.options).size === question.options.length), "Option count or uniqueness failed.");
  add("ANSWER_BINDING", base.questions.every((question) => question.options[question.correctIndex] === question.answer && question.optionMetadata[question.correctIndex]?.misconceptionId === "CORRECT"), "Answer binding failed.");
  add("NO_DECIMAL_LEARNER_SURFACE", base.questions.every((question) => !hasDecimalLearnerSurface(question)), "DI-003 learner-facing questions, options and explanations must contain no decimal values.");
  add("EXPLANATION", base.questions.every((question) => question.explanation.keyIdea.length >= 20 && question.explanation.steps.length >= 2), "Explanation is too thin.");
  add("LEARNER_LANGUAGE", base.questions.every((question) => !/associated|shortcut|common trap|\btrap\b/iu.test(`${question.stem} ${question.explanation.keyIdea} ${question.explanation.steps.join(" ")}`)), "Blocked learner wording found.");
  add("LIFECYCLE_LOCKS", !base.traceability.questionStudioDiscoverable && base.traceability.questionBankStatus === "NOT_STORED" && !base.traceability.questionBankWritable && base.traceability.testEligibility === "INELIGIBLE" && !base.traceability.testEligible && !base.traceability.mockTestEligible && !base.traceability.publiclyPublishable && !base.traceability.automaticStudentPublication && !base.traceability.productionReleaseAuthorized, "Review-only lifecycle widened.");
  return { valid: checks.every((check) => check.passed), checks } as const;
}

export function generateDi003GroupedBarV2Set(input: { seed: string; examProfile: Di003V2ExamProfile }): Di003V2QuestionSet {
  const seed = input.seed.trim();
  if (!seed) throw new Error("DI-003 V2 requires a non-empty seed.");
  const stimulus = buildStimulus(seed);
  const scaleValues = stimulus.points.flatMap((point) => [point.seriesA, point.seriesB]);
  const numericStep = Math.max(20, Math.min(...scaleValues) / 2);
  const selected = chooseMixedTasks(seed, buildDrafts(seed, stimulus));
  const setId = `DI-003-V2-${input.examProfile}-${hashSeed(`${seed}:${input.examProfile}`).toString(16).padStart(8, "0")}`;
  const questions: Di003V2Question[] = selected.map((draft, index) => {
    const optionResult = buildOptions({
      seed: `${seed}:${input.examProfile}:${draft.kind}:${index}`,
      optionCount: OPTION_COUNT[input.examProfile],
      answer: draft.answer,
      candidates: draft.candidates,
      numericStep,
      normalize: draft.normalize,
    });
    return {
      questionId: `${setId}-Q${index + 1}-${draft.kind}`,
      setId,
      kind: draft.kind,
      difficulty: draft.difficulty,
      stemSurfaceId: draft.stemSurfaceId,
      stem: draft.stem,
      options: optionResult.options,
      optionMetadata: optionResult.optionMetadata,
      correctIndex: optionResult.correctIndex,
      answer: draft.answer,
      explanation: draft.explanation,
      evidence: draft.evidence,
    };
  });
  const base = {
    packageId: "DI-003" as const,
    reviewVersion: "V2" as const,
    setId,
    seed,
    language: "en" as const,
    examProfile: input.examProfile,
    optionCount: OPTION_COUNT[input.examProfile],
    setDifficulty: "GROUPED_BAR_MIXED_V2" as const,
    stimulus,
    questions,
    traceability: {
      packageId: "DI-003" as const,
      representation: "GROUPED_BAR" as const,
      parentFoundation: "DI-001" as const,
      setContractVersion: "DI-003-SET-CONTRACT-V2" as const,
      arithmeticAuthority: "EXACT_SOURCE_WITH_EXPLICIT_WHOLE_ROUNDING" as const,
      reviewStatus: "UNREVIEWED" as const,
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
  const validation = validate(base);
  if (!validation.valid) throw new Error(`DI-003 V2 validation failed: ${validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ")}`);
  return { ...base, validation };
}

export function verifyDi003GroupedBarV2Set(set: Di003V2QuestionSet) {
  const { validation: _validation, ...base } = set;
  return validate(base).valid;
}
