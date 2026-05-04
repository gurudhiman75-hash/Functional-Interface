import type {
  DIDataRow,
  DIQuestion,
  DIPattern,
  DISetProfile,
  DISeriesConfig,
  DIVisualType,
  DifficultyLabel,
  GeneratorOptions,
  OptionMetadata,
  Pattern,
} from "../../core/generator-engine";
import {
  applyDifficultyMetadata,
  classifyDifficultyLabel,
  getDifficultyBucketTargets,
} from "../../core/difficulty";
import { buildPrompt } from "../../core/exam-realism";
import {
  attachReasoningTrace,
  buildComparisonPrompt,
  createReasoningStep,
  generateNumericOptions,
  randomInt,
  shuffle,
} from "../../shared";
import type {
  NumericDistractorConfig,
  OptionResult,
} from "../../shared";

type DIQuestionCore = {
  text: string;
  options: string[];
  correct: number;
  explanation: string;
  reasoningSteps?: string[];
  dependencyComplexity?: number;
  operationChain?: string[];
  optionMetadata?: OptionMetadata[];
};

type DIReasoningCategory =
  | "direct-arithmetic"
  | "comparative-reasoning"
  | "conditional-reasoning"
  | "trend-reasoning"
  | "multi-step-reasoning"
  | "cross-series-reasoning"
  | "set-logic";

function getCategoryLabel(
  di: DIPattern,
  index: number,
) {
  return (
    di.categories?.[index] ??
    `Category ${index + 1}`
  );
}

export function generateDISet(
  pattern: Pattern,
): DIDataRow[] {
  const di = pattern.diPattern;

  if (!di) {
    throw new Error(
      "DI pattern configuration is missing",
    );
  }

  if (!di.columns.length) {
    throw new Error(
      "DI pattern must include columns",
    );
  }

  const rows: DIDataRow[] = [];

  for (
    let i = 0;
    i < di.rowCount;
    i++
  ) {
    const row: DIDataRow = {};

    for (const column of di.columns) {
      const range =
        di.valueRanges[column];

      row[column] = range
        ? randomInt(
          range.min,
          range.max,
        )
        : getCategoryLabel(di, i);
    }

    rows.push(row);
  }

  return rows;
}

function selectSeriesCount(
  availableCount: number,
  visualType: DIVisualType,
) {
  if (availableCount <= 1) {
    return availableCount;
  }

  const roll = Math.random();

  if (visualType === "line") {
    if (
      availableCount >= 3 &&
      roll > 0.95
    ) {
      return 3;
    }

    if (roll > 0.65) {
      return 2;
    }

    return 1;
  }

  if (visualType === "bar") {
    if (
      availableCount >= 3 &&
      roll > 0.95
    ) {
      return 3;
    }

    if (roll > 0.75) {
      return 2;
    }

    return 1;
  }

  return 1;
}

export function getSeriesConfig(
  di: DIPattern,
  tableData: DIDataRow[],
  visualType: DIVisualType,
) {
  const numericColumns =
    getNumericColumns(tableData);

  if (di.series?.length) {
    return di.series.filter((series) =>
      numericColumns.includes(
        series.column,
      ),
    );
  }

  if (
    visualType !== "bar" &&
    visualType !== "line"
  ) {
    return undefined;
  }

  const seriesCount =
    selectSeriesCount(
      numericColumns.length,
      visualType,
    );

  return numericColumns
    .slice(0, seriesCount)
    .map(
      (column) => ({
        column,
        type: visualType,
        label: column,
      }),
    );
}

function getNumericColumns(
  tableData: DIDataRow[],
) {
  const firstRow = tableData[0];

  if (!firstRow) {
    return [];
  }

  return Object.keys(firstRow).filter(
    (key) =>
      typeof firstRow[key] === "number",
  );
}

function getCategoryColumn(
  tableData: DIDataRow[],
) {
  const firstRow = tableData[0];

  if (!firstRow) {
    return undefined;
  }

  return Object.keys(firstRow).find(
    (key) =>
      typeof firstRow[key] === "string",
  );
}

function generateChoiceOptions(
  choices: string[],
  correctChoice: string,
): OptionResult {
  const uniqueChoices = [
    ...new Set(choices),
  ];

  const shuffled =
    shuffle(uniqueChoices);

  return {
    options: shuffled,
    correct: shuffled.indexOf(
      correctChoice,
    ),
  };
}

function createNumericQuestion(
  text: string,
  correct: number,
  explanation: string,
  context?: NumericDistractorConfig,
): DIQuestionCore {
  const generated =
    generateNumericOptions(
      correct,
      context,
    );

  return {
    text,
    options: generated.options,
    correct: generated.correct,
    explanation,
    optionMetadata:
      generated.optionMetadata,
  };
}

function createCategoryQuestion(
  text: string,
  categories: string[],
  correctCategory: string,
  explanation: string,
): DIQuestionCore {
  const generated =
    generateChoiceOptions(
      categories,
      correctCategory,
    );

  return {
    text,
    options: generated.options,
    correct: generated.correct,
    explanation,
  };
}

function createChoiceQuestion(
  text: string,
  choices: string[],
  correctChoice: string,
  explanation: string,
): DIQuestionCore {
  const generated =
    generateChoiceOptions(
      choices,
      correctChoice,
    );

  return {
    text,
    options: generated.options,
    correct: generated.correct,
    explanation,
  };
}

function filterCategoryIndices(
  context: DIQuestionContext,
  predicate: (
    _value: number,
    _index: number,
  ) => boolean,
) {
  return context.values
    .map((value, index) => ({
      value,
      index,
    }))
    .filter(({ value, index }) =>
      predicate(value, index),
    )
    .map((entry) => entry.index);
}

function aggregateByIndices(
  values: number[],
  indices: number[],
) {
  return indices.reduce(
    (sum, index) =>
      sum + values[index],
    0,
  );
}


type DIQuestionContext = {
  tableData: DIDataRow[];
  visualType: DIVisualType;
  series?: DISeriesConfig[];
  categoryColumn: string;
  numericColumn: string;
  numericColumns: string[];
  values: number[];
  categories: string[];
  total: number;
  average: number;
  highestIndex: number;
  lowestIndex: number;
};

type DIQuestionGenerator = (
  context: DIQuestionContext,
) => DIQuestionCore | undefined;

type ConsecutiveComparison = {
  label: string;
  fromCategory: string;
  toCategory: string;
  fromValue: number;
  toValue: number;
  difference: number;
  absoluteDifference: number;
};

