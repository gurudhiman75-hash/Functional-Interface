import type {
  DifficultyLabel,
  OptionMetadata,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import type {
  QuantScenarioContext,
} from "../quant/realization";
import {
  createReasoningStep,
  pickRandomItem,
  shuffle,
} from "../shared";
import type { QuantProceduralScenario } from "./time-work-scenarios";

type AveragesScenarioFactory = (
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
) => QuantProceduralScenario;

type AveragesScenarioDraft = Omit<
  QuantProceduralScenario,
  "customOptionBundle" | "structuralSignature" | "subjectContext" | "validationTokens"
> & {
  motifId: string;
  scenarioLogicBranch: string;
  distractorValues: Array<{
    value: number | string;
    type:
      | "wrongIntermediateValue"
      | "arithmeticSlip"
      | "comparisonTrap"
      | "wrongDenominator"
      | "prematureRounding"
      | "cumulativeMistake"
      | "ratioInversion";
    likelyMistake: string;
    reasoningTrap: string;
  }>;
  highPlausibilityValue: number | string;
  validationTokens: string[];
};

function buildAveragesContext(
  context = "averages",
  metric = "required value",
): QuantScenarioContext {
  return {
    entity: "group",
    metric,
    context,
  };
}

function roundTo(
  value: number,
  decimals = 2,
): number {
  return Number(
    value.toFixed(decimals),
  );
}

function formatOptionValue(
  value: number | string,
): string {
  if (typeof value === "string") {
    return value;
  }
  if (Number.isInteger(value)) {
    return String(value);
  }
  return Number(value.toFixed(2)).toString();
}

function buildOptionBundle(
  correctAnswer: number,
  distractors: AveragesScenarioDraft["distractorValues"],
  highPlausibilityValue: number | string,
): {
  options: string[];
  correct: number;
  optionMetadata: OptionMetadata[];
} {
  const correctLabel = formatOptionValue(
    correctAnswer,
  );
  const options: OptionMetadata[] = [
    {
      value: correctLabel,
      isCorrect: true,
    },
    ...distractors.slice(0, 2).map(
      (distractor) => ({
        value: formatOptionValue(
          distractor.value,
        ),
        isCorrect: false,
        distractorType:
          distractor.type,
        likelyMistake:
          distractor.likelyMistake,
        reasoningTrap:
          distractor.reasoningTrap,
      }),
    ),
    {
      value: formatOptionValue(
        highPlausibilityValue,
      ),
      isCorrect: false,
      distractorType:
        "arithmeticSlip",
      likelyMistake:
        "Chose a nearby plausible value without resolving the full chain.",
      reasoningTrap:
        "High-plausibility near-miss distractor.",
    },
  ];
  const uniqueByValue =
    new Map<string, OptionMetadata>();
  for (const option of options) {
    if (
      !uniqueByValue.has(option.value)
    ) {
      uniqueByValue.set(
        option.value,
        option,
      );
    }
  }
  let finalOptions = [
    ...uniqueByValue.values(),
  ];
  while (finalOptions.length < 4) {
    const fallbackValue =
      String(
        Number(correctAnswer) +
          finalOptions.length +
          1,
      );
    if (
      !uniqueByValue.has(
        fallbackValue,
      )
    ) {
      const fallbackOption = {
        value: fallbackValue,
        isCorrect: false,
        distractorType:
          "arithmeticSlip" as const,
        likelyMistake:
          "Made a close arithmetic slip.",
        reasoningTrap:
          "Fallback near-value trap.",
      };
      uniqueByValue.set(
        fallbackValue,
        fallbackOption,
      );
      finalOptions.push(
        fallbackOption,
      );
    }
  }
  finalOptions = shuffle(finalOptions);
  return {
    options: finalOptions.map(
      (option) => option.value,
    ),
    correct: finalOptions.findIndex(
      (option) => option.isCorrect,
    ),
    optionMetadata: finalOptions,
  };
}

function buildStructuralSignature(
  motifId: string,
  branch: string,
  values: Record<string, number>,
): string {
  const numericProfile = Object.values(
    values,
  )
    .map((value) =>
      Number.isInteger(value)
        ? "i"
        : "f",
    )
    .join("");
  return `${motifId}::${branch}::${numericProfile}::${Object.keys(values).length}`;
}

function finalizeAveragesScenario(
  draft: AveragesScenarioDraft,
): QuantProceduralScenario {
  return {
    ...draft,
    customOptionBundle:
      buildOptionBundle(
        draft.correctAnswer,
        draft.distractorValues,
        draft.highPlausibilityValue,
      ),
    structuralSignature:
      buildStructuralSignature(
        draft.motifId,
        draft.scenarioLogicBranch,
        draft.values,
      ),
    subjectContext: {
      variant: "default",
    },
    validationTokens:
      draft.validationTokens,
  };
}

function isFriendlyNumber(
  value: number,
): boolean {
  return (
    Number.isInteger(value) ||
    Math.abs(
      value * 2 -
        Math.round(value * 2),
    ) < 1e-9 ||
    Math.abs(
      value * 3 -
        Math.round(value * 3),
    ) < 1e-9
  );
}

export function createSumRecoveryScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const countPools = {
    Easy: [5, 7, 8, 9, 10],
    Medium: [8, 10, 12, 15, 18],
    Hard: [12, 15, 18, 20, 24],
  } as const;
  const averagePools = {
    Easy: [18, 20, 22, 24, 25],
    Medium: [24, 26, 28, 30, 32, 35],
    Hard: [27, 29, 31, 34, 36, 40],
  } as const;

  const count = pickRandomItem(
    countPools[difficulty],
  );
  const average = pickRandomItem(
    averagePools[difficulty],
  );
  const totalSum = count * average;
  const missingOffsets =
    difficulty === "Easy"
      ? [-4, -2, 1, 3, 5]
      : difficulty === "Medium"
        ? [-6, -3, 2, 4, 7]
        : [-8, -5, 3, 6, 9];
  const missingNumber =
    average +
    pickRandomItem(missingOffsets);
  const knownSum =
    totalSum - missingNumber;
  const prompt = pickRandomItem([
    `The average of ${count} numbers is ${average}. If the sum of all but one number is ${knownSum}, find the missing number.`,
    `The average marks of ${count} students is ${average}. If the total of ${count - 1} students is ${knownSum}, find the marks of the remaining student.`,
    `The average weight of ${count} bags is ${average}. If the total weight of all but one bag is ${knownSum}, find the weight of the remaining bag.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType: "sum-recovery",
    topicCluster: "averages",
    motifId: "basic-mean-construction",
    scenarioLogicBranch:
      "missing-value-total-reconstruction",
    values: {
      count,
      average,
      totalSum,
      knownSum,
      missingNumber,
    },
    formula: "totalSum - knownSum",
    text: prompt,
    correctAnswer: missingNumber,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Total sum = ${average} x ${count} = ${totalSum}.`,
      ),
      createReasoningStep(
        "infer",
        `Missing number = ${totalSum} - ${knownSum} = ${missingNumber}.`,
      ),
    ],
    context: buildAveragesContext(
      "missing value reconstruction",
      "missing number",
    ),
    distractorValues: [
      {
        value: average,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Used the average itself as the missing value.",
        reasoningTrap:
          "Average mistaken for the hidden observation.",
      },
      {
        value: knownSum / count,
        type: "wrongDenominator",
        likelyMistake:
          "Divided the known total by the full count instead of using total reconstruction.",
        reasoningTrap:
          "Denominator lag trap.",
      },
    ],
    highPlausibilityValue:
      missingNumber +
      (difficulty === "Hard" ? 2 : 1),
    validationTokens: [
      "average",
      "sum",
      "find",
    ],
  });
}

