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

type AvgBalanceDefinition = {
  motifId: string;
  branch: string;
  text: string;
  values: Record<string, number>;
  answer: number;
  formula: string;
  steps: Array<[string, string]>;
  distractors?: AveragesScenarioDraft["distractorValues"];
};

function finalizeAverageBalanceScenario(
  definition: AvgBalanceDefinition,
): QuantProceduralScenario {
  const draft: AveragesScenarioDraft = {
    scenarioType: definition.motifId,
    topicCluster: "averages",
    values: definition.values,
    formula: definition.formula,
    text: definition.text,
    correctAnswer: definition.answer,
    distractorHints: [
      "wrongDenominator",
      "wrongIntermediateValue",
      "arithmeticSlip",
    ],
    reasoningSteps: definition.steps.map(
      ([operation, detail]) =>
        createReasoningStep(
          operation,
          detail,
        ),
    ),
    explanation: [
      ...definition.steps.map(
        ([, detail]) => detail,
      ),
      `Final answer = $${formatOptionValue(definition.answer)}$.`,
    ].join("\n"),
    context: buildAveragesContext(
      "average balance",
      "required value",
    ),
    motifId: definition.motifId,
    scenarioLogicBranch:
      definition.branch,
    distractorValues:
      definition.distractors ?? [
        {
          value: definition.answer + 1,
          type: "arithmeticSlip",
          likelyMistake:
            "Made a close arithmetic slip.",
          reasoningTrap:
            "Nearby value trap.",
        },
        {
          value: Math.max(
            0,
            definition.answer - 1,
          ),
          type: "wrongIntermediateValue",
          likelyMistake:
            "Stopped at an intermediate sum-state.",
          reasoningTrap:
            "Intermediate balance trap.",
        },
      ],
    highPlausibilityValue:
      definition.answer + 2,
    validationTokens: [
      "average",
      "sum",
      "count",
    ],
  };

  return finalizeAveragesScenario(draft);
}