function createDIQuestionContext(
  tableData: DIDataRow[],
  visualType: DIVisualType,
  series: DISeriesConfig[] | undefined,
  categoryColumn: string,
  numericColumns: string[],
  numericColumn: string,
): DIQuestionContext {
  const values = tableData.map(
    (row) => Number(row[numericColumn]),
  );

  const categories = tableData.map(
    (row) => String(row[categoryColumn]),
  );

  const total = values.reduce(
    (sum, value) => sum + value,
    0,
  );

  const average = Math.round(
    total / values.length,
  );

  const highest = Math.max(...values);

  const lowest = Math.min(...values);

  const highestIndex =
    values.indexOf(highest);

  const lowestIndex =
    values.indexOf(lowest);

  return {
    tableData,
    visualType,
    series,
    categoryColumn,
    numericColumn,
    numericColumns,
    values,
    categories,
    total,
    average,
    highestIndex,
    lowestIndex,
  };
}

function generateTotalQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the total {numericColumn}?`,
        `Find the sum of {numericColumn} across all {categoryColumn} values.`,
      ],
      {
        numericColumn:
          context.numericColumn,
        categoryColumn:
          context.categoryColumn,
      },
    ),
    context.total,
    `Total ${context.numericColumn} = ${context.total}`,
  );
}

function generateAverageQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  return createNumericQuestion(
    buildPrompt(
      [
        `What is the average {numericColumn}?`,
        `Calculate the mean {numericColumn} for the given {categoryColumn} values.`,
      ],
      {
        numericColumn:
          context.numericColumn,
        categoryColumn:
          context.categoryColumn,
      },
    ),
    context.average,
    `Average ${context.numericColumn} = ${context.total} / ${context.values.length}`,
  );
}

function generateHighestQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  const correctCategory =
    context.categories[
    context.highestIndex
    ];

  return createCategoryQuestion(
    buildPrompt(
      [
        `Which {categoryColumn} had the highest {numericColumn}?`,
        `Identify the {categoryColumn} with the maximum {numericColumn}.`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    correctCategory,
    `${correctCategory} had the highest ${context.numericColumn}.`,
  );
}

function generateLowestQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  const correctCategory =
    context.categories[
    context.lowestIndex
    ];

  return createCategoryQuestion(
    buildPrompt(
      [
        `Which {categoryColumn} had the lowest {numericColumn}?`,
        `Identify the {categoryColumn} with the minimum {numericColumn}.`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    correctCategory,
    `${correctCategory} had the lowest ${context.numericColumn}.`,
  );
}

function generateDifferenceQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const difference = Math.abs(
    context.values[0] -
    context.values[1],
  );

  return createNumericQuestion(
    `What is the difference between ${firstCategory} and ${secondCategory} ${context.numericColumn}?`,
    difference,
    `Difference = ${difference}`,
  );
}

function generatePercentageQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const firstValue =
    context.values[0];

  const secondValue =
    context.values[1];

  const percentageIncrease =
    firstValue === 0
      ? 0
      : Math.round(
        ((secondValue - firstValue) /
          firstValue) *
        100,
      );

  return createNumericQuestion(
    buildPrompt(
      [
        `What is the percentage increase from {firstCategory} to {secondCategory} in {numericColumn}?`,
        `By what percent did {numericColumn} rise from {firstCategory} to {secondCategory}?`,
      ],
      {
        firstCategory,
        secondCategory,
        numericColumn:
          context.numericColumn,
      },
    ),
    percentageIncrease,
    `Percentage increase = ${percentageIncrease}%`,
  );
}

function getConsecutiveComparisons(
  context: DIQuestionContext,
): ConsecutiveComparison[] {
  const comparisons: ConsecutiveComparison[] =
    [];

  for (
    let i = 1;
    i < context.values.length;
    i++
  ) {
    const fromCategory =
      context.categories[i - 1];
    const toCategory =
      context.categories[i];
    const fromValue =
      context.values[i - 1];
    const toValue =
      context.values[i];
    const difference =
      toValue - fromValue;

    comparisons.push({
      label: `${fromCategory} to ${toCategory}`,
      fromCategory,
      toCategory,
      fromValue,
      toValue,
      difference,
      absoluteDifference:
        Math.abs(difference),
    });
  }

  return comparisons;
}

function getOverallTrend(
  values: number[],
) {
  const differences = values
    .slice(1)
    .map(
      (value, index) =>
        value - values[index],
    );

  if (
    differences.every(
      (difference) =>
        difference > 0,
    )
  ) {
    return "Increasing";
  }

  if (
    differences.every(
      (difference) =>
        difference < 0,
    )
  ) {
    return "Decreasing";
  }

  if (
    differences.every(
      (difference) =>
        difference === 0,
    )
  ) {
    return "No change";
  }

  return "Fluctuating";
}

function generateLineTrendQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const trend =
    getOverallTrend(context.values);

  return createChoiceQuestion(
    `What was the overall trend in ${context.numericColumn}?`,
    [
      "Increasing",
      "Decreasing",
      "Fluctuating",
      "No change",
    ],
    trend,
    `${context.numericColumn} was ${trend.toLowerCase()} across the given ${context.categoryColumn} values.`,
  );
}

function generateLineHighestPointQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  const correctCategory =
    context.categories[
    context.highestIndex
    ];

  return createCategoryQuestion(
    `During which ${context.categoryColumn} was ${context.numericColumn} highest?`,
    context.categories,
    correctCategory,
    `${context.numericColumn} was highest during ${correctCategory}.`,
  );
}

function generateLineLowestPointQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  const correctCategory =
    context.categories[
    context.lowestIndex
    ];

  return createCategoryQuestion(
    `During which ${context.categoryColumn} was ${context.numericColumn} lowest?`,
    context.categories,
    correctCategory,
    `${context.numericColumn} was lowest during ${correctCategory}.`,
  );
}

function generateLineGrowthQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (
    context.values.length < 2 ||
    context.values[0] === 0
  ) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];
  const lastCategory =
    context.categories[
    context.categories.length - 1
    ];
  const firstValue =
    context.values[0];
  const lastValue =
    context.values[
    context.values.length - 1
    ];
  const growth = Math.round(
    ((lastValue - firstValue) /
      firstValue) *
    100,
  );

  return createNumericQuestion(
    `What was the percentage growth in ${context.numericColumn} from ${firstCategory} to ${lastCategory}?`,
    growth,
    `Percentage growth = (${lastValue} - ${firstValue}) / ${firstValue} x 100 = ${growth}%`,
  );
}

function generateLineMaximumIncreaseQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const increases =
    getConsecutiveComparisons(
      context,
    ).filter(
      (comparison) =>
        comparison.difference > 0,
    );

  if (!increases.length) {
    return undefined;
  }

  const maximumIncrease =
    increases.reduce(
      (best, comparison) =>
        comparison.difference >
          best.difference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the increase in ${context.numericColumn} maximum?`,
    increases.map(
      (comparison) =>
        comparison.label,
    ),
    maximumIncrease.label,
    `The maximum increase was from ${maximumIncrease.fromCategory} to ${maximumIncrease.toCategory}: ${maximumIncrease.toValue} - ${maximumIncrease.fromValue} = ${maximumIncrease.difference}.`,
  );
}

function generateLineDeclineQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);
  const declines =
    comparisons.filter(
      (comparison) =>
        comparison.difference < 0,
    );

  if (!declines.length) {
    return undefined;
  }

  const firstDecline =
    declines[0];

  return createChoiceQuestion(
    `Which interval showed a decline in ${context.numericColumn}?`,
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    firstDecline.label,
    `${context.numericColumn} declined from ${firstDecline.fromCategory} to ${firstDecline.toCategory}: ${firstDecline.fromValue} to ${firstDecline.toValue}.`,
  );
}

function generateLineFluctuationQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const greatestFluctuation =
    comparisons.reduce(
      (best, comparison) =>
        comparison.absoluteDifference >
          best.absoluteDifference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the fluctuation in ${context.numericColumn} greatest?`,
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    greatestFluctuation.label,
    `The greatest fluctuation was from ${greatestFluctuation.fromCategory} to ${greatestFluctuation.toCategory}: |${greatestFluctuation.toValue} - ${greatestFluctuation.fromValue}| = ${greatestFluctuation.absoluteDifference}.`,
  );
}

function getPercentageShare(
  value: number,
  total: number,
) {
  return total === 0
    ? 0
    : Math.round(
      (value / total) * 100,
    );
}

function getGreatestCommonDivisor(
  a: number,
  b: number,
) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x || 1;
}

function formatRatio(
  first: number,
  second: number,
) {
  const divisor =
    getGreatestCommonDivisor(
      first,
      second,
    );

  return `${Math.round(first / divisor)}:${Math.round(second / divisor)}`;
}

function generateRatioOptions(
  first: number,
  second: number,
): OptionResult {
  const correct = formatRatio(
    first,
    second,
  );

  const options = new Set<string>();
  options.add(correct);
  options.add(
    formatRatio(second, first),
  );
  options.add(
    formatRatio(
      first + second,
      second,
    ),
  );
  options.add(
    formatRatio(
      first,
      first + second,
    ),
  );

  while (options.size < 4) {
    options.add(
      formatRatio(
        first + randomInt(1, 5),
        second + randomInt(1, 5),
      ),
    );
  }

  const shuffled = shuffle(
    [...options].slice(0, 4),
  );

  return {
    options: shuffled,
    correct:
      shuffled.indexOf(correct),
  };
}

function generatePercentageShareQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (!context.values.length) {
    return undefined;
  }

  const index = randomInt(
    0,
    context.values.length - 1,
  );

  const category =
    context.categories[index];

  const share = getPercentageShare(
    context.values[index],
    context.total,
  );

  return createNumericQuestion(
    `What percentage share does ${category} contribute to total ${context.numericColumn}?`,
    share,
    `${category} contributes approximately ${share}% of total ${context.numericColumn}.`,
  );
}

function generateLargestSectorQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  const correctCategory =
    context.categories[
    context.highestIndex
    ];

  return createCategoryQuestion(
    `Which ${context.categoryColumn} contributes the highest percentage?`,
    context.categories,
    correctCategory,
    `${correctCategory} has the largest contribution to total ${context.numericColumn}.`,
  );
}

function generateSmallestSectorQuestion(
  context: DIQuestionContext,
): DIQuestionCore {
  const correctCategory =
    context.categories[
    context.lowestIndex
    ];

  return createCategoryQuestion(
    `Which ${context.categoryColumn} has the smallest contribution?`,
    context.categories,
    correctCategory,
    `${correctCategory} has the smallest contribution to total ${context.numericColumn}.`,
  );
}

function generateRatioQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const generated =
    generateRatioOptions(
      context.values[0],
      context.values[1],
    );

  return {
    text:
      `What is the approximate ratio between ${firstCategory} and ${secondCategory}?`,
    options: generated.options,
    correct: generated.correct,
    explanation:
      `Ratio ${firstCategory}:${secondCategory} = ${formatRatio(
        context.values[0],
        context.values[1],
      )}`,
  };
}

function generateContributionQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const firstCategory =
    context.categories[0];

  const secondCategory =
    context.categories[1];

  const combinedShare =
    getPercentageShare(
      context.values[0] +
      context.values[1],
      context.total,
    );

  return createNumericQuestion(
    `What is the combined share of ${firstCategory} and ${secondCategory}?`,
    combinedShare,
    `${firstCategory} and ${secondCategory} together contribute approximately ${combinedShare}% of total ${context.numericColumn}.`,
  );
}

function getSeriesColumns(
  context: DIQuestionContext,
) {
  return (
    context.series?.map(
      (series) => series.column,
    ) ?? context.numericColumns
  );
}

function getPrimarySeriesPair(
  context: DIQuestionContext,
) {
  const seriesColumns =
    getSeriesColumns(context);

  if (seriesColumns.length < 2) {
    return undefined;
  }

  return {
    first: seriesColumns[0],
    second: seriesColumns[1],
  };
}

function getColumnNumericValues(
  context: DIQuestionContext,
  column: string,
) {
  return context.tableData.map((row) =>
    Number(row[column]),
  );
}

function getValueByCategory(
  context: DIQuestionContext,
  column: string,
  categoryIndex: number,
) {
  return Number(
    context.tableData[categoryIndex]?.[
    column
    ],
  );
}

function getRankedEntries(
  context: DIQuestionContext,
  values = context.values,
) {
  return context.categories
    .map((category, index) => ({
      category,
      index,
      value: values[index],
    }))
    .sort(
      (a, b) => b.value - a.value,
    );
}

function getValuesExcludingIndex(
  values: number[],
  excludedIndex: number,
) {
  return values.filter(
    (_value, index) =>
      index !== excludedIndex,
  );
}

function countAboveThreshold(
  values: number[],
  threshold: number,
) {
  return values.filter(
    (value) => value > threshold,
  ).length;
}

function generateSecondHighestQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 2) {
    return undefined;
  }

  const rankedEntries =
    getRankedEntries(context);
  const secondHighest =
    rankedEntries[1];

  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `Which {categoryColumn} recorded the second highest {numericColumn}?`,
        `Identify the {categoryColumn} with the second-largest {numericColumn}.`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    secondHighest.category,
    `${secondHighest.category} had the second highest ${context.numericColumn}.`,
  );
}

function generateClosestToAverageQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (!context.values.length) {
    return undefined;
  }

  const closestEntry =
    context.categories
      .map((category, index) => ({
        category,
        value: context.values[index],
        deviation: Math.abs(
          context.values[index] -
          context.average,
        ),
      }))
      .sort(
        (a, b) =>
          a.deviation - b.deviation,
      )[0];

  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `Which {categoryColumn} was closest to the average {numericColumn}?`,
        `For which {categoryColumn} was {numericColumn} nearest to its average value?`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    context.categories,
    closestEntry.category,
    `${closestEntry.category} was closest to the average ${context.numericColumn}.`,
  );
}

function generateMaximumGapQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const maximumGap =
    comparisons.reduce(
      (best, comparison) =>
        comparison.absoluteDifference >
          best.absoluteDifference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    buildComparisonPrompt(
      [
        `Across which consecutive {categoryColumn} values was the gap in {numericColumn} the largest?`,
        `Between which adjacent {categoryColumn}s was the maximum gap in {numericColumn} observed?`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        numericColumn:
          context.numericColumn,
      },
    ),
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    maximumGap.label,
    `The largest gap was ${maximumGap.absoluteDifference} between ${maximumGap.fromCategory} and ${maximumGap.toCategory}.`,
  );
}

function generateMinimumGapQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const minimumGap =
    comparisons.reduce(
      (best, comparison) =>
        comparison.absoluteDifference <
          best.absoluteDifference
          ? comparison
          : best,
    );

  return createChoiceQuestion(
    `Between which two consecutive ${context.categoryColumn}s was the gap in ${context.numericColumn} minimum?`,
    comparisons.map(
      (comparison) =>
        comparison.label,
    ),
    minimumGap.label,
    `The minimum gap was ${minimumGap.absoluteDifference} between ${minimumGap.fromCategory} and ${minimumGap.toCategory}.`,
  );
}

function generateAboveAverageCountQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const count = countAboveThreshold(
    context.values,
    context.average,
  );

  return createNumericQuestion(
    `How many ${context.categoryColumn}s had ${context.numericColumn} above the average?`,
    count,
    `${count} ${context.categoryColumn} values were above average ${context.numericColumn}.`,
  );
}

function generateExcludingTopLeaderQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 3) {
    return undefined;
  }

  const valuesExcludingHighest =
    getValuesExcludingIndex(
      context.values,
      context.highestIndex,
    );
  const remainingCategories =
    context.categories.filter(
      (_category, index) =>
        index !==
        context.highestIndex,
    );
  const remainingLeader =
    remainingCategories[
    valuesExcludingHighest.indexOf(
      Math.max(
        ...valuesExcludingHighest,
      ),
    )
    ];

  return createCategoryQuestion(
    `If ${context.categories[context.highestIndex]} is excluded, which ${context.categoryColumn} has the highest ${context.numericColumn}?`,
    remainingCategories,
    remainingLeader,
    `Excluding ${context.categories[context.highestIndex]}, ${remainingLeader} becomes the leader.`,
  );
}

function generateGroupedIntervalTotalQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 4) {
    return undefined;
  }

  const midpoint = Math.floor(
    context.values.length / 2,
  );
  const firstGroupTotal =
    context.values
      .slice(0, midpoint)
      .reduce(
        (sum, value) =>
          sum + value,
        0,
      );
  const secondGroupTotal =
    context.values
      .slice(midpoint)
      .reduce(
        (sum, value) =>
          sum + value,
        0,
      );
  const difference = Math.abs(
    firstGroupTotal -
    secondGroupTotal,
  );

  return createNumericQuestion(
    `What is the difference between the total ${context.numericColumn} of the first half and second half of the ${context.categoryColumn}s?`,
    difference,
    `The grouped total difference is ${difference}.`,
  );
}

function generateSubsetAverageQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 3) {
    return undefined;
  }

  const sorted =
    getRankedEntries(context);
  const subset =
    sorted.slice(0, 3);
  const subsetAverage = Math.round(
    subset.reduce(
      (sum, entry) =>
        sum + entry.value,
      0,
    ) / subset.length,
  );

  return createNumericQuestion(
    `What is the average ${context.numericColumn} of the top three ${context.categoryColumn}s?`,
    subsetAverage,
    `The average for the top three ${context.categoryColumn}s is ${subsetAverage}.`,
  );
}

function generateMaximumDifferenceBetweenSeriesQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const differences = firstValues.map(
    (value, index) =>
      Math.abs(
        value - secondValues[index],
      ),
  );
  const maxIndex =
    differences.indexOf(
      Math.max(...differences),
    );

  return createCategoryQuestion(
    buildComparisonPrompt(
      [
        `In which {categoryColumn} was the difference between {firstSeries} and {secondSeries} maximum?`,
        `Where was the gap between {firstSeries} and {secondSeries} the highest?`,
      ],
      {
        categoryColumn:
          context.categoryColumn,
        firstSeries:
          seriesPair.first,
        secondSeries:
          seriesPair.second,
      },
    ),
    context.categories,
    context.categories[maxIndex],
    `The maximum inter-series difference occurred at ${context.categories[maxIndex]}.`,
  );
}

function generateCombinedTotalByCategoryQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const categoryIndex = randomInt(
    0,
    context.categories.length - 1,
  );
  const combinedTotal =
    getValueByCategory(
      context,
      seriesPair.first,
      categoryIndex,
    ) +
    getValueByCategory(
      context,
      seriesPair.second,
      categoryIndex,
    );

  return createNumericQuestion(
    `What was the combined total of ${seriesPair.first} and ${seriesPair.second} in ${context.categories[categoryIndex]}?`,
    combinedTotal,
    `The combined total in ${context.categories[categoryIndex]} was ${combinedTotal}.`,
  );
}

function generateRatioBetweenSeriesQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const categoryIndex = randomInt(
    0,
    context.categories.length - 1,
  );
  const firstValue =
    getValueByCategory(
      context,
      seriesPair.first,
      categoryIndex,
    );
  const secondValue =
    getValueByCategory(
      context,
      seriesPair.second,
      categoryIndex,
    );
  const generated =
    generateRatioOptions(
      firstValue,
      secondValue,
    );

  return {
    text: `What was the ratio of ${seriesPair.first} to ${seriesPair.second} in ${context.categories[categoryIndex]}?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `The ratio in ${context.categories[categoryIndex]} was ${formatRatio(firstValue, secondValue)}.`,
  };
}

function generateConditionalCrossSeriesCountQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const threshold = Math.max(
    10,
    Math.round(
      Math.abs(
        firstValues.reduce(
          (sum, value, index) =>
            sum +
            (value -
              secondValues[index]),
          0,
        ) /
        firstValues.length,
      ),
    ),
  );
  const count = firstValues.filter(
    (value, index) =>
      value - secondValues[index] >
      threshold,
  ).length;

  return createNumericQuestion(
    `In how many ${context.categoryColumn}s did ${seriesPair.first} exceed ${seriesPair.second} by more than ${threshold}?`,
    count,
    `${seriesPair.first} exceeded ${seriesPair.second} by more than ${threshold} in ${count} ${context.categoryColumn} values.`,
  );
}

function generateRelativeGrowthComparisonQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const intervals =
    getConsecutiveComparisons({
      ...context,
      values: firstValues,
    });
  const secondIntervals =
    getConsecutiveComparisons({
      ...context,
      values: secondValues,
    });
  const betterInterval =
    intervals.find(
      (comparison, index) =>
        comparison.difference >
        (secondIntervals[index]
          ?.difference ?? 0),
    );

  if (!betterInterval) {
    return undefined;
  }

  return createChoiceQuestion(
    `Between which consecutive ${context.categoryColumn}s did ${seriesPair.first} increase more sharply than ${seriesPair.second}?`,
    intervals.map(
      (comparison) =>
        comparison.label,
    ),
    betterInterval.label,
    `${seriesPair.first} increased more sharply than ${seriesPair.second} over ${betterInterval.label}.`,
  );
}

function generateCrossoverAnalysisQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );

  for (let i = 1; i < firstValues.length; i++) {
    const previousGap =
      firstValues[i - 1] -
      secondValues[i - 1];
    const currentGap =
      firstValues[i] -
      secondValues[i];

    if (
      previousGap !== 0 &&
      currentGap !== 0 &&
      Math.sign(previousGap) !==
      Math.sign(currentGap)
    ) {
      const interval = `${context.categories[i - 1]} to ${context.categories[i]}`;

      return createChoiceQuestion(
        `Between which interval did ${seriesPair.first} and ${seriesPair.second} cross over each other?`,
        getConsecutiveComparisons(context).map(
          (comparison) =>
            comparison.label,
        ),
        interval,
        `The two series crossed over during ${interval}.`,
      );
    }
  }

  return undefined;
}

function generateComparativeFluctuationQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const getTotalFluctuation = (
    seriesColumn: string,
  ) =>
    getConsecutiveComparisons({
      ...context,
      values:
        getColumnNumericValues(
          context,
          seriesColumn,
        ),
    }).reduce(
      (sum, comparison) =>
        sum +
        comparison.absoluteDifference,
      0,
    );
  const firstFluctuation =
    getTotalFluctuation(
      seriesPair.first,
    );
  const secondFluctuation =
    getTotalFluctuation(
      seriesPair.second,
    );
  const answer =
    firstFluctuation >=
      secondFluctuation
      ? seriesPair.first
      : seriesPair.second;

  return createChoiceQuestion(
    `Which series showed greater fluctuation across the given ${context.categoryColumn} values?`,
    [
      seriesPair.first,
      seriesPair.second,
    ],
    answer,
    `${answer} showed the greater overall fluctuation.`,
  );
}

function generateLeastDeviationQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const leastDeviationEntry =
    context.categories
      .map((category, index) => ({
        category,
        deviation: Math.abs(
          context.values[index] -
          context.average,
        ),
      }))
      .sort(
        (a, b) =>
          a.deviation - b.deviation,
      )[0];

  const question =
    createCategoryQuestion(
      `Which ${context.categoryColumn} had the least deviation from the average ${context.numericColumn}?`,
      context.categories,
      leastDeviationEntry.category,
      `${leastDeviationEntry.category} had the least deviation from the average.`,
    );

  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average ${context.numericColumn}.`,
      ),
      createReasoningStep(
        "deviation",
        `Measure deviation of each ${context.categoryColumn} from that average.`,
      ),
      createReasoningStep(
        "rank",
        "Select the least deviation.",
      ),
    ],
    3,
  );
}

function generateFilteredLowestCrossSeriesQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const filterValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const filterAverage = Math.round(
    filterValues.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / filterValues.length,
  );
  const eligibleIndices =
    filterValues
      .map((value, index) => ({
        value,
        index,
      }))
      .filter(
        ({ value }) =>
          value > filterAverage,
      )
      .map((entry) => entry.index);

  if (!eligibleIndices.length) {
    return undefined;
  }

  const primaryValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const lowestPrimaryIndex =
    eligibleIndices.reduce(
      (bestIndex, currentIndex) =>
        primaryValues[currentIndex] <
          primaryValues[bestIndex]
          ? currentIndex
          : bestIndex,
    );
  const eligibleCategories =
    eligibleIndices.map(
      (index) =>
        context.categories[index],
    );
  const question =
    createCategoryQuestion(
      `Which ${context.categoryColumn} among those where ${seriesPair.second} exceeded its average had the lowest ${seriesPair.first}?`,
      eligibleCategories,
      context.categories[
      lowestPrimaryIndex
      ],
      `${context.categories[lowestPrimaryIndex]} had the lowest ${seriesPair.first} among the filtered ${context.categoryColumn} values.`,
    );

  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average of ${seriesPair.second}.`,
      ),
      createReasoningStep(
        "filter",
        `Keep only ${context.categoryColumn} values where ${seriesPair.second} exceeds its average.`,
      ),
      createReasoningStep(
        "compare",
        `Compare ${seriesPair.first} across the filtered subset.`,
      ),
      createReasoningStep(
        "rank",
        `Select the minimum ${seriesPair.first} from the filtered subset.`,
      ),
    ],
    4,
  );
}

function generateConditionalCombinedRatioQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const seriesPair =
    getPrimarySeriesPair(context);

  if (!seriesPair) {
    return undefined;
  }

  const firstValues =
    getColumnNumericValues(
      context,
      seriesPair.first,
    );
  const secondValues =
    getColumnNumericValues(
      context,
      seriesPair.second,
    );
  const secondAverage = Math.round(
    secondValues.reduce(
      (sum, value) =>
        sum + value,
      0,
    ) / secondValues.length,
  );
  const filteredIndices =
    filterCategoryIndices(
      {
        ...context,
        values: secondValues,
      },
      (value) => value > secondAverage,
    );

  if (filteredIndices.length < 2) {
    return undefined;
  }

  const combinedPrimary =
    aggregateByIndices(
      firstValues,
      filteredIndices,
    );
  const combinedSecondary =
    aggregateByIndices(
      secondValues,
      filteredIndices,
    );
  const generated =
    generateRatioOptions(
      combinedPrimary,
      combinedSecondary,
    );
  const question = {
    text: `What is the ratio of combined ${seriesPair.first} to combined ${seriesPair.second} in ${context.categoryColumn}s where ${seriesPair.second} exceeded its average?`,
    options: generated.options,
    correct: generated.correct,
    explanation: `The required ratio is ${formatRatio(combinedPrimary, combinedSecondary)}.`,
  };

  return attachReasoningTrace(
    question,
    [
      createReasoningStep(
        "average",
        `Compute the average of ${seriesPair.second}.`,
      ),
      createReasoningStep(
        "filter",
        `Select ${context.categoryColumn} values where ${seriesPair.second} exceeds its average.`,
      ),
      createReasoningStep(
        "aggregate",
        `Add ${seriesPair.first} and ${seriesPair.second} separately over the filtered subset.`,
      ),
      createReasoningStep(
        "ratio",
        "Form the ratio of the two combined totals.",
      ),
    ],
    5,
  );
}