export function createOverlapAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const windows =
    difficulty === "Hard"
      ? [7, 8]
      : [6, 7];

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const window = pickRandomItem(
      windows,
    );
    const totalCount =
      2 * window - 1;
    const overallAverage =
      pickRandomItem(
        difficulty === "Easy"
          ? [24, 27, 30]
          : difficulty === "Medium"
            ? [30, 33, 36, 40]
            : [35, 40, 45, 50],
      );
    const middleNumber =
      overallAverage +
      pickRandomItem(
        difficulty === "Easy"
          ? [-2, 0, 3]
          : difficulty === "Medium"
            ? [-3, 1, 4]
            : [-5, -1, 4, 7],
      );
    const firstAverage =
      pickRandomItem(
        difficulty === "Easy"
          ? [overallAverage - 1, overallAverage, overallAverage + 1]
          : difficulty === "Medium"
            ? [overallAverage - 2, overallAverage, overallAverage + 2]
            : [overallAverage - 3, overallAverage - 1, overallAverage + 2],
      );
    const totalSum =
      totalCount *
      overallAverage;
    const firstSum =
      window * firstAverage;
    const lastSum =
      totalSum +
      middleNumber -
      firstSum;

    if (lastSum % window !== 0) {
      continue;
    }

    const lastAverage =
      lastSum / window;
    const prompt = pickRandomItem([
      `The average of the first ${window} numbers is ${firstAverage}, the average of the last ${window} numbers is ${lastAverage}, and the average of all the ${totalCount} numbers is ${overallAverage}. Find the middle number.`,
      `The average production of the first ${window} months is ${firstAverage} units, the average of the last ${window} months is ${lastAverage} units, and the average of all ${totalCount} months is ${overallAverage} units. Find the overlapping month's production.`,
      `The average score in the first ${window} matches is ${firstAverage}, the average in the last ${window} matches is ${lastAverage}, and the average over all ${totalCount} matches is ${overallAverage}. Find the score in the common match.`,
    ]);

    return finalizeAveragesScenario({
      scenarioType:
        "overlap-average-reconstruction",
      topicCluster: "averages",
      motifId:
        "overlap-boundary-logic",
      scenarioLogicBranch:
        "middle-overlap-recovery",
      values: {
        window,
        totalCount,
        totalSum,
        firstAverage,
        lastAverage,
        middleNumber,
      },
      formula:
        "window * firstAverage + window * lastAverage - totalCount * overallAverage",
      text: prompt,
      correctAnswer: middleNumber,
      distractorHints: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Sum of the first ${window} numbers = ${firstAverage} x ${window} = ${firstSum}, and sum of the last ${window} numbers = ${lastAverage} x ${window} = ${lastSum}.`,
        ),
        createReasoningStep(
          "transform",
          `When these two sums are added, the middle number is counted twice.`,
        ),
        createReasoningStep(
          "infer",
          `Middle number = ${firstSum} + ${lastSum} - ${totalSum} = ${middleNumber}.`,
        ),
      ],
      context: buildAveragesContext(
        "overlapping averages",
        "middle number",
      ),
      distractorValues: [
        {
          value:
            firstSum + lastSum,
          type: "cumulativeMistake",
          likelyMistake:
            "Added the two window sums without removing the overlap.",
          reasoningTrap:
            "Overlap double-count trap.",
        },
        {
          value:
            totalSum - firstSum,
          type: "wrongIntermediateValue",
          likelyMistake:
            "Used one partial subtraction as the final answer.",
          reasoningTrap:
            "Boundary sum misread as overlap.",
        },
      ],
      highPlausibilityValue:
        middleNumber +
        window,
      validationTokens: [
        "first",
        "last",
        "average of all",
      ],
    });
  }

  return createSumRecoveryScenario(
    difficulty,
  );
}

export function createCorrectionScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Easy: [
      {
        count: 20,
        correctedAverage: 28,
        actual: 16,
        wrong: 36,
      },
      {
        count: 24,
        correctedAverage: 32,
        actual: 48,
        wrong: 24,
      },
      {
        count: 30,
        correctedAverage: 35,
        actual: 59,
        wrong: 29,
      },
    ],
    Medium: [
      {
        count: 20,
        correctedAverage: 42,
        actual: 61,
        wrong: 41,
      },
      {
        count: 24,
        correctedAverage: 48,
        actual: 27,
        wrong: 51,
      },
      {
        count: 30,
        correctedAverage: 56,
        actual: 42,
        wrong: 12,
      },
    ],
    Hard: [
      {
        count: 40,
        correctedAverage: 47,
        actual: 64,
        wrong: 24,
      },
      {
        count: 30,
        correctedAverage: 53,
        actual: 37,
        wrong: 67,
      },
      {
        count: 60,
        correctedAverage: 61,
        actual: 88,
        wrong: 28,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(templates[difficulty]),
  };
  const reportedAverage = roundTo(
    values.correctedAverage +
      (values.wrong - values.actual) /
        values.count,
    2,
  );
  const prompt = pickRandomItem([
    `The average of ${values.count} numbers was calculated as ${reportedAverage} when one number ${values.actual} was wrongly written as ${values.wrong}. Find the correct average.`,
    `The average marks of ${values.count} students were reported as ${reportedAverage} because ${values.actual} was entered as ${values.wrong}. Find the correct average.`,
    `In a survey of ${values.count} households, the average monthly figure was recorded as ${reportedAverage} after ${values.actual} was misread as ${values.wrong}. Find the corrected average.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "correction-delta-adjustment",
    topicCluster: "averages",
    motifId:
      "correction-misread-data",
    scenarioLogicBranch:
      "single-entry-correction",
    values: {
      ...values,
      reportedAverage,
    },
    formula:
      "reportedAverage + (actual - wrong) / count",
    text: prompt,
    correctAnswer:
      values.correctedAverage,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `The total was distorted by ${values.wrong - values.actual}.`,
      ),
      createReasoningStep(
        "infer",
        `Correct average = ${reportedAverage} + (${values.actual} - ${values.wrong}) / ${values.count} = ${values.correctedAverage}.`,
      ),
    ],
    context: buildAveragesContext(
      "correction adjustment",
      "correct average",
    ),
    distractorValues: [
      {
        value:
          reportedAverage +
          (values.actual -
            values.wrong),
        type: "wrongIntermediateValue",
        likelyMistake:
          "Adjusted the average directly instead of spreading the correction across the full count.",
        reasoningTrap:
          "Average-only manipulation trap.",
      },
      {
        value:
          reportedAverage -
          (values.actual -
            values.wrong) /
            values.count,
        type: "comparisonTrap",
        likelyMistake:
          "Applied the correction in the wrong direction.",
        reasoningTrap:
          "Inverted deviation trap.",
      },
    ],
    highPlausibilityValue:
      values.correctedAverage + 1,
    validationTokens: [
      "wrongly written",
      "correct average",
    ],
  });
}