function createAverageBalanceDefinition(
  motifId: string,
): AvgBalanceDefinition {
  switch (motifId) {
    case "avg-change-inclusion":
      return {
        motifId,
        branch: "teacher-joins",
        text: `The average age of $20$ students is $15$ years. When a teacher joins, the average becomes $16$ years. Find the teacher's age.`,
        values: { n: 20, oldAvg: 15, newAvg: 16 },
        answer: 36,
        formula: "X=(n+1)A_new-nA_old",
        steps: [
          ["aggregate", `Old sum $=20\\times15=300$.`],
          ["aggregate", `New sum $=21\\times16=336$.`],
          ["infer", `Teacher's age $=336-300=36$.`],
        ],
      };
    case "avg-change-exclusion":
      return {
        motifId,
        branch: "student-leaves",
        text: `The average weight of $12$ students is $48\\text{ kg}$. One student leaves and the average of the remaining $11$ students becomes $47\\text{ kg}$. Find the weight of the student who left.`,
        values: { n: 12, oldAvg: 48, newAvg: 47 },
        answer: 59,
        formula: "leaving=nA_old-(n-1)A_new",
        steps: [
          ["aggregate", `Old sum $=12\\times48=576$.`],
          ["aggregate", `Remaining sum $=11\\times47=517$.`],
          ["infer", `Leaving student's weight $=576-517=59$.`],
        ],
      };
    case "avg-change-replacement":
      return {
        motifId,
        branch: "replacement-delta",
        text: `The average weight of $8$ players increases by $1.5\\text{ kg}$ when a player weighing $56\\text{ kg}$ is replaced. Find the weight of the new player.`,
        values: { n: 8, oldValue: 56, shift: 1.5 },
        answer: 68,
        formula: "new=old+n*shift",
        steps: [
          ["transform", `Total increase $=8\\times1.5=12\\text{ kg}$.`],
          ["infer", `New player weight $=56+12=68\\text{ kg}$.`],
        ],
      };
    case "avg-correction-misread":
      return {
        motifId,
        branch: "misread-correction",
        text: `The average of $100$ observations was calculated as $45$. Later, $64$ was found to be misread as $46$. Find the correct average.`,
        values: { n: 100, wrongAvg: 45, actual: 64, read: 46 },
        answer: 45.18,
        formula: "correctAvg=(wrongSum-read+actual)/n",
        steps: [
          ["aggregate", `Wrong sum $=100\\times45=4500$.`],
          ["transform", `Corrected sum $=4500-46+64=4518$.`],
          ["infer", `Correct average $=\\frac{4518}{100}=45.18$.`],
        ],
      };
    case "avg-change-double-inclusion":
      return {
        motifId,
        branch: "two-join",
        text: `The average of $10$ numbers is $24$. Two numbers $30$ and $36$ are included. Find the new average.`,
        values: { n: 10, avg: 24, x: 30, y: 36 },
        answer: 25.5,
        formula: "(nA+x+y)/(n+2)",
        steps: [
          ["aggregate", `Old sum $=10\\times24=240$.`],
          ["infer", `New average $=\\frac{240+30+36}{12}=25.5$.`],
        ],
      };
    case "avg-change-join-leave":
      return {
        motifId,
        branch: "join-leave-net",
        text: `A group of $15$ workers has average age $32$. One worker aged $40$ leaves and another aged $25$ joins. Find the new average age.`,
        values: { n: 15, avg: 32, leave: 40, join: 25 },
        answer: 31,
        formula: "(nA-leave+join)/n",
        steps: [
          ["aggregate", `Old sum $=15\\times32=480$.`],
          ["infer", `New average $=\\frac{480-40+25}{15}=31$.`],
        ],
      };
    case "avg-seq-consecutive":
      return {
        motifId,
        branch: "consecutive-middle",
        text: `The average of $9$ consecutive integers is $34$. Find the largest integer.`,
        values: { count: 9, avg: 34 },
        answer: 38,
        formula: "largest=middle+4",
        steps: [
          ["classify", `For $9$ consecutive integers, the average is the middle term.`],
          ["infer", `Largest $=34+4=38$.`],
        ],
      };
    case "avg-seq-shift":
      return {
        motifId,
        branch: "extend-sequence",
        text: `The average of five consecutive integers is $20$. If the next two consecutive integers are also included, by how much does the average increase?`,
        values: { oldAvg: 20 },
        answer: 1,
        formula: "newMiddle-oldMiddle",
        steps: [
          ["transform", `Five numbers centered at $20$ are $18,19,20,21,22$.`],
          ["infer", `Including $23,24$ gives seven numbers centered at $21$, so increase $=1$.`],
        ],
      };
    case "avg-seq-ap":
      return {
        motifId,
        branch: "ap-first-last",
        text: `Find the average of the arithmetic progression $7, 11, 15, \\ldots, 47$.`,
        values: { first: 7, last: 47 },
        answer: 27,
        formula: "(first+last)/2",
        steps: [
          ["transform", `Average of an AP $=\\frac{\\text{First}+\\text{Last}}{2}$.`],
          ["infer", `Average $=\\frac{7+47}{2}=27$.`],
        ],
      };
    case "avg-seq-even":
      return {
        motifId,
        branch: "even-sequence",
        text: `Find the average of the first $10$ positive even numbers.`,
        values: { n: 10 },
        answer: 11,
        formula: "(2+20)/2",
        steps: [
          ["transform", `The first and last terms are $2$ and $20$.`],
          ["infer", `Average $=\\frac{2+20}{2}=11$.`],
        ],
      };
    case "avg-seq-odd":
      return {
        motifId,
        branch: "odd-sequence",
        text: `Find the average of the first $15$ positive odd numbers.`,
        values: { n: 15 },
        answer: 15,
        formula: "middle odd",
        steps: [
          ["classify", `The first $15$ odd numbers are symmetric around the $8^{th}$ odd number.`],
          ["infer", `The $8^{th}$ odd number is $15$, so the average is $15$.`],
        ],
      };
    case "avg-seq-variable":
    case "avg-alg-variable":
      return {
        motifId,
        branch: "variable-ap",
        text: `The average of $x, x+2, x+4, x+6, x+8$ is $24$. Find $x$.`,
        values: { avg: 24 },
        answer: 20,
        formula: "x+4=24",
        steps: [
          ["transform", `The middle term, and hence the average, is $x+4$.`],
          ["infer", `$x+4=24$, so $x=20$.`],
        ],
      };
    case "avg-weight-combine":
      return {
        motifId,
        branch: "two-group-combine",
        text: `A class has $20$ boys with average marks $72$ and $30$ girls with average marks $82$. Find the combined average marks.`,
        values: { n1: 20, a1: 72, n2: 30, a2: 82 },
        answer: 78,
        formula: "(n1A1+n2A2)/(n1+n2)",
        steps: [
          ["aggregate", `Combined sum $=20\\times72+30\\times82=3900$.`],
          ["infer", `Combined average $=\\frac{3900}{50}=78$.`],
        ],
      };
    case "avg-weight-missing-n":
      return {
        motifId,
        branch: "group-ratio-from-mean",
        text: `Two groups have averages $60$ and $75$. Their combined average is $66$. Find the ratio of the sizes of the first group to the second group.`,
        values: { a1: 60, a2: 75, mean: 66 },
        answer: 3,
        formula: "n1:n2=(75-66):(66-60)",
        steps: [
          ["transform", `Deviation balance gives $n_1:n_2=(75-66):(66-60)=9:6=3:2$.`],
          ["infer", `Enter the first ratio term $3$.`],
        ],
      };
    case "avg-weight-missing-a":
      return {
        motifId,
        branch: "missing-subgroup-average",
        text: `The average marks of $50$ students is $76$. If $30$ students have average $80$, find the average of the remaining $20$ students.`,
        values: { totalN: 50, totalAvg: 76, n1: 30, a1: 80 },
        answer: 70,
        formula: "(NA-n1A1)/n2",
        steps: [
          ["aggregate", `Total sum $=50\\times76=3800$. Known group sum $=30\\times80=2400$.`],
          ["infer", `Remaining average $=\\frac{3800-2400}{20}=70$.`],
        ],
      };
    case "avg-weight-three-group":
      return {
        motifId,
        branch: "three-group-weighted",
        text: `Three batches of sizes $10$, $15$, and $25$ have average outputs $40$, $50$, and $60$. Find the combined average output.`,
        values: { answer: 53 },
        answer: 53,
        formula: "weighted three groups",
        steps: [
          ["aggregate", `Total output $=10\\times40+15\\times50+25\\times60=2650$.`],
          ["infer", `Combined average $=\\frac{2650}{50}=53$.`],
        ],
      };
    case "avg-weight-salary":
      return {
        motifId,
        branch: "salary-weighted",
        text: `$8$ managers earn average salary $₹60000$ and $24$ clerks earn average salary $₹30000$. Find the overall average salary.`,
        values: { answer: 37500 },
        answer: 37500,
        formula: "weighted salary",
        steps: [
          ["aggregate", `Total salary $=8\\times60000+24\\times30000=1200000$.`],
          ["infer", `Average $=\\frac{1200000}{32}=37500$.`],
        ],
      };
    case "avg-weight-production":
      return {
        motifId,
        branch: "days-weighted",
        text: `A machine produces average $120$ units per day for $5$ days and $150$ units per day for the next $3$ days. Find the average production per day.`,
        values: { answer: 131.25 },
        answer: 131.25,
        formula: "(5*120+3*150)/8",
        steps: [
          ["aggregate", `Total production $=5\\times120+3\\times150=1050$.`],
          ["infer", `Average $=\\frac{1050}{8}=131.25$.`],
        ],
      };
    case "avg-weight-ratio-balance":
      return {
        motifId,
        branch: "ratio-balance",
        text: `Average of one set is $40$ and another is $70$. In what ratio should their counts be mixed to get average $52$? Enter the first term of the ratio.`,
        values: { answer: 3 },
        answer: 3,
        formula: "(70-52):(52-40)",
        steps: [
          ["transform", `By deviation balance, ratio $=(70-52):(52-40)=18:12=3:2$.`],
          ["infer", `The first term is $3$.`],
        ],
      };
    case "avg-app-cricket-batting":
      return {
        motifId,
        branch: "batting-innings",
        text: `A batsman's average after $20$ innings was $45$. In the $21^{st}$ innings, he scores $87$. By how much does his average increase?`,
        values: { answer: 2 },
        answer: 2,
        formula: "(20*45+87)/21-45",
        steps: [
          ["aggregate", `New average $=\\frac{20\\times45+87}{21}=47$.`],
          ["infer", `Increase $=47-45=2$.`],
        ],
      };
    case "avg-app-cricket-bowling":
      return {
        motifId,
        branch: "bowling-average",
        text: `A bowler has conceded $440$ runs for $20$ wickets. In the next match he concedes $20$ runs and takes $2$ wickets. Find his new bowling average.`,
        values: { answer: 20.91 },
        answer: 20.91,
        formula: "runs/wickets",
        steps: [
          ["aggregate", `New runs $=440+20=460$ and new wickets $=20+2=22$.`],
          ["infer", `Bowling average $=\\frac{460}{22}=20.91$ approximately.`],
        ],
      };
    case "avg-app-age-family":
      return {
        motifId,
        branch: "family-baby",
        text: `The average age of a family of $5$ members was $24$ years three years ago. A baby is born now. Find the present average age of the family.`,
        values: { answer: 22.5 },
        answer: 22.5,
        formula: "(5*(24+3)+0)/6",
        steps: [
          ["aggregate", `Present sum of the original $5$ members $=5\\times(24+3)=135$.`],
          ["infer", `Including the baby, average $=\\frac{135}{6}=22.5$.`],
        ],
      };
    case "avg-app-temp-weekly":
      return {
        motifId,
        branch: "overlapping-temperature",
        text: `Average temperature from Monday to Wednesday is $30^\\circ$ and from Tuesday to Thursday is $32^\\circ$. If Monday's temperature is $28^\\circ$, find Thursday's temperature.`,
        values: { answer: 34 },
        answer: 34,
        formula: "T=3*32-(3*30-28)",
        steps: [
          ["aggregate", `Mon-Wed sum $=3\\times30=90$, so Tue+Wed $=90-28=62$.`],
          ["infer", `Tue-Thu sum $=96$, hence Thursday $=96-62=34$.`],
        ],
      };
    case "avg-app-score-target":
      return {
        motifId,
        branch: "target-score",
        text: `A student has an average of $68$ marks in $5$ tests. What score is required in the $6^{th}$ test to make the average $72$?`,
        values: { answer: 92 },
        answer: 92,
        formula: "6*72-5*68",
        steps: [
          ["aggregate", `Required total $=6\\times72=432$ and current total $=5\\times68=340$.`],
          ["infer", `Required score $=432-340=92$.`],
        ],
      };
    case "avg-app-expenditure":
      return {
        motifId,
        branch: "household-expenditure",
        text: `Average monthly expenditure of $4$ members is $₹5000$. When one member joins, the average becomes $₹5400$. Find the expenditure of the new member.`,
        values: { answer: 7000 },
        answer: 7000,
        formula: "5*5400-4*5000",
        steps: [
          ["aggregate", `New total $=5\\times5400=27000$ and old total $=4\\times5000=20000$.`],
          ["infer", `New member expenditure $=7000$.`],
        ],
      };
    case "avg-app-zero-score":
      return {
        motifId,
        branch: "zero-in-count",
        text: `A player scores $20, 30, 0, 40$ in four matches. Find his average score.`,
        values: { answer: 22.5 },
        answer: 22.5,
        formula: "(20+30+0+40)/4",
        steps: [
          ["filter", `The zero score is still counted as one match.`],
          ["infer", `Average $=\\frac{90}{4}=22.5$.`],
        ],
      };
    case "avg-alg-deviation":
      return {
        motifId,
        branch: "assumed-mean",
        text: `Five observations have assumed mean $50$ and deviations $-3, +2, +5, -4, +10$. Find the actual average.`,
        values: { answer: 52 },
        answer: 52,
        formula: "assumed + sum(dev)/n",
        steps: [
          ["aggregate", `Net deviation $=-3+2+5-4+10=10$.`],
          ["infer", `Average $=50+\\frac{10}{5}=52$.`],
        ],
      };
    case "avg-alg-max-min":
      return {
        motifId,
        branch: "max-largest-distinct",
        text: `The average of $10$ distinct positive integers is $50$. Find the maximum possible value of the largest integer.`,
        values: { answer: 455 },
        answer: 455,
        formula: "500-(1+...+9)",
        steps: [
          ["aggregate", `Total sum $=10\\times50=500$.`],
          ["transform", `To maximize the largest, minimize the other $9$ distinct positive integers: $1+2+\\cdots+9=45$.`],
          ["infer", `Largest possible value $=500-45=455$.`],
        ],
      };
    case "avg-alg-overlap-boundary":
    case "avg-alg-first-last-overlap":
      return {
        motifId,
        branch: "overlap-reconstruction",
        text: `Average of the first $5$ numbers is $20$, average of the last $5$ numbers is $24$, and average of all $9$ numbers is $22$. Find the middle number counted in both groups.`,
        values: { answer: 22 },
        answer: 22,
        formula: "first5+last5-total9",
        steps: [
          ["aggregate", `First $5$ sum $=100$, last $5$ sum $=120$, and total $9$ sum $=198$.`],
          ["infer", `The repeated middle number $=100+120-198=22$.`],
        ],
      };
    case "avg-alg-insufficient-data":
      return {
        motifId,
        branch: "insufficient-data-code",
        text: `Average of group A is $40$ and average of group B is $60$. The group sizes are not given. Use $0$ if the combined average cannot be uniquely determined.`,
        values: { answer: 0 },
        answer: 0,
        formula: "missing weights",
        steps: [
          ["filter", `Combined average needs group sizes: $A=\\frac{n_1A_1+n_2A_2}{n_1+n_2}$.`],
          ["infer", `Since $n_1$ and $n_2$ are missing, the answer is not unique, so code $0$.`],
        ],
      };
    case "avg-alg-fraction-result":
      return {
        motifId,
        branch: "exact-fraction-average",
        text: `Find the average of $12, 15, 23$. If it is $a\\frac{b}{c}$, find $a+b+c$.`,
        values: { answer: 21 },
        answer: 21,
        formula: "50/3",
        steps: [
          ["aggregate", `Average $=\\frac{12+15+23}{3}=\\frac{50}{3}=16\\frac{2}{3}$.`],
          ["infer", `Thus $a+b+c=16+2+3=21$.`],
        ],
      };
    case "avg-alg-deviation-missing":
      return {
        motifId,
        branch: "missing-deviation",
        text: `The average of five observations is $40$. Four deviations from $40$ are $-5, +3, +7, -2$. Find the fifth deviation.`,
        values: { answer: -3 },
        answer: -3,
        formula: "sum deviations = 0",
        steps: [
          ["aggregate", `For mean $40$, total deviation must be $0$. Known deviations sum $=3$.`],
          ["infer", `Fifth deviation $=-3$.`],
        ],
      };
    case "avg-change-months":
      return {
        motifId,
        branch: "months-conversion",
        text: `The average age of $6$ children increases by $4$ months when a child aged $5$ years is replaced. Find the age in years of the new child.`,
        values: { answer: 7 },
        answer: 7,
        formula: "5 + 6*(4/12)",
        steps: [
          ["transform", `Total age increase $=6\\times4=24$ months $=2$ years.`],
          ["infer", `New child's age $=5+2=7$ years.`],
        ],
      };
    default:
      return {
        motifId,
        branch: "fallback-balance",
        text: `The average of $8$ numbers is $25$. Find their sum.`,
        values: { answer: 200 },
        answer: 200,
        formula: "sum=average*count",
        steps: [
          ["aggregate", `$\\text{Sum}=\\text{Average}\\times\\text{Count}=25\\times8$.`],
          ["infer", `So the sum is $200$.`],
        ],
      };
  }
}

function createAverageBalanceScenario(
  motifId: string,
): QuantProceduralScenario {
  return finalizeAverageBalanceScenario(
    createAverageBalanceDefinition(
      motifId,
    ),
  );
}

export function createAveragesScenario(
  pattern: Pattern,
  difficulty: DifficultyLabel,
  motif?: QuantMotif | null,
): QuantProceduralScenario {
  if (motif?.id?.startsWith("avg-")) {
    return createAverageBalanceScenario(
      motif.id,
    );
  }

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