type DIQuestionGeneratorPool = Record<
  DifficultyLabel,
  DIQuestionGenerator[]
>;

type DIReasoningArchetype = {
  id: string;
  category: DIReasoningCategory;
  difficulty: DifficultyLabel;
  visualTypes: DIVisualType[];
  requiresMultiSeries?: boolean;
  generate: DIQuestionGenerator;
};

function getColumnValues(
  context: DIQuestionContext,
  numericColumn: string,
) {
  return context.tableData.map(
    (row) => Number(row[numericColumn]),
  );
}

function getAlternateNumericColumn(
  context: DIQuestionContext,
) {
  return context.numericColumns.find(
    (column) =>
      column !== context.numericColumn,
  );
}

function getSortedIndices(
  values: number[],
) {
  return values
    .map((value, index) => ({
      value,
      index,
    }))
    .sort(
      (a, b) => b.value - a.value,
    )
    .map((entry) => entry.index);
}

function generateHighestAboveAverageQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.average === 0) {
    return undefined;
  }

  const highestCategory =
    context.categories[
    context.highestIndex
    ];
  const percentageAboveAverage = Math.round(
    ((context.values[
      context.highestIndex
    ] -
      context.average) /
      context.average) *
    100,
  );

  return createNumericQuestion(
    `By what percentage does ${highestCategory} exceed the average ${context.numericColumn}?`,
    percentageAboveAverage,
    `${highestCategory} exceeds average ${context.numericColumn} by ${percentageAboveAverage}%.`,
  );
}

function generateTopTwoCombinedShareQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 3) {
    return undefined;
  }

  const sortedIndices =
    getSortedIndices(context.values);
  const firstIndex =
    sortedIndices[0];
  const secondIndex =
    sortedIndices[1];
  const firstCategory =
    context.categories[firstIndex];
  const secondCategory =
    context.categories[secondIndex];
  const combinedShare =
    getPercentageShare(
      context.values[firstIndex] +
      context.values[secondIndex],
      context.total,
    );

  return createNumericQuestion(
    `What percentage of total ${context.numericColumn} is contributed together by ${firstCategory} and ${secondCategory}?`,
    combinedShare,
    `${firstCategory} and ${secondCategory} together contribute ${combinedShare}% of total ${context.numericColumn}.`,
  );
}

function generateAverageAbsoluteChangeQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (!comparisons.length) {
    return undefined;
  }

  const totalAbsoluteChange =
    comparisons.reduce(
      (sum, comparison) =>
        sum +
        comparison.absoluteDifference,
      0,
    );
  const averageAbsoluteChange =
    Math.round(
      totalAbsoluteChange /
      comparisons.length,
    );

  return createNumericQuestion(
    `What is the average fluctuation per interval in ${context.numericColumn}?`,
    averageAbsoluteChange,
    `Average fluctuation = ${totalAbsoluteChange} / ${comparisons.length} = ${averageAbsoluteChange}.`,
  );
}

function generateConditionalGapQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  if (context.values.length < 4) {
    return undefined;
  }

  const firstPair =
    context.values[0] +
    context.values[1];
  const secondPair =
    context.values[2] +
    context.values[3];
  const gap = Math.abs(
    firstPair - secondPair,
  );

  return createNumericQuestion(
    `What is the difference between the combined ${context.numericColumn} of ${context.categories[0]} and ${context.categories[1]} versus ${context.categories[2]} and ${context.categories[3]}?`,
    gap,
    `Combined totals differ by ${gap}.`,
  );
}

function generateCrossColumnCombinedLeaderQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const alternateColumn =
    getAlternateNumericColumn(context);

  if (!alternateColumn) {
    return undefined;
  }

  const alternateValues =
    getColumnValues(
      context,
      alternateColumn,
    );
  const combinedValues =
    context.values.map(
      (value, index) =>
        value + alternateValues[index],
    );
  const highestCombinedIndex =
    combinedValues.indexOf(
      Math.max(...combinedValues),
    );

  return createCategoryQuestion(
    `Which ${context.categoryColumn} has the highest combined total of ${context.numericColumn} and ${alternateColumn}?`,
    context.categories,
    context.categories[
    highestCombinedIndex
    ],
    `${context.categories[highestCombinedIndex]} has the highest combined total across ${context.numericColumn} and ${alternateColumn}.`,
  );
}

function generateCrossColumnRatioLeaderQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const alternateColumn =
    getAlternateNumericColumn(context);

  if (!alternateColumn) {
    return undefined;
  }

  const alternateValues =
    getColumnValues(
      context,
      alternateColumn,
    );
  const ratios = context.values.map(
    (value, index) =>
      alternateValues[index] === 0
        ? Number.POSITIVE_INFINITY
        : value /
        alternateValues[index],
  );
  const highestRatioIndex =
    ratios.indexOf(Math.max(...ratios));

  return createCategoryQuestion(
    `For which ${context.categoryColumn} is the ratio of ${context.numericColumn} to ${alternateColumn} the highest?`,
    context.categories,
    context.categories[
    highestRatioIndex
    ],
    `${context.categories[highestRatioIndex]} has the highest ${context.numericColumn}:${alternateColumn} ratio.`,
  );
}

function generateTrendReversalQuestion(
  context: DIQuestionContext,
): DIQuestionCore | undefined {
  const comparisons =
    getConsecutiveComparisons(context);

  if (comparisons.length < 2) {
    return undefined;
  }

  for (let i = 1; i < comparisons.length; i++) {
    const previous =
      comparisons[i - 1]
        .difference;
    const current =
      comparisons[i].difference;

    if (
      previous !== 0 &&
      current !== 0 &&
      Math.sign(previous) !==
      Math.sign(current)
    ) {
      const turningCategory =
        context.categories[i];

      return createCategoryQuestion(
        `At which ${context.categoryColumn} did the trend in ${context.numericColumn} reverse direction?`,
        context.categories.slice(
          1,
          context.categories.length - 1,
        ),
        turningCategory,
        `The trend reversed at ${turningCategory}.`,
      );
    }
  }

  return undefined;
}