export function createReplacementScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const counts = {
    Easy: [8, 10, 12],
    Medium: [12, 15, 18, 20],
    Hard: [15, 18, 20, 24],
  } as const;
  const changes = {
    Easy: [1, 2, 3],
    Medium: [2, 3, 4, 5],
    Hard: [3, 4, 5, 6],
  } as const;
  const count = pickRandomItem(
    counts[difficulty],
  );
  const averageChange =
    pickRandomItem(changes[difficulty]);
  const correctAnswer =
    count * averageChange;
  const prompt = pickRandomItem([
    `In a class of ${count} students, one student is replaced by another and the average marks increase by ${averageChange}. Find the difference between the marks of the new student and the old student.`,
    `The average weight of ${count} sailors in a boat increases by ${averageChange} when one man is replaced by another. Find the difference between their weights.`,
    `In a mandi, the average weight of ${count} wheat bags rises by ${averageChange} when one bag is replaced. Find the difference between the new and old bag.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "replacement-average-shift",
    topicCluster: "averages",
    motifId:
      "replacement-shift-net",
    scenarioLogicBranch:
      "single-replacement-delta",
    values: {
      count,
      averageChange,
    },
    formula:
      "count * averageChange",
    text: prompt,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Average change x count gives the total change in sum.`,
      ),
      createReasoningStep(
        "infer",
        `Required difference = ${averageChange} x ${count} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "replacement",
      "difference",
    ),
    distractorValues: [
      {
        value: averageChange,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Treated the average shift itself as the answer.",
        reasoningTrap:
          "Shift not scaled by count.",
      },
      {
        value:
          count + averageChange,
        type: "comparisonTrap",
        likelyMistake:
          "Combined count and shift additively instead of multiplying.",
        reasoningTrap:
          "Additive trap in replacement logic.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + count,
    validationTokens: [
      "replaced",
      "average",
      "increase",
    ],
  });
}

export function createNewEntrantScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const counts = {
    Easy: [24, 30, 36],
    Medium: [30, 36, 40, 45],
    Hard: [40, 45, 50, 60],
  } as const;
  const oldAveragePool = {
    Easy: [14, 18, 22, 25],
    Medium: [24, 28, 32, 35],
    Hard: [27, 31, 36, 42],
  } as const;
  const deltaPool = {
    Easy: [1, 2],
    Medium: [1, 2, 3],
    Hard: [2, 3, 4],
  } as const;

  const count = pickRandomItem(
    counts[difficulty],
  );
  const oldAverage =
    pickRandomItem(
      oldAveragePool[difficulty],
    );
  const averageChange =
    pickRandomItem(
      deltaPool[difficulty],
    );
  const newAverage =
    oldAverage + averageChange;
  const correctAnswer =
    (count + 1) * newAverage -
    count * oldAverage;
  const prompt = pickRandomItem([
    `The average age of ${count} students is ${oldAverage} years. When the age of a new entrant is included, the average becomes ${newAverage} years. Find the age of the new entrant.`,
    `The average monthly expenditure of ${count} family members is ${oldAverage} thousand rupees. After a new dependent is included, the average becomes ${newAverage}. Find the expenditure of the new member.`,
    `The average score of ${count} kabaddi players is ${oldAverage}. After a new player joins, the team average becomes ${newAverage}. Find the new player's score.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "replacement-average-shift",
    topicCluster: "averages",
    motifId:
      "incremental-join-leave",
    scenarioLogicBranch:
      "single-entrant-reconstruction",
    values: {
      count,
      oldAverage,
      newAverage,
      averageChange,
    },
    formula:
      "(count + 1) * newAverage - count * oldAverage",
    text: prompt,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Old total = ${count} x ${oldAverage} = ${count * oldAverage}. New total = ${count + 1} x ${newAverage} = ${(count + 1) * newAverage}.`,
      ),
      createReasoningStep(
        "infer",
        `New entrant's age = ${(count + 1) * newAverage} - ${count * oldAverage} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "new entrant",
      "entrant value",
    ),
    distractorValues: [
      {
        value:
          (count + 1) *
          averageChange,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Used only the average increase across the new count.",
        reasoningTrap:
          "Join-only delta trap.",
      },
      {
        value:
          count * newAverage -
          count * oldAverage,
        type: "wrongDenominator",
        likelyMistake:
          "Forgot that the new total is based on count plus one.",
        reasoningTrap:
          "Denominator lag after joining.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + oldAverage,
    validationTokens: [
      "new entrant",
      "average becomes",
    ],
  });
}

export function createWeightedAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Easy: [
      {
        groupA: 20,
        groupB: 30,
        averageA: 20,
        averageB: 25,
      },
      {
        groupA: 15,
        groupB: 25,
        averageA: 16,
        averageB: 24,
      },
      {
        groupA: 12,
        groupB: 18,
        averageA: 18,
        averageB: 23,
      },
    ],
    Medium: [
      {
        groupA: 24,
        groupB: 36,
        averageA: 26,
        averageB: 34,
      },
      {
        groupA: 28,
        groupB: 42,
        averageA: 32,
        averageB: 28,
      },
      {
        groupA: 25,
        groupB: 40,
        averageA: 27,
        averageB: 22,
      },
    ],
    Hard: [
      {
        groupA: 32,
        groupB: 48,
        averageA: 42,
        averageB: 36,
      },
      {
        groupA: 35,
        groupB: 45,
        averageA: 38,
        averageB: 30,
      },
      {
        groupA: 27,
        groupB: 33,
        averageA: 44,
        averageB: 28,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(templates[difficulty]),
  };
  const sumA =
    values.groupA *
    values.averageA;
  const sumB =
    values.groupB *
    values.averageB;
  const correctAnswer =
    roundTo(
      (sumA + sumB) /
        (values.groupA + values.groupB),
      2,
    );
  const prompt = pickRandomItem([
    `The average marks of ${values.groupA} students is ${values.averageA} and the average marks of ${values.groupB} students is ${values.averageB}. Find the average marks of all the students together.`,
    `Section A has ${values.groupA} students with average score ${values.averageA}, and Section B has ${values.groupB} students with average score ${values.averageB}. Find the combined average.`,
    `One panchayat cluster has ${values.groupA} households with average income ${values.averageA}, while another has ${values.groupB} households with average income ${values.averageB}. Find the combined average income.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "group-weighted-average",
    topicCluster: "averages",
    motifId:
      "weighted-composite-avg",
    scenarioLogicBranch:
      "direct-group-merge",
    values: {
      ...values,
      sumA,
      sumB,
    },
    formula:
      "(sumA + sumB) / (groupA + groupB)",
    text: prompt,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Group sums are ${values.groupA} x ${values.averageA} = ${sumA} and ${values.groupB} x ${values.averageB} = ${sumB}.`,
      ),
      createReasoningStep(
        "infer",
        `Combined average = (${sumA} + ${sumB}) / ${values.groupA + values.groupB} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "weighted average",
      "combined average",
    ),
    distractorValues: [
      {
        value:
          roundTo(
            (values.averageA +
              values.averageB) /
              2,
            2,
          ),
        type: "comparisonTrap",
        likelyMistake:
          "Took the simple mean of the two group averages.",
        reasoningTrap:
          "Simple mean fallacy.",
      },
      {
        value:
          roundTo(
            (sumA + sumB) /
              values.groupA,
            2,
          ),
        type: "wrongDenominator",
        likelyMistake:
          "Used only one group size in the denominator.",
        reasoningTrap:
          "Weighted denominator trap.",
      },
    ],
    highPlausibilityValue:
      roundTo(correctAnswer + 1, 2),
    validationTokens: [
      "average",
      "students",
      "together",
    ],
  });
}

export function createWeightedRatioScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Easy: [
      {
        total: 45,
        averageA: 18,
        averageB: 12,
        combinedAverage: 14,
      },
      {
        total: 40,
        averageA: 30,
        averageB: 24,
        combinedAverage: 27,
      },
      {
        total: 54,
        averageA: 28,
        averageB: 22,
        combinedAverage: 24,
      },
    ],
    Medium: [
      {
        total: 72,
        averageA: 42,
        averageB: 36,
        combinedAverage: 38,
      },
      {
        total: 84,
        averageA: 58,
        averageB: 46,
        combinedAverage: 50,
      },
      {
        total: 90,
        averageA: 32,
        averageB: 24,
        combinedAverage: 28,
      },
    ],
    Hard: [
      {
        total: 96,
        averageA: 68,
        averageB: 56,
        combinedAverage: 62,
      },
      {
        total: 108,
        averageA: 74,
        averageB: 62,
        combinedAverage: 66,
      },
      {
        total: 120,
        averageA: 45,
        averageB: 35,
        combinedAverage: 39,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(templates[difficulty]),
  };
  const ratioA =
    values.combinedAverage -
    values.averageB;
  const ratioB =
    values.averageA -
    values.combinedAverage;
  const totalRatio =
    ratioA + ratioB;
  const correctAnswer =
    (values.total * ratioA) /
    totalRatio;
  const prompt = pickRandomItem([
    `The average age of boys in a class is ${values.averageA} years and that of girls is ${values.averageB} years. If the average age of the whole class is ${values.combinedAverage} years and the total number of students is ${values.total}, find the number of boys.`,
    `Two sections have average marks ${values.averageA} and ${values.averageB}. If the combined average is ${values.combinedAverage} and the total number of students is ${values.total}, find the number in the first section.`,
    `Two groups of mandi workers have average daily outputs ${values.averageA} and ${values.averageB}. If the overall average is ${values.combinedAverage} for ${values.total} workers, find the number in the first group.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "group-weighted-average",
    topicCluster: "averages",
    motifId:
      "weighted-composite-avg",
    scenarioLogicBranch:
      "ratio-backsolve-weighted-group",
    values: {
      ...values,
      ratioA,
      ratioB,
    },
    formula:
      "(total * ratioA) / (ratioA + ratioB)",
    text: prompt,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Use weighted balancing. Boys : girls = (${values.combinedAverage} - ${values.averageB}) : (${values.averageA} - ${values.combinedAverage}) = ${ratioA} : ${ratioB}.`,
      ),
      createReasoningStep(
        "infer",
        `Number of boys = ${values.total} x ${ratioA} / (${ratioA} + ${ratioB}) = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "weighted ratio reconstruction",
      "number of boys",
    ),
    distractorValues: [
      {
        value:
          values.total / 2,
        type: "comparisonTrap",
        likelyMistake:
          "Assumed both groups are equal in size because the overall average is central.",
        reasoningTrap:
          "Simple mean fallacy.",
      },
      {
        value:
          (values.total * ratioB) /
          totalRatio,
        type: "ratioInversion",
        likelyMistake:
          "Reversed the alligation-style group ratio.",
        reasoningTrap:
          "Ratio flip trap.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + ratioA,
    validationTokens: [
      "total number",
      "whole class",
      "find the number",
    ],
  });
}

export function createConsecutiveScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  if (difficulty === "Easy") {
    const count = pickRandomItem([
      5, 7, 9,
    ]);
    const average = pickRandomItem([
      20, 25, 30, 35,
    ]);
    const halfSpan =
      (count - 1) / 2;
    const correctAnswer =
      average + halfSpan;

    return finalizeAveragesScenario({
      scenarioType:
        "consecutive-middle-term",
      topicCluster: "averages",
      motifId:
        "symmetry-consecutive",
      scenarioLogicBranch:
        "odd-consecutive-middle-term",
      values: {
        count,
        average,
        halfSpan,
      },
      formula:
        "average + halfSpan",
      text: `The average of ${count} consecutive integers is ${average}. Find the greatest integer.`,
      correctAnswer,
      distractorHints: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `For an odd number of consecutive integers, the average is the middle term.`,
        ),
        createReasoningStep(
          "infer",
          `Greatest integer = ${average} + ${halfSpan} = ${correctAnswer}.`,
        ),
      ],
      context: buildAveragesContext(
        "consecutive numbers",
        "greatest integer",
      ),
      distractorValues: [
        {
          value: average,
          type: "wrongIntermediateValue",
          likelyMistake:
            "Took the average as the largest term.",
          reasoningTrap:
            "Middle-term confusion.",
        },
        {
          value:
            average + count,
          type: "comparisonTrap",
          likelyMistake:
            "Added the full count instead of half the spread.",
          reasoningTrap:
            "Consecutive spread trap.",
        },
      ],
      highPlausibilityValue:
        correctAnswer - 1,
      validationTokens: [
        "consecutive",
        "greatest",
      ],
    });
  }

  const start =
    pickRandomItem(
      difficulty === "Medium"
        ? [6, 10, 14, 18]
        : [12, 20, 28, 36],
    );
  const numbers = [
    start,
    start + 2,
    start + 4,
    start + 6,
  ];
  const average =
    numbers.reduce(
      (sum, value) => sum + value,
      0,
    ) / numbers.length;
  const correctAnswer =
    numbers[numbers.length - 1];

  return finalizeAveragesScenario({
    scenarioType:
      "consecutive-middle-term",
    topicCluster: "averages",
    motifId:
      "symmetry-consecutive",
    scenarioLogicBranch:
      "even-consecutive-reconstruction",
    values: {
      start,
      average,
    },
    formula: "start + 6",
    text: `The average of four consecutive even numbers is ${average}. Find the largest number.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Let the numbers be ${start}, ${start + 2}, ${start + 4}, and ${start + 6}.`,
      ),
      createReasoningStep(
        "infer",
        `The largest number is ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "consecutive numbers",
      "largest number",
    ),
    distractorValues: [
      {
        value: average,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Used the average itself as the largest number.",
        reasoningTrap:
          "Middle-pair confusion.",
      },
      {
        value:
          correctAnswer - 2,
        type: "comparisonTrap",
        likelyMistake:
          "Stopped at the second-largest term.",
        reasoningTrap:
          "Off-by-one term trap.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + 2,
    validationTokens: [
      "consecutive even",
      "largest",
    ],
  });
}

export function createAgeAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  if (difficulty === "Easy") {
    const count = pickRandomItem([
      4, 5, 6, 8,
    ]);
    const currentAverage =
      pickRandomItem([
        18, 20, 22, 25,
      ]);
    const yearsLater =
      pickRandomItem([
        3, 4, 5,
      ]);
    const correctAnswer =
      currentAverage +
      yearsLater;
    const prompt = pickRandomItem([
      `The present average age of ${count} members of a family is ${currentAverage} years. What will be their average age after ${yearsLater} years?`,
      `The average age of ${count} panchayat members is ${currentAverage} years. What will be their average age after ${yearsLater} years?`,
    ]);

    return finalizeAveragesScenario({
      scenarioType:
        "age-average-shift",
      topicCluster: "averages",
      motifId:
        "incremental-join-leave",
      scenarioLogicBranch:
        "uniform-age-forward-shift",
      values: {
        count,
        currentAverage,
        yearsLater,
      },
      formula:
        "currentAverage + yearsLater",
      text: prompt,
      correctAnswer,
      distractorHints: [
        "wrongIntermediateValue",
      ],
      reasoningSteps: [
        createReasoningStep(
          "transform",
          `Each member grows older by ${yearsLater} years, so the average also increases by ${yearsLater}.`,
        ),
        createReasoningStep(
          "infer",
          `Future average = ${currentAverage} + ${yearsLater} = ${correctAnswer}.`,
        ),
      ],
      context: buildAveragesContext(
        "age average",
        "future average",
      ),
      distractorValues: [
        {
          value:
            currentAverage *
            yearsLater,
          type: "wrongIntermediateValue",
          likelyMistake:
            "Multiplied average by years instead of shifting it.",
          reasoningTrap:
            "Uniform shift misunderstood as growth.",
        },
        {
          value:
            currentAverage +
            count,
          type: "comparisonTrap",
          likelyMistake:
            "Added the group size instead of the year shift.",
          reasoningTrap:
            "Count intrudes into age-shift logic.",
        },
      ],
      highPlausibilityValue:
        correctAnswer + 1,
      validationTokens: [
        "average age",
        "after",
      ],
    });
  }

  if (difficulty === "Medium") {
    const count = pickRandomItem([
      6, 7, 8, 9,
    ]);
    const currentAverage =
      pickRandomItem([
        22, 24, 26, 28, 30,
      ]);
    const youngestAge =
      pickRandomItem([
        4, 5, 6, 7,
      ]);
    const totalSum =
      count * currentAverage;
    const correctAnswer =
      (totalSum -
        count * youngestAge) /
      count;
    const prompt = pickRandomItem([
      `The average age of a family of ${count} members is ${currentAverage} years. If the age of the youngest member is ${youngestAge} years, what was the average age of the family at the birth of the youngest member?`,
      `The average age of ${count} team members is ${currentAverage} years. If the youngest member is ${youngestAge} years old, what was the average age when that member was born?`,
    ]);

    return finalizeAveragesScenario({
      scenarioType:
        "age-average-shift",
      topicCluster: "averages",
      motifId:
        "incremental-join-leave",
      scenarioLogicBranch:
        "youngest-birth-backsolve",
      values: {
        count,
        currentAverage,
        youngestAge,
        totalSum,
      },
      formula:
        "(totalSum - count * youngestAge) / count",
      text: prompt,
      correctAnswer,
      distractorHints: [
        "wrongIntermediateValue",
        "comparisonTrap",
      ],
      reasoningSteps: [
        createReasoningStep(
          "aggregate",
          `Present total age = ${count} x ${currentAverage} = ${totalSum}.`,
        ),
        createReasoningStep(
          "transform",
          `At the birth of the youngest member, every member was ${youngestAge} years younger.`,
        ),
        createReasoningStep(
          "infer",
          `Past average = (${totalSum} - ${count} x ${youngestAge}) / ${count} = ${correctAnswer}.`,
        ),
      ],
      context: buildAveragesContext(
        "age average",
        "past average",
      ),
      distractorValues: [
        {
          value:
            currentAverage -
            youngestAge,
          type: "wrongIntermediateValue",
          likelyMistake:
            "Subtracted the youngest age directly from the average.",
          reasoningTrap:
            "Average-only age shift trap.",
        },
        {
          value:
            (totalSum -
              youngestAge) /
            count,
          type: "wrongDenominator",
          likelyMistake:
            "Reduced only one age instead of all ages by the same amount.",
          reasoningTrap:
            "Uniform time shift failure.",
        },
      ],
      highPlausibilityValue:
        correctAnswer + 1,
      validationTokens: [
        "youngest member",
        "birth",
      ],
    });
  }

  const count = pickRandomItem([
    8, 10, 12, 14,
  ]);
  const futureAverage =
    pickRandomItem([
      33, 36, 40, 42,
    ]);
  const yearsLater =
    pickRandomItem([
      3, 4, 5, 6,
    ]);
  const correctAnswer =
    futureAverage - yearsLater;
  const prompt = pickRandomItem([
    `The average age of ${count} members of a family after ${yearsLater} years will be ${futureAverage}. Find their present average age.`,
    `The average age of ${count} workers after ${yearsLater} years will be ${futureAverage}. Find their present average age.`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "age-average-shift",
    topicCluster: "averages",
    motifId:
      "incremental-join-leave",
    scenarioLogicBranch:
      "reverse-uniform-age-shift",
    values: {
      count,
      futureAverage,
      yearsLater,
    },
    formula:
      "futureAverage - yearsLater",
    text: prompt,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Average age increases by the same number of years as time passes.`,
      ),
      createReasoningStep(
        "infer",
        `Present average = ${futureAverage} - ${yearsLater} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "age average",
      "present average",
    ),
    distractorValues: [
      {
        value:
          futureAverage +
          yearsLater,
        type: "comparisonTrap",
        likelyMistake:
          "Moved in the wrong time direction.",
        reasoningTrap:
          "Reverse shift sign error.",
      },
      {
        value:
          futureAverage -
          count,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Used the group size instead of years.",
        reasoningTrap:
          "Count substituted for time shift.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + 2,
    validationTokens: [
      "after",
      "present average",
    ],
  });
}

export function createScoreTargetScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Easy: [
      {
        completed: 4,
        targetTotalCount: 5,
        currentAverage: 52,
        targetAverage: 55,
      },
      {
        completed: 5,
        targetTotalCount: 6,
        currentAverage: 48,
        targetAverage: 50,
      },
      {
        completed: 6,
        targetTotalCount: 7,
        currentAverage: 60,
        targetAverage: 62,
      },
    ],
    Medium: [
      {
        completed: 7,
        targetTotalCount: 8,
        currentAverage: 58,
        targetAverage: 61,
      },
      {
        completed: 8,
        targetTotalCount: 10,
        currentAverage: 46,
        targetAverage: 50,
      },
      {
        completed: 9,
        targetTotalCount: 10,
        currentAverage: 63,
        targetAverage: 65,
      },
    ],
    Hard: [
      {
        completed: 10,
        targetTotalCount: 12,
        currentAverage: 54,
        targetAverage: 58,
      },
      {
        completed: 12,
        targetTotalCount: 15,
        currentAverage: 47,
        targetAverage: 51,
      },
      {
        completed: 11,
        targetTotalCount: 13,
        currentAverage: 62,
        targetAverage: 66,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(sets[difficulty]),
  };
  const achievedSum =
    values.completed *
    values.currentAverage;
  const targetSum =
    values.targetTotalCount *
    values.targetAverage;
  const remainingPapers =
    values.targetTotalCount -
    values.completed;
  const correctAnswer =
    (targetSum - achievedSum) /
    remainingPapers;
  const prompt = pickRandomItem([
    `A student has obtained an average of ${values.currentAverage} marks in ${values.completed} tests. What average marks must the student score in the remaining ${remainingPapers} test${remainingPapers > 1 ? "s" : ""} to secure an overall average of ${values.targetAverage} in ${values.targetTotalCount} tests?`,
    `A player has an average score of ${values.currentAverage} in ${values.completed} matches. What average is required in the remaining ${remainingPapers} match${remainingPapers > 1 ? "es" : ""} to finish with an overall average of ${values.targetAverage} in ${values.targetTotalCount} matches?`,
  ]);

  return finalizeAveragesScenario({
    scenarioType:
      "score-target-reconstruction",
    topicCluster: "averages",
    motifId:
      "cricket-performance",
    scenarioLogicBranch:
      "target-average-reconstruction",
    values: {
      ...values,
      achievedSum,
      targetSum,
      remainingPapers,
    },
    formula:
      "(targetSum - achievedSum) / remainingPapers",
    text: prompt,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Marks already obtained = ${values.completed} x ${values.currentAverage} = ${achievedSum}. Required total = ${values.targetTotalCount} x ${values.targetAverage} = ${targetSum}.`,
      ),
      createReasoningStep(
        "infer",
        `Required average in the remaining tests = (${targetSum} - ${achievedSum}) / ${remainingPapers} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "score reconstruction",
      "required average",
    ),
    distractorValues: [
      {
        value:
          values.targetAverage -
          values.currentAverage,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Subtracted the averages directly instead of working with totals.",
        reasoningTrap:
          "Target-average delta trap.",
      },
      {
        value:
          targetSum - achievedSum,
        type: "cumulativeMistake",
        likelyMistake:
          "Computed total marks required but forgot to divide by the remaining tests.",
        reasoningTrap:
          "Missing final normalization.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + remainingPapers,
    validationTokens: [
      "overall average",
      "remaining",
    ],
  });
}

export function createInningsAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const templates = {
    Easy: [
      { innings: 12, newScore: 63, increase: 2 },
      { innings: 15, newScore: 58, increase: 3 },
      { innings: 10, newScore: 49, increase: 1 },
    ],
    Medium: [
      { innings: 18, newScore: 72, increase: 2 },
      { innings: 20, newScore: 85, increase: 3 },
      { innings: 16, newScore: 66, increase: 2 },
    ],
    Hard: [
      { innings: 24, newScore: 96, increase: 2 },
      { innings: 25, newScore: 101, increase: 3 },
      { innings: 22, newScore: 88, increase: 2 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(templates[difficulty]),
  };
  const previousAverage =
    values.newScore -
    values.increase *
      values.innings;
  const correctAnswer =
    previousAverage +
    values.increase;

  return finalizeAveragesScenario({
    scenarioType:
      "replacement-average-shift",
    topicCluster: "averages",
    motifId:
      "cricket-performance",
    scenarioLogicBranch:
      "innings-average-rise",
    values: {
      ...values,
      previousAverage,
    },
    formula:
      "previousAverage + increase",
    text: `A batsman in the ${values.innings}th innings makes a score of ${values.newScore} runs and thereby increases the average by ${values.increase} runs. What is the average after the ${values.innings}th innings?`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `Let the average before the last innings be x. Then (${values.innings - 1})x + ${values.newScore} = (${values.innings})(x + ${values.increase}).`,
      ),
      createReasoningStep(
        "aggregate",
        `Solving gives previous average = ${previousAverage}.`,
      ),
      createReasoningStep(
        "infer",
        `Average after the ${values.innings}th innings = ${previousAverage} + ${values.increase} = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "innings average",
      "new average",
    ),
    distractorValues: [
      {
        value:
          previousAverage,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Reported the old average instead of the new one.",
        reasoningTrap:
          "Pre-update performance trap.",
      },
      {
        value:
          values.newScore /
          values.innings,
        type: "wrongDenominator",
        likelyMistake:
          "Used the last innings score directly over total innings.",
        reasoningTrap:
          "Single-innings denominator trap.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + values.increase,
    validationTokens: [
      "innings",
      "increases the average",
    ],
  });
}