const DI_REASONING_ARCHETYPES: DIReasoningArchetype[] = [
  { id: "total", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["table", "bar"], generate: generateTotalQuestion },
  { id: "highest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["table", "bar", "line"], generate: generateHighestQuestion },
  { id: "lowest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["table", "bar", "line"], generate: generateLowestQuestion },
  { id: "difference", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["table", "bar"], generate: generateDifferenceQuestion },
  { id: "line-trend", category: "trend-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineTrendQuestion },
  { id: "line-highest-point", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineHighestPointQuestion },
  { id: "line-lowest-point", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["line"], generate: generateLineLowestPointQuestion },
  { id: "pie-largest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["pie"], generate: generateLargestSectorQuestion },
  { id: "pie-smallest", category: "comparative-reasoning", difficulty: "Easy", visualTypes: ["pie"], generate: generateSmallestSectorQuestion },
  { id: "pie-share", category: "direct-arithmetic", difficulty: "Easy", visualTypes: ["pie"], generate: generatePercentageShareQuestion },
  { id: "second-highest", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateSecondHighestQuestion },
  { id: "closest-to-average", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateClosestToAverageQuestion },
  { id: "least-deviation", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateLeastDeviationQuestion },
  { id: "average", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateAverageQuestion },
  { id: "percentage", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generatePercentageQuestion },
  { id: "pie-ratio", category: "direct-arithmetic", difficulty: "Medium", visualTypes: ["pie"], generate: generateRatioQuestion },
  { id: "contribution", category: "set-logic", difficulty: "Medium", visualTypes: ["table", "bar", "pie"], generate: generateContributionQuestion },
  { id: "minimum-gap", category: "comparative-reasoning", difficulty: "Medium", visualTypes: ["table", "bar", "line"], generate: generateMinimumGapQuestion },
  { id: "above-average-count", category: "conditional-reasoning", difficulty: "Medium", visualTypes: ["table", "bar"], generate: generateAboveAverageCountQuestion },
  { id: "line-growth", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineGrowthQuestion },
  { id: "line-maximum-increase", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineMaximumIncreaseQuestion },
  { id: "line-decline", category: "trend-reasoning", difficulty: "Medium", visualTypes: ["line"], generate: generateLineDeclineQuestion },
  { id: "series-max-diff", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateMaximumDifferenceBetweenSeriesQuestion },
  { id: "series-combined-total", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateCombinedTotalByCategoryQuestion },
  { id: "series-ratio", category: "cross-series-reasoning", difficulty: "Medium", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateRatioBetweenSeriesQuestion },
  { id: "highest-above-average", category: "conditional-reasoning", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateHighestAboveAverageQuestion },
  { id: "top-two-combined-share", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "pie"], generate: generateTopTwoCombinedShareQuestion },
  { id: "conditional-gap", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateConditionalGapQuestion },
  { id: "grouped-interval-total", category: "set-logic", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateGroupedIntervalTotalQuestion },
  { id: "subset-average", category: "set-logic", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateSubsetAverageQuestion },
  { id: "excluding-top-leader", category: "conditional-reasoning", difficulty: "Hard", visualTypes: ["table", "bar"], generate: generateExcludingTopLeaderQuestion },
  { id: "average-absolute-change", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateAverageAbsoluteChangeQuestion },
  { id: "trend-reversal", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateTrendReversalQuestion },
  { id: "line-fluctuation", category: "trend-reasoning", difficulty: "Hard", visualTypes: ["line"], generate: generateLineFluctuationQuestion },
  { id: "cross-column-combined-leader", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], requiresMultiSeries: true, generate: generateCrossColumnCombinedLeaderQuestion },
  { id: "cross-column-ratio-leader", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], requiresMultiSeries: true, generate: generateCrossColumnRatioLeaderQuestion },
  { id: "filtered-lowest-cross-series", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateFilteredLowestCrossSeriesQuestion },
  { id: "conditional-combined-ratio", category: "multi-step-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateConditionalCombinedRatioQuestion },
  { id: "series-conditional-count", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["bar", "line"], requiresMultiSeries: true, generate: generateConditionalCrossSeriesCountQuestion },
  { id: "series-relative-growth", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateRelativeGrowthComparisonQuestion },
  { id: "series-crossover", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateCrossoverAnalysisQuestion },
  { id: "series-comparative-fluctuation", category: "cross-series-reasoning", difficulty: "Hard", visualTypes: ["line"], requiresMultiSeries: true, generate: generateComparativeFluctuationQuestion },
  { id: "maximum-gap", category: "comparative-reasoning", difficulty: "Hard", visualTypes: ["table", "bar", "line"], generate: generateMaximumGapQuestion },
];

function getQuestionGeneratorPool(
  context: DIQuestionContext,
): DIQuestionGeneratorPool {
  const hasMultipleSeries =
    getSeriesColumns(context).length > 1;
  const archetypes =
    DI_REASONING_ARCHETYPES.filter(
      (archetype) =>
        archetype.visualTypes.includes(
          context.visualType,
        ) &&
        (!archetype.requiresMultiSeries ||
          hasMultipleSeries),
    );

  return {
    Easy: archetypes.filter((archetype) => archetype.difficulty === "Easy").map((archetype) => archetype.generate),
    Medium: archetypes.filter((archetype) => archetype.difficulty === "Medium").map((archetype) => archetype.generate),
    Hard: archetypes.filter((archetype) => archetype.difficulty === "Hard").map((archetype) => archetype.generate),
  };
}

function getDefaultDISetProfile(
  options?: GeneratorOptions,
): DISetProfile {
  if (options?.setProfile) {
    return options.setProfile;
  }

  if (
    options?.difficultyDistribution
  ) {
    return "balanced";
  }

  if (
    options?.targetDifficulty !==
    undefined ||
    options?.targetAverageDifficulty !==
    undefined
  ) {
    return "balanced";
  }

  return "progressive";
}

function getDefaultSlotTargets(
  count: number,
  setProfile: DISetProfile,
): Record<DifficultyLabel, number> {
  if (setProfile === "uniform") {
    return {
      Easy: 0,
      Medium: count,
      Hard: 0,
    };
  }

  if (setProfile === "spike") {
    return {
      Easy: count >= 4 ? 1 : 0,
      Medium:
        count >= 4 ? count - 2 : count - 1,
      Hard: 1,
    };
  }

  if (setProfile === "balanced") {
    return {
      Easy: count >= 4 ? 1 : 0,
      Medium:
        count >= 3 ? count - 2 : count - 1,
      Hard: 1,
    };
  }

  return {
    Easy: Math.max(
      1,
      Math.floor(count / 5),
    ),
    Hard: Math.max(
      1,
      Math.ceil(count / 3),
    ),
    Medium: Math.max(
      0,
      count -
      Math.max(
        1,
        Math.floor(count / 5),
      ) -
      Math.max(
        1,
        Math.ceil(count / 3),
      ),
    ),
  };
}

function getUniformDifficultyLabel(
  options?: GeneratorOptions,
): DifficultyLabel {
  const targetScore =
    options?.targetAverageDifficulty ??
    options?.targetDifficulty ??
    5.5;

  return classifyDifficultyLabel(
    targetScore,
  );
}

function buildDifficultySlots(
  count: number,
  options?: GeneratorOptions,
) {
  const setProfile =
    getDefaultDISetProfile(options);

  if (setProfile === "uniform") {
    return {
      setProfile,
      slots: Array.from(
        { length: count },
        () =>
          getUniformDifficultyLabel(
            options,
          ),
      ),
    };
  }

  const targets =
    options?.difficultyDistribution
      ? getDifficultyBucketTargets(
        count,
        options.difficultyDistribution,
      )
      : getDefaultSlotTargets(
        count,
        setProfile,
      );
  const slots: DifficultyLabel[] =
    [];

  if (setProfile === "spike") {
    slots.push(...Array.from(
      { length: targets.Medium },
      () => "Medium" as const,
    ));

    if (targets.Easy > 0) {
      slots.unshift("Easy");
    }

    if (targets.Hard > 0) {
      slots.push("Hard");
    }
  } else if (setProfile === "balanced") {
    if (targets.Easy > 0) {
      slots.push("Easy");
    }

    slots.push(
      ...Array.from(
        { length: targets.Medium },
        () => "Medium" as const,
      ),
    );

    if (targets.Hard > 0) {
      slots.push("Hard");
    }
  } else {
    slots.push(
      ...Array.from(
        { length: targets.Easy },
        () => "Easy" as const,
      ),
      ...Array.from(
        { length: targets.Medium },
        () => "Medium" as const,
      ),
      ...Array.from(
        { length: targets.Hard },
        () => "Hard" as const,
      ),
    );
  }

  while (slots.length < count) {
    slots.push("Medium");
  }

  return {
    setProfile,
    slots: slots.slice(0, count),
  };
}

function getSlotTargetScore(
  slot: DifficultyLabel,
) {
  switch (slot) {
    case "Easy":
      return 2.5;
    case "Hard":
      return 8.5;
    case "Medium":
    default:
      return 5.5;
  }
}

function buildDIQuestionCandidates(
  context: DIQuestionContext,
  generators: DIQuestionGenerator[],
) {
  return generators
    .map((generator) =>
      generator(context),
    )
    .filter(
      (
        question,
      ): question is DIQuestionCore =>
        Boolean(question),
    )
    .map((question) =>
      applyDifficultyMetadata(
        question,
        {
          kind: "di",
          text: question.text,
          explanation:
            question.explanation,
          visualType:
            context.visualType,
          rowCount:
            context.tableData.length,
          numericColumnCount:
            context.numericColumns.length,
          reasoningSteps:
            question.reasoningSteps,
          dependencyComplexity:
            question.dependencyComplexity,
          operationChain:
            question.operationChain,
        },
      ),
    );
}

function selectQuestionForSlot(
  slot: DifficultyLabel,
  candidates: DIQuestion[],
  usedQuestions: Set<string>,
) {
  const matching = candidates
    .filter(
      (candidate) =>
        candidate.difficultyLabel ===
        slot &&
        !usedQuestions.has(
          candidate.text,
        ),
    )
    .sort(
      (a, b) =>
        Math.abs(
          a.difficultyScore -
          getSlotTargetScore(slot),
        ) -
        Math.abs(
          b.difficultyScore -
          getSlotTargetScore(slot),
        ),
    );

  if (matching.length) {
    return matching[0];
  }

  return candidates
    .filter(
      (candidate) =>
        !usedQuestions.has(
          candidate.text,
        ),
    )
    .sort(
      (a, b) =>
        Math.abs(
          a.difficultyScore -
          getSlotTargetScore(slot),
        ) -
        Math.abs(
          b.difficultyScore -
          getSlotTargetScore(slot),
        ),
    )[0];
}

function summarizeDISetDifficulty(
  questions: DIQuestion[],
  setProfile: DISetProfile,
) {
  const totalDifficulty =
    questions.reduce(
      (sum, question) =>
        sum +
        question.difficultyScore,
      0,
    );

  return {
    averageDifficulty:
      Number(
        (
          totalDifficulty /
          questions.length
        ).toFixed(1),
      ),
    peakDifficulty:
      Math.max(
        ...questions.map(
          (question) =>
            question.difficultyScore,
        ),
      ),
    difficultySpread: setProfile,
    setProfile,
  };
}

export function generateDIQuestions(
  tableData: DIDataRow[],
  visualType: DIVisualType,
  series: DISeriesConfig[] | undefined,
  options?: GeneratorOptions,
): {
  questions: DIQuestion[];
  averageDifficulty: number;
  peakDifficulty: number;
  difficultySpread: DISetProfile;
  setProfile: DISetProfile;
} {
  const categoryColumn =
    getCategoryColumn(tableData);

  const numericColumns =
    series?.length
      ? series.map(
        (seriesConfig) =>
          seriesConfig.column,
      )
      : getNumericColumns(tableData);

  if (
    !categoryColumn ||
    !numericColumns.length
  ) {
    return {
      questions: [],
      averageDifficulty: 0,
      peakDifficulty: 0,
      difficultySpread:
        getDefaultDISetProfile(
          options,
        ),
      setProfile:
        getDefaultDISetProfile(
          options,
        ),
    };
  }

  const { slots, setProfile } =
    buildDifficultySlots(
      5,
      options,
    );
  const usedQuestions = new Set<
    string
  >();
  const selectedQuestions: DIQuestion[] =
    [];

  slots.forEach((slot, slotIndex) => {
    const numericColumn =
      numericColumns[
      slotIndex %
      numericColumns.length
      ];
    const context =
      createDIQuestionContext(
        tableData,
        visualType,
        series,
        categoryColumn,
        numericColumns,
        numericColumn,
      );
    const generatorPool =
      getQuestionGeneratorPool(
        context,
      );
    const candidates =
      buildDIQuestionCandidates(
        context,
        generatorPool[slot],
      );
    const selected =
      selectQuestionForSlot(
        slot,
        candidates,
        usedQuestions,
      );

    if (selected) {
      usedQuestions.add(
        selected.text,
      );
      selectedQuestions.push(selected);
    }
  });

  if (!selectedQuestions.length) {
    return {
      questions: [],
      averageDifficulty: 0,
      peakDifficulty: 0,
      difficultySpread: setProfile,
      setProfile,
    };
  }

  return {
    questions: selectedQuestions,
    ...summarizeDISetDifficulty(
      selectedQuestions,
      setProfile,
    ),
  };
}