export function createAverageSpeedScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const speedPairs = {
    Easy: [
      { speed1: 60, speed2: 90 },
      { speed1: 40, speed2: 60 },
      { speed1: 30, speed2: 45 },
    ],
    Medium: [
      { speed1: 48, speed2: 72 },
      { speed1: 54, speed2: 81 },
      { speed1: 50, speed2: 75 },
    ],
    Hard: [
      { speed1: 36, speed2: 54 },
      { speed1: 45, speed2: 72 },
      { speed1: 63, speed2: 84 },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      speedPairs[difficulty],
    ),
  };
  const correctAnswer =
    roundTo(
      (2 *
        values.speed1 *
        values.speed2) /
        (values.speed1 +
          values.speed2),
      2,
    );

  return finalizeAveragesScenario({
    scenarioType:
      "average-speed-harmonic",
    topicCluster: "averages",
    motifId:
      "weighted-composite-avg",
    scenarioLogicBranch:
      "equal-distance-average-speed",
    values,
    formula:
      "(2 * speed1 * speed2) / (speed1 + speed2)",
    text: `A car travels from A to B at ${values.speed1} km/h and returns from B to A at ${values.speed2} km/h over the same distance. Find its average speed for the whole journey.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "transform",
        `For equal distances, average speed is not the arithmetic mean of the two speeds.`,
      ),
      createReasoningStep(
        "infer",
        `Average speed = 2 x ${values.speed1} x ${values.speed2} / (${values.speed1} + ${values.speed2}) = ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "average speed",
      "average speed",
    ),
    distractorValues: [
      {
        value:
          roundTo(
            (values.speed1 +
              values.speed2) /
              2,
            2,
          ),
        type: "comparisonTrap",
        likelyMistake:
          "Used arithmetic mean for equal-distance average speed.",
        reasoningTrap:
          "Simple mean fallacy.",
      },
      {
        value:
          roundTo(
            (values.speed1 *
              values.speed2) /
              (values.speed1 +
                values.speed2),
            2,
          ),
        type: "wrongDenominator",
        likelyMistake:
          "Forgot the factor of 2 in the harmonic average.",
        reasoningTrap:
          "Half-harmonic trap.",
        },
      ],
    highPlausibilityValue:
      roundTo(correctAnswer + 1, 2),
    validationTokens: [
      "same distance",
      "average speed",
    ],
  });
}

export function createMultiStageAverageScenario(
  difficulty: DifficultyLabel,
): QuantProceduralScenario {
  const sets = {
    Medium: [
      {
        count: 10,
        initialAverage: 24,
        leaveValue: 18,
        newAverage: 25,
      },
      {
        count: 12,
        initialAverage: 30,
        leaveValue: 24,
        newAverage: 31,
      },
      {
        count: 8,
        initialAverage: 28,
        leaveValue: 20,
        newAverage: 29,
      },
    ],
    Hard: [
      {
        count: 15,
        initialAverage: 32,
        leaveValue: 24,
        newAverage: 33,
      },
      {
        count: 18,
        initialAverage: 27,
        leaveValue: 19,
        newAverage: 28,
      },
      {
        count: 20,
        initialAverage: 35,
        leaveValue: 29,
        newAverage: 36,
      },
    ],
  } as const;
  const values = {
    ...pickRandomItem(
      difficulty === "Hard"
        ? sets.Hard
        : sets.Medium,
    ),
  };
  const initialSum =
    values.count *
    values.initialAverage;
  const reducedSum =
    initialSum -
    values.leaveValue;
  const correctAnswer =
    values.newAverage *
      values.count -
    reducedSum;

  return finalizeAveragesScenario({
    scenarioType:
      "multi-stage-average-update",
    topicCluster: "averages",
    motifId:
      "incremental-join-leave",
    scenarioLogicBranch:
      "leave-then-join-reconstruction",
    values: {
      ...values,
      initialSum,
      reducedSum,
    },
    formula:
      "newAverage * count - reducedSum",
    text: `The average age of ${values.count} students is ${values.initialAverage}. One student of age ${values.leaveValue} leaves the class and another student joins. The average age of the class again becomes ${values.newAverage}. Find the age of the new student.`,
    correctAnswer,
    distractorHints: [
      "wrongIntermediateValue",
      "comparisonTrap",
    ],
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        `Initial total age = ${values.count} x ${values.initialAverage} = ${initialSum}.`,
      ),
      createReasoningStep(
        "transform",
        `After one student leaves, the remaining total = ${initialSum} - ${values.leaveValue} = ${reducedSum}.`,
      ),
      createReasoningStep(
        "infer",
        `Final total must be ${values.count} x ${values.newAverage}, so the new student's age is ${correctAnswer}.`,
      ),
    ],
    context: buildAveragesContext(
      "multi-stage transformation",
      "new value",
    ),
    distractorValues: [
      {
        value:
          values.newAverage *
          (values.count - 1) -
          reducedSum,
        type: "wrongDenominator",
        likelyMistake:
          "Used the reduced count in the final state as well.",
        reasoningTrap:
          "Denominator lag across stages.",
      },
      {
        value:
          initialSum -
          reducedSum,
        type: "wrongIntermediateValue",
        likelyMistake:
          "Returned the leaving value effect instead of the new entrant's age.",
        reasoningTrap:
          "State loss after first transformation.",
      },
    ],
    highPlausibilityValue:
      correctAnswer + 2,
    validationTokens: [
      "leaves",
      "another student joins",
      "again becomes",
    ],
  });
}

export function createAveragesScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  const scenarioFactoriesByMotif: Record<
    string,
    AveragesScenarioFactory[]
  > = {
    "basic-mean-construction": [
      createSumRecoveryScenario,
      createScoreTargetScenario,
    ],
    "incremental-join-leave": [
      createNewEntrantScenario,
      createAgeAverageScenario,
      createMultiStageAverageScenario,
    ],
    "replacement-shift-net": [
      createReplacementScenario,
      createCorrectionScenario,
      createInningsAverageScenario,
    ],
    "overlap-boundary-logic": [
      createOverlapAverageScenario,
    ],
    "correction-misread-data": [
      createCorrectionScenario,
    ],
    "symmetry-consecutive": [
      createConsecutiveScenario,
    ],
    "weighted-composite-avg": [
      createWeightedAverageScenario,
      createWeightedRatioScenario,
      createAverageSpeedScenario,
    ],
    "cricket-performance": [
      createInningsAverageScenario,
      createScoreTargetScenario,
    ],
    "sum-recovery": [
      createSumRecoveryScenario,
      createOverlapAverageScenario,
    ],
    "replacement-average-shift": [
      createReplacementScenario,
      createNewEntrantScenario,
      createInningsAverageScenario,
    ],
    "group-weighted-average": [
      createWeightedAverageScenario,
      createWeightedRatioScenario,
    ],
    "consecutive-middle-term": [
      createConsecutiveScenario,
    ],
    "age-average-shift": [
      createAgeAverageScenario,
    ],
    "score-target-reconstruction": [
      createScoreTargetScenario,
    ],
    "multi-stage-average-update": [
      createMultiStageAverageScenario,
    ],
    "weighted-average-confusion": [
      createWeightedAverageScenario,
      createAverageSpeedScenario,
    ],
    "overlap-average-reconstruction": [
      createOverlapAverageScenario,
    ],
    "correction-delta-adjustment": [
      createCorrectionScenario,
    ],
    "average-speed-harmonic": [
      createAverageSpeedScenario,
    ],
  };

  const fallbackScenarios = [
    createSumRecoveryScenario,
    createOverlapAverageScenario,
    createCorrectionScenario,
    createReplacementScenario,
    createNewEntrantScenario,
    createWeightedAverageScenario,
    createWeightedRatioScenario,
    createConsecutiveScenario,
    createAgeAverageScenario,
    createScoreTargetScenario,
    createInningsAverageScenario,
    createAverageSpeedScenario,
    createMultiStageAverageScenario,
  ];

  const patternSpecificScenarios:
    | AveragesScenarioFactory[]
    | null =
    pattern.id.startsWith(
      "registry-averages-corrections-overlaps-",
    )
      ? [
          createSumRecoveryScenario,
          createOverlapAverageScenario,
          createCorrectionScenario,
        ]
      : pattern.id.startsWith(
            "registry-averages-replacement-",
          )
        ? [
            createReplacementScenario,
            createNewEntrantScenario,
            createInningsAverageScenario,
            createMultiStageAverageScenario,
          ]
        : pattern.id.startsWith(
              "registry-averages-weighted-",
            )
          ? [
              createWeightedAverageScenario,
              createWeightedRatioScenario,
              createAverageSpeedScenario,
            ]
          : pattern.id.startsWith(
                "registry-averages-consecutive-",
              )
            ? [
                createConsecutiveScenario,
              ]
            : pattern.id.startsWith(
                  "registry-averages-age-score-",
                )
              ? [
                  createAgeAverageScenario,
                  createScoreTargetScenario,
                  createSumRecoveryScenario,
                ]
              : pattern.id.startsWith(
                    "registry-averages-",
                  )
                ? fallbackScenarios
                : null;

  const scenarioFactories = (() => {
    if (
      patternSpecificScenarios
    ) {
      return patternSpecificScenarios;
    }

    if (motif?.id) {
      const strictFactories =
        scenarioFactoriesByMotif[
          motif.id
        ];
      if (!strictFactories) {
        throw new Error(
          `No strict averages scenario mapping exists for motif ${motif.id}.`,
        );
      }
      return strictFactories;
    }

    return fallbackScenarios;
  })();

  const scenario = pickRandomItem(
    scenarioFactories,
  )(difficulty, motif);

  if (
    pattern.arrangementType ===
    "PunjabState"
  ) {
    scenario.subjectContext = {
      variant: "PunjabState",
      replacements: {
        family:
          "panchayat members",
        household:
          "mandi household",
        team: "kabaddi team",
      },
    };
  }

  return scenario;
}
